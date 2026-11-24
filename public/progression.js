import {emoteRewards} from './emotes.js';
export const rewards=[
 {id:'first',name:'¡En marcha!',description:'Termina una partida oficial',metric:'matches',target:1,kind:'hat',item:'party',label:'Sombrero de fiesta'},
 {id:'quick',name:'Reflejos de gato',description:'Acertar 5 preguntas en 3 segundos o menos',metric:'fast',target:5,kind:'hat',item:'fox',label:'Orejas de zorro'},
 {id:'brain',name:'Cerebro de oro',description:'Acertar 25 preguntas oficiales',metric:'correct',target:25,kind:'shirt',item:'gold',label:'Camiseta dorada'},
 {id:'veteran',name:'Habitual del plató',description:'Terminar 10 partidas oficiales',metric:'matches',target:10,kind:'hat',item:'dragon',label:'Casco de dragón'},
 {id:'champ',name:'Rey del salón',description:'Ganar 5 partidas oficiales multijugador',metric:'wins',target:5,kind:'shirt',item:'champion',label:'Camiseta de campeón'},
 {id:'level5',name:'Estrella del concurso',description:'Alcanzar el nivel 5',metric:'level',target:5,kind:'hat',item:'star',label:'Estrella del plató'}
];
export const baseHats={none:'Sin gorro',scout:'Explorador del bosque',wizard:'Mago',space:'Astronauta',crown:'Corona',cat:'Orejas de gato'};
export const baseShirts={violet:'Violeta',blue:'Azul',red:'Roja',green:'Verde',yellow:'Amarilla',arcade:'Arcade'};
export function progressFrom(counts={}){const num=k=>Math.max(0,Number(counts[k])||0);const p={answered:num('answered'),correct:num('correct'),fast:num('fast'),matches:num('matches'),wins:num('wins')};p.xp=p.answered*10+p.correct*20+p.fast*10+p.matches*40+p.wins*50;p.level=1+Math.floor(p.xp/150);p.levelXp=p.xp%150;p.nextLevelXp=150;p.achievements=[...rewards,...emoteRewards].map(r=>({...r,progress:Math.min(r.target,p[r.metric]),unlocked:p[r.metric]>=r.target}));p.unlocked={hat:[...Object.keys(baseHats),...p.achievements.filter(r=>r.unlocked&&r.kind==='hat').map(r=>r.item)],shirt:[...Object.keys(baseShirts),...p.achievements.filter(r=>r.unlocked&&r.kind==='shirt').map(r=>r.item)]};return p;}
export function itemAllowed(p,kind,item){return p.unlocked[kind]?.includes(item)===true;}
