import test from 'node:test';
import assert from 'node:assert/strict';
import {sonnyCatAct,sonnyMoment} from './public/show-direction.js';
const lobby={phase:'lobby',matchId:'demo',index:-1};
test('Sonny cycles through every feline activity in the lobby',()=>{
 const acts=new Set();
 for(let t=0;t<110000;t+=100){const cue=sonnyCatAct(lobby,t);acts.add(cue.act);assert.ok(cue.progress>=0&&cue.progress<=1);}
 for(const act of ['idle','yarn','groom','purr','stretch','sleep','meow','ear'])assert.ok(acts.has(act),act);
 assert.deepEqual(sonnyCatAct(lobby,7900),sonnyCatAct({...lobby},7900));
});
test('no feline distractions during live answers or long spoken introductions',()=>{
 for(const partyStage of ['answer','arcade-action','buzz','bet','bluff-write','intro']){
  const state={...lobby,phase:'question',partyStage,introDuration:6500};
  for(let t=0;t<15000;t+=150)assert.equal(sonnyCatAct(state,t).act,'idle');
 }
});
test('results animations leave space for long spoken dialogue and never run past the deadline',()=>{
 const state={...lobby,phase:'reveal',revealStarted:1000,revealUntil:11000,index:3};
 assert.equal(sonnyCatAct(state,1000,9000).act,'idle');
 assert.notEqual(sonnyCatAct(state,5400,4600).act,'idle');
 assert.equal(sonnyCatAct(state,9900,100).act,'idle');
});
test('Sonny varies contextual comments across results and sessions',()=>{
 const state={...lobby,phase:'reveal',kind:'party',players:[{id:'a',score:1,reaction:'wrong'},{id:'b',score:0,reaction:'wrong'}]};
 const lines=Array.from({length:8},(_,index)=>sonnyMoment({...state,index}).text);
 assert.equal(new Set(lines).size,8);
 assert.notEqual(sonnyMoment({...state,matchId:'a',index:0}).text,sonnyMoment({...state,matchId:'b',index:0}).text);
});
