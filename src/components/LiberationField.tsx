"use client";

import { useEffect, useRef } from "react";

// Liberation Engine palette — only pure #rrggbb hex constants passed to hexAlpha
const PALETTE = [
  "#ffd584", // bodhi.400
  "#f4c25a", // bodhi.500
  "#ef84b1", // lotus.500
  "#f6abc8", // lotus.400
  "#4fd6c0", // jade.500
  "#82e3d3", // jade.400
  "#9d8bf0", // amethyst.500
  "#b8aaf6", // amethyst.400
];

// Void background color as numeric components (no hexAlpha call — direct rgba)
const VOID_WASH = "rgba(7,6,17,0.16)";

interface FieldNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
  alpha: number;
  phase: number;
}

interface ReleasePulse {
  fromIdx: number;
  toIdx: number;
  t: number;
  speed: number;
  color: string;
}

export default function LiberationField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx0 = canvas.getContext("2d");
    if (!ctx0) return;
    const ctx: CanvasRenderingContext2D = ctx0;

    let rafId: number;
    let nodes: FieldNode[] = [];
    let pulses: ReleasePulse[] = [];
    let time = 0;

    const NODE_COUNT = 64;
    const LINK_DIST = 150;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const dpr = window.devicePixelRatio || 1;

    function resize() {
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx.scale(dpr, dpr);
      initNodes(w, h);
    }

    function initNodes(w: number, h: number) {
      nodes = Array.from({ length: NODE_COUNT }, () => {
        // Slower, more meditative than the reference
        const speed = prefersReduced ? 0.04 : 0.10 + Math.random() * 0.14;
        const angle = Math.random() * Math.PI * 2;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: 1.6 + Math.random() * 2.0,
          color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
          alpha: 0.45 + Math.random() * 0.40,
          phase: Math.random() * Math.PI * 2,
        };
      });
      pulses = [];
    }

    function spawnReleasePulse() {
      const candidates: Array<[number, number]> = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          if (Math.sqrt(dx * dx + dy * dy) < LINK_DIST * 0.65) {
            candidates.push([i, j]);
          }
        }
      }
      if (candidates.length === 0) return;
      const [fi, ti] = candidates[Math.floor(Math.random() * candidates.length)];
      pulses.push({
        fromIdx: fi,
        toIdx: ti,
        t: 0,
        // Slower travel for meditative pace
        speed: 0.003 + Math.random() * 0.004,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      });
    }

    function draw() {
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;

      // Soft motion-trail wash
      ctx.fillStyle = VOID_WASH;
      ctx.fillRect(0, 0, w, h);

      // Advance time — slower for meditation
      time += prefersReduced ? 0.002 : 0.005;

      // Global breath: very gentle, long period (~25s cycle)
      const globalBreath = 0.88 + 0.12 * Math.sin(time * 0.25);

      // Update and draw nodes
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;

        // Soft wrap
        const pad = 50;
        if (node.x < -pad) node.x = w + pad;
        if (node.x > w + pad) node.x = -pad;
        if (node.y < -pad) node.y = h + pad;
        if (node.y > h + pad) node.y = -pad;

        // Per-node breathing offset, gentle
        const nodeBreath = globalBreath * (0.75 + 0.25 * Math.sin(time * 0.55 + node.phase));
        const alpha = node.alpha * nodeBreath;

        // Radial glow
        const glowR = node.r * 6;
        const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowR);
        glow.addColorStop(0, hexAlpha(node.color, alpha * 0.9));
        glow.addColorStop(0.35, hexAlpha(node.color, alpha * 0.28));
        glow.addColorStop(1, hexAlpha(node.color, 0));
        ctx.beginPath();
        ctx.arc(node.x, node.y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fillStyle = hexAlpha(node.color, alpha);
        ctx.fill();
      }

      // Thin connecting lines between near nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            const fade = 1 - dist / LINK_DIST;
            const linkAlpha = fade * fade * 0.20 * globalBreath;
            const lg = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
            lg.addColorStop(0, hexAlpha(a.color, linkAlpha));
            lg.addColorStop(1, hexAlpha(b.color, linkAlpha));
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = lg;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Draw and advance release pulses
      pulses = pulses.filter((p) => p.t <= 1.0);
      for (const pulse of pulses) {
        pulse.t += pulse.speed;
        const from = nodes[pulse.fromIdx];
        const to = nodes[pulse.toIdx];
        if (!from || !to) continue;
        const px = from.x + (to.x - from.x) * pulse.t;
        const py = from.y + (to.y - from.y) * pulse.t;
        const pa =
          pulse.t < 0.2
            ? pulse.t / 0.2
            : pulse.t > 0.8
            ? 1 - (pulse.t - 0.8) / 0.2
            : 1.0;

        const pg = ctx.createRadialGradient(px, py, 0, px, py, 7);
        pg.addColorStop(0, hexAlpha(pulse.color, 0.85 * pa));
        pg.addColorStop(0.45, hexAlpha(pulse.color, 0.30 * pa));
        pg.addColorStop(1, hexAlpha(pulse.color, 0));
        ctx.beginPath();
        ctx.arc(px, py, 7, 0, Math.PI * 2);
        ctx.fillStyle = pg;
        ctx.fill();
      }

      // Spawn release pulses — gentle rate
      const spawnChance = prefersReduced ? 0.004 : 0.008;
      if (Math.random() < spawnChance) {
        spawnReleasePulse();
      }

      rafId = requestAnimationFrame(draw);
    }

    resize();

    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas!);

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}

/** Convert a #rrggbb hex string + 0–1 alpha to an rgba() string.
 *  Only feed it literal #rrggbb constants — never rgba() or computed colors. */
function hexAlpha(hex: string, a: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a.toFixed(3)})`;
}
