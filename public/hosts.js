import {sonnyMoment} from './show-direction.js';
export const normalizePresenter=x=>x==='dogs'?'dogs':'sonny';
export const hostName=s=>normalizePresenter(s?.presenter)==='dogs'?'Parker y Mei':'Sonny';
const awards=[
 ['correct','Cerebro del plató','aciertos','La neurona ha venido a trabajar.'],
 ['fast','Pulsador con turbo','aciertos rápidos','El mando todavía está echando humo.'],
 ['precise','Ojo de halcón','estimaciones acertadas','Ni con una calculadora.'],
 ['stolen','Ladrón de puntos','puntos robados','Que nadie deje la cartera cerca.'],
 ['fooled','Ministerio del bulo','votos engañados','Fuente: me lo acabo de inventar.'],
 ['hits','Imán de tartas','impactos','El postre venía con efectos especiales.'],
 ['comeback','Volvió del más allá','puestos remontados','El guion no estaba preparado para esto.'],
 ['bestStreak','Modo jefe final','aciertos consecutivos','Dejad algo para los demás.'],
 ['buzzerMiss','Dedito inquieto','fallos de pulsador','El botón no era un juguete.'],
 ['wrong','Neurona de vacaciones','respuestas falladas','Lo importante es la actitud.'],
 ['arcadeWins','Rey del caos','minijuegos ganados','Que alguien revise ese mando.'],
 ['bumps','Sin respeto por el espacio personal','empujones','Aquí no se reserva sitio.']
];
export function comicAwards(players=[]){
 return awards.flatMap(([key,title,unit,joke])=>{const best=Math.max(0,...players.map(p=>Number(p.career?.[key])||0));if(!best)return [];const names=players.filter(p=>p.career?.[key]===best).map(p=>p.name);return [{key,title,unit,value:best,names,joke}];});
}
export function finaleLines(s){const p=s.players||[],winners=p.filter(x=>x.score===p[0]?.score).map(x=>x.name);return [{title:'La corona',text:winners.length?'¡Enhorabuena, '+winners.join(' y ')+'!':'¡Se acabó el concurso!'},...comicAwards(p).map(a=>({title:a.title,text:a.title+' para '+a.names.join(' y ')+'. '+a.joke}))];}
const scared=['¡Uy, qué miedo!','¡Cómo tiemblo!','Me voy a esconder detrás de Mei.','¿Hay patas de pollo para comer?','Esto me da un poquito de miedo.','¿Podemos parar para comer patas de pollo?'];
const wild=['¡Estoy super loca!','¡Quiero comer brilli brilli!','¿Me das un poco de eso para comer?','¡Estoy super loca, Parker, corre!','¡Esto es brilli brilli del bueno!','¿Eso se come? ¡Dame un poquito!'];
export function presenterMoment(s,previousLeader,awardIndex=0){
 const original=sonnyMoment(s,previousLeader);
 if(s.phase==='finished'){const a=finaleLines(s)[awardIndex];if(!a)return null;return normalizePresenter(s.presenter)==='dogs'?{speaker:awardIndex%2?'mei':'parker',mood:'celebrate',text:(awardIndex%2?wild:scared)[awardIndex%6]+' '+a.text}: {mood:'celebrate',text:a.text};}
 if(!original||normalizePresenter(s.presenter)==='sonny')return original;
 const i=Math.max(0,s.index||0),speaker=s.phase==='lobby'?'parker':s.phase==='reveal'?(i%2?'parker':'mei'):(i%2?'mei':'parker');
 const phrase=(speaker==='parker'?scared:wild)[(i+(s.phase==='reveal'?2:0))%6];
 const split=original.text.indexOf('. ');const rule=s.phase==='question'&&s.partyStage==='intro'?(split>=0?original.text.slice(split+2):original.text):s.phase==='lobby'?'¡Bienvenidos al plató!':original.text;
 const text=phrase+' '+rule;const partner=speaker==='parker'?'mei':'parker';const reply=(partner==='mei'?wild:scared)[(i+1)%6];return {speaker,mood:speaker==='parker'?'shock':'celebrate',text,section:original.section,...(s.phase==='lobby'||s.phase==='question'&&s.partyStage==='intro'&&s.introDuration>=5000?{reply:{speaker:partner,text:reply}}:{})};
}
