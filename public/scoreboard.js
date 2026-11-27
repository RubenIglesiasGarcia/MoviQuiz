import {resultTimeline,competitiveMoment,standingsSpotlight} from './show-direction.js';
import {rankBefore,movement} from './reaction-style.js';
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
const fmt=n=>Math.round(Number(n)||0).toLocaleString('es-ES');
export const signed=n=>(n>0?'+':'')+fmt(n);
export function scoreRows(players=[],playerId=null){return players.map((p,i)=>({id:p.id,name:p.name,avatar:p.avatar,rank:i+1,total:Number(p.score)||0,delta:Number(p.last)||0,move:movement(players,p),mine:p.id===playerId,reaction:p.reaction||'idle'}));}
export function scoreboardFrame(state,now,reduced=false){
 const t=resultTimeline(state,now),stage=reduced?'rank':t.stage,progress=stage==='answer'?0:stage==='rank'?1:Math.max(0,Math.min(1,(t.elapsed-t.pointStart)/t.pointDuration)),ordered=stage==='rank'?state.players:rankBefore(state.players);
 const eased=1-(1-progress)**3;return {stage,progress,rows:ordered.map(p=>({id:p.id,score:Math.round((Number(p.score)||0)-(Number(p.last)||0)+(Number(p.last)||0)*eased),delta:Number(p.last)||0}))};
}
function cells(row,p,avatarNode){
 const rank=el('b','tv-score-rank',String(p.rank)),portrait=el('div','tv-score-avatar'),name=el('div','tv-score-name'),delta=el('strong','tv-score-delta',signed(p.delta)),score=el('strong','tv-score-total',fmt(p.total)),shift=el('small','tv-score-move',p.move>0?'▲ Sube '+p.move:p.move<0?'▼ Baja '+Math.abs(p.move):'— Mantiene posición');
 shift.dataset.direction=p.move>0?'up':p.move<0?'down':'same';delta.dataset.negative=String(p.delta<0);row.dataset.reaction=p.reaction;row.classList.toggle('is-me',p.mine);
 try{portrait.append(avatarNode(p.avatar,p.name));}catch{portrait.textContent='★';}
 name.append(el('b','',p.name+(p.mine?' (tú)':'')),shift);row.append(rank,portrait,name,delta,score);return {rank,score,delta,shift};
}
// Broadcast is ordinary in-flow DOM, not a dialog and not dependent on WebGL.
// A complete static board exists before any animation begins.
export function mountTvScoreboard(host,state,offset,answer,avatarNode){
 const box=el('section','tv-scoreboard'),head=el('header','tv-score-head'),title=el('h2','','Resultados de la ronda'),kicker=el('div','result-kicker','RONDA '+(state.index+1)+' / '+state.total),solution=el('p','tv-score-solution',answer||'¡Prueba terminada!'),status=el('p','tv-score-status','Puntos de la ronda y clasificación'),columns=el('div','tv-score-columns'),list=el('div','tv-score-list'),footer=el('div','result-show-footer'),clock=el('span','result-countdown','Esperando al presentador…');
 box.setAttribute('aria-label','Clasificación de la ronda');box.setAttribute('role','region');box.setAttribute('open','');box.classList.add('tv-results-overlay');box.dataset.count=String(state.players.length);box.dataset.dense=String(state.players.length>8);head.append(kicker,title,solution,status);columns.append(el('span','','POS.'),el('span','',''),el('span','','CONCURSANTE'),el('span','','RONDA'),el('span','','TOTAL'));footer.append(clock);box.append(head,columns,list,footer);
 const rows=new Map(),players=scoreRows(state.players);for(const p of players){const row=el('article','tv-score-row'),parts=cells(row,p,avatarNode);rows.set(p.id,{row,...parts});list.append(row);}if(!players.length)list.append(el('p','','Esperando jugadores…'));host.append(box);
 const reduced=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches||false;
 let stage='',lastOrder='',scrollStart=0;
 function paint(now){
  if(!box.isConnected)return;
  const frame=scoreboardFrame(state,Date.now()+offset,reduced),changed=stage!==frame.stage,order=frame.rows.map(p=>p.id).join(',');
  if(changed){stage=frame.stage;box.dataset.step=stage;title.textContent=stage==='answer'?'¡Resultados de la ronda!':stage==='points'?'¡Repartimos los puntos!':'¡Nueva clasificación!';const info=competitiveMoment(state.players)||standingsSpotlight(state.players);status.textContent=stage==='rank'&&info?info.title+' · '+info.detail:stage==='points'?'Sumando los puntos al marcador…':'Puntos conseguidos en esta ronda';if(stage==='rank')scrollStart=now;}
  if(lastOrder!==order){const previous=new Map([...rows].map(([id,x])=>[id,x.row.getBoundingClientRect().top]));frame.rows.forEach((p,i)=>{const x=rows.get(p.id);list.append(x.row);x.rank.textContent=String(i+1);const dy=previous.get(p.id)-x.row.getBoundingClientRect().top;if(stage==='rank'&&lastOrder&&!reduced&&dy&&x.row.animate)try{x.row.animate([{transform:'translateY('+dy+'px)'},{transform:'translateY(0)'}],{duration:850,easing:'ease-out'});}catch{}});lastOrder=order;}
  for(const p of frame.rows){const x=rows.get(p.id),v=fmt(p.score);if(x.score.textContent!==v)x.score.textContent=v;x.shift.hidden=stage!=='rank';}
  const left=Math.max(0,(state.revealUntil||0)-Date.now()-offset);clock.textContent=left?'Clasificación · '+Math.ceil(left/1000)+' s':'Esperando al presentador…';
  if(stage==='rank'&&!reduced&&scrollStart&&list.scrollHeight>list.clientHeight){const max=list.scrollHeight-list.clientHeight;list.scrollTop=max*Math.min(1,Math.max(0,(now-scrollStart-500)/Math.max(1500,left+now-scrollStart-500)));}
  if(left>0)requestAnimationFrame(paint);
 }
 try{paint(performance.now());}catch(error){console.warn('TV scoreboard animation:',error);box.dataset.step='rank';title.textContent='¡Nueva clasificación!';for(const p of players){const x=rows.get(p.id);list.append(x.row);x.score.textContent=fmt(p.total);x.rank.textContent=String(p.rank);x.shift.hidden=false;}}
 return box;
}
export function paintRankingDialog(dialog,state,playerId,avatarNode){
 const list=dialog.querySelector('.quick-ranking-list');if(!list)return;const players=scoreRows(state.players,playerId),signature=JSON.stringify(players.map(p=>[p.id,p.rank,p.total,p.delta,p.name,p.avatar]));if(list.dataset.signature===signature)return;list.dataset.signature=signature;list.replaceChildren();for(const p of players){const row=el('div','quick-ranking-row');cells(row,p,avatarNode);list.append(row);}
}

// Keep five readable rows in the narrow side panel; every participant gets a page.
export function rankingPage(count,now,size=5,period=4000){
 const pages=Math.max(1,Math.ceil(count/size)),index=((Math.floor(now/period)%pages)+pages)%pages;
 return {index,pages,start:index*size,end:Math.min(count,(index+1)*size)};
}
// A two-row stage is readable up to twelve. Larger rooms rotate groups by round.
export function stagePlayers(players,index=0,finished=false){
 const ordered=[...players].sort((a,b)=>a.id.localeCompare(b.id));
 if(ordered.length<=12)return ordered;
 if(finished)return [...players].slice(0,12).sort((a,b)=>a.id.localeCompare(b.id));
 const pages=Math.ceil(ordered.length/12),page=Math.max(0,index)%pages;
 return ordered.slice(page*12,page*12+12);
}
export function stageSlot(i,n){
 const twoRows=n>8,cols=twoRows?Math.ceil(n/2):n,back=twoRows&&i>=cols,row=back?i-cols:i,count=back?n-cols:cols;
 const spacing=n<=2?2.25:twoRows?1.60:1.48;
 const x=(row-(count-1)/2)*spacing+(n<=2?1.25:.8)+(back?.35:0);
 return {x,y:back?.66:0,z:back?-2.65:-.25-Math.abs(row-(count-1)/2)*.13,rot:-x*.035};
}
