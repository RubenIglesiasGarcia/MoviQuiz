// Shared deterministic arcade timing. The server grades all input with its own clock.
import {coinPlan,territoryPlan,startCoins,controlCoins,finishCoins} from './coin-engine.js';
export const actionKinds=['dash','dodge','hoops'];
export const isAction=kind=>kind==='coins'||kind==='territory'||actionKinds.includes(kind);
export const actionMeta={
 territory:{title:'GUERRA DE COLORES',subtitle:'Pinta el suelo de tu color, roba las casillas de tus rivales y usa el turbo. Gana quien controla más terreno al acabar.',category:'Agilidad'},
 coins:{title:'FIEBRE DEL ORO',subtitle:'Muévete libremente, esquiva las barreras y recoge más monedas que tus rivales.',category:'Agilidad'},
 dash:{title:'CARRERA DE VALLAS',subtitle:'Esquiva por los lados o salta la valla en el momento justo.',steps:12,interval:1750,category:'Agilidad'},
 dodge:{title:'LLUVIA DE METEORITOS',subtitle:'Observa los meteoritos y salta al carril que quede libre.',steps:12,interval:1700,category:'Reflejos'},
 hoops:{title:'CANASTA ESTELAR',subtitle:'Lanza cuando el indicador atraviese la zona verde.',steps:10,interval:1900,category:'Deportes'}
};
export function makeActionPlan(kind,random=Math.random){
 if(kind==='territory')return territoryPlan();if(kind==='coins')return coinPlan(random);const m=actionMeta[kind];if(!m)throw Error('Prueba desconocida.');
 let prev='',repeat=0;
 const beats=Array.from({length:m.steps},(_,i)=>{
  const level=Math.min(3,Math.floor(i*4/m.steps)),duration=m.interval-level*130;
  const choices=kind==='dash'?['left','right','jump']:['0','1','2'];
  let target=kind==='hoops'?'shoot':choices[Math.min(2,Math.floor(random()*3))];
  if(kind!=='hoops'&&target===prev&&repeat>=1)target=choices[(choices.indexOf(target)+1+Math.floor(random()*2))%3];
  repeat=target===prev?repeat+1:0;prev=target;
  const center=kind==='hoops'?Math.round(duration*(.43+random()*.20)):Math.round(duration*.70);
  const window=kind==='hoops'?[300,250,205,175][level]:kind==='dash'?[430,375,310,260][level]:[530,450,380,320][level];
  return {target,center,window,duration,level};
 });
 return {version:2,kind,lead:3500,interval:m.interval,beats};
}
export function beatDuration(plan,index){return plan.beats[index]?.duration||plan.interval;}
export function actionDuration(plan){return plan.kind==='coins'?plan.lead+plan.duration:plan.lead+plan.beats.reduce((n,_,i)=>n+beatDuration(plan,i),0)+300;}
export function actionBeat(plan,elapsed){
 let t=elapsed-plan.lead;if(t<0)return {index:-1,elapsed:t};
 for(let i=0;i<plan.beats.length;i++){const duration=beatDuration(plan,i);if(t<duration)return {index:i,elapsed:t,duration};t-=duration;}
 return {index:plan.beats.length,elapsed:t};
}
export function actionPoints(kind,beat,input,elapsed){
 if(!beat||input!==beat.target)return 0;
 // Existing saved games retain their original scoring.
 if(!Number.isFinite(beat.window)){if(kind==='hoops'){const error=Math.abs(elapsed-beat.center);return error<=350?150:error<=800?85:0;}if(kind==='dash')return elapsed>=250&&elapsed<=1800?125:0;return elapsed>=0&&elapsed<=2100?140:0;}
 const error=Math.abs(elapsed-beat.center);
 if(error<=beat.window*.42)return 150;
 if(error<=beat.window)return 100;
 if(kind==='hoops'&&error<=beat.window*1.65)return 45;
 return 0;
}
export function actionRound(kind){const m=actionMeta[kind],plan=makeActionPlan(kind);return {party:kind,mode:'fast',category:m.category,difficulty:'Difícil',prompt:m.subtitle,seconds:Math.ceil(actionDuration(plan)/1000),plan,correct:null,options:[]};}
export function startAction(r,q,now){r.action={plan:q.plan,started:now,players:Object.fromEntries(Object.keys(r.players).map(id=>[id,{score:0,hits:0,attempts:0,lastBeat:-1,lastInput:null,lastPoints:0,lastElapsed:null,combo:0,bestCombo:0,perfect:0}]))};if(q.plan.kind==='coins')startCoins(r.action);r.partyStage='arcade-action';r.deadline=now+actionDuration(q.plan);}
export function recordAction(r,id,input,beatIndex,now){
 const a=r.action,p=a?.players[id];if(r.phase!=='question'||r.partyStage!=='arcade-action'||!p||!Number.isInteger(beatIndex)||typeof input!=='string')throw Error('Prueba no disponible.');
 if(a.plan.kind==='coins')return controlCoins(a,id,input,now);const beat=actionBeat(a.plan,now-a.started);
 if(beat.index!==beatIndex||beatIndex<0||beatIndex>=a.plan.beats.length||p.lastBeat>=beatIndex)throw Error('Esta oportunidad ya ha terminado.');
 if(!(a.plan.kind==='dash'?['left','right','jump']:a.plan.kind==='dodge'?['0','1','2']:['shoot']).includes(input))throw Error('Control no válido.');
 const base=actionPoints(a.plan.kind,a.plan.beats[beatIndex],input,beat.elapsed);
 if(a.plan.version===2){p.combo=base?(p.lastBeat===beatIndex-1?(p.combo||0)+1:1):0;p.bestCombo=Math.max(p.bestCombo||0,p.combo);if(base===150)p.perfect=(p.perfect||0)+1;}
 const score=base+(a.plan.version===2&&base?Math.min(40,Math.max(0,p.combo-1)*10):0);
 p.lastBeat=beatIndex;p.lastInput=input;p.lastPoints=score;p.lastElapsed=beat.elapsed;p.score+=score;p.attempts++;if(score>0)p.hits++;return score;
}
export function finishAction(r){if(!r.action)return;if(r.action.plan.kind==='coins')return finishCoins(r);for(const [id,p] of Object.entries(r.action.players)){r.answers[id]={correct:p.hits>=Math.ceil(r.action.plan.beats.length/2),points:p.score,ms:null,timeout:p.attempts===0,arcadeHits:p.hits,arcadeAttempts:p.attempts};}}
