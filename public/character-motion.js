// Time-sampled original choreography. Every channel is relative to the avatar's
// rest pose; no accumulated transforms or frame-rate-dependent motion.
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const smooth=x=>{const t=clamp(x);return t*t*(3-2*t);};
const TAU=Math.PI*2;
// Channels: body height, pitch, yaw, roll, head pitch/yaw/roll,
// left arm pitch/roll, right arm pitch/roll, left/right leg pitch.
const ZERO=Object.freeze(Array(13).fill(0));
const frame=(t,...v)=>[t,...v];
const k=(t,v)=>[t,...ZERO.map((_,i)=>v[i]||0)];
const clips={
 bounce:[k(0,{}),k(.24,{0:-.08,1:.12,7:-.35,9:-.35,11:-.18,12:-.18}),k(.65,{0:.39,1:-.06,4:-.16,8:-1.65,10:1.65,11:-.28,12:.18}),k(1.06,{0:-.075,1:.14,8:-.35,10:.35,11:-.12,12:-.12}),k(1.37,{0:.20,4:-.13,8:-1.2,10:1.2,11:.12,12:-.16}),k(1.75,{0:-.025,8:-.6,10:.6}),k(2.35,{})],
 doublejump:[k(0,{}),k(.18,{0:-.06,1:.12,11:-.18,12:-.18}),k(.48,{0:.32,8:-1.55,10:1.55,11:.25,12:-.25}),k(.78,{0:-.045,1:.12}),k(1.12,{0:.44,8:-1.85,10:1.85,4:-.13,11:-.25,12:.25}),k(1.45,{0:-.06,1:.09,8:-.45,10:.45}),k(2.05,{})],
 fistpump:[k(0,{}),k(.3,{1:.05,3:-.07,9:-.7,10:.65,8:-.35}),k(.70,{0:.12,3:.09,4:-.13,9:-.18,10:1.95,8:-.55,11:.12}),k(1.02,{0:.02,9:-.75,10:.95}),k(1.38,{0:.10,4:-.10,9:-.12,10:2.05,8:-.4}),k(2.25,{})],
 spin:[k(0,{}),k(.28,{0:-.04,2:-.25,3:-.06,8:-.65,10:.65}),k(.76,{0:.24,2:1.65,8:-1.45,10:1.45,11:.14,12:-.12}),k(1.35,{0:.18,2:4.65,8:-1.45,10:1.45}),k(1.85,{0:-.03,2:TAU,8:-.6,10:.6}),k(2.4,{2:TAU})],
 disco:[k(0,{}),k(.40,{0:.06,3:-.14,6:.12,8:-1.9,10:.65,11:.17,12:-.1}),k(.85,{3:.14,6:-.12,8:-.65,10:1.9,11:-.1,12:.17}),k(1.30,{0:.09,3:-.14,6:.12,8:-1.85,10:.65,11:.18,12:-.14}),k(1.75,{3:.14,6:-.12,8:-.65,10:1.85}),k(2.4,{})],
 champion:[k(0,{}),k(.30,{0:-.045,1:.09,7:-.35,9:-.35}),k(.73,{0:.29,4:-.16,8:-2.1,10:2.1,11:-.17,12:.17}),k(1.10,{0:-.05,8:-1.5,10:1.5}),k(1.75,{2:.19,4:-.12,8:-1.9,10:1.9}),k(2.8,{})],
 dab:[k(0,{}),k(.35,{0:.08,8:-.65,10:.75}),k(.75,{3:-.18,4:.3,6:-.22,8:-1.95,9:-1.15,10:1.2,11:.08,12:-.1}),k(1.5,{3:-.16,4:.26,6:-.22,8:-1.95,9:-1.15,10:1.2}),k(2.2,{})],
 robot:[k(0,{}),k(.35,{2:-.2,8:-.9,10:1.45,11:.2,12:-.1}),k(.72,{2:.22,8:-1.55,10:.85,11:-.1,12:.2}),k(1.09,{2:-.2,8:-.9,10:1.45,11:.2,12:-.1}),k(1.46,{2:.22,8:-1.55,10:.85,11:-.1,12:.2}),k(2.3,{})],
 facepalm:[k(0,{}),k(.25,{1:-.035,4:-.11,6:.08}),k(.72,{1:.12,4:.29,6:-.13,7:-1.55,8:-.38,9:-.08}),k(1.55,{1:.12,4:.30,6:-.10,7:-1.55,8:-.38}),k(2.7,{})],
 slump:[k(0,{}),k(.3,{4:-.09,8:-.13,10:.13}),k(.87,{0:-.07,1:.20,4:.35,6:-.12,11:-.1,12:-.1,7:.12,9:.12}),k(1.7,{0:-.06,1:.18,4:.34,6:-.08,11:-.08,12:-.08}),k(2.8,{})],
 shrug:[k(0,{}),k(.45,{4:-.08,6:.17,7:-.38,8:-.95,9:-.38,10:.95}),k(1.1,{5:.12,6:-.16,7:-.38,8:-.95,9:-.38,10:.95}),k(1.6,{6:.09,7:-.3,8:-.7,9:-.3,10:.7}),k(2.5,{})],
 sleepy:[k(0,{}),k(.55,{1:.06,4:.26,6:.11}),k(1.05,{1:.12,4:.40,6:.10}),k(1.35,{4:.08,6:-.05}),k(1.9,{4:.30,6:.10}),k(2.8,{})],
 rage:[k(0,{}),k(.35,{0:.09,1:.12,7:-1.1,9:-.55,8:-.4,10:.4}),k(.72,{0:.12,3:.10,7:-.45,9:-1.15,8:-.4,10:.4}),k(1.06,{0:.07,3:-.10,7:-1.15,9:-.45,8:-.4,10:.4}),k(1.4,{0:-.03,1:.11,4:.23,7:-.4,9:-.4}),k(2.5,{})],
 dramatic:[k(0,{}),k(.4,{1:-.08,4:-.16,8:-1.25,10:1.25}),k(.9,{0:-.09,1:.22,4:.20,3:-.15,7:-.65,8:-.7,9:-.65,10:.7}),k(1.6,{0:-.06,1:.16,4:.23,3:.12,8:-.65,10:.65}),k(2.8,{})],
 giggle:[k(0,{}),k(.35,{1:.10,7:-.65,9:-.65,4:.14}),k(.68,{0:.06,3:.09,7:-.65,9:-.65}),k(1.0,{0:.02,3:-.08,7:-.65,9:-.65}),k(1.35,{0:.05,3:.07,7:-.65,9:-.65}),k(2.35,{})],
 pie:[k(0,{}),k(.16,{1:-.16,4:-.20,6:.15,8:-.85,10:.85}),k(.55,{1:.08,4:.15,6:-.18,7:-.55,9:-.65}),k(1.2,{4:.13,6:.08,7:-.6,9:-.65}),k(2.1,{})]
};
const aliases={correct:'bounce',fast:'doublejump',wrong:'facepalm',timeout:'sleepy',bluff:'giggle',victory:'champion'};
export function sampleClip(kind,time){
 const list=clips[aliases[kind]||kind];if(!list)return ZERO;
 const t=Math.max(0,time),end=list[list.length-1];if(t>=end[0])return end.slice(1);
 let i=1;while(i<list.length&&list[i][0]<t)i++;
 const a=list[i-1],b=list[i],u=smooth((t-a[0])/(b[0]-a[0]));return ZERO.map((_,j)=>a[j+1]+(b[j+1]-a[j+1])*u);
}
export function motionPose(kind,t,personality='',seed=0,motion=true){
 if(!motion)return ZERO;
 const time=Math.max(0,t),final=kind==='podium-win'||kind==='podium-silver'||kind==='podium-bronze'||kind==='podium-loss';
 const action=kind==='podium-win'?'champion':kind==='podium-silver'?'fistpump':kind==='podium-bronze'?'shrug':kind==='podium-loss'?'slump':kind;
 const p=sampleClip(action,time).slice(),base=final?1:smooth((time-2.75)/.45);
 // Soft breathing and follow-through fade in as the one-shot action ends.
 const idle=kind==='idle'?1:base,b=Math.sin(time*2.4+seed);
 p[0]+=.012*b*idle;p[2]+=.045*Math.sin(time*.8+seed)*idle;p[4]+=.022*Math.sin(time*.86)*idle;p[5]+=.065*Math.sin(time*.54+seed)*idle;p[6]+=.035*Math.sin(time*1.5+seed)*idle;p[7]+=.045*Math.sin(time*1.6)*idle;p[9]-=.045*Math.sin(time*1.6)*idle;
 if(personality==='sleepy')p[4]+=.10*idle;if(personality==='cool')p[6]-=.07*idle;
 if(personality==='dancer'){p[3]+=.035*Math.sin(time*2.8)*idle;p[8]-=.08*Math.sin(time*2.8)*idle;p[10]+=.08*Math.sin(time*2.8)*idle;}
 if(final){const e=smooth((time-2.1)/1.1);if(kind==='podium-win'){p[4]-=.08*e;p[8]-=(.58+.06*b)*e;p[10]+=(.58+.06*b)*e;}else if(kind==='podium-silver'){p[10]+=.22*e;p[4]-=.045*e;}else if(kind==='podium-bronze'){p[6]+=.06*e;}else{p[1]+=.09*e;p[4]+=.15*e;}}
 return p;
}
export function podiumMotion(player,players,solo=false){
 if(solo)return 'podium-win';const rank=1+players.filter(p=>p.score>player.score).length;
 return rank===1?'podium-win':rank===2?'podium-silver':rank===3?'podium-bronze':'podium-loss';
}
export function reactionClock(elapsed,first,second){const t=Math.max(0,elapsed);if(t>=3.2&&second!==first)return {kind:second,time:t-3.2};return {kind:first,time:t};}
