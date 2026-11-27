export const reactions=Object.freeze({laugh:'😂',shock:'😱',clap:'👏',fire:'🔥',tomato:'🍅'});
export const tomatoAllowed=s=>['lobby','reveal','finished'].includes(s.phase)||s.phase==='question'&&s.partyStage==='intro';
export function liveReaction(event,now){return event&&now>=event.at&&now<event.until?event:null;}
export function submitReaction(room,userId,data,now,shared,id){
 const sender=room.players?.[userId],kind=data.kind;
 if(!shared||room.solo||!sender)throw Error('Las reacciones requieren una partida en TV.');
 if(data.matchId!==room.matchId||!Object.hasOwn(reactions,kind))throw Error('Reacción no disponible.');
 if(kind==='tomato'&&!tomatoAllowed(room))throw Error('Los tomates se lanzan entre preguntas.');
 if(liveReaction(room.socialReaction,now))throw Error('Espera a que termine la reacción.');
 if(now<(sender.socialUntil||0))throw Error('Espera unos segundos antes de reaccionar.');
 let target=null;if(kind==='tomato'){target=Object.values(room.players).find(p=>p.publicId===data.target);if(!target||target===sender)throw Error('Elige a otro concursante.');}
 sender.socialUntil=now+(kind==='tomato'?18000:6500);
 return room.socialReaction={id,kind,from:sender.publicId,target:target?.publicId||null,at:now,until:now+(kind==='tomato'?3400:2100)};
}
export function resultEmote(p){if(p.hits)return 'hit';if(p.stolen)return 'celebrate';if(p.lost||p.reaction==='wrong')return 'facepalm';if(p.reaction==='timeout')return 'shrug';if(p.reaction==='correct')return p.avatar?.personality==='dancer'?'dance':p.avatar?.personality==='cool'?'cool':'celebrate';return 'idle';}
