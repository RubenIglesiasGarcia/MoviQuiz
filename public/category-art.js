import {levels} from './difficulty.js';
const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const groups=[
 ['science','#aeeed1',/ciencia|tecnologia/,'M12 3v6l-6 10q-1 2 2 2h8q3 0 2-2L12 9M9 3h6M8 16h8M10 19h.1'],
 ['geo','#8ed8ff',/geografia/,'M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0-18M3 12h18M12 3c-5 4-5 14 0 18M12 3c5 4 5 14 0 18'],
 ['film','#ffb1ba',/cine|television|\btv\b/,'M3 9h18v11H3zM3 9l-1-5 18-3 1 5zM7 3l3 5M14 2l3 5M10 12l5 3-5 3z'],
 ['music','#e0bcff',/musica|sonido/,'M9 18V5l11-2v13M9 8l11-2M9 18c0 4-7 4-7 1s7-4 7-1M20 16c0 4-7 4-7 1s7-4 7-1'],
 ['sport','#ffcc83',/deporte|reflejo|agilidad/,'M8 3h8v6a4 4 0 0 1-8 0zM8 5H3v2a5 5 0 0 0 5 5M16 5h5v2a5 5 0 0 1-5 5M12 13v5M7 21h10M9 18h6'],
 ['nature','#aee68d',/naturaleza/,'M4 20C4 6 10 3 21 3c0 11-4 17-14 17M4 20l12-12M10 14v-4M13 11h4'],
 ['history','#f2cc91',/historia/,'M3 8l9-5 9 5zM5 10h14M7 10v8M12 10v8M17 10v8M4 18h16v3H4z'],
 ['gaming','#c1b2ff',/videojuego/,'M7 7h10q3 0 4 4l1 5q0 5-4 3l-4-4h-4l-4 4q-4 2-4-3l1-5q1-4 4-4M7 10v6M4 13h6M16 11h.1M19 14h.1'],
 ['food','#ffc7a3',/gastronomia/,'M4 3v7q0 3 3 3t3-3V3M7 3v18M18 3q-4 2-4 9h4v9M18 3v9'],
 ['arts','#ffc3e7',/arte|creatividad|literatura/,'M20 13c3-7-7-12-13-7-7 5-3 15 4 15 3 0 3-2 2-4-1-2 1-3 3-2 2 1 3 0 4-2zM8 9h.1M12 7h.1M6 14h.1M17 10h.1'],
 ['social','#ffb8a0',/amigos|curiosidades/,'M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M16 11a3 3 0 1 0 0-6M2 21v-3q0-4 6-4t6 4v3M16 14q6 0 6 5v2'],
 ['skill','#b7eaff',/memoria|observacion|percepcion/,'M2 12q10-14 20 0-10 14-20 0M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8']
];
export function categoryArt(category){const g=groups.find(x=>x[2].test(normalize(category)));return g?{key:g[0],color:g[1],path:g[3]}:{key:'general',color:'#ffd55a',path:'M8 8a4 4 0 1 1 6 3q-2 1-2 4M12 20h.1'};}
export function difficultyArt(d){const i=levels.findIndex(x=>x.id===d);return i<0?{level:0,color:'#d7c7e9',label:d}:{...levels[i],level:i+1};}
export function categoryBadge(category){const a=categoryArt(category),span=document.createElement('span');span.className='category-emblem';span.style.setProperty('--category',a.color);const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');const path=document.createElementNS(svg.namespaceURI,'path');path.setAttribute('d',a.path);svg.append(path);const label=document.createElement('b');label.textContent=category||'General';span.append(svg,label);return span;}
export function difficultyBadge(d){const a=difficultyArt(d),wrap=document.createElement('span');wrap.className='difficulty-emblem';wrap.style.setProperty('--difficulty',a.color);const bars=document.createElement('span');bars.className='difficulty-bars';bars.setAttribute('aria-hidden','true');for(let i=1;i<=5;i++){const bar=document.createElement('i');if(i<=a.level)bar.className='active';bars.append(bar);}const label=document.createElement('b');label.textContent=a.label||d||'Sin nivel';wrap.append(bars,label);wrap.setAttribute('aria-label','Dificultad: '+label.textContent);return wrap;}
