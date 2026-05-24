"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { STABILITY_FORCES, StabilityForce } from "./content";
import { useLang, T, t } from "./lang";
import { Lang, Bi } from "./lang";

// ── Palette (hex for canvas) ────────────────────────────────────────────────
const HEX = {
  void950: "#070611",
  void900: "#0c0a1c",
  void800: "#141128",
  void700: "#1d1938",
  bodhi500: "#f4c25a",
  bodhi400: "#ffd584",
  bodhi300: "#ffe7b0",
  jade500: "#4fd6c0",
  jade400: "#82e3d3",
  jade300: "#aeefe4",
  amethyst500: "#9d8bf0",
  amethyst400: "#b8aaf6",
  ember500: "#e0664f",
  ember400: "#ea8773",
  ember300: "#f2aa9b",
  lotus500: "#ef84b1",
  bone50: "#fbf6ee",
  bone300: "#d6c9b8",
  bone500: "#9b8d79",
};

// ── Safe helpers ────────────────────────────────────────────────────────────
// ONLY call hexAlpha on plain #rrggbb hex strings — never on rgba/computed colors.
function hexAlpha(hex: string, a: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a.toFixed(3)})`;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// Returns rgba() string — safe for interpolated colors
function lerpColor(hexA: string, hexB: string, t: number, alpha = 1): string {
  const ra = parseInt(hexA.slice(1, 3), 16);
  const ga = parseInt(hexA.slice(3, 5), 16);
  const ba = parseInt(hexA.slice(5, 7), 16);
  const rb = parseInt(hexB.slice(1, 3), 16);
  const gb = parseInt(hexB.slice(3, 5), 16);
  const bb = parseInt(hexB.slice(5, 7), 16);
  return `rgba(${Math.round(lerp(ra, rb, t))},${Math.round(lerp(ga, gb, t))},${Math.round(lerp(ba, bb, t))},${alpha.toFixed(3)})`;
}

// ── Simulation types ────────────────────────────────────────────────────────
interface Being {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  r: number;
  phase: number;
  // 0=suffering/erode, 1=flourishing/healing
  localHeal: number;
  clusterIdx: number;
  alpha: number;
}

const NODE_COUNT = 180;
const CLUSTER_COUNT = 4;

// Fragmented clusters — dispersed, wary
const CLUSTERS_FRAG = [
  { x: 0.18, y: 0.25 },
  { x: 0.80, y: 0.20 },
  { x: 0.22, y: 0.80 },
  { x: 0.78, y: 0.78 },
];
// Flourishing center
const CENTER_COHESIVE = { x: 0.50, y: 0.50 };

// ── Derive compassion state from sliders (−1 … +1) ─────────────────────────
function computeBalance(sliders: Record<string, number>): number {
  let buildScore = 0, erodeScore = 0, buildMax = 0, erodeMax = 0;
  for (const f of STABILITY_FORCES) {
    const s = (sliders[f.id] ?? 50) / 100;
    const contribution = f.weight * s;
    if (f.dir === "build") {
      buildScore += contribution;
      buildMax += f.weight;
    } else {
      erodeScore += contribution;
      erodeMax += f.weight;
    }
  }
  const bn = buildMax > 0 ? buildScore / buildMax : 0;
  const en = erodeMax > 0 ? erodeScore / erodeMax : 0;
  return Math.max(-1, Math.min(1, bn - en));
}

// ── Presets ─────────────────────────────────────────────────────────────────
const PRESETS: { id: string; label: Bi; values: Record<string, number> }[] = [
  {
    id: "war",
    label: { en: "War & collapse", zh: "战争与崩溃" },
    values: {
      violence: 95,
      oppression: 88,
      dehumanize: 90,
      scarcity: 80,
      isolation: 72,
      justice: 10,
      healing: 8,
      contact: 6,
      institutions: 12,
      mutualaid: 15,
    },
  },
  {
    id: "neglect",
    label: { en: "Neglect", zh: "忽视" },
    values: {
      violence: 28,
      oppression: 32,
      dehumanize: 24,
      scarcity: 40,
      isolation: 68,
      justice: 22,
      healing: 18,
      contact: 20,
      institutions: 25,
      mutualaid: 20,
    },
  },
  {
    id: "reconcile",
    label: { en: "Truth & reconciliation", zh: "真相与和解" },
    values: {
      violence: 18,
      oppression: 20,
      dehumanize: 14,
      scarcity: 30,
      isolation: 22,
      justice: 90,
      healing: 84,
      contact: 88,
      institutions: 78,
      mutualaid: 72,
    },
  },
  {
    id: "awakened",
    label: { en: "Awakened society", zh: "觉醒社会" },
    values: {
      violence: 6,
      oppression: 8,
      dehumanize: 4,
      scarcity: 14,
      isolation: 10,
      justice: 92,
      healing: 90,
      contact: 88,
      institutions: 94,
      mutualaid: 92,
    },
  },
];

// Default slider values (from STABILITY_FORCES weights, slightly moderated)
function makeDefaults(): Record<string, number> {
  const d: Record<string, number> = {};
  for (const f of STABILITY_FORCES) d[f.id] = Math.round(f.weight * 0.55);
  return d;
}

// ── Main component ──────────────────────────────────────────────────────────
export default function CompassionStabilitySim() {
  const { lang } = useLang();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const defaultSliders = makeDefaults();
  const [sliders, setSliders] = useState<Record<string, number>>(defaultSliders);
  const [openTooltip, setOpenTooltip] = useState<string | null>(null);

  const balance = computeBalance(sliders);  // −1 … +1
  const balanceRef = useRef(balance);
  balanceRef.current = balance;

  // 0–100 metrics derived from balance
  const healT = (balance + 1) / 2;  // 0 = total suffering, 1 = total flourishing
  const sufferingPct = Math.round(100 - healT * 90);
  const compassionPct = Math.round(20 + healT * 78);
  const trustPct = Math.round(18 + healT * 76);
  const stabilityScore = Math.round(10 + healT * 88);

  // ── Canvas simulation ────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx0 = canvas.getContext("2d");
    if (!ctx0) return;
    const ctx: CanvasRenderingContext2D = ctx0;

    let rafId: number;
    const dpr = window.devicePixelRatio || 1;
    let beings: Being[] = [];
    let time = 0;
    let W = 0;
    let H = 0;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function initBeings(w: number, h: number) {
      beings = Array.from({ length: NODE_COUNT }, (_, i) => {
        const ci = i % CLUSTER_COUNT;
        const cx = CENTER_COHESIVE.x * w;
        const cy = CENTER_COHESIVE.y * h;
        const spread = 0.20 * Math.min(w, h);
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * spread;
        return {
          x: cx + Math.cos(angle) * dist,
          y: cy + Math.sin(angle) * dist,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          tx: cx,
          ty: cy,
          r: 1.8 + Math.random() * 2.4,
          phase: Math.random() * Math.PI * 2,
          localHeal: 0.5 + (Math.random() - 0.5) * 0.3,
          clusterIdx: ci,
          alpha: 0.55 + Math.random() * 0.45,
        };
      });
    }

    function resize() {
      W = canvas!.offsetWidth;
      H = canvas!.offsetHeight;
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      ctx.scale(dpr, dpr);
      initBeings(W, H);
    }

    // Per-being color based on its local heal state and global balance.
    // Returns an rgba() string — safe for gradient stops.
    function beingColor(b: Being, alpha = 1): string {
      // localHeal blends ember ↔ jade/bodhi
      const h = b.localHeal;
      if (h < 0.5) {
        // ember (suffering) → amethyst (transition)
        const t = h * 2;
        return lerpColor(HEX.ember500, HEX.amethyst500, t, alpha);
      } else {
        // amethyst → bodhi/jade (flourishing)
        const t = (h - 0.5) * 2;
        return lerpColor(HEX.amethyst500, HEX.jade400, t, alpha);
      }
    }

    function draw() {
      if (!canvas) return;
      const bal = balanceRef.current;
      time += prefersReduced ? 0.003 : 0.010;

      // How cohesive (0=fully fragmented, 1=fully cohesive)
      const cohT = Math.max(0, Math.min(1, (bal + 1) / 2));
      const fragT = 1 - cohT;

      // Trailing wash — darker when suffering, warmer when healing
      const washR = Math.round(lerp(12, 7, cohT));
      const washG = Math.round(lerp(7, 10, cohT));
      const washB = Math.round(lerp(22, 17, cohT));
      ctx.fillStyle = `rgba(${washR},${washG},${washB},0.14)`;
      ctx.fillRect(0, 0, W, H);

      // Gentle breathing pulse
      const breathe = 0.87 + 0.13 * Math.sin(time * (prefersReduced ? 0.3 : 0.55));

      // Agitation for eroding forces — extra jitter when suffering
      const agitation = fragT * (prefersReduced ? 0.4 : 1.2);

      // Update beings
      for (let i = 0; i < beings.length; i++) {
        const b = beings[i];
        const ci = b.clusterIdx;

        // Cohesive target: gentle ring around center
        const cohSpread = 0.13 * Math.min(W, H);
        const angle0 = (i / NODE_COUNT) * Math.PI * 2;
        const r0 = (0.15 + 0.85 * ((i % (NODE_COUNT / CLUSTER_COUNT)) / (NODE_COUNT / CLUSTER_COUNT))) * cohSpread;
        const cohTx = CENTER_COHESIVE.x * W + Math.cos(angle0) * r0;
        const cohTy = CENTER_COHESIVE.y * H + Math.sin(angle0) * r0;

        // Fragmented target: scatter into 4 corner clusters
        const fc = CLUSTERS_FRAG[ci];
        const fragSpread = 0.17 * Math.min(W, H);
        const localIdx = Math.floor(i / CLUSTER_COUNT);
        const totalInCluster = Math.ceil(NODE_COUNT / CLUSTER_COUNT);
        const angle1 = (localIdx / totalInCluster) * Math.PI * 2;
        const r1 = (0.15 + 0.85 * (localIdx / totalInCluster)) * fragSpread;
        const fragTx = fc.x * W + Math.cos(angle1) * r1;
        const fragTy = fc.y * H + Math.sin(angle1) * r1;

        b.tx = lerp(fragTx, cohTx, cohT);
        b.ty = lerp(fragTy, cohTy, cohT);

        // Ease toward target + agitation noise
        const ease = prefersReduced ? 0.045 : 0.028;
        const jitter = agitation * 0.8;
        b.vx += (b.tx - b.x) * ease + (Math.random() - 0.5) * jitter;
        b.vy += (b.ty - b.y) * ease + (Math.random() - 0.5) * jitter;
        b.vx *= 0.80;
        b.vy *= 0.80;
        b.x += b.vx;
        b.y += b.vy;

        // Gently drift localHeal toward global cohT
        const drift = prefersReduced ? 0.008 : 0.004;
        b.localHeal += (cohT - b.localHeal) * drift;
        b.localHeal = Math.max(0, Math.min(1, b.localHeal));
      }

      // ── Links ──────────────────────────────────────────────────────────────
      const linkDist = lerp(48, 140, cohT);
      for (let i = 0; i < beings.length; i++) {
        for (let j = i + 1; j < beings.length; j++) {
          const a = beings[i];
          const bb2 = beings[j];
          const dx = a.x - bb2.x;
          const dy = a.y - bb2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist >= linkDist) continue;
          const sameCluster = a.clusterIdx === bb2.clusterIdx;
          if (!sameCluster && fragT > 0.55) continue;
          const fade = 1 - dist / linkDist;
          // Build alpha from rgba — NOT from hexAlpha on computed colors
          const linkAlpha = fade * fade * (sameCluster ? 0.28 : 0.12) * breathe * (sameCluster ? 1 : cohT);
          const lg = ctx.createLinearGradient(a.x, a.y, bb2.x, bb2.y);
          lg.addColorStop(0, beingColor(a, linkAlpha));
          lg.addColorStop(1, beingColor(bb2, linkAlpha));
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(bb2.x, bb2.y);
          ctx.strokeStyle = lg;
          ctx.lineWidth = sameCluster ? 0.9 : 0.45;
          ctx.stroke();
        }
      }

      // ── Tension lines between clusters when fragmented ─────────────────────
      if (fragT > 0.25) {
        const tensionAlpha = (fragT - 0.25) * 0.75 * 0.15;
        ctx.setLineDash([5, 14]);
        ctx.lineWidth = 1.0;
        // Use hexAlpha only on plain hex constants — safe
        ctx.strokeStyle = hexAlpha(HEX.ember500, tensionAlpha);
        for (let ci = 0; ci < CLUSTER_COUNT; ci++) {
          for (let cj = ci + 1; cj < CLUSTER_COUNT; cj++) {
            const cA = CLUSTERS_FRAG[ci];
            const cB = CLUSTERS_FRAG[cj];
            ctx.beginPath();
            ctx.moveTo(cA.x * W, cA.y * H);
            ctx.lineTo(cB.x * W, cB.y * H);
            ctx.stroke();
          }
        }
        ctx.setLineDash([]);
      }

      // ── Compassion field glow at center when cohesive ──────────────────────
      if (cohT > 0.2) {
        const fieldR = cohT * 0.35 * Math.min(W, H);
        const fieldAlpha = cohT * 0.10 * breathe;
        const gField = ctx.createRadialGradient(
          CENTER_COHESIVE.x * W, CENTER_COHESIVE.y * H, 0,
          CENTER_COHESIVE.x * W, CENTER_COHESIVE.y * H, fieldR
        );
        // Build rgba manually — safe
        const r0 = parseInt(HEX.jade400.slice(1, 3), 16);
        const g0 = parseInt(HEX.jade400.slice(3, 5), 16);
        const b0 = parseInt(HEX.jade400.slice(5, 7), 16);
        gField.addColorStop(0, `rgba(${r0},${g0},${b0},${(fieldAlpha * 0.8).toFixed(3)})`);
        gField.addColorStop(0.6, `rgba(${r0},${g0},${b0},${(fieldAlpha * 0.2).toFixed(3)})`);
        gField.addColorStop(1, `rgba(${r0},${g0},${b0},0)`);
        ctx.beginPath();
        ctx.arc(CENTER_COHESIVE.x * W, CENTER_COHESIVE.y * H, fieldR, 0, Math.PI * 2);
        ctx.fillStyle = gField;
        ctx.fill();
      }

      // ── Draw beings ────────────────────────────────────────────────────────
      for (const b of beings) {
        const nodeBreath = breathe * (0.72 + 0.28 * Math.sin(time * 1.15 + b.phase));
        const alpha = b.alpha * nodeBreath;
        const glowR = b.r * (cohT * 5 + fragT * 2.8);
        const glow = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, glowR);
        // Use beingColor (returns rgba) — NOT hexAlpha
        glow.addColorStop(0, beingColor(b, alpha * 0.88));
        glow.addColorStop(0.4, beingColor(b, alpha * 0.25));
        glow.addColorStop(1, beingColor(b, 0));
        ctx.beginPath();
        ctx.arc(b.x, b.y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = beingColor(b, alpha);
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  // ── Preset setter ────────────────────────────────────────────────────────
  const setPreset = useCallback((id: string) => {
    const p = PRESETS.find((x) => x.id === id);
    if (!p) return;
    setSliders({ ...p.values });
  }, []);

  // ── Status label ─────────────────────────────────────────────────────────
  const statusLabel: Bi =
    balance > 0.45
      ? { en: "Population flourishing · connected", zh: "众生繁盛 · 凝聚相连" }
      : balance > 0.1
      ? { en: "Fragile healing · bonds reforming", zh: "脆弱疗愈 · 纽带重织" }
      : balance > -0.15
      ? { en: "Fragile balance · on the edge", zh: "脆弱平衡 · 悬于一线" }
      : balance > -0.45
      ? { en: "Suffering rising · circle fragmenting", zh: "苦难上升 · 圆正碎裂" }
      : { en: "Population in crisis · bonds severed", zh: "众生危殆 · 纽带断裂" };

  const statusColor =
    balance > 0.35
      ? "text-jade-400"
      : balance > 0
      ? "text-bodhi-400"
      : balance > -0.3
      ? "text-bone-300"
      : "text-ember-400";

  const erodeForces = STABILITY_FORCES.filter((f) => f.dir === "erode");
  const buildForces = STABILITY_FORCES.filter((f) => f.dir === "build");

  return (
    <div className="w-full flex flex-col gap-5">
      {/* Framing line */}
      <p
        className="text-[0.78rem] leading-relaxed text-bone-300/80 font-serif"
        style={{ maxWidth: "62ch" }}
      >
        <T
          v={{
            en: "Compassion is anti-fragmentation infrastructure — the deliberate work of re-including those a society casts out. Adjust the forces and watch the population respond.",
            zh: "慈悲是抗碎裂的基础设施——那将一个社会所逐出者重新纳入的刻意功课。调整各力量，观察众生如何回应。",
          }}
        />
      </p>

      {/* Canvas */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: `linear-gradient(155deg, ${HEX.void800} 0%, ${HEX.void950} 100%)`,
          height: "clamp(260px, 40vw, 460px)",
          boxShadow: `0 0 70px -24px ${hexAlpha(HEX.jade500, 0.20)}, inset 0 1px 0 ${hexAlpha(HEX.bodhi300, 0.05)}`,
        }}
      >
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          style={{ width: "100%", height: "100%", display: "block" }}
        />
        {/* Status overlay */}
        <div className="absolute top-4 left-0 right-0 flex justify-center pointer-events-none">
          <span
            className={`label-mono text-[0.62rem] tracking-widest px-3 py-1 rounded-full border ${statusColor}`}
            style={{
              background: hexAlpha(HEX.void950, 0.80),
              borderColor: hexAlpha(HEX.bone300, 0.08),
            }}
          >
            <T v={statusLabel} />
          </span>
        </div>
        {/* Compassion stability score overlay */}
        <div className="absolute bottom-4 right-4 pointer-events-none flex flex-col items-end gap-0.5">
          <span
            className="label-mono text-[0.56rem] tracking-widest"
            style={{ color: hexAlpha(HEX.bone300, 0.55) }}
          >
            <T v={{ en: "COMPASSION STABILITY", zh: "慈悲稳定度" }} />
          </span>
          <span
            className="font-mono text-2xl font-light leading-none"
            style={{
              color: balance > 0.2
                ? HEX.jade400
                : balance > -0.1
                ? HEX.bodhi400
                : HEX.ember400,
            }}
          >
            {stabilityScore}
            <span
              className="text-[0.65rem] ml-0.5"
              style={{ color: hexAlpha(HEX.bone300, 0.45) }}
            >
              /100
            </span>
          </span>
        </div>
      </div>

      {/* Live meters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <StabilityMeter
          label={{ en: "Suffering", zh: "苦" }}
          value={sufferingPct}
          barHex={balance < -0.1 ? HEX.ember500 : HEX.ember300}
          textClass="text-ember-300"
          lang={lang}
        />
        <StabilityMeter
          label={{ en: "Compassion & cohesion", zh: "慈悲与凝聚" }}
          value={compassionPct}
          barHex={balance > 0 ? HEX.jade500 : HEX.jade300}
          textClass="text-jade-300"
          lang={lang}
        />
        <StabilityMeter
          label={{ en: "Social trust", zh: "社会信任" }}
          value={trustPct}
          barHex={balance > 0 ? HEX.bodhi500 : HEX.bodhi300}
          textClass="text-bodhi-300"
          lang={lang}
        />
        <StabilityMeter
          label={{ en: "Compassion stability", zh: "慈悲稳定度" }}
          value={stabilityScore}
          barHex={
            balance > 0.3
              ? HEX.jade500
              : balance > -0.1
              ? HEX.bodhi500
              : HEX.ember500
          }
          textClass={
            balance > 0.3
              ? "text-jade-400"
              : balance > -0.1
              ? "text-bodhi-400"
              : "text-ember-400"
          }
          lang={lang}
          headline
        />
      </div>

      {/* Presets + reset */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="label-mono text-[0.58rem] text-bone-500 tracking-widest mr-1">
          <T v={{ en: "SCENARIOS", zh: "预设场景" }} />
        </span>
        {PRESETS.map((p) => {
          const isErode = p.id === "war" || p.id === "neglect";
          return (
            <button
              key={p.id}
              onClick={() => setPreset(p.id)}
              className={`label-mono text-[0.68rem] px-3 py-1 rounded-full border transition-all ${
                isErode
                  ? "border-ember-500/40 text-ember-300 hover:bg-ember-500/10"
                  : "border-jade-500/40 text-jade-300 hover:bg-jade-500/10"
              }`}
            >
              <T v={p.label} />
            </button>
          );
        })}
        <button
          onClick={() => setSliders({ ...defaultSliders })}
          className="label-mono text-[0.68rem] px-3 py-1 rounded-full border border-bone-500/20 text-bone-500 hover:text-bone-300 transition-all"
        >
          <T v={{ en: "Reset", zh: "重置" }} />
        </button>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
        {/* Erode forces */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2 mb-2">
            <span className="label-mono text-[0.58rem] text-ember-400 tracking-widest">
              <T v={{ en: "FORCES OF SUFFERING", zh: "致苦之力" }} />
            </span>
            <div className="flex-1 h-px" style={{ background: hexAlpha(HEX.ember500, 0.18) }} />
          </div>
          {erodeForces.map((force) => (
            <ForceSlider
              key={force.id}
              force={force}
              value={sliders[force.id] ?? 50}
              onChange={(v) => setSliders((s) => ({ ...s, [force.id]: v }))}
              open={openTooltip === force.id}
              onToggle={() =>
                setOpenTooltip((o) => (o === force.id ? null : force.id))
              }
              lang={lang}
            />
          ))}
        </div>
        {/* Build forces */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2 mb-2">
            <span className="label-mono text-[0.58rem] text-jade-400 tracking-widest">
              <T v={{ en: "FORCES OF HEALING", zh: "疗愈之力" }} />
            </span>
            <div className="flex-1 h-px" style={{ background: hexAlpha(HEX.jade500, 0.18) }} />
          </div>
          {buildForces.map((force) => (
            <ForceSlider
              key={force.id}
              force={force}
              value={sliders[force.id] ?? 50}
              onChange={(v) => setSliders((s) => ({ ...s, [force.id]: v }))}
              open={openTooltip === force.id}
              onToggle={() =>
                setOpenTooltip((o) => (o === force.id ? null : force.id))
              }
              lang={lang}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Sub-component: stability meter ──────────────────────────────────────────
function StabilityMeter({
  label,
  value,
  barHex,
  textClass,
  lang,
  headline = false,
}: {
  label: Bi;
  value: number;
  barHex: string;
  textClass: string;
  lang: Lang;
  headline?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-3 flex flex-col gap-2 ${headline ? "ring-1 ring-white/5" : ""}`}
      style={{
        background: "rgba(13,10,28,0.75)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <span
        className={`label-mono text-[0.56rem] tracking-widest ${textClass} ${lang === "zh" ? "zh" : ""} leading-tight`}
      >
        {label[lang]}
      </span>
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.05)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, ${barHex}99, ${barHex})`,
          }}
        />
      </div>
      <span className={`font-mono text-[0.72rem] ${textClass}`}>
        {value}
        <span className="text-bone-500 text-[0.58rem]">%</span>
      </span>
    </div>
  );
}

// ── Sub-component: force slider ──────────────────────────────────────────────
function ForceSlider({
  force,
  value,
  onChange,
  open,
  onToggle,
  lang,
}: {
  force: StabilityForce;
  value: number;
  onChange: (v: number) => void;
  open: boolean;
  onToggle: () => void;
  lang: Lang;
}) {
  const isErode = force.dir === "erode";
  const trackColor = isErode ? HEX.ember500 : HEX.jade500;
  const textColor = isErode ? "text-ember-300" : "text-jade-300";
  const borderColor = isErode
    ? "border-ember-500/15"
    : "border-jade-500/15";

  return (
    <div className={`py-2 border-b ${borderColor}`}>
      <div className="flex items-center gap-2 mb-1">
        <button
          onClick={onToggle}
          aria-expanded={open}
          className={`label-mono text-[0.65rem] flex-1 text-left ${textColor} ${lang === "zh" ? "zh" : ""} hover:opacity-75 transition-opacity`}
        >
          {force.label[lang]}
          <span className="ml-1.5 text-bone-500/35 font-mono text-[0.58rem]">
            {open ? "▲" : "▼"}
          </span>
        </button>
        <span className={`font-mono text-[0.68rem] w-7 text-right ${textColor}`}>
          {value}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(90deg, ${trackColor} ${value}%, rgba(255,255,255,0.07) ${value}%)`,
          accentColor: trackColor,
        }}
      />
      {open && (
        <p
          key={lang}
          className={`mt-2 text-[0.67rem] leading-relaxed text-bone-500 font-serif ${lang === "zh" ? "zh" : ""} lang-fade`}
        >
          {force.effect[lang]}
        </p>
      )}
    </div>
  );
}
