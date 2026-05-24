"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useLang, T, t } from "./lang";
import { MODEL_AXES, CIV_PROFILES } from "./content";

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
};

/* One accent per axis — 8 axes */
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

/* ── Math helpers ─────────────────────────────────────────────────── */
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
function polarToXY(angle: number, r: number, cx: number, cy: number) {
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}
function axisAngle(i: number, n: number) {
  // top (−π/2) clockwise
  return -Math.PI / 2 + (2 * Math.PI * i) / n;
}
function pointsToPath(pts: { x: number; y: number }[]) {
  return (
    pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" ") +
    " Z"
  );
}

const N = MODEL_AXES.length; // 8

/* ══════════════════════════════════════════════════════════════════ */
export default function LiberationModel() {
  const { lang } = useLang();

  const [selectedIdx, setSelectedIdx] = useState(3); // "Modern open society"
  const [compareIdx, setCompareIdx] = useState<number | null>(null);
  const [hoveredAxis, setHoveredAxis] = useState<number | null>(null);

  /* Animated display values */
  const fromValsRef = useRef<number[]>(CIV_PROFILES[3].values.slice());
  const toValsRef = useRef<number[]>(CIV_PROFILES[3].values.slice());
  const displayValsRef = useRef<number[]>(CIV_PROFILES[3].values.slice());
  const animRef = useRef<number | null>(null);
  const [renderKey, setRenderKey] = useState(0);

  /* ResizeObserver for responsive SVG */
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(480);

  useEffect(() => {
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      setSize(Math.min(Math.max(w, 280), 560));
    });
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  /* Morph animation */
  useEffect(() => {
    const target = CIV_PROFILES[selectedIdx].values;
    fromValsRef.current = displayValsRef.current.slice();
    toValsRef.current = target.slice();
    const DURATION = 600;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const p = Math.min(elapsed / DURATION, 1);
      const te = easeInOut(p);
      displayValsRef.current = fromValsRef.current.map((from, i) =>
        lerp(from, toValsRef.current[i], te)
      );
      setRenderKey((k) => k + 1);
      if (p < 1) animRef.current = requestAnimationFrame(tick);
    }
    if (animRef.current !== null) cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
    };
  }, [selectedIdx]);

  /* Derived */
  const profile = CIV_PROFILES[selectedIdx];
  const vals = displayValsRef.current;
  const score = Math.round(vals.reduce((s, v) => s + v, 0) / N);

  /* SVG geometry */
  const pad = size * 0.19;
  const cx = size / 2;
  const cy = size / 2;
  const R = (size - 2 * pad) / 2;
  const rings = [0.25, 0.5, 0.75, 1.0];

  function polyPoints(vs: number[]) {
    return vs.map((v, i) => {
      const angle = axisAngle(i, N);
      const r = (v / 100) * R;
      return polarToXY(angle, r, cx, cy);
    });
  }

  const axisEnds = MODEL_AXES.map((_, i) => polarToXY(axisAngle(i, N), R, cx, cy));
  const polyPts = polyPoints(vals);
  const polyPath = pointsToPath(polyPts);

  /* Compare overlay */
  const comparePts = compareIdx !== null ? polyPoints(CIV_PROFILES[compareIdx].values) : null;
  const comparePath = comparePts ? pointsToPath(comparePts) : null;

  /* Hover detection */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      let closest: number | null = null;
      let minD = 28;
      [...polyPts, ...axisEnds].forEach((p, rawI) => {
        const i = rawI % N;
        const d = Math.hypot(mx - p.x, my - p.y);
        if (d < minD) { minD = d; closest = i; }
      });
      setHoveredAxis(closest);
    },
    [polyPts, axisEnds]
  );

  const handleMouseLeave = useCallback(() => setHoveredAxis(null), []);

  /* Profile chip colours — aspirational gets bodhi glow */
  function chipStyle(i: number) {
    const active = i === selectedIdx;
    const isAwakened = CIV_PROFILES[i].id === "awakened";
    const activeColor = isAwakened ? C.bodhi400 : C.amethyst400;
    return active
      ? {
          borderColor: `${activeColor}80`,
          background: `${activeColor}18`,
          color: active && isAwakened ? C.bodhi300 : C.amethyst300,
          boxShadow: `0 0 12px -2px ${activeColor}44`,
        }
      : {
          borderColor: C.void600,
          background: `${C.void800}99`,
          color: C.bone500,
        };
  }

  const gradId = "lmodel-fill";
  const strokeGradId = "lmodel-stroke";
  const cmpGradId = "lmodel-cmp";

  return (
    <div className="flex flex-col items-center gap-6 px-2 py-4 w-full">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="text-center space-y-1">
        <p className="label-mono text-bodhi-400 text-xs tracking-widest uppercase">
          <T v={{ en: "8-Axis Meta-Model", zh: "八轴元模型" }} />
        </p>
        <h2 className="display text-2xl md:text-3xl text-bone-50 leading-tight">
          <T v={{ en: "Civilizational Compassion Stability", zh: "文明慈悲稳定性" }} />
        </h2>
        <p className="text-bone-500 text-sm max-w-md mx-auto font-serif">
          <T
            v={{
              en: "Eight forces that determine how well a civilisation reduces suffering and expands compassion.",
              zh: "八种力量，共同决定一个文明减少苦难、扩展慈悲的能力。",
            }}
          />
        </p>
      </div>

      {/* ── Profile selector ────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 justify-center">
        {CIV_PROFILES.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setSelectedIdx(i)}
            className="px-3 py-1.5 rounded-full border text-xs transition-all duration-200 font-mono"
            style={chipStyle(i)}
          >
            <span key={lang} className={`lang-fade ${lang === "zh" ? "zh" : ""}`}>
              {p.label[lang]}
            </span>
          </button>
        ))}
      </div>

      {/* ── Compare overlay toggle ───────────────────────────────── */}
      <div className="flex flex-wrap gap-2 justify-center items-center">
        <span className="text-bone-500 text-xs font-mono">
          <T v={{ en: "Compare:", zh: "叠加对比：" }} />
        </span>
        {CIV_PROFILES.map((p, i) =>
          i === selectedIdx ? null : (
            <button
              key={p.id}
              onClick={() => setCompareIdx(compareIdx === i ? null : i)}
              className="px-2.5 py-1 rounded-full border text-xs transition-all duration-200 font-mono"
              style={{
                borderColor: compareIdx === i ? `${C.ember400}80` : C.void600,
                background: compareIdx === i ? `${C.ember500}18` : `${C.void800}99`,
                color: compareIdx === i ? C.ember300 : C.bone500,
              }}
            >
              <span key={lang} className={`lang-fade ${lang === "zh" ? "zh" : ""}`}>
                {p.label[lang]}
              </span>
            </button>
          )
        )}
      </div>

      {/* ── Radar SVG ───────────────────────────────────────────── */}
      <div className="w-full max-w-[560px] flex flex-col items-center gap-4">
        <div ref={containerRef} className="w-full relative">
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="w-full h-auto select-none"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ touchAction: "none" }}
          >
            <defs>
              <radialGradient id={gradId} cx="50%" cy="50%" r="70%">
                <stop offset="0%" stopColor={C.amethyst500} stopOpacity="0.38" />
                <stop offset="45%" stopColor={C.bodhi500} stopOpacity="0.22" />
                <stop offset="100%" stopColor={C.jade500} stopOpacity="0.14" />
              </radialGradient>
              <linearGradient id={strokeGradId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={C.bodhi400} />
                <stop offset="40%" stopColor={C.amethyst400} />
                <stop offset="100%" stopColor={C.jade400} />
              </linearGradient>
              <linearGradient id={cmpGradId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={C.ember400} />
                <stop offset="100%" stopColor={C.ember300} />
              </linearGradient>
              <filter id="lmodel-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Grid rings (octagonal) */}
            {rings.map((frac, ri) => {
              const ringR = frac * R;
              const pts = MODEL_AXES.map((_, i) => polarToXY(axisAngle(i, N), ringR, cx, cy));
              const ringPath = pointsToPath(pts);
              return (
                <path
                  key={ri}
                  d={ringPath}
                  fill="none"
                  stroke={ri === rings.length - 1 ? C.void600 : C.void700}
                  strokeWidth={ri === rings.length - 1 ? 1 : 0.7}
                  strokeDasharray={ri < rings.length - 1 ? "3 5" : undefined}
                  opacity={0.5}
                />
              );
            })}

            {/* Ring labels */}
            {rings.map((frac, ri) => {
              const p = polarToXY(axisAngle(0, N) - 0.14, frac * R, cx, cy);
              return (
                <text
                  key={ri}
                  x={p.x}
                  y={p.y}
                  fill={C.void600}
                  fontSize={Math.round(size * 0.022)}
                  fontFamily="IBM Plex Mono, monospace"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  opacity={0.55}
                >
                  {Math.round(frac * 100)}
                </text>
              );
            })}

            {/* Axis spokes */}
            {axisEnds.map((end, i) => (
              <line
                key={i}
                x1={cx} y1={cy} x2={end.x} y2={end.y}
                stroke={AXIS_COLORS[i]}
                strokeWidth={0.8}
                strokeDasharray="3 6"
                opacity={hoveredAxis === i ? 0.7 : 0.28}
                style={{ transition: "opacity 0.2s" }}
              />
            ))}

            {/* Compare overlay polygon */}
            {comparePath && (
              <>
                <path
                  d={comparePath}
                  fill={C.ember500}
                  fillOpacity={0.08}
                />
                <path
                  d={comparePath}
                  fill="none"
                  stroke={C.ember400}
                  strokeWidth={1.5}
                  strokeLinejoin="round"
                  strokeDasharray="5 3"
                  opacity={0.65}
                />
              </>
            )}

            {/* Primary polygon fill */}
            <path
              key={`fill-${renderKey}`}
              d={polyPath}
              fill={`url(#${gradId})`}
              opacity={0.88}
            />

            {/* Primary polygon stroke (glowing) */}
            <path
              key={`stroke-${renderKey}`}
              d={polyPath}
              fill="none"
              stroke={`url(#${strokeGradId})`}
              strokeWidth={2.4}
              strokeLinejoin="round"
              filter="url(#lmodel-glow)"
              opacity={0.92}
            />

            {/* Axis vertex dots */}
            {polyPts.map((p, i) => {
              const col = AXIS_COLORS[i];
              const hov = hoveredAxis === i;
              return (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r={hov ? 10 : 5.5} fill={col} opacity={0.18}
                    style={{ transition: "r 0.2s" }} />
                  <circle cx={p.x} cy={p.y} r={hov ? 5.5 : 3.5} fill={col} opacity={0.92}
                    style={{ transition: "r 0.2s" }} />
                  {hov && (
                    <text
                      x={p.x + (p.x > cx ? 14 : -14)}
                      y={p.y + (p.y > cy ? 12 : -6)}
                      fill={col}
                      fontSize={Math.round(size * 0.033)}
                      fontFamily="IBM Plex Mono, monospace"
                      textAnchor={p.x > cx ? "start" : "end"}
                      dominantBaseline="middle"
                      fontWeight="700"
                    >
                      {Math.round(vals[i])}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Compare vertex dots */}
            {comparePts &&
              comparePts.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r={3} fill={C.ember400} opacity={0.65} />
              ))}

            {/* Axis labels */}
            {MODEL_AXES.map((axis, i) => {
              const angle = axisAngle(i, N);
              const labelR = R + size * 0.08;
              const lp = polarToXY(angle, labelR, cx, cy);
              const isRight = lp.x > cx + 8;
              const isLeft = lp.x < cx - 8;
              const anchor = isRight ? "start" : isLeft ? "end" : "middle";
              const hov = hoveredAxis === i;
              const useShort = size < 380;
              const labelText = lang === "zh" ? axis.label.zh : axis.label.en;
              const shortText = lang === "zh" ? axis.short.zh : axis.short.en;
              return (
                <text
                  key={i}
                  x={lp.x}
                  y={lp.y}
                  fill={hov ? AXIS_COLORS[i] : C.bone300}
                  fontSize={Math.round(size * (useShort ? 0.038 : 0.029))}
                  fontFamily={
                    lang === "zh"
                      ? "Noto Serif SC, serif"
                      : "Fraunces, ui-serif, serif"
                  }
                  textAnchor={anchor}
                  dominantBaseline="middle"
                  fontWeight={hov ? "700" : "400"}
                  style={{ cursor: "default", transition: "fill 0.2s" }}
                >
                  {useShort ? shortText : labelText}
                </text>
              );
            })}

            {/* Centre score */}
            <text
              x={cx} y={cy - size * 0.025}
              fill={C.bodhi400}
              fontSize={Math.round(size * 0.072)}
              fontFamily="Fraunces, ui-serif, serif"
              textAnchor="middle"
              dominantBaseline="middle"
              opacity={0.93}
            >
              {score}
            </text>
            <text
              x={cx} y={cy + size * 0.055}
              fill={C.bone500}
              fontSize={Math.round(size * 0.025)}
              fontFamily="IBM Plex Mono, monospace"
              textAnchor="middle"
              dominantBaseline="middle"
              opacity={0.65}
            >
              / 100
            </text>
          </svg>

          {/* Hover tooltip */}
          {hoveredAxis !== null && (
            <div
              className="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 px-4 py-3 rounded-xl max-w-xs text-center"
              style={{
                background: `linear-gradient(135deg, ${C.void800}f0, ${C.void700}e0)`,
                border: `1px solid ${AXIS_COLORS[hoveredAxis]}44`,
                boxShadow: `0 0 28px -6px ${AXIS_COLORS[hoveredAxis]}55`,
                zIndex: 20,
              }}
            >
              <div
                className="text-xs font-mono font-semibold mb-1.5"
                style={{ color: AXIS_COLORS[hoveredAxis] }}
              >
                <span key={lang} className={`lang-fade ${lang === "zh" ? "zh" : ""}`}>
                  {MODEL_AXES[hoveredAxis].label[lang]}
                </span>
                <span className="ml-2 opacity-60 text-bone-300">
                  {Math.round(vals[hoveredAxis])}
                </span>
              </div>
              <p
                className={`text-bone-300 text-xs leading-snug font-serif ${lang === "zh" ? "zh" : ""}`}
              >
                <span key={lang} className="lang-fade">
                  {MODEL_AXES[hoveredAxis].def[lang]}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* ── Score bar ────────────────────────────────────────── */}
        <div className="w-full max-w-sm space-y-2">
          <div className="flex justify-between items-center">
            <span className="label-mono text-bone-500 text-xs">
              <T v={{ en: "Civilizational Compassion Score", zh: "文明慈悲总分" }} />
            </span>
            <span className="font-mono text-bodhi-300 text-sm font-bold">{score}</span>
          </div>
          <div className="relative h-2 rounded-full bg-void-700 overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
              style={{
                width: `${score}%`,
                background: `linear-gradient(to right, ${C.jade500}, ${C.bodhi500}, ${C.amethyst400})`,
                boxShadow: `0 0 10px 1px ${C.bodhi500}66`,
              }}
            />
          </div>
        </div>

        {/* ── Profile note ─────────────────────────────────────── */}
        <div
          className="rounded-2xl px-5 py-4 w-full max-w-sm text-center"
          style={{
            background: `linear-gradient(135deg, ${C.void800}cc, ${C.void700}99)`,
            border: `1px solid ${C.bodhi500}22`,
          }}
        >
          <div
            className="display text-base mb-1.5"
            style={{ color: C.bodhi300 }}
          >
            <span key={lang} className={`lang-fade ${lang === "zh" ? "zh" : ""}`}>
              {profile.label[lang]}
            </span>
          </div>
          <p
            className={`text-bone-300 text-sm leading-relaxed font-serif ${lang === "zh" ? "zh" : ""}`}
          >
            <span key={lang} className="lang-fade">
              {profile.note[lang]}
            </span>
          </p>
        </div>

        {/* ── Per-axis legend ──────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 w-full max-w-sm">
          {MODEL_AXES.map((axis, i) => {
            const pct = Math.round(vals[i]);
            const col = AXIS_COLORS[i];
            const hov = hoveredAxis === i;
            return (
              <div
                key={axis.id}
                className="flex items-center gap-2 cursor-default"
                onMouseEnter={() => setHoveredAxis(i)}
                onMouseLeave={() => setHoveredAxis(null)}
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: col, boxShadow: `0 0 5px 1px ${col}66` }}
                />
                <span
                  className={`text-xs truncate flex-1 transition-colors ${hov ? "text-bone-100" : "text-bone-500"}`}
                  style={{
                    fontFamily:
                      lang === "zh" ? "Noto Serif SC, serif" : undefined,
                  }}
                >
                  <span key={lang} className="lang-fade">
                    {axis.label[lang]}
                  </span>
                </span>
                <span
                  className="font-mono text-xs"
                  style={{ color: col, minWidth: 24, textAlign: "right" }}
                >
                  {pct}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
