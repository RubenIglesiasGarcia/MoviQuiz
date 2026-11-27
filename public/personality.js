export const personalities=Object.freeze({random:'Aleatoria',balanced:'Equilibrada',dancer:'Bailarín',dramatic:'Dramático',champion:'Competitivo',sleepy:'Despistado',cool:'Pasota'});
export const normalizePersonality=value=>typeof value==='string'&&Object.hasOwn(personalities,value)?value:'random';
const choices=Object.keys(personalities).filter(x=>x!=='random');
export function choosePersonality(value,random=Math.random){const p=normalizePersonality(value);return p==='random'?choices[Math.min(choices.length-1,Math.max(0,Math.floor(random()*choices.length)))]:p;}
export function updatePersonality(player,value,random=Math.random){const preference=normalizePersonality(value);if(player.personalityPreference!==preference||!choices.includes(player.personality)){player.personalityPreference=preference;player.personality=choosePersonality(preference,random);}return player;}
