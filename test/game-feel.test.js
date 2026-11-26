import {test} from 'node:test';import assert from 'node:assert/strict';import {moveItem,insertionIndex,canStartOrderDrag} from '../public/order.js';import {rankBefore,movement,reactionStyle,REVEAL_MS} from '../public/reaction-style.js';
test('drag moves without losing items and keeps original order immutable',()=>{const x=[0,1,2,3];assert.deepEqual(moveItem(x,0,2),[1,2,0,3]);assert.deepEqual(moveItem(x,3,0),[3,0,1,2]);assert.deepEqual(moveItem(x,-1,2),x);assert.deepEqual(x,[0,1,2,3]);});
test('ranking uses the server previous positions, even on a tie',()=>{const ps=[{id:'a',score:100,last:80,previousRank:1},{id:'b',score:90,last:0,previousRank:0}];assert.deepEqual(rankBefore(ps).map(x=>x.id),['b','a']);assert.equal(movement(ps,ps[0]),1);assert.equal(movement(ps,ps[1]),-1);});
test('reactions rotate across rounds and special events take priority',()=>{const p={id:'a',reaction:'correct'};assert.notEqual(reactionStyle(p,0),reactionStyle(p,1));assert.equal(reactionStyle({...p,hits:1},2,1),'pie');assert.equal(reactionStyle({...p,fooled:1},2),'giggle');assert.equal(REVEAL_MS,10000);});

test('drag insertion follows the card centre across stable sibling midpoints',()=>{
 const centers=[30,90,150];
 assert.equal(insertionIndex(0,centers),0);
 assert.equal(insertionIndex(29,centers),0);
 assert.equal(insertionIndex(30,centers),1);
 assert.equal(insertionIndex(95,centers),2);
 assert.equal(insertionIndex(200,centers),3);
 assert.equal(insertionIndex(10,[]),0);
 let order=[0,1,2,3];
 order=moveItem(order,order.indexOf(0),insertionIndex(100,centers));
 assert.deepEqual(order,[1,2,0,3]);
 order=moveItem(order,order.indexOf(0),insertionIndex(10,centers));
 assert.deepEqual(order,[0,1,2,3]);
});

test('touch, pen and mouse drag from the whole answer card while arrows stay independent',()=>{
 for(const pointerType of ['touch','pen','mouse']){
  for(const part of ['label','grip','position','tile'])assert.equal(canStartOrderDrag({pointerType,button:0,target:{closest:()=>null}}),true,part);
  for(const part of ['up','down'])assert.equal(canStartOrderDrag({pointerType,button:0,target:{closest:()=>({part})}}),false);
 }
 assert.equal(canStartOrderDrag({button:2,target:{closest:()=>null}}),false);
});
