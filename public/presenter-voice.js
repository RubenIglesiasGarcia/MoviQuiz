// Sonny's live captions and optional device-local speech. No voice cloning or remote speech API.
import {sonnyMoment} from './show-direction.js';
let manifestPromise=null,audio=null,active=null,frame=0,eventKey='',lastLeader=null,lastId=0,matchKey='',generation=0,stopTimer=0,utterance=null;
const seen=new Set();
// Text-only fallback until the original recordings are deployed; never substitutes synthetic speech.
const captions=['','¡Bienvenidos a MobiQuiz! ¡Que empiece el espectáculo!','Espero que hayáis venido preparados, porque esto no va a ser fácil.','Hoy solo puede quedar un ganador. ¡Mucha suerte!','Preparad los mandos, que empezamos.','Vamos con la siguiente ronda.','Hasta aquí el calentamiento. Ahora empieza lo bueno.','Vamos a complicar un poquito las cosas.','Atención, porque ahora cambian las reglas.','Todavía puede pasar absolutamente de todo.','Madre mía, vaya nivel tenemos hoy.','Bueno, parece que alguno ha estudiado.','¿En serio? ¿Nadie sabía eso?','¡Espectacular! Así da gusto.','No quiero señalar a nadie, pero alguno necesita volver al colegio.','Era bastante fácil, ¿eh?','Bueno, lo importante es participar. O eso dicen.','¡Menudo desastre!','Aquí hay más suerte que conocimiento.','¡Ha llegado el momento de robar puntos!','Aquí es donde se rompen las amistades.','¡Preparad esos reflejos!','Quiero precisión, no que pulséis botones como locos.','¡Coged bien los mandos, que vienen curvas!','Vamos a ver quién tiene realmente habilidad.','¡Vamos a ver cómo queda la clasificación!','Tenemos un cambio de líder.','La cosa está más igualada de lo que parece.','¡Llegamos a la gran final! Ahora sí que vale todo.','Y el ganador de hoy es...','¡Enhorabuena! Y al resto, gracias por participar y hacer bulto.'];
let retryManifestAt=0;
const node=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
export const presenterEnabled=()=>localStorage.getItem('mq.voice')!=='off';
export const presenterSpeaking=()=>!!active&&document.documentElement.dataset.mqSpeaking==='1';
export function preloadPresenter(){try{globalThis.speechSynthesis?.getVoices();}catch{}return Promise.resolve(null);}
export function stopPresenter(){generation++;cancelAnimationFrame(frame);clearTimeout(stopTimer);if(utterance){try{globalThis.speechSynthesis?.cancel();}catch{}utterance=null;}if(audio)audio.pause();active?.banner?.remove();active=null;document.documentElement.style.removeProperty('--mq-mouth');document.documentElement.dataset.mqSpeaking='0';document.documentElement.dataset.mqPresenting='0';delete document.documentElement.dataset.mqSonnyMood;const local=document.querySelector('.local-sonny-portrait');if(local)local.dataset.mouth='0';}
export function setPresenterEnabled(value){localStorage.setItem('mq.voice',value?'on':'off');if(!value)stopPresenter();else preloadPresenter();}
const choice=ids=>{const available=ids.filter(id=>id!==lastId);return (available.length?available:ids)[Math.floor(Math.random()*(available.length||ids.length))];};
export function selectPresenterClip(s,previousLeader){
 if(s.phase==='lobby')return [1,2,3,4];
 if(s.phase==='finished')return [30];
 if(s.phase!=='reveal')return [];
 const q=s.question,players=s.players||[],correct=players.filter(p=>p.reaction==='correct').length;
 const next=s.playlist?.[s.index+1],leader=players[0],remaining=s.total-s.index-1;
 if(remaining===0)return [29];
 if(remaining===1||next==='final'&&q?.party!=='final')return [28];
 if(next==='steal'&&q?.party!=='steal')return [19,20];
 if(next==='buzzer'&&q?.party!=='buzzer')return [21];
 if(previousLeader&&leader&&leader.id!==previousLeader)return [26];
 if(players.some(p=>(p.previousRank??0)-(players.indexOf(p))>=2))return [9,27];
 if(players.some(p=>(p.stolen||0)>0))return [19,20];
 if(players.some(p=>(p.career?.streak||0)>=4))return [11,13];
 if(s.kind==='arcade')return s.index%2===0?[23,24,22]:[];
 if(players.length>1&&correct===0)return [10,12,14,17];
 if(players.length>1&&correct===players.length)return [11,13];
 if(leader&&players[1]&&Math.abs(leader.score-players[1].score)<=150&&s.index%3===1)return [27];
 if(s.index%3===2)return [5,6,7,8,9,25];
 return [];
}
export async function updateRecordedPresenter(s,offset,mountCharacter,enabled=true){
 if(!s)return;
 const match=[s.code,s.matchId].join(':');if(match!==matchKey){matchKey=match;lastLeader=null;seen.clear();eventKey='';}
 const key=[match,s.phase,s.index,s.partyStage==='intro'?'intro':''].join(':');
 if(key===eventKey)return;
 eventKey=key;stopPresenter();
 const moment=sonnyMoment(s,lastLeader);if(s.phase==='reveal'&&s.players?.[0])lastLeader=s.players[0].id;
 if(!moment||seen.has(key))return;seen.add(key);
 const deadline=s.phase==='reveal'?s.revealUntil:s.phase==='question'?s.deadline:Date.now()+offset+7500;
 const remaining=deadline-Date.now()-offset;if(remaining<950)return;
 const target=s.phase==='reveal'?document.querySelector('.tv-results-overlay[open] .result-show-footer')||document.querySelector('.round-results[open] .result-show-footer'):document.querySelector('#presenter-line')||document.querySelector('#app.screen');
 if(!target)return;
 const banner=node('div','voice-presenter sonny-caption'),portrait=node('div','voice-presenter-avatar'),fallback=node('span','voice-presenter-fallback','🐈‍⬛'),copy=node('div','voice-presenter-copy');
 portrait.dataset.mood=moment.mood;portrait.append(fallback);copy.append(node('strong','','SONNY · EN DIRECTO'),node('span','',moment.text));banner.append(portrait,copy);
 if(target.id==='presenter-line'){banner.classList.add('sonny-inline');}target.prepend(banner);
 active={banner,moment};const root=document.documentElement;root.dataset.mqPresenting='1';root.dataset.mqSonnyMood=moment.mood;
 // The actual presenter already lives in the studio. Only use a separate portrait during results.
 if(s.phase==='reveal')try{mountCharacter(portrait,{presenter:true},'idle');}catch{}
 const token=generation,duration=Math.min(remaining-120,s.phase==='reveal'?8000:7200);
 const endSpeech=()=>{if(token!==generation)return;root.dataset.mqSpeaking='0';root.style.removeProperty('--mq-mouth');portrait.dataset.mouth='0';const local=document.querySelector('.local-sonny-portrait');if(local)local.dataset.mouth='0';};
 stopTimer=setTimeout(()=>{if(token===generation)stopPresenter();},duration);
 if(!enabled||!presenterEnabled()||typeof SpeechSynthesisUtterance==='undefined'||!globalThis.speechSynthesis)return;
 // Only local installed voices: a TV without one still shows the full caption.
 try{
 const voices=speechSynthesis.getVoices().filter(v=>v.localService===true&&/^es(?:-|_)/i.test(v.lang));
 const voice=voices.find(v=>/^es[-_]ES$/i.test(v.lang))||voices[0];if(!voice)return;
 const u=new SpeechSynthesisUtterance(moment.text);u.voice=voice;u.lang=voice.lang;u.rate=1.12;u.pitch=1.03;u.volume=.88;utterance=u;
 u.onstart=()=>{if(token!==generation)return;root.dataset.mqSpeaking='1';const start=performance.now();const tick=now=>{if(token!==generation||root.dataset.mqSpeaking!=='1')return;const t=(now-start)/1000,v=.12+.72*Math.abs(Math.sin(t*13)*Math.cos(t*4.7));root.style.setProperty('--mq-mouth',String(v));portrait.dataset.mouth=String(v);const local=document.querySelector('.local-sonny-portrait');if(local)local.dataset.mouth=String(v);frame=requestAnimationFrame(tick);};frame=requestAnimationFrame(tick);};
 u.onend=endSpeech;u.onerror=endSpeech;speechSynthesis.speak(u);
 }catch{endSpeech();}
}
