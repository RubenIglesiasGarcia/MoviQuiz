// Server-authoritative continuous movement; no frame-rate or client position trust.
import {arenaHazard} from './arena-events.js';
export const COIN_DURATION=30000,COIN_LEAD=3500,COIN_LEASE=550,COIN_MIN_INPUT=160;
export const COIN_BOUNDS={x:6,z:4};
export const COIN_BLOCKS=[{x:-2.1,z:0,w:.95,d:2.35},{x:2.1,z:0,w:.95,d:2.35},{x:0,z:-2.4,w:1.8,d:.65},{x:0,z:2.4,w:1.8,d:.65}];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function coinPlan(random=Math.random){
 const coins=[];for(let wave=0;wave<3;wave++){
  const cells=[];for(let x=-5.4;x<=5.5;x+=1.2)for(let z=-3.4;z<=3.5;z+=1.1)if(!blocked(x,z,.20))cells.push({x,z});
  for(let i=cells.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[cells[i],cells[j]]=[cells[j],cells[i]];}
  for(const [i,c] of cells.slice(0,22).entries())coins.push({id:wave*22+i,x:c.x,z:c.z,at:wave*10000,value:i%7===0?100:40});
 }
 return {kind:'coins',version:1,lead:COIN_LEAD,duration:COIN_DURATION,interval:COIN_DURATION,beats:[],coins};
}
export function blocked(x,z,r=.23){return COIN_BLOCKS.some(b=>Math.abs(x-b.x)<b.w/2+r&&Math.abs(z-b.z)<b.d/2+r);}
// A shared arena variant: every contestant can repaint rivals' tiles, not just collect pickups.
// Owner indices are round-local, never account IDs.
export const TERRITORY_TILE_POINTS=35;
export function territoryColor(index){return index<8?['#79c9ff','#ff9b9c','#ffd55a','#77e2b2','#dab7ff','#ffab65','#82f0f0','#ef84cd'][index]:`hsl(${Math.round(index*137.508)%360}, 85%, 65%)`;}
// The sofa moves four times. Stay close, and use turbo to bump active rivals.
export const SOFA_PERIOD=8000,SOFA_RADIUS=1.05,SOFA_POINTS=35;
export function sofaPlan(random=Math.random){
 const spots=[{x:0,z:0},{x:-4.5,z:-2.4},{x:4.5,z:2.4},{x:-4.5,z:2.4},{x:4.5,z:-2.4}];
 const rest=spots.slice(1);for(let i=rest.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[rest[i],rest[j]]=[rest[j],rest[i]];}
 return {kind:'coins',variant:'sofa',version:1,lead:COIN_LEAD,duration:32000,interval:32000,beats:[],coins:[],spots:[spots[0],...rest.slice(0,3)]};
}
export function sofaSpot(plan,elapsed){return plan.spots[Math.min(plan.spots.length-1,Math.max(0,Math.floor(elapsed/SOFA_PERIOD)))];}
function shoveSofa(action,ids,time){
 for(const id of ids){const p=action.players[id];if(p.boostUntil<=time||p.until<=time||(p.bumpReady||0)>time)continue;
  let target=null,closest=.76;
  for(const other of ids){if(other===id)continue;const q=action.players[other],dx=q.x-p.x,dz=q.z-p.z,d=Math.hypot(dx,dz);
   if(q.until<=time||q.safeUntil>time||d<.001||d>=closest||dx*p.vx+dz*p.vz<=0)continue;target=q;closest=d;}
  if(!target)continue;
  const dx=(target.x-p.x)/closest,dz=(target.z-p.z)/closest;let moved=0;
  for(let k=0;k<8;k++){const x=clamp(target.x+dx*.16,-5.76,5.76),z=clamp(target.z+dz*.16,-3.76,3.76);if(blocked(x,z)||Math.hypot(x-target.x,z-target.z)<.03)break;target.x=x;target.z=z;moved++;}
  if(moved){p.bumpReady=time+500;p.bumps=(p.bumps||0)+1;target.safeUntil=time+1100;target.bumped=(target.bumped||0)+1;target.bumpedAt=time;}
 }
}
function scoreSofa(action,ids,time,elapsed){
 const world=action.world,spot=sofaSpot(action.plan,elapsed);shoveSofa(action,ids,time);
 let holder=null,best=SOFA_RADIUS;
 for(const id of ids){const p=action.players[id];if(!p.attempts||p.until<=time||(p.safeUntil>time&&time-(p.bumpedAt||0)<250))continue;
  const d=Math.hypot(p.x-spot.x,p.z-spot.z);if(d<best-.0001){best=d;holder=p;}else if(Math.abs(d-best)<.0001){holder=null;}}
 world.holder=holder?.colorIndex??null;
 const beat=Math.floor(elapsed/500);
 if(beat>world.lastAward){world.lastAward=beat;if(holder){holder.hits++;holder.score+=SOFA_POINTS;}}
}
export function territoryPlan(){
 const tiles=[];
 for(let ix=0;ix<12;ix++)for(let iz=0;iz<8;iz++){
  const x=ix-5.5,z=iz-3.5;
  if(!blocked(x,z,.32))tiles.push({id:ix*8+iz,x,z});
 }
 return {kind:'coins',variant:'territory',version:1,lead:COIN_LEAD,duration:35000,interval:35000,beats:[],coins:[],tiles};
}
function paintTerritory(action,ids,time,dt){
 const world=action.world,tiles=action.plan.tiles;
 for(const tile of tiles){
  let winner=null,best=.46*.46;
  if((world.claimedAt[tile.id]||0)+300>time)continue;
  for(const id of ids){const p=action.players[id];if(!p.attempts||p.until<=time-dt||Math.hypot(p.vx,p.vz)<.08)continue;const d=(p.x-tile.x)**2+(p.z-tile.z)**2;if(d<best){winner=p;best=d;}}
  if(!winner||world.owners[tile.id]===winner.colorIndex)continue;
  const previous=world.owners[tile.id];
  if(previous!==undefined){const loser=ids.map(id=>action.players[id]).find(p=>p.colorIndex===previous);if(loser){loser.hits=Math.max(0,loser.hits-1);loser.score=loser.hits*TERRITORY_TILE_POINTS;}winner.repaints++;}
  world.owners[tile.id]=winner.colorIndex;world.claimedAt[tile.id]=time;winner.hits++;winner.score=winner.hits*TERRITORY_TILE_POINTS;
 }
}
export function startCoins(action){
 const ids=Object.keys(action.players).sort(),count=ids.length;action.world={tick:action.started+action.plan.lead,taken:{},...(action.plan.variant==='territory'?{owners:{},claimedAt:{}}:['sofa','lava','bomb'].includes(action.plan.variant)?{holder:null,lastAward:0,bombCycle:-1,passAt:0}:{})};
 ids.forEach((id,i)=>{const a=2*Math.PI*i/Math.max(1,count),p=action.players[id];Object.assign(p,{x:Math.cos(a)*5.05,z:Math.sin(a)*3.15,vx:0,vz:0,until:0,lastControl:0,boostUntil:0,boostReady:0,score:0,hits:0,attempts:0,colorIndex:i,repaints:0,bumps:0,bumped:0,safeUntil:0,bumpReady:0,bumpedAt:0});});
}
export function advanceCoins(action,now){
 const world=action.world;if(!world)return;
 const begin=action.started+action.plan.lead,end=Math.min(now,begin+action.plan.duration);if(end<=world.tick)return;
 const ids=Object.keys(action.players).sort();
 while(world.tick<end){
  const dt=Math.min(50,end-world.tick),time=world.tick+dt,elapsed=time-begin;
  for(const id of ids){const p=action.players[id],moving=Math.max(0,Math.min(time,p.until)-world.tick),turbo=Math.max(0,Math.min(time,p.until,p.boostUntil)-world.tick),distance=((moving-turbo)*4.15+turbo*7.1)/1000;
   if(moving>0){const x=clamp(p.x+p.vx*distance,-COIN_BOUNDS.x+.24,COIN_BOUNDS.x-.24),z=clamp(p.z+p.vz*distance,-COIN_BOUNDS.z+.24,COIN_BOUNDS.z-.24);if(!blocked(x,p.z))p.x=x;if(!blocked(p.x,z))p.z=z;}
  }
  if(action.plan.variant==='territory'){paintTerritory(action,ids,time,dt);world.tick=time;continue;}
  if(action.plan.variant==='sofa'){scoreSofa(action,ids,time,elapsed);world.tick=time;continue;}
  if(['lava','bomb'].includes(action.plan.variant)){arenaHazard(action,ids,time,elapsed);world.tick=time;continue;}
  // Resolve contested pickups by nearest player; stable tie-break, no input order advantage.
  for(const c of action.plan.coins){if(c.at>elapsed||world.taken[c.id]||elapsed-c.at>=10000)continue;let winner=null,best=.48*.48;
   for(const id of ids){const p=action.players[id],d=(p.x-c.x)**2+(p.z-c.z)**2;if(p.attempts>0&&p.until>time&&d<best){winner=p;best=d;}}
   if(winner){world.taken[c.id]=true;winner.score+=c.value;winner.hits++;}
  }
  world.tick=time;
 }
}
export function controlCoins(action,id,input,now){
 const p=action.players[id],start=action.started+action.plan.lead;if(!p||typeof input!=='string'||now<start||now>=start+action.plan.duration)throw Error('La prueba no está activa.');
 const match=/^(-?\d{1,3}),(-?\d{1,3}),([01])$/.exec(input);if(!match)throw Error('Control inválido.');
 const x=Number(match[1]),z=Number(match[2]);if(Math.abs(x)>100||Math.abs(z)>100)throw Error('Control inválido.');
 if(p.lastControl&&now-p.lastControl<COIN_MIN_INPUT)throw Error('Control demasiado rápido.');
 advanceCoins(action,now);const norm=Math.max(100,Math.hypot(x,z));p.vx=x/norm;p.vz=z/norm;p.until=now+COIN_LEASE;p.lastControl=now;if(x||z)p.attempts++;
 if(match[3]==='1'&&(x||z)&&now>=p.boostReady){p.boostUntil=now+450;p.boostReady=now+2200;}
 return 0;
}
export function finishCoins(r){
 advanceCoins(r.action,r.action.started+r.action.plan.lead+r.action.plan.duration);
 for(const [id,p] of Object.entries(r.action.players))r.answers[id]={correct:p.hits>=5,points:p.score,ms:null,timeout:p.attempts===0,arcadeHits:p.hits,arcadeAttempts:p.attempts};
}
