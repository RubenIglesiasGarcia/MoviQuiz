// Estimate natural Spanish speech duration, including short pauses for punctuation.
// Device voices vary; these estimates reserve time, rather than imposing a speech cutoff.
export const SONNY_PITCH=1.65;
export const SONNY_BASE_RATE=1.42;
export const SONNY_MAX_RATE=1.85;
export function speechEstimate(text,rate=SONNY_BASE_RATE){
 const words=String(text||'').trim().split(/\s+/).filter(Boolean);
 const letters=words.join('').replace(/[^\p{L}\p{N}]/gu,'').length;
 const pauses=(String(text).match(/[,.!?;:]/g)||[]).length;
 return Math.ceil(Math.max(words.length*370,letters*63)/rate+Math.min(900,pauses*85)+450);
}
export function sonnyVoicePlan(text,availableMs=Infinity){
 const target=Math.max(1000,availableMs-450);
 let rate=SONNY_BASE_RATE;
 while(rate<SONNY_MAX_RATE&&speechEstimate(text,rate)>target)rate=Math.min(SONNY_MAX_RATE,Math.round((rate+.05)*100)/100);
 return {rate,pitch:SONNY_PITCH,estimatedMs:speechEstimate(text,rate)};
}
export function sonnyIntroWindow(text,baseMs){
 if(!text||baseMs<2000)return baseMs;
 return Math.max(baseMs,Math.ceil((speechEstimate(text)+1100)/500)*500);
}
