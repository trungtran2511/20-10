import { useMemo, useRef, useLayoutEffect, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const COUNT = 6200
function seed(n:number){return ()=>((n=Math.imul(n,1664525)+1013904223>>>0)/4294967296)}
function flowerTexture(){
 const canvas=document.createElement('canvas');canvas.width=canvas.height=256
 const c=canvas.getContext('2d')!; c.translate(128,128)
 const glow=c.createRadialGradient(0,0,12,0,0,110)
 glow.addColorStop(0,'rgba(222,161,190,.17)');glow.addColorStop(1,'rgba(255,224,238,0)')
 c.fillStyle=glow;c.fillRect(-128,-128,256,256)
 for(let i=0;i<5;i++){c.save();c.rotate(i*Math.PI*2/5)
 const g=c.createLinearGradient(0,-80,0,0);g.addColorStop(0,'#eacbd8');g.addColorStop(.5,'#d9a3b9');g.addColorStop(1,'#c77f9e')
 c.fillStyle=g;c.beginPath();c.moveTo(0,-5);c.bezierCurveTo(-32,-23,-38,-66,-7,-78);c.lineTo(0,-71);c.lineTo(7,-78);c.bezierCurveTo(38,-66,32,-23,0,-5);c.fill();c.restore()}
 c.fillStyle='#e8c797';c.beginPath();c.arc(0,0,12,0,Math.PI*2);c.fill()
 const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;return t
}
export function FlowerMeadow2D(){
 const mesh=useRef<THREE.InstancedMesh>(null)
 const {camera,pointer,raycaster}=useThree()
 const texture=useMemo(flowerTexture,[])
 const geom=useMemo(()=>new THREE.PlaneGeometry(1,1),[])
 const mat=useMemo(()=>new THREE.MeshBasicMaterial({map:texture,transparent:true,alphaTest:.06,opacity:.76,depthWrite:false,side:THREE.DoubleSide}),[texture])
 const obj=useMemo(()=>new THREE.Object3D(),[])
 const plane=useMemo(()=>new THREE.Plane(new THREE.Vector3(0,1,0),0),[])
 const hit=useMemo(()=>new THREE.Vector3(),[])
 const mouse=useRef(new THREE.Vector2(9999,9999))
 const flowers=useMemo(()=>{
  const rand=seed(20261020)
  const clusters=Array.from({length:180},()=>({x:(rand()-.5)*66,z:-44+rand()*145,rx:1.8+rand()*4.2,rz:2+rand()*4.7}))
  return Array.from({length:COUNT},()=>{
   let x=0,z=0;const r=rand()
   if(r<.84){const g=clusters[Math.floor(rand()*clusters.length)],a=rand()*Math.PI*2,k=Math.sqrt(rand());x=g.x+Math.cos(a)*k*g.rx;z=g.z+Math.sin(a)*k*g.rz}
   else if(r<.94){x=(rand()-.5)*66;z=33+rand()*70}
   else{x=(rand()>.5?1:-1)*(2.6+rand()*14);z=-44+rand()*80}
   if(z>=-17&&z<=31&&Math.abs(x)<2.7)x=(x<0?-1:1)*(2.7+rand())
   return{x,z,scale:.42+rand()*.58,phase:rand()*Math.PI*2,tempo:.5+rand()*.4,tilt:(rand()-.5)*.12}
  })
 },[])
 useLayoutEffect(()=>{const m=mesh.current;if(!m)return;const rand=seed(103);const colors=['#dfb1c3','#c98ea9','#d7a1b5','#e3b7c7'];flowers.forEach((_,i)=>m.setColorAt(i,new THREE.Color(colors[Math.floor(rand()*colors.length)])));if(m.instanceColor)m.instanceColor.needsUpdate=true},[flowers])
 useFrame(({clock},delta)=>{
  const m=mesh.current;if(!m)return
  raycaster.setFromCamera(pointer,camera);const found=raycaster.ray.intersectPlane(plane,hit)
  const alpha=Math.min(1,delta*5)
  mouse.current.x+=( (found?hit.x:9999)-mouse.current.x)*alpha
  mouse.current.y+=( (found?hit.z:9999)-mouse.current.y)*alpha
  const t=clock.elapsedTime
  flowers.forEach((f,i)=>{
   const dx=f.x-mouse.current.x,dz=f.z-mouse.current.y,dist=Math.hypot(dx,dz),force=dist<4?Math.pow(1-dist/4,2):0
   const yaw=Math.atan2(camera.position.x-f.x,camera.position.z-f.z)
   const breeze=Math.sin(t*f.tempo+f.phase)*.075+Math.cos(t*.6+f.z*.1)*.03
   obj.position.set(f.x+dx*force*.03,.25+f.scale*.38,f.z+dz*force*.03)
   obj.rotation.set(0,yaw,f.tilt+breeze+force*(dx>=0?1:-1)*.2)
   obj.scale.set(f.scale,f.scale,1);obj.updateMatrix();m.setMatrixAt(i,obj.matrix)
  });m.instanceMatrix.needsUpdate=true
 })
 useEffect(()=>()=>{texture.dispose();geom.dispose();mat.dispose()},[texture,geom,mat])
 return <instancedMesh ref={mesh} args={[geom,mat,COUNT]} frustumCulled={false}/>
}
