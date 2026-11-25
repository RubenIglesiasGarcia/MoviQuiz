import {test} from 'node:test';
import assert from 'node:assert/strict';
import {actionKinds,actionRound,makeActionPlan,actionBeat,beatDuration,startAction,recordAction,finishAction,actionDuration,actionPoints} from '../public/arcade-rules.js';
for(const kind of actionKinds)test(kind+' server authoritative timing and scoring',()=>{
 const q=actionRound(kind),r={phase:'question',players:{a:{},b:{}},answers:{}};
 startAction(r,q,1000);assert.equal(r.deadline,1000+actionDuration(q.plan));
 assert.throws(()=>recordAction(r,'a',q.plan.beats[0].target,0,1100));
 assert.throws(()=>recordAction(r,'outsider',q.plan.beats[0].target,0,4600));
 let start=q.plan.lead;
 for(const [i,beat] of q.plan.beats.entries()){
  const now=1000+start+beat.center;
  assert.equal(actionBeat(q.plan,now-1000).index,i);
  assert.equal(actionBeat(q.plan,start).elapsed,0);
  assert.ok(recordAction(r,'a',beat.target,i,now)>=150);
  assert.throws(()=>recordAction(r,'a',beat.target,i,now));
  start+=beatDuration(q.plan,i);
 }
 assert.equal(actionBeat(q.plan,start).index,q.plan.beats.length);
 finishAction(r);assert.ok(r.answers.a.correct);assert.ok(r.answers.a.points>=900);assert.equal(r.action.players.a.bestCombo,q.plan.beats.length);assert.equal(r.answers.b.points,0);assert.equal(r.answers.b.timeout,true);
});
test('challenge ramps up and only precise actions earn full points',()=>{
 for(const kind of actionKinds){const p=makeActionPlan(kind,()=>.3),first=p.beats[0],last=p.beats.at(-1);
 assert.ok(last.duration<first.duration);assert.ok(last.window<first.window);
 assert.equal(actionPoints(kind,last,last.target,last.center),150);
 assert.equal(actionPoints(kind,last,last.target,0),0);
 assert.equal(actionPoints(kind,last,'invalid',last.center),0);}
});
test('missed obstacles reset combo and legacy saved plans retain timing',()=>{
 const p=makeActionPlan('dash',()=>.3),r={phase:'question',players:{a:{}},answers:{}};startAction(r,{plan:p},0);
 recordAction(r,'a',p.beats[0].target,0,p.lead+p.beats[0].center);
 recordAction(r,'a',p.beats[2].target,2,p.lead+p.beats[0].duration+p.beats[1].duration+p.beats[2].center);
 assert.equal(r.action.players.a.combo,1);
 const legacy={kind:'dash',lead:2500,interval:2100,beats:[{target:'jump'},{target:'left'}]};
 assert.equal(actionDuration(legacy),7000);assert.equal(actionBeat(legacy,4600).index,1);assert.equal(actionPoints('dash',legacy.beats[0],'jump',900),125);
});
