import {actionBeat,actionMeta,beatDuration} from '/arcade-rules.js';
import {syncArcadeStage} from '/generated/character3d.js';
import {playSound} from '/effects.js';
let lastPadRoom='',lastPadPreference=null;
const h=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e;};
const btn=(cls,text,fn)=>{const b=h('button',cls,text);b.type='button';b.onclick=fn;return b;};
export function mountArcadeGame(parent,{state,playerId,play,send,offset,reveal,role}){
 const kind=state.arcade.plan.kind,meta=actionMeta[kind],wrap=h('section','arcade-game arcade-'+kind),arena=h('div','arcade-arena'),overlay=h('div','arcade-cue'),hud=h('div','arcade-hud'),title=h('strong'),points=h('strong'),combo=h('span','arcade-combo'),progress=h('div','arcade-beats'),control=h('div','arcade-buttons'),hint=h('p','arcade-hint'),meter=h('div','arcade-timing'),fill=h('i'),zone=h('b'),tools=h('div','arcade-pad-tools'),live=h('div','arcade-live-scores'),rotate=h('p','arcade-rotate','Gira el móvil para jugar como con un mando.');
 const coarse=matchMedia('(pointer:coarse)'),landscape=matchMedia('(orientation:landscape)');let preference=lastPadRoom===state.code?lastPadPreference:null,pad=false,current=state,clock=offset,attempt=-1,active=false,last=-2,frame=0,lastFeedback=-1,lastFrame=0,signature='',disposed=false;
 const setText=(node,value)=>{if(node.textContent!==value)node.textContent=value;};
 const fallback=h('div','arcade-2d'),lanes=h('div','arcade-2d-lanes'),fallbackPlayers=h('div','arcade-2d-players');for(let i=0;i<3;i++)lanes.append(h('div','arcade-2d-lane'));fallback.append(lanes,fallbackPlayers);meter.append(zone,fill);arena.append(overlay,fallback);hud.append(title,points,combo);wrap.append(hud,arena,progress,meter,live,tools,rotate,control,hint);parent.append(wrap);
 const options=kind==='dash'?[['left','◀','IZQUIERDA'],['right','▶','DERECHA'],['jump','↑','SALTO']]:kind==='dodge'?[['0','◀','IZQUIERDA'],['1','●','CENTRO'],['2','▶','DERECHA']]:[['shoot','●','LANZAR']];
 const buttons=[];
 const vibrate=pattern=>{try{if(play)navigator.vibrate?.(pattern);}catch{}};
 const input=async value=>{const a=current.arcade,b=actionBeat(a.plan,Date.now()+clock-a.started);if(!play||!active||attempt===b.index||b.index<0||b.index>=a.plan.beats.length||a.players[playerId]?.lastBeat===b.index)return;attempt=b.index;setText(hint,'Enviando…');vibrate(18);playSound('click');try{await send('arcade-input',{questionId:current.question.id,input:value,beat:b.index});}catch(e){if(actionBeat(current.arcade.plan,Date.now()+clock-current.arcade.started).index===b.index&&current.arcade.players[playerId]?.lastBeat!==b.index)attempt=-1;setText(hint,e.message);}};
 for(const [value,icon,label] of options){const b=btn('arcade-input','',()=>input(value));b.dataset.action=value;b.setAttribute('aria-label',label);b.append(h('span','pad-symbol',icon),h('span','pad-label',label));b.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'||!e.isPrimary||b.disabled)return;e.preventDefault();input(value);});control.append(b);buttons.push(b);}
 // Multiple fingers can press controls; one accepted action per obstacle prevents spam.
 control.hidden=!play;tools.hidden=!play;rotate.hidden=true;
 const switchMode=btn('ghost arcade-mode-toggle','Mando TV',()=>{preference=!pad;lastPadRoom=current.code;lastPadPreference=preference;applyMode();});
 const full=btn('ghost arcade-fullscreen','⛶ Pantalla completa',async()=>{try{if(!document.fullscreenElement&&document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();await screen.orientation?.lock?.('landscape');}catch{}applyMode();});
 tools.append(switchMode,full);
 function refreshScene(){if(arena.hidden)return;try{syncArcadeStage(arena,current,clock,play?playerId:null);}catch{arena.classList.add('arcade-fallback');}}
 function applyMode(){if(!wrap.isConnected)return;pad=play&&(preference??(!current.solo&&coarse.matches&&landscape.matches));wrap.classList.toggle('tv-gamepad',pad);document.body.classList.toggle('arcade-pad-mode',pad);arena.hidden=pad;meter.hidden=pad;live.hidden=play;rotate.hidden=!play||!coarse.matches||landscape.matches||current.solo;switchMode.textContent=pad?'Ver juego en móvil':'Mando TV';full.hidden=!coarse.matches;refreshScene();}
 wrap.updateArcade=(s,o)=>{current=s;clock=o;refreshScene();};
 function keyHandler(e){if(!wrap.isConnected||e.repeat||!play)return;const map=kind==='dash'?{ArrowLeft:'left',ArrowRight:'right',' ':'jump',ArrowUp:'jump'}:kind==='dodge'?{ArrowLeft:'0',ArrowUp:'1',ArrowRight:'2'}:{' ':'shoot',Enter:'shoot'};if(map[e.key]&&e.target.tagName!=='BUTTON'){e.preventDefault();input(map[e.key]);}}
 const onRotate=()=>applyMode();landscape.addEventListener?.('change',onRotate);if(play)document.addEventListener('keydown',keyHandler);
 function dispose(){if(disposed)return;disposed=true;cancelAnimationFrame(frame);landscape.removeEventListener?.('change',onRotate);document.removeEventListener('keydown',keyHandler);if(!document.querySelector('.arcade-game.tv-gamepad'))document.body.classList.remove('arcade-pad-mode');}
 applyMode();
 function draw(now=performance.now()){
  if(!wrap.isConnected){dispose();return;}if(now-lastFrame<25){frame=requestAnimationFrame(draw);return;}lastFrame=now;
  const a=current.arcade;if(!a||current.question?.party!==kind){dispose();return;}
  const b=actionBeat(a.plan,Date.now()+clock-a.started),p=a.players[playerId],beat=a.plan.beats[b.index],finished=reveal||(!beat&&b.index>=a.plan.beats.length);
  active=!!beat&&!finished;const duration=beatDuration(a.plan,b.index);
  setText(title,finished?'FIN DEL RETO':b.index<0?'PREPÁRATE · '+Math.ceil(-b.elapsed/1000):'OBSTÁCULO '+(b.index+1)+' / '+a.plan.beats.length);
  setText(points,play?(p?.score||0)+' PTS':Math.max(0,...Object.values(a.players).map(x=>x.score))+' PTS · LÍDER');
  const streak=p?.lastBeat>=b.index-1?p?.combo||0:0;setText(combo,play&&streak>1?'🔥 COMBO ×'+streak:!play&&beat?'NIVEL '+((beat.level||0)+1)+'/4':'');
  if(b.index!==last){last=b.index;progress.replaceChildren(...a.plan.beats.map((_,i)=>h('i',i<b.index?'done':i===b.index?'current':'')));setText(hint,play?(pad?'Mira la televisión. Usa los botones.':meta.subtitle):meta.subtitle);}
  const cue=finished?'¡META!':b.index<0?String(Math.ceil(-b.elapsed/1000)):kind==='dash'?({left:'◀ ESQUIVA',right:'ESQUIVA ▶',jump:'↑ SALTA'})[beat.target]:kind==='dodge'?'BUSCA EL CARRIL LIBRE':'AFINA EL TIRO';
  setText(overlay,cue);if(arena.classList.contains('arcade-fallback')){for(const [i,lane] of [...lanes.children].entries()){const blocked=!!beat&&(kind==='dodge'?String(i)!==beat.target:kind==='dash'?beat.target==='jump'||i===(beat.target==='left'?2:0):false);lane.classList.toggle('blocked',blocked);lane.classList.toggle('safe',!!beat&&kind==='dodge'&&!blocked);setText(lane,blocked?(kind==='dodge'?'☄':'▰'):kind==='hoops'&&i===1?'◎':'');lane.style.setProperty('--approach',active?String(b.elapsed/duration):'0');}const persons=(play?current.players.filter(x=>x.id===playerId):current.players).slice(0,8);const fs=JSON.stringify(persons.map(x=>[x.name,a.players[x.id]?.lastBeat,a.players[x.id]?.lastInput,a.players[x.id]?.lastPoints,b.index]));if(fallbackPlayers.dataset.signature!==fs){fallbackPlayers.dataset.signature=fs;fallbackPlayers.replaceChildren(...persons.map(x=>{const p=a.players[x.id],n=h('span','arcade-2d-person',x.name+' '+(p?.lastBeat===b.index?(p.lastPoints>0?'✓':'✕'):'●'));return n;}));}}
  const value=active?Math.max(0,Math.min(100,b.elapsed/duration*100)):0;fill.style.left=value+'%';
  const showZone=active&&(kind==='hoops'||Number.isFinite(beat.window));zone.style.display=showZone?'block':'none';
  if(showZone){const w=beat.window||350;zone.style.left=Math.max(0,(beat.center-w)/duration*100)+'%';zone.style.width=(Math.min(duration,beat.center+w)-Math.max(0,beat.center-w))/duration*100+'%';}
  const locked=attempt===b.index||p?.lastBeat===b.index;
  for(const button of buttons){button.disabled=!active||locked;button.classList.toggle('cue',false);}
  if(active&&p?.lastBeat===b.index&&locked){setText(hint,p.lastPoints>0?'+'+p.lastPoints+' PTS'+(p.combo>1?' · COMBO ×'+p.combo:''):'¡FALLO! Sigue jugando.');if(lastFeedback!==b.index){lastFeedback=b.index;if(play)playSound(p.lastPoints>0?'locked':'wrong');wrap.dataset.hit=p.lastPoints>0?'yes':'no';vibrate(p.lastPoints>0?[20,25,35]:65);}}else delete wrap.dataset.hit;
  if(finished)setText(hint,play?'Has conseguido '+(p?.hits||0)+' aciertos de '+a.plan.beats.length:'¡Reto terminado!');
  if(!play){const standings=[...current.players].sort((x,y)=>(a.players[y.id]?.score||0)-(a.players[x.id]?.score||0));const sig=JSON.stringify(standings.map(x=>[x.id,a.players[x.id]?.score,a.players[x.id]?.combo]));if(sig!==signature){signature=sig;live.replaceChildren(...standings.map((x,i)=>{const n=h('div','arcade-live-player');n.append(h('b','',String(i+1)+'. '+x.name),h('strong','',String(a.players[x.id]?.score||0)),h('small','',(a.players[x.id]?.combo||0)>1?'×'+a.players[x.id].combo:''));return n;}));}}
  frame=requestAnimationFrame(draw);
 }
 draw();return wrap;
}
