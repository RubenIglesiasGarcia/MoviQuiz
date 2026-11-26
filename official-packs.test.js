import test from 'node:test';
import assert from 'node:assert/strict';
import {officialPacks,builtinPack,memePack} from './community-packs.js';
import {loadPackSelection,packAPI} from './question-packs.js';
import {validateQuestions} from './game.js';
import {selectedContest} from './party.js';

const levels=['Muy fácil','Fácil','Media','Difícil','Muy difícil'];
const user={id:'tester',guest:true};
const env={DB:null};

test('five official packs have distinct IDs and playable content at every difficulty',()=>{
 assert.equal(officialPacks.length,5);
 assert.equal(new Set(officialPacks.map(p=>p.id)).size,5);
 assert.equal(officialPacks.reduce((n,p)=>n+p.count,0),170);
 for(const meta of officialPacks){
  assert.match(meta.id,/^[a-f0-9]{24}$/);
  assert.equal(meta.builtin,true);
  const pack=builtinPack(meta.id);
  assert.equal(meta.count,pack.questions.length);
  assert.equal(new Set(pack.questions.map(q=>q.id)).size,pack.questions.length);
  assert.equal(new Set(pack.questions.map(q=>q.prompt)).size,pack.questions.length);
  for(const q of pack.questions)validateQuestions([q]);
  for(const level of levels){
   const source={standard:false,categories:null,questions:pack.questions};
   assert.ok(pack.questions.filter(q=>q.difficulty===level).length>=3);
   for(const kind of ['classic','party']){
    const round=selectedContest(kind,level,source);
    assert.ok(round.length>=3);
    assert.ok(round.every(q=>q.difficulty===level));
   }
  }
 }
 assert.equal(memePack.id,'6d656d657332303236313131');
 assert.equal(builtinPack('000000000000000000000000'),null);
});

test('official packs can be combined without D1 reads',async()=>{
 const source=await loadPackSelection(env,user,{standard:false,categories:null,packIds:officialPacks.map(p=>p.id)});
 assert.equal(source.questions.length,170);
 assert.equal(source.standard,false);
});

test('lookup exposes only correct pack metadata and rejects editing official packs',async()=>{
 for(const meta of officialPacks){
  const response=await packAPI(env,user,'lookup',{id:meta.id});
  assert.equal(response.status,200);
  const {pack}=await response.json();
  assert.equal(pack.id,meta.id);
  assert.equal(pack.count,meta.count);
  assert.equal('questions' in pack,false);
  const edit=await packAPI(env,user,'edit',{id:meta.id});
  assert.equal(edit.status,403);
 }
});
