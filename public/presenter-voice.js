// Sonny's live captions and optional device-local speech. No voice cloning or remote speech API.
import {presenterMoment,hostName,finaleLines} from './hosts.js';
import {playSound} from './effects.js';
import {sonnyVoicePlan} from './sonny-speech.js';
let manifestPromise=null,audio=null,active=null,frame=0,eventKey='',lastLeader=null,lastId=0,matchKey='',generation=0,stopTimer=0,utterance=null,pendingTimer=0;
const seen=new Set();
// Text-only fallback until the original recordings are deployed; never substitutes synthetic speech.
const captions=['','¡Bienvenidos a MobiQuiz! ¡Que empiece el espectáculo!','Espero que hayáis venido preparados, porque esto no va a ser fácil.','Hoy solo puede quedar un ganador. ¡Mucha suerte!','Preparad los mandos, que empezamos.','Vamos con la siguiente ronda.','Hasta aquí el calentamiento. Ahora empieza lo bueno.','Vamos a complicar un poquito las cosas.','Atención, porque ahora cambian las reglas.','Todavía puede pasar absolutamente de todo.','Madre mía, vaya nivel tenemos hoy.','Bueno, parece que alguno ha estudiado.','¿En serio? ¿Nadie sabía eso?','¡Espectacular! Así da gusto.','No quiero señalar a nadie, pero alguno necesita volver al colegio.','Era bastante fácil, ¿eh?','Bueno, lo importante es participar. O eso dicen.','¡Menudo desastre!','Aquí hay más suerte que conocimiento.','¡Ha llegado el momento de robar puntos!','Aquí es donde se rompen las amistades.','¡Preparad esos reflejos!','Quiero precisión, no que pulséis botones como locos.','¡Coged bien los mandos, que vienen curvas!','Vamos a ver quién tiene realmente habilidad.','¡Vamos a ver cómo queda la clasificación!','Tenemos un cambio de líder.','La cosa está más igualada de lo que parece.','¡Llegamos a la gran final! Ahora sí que vale todo.','Y el ganador de hoy es...','¡Enhorabuena! Y al resto, gracias por participar y hacer bulto.'];
let retryManifestAt=0;
const node=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
export const presenterEnabled=()=>localStorage.getItem('mq.voice')!=='off';
export const presenterSpeaking=()=>!!active&&document.documentElement.dataset.mqSpeaking==='1';
export function preloadPresenter(){try{globalThis.speechSynthesis?.getVoices();}catch{}return Promise.resolve(null);}
export function stopPresenter(){generation++;cancelAnimationFrame(frame);clearTimeout(stopTimer);clearTimeout(pendingTimer);if(utterance){try{globalThis.speechSynthesis?.cancel();}catch{}utterance=null;}if(audio)audio.pause();active?.banner?.remove();active=null;document.documentElement.style.removeProperty('--mq-mouth');document.documentElement.dataset.mqSpeaking='0';document.documentElement.dataset.mqVoicePending='0';document.documentElement.dataset.mqPresenting='0';delete document.documentElement.dataset.mqSonnyMood;delete document.documentElement.dataset.mqDogSpeaker;const local=document.querySelector('.local-sonny-portrait');if(local)local.dataset.mouth='0';}
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
 const match=[s.code,s.matchId].join(':');if(match!==matchKey){stopPresenter();matchKey=match;lastLeader=null;seen.clear();eventKey='';}
 const slot=s.phase==='finished'?Math.max(0,Math.floor((Date.now()+offset-(s.finishedAt||Date.now()))/8500)):0;const key=[match,s.phase,s.index,s.partyStage==='intro'?'intro':'',slot].join(':');
 clearTimeout(pendingTimer);if(key===eventKey)return;
 const moment=presenterMoment(s,lastLeader,slot);
 // Never interrupt an already-started sentence merely because the game moved on.
 // If another announcement is due, retry only while this same phase is still current.
 if(utterance&&active&&presenterEnabled()&&enabled){clearTimeout(pendingTimer);pendingTimer=setTimeout(()=>{if(eventKey===key)return;updateRecordedPresenter(s,offset,mountCharacter,enabled);},150);return;}
 eventKey=key;stopPresenter();if(s.phase==='reveal'&&s.players?.[0])lastLeader=s.players[0].id;
 if(!moment||seen.has(key))return;seen.add(key);
 const deadline=s.phase==='reveal'?s.revealUntil:s.phase==='question'?s.deadline:s.phase==='finished'&&s.finishedAt?s.finishedAt+(slot+1)*8500:Date.now()+offset+7500;
 const remaining=deadline-Date.now()-offset;if(remaining<950)return;
 const target=s.phase==='reveal'?document.querySelector('.tv-results-overlay[open] .result-show-footer')||document.querySelector('.round-results[open] .result-show-footer'):document.querySelector('#presenter-line')||document.querySelector('#app.screen');
 if(!target)return;
 const banner=node('div','voice-presenter sonny-caption'),portrait=node('div','voice-presenter-avatar'),fallback=node('span','voice-presenter-fallback',s.presenter==='dogs'?'🐕 🐕':'🐈‍⬛'),copy=node('div','voice-presenter-copy');
 portrait.dataset.mood=moment.mood;portrait.append(fallback);copy.append(node('strong','',(moment.speaker||hostName(s)).toUpperCase()+' · EN DIRECTO'),node('span','',moment.text));banner.append(portrait,copy);
 if(target.id==='presenter-line'){banner.classList.add('sonny-inline');}target.prepend(banner);
 active={banner,moment};const root=document.documentElement;root.dataset.mqPresenting='1';root.dataset.mqSonnyMood=moment.mood;
 // The actual presenter already lives in the studio. Only use a separate portrait during results.
 if(s.phase==='reveal')try{mountCharacter(portrait,{presenter:true,hostType:s.presenter},'idle');}catch{}
 const token=generation,plan=sonnyVoicePlan(moment.text,remaining),duration=Math.max(850,remaining-120);
 const endSpeech=()=>{if(token!==generation)return;utterance=null;cancelAnimationFrame(frame);root.dataset.mqSpeaking='0';root.dataset.mqVoicePending='0';root.style.removeProperty('--mq-mouth');portrait.dataset.mouth='0';const local=document.querySelector('.local-sonny-portrait');if(local)local.dataset.mouth='0';};
 // Captions have a normal expiry. Active speech is cleaned up by its own end event.
 const clearCaption=()=>{if(token!==generation)return;if(utterance){stopTimer=setTimeout(clearCaption,250);return;}active?.banner?.remove();active=null;root.dataset.mqPresenting='0';delete root.dataset.mqSonnyMood;};
 stopTimer=setTimeout(clearCaption,duration);
 if(s.presenter==='dogs'){if(!enabled||!presenterEnabled())return;root.dataset.mqDogSpeaker=moment.speaker;const start=performance.now();const length=Math.min(remaining-150,Math.max(1700,Math.min(4400,moment.text.length*27)));let nextBark=0;const barkTick=now=>{if(token!==generation)return;const elapsed=now-start;if(elapsed>=length){endSpeech();return;}const amount=.15+.7*Math.abs(Math.sin(elapsed/72));root.style.setProperty('--mq-mouth',String(amount));portrait.dataset.mouth=String(amount);const local=document.querySelector('.local-sonny-portrait');if(local)local.dataset.mouth=String(amount);if(elapsed>=nextBark){nextBark=elapsed+(moment.speaker==='mei'?450:680);if(enabled&&presenterEnabled())playSound(moment.speaker==='mei'?'mei-bark':'parker-bark');}frame=requestAnimationFrame(barkTick);};root.dataset.mqSpeaking='1';frame=requestAnimationFrame(barkTick);return;}
 if(!enabled||!presenterEnabled()||typeof SpeechSynthesisUtterance==='undefined'||!globalThis.speechSynthesis)return;
 // Only local installed voices: a TV without one still shows the full caption.
 try{
 const voices=speechSynthesis.getVoices().filter(v=>v.localService===true&&/^es(?:-|_)/i.test(v.lang));
 const voice=voices.find(v=>/^es[-_]ES$/i.test(v.lang))||voices[0];if(!voice)return;
 const u=new SpeechSynthesisUtterance(moment.text);u.voice=voice;u.lang=voice.lang;u.rate=plan.rate;u.pitch=plan.pitch;u.volume=.92;utterance=u;root.dataset.mqVoicePending='1';
 u.onstart=()=>{if(token!==generation)return;root.dataset.mqVoicePending='0';root.dataset.mqSpeaking='1';const start=performance.now();const tick=now=>{if(token!==generation||root.dataset.mqSpeaking!=='1')return;const t=(now-start)/1000,v=.12+.72*Math.abs(Math.sin(t*13)*Math.cos(t*4.7));root.style.setProperty('--mq-mouth',String(v));portrait.dataset.mouth=String(v);const local=document.querySelector('.local-sonny-portrait');if(local)local.dataset.mouth=String(v);frame=requestAnimationFrame(tick);};frame=requestAnimationFrame(tick);};
 u.onend=endSpeech;u.onerror=endSpeech;speechSynthesis.speak(u);
 // Some installed voices never fire onend (blocked autoplay or an engine failure). Only
 // recover after a generous watchdog interval, never at the ordinary visual deadline.
 clearTimeout(stopTimer);stopTimer=setTimeout(()=>{if(token!==generation)return;if(utterance){try{speechSynthesis.cancel();}catch{}endSpeech();}clearCaption();},Math.max(duration,plan.estimatedMs+5500));
 }catch{endSpeech();}
}
