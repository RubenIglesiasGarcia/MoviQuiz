import {buzzerPenalty} from './public/buzzer-rules.js';
import {illustrate} from './question-art.js';
import {questions,validateQuestions,grade,points} from './game.js';
import {bank,orderBank,estimateBank} from './question-bank.js';
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
].map(([category,prompt,options,correct])=>({category,prompt,options,correct,mode:'choice',difficulty:'Fácil',seconds:20})).map(illustrate);
export function shuffle(xs,random=Math.random){const a=[...xs];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function normalizeKind(k){return ['classic','party','arcade'].includes(k)?k:'classic';}
export function normalizeDifficulty(d){return normalizeLevel(d);}
export function spreadCategories(items){const buckets=new Map();for(const q of items){const key=q.category.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/s$/,'');if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(q);}const out=[];let last=null;while(buckets.size){const ranked=[...buckets].sort((a,b)=>b[1].length-a[1].length),[key,group]=ranked.find(([key])=>key!==last)||ranked[0];out.push(group.shift());last=key;if(!group.length)buckets.delete(key);}return out;}
function readable(q){const length=q.prompt.length+(q.options||[]).reduce((n,x)=>n+String(x).length,0);return {...q,seconds:q.seconds+Math.min(8,Math.max(0,Math.ceil((length-110)/40)))};}
function mixOptions(q){if(!['choice','fast','order'].includes(q.mode))return q;let indices=shuffle(q.options.map((_,i)=>i));if(q.mode==='order'&&q.correct.every((x,i)=>indices[i]===x))indices=[...indices.slice(1),indices[0]];return {...q,options:indices.map(i=>q.options[i]),correct:q.mode==='order'?q.correct.map(i=>indices.indexOf(i)):indices.indexOf(q.correct)};}
function selectionCategory(c){return String(c||'General').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/^deportes?$/,'deporte').replace(/^cine( y tv)?$/,'cine').replace(/^cultura( general)?$/,'cultura').replace(/^musica( y sonido)?$/,'musica');}
const isMystery=q=>q.media?.effect==='pixel'||q.media?.type==='animation'||q.media?.type==='video';
export function contest(kind,custom,difficulty='Mixta',exclude=[]){if(custom!==undefined)return validateQuestions(custom);if(kind==='arcade')return arcadeRounds();difficulty=normalizeLevel(difficulty);
 const excluded=new Set(exclude),pool=shuffle([...questions,...extras,...bank].filter(q=>difficulty==='Mixta'||q.difficulty===difficulty)),choice=pool.filter(q=>q.mode==='choice'&&!isMystery(q)),used=new Set(),catCount=new Map(),levelCount=new Map();let previous='';
 const take=(list,n,party)=>{const picked=[];while(picked.length<n){let candidates=list.filter(q=>!used.has(q.prompt));if(!candidates.length)break;const fresh=candidates.filter(q=>!excluded.has(q.prompt));if(fresh.length)candidates=fresh;const score=q=>{const key=selectionCategory(q.category);return (difficulty==='Mixta'?(levelCount.get(q.difficulty)||0)*5:0)+(catCount.get(key)||0)*2+(key===previous?4:0)+(/^(modern|visual|partyfresh)-/.test(String(q.id||''))?-2:0);};candidates.sort((a,b)=>score(a)-score(b));const q=candidates[0],key=selectionCategory(q.category);used.add(q.prompt);catCount.set(key,(catCount.get(key)||0)+1);levelCount.set(q.difficulty,(levelCount.get(q.difficulty)||0)+1);previous=key;picked.push({...mixOptions(readable(q)),party});}return picked;};
 if(kind!=='party'){const raw=take(pool.filter(q=>!isMystery(q)),12,'classic');return validateQuestions(raw).map((q,i)=>({...q,party:raw[i].party}));}
 const bonusWarmup=qs=>qs.map((q,i)=>i===1?{...q,multiplier:2}:q);const levelPool=xs=>shuffle(xs.filter(q=>difficulty==='Mixta'||q.difficulty===difficulty));const special=shuffle(['wager','bluff','hot','pie']).slice(0,2);const raw=[...bonusWarmup(take(choice,3,'warmup')),...take(levelPool(orderBank),3,'order-round'),...take(levelPool(estimateBank),3,'estimate'),...take(pool.filter(q=>q.mode==='choice'&&q.media?.effect==='pixel'),1,'buzzer'),...take(pool.filter(q=>q.mode==='choice'&&['video','animation'].includes(q.media?.type)),1,'buzzer'),...take(choice,1,'buzzer'),...special.flatMap(kind=>take(kind==='bluff'?choice.filter(q=>!q.media):choice,1,kind)),...take(choice,2,'steal'),...take(choice,2,'final').map((q,i)=>({...q,multiplier:i===0?2:3}))];return raw.map((q,i)=>{if(q.party==='bluff')return {id:String(i+1),party:'bluff',mode:'text',category:q.category,prompt:q.prompt,correct:q.options[q.correct],fallback:q.options.filter((_,j)=>j!==q.correct),difficulty:q.difficulty,illustration:q.illustration,seconds:25};return {...validateQuestions([q])[0],id:String(i+1),party:q.party,estimateScale:q.estimateScale,multiplier:q.multiplier};});}

export const eligible=(r,p,q=r.questions[r.index])=>!!p&&!q?.excluded?.includes(p.userId);
export function validateProposal(d){const prompt=String(d.prompt||'').trim(),options=Array.isArray(d.options)?d.options.map(x=>String(x).trim()):[];if(prompt.length<12||prompt.length>180||options.length!==4||options.some(x=>x.length<1||x.length>80)||new Set(options.map(x=>x.toLowerCase())).size!==4||!Number.isInteger(d.correct)||d.correct<0||d.correct>3)throw Error('Escribe una pregunta clara, cuatro respuestas distintas y marca la correcta.');return {prompt,options,correct:d.correct,category:'Preguntas de amigos',mode:'choice',seconds:20,difficulty:'Media',party:'custom'};}

 // Surprise events are assigned on the server at round start; no client may choose the reward.
export function chooseShowEvent(r){
 const q=r.questions[r.index],players=Object.values(r.players||{}).filter(p=>eligible(r,p,q)).sort((a,b)=>b.score-a.score||String(a.userId).localeCompare(String(b.userId)));
 if(r.kind!=='party'||players.length<2||!q)return null;
 const previous=r.questions.slice(0,r.index);
 const min=players.at(-1).score,max=players[0].score;
 if(q.party==='steal'&&previous.filter(x=>x.party==='steal').length===1&&min<max){
  const ranked=players.filter(p=>p.score>0);if(!ranked.length)return null;let seed=0;for(const ch of String(r.matchId||''))seed=(Math.imul(seed,31)+ch.charCodeAt(0))>>>0;return {kind:'shield',ids:[ranked[seed%ranked.length].userId]};
 }
 if(q.party!=='warmup'||previous.filter(x=>x.party==='warmup').length!==2||q.multiplier===2||min===max)return null;
 const bottom=players.filter(p=>p.score===min);
 const pairs=players.slice(0,-1).map((p,i)=>({gap:p.score-players[i+1].score,ids:[p.userId,players[i+1].userId]})).sort((a,b)=>a.gap-b.gap);
 const uniquePair=pairs.length===1||pairs[0].gap<pairs[1].gap;
 let hash=0;for(const char of String(r.matchId||''))hash=(Math.imul(hash,31)+char.charCodeAt(0))>>>0;
 return hash%2===0&&uniquePair?{kind:'duel',ids:pairs[0].ids}:{kind:'comeback',ids:bottom.map(p=>p.userId)};
}
export function applyShowEvent(r,q){
 const event=r.showEvent;if(!event||event.kind==='shield')return;
 const candidates=event.ids.filter(id=>eligible(r,r.players[id],q)&&r.answers[id]?.correct);
 const add=(id,value)=>{const a=r.answers[id];if(!a||a.eventBonus)return;a.points+=value;a.eventBonus=value;};
 if(event.kind==='comeback'){for(const id of candidates)add(id,150);}
 else if(event.kind==='duel'&&candidates.length){const fastest=Math.min(...candidates.map(id=>r.answers[id].ms));const winners=candidates.filter(id=>r.answers[id].ms===fastest);if(winners.length===1)add(winners[0],150);}
}
export function appendTieBreak(r){
 if(r.solo||r.kind==='arcade'||r.customQuestions||r.questions.filter(q=>q.party==='tiebreak').length>=2)return false;
 const players=Object.values(r.players||{});if(players.length<2)return false;
 const top=Math.max(...players.map(p=>p.score)),leaders=players.filter(p=>p.score===top);
 if(leaders.length<2)return false;
 const source=r.packSource,all=source?[...(source.standard?standardPool().filter(q=>source.categories===null||source.categories.includes(selectionCategory(q.category))):[]),...source.questions]:standardPool();
 const used=new Set(r.questions.map(q=>q.prompt));
 const candidates=all.filter(q=>q.mode==='choice'&&!q.media&&!used.has(q.prompt)&&(r.difficulty==='Mixta'||!r.difficulty||q.difficulty===r.difficulty));
 if(!candidates.length)return false;
 const q=validateQuestions([mixOptions(readable(shuffle(candidates)[0]))])[0];
 r.questions.push({...q,id:'tiebreak-'+(r.questions.filter(q=>q.party==='tiebreak').length+1),party:'tiebreak',excluded:players.filter(p=>p.score!==top).map(p=>p.userId)});
 return true;
}

export const INTRO_MS=3000;
export function prepareRound(r,now=Date.now()){r.partyStage='intro';r.started=now;r.showEvent=chooseShowEvent(r);r.introDuration=r.showEvent||r.questions[r.index]?.party==='tiebreak'?6500:r.questions[r.index]?.party==='warmup'&&r.questions[r.index]?.multiplier===2?4000:r.index>0&&r.questions[r.index-1]?.party===r.questions[r.index]?.party?1200:r.kind==='party'||r.kind==='arcade'?6500:INTRO_MS;r.deadline=now+r.introDuration;r.roundEnd=r.deadline;r.buzzer=null;r.hotHolder=null;r.hotTarget=null;r.drawer=null;r.action=null;r.strokes=[];r.bets={};r.bluffs={};r.votes={};r.pies={};r.bluffOptions=[];}
export function begin(r,now=Date.now()){const q=r.questions[r.index];r.partyStage=q.party==='wager'?'bet':q.party==='buzzer'?'buzz':'answer';r.bets={};r.buzzer=null;r.started=now;r.clueStarted=now;r.clueFrozenAt=null;r.deadline=now+(r.partyStage==='bet'?12:r.partyStage==='buzz'?25:q.seconds)*1000;r.roundEnd=r.deadline;r.hotHolder=null;r.hotTarget=null;r.pies={};r.bluffOptions=[];r.bluffs={};r.votes={};if(q.party==='bluff')startBluff(r,now);if(q.party==='hot')startHot(r,now);startArcade(r,q,now);if(q.party==='draw'){r.drawGuesses={};beginDrawing(r,now);}}
export function betLimit(p){return Math.min(500,Math.max(0,p.score));}
export function lockBets(r,now=Date.now()){r.partyStage='answer';r.started=now;r.deadline=now+r.questions[r.index].seconds*1000;r.roundEnd=r.deadline;}
export function buzz(r,u,now=Date.now()){const q=r.questions[r.index];if(q.party!=='buzzer'||r.partyStage!=='buzz'||r.buzzer||r.answers[u.id]||!eligible(r,r.players[u.id],q)||now>=r.roundEnd)throw Error('Pulsador no disponible.');r.buzzer=u.id;r.partyStage='answer';r.clueFrozenAt=now;r.started=now;r.deadline=Math.min(r.roundEnd,now+7000);}
export function release(r,now=Date.now()){r.buzzer=null;r.partyStage='buzz';r.clueFrozenAt=null;r.started=now;r.deadline=r.roundEnd;}
// Only the contestant who claimed the buzzer can be penalized for timing out.
export function expireBuzzer(r,now=Date.now()){
 const q=r.questions[r.index],id=r.buzzer;
 if(q?.party!=='buzzer'||!id||r.partyStage!=='answer'||now<r.deadline||r.answers[id])return false;
 r.answers[id]={correct:false,points:-buzzerPenalty(r.players[id]?.score)||0,ms:null,timeout:true};
 release(r,now);
 return true;
}
export function answer(r,u,a,now=Date.now()){if(r.partyStage==='intro')throw Error('Espera a que empiece la ronda.');if(r.partyStage==='arcade-action')throw Error('Usa los controles de la prueba.');const q=r.questions[r.index],p=r.players[u.id];if(!eligible(r,p,q)||r.partyStage==='bet'||(q.party==='buzzer'&&r.buzzer!==u.id))throw Error('No puedes responder en esta fase.');const special=arcadeAnswer(r,u,a,now);if(special!==null)return special;const ms=Math.max(0,now-r.started);if(q.party==='estimate'){if(typeof a!=='number'||!Number.isFinite(a)||Math.abs(a)>1e12)throw Error('Introduce una cifra válida.');r.answers[u.id]={correct:false,points:0,guess:a,error:Math.abs(a-q.correct),ms,timeout:false};return false;}const correct=grade(q,a);let value=points(q,correct,ms);if(q.party==='buzzer'&&!correct)value=-buzzerPenalty(p.score)||0;if(q.party==='wager'){const bet=r.bets[u.id]||0;value=correct?value+bet:-bet;}if(q.party==='final')value*=q.multiplier===3?3:2;if(q.party==='warmup'&&q.multiplier===2)value*=2;if(q.party==='solo-bonus')value=Math.round(value*1.5);r.answers[u.id]={correct,points:value,ms,timeout:false};if(q.party==='buzzer'&&!correct)release(r,now);return correct;}

const bluffQuestions=[
 {category:'Curiosidades',prompt:'¿Qué animal aparece en la bandera de Gales?',correct:'Dragón',fallback:['León','Águila','Caballo']},
 {category:'Curiosidades',prompt:'¿Qué fruta se conoce también como carambola?',correct:'Fruta estrella',fallback:['Fruta dragón','Fruta del pan','Maracuyá']},
 {category:'Curiosidades',prompt:'¿Qué animal es el mayor roedor del mundo?',correct:'Capibara',fallback:['Castor','Puercoespín','Marmota']},
 {category:'Historia',prompt:'¿En qué ciudad se inventó el papel moneda en la Europa del siglo XVII? (primer banco emisor europeo)',correct:'Estocolmo',fallback:['Londres','Venecia','Ámsterdam']},
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

export function settleContestRound(r,q){applyShowEvent(r,q);if(!['estimate','steal'].includes(q.party))return;if(Object.values(r.answers).some(a=>a.contestSettled))return;const ids=Object.keys(r.players).filter(id=>eligible(r,r.players[id],q));if(q.party==='estimate'){const guesses=ids.map(id=>r.answers[id]).filter(a=>a&&Number.isFinite(a.guess));if(!guesses.length)return;const best=Math.min(...guesses.map(a=>a.error)),scale=q.estimateScale||Math.max(1,Math.abs(q.correct)*.1);for(const a of guesses){a.contestSettled=true;const near=Math.max(0,1-a.error/scale);a.correct=ids.length===1?a.error<=scale:Math.abs(a.error-best)<=Math.max(1e-10,Math.abs(best)*1e-12);a.points=ids.length===1?(a.correct?Math.round(600+400*near):0):a.correct?1000:Math.round(500*near);}return;}
 if(ids.length<2)return;const winners=ids.filter(id=>r.answers[id]?.correct).sort((a,b)=>r.answers[a].ms-r.answers[b].ms);if(!winners.length||winners.length>1&&r.answers[winners[0]].ms===r.answers[winners[1]].ms)return;const winner=winners[0],target=ids.filter(id=>id!==winner).sort((a,b)=>r.players[b].score-r.players[a].score||a.localeCompare(b))[0];if(r.showEvent?.kind==='shield'&&r.showEvent.ids.includes(target)){r.answers[winner].contestSettled=true;r.answers[winner].shieldBlocked=true;return;}const amount=Math.max(0,Math.min(400,Math.floor(r.players[target].score*.2),r.players[target].score));if(!amount)return;const a=r.answers[winner],b=r.answers[target]||{correct:false,points:0,ms:null,timeout:true};a.contestSettled=true;a.points+=amount;a.stolen=amount;a.stolenFrom=target;b.contestSettled=true;b.points-=amount;b.lost=amount;b.lostTo=winner;r.answers[target]=b;
}

export function standardPool(){return [...questions,...extras,...bank,...orderBank,...estimateBank];}
export function standardCategories(){const m=new Map();for(const q of standardPool()){const k=selectionCategory(q.category);if(!m.has(k))m.set(k,{id:k,label:({deporte:'Deportes',cine:'Cine y TV',cultura:'Cultura general',musica:'Música'})[k]||q.category,count:0});m.get(k).count++;}return [...m.values()].sort((a,b)=>a.label.localeCompare(b.label,'es'));}
export function selectedContest(kind,difficulty,source,exclude=[]){
 const all=[...(source.standard?standardPool().filter(q=>source.categories===null||source.categories.includes(selectionCategory(q.category))):[]),...source.questions];
 const normPrompt=q=>String(q.prompt).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
 const unique=new Map();for(const q of all)if(difficulty==='Mixta'||q.difficulty===difficulty)unique.set(normPrompt(q),q);
 const pool=shuffle([...unique.values()]);if(pool.length<3)throw Error('No hay suficientes preguntas para este nivel. Selecciona más categorías, packs o dificultad mixta (mínimo 3).');
 const used=new Set(),old=new Set(exclude),counts=new Map();let prev='';const take=(list,n,party)=>{const out=[];while(out.length<n){const candidates=list.filter(q=>!used.has(normPrompt(q)));if(!candidates.length)break;const score=q=>(old.has(q.prompt)?1000:0)+(counts.get(selectionCategory(q.category))||0)*2+(selectionCategory(q.category)===prev?5:0);candidates.sort((a,b)=>score(a)-score(b));const q=candidates[0];used.add(normPrompt(q));prev=selectionCategory(q.category);counts.set(prev,(counts.get(prev)||0)+1);out.push({...mixOptions(readable(q)),party:party|| (q.mode==='number'?'estimate':q.mode==='order'?'order-round':'classic')});}return out;};
 let raw;if(kind!=='party'){raw=take(pool,12);}else{const choice=pool.filter(q=>!isMystery(q)&&(q.mode==='choice'||q.mode==='fast'||q.mode==='boolean')),order=pool.filter(q=>q.mode==='order'),number=pool.filter(q=>q.mode==='number');const final=take(choice,Math.min(2,Math.max(0,choice.length-3)),'final').map((q,i,a)=>({...q,multiplier:i===a.length-1?3:2}));const warm=take(choice,3,'warmup').map((q,i)=>i===1?{...q,multiplier:2}:q),ordering=take(order,3,'order-round'),estimating=take(number,3,'estimate'),buzzer=[...take(pool.filter(q=>q.mode==='choice'&&q.media?.effect==='pixel'),1,'buzzer'),...take(pool.filter(q=>q.mode==='choice'&&['video','animation'].includes(q.media?.type)),1,'buzzer')],steal=take(choice,2,'steal');buzzer.push(...take(choice.filter(q=>q.mode==='choice'),3-buzzer.length,'buzzer'));const rest=take(pool,Math.max(0,18-final.length-warm.length-ordering.length-estimating.length-buzzer.length-steal.length));raw=[...warm,...ordering,...estimating,...buzzer,...rest,...steal,...final];}
 return raw.map((q,i)=>({...validateQuestions([q])[0],id:String(i+1),party:q.party,estimateScale:q.estimateScale,multiplier:q.multiplier}));
}
export function revealDuration(r){const q=r.questions[r.index],next=r.questions[r.index+1],event=!!r.showEvent||q?.party==='tiebreak'||['estimate','steal','final','pie','bluff','draw'].includes(q?.party)||Object.values(r.answers||{}).some(a=>a.stolen||a.hits||a.fooled);return !next||event||next.party!==q.party?10000:5500;}
