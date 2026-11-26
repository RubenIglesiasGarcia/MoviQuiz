import test from 'node:test';
import assert from 'node:assert/strict';
import {roundBeat,showScene} from './public/show-direction.js';

test('opening, quick rounds and finale get distinct broadcast cues',()=>{
 const opening={index:0,total:8,question:{party:'classic'},introDuration:3000};
 assert.equal(roundBeat(opening).title,'¡QUE EMPIECE EL SHOW!');
 assert.equal(roundBeat(opening).quick,false);
 const short={...opening,index:2,introDuration:1200};
 assert.equal(roundBeat(short).quick,true);
 assert.notEqual(roundBeat(short).title,roundBeat(opening).title);
 assert.deepEqual(roundBeat(short),roundBeat({...short}));
 const special={...opening,index:3,question:{party:'steal'}};
 assert.equal(roundBeat(special).special,true);
 assert.equal(roundBeat(special).title,showScene(special).title);
 const final={...opening,index:7,question:{party:'final',multiplier:3}};
 assert.equal(roundBeat(final).title,'¡LA ÚLTIMA!');
 assert.equal(showScene(final).title,'GRAN FINAL · ×3');
});
