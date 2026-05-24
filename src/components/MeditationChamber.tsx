"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useLang, T, t } from "./lang";
import { BREATH_CYCLE } from "./content";

// Total cycle length in seconds
const CYCLE_SECONDS = BREATH_CYCLE.reduce((s, p) => s + p.seconds, 0); // 4+4+6+2 = 16

// Bilingual labels used in UI controls
const LABEL_BEGIN = { en: "Begin", zh: "开始" };
const LABEL_PAUSE = { en: "Pause", zh: "暂停" };
const LABEL_RESUME = { en: "Resume", zh: "继续" };
const LABEL_BREATHS = { en: "breath", zh: "次呼吸" };
const LABEL_BREATHS_PLURAL = { en: "breaths", zh: "次呼吸" };
const LABEL_CALM = {
  en: "Settle into stillness. Let each breath carry you deeper.",
  zh: "安住于静中。让每一次呼吸带你更深地沉入。",
};

// Orb scale bounds: min (exhale/rest) and max (full inhale/hold-top)
const ORB_MIN = 0.52;
const ORB_MAX = 1.0;

// Derive the cumulative start time (in seconds) for each phase within a cycle
const PHASE_OFFSETS: number[] = (() => {
  let acc = 0;
  return BREATH_CYCLE.map((p) => {
    const off = acc;
    acc += p.seconds;
    return off;
  });
})();

function getPhaseAt(cycleElapsed: number): { phaseIdx: number; phaseElapsed: number; phaseFrac: number } {
  // cycleElapsed is seconds into the current breath cycle (0 .. CYCLE_SECONDS)
  let acc = 0;
  for (let i = 0; i < BREATH_CYCLE.length; i++) {
    const dur = BREATH_CYCLE[i].seconds;
    if (cycleElapsed < acc + dur || i === BREATH_CYCLE.length - 1) {
      const phaseElapsed = cycleElapsed - acc;
      return { phaseIdx: i, phaseElapsed, phaseFrac: Math.min(phaseElapsed / dur, 1) };
    }
    acc += dur;
  }
  return { phaseIdx: 0, phaseElapsed: 0, phaseFrac: 0 };
}

/**
 * Compute the orb scale from the current phase and fractional progress.
 * in  → grow from ORB_MIN to ORB_MAX  (eased)
 * hold → stay at ORB_MAX
 * out  → shrink from ORB_MAX to ORB_MIN (eased)
 * rest → stay at ORB_MIN
 */
function orbScale(phaseId: string, frac: number): number {
  const ease = (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  if (phaseId === "in") return ORB_MIN + (ORB_MAX - ORB_MIN) * ease(frac);
  if (phaseId === "hold1") return ORB_MAX;
  if (phaseId === "out") return ORB_MAX - (ORB_MAX - ORB_MIN) * ease(frac);
  // rest / hold2
  return ORB_MIN;
}

// Particle positions for gentle drifting particles around the orb
interface Particle {
  angle: number;
  radius: number;
  speed: number;
  size: number;
  alpha: number;
  color: string;
}

const PARTICLE_COLORS = ["#ffd584", "#f4c25a", "#9d8bf0", "#ef84b1", "#4fd6c0"];

function initParticles(count: number): Particle[] {
  return Array.from({ length: count }, () => ({
    angle: Math.random() * Math.PI * 2,
    radius: 80 + Math.random() * 60,
    speed: (0.003 + Math.random() * 0.004) * (Math.random() < 0.5 ? 1 : -1),
    size: 1.5 + Math.random() * 2,
    alpha: 0.25 + Math.random() * 0.35,
    color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
  }));
}

export default function MeditationChamber() {
  const { lang } = useLang();

  // Timer state
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  // totalElapsed: seconds since the practice began (persists across pause/resume)
  const totalElapsedRef = useRef(0);
  const lastTimestampRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  // Derived display state (updated each rAF tick)
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [phaseFrac, setPhaseFrac] = useState(0);
  const [phaseElapsed, setPhaseElapsed] = useState(0);
  const [completedBreaths, setCompletedBreaths] = useState(0);
  const [scale, setScale] = useState(ORB_MIN);

  // Track completed breaths: a "breath" = one full cycle
  const lastCycleCountRef = useRef(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>(initParticles(18));
  const animTimeRef = useRef(0);

  const stopRaf = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    lastTimestampRef.current = null;
  }, []);

  const tick = useCallback((ts: number) => {
    if (lastTimestampRef.current === null) {
      lastTimestampRef.current = ts;
    }
    const dt = (ts - lastTimestampRef.current) / 1000; // seconds
    lastTimestampRef.current = ts;
    animTimeRef.current += dt;

    totalElapsedRef.current += dt;
    const cycleElapsed = totalElapsedRef.current % CYCLE_SECONDS;

    const { phaseIdx: pi, phaseElapsed: pe, phaseFrac: pf } = getPhaseAt(cycleElapsed);
    const phase = BREATH_CYCLE[pi];
    const s = orbScale(phase.id, pf);

    // Count completed full cycles as "breaths"
    const cycleCount = Math.floor(totalElapsedRef.current / CYCLE_SECONDS);
    if (cycleCount > lastCycleCountRef.current) {
      lastCycleCountRef.current = cycleCount;
      setCompletedBreaths(cycleCount);
    }

    setPhaseIdx(pi);
    setPhaseFrac(pf);
    setPhaseElapsed(pe);
    setScale(s);

    // Draw particles on canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx0 = canvas.getContext("2d");
      if (ctx0) {
        const ctx: CanvasRenderingContext2D = ctx0;
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);
        const cx = w / 2;
        const cy = h / 2;
        const particles = particlesRef.current;
        for (const p of particles) {
          p.angle += p.speed;
          // Radius breathes gently with orb scale
          const effectiveR = p.radius * (0.92 + 0.08 * s);
          const px = cx + Math.cos(p.angle) * effectiveR;
          const py = cy + Math.sin(p.angle) * effectiveR;
          const hex = p.color;
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);
          const grd = ctx.createRadialGradient(px, py, 0, px, py, p.size * 3);
          grd.addColorStop(0, `rgba(${r},${g},${b},${(p.alpha * 0.9).toFixed(3)})`);
          grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
          ctx.beginPath();
          ctx.arc(px, py, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        }
      }
    }

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (running) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      stopRaf();
    }
    return stopRaf;
  }, [running, tick, stopRaf]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopRaf();
  }, [stopRaf]);

  function handleToggle() {
    if (!started) {
      setStarted(true);
      totalElapsedRef.current = 0;
      lastCycleCountRef.current = 0;
      setCompletedBreaths(0);
      setRunning(true);
    } else {
      setRunning((r) => !r);
    }
  }

  const currentPhase = BREATH_CYCLE[phaseIdx];
  const secondsLeft = Math.ceil(currentPhase.seconds - phaseElapsed);

  // Progress arc: fraction of current phase elapsed
  const ARC_RADIUS = 118;
  const ARC_STROKE = 2;
  const circumference = 2 * Math.PI * ARC_RADIUS;
  const dashOffset = circumference * (1 - (started ? phaseFrac : 0));

  // Orb visual sizing — base 96px, scales between ORB_MIN and ORB_MAX
  const ORB_BASE = 96;
  const orbPx = ORB_BASE * scale;

  // Phase color: bodhi for inhale/hold, jade for exhale, amethyst for rest
  function phaseAccent(id: string) {
    if (id === "in" || id === "hold1") return { ring: "#ffd584", core: "#f4c25a" };
    if (id === "out") return { ring: "#4fd6c0", core: "#82e3d3" };
    return { ring: "#9d8bf0", core: "#b8aaf6" };
  }
  const accent = phaseAccent(started ? currentPhase.id : "in");

  const breathLabel =
    completedBreaths === 1
      ? `1 ${t(LABEL_BREATHS, lang)}`
      : `${completedBreaths} ${t(LABEL_BREATHS_PLURAL, lang)}`;

  return (
    <div className="rounded-2xl border border-bodhi-500/15 bg-void-900/50 flex flex-col items-center justify-between gap-0 overflow-hidden"
      style={{ minHeight: 460, maxHeight: 520 }}>

      {/* Top calm guidance */}
      <div className="w-full px-6 pt-5 pb-2 text-center">
        <p className="label-mono text-bodhi-500/60 tracking-widest text-[0.65rem] mb-1">
          MEDITATION CHAMBER · 禅定
        </p>
        <p className="text-bone-500 text-xs leading-relaxed" style={{ fontStyle: "italic" }}>
          <T v={LABEL_CALM} />
        </p>
      </div>

      {/* Central orb area */}
      <div className="relative flex items-center justify-center flex-1 w-full">

        {/* Particle canvas — sits behind orb, same coordinate space */}
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          aria-hidden="true"
          className="absolute inset-0 m-auto pointer-events-none"
          style={{ width: 300, height: 300 }}
        />

        {/* Progress arc (SVG) */}
        <svg
          width={280}
          height={280}
          viewBox="0 0 280 280"
          className="absolute inset-0 m-auto pointer-events-none"
          aria-hidden="true"
        >
          {/* Background ring */}
          <circle
            cx={140} cy={140}
            r={ARC_RADIUS}
            fill="none"
            stroke="rgba(244,194,90,0.08)"
            strokeWidth={ARC_STROKE}
          />
          {/* Concentric halo rings */}
          <circle
            cx={140} cy={140}
            r={ARC_RADIUS - 14}
            fill="none"
            stroke="rgba(157,139,240,0.06)"
            strokeWidth={1}
          />
          <circle
            cx={140} cy={140}
            r={ARC_RADIUS + 14}
            fill="none"
            stroke="rgba(79,214,192,0.06)"
            strokeWidth={1}
          />
          {/* Animated progress arc */}
          <circle
            cx={140} cy={140}
            r={ARC_RADIUS}
            fill="none"
            stroke={accent.ring}
            strokeOpacity={0.7}
            strokeWidth={ARC_STROKE}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transform: "rotate(-90deg)", transformOrigin: "140px 140px", transition: "stroke 0.6s ease" }}
          />
        </svg>

        {/* Orb div — animated via scale state */}
        <div
          className="relative rounded-full flex items-center justify-center"
          style={{
            width: ORB_BASE * ORB_MAX * 2,
            height: ORB_BASE * ORB_MAX * 2,
          }}
          aria-hidden="true"
        >
          {/* Outer soft glow */}
          <div
            className="absolute rounded-full transition-all"
            style={{
              width: orbPx * 2 + 40,
              height: orbPx * 2 + 40,
              background: `radial-gradient(circle, ${accent.ring}18 0%, transparent 70%)`,
              transition: "width 0.15s ease-out, height 0.15s ease-out, background 0.6s ease",
            }}
          />
          {/* Orb body */}
          <div
            className="rounded-full"
            style={{
              width: orbPx * 2,
              height: orbPx * 2,
              background: `radial-gradient(circle at 38% 36%, ${accent.core}cc 0%, ${accent.ring}88 40%, #9d8bf055 75%, #070611 100%)`,
              boxShadow: `0 0 ${28 * scale}px ${accent.ring}55, 0 0 ${60 * scale}px ${accent.ring}22, inset 0 0 ${20 * scale}px ${accent.core}22`,
              transition: "width 0.15s ease-out, height 0.15s ease-out, background 0.6s ease, box-shadow 0.6s ease",
            }}
          />
        </div>

        {/* Countdown seconds */}
        {started && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 tabular-nums text-bone-500/50 text-xs label-mono">
            {secondsLeft}s
          </div>
        )}
      </div>

      {/* Phase label and cue */}
      <div className="text-center px-6 pb-2" style={{ minHeight: 64 }}>
        {started ? (
          <>
            <p
              className="display text-2xl font-light tracking-wide mb-1 transition-colors duration-500"
              style={{ color: accent.ring }}
            >
              {t(currentPhase.label, lang)}
            </p>
            <p className="text-bone-500 text-sm leading-relaxed">
              {t(currentPhase.cue, lang)}
            </p>
          </>
        ) : (
          <p className="display text-xl font-light text-bone-500/40 tracking-wide">
            <T v={{ en: "Ready when you are", zh: "待你准备好" }} />
          </p>
        )}
      </div>

      {/* Controls row */}
      <div className="flex items-center gap-6 px-6 pb-6 pt-1 w-full justify-center">
        {/* Breath counter */}
        <div className="flex-1 text-right">
          {started && completedBreaths > 0 && (
            <span className="label-mono text-bodhi-500/60 text-[0.65rem]">
              {breathLabel}
            </span>
          )}
        </div>

        {/* Start / Pause / Resume button */}
        <button
          onClick={handleToggle}
          className="px-7 py-2.5 rounded-full border border-bodhi-500/30 text-bodhi-300 text-sm tracking-wider hover:bg-bodhi-500/10 hover:border-bodhi-500/60 transition-all duration-300"
          style={{ fontFamily: "inherit", letterSpacing: "0.08em" }}
        >
          {!started
            ? t(LABEL_BEGIN, lang)
            : running
            ? t(LABEL_PAUSE, lang)
            : t(LABEL_RESUME, lang)}
        </button>

        {/* Spacer to balance the counter on the left */}
        <div className="flex-1" />
      </div>
    </div>
  );
}
