// Deterministic, original synthesized cues. All routes use an allowlist.
export const SOUND_IDS=["bell","clock","siren","knock","rain","microwave","phone","train","water","drum","three","gliss","stereo","morse","echo","octave","fifth","sync","tremolo","sweep","square","beat","dtmf","vibrato","minor"];
export function soundWave(id){
 if(!SOUND_IDS.includes(id))return null;
 const rate=16000,duration=6,n=rate*duration,b=new ArrayBuffer(44+n*2),v=new DataView(b),u=new Uint8Array(b),enc=new TextEncoder(),w=(i,s)=>u.set(enc.encode(s),i);w(0,'RIFF');v.setUint32(4,b.byteLength-8,true);w(8,'WAVEfmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,rate,true);v.setUint32(28,rate*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);w(36,'data');v.setUint32(40,n*2,true);
 const pi=Math.PI*2,sin=(f,t)=>Math.sin(pi*f*t);
 const env=(t,d,a=.015)=>t<0||t>=d?0:Math.min(1,t/a,(d-t)/a);
 const note=(t,start,d,f,volume=.5)=>sin(f,t-start)*env(t-start,d)*volume;
 let seed=12345;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296*2-1;};
 for(let i=0;i<n;i++){const t=i/rate,noise=rand();let a=0;
 if(id==='bell'){for(const [at,f] of [[.3,660],[1,520],[3.1,660],[3.8,520]]){const x=t-at;if(x>=0&&x<1.1)a+=(sin(f,x)+.4*sin(f*2.12,x))*Math.exp(-x*5)*env(x,1.1)*.43;}}
 else if(id==='clock'){const p=t%0.5;a=env(p,.045,.003)*(sin(t%1<.5?1050:690,p)*.3+noise*.17);}
 else if(id==='siren')a=Math.sin(pi*(720*t-100*Math.cos(pi*.5*t)))*.30*env(t,6,.15);
 else if(id==='knock'){for(const at of [.4,.65,.9,3.1,3.35,3.6]){const x=t-at;if(x>=0&&x<.12)a+=(sin(105,x)*.45+noise*.22)*Math.exp(-x*35)*env(x,.12,.002);}}
 else if(id==='rain'){a=noise*.11*(.7+.3*sin(.8,t));if(i%173<15)a+=noise*.22;}
 else if(id==='microwave'){for(const at of [1,1.4,1.8,4,4.4,4.8])a+=note(t,at,.16,2100,.40);}
 else if(id==='phone'){const x=t%3;if(x<1.2)a=(sin(440,t)+sin(480,t))*.20*env(x,1.2);}
 else if(id==='train'){a=(noise*.16+sin(65,t)*.16)*Math.pow(Math.max(0,sin(4,t)),2);a+=note(t,1.4,1.2,420,.28)+note(t,1.4,1.2,530,.16);}
 else if(id==='water'){for(const at of [.4,1.2,2.5,3.1,4.4,5.1]){const x=t-at;if(x>=0&&x<.3)a+=Math.sin(pi*(900*x-1050*x*x))*Math.exp(-x*15)*.5*env(x,.3,.002);}}
 else if(id==='drum'){const p=t%.75;a=Math.sin(pi*(110*p-60*p*p))*Math.exp(-p*13)*env(p,.4,.003)*.65;}
 else if(id==='three'){const k=Math.floor(t/.5),p=t%.5;a=sin(k%3===0?350:690,p)*Math.exp(-p*24)*env(p,.16,.002)*(k%3===0?.6:.26);}
 else if(id==='gliss')a=Math.sin(pi*(200*t+65*t*t))*.3*env(t,6,.12);
 else if(id==='stereo'){const k=Math.floor(t/.9)%3;a=note(t%2.7,k*.9,.6,k===1?780:280,.4);}
 else if(id==='morse'){const units=[1,0,1,0,1,0,0,0,1,1,1,0,1,1,1,0,1,1,1,0,0,0,1,0,1,0,1,0,0,0];const p=t/.16,k=Math.floor(p)%units.length;if(units[k])a=sin(700,t)*.35;}
 else if(id==='echo'){for(let k=0;k<7;k++)a+=note(t,.4+k*.6,.11,700,Math.pow(.65,k)*.6);}
 else if(id==='octave'||id==='fifth'||id==='minor'){const second=id==='octave'?523.251:id==='fifth'?391.995:311.127;for(const at of [.4,3.1])a+=note(t,at,.8,261.626,.4)+note(t,at+1,.8,second,.4);}
 else if(id==='sync'){const k=Math.floor(t/.5),p=t%.5;a=(k%2?noise*.4:sin(85,p)*.55)*Math.exp(-p*15)*env(p,.28,.003);}
 else if(id==='tremolo')a=sin(440,t)*(.27+.22*sin(5,t))*env(t,6,.1);
 else if(id==='sweep')a=Math.sin(pi*(1000*t-60*t*t))*.3*env(t,6,.1);
 else if(id==='square')a=Math.sign(sin(330,t))*.22*env(t,6,.15);
 else if(id==='beat')a=(sin(440,t)+sin(444,t))*.24*env(t,6,.1);
 else if(id==='dtmf'){const freqs=[[697,1209],[770,1336],[852,1477],[941,1336]],k=Math.floor(t/.6)%4,p=t%.6;a=(sin(freqs[k][0],p)+sin(freqs[k][1],p))*.22*env(p,.35);}
 else if(id==='vibrato')a=Math.sin(pi*440*t+2.8*Math.sin(pi*5*t))*.34*env(t,6,.1);
 v.setInt16(44+i*2,Math.round(Math.max(-.95,Math.min(.95,a))*32767),true);
 }return b;
}
