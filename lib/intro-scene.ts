import {
  AdditiveBlending,
  Color,
  DirectionalLight,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
} from "three";
import { logoDot, logoShapes, symbolViewBox } from "@/components/brand/logo-shapes";
import { createEnvironment, createGlowTexture, createRenderer, extrudeLogoPath, UNIT } from "@/lib/intro-three";
import {
  easeInOut,
  type IntroColors,
  type IntroScene,
  lerp,
  portalTimeline as timeline,
  range,
} from "@/lib/intro-timeline";

/**
 * Varianta `portal` a intro-ului 3D (components/sections/Intro.tsx): submark-ul Creos.
 * Orbita (C-ul) e un inel cromat, punctul e o sferă luminoasă în culoarea de accent.
 * Totul depinde de progresul scroll-ului (0–1), după momentele din lib/intro-timeline.ts (portalTimeline):
 * C-ul se rotește spre față, punctul face un arc peste el și intră în deschidere;
 * apoi în mijlocul C-ului se deschide un „portal" prin care se vede site-ul, iar camera zboară prin el.
 * Doar în browser, încărcat la nevoie (import dinamic).
 */

/** Centrul inelului, în unitățile SVG (simbolul are înălțimea = diametrul inelului). */
const RING_CENTER = symbolViewBox.height / 2;
/** Raza interioară a inelului (143 în SVG), plus puțin, ca marginea portalului să stea ascunsă după inel. */
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
  const renderer = createRenderer(canvas);
  if (!renderer) return null;

  const scene = new Scene();
  const environment = createEnvironment(renderer);
  scene.environment = environment.texture;
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

  const ringGeometry = extrudeLogoPath(logoShapes[0]);
  ringGeometry.translate(-RING_CENTER, -RING_CENTER, 0);
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
    renderer.dispose();
  };

  return { render, resize, dispose };
}
