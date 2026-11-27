import {test} from 'node:test';import assert from 'node:assert/strict';import {contest,begin,buzz,answer,expireBuzzer,lockBets,betLimit,validateProposal} from '../party.js';
test('party has 18 rounds with distinct questions',()=>{const qs=contest('party');assert.equal(qs.length,18);assert.equal(new Set(qs.map(q=>q.id)).size,18);assert.equal(qs.filter(q=>q.party==='buzzer').length,3);});
test('buzzer grants one turn and opens after a miss',()=>{const q={party:'buzzer',mode:'choice',correct:1,seconds:20},r={questions:[q],index:0,players:{a:{userId:'a'},b:{userId:'b'}},answers:{}};begin(r,1000);buzz(r,{id:'a'},1100);assert.throws(()=>buzz(r,{id:'b'},1200));assert.equal(answer(r,{id:'a'},0,1300),false);buzz(r,{id:'b'},1400);assert.equal(answer(r,{id:'b'},1,1500),true);});
test('wager and validation',()=>{assert.equal(betLimit({score:200}),200);assert.equal(betLimit({score:900}),500);assert.throws(()=>validateProposal({prompt:'x'}));const q=validateProposal({prompt:'¿Cuál es el color del cielo?',options:['Azul','Rojo','Verde','Amarillo'],correct:0});assert.equal(q.party,'custom');});
import {startBluff,submitBluff,startVote,voteBluff,finishBluff,startHot,hotAnswer,hotPass,startPie,throwPie,finishPie} from '../party.js';
const room=q=>({questions:[q],index:0,players:{a:{userId:'a',score:400},b:{userId:'b',score:400}},answers:{}});
test('bluff hides truth and refuses self vote; rewards fooled players',()=>{const r=room({correct:'Luna',fallback:['Marte','Sol']});startBluff(r,0);submitBluff(r,'a','Venus');submitBluff(r,'b','Júpiter');startVote(r,1);const own=r.bluffOptions.find(o=>o.owner==='a');assert.throws(()=>voteBluff(r,'a',own.id));voteBluff(r,'a',r.bluffOptions.find(o=>o.truth).id);voteBluff(r,'b',own.id);finishBluff(r);assert.equal(r.answers.a.points,900);assert.equal(r.answers.b.points,0);});
test('hot potato can pass only after a correct answer',()=>{const r=room({party:'hot',mode:'choice',correct:1,seconds:20});r.nextHot='a';startHot(r,0);assert.throws(()=>hotAnswer(r,'b',1,1));assert.equal(hotAnswer(r,'a',1,2),true);hotPass(r,'a','b');assert.equal(r.nextHot,'b');});
test('pie hits are bounded and cannot target yourself',()=>{const r=room({});r.answers={a:{correct:true,points:700},b:{correct:false,points:0}};startPie(r,0);assert.throws(()=>throwPie(r,'a','a'));throwPie(r,'a','b');assert.throws(()=>throwPie(r,'a','b'));finishPie(r);assert.equal(r.answers.b.points,-75);});

const buzzerRoom=()=>room({party:'buzzer',mode:'choice',correct:1,seconds:20});
test('buzzer miss costs 100 points once and waiting players keep their points',()=>{const r=buzzerRoom();begin(r,1000);buzz(r,{id:'a'},1100);assert.equal(answer(r,{id:'a'},0,1300),false);assert.equal(r.answers.a.points,-100);assert.equal(r.players.a.score,400);assert.equal(r.answers.b,undefined);assert.throws(()=>buzz(r,{id:'a'},1400));buzz(r,{id:'b'},1400);assert.equal(answer(r,{id:'b'},1,1500),true);assert.ok(r.answers.b.points>0);});
test('buzzer penalties cannot make a balance negative',()=>{for(const score of [0,35,100,400]){const r=buzzerRoom();r.players.a.score=score;begin(r,1000);buzz(r,{id:'a'},1100);answer(r,{id:'a'},0,1300);assert.equal(r.answers.a.points,Math.min(100,score)?-Math.min(100,score):0);}});
test('claiming then running out of time has the same penalty even at the overall deadline',()=>{for(const at of [1100,25500]){const r=buzzerRoom();begin(r,1000);buzz(r,{id:'a'},at);const deadline=r.deadline;assert.equal(expireBuzzer(r,deadline-1),false);assert.equal(expireBuzzer(r,deadline),true);assert.equal(r.answers.a.points,-100);assert.equal(r.answers.a.timeout,true);assert.equal(r.answers.b,undefined);assert.equal(expireBuzzer(r,deadline+1),false);assert.equal(r.buzzer,null);}});
test('never pressing has no penalty',()=>{const r=buzzerRoom();begin(r,1000);assert.equal(expireBuzzer(r,r.deadline),false);assert.deepEqual(r.answers,{});});

import {chooseShowEvent,applyShowEvent,mergeRoomHistory} from '../party.js';
test('close leaders can duel in the first final without excluding other players',()=>{
 const q={party:'final',multiplier:2},r={kind:'party',questions:[q],index:0,players:{a:{userId:'a',score:2000},b:{userId:'b',score:1800},c:{userId:'c',score:900}},answers:{a:{correct:true,ms:200,points:2000},b:{correct:true,ms:300,points:1900},c:{correct:true,ms:100,points:2000}}};
 r.showEvent=chooseShowEvent(r);assert.deepEqual(r.showEvent,{kind:'duel',ids:['a','b']});
 applyShowEvent(r,q);applyShowEvent(r,q);assert.equal(r.answers.a.points,2150);assert.equal(r.answers.c.points,2000);
 r.players.c.score=1800;assert.equal(chooseShowEvent(r),null);
});
test('group history retains unique recent fingerprints and has a bounded size',()=>{
 assert.deepEqual(mergeRoomHistory(['fp:a','fp:b'],['fp:b','fp:c','bad']),['fp:a','fp:b','fp:c']);
 assert.equal(mergeRoomHistory(Array.from({length:800},(_,i)=>'fp:'+i)).length,600);
});