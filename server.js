import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { randomBytes, createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync, renameSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { iconPng } from './icons.js';
import { OAuth2Client } from 'google-auth-library';
import { questions as defaults, validateQuestions, grade, points, summarize } from './game.js';

const app = express(), http = createServer(app), io = new Server(http);
const port = process.env.PORT || 3000;
const googleClientId = process.env.GOOGLE_CLIENT_ID || '';
const google = new OAuth2Client(googleClientId);
const file = resolve(process.env.DATA_FILE || './data/store.json');
mkdirSync(dirname(file), { recursive:true });
let db = { users:{}, sessions:{}, answers:[], matches:[] };
try { db = JSON.parse(readFileSync(file,'utf8')); } catch(e) { if(e.code !== 'ENOENT') throw e; }
function save(){ writeFileSync(file+'.tmp',JSON.stringify(db),{mode:0o600}); renameSync(file+'.tmp',file); }
const token = () => randomBytes(32).toString('hex');
const hash = x => createHash('sha256').update(x).digest('hex');
function session(user){
  db.users[user.id] = {...db.users[user.id],...user};
  const key=token(); db.sessions[hash(key)] = {id:user.id,expires:Date.now()+90*86400000}; save();
  return {token:key,user:db.users[user.id]};
}
function auth(key){
  if(typeof key!=='string' || key.length!==64) return null;
  const s=db.sessions[hash(key)]; return s && s.expires>Date.now() ? db.users[s.id] : null;
}
const requestUser = req => auth(req.get('authorization')?.replace(/^Bearer /i,''));
app.use(express.json({limit:'250kb'}));
app.get('/api/config',(_req,res)=>res.json({googleClientId}));
app.post('/api/guest',(req,res)=>{
  const name=String(req.body?.name||'').trim().slice(0,24);
  if(!name) return res.status(400).json({error:'Introduce tu nombre.'});
  res.json(session({id:'guest:'+token(),name,guest:true}));
});
app.post('/api/google',async(req,res)=>{
  if(!googleClientId) return res.status(503).json({error:'Google todavía no está configurado.'});
  try {
    const ticket=await google.verifyIdToken({idToken:req.body?.credential,audience:googleClientId});
    const p=ticket.getPayload();
    if(!p?.sub) throw Error('Invalid identity');
    res.json(session({id:'google:'+p.sub,name:(p.name||'Jugador').slice(0,40),guest:false}));
  } catch {res.status(401).json({error:'No se pudo verificar la cuenta de Google.'});}
});
app.get('/api/me',(req,res)=>{
  const u=requestUser(req); if(!u) return res.sendStatus(401);
  res.json({user:u,stats:summarize(db.answers.filter(a=>a.userId===u.id),db.matches.filter(m=>m.userId===u.id))});
});
app.post('/api/logout',(req,res)=>{
  const k=req.get('authorization')?.replace(/^Bearer /i,'');
  if(auth(k)){delete db.sessions[hash(k)];save();} res.sendStatus(204);
});
app.get('/api/sample-audio',(_req,res)=>{
  const rate=16000, count=rate*2, b=Buffer.alloc(44+count*2);
  b.write('RIFF');b.writeUInt32LE(b.length-8,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);b.writeUInt32LE(rate,24);b.writeUInt32LE(rate*2,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(count*2,40);
  for(let i=0;i<count;i++){const t=i/rate;const f=t<1?440:880;const env=Math.min(1,(t%1)*20,(1-t%1)*20);b.writeInt16LE(Math.round(9000*env*Math.sin(2*Math.PI*f*t)),44+2*i);}
  res.type('audio/wav').send(b);
});
app.get('/icons/:size.png',(req,res)=>{const size=Number(req.params.size);if(![192,512,180].includes(size))return res.sendStatus(404);res.type('png').set('Cache-Control','public, max-age=86400').send(iconPng(size));});
app.use(express.static('public'));
app.get('/sw.js',(_req,res)=>res.sendFile(resolve('public/sw.js')));

const rooms=new Map();
function code(){let c;do{c=randomBytes(3).toString('hex').toUpperCase();}while(rooms.has(c));return c;}
function publicState(r){
  const q=r.questions[r.index], reveal=r.phase==='reveal'||r.phase==='finished';
  const question=q?{id:q.id,category:q.category,mode:q.mode,prompt:q.prompt,options:q.options,media:q.media,seconds:q.seconds,difficulty:q.difficulty,...(reveal?{correct:q.correct,tolerance:q.tolerance,explanation:q.explanation}: {})}:null;
  return {code:r.code,solo:r.solo,hostPlays:r.hostPlays,phase:r.phase,index:r.index,total:r.questions.length,question,deadline:r.deadline,serverNow:Date.now(),players:[...r.players.values()].map(p=>({id:p.publicId,name:p.name,score:p.score,answered:r.answers.has(p.userId),...(reveal?{last:r.answers.get(p.userId)?.points||0}: {})})).sort((a,b)=>b.score-a.score),answered:r.answers.size};
}
function broadcast(r){io.to(r.code).emit('state',publicState(r));}
function closeRound(r){
  if(r.phase!=='question')return;
  clearTimeout(r.timer); const q=r.questions[r.index];
  for(const p of r.players.values()){
    let a=r.answers.get(p.userId);
    if(!a){a={correct:false,points:0,ms:null,timeout:true};r.answers.set(p.userId,a);}
    db.answers.push({userId:p.userId,matchId:r.matchId,questionId:q.id,category:q.category,mode:q.mode,media:q.media?.type||'text',difficulty:q.difficulty,...a,at:new Date().toISOString()});
    p.score+=a.points;
  }
  r.phase='reveal';r.deadline=null;save();broadcast(r);
}
function next(r){
  if(!['lobby','reveal'].includes(r.phase))throw Error('La ronda sigue activa.');
  if(!r.players.size)throw Error('Debe entrar al menos un jugador.');
  if(r.index+1>=r.questions.length){
    const top=Math.max(...[...r.players.values()].map(p=>p.score));
    for(const p of r.players.values())db.matches.push({userId:p.userId,matchId:r.matchId,score:p.score,solo:r.solo,win:!r.solo&&r.players.size>1&&p.score===top,at:new Date().toISOString()});
    save();r.phase='finished';broadcast(r);return;
  }
  r.index++;r.answers.clear();r.phase='question';r.started=Date.now();r.deadline=r.started+r.questions[r.index].seconds*1000;
  r.timer=setTimeout(()=>closeRound(r),Math.max(0,r.deadline-Date.now()));broadcast(r);
}
io.on('connection',s=>{
  const identity=()=>auth(s.handshake.auth?.token);
  const call=(event,fn)=>s.on(event,(payload,ack)=>{
    if(typeof ack!=='function')return;
    try{ack({ok:true,...fn(payload||{})});}catch(e){ack({ok:false,error:e.message||'Error de conexión.'});}
  });
  function enter(r,role){if(s.data.code)s.leave(s.data.code);s.data.code=r.code;s.data.role=role;s.join(r.code);}
  function room(){const r=rooms.get(s.data.code);if(!r)throw Error('Sala no encontrada.');return r;}
  function host(){const r=room();if(s.data.role!=='host'||identity()?.id!==r.host)throw Error('Solo el presentador puede controlar la partida.');return r;}
  call('create',({questions,hostPlays=false,solo=false})=>{
    const u=identity();if(!u)throw Error('Identifícate primero.');
    const r={code:code(),matchId:token(),host:u.id,questions:validateQuestions(questions||defaults),players:new Map(),answers:new Map(),index:-1,phase:'lobby',deadline:null};
    r.solo=solo===true;r.hostPlays=hostPlays===true||r.solo;
    if(r.hostPlays)r.players.set(u.id,{userId:u.id,publicId:randomBytes(8).toString('hex'),name:u.name,score:0});
    rooms.set(r.code,r);enter(r,'host');if(r.solo)next(r);return {state:publicState(r),playerId:r.players.get(u.id)?.publicId};
  });
  call('join',({code,role})=>{
    const r=rooms.get(String(code||'').trim().toUpperCase());if(!r)throw Error('No existe esa sala.');
    const u=identity();
    if(role==='host'){if(u?.id!==r.host)throw Error('No eres el presentador.');}
    else if(role==='player'){
      if(!u)throw Error('Identifícate primero.');
      if(r.solo)throw Error('Esta partida es individual.');
      if(!r.players.has(u.id)){
        if(r.phase!=='lobby')throw Error('La partida ya ha comenzado.');
        if(r.players.size>=32)throw Error('La sala está llena.');
        r.players.set(u.id,{userId:u.id,publicId:randomBytes(8).toString('hex'),name:u.name,score:0});
      }
    }else if(role!=='screen')throw Error('Rol no válido.');
    enter(r,role);broadcast(r);
    return {state:publicState(r),playerId:r.players.get(u?.id)?.publicId};
  });
  call('next',()=>{next(host());return {};});
  call('reveal',()=>{const r=host();if(r.hostPlays)throw Error('Espera a que termine el tiempo o respondan todos.');closeRound(r);return {};});
  call('answer',({answer,questionId})=>{
    const r=room(),u=identity(),q=r.questions[r.index];
    if(!['player','host'].includes(s.data.role)||!u||!r.players.has(u.id))throw Error('No eres un jugador de esta sala.');
    if(r.phase!=='question'||Date.now()>=r.deadline)throw Error('El tiempo ha terminado.');
    if(questionId!==q.id)throw Error('La pregunta ha cambiado.');
    if(r.answers.has(u.id))throw Error('Ya has respondido.');
    if(!['string','number'].includes(typeof answer)&&!Array.isArray(answer))throw Error('Respuesta inválida.');
    if(JSON.stringify(answer).length>1000)throw Error('Respuesta demasiado larga.');
    const ms=Date.now()-r.started,correct=grade(q,answer);
    r.answers.set(u.id,{correct,points:points(q,correct,ms),ms,timeout:false});
    if(r.answers.size===r.players.size)closeRound(r);else broadcast(r);
    return {};
  });
});
http.listen(port,'0.0.0.0',()=>console.log('MobiQuiz escuchando en '+port));
