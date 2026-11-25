// Shared broadcast timing and editorial direction. No game-state mutations.
const styles={
 classic:['#8ecbff','CONCURSO','Piensa rápido. Acierta.'],warmup:['#8ecbff','CALENTAMIENTO','El primer paso hacia la victoria.'],
 'order-round':['#c4acff','PONLO EN ORDEN','Cada posición cuenta.'],estimate:['#76e3d2','LA CIFRA JUSTA','La precisión marca la diferencia.'],
 buzzer:['#ffbf73','EL GRAN PULSADOR','El primero en pulsar tiene la oportunidad.'],steal:['#ff8da9','ROBAPUNTOS','El marcador puede cambiar de golpe.'],
 final:['#ffdb78','GRAN FINAL','Todo se decide ahora.'],wager:['#ffbf73','LA GRAN SUBASTA','¿Cuánto estás dispuesto a arriesgar?'],
 bluff:['#c4acff','EL FARSANTE','No te fíes de las apariencias.'],hot:['#ff9b73','PATATA CALIENTE','Que no te pille el reloj.'],
 pie:['#ff9db7','TARTAZO','Acierta y elige tu objetivo.'],draw:['#79d9ef','DIBUJA COMO PUEDAS','Una pista puede cambiarlo todo.'],
 dash:['#79d9ef','CARRERA DE VALLAS','El ritmo lo es todo.'],dodge:['#c4acff','LLUVIA DE METEORITOS','Encuentra el hueco y esquiva.'],
 hoops:['#ffbf73','CANASTA ESTELAR','Apunta al instante perfecto.'],coins:['#ffdb78','FIEBRE DEL ORO','Cada moneda cuenta.'],
 memory:['#c4acff','MEMORIA RELÁMPAGO','Graba cada símbolo en tu memoria.'],odd:['#76e3d2','EL INTRUSO','Uno de ellos no encaja.'],
 reflex:['#76e3d2','LUZ VERDE','No te adelantes a la señal.'],count:['#8ecbff','CUENTA ATRÁS','Observa antes de contar.'],
 'number-hunt':['#79d9ef','ESCALERA EXPRÉS','El orden es la clave.'],custom:['#c4acff','RONDA DE AMIGOS','Aquí nadie tiene ventaja.']
};
export function showScene(state){
 const q=state?.question||{},phase=state?.phase,party=q.party||'classic',style=styles[party]||styles.classic;
 const last=state?.total>0&&state.index===state.total-1,opening=state?.index===0,finale=phase==='finished'||party==='final'||last;
 const theme=finale?'#ffdb78':style[0],kind=phase==='lobby'?'lobby':phase==='finished'?'winner':phase==='reveal'?'results':state?.partyStage==='intro'?'intro':'play';
 return {kind,theme,finale,opening,title:party==='final'?'GRAN FINAL · ×'+(q.multiplier||2):last?'ÚLTIMA RONDA · '+style[1]:style[1],tag:state?.kind==='arcade'?'MOBIQUIZ / ARCADE':'MOBIQUIZ / EL PLATÓ',subtitle:style[2]};
}
export function resultTimeline(state,now){
 const start=Number(state.revealStarted)||0,end=Number(state.revealUntil)||0;const duration=start&&end>start?end-start:10000;
 const elapsed=Math.max(0,now-(start||(end?end-duration:now)));
 const quick=duration<8000,pointStart=quick?1000:2200,pointDuration=quick?1200:2000,rankAt=quick?2600:5200;
 return {elapsed,duration,pointStart,pointDuration,rankAt,stage:elapsed>=rankAt?'rank':elapsed>=pointStart?'points':'answer'};
}
export function resultSpotlight(players=[]){
 if(!players.length)return null;
 const top=Math.max(0,...players.map(p=>p.last||0)),leaders=players.filter(p=>(p.last||0)===top),overall=players[0];
 if(!top)return {kind:'neutral',title:'SIGUE EL CONCURSO',detail:'Todo está por decidir.'};
 if(leaders.length===1){const p=leaders[0];return {kind:'round',title:'MEJOR DE LA RONDA',detail:p.name+' · +'+top.toLocaleString('es-ES')+' pts',ids:[p.id]};}
 return {kind:'tie',title:'EMPATE EN LA RONDA',detail:leaders.length+' jugadores · +'+top.toLocaleString('es-ES')+' pts',ids:leaders.map(p=>p.id)};
}
export function standingsSpotlight(players=[]){
 if(!players.length)return null;
 const leader=players[0],tied=players.filter(p=>p.score===leader.score);
 if(tied.length>1)return {kind:'tie',title:'LIDERATO COMPARTIDO',detail:tied.map(p=>p.name).join(' · '),ids:tied.map(p=>p.id)};
 const margin=players[1]?leader.score-players[1].score:null;
 return {kind:'leader',title:'AL FRENTE DEL MARCADOR',detail:leader.name+(margin!==null?' · '+margin.toLocaleString('es-ES')+' pts de ventaja':''),ids:[leader.id]};
}
export function applyShowScene(root,state){const scene=showScene(state);if(root.dataset.showScene!==scene.kind)root.dataset.showScene=scene.kind;if(root.dataset.showFinal!==String(scene.finale))root.dataset.showFinal=String(scene.finale);if(root.style.getPropertyValue('--show-accent')!==scene.theme)root.style.setProperty('--show-accent',scene.theme);return scene;}
