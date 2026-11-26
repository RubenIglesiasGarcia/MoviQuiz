import test from 'node:test';import assert from 'node:assert/strict';import {arcadeAward,arcadeQuip} from '../public/arcade-humor.js';
const state={players:[{id:'a',name:'A'},{id:'b',name:'B'}],arcade:{plan:{kind:'coins',variant:'sofa'},players:{a:{attempts:4,bumps:3,score:70},b:{attempts:2,bumps:0,score:350}}}};
test('comic award recognizes actual shoves, not overall score or arbitrary losers',()=>{const award=arcadeAward(state);assert.equal(award.name,'A');assert.equal(award.label,'SIN RESERVA');assert.equal(state.arcade.players.a.score,70);});
test('inactive and tied zero-score contestants never get a fake award',()=>{assert.equal(arcadeAward({players:state.players,arcade:{plan:{kind:'dash'},players:{a:{attempts:0,score:500},b:{attempts:1,score:0}}}}),null);});
test('arcade jokes distinguish hits, misses and perfect actions',()=>{assert.notEqual(arcadeQuip('dash',150,0),arcadeQuip('dash',0,0));assert.notEqual(arcadeQuip('dash',0,0),arcadeQuip('dash',0,1));});
