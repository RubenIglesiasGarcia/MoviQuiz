import {test} from 'node:test';
import assert from 'node:assert/strict';
import {coinPlan,blocked,advanceCoins} from '../public/coin-engine.js';
import {actionRound,startAction,recordAction,finishAction} from '../public/arcade-rules.js';
const setup=()=>{const r={phase:'question',players:{a:{},b:{}},answers:{}};startAction(r,actionRound('coins'),1000);return r;};
test('coin arena has three waves, unique coins and valid positions',()=>{const r=setup(),plan=coinPlan(()=>.4);assert.equal(r.deadline,34500);assert.equal(plan.coins.length,66);assert.equal(new Set(plan.coins.map(c=>c.id)).size,66);assert.ok(plan.coins.every(c=>!blocked(c.x,c.z,.20)));});
test('movement is continuous and stops after control lease expires',()=>{const r=setup(),p=r.action.players.a,start=p.x;recordAction(r,'a','-100,0,0',0,4500);advanceCoins(r.action,5000);assert.ok(p.x<start-1);advanceCoins(r.action,6000);const x=p.x;advanceCoins(r.action,6500);assert.equal(p.x,x);});
test('arena collision respects obstacles and bounds',()=>{const r=setup(),p=r.action.players.a;for(let t=4500;t<9000;t+=250)recordAction(r,'a','-100,0,0',0,t);advanceCoins(r.action,9000);assert.ok(p.x>=2.1+.95/2+.23-.05);for(let t=9000;t<14000;t+=250)recordAction(r,'a','100,0,0',0,t);advanceCoins(r.action,14000);assert.ok(p.x<=5.76&&p.x>5.5);});
test('direction is normalized and turbo cooldown cannot be bypassed',()=>{const r=setup(),p=r.action.players.a;recordAction(r,'a','-100,100,1',0,4500);assert.ok(Math.hypot(p.vx,p.vz)<=1.000001);assert.equal(p.boostReady,6700);recordAction(r,'a','-100,100,1',0,4750);assert.equal(p.boostReady,6700);assert.throws(()=>recordAction(r,'a','0,100,1',0,4760));});
test('invalid, premature and outsider inputs are rejected',()=>{const r=setup();for(const [id,input,time] of [['a','200,0,0',4500],['outsider','100,0,0',4500],['a','100,0,0',4499],['a','1e3,0,0',4500],['a','0,0,0',34500]])assert.throws(()=>recordAction(r,id,input,0,time));});
test('contested pickups are unique and included in final results',()=>{const r=setup(),a=r.action,c=a.plan.coins[0];for(const p of Object.values(a.players)){p.x=c.x;p.z=c.z;p.attempts=1;p.until=5000;}advanceCoins(a,4550);const sum=a.players.a.score+a.players.b.score;assert.ok(sum>=c.value);advanceCoins(a,4650);assert.equal(a.players.a.score+a.players.b.score,sum);finishAction(r);assert.ok(r.answers.a.points+r.answers.b.points>=sum);});

test('neutral or disconnected players cannot farm stationary coins',()=>{const r=setup(),a=r.action,c=a.plan.coins[0],p=a.players.a;p.x=c.x;p.z=c.z;recordAction(r,'a','0,0,0',0,4500);advanceCoins(a,5000);assert.equal(p.score,0);assert.equal(p.attempts,0);});

test('expired movement leases cannot collect an unattended pickup',()=>{const r=setup(),a=r.action,c=a.plan.coins[0],p=a.players.a;Object.assign(p,{x:c.x,z:c.z,attempts:1,until:4500});advanceCoins(a,4550);assert.equal(p.score,0);});
