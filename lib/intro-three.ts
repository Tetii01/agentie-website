import {
  CanvasTexture,
  ExtrudeGeometry,
  NeutralToneMapping,
  PMREMGenerator,
  SRGBColorSpace,
  WebGLRenderer,
  type BufferGeometry,
} from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import { toCreasedNormals } from "three/addons/utils/BufferGeometryUtils.js";

/**
 * Piesele comune ale scenelor 3D din intro (lib/intro-scene.ts și lib/intro-scene-land.ts).
 * Doar în browser, încărcat la nevoie împreună cu scenele.
 */

/** Unitățile SVG ale logo-ului → unitățile scenei. */
export const UNIT = 0.01;
/** Grosimea literelor și a orbitei, în unitățile SVG. */
export const DEPTH = 55;

/** Renderer transparent (site-ul se vede prin canvas), cu culori corecte. `null` = fără WebGL. */
export function createRenderer(canvas: HTMLCanvasElement) {
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
  return renderer;
}

/** Reflexiile metalului: o „cameră" de studio neutră. */
export function createEnvironment(renderer: WebGLRenderer) {
  const pmrem = new PMREMGenerator(renderer);
  const texture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  return {
    texture,
    dispose: () => {
      texture.dispose();
      pmrem.dispose();
    },
  };
}

/** O formă din logo (atributul `d` din SVG), extrudată, cu margini rotunjite. În unitățile SVG, necentrată. */
export function extrudeLogoPath(d: string): BufferGeometry {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg"><path d="${d}"/></svg>`;
  const shapes = new SVGLoader().parse(svg).paths.flatMap((path) => SVGLoader.createShapes(path));
  const geometry = new ExtrudeGeometry(shapes, {
    depth: DEPTH,
    curveSegments: 48,
    bevelEnabled: true,
    bevelThickness: 7,
    bevelSize: 5,
    bevelSegments: 8,
  });
  geometry.translate(0, 0, -DEPTH / 2);
  // Normale netede pe curbe și pe margini, dar muchii drepte la colțuri.
  return toCreasedNormals(geometry, Math.PI / 5);
}

/** Halo-ul moale din jurul punctului (un gradient radial, pentru un sprite). */
export function createGlowTexture() {
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
