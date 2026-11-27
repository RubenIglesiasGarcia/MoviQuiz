import * as THREE from 'three';
import {arenaTheme} from '../public/arena-direction.js';
// Hand-authored miniature environments; decoration stays outside the collision footprint.
const M=(color,roughness=.76,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
const G=(color)=>new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:.65,roughness:.5});
const boxG=new THREE.BoxGeometry(1,1,1),rockG=new THREE.IcosahedronGeometry(1,0),ballG=new THREE.SphereGeometry(1,12,8),coneG=new THREE.ConeGeometry(1,1,9),cylG=new THREE.CylinderGeometry(1,1,1,16);
function batch(parent,g,material,items){if(!items.length)return;const o=new THREE.InstancedMesh(g.clone(),material,items.length),d=new THREE.Object3D();items.forEach((a,i)=>{d.position.set(a[0],a[1],a[2]);d.scale.set(a[3],a[4],a[5]);d.rotation.set(a[6]||0,a[7]||0,a[8]||0);d.updateMatrix();o.setMatrixAt(i,d.matrix);});o.instanceMatrix.needsUpdate=true;o.castShadow=false;o.receiveShadow=true;parent.add(o);return o;}
function mesh(p,g,m,x,y,z,sx=1,sy=1,sz=1){const o=new THREE.Mesh(g.clone(),m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);p.add(o);return o;}
export function decorateArena(scene,kind,quality){
 const theme=arenaTheme(kind),group=new THREE.Group();scene.add(group);
 const accent=G(theme.edge),dark=M(theme.sky,.86),stone=M(theme.ground,.82),cream=M(0xffe3b6,.75),metal=M(0x596073,.43,.35),water=M(0x4099bb,.35,.15);
 // Layered perimeter, inset floor markings and bevel-like trim. No extra obstacles.
 const plinths=[],trim=[],rivets=[];for(let i=0;i<14;i++){const x=-6.5+i;plinths.push([x,-.4,-4.55,.9,.55,.66],[x,-.4,4.55,.9,.55,.66]);trim.push([x,-.10,-4.38,.78,.08,.12],[x,-.10,4.38,.78,.08,.12]);}
 for(let i=0;i<9;i++){const z=-4+i;plinths.push([-6.55,-.4,z,.72,.55,.9],[6.55,-.4,z,.72,.55,.9]);trim.push([-6.4,-.10,z,.12,.08,.78],[6.4,-.10,z,.12,.08,.78]);}
 batch(group,boxG,stone,plinths);batch(group,boxG,accent,trim);
 const backdrop=[],details=[],secondary=[],lights=[],clouds=[];let animated=null;
 if(kind==='lava'){
  for(let i=0;i<19;i++){const x=-12+i*1.3,z=-8-(i%4)*1.4,h=1.1+(i%5)*.58;backdrop.push([x,h*.35-.6,z,1.25,h,1.6,.11,i*.7,.12]);}
  batch(group,rockG,M(0x68404a),backdrop);
  for(const x of [-8.8,8.8]){mesh(group,coneG,M(0x7f4144),x,1.5,-7.5,2.65,5.2,2.65);mesh(group,cylG,G(0xff7644),x,4.06,-7.5,.49,.13,.49);for(let i=0;i<8;i++)details.push([x+Math.sin(i*2.4)*1.8,-.1,-7.5+Math.cos(i*2.4)*1.6,.3,.1,.55,0,i]);}
  batch(group,boxG,G(0xff7535),details);
  const embers=[];for(let i=0;i<(quality.high?42:18);i++)embers.push([Math.sin(i*2.4)*8,1+i%5,-6-(i%4),.045,.07,.045]);animated=batch(group,ballG,G(0xffb25e),embers);
 }else if(kind==='splash'){
  mesh(group,boxG,water,0,-.75,0,26,.13,21);
  for(let i=0;i<16;i++){const x=-11+i*1.5;backdrop.push([x,.2+(i%3)*.4,-7-(i%4)*.75,.9,1.4+(i%4)*.5,1.1,0,i*.7,.1]);}
  batch(group,rockG,M(0xc8e8f1,.5),backdrop);
  for(const x of [-8.1,8.1]){mesh(group,rockG,M(0xa5d7e8),x,.4,-1.2,1.5,1.2,2.0);mesh(group,cylG,cream,x,.8,-1.2,.14,1,.14);mesh(group,boxG,accent,x+.35,1.28,-1.2,.65,.32,.045);}
  for(let i=0;i<18;i++)details.push([-10+(i%6)*4,-.64,-8+Math.floor(i/6)*7,.75,.018,.045,0,i*.55]);animated=batch(group,boxG,G(0x9fd9ed),details);
 }else if(kind==='tuna'){
  mesh(group,boxG,water,0,-.75,-.5,26,.12,21);
  for(let i=0;i<12;i++){const x=-8+i*1.45;details.push([x,.15,-5.25,.12,.8,.13],[x,.15,5.25,.12,.8,.13]);}
  batch(group,boxG,M(0x9d6845),details);
  for(const x of [-5,0,5]){mesh(group,boxG,M(0x5683a0),x,.55,-6.8,2.8,1.45,1.6);mesh(group,boxG,cream,x,1.36,-6.8,3.2,.16,1.9);for(let i=0;i<6;i++)secondary.push([x-1.35+i*.48,1.45,-6.6,.44,.12,1.55]);mesh(group,boxG,metal,x,.8,-5.98,1.6,.45,.06);}
  batch(group,boxG,M(0xe7857a),secondary);
  for(const x of [-7.4,7.4])for(let i=0;i<3;i++){mesh(group,boxG,M(0xb88c5e),x,.27+i*.47,-3.5,.8,.43,.8);mesh(group,boxG,cream,x,.27+i*.47,-3.06,.67,.06,.04);}
 }else if(kind==='bomb'||kind==='territory'){
  for(let i=0;i<9;i++){const x=(i-4)*1.55;backdrop.push([x,.6,-6.3,1.3,1.6,.95]);lights.push([x,1.27,-5.8,.70,.12,.06]);}
  batch(group,boxG,metal,backdrop);batch(group,boxG,accent,lights);
  if(kind==='bomb'){for(const x of [-7.7,7.7])for(let i=0;i<3;i++){mesh(group,boxG,M(0xbf9167),x,.22+i*.43,-3.2,.73,.4,.65);mesh(group,boxG,cream,x,.22+i*.43,-2.86,.27,.18,.025);}for(let i=0;i<15;i++)details.push([-7+i,1.6,-6.4,.25,.08,.25]);}
  else{const palette=[0xf38b9b,0x7dc8f2,0x7bdcab,0xffd55a];for(let i=0;i<4;i++){const x=-5.4+i*3.6,m=M(palette[i]);mesh(group,cylG,m,x,1.8,-7,.55,1.6,.55);mesh(group,cylG,metal,x,2.65,-7,.62,.12,.62);mesh(group,boxG,m,x,.9,-5.7,.64,.20,.5);}}
  animated=batch(group,boxG,accent,details);
 }else if(kind==='sofa'){
  for(const x of [-7.5,7.5]){mesh(group,cylG,M(0x9e7853),x,.1,-2.6,.5,.23,.5);mesh(group,cylG,metal,x,1.15,-2.6,.06,2,.06);mesh(group,coneG,cream,x,2.1,-2.6,.60,.65,.60);mesh(group,ballG,accent,x,1.88,-2.6,.2,.12,.2);}
  for(let i=0;i<4;i++){const x=-4.5+i*3;mesh(group,boxG,M(0x6b405e),x,1.2,-6,2.7,2.4,.25);mesh(group,boxG,M(0x97667c),x,1.2,-5.84,2.3,1.95,.08);mesh(group,boxG,cream,x,1.45,-5.77,.9,.03,.03);}
 }else{
  for(const x of [-7.5,7.5])for(let i=0;i<4;i++){mesh(group,cylG,M(0xd4a753,.45,.32),x,.12+i*.16,-2.8,.54,.13,.54);}
  mesh(group,cylG,metal,0,1.45,-6.7,1.45,.27,1.45).rotation.x=Math.PI/2;const door=mesh(group,cylG,M(0x93839a,.4,.4),0,1.45,-6.48,1.20,.2,1.20);door.rotation.x=Math.PI/2;for(let i=0;i<8;i++){const a=i*Math.PI/4;mesh(group,ballG,accent,Math.cos(a)*1.05,1.45+Math.sin(a)*1.05,-6.34,.1,.1,.06);}
  for(let i=0;i<12;i++)details.push([-6+i,1.8,-6.9,.28,.12,.06]);animated=batch(group,boxG,accent,details);
 }
 return {limitShadows(){group.traverse(o=>{if(o.isMesh){o.castShadow=false;o.receiveShadow=false;}});},animate(t,motion){if(!motion)return;if(animated){animated.position.y=kind==='lava'?Math.sin(t*.7)*.45:0;animated.position.x=kind==='splash'?Math.sin(t*.65)*.6:0;}accent.emissiveIntensity=.55+.12*Math.sin(t*1.7);}};
}
export function impactParticles(scene,quality){
 const count=quality.high?120:48,positions=new Float32Array(count*3),colors=new Float32Array(count*3),g=new THREE.BufferGeometry();positions.fill(-100);g.setAttribute('position',new THREE.BufferAttribute(positions,3));g.setAttribute('color',new THREE.BufferAttribute(colors,3));
 const p=new THREE.Points(g,new THREE.PointsMaterial({size:.17,vertexColors:true,transparent:true,opacity:.95,depthWrite:false,blending:THREE.AdditiveBlending}));p.frustumCulled=false;scene.add(p);const effects=[],col=new THREE.Color();
 return {burst(x,z,now,kind){effects.push({x,z,now,kind});if(effects.length>12)effects.shift();},animate(now){let k=0;for(let i=effects.length-1;i>=0;i--)if(now-effects[i].now>700)effects.splice(i,1);for(const e of effects){const t=(now-e.now)/700;col.set(e.kind==='splash'?0xa5e9ff:e.kind==='lava'?0xff9a4c:0xffd67b);for(let j=0;j<10&&k<count;j++,k++){const a=j*Math.PI/5;positions[k*3]=e.x+Math.cos(a)*t*1.5;positions[k*3+1]=.24+Math.sin(t*Math.PI)*(.55+j%3*.18);positions[k*3+2]=e.z+Math.sin(a)*t*1.5;colors[k*3]=col.r;colors[k*3+1]=col.g;colors[k*3+2]=col.b;}}for(let i=k*3;i<positions.length;i++)positions[i]=-100;g.attributes.position.needsUpdate=true;g.attributes.color.needsUpdate=true;}};
}
