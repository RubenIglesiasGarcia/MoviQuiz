import {validClip} from './public/media-challenge.js';
import {illustrate,validArtwork} from './question-art.js';
import {difficultyIds} from './public/difficulty.js';
export const questions=[
 {id:'q1',category:'Cultura general',mode:'choice',prompt:'¿Cuál es el planeta más grande del sistema solar?',options:['Marte','Júpiter','Saturno','Neptuno'],correct:1,seconds:20,difficulty:'Fácil',explanation:'Júpiter es el planeta de mayor tamaño.'},
 {id:'q2',category:'Geografía',mode:'choice',prompt:'¿Qué país representa esta bandera?',options:['Italia','México','Irlanda','Francia'],correct:2,seconds:20,difficulty:'Fácil',media:{type:'image',url:'/flag.svg'},explanation:'La bandera irlandesa tiene tres franjas: verde, blanca y naranja.'},
 {id:'q3',category:'Ciencia',mode:'boolean',prompt:'El sonido viaja más rápido en el agua que en el aire.',correct:true,seconds:15,difficulty:'Media'},
 {id:'q4',category:'Música y sonido',mode:'fast',prompt:'Escucha los dos tonos. ¿Cuál es más agudo?',options:['El primero','El segundo','Son iguales','No hay sonido'],correct:1,seconds:20,difficulty:'Media',media:{type:'audio',url:'/api/sample-audio'}},
 {id:'q5',category:'Naturaleza',mode:'choice',prompt:'¿Qué elemento natural protagoniza este vídeo?',options:['Una cascada','Una flor','Una montaña','Un árbol'],correct:1,seconds:25,difficulty:'Fácil',media:{type:'video',url:'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'}},
 {id:'q6',category:'Deportes',mode:'number',prompt:'¿Cuántos jugadores de un equipo de voleibol de pista están en el campo?',correct:6,tolerance:0,seconds:20,difficulty:'Fácil'},
 {id:'q7',category:'Historia',mode:'order',prompt:'Ordena estos acontecimientos del más antiguo al más reciente.',options:['Llegada a la Luna','Caída del Muro de Berlín','Inicio de la Segunda Guerra Mundial','Invención de la imprenta de Gutenberg'],correct:[3,2,0,1],seconds:35,difficulty:'Difícil'},
 {id:'q8',category:'Cine y TV',mode:'text',prompt:'¿Cómo se llama el vaquero protagonista de Toy Story?',correct:'Woody',seconds:20,difficulty:'Fácil'}
].map(illustrate);
export function validateQuestions(raw){
 if(!Array.isArray(raw)||!raw.length||raw.length>100)throw Error('Añade entre 1 y 100 preguntas.');
 return raw.map((q,i)=>{
  if(!q||!['choice','fast','boolean','number','order','text'].includes(q.mode))throw Error('Tipo de prueba inválido en pregunta '+(i+1));
  const prompt=String(q.prompt||'').trim().slice(0,600),category=String(q.category||'General').slice(0,60);
  if(!prompt)throw Error('Falta el enunciado de la pregunta '+(i+1));
  const options=Array.isArray(q.options)?q.options.map(x=>String(x).slice(0,160)):undefined;
  if(['choice','fast','order'].includes(q.mode)&&(!options||options.length<2||options.length>6||options.some(x=>!x.trim())||new Set(options.map(x=>x.trim().toLowerCase())).size!==options.length))throw Error('Usa entre 2 y 6 opciones distintas.');
  const c=q.correct;
  if(['choice','fast'].includes(q.mode)&&(!Number.isInteger(c)||c<0||c>=options.length))throw Error('Índice de respuesta incorrecto.');
  if(q.mode==='boolean'&&typeof c!=='boolean')throw Error('La respuesta debe ser true o false.');
  if(q.mode==='number'&&(!Number.isFinite(c)||!Number.isFinite(q.tolerance??0)||(q.tolerance??0)<0))throw Error('Número o tolerancia inválidos.');
  if(q.mode==='text'&&(typeof c!=='string'||!c.trim()))throw Error('Falta la respuesta de texto.');
  if(q.mode==='order'&&(!Array.isArray(c)||c.length!==options.length||new Set(c).size!==c.length||c.some(n=>!Number.isInteger(n)||n<0||n>=options.length)))throw Error('Orden correcto inválido.');
  let media;
  if(q.media){const url=String(q.media.url||'');if(!['image','audio','video','animation'].includes(q.media.type)||!(/^(https:\/\/|\/(?!\/))/.test(url))||(q.media.type==='animation'&&!validClip(url)))throw Error('Usa un medio HTTPS o local.');media={type:q.media.type,url,...(q.media.type==='image'&&q.media.effect==='pixel'?{effect:'pixel'}:{})};}
  return {id:String(i+1),prompt,category,mode:q.mode,options,correct:c,tolerance:q.tolerance??0,media,...(!media&&validArtwork(q.illustration)?{illustration:q.illustration}:{}),seconds:Math.min(120,Math.max(5,Math.round(Number(q.seconds)||20))),difficulty:difficultyIds.includes(q.difficulty)?q.difficulty:'Media',explanation:String(q.explanation||'').slice(0,500)};
 });
}
const norm=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase().replace(/\s+/g,' ');
export function grade(q,a){
 switch(q.mode){
  case 'number':return String(a).trim()!==''&&Number.isFinite(Number(a))&&Math.abs(Number(a)-q.correct)<=q.tolerance;
  case 'text':return typeof a==='string'&&norm(a)===norm(q.correct);
  case 'order':return Array.isArray(a)&&a.length===q.correct.length&&a.every((x,i)=>x===q.correct[i]);
  case 'boolean':return a===(q.correct?'true':'false');
  default:return Number.isInteger(a)&&a===q.correct;
 }
}
export function points(q,correct,ms){if(!correct)return 0;const remaining=Math.max(0,Math.min(1,1-ms/(q.seconds*1000)));if(q.party==='order-round'||q.party==='buzzer')return Math.round(800+400*remaining);if(q.scoreProfile==='knowledge'&&q.mode!=='fast')return Math.round(800+200*remaining);return Math.round((q.mode==='fast'?300:600)+(q.mode==='fast'?900:400)*remaining);}
function metric(rows){const valid=rows.filter(x=>x.ms!==null);const correct=rows.filter(x=>x.correct).length;return {total:rows.length,correct,accuracy:rows.length?Math.round(correct/rows.length*100):0,avgMs:valid.length?Math.round(valid.reduce((s,x)=>s+x.ms,0)/valid.length):null,points:rows.reduce((s,x)=>s+x.points,0),timeouts:rows.filter(x=>x.timeout).length};}
function groups(rows,key){const map=new Map();for(const r of rows){const k=r[key];if(!map.has(k))map.set(k,[]);map.get(k).push(r);}return [...map].map(([name,rs])=>({name,...metric(rs)})).sort((a,b)=>b.total-a.total);}
export function summarize(rows,matches){
 const dates=groups(rows.map(r=>({...r,day:r.at.slice(0,10)})),'day').sort((a,b)=>a.name.localeCompare(b.name));
 return {...metric(rows),matches:matches.length,wins:matches.filter(m=>m.win).length,bestScore:Math.max(0,...matches.map(m=>m.score)),byCategory:groups(rows,'category'),byMode:groups(rows,'mode'),byMedia:groups(rows,'media'),byDifficulty:groups(rows,'difficulty'),trend:dates.slice(-30),recent:matches.slice(-12).reverse().map(({at,score,win,solo})=>({at,score,win,solo}))};
}
