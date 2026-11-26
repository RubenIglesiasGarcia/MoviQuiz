// Shared broadcast timing and editorial direction. No game-state mutations.
const styles={
 tiebreak:['#ffdb78','MUERTE SÚBITA','Solo los líderes empatados pueden responder.'],classic:['#8ecbff','CONCURSO','Piensa rápido. Acierta.'],warmup:['#8ecbff','CALENTAMIENTO','El primer paso hacia la victoria.'],
 'order-round':['#c4acff','PONLO EN ORDEN','Cada posición cuenta.'],estimate:['#76e3d2','LA CIFRA JUSTA','La precisión marca la diferencia.'],
 buzzer:['#ffbf73','EL GRAN PULSADOR','Pulsa si lo tienes claro. Fallar cuesta hasta 100 puntos.'],steal:['#ff8da9','ROBAPUNTOS','El marcador puede cambiar de golpe.'],
 final:['#ffdb78','GRAN FINAL','Todo se decide ahora.'],wager:['#ffbf73','LA GRAN SUBASTA','¿Cuánto estás dispuesto a arriesgar?'],
 bluff:['#c4acff','EL FARSANTE','No te fíes de las apariencias.'],hot:['#ff9b73','PATATA CALIENTE','Que no te pille el reloj.'],
 pie:['#ff9db7','TARTAZO','Acierta y elige tu objetivo.'],draw:['#79d9ef','DIBUJA COMO PUEDAS','Una pista puede cambiarlo todo.'],
 dash:['#79d9ef','CARRERA DE VALLAS','El ritmo lo es todo.'],dodge:['#c4acff','LLUVIA DE METEORITOS','Encuentra el hueco y esquiva.'],
 hoops:['#ffbf73','CANASTA ESTELAR','Apunta al instante perfecto.'],coins:['#ffdb78','FIEBRE DEL ORO','Cada moneda cuenta.'],territory:['#ff9db7','GUERRA DE COLORES','Conquista el terreno de tus rivales.'],sofa:['#efb3e5','REY DEL SOFÁ','Aquí no se reserva asiento.'],
 memory:['#c4acff','MEMORIA RELÁMPAGO','Graba cada símbolo en tu memoria.'],odd:['#76e3d2','EL INTRUSO','Uno de ellos no encaja.'],
 reflex:['#76e3d2','LUZ VERDE','No te adelantes a la señal.'],count:['#8ecbff','CUENTA ATRÁS','Observa antes de contar.'],
 'number-hunt':['#79d9ef','ESCALERA EXPRÉS','El orden es la clave.'],custom:['#c4acff','RONDA DE AMIGOS','Aquí nadie tiene ventaja.']
};
export function showScene(state){
 const q=state?.question||{},phase=state?.phase,party=q.party||'classic',style=styles[party]||styles.classic;
 const last=state?.total>0&&state.index===state.total-1,opening=state?.index===0,finale=phase==='finished'||party==='final'||last;
 const theme=finale?'#ffdb78':style[0],kind=phase==='lobby'?'lobby':phase==='finished'?'winner':phase==='reveal'?'results':state?.partyStage==='intro'?'intro':'play';
 return {kind,theme,finale,opening,title:party==='tiebreak'?'MUERTE SÚBITA':party==='final'?'GRAN FINAL · ×'+(q.multiplier||2):last?'ÚLTIMA RONDA · '+style[1]:style[1],tag:state?.kind==='arcade'?'MOBIQUIZ / ARCADE':'MOBIQUIZ / EL PLATÓ',subtitle:style[2]};
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

 // A deterministic editorial cue, identical on every connected device.
export function roundBeat(state){
 const q=state?.question||{},index=Math.max(0,state?.index||0),total=state?.total||0,scene=showScene(state),special=['steal','final','wager','buzzer','hot','pie','bluff'].includes(q.party);
 const quick=(state?.introDuration||3000)<2000;
 const opening=index===0,last=total>0&&index===total-1;
 const variants=['¡Aquí no vale mirar al de al lado!','Los puntos no se ganan solos.','¡Concentración, que esto se pone serio!','La gloria está a un botón de distancia.','¡El mando no muerde!','A ver quién sorprende al plató.','Todavía queda mucha partida.','¡Que nadie se duerma!'];
 const title=last?'¡LA ÚLTIMA!':opening?'¡QUE EMPIECE EL SHOW!':special?scene.title:quick?['¡SIGUIENTE!','¡VAMOS ALLÁ!','¡OTRA MÁS!','¡AL LÍO!'][index%4]:scene.title;
 return {title,quick,special,caption:last?'Un último esfuerzo.':special?scene.subtitle:variants[index%variants.length]};
}

const sonnyRules={
 tiebreak:['Plot twist. Aquí nadie se va todavía.','Solo los líderes empatados responden; un acierto puede decidir el concurso.'],
 classic:['El que sabe, sabe. El que no, disimula.','Elegid una de las respuestas antes de que acabe el tiempo.'],
 warmup:['Vamos a ver si las neuronas han venido con vosotros.','Acertad y sumad puntos para arrancar.'],
 'order-round':['Hoy toca poner un poquito de orden en vuestras vidas.','Colocad los cuatro elementos en el orden correcto.'],
 estimate:['La calculadora se ha quedado fuera del plató.','Escribid una cifra; cuanto más os acerquéis, mejor.'],
 buzzer:['Se viene el pulsador. No os flipéis.','Pulsad cuando lo tengáis claro; fallar resta puntos.'],
 steal:['Se viene una amistad rota.','El acierto más rápido roba puntos al rival mejor situado.'],
 final:['Ahora sí, momento cine.','Las respuestas de la final valen más puntos.'],
 wager:['El que no arriesga no gana. El que arriesga sin saber, tampoco.','Elegid los puntos que queréis apostar antes de responder.'],
 bluff:['Fuente: me lo acabo de inventar.','Inventad una respuesta creíble y luego descubrid la auténtica.'],
 hot:['La patata quema. Literalmente no, que es un videojuego.','Responded y pasad la patata antes de que se agote el tiempo.'],
 pie:['Esto no es una pastelería, pero casi.','Acertad y elegid a quién lanzar una tarta.'],
 draw:['Picasso, si estás viendo esto, perdón.','Una persona dibuja; las demás intentan adivinar.'],
 dash:['Hoy el cardio es obligatorio.','Saltad y esquivad las vallas a tiempo.'],
 dodge:['El suelo no es lava, pero el cielo está regular.','Esquivad los meteoritos.'],
 hoops:['Baloncesto sin tener que salir del sofá.','Pulsad en el momento justo para encestar.'],
 coins:['Aquí sí se viene a por el dinero.','Recoged monedas y evitad los obstáculos.'],
 territory:['La diplomacia ha abandonado el chat.','Conquistad la mayor cantidad de territorio.'],
 sofa:['Mi especialidad, por fin.','Conseguid ocupar el sofá y conservad vuestro sitio.'],
 memory:['Memoria de pez no, por favor.','Memorizad los símbolos y reproducidlos.'],
 odd:['Uno de estos elementos no ha leído el grupo de WhatsApp.','Encontrad el elemento diferente.'],
 reflex:['Quietos. No os adelantéis.','Esperad la señal verde y pulsad lo más rápido posible.'],
 count:['Los números no muerden. Creo.','Observad y contad los elementos.'],
 'number-hunt':['Orden y rapidez, una combinación peligrosa.','Pulsad los números en el orden indicado.'],
 custom:['Vuestros amigos han preparado esto. Yo no me responsabilizo.','Responded a la pregunta personalizada.'],
 'solo-bonus':['Un bonus, por la cara.','Acierta para sumar puntos extra.']
};
const sonnyJokes={
 soloWrong:['Un pequeño fallo para ti, un gran momento para mi cara de decepción.','Esto no ha salido en el tutorial, ¿verdad?','No pasa nada. Yo tampoco me sé dónde dejé mi ratón de juguete.','El plan era bueno. La respuesta no tanto.'],
 soloRight:['Eso es. Te dejo quedarte en el plató.','La neurona está trabajando horas extra.','Bien jugado. Casi a mi nivel.'],
 zero:['Mi cara cuando nadie acierta. En fin, siguiente.','Cuatro opciones y habéis conseguido esquivarlas todas.','El conocimiento ha abandonado el chat.','Me voy a hacer el dormido, como si no hubiera visto esto.','Ni con siete vidas. Y mira que lo he intentado.'],
 all:['¡Cine! No tengo ni una sola queja.','Señoras y señores, tenemos un equipo de élite.','Me estáis quitando el trabajo.','Todos han acertado. Esto parece sospechosamente organizado.'],
 lead:['Tenemos nuevo líder. La corona no venía con garantía.','Cambio de líder. Se ha desbloqueado el drama.','El marcador acaba de hacer un giro de guion.'],
 comeback:['La remontada era real, no un montaje.','Ese regreso no estaba en el guion.','Plot twist: esto todavía no ha terminado.'],
 fast:['Ha contestado antes de que yo terminara de pestañear.','Ese pulsador acaba de superar el límite de velocidad.','Reflejos de gato. Y eso lo digo yo.'],
 steal:['Eso no ha sido un robo, ha sido una mudanza de puntos.','El grupo de WhatsApp va a estar interesante.','Los puntos no desaparecen: cambian de bolsillo.'],
 close:['Esto está más apretado que yo en una caja de zapatos.','Ni el VAR puede decidir quién va a ganar.','El final va a necesitar palomitas.'],
 normal:['Bueno, se ha intentado. Y eso ya es contenido.','Aquí nadie se relaja, ni yo.','Procedo a juzgaros en silencio.','Es momento de recuperar la dignidad.','Todavía hay margen para la épica.','No digo nada, pero las pruebas están ahí.'],
 streak:['Tenemos a alguien en modo jefe final.','Esa racha ya empieza a dar miedo.','Alguien se ha leído el manual entero.'],
 finish:['Hasta aquí el espectáculo. Yo me voy a por una siesta.','La corona tiene dueño. El resto, a entrenar.','Gracias por jugar. Recordad que perder también da experiencia.']
};
const line=(xs,i)=>xs[((i%xs.length)+xs.length)%xs.length];
export function sonnyMoment(state,previousLeader=null){
 const s=state||{},q=s.question||{},p=s.players||[],i=Math.max(0,s.index||0),key=q.party||'classic',leader=p[0],normal=s.kind!=='arcade',correct=p.filter(x=>x.reaction==='correct').length;
 if(s.phase==='lobby')return {text:'Soy Sonny. Bienvenidos a MobiQuiz. Preparad los mandos y dejad las excusas fuera.',mood:'smug'};
 if(s.phase==='finished')return {text:line(sonnyJokes.finish,i),mood:'celebrate'};
 if(s.phase==='question'&&s.partyStage==='intro'&&showEventInfo(s)){const info=showEventInfo(s);return {text:info.joke+' '+info.rule,mood:'smug',section:true};}
 if(s.phase==='question'&&s.partyStage==='intro'&&key==='warmup'&&q.multiplier===2)return {text:'¡Lluvia de puntos! Esta pregunta vale el doble. Que no se diga que no aviso.',mood:'celebrate',section:true};
 if(s.phase==='question'&&s.partyStage==='intro'&&(s.introDuration||3000)>=3000){const [a,b]=sonnyRules[key]||sonnyRules.classic;return {text:a+' '+b,mood:key==='final'?'celebrate':'smug',section:true};}
 if(s.phase!=='reveal')return null;
 let type=null,mood='smug';
 if(p.some(x=>x.shieldBlocked))return {text:'Acceso denegado. El escudo acaba de salvar esos puntos.',mood:'smug'};
 if(p.some(x=>x.eventBonus))return {text:'Bonus desbloqueado. El marcador acaba de recibir un parche.',mood:'celebrate'};
 if(p.some(x=>x.stolen>0))type='steal';
 else if(previousLeader&&leader?.id!==previousLeader&&leader)type='lead';
 else if(p.some((x,j)=>(x.previousRank??j)-j>=2))type='comeback';
 else if(normal&&s.solo&&p.length===1&&p[0].reaction==='wrong'&&i%2===0){type='soloWrong';mood='shock';}
 else if(normal&&s.solo&&p.length===1&&correct===1&&i%3===1){type='soloRight';mood='celebrate';}
 else if(normal&&p.length>1&&correct===0){type='zero';mood='shock';}
 else if(normal&&p.length>1&&correct===p.length){type='all';mood='celebrate';}
 else if(p.some(x=>x.fast&&x.reaction==='correct')){type='fast';mood='celebrate';}
 else if(p.some(x=>x.reaction==='correct'&&(x.career?.streak||0)>=4))type='streak';
 else if(p.length>1&&Math.abs(p[0].score-p[1].score)<=150&&i%3===1)type='close';
 else if(i%3===2)type='normal';
 if(!type)return null;
 return {text:line(sonnyJokes[type],i),mood};
}

export function showEventInfo(s){
 const event=s?.showEvent;if(!event)return null;
 const names=(s.players||[]).filter(p=>event.ids.includes(p.id)).map(p=>p.name).join(' · ');
 const types={duel:{title:'DUELO DE RIVALES',icon:'⚔',joke:'Aquí hay asuntos pendientes.',rule:'Todos jugáis; el más rápido del duelo que acierte gana 150 puntos extra.'},comeback:{title:'LA REVANCHA',icon:'↗',joke:'Se abre la operación remontada.',rule:'Quienes van últimos ganan 150 puntos extra si aciertan.'},shield:{title:'EL INTOCABLE',icon:'🛡',joke:'Hoy el seguro de puntos viene incluido.',rule:'Los protegidos no pueden perder puntos por un robo en esta ronda.'}};
 const info=types[event.kind];return info?{...info,names}:null;
}
