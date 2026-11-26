// Shared show audio is local by default, except on the device casting this room.
export function shouldPlayShowAudio({role,view,visible,hasState,casting=false,alsoLocal=false}){
 return !!hasState&&visible&&view===role&&['screen','host','player'].includes(role)&&(role==='screen'||!casting||alsoLocal);
}
