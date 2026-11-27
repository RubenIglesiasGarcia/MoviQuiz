// Shared, presentation-only direction. Never changes simulation, scores or input axes.
const themes={
 coins:{name:'CÁMARA ACORAZADA',sky:0x201b35,floor:0x4a4260,edge:0xffc65c,ambient:0xffe6ba,ground:0x5d4873,bpm:136},
 territory:{name:'FÁBRICA DE COLOR',sky:0x22213f,floor:0x41425b,edge:0xc7a1ff,ambient:0xf5dfff,ground:0x5c5279,bpm:142},
 sofa:{name:'SALÓN DEL CAOS',sky:0x3f284b,floor:0x84617d,edge:0xf7b1c4,ambient:0xffdbbd,ground:0x714b69,bpm:124},
 lava:{name:'CALDERA VOLCÁNICA',sky:0x3b202a,floor:0x47343f,edge:0xff994c,ambient:0xffc28b,ground:0x6f3436,bpm:148},
 bomb:{name:'CENTRAL DE PAQUETERÍA',sky:0x18303e,floor:0x315363,edge:0xffcf68,ambient:0xd9f4ff,ground:0x365065,bpm:144},
 tuna:{name:'PUERTO DE SONNY',sky:0x294b63,floor:0x96745a,edge:0xffd385,ambient:0xffe5c4,ground:0x587483,bpm:132},
 splash:{name:'BAHÍA HELADA',sky:0x315b7d,floor:0x337f9c,edge:0xa8e8ff,ambient:0xe4f8ff,ground:0x5387a4,bpm:138}
};
export const arenaTheme=kind=>themes[kind]||themes.coins;
export function arenaPhase(elapsed,duration,playing=true){
 const left=Math.max(0,duration-elapsed);
 if(!playing||elapsed>=duration)return {kind:'end',label:'¡FIN!',left};
 if(elapsed<0)return {kind:'ready',label:String(Math.max(1,Math.ceil(-elapsed/1000))),left:duration};
 if(elapsed<850)return {kind:'go',label:'¡YA!',left};
 if(left<=5000)return {kind:'urgent',label:String(Math.ceil(left/1000)),left};
 return {kind:'play',label:'',left};
}
export function arenaImpact(previous,next,serverNow){
 const stamp=Number(next?.bumpedAt)||0;
 return !!previous&&stamp>(Number(previous.bumpedAt)||0)&&serverNow-stamp>=-150&&serverNow-stamp<850;
}
export function arenaMusicKey(state){
 const v=state?.arcade?.plan?.variant;
 return state?.phase==='question'&&state.kind==='arcade'&&themes[v]?'arena-'+v:'arcade';
}

// The play camera never changes heading or zoom during a live round. Intro motion
// pulls back from a wider frame, so it cannot conceal any playable position.
export function arenaCameraScale(elapsed,motion=true){if(!motion||elapsed>=0)return 1;const progress=Math.max(0,Math.min(1,(elapsed+3500)/3500));return 1+.13*(1-progress)**2;}
