// Server-authoritative continuous movement; no frame-rate or client position trust.
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
export function startCoins(action){
 const ids=Object.keys(action.players).sort(),count=ids.length;action.world={tick:action.started+action.plan.lead,taken:{}};
 ids.forEach((id,i)=>{const a=2*Math.PI*i/Math.max(1,count),p=action.players[id];Object.assign(p,{x:Math.cos(a)*5.05,z:Math.sin(a)*3.15,vx:0,vz:0,until:0,lastControl:0,boostUntil:0,boostReady:0,score:0,hits:0,attempts:0});});
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
  // Resolve contested pickups by nearest player; stable tie-break, no input order advantage.
  for(const c of action.plan.coins){if(c.at>elapsed||world.taken[c.id]||elapsed-c.at>=10000)continue;let winner=null,best=.48*.48;
   for(const id of ids){const p=action.players[id],d=(p.x-c.x)**2+(p.z-c.z)**2;if(p.attempts>0&&d<best){winner=p;best=d;}}
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
 advanceCoins(action,now);const norm=Math.max(100,Math.hypot(x,z));p.vx=x/norm;p.vz=z/norm;p.until=now+COIN_LEASE;p.lastControl=now;p.attempts++;
 if(match[3]==='1'&&(x||z)&&now>=p.boostReady){p.boostUntil=now+450;p.boostReady=now+2200;}
 return 0;
}
export function finishCoins(r){
 advanceCoins(r.action,r.action.started+r.action.plan.lead+r.action.plan.duration);
 for(const [id,p] of Object.entries(r.action.players))r.answers[id]={correct:p.hits>=5,points:p.score,ms:null,timeout:p.attempts===0,arcadeHits:p.hits,arcadeAttempts:p.attempts};
}
