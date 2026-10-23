import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture, Center, ContactShadows, Html } from '@react-three/drei';
import { Play, Pause, RotateCcw, Layers, Sparkles } from 'lucide-react';
import defaultHaldiImg from '../assets/haldi.jpeg';

// Loader component shown while the 3D texture is loading
function PouchLoader() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center p-4 bg-black/70 backdrop-blur-md rounded-xl border border-amber-500/30 text-amber-400 text-xs shadow-xl min-w-[140px]">
        <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-400 rounded-full animate-spin mb-2" />
        <span className="font-semibold tracking-wide">Loading 3D Pack...</span>
      </div>
    </Html>
  );
}

// 3D Pouch Mesh Component
function PouchMesh({ 
  textureUrl, 
  mode, 
  isRotating, 
  edgeColor = '#e5a93c',
  meshRef
}) {
  // Load single image texture
  const texture = useTexture(textureUrl || defaultHaldiImg);

  // Auto-rotation handler
  useFrame((state, delta) => {
    if (isRotating && meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      {/* 
        Pouch Geometry: [Width: 2.8, Height: 3.8, Thickness/Depth: 0.8]
        (Slim 3:4 aspect ratio perfectly matching turmeric retail pouch)
      */}
      <boxGeometry args={[2.8, 3.8, 0.8]} />

      {/* 
        Three.js Box Faces Order:
        0: Right (+X)
        1: Left  (-X)
        2: Top   (+Y)
        3: Bottom(-Y)
        4: Front (+Z)
        5: Back  (-Z)
      */}

      {mode === 'all' ? (
        // Mode 'all': Single image mapped on ALL 6 faces
        <>
          <meshStandardMaterial attach="material-0" map={texture} roughness={0.3} metalness={0.05} />
          <meshStandardMaterial attach="material-1" map={texture} roughness={0.3} metalness={0.05} />
          <meshStandardMaterial attach="material-2" map={texture} roughness={0.3} metalness={0.05} />
          <meshStandardMaterial attach="material-3" map={texture} roughness={0.3} metalness={0.05} />
          <meshStandardMaterial attach="material-4" map={texture} roughness={0.3} metalness={0.05} />
          <meshStandardMaterial attach="material-5" map={texture} roughness={0.3} metalness={0.05} />
        </>
      ) : (
        // Mode 'pouch' (Recommended): Front & Back have image; sides have sealed metallic foil color
        <>
          {/* Right & Left sealed edges */}
          <meshStandardMaterial attach="material-0" color={edgeColor} roughness={0.35} metalness={0.25} />
          <meshStandardMaterial attach="material-1" color={edgeColor} roughness={0.35} metalness={0.25} />
          
          {/* Top & Bottom crimp seals */}
          <meshStandardMaterial attach="material-2" color={edgeColor} roughness={0.4} metalness={0.3} />
          <meshStandardMaterial attach="material-3" color="#b27612" roughness={0.5} metalness={0.2} />
          
          {/* Front Face (Primary image) */}
          <meshStandardMaterial 
            attach="material-4" 
            map={texture} 
            roughness={0.25} 
            metalness={0.05} 
          />
          
          {/* Back Face (Primary image on back as well) */}
          <meshStandardMaterial 
            attach="material-5" 
            map={texture} 
            roughness={0.25} 
            metalness={0.05} 
          />
        </>
      )}
    </mesh>
  );
}

export default function Product3D({ 
  image = defaultHaldiImg,
  edgeColor = '#e5a93c',
  title = 'Lakadong Turmeric Powder',
  height = '520px'
}) {
  // 'pouch' = Front/Back image + foil edges (Best realism)
  // 'all' = 1 image wrapped around all 6 faces
  const [displayMode, setDisplayMode] = useState('pouch');
  const [isRotating, setIsRotating] = useState(true);
  const meshRef = useRef();
  const controlsRef = useRef();

  // Reset pack rotation to front view
  const handleResetView = () => {
    if (meshRef.current) {
      meshRef.current.rotation.set(0, 0, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div 
      className="relative w-full rounded-2xl overflow-hidden select-none bg-gradient-to-b from-[#181c24] to-[#0d1015] border border-amber-500/20 shadow-2xl"
      style={{ height }}
    >
      {/* Top Controls Toolbar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-auto">
        {/* Mode Toggle: Pouch vs All-Faces */}
        <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-xl border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setDisplayMode('pouch')}
            className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
              displayMode === 'pouch'
                ? 'bg-amber-500 text-black shadow-md font-bold'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
            title="Front & Back with sealed golden edges"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pouch Mode</span>
          </button>

          <button
            type="button"
            onClick={() => setDisplayMode('all')}
            className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
              displayMode === 'all'
                ? 'bg-amber-500 text-black shadow-md font-bold'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
            title="1 Image mapped on all 6 sides"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All 6 Faces</span>
          </button>
        </div>

        {/* Action Controls: Play/Pause Rotation & Reset */}
        <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md p-1 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => setIsRotating(!isRotating)}
            className={`p-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1 ${
              isRotating
                ? 'text-amber-400 hover:bg-amber-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
            title={isRotating ? 'Pause Rotation' : 'Auto Rotate'}
            aria-label="Toggle auto rotation"
          >
            {isRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={handleResetView}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title="Reset to Front View"
            aria-label="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas 
        camera={{ position: [0, 0, 6.5], fov: 42 }}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        {/* Studio Lighting Setup */}
        <ambientLight intensity={0.7} />
        
        {/* Key Light (Front-Right) */}
        <directionalLight 
          position={[5, 6, 5]} 
          intensity={1.4} 
          castShadow 
          shadow-mapSize-width={1024} 
          shadow-mapSize-height={1024} 
        />
        
        {/* Rim Light for Golden Pouch Edges */}
        <pointLight position={[-4, 3, -3]} intensity={0.7} color="#fbbf24" />
        
        {/* Soft Fill Light from Below */}
        <pointLight position={[0, -3, 3]} intensity={0.3} color="#ffffff" />

        <Suspense fallback={<PouchLoader />}>
          <Center>
            <PouchMesh 
              textureUrl={image} 
              mode={displayMode} 
              isRotating={isRotating} 
              edgeColor={edgeColor}
              meshRef={meshRef}
            />
          </Center>

          {/* Realistic Floor Shadow underneath the pouch */}
          <ContactShadows 
            position={[0, -2.2, 0]} 
            opacity={0.5} 
            scale={7} 
            blur={1.8} 
            far={4} 
          />
        </Suspense>

        {/* Orbit Controls (Drag to rotate, Scroll to zoom) */}
        <OrbitControls 
          ref={controlsRef}
          enableZoom={true} 
          minDistance={3.8} 
          maxDistance={10}
          enablePan={false}
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 1.7}
          minPolarAngle={Math.PI / 3.2}
        />
      </Canvas>

      {/* Bottom Information Hint Badge */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none z-10 w-full px-4 flex items-center justify-center">
        <div className="bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-[11px] text-gray-300 flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>{title} • <strong>Drag</strong> to rotate 360° • <strong>Scroll</strong> to zoom</span>
        </div>
      </div>
    </div>
  );
}
