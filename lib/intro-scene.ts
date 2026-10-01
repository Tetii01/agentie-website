import {
  AdditiveBlending,
  CanvasTexture,
  Color,
  DirectionalLight,
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  NeutralToneMapping,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  PointLight,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  WebGLRenderer,
} from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import { toCreasedNormals } from "three/addons/utils/BufferGeometryUtils.js";
import { logoDot, logoShapes, symbolViewBox } from "@/components/brand/logo-shapes";
import { easeInOut, introTimeline as timeline, lerp, range } from "@/lib/intro-timeline";

/**
 * Scena 3D din intro (components/sections/Intro.tsx): submark-ul Creos.
 * Orbita (C-ul) e un inel cromat, punctul e o sferă luminoasă în culoarea de accent.
 * Totul depinde de progresul scroll-ului (0–1), după momentele din lib/intro-timeline.ts:
 * C-ul se rotește spre față, punctul face o spirală în jurul lui și intră în deschidere;
 * apoi în mijlocul C-ului se deschide un „portal" prin care se vede site-ul, iar camera zboară prin el.
 * Doar în browser, încărcat la nevoie (import dinamic).
 */

export type IntroColors = { foreground: string; accent: string; background: string };

export type IntroScene = {
  render: (progress: number, time: number) => void;
  resize: () => void;
  dispose: () => void;
};

/** Unitățile SVG ale logo-ului → unitățile scenei. */
const UNIT = 0.01;
/** Centrul inelului, în unitățile SVG (simbolul are înălțimea = diametrul inelului). */
const RING_CENTER = symbolViewBox.height / 2;
const DEPTH = 55;
/** Raza interioară a inelului (143 în SVG), plus puțin, ca marginea portalului să stea ascunsă după inel. */
const PORTAL_RADIUS = 1.46;
/** Unde stă punctul în logo: în deschiderea C-ului, la dreapta centrului. */
const DOT_HOME = (logoDot.cx - RING_CENTER) * UNIT;
const DOT_RADIUS = logoDot.r * UNIT;
/** Orbita largă, în afara inelului, pe care punctul se învârte înainte să intre în deschidere. */
const ORBIT_RADIUS = 2.9;
/** 1,375 ture: punctul pornește sus-stânga, în fața inelului (vizibil de la început). */
const ORBIT_TURNS = 1.375;
/** Cât din ecran (jumătate de înălțime/lățime, în unitățile scenei) ocupă logo-ul la început și la final. */
const FRAME_START = 3.9;
const FRAME_LOCK = 3.4;
/** Unde ajunge camera: în fața inelului, cu portalul acoperind tot ecranul. */
const CAMERA_END = 0.6;
const FOV = 35;

/** Inelul: forma orbitei din SVG, extrudată, cu margini rotunjite. */
function createRingGeometry() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg"><path d="${logoShapes[0]}"/></svg>`;
  const shapes = new SVGLoader().parse(svg).paths.flatMap((path) => SVGLoader.createShapes(path));
  const geometry = new ExtrudeGeometry(shapes, {
    depth: DEPTH,
    curveSegments: 48,
    bevelEnabled: true,
    bevelThickness: 7,
    bevelSize: 5,
    bevelSegments: 8,
  });
  geometry.translate(-RING_CENTER, -RING_CENTER, -DEPTH / 2);
  // Normale netede pe curbe și pe margini, dar muchii drepte la capetele C-ului.
  return toCreasedNormals(geometry, Math.PI / 5);
}

/** Halo-ul moale din jurul punctului (un gradient radial pe un sprite). */
function createGlowTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const context = canvas.getContext("2d")!;
  const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255,255,255,0.9)");
  gradient.addColorStop(0.25, "rgba(255,255,255,0.35)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);
  return new CanvasTexture(canvas);
}

/**
 * Portalul: un plan uriaș în culoarea fundalului, în planul inelului, cu o gaură rotundă în centru.
 * Prin gaură (canvas transparent) se vede site-ul de dedesubt. Marginea e netezită (fwidth).
 */
function createPortalMaterial(color: Color) {
  return new ShaderMaterial({
    uniforms: { color: { value: color }, hole: { value: 0 } },
    vertexShader: /* glsl */ `
      varying vec2 vPosition;
      void main() {
        vPosition = position.xy;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 color;
      uniform float hole;
      varying vec2 vPosition;
      void main() {
        float distance = length(vPosition);
        float edge = fwidth(distance);
        float alpha = smoothstep(hole - edge, hole + edge, distance);
        if (alpha <= 0.0) discard;
        gl_FragColor = vec4(color, alpha);
        #include <colorspace_fragment>
      }
    `,
    transparent: true,
    depthWrite: false,
  });
}

export function createIntroScene(canvas: HTMLCanvasElement, colors: IntroColors): IntroScene | null {
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch {
    return null;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NeutralToneMapping;
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = environment;
  scene.environmentIntensity = 0.9;

  const camera = new PerspectiveCamera(FOV, 1, 0.05, 100);

  const foreground = new Color().setStyle(colors.foreground);
  const accent = new Color().setStyle(colors.accent);
  const background = new Color().setStyle(colors.background);

  // Lumină albă de sus-stânga (ca restul site-ului) și o lumină de contur în accent din dreapta-spate.
  const key = new DirectionalLight(foreground, 1.4);
  key.position.set(-4, 5, 6);
  const rim = new DirectionalLight(accent, 2.2);
  rim.position.set(5, -2, -4);
  scene.add(key, rim);

  const logo = new Group();
  scene.add(logo);

  const ringGeometry = createRingGeometry();
  const ringMaterial = new MeshPhysicalMaterial({
    color: foreground,
    metalness: 1,
    roughness: 0.22,
    clearcoat: 0.4,
    clearcoatRoughness: 0.2,
  });
  const ring = new Mesh(ringGeometry, ringMaterial);
  // Y negativ: SVG-ul are axa Y în jos.
  ring.scale.set(UNIT, -UNIT, UNIT);
  logo.add(ring);

  const dot = new Group();
  const sphereGeometry = new SphereGeometry(DOT_RADIUS, 64, 32);
  const sphereMaterial = new MeshStandardMaterial({
    color: accent,
    emissive: accent,
    emissiveIntensity: 0.9,
    roughness: 0.35,
    metalness: 0,
  });
  dot.add(new Mesh(sphereGeometry, sphereMaterial));
  const glowTexture = createGlowTexture();
  const glowMaterial = new SpriteMaterial({
    map: glowTexture,
    color: accent,
    blending: AdditiveBlending,
    depthWrite: false,
    transparent: true,
    opacity: 0.55,
  });
  const glow = new Sprite(glowMaterial);
  glow.scale.setScalar(DOT_RADIUS * 6);
  // Peste portal, nu sub el (amândouă sunt transparente, la aceeași adâncime).
  glow.renderOrder = 2;
  dot.add(glow);
  // Punctul luminează metalul când trece pe lângă el.
  const dotLight = new PointLight(accent, 6, 0, 2);
  dot.add(dotLight);
  logo.add(dot);

  const portalGeometry = new PlaneGeometry(400, 400);
  const portalMaterial = createPortalMaterial(background);
  const portal = new Mesh(portalGeometry, portalMaterial);
  portal.renderOrder = 1;
  portal.visible = false;
  scene.add(portal);

  /** Distanța camerei la care un obiect cu jumătatea de mărime `half` încape pe ecran (pe înălțime și pe lățime). */
  const fit = (half: number) => {
    const tan = Math.tan((FOV * Math.PI) / 360);
    return half / tan / Math.min(1, camera.aspect);
  };

  const resize = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  resize();

  const render = (progress: number, time: number) => {
    const assembly = easeInOut(range(progress, timeline.assemble));
    const settle = 1 - assembly;

    // C-ul: din trei-sferturi spre față, cu o mișcare lentă cât timp nu s-a așezat.
    logo.rotation.set(
      lerp(0.42, 0, assembly) + Math.sin(time * 0.45) * 0.05 * settle,
      lerp(-0.8, 0, assembly) + Math.sin(time * 0.6) * 0.08 * settle,
      lerp(0.12, 0, assembly),
    );

    // Punctul: o spirală pe o orbită înclinată în jurul inelului, care se strânge și se termină
    // drept în deschiderea C-ului. Raza scade abia după ce punctul a ajuns în dreptul deschiderii,
    // ca să nu treacă prin inel.
    const orbit = easeInOut(range(progress, timeline.orbit));
    const angle = (1 - orbit) * ORBIT_TURNS * Math.PI * 2 + Math.sin(time * 0.5) * 0.2 * settle;
    const tilt = lerp(1.05, 0.2, orbit);
    const radius = lerp(ORBIT_RADIUS, DOT_HOME, easeInOut(range(progress, timeline.dock)));
    dot.position.set(
      radius * Math.cos(angle),
      radius * Math.sin(angle) * Math.cos(tilt),
      radius * Math.sin(angle) * Math.sin(tilt),
    );

    // Portalul apare când logo-ul e complet (și drept), apoi gaura din mijloc se deschide.
    portal.visible = progress >= timeline.portal;
    portalMaterial.uniforms.hole.value = PORTAL_RADIUS * easeInOut(range(progress, timeline.iris));

    // Camera: se apropie puțin cât se formează logo-ul, apoi zboară prin portal.
    const zoom = easeInOut(range(progress, timeline.zoom));
    const distance = lerp(fit(FRAME_START), fit(FRAME_LOCK), assembly);
    camera.position.set(0, 0, lerp(distance, CAMERA_END, zoom));
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  };

  const dispose = () => {
    ringGeometry.dispose();
    ringMaterial.dispose();
    sphereGeometry.dispose();
    sphereMaterial.dispose();
    glowTexture.dispose();
    glowMaterial.dispose();
    portalGeometry.dispose();
    portalMaterial.dispose();
    environment.dispose();
    pmrem.dispose();
    renderer.dispose();
  };

  return { render, resize, dispose };
}
