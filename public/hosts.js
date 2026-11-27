import {sonnyMoment,presenterRule} from './show-direction.js';
export const normalizePresenter=x=>x==='dogs'?'dogs':'sonny';
export const hostName=s=>normalizePresenter(s?.presenter)==='dogs'?'Parker y Mei':'Sonny';
const awards=[
 ['correct','Cerebro del plató','aciertos','La neurona ha venido a trabajar.'],
 ['fast','Pulsador con turbo','aciertos rápidos','El mando todavía está echando humo.'],
 ['precise','Ojo de halcón','estimaciones acertadas','Ni con una calculadora.'],
 ['stolen','Ladrón de puntos','puntos robados','Que nadie deje la cartera cerca.'],
 ['fooled','Ministerio del bulo','votos engañados','Fuente: me lo acabo de inventar.'],
 ['hits','Imán de tartas','impactos','El postre venía con efectos especiales.'],
 ['comeback','Volvió del más allá','puestos remontados','El guion no estaba preparado para esto.'],
 ['bestStreak','Modo jefe final','aciertos consecutivos','Dejad algo para los demás.'],
 ['buzzerMiss','Dedito inquieto','fallos de pulsador','El botón no era un juguete.'],
 ['wrong','Neurona de vacaciones','respuestas falladas','Lo importante es la actitud.'],
 ['arcadeWins','Rey del caos','minijuegos ganados','Que alguien revise ese mando.'],
 ['bumps','Sin respeto por el espacio personal','empujones','Aquí no se reserva sitio.']
];
export function comicAwards(players=[]){
 return awards.flatMap(([key,title,unit,joke])=>{const best=Math.max(0,...players.map(p=>Number(p.career?.[key])||0));if(!best)return [];const names=players.filter(p=>p.career?.[key]===best).map(p=>p.name);return [{key,title,unit,value:best,names,joke}];});
}
export function finaleLines(s){const p=s.players||[],winners=p.filter(x=>x.score===p[0]?.score).map(x=>x.name);return [{title:'La corona',text:winners.length?'¡Enhorabuena, '+winners.join(' y ')+'!':'¡Se acabó el concurso!'},...comicAwards(p).map(a=>({title:a.title,text:a.title+' para '+a.names.join(' y ')+'. '+a.joke}))];}
const scared=['¡Uy, qué miedo!','¡Cómo tiemblo!','Me voy a esconder detrás de Mei.','¿Hay patas de pollo para comer?','Esto me da un poquito de miedo.','¿Podemos parar para comer patas de pollo?'];
const wild=['¡Estoy super loca!','¡Quiero comer brilli brilli!','¿Me das un poco de eso para comer?','¡Estoy super loca, Parker, corre!','¡Esto es brilli brilli del bueno!','¿Eso se come? ¡Dame un poquito!'];
// Editorial cadence: one signature joke at most every five rounds, always in
// the results (never while explaining the rules). Stable across devices/reconnects.
function hostSeed(s){let n=0;for(const c of String(s.matchId||s.code||''))n=(Math.imul(n,31)+c.charCodeAt(0))>>>0;return n;}
const introductions={
 parker:['Vamos con la siguiente prueba.','Atención a las reglas.','Preparad los mandos.','Escuchad bien, que cambia la mecánica.','Tenemos una nueva oportunidad de sumar puntos.','Olfato preparado, que empieza la prueba.','Atentos, que la pelota está en vuestro tejado.','Una vuelta más al parque del conocimiento.','Preparad las patas y los mandos.','Vamos a seguir el rastro de esos puntos.','Que nadie se distraiga con el cartero.','En fila, como en un paseo de domingo.','A ver quién encuentra el premio.'],
 mei:['¡Vamos allá!','¡Esta ronda promete!','¡A por todas!','¡Venga, que se note esa energía!','¡Arrancamos una nueva prueba!','¡Guau, a por el premio!','¡Tengo la cola a mil por hora!','¡A correr detrás de los puntos!','¡Esta pregunta tiene pinta de galletita!','¡Parker, suelta la pelota, que empezamos!','¡Vamos, manada!','¡Olfato a tope!']
};
function reaction(s,previousLeader,speaker){
 const p=s.players||[],leader=p[0],i=Math.max(0,s.index||0),pick=rows=>rows[(i+hostSeed(s))%rows.length];
 if(p.some(x=>x.shieldBlocked))return 'El escudo ha protegido esos puntos. ¡Atentos al marcador!';
 if(p.some(x=>x.eventBonus))return '¡Puntos extra! Ese bonus puede cambiar la clasificación.';
 if(p.some(x=>x.stolen>0))return pick(['¡Acaba de haber un robo de puntos! Revisad la clasificación.','¡Un mordisco al marcador!','¡Alguien ha birlado el premio de otro!','¡Eso ha sido quitarle la pelota al rival!']);
 if(previousLeader&&leader&&leader.id!==previousLeader)return '¡Cambio de líder! '+leader.name+' toma la delantera.';
 const hot=p.find(x=>x.streak>=3&&x.streak%3===0&&x.reaction==='correct'),cold=p.find(x=>x.streak<=-3&&x.streak%3===0&&x.reaction==='wrong');if(s.kind!=='arcade'&&hot)return hot.name+' lleva '+hot.streak+' aciertos seguidos. ¡Galletitas para esa racha!';if(s.kind!=='arcade'&&cold)return cold.name+', '+Math.abs(cold.streak)+' fallos seguidos. ¡Sacude las patas y a por la siguiente!';
 if(s.kind==='arcade')return pick(['¡Se acabó el tiempo! Veamos quién ha conseguido la mejor marca.','¡Prueba terminada! Menudo ritmo.','Los puntos ya están en el marcador. Todavía queda mucha partida.','¡Eso ha estado muy disputado!']);
 const correct=p.filter(x=>x.reaction==='correct').length;
 if(p.length&&correct===p.length)return pick(['¡Pleno de aciertos! Así da gusto.','¡Todos habéis acertado! Gran ronda.','¡Qué nivel! Vamos a tener que subir el listón.','¡Premio para toda la manada!','¡Todos han seguido el rastro correcto!','¡Menudo festival de colas moviéndose!','¡Habéis traído la pelota todos a la primera!','¡Guau, ni en una exhibición de agility!']);
 if(p.length&&correct===0)return pick(['Esta se os ha escapado. La siguiente es otra oportunidad.','Nadie se lleva el acierto. ¡Todavía queda concurso!','Cuatro opciones y ninguna ha encontrado dueño. Bueno, seguimos.','El olfato se ha quedado en casa.','Se nos ha escapado la pelota.','Habéis cavado en el jardín equivocado.','El premio se ha ido de paseo.','Vamos a olfatear mejor la siguiente.']);
 if(p.some(x=>x.fast&&x.reaction==='correct'))return pick(['¡Vaya reflejos! Hemos tenido un acierto rapidísimo.','¡Qué velocidad! El marcador vuelve a moverse.','¡Como un galgo detrás de la pelota!','¡Ni el cartero corre tanto!','¡Ha olido el acierto desde la otra punta!','¡Eso merece una galletita!']);
 return speaker==='parker'?pick(['Vamos a comprobar cómo queda la clasificación.','Todavía queda mucho por decidir.','Cada punto cuenta, no os relajéis.','Seguid el rastro, queda mucho paseo.','No perdáis de vista el premio.','A ver qué olfatea Mei en la siguiente.','El marcador va con la correa suelta.','Yo guardaría alguna galletita para la final.']):pick(['¡Bien jugado! La cosa está interesante.','¡Esto se anima! A ver qué pasa en la próxima.','¡Menuda ronda! El podio sigue abierto.','¡Guau, esto se pone interesante!','¡Tengo ganas de otra vuelta al parque!','¡Que nadie suelte la pelota!','¡A mover esas colas, que queda concurso!','¡El premio todavía no tiene dueño!']);
}
export function presenterMoment(s,previousLeader,awardIndex=0){
 if(normalizePresenter(s.presenter)==='sonny'){
  if(s.phase==='finished'){const a=finaleLines(s)[awardIndex];return a?{mood:'celebrate',text:a.text}:null;}
  return sonnyMoment(s,previousLeader);
 }
 const i=Math.max(0,s.index||0),seed=hostSeed(s);
 if(s.phase==='finished'){
  const a=finaleLines(s)[awardIndex];if(!a)return null;
  const speaker=awardIndex%2?'mei':'parker',signature=awardIndex===6?(speaker==='parker'?scared:wild)[seed%6]:'';
  return {speaker,mood:'celebrate',text:a.text+(signature?' '+signature:'')};
 }
 if(s.phase==='lobby')return {speaker:'parker',mood:'idle',text:'¡Bienvenidos a MobiQuiz! Soy Parker. Preparad vuestros mandos, estamos a punto de empezar.',reply:{speaker:'mei',text:'¡Y yo soy Mei! Hoy tenemos un montón de pruebas. ¡Mucha suerte a todos!'}};
 if(s.phase==='question'&&s.partyStage==='intro'){
  if(!sonnyMoment(s,previousLeader))return null;
  const speaker=i%2?'mei':'parker',prefix=introductions[speaker][(Math.floor(i/2)+seed)%introductions[speaker].length];
  return {speaker,mood:'idle',text:prefix+' '+presenterRule(s),section:true};
 }
 if(s.phase!=='reveal')return null;
 const speaker=i%2?'parker':'mei',signature=i%5===3?(speaker==='parker'?scared:wild)[(Math.floor(i/5)+seed)%6]:'';
 return {speaker,mood:signature?(speaker==='parker'?'shock':'celebrate'):'idle',text:reaction(s,previousLeader,speaker)+(signature?' '+signature:'')};
}
