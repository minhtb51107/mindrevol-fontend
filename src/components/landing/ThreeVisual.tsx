import React, { useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
// Sửa dòng này:
import { OrbitControls, Html } from '@react-three/drei';
import { Gamepad2, Globe, MessageSquare, Heart, Headphones } from 'lucide-react';

// === Giao diện Desktop Giả lập (React Component phẳng) ===
// Chúng ta sẽ nhúng component này vào mô hình 3D của máy tính
const FakeDesktopUI = () => (
  <div className="w-[500px] h-[340px] bg-[#313338] rounded-xl border-[4px] border-[#1e1f22] flex overflow-hidden relative" style={{ perspective: '1000px', transform: 'scale(1) translate3d(0,0,0)' }}>
    {/* Fake Sidebar */}
    <div className="w-16 bg-[#1e1f22] flex flex-col items-center py-4 gap-4 border-r border-[#1e1f22]">
      <div className="w-10 h-10 bg-[#5865F2] rounded-[16px] flex items-center justify-center shadow-lg"><Globe className="w-6 h-6 text-white" /></div>
      <div className="w-10 h-10 bg-[#2b2d31] rounded-full hover:rounded-[16px] transition-all cursor-pointer"></div>
      <div className="w-10 h-10 bg-[#2b2d31] rounded-full hover:rounded-[16px] transition-all cursor-pointer"></div>
    </div>
    {/* Fake Channels */}
    <div className="w-40 bg-[#2b2d31] flex flex-col p-3 gap-2 border-r border-[#1e1f22]">
      <div className="h-4 w-20 bg-white/10 rounded mb-2"></div>
      <div className="h-8 w-full bg-white/5 rounded flex items-center px-2 gap-2"><div className="w-3 h-3 rounded-full bg-zinc-500"></div><div className="h-2 w-16 bg-white/20 rounded"></div></div>
      <div className="h-8 w-full bg-white/10 rounded flex items-center px-2 gap-2"><div className="w-3 h-3 rounded-full bg-zinc-500"></div><div className="h-2 w-12 bg-white/40 rounded"></div></div>
      <div className="h-8 w-full bg-white/5 rounded flex items-center px-2 gap-2"><div className="w-3 h-3 rounded-full bg-zinc-500"></div><div className="h-2 w-20 bg-white/20 rounded"></div></div>
    </div>
    {/* Fake Content Area */}
    <div className="flex-1 flex flex-col bg-[#313338]">
      <div className="h-12 border-b border-[#1e1f22] flex items-center px-4 gap-3">
        <span className="text-zinc-400 font-bold text-lg">#</span>
        <span className="text-white font-bold text-sm">general</span>
      </div>
      <div className="flex-1 p-4 flex flex-col justify-end gap-5">
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-full bg-purple-500 shrink-0"></div>
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
               <div className="h-3 w-20 bg-white/40 rounded"></div>
               <div className="h-2 w-10 bg-white/10 rounded"></div>
            </div>
            <div className="h-10 w-4/5 bg-[#2b2d31] rounded-r-lg rounded-bl-lg"></div>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-full bg-green-500 shrink-0"></div>
          <div className="space-y-2 flex-1">
             <div className="flex items-center gap-2">
               <div className="h-3 w-24 bg-white/40 rounded"></div>
               <div className="h-2 w-14 bg-white/10 rounded"></div>
            </div>
            <div className="h-14 w-full bg-[#2b2d31] rounded-r-lg rounded-bl-lg border border-[#1e1f22]"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// === Giao diện Mobile Giả lập (React Component phẳng) ===
// Chúng ta sẽ nhúng component này vào mô hình 3D của điện thoại
const FakeMobileUI = () => (
  <div className="w-[180px] h-[380px] bg-[#313338] rounded-[2rem] border-[6px] border-[#1e1f22] shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
    {/* Fake Video Call Grid */}
    <div className="flex-1 p-2 grid grid-cols-2 gap-2">
       <div className="bg-indigo-500 rounded-xl"></div>
       <div className="bg-pink-500 rounded-xl"></div>
       <div className="bg-emerald-500 rounded-xl"></div>
       <div className="bg-amber-500 rounded-xl"></div>
    </div>
    {/* Fake Controls */}
    <div className="h-16 bg-[#1e1f22] flex items-center justify-center gap-3">
       <div className="w-8 h-8 rounded-full bg-white/10"></div>
       <div className="w-8 h-8 rounded-full bg-red-500"></div>
       <div className="w-8 h-8 rounded-full bg-white/10"></div>
    </div>
  </div>
);

// === Cảnh 3D ===
const Scene = () => {
  const desktopRef = useRef<THREE.Group>(null);
  const mobileRef = useRef<THREE.Group>(null);

  // Tạo hiệu ứng lơ lửng nhẹ cho thiết bị
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (desktopRef.current) {
      // Lơ lửng và xoay nhẹ (Desktop)
      desktopRef.current.position.y = -0.1 + Math.sin(time * 0.8) * 0.05;
      desktopRef.current.rotation.y = -0.2 + Math.sin(time * 0.5) * 0.02;
    }
    if (mobileRef.current) {
      // Lơ lửng và xoay nhẹ (Mobile) - Nổi lên nhanh hơn một chút
      mobileRef.current.position.y = -0.3 + Math.sin(time * 1.2) * 0.1;
      mobileRef.current.rotation.y = 0.1 + Math.sin(time * 0.7) * 0.03;
    }
  });

  return (
    <>
      {/* === Ánh sáng (Tạo chiều sâu và màu không gian) === */}
      <ambientLight intensity={0.5} color="#2e3192" />
      <pointLight position={[10, 10, 10]} intensity={1} color="#5865F2" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#EB459E" />
      <spotLight position={[0, 10, 0]} intensity={0.5} angle={0.5} penumbra={1} color="#ffffff" castShadow />

      {/* === Mô hình 3D Desktop (Tái hiện bằng Mesh cơ bản) === */}
      <group ref={desktopRef} position={[0, -0.1, 0]} castShadow>
        {/* Thân màn hình 3D */}
        <mesh position={[0, 1, 0]}>
          <boxGeometry args={[1.5, 1, 0.05]} />
          <meshStandardMaterial color="#313338" roughness={0.1} metalness={0.5} />
          {/* Nhúng UI (React Component phẳng) vào chính màn hình 3D */}
          <Html position={[0, 0, 0.026]} distanceFactor={1} transform occlude>
            <div className="pointer-events-auto">
                <FakeDesktopUI />
            </div>
          </Html>
        </mesh>
        {/* Phần chân đế 3D */}
        <mesh position={[0, 0.45, -0.05]} castShadow>
          <boxGeometry args={[0.3, 0.1, 0.1]} />
          <meshStandardMaterial color="#1e1f22" roughness={0.1} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.1, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.05, 32]} />
          <meshStandardMaterial color="#1e1f22" roughness={0.1} metalness={0.8} />
        </mesh>
      </group>

      {/* === Mô hình 3D Mobile (Tái hiện bo góc đơn giản) === === */}
      <group ref={mobileRef} position={[0.7, -0.3, 0.1]} scale={0.7} castShadow>
        <mesh castShadow>
          <boxGeometry args={[0.5, 1, 0.05]} />
          <meshStandardMaterial color="#1e1f22" roughness={0.1} metalness={0.8} />
          {/* Nhúng UI vào màn hình điện thoại 3D */}
          <Html position={[0, 0, 0.026]} distanceFactor={1} transform occlude>
            <div className="pointer-events-auto">
                <FakeMobileUI />
            </div>
          </Html>
        </mesh>
      </group>

      {/* === Vật thể lơ lửng 3D - Foreground (Sắc nét) === */}
      <mesh position={[-0.8, 1.3, -0.2]} rotation={[12, 0, 0]}>
        <torusGeometry args={[0.1, 0.02, 16, 100]} />
        <meshStandardMaterial color="#EB459E" metalness={0.8} roughness={0.1} />
      </mesh>
      <mesh position={[1, 0.7, 0]} rotation={[0, 45, 0]}>
        <octahedronGeometry args={[0.08]} />
        <meshStandardMaterial color="#5865F2" metalness={0.8} roughness={0.1} />
      </mesh>

      {/* === Controls (Cho phép người dùng xoay nhẹ để thấy chiều sâu 3D) và Camera === */}
      <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2.2} minPolarAngle={Math.PI / 1.8} minAzimuthAngle={-Math.PI/10} maxAzimuthAngle={Math.PI/10} />
    </>
  );
};

export default function ThreeVisual() {
  return (
    <div className="w-full h-full relative z-10 perspective-1000">
      <Canvas shadows camera={{ position: [0, 0, 2], fov: 60 }} className="w-full h-full">
        <Scene />
      </Canvas>
    </div>
  );
}