// Deterministic UI helpers, independent of the game clock.
export function reconnectDelay(attempt,random=Math.random){return Math.round(Math.min(12000,600*2**Math.min(5,Math.max(0,attempt)))*(.85+.3*random()));}
export function roomRenderKey(s,role){return [role,s.matchId,s.phase,s.index,s.partyStage,s.buzzer].join(':');}
export function rankSignature(players){return JSON.stringify(players.map(p=>[p.id,p.name,p.score,p.answered,p.reaction,p.hits,p.avatar]));}
export function resultAnswer(q,answerLabel){if(!q||['dash','dodge','hoops','reflex','odd','memory','count','number-hunt'].includes(q.party))return '¡Prueba terminada!';if(q.party==='draw')return 'La palabra era: '+q.correct;if(q.party==='bluff')return 'La respuesta era: '+q.correct;try{const text=answerLabel(q);return text===undefined||text===null||text==='undefined'?'¡Ronda terminada!':'Respuesta: '+text;}catch{return '¡Ronda terminada!';}}
export function vibrate(pattern){try{if(typeof navigator!=='undefined')navigator.vibrate?.(pattern);}catch{}}
export function connectionText(status){return ({connecting:'Conectando…',retrying:'Recuperando conexión…',offline:'Sin conexión · reintentando',online:'En directo'})[status]||'Conectando…';}
