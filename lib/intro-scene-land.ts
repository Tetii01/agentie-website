import {
  AdditiveBlending,
  Color,
  DirectionalLight,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  Vector3,
  type BufferGeometry,
} from "three";
import { logoDot, logoShapes, logoViewBox } from "@/components/brand/logo-shapes";
import { createEnvironment, createGlowTexture, createRenderer, extrudeLogoPath, UNIT } from "@/lib/intro-three";
import {
  clamp01,
  easeInOut,
  type IntroColors,
  type IntroScene,
  type IntroSceneOptions,
  landTimeline as timeline,
  lerp,
  range,
} from "@/lib/intro-timeline";

/**
 * Varianta `land` a intro-ului 3D (?intro=2, components/sections/Intro.tsx): logo-ul Creos întreg.
 * Piesele lui (orbita, literele c-r-e-o-s, punctul) plutesc în spațiu, cromate, și se așază pe rând
 * pe măsură ce derulezi. Logo-ul complet zboară apoi în header, exact peste logo-ul de acolo, și devine
 * alb mat ca el; header-ul apare și logo-ul 3D dispare. Momentele: lib/intro-timeline.ts (landTimeline).
 * Doar în browser, încărcat la nevoie (import dinamic).
 */

const LOGO_WIDTH = logoViewBox.width * UNIT;
const LOGO_CENTER = { x: logoViewBox.width / 2, y: logoViewBox.height / 2 };
const DOT_RADIUS = logoDot.r * UNIT;
const FOV = 30;

/** De unde pornește fiecare piesă, față de locul ei din logo: decalaj (unități) și rotație (radiani). */
const SCATTER = [
  { offset: [-1.0, 1.2, -4], rotation: [0.7, -1.2, 0.3] }, // orbita
  { offset: [-0.4, -1.8, 2.5], rotation: [-0.9, 0.8, -0.4] }, // c
  { offset: [0.3, 2.0, -3], rotation: [1.1, -0.5, 0.6] }, // r
  { offset: [0.2, -1.6, 3.2], rotation: [-0.6, 1.3, -0.3] }, // e
  { offset: [0.6, 1.8, -2.2], rotation: [0.8, 1.0, 0.5] }, // o
  { offset: [1.2, -2.2, 1.8], rotation: [-1.2, -0.7, -0.5] }, // s
  { offset: [1.5, 3.5, 3.0], rotation: [0, 0, 0] }, // punctul, ultimul
] as const;

type Piece = { object: Mesh | Group; home: Vector3; index: number };

/** O formă din logo, centrată pe ea însăși (ca să se rotească în jurul propriului centru), plus locul ei în logo. */
function createShape(d: string) {
  const geometry: BufferGeometry = extrudeLogoPath(d);
  geometry.computeBoundingBox();
  const center = new Vector3();
  geometry.boundingBox!.getCenter(center);
  geometry.translate(-center.x, -center.y, 0);
  // Y negativ: SVG-ul are axa Y în jos.
  const home = new Vector3((center.x - LOGO_CENTER.x) * UNIT, -(center.y - LOGO_CENTER.y) * UNIT, 0);
  return { geometry, home };
}

export function createIntroScene(
  canvas: HTMLCanvasElement,
  colors: IntroColors,
  options: IntroSceneOptions = {},
): IntroScene | null {
  const renderer = createRenderer(canvas);
  if (!renderer) return null;

  const scene = new Scene();
  const environment = createEnvironment(renderer);
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.9;

  const camera = new PerspectiveCamera(FOV, 1, 0.1, 400);

  const foreground = new Color().setStyle(colors.foreground);
  const accent = new Color().setStyle(colors.accent);

  const key = new DirectionalLight(foreground, 1.4);
  key.position.set(-4, 5, 6);
  const rim = new DirectionalLight(accent, 2.2);
  rim.position.set(5, -2, -4);
  scene.add(key, rim);

  const logo = new Group();
  scene.add(logo);

  // Un singur material pentru orbită și litere: cromat la început, alb mat la aterizare.
  const metal = new MeshPhysicalMaterial({
    color: foreground,
    metalness: 1,
    roughness: 0.22,
    clearcoat: 0.4,
    clearcoatRoughness: 0.2,
    emissive: foreground,
    emissiveIntensity: 0,
  });

  const geometries: BufferGeometry[] = [];
  const pieces: Piece[] = logoShapes.map((d, index) => {
    const { geometry, home } = createShape(d);
    geometries.push(geometry);
    const mesh = new Mesh(geometry, metal);
    mesh.scale.set(UNIT, -UNIT, UNIT);
    logo.add(mesh);
    return { object: mesh, home, index };
  });

  const dot = new Group();
  const sphereGeometry = new SphereGeometry(DOT_RADIUS, 64, 32);
  geometries.push(sphereGeometry);
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
  dot.add(glow);
  const dotLight = new PointLight(accent, 6, 0, 2);
  dot.add(dotLight);
  logo.add(dot);
  pieces.push({
    object: dot,
    home: new Vector3((logoDot.cx - LOGO_CENTER.x) * UNIT, -(logoDot.cy - LOGO_CENTER.y) * UNIT, 0),
    index: pieces.length,
  });

  // Piesele pornesc una după alta și se termină toate la finalul lui `assemble`.
  const [assembleStart, assembleEnd] = timeline.assemble;
  const stagger = (assembleEnd - assembleStart - timeline.piece) / (pieces.length - 1);

  let distance = 60;
  let pixelsPerUnit = 10;
  let target: DOMRect | null = null;

  const resize = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    // Logo-ul ocupă ~55% din lățime pe desktop și ~80% pe telefon.
    const share = lerp(0.8, 0.55, clamp01((camera.aspect - 0.5) / 1));
    const tan = Math.tan((FOV * Math.PI) / 360);
    distance = LOGO_WIDTH / 2 / share / (tan * camera.aspect);
    pixelsPerUnit = height / (2 * distance * tan);
    camera.position.set(0, 0, distance);
    camera.lookAt(0, 0, 0);
    target = options.landingTarget?.() ?? null;
  };
  resize();

  const render = (progress: number, time: number) => {
    // Piesele: din locul lor din „explozie" (cu o plutire lentă) spre locul lor din logo.
    for (const piece of pieces) {
      const start = assembleStart + piece.index * stagger;
      const t = easeInOut(range(progress, [start, start + timeline.piece]));
      const free = 1 - t;
      const { offset, rotation } = SCATTER[piece.index];
      const float = Math.sin(time * 0.8 + piece.index * 1.3) * 0.15 * free;
      piece.object.position.set(
        piece.home.x + offset[0] * free,
        piece.home.y + offset[1] * free + float,
        piece.home.z + offset[2] * free,
      );
      piece.object.rotation.set(rotation[0] * free, rotation[1] * free, rotation[2] * free);
    }

    // Tot logo-ul: puțin rotit cât e „desfăcut", apoi drept.
    const assembled = easeInOut(range(progress, timeline.assemble));
    const baseRotation = { x: lerp(0.15, 0, assembled), y: lerp(-0.3, 0, assembled) };

    // Aterizarea în header: poziția și mărimea logo-ului din header, cu o mică ridicare și rotire pe drum.
    const land = easeInOut(range(progress, timeline.land));
    const lift = Math.sin(Math.PI * land);
    if (target) {
      const x = (target.left + target.width / 2 - canvas.clientWidth / 2) / pixelsPerUnit;
      const y = -(target.top + target.height / 2 - canvas.clientHeight / 2) / pixelsPerUnit;
      const scale = target.width / pixelsPerUnit / LOGO_WIDTH;
      logo.position.set(x * land, y * land, lift * distance * 0.08);
      // Mărimea scade „geometric", ca micșorarea să pară uniformă.
      logo.scale.setScalar(scale ** land);
    }
    logo.rotation.set(baseRotation.x - lift * 0.15, baseRotation.y + lift * 0.35, 0);

    // Spre final, metalul devine alb mat și punctul își pierde halo-ul, ca logo-ul din header.
    const flat = range(progress, timeline.flatten);
    metal.metalness = lerp(1, 0, flat);
    metal.roughness = lerp(0.22, 0.7, flat);
    metal.clearcoat = lerp(0.4, 0, flat);
    metal.emissiveIntensity = flat;
    sphereMaterial.emissiveIntensity = lerp(0.9, 1, flat);
    glowMaterial.opacity = 0.55 * (1 - flat);
    dotLight.intensity = 6 * (1 - flat);

    renderer.render(scene, camera);
  };

  const dispose = () => {
    geometries.forEach((geometry) => geometry.dispose());
    metal.dispose();
    sphereMaterial.dispose();
    glowTexture.dispose();
    glowMaterial.dispose();
    environment.dispose();
    renderer.dispose();
  };

  return { render, resize, dispose };
}
