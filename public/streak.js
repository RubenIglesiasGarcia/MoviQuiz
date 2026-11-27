export function nextStreak(previous,answer){const old=Number(previous)||0;if(!answer)return old;if(answer.timeout)return 0;return answer.correct?Math.max(0,old)+1:Math.min(0,old)-1;}
export function streakInfo(value){const n=Number(value)||0;return Math.abs(n)<3?null:{kind:n>0?'hot':'cold',icon:n>0?'🔥':'🧊',count:Math.abs(n),label:Math.abs(n)+(n>0?' aciertos seguidos':' fallos seguidos')};}
