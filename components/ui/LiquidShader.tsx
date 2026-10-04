"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Fundalul din hero: o „membrană" de lichid luminos care se deformează încet, desenată de un shader
 * (după „liquid shader", 21st.dev, dhileepkumargm). Doar shader-ul e preluat; restul e scris ușor,
 * pentru telefon: WebGL direct (fără three.js), rezoluție redusă (efectul e moale oricum), 30 de cadre
 * pe secundă și oprit complet când hero-ul e acoperit de restul paginii sau tab-ul nu e vizibil.
 * La prefers-reduced-motion se desenează un singur cadru, nemișcat. Fără WebGL rămâne lumina din CSS
 * de sub canvas (utilitatea liquid-fallback din app/globals.css).
 */

const VERTEX = /* glsl */ `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  precision mediump float;
  uniform float uTime;
  uniform vec2 uCenter; // centrul lichidului, în pixeli
  uniform float uScale; // mărimea lui, în pixeli
  uniform vec3 uDeep;   // culoarea „corpului"
  uniform vec3 uGlow;   // cât de tare se aprind marginile, pe fiecare canal
  uniform float uIntensity;

  mat2 rotate(float a) {
    float c = cos(a), s = sin(a);
    return mat2(c, -s, s, c);
  }

  float map(vec3 p) {
    p.xz *= rotate(uTime * 0.4);
    p.xy *= rotate(uTime * 0.3);
    vec3 q = p * 2.0 + uTime;
    return length(p + vec3(sin(uTime * 0.7))) * log(length(p) + 1.0)
      + sin(q.x + sin(q.z + sin(q.y))) * 0.5 - 1.0;
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - uCenter) / uScale;
    vec3 color = vec3(0.0);
    float d = 2.5;

    for (int i = 0; i <= 5; i++) {
      vec3 p = vec3(0.0, 0.0, 5.0) + normalize(vec3(uv, -1.0)) * d;
      float rz = map(p);
      float f = clamp((rz - map(p + 0.1)) * 0.5, -0.1, 1.0);
      vec3 base = uDeep + uGlow * f;
      color = color * base + smoothstep(2.5, 0.0, rz) * 0.7 * base;
      d += min(rz, 1.0);
    }

    // Mijlocul lichidului mai stins: rămâne o membrană luminoasă pe margini.
    float distance = length(gl_FragCoord.xy - uCenter);
    float radius = uScale * 0.5;
    color = mix(color * 0.3, color, smoothstep(radius * 0.3, radius * 0.5, distance));

    color = clamp(color * uIntensity, 0.0, 1.0);
    // Transparent unde e întuneric, ca să se vadă fundalul cardului de dedesubt.
    gl_FragColor = vec4(color, max(color.r, max(color.g, color.b)));
  }
`;

/**
 * Paleta lichidului pornește din culoarea de accent (--color-accent), deci urmează brandul:
 * corpul e accentul foarte închis, iar marginile se aprind în accent, puțin spre alb.
 */
const DEEP_SHADE = 0.34;
const GLOW_STRENGTH = 5;
const GLOW_WHITE = 0.15;
/** Dacă accentul nu se poate citi: un roșu ca al brandului. */
const FALLBACK_ACCENT = [1, 0.23, 0.31];

/** „#ff3b4e" → [1, 0.23, 0.31]. */
function parseHex(value: string) {
  const match = value.trim().match(/^#([0-9a-f]{6})$/i);
  if (!match) return null;
  const n = parseInt(match[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((channel) => channel / 255);
}
/** Cât de luminos e lichidul (sub 1: mai stins, ca titlul să rămână în prim-plan). */
const INTENSITY = 0.82;
/** Rezoluția față de pixelii ecranului (efectul e moale, deci nu se vede diferența). */
const RENDER_SCALE = 0.5;
const FRAME_INTERVAL = 1000 / 30;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

export function LiquidShader({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false });
    if (!gl) return;

    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    // Un triunghi care acoperă tot ecranul.
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "uTime");
    const uCenter = gl.getUniformLocation(program, "uCenter");
    const uScale = gl.getUniformLocation(program, "uScale");
    const accent =
      parseHex(getComputedStyle(document.documentElement).getPropertyValue("--color-accent")) ?? FALLBACK_ACCENT;
    gl.uniform3fv(
      gl.getUniformLocation(program, "uDeep"),
      accent.map((channel) => channel * DEEP_SHADE),
    );
    gl.uniform3fv(
      gl.getUniformLocation(program, "uGlow"),
      accent.map((channel) => (channel * (1 - GLOW_WHITE) + GLOW_WHITE) * GLOW_STRENGTH),
    );
    gl.uniform1f(gl.getUniformLocation(program, "uIntensity"), INTENSITY);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Lichidul stă sus-dreapta pe ecranele late (puțin tăiat de margine) și sus pe cele înalte (telefon),
    // departe de titlul din stânga-jos.
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio, 2) * RENDER_SCALE;
      const width = Math.max(1, Math.round(canvas.clientWidth * ratio));
      const height = Math.max(1, Math.round(canvas.clientHeight * ratio));
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      const landscape = width >= height;
      gl.uniform2f(uCenter, landscape ? width * 0.8 : width * 0.62, landscape ? height * 0.68 : height * 0.84);
      gl.uniform1f(uScale, landscape ? Math.min(width * 0.42, height * 0.9) : width * 0.72);
    };

    let frame = 0;
    let last = 0;
    let covered = false;
    let shown = false;
    const start = performance.now();

    const draw = (now: number) => {
      gl.uniform1f(uTime, reducedMotion ? 4 : (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!shown) {
        shown = true;
        canvas.style.opacity = "1";
        // Lumina din CSS de dedesubt (pentru fără WebGL) se stinge cât apare lichidul.
        canvas.parentElement?.setAttribute("data-ready", "");
      }
    };

    const loop = (now: number) => {
      frame = 0;
      if (covered) return;
      if (now - last >= FRAME_INTERVAL) {
        last = now;
        draw(now);
      }
      frame = requestAnimationFrame(loop);
    };

    const play = () => {
      if (reducedMotion) {
        draw(performance.now());
        return;
      }
      if (!frame && !covered) frame = requestAnimationFrame(loop);
    };

    // Oprit cât timp restul paginii acoperă hero-ul (marcajul de la începutul „cortinei" a trecut de header).
    const marker = document.querySelector<HTMLElement>("[data-floating-cta-trigger]");
    let threshold = Infinity;
    const measure = () => {
      if (!marker) return;
      const header = document.querySelector<HTMLElement>("[data-site-header]")?.offsetHeight ?? 0;
      threshold = marker.getBoundingClientRect().top + window.scrollY - header;
    };
    const onScroll = () => {
      const next = window.scrollY > threshold;
      if (next === covered) return;
      covered = next;
      if (!covered) play();
    };
    const onResize = () => {
      resize();
      measure();
      onScroll();
      if (reducedMotion) draw(performance.now());
    };

    resize();
    measure();
    onScroll();
    play();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, []);

  return (
    <div aria-hidden className={cn("liquid-fallback pointer-events-none", className)}>
      <canvas
        ref={canvasRef}
        className="block size-full opacity-0 transition-opacity duration-fade ease-fade motion-reduce:transition-none"
      />
    </div>
  );
}
