import test from 'node:test';
import assert from 'node:assert/strict';
import {sonnyMoment} from './public/show-direction.js';
import {contest,prepareRound,begin,answer} from './party.js';
import {points} from './game.js';

test('Sonny explains section changes, stays quiet in short transitions and reacts to events',()=>{
 const s={phase:'question',partyStage:'intro',index:3,total:18,kind:'party',introDuration:6500,question:{party:'buzzer'}};
 assert.match(sonnyMoment(s).text,/fallar resta puntos/i);
 assert.equal(sonnyMoment({...s,introDuration:1200}),null);
 assert.equal(sonnyMoment({...s,partyStage:'answer'}),null);
 const reveal={...s,phase:'reveal',players:[{id:'a',score:100,reaction:'wrong'},{id:'b',score:0,reaction:'wrong'}]};
 assert.equal(sonnyMoment(reveal).mood,'shock');
 assert.match(sonnyMoment({...s,question:{party:'warmup',multiplier:2}}).text,/doble/i);
 assert.equal(sonnyMoment({...s,phase:'finished'}).mood,'celebrate');
});
test('bonus is announced and doubles the same correct answer for everyone',()=>{
 const q=contest('party',undefined,'Mixta').find(q=>q.party==='warmup'&&q.multiplier===2);
 assert.ok(q);
 const r={kind:'party',index:1,questions:[{party:'warmup'},q],players:{a:{userId:'a',score:0},b:{userId:'b',score:500}},answers:{}};
 prepareRound(r,1000);assert.equal(r.introDuration,4000);assert.equal(r.deadline,5000);
 begin(r,5000);
 for(const id of ['a','b']){assert.equal(answer(r,{id},q.correct,5500),true);assert.equal(r.answers[id].points,points(q,true,500)*2);}
});
