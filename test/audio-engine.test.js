import test from 'node:test';
import assert from 'node:assert/strict';
test('a trusted gesture retries blocked Web Audio and the test schedules audible notes after resume',async()=>{
 const data=new Map();globalThis.localStorage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)};
 let started=0,resumes=0,allow=false;
 const param=()=>({value:0,setTargetAtTime(){},setValueAtTime(){},exponentialRampToValueAtTime(){},linearRampToValueAtTime(){}});
 const node=()=>({gain:param(),threshold:param(),ratio:param(),frequency:param(),connect(){return this;},disconnect(){}});
 class AC{state='suspended';currentTime=1;destination={};createGain(){return node();}createDynamicsCompressor(){return node();}createOscillator(){return {...node(),start(){started++;},stop(){}};}resume(){resumes++;if(allow)this.state='running';return Promise.resolve();}}
 globalThis.window={AudioContext:AC};
 const engine=await import('../public/effects.js');
 assert.equal(await engine.unlockAudio(),false);
 allow=true;assert.equal(await engine.testDeviceAudio(),true);
 assert.equal(engine.audioStatus().state,'running');assert.ok(resumes>=2);assert.equal(started,4);
 engine.setAudioVolume(45);assert.equal(engine.audioVolume(),45);
 engine.setAudioVolume(0);assert.equal(await engine.testDeviceAudio(),true);assert.equal(engine.audioVolume(),80);
});
