import test from 'node:test';
import assert from 'node:assert/strict';
import {modernChoices,modernOrders,modernEstimates} from '../modern-question-bank.js';
import {bank,orderBank,estimateBank} from '../question-bank.js';
import {validateQuestions,grade} from '../game.js';
import {validArtwork} from '../question-art.js';
import {contest,standardPool} from '../party.js';
const levels=['Muy fácil','Fácil','Media','Difícil','Muy difícil'];
test('modern questions are included, valid, illustrated and have distinct prompts and IDs',()=>{
 const modern=[...modernChoices,...modernOrders,...modernEstimates];
 assert.equal(modern.length,160);
 assert.equal(new Set(modern.map(q=>q.id)).size,modern.length);
 assert.equal(new Set(modern.map(q=>q.prompt)).size,modern.length);
 for(const q of modern){const validated=validateQuestions([q])[0];assert.ok(grade(validated,q.correct),q.prompt);}
 for(const list of [bank,orderBank,estimateBank])for(const q of list.filter(q=>q.id.startsWith('modern-')))assert.ok(validArtwork(q.illustration));
 for(const d of levels)for(const list of [modernChoices,modernOrders,modernEstimates])assert.ok(list.filter(q=>q.difficulty===d).length>=4);
 assert.equal(standardPool().filter(q=>q.id?.startsWith('modern-')).length,modern.length);
});
test('modern weighting still respects every difficulty and round format',()=>{
 for(const d of levels){const qs=contest('party',undefined,d);assert.equal(qs.length,18);assert.ok(qs.every(q=>q.difficulty===d));assert.ok(qs.slice(3,6).every(q=>q.mode==='order'));assert.ok(qs.slice(6,9).every(q=>q.mode==='number'));}
});
