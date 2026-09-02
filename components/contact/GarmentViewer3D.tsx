'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js';
import {
  RotateCw,
  X,
  Box,
  Sparkles,
  Layers,
  ShieldCheck,
  Cpu,
  Move,
  Maximize2,
  Minimize2,
  Sliders,
  RotateCcw,
  MousePointer,
  Hand,
  CheckCircle2,
  Wand2,
} from 'lucide-react';

interface GarmentViewer3DProps {
  modelUrl?: string;
  fileName?: string;
  fileSize?: string;
  garmentType?: string;
  primaryColor?: string;
  accentColor?: string;
  logoUrl?: string;
  logoPlacement?: string;
  onClose?: () => void;
  heightClass?: string;
}

// Fabric Physical Property Definitions
export interface FabricPreset {
  name: string;
  roughness: number;
  metalness: number;
  sheen: number;
  sheenRoughness: number;
  clearcoat: number;
  bumpScale: number;
  description: string;
}

export const FABRIC_PRESETS: Record<string, FabricPreset> = {
  'Heavy Cotton Fleece': {
    name: 'Heavyweight Cotton (400 GSM)',
    roughness: 0.88,
    metalness: 0.0,
    sheen: 0.55,
    sheenRoughness: 0.4,
    clearcoat: 0.0,
    bumpScale: 0.012,
    description: 'Ultra-matte, thick plush loops, minimal reflection',
  },
  'Polyester AeroVent™': {
    name: 'Polyester Micro-Mesh (180 GSM)',
    roughness: 0.40,
    metalness: 0.10,
    sheen: 0.25,
    sheenRoughness: 0.25,
    clearcoat: 0.18,
    bumpScale: 0.006,
    description: 'Technical athletic sheen, moisture-wicking micro-weave',
  },
  'Satin & Performance Nylon': {
    name: 'Satin / Performance Nylon',
    roughness: 0.22,
    metalness: 0.18,
    sheen: 0.70,
    sheenRoughness: 0.15,
    clearcoat: 0.45,
    bumpScale: 0.003,
    description: 'Silky lustrous gloss with crisp specular reflections',
  },
  'Cotton Piqué Knit': {
    name: 'Breathable Piqué Knit (220 GSM)',
    roughness: 0.75,
    metalness: 0.02,
    sheen: 0.35,
    sheenRoughness: 0.35,
    clearcoat: 0.05,
    bumpScale: 0.010,
    description: 'Textured honeycomb weave with soft diffused highlights',
  },
};

/**
 * Creates High-Resolution Grayscale Micro-Weave Fabric Texture (Albedo multiplier & bump)
 */
function createMicroWeaveTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#CCCCCC';
    ctx.fillRect(0, 0, 1024, 1024);

    // Thread cross-hatch matrix
    ctx.fillStyle = '#E8E8E8';
    for (let x = 0; x < 1024; x += 4) {
      for (let y = 0; y < 1024; y += 4) {
        if ((x + y) % 8 === 0) {
          ctx.fillRect(x, y, 2, 2);
        }
      }
    }

    // Organic tension crease gradients
    ctx.fillStyle = 'rgba(0,0,0,0.04)';
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.ellipse(512, 180 + i * 140, 480, 45, (i % 2 ? 0.08 : -0.08), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(16, 16);
  return texture;
}

/**
 * Procedural Anatomical Showroom Mannequin with Bagginess Interpolation Math
 */
function createMannequinMesh(
  primaryMat: THREE.Material,
  accentMat: THREE.Material,
  silhouette: string,
  bagginess: number = 0.5 // 0.0 (Tight) to 1.0 (Oversized Streetwear)
) {
  const root = new THREE.Group();

  const isHoodie = silhouette.toLowerCase().includes('hood');
  const isJersey = silhouette.toLowerCase().includes('jersey');
  const isJacket = silhouette.toLowerCase().includes('jacket') || silhouette.toLowerCase().includes('tracksuit');

  // Math: Bagginess Scale factor interpolating chest and waist outward while pinning collar
  const fitExpansion = 1.0 + bagginess * 0.18;
  const shoulderDrop = bagginess * 0.06;

  // 1. ANATOMICAL TORSO
  const torsoPoints: THREE.Vector2[] = [
    new THREE.Vector2(0.42 * fitExpansion, -0.98),
    new THREE.Vector2(0.44 * fitExpansion, -0.90),
    new THREE.Vector2((0.40 + bagginess * 0.08) * fitExpansion, -0.45),
    new THREE.Vector2((0.42 + bagginess * 0.07) * fitExpansion, -0.15),
    new THREE.Vector2(0.49 * fitExpansion, 0.25),
    new THREE.Vector2(0.52 * fitExpansion, 0.60),
    new THREE.Vector2(0.48 * fitExpansion, 0.82 - shoulderDrop),
    new THREE.Vector2(0.24, 1.00), // Anchor collar neck
    new THREE.Vector2(0.20, 1.14),
  ];

  const torsoGeo = new THREE.LatheGeometry(torsoPoints, 64);
  torsoGeo.scale(1.0, 1.0, 0.65 + bagginess * 0.08); // Depth
  torsoGeo.computeVertexNormals();

  const torsoMesh = new THREE.Mesh(torsoGeo, primaryMat);
  torsoMesh.castShadow = true;
  torsoMesh.receiveShadow = true;
  torsoMesh.name = 'targetTorsoMesh'; // Raycast target
  root.add(torsoMesh);

  // 2. SLOPED SLEEVES
  const createSleeve = (isLeft: boolean) => {
    const sleeve = new THREE.Group();
    const mult = isLeft ? -1 : 1;

    const sleeveRadius = (0.21 + bagginess * 0.06);
    const sleeveGeo = new THREE.CylinderGeometry(sleeveRadius, 0.18, 0.96, 36);
    sleeveGeo.scale(1.0, 1.0, 0.74);
    sleeveGeo.computeVertexNormals();
    const upperMesh = new THREE.Mesh(sleeveGeo, primaryMat);
    upperMesh.position.set(0, -0.42, 0);
    upperMesh.castShadow = true;
    sleeve.add(upperMesh);

    // Cuff
    const cuffGeo = new THREE.CylinderGeometry(0.18, 0.17, 0.16, 36);
    cuffGeo.scale(1.0, 1.0, 0.74);
    const cuff = new THREE.Mesh(cuffGeo, accentMat);
    cuff.position.set(0, -0.94, 0);
    sleeve.add(cuff);

    // Shoulder cap
    const capGeo = new THREE.SphereGeometry(sleeveRadius * 1.1, 36, 24);
    capGeo.scale(1.0, 0.85, 0.74);
    const cap = new THREE.Mesh(capGeo, primaryMat);
    cap.position.set(0, 0.04, 0);
    sleeve.add(cap);

    sleeve.position.set(mult * (0.54 + bagginess * 0.06), 0.76 - shoulderDrop, 0);
    sleeve.rotation.set(0.04, 0, mult * (-0.34 - bagginess * 0.08));

    return sleeve;
  };

  root.add(createSleeve(true));
  root.add(createSleeve(false));

  // 3. SILHOUETTE FEATURES
  if (isHoodie) {
    const hoodGeo = new THREE.SphereGeometry(0.49 * fitExpansion, 40, 28, 0, Math.PI * 2, 0, Math.PI * 0.78);
    hoodGeo.scale(0.92, 1.12, 0.96);
    hoodGeo.computeVertexNormals();
    const hood = new THREE.Mesh(hoodGeo, primaryMat);
    hood.position.set(0, 1.22, -0.16);
    hood.rotation.set(0.16, 0, 0);
    root.add(hood);

    const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.58 * fitExpansion, 0.36, 0.12), accentMat);
    pocket.position.set(0, -0.38, 0.34 * fitExpansion);
    pocket.rotation.set(-0.08, 0, 0);
    root.add(pocket);

    // Drawstrings
    [-0.1, 0.1].forEach((x) => {
      const str = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.44, 16), accentMat);
      str.position.set(x, 0.70, 0.38 * fitExpansion);
      root.add(str);
    });
  } else if (isJersey) {
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.045, 24, 40), accentMat);
    collar.scale.set(1.0, 0.58, 1.25);
    collar.position.set(0, 1.04, 0.05);
    collar.rotation.set(Math.PI / 2.3, 0, 0);
    root.add(collar);

    [-0.46, 0.46].forEach((x) => {
      const p = new THREE.Mesh(new THREE.BoxGeometry(0.035, 1.45, 0.26), accentMat);
      p.position.set(x * fitExpansion, -0.08, 0);
      root.add(p);
    });
  } else if (isJacket) {
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.26, 0.22, 36), primaryMat);
    collar.scale.set(1.0, 1.0, 0.72);
    collar.position.set(0, 1.14, 0.02);
    root.add(collar);

    const zip = new THREE.Mesh(new THREE.BoxGeometry(0.024, 1.95, 0.035), accentMat);
    zip.position.set(0, 0.04, 0.34 * fitExpansion);
    root.add(zip);
  } else {
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.23, 0.04, 24, 40), accentMat);
    collar.scale.set(1.0, 0.6, 1.18);
    collar.position.set(0, 1.05, 0.04);
    collar.rotation.set(Math.PI / 2.3, 0, 0);
    root.add(collar);
  }

  // 4. HEM RIBBING
  const hem = new THREE.Mesh(new THREE.CylinderGeometry(0.425 * fitExpansion, 0.435 * fitExpansion, 0.12, 54), accentMat);
  hem.scale.set(1.0, 1.0, 0.65);
  hem.position.set(0, -0.94, 0);
  root.add(hem);

  // 5. PEDESTAL STAND
  const metalMat = new THREE.MeshStandardMaterial({ color: 0x1f1f23, roughness: 0.25, metalness: 0.85 });
  const neckCap = new THREE.Mesh(new THREE.CylinderGeometry(0.165, 0.185, 0.1, 36), metalMat);
  neckCap.position.set(0, 1.18, 0);
  neckCap.scale.set(1.0, 1.0, 0.68);
  root.add(neckCap);

  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.3, 24), metalMat);
  pole.position.set(0, -1.6, 0);
  root.add(pole);

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.72, 0.05, 48), metalMat);
  base.position.set(0, -2.2, 0);
  base.receiveShadow = true;
  root.add(base);

  root.position.set(0, 0.35, 0);
  return root;
}

export const GarmentViewer3D: React.FC<GarmentViewer3DProps> = ({
  modelUrl,
  fileName,
  fileSize,
  garmentType = 'Athletic Hoodie',
  primaryColor = '#111111',
  accentColor = '#F5F5F0',
  logoUrl,
  logoPlacement = 'Chest Center',
  onClose,
  heightClass = 'h-[420px] sm:h-[500px]',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // UI Interactive States
  const [isRotating, setIsRotating] = useState(false);
  const [viewAngle, setViewAngle] = useState<'front' | 'back' | 'side' | 'isometric'>('isometric');
  const [interactionMode, setInteractionMode] = useState<'orbit' | 'dragLogo'>('orbit');
  const [fabricType, setFabricType] = useState<string>('Heavy Cotton Fleece');
  const [bagginess, setBagginess] = useState<number>(0.5); // Fit slider: 0.0 to 1.0
  const [logoScale, setLogoScale] = useState<number>(0.35); // Decal scale slider
  const [logoRotationDeg, setLogoRotationDeg] = useState<number>(0);

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const targetMeshRef = useRef<THREE.Mesh | null>(null);
  const currentDecalRef = useRef<THREE.Mesh | null>(null);
  const decalMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const microWeaveTextureRef = useRef<THREE.Texture | null>(null);
  const isPointerDownRef = useRef<boolean>(false);
  const lastHitPositionRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.95, 0.32));
  const lastHitNormalRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 1));

  // 1. DECAL PROJECTION ENGINE (Raycaster & DecalGeometry)
  const projectDecal = useCallback(
    (position: THREE.Vector3, normal: THREE.Vector3) => {
      const scene = sceneRef.current;
      const targetMesh = targetMeshRef.current;
      const decalMat = decalMaterialRef.current;
      if (!scene || !targetMesh || !decalMat) return;

      // Remove existing decal before re-projecting
      if (currentDecalRef.current) {
        scene.remove(currentDecalRef.current);
        currentDecalRef.current.geometry.dispose();
        currentDecalRef.current = null;
      }

      // Compute orientation Euler from normal vector
      const euler = new THREE.Euler(0, 0, (logoRotationDeg * Math.PI) / 180);
      if (normal.z < -0.5) {
        euler.y = Math.PI; // Rear view flip
      }

      const size = new THREE.Vector3(logoScale, logoScale, logoScale * 0.8);
      const decalGeo = new DecalGeometry(targetMesh, position, euler, size);

      const decalMesh = new THREE.Mesh(decalGeo, decalMat);
      decalMesh.renderOrder = 10;
      scene.add(decalMesh);
      currentDecalRef.current = decalMesh;

      lastHitPositionRef.current.copy(position);
      lastHitNormalRef.current.copy(normal);
    },
    [logoScale, logoRotationDeg]
  );

  // 2. INITIALIZE THREE.JS SCENE, LIGHTS & CONTROLS
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    microWeaveTextureRef.current = createMicroWeaveTexture();

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a0a0c);

    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(38, aspect, 0.1, 100);
    camera.position.set(2.4, 0.8, 3.2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 1.8;
    controls.maxDistance = 7.5;
    controls.target.set(0, 0.35, 0);
    controls.autoRotate = isRotating;
    controls.autoRotateSpeed = 2.0;
    controlsRef.current = controls;

    // 4-Point High-End Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffbf0, 2.4);
    keyLight.position.set(4, 7, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe2e8f0, 1.3);
    fillLight.position.set(-5, 4, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 2.2);
    rimLight.position.set(0, 6, -5);
    scene.add(rimLight);

    // Floor Shadow
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), new THREE.ShadowMaterial({ opacity: 0.4 }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.9;
    floor.receiveShadow = true;
    scene.add(floor);

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const resizeObserver = new ResizeObserver(() => {
      if (!container || !camera || !renderer) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  // 3. SYNC AUTO ROTATE & CONTROLS
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = isRotating;
      controlsRef.current.enabled = interactionMode === 'orbit';
    }
  }, [isRotating, interactionMode]);

  // 4. SYNC CAMERA PRESETS
  useEffect(() => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    if (viewAngle === 'front') camera.position.set(0, 0.4, 3.8);
    else if (viewAngle === 'back') camera.position.set(0, 0.4, -3.8);
    else if (viewAngle === 'side') camera.position.set(3.8, 0.4, 0);
    else if (viewAngle === 'isometric') camera.position.set(2.4, 0.8, 3.2);

    camera.lookAt(0, 0.35, 0);
    controls.target.set(0, 0.35, 0);
  }, [viewAngle]);

  // 5. UPDATE DECAL MATERIAL ON LOGO CHANGE
  useEffect(() => {
    if (logoUrl) {
      const loader = new THREE.TextureLoader();
      loader.load(logoUrl, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        decalMaterialRef.current = new THREE.MeshStandardMaterial({
          map: tex,
          transparent: true,
          depthTest: true,
          depthWrite: false,
          polygonOffset: true,
          polygonOffsetFactor: -4, // Prevents texture clipping across fabric folds
          roughness: 0.35,
          metalness: 0.05,
        });

        // Trigger initial projection at preset target
        if (targetMeshRef.current) {
          projectDecal(lastHitPositionRef.current, lastHitNormalRef.current);
        }
      });
    } else {
      if (currentDecalRef.current && sceneRef.current) {
        sceneRef.current.remove(currentDecalRef.current);
        currentDecalRef.current = null;
      }
    }
  }, [logoUrl, projectDecal]);

  // 6. BUILD MANNEQUIN MESH (PBR Material Multiplier + Bagginess Math)
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Clean previous objects
    const prevGroup = scene.getObjectByName('showroomRootGroup');
    if (prevGroup) scene.remove(prevGroup);

    const weaveTex = microWeaveTextureRef.current || createMicroWeaveTexture();
    const preset = FABRIC_PRESETS[fabricType] || FABRIC_PRESETS['Heavy Cotton Fleece'];

    // PBR Albedo Multiplication Material
    const primaryClothMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(primaryColor || '#111111'),
      map: weaveTex, // Micro-weave grayscale multiplier
      roughness: preset.roughness,
      metalness: preset.metalness,
      bumpMap: weaveTex,
      bumpScale: preset.bumpScale,
      clearcoat: preset.clearcoat,
      sheen: preset.sheen,
      sheenRoughness: preset.sheenRoughness,
      sheenColor: new THREE.Color(primaryColor || '#111111'),
    });

    const accentClothMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(accentColor || '#F5F5F0'),
      map: weaveTex,
      roughness: preset.roughness * 0.8,
      metalness: preset.metalness,
      bumpMap: weaveTex,
      bumpScale: preset.bumpScale,
      sheen: preset.sheen * 0.7,
      sheenColor: new THREE.Color(accentColor || '#F5F5F0'),
    });

    const showroomGroup = createMannequinMesh(primaryClothMat, accentClothMat, garmentType, bagginess);
    showroomGroup.name = 'showroomRootGroup';
    scene.add(showroomGroup);

    // Find raycast target mesh
    const targetMesh = showroomGroup.getObjectByName('targetTorsoMesh') as THREE.Mesh;
    targetMeshRef.current = targetMesh;

    // Re-project logo onto new torso geometry
    if (logoUrl && decalMaterialRef.current && targetMesh) {
      projectDecal(lastHitPositionRef.current, lastHitNormalRef.current);
    }
  }, [garmentType, primaryColor, accentColor, fabricType, bagginess, logoUrl, projectDecal]);

  // 7. POINTER DRAG & DROP LOGO PLACEMENT HANDLERS
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (interactionMode !== 'dragLogo') return;
    isPointerDownRef.current = true;
    handleRaycastPlacement(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (interactionMode !== 'dragLogo' || !isPointerDownRef.current) return;
    handleRaycastPlacement(e);
  };

  const handlePointerUp = () => {
    isPointerDownRef.current = false;
  };

  const handleRaycastPlacement = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const camera = cameraRef.current;
    const targetMesh = targetMeshRef.current;
    if (!canvas || !camera || !targetMesh) return;

    const rect = canvas.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(targetMesh, false);

    if (intersects.length > 0) {
      const hit = intersects[0];
      const pos = hit.point;
      const normal = hit.face?.normal
        ? hit.face.normal.clone().transformDirection(targetMesh.matrixWorld)
        : new THREE.Vector3(0, 0, 1);

      projectDecal(pos, normal);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${heightClass} bg-[#0A0A0C] border-hairline border-zinc-800 rounded-base overflow-hidden select-none shadow-md flex flex-col`}
    >
      {/* TOP HEADER CONTROLS */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="bg-zinc-900/90 backdrop-blur-xs text-white px-3 py-1.5 rounded-base text-xs font-mono border-hairline border-zinc-700 flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-bold">{garmentType} (PBR Physics & Decal Engine)</span>
          {fileSize && <span className="text-zinc-400">({fileSize})</span>}
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Interaction Mode Toggle: Orbit 360 vs Drag Logo */}
          <div className="bg-zinc-900/90 backdrop-blur-xs border-hairline border-zinc-700 rounded-base p-1 flex items-center gap-1 text-[11px] font-mono">
            <button
              type="button"
              onClick={() => setInteractionMode('orbit')}
              className={`px-2.5 py-1 rounded-sm flex items-center gap-1.5 transition-colors ${interactionMode === 'orbit' ? 'bg-white text-ink font-bold' : 'text-zinc-300 hover:text-white'}`}
            >
              <MousePointer className="w-3 h-3" />
              Orbit
            </button>
            <button
              type="button"
              onClick={() => setInteractionMode('dragLogo')}
              className={`px-2.5 py-1 rounded-sm flex items-center gap-1.5 transition-colors ${interactionMode === 'dragLogo' ? 'bg-emerald-500 text-black font-bold' : 'text-zinc-300 hover:text-white'}`}
            >
              <Hand className="w-3 h-3" />
              Drag Logo
            </button>
          </div>

          {/* Camera Angles */}
          <div className="bg-zinc-900/90 backdrop-blur-xs border-hairline border-zinc-700 rounded-base p-1 flex items-center gap-1 text-[11px] font-mono text-zinc-300">
            <button
              type="button"
              onClick={() => setViewAngle('front')}
              className={`px-2 py-0.5 rounded-sm transition-colors ${viewAngle === 'front' ? 'bg-white text-ink font-bold' : 'hover:text-white'}`}
            >
              Front
            </button>
            <button
              type="button"
              onClick={() => setViewAngle('back')}
              className={`px-2 py-0.5 rounded-sm transition-colors ${viewAngle === 'back' ? 'bg-white text-ink font-bold' : 'hover:text-white'}`}
            >
              Rear
            </button>
            <button
              type="button"
              onClick={() => setViewAngle('side')}
              className={`px-2 py-0.5 rounded-sm transition-colors ${viewAngle === 'side' ? 'bg-white text-ink font-bold' : 'hover:text-white'}`}
            >
              Side
            </button>
            <button
              type="button"
              onClick={() => setViewAngle('isometric')}
              className={`px-2 py-0.5 rounded-sm transition-colors ${viewAngle === 'isometric' ? 'bg-white text-ink font-bold' : 'hover:text-white'}`}
            >
              3D
            </button>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 bg-zinc-900/90 text-white hover:bg-zinc-800 rounded-base border-hairline border-zinc-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* WEBGL CANVAS WITH POINTER HANDLERS */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={`w-full h-full block ${interactionMode === 'dragLogo' ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'}`}
      />

      {/* INTERACTIVE FLOATING TOOLBAR: FABRIC PRESET, BAGGiness FIT & LOGO RESIZER */}
      <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="pointer-events-auto bg-zinc-900/95 backdrop-blur-md border-hairline border-zinc-700 rounded-base p-2 flex flex-wrap items-center gap-3 text-xs font-mono text-white shadow-xl">
          {/* Fabric Presets Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-400 text-[11px] uppercase font-bold">Fabric:</span>
            <select
              value={fabricType}
              onChange={(e) => setFabricType(e.target.value)}
              className="bg-zinc-800 text-white border-hairline border-zinc-600 rounded-sm px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-400"
            >
              {Object.keys(FABRIC_PRESETS).map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>

          {/* Bagginess / Fit Slider */}
          <div className="flex items-center gap-2">
            <span className="text-zinc-400 text-[11px] uppercase font-bold">Fit:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={bagginess}
              onChange={(e) => setBagginess(parseFloat(e.target.value))}
              className="w-20 sm:w-24 accent-emerald-400 cursor-pointer"
              title="Adjust Bagginess / Streetwear Silhouette"
            />
            <span className="text-[10px] text-zinc-300">
              {bagginess < 0.3 ? 'Slim' : bagginess < 0.7 ? 'Regular' : 'Oversized'}
            </span>
          </div>

          {/* Logo Size & Rotation Slider (If logo uploaded) */}
          {logoUrl && (
            <div className="flex items-center gap-2 border-l border-zinc-700 pl-3">
              <span className="text-zinc-400 text-[11px] uppercase font-bold">Logo:</span>
              <input
                type="range"
                min="0.15"
                max="0.80"
                step="0.02"
                value={logoScale}
                onChange={(e) => setLogoScale(parseFloat(e.target.value))}
                className="w-16 sm:w-20 accent-emerald-400 cursor-pointer"
                title="Resize Logo Decal"
              />
              <button
                type="button"
                onClick={() => setLogoRotationDeg((prev) => (prev + 90) % 360)}
                className="p-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-sm border-hairline border-zinc-600 text-[10px]"
                title="Rotate Logo 90°"
              >
                ↻ 90°
              </button>
            </div>
          )}
        </div>

        {/* Auto Rotate Toggle */}
        <button
          type="button"
          onClick={() => setIsRotating(!isRotating)}
          className="pointer-events-auto bg-white text-ink font-bold px-3 py-1.5 rounded-base hover:bg-zinc-100 border-hairline border-zinc-300 transition-colors flex items-center gap-1.5 shadow-md font-mono text-xs"
        >
          <RotateCw className="w-3.5 h-3.5" />
          {isRotating ? 'Pause Spin' : '360° Spin'}
        </button>
      </div>
    </div>
  );
};

export default GarmentViewer3D;
