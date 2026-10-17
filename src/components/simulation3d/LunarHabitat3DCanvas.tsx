import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useSimulation } from '../../store/simulationStore';
import { HABITAT_THRESHOLDS } from '../../data/initialState';
import {
  Eye,
  Camera,
  Layers,
  Zap,
  Droplet,
  Wind,
  Sun,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sliders,
  Radio,
  Tag,
  Crosshair,
} from 'lucide-react';

export interface ModuleInspectionData {
  id: string;
  name: string;
  code: string;
  category: 'POWER' | 'ECLSS' | 'STORAGE' | 'SCIENCE' | 'COMMAND';
  status: 'NOMINAL' | 'WARNING' | 'CRITICAL' | 'THROTTLED' | 'SHED / STANDBY';
  telemetry: string;
  description: string;
  assumptions: string;
}

interface SubsystemLabelAnchor {
  id: string;
  code: string;
  name: string;
  worldPos: THREE.Vector3;
  category: 'POWER' | 'ECLSS' | 'STORAGE' | 'SCIENCE' | 'COMMAND';
}

interface LunarHabitat3DCanvasProps {
  className?: string;
  heightClass?: string;
  onSelectModule?: (mod: ModuleInspectionData | null) => void;
}

export const LunarHabitat3DCanvas: React.FC<LunarHabitat3DCanvasProps> = ({
  className = '',
  heightClass = 'h-[580px] lg:h-[680px]',
  onSelectModule,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { state, triggerScenarioWithFeedback, applyPlanWithFeedback, resetSimulation } = useSimulation();
  const { habitat, activeScenario } = state;

  const [inspectedModule, setInspectedModule] = useState<ModuleInspectionData | null>(null);
  const [activeCameraView, setActiveCameraView] = useState<'orbit' | 'solar' | 'battery' | 'eclss' | 'water' | 'air' | 'science' | 'top'>('orbit');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [screenLabels, setScreenLabels] = useState<{ id: string; code: string; name: string; x: number; y: number; visible: boolean; category: string }[]>([]);

  // References to dynamic 3D elements for real-time tick updates
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const batteryLedsRef = useRef<THREE.Mesh[]>([]);
  const dustParticlesRef = useRef<THREE.Points | null>(null);
  const solarBeaconsRef = useRef<THREE.PointLight[]>([]);
  const waterConduitRef = useRef<THREE.Mesh | null>(null);
  const airBeaconRef = useRef<THREE.PointLight | null>(null);
  const scienceBayLightsRef = useRef<THREE.PointLight[]>([]);
  const interactiveMeshesRef = useRef<THREE.Mesh[]>([]);
  const particleStreamsRef = useRef<{ points: THREE.Points; curve: THREE.CatmullRomCurve3; speed: number; offsets: Float32Array; type: string }[]>([]);

  // Subsystem Label Anchors
  const labelAnchorsRef = useRef<SubsystemLabelAnchor[]>([
    { id: 'solar-pv-array-left', code: 'PV-01A', name: 'PORT SOLAR ARRAY', worldPos: new THREE.Vector3(-11.5, 6.2, 0), category: 'POWER' },
    { id: 'solar-pv-array-right', code: 'PV-01B', name: 'STBD SOLAR ARRAY', worldPos: new THREE.Vector3(11.5, 6.2, 0), category: 'POWER' },
    { id: 'command-hub', code: 'HUB-01', name: 'COMMAND CORE (120V BUS)', worldPos: new THREE.Vector3(0, 7.5, 0), category: 'COMMAND' },
    { id: 'batt-bay', code: 'BATT-01', name: 'ENERGY STORAGE BAY', worldPos: new THREE.Vector3(-8.5, 3.8, 5.5), category: 'POWER' },
    { id: 'eclss-module', code: 'ECLSS-01', name: 'ECLSS O2 RECIRCULATION', worldPos: new THREE.Vector3(0, 4.8, -8.0), category: 'ECLSS' },
    { id: 'air-filter-unit', code: 'AIR-01', name: 'CATALYTIC AIR SCRUBBER', worldPos: new THREE.Vector3(-4.5, 3.8, -4.5), category: 'ECLSS' },
    { id: 'water-recovery-distillation', code: 'WRS-02', name: 'WATER DISTILLATION', worldPos: new THREE.Vector3(8.5, 4.2, -4.5), category: 'STORAGE' },
    { id: 'science-lab-bay', code: 'LAB-03', name: 'SCIENCE & MATERIALS LAB', worldPos: new THREE.Vector3(6.5, 4.0, 6.0), category: 'SCIENCE' },
  ]);

  // Update inspection callback
  useEffect(() => {
    if (onSelectModule) {
      onSelectModule(inspectedModule);
    }
  }, [inspectedModule, onSelectModule]);

  // Handle Fullscreen Toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.error(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
      setIsFullscreen(false);
    }
  };

  // Camera presets
  const switchCameraView = (view: 'orbit' | 'solar' | 'battery' | 'eclss' | 'water' | 'air' | 'science' | 'top') => {
    if (!cameraRef.current || !controlsRef.current) return;
    setActiveCameraView(view);

    const controls = controlsRef.current;
    const camera = cameraRef.current;

    switch (view) {
      case 'orbit':
        camera.position.set(22, 16, 26);
        controls.target.set(0, 2, 0);
        break;
      case 'solar':
        camera.position.set(-16, 8, 8);
        controls.target.set(-10, 3, 0);
        break;
      case 'battery':
        camera.position.set(-10, 6, 14);
        controls.target.set(-7, 2, 6);
        break;
      case 'eclss':
        camera.position.set(12, 7, -10);
        controls.target.set(0, 2, -7);
        break;
      case 'water':
        camera.position.set(16, 6, -2);
        controls.target.set(8.5, 2, -4.5);
        break;
      case 'air':
        camera.position.set(-8, 6, -6);
        controls.target.set(-4.5, 2, -4.5);
        break;
      case 'science':
        camera.position.set(12, 6, 12);
        controls.target.set(6.5, 2, 6.0);
        break;
      case 'top':
        camera.position.set(0, 42, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  // Initialize Three.js Scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Dark Space Fog
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020408);
    scene.fog = new THREE.FogExp2(0x020408, 0.006);
    sceneRef.current = scene;

    // 2. Camera
    const width = container.clientWidth;
    const height = container.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.2, 1200);
    camera.position.set(22, 16, 26);
    cameraRef.current = camera;

    // 3. Renderer with ACES Filmic tone mapping & shadow maps
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.03; // Prevent dipping beneath terrain
    controls.minDistance = 6;
    controls.maxDistance = 85;
    controls.target.set(0, 2, 0);
    controlsRef.current = controls;

    // 5. Celestial Lighting (Harsh solar rays + soft Earthshine bounce)
    const sunLight = new THREE.DirectionalLight(0xfff8e8, 3.2);
    sunLight.position.set(40, 35, 30);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 120;
    sunLight.shadow.camera.left = -25;
    sunLight.shadow.camera.right = 25;
    sunLight.shadow.camera.top = 25;
    sunLight.shadow.camera.bottom = -25;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    const earthLight = new THREE.DirectionalLight(0x284868, 0.65);
    earthLight.position.set(-30, 20, -40);
    scene.add(earthLight);

    const ambientLight = new THREE.AmbientLight(0x0c1524, 0.45);
    scene.add(ambientLight);

    // 6. Starfield Points
    const starCount = 2800;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const radius = 350 + Math.random() * 200;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = Math.abs(radius * Math.cos(phi)) + 10;
      starPos[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xddeeff,
      size: 1.1,
      transparent: true,
      opacity: 0.85,
    });
    const starfield = new THREE.Points(starGeo, starMat);
    scene.add(starfield);

    // 7. Distant Earth in Sky
    const earthGroup = new THREE.Group();
    earthGroup.position.set(130, 75, -170);

    const earthGeo = new THREE.SphereGeometry(6.5, 32, 32);
    const earthMat = new THREE.MeshStandardMaterial({
      color: 0x2266aa,
      roughness: 0.7,
      metalness: 0.1,
      emissive: 0x061830,
      emissiveIntensity: 0.5,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthGroup.add(earthMesh);

    const atmGeo = new THREE.SphereGeometry(6.9, 32, 32);
    const atmMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.22,
      side: THREE.BackSide,
    });
    earthGroup.add(new THREE.Mesh(atmGeo, atmMat));
    scene.add(earthGroup);

    // 8. Lunar Terrain with procedural crater depressions
    const groundGeo = new THREE.PlaneGeometry(160, 160, 80, 80);
    groundGeo.rotateX(-Math.PI / 2);
    const pos = groundGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      let y = Math.sin(x * 0.05) * Math.cos(z * 0.05) * 0.8;
      const d1 = Math.hypot(x + 25, z + 20);
      if (d1 < 14) y -= Math.cos((d1 / 14) * (Math.PI / 2)) * 3.2;
      const d2 = Math.hypot(x - 32, z - 18);
      if (d2 < 18) y -= Math.cos((d2 / 18) * (Math.PI / 2)) * 4.0;
      const d3 = Math.hypot(x - 10, z + 40);
      if (d3 < 12) y -= Math.cos((d3 / 12) * (Math.PI / 2)) * 2.8;

      const dCenter = Math.hypot(x, z);
      if (dCenter < 18) {
        y *= dCenter / 18;
      }
      pos.setY(i, y);
    }
    groundGeo.computeVertexNormals();

    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x12161c,
      roughness: 0.94,
      metalness: 0.06,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.receiveShadow = true;
    scene.add(ground);

    // Landing perimeter ring
    const padGeo = new THREE.RingGeometry(13.8, 14.1, 48);
    padGeo.rotateX(-Math.PI / 2);
    const padMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.28 });
    const pad = new THREE.Mesh(padGeo, padMat);
    pad.position.y = 0.05;
    scene.add(pad);

    // Array to collect interactive meshes for Raycaster
    const interactiveList: THREE.Mesh[] = [];

    const registerInteractive = (mesh: THREE.Mesh, data: ModuleInspectionData) => {
      mesh.userData = data;
      interactiveList.push(mesh);
    };

    // ==========================================
    // 9. CENTRAL COMMAND HUB & PRESSURIZED CUPOLA (120V MAIN BUS)
    // ==========================================
    const hubGroup = new THREE.Group();
    hubGroup.position.set(0, 0, 0);

    const hubGeo = new THREE.CylinderGeometry(4.2, 4.8, 2.4, 8);
    const hubMat = new THREE.MeshStandardMaterial({ color: 0xeef2f7, roughness: 0.35, metalness: 0.5 });
    const hubBase = new THREE.Mesh(hubGeo, hubMat);
    hubBase.position.y = 1.2;
    hubBase.castShadow = true;
    hubBase.receiveShadow = true;
    hubGroup.add(hubBase);

    const cupolaGeo = new THREE.SphereGeometry(2.6, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const cupolaMat = new THREE.MeshPhysicalMaterial({
      color: 0x00e5ff,
      transmission: 0.6,
      opacity: 0.85,
      transparent: true,
      roughness: 0.15,
      metalness: 0.2,
      emissive: 0x003344,
      emissiveIntensity: 0.4,
    });
    const cupola = new THREE.Mesh(cupolaGeo, cupolaMat);
    cupola.position.y = 2.4;
    hubGroup.add(cupola);

    // Mast & Antenna Dish
    const mastGeo = new THREE.CylinderGeometry(0.08, 0.12, 4.0, 8);
    const mastMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.2 });
    const mast = new THREE.Mesh(mastGeo, mastMat);
    mast.position.set(0, 4.4, 0);
    hubGroup.add(mast);

    const dishGeo = new THREE.ConeGeometry(0.8, 0.4, 16, 1, true);
    dishGeo.rotateX(Math.PI / 4);
    const dishMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.7, roughness: 0.3 });
    const dish = new THREE.Mesh(dishGeo, dishMat);
    dish.position.set(0, 5.8, 0);
    hubGroup.add(dish);

    const mastBeacon = new THREE.PointLight(0x00ff88, 1.2, 8);
    mastBeacon.position.set(0, 6.2, 0);
    hubGroup.add(mastBeacon);

    // Airlock Portal
    const airlockGeo = new THREE.BoxGeometry(1.6, 1.6, 2.2);
    const airlockMat = new THREE.MeshStandardMaterial({ color: 0x222a36, roughness: 0.4, metalness: 0.6 });
    const airlock = new THREE.Mesh(airlockGeo, airlockMat);
    airlock.position.set(0, 0.8, 4.8);
    airlock.castShadow = true;
    hubGroup.add(airlock);

    registerInteractive(hubBase, {
      id: 'command-hub',
      name: 'Primary Command Core (120V DC Bus)',
      code: 'HUB-01',
      category: 'COMMAND',
      status: 'NOMINAL',
      telemetry: 'Main Bus: 120V DC | Total Demand: 8.0 kW | Cabin Press: 101.3 kPa',
      description: 'Habitation dome, flight avionics router, and central electrical distribution bus distributing solar/battery power to all life support systems.',
      assumptions: 'Separates stored energy (kWh) from instantaneous power demand (kW); deterministic load balancing without AI API latency.',
    });

    scene.add(hubGroup);

    // ==========================================
    // 10. DUAL PHOTOVOLTAIC SOLAR ARRAYS (PV-01A & PV-01B)
    // ==========================================
    const solarGroup = new THREE.Group();

    const createSolarArrayWing = (isLeft: boolean) => {
      const wingGroup = new THREE.Group();
      const xOffset = isLeft ? -11.5 : 11.5;
      wingGroup.position.set(xOffset, 0, 0);

      const pylonGeo = new THREE.CylinderGeometry(0.2, 0.35, 4.5, 8);
      const pylonMat = new THREE.MeshStandardMaterial({ color: 0x333d4b, metalness: 0.8, roughness: 0.3 });
      const pylon = new THREE.Mesh(pylonGeo, pylonMat);
      pylon.position.y = 2.25;
      pylon.castShadow = true;
      wingGroup.add(pylon);

      const trussGeo = new THREE.BoxGeometry(0.3, 0.3, 8.0);
      const trussMat = new THREE.MeshStandardMaterial({ color: 0x555f6e, metalness: 0.7, roughness: 0.3 });
      const truss = new THREE.Mesh(trussGeo, trussMat);
      truss.position.set(0, 4.5, 0);
      wingGroup.add(truss);

      const panelMat = new THREE.MeshStandardMaterial({
        color: 0x061830,
        metalness: 0.85,
        roughness: 0.2,
        emissive: 0x001830,
        emissiveIntensity: 0.3,
      });

      for (let z = -3.2; z <= 3.2; z += 1.8) {
        const panelGeo = new THREE.BoxGeometry(3.6, 0.08, 1.4);
        const panel = new THREE.Mesh(panelGeo, panelMat);
        panel.position.set(0, 4.5, z);
        panel.rotation.x = -Math.PI / 10;
        panel.castShadow = true;
        panel.receiveShadow = true;
        wingGroup.add(panel);

        registerInteractive(panel, {
          id: isLeft ? 'solar-pv-array-left' : 'solar-pv-array-right',
          name: isLeft ? 'Port Photovoltaic Array 01A' : 'Starboard Photovoltaic Array 01B',
          code: isLeft ? 'PV-01A' : 'PV-01B',
          category: 'POWER',
          status: habitat.solarOutputKW < 8 ? 'WARNING' : 'NOMINAL',
          telemetry: `Solar Generation: ${habitat.solarOutputKW.toFixed(1)} kW (Nominal: 8.0 kW)`,
          description: 'Multi-junction gallium-arsenide cells converting lunar solar irradiance into 120V DC power.',
          assumptions: 'Regolith dust ejecta from nearby micrometeorite impact reduces output from 8.0 kW to 3.0 kW.',
        });
      }

      const beaconLight = new THREE.PointLight(0x00e5ff, 0.8, 6);
      beaconLight.position.set(0, 5.0, 0);
      wingGroup.add(beaconLight);
      solarBeaconsRef.current.push(beaconLight);

      return wingGroup;
    };

    solarGroup.add(createSolarArrayWing(true));
    solarGroup.add(createSolarArrayWing(false));
    scene.add(solarGroup);

    // ==========================================
    // 11. REGOLITH DUST STORM PARTICLE SYSTEM
    // ==========================================
    const dustCount = 850;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 32;
      dustPos[i * 3 + 1] = Math.random() * 8 + 0.5;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xaa7744,
      size: 0.65,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    dustParticlesRef.current = dustParticles;
    scene.add(dustParticles);

    // ==========================================
    // 12. ECLSS LIFE SUPPORT MODULE (OXYGEN SCRUBBERS)
    // ==========================================
    const eclssGroup = new THREE.Group();
    eclssGroup.position.set(0, 0, -8);

    const eclssGeo = new THREE.CylinderGeometry(1.8, 1.8, 4.0, 16);
    eclssGeo.rotateZ(Math.PI / 2);
    const eclssMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.5, roughness: 0.35 });
    const eclssPod = new THREE.Mesh(eclssGeo, eclssMat);
    eclssPod.position.y = 1.6;
    eclssPod.castShadow = true;
    eclssPod.receiveShadow = true;
    eclssGroup.add(eclssPod);

    const tankGeo = new THREE.CylinderGeometry(0.7, 0.7, 2.8, 16);
    const tankMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x002233,
    });
    const tank1 = new THREE.Mesh(tankGeo, tankMat);
    tank1.position.set(-1.2, 3.2, 0);
    tank1.castShadow = true;
    eclssGroup.add(tank1);

    const tank2 = tank1.clone();
    tank2.position.set(1.2, 3.2, 0);
    eclssGroup.add(tank2);

    registerInteractive(eclssPod, {
      id: 'eclss-module',
      name: 'ECLSS Atmospheric Recirculation Core',
      code: 'ECLSS-01',
      category: 'ECLSS',
      status: habitat.oxygenIndicatorPct < 70 ? 'CRITICAL' : 'NOMINAL',
      telemetry: `O2 Reserve Indicator: ${habitat.oxygenIndicatorPct.toFixed(1)}% | Load: 2.5 kW`,
      description: 'CO2 trace contaminant scrubbers, catalytic air oxygenation loop, and cabin pressurization valves.',
      assumptions: 'Consumes constant 2.5 kW baseline electrical power; protected from load shedding.',
    });

    scene.add(eclssGroup);

    // ==========================================
    // 13. AIR FILTRATION & CONTAMINANT SCRUBBER UNIT (AIR-01)
    // ==========================================
    const airGroup = new THREE.Group();
    airGroup.position.set(-4.5, 0, -4.5);

    const airCanGeo = new THREE.CylinderGeometry(1.1, 1.3, 2.6, 16);
    const airCanMat = new THREE.MeshStandardMaterial({ color: 0x303d4d, metalness: 0.6, roughness: 0.35 });
    const airCan = new THREE.Mesh(airCanGeo, airCanMat);
    airCan.position.y = 1.3;
    airCan.castShadow = true;
    airGroup.add(airCan);

    const cowlGeo = new THREE.ConeGeometry(1.2, 1.0, 16, 1, true);
    cowlGeo.rotateX(-Math.PI / 2);
    const cowlMat = new THREE.MeshStandardMaterial({ color: 0x00e5ff, metalness: 0.8, roughness: 0.2, emissive: 0x002233 });
    const cowl = new THREE.Mesh(cowlGeo, cowlMat);
    cowl.position.set(0, 1.3, 0.9);
    airGroup.add(cowl);

    const airBeacon = new THREE.PointLight(0x00e5ff, 0.8, 6);
    airBeacon.position.set(0, 2.8, 0);
    airGroup.add(airBeacon);
    airBeaconRef.current = airBeacon;

    registerInteractive(airCan, {
      id: 'air-filter-unit',
      name: 'Catalytic Air Filtration & Particulate Scrubber',
      code: 'AIR-01',
      category: 'ECLSS',
      status: habitat.oxygenIndicatorPct <= 42 ? 'CRITICAL' : habitat.oxygenDeclineRatePctPerHour > 0 ? 'WARNING' : 'NOMINAL',
      telemetry: `Indicator: ${habitat.oxygenIndicatorPct.toFixed(1)}% (Floor: 42.0%) | Decline: ${habitat.oxygenDeclineRatePctPerHour.toFixed(1)}%/h`,
      description: 'Catalytic air purification and particulate filtration loop removing volatile organic compounds and fine regolith dust.',
      assumptions: 'Simplified illustrative indicator model, not physiological crew safety prediction.',
    });

    scene.add(airGroup);

    // ==========================================
    // 14. WATER RECOVERY & DISTILLATION LOOP (WRS-02)
    // ==========================================
    const waterGroup = new THREE.Group();
    waterGroup.position.set(8.5, 0, -4.5);

    const wTankGeo = new THREE.CylinderGeometry(1.1, 1.1, 3.2, 16);
    const wTankMat = new THREE.MeshStandardMaterial({ color: 0x243242, metalness: 0.7, roughness: 0.3 });

    const wTank1 = new THREE.Mesh(wTankGeo, wTankMat);
    wTank1.position.set(0, 1.6, 0);
    wTank1.castShadow = true;
    waterGroup.add(wTank1);

    const wTank2 = wTank1.clone();
    wTank2.position.set(2.2, 1.6, 0.5);
    waterGroup.add(wTank2);

    const conduitGeo = new THREE.CylinderGeometry(0.12, 0.12, 6.5, 8);
    conduitGeo.rotateZ(Math.PI / 2.6);
    const conduitMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      emissive: 0x00e5ff,
      emissiveIntensity: 0.8,
      roughness: 0.3,
    });
    const waterConduit = new THREE.Mesh(conduitGeo, conduitMat);
    waterConduit.position.set(-2.5, 1.5, 2.0);
    waterConduitRef.current = waterConduit;
    waterGroup.add(waterConduit);

    registerInteractive(wTank1, {
      id: 'water-recovery-distillation',
      name: 'Closed-Loop Water Recovery & Distillation Array',
      code: 'WRS-02',
      category: 'STORAGE',
      status: habitat.waterLossRateLPD > 0 ? 'CRITICAL' : 'NOMINAL',
      telemetry: `Potable Reserve: ${habitat.waterLitres.toFixed(0)} L | Safety Floor: 340 L | Net Loss: ${habitat.waterLossRateLPD} L/day`,
      description: 'Closed-loop greywater vacuum distillation and urine processor assembly reclaiming potable water for expedition crew.',
      assumptions: 'Baseline load 1.0 kW; throttled to 0.5 kW under Plan C as an operational survival trade-off.',
    });

    scene.add(waterGroup);

    // ==========================================
    // 15. BATTERY POWER BANK BAY (BATT-01..03) & LED CHARGE METERS
    // ==========================================
    const battGroup = new THREE.Group();
    battGroup.position.set(-8.5, 0, 5.5);

    const cabGeo = new THREE.BoxGeometry(1.4, 2.4, 1.2);
    const cabMat = new THREE.MeshStandardMaterial({ color: 0x1b232e, metalness: 0.6, roughness: 0.4 });

    const battLeds: THREE.Mesh[] = [];

    for (let c = 0; c < 3; c++) {
      const cabinet = new THREE.Mesh(cabGeo, cabMat);
      cabinet.position.set(c * 1.8, 1.2, 0);
      cabinet.castShadow = true;
      cabinet.receiveShadow = true;
      battGroup.add(cabinet);

      registerInteractive(cabinet, {
        id: `batt-bay`,
        name: `Li-Ion Power Storage Bay (Cabinets 1-3)`,
        code: `BATT-01`,
        category: 'POWER',
        status: habitat.batteryKWh <= 18 ? 'CRITICAL' : 'NOMINAL',
        telemetry: `Reserve: ${habitat.batteryKWh.toFixed(1)} kWh | Floor: 18.0 kWh | Net Draw: ${habitat.netDrainKW.toFixed(1)} kW`,
        description: 'Aerospace-grade lithium-ion cell racks maintaining nominal 120V bus voltage during occultation or power deficit.',
        assumptions: '18.0 kWh safety floor strictly enforced; usable margin is max(0, battery - 18.0) kWh; stops depletion at floor.',
      });

      for (let bar = 0; bar < 5; bar++) {
        const ledGeo = new THREE.BoxGeometry(0.8, 0.18, 0.05);
        const ledMat = new THREE.MeshStandardMaterial({
          color: bar < 2 ? 0xff9900 : 0x00ff88,
          emissive: bar < 2 ? 0xff9900 : 0x00ff88,
          emissiveIntensity: 0.9,
        });
        const led = new THREE.Mesh(ledGeo, ledMat);
        led.position.set(c * 1.8, 0.4 + bar * 0.4, 0.62);
        battGroup.add(led);
        battLeds.push(led);
      }
    }
    batteryLedsRef.current = battLeds;
    scene.add(battGroup);

    // ==========================================
    // 16. SCIENCE & MATERIALS LAB (LAB-03) (SHEDDABLE LOAD)
    // ==========================================
    const scienceGroup = new THREE.Group();
    scienceGroup.position.set(6.5, 0, 6.0);

    const sciGeo = new THREE.CylinderGeometry(2.0, 2.5, 2.2, 8);
    const sciMat = new THREE.MeshStandardMaterial({ color: 0xc8d2de, metalness: 0.4, roughness: 0.5 });
    const sciPod = new THREE.Mesh(sciGeo, sciMat);
    sciPod.position.y = 1.1;
    sciPod.castShadow = true;
    sciPod.receiveShadow = true;
    scienceGroup.add(sciPod);

    const sciLight = new THREE.PointLight(0x00e5ff, 1.0, 8);
    sciLight.position.set(0, 3.0, 0);
    scienceGroup.add(sciLight);
    scienceBayLightsRef.current.push(sciLight);

    registerInteractive(sciPod, {
      id: 'science-lab-bay',
      name: 'Lunar Geology & Materials Science Lab',
      code: 'LAB-03',
      category: 'SCIENCE',
      status: habitat.appliedPlanId === 'plan-c' ? 'SHED / STANDBY' : 'NOMINAL',
      telemetry: `Power Draw: ${habitat.appliedPlanId === 'plan-c' ? '0.0 kW (SHED)' : '3.0 kW (ACTIVE)'}`,
      description: 'Regolith refining centrifuges, spectrometry compute, and exterior surface experiments.',
      assumptions: 'Tier-3 non-essential research load prioritized for rapid load shedding to preserve life support.',
    });

    scene.add(scienceGroup);

    // ==========================================
    // 17. PHYSICAL ELECTRICAL CONDUITS & ANIMATED PARTICLE STREAMS
    // ==========================================
    const createConduitPath = (
      points: THREE.Vector3[],
      color: number,
      particleColor: number,
      particleCount: number,
      type: string,
      initialSpeed: number
    ) => {
      const curve = new THREE.CatmullRomCurve3(points);

      // 1. Ground conduit pipe mesh
      const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.08, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: 0x1b232e,
        roughness: 0.4,
        metalness: 0.8,
        emissive: color,
        emissiveIntensity: 0.35,
      });
      const tube = new THREE.Mesh(tubeGeo, tubeMat);
      scene.add(tube);

      // 2. Dynamic Particle Stream along curve
      const pGeo = new THREE.BufferGeometry();
      const pPositions = new Float32Array(particleCount * 3);
      const offsets = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        offsets[i] = i / particleCount;
        const pt = curve.getPoint(offsets[i]);
        pPositions[i * 3] = pt.x;
        pPositions[i * 3 + 1] = pt.y + 0.08;
        pPositions[i * 3 + 2] = pt.z;
      }

      pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
      const pMat = new THREE.PointsMaterial({
        color: particleColor,
        size: 0.35,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
      });

      const pMesh = new THREE.Points(pGeo, pMat);
      scene.add(pMesh);

      particleStreamsRef.current.push({
        points: pMesh,
        curve,
        speed: initialSpeed,
        offsets,
        type,
      });
    };

    // Solar Wing Left -> Central Hub
    createConduitPath(
      [new THREE.Vector3(-11.5, 0.4, 0), new THREE.Vector3(-6.0, 0.15, 0), new THREE.Vector3(-2.8, 0.4, 0)],
      0xff9900,
      0xffcc00,
      14,
      'solar-left',
      0.18
    );

    // Solar Wing Right -> Central Hub
    createConduitPath(
      [new THREE.Vector3(11.5, 0.4, 0), new THREE.Vector3(6.0, 0.15, 0), new THREE.Vector3(2.8, 0.4, 0)],
      0xff9900,
      0xffcc00,
      14,
      'solar-right',
      0.18
    );

    // Central Hub <-> Battery Storage Bay
    createConduitPath(
      [new THREE.Vector3(-2.0, 0.4, 1.8), new THREE.Vector3(-4.5, 0.15, 3.5), new THREE.Vector3(-6.8, 0.4, 5.0)],
      0x00e5ff,
      0x00e5ff,
      16,
      'battery',
      0.12
    );

    // Central Hub -> ECLSS Life Support
    createConduitPath(
      [new THREE.Vector3(0, 0.4, -2.5), new THREE.Vector3(0, 0.15, -5.0), new THREE.Vector3(0, 0.4, -6.5)],
      0x00e5ff,
      0x00ff88,
      12,
      'eclss',
      0.16
    );

    // Central Hub -> Air Filtration Subsystem
    createConduitPath(
      [new THREE.Vector3(-1.8, 0.4, -2.0), new THREE.Vector3(-3.0, 0.15, -3.2), new THREE.Vector3(-4.0, 0.4, -4.0)],
      0x00e5ff,
      0x00e5ff,
      10,
      'air',
      0.14
    );

    // Central Hub -> Water Recovery Array
    createConduitPath(
      [new THREE.Vector3(2.2, 0.4, -1.8), new THREE.Vector3(5.0, 0.15, -3.0), new THREE.Vector3(7.0, 0.4, -4.0)],
      0x00e5ff,
      0x00e5ff,
      12,
      'water',
      0.15
    );

    // Central Hub -> Science & Materials Lab (Sheddable Load)
    createConduitPath(
      [new THREE.Vector3(2.0, 0.4, 2.0), new THREE.Vector3(4.0, 0.15, 4.0), new THREE.Vector3(5.5, 0.4, 5.2)],
      0x00e5ff,
      0x00e5ff,
      14,
      'science',
      0.16
    );

    interactiveMeshesRef.current = interactiveList;

    // ==========================================
    // 18. RAYCASTER & MOUSE INTERACTION
    // ==========================================
    const raycaster = new THREE.Raycaster();

    const handlePointerDown = (evt: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const clickMouse = new THREE.Vector2(
        ((evt.clientX - rect.left) / rect.width) * 2 - 1,
        -((evt.clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.setFromCamera(clickMouse, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshesRef.current, false);

      if (intersects.length > 0) {
        const target = intersects[0].object as THREE.Mesh;
        if (target.userData && target.userData.id) {
          setInspectedModule(target.userData as ModuleInspectionData);
        }
      } else {
        setInspectedModule(null);
      }
    };

    renderer.domElement.addEventListener('click', handlePointerDown);

    // ==========================================
    // 19. ANIMATION RENDER LOOP & PARTICLE TICKS
    // ==========================================
    let animationFrameId: number;
    let clock = new THREE.Clock();
    const tempProjVec = new THREE.Vector3();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Starfield rotation
      starfield.rotation.y = elapsedTime * 0.0008;

      // Mast beacon gentle pulse
      mastBeacon.intensity = 0.8 + Math.sin(elapsedTime * 3) * 0.4;

      // Dust cloud slow drift
      if (dustParticles.material.opacity > 0) {
        dustParticles.rotation.y = elapsedTime * 0.03;
      }

      // Animate Electrical & Resource Conduit Particle Streams
      particleStreamsRef.current.forEach((stream) => {
        const posAttr = stream.points.geometry.attributes.position as THREE.BufferAttribute;
        const count = stream.offsets.length;

        for (let i = 0; i < count; i++) {
          stream.offsets[i] = (stream.offsets[i] + stream.speed * delta) % 1.0;
          const pt = stream.curve.getPoint(stream.offsets[i]);
          posAttr.setXYZ(i, pt.x, pt.y + 0.08, pt.z);
        }
        posAttr.needsUpdate = true;
      });

      // Update OrbitControls
      controls.update();

      // Render Three.js Scene
      renderer.render(scene, camera);

      // Project 3D Subsystem World Anchors to 2D Container Screen Coordinates
      if (container) {
        const w = container.clientWidth;
        const h = container.clientHeight;
        const updatedLabels = labelAnchorsRef.current.map((anchor) => {
          tempProjVec.copy(anchor.worldPos);
          tempProjVec.project(camera);
          const visible = tempProjVec.z < 1.0;
          const x = (tempProjVec.x * 0.5 + 0.5) * w;
          const y = (-(tempProjVec.y * 0.5) + 0.5) * h;
          return {
            id: anchor.id,
            code: anchor.code,
            name: anchor.name,
            x,
            y,
            visible,
            category: anchor.category,
          };
        });
        setScreenLabels(updatedLabels);
      }
    };

    animate();

    // ==========================================
    // 20. RESIZE LISTENER
    // ==========================================
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.domElement.removeEventListener('click', handlePointerDown);
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
      renderer.dispose();
      groundGeo.dispose();
      groundMat.dispose();
    };
  }, []);

  // ==========================================
  // REAL-TIME REACTIVE UPDATES (Syncs with Store)
  // ==========================================
  useEffect(() => {
    // 1. Update Battery LED Bars
    const batt = habitat.batteryKWh;
    const isBelowFloor = batt <= HABITAT_THRESHOLDS.batteryFloorKWh;

    batteryLedsRef.current.forEach((led, idx) => {
      const barLevel = idx % 5;
      const thresholdForBar = (barLevel + 1) * 7.6;
      const isLit = batt >= thresholdForBar - 3.8;

      const mat = led.material as THREE.MeshStandardMaterial;
      if (isLit) {
        if (isBelowFloor) {
          mat.color.setHex(0xff2a4d);
          mat.emissive.setHex(0xff2a4d);
          mat.emissiveIntensity = 1.0;
        } else if (barLevel < 2) {
          mat.color.setHex(0xff9900);
          mat.emissive.setHex(0xff9900);
          mat.emissiveIntensity = 0.9;
        } else {
          mat.color.setHex(0x00ff88);
          mat.emissive.setHex(0x00ff88);
          mat.emissiveIntensity = 0.9;
        }
      } else {
        mat.color.setHex(0x1a222c);
        mat.emissive.setHex(0x000000);
        mat.emissiveIntensity = 0;
      }
    });

    // 2. Solar Drop Dust Occlusion & Beacon Alarms
    const isSolarFault = activeScenario?.id === 'solar-drop';
    if (dustParticlesRef.current) {
      const dustMat = dustParticlesRef.current.material as THREE.PointsMaterial;
      dustMat.opacity = isSolarFault ? 0.72 : 0;
    }
    solarBeaconsRef.current.forEach((beacon) => {
      beacon.color.setHex(isSolarFault ? 0xff2a4d : 0x00e5ff);
      beacon.intensity = isSolarFault ? 1.8 : 0.8;
    });

    // 3. Water Recovery Conduit & Fault Alerts
    const isWaterFault = activeScenario?.id === 'water-recovery-fault';
    if (waterConduitRef.current) {
      const mat = waterConduitRef.current.material as THREE.MeshStandardMaterial;
      mat.color.setHex(isWaterFault ? 0xff2a4d : 0x00e5ff);
      mat.emissive.setHex(isWaterFault ? 0xff2a4d : 0x00e5ff);
    }

    // 4. Air Filtration Subsystem Beacon Alert
    const isAirFault = activeScenario?.id === 'air-filter-fault';
    if (airBeaconRef.current) {
      airBeaconRef.current.color.setHex(isAirFault ? 0xff9900 : 0x00e5ff);
      airBeaconRef.current.intensity = isAirFault ? 1.6 : 0.8;
    }

    // 5. Science Bay Load Shedding Visual (Plan C)
    const isScienceShed = habitat.appliedPlanId === 'plan-c' || habitat.appliedPlanId === 'plan-a';
    scienceBayLightsRef.current.forEach((light) => {
      light.intensity = isScienceShed ? 0.05 : 1.0;
      light.color.setHex(isScienceShed ? 0xff9900 : 0x00e5ff);
    });

    // 6. Adjust Electrical Particle Streams Behavior
    particleStreamsRef.current.forEach((stream) => {
      const pMat = stream.points.material as THREE.PointsMaterial;

      if (stream.type === 'battery') {
        // Battery Stream: When faulted, pulses rapidly from battery to hub (supplying deficit)
        if (habitat.netDrainKW > 0) {
          pMat.color.setHex(habitat.batteryKWh <= 18 ? 0xff2a4d : 0xff9900);
          stream.speed = habitat.netDrainKW >= 4.0 ? 0.35 : 0.18; // 5.0 kW vs 1.5 kW speed
          pMat.opacity = 0.95;
        } else {
          // Zero net drain: idle equilibrium
          pMat.color.setHex(0x00e5ff);
          stream.speed = 0.06;
          pMat.opacity = 0.45;
        }
      } else if (stream.type === 'solar-left' || stream.type === 'solar-right') {
        if (isSolarFault) {
          pMat.color.setHex(0xff5533);
          stream.speed = 0.08; // Faint reduced generation
          pMat.opacity = 0.45;
        } else {
          pMat.color.setHex(0xffcc00);
          stream.speed = 0.20; // Nominal 8.0 kW flow
          pMat.opacity = 0.90;
        }
      } else if (stream.type === 'science') {
        // Science Lab: Powered down when Plan C or Plan A is active
        if (isScienceShed) {
          pMat.opacity = 0;
          stream.speed = 0;
        } else {
          pMat.opacity = 0.85;
          pMat.color.setHex(0x00e5ff);
          stream.speed = 0.16;
        }
      } else if (stream.type === 'water') {
        // Water Recovery: Throttled to 50% under Plan C
        if (habitat.appliedPlanId === 'plan-c') {
          pMat.color.setHex(0xff9900);
          stream.speed = 0.08;
        } else {
          pMat.color.setHex(0x00e5ff);
          stream.speed = 0.15;
        }
      }
    });
  }, [habitat.batteryKWh, habitat.netDrainKW, habitat.appliedPlanId, activeScenario?.id]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${heightClass} bg-black border border-white/15 overflow-hidden select-none font-mono ${className}`}
      style={{ borderRadius: '0px' }}
    >
      {/* 3D Viewport Controls & HUD Overlay */}
      {/* Top Left: Simulation Engine Status Tag */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-black/85 border border-white/20 backdrop-blur-md pointer-events-auto sharp-brutalist" style={{ borderRadius: '0px' }}>
          <span className="w-2 h-2 bg-cyan animate-pulse" />
          <span className="text-xs font-din font-bold uppercase tracking-widest text-white">
            SIMULATION ARENA // DIGITAL TWIN
          </span>
          <span className="text-[10px] text-cyan font-mono font-bold">
            [WEBGL // 60 FPS]
          </span>
        </div>

        {activeScenario && (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-red/15 border border-red/60 text-red text-xs font-mono font-bold pointer-events-auto animate-pulse sharp-brutalist" style={{ borderRadius: '0px' }}>
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider">
              ANOMALY ACTIVE: {activeScenario.name}
            </span>
          </div>
        )}

        {habitat.appliedPlanId && (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-teal/15 border border-teal/60 text-teal text-xs font-mono font-bold pointer-events-auto sharp-brutalist" style={{ borderRadius: '0px' }}>
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider">
              PROTOCOL DEPLOYED: {habitat.appliedPlanId.toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Top Right: Camera Presets, Labels Toggle & Fullscreen */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 flex-wrap justify-end">
        {/* Toggle 3D Labels */}
        <button
          onClick={() => setShowLabels(!showLabels)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-din font-bold tracking-wider uppercase border transition-colors cursor-pointer sharp-brutalist backdrop-blur-md ${
            showLabels
              ? 'bg-cyan text-black border-cyan font-extrabold shadow-cyan-glow/20'
              : 'bg-black/80 text-white/70 border-white/20 hover:text-white'
          }`}
          style={{ borderRadius: '0px' }}
          title="Toggle 3D Subsystem Floating HUD Labels"
        >
          <Tag className="w-3 h-3" />
          <span>LABELS: {showLabels ? 'ON' : 'OFF'}</span>
        </button>

        {/* Camera Preset Dropdown / Bar */}
        <div className="flex items-center bg-black/80 border border-white/20 p-1 backdrop-blur-md sharp-brutalist" style={{ borderRadius: '0px' }}>
          <span className="text-[10px] text-white/50 px-2 font-din uppercase tracking-wider hidden sm:inline">
            CAMERA:
          </span>
          {[
            { id: 'orbit', label: 'TACTICAL ORBIT' },
            { id: 'solar', label: 'SOLAR' },
            { id: 'battery', label: 'BATTERY' },
            { id: 'eclss', label: 'ECLSS' },
            { id: 'water', label: 'WATER' },
            { id: 'air', label: 'AIR' },
            { id: 'science', label: 'SCIENCE' },
            { id: 'top', label: 'TOP-DOWN' },
          ].map((v) => (
            <button
              key={v.id}
              onClick={() => switchCameraView(v.id as any)}
              className={`px-2 py-1 text-[10px] font-din font-bold tracking-wider uppercase transition-colors cursor-pointer sharp-brutalist ${
                activeCameraView === v.id
                  ? 'bg-cyan text-black font-extrabold'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              style={{ borderRadius: '0px' }}
            >
              {v.label}
            </button>
          ))}
        </div>

        <button
          onClick={toggleFullscreen}
          className="p-2 bg-black/80 border border-white/20 text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer backdrop-blur-md sharp-brutalist"
          style={{ borderRadius: '0px' }}
          title="Toggle Fullscreen"
          aria-label="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Floating 3D HUD Subsystem Labels (Projected 2D coordinates) */}
      {showLabels && screenLabels.map((lbl) => {
        if (!lbl.visible) return null;
        const isSelected = inspectedModule?.code.startsWith(lbl.code.substring(0, 3));
        return (
          <div
            key={lbl.id}
            onClick={() => {
              const mesh = interactiveMeshesRef.current.find((m) => m.userData?.code?.startsWith(lbl.code.substring(0, 3)));
              if (mesh && mesh.userData) {
                setInspectedModule(mesh.userData as ModuleInspectionData);
              }
            }}
            style={{
              position: 'absolute',
              left: `${lbl.x}px`,
              top: `${lbl.y}px`,
              transform: 'translate(-50%, -100%)',
              pointerEvents: 'auto',
            }}
            className={`cursor-pointer group select-none transition-all duration-150 z-10 ${
              isSelected ? 'scale-110' : 'hover:scale-105'
            }`}
          >
            <div className={`px-2 py-0.5 border text-[9px] font-mono tracking-widest font-bold uppercase shadow-lg flex items-center gap-1.5 backdrop-blur-md sharp-brutalist ${
              isSelected
                ? 'bg-cyan text-black border-cyan'
                : 'bg-black/85 text-white/90 border-white/30 group-hover:border-cyan group-hover:text-cyan'
            }`} style={{ borderRadius: '0px' }}>
              <span className={`w-1.5 h-1.5 ${
                lbl.category === 'POWER' ? 'bg-amber' : lbl.category === 'ECLSS' ? 'bg-teal' : 'bg-cyan'
              }`} />
              <span>[{lbl.code}] {lbl.name}</span>
            </div>
            {/* Target Reticle Pin */}
            <div className="w-[1px] h-3 bg-white/40 mx-auto" />
          </div>
        );
      })}

      {/* Floating 3D Telemetry Inspection Card */}
      {inspectedModule && (
        <div
          className="absolute bottom-6 left-6 z-20 max-w-md w-full bg-black/95 border-2 border-cyan/70 p-5 shadow-cyan-glow backdrop-blur-md sharp-brutalist"
          style={{ borderRadius: '0px' }}
        >
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/20">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-cyan/20 text-cyan border border-cyan/40 font-bold">
                {inspectedModule.code}
              </span>
              <span className="text-sm font-din font-bold uppercase tracking-wider text-white">
                {inspectedModule.name}
              </span>
            </div>
            <button
              onClick={() => setInspectedModule(null)}
              className="text-white/50 hover:text-white text-base font-bold cursor-pointer px-1"
            >
              &times;
            </button>
          </div>

          <div className="space-y-2 text-xs font-mono mb-3">
            <div className="flex justify-between">
              <span className="text-white/50">OPERATIONAL STATUS:</span>
              <span
                className={`font-bold px-1.5 py-0.2 border ${
                  inspectedModule.status === 'NOMINAL'
                    ? 'text-teal border-teal/40 bg-teal/10'
                    : inspectedModule.status === 'WARNING'
                    ? 'text-amber border-amber/40 bg-amber/10'
                    : inspectedModule.status === 'CRITICAL'
                    ? 'text-red border-red/40 bg-red/10 animate-pulse'
                    : 'text-cyan border-cyan/40 bg-cyan/10'
                }`}
                style={{ borderRadius: '0px' }}
              >
                {inspectedModule.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">LIVE TELEMETRY:</span>
              <span className="text-white font-bold">{inspectedModule.telemetry}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">SYSTEM CATEGORY:</span>
              <span className="text-cyan font-semibold">{inspectedModule.category}</span>
            </div>
          </div>

          <p className="text-[11px] text-white/80 font-sans leading-relaxed border-t border-white/10 pt-2 mb-2">
            {inspectedModule.description}
          </p>

          <div className="p-2 bg-white/[0.03] border border-white/10 text-[10px] text-text-muted font-mono leading-relaxed mb-3">
            <strong className="text-white/80 block mb-0.5 uppercase tracking-wider">ENGINEERING ASSUMPTIONS:</strong>
            {inspectedModule.assumptions}
          </div>

          {/* Direct Interactive Controls */}
          <div className="flex items-center gap-2 pt-1 border-t border-white/10">
            {inspectedModule.category === 'POWER' && (
              <button
                onClick={() => triggerScenarioWithFeedback('solar-drop')}
                className="flex-1 py-1.5 bg-red/20 hover:bg-red/30 border border-red/60 text-red text-xs font-din font-bold uppercase tracking-wider transition-colors cursor-pointer"
                style={{ borderRadius: '0px' }}
              >
                INJECT OCCLUSION FAULT
              </button>
            )}

            {inspectedModule.category === 'SCIENCE' && (
              <button
                onClick={() => {
                  const planC = state.activeScenario?.recoveryPlans.find((p) => p.id === 'plan-c');
                  if (planC) applyPlanWithFeedback(planC);
                }}
                disabled={habitat.appliedPlanId === 'plan-c'}
                className="flex-1 py-1.5 bg-cyan/20 hover:bg-cyan/30 border border-cyan/60 text-cyan text-xs font-din font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-40"
                style={{ borderRadius: '0px' }}
              >
                {habitat.appliedPlanId === 'plan-c' ? 'LAB ALREADY SHED' : 'DEPLOY PLAN C (SHED LAB)'}
              </button>
            )}

            <button
              onClick={() => {
                const codePrefix = inspectedModule.code.substring(0, 3).toLowerCase();
                if (codePrefix.includes('pv')) switchCameraView('solar');
                else if (codePrefix.includes('bat')) switchCameraView('battery');
                else if (codePrefix.includes('ecl')) switchCameraView('eclss');
                else if (codePrefix.includes('air')) switchCameraView('air');
                else if (codePrefix.includes('wrs')) switchCameraView('water');
                else if (codePrefix.includes('lab')) switchCameraView('science');
                else switchCameraView('orbit');
              }}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-din font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1"
              style={{ borderRadius: '0px' }}
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>FOCUS</span>
            </button>
          </div>
        </div>
      )}

      {/* Bottom Center: Navigation Hint */}
      <div className="absolute bottom-4 right-4 z-20 pointer-events-none hidden md:flex items-center gap-3 text-[10px] text-white/50 font-mono bg-black/75 px-3 py-1 border border-white/15 backdrop-blur-sm sharp-brutalist" style={{ borderRadius: '0px' }}>
        <span>ROTATE: LEFT CLICK + DRAG</span>
        <span>•</span>
        <span>PAN: RIGHT CLICK + DRAG</span>
        <span>•</span>
        <span>ZOOM: SCROLL</span>
        <span>•</span>
        <span>INSPECT: CLICK ANY MODULE</span>
      </div>
    </div>
  );
};
