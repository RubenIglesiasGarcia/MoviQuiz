// Smooth packet-to-packet clock jitter without carrying a previous room's skew.
export function roomOffset(previous,serverNow,receivedAt,reset=false){
 const sample=serverNow-receivedAt;
 if(!Number.isFinite(sample))return previous||0;
 if(reset||!Number.isFinite(previous)||Math.abs(sample-previous)>1500)return sample;
 return previous+Math.max(-35,Math.min(35,(sample-previous)*.2));
}
