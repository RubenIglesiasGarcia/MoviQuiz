// New rooms opt into a rotating show format; older room snapshots retain their playlist.
export const normalizePace=p=>['quick','normal','show'].includes(p)?p:'normal';
export function showPlaylist(questions,kind,pace,seed=''){
 const q=[...questions],hash=[...String(seed)].reduce((n,c)=>(Math.imul(n,31)+c.charCodeAt(0))>>>0,0);
 if(kind==='classic')return pace==='quick'?q.slice(0,8):q;
 if(kind==='arcade'){
  if(pace!=='quick')return q;
  const end=q.find(x=>x.party==='territory'),volley=q.find(x=>x.party==='volley');
  return [...q.filter(x=>x!==end&&x!==volley).slice(0,6),...(volley?[volley]:[]),...(end?[end]:[])];
 }
 const warm=q.filter(x=>x.party==='warmup'),final=q.filter(x=>x.party==='final'),steal=q.filter(x=>x.party==='steal');
 const middle=q.filter(x=>!['warmup','steal','final'].includes(x.party)),groups=[];
 for(const item of middle){if(groups.at(-1)?.[0].party===item.party)groups.at(-1).push(item);else groups.push([item]);}
 let n=hash;for(let i=groups.length-1;i>0;i--){n=(Math.imul(n,1664525)+1013904223)>>>0;const j=n%(i+1);[groups[i],groups[j]]=[groups[j],groups[i]];}
 if(pace==='quick')return [...warm.slice(0,2),...groups.map(x=>x[0]),...steal.slice(0,1),...final];
 return [...warm,...groups.flat(),...steal,...final];
}
export function nextAlarm(room){return room.phase==='question'?room.deadline:room.phase==='reveal'&&room.autoAdvance?Math.max(room.revealUntil||0,room.autoHoldUntil||0):room.expires;}
export function staleRoomAction(room,data){return data.matchId!==undefined&&data.matchId!==room.matchId||data.roundIndex!==undefined&&data.roundIndex!==room.index;}

export function roundHighlight(players,answers,index,previousRanks={}){
 const ranked=[...players].sort((a,b)=>b.score-a.score),leader=ranked[0],stolen=ranked.find(p=>answers[p.userId]?.stolen>0);
 if(stolen)return {round:index+1,priority:4,text:stolen.name+' robó '+answers[stolen.userId].stolen+' puntos'};
 const climbed=ranked.map((p,i)=>({p,move:(previousRanks[p.userId]??i)-i})).filter(x=>x.move>=2).sort((a,b)=>b.move-a.move)[0];
 if(climbed)return {round:index+1,priority:3,text:climbed.p.name+' remontó '+climbed.move+' puestos'};
 if(index>0&&leader&&previousRanks[leader.userId]>0)return {round:index+1,priority:3,text:leader.name+' tomó el liderato'};
 const streak=ranked.find(p=>p.career?.streak===5||p.career?.streak===10);
 if(streak)return {round:index+1,priority:2,text:streak.name+' encadenó '+streak.career.streak+' aciertos'};
 const gains=ranked.filter(p=>(answers[p.userId]?.points||0)>0).sort((a,b)=>answers[b.userId].points-answers[a.userId].points);
 if(gains[0]&&answers[gains[0].userId].points>=1800)return {round:index+1,priority:1,text:gains[0].name+' consiguió '+answers[gains[0].userId].points+' puntos en una ronda'};
 return null;
}
export function collectHighlight(history,event){return event?[...history,event].sort((a,b)=>b.priority-a.priority||b.round-a.round).slice(0,5).sort((a,b)=>a.round-b.round):history;}
