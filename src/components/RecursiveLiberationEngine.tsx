"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useLang, T, t } from "./lang";
import { EPOCHS, MODEL_AXES } from "./content";

/* ── Hex palette (liberation-engine) ─────────────────────────────── */
const C = {
  bodhi500: "#f4c25a",
  bodhi400: "#ffd584",
  bodhi300: "#ffe7b0",
  lotus500: "#ef84b1",
  lotus400: "#f6abc8",
  lotus300: "#fbcadd",
  jade500: "#4fd6c0",
  jade400: "#82e3d3",
  jade300: "#aeefe4",
  amethyst500: "#9d8bf0",
  amethyst400: "#b8aaf6",
  amethyst300: "#d4cbfb",
  ember500: "#e0664f",
  ember400: "#ea8773",
  ember300: "#f2aa9b",
  bone50: "#fbf6ee",
  bone100: "#f3ebdf",
  bone300: "#d6c9b8",
  bone500: "#9b8d79",
  void950: "#070611",
  void900: "#0c0a1c",
  void800: "#141128",
  void700: "#1d1938",
  void600: "#2a2550",
  void500: "#3b3468",
};

/* One accent per axis (8) */
const AXIS_COLORS = [
  C.jade400,        // regulation
  C.lotus400,       // empathy
  C.bodhi400,       // reduction
  C.amethyst400,    // resilience
  C.jade300,        // coordination
  C.lotus300,       // healing
  C.amethyst500,    // awareness
  C.bodhi300,       // trust
];

/* Epoch gradient — warm → jade → amethyst → gold culmination */
const EPOCH_COLORS = [
  "#ea8773", // biology       — ember warm
  "#f6abc8", // family        — lotus
  "#ffd584", // religion      — bodhi gold
  "#ffe7b0", // psychology    — bodhi pale
  "#82e3d3", // civilization  — jade
  "#b8aaf6", // digital       — amethyst
  "#9d8bf0", // ai            — deep amethyst
  "#f4c25a", // planetary     — bodhi 500 radiance
];

/* ── Math helpers ─────────────────────────────────────────────────── */
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
function meanScore(values: number[]) {
  return Math.round(values.reduce((s, v) => s + v, 0) / values.length);
}

/* ── Smooth sparkline path ───────────────────────────────────────── */
function sparklinePath(scores: number[], w: number, h: number) {
  const n = scores.length;
  const min = Math.min(...scores) - 4;
  const max = Math.max(...scores) + 4;
  const range = max - min || 1;
  const pts = scores.map((s, i) => ({
    x: (i / (n - 1)) * w,
    y: h - ((s - min) / range) * h,
  }));
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const curr = pts[i];
    const cpx = (prev.x + curr.x) / 2;
    d += ` C ${cpx.toFixed(1)} ${prev.y.toFixed(1)} ${cpx.toFixed(1)} ${curr.y.toFixed(1)} ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}`;
  }
  return { path: d, pts };
}

/* ── Trajectory line for two key axes across epochs ─────────────── */
function twoAxisPath(
  axisIdx: number,
  w: number,
  h: number
): { path: string; pts: { x: number; y: number }[] } {
  const vals = EPOCHS.map((e) => e.values[axisIdx]);
  return sparklinePath(vals, w, h);
}

/* ══════════════════════════════════════════════════════════════════ */
export default function RecursiveLiberationEngine() {
  const { lang } = useLang();

  const [activeIdx, setActiveIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const playTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* Animated bar values */
  const fromValsRef = useRef<number[]>(EPOCHS[0].values.slice());
  const toValsRef = useRef<number[]>(EPOCHS[0].values.slice());
  const displayValsRef = useRef<number[]>(EPOCHS[0].values.slice());
  const animRafRef = useRef<number | null>(null);
  const [renderKey, setRenderKey] = useState(0);

  /* Morph animation on epoch change */
  useEffect(() => {
    const target = EPOCHS[activeIdx].values;
    fromValsRef.current = displayValsRef.current.slice();
    toValsRef.current = target.slice();
    const DURATION = 500;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const p = Math.min(elapsed / DURATION, 1);
      const te = easeInOut(p);
      displayValsRef.current = fromValsRef.current.map((from, i) =>
        lerp(from, toValsRef.current[i], te)
      );
      setRenderKey((k) => k + 1);
      if (p < 1) animRafRef.current = requestAnimationFrame(tick);
    }
    if (animRafRef.current !== null) cancelAnimationFrame(animRafRef.current);
    animRafRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRafRef.current !== null) cancelAnimationFrame(animRafRef.current);
    };
  }, [activeIdx]);

  /* Auto-advance */
  useEffect(() => {
    if (playing) {
      playTimerRef.current = setInterval(() => {
        setActiveIdx((prev) => (prev + 1) % EPOCHS.length);
      }, 1800);
    } else {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    }
    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [playing]);

  useEffect(() => {
    return () => {
      if (animRafRef.current !== null) cancelAnimationFrame(animRafRef.current);
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, []);

  const epoch = EPOCHS[activeIdx];
  const vals = displayValsRef.current;
  const epochScore = meanScore(vals);
  const epochColor = EPOCH_COLORS[activeIdx];
  const allScores = EPOCHS.map((e) => meanScore(e.values));
  const isPlanetary = epoch.id === "planetary";

  /* Trajectory chart geometry */
  const trajW = 340;
  const trajH = 48;
  // axis 1 = empathy expansion, axis 2 = reduction of suffering
  const { path: empathyPath, pts: empathyPts } = twoAxisPath(1, trajW, trajH);
  const { path: reductionPath, pts: reductionPts } = twoAxisPath(2, trajW, trajH);

  /* Sparkline for overall score trajectory */
  const sparkW = 340;
  const sparkH = 44;
  const { path: sparkPath, pts: sparkPts } = sparklinePath(allScores, sparkW, sparkH);

  return (
    <div className="flex flex-col items-center gap-6 px-2 py-4 w-full">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="text-center space-y-1">
        <p className="label-mono text-amethyst-400 text-xs tracking-widest uppercase">
          <T v={{ en: "8-Epoch Simulation", zh: "八纪元模拟" }} />
        </p>
        <h2 className="display text-2xl md:text-3xl text-bone-50 leading-tight">
          <T v={{ en: "Recursive Liberation Engine", zh: "递归解脱引擎" }} />
        </h2>
        <p className="text-bone-500 text-sm max-w-md mx-auto font-serif">
          <T
            v={{
              en: "The same eight forces, recursing forward across eight scales of mind — from nerve to planet.",
              zh: "同一八种力量，在八个心智尺度上向前递归——从神经到行星。",
            }}
          />
        </p>
      </div>

      {/* ── Timeline stepper ────────────────────────────────────── */}
      <div className="w-full max-w-2xl">
        <div className="relative flex items-center justify-between gap-0 overflow-x-auto pb-2 px-1">
          {/* Base spine */}
          <div
            className="absolute top-5 left-8 right-8 h-px pointer-events-none"
            style={{
              background: `linear-gradient(to right, ${C.ember400}33, ${C.amethyst400}55, ${C.bodhi400}44)`,
            }}
          />
          {/* Progress fill */}
          <div
            className="absolute top-5 left-8 h-px pointer-events-none transition-all duration-700"
            style={{
              background: `linear-gradient(to right, ${C.ember400}cc, ${epochColor}bb)`,
              width: `calc(${(activeIdx / (EPOCHS.length - 1)) * 100}% - 2rem)`,
              boxShadow: `0 0 6px 1px ${epochColor}55`,
            }}
          />

          {EPOCHS.map((ep, i) => {
            const active = i === activeIdx;
            const past = i < activeIdx;
            const epColor = EPOCH_COLORS[i];
            const isLast = i === EPOCHS.length - 1;
            return (
              <button
                key={ep.id}
                onClick={() => {
                  setActiveIdx(i);
                  setPlaying(false);
                }}
                title={ep.label[lang]}
                className="relative flex flex-col items-center gap-1.5 flex-shrink-0 z-10"
                style={{ minWidth: 52, padding: "0 4px" }}
              >
                <div
                  className="w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300"
                  style={{
                    borderColor: active ? epColor : past ? `${epColor}66` : C.void600,
                    background: active
                      ? `radial-gradient(circle at 40% 40%, ${epColor}44, ${epColor}18)`
                      : past
                      ? `${epColor}18`
                      : C.void800,
                    boxShadow: active
                      ? `0 0 ${isLast ? 24 : 16}px -2px ${epColor}${isLast ? "aa" : "66"}`
                      : "none",
                    transform: active ? "scale(1.15)" : "scale(1)",
                  }}
                >
                  <span
                    className="font-mono text-[0.6rem] font-bold"
                    style={{
                      color: active ? epColor : past ? `${epColor}99` : C.bone500,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <span
                  className={`text-center leading-tight ${lang === "zh" ? "zh" : ""} lang-fade`}
                  style={{
                    fontSize: lang === "zh" ? "0.6rem" : "0.56rem",
                    color: active ? epColor : past ? C.bone300 : C.bone500,
                    fontFamily: lang === "zh"
                      ? "Noto Serif SC, serif"
                      : "Fraunces, ui-serif, serif",
                    maxWidth: 52,
                    transition: "color 0.3s",
                  }}
                >
                  <span key={lang}>{ep.label[lang]}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Play controls ───────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setPlaying((p) => !p)}
          className="flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 text-xs font-mono"
          style={{
            borderColor: playing ? epochColor : C.void600,
            background: playing ? `${epochColor}18` : C.void800,
            color: playing ? epochColor : C.bone500,
            boxShadow: playing ? `0 0 14px -4px ${epochColor}44` : "none",
          }}
        >
          {playing ? (
            <>
              <PauseIcon />
              <T v={{ en: "Pause", zh: "暂停" }} />
            </>
          ) : (
            <>
              <PlayIcon />
              <T v={{ en: "Play", zh: "播放" }} />
            </>
          )}
        </button>
        <span className="text-bone-500 text-xs font-mono">
          {activeIdx + 1} / {EPOCHS.length}
        </span>
        <button
          onClick={() => {
            setPlaying(false);
            setActiveIdx(0);
          }}
          className="text-xs font-mono text-bone-500 hover:text-bone-300 transition-colors px-2 py-1 rounded border border-void-600 hover:border-void-500"
        >
          ↺
        </button>
      </div>

      {/* ── Active epoch card ────────────────────────────────────── */}
      <div
        className="w-full max-w-2xl rounded-2xl overflow-hidden"
        style={{
          background: isPlanetary
            ? `linear-gradient(135deg, ${C.void800}f0, ${C.void700}cc, ${C.bodhi500}0a)`
            : `linear-gradient(135deg, ${C.void800}f0, ${C.void700}cc)`,
          border: `1px solid ${epochColor}${isPlanetary ? "44" : "28"}`,
          boxShadow: `0 0 ${isPlanetary ? 60 : 40}px -12px ${epochColor}${isPlanetary ? "66" : "44"}, inset 0 1px 0 ${epochColor}18`,
        }}
      >
        {/* Card header */}
        <div
          className="px-6 py-4 border-b flex items-start justify-between gap-4"
          style={{ borderColor: `${epochColor}18` }}
        >
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full breathe-soft"
                style={{
                  background: epochColor,
                  boxShadow: `0 0 6px 2px ${epochColor}66`,
                }}
              />
              <span className="label-mono text-xs" style={{ color: epochColor }}>
                <span key={lang} className={`lang-fade ${lang === "zh" ? "zh" : ""}`}>
                  {epoch.scale[lang]}
                </span>
              </span>
            </div>
            <h3
              className="display text-xl md:text-2xl"
              style={{
                color: isPlanetary ? C.bodhi300 : C.bone50,
                textShadow: isPlanetary ? `0 0 32px ${C.bodhi500}66` : "none",
              }}
            >
              <span key={lang} className={`lang-fade ${lang === "zh" ? "zh" : ""}`}>
                {epoch.label[lang]}
              </span>
            </h3>
          </div>
          {/* Score badge */}
          <div
            className="flex-shrink-0 w-14 h-14 rounded-full border-2 grid place-items-center"
            style={{
              borderColor: epochColor,
              background: `${epochColor}14`,
              boxShadow: isPlanetary ? `0 0 20px -4px ${epochColor}66` : "none",
            }}
          >
            <span
              className="font-mono text-lg font-bold"
              style={{ color: epochColor }}
            >
              {epochScore}
            </span>
          </div>
        </div>

        {/* Card body */}
        <div className="px-6 py-5 grid md:grid-cols-2 gap-6">
          {/* Left: text content */}
          <div className="space-y-4">
            {/* Summary */}
            <div>
              <p className="label-mono text-xs text-bone-500 mb-1.5">
                <T v={{ en: "Summary", zh: "概述" }} />
              </p>
              <p
                className={`text-bone-300 text-sm leading-relaxed font-serif ${lang === "zh" ? "zh" : ""}`}
              >
                <span key={lang} className="lang-fade">{epoch.summary[lang]}</span>
              </p>
            </div>

            {/* Carrier */}
            <div>
              <p className="label-mono text-xs text-bone-500 mb-1.5">
                <T v={{ en: "Carrier", zh: "载体" }} />
              </p>
              <p
                className={`text-sm font-mono ${lang === "zh" ? "zh" : ""}`}
                style={{ color: epochColor }}
              >
                <span key={lang} className="lang-fade">{epoch.carrier[lang]}</span>
              </p>
            </div>

            {/* Risk */}
            <div
              className="rounded-xl px-4 py-3"
              style={{
                background: `linear-gradient(135deg, ${C.ember500}14, ${C.ember500}08)`,
                border: `1px solid ${C.ember500}28`,
              }}
            >
              <p className="label-mono text-xs mb-1.5" style={{ color: C.ember300 }}>
                <T v={{ en: "Risk", zh: "风险" }} />
              </p>
              <p
                className={`text-sm leading-snug font-serif ${lang === "zh" ? "zh" : ""}`}
                style={{ color: C.ember300 }}
              >
                <span key={lang} className="lang-fade">{epoch.risk[lang]}</span>
              </p>
            </div>
          </div>

          {/* Right: 8 animated bars */}
          <div className="space-y-2.5">
            <p className="label-mono text-xs text-bone-500 mb-3">
              <T v={{ en: "8-Force Profile", zh: "八力剖面" }} />
            </p>
            {MODEL_AXES.map((axis, i) => {
              const pct = Math.round(vals[i]);
              const axColor = AXIS_COLORS[i];
              return (
                <div key={axis.id} className="space-y-0.5">
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-xs ${lang === "zh" ? "zh" : ""}`}
                      style={{
                        color: C.bone300,
                        fontFamily:
                          lang === "zh"
                            ? "Noto Serif SC, serif"
                            : "IBM Plex Mono, monospace",
                        fontSize: "0.67rem",
                      }}
                    >
                      <span key={lang} className="lang-fade">
                        {axis.short[lang]}
                      </span>
                    </span>
                    <span className="font-mono text-xs" style={{ color: axColor }}>
                      {pct}
                    </span>
                  </div>
                  <div className="relative h-1.5 rounded-full bg-void-700 overflow-hidden">
                    <div
                      className="absolute left-0 top-0 h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        background: `linear-gradient(to right, ${axColor}88, ${axColor})`,
                        boxShadow: `0 0 5px 1px ${axColor}44`,
                        transition: "width 0.05s linear",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Two-axis trajectory chart ─────────────────────────────── */}
      <div
        className="w-full max-w-2xl rounded-2xl px-5 py-5"
        style={{
          background: `linear-gradient(135deg, ${C.void800}cc, ${C.void700}88)`,
          border: `1px solid ${C.void600}`,
        }}
      >
        <p className="label-mono text-xs text-bone-500 mb-1">
          <T v={{ en: "Empathy × Suffering-Reduction Trajectory", zh: "共情扩展 × 苦难削减 轨迹" }} />
        </p>
        <p className="text-bone-500 text-xs font-serif mb-4">
          <T
            v={{
              en: "How two core dimensions rise across all eight scales of mind.",
              zh: "两个核心维度在八个心智尺度上的上升轨迹。",
            }}
          />
        </p>
        <div className="flex gap-4 text-xs font-mono mb-3">
          <span style={{ color: C.lotus400 }}>
            — <T v={{ en: "Empathy Expansion", zh: "共情扩展" }} />
          </span>
          <span style={{ color: C.bodhi400 }}>
            — <T v={{ en: "Reduction of Suffering", zh: "苦难削减" }} />
          </span>
        </div>
        <div className="relative w-full overflow-hidden" style={{ height: trajH + 36 }}>
          <svg
            width="100%"
            height={trajH + 36}
            viewBox={`0 0 ${trajW} ${trajH + 36}`}
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <defs>
              <linearGradient id="traj-empathy" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={C.lotus500} stopOpacity="0.6" />
                <stop offset="100%" stopColor={C.lotus400} stopOpacity="1" />
              </linearGradient>
              <linearGradient id="traj-reduction" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={C.bodhi500} stopOpacity="0.6" />
                <stop offset="100%" stopColor={C.bodhi400} stopOpacity="1" />
              </linearGradient>
            </defs>

            {/* Empathy line */}
            <path
              d={empathyPath}
              fill="none"
              stroke="url(#traj-empathy)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Reduction line */}
            <path
              d={reductionPath}
              fill="none"
              stroke="url(#traj-reduction)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="5 3"
            />

            {/* Empathy dots */}
            {empathyPts.map((p, i) => {
              const active = i === activeIdx;
              return (
                <g key={i}>
                  {active && <circle cx={p.x} cy={p.y} r={9} fill={C.lotus500} opacity={0.15} />}
                  <circle cx={p.x} cy={p.y} r={active ? 4.5 : 3} fill={C.lotus400}
                    opacity={active ? 1 : 0.55} style={{ transition: "r 0.3s" }} />
                </g>
              );
            })}

            {/* Reduction dots */}
            {reductionPts.map((p, i) => {
              const active = i === activeIdx;
              return (
                <g key={i}>
                  {active && <circle cx={p.x} cy={p.y} r={9} fill={C.bodhi500} opacity={0.15} />}
                  <circle cx={p.x} cy={p.y} r={active ? 4.5 : 3} fill={C.bodhi400}
                    opacity={active ? 1 : 0.55} style={{ transition: "r 0.3s" }} />
                </g>
              );
            })}

            {/* Epoch labels below */}
            {empathyPts.map((p, i) => {
              const active = i === activeIdx;
              return (
                <text
                  key={i}
                  x={p.x}
                  y={trajH + 22}
                  fill={active ? EPOCH_COLORS[i] : C.void500}
                  fontSize={lang === "zh" ? 7 : 6.2}
                  fontFamily={lang === "zh" ? "Noto Serif SC, serif" : "Fraunces, ui-serif, serif"}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontWeight={active ? "700" : "400"}
                  style={{ transition: "fill 0.3s" }}
                >
                  {EPOCHS[i].label[lang].slice(0, lang === "zh" ? 2 : 5)}
                </text>
              );
            })}

            {/* Active vertical line */}
            {empathyPts[activeIdx] && (
              <line
                x1={empathyPts[activeIdx].x} y1={0}
                x2={empathyPts[activeIdx].x} y2={trajH}
                stroke={epochColor}
                strokeWidth={1}
                strokeDasharray="3 4"
                opacity={0.4}
              />
            )}
          </svg>
        </div>
      </div>

      {/* ── Overall score sparkline ───────────────────────────────── */}
      <div
        className="w-full max-w-2xl rounded-2xl px-5 py-5"
        style={{
          background: `linear-gradient(135deg, ${C.void800}cc, ${C.void700}88)`,
          border: `1px solid ${C.void600}`,
        }}
      >
        <p className="label-mono text-xs text-bone-500 mb-4">
          <T v={{ en: "Liberation Capacity — Overall Score Trajectory", zh: "解脱能力 · 总分轨迹" }} />
        </p>
        <div className="relative w-full overflow-hidden" style={{ height: sparkH + 36 }}>
          <svg
            width="100%"
            height={sparkH + 36}
            viewBox={`0 0 ${sparkW} ${sparkH + 36}`}
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <defs>
              <linearGradient id="spark-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                {EPOCHS.map((_, i) => (
                  <stop
                    key={i}
                    offset={`${(i / (EPOCHS.length - 1)) * 100}%`}
                    stopColor={EPOCH_COLORS[i]}
                    stopOpacity="0.85"
                  />
                ))}
              </linearGradient>
              <linearGradient id="spark-area" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={C.amethyst400} stopOpacity="0.22" />
                <stop offset="100%" stopColor={C.amethyst400} stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* Area */}
            <path
              d={sparkPath + ` L ${sparkW} ${sparkH + 4} L 0 ${sparkH + 4} Z`}
              fill="url(#spark-area)"
            />
            {/* Line */}
            <path
              d={sparkPath}
              fill="none"
              stroke="url(#spark-grad)"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Epoch dots */}
            {sparkPts.map((p, i) => {
              const active = i === activeIdx;
              const epColor = EPOCH_COLORS[i];
              return (
                <g key={i}>
                  {active && (
                    <circle cx={p.x} cy={p.y} r={11} fill={epColor} opacity={0.12} />
                  )}
                  <circle
                    cx={p.x} cy={p.y}
                    r={active ? 5 : 3.5}
                    fill={epColor}
                    opacity={active ? 1 : 0.55}
                    style={{ transition: "r 0.3s" }}
                  />
                  <text
                    x={p.x} y={p.y - 9}
                    fill={active ? epColor : C.bone500}
                    fontSize={active ? 8.5 : 7}
                    fontFamily="IBM Plex Mono, monospace"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontWeight={active ? "700" : "400"}
                    style={{ transition: "font-size 0.3s" }}
                  >
                    {allScores[i]}
                  </text>
                  <text
                    x={p.x} y={sparkH + 24}
                    fill={active ? epColor : C.void500}
                    fontSize={lang === "zh" ? 7 : 6.2}
                    fontFamily={lang === "zh" ? "Noto Serif SC, serif" : "Fraunces, ui-serif, serif"}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontWeight={active ? "700" : "400"}
                    style={{ transition: "fill 0.3s" }}
                  >
                    {EPOCHS[i].label[lang].slice(0, lang === "zh" ? 2 : 5)}
                  </text>
                </g>
              );
            })}

            {/* Active vertical line */}
            {sparkPts[activeIdx] && (
              <line
                x1={sparkPts[activeIdx].x} y1={0}
                x2={sparkPts[activeIdx].x} y2={sparkH}
                stroke={epochColor}
                strokeWidth={1}
                strokeDasharray="3 4"
                opacity={0.4}
              />
            )}
          </svg>
        </div>
        <p className="text-bone-500 text-xs font-serif mt-2 text-center">
          <T
            v={{
              en: "Score dips at Biology and Digital epochs; culminates at Planetary consciousness.",
              zh: "分数在生物与数字纪元低落；在行星意识纪元达到顶峰。",
            }}
          />
        </p>
      </div>

      {/* ── All-epochs mini grid ─────────────────────────────────── */}
      <div className="w-full max-w-2xl">
        <p className="label-mono text-xs text-bone-500 mb-3 text-center">
          <T v={{ en: "All Eight Epochs", zh: "全部八纪元" }} />
        </p>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
          {EPOCHS.map((ep, i) => {
            const active = i === activeIdx;
            const epColor = EPOCH_COLORS[i];
            const sc = allScores[i];
            const isLast = i === EPOCHS.length - 1;
            return (
              <button
                key={ep.id}
                onClick={() => {
                  setActiveIdx(i);
                  setPlaying(false);
                }}
                className="flex flex-col items-center gap-1 py-2 px-1 rounded-xl border transition-all duration-200"
                style={{
                  borderColor: active ? epColor : C.void600,
                  background: active ? `${epColor}14` : C.void800,
                  boxShadow: active
                    ? `0 0 ${isLast ? 20 : 14}px -4px ${epColor}${isLast ? "88" : "55"}`
                    : "none",
                }}
              >
                <MiniArc score={sc} color={epColor} active={active} />
                <span
                  className={`text-center leading-tight ${lang === "zh" ? "zh" : ""} lang-fade`}
                  style={{
                    fontSize: lang === "zh" ? "0.58rem" : "0.52rem",
                    color: active ? epColor : C.bone500,
                    fontFamily: lang === "zh"
                      ? "Noto Serif SC, serif"
                      : "Fraunces, ui-serif, serif",
                    transition: "color 0.3s",
                  }}
                >
                  <span key={lang}>{ep.label[lang]}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Planetary culmination banner ─────────────────────────── */}
      {isPlanetary && (
        <div
          className="w-full max-w-2xl rounded-2xl px-6 py-5 text-center"
          style={{
            background: `linear-gradient(135deg, ${C.void800}f0, ${C.bodhi500}0f, ${C.amethyst500}0a)`,
            border: `1px solid ${C.bodhi500}44`,
            boxShadow: `0 0 48px -12px ${C.bodhi500}44`,
          }}
        >
          <div
            className="display text-base mb-2"
            style={{ color: C.bodhi300, textShadow: `0 0 24px ${C.bodhi500}88` }}
          >
            <T v={{ en: "The Culmination", zh: "顶点" }} />
          </div>
          <p className={`text-bone-300 text-sm leading-relaxed font-serif ${lang === "zh" ? "zh" : ""}`}>
            <T
              v={{
                en: "Survival requires reducing suffering and extending trust past the horizon of kin to a whole world of minds. The same eight forces — run now at planetary scale — become civilisational infrastructure for liberation.",
                zh: "生存开始要求：削减苦难，并把信任延展到血亲地平线之外，及于整个心智之世界。同一八种力量——如今在行星尺度上运行——成为解脱的文明基础设施。",
              }}
            />
          </p>
        </div>
      )}
    </div>
  );
}

/* ── Mini arc badge ──────────────────────────────────────────────── */
function MiniArc({
  score,
  color,
  active,
}: {
  score: number;
  color: string;
  active: boolean;
}) {
  const r = 13;
  const circ = 2 * Math.PI * r;
  const pct = score / 100;
  return (
    <svg width={34} height={34} viewBox="0 0 34 34">
      <circle cx={17} cy={17} r={r} fill="none" stroke={`${color}22`} strokeWidth={3} />
      <circle
        cx={17} cy={17} r={r}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeDasharray={`${circ * pct} ${circ * (1 - pct)}`}
        strokeDashoffset={circ * 0.25}
        strokeLinecap="round"
        opacity={active ? 1 : 0.5}
        style={{ transition: "stroke-dasharray 0.6s" }}
      />
      <text
        x={17} y={17}
        fill={active ? color : `${color}bb`}
        fontSize={8}
        fontFamily="IBM Plex Mono, monospace"
        textAnchor="middle"
        dominantBaseline="middle"
        fontWeight="700"
      >
        {score}
      </text>
    </svg>
  );
}

/* ── Icon components ─────────────────────────────────────────────── */
function PlayIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 14 14" fill="currentColor">
      <polygon points="3,2 12,7 3,12" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 14 14" fill="currentColor">
      <rect x="2" y="2" width="4" height="10" rx="1" />
      <rect x="8" y="2" width="4" height="10" rx="1" />
    </svg>
  );
}
