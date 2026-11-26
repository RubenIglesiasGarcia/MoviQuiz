// One clock for all displays. A buzzer claim freezes the clue, not the overall round.
export const CLIP_IDS=["basket","toast","eclipse","blocks","volley","prism","newton","queue","resonance","bubble"];
export const validClip=url=>CLIP_IDS.some(id=>url==='/clips/'+id);
export function clueElapsed(state,now){
 if(state.phase==='reveal'||state.phase==='finished')return 25000;
 const start=state.clueStarted??now,at=state.partyStage==='answer'&&state.question?.party==='buzzer'&&state.buzzer?Math.min(now,state.clueFrozenAt??now):now;
 return Math.max(0,at-start);
}
export function pixelWidth(elapsed){return [8,12,18,26,40,64,100,180,480][Math.min(8,Math.max(0,Math.floor(elapsed/2500)))];}
export function paintClip(canvas,id,elapsed){
 const c=canvas.getContext('2d');if(!c)return;const t=(elapsed%8000)/8000,W=480,H=270;
 c.clearRect(0,0,W,H);c.fillStyle='#25203d';c.fillRect(0,0,W,H);
 const line=(x,y,X,Y,col='#d0c2ed',w=4)=>{c.beginPath();c.strokeStyle=col;c.lineWidth=w;c.lineCap='round';c.moveTo(x,y);c.lineTo(X,Y);c.stroke();};
 const rect=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x,y,w,h);};
 const ball=(x,y,r,col)=>{c.beginPath();c.fillStyle=col;c.arc(x,y,r,0,Math.PI*2);c.fill();};
 const ring=(x,y,r,col,w=3)=>{c.beginPath();c.strokeStyle=col;c.lineWidth=w;c.arc(x,y,r,0,Math.PI*2);c.stroke();};
 const label=(x,y,s)=>{c.font='bold 17px system-ui';c.textAlign='center';c.fillStyle='#efe8ff';c.fillText(s,x,y);};
 const person=(x,y,jump=0)=>{const Y=y-jump;ball(x,Y-60,13,'#ffd2aa');line(x,Y-45,x,Y-12,'#77d9bc',16);line(x,Y-37,x+27,Y-56,'#ffd2aa',7);line(x,Y-12,x-14,y+14,'#a8a0f4',9);line(x,Y-12,x+14,y+14,'#a8a0f4',9);};
 if(id==='basket'){rect(0,215,W,55,'#ad7655');rect(365,53,12,162,'#bfc5d8');rect(310,48,60,58,'#ece4e3');line(302,110,361,110,'#ff987b',7);for(let i=0;i<6;i++)line(306+i*9,114,321+i*4,147,'#ddd2ec',2);person(90,200,30*Math.sin(Math.PI*Math.min(1,t*3)));const u=Math.min(1,t*1.5);ball(120+218*u,145-210*u*(1-u)-35*u,12,'#f9a052');}
 else if(id==='toast'){rect(120,122,240,100,'#a0a5c5');rect(140,132,200,10,'#26203f');rect(156,151,168,12,'#45415e');ball(330,184,10,'#ffae77');const pop=t>.43?Math.sin(Math.PI*Math.min(1,(t-.43)/.35))*72:0;rect(193,106-pop,94,53,'#b47a46');rect(200,112-pop,80,45,'#e9c488');rect(120,158,240,64,'#a0a5c5');rect(140,180,200,4,'#c4c8e4');}
 else if(id==='eclipse'){for(let i=0;i<32;i++)ball((i*83)%480,(i*57)%270,1.2,'#aaa3ce');ball(240,135,79,'#ffbc62');ring(240,135,85,'#ffdc87',5);ball(100+280*t,135,76,'#25203d');}
 else if(id==='blocks'){rect(151,16,178,238,'#17142b');for(let i=0;i<7;i++)for(let j=0;j<9;j++){c.strokeStyle='#40375c';c.strokeRect(156+i*24,20+j*24,24,24);}const base=[[0,8],[1,8],[2,8],[5,8],[6,8],[0,7],[1,7],[6,7]];for(const [x,y] of base)rect(157+x*24,21+y*24,22,22,'#83c8f2');const y=Math.min(7,Math.floor(t*11));for(const [x,z] of [[3,0],[4,0],[2,1],[3,1]])rect(157+x*24,21+(z+y)*24,22,22,'#ffd55a');}
 else if(id==='volley'){rect(0,222,W,48,'#466d68');line(280,72,280,220,'#eee8fa',5);for(let y=78;y<155;y+=12)line(268,y,292,y,'#b9b5d7',1);const u=Math.min(1,t*1.8),jump=65*Math.sin(Math.PI*Math.min(1,t*2));person(100+60*u,202,jump);ball(125+240*u,130-115*Math.sin(Math.PI*u),10,'#f3cf74');}
 else if(id==='prism'){c.beginPath();c.moveTo(205,48);c.lineTo(130,222);c.lineTo(295,222);c.closePath();c.fillStyle='#78c4dc55';c.fill();c.strokeStyle='#a9ddeb';c.lineWidth=3;c.stroke();line(20,150,160,150,'#fff7c7',6);['#f56b76','#f3a460','#ffe073','#7fdda6','#76bcff','#b99bf8'].forEach((color,i)=>line(266,150+i*3,440,100+i*23,color,3+Math.sin(t*Math.PI)*2));}
 else if(id==='newton'){line(130,34,350,34,'#c6b9df',8);for(let i=0;i<5;i++){const x=160+i*40,theta=i===0?-Math.max(0,Math.cos(t*2*Math.PI))*.65:i===4?Math.max(0,-Math.cos(t*2*Math.PI))*.65:0;const X=x+Math.sin(theta)*137,Y=34+Math.cos(theta)*137;line(x,34,X,Y,'#d5c7e8',2);ball(X,Y,19,'#a8c3db');ball(X-5,Y-6,5,'#d9edfa');}}
 else if(id==='queue'){const n=Math.floor(t*5);line(55,72,420,72,'#a79bca');line(55,180,420,180,'#a79bca');for(let i=0;i<4;i++){const x=75+i*82-(n%2?Math.min(80,80*(t*5-n)):0);rect(x,96,60,60,['#77c5f5','#ffd55a','#ef9aad','#91e2be'][i]);label(x+30,134,String(i+1));}line(60,210,18,210,'#f8d984',4);line(18,210,30,202,'#f8d984');line(18,210,30,218,'#f8d984');}
 else if(id==='resonance'){const amp=15+100*t,theta=Math.sin(t*12*Math.PI)*amp;line(110,42,370,42,'#a9a0ce',6);line(240,42,240+theta,171,'#c6b9e8',3);ball(240+theta,171,22,'#ffd55a');line(30,225,450,225,'#66567d');for(let i=0;i<7;i++)line(60+i*55,225,60+i*55,210,'#f3a0c3',3);}
 else if(id==='bubble'){const phases=[[5,2,4,1],[2,5,4,1],[2,4,5,1],[2,4,1,5],[2,1,4,5],[1,2,4,5]],p=Math.min(5,Math.floor(t*6));phases[p].forEach((v,i)=>{const x=85+i*85;rect(x,220-v*30,58,v*30,i===p%3||i===p%3+1?'#ffd55a':'#9c8ee5');label(x+29,244,String(v));});}
}
