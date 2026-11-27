// Only lock the actual playing surface; text entry, lobbies, results and
// spectators retain ordinary scrolling and browser accessibility.
export function arcadeViewport(state,playing,action){
 if(!playing||state?.phase!=='question'||state.partyStage==='intro')return '';
 if(action&&state.arcade)return 'action';
 if(state.kind==='arcade'&&['reflex','odd','number-hunt','memory','count'].includes(state.question?.party))return 'quick';
 return '';
}
export function blockArcadePan(event,root){
 if(!root?.contains(event.target)||!event.cancelable)return false;
 // Do not suppress native editing controls, modal dialogs or explicit scroll regions.
 if(event.target.closest?.('input,textarea,select,[contenteditable=true],dialog,[data-allow-scroll]'))return false;
 return true;
}

let room='',preference=null;
export function readPadPreference(code){return code===room?preference:null;}
export function writePadPreference(code,value){room=code;preference=value;}
