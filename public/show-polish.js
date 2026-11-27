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
