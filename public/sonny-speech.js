// Estimate natural Spanish speech duration, including short pauses for punctuation.
// Device voices vary; these estimates reserve time, rather than imposing a speech cutoff.
// Requested character pitch; native speech synthesis supports only 0–2.
export const SONNY_TARGET_PITCH=2.35;
export const SONNY_PITCH=Math.min(2,SONNY_TARGET_PITCH);
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

export const POST_SPEECH_PAUSE=1100;
// Keep ordinary transitions short, reserving a quiet beat independently of response time.
export function pacedIntro(text,baseMs){if(!text)return {duration:Math.max(1600,Math.min(baseMs,2200)),pause:POST_SPEECH_PAUSE};const budget=Math.max(2000,speechEstimate(text));return {duration:Math.ceil((budget+POST_SPEECH_PAUSE+350)/250)*250,pause:POST_SPEECH_PAUSE};}
export function speechBudget(remaining,pause=0){return Math.max(0,remaining-Math.max(0,pause));}
export function previewDuringIntro(q){return !!q&&['choice','boolean','text','number','order'].includes(q.mode)&&['classic','warmup','order-round','estimate','steal','final','solo-bonus','custom'].includes(q.party||'classic')&&!q.media;}
