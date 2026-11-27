import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const base=process.env.MQ_BASE_URL||'http://127.0.0.1:8787';
for(let i=0;i<80;i++){try{if((await fetch(base+'/api/config')).ok)break;}catch{}if(i===79)throw Error('Local Worker did not start');await new Promise(r=>setTimeout(r,500));}
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const errors=[];
async function request(path,token,data){const res=await fetch(base+path,{method:'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify(data)});const result=await res.json();assert.ok(res.ok,JSON.stringify(result));return result;}
async function page(token,viewport){const ctx=await browser.newContext({viewport,serviceWorkers:'block',reducedMotion:'reduce'});await ctx.addInitScript(t=>{if(t)localStorage.setItem('mq.token',t);localStorage.setItem('mq.voice','off');localStorage.setItem('mq.graphics','low');},token);await ctx.route('**/www.gstatic.com/**',r=>r.abort());await ctx.route('**/accounts.google.com/**',r=>r.abort());const p=await ctx.newPage();p.on('pageerror',e=>errors.push(e.message));return p;}
try{
 const a=await request('/api/guest',null,{name:'Browser Host'}),b=await request('/api/guest',null,{name:'Browser Player'});
 const host=await page(a.token,{width:1280,height:720}),player=await page(b.token,{width:390,height:844}),tv=await page(null,{width:1280,height:720});
 await host.goto(base);await host.locator('#create').waitFor({state:'visible',timeout:20000});await host.locator('#create').click();await host.getByText('Elegir categorías y packs',{exact:true}).waitFor({state:'visible'});
 const question={mode:'choice',prompt:'¿Qué número resulta de sumar dos más dos?',category:'Ciencia',difficulty:'Media',options:['Cuatro','Cinco','Tres','Dos'],correct:0,seconds:120};
 const created=await request('/api/rooms',a.token,{kind:'classic',hostPlays:true,autoAdvance:false,questions:[question]});const code=created.state.code;
 await host.goto(base+'/?host='+code);await host.locator('.lobby-qr canvas').waitFor({state:'visible',timeout:20000});
 await player.goto(base+'/?join='+code);await player.locator('.code-input').waitFor();await player.getByRole('button',{name:'Entrar en la sala',exact:true}).click();await player.locator('.lobby-qr canvas').waitFor({state:'visible'});for(const width of [320,360,390]){await player.setViewportSize({width,height:720});await player.waitForTimeout(150);const size=await player.evaluate(()=>({width:innerWidth,doc:document.documentElement.scrollWidth,qr:document.querySelector('.lobby-qr canvas').getBoundingClientRect().right}));assert.ok(size.doc<=width+3&&size.qr<=width+3,JSON.stringify(size));}await player.setViewportSize({width:390,height:844});
 await tv.goto(base+'/?screen='+code);await tv.locator('.lobby-qr canvas').waitFor({state:'visible'});
 await host.getByText('Browser Player',{exact:false}).first().waitFor({state:'visible',timeout:15000});
 await host.getByRole('button',{name:'Empezar concurso',exact:true}).click();
 await player.locator('#answers .option').first().waitFor({state:'visible',timeout:20000});
 await host.locator('#answers .option').first().waitFor({state:'visible',timeout:20000});
 for(const [width,height] of [[390,844],[360,640],[844,390],[1280,720]]){await player.setViewportSize({width,height});await player.waitForTimeout(200);const layout=await player.evaluate(()=>{const rect=n=>{const b=n.getBoundingClientRect();return {top:b.top,bottom:b.bottom,left:b.left,right:b.right};};return {height:innerHeight,width:innerWidth,documentHeight:document.documentElement.scrollHeight,controls:[...document.querySelectorAll('#answers .option')].map(rect),prompt:rect(document.querySelector('#round h2'))};});assert.ok(layout.controls.length>=4,JSON.stringify(layout));assert.ok(layout.documentHeight<=height+4,JSON.stringify(layout));for(const x of [...layout.controls,layout.prompt])assert.ok(x.top>=-3&&x.bottom<=height+3&&x.left>=-3&&x.right<=width+3,JSON.stringify({width,height,x}));}
 await player.locator('#answers .option').first().click();await host.locator('#answers .option').first().click();await tv.locator('.tv-scoreboard').waitFor({state:'visible',timeout:20000});assert.deepEqual(errors,[]);console.log('PASS: lobby, 2 players, browser TV, 4 viewport sizes, real answer/reveal flow.');
}finally{await browser.close();}
