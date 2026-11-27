import test from 'node:test';
import assert from 'node:assert/strict';
import {SOUND_IDS,soundWave} from '../sound-clues.js';
import {soundQuestions} from '../sound-question-bank.js';
import {validateQuestions} from '../game.js';
import {contest,standardPool,selectedContest,questionFingerprint} from '../party.js';

const legacy=q=>q.media?.type==='audio'&&(q.media.url==='/api/sample-audio'||q.media.url.startsWith('/api/sound-clue/'));
const levels=['Muy fácil','Fácil','Media','Difícil','Muy difícil','Mixta'];

test('25 original sound clues remain valid and playable outside the standard rotation',()=>{
 assert.equal(soundQuestions.length,25);
 assert.equal(new Set(SOUND_IDS).size,25);
 for(const q of soundQuestions){
  const b=soundWave(q.id.slice(6));
  assert.equal(new TextDecoder().decode(b.slice(0,4)),'RIFF');
  assert.equal(new DataView(b).getUint32(40,true),b.byteLength-44);
  assert.ok(new Int16Array(b,44).some(x=>x!==0));
  assert.equal(validateQuestions([q])[0].media.url,q.media.url);
  assert.ok(!standardPool().some(p=>p.id===q.id));
 }
 assert.equal(soundWave('unknown'),null);
 assert.ok(!standardPool().some(legacy));
});

test('classic and party keep their length at every difficulty without generic sound questions',()=>{
 for(const d of levels)for(const kind of ['classic','party']){
  const q=contest(kind,undefined,d);
  assert.equal(q.length,kind==='party'?18:12);
  assert.ok(q.every(x=>!legacy(x)));
  if(d!=='Mixta')assert.ok(q.every(x=>x.difficulty===d));
  if(kind==='party')assert.ok(q.slice(0,3).every(x=>x.party==='warmup'));
 }
});

test('standard category selection avoids generic audio and balances mixed levels',()=>{
 const source={standard:true,categories:null,questions:[]};
 const qs=selectedContest('classic','Mixta',source);
 assert.equal(qs.length,12);
 assert.ok(qs.every(q=>!legacy(q)));
 const counts=levels.slice(0,5).map(d=>qs.filter(q=>q.difficulty===d).length);
 assert.ok(Math.max(...counts)-Math.min(...counts)<=1);
 const next=selectedContest('classic','Mixta',source,qs.map(questionFingerprint));
 assert.ok(next.every(q=>!qs.some(p=>questionFingerprint(p)===questionFingerprint(q))));
});

test('explicit custom music packs may still use audio',()=>{
 const questions=soundQuestions.slice(0,3);
 const source={standard:false,categories:null,questions};
 const qs=selectedContest('classic','Mixta',source);
 assert.equal(qs.length,3);
 assert.ok(qs.every(legacy));
});
