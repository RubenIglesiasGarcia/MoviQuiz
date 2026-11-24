import {questions,validateQuestions,grade,points} from './game.js';
import {bank} from './question-bank.js';
import {difficultyIds,normalizeLevel} from './public/difficulty.js';
import {arcadeRounds,startArcade,arcadeAnswer} from './arcade.js';
import {beginDrawing} from './drawing.js';
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
export function normalizeKind(k){return ['classic','party','arcade'].includes(k)?k:'classic';}
export function normalizeDifficulty(d){return normalizeLevel(d);}
export const INTRO_MS=3000;
export function beginPresentation(r,now=Date.now()){if(r.kind==='arcade'){begin(r,now);return;}r.partyStage='intro';r.started=0;r.deadline=now+INTRO_MS;r.roundEnd=r.deadline;r.buzzer=null;r.action=null;r.drawer=null;r.strokes=[];r.hotHolder=null;r.bets={};r.bluffs={};r.votes={};r.pies={};r.bluffOptions=[];}
export function advancePresentation(r,now=Date.now()){if(r.phase!=='question'||r.partyStage!=='intro'||now<r.deadline)return false;begin(r,now);return true;}
const categoryKey=q=>String(q.category||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/^deportes$/,'deporte').replace(/^cine y tv$/,'cine').replace(/^cultura general$/,'cultura');
function readable(q){const length=q.prompt.length+(q.options||[]).reduce((n,x)=>n+String(x).length,0);return {...q,seconds:q.seconds+Math.min(8,Math.max(0,Math.ceil((length-110)/40)))};}
function mixOptions(q){if(!['choice','fast'].includes(q.mode))return q;const indices=shuffle(q.options.map((_,i)=>i));return {...q,options:indices.map(i=>q.options[i]),correct:indices.indexOf(q.correct)};}
export function contest(kind,custom,difficulty='Mixta',exclude=[]){if(custom!==undefined)return validateQuestions(custom);if(kind==='arcade')return arcadeRounds();difficulty=normalizeLevel(difficulty);const pool=[...questions,...extras,...bank].filter(q=>difficulty==='Mixta'||q.difficulty===difficulty),fresh=pool.filter(q=>!exclude.includes(q.prompt)),old=pool.filter(q=>exclude.includes(q.prompt)),balanced=xs=>{if(difficulty!=='Mixta')return shuffle(xs);const buckets=shuffle(difficultyIds).map(d=>shuffle(xs.filter(q=>q.difficulty===d))),out=[];while(buckets.some(b=>b.length))for(const b of buckets)if(b.length)out.push(b.shift());return out;},all=[...balanced(fresh),...balanced(old)],choice=all.filter(q=>q.mode==='choice'),used=new Set();let lastPicked=null;const take=(list,n,party)=>{const picked=[];const available=list.filter(q=>!used.has(q.prompt));while(picked.length<n&&available.length){const first=available[0],recent=exclude.includes(first.prompt),candidates=available.slice(0,5).map((q,i)=>({q,i})).filter(x=>exclude.includes(x.q.prompt)===recent&&(difficulty!=='Mixta'||x.q.difficulty===first.difficulty));const previous=picked.at(-1)||lastPicked;const chosen=candidates.find(x=>categoryKey(x.q)!==categoryKey(previous||{}))||candidates[0];const q=available.splice(chosen.i,1)[0];if(used.has(q.prompt))continue;used.add(q.prompt);picked.push(q);lastPicked=q;}return picked.map(q=>({...mixOptions(readable(q)),party}));};if(kind!=='party'){const raw=take(all,12,'classic');return validateQuestions(raw).map((q,i)=>({...q,party:raw[i].party}));}const rounds=[...take(all,4,'warmup'),...take(choice,3,'buzzer'),...take(choice,3,'wager'),...take(choice,2,'hot'),...take(choice,2,'pie'),...take(choice,2,'final')];const result=validateQuestions(rounds).map((q,i)=>({...q,party:rounds[i].party}));result.splice(7,0,...shuffle(bluffQuestions).slice(0,2).map((q,i)=>({...q,id:'bluff-'+i,party:'bluff',mode:'text',seconds:25,difficulty:'Media'})));return result;}
export const eligible=(r,p,q=r.questions[r.index])=>!!p&&!q?.excluded?.includes(p.userId);
export function validateProposal(d){const prompt=String(d.prompt||'').trim(),options=Array.isArray(d.options)?d.options.map(x=>String(x).trim()):[];if(prompt.length<12||prompt.length>180||options.length!==4||options.some(x=>x.length<1||x.length>80)||new Set(options.map(x=>x.toLowerCase())).size!==4||!Number.isInteger(d.correct)||d.correct<0||d.correct>3)throw Error('Escribe una pregunta clara, cuatro respuestas distintas y marca la correcta.');return {prompt,options,correct:d.correct,category:'Preguntas de amigos',mode:'choice',seconds:20,difficulty:'Media',party:'custom'};}
export function begin(r,now=Date.now()){const q=r.questions[r.index];r.partyStage=q.party==='wager'?'bet':q.party==='buzzer'?'buzz':'answer';r.bets={};r.buzzer=null;r.started=now;r.deadline=now+(r.partyStage==='bet'?12:r.partyStage==='buzz'?25:q.seconds)*1000;r.roundEnd=r.deadline;r.hotHolder=null;r.hotTarget=null;r.pies={};r.bluffOptions=[];r.bluffs={};r.votes={};if(q.party==='bluff')startBluff(r,now);if(q.party==='hot')startHot(r,now);startArcade(r,q,now);if(q.party==='draw'){r.drawGuesses={};beginDrawing(r,now);}}
export function betLimit(p){return Math.min(500,Math.max(0,p.score));}
export function lockBets(r,now=Date.now()){r.partyStage='answer';r.started=now;r.deadline=now+r.questions[r.index].seconds*1000;r.roundEnd=r.deadline;}
export function buzz(r,u,now=Date.now()){const q=r.questions[r.index];if(q.party!=='buzzer'||r.partyStage!=='buzz'||r.buzzer||r.answers[u.id]||!eligible(r,r.players[u.id],q)||now>=r.roundEnd)throw Error('Pulsador no disponible.');r.buzzer=u.id;r.partyStage='answer';r.started=now;r.deadline=Math.min(r.roundEnd,now+7000);}
export function release(r,now=Date.now()){r.buzzer=null;r.partyStage='buzz';r.started=now;r.deadline=r.roundEnd;}
export function answer(r,u,a,now=Date.now()){if(r.partyStage==='arcade-action')throw Error('Usa los controles de la prueba.');const q=r.questions[r.index],p=r.players[u.id];if(!eligible(r,p,q)||r.partyStage==='bet'||(q.party==='buzzer'&&r.buzzer!==u.id))throw Error('No puedes responder en esta fase.');const special=arcadeAnswer(r,u,a,now);if(special!==null)return special;const ms=now-r.started,correct=grade(q,a);let value=points(q,correct,ms);if(q.party==='wager'){const bet=r.bets[u.id]||0;value=correct?value+bet:-bet;}if(q.party==='final')value*=2;r.answers[u.id]={correct,points:value,ms,timeout:false};if(q.party==='buzzer'&&!correct)release(r,now);return correct;}

const bluffQuestions=[
 {category:'Curiosidades',prompt:'¿Qué animal aparece en la bandera de Gales?',correct:'Dragón',fallback:['León','Águila','Caballo']},
 {category:'Curiosidades',prompt:'¿Qué fruta se conoce también como carambola?',correct:'Fruta estrella',fallback:['Fruta dragón','Fruta del pan','Maracuyá']},
 {category:'Curiosidades',prompt:'¿Qué animal es el mayor roedor del mundo?',correct:'Capibara',fallback:['Castor','Puercoespín','Marmota']},
 {category:'Historia',prompt:'¿En qué ciudad se emitieron los primeros billetes de banco europeos en 1661?',correct:'Estocolmo',fallback:['Londres','Venecia','Ámsterdam']},
 {category:'Ciencia',prompt:'¿Qué planeta del sistema solar tiene el día más corto?',correct:'Júpiter',fallback:['Mercurio','Marte','Saturno']}
];
const norm=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
export function startBluff(r,now=Date.now()){r.partyStage='bluff-write';r.bluffs={};r.votes={};r.bluffOptions=[];r.started=now;r.deadline=now+25000;}
export function submitBluff(r,id,value){if(r.partyStage!=='bluff-write'||!eligible(r,r.players[id])||Object.hasOwn(r.bluffs,id))throw Error('No puedes enviar otra respuesta.');const text=String(value||'').trim();if(text.length<2||text.length>80||!norm(text)||norm(text)===norm(r.questions[r.index].correct)||Object.values(r.bluffs).some(x=>norm(x)===norm(text)))throw Error('Inventa una respuesta distinta y creíble (2–80 caracteres).');r.bluffs[id]=text;}
export function startVote(r,now=Date.now()){const q=r.questions[r.index];const options=[{text:q.correct,owner:null,truth:true},...Object.entries(r.bluffs).map(([owner,text])=>({owner,text,truth:false}))];for(const text of q.fallback||[])if(options.length<4&&!options.some(x=>norm(x.text)===norm(text)))options.push({text,owner:null,truth:false});r.bluffOptions=shuffle(options).map((x,i)=>({...x,id:String(i)}));r.partyStage='bluff-vote';r.started=now;r.deadline=now+20000;}
export function voteBluff(r,id,choice){if(r.partyStage!=='bluff-vote'||!eligible(r,r.players[id])||Object.hasOwn(r.votes,id))throw Error('Votación cerrada.');const option=r.bluffOptions.find(x=>x.id===choice);if(!option||option.owner===id)throw Error('No puedes votar por tu propia respuesta.');r.votes[id]=choice;}
export function finishBluff(r){for(const p of Object.values(r.players)){const id=p.userId,selected=r.bluffOptions.find(x=>x.id===r.votes[id]),correct=!!selected?.truth,fooled=Object.entries(r.votes).filter(([v,c])=>v!==id&&r.bluffOptions.some(x=>x.id===c&&x.owner===id)).length;r.answers[id]={correct,points:(correct?650:0)+fooled*250,ms:null,timeout:!selected,fooled};}}
export function startHot(r,now=Date.now()){const ids=Object.keys(r.players);r.hotHolder=ids.includes(r.nextHot)?r.nextHot:ids[Math.floor(Math.random()*ids.length)];r.partyStage='hot-answer';r.started=now;r.deadline=now+9000;}
export function hotAnswer(r,id,value,now=Date.now()){if(r.partyStage!=='hot-answer'||r.hotHolder!==id||r.answers[id])throw Error('No tienes la patata.');const q=r.questions[r.index],correct=grade(q,value);r.answers[id]={correct,points:correct?700:-Math.min(250,r.players[id].score),ms:now-r.started,timeout:false};if(correct&&Object.keys(r.players).length>1){r.partyStage='hot-pass';r.deadline=now+6000;}return correct;}
export function hotPass(r,id,target){if(r.partyStage!=='hot-pass'||r.hotHolder!==id||id===target||!r.players[target])throw Error('Elige otro concursante.');r.nextHot=target;r.hotTarget=target;}
export function startPie(r,now=Date.now()){r.partyStage='pie-target';r.pies={};r.deadline=now+8000;}
export function throwPie(r,id,target){if(r.partyStage!=='pie-target'||!r.answers[id]?.correct||Object.hasOwn(r.pies,id)||id===target||!r.players[target])throw Error('No puedes lanzar esa tarta.');r.pies[id]=target;}
export function finishPie(r){const hits={};for(const target of Object.values(r.pies||{}))hits[target]=(hits[target]||0)+1;for(const [id,n] of Object.entries(hits)){const a=r.answers[id]||{correct:false,points:0,ms:null,timeout:true};a.hits=n;a.points-=Math.min(200,n*75,Math.max(0,r.players[id].score+a.points));r.answers[id]=a;}}
