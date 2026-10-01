import {
  Color,
  DirectionalLight,
  ExtrudeGeometry,
  Group,
  HemisphereLight,
  Mesh,
  MeshLambertMaterial,
  MeshPhongMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  SRGBColorSpace,
  WebGLRenderer,
} from "three";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import { toCreasedNormals } from "three/addons/utils/BufferGeometryUtils.js";
import { logoDot, logoShapes, symbolViewBox } from "@/components/brand/logo-shapes";
import { easeInOut, type IntroColors, type IntroScene, introTimeline as timeline, lerp, range } from "@/lib/intro-timeline";

/**
 * Scena 3D din intro (components/sections/Intro.tsx): submark-ul Creos.
 * Orbita (C-ul) e un inel alb cu umbrire moale, punctul e o sferă în culoarea de accent, ca în logo.
 * Totul depinde de progresul scroll-ului (0–1), după momentele din lib/intro-timeline.ts:
 * C-ul se rotește spre față, punctul face un arc peste el și intră în deschidere;
 * apoi în mijlocul C-ului se deschide un „portal" prin care se vede site-ul, iar camera zboară prin el.
 * Doar în browser, încărcat la nevoie (import dinamic).
 *
 * Simplă intenționat, ca să meargă fluid pe telefon: fără texturi, fără reflexii și fără lumini care se mișcă,
 * doar două lumini fixe. Pregătirea e împărțită pe mai multe cadre, shaderele se compilează înainte de prima
 * afișare, un cadru se desenează doar când s-a schimbat ceva, iar dacă telefonul nu ține ritmul, rezoluția scade.
 */

/** Unitățile SVG ale logo-ului → unitățile scenei. */
const UNIT = 0.01;
/** Grosimea orbitei și a marginilor rotunjite, în unitățile SVG. */
const DEPTH = 55;
const BEVEL = 7;
/** Centrul inelului, în unitățile SVG (simbolul are înălțimea = diametrul inelului). */
const RING_CENTER = symbolViewBox.height / 2;
/**
 * Portalul stă puțin în spatele inelului (nu prin el), ca să nu taie din spatele C-ului.
 * Raza găurii: raza interioară a inelului (143 în SVG), plus puțin, ca marginea să stea ascunsă după inel.
 */
const PORTAL_Z = -((DEPTH / 2 + BEVEL) * UNIT + 0.02);
const PORTAL_RADIUS = 1.46;
/** Unde stă punctul în logo: în deschiderea C-ului, la dreapta centrului. */
const DOT_HOME = (logoDot.cx - RING_CENTER) * UNIT;
const DOT_RADIUS = logoDot.r * UNIT;
/** Orbita largă, în afara inelului, pe care punctul vine spre deschidere. */
const ORBIT_RADIUS = 2.9;
/** Un arc de ~145°: punctul pornește sus-stânga, în fața inelului, și trece peste el. */
const ORBIT_TURNS = 0.4;
/** Cât din ecran (jumătate de înălțime/lățime, în unitățile scenei) ocupă logo-ul la început și la final. */
const FRAME_START = 3.9;
const FRAME_LOCK = 3.4;
/** Unde ajunge camera: în fața inelului, cu portalul acoperind tot ecranul. */
const CAMERA_END = 0.6;
const FOV = 35;

/** Lasă browserul să deseneze un cadru (pregătirea scenei nu blochează pagina dintr-o bucată). */
const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

/** Inelul: forma orbitei din SVG, extrudată, cu margini rotunjite, centrată pe centrul inelului. */
function createRingGeometry() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg"><path d="${logoShapes[0]}"/></svg>`;
  const shapes = new SVGLoader().parse(svg).paths.flatMap((path) => SVGLoader.createShapes(path));
  const geometry = new ExtrudeGeometry(shapes, {
    depth: DEPTH,
    curveSegments: 32,
    bevelEnabled: true,
    bevelThickness: BEVEL,
    bevelSize: 5,
    bevelSegments: 4,
  });
  geometry.translate(-RING_CENTER, -RING_CENTER, -DEPTH / 2);
  // Normale netede pe curbe și pe margini, dar muchii drepte la capetele C-ului.
  return toCreasedNormals(geometry, Math.PI / 5);
}

/**
 * Portalul: un plan uriaș în culoarea fundalului, în spatele inelului, cu o gaură rotundă în centru.
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

export async function createIntroScene(canvas: HTMLCanvasElement, colors: IntroColors): Promise<IntroScene | null> {
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch {
    return null;
  }

  // Pe telefon, rezoluție puțin mai mică: ecranul e dens, diferența nu se vede, dar se simte în fluiditate.
  const phone = window.matchMedia("(pointer: coarse)").matches;
  let pixelRatio = Math.min(window.devicePixelRatio, phone ? 1.5 : 1.75);
  renderer.setPixelRatio(pixelRatio);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 0.05, 100);

  const foreground = new Color().setStyle(colors.foreground);
  const accent = new Color().setStyle(colors.accent);
  const background = new Color().setStyle(colors.background);

  // Lumină de sus (albă) și de jos (o nuanță închisă de accent), plus o lumină fixă din stânga-sus-față.
  scene.add(new HemisphereLight(foreground, accent.clone().multiplyScalar(0.18), 1.6));
  const key = new DirectionalLight(foreground, 1.5);
  key.position.set(-4, 5, 6);
  scene.add(key);

  await nextFrame();
  const logo = new Group();
  scene.add(logo);

  const ringGeometry = createRingGeometry();
  const ringMaterial = new MeshPhongMaterial({
    color: foreground.clone().multiplyScalar(0.82),
    specular: foreground.clone().multiplyScalar(0.25),
    shininess: 40,
  });
  const ring = new Mesh(ringGeometry, ringMaterial);
  // Y negativ: SVG-ul are axa Y în jos.
  ring.scale.set(UNIT, -UNIT, UNIT);
  logo.add(ring);

  const sphereGeometry = new SphereGeometry(DOT_RADIUS, 40, 20);
  const sphereMaterial = new MeshLambertMaterial({ color: accent, emissive: accent, emissiveIntensity: 0.55 });
  const dot = new Mesh(sphereGeometry, sphereMaterial);
  logo.add(dot);

  const portalGeometry = new PlaneGeometry(400, 400);
  const portalMaterial = createPortalMaterial(background);
  const portal = new Mesh(portalGeometry, portalMaterial);
  portal.position.z = PORTAL_Z;
  scene.add(portal);

  /** Distanța camerei la care un obiect cu jumătatea de mărime `half` încape pe ecran (pe înălțime și pe lățime). */
  const fit = (half: number) => {
    const tan = Math.tan((FOV * Math.PI) / 360);
    return half / tan / Math.min(1, camera.aspect);
  };

  let width = 0;
  let height = 0;
  const resize = () => {
    const nextWidth = canvas.clientWidth;
    const nextHeight = canvas.clientHeight;
    // Redimensionarea refăcută doar când chiar s-a schimbat mărimea (e scumpă).
    if (!nextWidth || !nextHeight || (nextWidth === width && nextHeight === height)) return false;
    width = nextWidth;
    height = nextHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    return true;
  };
  resize();

  // Shaderele se compilează acum, nu la primul cadru afișat (altfel prima mișcare sacadează).
  await renderer.compileAsync(scene, camera);
  portal.visible = false;

  // Dacă telefonul nu ține ritmul, rezoluția scade (o dată sau de două ori).
  let lastRender = 0;
  const intervals: number[] = [];
  const adapt = (time: number) => {
    const interval = time - lastRender;
    lastRender = time;
    if (interval > 0.1 || pixelRatio <= 1) return; // pauze, nu sacadări
    intervals.push(interval);
    if (intervals.length < 45) return;
    const sorted = [...intervals].sort((a, b) => a - b);
    intervals.length = 0;
    if (sorted[Math.floor(sorted.length / 2)] > 0.021) {
      pixelRatio = Math.max(1, pixelRatio - 0.25);
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height, false);
    }
  };

  let lastProgress = -1;

  const render = (progress: number, time: number) => {
    const assembly = easeInOut(range(progress, timeline.assemble));
    const settle = 1 - assembly;
    // Logo-ul așezat și scroll-ul oprit: cadrul ar fi identic, nu-l mai desenăm.
    if (progress === lastProgress && settle === 0) return;
    lastProgress = progress;
    adapt(time);

    // C-ul: din trei-sferturi spre față, cu o mișcare lentă cât timp nu s-a așezat.
    logo.rotation.set(
      lerp(0.42, 0, assembly) + Math.sin(time * 0.45) * 0.05 * settle,
      lerp(-0.8, 0, assembly) + Math.sin(time * 0.6) * 0.08 * settle,
      lerp(0.12, 0, assembly),
    );

    // Punctul: un arc pe o orbită înclinată, în afara inelului, care se termină în dreptul deschiderii;
    // abia apoi raza scade și punctul intră drept în deschidere, ca să nu treacă prin inel.
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

  return {
    render,
    resize: () => {
      if (resize()) lastProgress = -1;
    },
    dispose: () => {
      ringGeometry.dispose();
      ringMaterial.dispose();
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      portalGeometry.dispose();
      portalMaterial.dispose();
      renderer.dispose();
    },
  };
}
