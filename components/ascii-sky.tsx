"use client";

import { useEffect, useRef } from "react";

// Glyphs ordered from light to dense.
const RAMP = " .:;-=+()*xoO08X%#@";
// Speed-line glyphs for the cursor swoosh: - ~ = (horizontal), | / \.
const TRAIL = "-~=|/\\";
const GLYPHS = RAMP + TRAIL;
const CELL_W = 6.5;
const CELL_H = 9;
const FONT_SIZE = 9;
const FPS = 24;
const WIND = 0.06; // cloud drift, in noise units per second (~14px/s)
const TRAIL_LIFE = 0.7; // seconds for the swoosh to fade to ~37%

type RGB = [number, number, number];

const SKY: [number, RGB][] = [
  [0.0, [118, 98, 206]],
  [0.14, [150, 110, 214]],
  [0.3, [212, 104, 178]],
  [0.42, [230, 92, 128]],
  [0.53, [238, 116, 98]],
  [0.66, [245, 160, 124]],
  [0.82, [251, 214, 196]],
  [1.0, [252, 236, 228]],
];
const CLOUD: RGB = [255, 238, 228];
const EDGE: RGB = [150, 96, 170];
const WHITE: RGB = [255, 255, 255];
const NIGHT: RGB = [12, 12, 13];
const INK: RGB = [58, 36, 118];

const mix = (a: RGB, b: RGB, t: number): RGB => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

function sky(t: number): RGB {
  t = Math.min(1, Math.max(0, t));
  for (let i = 1; i < SKY.length; i++) {
    const [p1, c1] = SKY[i];
    if (t <= p1) {
      const [p0, c0] = SKY[i - 1];
      return mix(c0, c1, (t - p0) / (p1 - p0));
    }
  }
  return SKY[SKY.length - 1][1];
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// Seeded 3D value noise.
const PERM = (() => {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  let s = 1337;
  for (let i = 255; i > 0; i--) {
    s = (s * 16807) % 2147483647;
    const j = s % (i + 1);
    [p[i], p[j]] = [p[j], p[i]];
  }
  return p;
})();

const h3 = (x: number, y: number, z: number) =>
  PERM[(PERM[(PERM[x & 255] + y) & 255] + z) & 255] / 255;

const fade = (t: number) => t * t * (3 - 2 * t);

function noise3(x: number, y: number, z: number) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = fade(x - xi), yf = fade(y - yi), zf = fade(z - zi);
  const l = (a: number, b: number, t: number) => a + (b - a) * t;
  const x0 = l(h3(xi, yi, zi), h3(xi + 1, yi, zi), xf);
  const x1 = l(h3(xi, yi + 1, zi), h3(xi + 1, yi + 1, zi), xf);
  const x2 = l(h3(xi, yi, zi + 1), h3(xi + 1, yi, zi + 1), xf);
  const x3 = l(h3(xi, yi + 1, zi + 1), h3(xi + 1, yi + 1, zi + 1), xf);
  return l(l(x0, x1, yf), l(x2, x3, yf), zf);
}

function fbm(x: number, y: number, z: number) {
  let v = 0, a = 0.5, f = 1;
  for (let i = 0; i < 4; i++) {
    v += a * noise3(x * f, y * f, z * f);
    f *= 2.03;
    a *= 0.5;
  }
  return v / 0.9375;
}

export function AsciiSky() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const atlas = document.createElement("canvas");
    const glyphs = document.createElement("canvas");
    const colors = document.createElement("canvas");
    const bgs = document.createElement("canvas");
    const gctx = glyphs.getContext("2d")!;
    const cctx = colors.getContext("2d")!;
    const bctx = bgs.getContext("2d")!;

    let cw = 0, ch = 0, cols = 0, rows = 0;
    let colorData: ImageData, bgData: ImageData;
    let grain = new Float32Array(0);
    let trail = new Float32Array(0);
    let trailGlyph = new Uint8Array(0);
    let dark = document.documentElement.classList.contains("dark");
    let raf = 0, last = 0, prevDraw = 0, visible = true;
    let pointer: { x: number; y: number } | null = null;
    const start = performance.now();

    // Stamp speed-line glyphs along the pointer's path, angled to its direction.
    function stamp(x0: number, y0: number, x1: number, y1: number) {
      const dx = x1 - x0, dy = y1 - y0;
      const len = Math.hypot(dx, dy);
      if (len < 2) return;

      let a = Math.atan2(dy, dx);
      if (a < 0) a += Math.PI;
      const sector = Math.floor(((a + Math.PI / 8) % Math.PI) / (Math.PI / 4));
      const strength = Math.min(1, Math.max(0.45, len / 28));
      const radius = len > 40 ? 2 : 1;
      const nx = -dy / len, ny = dx / len;
      const steps = Math.ceil(len / (CELL_W * 0.5));

      for (let s = 0; s <= steps; s++) {
        const f = s / steps;
        const px = x0 + dx * f, py = y0 + dy * f;
        for (let k = -radius; k <= radius; k++) {
          const c = Math.round((px + nx * k * CELL_H) / CELL_W);
          const r = Math.round((py + ny * k * CELL_H) / CELL_H);
          if (c < 0 || r < 0 || c >= cols || r >= rows) continue;
          const i = r * cols + c;
          const v = strength * (0.55 + 0.45 * f) * (1 - Math.abs(k) / (radius + 1));
          if (v <= trail[i]) continue;
          trail[i] = v;
          const g = grain[i];
          trailGlyph[i] =
            sector === 0 ? (g < 0.7 ? 0 : g < 0.85 ? 1 : 2)
            : sector === 1 ? 5
            : sector === 2 ? 3
            : 4;
        }
      }
    }

    function onPointerMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const inside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height * 0.75;
      if (inside && pointer) stamp(pointer.x, pointer.y, x, y);
      pointer = inside ? { x, y } : null;
    }

    function setup() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = canvas!.getBoundingClientRect();
      cw = Math.max(1, Math.round(CELL_W * dpr));
      ch = Math.max(1, Math.round(CELL_H * dpr));
      cols = Math.ceil((width * dpr) / cw);
      rows = Math.ceil((height * dpr) / ch);
      canvas!.width = glyphs.width = Math.round(width * dpr);
      canvas!.height = glyphs.height = Math.round(height * dpr);
      colors.width = bgs.width = cols;
      colors.height = bgs.height = rows;
      colorData = cctx.createImageData(cols, rows);
      bgData = bctx.createImageData(cols, rows);

      grain = new Float32Array(cols * rows);
      for (let i = 0; i < grain.length; i++) grain[i] = Math.random();
      trail = new Float32Array(cols * rows);
      trailGlyph = new Uint8Array(cols * rows);

      atlas.width = cw * GLYPHS.length;
      atlas.height = ch;
      const actx = atlas.getContext("2d")!;
      actx.clearRect(0, 0, atlas.width, atlas.height);
      actx.fillStyle = "#fff";
      actx.font = `600 ${FONT_SIZE * dpr}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
      actx.textAlign = "center";
      actx.textBaseline = "middle";
      for (let i = 0; i < GLYPHS.length; i++) {
        actx.fillText(GLYPHS[i], i * cw + cw / 2, ch / 2 + dpr * 0.5);
      }
    }

    function draw(now: number) {
      const time = (now - start) / 1000;
      const dt = prevDraw ? Math.min(0.1, (now - prevDraw) / 1000) : 0;
      prevDraw = now;
      const decay = Math.exp(-dt / TRAIL_LIFE);
      const cd = colorData.data, bd = bgData.data;
      gctx.globalCompositeOperation = "source-over";
      gctx.clearRect(0, 0, glyphs.width, glyphs.height);

      for (let r = 0; r < rows; r++) {
        const t = r / Math.max(1, rows - 1);
        const py = r * CELL_H;
        const band = smooth(0.04, 0.22, t) * (1 - smooth(0.6, 0.85, t));
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          const px = c * CELL_W;
          const g = grain[i];

          const n = fbm(px * 0.0042 - time * WIND, py * 0.012, time * 0.012);
          const cloud = smooth(0.5, 0.7, n) * band;
          const edge = cloud * (1 - cloud) * 4;
          const fine = noise3(px * 0.03 - time * WIND * 7, py * 0.06, 7.3);
          const tr = (trail[i] *= decay);

          const base = 0.66 + 0.3 * fine - 0.5 * smooth(0.55, 0.95, t);
          let density = dark
            ? base * 0.8 * (1 - cloud) + cloud * 0.55 + edge * 0.25
            : base * (1 - cloud) + cloud * 0.12 + edge * 0.3;
          density += (g - 0.5) * 0.22;
          density = Math.min(1, Math.max(0, density));
          const swoosh = tr > 0.12;
          const gi = swoosh
            ? RAMP.length + trailGlyph[i]
            : Math.round(density * (RAMP.length - 1));

          let col = sky(t + (fine - 0.5) * 0.05);
          col = mix(col, EDGE, edge * 0.25);
          col = mix(col, CLOUD, cloud * 0.8);
          if (swoosh) {
            const line = dark ? mix(sky(t), WHITE, 0.7) : mix(sky(t), INK, 0.55);
            col = mix(col, line, Math.min(1, tr * 1.6));
          }
          let back = dark
            ? mix(mix(sky(t), NIGHT, 0.88), CLOUD, cloud * 0.08)
            : mix(mix(sky(t), WHITE, 0.74), CLOUD, cloud * 0.75);
          if (tr > 0.01) back = mix(back, dark ? mix(sky(t), NIGHT, 0.7) : WHITE, tr * 0.45);

          const o = i * 4;
          cd[o] = col[0]; cd[o + 1] = col[1]; cd[o + 2] = col[2]; cd[o + 3] = 255;
          bd[o] = back[0]; bd[o + 1] = back[1]; bd[o + 2] = back[2]; bd[o + 3] = 255;

          if (gi > 0) gctx.drawImage(atlas, gi * cw, 0, cw, ch, c * cw, r * ch, cw, ch);
        }
      }

      cctx.putImageData(colorData, 0, 0);
      bctx.putImageData(bgData, 0, 0);

      // Tint the white glyphs with their per-cell colors.
      gctx.globalCompositeOperation = "source-in";
      gctx.imageSmoothingEnabled = false;
      gctx.drawImage(colors, 0, 0, cols * cw, rows * ch);

      ctx!.imageSmoothingEnabled = true;
      ctx!.drawImage(bgs, 0, 0, cols * cw, rows * ch);
      ctx!.drawImage(glyphs, 0, 0);
    }

    function loop(now: number) {
      raf = requestAnimationFrame(loop);
      if (!visible || now - last < 1000 / FPS) return;
      last = now;
      draw(now);
    }

    setup();
    draw(performance.now());
    raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const ro = new ResizeObserver(() => {
      setup();
      draw(performance.now());
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    const mo = new MutationObserver(() => {
      dark = document.documentElement.classList.contains("dark");
      draw(performance.now());
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[380px] select-none sm:h-[560px]"
      style={{
        maskImage:
          "linear-gradient(to bottom, #000 0%, #000 52%, rgba(0,0,0,.16) 82%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, #000 0%, #000 52%, rgba(0,0,0,.16) 82%, transparent 100%)",
      }}
    >
      <canvas ref={ref} className="h-full w-full" />
    </div>
  );
}
