// Server-owned arena hazards. The same coordinates and clock are used by every screen.
export const HAZARD_PERIOD=6000;
export function hazardPlan(kind){return {kind:'coins',variant:kind,version:1,lead:3500,duration:36000,interval:36000,beats:[],coins:[]};}
export function lavaZone(elapsed){const cycle=Math.max(0,Math.floor(elapsed/HAZARD_PERIOD)),t=Math.max(0,elapsed)%HAZARD_PERIOD;return {axis:cycle%2?'x':'z',side:Math.floor(cycle/2)%2?-1:1,hot:t>=2200&&t<4900,warning:t<2200,cycle};}
export function inLava(x,z,h){return (h.axis==='x'?x:z)*h.side>.65;}
export function wanderingParcel(elapsed){const t=elapsed/1000;return {x:4.6*Math.sin(t*.85),z:2.95*Math.cos(t*1.2)};}
export function arenaHazard(action,ids,time,elapsed){
 const w=action.world,ps=ids.map(id=>action.players[id]),cycle=Math.floor(elapsed/HAZARD_PERIOD),active=ps.filter(p=>p.attempts&&p.until>time);
 if(action.plan.variant==='lava'){
  const zone=lavaZone(elapsed);for(const p of active){if(zone.hot&&inLava(p.x,p.z,zone)&&p.hitCycle!==cycle){p.hitCycle=cycle;p.bumpedAt=time;p.score=Math.max(0,p.score-100);p.bumped++;}}
  if(Math.floor(elapsed/1000)>w.lastAward){w.lastAward=Math.floor(elapsed/1000);for(const p of active)if(!zone.hot||!inLava(p.x,p.z,zone)){p.hits++;p.score+=45;}}
 }else{
  if(ps.length===1){const p=active[0],spot=wanderingParcel(elapsed);w.holder=null;if(p){const hit=Math.hypot(p.x-spot.x,p.z-spot.z)<.7;if(hit&&time-(p.bumpedAt||0)>1100){p.score=Math.max(0,p.score-100);p.bumped++;p.bumpedAt=time;}if(Math.floor(elapsed/1000)>w.lastAward){w.lastAward=Math.floor(elapsed/1000);if(!hit){p.hits++;p.score+=40;}}}return;}
  const valid=active.find(p=>p.colorIndex===w.holder);if(!valid){w.holder=active.length?active[cycle%active.length].colorIndex:null;w.passAt=time;}
  const holder=active.find(p=>p.colorIndex===w.holder);
  if(holder&&time-w.passAt>=750){const next=active.filter(p=>p!==holder&&Math.hypot(p.x-holder.x,p.z-holder.z)<.7).sort((a,b)=>Math.hypot(a.x-holder.x,a.z-holder.z)-Math.hypot(b.x-holder.x,b.z-holder.z))[0];if(next){w.holder=next.colorIndex;w.passAt=time;holder.bumps++;}}
  if(cycle!==w.bombCycle){if(w.bombCycle>=0){const loser=active.find(p=>p.colorIndex===w.holder);if(loser&&active.length>1){loser.score=Math.max(0,loser.score-180);loser.bumped++;loser.bumpedAt=time;}w.explodedAt=time;}w.bombCycle=cycle;w.holder=active.length?active[cycle%active.length].colorIndex:null;w.passAt=time;}
  if(Math.floor(elapsed/1000)>w.lastAward){w.lastAward=Math.floor(elapsed/1000);for(const p of active)if(active.length===1||p.colorIndex!==w.holder){p.hits++;p.score+=40;}}
 }
}
