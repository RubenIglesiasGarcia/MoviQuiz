import * as THREE from 'three';
// Original stylized model: tall ears, black coat, yellow-green eyes, purple tuxedo.
export function createSonny(){
 const root=new THREE.Group(),torso=new THREE.Group(),head=new THREE.Group(),arms=[],legs=[],eyes=[],ears=[];
 const mat=(color,roughness=.68,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
 const fur=mat(0x242b39,.78),soft=mat(0x394052,.86),ear=mat(0x69404a),jacket=mat(0x514778,.81),lapel=mat(0x262c40),gold=mat(0xf5c978,.45,.20),cream=mat(0xffead3),iris=mat(0xd0d34b,.34),pupil=mat(0x080b14,.3),shine=mat(0xffffff,.24),mouthMat=mat(0x080810),tongueMat=mat(0xc67183);
 const add=(p,g,m,x=0,y=0,z=0)=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);p.add(o);return o;};
 const sphere=(p,m,x,y,z,sx,sy,sz)=>{const o=add(p,new THREE.SphereGeometry(1,20,14),m,x,y,z);o.scale.set(sx,sy,sz);return o;};
 const plate=(p,m,pts,z)=>{const shape=new THREE.Shape();pts.forEach(([x,y],i)=>i?shape.lineTo(x,y):shape.moveTo(x,y));shape.closePath();return add(p,new THREE.ShapeGeometry(shape),m,0,0,z);};
 const tube=(p,m,points,r=.025)=>add(p,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(v=>new THREE.Vector3(...v))),16,r,8,false),m);
 root.add(torso,head);head.position.y=2.05;
 sphere(torso,jacket,0,1.15,0,.37,.54,.255);sphere(torso,fur,0,.68,0,.29,.30,.22);sphere(torso,fur,0,1.61,0,.22,.22,.21);
 plate(torso,cream,[[-.20,1.52],[.20,1.52],[.08,.99],[-.08,.99]],.259);
 for(const side of [-1,1]){
  plate(torso,lapel,[[side*.04,1.56],[side*.31,1.42],[side*.17,1.26],[side*.25,1.23],[side*.065,.95]],.277);
  tube(torso,gold,[[side*.20,1.51,.28],[side*.31,1.42,.28],[side*.18,1.27,.28],[side*.065,.95,.28]],.012);
  const arm=new THREE.Group();arm.position.set(side*.34,1.47,0);torso.add(arm);arms.push(arm);
  sphere(arm,jacket,0,-.24,0,.13,.30,.13);sphere(arm,cream,0,-.47,0,.11,.08,.115);sphere(arm,fur,0,-.57,.025,.13,.15,.125);sphere(arm,gold,side*.09,-.42,.06,.023,.023,.023);
  const leg=new THREE.Group();leg.position.set(side*.15,.74,0);root.add(leg);legs.push(leg);
  sphere(leg,fur,0,-.29,0,.135,.33,.135);sphere(leg,fur,0,-.65,.09,.16,.09,.24);
 }
 for(const side of [-1,1]){const bow=sphere(torso,gold,side*.10,1.51,.32,.13,.075,.04);bow.rotation.z=side*.24;}
 sphere(torso,gold,0,1.51,.35,.055,.061,.035);sphere(torso,gold,0,.96,.25,.036,.036,.022);
 plate(torso,gold,[[.19,1.32],[.28,1.32],[.25,1.40]],.272);
 sphere(head,fur,0,0,0,.49,.49,.40);sphere(head,soft,0,-.19,.19,.34,.25,.25);
 for(const side of [-1,1]){
  const e=new THREE.Group();e.position.set(side*.34,.32,-.015);e.rotation.z=-side*.22;head.add(e);ears.push(e);
  const shape=new THREE.Shape();shape.moveTo(-.19,-.10);shape.quadraticCurveTo(-.11,.23,-.035,.53);shape.quadraticCurveTo(.015,.61,.07,.50);shape.quadraticCurveTo(.21,.17,.20,-.10);shape.closePath();
  const g=new THREE.ExtrudeGeometry(shape,{depth:.10,bevelEnabled:true,bevelSize:.035,bevelThickness:.035,bevelSegments:2,steps:1,curveSegments:10});add(e,g,fur,0,0,-.07);
  const inner=sphere(e,ear,.015,.20,.055,.095,.24,.032);inner.rotation.z=-side*.07;
  const socket=sphere(head,soft,side*.205,.065,.348,.205,.15,.077);socket.rotation.z=side*.14;
  const eye=sphere(head,iris,side*.205,.065,.40,.165,.123,.055);eye.rotation.z=side*.14;
  const slit=sphere(head,pupil,side*.205,.065,.448,.035,.106,.018);
  const glint=sphere(head,shine,side*.205-.035,.107,.466,.022,.027,.012);
  eyes.push([eye,.123],[slit,.106],[glint,.027]);
  const cheek=sphere(head,fur,side*.118,-.14,.407,.15,.115,.075);
  for(let i=0;i<3;i++)tube(head,mat(0xa8a4b0,.85),[[side*.18,-.15-i*.032,.47],[side*.36,-.12-i*.06,.45],[side*.58,-.08-i*.095,.36]],.006);
 }
 const nose=sphere(head,mat(0x34232c,.42),0,-.10,.49,.082,.048,.04);
 const mouth=sphere(head,mouthMat,0,-.222,.435,.12,.025,.032),lip=sphere(head,soft,0,-.222,.421,.15,.045,.025);
 const teeth=sphere(head,cream,0,-.20,.465,.077,.017,.013),tongue=sphere(head,tongueMat,0,-.245,.466,.055,.016,.012);teeth.visible=false;tongue.visible=false;
 const tail=new THREE.Group();tail.position.set(.10,.70,-.17);root.add(tail);
 tube(tail,fur,[[0,0,0],[.28,-.10,-.27],[.66,.02,-.42],[.82,.45,-.40],[.70,.78,-.33]],.083);sphere(tail,fur,.70,.78,-.33,.083,.083,.083);
 // Headset is part of the model (also visible in the presenter close-up).
 sphere(head,gold,.48,.04,.02,.06,.14,.13);sphere(head,lapel,.52,.04,.02,.045,.10,.10);
 tube(head,gold,[[.53,.02,.04],[.49,-.18,.28],[.28,-.23,.47]],.018);sphere(head,lapel,.28,-.23,.47,.05,.04,.04);
 const mic=new THREE.Group();arms[1].add(mic);add(mic,new THREE.CylinderGeometry(.05,.05,.25,12),lapel,.02,-.60,.12);sphere(mic,gold,.02,-.47,.12,.075,.088,.075);
 // A small prop made of genuine 3D strands; it shares the stage lights.
 const yarn=new THREE.Group();root.add(yarn);yarn.visible=false;
 const wool=mat(0xc64b88,.98),thread=mat(0xe67aa8,.95),darkThread=mat(0x9e356a,.99);
 sphere(yarn,wool,0,0,0,.185,.185,.185);
 for(let i=0;i<7;i++){const strand=new THREE.Group();strand.rotation.set(i*.76,i*.94,i*.43);yarn.add(strand);for(const offset of [-.034,.034]){const radius=Math.sqrt(.183*.183-offset*offset);const ring=add(strand,new THREE.TorusGeometry(radius,.012,6,26),i%2?thread:darkThread,0,0,offset);}}
 const loose=tube(yarn,thread,[[.16,-.03,.03],[.26,-.07,.06],[.31,-.17,.09],[.43,-.19,.03]],.012);
 return {root,torso,head,arms,legs,eyes,ears,mouth,lip,teeth,tongue,tail,yarn,loose,personality:'cool',host:true};
}
export function animateSonny(model,time,{motion=true,speaking=false,amount=0,mood='idle',act='idle',progress=0}={}){
 const {head,arms,tail,root,eyes,ears,yarn,torso,legs,mouth,lip,teeth,tongue}=model,t=time,amp=motion?1:0;
 const behavior=motion&&!speaking?act:'idle',p=Math.max(0,Math.min(1,progress)),ease=Math.min(1,p*7,(1-p)*7),wave=Math.sin(p*Math.PI*6);
 root.position.y=amp*.018*Math.sin(t*2.2);root.rotation.z=0;torso.rotation.set(0,0,0);head.position.y=2.05;head.rotation.set(-amount*.055,amp*.08*Math.sin(t*.9),amp*.06*Math.sin(t*1.5));
 arms[0].rotation.set(-amount*.28,0,-.28-amount*.53);arms[1].rotation.set(-.65-amount*.34,0,.24+amount*.24);
 legs.forEach(l=>l.rotation.set(0,0,0));yarn.visible=false;
 if(mood==='shock'){head.rotation.x=-.13;arms[0].rotation.z=-.82;arms[1].rotation.z=.73;}
 if(mood==='celebrate'){arms[0].rotation.z=-1.12-amp*.15*Math.sin(t*5);head.rotation.z=amp*.11*Math.sin(t*4);}
 if(mood==='smug'){head.rotation.z=-.12;arms[0].rotation.z=-.51;}
 tail.rotation.y=amp*.32*Math.sin(t*1.9);tail.rotation.z=amp*.10*Math.sin(t*1.4);
 ears.forEach((ear,i)=>{const side=i===0?-1:1;ear.rotation.z=-side*.22+amp*.045*Math.sin(t*2+i);ear.rotation.x=amp*.055*Math.sin(t*1.5+i);});
 let blink=motion?Math.pow(Math.max(0,Math.cos(t*1.4)),90):0,jaw=null;
 if(behavior==='yarn'){
  yarn.visible=true;yarn.position.set(.32*Math.sin(p*Math.PI*4),1.10+.25*Math.abs(Math.sin(p*Math.PI*4)),.45);yarn.rotation.set(p*9,p*13,p*10);
  head.rotation.x=.28*ease;head.rotation.y=.42*Math.sin(p*Math.PI*4)*ease;arms[0].rotation.set(-1.1*ease,0,-.70- .38*wave*ease);arms[1].rotation.set(-1.0*ease,0,.72-.38*wave*ease);
  tail.rotation.y=.55*Math.sin(p*13);ears.forEach((e,i)=>e.rotation.x=-.17*ease);
 }else if(behavior==='groom'){
  head.rotation.x=.45*ease;head.rotation.z=.20*ease;arms[0].rotation.set(-.72*ease,0,(-.28+3.02*ease));arms[0].rotation.x-=.16*wave*ease;
  blink=Math.max(blink,.78*ease);jaw=.18+.5*Math.max(0,wave)*ease;
 }else if(behavior==='purr'){
  head.rotation.z=-.14*ease;head.rotation.x=.12*ease;arms[0].rotation.z=-.23;blink=Math.max(blink,.88*ease);torso.rotation.z=.018*Math.sin(p*45)*ease;tail.rotation.y=.16*Math.sin(p*8);
 }else if(behavior==='meow'){
  head.rotation.x=-.16*ease;jaw=Math.sin(Math.PI*p)*.8;arms[0].rotation.z=-.62*ease;ears.forEach(e=>e.rotation.x=-.15*ease);
 }else if(behavior==='stretch'){
  arms[0].rotation.z=-.28-2.05*ease;arms[1].rotation.z=.24+2.05*ease;root.position.y+=.09*ease;head.rotation.x=-.20*ease;blink=Math.max(blink,.90*ease);jaw=.6*ease;tail.rotation.z=.32*ease;
 }else if(behavior==='sleep'){
  head.rotation.x=.24*ease;head.rotation.z=.24*ease;blink=Math.max(blink,.95*ease);torso.rotation.z=.035*Math.sin(p*10);tail.rotation.y=.1*Math.sin(p*6);
 }else if(behavior==='ear'){
  ears[0].rotation.z+=Math.sin(p*15)*.22*ease;head.rotation.y=.25*ease;tail.rotation.y=.45*ease;
 }
 for(const [eye,y] of eyes)eye.scale.y=y*(1-.9*blink);
 if(jaw!==null){mouth.scale.y=.025+.10*jaw;lip.scale.y=mouth.scale.y+.018;teeth.visible=jaw>.44;tongue.visible=behavior==='groom'?jaw>.33:jaw>.55;tongue.position.y=-.22-mouth.scale.y*.45;}
}
