import {questions,validateQuestions,grade,points} from './game.js';
const extras=[
 ['Cine y TV','¿Qué animal es Simba?',['Tigre','León','Leopardo','Puma'],1],
 ['Geografía','¿En qué país está Kioto?',['China','Japón','Corea del Sur','Tailandia'],1],
 ['Videojuegos','¿Qué personaje suele rescatar a la princesa Peach?',['Link','Kirby','Mario','Sonic'],2],
 ['Ciencia','¿Qué gas necesitan las plantas para la fotosíntesis?',['Helio','Oxígeno','Dióxido de carbono','Hidrógeno'],2],
 ['Cultura general','¿Cuántos lados tiene un hexágono?',['Cinco','Seis','Siete','Ocho'],1],
 ['Deportes','¿Cuántos aros hay en el símbolo olímpico?',['Cuatro','Cinco','Seis','Siete'],1],
 ['Música','¿Qué instrumento tiene normalmente seis cuerdas?',['Trompeta','Flauta','Guitarra','Timbal'],2],
 ['Naturaleza','¿Cuál es el único mamífero capaz de vuelo sostenido?',['Ardilla voladora','Murciélago','Colugo','Lémur'],1],
 ['Gastronomía','¿Cuál es el ingrediente principal del guacamole?',['Pepino','Aguacate','Tomate','Pimiento'],1],
 ['Historia','¿En qué país se originaron los Juegos Olímpicos antiguos?',['Italia','Egipto','Grecia','Turquía'],2],
 ['Geografía','¿Qué océano es el más extenso?',['Atlántico','Índico','Ártico','Pacífico'],3],
 ['Ciencia','¿Qué órgano bombea la sangre?',['Pulmón','Corazón','Hígado','Riñón'],1],
 ['Cine y TV','¿Cómo se llama el ogro verde de DreamWorks?',['Shrek','Hulk','Fiona','Gru'],0],
 ['Videojuegos','¿De qué color es normalmente Sonic?',['Rojo','Verde','Azul','Amarillo'],2],
 ['Naturaleza','¿Qué animal tiene tres corazones?',['Delfín','Pulpo','Tiburón','Jirafa'],1],
 ['Cultura general','¿Cuántas teclas tiene un piano estándar?',['66','72','88','100'],2],
 ['Deportes','¿En qué deporte se utiliza un volante?',['Tenis','Bádminton','Pádel','Squash'],1],
 ['Gastronomía','¿De qué país es originario el sushi?',['Japón','India','Vietnam','México'],0]
].map(([category,prompt,options,correct])=>({category,prompt,options,correct,mode:'choice',difficulty:'Fácil',seconds:20}));
export function shuffle(xs,random=Math.random){const a=[...xs];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function contest(kind,custom){if(custom!==undefined)return validateQuestions(custom);if(kind!=='party')return validateQuestions(questions);const pick=shuffle(extras);const rounds=[...shuffle(questions).slice(0,4).map(q=>({...q,party:'warmup'})),...pick.slice(0,3).map(q=>({...q,party:'buzzer'})),...pick.slice(3,6).map(q=>({...q,party:'wager'})),...pick.slice(6,9).map(q=>({...q,party:'final'}))];return validateQuestions(rounds).map((q,i)=>({...q,party:rounds[i].party}));}
export const eligible=(r,p,q=r.questions[r.index])=>!!p&&!q?.excluded?.includes(p.userId);
export function validateProposal(d){const prompt=String(d.prompt||'').trim(),options=Array.isArray(d.options)?d.options.map(x=>String(x).trim()):[];if(prompt.length<12||prompt.length>180||options.length!==4||options.some(x=>x.length<1||x.length>80)||new Set(options.map(x=>x.toLowerCase())).size!==4||!Number.isInteger(d.correct)||d.correct<0||d.correct>3)throw Error('Escribe una pregunta clara, cuatro respuestas distintas y marca la correcta.');return {prompt,options,correct:d.correct,category:'Preguntas de amigos',mode:'choice',seconds:20,difficulty:'Media',party:'custom'};}
export function begin(r,now=Date.now()){const q=r.questions[r.index];r.partyStage=q.party==='wager'?'bet':q.party==='buzzer'?'buzz':'answer';r.bets={};r.buzzer=null;r.started=now;r.deadline=now+(r.partyStage==='bet'?12:r.partyStage==='buzz'?25:q.seconds)*1000;r.roundEnd=r.deadline;}
export function betLimit(p){return Math.min(500,Math.max(0,p.score));}
export function lockBets(r,now=Date.now()){r.partyStage='answer';r.started=now;r.deadline=now+r.questions[r.index].seconds*1000;r.roundEnd=r.deadline;}
export function buzz(r,u,now=Date.now()){const q=r.questions[r.index];if(q.party!=='buzzer'||r.partyStage!=='buzz'||r.buzzer||r.answers[u.id]||!eligible(r,r.players[u.id],q)||now>=r.roundEnd)throw Error('Pulsador no disponible.');r.buzzer=u.id;r.partyStage='answer';r.started=now;r.deadline=Math.min(r.roundEnd,now+7000);}
export function release(r,now=Date.now()){r.buzzer=null;r.partyStage='buzz';r.started=now;r.deadline=r.roundEnd;}
export function answer(r,u,a,now=Date.now()){const q=r.questions[r.index],p=r.players[u.id];if(!eligible(r,p,q)||r.partyStage==='bet'||(q.party==='buzzer'&&r.buzzer!==u.id))throw Error('No puedes responder en esta fase.');const ms=now-r.started,correct=grade(q,a);let value=points(q,correct,ms);if(q.party==='wager'){const bet=r.bets[u.id]||0;value=correct?value+bet:-bet;}if(q.party==='final')value*=2;r.answers[u.id]={correct,points:value,ms,timeout:false};if(q.party==='buzzer'&&!correct)release(r,now);return correct;}
