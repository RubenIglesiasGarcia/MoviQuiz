import test from 'node:test';
import assert from 'node:assert/strict';
import {shouldPlayShowAudio} from '../public/audio-routing.js';
const base={hasState:true,visible:true};
test('host and players hear the shared show on their own devices without a TV',()=>{
 for(const role of ['host','player','screen'])assert.equal(shouldPlayShowAudio({...base,role,view:role}),true);
});
test('casting pauses only the sender shared audio, not the TV; optional local playback works',()=>{
 assert.equal(shouldPlayShowAudio({...base,role:'host',view:'host',casting:true}),false);
 assert.equal(shouldPlayShowAudio({...base,role:'host',view:'host',casting:true,alsoLocal:true}),true);
 assert.equal(shouldPlayShowAudio({...base,role:'screen',view:'screen',casting:true}),true);
});
test('audio stops in hidden tabs, menus and when no room is active',()=>{
 for(const opts of [{visible:false},{view:'profile'},{hasState:false}])assert.equal(shouldPlayShowAudio({...base,role:'player',view:'player',...opts}),false);
});
