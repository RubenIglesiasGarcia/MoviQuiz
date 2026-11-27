// Shared screen presence is derived from live room connections, never orientation.
export function screenCount(sockets,excluded=null){
 return sockets.filter(ws=>{try{return ws!==excluded&&ws.readyState===1&&ws.deserializeAttachment()?.screen===true;}catch{return false;}}).length;
}
export function sharedDisplayFor(state,role){return !!state?.sharedDisplay&&!state.solo&&role!=='screen';}
export function useTvPad(state,playing,preference=null){return !!playing&&sharedDisplayFor(state,'player')&&preference!==false;}
export function localPresenter(state,role){return role==='screen'||(!sharedDisplayFor(state,role)&&['host','player'].includes(role));}
export function screenPresenceMessage(role,visible){return role==='screen'?{type:'screen-presence',visible:!!visible}:null;}
