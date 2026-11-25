import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {buildContestantBody,optimizeContestantBody,maskGeometry} from '../src/avatar-studio.js';
const makeMaterial=color=>new THREE.MeshStandardMaterial({color});
test('sculpted avatar retains all four independent joint pivots and fits the stage',()=>{
 const root=new THREE.Group(),torso=new THREE.Group(),arms=[],legs=[];root.add(torso);
 const skin=makeMaterial(0xeeb57d),dark=makeMaterial(0x25243b),white=makeMaterial(0xffffff),shirt=makeMaterial(0x6ee5a3),gold=makeMaterial(0xf8d64d);
 buildContestantBody({root,torso,skin,dark,white,shirt,gold,arms,legs},{shirt:'green'});
 assert.equal(arms.length,2);assert.equal(legs.length,2);
 assert.ok(arms.every(a=>a.parent===torso));assert.ok(legs.every(a=>a.parent===root));
 const before=new THREE.Box3().setFromObject(root);assert.ok(before.min.y>=-.1);assert.ok(before.max.y<1.7);
 const count=()=>{let n=0;root.traverse(o=>{if(o.isMesh)n++;});return n;};const initial=count();
 optimizeContestantBody(torso,arms,legs);assert.ok(count()<initial);
 const after=new THREE.Box3().setFromObject(root);assert.ok(before.min.distanceTo(after.min)<.01);assert.ok(before.max.distanceTo(after.max)<.01);
});
test('photo mask is a forward-facing curved oval with valid UVs',()=>{
 const g=maskGeometry(),p=g.attributes.position,uv=g.attributes.uv,n=g.attributes.normal;
 assert.equal(p.count,uv.count);assert.ok(p.getZ(0)>p.getZ(p.count-1));
 assert.ok(n.getZ(0)>.95);
 for(let i=0;i<uv.count;i++){assert.ok(uv.getX(i)>=-1e-6&&uv.getX(i)<=1+1e-6);assert.ok(uv.getY(i)>=-1e-6&&uv.getY(i)<=1+1e-6);}
 g.dispose();
});
