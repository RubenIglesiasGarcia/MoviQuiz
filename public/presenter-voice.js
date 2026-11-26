// Original prerecorded voice. No TTS, API calls or voice cloning.
let manifestPromise=null,audio=null,active=null,frame=0,eventKey='',lastLeader=null,lastId=0,matchKey='',generation=0;
const seen=new Set();
// Text-only fallback until the original recordings are deployed; never substitutes synthetic speech.
const captions=['','¡Bienvenidos a MobiQuiz! ¡Que empiece el espectáculo!','Espero que hayáis venido preparados, porque esto no va a ser fácil.','Hoy solo puede quedar un ganador. ¡Mucha suerte!','Preparad los mandos, que empezamos.','Vamos con la siguiente ronda.','Hasta aquí el calentamiento. Ahora empieza lo bueno.','Vamos a complicar un poquito las cosas.','Atención, porque ahora cambian las reglas.','Todavía puede pasar absolutamente de todo.','Madre mía, vaya nivel tenemos hoy.','Bueno, parece que alguno ha estudiado.','¿En serio? ¿Nadie sabía eso?','¡Espectacular! Así da gusto.','No quiero señalar a nadie, pero alguno necesita volver al colegio.','Era bastante fácil, ¿eh?','Bueno, lo importante es participar. O eso dicen.','¡Menudo desastre!','Aquí hay más suerte que conocimiento.','¡Ha llegado el momento de robar puntos!','Aquí es donde se rompen las amistades.','¡Preparad esos reflejos!','Quiero precisión, no que pulséis botones como locos.','¡Coged bien los mandos, que vienen curvas!','Vamos a ver quién tiene realmente habilidad.','¡Vamos a ver cómo queda la clasificación!','Tenemos un cambio de líder.','La cosa está más igualada de lo que parece.','¡Llegamos a la gran final! Ahora sí que vale todo.','Y el ganador de hoy es...','¡Enhorabuena! Y al resto, gracias por participar y hacer bulto.'];
let retryManifestAt=0;
const node=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
export const presenterEnabled=()=>localStorage.getItem('mq.voice')!=='off';
export const presenterSpeaking=()=>!!active&&!audio?.paused;
export function preloadPresenter(){
 if(!manifestPromise&&Date.now()<retryManifestAt)return Promise.resolve(null);if(!manifestPromise)manifestPromise=fetch('/presenter.json').then(async r=>{if(!r.ok)throw Error('Voice pack unavailable');const m=await r.json();if(m.version!==1||m.audio!=='/presenter.mp3'||!Array.isArray(m.clips)||m.clips.length!==30||!Number.isFinite(m.frameMs)||m.frameMs<=0||m.clips.some(c=>!Number.isFinite(c.start)||!Number.isFinite(c.end)||c.end<=c.start||typeof c.text!=='string'||!Array.isArray(c.mouth)))throw Error('Invalid voice pack');audio=new Audio(m.audio);audio.preload='auto';audio.volume=.90;audio.load();return m;}).catch(()=>{manifestPromise=null;retryManifestAt=Date.now()+60000;return null;});
 return manifestPromise;
}
export function stopPresenter(){generation++;cancelAnimationFrame(frame);if(audio)audio.pause();active?.banner?.remove();active=null;document.documentElement.style.removeProperty('--mq-mouth');document.documentElement.dataset.mqSpeaking='0';document.documentElement.dataset.mqPresenting='0';}
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
 if(!s||!enabled||!presenterEnabled()){stopPresenter();return;}
 const match=[s.code,s.matchId].join(':');if(match!==matchKey){matchKey=match;lastLeader=null;seen.clear();eventKey='';}
 const key=[match,s.phase,s.index].join(':');
 if(key===eventKey)return;
 eventKey=key;stopPresenter();
 const candidates=selectPresenterClip(s,lastLeader);if(s.phase==='reveal'&&s.players?.[0])lastLeader=s.players[0].id;
 if(!candidates.length||seen.has(key))return;seen.add(key);
 const token=generation,m=await preloadPresenter();if(token!==generation||!presenterEnabled())return;
 const deadline=s.phase==='reveal'?s.revealUntil:Infinity,remaining=deadline-Date.now()-offset;
 const eligible=candidates.filter(id=>{const c=m?.clips.find(x=>x.id===id);return c?(c.end-c.start)*1000+250<remaining:!!captions[id]&&remaining>1300;});if(!eligible.length)return;
 const id=choice(eligible),clip=m?.clips.find(x=>x.id===id)||{text:captions[id],start:0,end:0};lastId=id;
 const target=s.phase==='reveal'?document.querySelector('.tv-results-overlay[open] .result-show-footer'):document.querySelector('#presenter-line')||document.querySelector('#app.screen');
 if(!target)return;
 const banner=node('div','voice-presenter'),portrait=node('div','voice-presenter-avatar'),fallback=node('span','voice-presenter-fallback','🎙️'),copy=node('div','voice-presenter-copy');
 portrait.append(fallback);copy.append(node('strong','','MOBI · PRESENTADOR'),node('span','',clip.text));banner.append(portrait,copy);target.prepend(banner);
 active={banner,clip};document.documentElement.dataset.mqPresenting='1';try{mountCharacter(portrait,{shirt:'champion',hat:'none',presenter:true},'idle');}catch{}
 if(!m){const duration=Math.max(700,Math.min(3200,remaining-150));setTimeout(()=>{if(token===generation)stopPresenter();},duration);return;}
 try{audio.currentTime=clip.start;await audio.play();}catch{if(token===generation){document.documentElement.dataset.mqSpeaking='0';const duration=Math.max(700,Math.min(3500,(clip.end-clip.start)*1000));setTimeout(()=>{if(token===generation)stopPresenter();},duration);}return;}
 if(token!==generation)return;document.documentElement.dataset.mqSpeaking='1';
 const tick=()=>{if(token!==generation)return;if(!banner.isConnected||audio.paused||audio.ended||audio.currentTime>=clip.end||Date.now()+offset>=deadline){stopPresenter();return;}
 const f=Math.floor(Math.max(0,audio.currentTime-clip.start)*1000/m.frameMs),v=Math.max(0,Math.min(1,(clip.mouth[f]||0)/100));
 portrait.dataset.mouth=String(v);document.documentElement.style.setProperty('--mq-mouth',String(v));frame=requestAnimationFrame(tick);};
 tick();
}
