// Original cartoon canine language: text supplies rhythm and intonation, never
// intelligible human speech. Deterministic phrasing keeps captions in sync.
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const hash=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
function random(seed){let x=seed||1;return ()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return (x>>>0)/4294967296;};}
const vowels={a:[730,1200,2450],e:[490,1770,2600],i:[300,2200,3000],o:[470,850,2350],u:[290,700,2200]};
const profiles={parker:{base:122,formant:.83,level:.92},mei:{base:355,formant:1.15,level:.83}};
export const dogProfile=speaker=>profiles[speaker]||profiles.parker;
function words(text){
 const pieces=String(text||'').match(/[\p{L}\p{N}]+|[,.!?;:…¿¡]/gu)||[],out=[];let feeling='talk';
 for(const p of pieces){if(p==='¿'){feeling='question';continue;}if(p==='¡'){feeling='excited';continue;}if(/^[,.!?;:…]$/.test(p)){if(out.length){out.at(-1).punct=p;out.at(-1).feeling=p==='?'?'question':p==='!'?'excited':feeling;}if(/[.!?…]/.test(p))feeling='talk';continue;}
 const normalized=p.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase(),groups=normalized.match(/[aeiouy]+/g)||['a'];for(let i=0;i<groups.length;i++){const v=groups[i].replace('y','i').at(-1);out.push({v:vowels[v]?v:'a',first:i===0,last:i===groups.length-1,stress:/[áéíóú]/i.test(p)?i===groups.length-1:i===Math.max(0,groups.length-2),feeling,punct:''});}
 }return out.length?out:[{v:'o',first:true,last:true,stress:true,feeling:'talk',punct:''}];
}
export function dogSpeechPlan(text,speaker,budgetMs,mood='idle'){
 const duration=Math.max(0,Number(budgetMs)||0),rng=random(hash(speaker+'|'+text)),profile=dogProfile(speaker),units=words(text);
 if(duration<120)return {duration,units:[],speaker};
 // Group syllables only when the available announcement window is genuinely short.
 const cap=Math.max(1,Math.floor(duration/122)),stride=Math.max(1,Math.ceil(units.length/cap)),syllables=[];
 for(let i=0;i<units.length;i+=stride){const batch=units.slice(i,i+stride),last=batch.at(-1),first=batch[0];syllables.push({...first,punct:last.punct,feeling:last.feeling,last:last.last,stress:batch.some(x=>x.stress)});}
 const nervous=mood==='shock'||/miedo|tiemblo|esconder/i.test(text),happy=mood==='celebrate'||/enhorabuena|pleno|victoria|bien jugado/i.test(text);
 const items=syllables.map((s,i)=>{
  const end=i===syllables.length-1,question=s.punct==='?'||end&&s.feeling==='question',excited=s.feeling==='excited'||happy;
  const r=rng();let kind='woof';
  if(nervous&&r<.32)kind='whine';else if(s.v==='u'||s.v==='o'){kind=r<.36?'growl':'woof';}else if(s.v==='i'||s.v==='e'){kind=r<.43?'yip':r<.60?'trill':'woof';}else kind=r<.26?'bark':r<.39?'huff':'woof';
  if(speaker==='mei'&&kind==='growl'&&r>.1)kind='trill';if(question&&end)kind='whine';
  const stress=s.stress?1.12:1,base=profile.base*(.86+rng()*.29)*stress*(excited?1.10:1);
  const begin=base*(kind==='bark'?1.18:kind==='growl'?.79:kind==='yip'?1.18:.91);
  const middle=base*(kind==='whine'?1.36:kind==='yip'?1.5:kind==='growl'?.88:1.12);
  const finish=base*(question?1.48:s.punct==='!'?1.20:end?.71:kind==='trill'?1.16:.81);
  return {kind,vowel:s.v,pitch:[begin,middle,finish].map(v=>clamp(v,speaker==='mei'?210:70,speaker==='mei'?710:245)),weight:(s.stress?1.22:.85)*(kind==='whine'?1.28:kind==='growl'?1.12:1)*(.90+rng()*.22),gap:s.punct?(s.punct===','||s.punct===';'?125:220):s.last?48:13,level:(.78+rng()*.22)*(s.stress?1:.82),seed:Math.floor(rng()*4294967295)};
 });
 const endPause=Math.min(150,duration*.07),available=duration-endPause,total=items.reduce((n,x)=>n+x.weight*145+x.gap,0);const scale=available/total;let start=0;
 const scheduled=items.map(x=>{const len=x.weight*145*scale,gap=x.gap*scale,u={...x,start,duration:len};start+=len+gap;return u;});
 return {speaker,duration,units:scheduled};
}
const ease=x=>x*x*(3-2*x);
export function dogMouth(plan,elapsed){
 const u=plan.units.find(x=>elapsed>=x.start&&elapsed<x.start+x.duration);if(!u)return 0;const p=(elapsed-u.start)/u.duration;
 return clamp(Math.sin(Math.PI*p)*(.53+(u.kind==='bark'?.34:.22))*(u.kind==='trill'?.78+.22*Math.sin(p*22):1),0,1);
}
function resonator(rate,hz,bw){const omega=2*Math.PI*hz/rate,a=Math.sin(omega)/(2*(hz/bw)),den=1+a;return {b:a/den,a1:-2*Math.cos(omega)/den,a2:(1-a)/den,x1:0,x2:0,y1:0,y2:0};}
function filter(r,x){const y=r.b*(x-r.x2)-r.a1*r.y1-r.a2*r.y2;r.x2=r.x1;r.x1=x;r.y2=r.y1;r.y1=y;return y;}
export function renderDogSpeech(plan,rate=24000){
 const data=new Float32Array(Math.ceil(plan.duration*rate/1000)),profile=dogProfile(plan.speaker);
 for(const u of plan.units){
  const rng=random(u.seed),start=Math.round(u.start*rate/1000),n=Math.min(data.length-start,Math.round(u.duration*rate/1000));if(n<=0)continue;
  const [f1,f2,f3]=vowels[u.vowel].map(f=>f*profile.formant),filters=[resonator(rate,f1,190),resonator(rate,f2,260),resonator(rate,f3,430)],low=resonator(rate,plan.speaker==='mei'?720:340,280);
  let phase=0,prevNoise=0;const attack=u.kind==='bark'||u.kind==='yip'?.075:.14,release=u.kind==='growl'?.23:.29;
  for(let i=0;i<n;i++){
   const p=i/n,t=i/rate,interp=p<.45?u.pitch[0]+(u.pitch[1]-u.pitch[0])*ease(p/.45):u.pitch[1]+(u.pitch[2]-u.pitch[1])*ease((p-.45)/.55);
   const flutter=1+(u.kind==='growl'?.055:.026)*Math.sin(2*Math.PI*(u.kind==='trill'?18:10)*t)+.009*Math.sin(2*Math.PI*27*t);
   phase=(phase+interp*flutter/rate)%1;
   const white=rng()*2-1,breath=white-prevNoise*.55;prevNoise=white;
   const rough=u.kind==='growl'?.27:u.kind==='huff'?.46:u.kind==='bark'?.20:.09;
   const pulse=Math.sin(2*Math.PI*phase)+.48*Math.sin(4*Math.PI*phase+.15)+.29*Math.sin(6*Math.PI*phase+.4)+.17*Math.sin(8*Math.PI*phase)+.10*Math.sin(10*Math.PI*phase);
   const trem=u.kind==='growl'?.72+.28*Math.sin(2*Math.PI*42*t):u.kind==='trill'?.76+.24*Math.sin(2*Math.PI*16*t):1;
   const excitation=pulse*trem*(1-rough)+breath*rough;
   const voiced=filter(filters[0],excitation)*.91+filter(filters[1],excitation)*.60+filter(filters[2],excitation)*.25+filter(low,excitation)*.48+pulse*.13;
   const envelope=ease(clamp(p/attack,0,1))*ease(clamp((1-p)/release,0,1));
   const consonant=(u.kind==='bark'||u.kind==='huff'? .22:.07)*breath*Math.max(0,1-p*7);
   data[start+i]=Math.tanh((voiced+consonant)*1.3)*envelope*u.level*profile.level*.64;
  }
 }
 return data;
}
