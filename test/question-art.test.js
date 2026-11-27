import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {standardPool,contest,selectedContest} from '../party.js';
import {artworkKeys,validArtwork} from '../question-art.js';
import {memePack,builtinPack} from '../community-packs.js';
import {loadPackSelection,packAPI} from '../question-packs.js';
import {validateQuestions} from '../game.js';
test('every standard question has original media or valid local artwork',()=>{
 const all=standardPool();assert.ok(all.length>200);
 for(const q of all){if(q.media){assert.equal(q.illustration,undefined);continue;}assert.ok(validArtwork(q.illustration),q.prompt);}
 for(const key of artworkKeys)assert.ok(existsSync(new URL('../public/question-art/'+key+'.svg',import.meta.url)));
 for(const kind of ['classic','party'])for(const q of contest(kind,undefined,'Mixta'))assert.ok(q.media||validArtwork(q.illustration));
 assert.equal(validateQuestions([{mode:'boolean',prompt:'A question',correct:true,illustration:'https://bad.example/x'}])[0].illustration,undefined);
});
test('curated community pack is publicly selectable without database records',async()=>{
 const env={DB:{prepare(){return {bind(){return this;},async run(){return {success:true};},async all(){return {results:[]};},async first(){throw Error('unexpected db lookup');}};},async batch(statements){return Promise.all(statements.map(s=>s.all()));}}},u={id:'guest',guest:true};
 const catalog=await (await packAPI(env,u,'list')).json();assert.ok(catalog.community.some(p=>p.id===memePack.id&&p.builtin));
 const lookup=await (await packAPI(env,u,'lookup',{id:memePack.id})).json();assert.equal(lookup.pack.count,memePack.count);
 const source=await loadPackSelection(env,u,{standard:false,categories:null,packIds:[memePack.id]});assert.equal(source.questions.length,memePack.count);
 assert.equal(builtinPack(memePack.id).questions.length,memePack.count);
 for(const q of source.questions)assert.ok(validArtwork(q.illustration));
 for(const difficulty of ['Muy fácil','Fácil','Media','Difícil','Muy difícil'])assert.ok(selectedContest('classic',difficulty,source).length>=3);
 assert.equal(selectedContest('party','Mixta',source).length,18);
 assert.equal((await packAPI(env,u,'edit',{id:memePack.id})).status,403);
});
