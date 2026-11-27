import {arcadeAward} from '../public/arcade-balance.js';
import test from 'node:test';import assert from 'node:assert/strict';
import {territoryPlan,advanceCoins,blocked,TERRITORY_TILE_POINTS} from '../public/coin-engine.js';
import {actionRound,startAction,recordAction,finishAction,isAction} from '../public/arcade-rules.js';
test('territory uses the existing secure movement transport and has a stable playable grid',()=>{const p=territoryPlan();assert.equal(p.kind,'coins');assert.equal(p.variant,'territory');assert.ok(isAction('territory'));assert.ok(p.tiles.length>40);assert.equal(new Set(p.tiles.map(t=>t.id)).size,p.tiles.length);assert.ok(p.tiles.every(t=>!blocked(t.x,t.z,.32)));});
test('players capture and steal tiles, stationary players do not reclaim them, final scores reflect ownership',()=>{
 const r={phase:'question',players:{a:{},b:{}},answers:{}};startAction(r,actionRound('territory'),1000);const a=r.action,t=a.plan.tiles[0],p=a.players.a,q=a.players.b;
 Object.assign(p,{x:t.x,z:t.z,vx:.1,vz:0,until:4800,attempts:1});advanceCoins(a,4550);assert.equal(a.world.owners[t.id],p.colorIndex);assert.equal(p.score,TERRITORY_TILE_POINTS);
 Object.assign(q,{x:t.x,z:t.z,vx:.1,vz:0,until:5200,attempts:1});advanceCoins(a,5000);assert.equal(a.world.owners[t.id],q.colorIndex);assert.equal(p.score,0);assert.equal(q.score,TERRITORY_TILE_POINTS);assert.equal(q.repaints,1);
 advanceCoins(a,6000);assert.equal(a.world.owners[t.id],q.colorIndex);finishAction(r);assert.equal(r.answers.b.rawPoints,TERRITORY_TILE_POINTS);assert.equal(r.answers.b.points,arcadeAward(a.plan,TERRITORY_TILE_POINTS));assert.equal(r.answers.a.points,0);
});
test('invalid control is rejected and unplayed arena has no automatic points',()=>{const r={phase:'question',players:{a:{}},answers:{}};startAction(r,actionRound('territory'),1000);assert.throws(()=>recordAction(r,'outsider','100,0,0',0,4500));advanceCoins(r.action,7000);finishAction(r);assert.equal(r.answers.a.points,0);assert.equal(r.answers.a.timeout,true);});
