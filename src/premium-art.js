import * as THREE from 'three';
// Original, procedural art direction for MobiQuiz. All geometry is generated locally.
const clamp=THREE.MathUtils.clamp;
const standard=(color,roughness=.65,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
const glow=(color,intensity=1)=>new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:intensity,roughness:.45});
const add=(p,g,m,x=0,y=0,z=0)=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);p.add(o);return o;};
const box=(p,m,x,y,z,w,h,d)=>add(p,new THREE.BoxGeometry(w,h,d),m,x,y,z);
const sphere=(p,m,x,y,z,sx,sy,sz)=>{const o=add(p,new THREE.SphereGeometry(1,20,14),m,x,y,z);o.scale.set(sx,sy,sz);return o;};
const ring=(p,m,x,y,z,r,t=.025)=>add(p,new THREE.TorusGeometry(r,t,8,48),m,x,y,z);
function plate(p,m,points,z){const s=new THREE.Shape();points.forEach(([x,y],i)=>i?s.lineTo(x,y):s.moveTo(x,y));s.closePath();return add(p,new THREE.ShapeGeometry(s),m,0,0,z);}
export function tailoredBody(parent,material){
 const profile=[[0,-.43],[.26,-.43],[.34,-.36],[.38,-.16],[.43,.10],[.44,.22],[.37,.34],[.24,.40],[.12,.42],[0,.42]].map(([x,y])=>new THREE.Vector2(x,y));
 const body=add(parent,new THREE.LatheGeometry(profile,32),material,0,1.05,0);body.scale.z=.74;return body;
}
export function sculptedHead(parent,material){
 const profile=[[0,-.54],[.20,-.53],[.34,-.43],[.46,-.27],[.53,-.06],[.54,.17],[.48,.36],[.34,.49],[.18,.55],[0,.56]].map(([x,y])=>new THREE.Vector2(x,y));
 const head=add(parent,new THREE.LatheGeometry(profile,40),material);head.scale.z=.91;return head;
}
export function enrichAvatar({root,torso,head,arms,legs,skin,dark,white,hair,shirt,gold,facialFeatures,eyes,mouth},a){
 const host=a.presenter===true;
 // Extra shape definition, not photo replacement. Facial details follow the existing photo visibility contract.
 const seam=standard(host?0x422866:0x35324f,.8);
 if(host){
  const velvet=standard(0x50327a,.86),lapel=standard(0x211631,.5),cream=standard(0xffeddc,.7);
  shirt.color.setHex(0x643ba2);shirt.roughness=.78;
  plate(torso,cream,[[-.22,1.37],[.22,1.37],[.11,.86],[-.11,.86]],.305);
  for(const s of [-1,1]){
   plate(torso,lapel,[[s*.05,1.44],[s*.31,1.34],[s*.21,1.12],[s*.32,1.10],[s*.09,.82]],.326);
   // Sleeve cuffs are integrated into the sculpted body.
   // Existing avatar eyebrows are retained; one silhouette per eye.
  }
  sphere(torso,gold,-.10,1.37,.34,.13,.06,.035);sphere(torso,gold,.10,1.37,.34,.13,.06,.035);sphere(torso,lapel,0,1.37,.37,.048,.055,.035);
  for(let i=0;i<2;i++)sphere(torso,gold,0,.92-i*.14,.294,.038,.038,.019);
  const pocket=plate(torso,velvet,[[.19,1.13],[.34,1.13],[.31,1.21],[.19,1.16]],.305);
  // Sculpted hair swept upward with a single coherent silhouette.
  for(let i=0;i<4;i++){const lock=sphere(head,hair,-.30+i*.17,.43+i*.026,.10,.19,.22,.30);lock.rotation.z=-.35;}
 }else{
  // Player seams and hems are integrated into the sculpted body.
 }
 const iris=standard(host?0x694538:0x655f86,.37),nose=sphere(head,skin,0,-.05,.475,.093,.105,.09);
 facialFeatures.push(nose);
 for(const s of [-1,1]){const i=sphere(head,iris,s*.2,.08,.483,.079,.091,.026);facialFeatures.push(i);eyes.push([i,.091]);}
 // Lip and interior remain independent, so the avatar can articulate vowels and closed consonants.
 const lip=sphere(head,standard(0xb86e64,.82),0,-.222,.465,.141,.052,.035);
 lip.renderOrder=0;mouth.position.z=.487;mouth.renderOrder=1;facialFeatures.push(lip);
 const teeth=sphere(head,white,0,-.202,.508,.077,.015,.016),tongue=sphere(head,standard(0xce797d),0,-.245,.505,.055,.016,.012);
 teeth.visible=false;tongue.visible=false;facialFeatures.push(teeth,tongue);
 // Shoes are now fully modelled in the body module.
 return {lip,teeth,tongue,host,facialFeatures};
}
export function articulate(model,amount,time=0){
 if(!model.mouth||!model.mouth.visible)return;
 const a=clamp(amount,0,1),wide=.5+.5*Math.sin(time*8.3);
 model.mouth.scale.set(.12+a*(.035*wide-.026),.025+.118*a,.032);
 if(model.lip){model.lip.scale.x=model.mouth.scale.x*1.15;model.lip.scale.y=model.mouth.scale.y+.018;model.lip.position.y=-.222;}
 if(model.teeth){model.teeth.visible=a>.30;model.teeth.position.y=-.22+model.mouth.scale.y*.52;model.teeth.scale.x=model.mouth.scale.x*.73;}
 if(model.tongue){model.tongue.visible=a>.56;model.tongue.position.y=-.22-model.mouth.scale.y*.45;}
}
export function qualityProfile(tv=false,count=1){
 const cast=typeof location!=='undefined'&&new URLSearchParams(location.search).get('cast')==='1';
 const weak=(navigator.hardwareConcurrency||4)<=4||((navigator.deviceMemory||8)<=4);
 let preset='auto';try{preset=localStorage.getItem('mq.graphics')||'auto';}catch{}
 const high=preset==='high'||(preset==='auto'&&tv&&!cast&&!weak&&count<=4);
 return {high,cast,maxPixelRatio:high?1.75:cast?1.15:1.35,frameMs:high?16:33,shadows:high&&count<=4};
}
export function configureRenderer(renderer,quality){
 renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.16;
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,quality.maxPixelRatio));
 renderer.shadowMap.enabled=quality.shadows;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
}
export function studioLight(scene,key,quality){
 const rim=new THREE.DirectionalLight(0xc3a7ff,1.8);rim.position.set(2,5,-6);scene.add(rim);
 if(quality.shadows){key.castShadow=true;key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-8,right:8,top:8,bottom:-8,near:.5,far:30});key.shadow.bias=-.0005;key.shadow.normalBias=.025;key.shadow.camera.updateProjectionMatrix();}
 return rim;
}
export function markShadows(scene){scene.traverse(o=>{if(o.isMesh&&!o.material.transparent&&o.material.isMeshStandardMaterial){o.castShadow=true;o.receiveShadow=true;}});}
function instanced(parent,geometry,material,entries){
 const m=new THREE.InstancedMesh(geometry,material,entries.length),dummy=new THREE.Object3D();
 entries.forEach((v,i)=>{dummy.position.set(...v.slice(0,3));dummy.scale.set(v[3]??1,v[4]??1,v[5]??1);dummy.rotation.set(0,0,v[6]??0);dummy.updateMatrix();m.setMatrixAt(i,dummy.matrix);});m.instanceMatrix.needsUpdate=true;parent.add(m);return m;
}
export function premiumStudio(scene,theme){
 const metal=standard(0x302641,.38,.55),velvet=standard(0x211632,.87),warm=glow(0xffc76a,1.4),cool=glow(theme==='tropical'?0x55eed1:0x8f8bff,1.1);
 const deck=add(scene,new THREE.CylinderGeometry(7.1,7.3,.28,64),metal,0,-.45,0);
 for(const [r,y,m] of [[6.87,-.25,warm],[6.98,-.38,cool],[4.85,-.005,cool]]){const t=ring(scene,m,0,y,0,r,.025);t.rotation.x=Math.PI/2;}
 box(scene,metal,0,2.1,-7.1,13,4.3,.45);
 box(scene,velvet,0,2.5,-6.83,10,3.1,.15);
 const panels=[];for(let i=0;i<18;i++)panels.push([-4.6+i*.54,2.35,-6.68,.018,1.1,.025]);
 instanced(scene,new THREE.BoxGeometry(1,1,1),cool,panels);
 const rail=ring(scene,warm,0,4.7,-.6,5.9,.045);rail.rotation.x=Math.PI/2;
 const audience=[];for(let r=0;r<3;r++)for(let i=0;i<22;i++){const theta=(i-10.5)*.109;audience.push([Math.sin(theta)*(6.8+r*.3),.48+r*.48,-Math.cos(theta)*5.7-r*.25,.15,.22,.15]);}
 instanced(scene,new THREE.SphereGeometry(1,8,6),standard(0x5e427e,.85),audience);
 const lights=[];for(let i=0;i<9;i++){const x=(i-4)*1.4;box(scene,metal,x,4.65,-4.9,.55,.28,.38);lights.push([x,4.62,-4.68,.18,.12,.04]);}
 instanced(scene,new THREE.SphereGeometry(1,12,8),warm,lights);
 // Low-cost translucent light shafts: additive, no volumetric ray marching.
 const beamMat=new THREE.MeshBasicMaterial({color:0xb9a0ff,transparent:true,opacity:.045,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending});
 const beams=[];for(const x of [-4.2,-2.8,2.8,4.2]){const b=add(scene,new THREE.ConeGeometry(1.35,5.5,16,1,true),beamMat,x,2.0,-3.6);b.rotation.z=x*.04;beams.push(b);}
 const target=new THREE.Color();return {animate(t,celebrate,accent='#b9a0ff'){beams.forEach((b,i)=>{b.rotation.z=(i-1.5)*.11+Math.sin(t*.5+i)*.12;});beamMat.opacity=celebrate?.085:.042;target.set(accent);beamMat.color.lerp(target,.045);cool.emissive.lerp(target,.035);}};
}
export function premiumArcade(scene,kind,width){
 const metal=standard(0x22223d,.44,.4),edge=glow(kind==='dash'?0x7bd5ff:kind==='dodge'?0x9f8dff:0xffb866,1.1),gold=glow(0xffdf80,1);
 const barrier=kind==='dodge'?0x18233f:0x352650;
 for(const x of [-width/2-.45,width/2+.45]){box(scene,metal,x,.32,-3,.32,.65,16);box(scene,edge,x,.68,-3,.055,.045,16);}
 const marks=[];for(let i=0;i<20;i++)marks.push([0,.027,-10+i*.74,width+.5,.008,.016]);
 instanced(scene,new THREE.BoxGeometry(1,1,1),edge,marks);
 if(kind==='dodge'){
  const planet=sphere(scene,standard(0x6759b8,.8),width/2+1,7,-17,3,3,3);
  const r=ring(scene,gold,planet.position.x,planet.position.y,planet.position.z,4,.10);r.rotation.set(1.2,.1,.4);
  const stars=[];for(let i=0;i<80;i++)stars.push([Math.sin(i*2.39996)*(width+8),3+(i%13)*.7,-18-(i%7),.035,.035,.035]);
  instanced(scene,new THREE.SphereGeometry(1,6,4),new THREE.MeshBasicMaterial({color:0xd8d7ff}),stars);
 }else{
  for(let i=0;i<3;i++)box(scene,standard(barrier,.8),0,.25+i*.42,-11-i*.6,width+4,.4,1.2);
  const crowd=[];for(let i=0;i<42;i++)crowd.push([(i%21-10)*(width+3)/21,.8+Math.floor(i/21)*.55,-11.4-Math.floor(i/21)*.5,.14,.2,.14]);
  instanced(scene,new THREE.SphereGeometry(1,8,6),standard(0x785a8c),crowd);
  for(const x of [-width/2-1,width/2+1]){box(scene,metal,x,3,-8,.16,5.8,.16);box(scene,gold,x,5.65,-8,.75,.25,.32);}
 }
}
export function hoopNet(parent,x,y,z){
 const material=new THREE.LineBasicMaterial({color:0xfff1df,transparent:true,opacity:.85});const vertices=[];
 for(let i=0;i<12;i++){const a=i*Math.PI/6,b=a+Math.PI/6;vertices.push(x+Math.cos(a)*.39,y,z+Math.sin(a)*.39,x+Math.cos(b)*.24,y-.43,z+Math.sin(b)*.24);vertices.push(x+Math.cos(b)*.39,y,z+Math.sin(b)*.39,x+Math.cos(a)*.24,y-.43,z+Math.sin(a)*.24);}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));parent.add(new THREE.LineSegments(g,material));
}
export function decorateBasketball(ball){const dark=standard(0x3a2119,.8);for(const [x,y] of [[0,0],[Math.PI/2,0],[0,Math.PI/2]]){const r=ring(ball,dark,0,0,0,1.003,.025);r.rotation.set(x,y,0);}}
