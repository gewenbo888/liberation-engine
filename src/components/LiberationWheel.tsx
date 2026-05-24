"use client";

import { useState, useRef, useEffect, useId } from "react";
import { NOBLE_TRUTHS, EIGHTFOLD_PATH, type NobleTruth, type PathFactor, type PathGroup } from "./content";
import { useLang, T, t } from "./lang";
import type { Lang } from "./lang";

/* ── Palette ─────────────────────────────────────────────────────────────── */
const C = {
  bodhi500:    "#f4c25a",
  bodhi400:    "#ffd584",
  bodhi300:    "#ffe7b0",
  lotus500:    "#ef84b1",
  lotus400:    "#f6abc8",
  jade500:     "#4fd6c0",
  jade400:     "#82e3d3",
  jade300:     "#aeefe4",
  amethyst500: "#9d8bf0",
  amethyst400: "#b8aaf6",
  amethyst300: "#d4cbfb",
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

/* ── Group → colour ─────────────────────────────────────────────────────── */
const GROUP_COLOR: Record<PathGroup, string> = {
  wisdom:    C.amethyst400,
  ethics:    C.jade400,
  meditation: C.bodhi400,
};
const GROUP_LABEL: Record<PathGroup, { en: string; zh: string }> = {
  wisdom:    { en: "Wisdom", zh: "慧" },
  ethics:    { en: "Ethics", zh: "戒" },
  meditation: { en: "Meditation", zh: "定" },
};

/* ── Noble Truth colours (I–IV) ─────────────────────────────────────────── */
const TRUTH_COLORS = [C.lotus500, C.lotus400, C.jade400, C.bodhi400];

/* ── Geometry ────────────────────────────────────────────────────────────── */
const VB          = 400;
const CX          = VB / 2;
const CY          = VB / 2;
const SPOKE_R     = 155;   // tip of each spoke / outer rim
const HUB_R       = 38;    // inner hub radius
const TRUTH_R     = 68;    // Noble Truth node radius from centre
const SPOKE_W     = 10;    // spoke clickable width
const RIM_STROKE  = 7;

function hexA(hex: string, a: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a.toFixed(3)})`;
}

/* spoke index → angle (top = 0, clockwise) */
function spokeAngle(i: number) {
  return -Math.PI / 2 + (2 * Math.PI * i) / 8;
}
/* truth index → angle, between spokes */
function truthAngle(i: number) {
  return -Math.PI / 2 + Math.PI / 4 + (2 * Math.PI * i) / 4;
}

type Selection =
  | { kind: "factor"; id: string }
  | { kind: "truth"; id: string }
  | null;

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function LiberationWheel() {
  const { lang }   = useLang();
  const uid        = useId();
  const [sel, setSel]        = useState<Selection>(null);
  const [rotating, setRotating] = useState(true);
  const [rimAngle, setRimAngle] = useState(0);
  const rafRef     = useRef<number | null>(null);
  const lastRef    = useRef<number | null>(null);

  /* Slow rim rotation */
  useEffect(() => {
    if (!rotating) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      return;
    }
    function tick(now: number) {
      if (lastRef.current === null) lastRef.current = now;
      const dt = now - lastRef.current;
      lastRef.current = now;
      setRimAngle((a) => (a + dt * 0.008) % 360); // ~0.008 deg/ms → ~1 revolution per 45s
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [rotating]);

  /* Resolve selection */
  const selFactor = sel?.kind === "factor"
    ? EIGHTFOLD_PATH.find((f) => f.id === sel.id) ?? null
    : null;
  const selTruth = sel?.kind === "truth"
    ? NOBLE_TRUTHS.find((tt) => tt.id === sel.id) ?? null
    : null;

  function handleSpokeClick(id: string) {
    setSel((prev) => (prev?.kind === "factor" && prev.id === id ? null : { kind: "factor", id }));
  }
  function handleTruthClick(id: string) {
    setSel((prev) => (prev?.kind === "truth" && prev.id === id ? null : { kind: "truth", id }));
  }

  return (
    <div className="w-full select-none">
      {/* ── Title row ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <p className="label-mono text-[0.6rem] tracking-widest text-bone-500/50">
          <T v={{ en: "the dharma wheel · four noble truths + eightfold path", zh: "法轮 · 四圣谛 + 八正道" }} />
        </p>
        <button
          onClick={() => setRotating((r) => !r)}
          className="label-mono text-[0.62rem] px-3 py-1 rounded-full border transition-all duration-200"
          style={{
            borderColor: hexA(C.bodhi500, 0.3),
            background: rotating ? hexA(C.bodhi500, 0.08) : "transparent",
            color: rotating ? C.bodhi300 : C.bone500,
          }}
        >
          <T v={rotating ? { en: "pause rotation", zh: "暂停旋转" } : { en: "resume rotation", zh: "恢复旋转" }} />
        </button>
      </div>

      {/* ── Main layout ───────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">

        {/* ── SVG Wheel ─────────────────────────────────────────────────── */}
        <div className="flex-shrink-0 w-full lg:w-auto mx-auto lg:mx-0" style={{ maxWidth: 420 }}>
          <svg
            viewBox={`0 0 ${VB} ${VB}`}
            preserveAspectRatio="xMidYMid meet"
            style={{ width: "100%", display: "block" }}
            role="img"
            aria-label={t({ en: "Dharma Wheel: Four Noble Truths and Eightfold Path", zh: "法轮：四圣谛与八正道" }, lang)}
          >
            <defs>
              <radialGradient id={`${uid}-bg`} cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor={C.void800} stopOpacity="0.9" />
                <stop offset="100%" stopColor={C.void950} stopOpacity="1"   />
              </radialGradient>
              <filter id={`${uid}-glow`} x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id={`${uid}-glow-sm`} x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id={`${uid}-glow-hub`} x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Background disc */}
            <circle cx={CX} cy={CY} r={SPOKE_R + 22} fill={`url(#${uid}-bg)`} />

            {/* Outer pulsing halo */}
            <circle
              cx={CX} cy={CY} r={SPOKE_R + 10}
              fill="none"
              stroke={hexA(C.bodhi500, 0.07)}
              strokeWidth="1.5"
              className="breathe-soft"
            />

            {/* ── Rotating group: outer rim + spokes ─────────────────────── */}
            <g
              transform={`rotate(${rimAngle}, ${CX}, ${CY})`}
              style={{ transition: "none" }}
            >
              {/* Outer rim circle */}
              <circle
                cx={CX} cy={CY} r={SPOKE_R}
                fill="none"
                stroke={hexA(C.bodhi500, 0.18)}
                strokeWidth={RIM_STROKE}
              />

              {/* Spokes */}
              {EIGHTFOLD_PATH.map((factor, i) => {
                const angle = spokeAngle(i);
                const x1 = CX + (HUB_R + 2) * Math.cos(angle);
                const y1 = CY + (HUB_R + 2) * Math.sin(angle);
                const x2 = CX + (SPOKE_R - 2) * Math.cos(angle);
                const y2 = CY + (SPOKE_R - 2) * Math.sin(angle);
                const col = GROUP_COLOR[factor.group];
                const isSelected = sel?.kind === "factor" && sel.id === factor.id;

                return (
                  <line
                    key={factor.id}
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={hexA(col, isSelected ? 0.95 : 0.45)}
                    strokeWidth={isSelected ? 4 : 2.5}
                    strokeLinecap="round"
                    filter={isSelected ? `url(#${uid}-glow-sm)` : undefined}
                    style={{ transition: "stroke 0.3s, stroke-width 0.3s" }}
                  />
                );
              })}

              {/* Spoke tip dots on rim */}
              {EIGHTFOLD_PATH.map((factor, i) => {
                const angle = spokeAngle(i);
                const x = CX + SPOKE_R * Math.cos(angle);
                const y = CY + SPOKE_R * Math.sin(angle);
                const col = GROUP_COLOR[factor.group];
                return (
                  <circle
                    key={`dot-${factor.id}`}
                    cx={x} cy={y} r={4.5}
                    fill={col}
                    fillOpacity="0.85"
                  />
                );
              })}
            </g>

            {/* ── Clickable spoke hit areas (NOT rotating — fixed positions) ── */}
            {EIGHTFOLD_PATH.map((factor, i) => {
              const angle = spokeAngle(i);
              const x1 = CX + (HUB_R + 4) * Math.cos(angle);
              const y1 = CY + (HUB_R + 4) * Math.sin(angle);
              const x2 = CX + (SPOKE_R - 4) * Math.cos(angle);
              const y2 = CY + (SPOKE_R - 4) * Math.sin(angle);

              return (
                <line
                  key={`hit-${factor.id}`}
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="transparent"
                  strokeWidth={SPOKE_W * 2}
                  strokeLinecap="round"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSpokeClick(factor.id)}
                />
              );
            })}

            {/* ── Noble Truth nodes (fixed, between spoke pairs) ──────────── */}
            {NOBLE_TRUTHS.map((truth, i) => {
              const angle  = truthAngle(i);
              const tx     = CX + TRUTH_R * Math.cos(angle);
              const ty     = CY + TRUTH_R * Math.sin(angle);
              const col    = TRUTH_COLORS[i];
              const isSelected = sel?.kind === "truth" && sel.id === truth.id;

              return (
                <g key={truth.id} style={{ cursor: "pointer" }} onClick={() => handleTruthClick(truth.id)}>
                  <circle
                    cx={tx} cy={ty} r={isSelected ? 15 : 13}
                    fill={hexA(col, isSelected ? 0.22 : 0.12)}
                    stroke={hexA(col, isSelected ? 0.9 : 0.45)}
                    strokeWidth={isSelected ? 1.8 : 1.2}
                    filter={isSelected ? `url(#${uid}-glow-sm)` : undefined}
                    style={{ transition: "all 0.3s" }}
                  />
                  {/* Roman numeral */}
                  <text
                    x={tx} y={ty - 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="7"
                    fontFamily="'Cormorant Garamond', 'Cormorant', Georgia, serif"
                    fontStyle="italic"
                    fill={hexA(col, isSelected ? 1 : 0.75)}
                    style={{ pointerEvents: "none", transition: "fill 0.3s" }}
                  >
                    {truth.n}
                  </text>
                  {/* Short label */}
                  <text
                    x={tx} y={ty + 5.5}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={lang === "zh" ? 5.5 : 4.8}
                    fontFamily={lang === "zh" ? "'Noto Serif SC', serif" : "'IBM Plex Mono', monospace"}
                    fill={hexA(col, isSelected ? 0.95 : 0.6)}
                    style={{ pointerEvents: "none", transition: "fill 0.3s" }}
                  >
                    {lang === "zh" ? truth.label.zh : truth.label.en}
                  </text>
                </g>
              );
            })}

            {/* ── Hub ──────────────────────────────────────────────────────── */}
            <circle
              cx={CX} cy={CY} r={HUB_R}
              fill={hexA(C.void900, 0.98)}
              stroke={hexA(C.bodhi500, 0.25)}
              strokeWidth="1.5"
            />
            {/* Bodhi seed glow */}
            <circle
              cx={CX} cy={CY} r={6}
              fill={C.bodhi500}
              fillOpacity="0.75"
              filter={`url(#${uid}-glow-hub)`}
              className="breathe"
            />
            <circle cx={CX} cy={CY} r={3.5} fill={C.bodhi300} fillOpacity="0.9" />

            {/* ── Spoke label text (fixed, outside rim) ───────────────────── */}
            {EIGHTFOLD_PATH.map((factor, i) => {
              const angle  = spokeAngle(i);
              const dist   = SPOKE_R + 16;
              const tx     = CX + dist * Math.cos(angle);
              const ty     = CY + dist * Math.sin(angle);
              const col    = GROUP_COLOR[factor.group];
              const isSelected = sel?.kind === "factor" && sel.id === factor.id;
              const label  = lang === "zh" ? factor.label.zh : factor.label.en;
              const isCJK  = lang === "zh";

              return (
                <text
                  key={`lbl-${factor.id}`}
                  x={tx} y={ty}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={isCJK ? 7.5 : 6.5}
                  fontFamily={isCJK ? "'Noto Serif SC', serif" : "'IBM Plex Mono', monospace"}
                  fill={hexA(col, isSelected ? 1 : 0.62)}
                  style={{ pointerEvents: "none", transition: "fill 0.3s", cursor: "default" }}
                  onClick={() => handleSpokeClick(factor.id)}
                >
                  {label}
                </text>
              );
            })}
          </svg>
        </div>

        {/* ── Right panel ───────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* Legend */}
          <div className="flex flex-wrap gap-3">
            {(["wisdom", "ethics", "meditation"] as PathGroup[]).map((g) => (
              <div key={g} className="flex items-center gap-1.5">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full"
                  style={{ background: GROUP_COLOR[g] }}
                />
                <span className="label-mono text-[0.62rem]" style={{ color: GROUP_COLOR[g] }}>
                  <span>{GROUP_LABEL[g].en}</span>
                  <span className="zh ml-1 opacity-60">{GROUP_LABEL[g].zh}</span>
                </span>
              </div>
            ))}
          </div>

          {/* Detail card */}
          <div
            className="rounded-2xl p-5 space-y-3 min-h-[220px]"
            style={{
              background: hexA(C.void900, 0.75),
              border: `1px solid ${hexA(C.bodhi500, 0.15)}`,
              backdropFilter: "blur(12px)",
            }}
          >
            {selFactor ? (
              /* ── Path factor detail ──────────────────────────────────── */
              <>
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span
                    className="display text-2xl"
                    style={{ color: GROUP_COLOR[selFactor.group] }}
                  >
                    {t(selFactor.label, lang)}
                  </span>
                  <span
                    className="label-mono text-[0.6rem] uppercase tracking-widest"
                    style={{ color: hexA(GROUP_COLOR[selFactor.group], 0.55) }}
                  >
                    <T v={GROUP_LABEL[selFactor.group]} />
                  </span>
                </div>
                <p
                  className={`text-sm leading-relaxed ${lang === "zh" ? "zh" : ""} lang-fade`}
                  style={{ color: C.bone100 ?? C.bone300 }}
                >
                  {t(selFactor.gloss, lang)}
                </p>
              </>
            ) : selTruth ? (
              /* ── Noble Truth detail ─────────────────────────────────── */
              <>
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span
                    className="display text-2xl italic"
                    style={{ color: TRUTH_COLORS[NOBLE_TRUTHS.findIndex((x) => x.id === selTruth.id)] }}
                  >
                    {selTruth.n}
                  </span>
                  <span
                    className={`display text-lg ${lang === "zh" ? "zh" : ""}`}
                    style={{ color: TRUTH_COLORS[NOBLE_TRUTHS.findIndex((x) => x.id === selTruth.id)] }}
                  >
                    {t(selTruth.label, lang)}
                  </span>
                </div>
                <p
                  className="label-mono text-[0.65rem] tracking-wide"
                  style={{ color: hexA(TRUTH_COLORS[NOBLE_TRUTHS.findIndex((x) => x.id === selTruth.id)], 0.7) }}
                >
                  {t(selTruth.gloss, lang)}
                </p>
                <p
                  className={`text-sm leading-relaxed ${lang === "zh" ? "zh" : ""} lang-fade`}
                  style={{ color: C.bone300 }}
                >
                  {t(selTruth.detail, lang)}
                </p>
              </>
            ) : (
              /* ── Default: Bodhisattva vow ───────────────────────────── */
              <>
                <p className="label-mono text-[0.6rem] tracking-widest text-bone-500/50 uppercase mb-2">
                  <T v={{ en: "the bodhisattva vow", zh: "菩萨誓愿" }} />
                </p>
                <p className="display text-lg leading-relaxed bodhi-text">
                  {lang === "zh"
                    ? "众生无边誓愿度。"
                    : "Beings are numberless; I vow to free them all."}
                </p>
                <p
                  className={`text-xs leading-relaxed mt-2 ${lang === "zh" ? "zh" : ""} lang-fade`}
                  style={{ color: C.bone500 }}
                >
                  <T v={{
                    en: "This vow makes liberation collective, not solitary — no mind is fully free while suffering remains in the field of mind at all.",
                    zh: "这誓愿使解脱成为集体性的，而非孤独的——只要苦还存留于心之场域，便没有哪一个心智的解脱是完整的。",
                  }} />
                </p>
                <div className="rule-gold mt-3" />
                <p className="label-mono text-[0.6rem] text-bone-500/40 mt-2">
                  <T v={{ en: "Click a spoke for a path factor · click a node for a noble truth", zh: "点击轮辐查看道因 · 点击节点查看圣谛" }} />
                </p>
              </>
            )}
          </div>

          {/* All factors quick list */}
          <div className="grid grid-cols-2 gap-1.5">
            {EIGHTFOLD_PATH.map((factor) => {
              const isSelected = sel?.kind === "factor" && sel.id === factor.id;
              const col = GROUP_COLOR[factor.group];
              return (
                <button
                  key={factor.id}
                  onClick={() => handleSpokeClick(factor.id)}
                  className="text-left px-3 py-2 rounded-lg transition-all duration-200"
                  style={{
                    background: isSelected ? hexA(col, 0.12) : hexA(C.void800, 0.5),
                    border: `1px solid ${hexA(col, isSelected ? 0.5 : 0.15)}`,
                    color: isSelected ? col : C.bone500,
                  }}
                >
                  <span className="label-mono text-[0.62rem]">
                    {t(factor.label, lang)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Four Noble Truths quick list */}
          <div className="flex flex-wrap gap-1.5 mt-1">
            {NOBLE_TRUTHS.map((truth, i) => {
              const isSelected = sel?.kind === "truth" && sel.id === truth.id;
              const col = TRUTH_COLORS[i];
              return (
                <button
                  key={truth.id}
                  onClick={() => handleTruthClick(truth.id)}
                  className="px-3 py-1.5 rounded-full transition-all duration-200"
                  style={{
                    background: isSelected ? hexA(col, 0.15) : hexA(C.void800, 0.5),
                    border: `1px solid ${hexA(col, isSelected ? 0.6 : 0.2)}`,
                    color: isSelected ? col : C.bone500,
                  }}
                >
                  <span className="label-mono text-[0.62rem]">
                    <span className="italic mr-1">{truth.n}</span>
                    {t(truth.label, lang)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
