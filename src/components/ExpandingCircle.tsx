"use client";

import { useState, useId, useEffect, useRef } from "react";
import { MORAL_RINGS, MoralRing } from "./content";
import { useLang, T, t } from "./lang";

// ── Palette hex values ────────────────────────────────────────────────────────
const HEX = {
  bodhi500:    "#f4c25a",
  bodhi400:    "#ffd584",
  bodhi300:    "#ffe7b0",
  jade500:     "#4fd6c0",
  jade400:     "#82e3d3",
  jade300:     "#aeefe4",
  amethyst500: "#9d8bf0",
  amethyst400: "#b8aaf6",
  amethyst300: "#d4cbfb",
  lotus500:    "#ef84b1",
  lotus400:    "#f6abc8",
  void950:     "#070611",
  void900:     "#0c0a1c",
  void800:     "#141128",
  void700:     "#1d1938",
  void600:     "#2a2550",
  bone50:      "#fbf6ee",
  bone100:     "#f3ebdf",
  bone300:     "#d6c9b8",
  bone500:     "#9b8d79",
};

function hexAlpha(hex: string, a: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a.toFixed(3)})`;
}

// ── Ring color progression: bodhi-gold center → jade → amethyst outer ────────
// We have 7 rings (index 0 = self, 6 = future/possible minds)
function ringColor(idx: number): string {
  // 0–1: bodhi, 2–3: jade, 4–6: amethyst
  if (idx <= 1) return HEX.bodhi500;
  if (idx <= 3) return HEX.jade500;
  return HEX.amethyst500;
}
function ringColorLight(idx: number): string {
  if (idx <= 1) return HEX.bodhi300;
  if (idx <= 3) return HEX.jade300;
  return HEX.amethyst300;
}

// ── SVG constants ─────────────────────────────────────────────────────────────
const VB      = 340;
const CX      = VB / 2;
const CY      = VB / 2;
const MAX_R   = 148;   // outermost ring absolute radius
const MIN_R   = 14;    // self (innermost) radius

// Map ring.radius (0–100) → SVG radius, with a non-linear curve so inner rings
// have visible thickness.
function svgR(radiusPct: number): number {
  // sqrt for nicer area distribution + ensure minimum
  const t = Math.sqrt(Math.max(radiusPct, 0) / 100);
  return MIN_R + t * (MAX_R - MIN_R);
}

// ── Ease functions ────────────────────────────────────────────────────────────
function easeOutCubic(p: number) { return 1 - Math.pow(1 - p, 3); }

// ── Component ─────────────────────────────────────────────────────────────────
export default function ExpandingCircle() {
  const { lang } = useLang();
  const uid = useId();
  const svgUid = uid.replace(/:/g, "");

  // Slider value (moral imagination): 0–100
  const [slider, setSlider] = useState<number>(50);
  // Active ring clicked
  const [activeRing, setActiveRing] = useState<string | null>(null);
  // Animation: intro self-draw
  const [drawProg, setDrawProg] = useState<number>(0);
  const rafRef   = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  const selectedRing = MORAL_RINGS.find((r) => r.id === activeRing) ?? null;

  // On mount, animate the circle expanding outward (0 → 1 over 1.6s)
  useEffect(() => {
    const ANIM_MS = 1600;
    let cancelled = false;
    function step(now: number) {
      if (cancelled) return;
      if (startRef.current === null) startRef.current = now;
      const p = Math.min((now - startRef.current) / ANIM_MS, 1);
      setDrawProg(easeOutCubic(p));
      if (p < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    }
    rafRef.current = requestAnimationFrame(step);
    return () => {
      cancelled = true;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Determine which ring the slider currently "reaches":
  // slider maps from 0 (only self) to 100 (all future minds).
  // Ring i is "reached" if its radius <= slider * 1.0, adjusted so that
  // at slider=0 only self is reached and at slider=100 everything is reached.
  function sliderReaches(ring: MoralRing): boolean {
    return ring.radius <= slider;
  }

  // The outermost ring whose radius <= slider (for the readout label)
  const reachedRings = MORAL_RINGS.filter((r) => sliderReaches(r));
  const currentReachRing = reachedRings[reachedRings.length - 1] ?? MORAL_RINGS[0];
  const currentReachIdx  = MORAL_RINGS.indexOf(currentReachRing);

  // For each ring compute its effective brightness: combine drawProg + slider
  function ringOpacity(ring: MoralRing, idx: number): number {
    // Base opacity from counted (how widely it counts today)
    const baseFill = 0.08 + (ring.counted / 100) * 0.32;
    // Slider brightening: rings within reach are lit up
    const sliderBoost = sliderReaches(ring) ? 0.22 + (ring.counted / 100) * 0.18 : 0;
    const total = baseFill + sliderBoost;
    return total * drawProg;
  }

  function ringStrokeOpacity(ring: MoralRing, idx: number): number {
    const base = 0.18 + (ring.counted / 100) * 0.32;
    const boost = sliderReaches(ring) ? 0.30 : 0;
    return (base + boost) * drawProg;
  }

  // For the intro animation: rings draw in from inside out
  // Ring i starts drawing at drawProg > i/total
  const total = MORAL_RINGS.length;
  function ringDrawProg(idx: number): number {
    const start = idx / (total + 1);
    const end   = (idx + 1) / (total + 1);
    if (drawProg <= start) return 0;
    if (drawProg >= end)   return 1;
    return easeOutCubic((drawProg - start) / (end - start));
  }

  // Faint empathy network lines: connect adjacent rings at 45° intervals
  const empathyAngles = [45, 90, 135, 225];

  return (
    <div className="w-full space-y-5 select-none">

      {/* Caption */}
      <p className="label-mono text-[0.6rem] tracking-widest" style={{ color: hexAlpha(HEX.bone500, 0.6) }}>
        <T v={{
          en: "moral progress = the expanding set of beings whose suffering counts",
          zh: "道德进步 = 「其苦难算数」的存在集合的扩大",
        }} />
      </p>

      {/* Main layout: circle + panel */}
      <div className="flex flex-col md:flex-row gap-6 items-start">

        {/* ── SVG Circle ──────────────────────────────────────────────────── */}
        <div className="flex-shrink-0 w-full md:w-auto mx-auto md:mx-0" style={{ maxWidth: VB }}>
          <svg
            viewBox={`0 0 ${VB} ${VB}`}
            preserveAspectRatio="xMidYMid meet"
            style={{ width: "100%", display: "block" }}
            role="img"
            aria-label={t({ en: "Expanding moral circle", zh: "扩展的道德之圆" }, lang)}
          >
            <defs>
              {/* Void background */}
              <radialGradient id={`${svgUid}bg`} cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor={HEX.void800} stopOpacity="0.9" />
                <stop offset="100%" stopColor={HEX.void950} stopOpacity="1"   />
              </radialGradient>

              {/* Glow filter */}
              <filter id={`${svgUid}glow`} x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id={`${svgUid}softglow`} x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="7" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background */}
            <circle cx={CX} cy={CY} r={VB / 2} fill={`url(#${svgUid}bg)`} />

            {/* Faint empathy network lines (before rings so they are underneath) */}
            {MORAL_RINGS.slice(0, -1).map((ring, i) => {
              const r1 = svgR(ring.radius);
              const r2 = svgR(MORAL_RINGS[i + 1].radius);
              return empathyAngles.map((angleDeg) => {
                const angle = (angleDeg * Math.PI) / 180;
                const x1 = CX + r1 * Math.cos(angle);
                const y1 = CY + r1 * Math.sin(angle);
                const x2 = CX + r2 * Math.cos(angle);
                const y2 = CY + r2 * Math.sin(angle);
                return (
                  <line
                    key={`net-${i}-${angleDeg}`}
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={hexAlpha(ringColor(i + 1), 0.08 * drawProg)}
                    strokeWidth="0.6"
                    strokeDasharray="2 4"
                  />
                );
              });
            })}

            {/* Rings — rendered outer-to-inner so inner always shows on top */}
            {[...MORAL_RINGS].reverse().map((ring, revIdx) => {
              const idx = MORAL_RINGS.length - 1 - revIdx;
              const r = svgR(ring.radius) * ringDrawProg(idx);
              // Only render once the ring has started to draw
              if (r <= 0) return null;

              const color = ringColor(idx);
              const isActive = ring.id === activeRing;
              const isReached = sliderReaches(ring);
              const fillA = ringOpacity(ring, idx);
              const strokeA = ringStrokeOpacity(ring, idx);

              return (
                <g key={ring.id}>
                  <circle
                    cx={CX} cy={CY}
                    r={r}
                    fill={hexAlpha(color, fillA + (isActive ? 0.12 : 0))}
                    stroke={hexAlpha(color, strokeA + (isActive ? 0.2 : 0))}
                    strokeWidth={isActive ? 1.8 : isReached ? 1.2 : 0.7}
                    filter={isActive ? `url(#${svgUid}softglow)` : undefined}
                    style={{ cursor: "pointer", transition: "fill 0.4s, stroke 0.4s, stroke-width 0.3s" }}
                    onClick={() => setActiveRing(ring.id === activeRing ? null : ring.id)}
                    role="button"
                    aria-label={t(ring.label, lang)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        setActiveRing(ring.id === activeRing ? null : ring.id);
                    }}
                  />
                </g>
              );
            })}

            {/* Void punch-out so rings look like annuli (outer to inner pass) */}
            {/* We re-draw inner backgrounds to punch holes — drawn outer-to-inner */}
            {[...MORAL_RINGS].reverse().map((ring, revIdx) => {
              const idx = MORAL_RINGS.length - 1 - revIdx;
              if (idx === 0) return null; // keep the self-circle filled
              const innerRing = MORAL_RINGS[idx - 1];
              const innerR = svgR(innerRing.radius) * ringDrawProg(idx - 1) * 0.96;
              if (innerR <= 0) return null;
              return (
                <circle
                  key={`punch-${ring.id}`}
                  cx={CX} cy={CY}
                  r={innerR}
                  fill={`url(#${svgUid}bg)`}
                  style={{ pointerEvents: "none" }}
                />
              );
            })}

            {/* Ring labels — positioned at 30° angle in the middle of each annulus */}
            {MORAL_RINGS.map((ring, idx) => {
              const prevR = idx === 0 ? 0 : svgR(MORAL_RINGS[idx - 1].radius) * ringDrawProg(idx - 1);
              const thisR = svgR(ring.radius) * ringDrawProg(idx);
              const midR  = (prevR + thisR) / 2;
              if (midR <= 2) return null;

              const angle = -Math.PI / 4; // 45° upper-right
              const lx = CX + midR * Math.cos(angle);
              const ly = CY + midR * Math.sin(angle);

              const isReached = sliderReaches(ring);
              const textA = isReached ? 0.9 : 0.3;
              const color = ringColor(idx);
              const labelStr = t(ring.label, lang);
              const isLong = labelStr.length > 8;

              return (
                <text
                  key={`label-${ring.id}`}
                  x={lx} y={ly}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={isLong ? (lang === "zh" ? 7 : 5.5) : (lang === "zh" ? 8 : 6.5)}
                  fontFamily="'IBM Plex Mono', monospace"
                  fill={hexAlpha(color, textA * drawProg)}
                  style={{ transition: "fill 0.4s", pointerEvents: "none" }}
                >
                  {labelStr}
                </text>
              );
            })}

            {/* Active ring marker: dashed boundary circle */}
            {activeRing && (() => {
              const aIdx = MORAL_RINGS.findIndex((r) => r.id === activeRing);
              if (aIdx < 0) return null;
              const r = svgR(MORAL_RINGS[aIdx].radius) * ringDrawProg(aIdx);
              if (r <= 0) return null;
              return (
                <circle
                  cx={CX} cy={CY}
                  r={r + 3}
                  fill="none"
                  stroke={hexAlpha(ringColor(aIdx), 0.55)}
                  strokeWidth="1.2"
                  strokeDasharray="5 3"
                  className="flow"
                  style={{ pointerEvents: "none" }}
                />
              );
            })()}

            {/* Slider reach boundary: glowing arc at outermost reached ring */}
            {(() => {
              const r = svgR(currentReachRing.radius) * ringDrawProg(currentReachIdx);
              if (r <= 0) return null;
              return (
                <circle
                  cx={CX} cy={CY}
                  r={r + 5}
                  fill="none"
                  stroke={hexAlpha(ringColor(currentReachIdx), 0.35)}
                  strokeWidth="1"
                  strokeDasharray="3 5"
                  className="breathe-soft"
                  style={{ pointerEvents: "none", transition: "r 0.4s" }}
                />
              );
            })()}

            {/* Center self dot */}
            <circle
              cx={CX} cy={CY} r={5}
              fill={HEX.bodhi500}
              fillOpacity={drawProg * 0.9}
              filter={`url(#${svgUid}glow)`}
              className="node-pulse"
              style={{ pointerEvents: "none" }}
            />

            {/* Outer breathing ring */}
            <circle
              cx={CX} cy={CY}
              r={MAX_R + 14}
              fill="none"
              stroke={hexAlpha(HEX.amethyst500, 0.06)}
              strokeWidth="1"
              className="breathe"
            />
          </svg>

          {/* Counted-today legend */}
          <div className="flex items-center justify-center gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-1.5 rounded-sm" style={{ background: hexAlpha(HEX.bodhi500, 0.7) }} />
              <span className="label-mono text-[0.55rem]" style={{ color: hexAlpha(HEX.bone500, 0.6) }}>
                <T v={{ en: "widely counted today", zh: "当今广泛算数" }} />
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-1.5 rounded-sm" style={{ background: hexAlpha(HEX.amethyst500, 0.35) }} />
              <span className="label-mono text-[0.55rem]" style={{ color: hexAlpha(HEX.bone500, 0.6) }}>
                <T v={{ en: "contested / frontier", zh: "争议中 / 疆界" }} />
              </span>
            </div>
          </div>
        </div>

        {/* ── Right panel ──────────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* Slider */}
          <div
            className="rounded-2xl border border-bodhi-500/15 bg-void-900/50 p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="label-mono text-[0.62rem]" style={{ color: hexAlpha(HEX.bodhi300, 0.85) }}>
                <T v={{ en: "moral imagination", zh: "道德想象" }} />
              </span>
              <span
                className="label-mono text-[0.62rem] font-semibold"
                style={{ color: hexAlpha(HEX.bodhi400, 0.9) }}
              >
                {slider}
              </span>
            </div>

            {/* Range input */}
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={slider}
              onChange={(e) => setSlider(Number(e.target.value))}
              aria-label={t({ en: "Moral imagination slider 0–100", zh: "道德想象滑块 0–100" }, lang)}
              className="w-full h-1.5 rounded-full appearance-none outline-none"
              style={{
                background: `linear-gradient(to right, ${HEX.bodhi500} 0%, ${HEX.jade500} 50%, ${HEX.amethyst500} 100%)`,
                cursor: "pointer",
              }}
            />

            <div className="flex justify-between">
              <span className="label-mono text-[0.55rem]" style={{ color: hexAlpha(HEX.bone500, 0.5) }}>
                <T v={{ en: "kin only", zh: "仅血亲" }} />
              </span>
              <span className="label-mono text-[0.55rem]" style={{ color: hexAlpha(HEX.bone500, 0.5) }}>
                <T v={{ en: "all possible minds", zh: "一切可能的心智" }} />
              </span>
            </div>

            {/* Current reach readout */}
            <div
              className="flex items-center gap-2 rounded-xl px-3 py-2"
              style={{
                background: hexAlpha(ringColor(currentReachIdx), 0.09),
                border: `1px solid ${hexAlpha(ringColor(currentReachIdx), 0.28)}`,
                transition: "background 0.4s, border-color 0.4s",
              }}
            >
              <span className="label-mono text-[0.58rem]" style={{ color: hexAlpha(HEX.bone500, 0.6) }}>
                <T v={{ en: "circle reaches", zh: "圆达至" }} />
              </span>
              <span
                className={`label-mono text-[0.68rem] font-semibold lang-fade ${lang === "zh" ? "zh" : ""}`}
                key={`reach-${currentReachRing.id}-${lang}`}
                style={{ color: ringColorLight(currentReachIdx), transition: "color 0.4s" }}
              >
                {t(currentReachRing.label, lang)}
              </span>
              {/* Mini dot ladder */}
              <div className="flex gap-1 items-center ml-auto">
                {MORAL_RINGS.map((ring, i) => {
                  const reached = sliderReaches(ring);
                  return (
                    <div
                      key={ring.id}
                      style={{
                        width: 5 + i * 1.2,
                        height: 5 + i * 1.2,
                        borderRadius: "50%",
                        background: reached ? hexAlpha(ringColor(i), 0.85) : "transparent",
                        border: `1px solid ${hexAlpha(ringColor(i), reached ? 0.65 : 0.18)}`,
                        transition: "all 0.3s",
                        flexShrink: 0,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Ring selector tabs */}
          <div className="flex flex-wrap gap-2">
            {MORAL_RINGS.map((ring, idx) => {
              const isActive = ring.id === activeRing;
              const color = ringColor(idx);
              return (
                <button
                  key={ring.id}
                  onClick={() => setActiveRing(ring.id === activeRing ? null : ring.id)}
                  aria-pressed={isActive}
                  className="label-mono text-[0.62rem] px-3 py-1.5 rounded-full transition-all duration-300 border"
                  style={{
                    borderColor: isActive ? hexAlpha(color, 0.65) : hexAlpha(color, 0.22),
                    background: isActive ? hexAlpha(color, 0.15) : hexAlpha(HEX.void900, 0.6),
                    color: isActive ? ringColorLight(idx) : hexAlpha(HEX.bone500, 0.75),
                    boxShadow: isActive ? `0 0 12px ${hexAlpha(color, 0.2)}` : "none",
                  }}
                >
                  <span className={lang === "zh" ? "zh" : ""}>{t(ring.label, lang)}</span>
                </button>
              );
            })}
          </div>

          {/* Detail panel — shown when a ring is clicked */}
          {selectedRing && (() => {
            const idx = MORAL_RINGS.findIndex((r) => r.id === selectedRing.id);
            const color = ringColor(idx);
            const lightColor = ringColorLight(idx);
            return (
              <div
                className="rounded-2xl p-5 space-y-3"
                style={{
                  background: hexAlpha(HEX.void900, 0.7),
                  border: `1px solid ${hexAlpha(color, 0.28)}`,
                  backdropFilter: "blur(12px)",
                }}
              >
                {/* Ring label + counted badge */}
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span
                    className="display text-xl"
                    style={{ color: lightColor }}
                    key={`ring-title-${selectedRing.id}-${lang}`}
                  >
                    {t(selectedRing.label, lang)}
                  </span>
                  {/* Counted today indicator */}
                  <div className="flex items-center gap-1.5 ml-auto">
                    <span className="label-mono text-[0.56rem]" style={{ color: hexAlpha(HEX.bone500, 0.5) }}>
                      <T v={{ en: "counted today", zh: "当今算数程度" }} />
                    </span>
                    <div className="w-16 h-1.5 rounded-full" style={{ background: hexAlpha(HEX.void700, 0.8) }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${selectedRing.counted}%`, background: color, transition: "width 0.4s" }}
                      />
                    </div>
                    <span className="label-mono text-[0.56rem]" style={{ color: hexAlpha(color, 0.8) }}>
                      {selectedRing.counted}%
                    </span>
                  </div>
                </div>

                {/* Who */}
                <div>
                  <p className="label-mono text-[0.56rem] uppercase tracking-widest mb-1"
                     style={{ color: hexAlpha(color, 0.7) }}>
                    <T v={{ en: "who", zh: "谁" }} />
                  </p>
                  <p
                    className={`text-sm leading-relaxed ${lang === "zh" ? "zh" : ""} lang-fade`}
                    style={{ color: HEX.bone100 }}
                    key={`who-${selectedRing.id}-${lang}`}
                  >
                    {t(selectedRing.who, lang)}
                  </p>
                </div>

                {/* Basis */}
                <div>
                  <p className="label-mono text-[0.56rem] uppercase tracking-widest mb-1"
                     style={{ color: hexAlpha(color, 0.7) }}>
                    <T v={{ en: "moral basis", zh: "道德基础" }} />
                  </p>
                  <p
                    className={`text-sm leading-relaxed ${lang === "zh" ? "zh" : ""} lang-fade`}
                    style={{ color: HEX.bone300 }}
                    key={`basis-${selectedRing.id}-${lang}`}
                  >
                    {t(selectedRing.basis, lang)}
                  </p>
                </div>

                {/* Radius chip */}
                <div className="flex items-center gap-2">
                  <span className="label-mono text-[0.56rem]" style={{ color: hexAlpha(HEX.bone500, 0.45) }}>
                    <T v={{ en: "moral distance", zh: "道德距离" }} />
                  </span>
                  <div className="flex-1 h-0.5 rounded-full" style={{ background: hexAlpha(HEX.void600, 0.8) }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${selectedRing.radius}%`,
                        background: `linear-gradient(to right, ${HEX.bodhi500}, ${color})`,
                        transition: "width 0.4s",
                      }}
                    />
                  </div>
                  <span className="label-mono text-[0.56rem]" style={{ color: hexAlpha(color, 0.7) }}>
                    {selectedRing.radius}
                  </span>
                </div>
              </div>
            );
          })()}

          {/* If no ring selected, show hint */}
          {!selectedRing && (
            <p className="label-mono text-[0.6rem]" style={{ color: hexAlpha(HEX.bone500, 0.4) }}>
              <T v={{ en: "click a ring to explore who is inside it and why", zh: "点击圆环以探索其中之人与缘由" }} />
            </p>
          )}

          {/* Footer note */}
          <div className="rule-gold" />
          <p className="label-mono text-[0.58rem] leading-relaxed" style={{ color: hexAlpha(HEX.bone500, 0.5) }}>
            <T v={{
              en: "The widening is never automatic. Felt empathy collapses with distance — which is why civilisations build law, welfare and rights to act as if they cared.",
              zh: "这扩大从不自动。可感的共情随距离而崩塌——这正是为何文明建造法律、福利与权利，行动得仿佛它在乎。",
            }} />
          </p>
        </div>
      </div>
    </div>
  );
}
