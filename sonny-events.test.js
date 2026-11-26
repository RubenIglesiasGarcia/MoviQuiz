import test from 'node:test';
import assert from 'node:assert/strict';
import {deepChoices,deepOrders,deepEstimates} from './deep-question-bank.js';
import {validateQuestions} from './game.js';
import {contest,selectedContest,questionKey,questionFingerprint,chooseShowEvent,settleContestRound,appendTieBreak} from './party.js';
import {sonnyMoment,showEventInfo} from './public/show-direction.js';
const advanced=[...deepChoices,...deepOrders,...deepEstimates];
const player=(userId,score)=>({userId,score});
test('advanced bank has unique valid questions and three supported formats per difficulty',()=>{
 assert.equal(advanced.length,202);
 assert.equal(new Set(advanced.map(questionKey)).size,202);
 for(const q of advanced)validateQuestions([q]);
 for(const level of ['Media','Difícil','Muy difícil']){
  const qs=advanced.filter(q=>q.difficulty===level);
  assert.ok(qs.length>=60);
  for(const mode of ['choice','order','number'])assert.ok(qs.some(q=>q.mode===mode));
 }
});
test('selection avoids recent questions in both default and selected modes',()=>{
 for(const level of ['Media','Difícil','Muy difícil']){
  for(const kind of ['classic','party']){
   const first=contest(kind,undefined,level),second=contest(kind,undefined,level,first.map(questionFingerprint));
   assert.equal(new Set(second.map(questionKey)).size,second.length);
   const fresh=second.filter(q=>!first.some(x=>questionKey(x)===questionKey(q)));
   assert.ok(fresh.length>=second.length-3);
   const source={standard:false,categories:null,questions:advanced};
   const a=selectedContest(kind,level,source),b=selectedContest(kind,level,source,a.map(questionFingerprint));
   assert.ok(b.filter(q=>!a.some(x=>questionKey(x)===questionKey(q))).length>=b.length-3);
  }
 }
});
test('duel and comeback rewards are additive, bounded and never reward an incorrect answer',()=>{
 const q={party:'warmup'},base={kind:'party',index:2,matchId:'a',questions:[q,q,q],players:{a:player('a',900),b:player('b',300),c:player('c',100)},answers:{a:{correct:true,points:800,ms:400},b:{correct:false,points:0,ms:100},c:{correct:true,points:800,ms:900}}};
 const r=structuredClone(base);r.showEvent={kind:'comeback',ids:['c']};settleContestRound(r,q);settleContestRound(r,q);
 assert.equal(r.answers.c.points,950);assert.equal(r.answers.b.points,0);assert.equal(r.answers.a.points,800);
 const d=structuredClone(base);d.showEvent={kind:'duel',ids:['b','c']};settleContestRound(d,q);
 assert.equal(d.answers.c.points,950);assert.equal(d.answers.b.points,0);
 assert.ok(chooseShowEvent(base));
});
test('shield blocks a steal without subtracting points from anyone',()=>{
 const q={party:'steal'},r={players:{a:player('a',1000),b:player('b',100)},answers:{a:{correct:false,points:0,ms:200},b:{correct:true,points:800,ms:100}},showEvent:{kind:'shield',ids:['a']}};
 settleContestRound(r,q);assert.equal(r.answers.b.points,800);assert.equal(r.answers.a.points,0);assert.equal(r.answers.b.shieldBlocked,true);
});
test('only tied leaders play sudden death, and it is capped',()=>{
 const r={kind:'party',difficulty:'Media',questions:[],players:{a:player('a',500),b:player('b',500),c:player('c',100)}};
 assert.equal(appendTieBreak(r),true);assert.equal(r.questions[0].party,'tiebreak');assert.deepEqual(r.questions[0].excluded,['c']);
 assert.equal(appendTieBreak(r),true);assert.equal(appendTieBreak(r),false);
});
test('Sonny announces events with their actual rules',()=>{
 const state={phase:'question',partyStage:'intro',introDuration:6500,question:{party:'warmup'},showEvent:{kind:'duel',ids:['a','b']},players:[{id:'a',name:'Ana'},{id:'b',name:'Beto'}]};
 assert.match(showEventInfo(state).names,/Ana.*Beto/);assert.match(sonnyMoment(state).text,/150 puntos/);
});
