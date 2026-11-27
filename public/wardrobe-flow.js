// The profile edits the account, not the historical contestant snapshot.
export const isLivePhase=phase=>phase==='question'||phase==='reveal';
export function wardrobeAccess(origin,state,playing){return origin==='profile'||!state||state.phase==='lobby'&&playing;}
export function syncWardrobeToRoom(state,playing){return !!state&&state.phase==='lobby'&&playing;}
export function shouldCloseWardrobe(guard,state){return !!guard&&guard===state?.matchId&&isLivePhase(state.phase);}
export function mergeRoomAvatar(previous,avatar){return {...avatar,...(previous?.personality?{personality:previous.personality}:{})};}

// Only a confirmed invalid session may discard the saved account token.
export const shouldForgetSession=status=>status===401;

// Coalesce fast changes and serialize requests so an older response never overwrites a newer look.
export function wardrobeAutosave(write,onState=()=>{}){let pending={},running=null;const dirty=()=>Object.keys(pending).length>0;function enqueue(patch){Object.assign(pending,patch);onState('pending');}async function drain(){if(running)return running;running=(async()=>{while(dirty()){const patch=pending;pending={};onState('saving');try{await write(patch);}catch(e){pending={...patch,...pending};onState('error',e);return false;}}onState('saved');return true;})();try{return await running;}finally{running=null;}}return {enqueue,flush:drain,dirty};}
