import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
// Hand-authored modular character meshes. All measurements match the existing
// joint pivots, so gameplay poses and cosmetics keep working.
const material=(color,roughness=.65,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
function mesh(parent,geo,mat,x=0,y=0,z=0){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);parent.add(m);return m;}
function oval(parent,mat,x,y,z,sx,sy,sz){const m=mesh(parent,new THREE.SphereGeometry(1,20,14),mat,x,y,z);m.scale.set(sx,sy,sz);return m;}
function rounded(parent,mat,x,y,z,w,h,d,r=.06){return mesh(parent,new RoundedBoxGeometry(w,h,d,2,r),mat,x,y,z);}
function profile(parent,mat,points,x,y,z,depth=1,segments=24){
 const ordered=points[0][1]>points[points.length-1][1]?[...points].reverse():points;const c=new THREE.CatmullRomCurve3(ordered.map(([r,h])=>new THREE.Vector3(r,h,0)),false,'centripetal');
 const p=c.getPoints(28).map(v=>new THREE.Vector2(Math.max(0,v.x),v.y));const m=mesh(parent,new THREE.LatheGeometry(p,segments),mat,x,y,z);m.scale.z=depth;return m;
}
function stitch(parent,mat,points,r=.012){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));return mesh(parent,new THREE.TubeGeometry(curve,12,r,6,false),mat);}
export function buildContestantBody({root,torso,skin,dark,white,shirt,gold,arms,legs},a){
 const host=a.presenter===true;if(host)shirt.color.setHex(0x643ba2);const trim=material(shirt.color.clone().multiplyScalar(.63),.84),light=material(shirt.color.clone().lerp(new THREE.Color(0xffffff),.19),.76),pants=material(host?0x292437:0x28334d,.83),sole=material(0x151c30,.87),rubber=material(0xe7eaf2,.67),crease=material(0xb87e59,.8),pantSeam=material(0x151d30,.8);
 shirt.roughness=.78;
 profile(torso,shirt,[[0,.61],[.27,.62],[.36,.68],[.37,.82],[.39,1.02],[.46,1.25],[.43,1.38],[.28,1.47],[.15,1.48],[0,1.47]],0,0,0,.77,32);
 profile(torso,trim,[[0,.61],[.31,.62],[.36,.65],[.37,.70],[.35,.73],[0,.74]],0,0,0,.79);
 oval(torso,pants,0,.66,0,.32,.18,.24);
 profile(torso,skin,[[0,0],[.14,.01],[.145,.13],[.12,.19],[0,.19]],0,1.39,0,.9);
 const collar=mesh(torso,new THREE.TorusGeometry(.16,.025,8,32),trim,0,1.47,.015);collar.rotation.x=Math.PI/2;collar.scale.y=.83;
 // A visible emblem and seams follow the curved surface instead of floating in front.
 const badge=mesh(torso,new THREE.ExtrudeGeometry(new THREE.Shape([new THREE.Vector2(0,.065),new THREE.Vector2(.054,.024),new THREE.Vector2(.038,-.052),new THREE.Vector2(-.038,-.052),new THREE.Vector2(-.054,.024)]),{depth:.013,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.007,bevelThickness:.007}),gold,.20,1.20,.300);badge.rotation.y=.30;
 for(const s of [-1,1]){
  if(!host){stitch(torso,trim,[[s*.37,1.27,.17],[s*.34,1.08,.20],[s*.31,.84,.19]],.011);stitch(torso,light,[[s*.31,1.36,.18],[s*.36,1.30,.19]],.012);}
  const arm=new THREE.Group();arm.position.set(s*.43,1.28,0);arm.rotation.z=s*.22;torso.add(arm);arms.push(arm);
  const sleeve=profile(arm,shirt,[[0,0],[.12,-.015],[.16,-.09],[.17,-.20],[.13,-.28],[0,-.29]],s*.10,.025,0,.96);sleeve.rotation.z=s*.12;
  profile(arm,trim,[[0,0],[.13,0],[.145,-.025],[.14,-.068],[0,-.07]],s*.135,-.22,0,.94);
  const fore=profile(arm,skin,[[0,0],[.113,-.01],[.113,-.095],[.087,-.19],[0,-.2]],s*.15,-.265,.018,.9);fore.rotation.z=-s*.05;
  rounded(arm,skin,s*.15,-.48,.045,.22,.22,.19,.085);
  oval(arm,skin,s*.035,-.453,.105,.065,.09,.065);
  for(let j=0;j<3;j++)stitch(arm,crease,[[s*.15-.065+j*.045,-.49,.137],[s*.15-.060+j*.045,-.54,.118]],.005);
  const leg=new THREE.Group();leg.position.set(s*.215,.69,0);root.add(leg);legs.push(leg);
  profile(leg,pants,[[0,0],[.17,-.02],[.19,-.14],[.16,-.30],[.145,-.44],[0,-.47]],0,0,0,.92);
  stitch(leg,pantSeam,[[s*.15,-.09,.085],[s*.15,-.25,.075],[s*.12,-.41,.065]],.009);
  profile(leg,white,[[0,0],[.145,0],[.145,-.085],[0,-.085]],0,-.38,0,.95);
  rounded(leg,sole,0,-.605,.135,.43,.10,.59,.045);
  rounded(leg,rubber,0,-.557,.14,.43,.09,.60,.04);
  rounded(leg,host?dark:shirt,0,-.478,.12,.38,.17,.53,.08);
  oval(leg,rubber,0,-.48,.30,.177,.086,.115);
  rounded(leg,host?dark:trim,0,-.414,-.015,.245,.16,.23,.06);
  for(let j=0;j<3;j++)rounded(leg,rubber,0,-.398-j*.018,.079+j*.052,.19,.018,.025,.008);
  for(const z of [-.04,.10,.24])rounded(leg,trim,s*.207,-.561,z,.015,.034,.065,.007);
 }
}
// Batch static meshes by material on each animated joint, preserving independent limbs.
function batchStaticParts(parent){const groups=new Map();for(const o of parent.children){if(!o.isMesh||Array.isArray(o.material)||o.material.transparent||!o.geometry.attributes.position||!o.geometry.attributes.normal||!o.geometry.attributes.uv)continue;const list=groups.get(o.material)||[];list.push(o);groups.set(o.material,list);}for(const [mat,parts] of groups){if(parts.length<2)continue;const copies=parts.map(o=>{o.updateMatrix();const g=o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone();g.applyMatrix4(o.matrix);return g;});let combined;try{combined=mergeGeometries(copies,false);}finally{copies.forEach(g=>g.dispose());}if(!combined)continue;for(const o of parts){parent.remove(o);o.geometry.dispose();}mesh(parent,combined,mat);}}
export function optimizeContestantBody(torso,arms,legs){for(const joint of [torso,...arms,...legs])batchStaticParts(joint);}
function maskGeometry(rx=.405,ry=.455,depth=.085,front=.52){
 const n=48,rings=10,positions=[0,-.012,front],uv=[.5,.5],indices=[];
 for(let i=1;i<=rings;i++){const r=i/rings;for(let j=0;j<=n;j++){const a=j*2*Math.PI/n,x=r*Math.cos(a),y=r*Math.sin(a);positions.push(x*rx,y*ry-.012,front-depth*r*r);uv.push(.5+x*.5,.5+y*.5);}}
 for(let j=0;j<n;j++)indices.push(0,1+j,2+j);
 for(let i=1;i<rings;i++){const a=1+(i-1)*(n+1),b=a+n+1;for(let j=0;j<n;j++)indices.push(a+j,b+j,b+j+1,a+j,b+j+1,a+j+1);}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();return g;
}
export function buildPhotoMask(head,a,facialFeatures){
 const group=new THREE.Group();group.visible=false;head.add(group);
 const rx=.405,ry=.455,front=.52,depth=.085;
 const faceMat=new THREE.MeshBasicMaterial({color:0xffffff,toneMapped:false});
 const face=mesh(group,maskGeometry(rx,ry,depth,front),faceMat);
 // An actual three-dimensional bezel hides the hard edge of the original
 // crop. The photo pixels are untouched; only UV mapping and framing change.
 const tint=({cat:0x8b71bc,fox:0xb97241,dragon:0x4b9777,space:0xb5c8df,wizard:0x69539e,party:0xbc587c,scout:0x58714c,crown:0xac8042,star:0xac8042})[a.hat]||0x493044;
 const rimMat=material(tint,.77),edge=material(0x211a30,.84);
 const ring=(rx,ry,z,r,mat)=>{const points=[];for(let i=0;i<48;i++){const t=i*Math.PI/24;points.push(new THREE.Vector3(rx*Math.cos(t),ry*Math.sin(t)-.012,z));}return mesh(group,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points,true,'centripetal'),48,r,8,true),mat);};
 ring(rx+.014,ry+.012,front-depth-.008,.039,rimMat);
 ring(rx-.004,ry-.004,front-depth+.008,.012,edge);
 new THREE.TextureLoader().load(a.photo,t=>{if(head.userData.disposed){t.dispose();return;}t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;t.minFilter=THREE.LinearMipmapLinearFilter;t.magFilter=THREE.LinearFilter;faceMat.map=t;faceMat.needsUpdate=true;facialFeatures.forEach(o=>o.visible=false);group.visible=true;},undefined,()=>{});
 return group;
}
export function wardrobeSet(scene,color){
 const base=material(0x29243c,.36,.25),top=material(0x51446d,.64,.13),neon=new THREE.MeshStandardMaterial({color:0x9e8bff,emissive:0x8267df,emissiveIntensity:1.5,roughness:.4});
 const platform=new THREE.Group();scene.add(platform);
 mesh(platform,new THREE.CylinderGeometry(1.13,1.25,.16,48),base,0,-.12,0);
 mesh(platform,new THREE.CylinderGeometry(1.13,1.13,.045,48),top,0,-.015,0);
 const band=mesh(platform,new THREE.TorusGeometry(1.12,.021,8,48),neon,0,-.055,0);band.rotation.x=Math.PI/2;
 const c=document.createElement('canvas');c.width=c.height=128;const ctx=c.getContext('2d'),grad=ctx.createRadialGradient(64,64,5,64,64,62);grad.addColorStop(0,'rgba(14,10,28,.68)');grad.addColorStop(.45,'rgba(14,10,28,.35)');grad.addColorStop(1,'rgba(14,10,28,0)');ctx.fillStyle=grad;ctx.fillRect(0,0,128,128);const texture=new THREE.CanvasTexture(c);
 const shadow=mesh(platform,new THREE.PlaneGeometry(1.9,1.55),new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,toneMapped:false}),0,.013,.06);shadow.rotation.x=-Math.PI/2;
 const bars=new THREE.Group();scene.add(bars);const barMat=new THREE.MeshBasicMaterial({color:0xb2a1ff,transparent:true,opacity:.20,depthWrite:false});for(const s of [-1,1]){const bar=rounded(bars,barMat,s*1.55,1.65,-.75,.035,2.35,.04,.015);bar.rotation.z=-s*.10;}
 return {accent(value){neon.color.set(value);neon.emissive.set(value);},animate(t){neon.emissiveIntensity=1.1+.25*Math.sin(t*1.6);}};
}
