// The profile edits the account, not the historical contestant snapshot.
export const isLivePhase=phase=>phase==='question'||phase==='reveal';
export function wardrobeAccess(origin,state,playing){return origin==='profile'||!state||state.phase==='lobby'&&playing;}
export function syncWardrobeToRoom(state,playing){return !!state&&state.phase==='lobby'&&playing;}
export function shouldCloseWardrobe(guard,state){return !!guard&&guard===state?.matchId&&isLivePhase(state.phase);}
export function mergeRoomAvatar(previous,avatar){return {...avatar,...(previous?.personality?{personality:previous.personality}:{})};}

// Only a confirmed invalid session may discard the saved account token.
export const shouldForgetSession=status=>status===401;
