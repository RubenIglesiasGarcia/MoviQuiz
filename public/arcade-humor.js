// Short, friendly, event-driven lines. Never change scores or mock inactive players.
const lines={
 dash:{perfect:['¡Ni las prisas del lunes!','¡Salto de película!','¡Qué piernas!'],hit:['¡Valla superada!','¡Por los pelos!','¡Sigue corriendo!'],miss:['¡La valla no se aparta!','¡Eso era una valla, no una puerta!','¡A levantarse!']},
 dodge:{perfect:['¡Ni un rasguño espacial!','¡Digno de un astronauta!','¡Qué cintura galáctica!'],hit:['¡Meteorito esquivado!','¡Aún en órbita!','¡Casi te despeina!'],miss:['¡Abrazo de meteorito!','¡Houston, tenemos un problemilla!','¡Eso sí que ha sido un impacto!']},
 hoops:{perfect:['¡De tres y con estilo!','¡El aro pide autógrafos!','¡Qué muñeca!'],hit:['¡Dentro!','¡También valen las feas!','¡Canasta con suspense!'],miss:['¡Aparca el balón, no lo mandes a Marte!','¡El aro sigue esperando!','¡Rebote imaginario!']}
};
export function arcadeQuip(kind,points,beat=0){
 const set=lines[kind];if(!set)return points?'¡Bien hecho!':'¡Otra oportunidad!';
 const group=points>=150?'perfect':points>0?'hit':'miss',choices=set[group];return choices[Math.abs(Math.trunc(beat)||0)%choices.length];
}
export function arcadeAward(state){
 const a=state?.arcade;if(!a||!Array.isArray(state.players))return null;
 const eligible=state.players.map(person=>({person,p:a.players?.[person.id]})).filter(x=>x.p&&x.p.attempts>0);
 if(!eligible.length)return null;
 const unique=(field,min)=>{const list=[...eligible].sort((x,y)=>(y.p[field]||0)-(x.p[field]||0));return (list[0].p[field]||0)>=min&&(!list[1]||list[0].p[field]>list[1].p[field])?list[0]:null;};
 const variant=a.plan.variant,kind=a.plan.kind;
 let pick,label,detail;
 if(variant==='sofa'){pick=unique('bumps',2);if(pick){label='SIN RESERVA';detail=pick.p.bumps+' empujones con turbo';}}
 else if(variant==='territory'){pick=unique('repaints',3);if(pick){label='PINTOR DE BROCHA GORDA';detail=pick.p.repaints+' casillas robadas';}}
 else if(variant==='tuna'){pick=unique('hits',2);if(pick){label='PROVEEDOR OFICIAL DE ATÚN';detail=pick.p.hits+' latas entregadas';}}
 else if(variant==='splash'){pick=unique('bumps',2);if(pick){label='SOCORRISTA NO AUTORIZADO';detail=pick.p.bumps+' empujones';}}
 else if(variant==='bomb'){pick=unique('bumps',2);if(pick){label='REPARTIDOR SOSPECHOSO';detail=pick.p.bumps+' paquetes entregados';}}
 else if(variant==='lava'){pick=unique('hits',3);if(pick){label='PIES DE AMIANTO';detail=pick.p.hits+' segundos a salvo';}}
 else if(kind!=='coins'){pick=unique('bestCombo',3);if(pick){label='EN MODO LEYENDA';detail='Combo de '+pick.p.bestCombo;}}
 if(!pick){pick=unique('score',1);if(!pick)return null;label=variant==='lava'?'PIES DE AMIANTO':variant==='bomb'?'NO SE ACEPTAN DEVOLUCIONES':variant==='sofa'?'DUEÑO DEL SALÓN':variant==='territory'?'REY DEL RODILLO':kind==='coins'?'ASPIRADORA DE MONEDAS':kind==='dash'?'PIERNAS DE GOMA':kind==='dodge'?'TURISTA GALÁCTICO':'MUÑECA DE ORO';detail=Math.round(pick.p.score).toLocaleString('es-ES')+' puntos';}
 return {label,name:pick.person.name,detail};
}
