export function moveItem(items,from,to){
 const a=[...items];if(!Number.isInteger(from)||!Number.isInteger(to)||from<0||to<0||from>=a.length||to>=a.length)return a;
 const [item]=a.splice(from,1);a.splice(to,0,item);return a;
}
// Use the dragged card's centre, not the finger or an animating sibling's position.
export function insertionIndex(center,centers){
 const index=centers.findIndex(y=>center<y);return index===-1?centers.length:index;
}
// The full answer tile is a drag surface, except its independent arrow buttons.
export function canStartOrderDrag(e){
 return e.button===0&&!e.target?.closest?.('.sort-up,.sort-down');
}
export function makeOrderList(options,onChange){
 const list=document.createElement('div');list.className='sortable-list';list.setAttribute('aria-label','Orden de las respuestas');
 const wrap=document.createElement('div');wrap.className='sort-wrap';
 const announce=document.createElement('span');announce.className='sr-only';announce.setAttribute('aria-live','polite');
 wrap.append(list,announce);
 let order=options.map((_,i)=>i),drag=null;
 const rows=new Map(),animations=new Map();
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 const update=()=>{
  order.forEach((id,i)=>{
   const row=rows.get(id);row.querySelector('.sort-position').textContent=String(i+1);
   row.querySelector('.sort-up').disabled=i===0;row.querySelector('.sort-down').disabled=i===order.length-1;
   row.querySelector('.sort-grip').setAttribute('aria-label',options[id]+', posición '+(i+1)+'. Usa las flechas arriba y abajo para mover.');
   if(list.children[i]!==row)list.insertBefore(row,list.children[i]||null);
  });onChange([...order]);
 };
 function animateRow(id,from,to){
  const row=rows.get(id);if(reduced()||!row.animate||Math.abs(from-to)<1)return;
  const a=row.animate([{transform:'translateY('+(from-to)+'px)'},{transform:'translateY(0)'}],{duration:180,easing:'cubic-bezier(.2,.75,.25,1)'});
  animations.set(id,a);a.onfinish=()=>{if(animations.get(id)===a)animations.delete(id);};
 }
 function move(id,to){
  const from=order.indexOf(id);if(to===from||to<0||to>=order.length)return;
  const scrollTop=wrap.scrollTop,focused=document.activeElement,restore=focused&&rows.get(id).contains(focused);
  const old=new Map([...rows].map(([key,row])=>[key,row.getBoundingClientRect().top]));
  for(const a of animations.values())a.cancel();animations.clear();
  order=moveItem(order,from,to);update();wrap.scrollTop=scrollTop;
  if(restore&&!drag)(focused.disabled?rows.get(id).querySelector('.sort-grip'):focused).focus({preventScroll:true});
  for(const [key,row] of rows)if(drag?.id!==key)animateRow(key,old.get(key),row.getBoundingClientRect().top);
  if(drag?.ghost)drag.ghost.querySelector('.sort-position').textContent=String(to+1);
  announce.textContent=options[id]+' movida a la posición '+(to+1);
 }
 const btn=(text,cls,label,fn)=>{
  const b=document.createElement('button');b.type='button';b.className=cls;b.textContent=text;b.setAttribute('aria-label',label);b.onclick=fn;return b;
 };
 function lift(d){
  const row=rows.get(d.id);animations.get(d.id)?.cancel();animations.delete(d.id);
  const rect=row.getBoundingClientRect();d.rect=rect;
  d.ghost=row.cloneNode(true);d.ghost.classList.add('dragging','sort-float');d.ghost.setAttribute('aria-hidden','true');d.ghost.inert=true;
  d.ghost.querySelectorAll('button').forEach(b=>{b.tabIndex=-1;});
  Object.assign(d.ghost.style,{position:'fixed',left:rect.left+'px',top:rect.top+'px',width:rect.width+'px',height:rect.height+'px'});
  list.append(d.ghost);row.classList.add('sort-placeholder');d.active=true;
 }
 function renderDrag(d){
  const dy=d.y-d.startY,dx=Math.max(-18,Math.min(18,d.x-d.startX));
  d.ghost.style.transform='translate3d('+dx+'px,'+dy+'px,0)';
  const center=d.rect.top+dy+d.rect.height/2;
  // offsetTop is the layout position: animations cannot shift hit targets.
  const top=list.getBoundingClientRect().top+list.clientTop;
  const centers=order.filter(id=>id!==d.id).map(id=>{const row=rows.get(id);return top+row.offsetTop+row.offsetHeight/2;});
  move(d.id,insertionIndex(center,centers));
 }
 function scrollDrag(){
  const d=drag;if(!d?.active)return;
  if(!list.isConnected){end(null,true);return;}
  const rect=wrap.getBoundingClientRect(),edge=Math.min(48,rect.height/4);
  const speed=d.y<rect.top+edge?-Math.min(12,(rect.top+edge-d.y)*.3):d.y>rect.bottom-edge?Math.min(12,(d.y-rect.bottom+edge)*.3):0;
  if(speed){const before=wrap.scrollTop;wrap.scrollTop+=speed;if(wrap.scrollTop!==before)renderDrag(d);}
  d.frame=requestAnimationFrame(scrollDrag);
 }
 function end(e,cancel=false){
  const d=drag;if(!d||e&&d.pointer!==e.pointerId)return;
  if(d.active&&!cancel&&e){d.x=e.clientX;d.y=e.clientY;renderDrag(d);}
  drag=null;if(d.frame!=null)cancelAnimationFrame(d.frame);
  const row=rows.get(d.id),visual=d.ghost?.getBoundingClientRect().top;
  d.ghost?.remove();row.classList.remove('sort-placeholder');
  if(cancel&&d.active){order=d.original;update();}
  else if(d.active&&visual!=null)animateRow(d.id,visual,row.getBoundingClientRect().top);
  if(list.hasPointerCapture(d.pointer))list.releasePointerCapture(d.pointer);
 }
 options.forEach((label,id)=>{
  const row=document.createElement('div');row.className='sort-tile';row.dataset.id=id;
  const pos=document.createElement('span');pos.className='sort-position';
  const grip=btn('⠿','sort-grip','Arrastrar '+label,()=>{});
  const content=document.createElement('span');content.className='sort-label';content.textContent=label;
  const up=btn('↑','sort-up','Subir '+label,()=>move(id,order.indexOf(id)-1)),down=btn('↓','sort-down','Bajar '+label,()=>move(id,order.indexOf(id)+1));
  grip.onkeydown=e=>{if(e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();move(id,order.indexOf(id)+(e.key==='ArrowUp'?-1:1));grip.focus({preventScroll:true});}};
  row.append(pos,grip,content,up,down);rows.set(id,row);
  row.addEventListener('pointerdown',e=>{
   if(drag||grip.disabled||!canStartOrderDrag(e))return;
   if(e.cancelable)e.preventDefault();
   drag={id,pointer:e.pointerId,startX:e.clientX,startY:e.clientY,x:e.clientX,y:e.clientY,active:false,original:[...order]};
   try{list.setPointerCapture(e.pointerId);}catch{drag=null;}
  });
 });
 list.addEventListener('pointermove',e=>{
  const d=drag;if(!d||d.pointer!==e.pointerId)return;if(e.cancelable)e.preventDefault();
  d.x=e.clientX;d.y=e.clientY;
  if(!d.active){if(Math.abs(d.y-d.startY)<4)return;lift(d);d.frame=requestAnimationFrame(scrollDrag);}
  renderDrag(d);
 },{passive:false});
 list.addEventListener('pointerup',e=>end(e));
 list.addEventListener('pointercancel',e=>end(e,true));
 list.addEventListener('lostpointercapture',e=>end(e,true));
 update();return wrap;
}
