import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { Sliders, Eye, EyeOff, RotateCcw, Compass } from "lucide-react";

const _targetLookAt = new THREE.Vector3(0, 0, 0);

interface ThreeSynapseSceneProps {
  onSelectNode?: (nodeName: string) => void;
  activePillarFilter?: string;
}

/**
 * Celestial Brass Armillary Orrery & Philosophical Astrolabe
 * Replaces the wireframe/cube scene with a warm museum-grade 3D astronomical & philosophical instrument.
 */
export const ThreeSynapseScene: React.FC<ThreeSynapseSceneProps> = ({
  onSelectNode,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  const [isDockCollapsed, setIsDockCollapsed] = useState(false);
  const [orbitTilt, setOrbitTilt] = useState(0.35);
  const [rotSpeed, setRotSpeed] = useState(0.5);
  const [hoveredPartName, setHoveredPartName] = useState<string | null>(null);

  const tiltRef = useRef(orbitTilt);
  tiltRef.current = orbitTilt;
  const speedRef = useRef(rotSpeed);
  speedRef.current = rotSpeed;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement("canvas").getContext("webgl2");
        if (!gl) return true;
        const ext = gl.getExtension("WEBGL_debug_renderer_info");
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 420;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: "high-performance",
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#181614");

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(0, 2.4, 7.6);
    camera.lookAt(_targetLookAt);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Warm Museum Lighting
    const keyLight = new THREE.DirectionalLight("#FFF3D6", 2.6);
    keyLight.position.set(5, 7, 5);
    scene.add(keyLight);

    const fillLight = new THREE.HemisphereLight("#F4EBC8", "#2B2620", 1.1);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight("#FF9600", 1.5);
    rimLight.position.set(-5, 3, -4);
    scene.add(rimLight);

    // Build Precision Brass Armillary Orrery
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.25,
      metalness: 0.88,
    });

    const darkBronzeMat = new THREE.MeshStandardMaterial({
      color: 0x3d352e,
      roughness: 0.4,
      metalness: 0.75,
    });

    // Central Logos Sun Core
    const sunGeo = new THREE.SphereGeometry(0.62, 32, 32);
    const sunMat = new THREE.MeshPhysicalMaterial({
      color: 0xffc800,
      emissive: 0xff9600,
      emissiveIntensity: 0.25,
      roughness: 0.18,
      metalness: 0.6,
      clearcoat: 1.0,
    });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    sunMesh.name = "Logos Central Sun (Philosophy)";
    rootGroup.add(sunMesh);

    // 3 Gimbal Brass Armillary Rings
    const gimbalRings: THREE.Mesh[] = [];
    const ringRadii = [1.25, 1.85, 2.45];
    ringRadii.forEach((radius, idx) => {
      const rGeo = new THREE.TorusGeometry(radius, 0.032, 16, 96);
      const rMesh = new THREE.Mesh(rGeo, idx % 2 === 0 ? brassMat : darkBronzeMat);
      rMesh.name = `Armillary Meridian Ring ${idx + 1}`;
      rootGroup.add(rMesh);
      gimbalRings.push(rMesh);
    });

    // Outer Graduated Ecliptic Band
    const eclipticGeo = new THREE.CylinderGeometry(2.6, 2.6, 0.12, 64, 1, true);
    const eclipticMat = new THREE.MeshStandardMaterial({
      color: 0xc5a059,
      roughness: 0.3,
      metalness: 0.85,
      side: THREE.DoubleSide,
    });
    const eclipticBand = new THREE.Mesh(eclipticGeo, eclipticMat);
    eclipticBand.rotation.z = 0.22;
    eclipticBand.name = "Ecliptic Horizon Band (World View)";
    rootGroup.add(eclipticBand);

    // 5 Orbiting Domain Planets
    const domainPlanets: { mesh: THREE.Mesh; radius: number; speed: number; offset: number }[] = [];
    const planetDefs = [
      { name: "Philosophy Orb (Socrates)", color: 0xce82ff, radius: 1.15, speed: 1.1, offset: 0 },
      { name: "AI Research Orb (Shannon)", color: 0x1cb0f6, radius: 1.55, speed: 0.85, offset: 1.3 },
      { name: "Psychology Orb (Plato)", color: 0x58cc02, radius: 1.95, speed: 0.65, offset: 2.6 },
      { name: "Psychoanalysis Orb (Freud)", color: 0xff6b8b, radius: 2.25, speed: 0.5, offset: 3.9 },
      { name: "World View Orb (Aristotle)", color: 0xff9600, radius: 2.55, speed: 0.38, offset: 5.1 },
    ];

    planetDefs.forEach((def) => {
      const pGeo = new THREE.SphereGeometry(0.18, 24, 24);
      const pMat = new THREE.MeshPhysicalMaterial({
        color: def.color,
        roughness: 0.2,
        metalness: 0.35,
        clearcoat: 0.8,
      });
      const pMesh = new THREE.Mesh(pGeo, pMat);
      pMesh.name = def.name;
      rootGroup.add(pMesh);
      domainPlanets.push({
        mesh: pMesh,
        radius: def.radius,
        speed: def.speed,
        offset: def.offset,
      });
    });

    // Raycasting & Pointer Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let rotX = 0.15;
    let rotY = 0;

    const handlePointerDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handlePointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const dx = e.clientX - prevMouseX;
        const dy = e.clientY - prevMouseY;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;

        rotY += dx * 0.008;
        rotX += dy * 0.008;
        rotX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, rotX));
      } else {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(rootGroup.children, true);
        if (intersects.length > 0) {
          setHoveredPartName(intersects[0].object.name || "Celestial Astrolabe");
        } else {
          setHoveredPartName(null);
        }
      }
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const handleClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(rootGroup.children, true);
      if (intersects.length > 0) {
        onSelectNode?.(intersects[0].object.name);
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);
    dom.addEventListener("click", handleClick);

    let frameId = 0;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 10);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 70);
        }
      };
      frameId = window.setTimeout(poll, 10);
    }

    function tick() {
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      rootGroup.rotation.y = THREE.MathUtils.damp(
        rootGroup.rotation.y,
        rootGroup.rotation.y + speedRef.current * delta * 0.6 + rotY,
        4,
        delta
      );
      rootGroup.rotation.x = THREE.MathUtils.damp(rootGroup.rotation.x, rotX, 5, delta);
      rotY *= 0.88;

      const tilt = tiltRef.current;
      gimbalRings[0].rotation.x = Math.PI / 2 + tilt * 0.8 + elapsed * 0.25;
      gimbalRings[1].rotation.y = tilt * 1.2 + elapsed * 0.18;
      gimbalRings[1].rotation.x = Math.PI / 3;
      gimbalRings[2].rotation.z = tilt * 0.6 - elapsed * 0.12;
      gimbalRings[2].rotation.x = Math.PI / 2.2;

      domainPlanets.forEach((p, idx) => {
        const angle = elapsed * p.speed * (speedRef.current + 0.2) + p.offset;
        const inc = (idx - 2) * 0.18 * (0.5 + tilt);
        p.mesh.position.set(
          Math.cos(angle) * p.radius,
          Math.sin(angle) * p.radius * Math.sin(inc),
          Math.sin(angle) * p.radius * Math.cos(inc)
        );
      });

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    if (isSoftwareGl) {
      afterDraw(tick);
    } else {
      frameId = requestAnimationFrame(tick);
    }

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      dom.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      dom.removeEventListener("click", handleClick);
      renderer.dispose();
      if (dom.parentElement) {
        dom.parentElement.removeChild(dom);
      }
    };
  }, [onSelectNode]);

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-3xl overflow-hidden bg-[#181614] border-2 border-[#191919] shadow-[0_8px_0_0_#191919]">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left HUD */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F4EBC8] border-2 border-[#191919] shadow-[0_2px_0_0_#191919]">
          <Compass className="w-3.5 h-3.5 text-[#191919]" />
          <span className="font-ui font-extrabold text-xs text-[#191919]">
            {hoveredPartName || "Brass Armillary Philosophical Orrery"}
          </span>
        </div>
      </div>

      {/* Top Right Zen Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setIsDockCollapsed(!isDockCollapsed)}
          className="duo-btn text-xs font-ui font-bold px-3 py-1.5 rounded-xl bg-[#F4EBC8] text-[#191919] flex items-center gap-1.5"
        >
          {isDockCollapsed ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span>{isDockCollapsed ? "Controls" : "Zen View"}</span>
        </button>
      </div>

      {/* Bottom Control Dock */}
      <div
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[92%] max-w-[520px] transition-transform duration-300 ${
          isDockCollapsed ? "translate-y-[130%]" : "translate-y-0"
        }`}
      >
        <div className="bg-[#F4EBC8] border-2 border-[#191919] rounded-2xl p-3 shadow-[0_4px_0_0_#191919] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-ui font-bold text-[#191919]">
            <Sliders className="w-3.5 h-3.5 text-[#5A5955]" />
            <label htmlFor="gimbal-slider">Gimbal Inclination:</label>
            <input
              id="gimbal-slider"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={orbitTilt}
              onChange={(e) => setOrbitTilt(parseFloat(e.target.value))}
              className="w-24 h-2 bg-[#D8CEAC] rounded-lg appearance-none cursor-pointer accent-[#191919]"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setRotSpeed((s) => (s === 0 ? 0.5 : s === 0.5 ? 1.2 : 0))}
              className="duo-btn text-[11px] font-ui font-bold px-2.5 py-1 rounded-lg bg-white text-[#191919]"
            >
              Orbit: {rotSpeed === 0 ? "Paused" : rotSpeed === 0.5 ? "1x" : "2x"}
            </button>
            <button
              onClick={() => {
                setOrbitTilt(0.35);
                setRotSpeed(0.5);
              }}
              className="duo-btn p-1.5 rounded-lg bg-white text-[#191919]"
              title="Reset Orrery"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
