
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function GelatoSphere({ position, scale, color, speed, distort }: { 
  position: [number, number, number], 
  scale: number, 
  color: string,
  speed: number,
  distort: number
}) {
  const mesh = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    mesh.current.position.y = position[1] + Math.sin(time * speed) * 0.3;
    mesh.current.rotation.x = Math.sin(time * 0.3) * 0.2;
    mesh.current.rotation.y = Math.sin(time * 0.2) * 0.4;
  });

  return (
    <mesh ref={mesh} position={position} scale={scale}>
      <sphereGeometry args={[1, 48, 48]} />
      <MeshDistortMaterial 
        color={color} 
        speed={0.4} 
        distort={distort} 
        roughness={0.3} 
        metalness={0.1}
      />
    </mesh>
  );
}

function AnimatedScene() {
  const shapeProps = [
    { position: [-3, 0, -5], scale: 1.3, color: "#FFD1DC", speed: 0.5, distort: 0.4 },
    { position: [3.5, 0, -3], scale: 0.8, color: "#EC5C9D", speed: 0.6, distort: 0.5 },
    { position: [-2, 1, -1], scale: 0.6, color: "#A7C7E7", speed: 0.7, distort: 0.3 },
    { position: [2, -1, -2], scale: 0.9, color: "#FFF5E1", speed: 0.4, distort: 0.6 },
  ];

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#EC5C9D" />
      {shapeProps.map((props, index) => (
        <GelatoSphere key={index} {...props} />
      ))}
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </>
  );
}

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 opacity-90">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 2]}
      >
        <AnimatedScene />
      </Canvas>
    </div>
  );
}
