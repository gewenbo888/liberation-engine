"use client";

import { useState, useId, useEffect, useRef } from "react";
import { SUFFERING_EMERGENCE, SUFFERING_ROOTS, SufferingRoot } from "./content";
import { useLang, T, t } from "./lang";

// ── Palette hex values ────────────────────────────────────────────────────────
const HEX = {
  bodhi500:    "#f4c25a",
  bodhi400:    "#ffd584",
  bodhi300:    "#ffe7b0",
  lotus500:    "#ef84b1",
  lotus400:    "#f6abc8",
  jade500:     "#4fd6c0",
  jade400:     "#82e3d3",
  amethyst500: "#9d8bf0",
  amethyst400: "#b8aaf6",
  amethyst300: "#d4cbfb",
  ember500:    "#e0664f",
  ember400:    "#ea8773",
  ember300:    "#f2aa9b",
  void950:     "#070611",
  void900:     "#0c0a1c",
  void800:     "#141128",
  void700:     "#1d1938",
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

// ── Per-stage color: cool/dim at low awareness → warm/bright at high ─────────
function stageColor(awareness: number): string {
  // 0–40: jade→amethyst; 40–70: amethyst→bodhi; 70–100: bodhi→ember
  if (awareness <= 40) {
    const p = awareness / 40;
    const r = Math.round(0x4f + p * (0x9d - 0x4f));
    const g = Math.round(0xd6 + p * (0x8b - 0xd6));
    const b = Math.round(0xc0 + p * (0xf0 - 0xc0));
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  } else if (awareness <= 70) {
    const p = (awareness - 40) / 30;
    const r = Math.round(0x9d + p * (0xf4 - 0x9d));
    const g = Math.round(0x8b + p * (0xc2 - 0x8b));
    const b = Math.round(0xf0 + p * (0x5a - 0xf0));
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  } else {
    const p = (awareness - 70) / 30;
    const r = Math.round(0xf4 + p * (0xe0 - 0xf4));
    const g = Math.round(0xc2 + p * (0x66 - 0xc2));
    const b = Math.round(0x5a + p * (0x4f - 0x5a));
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  }
}

// ── Color by kind ─────────────────────────────────────────────────────────────
function kindColor(kind: SufferingRoot["kind"]) {
  if (kind === "body") return HEX.ember500;
  if (kind === "emotion") return HEX.lotus500;
  return HEX.amethyst500;
}
function kindColorLight(kind: SufferingRoot["kind"]) {
  if (kind === "body") return HEX.ember300;
  if (kind === "emotion") return HEX.lotus400;
  return HEX.amethyst300;
}

// ── Radial mind-map layout (SVG) ──────────────────────────────────────────────
const VB = 320;
const CX = VB / 2;
const CY = VB / 2;
const SPOKE_LEN = 108;
const CENTER_R = 26;
const MAX_NODE_R = 28;
const MIN_NODE_R = 14;

function nodeRadius(intensity: number) {
  return MIN_NODE_R + ((intensity - 40) / 60) * (MAX_NODE_R - MIN_NODE_R);
}

// Place roots evenly around the circle, starting from top
function spokeAngle(idx: number, total: number): number {
  return (Math.PI * 2 * idx) / total - Math.PI / 2;
}

// ── Strip chart constants ─────────────────────────────────────────────────────
const STRIP_H = 110;
const STRIP_PAD_X = 32;
const STRIP_PAD_Y = 18;
const STRIP_CURVE_MAX_H = STRIP_H - STRIP_PAD_Y * 2 - 20;

// ── Component ─────────────────────────────────────────────────────────────────
export default function SufferingAnatomy() {
  const { lang } = useLang();
  const uid = useId();
  const svgUid = uid.replace(/:/g, "");

  // Default: highest intensity root
  const defaultRoot = SUFFERING_ROOTS.reduce((a, b) => (a.intensity > b.intensity ? a : b));
  const [activeRoot, setActiveRoot] = useState<string>(defaultRoot.id);
  const [hoveredStage, setHoveredStage] = useState<number | null>(null);

  const selectedRoot = SUFFERING_ROOTS.find((r) => r.id === activeRoot)!;
  const rootCount = SUFFERING_ROOTS.length;

  // Reduced-motion check
  const reducedMotion = useRef(false);
  useEffect(() => {
    reducedMotion.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // ── Strip geometry ────────────────────────────────────────────────────────
  const stripW = 520; // internal SVG width for strip
  const stageCount = SUFFERING_EMERGENCE.length;
  const stepX = (stripW - STRIP_PAD_X * 2) / (stageCount - 1);

  function stageX(i: number) { return STRIP_PAD_X + i * stepX; }
  function stageY(awareness: number) {
    return STRIP_H - STRIP_PAD_Y - (awareness / 100) * STRIP_CURVE_MAX_H;
  }

  // Build smooth polyline path for the strip ridge
  const pathPoints = SUFFERING_EMERGENCE.map((s, i) => `${stageX(i)},${stageY(s.awareness)}`);
  const ridgePath = `M ${pathPoints.join(" L ")}`;

  // ── Radial layout ─────────────────────────────────────────────────────────
  function rootX(i: number) {
    return CX + SPOKE_LEN * Math.cos(spokeAngle(i, rootCount));
  }
  function rootY(i: number) {
    return CY + SPOKE_LEN * Math.sin(spokeAngle(i, rootCount));
  }

  // Active stage for strip (hover or null)
  const activeStageIdx = hoveredStage;
  const activeStage = activeStageIdx !== null ? SUFFERING_EMERGENCE[activeStageIdx] : null;

  return (
    <div className="w-full space-y-6 select-none">

      {/* ── TOP STRIP: Emergence of self-aware suffering ───────────────────── */}
      <div
        className="rounded-2xl border border-bodhi-500/15 bg-void-900/50 overflow-hidden"
        style={{ padding: "18px 20px 14px" }}
      >
        {/* Caption */}
        <p className="label-mono text-[0.6rem] tracking-widest mb-3"
           style={{ color: hexAlpha(HEX.bone500, 0.6) }}>
          <T v={{
            en: "the emergence of self-aware suffering",
            zh: "自我觉知之苦的浮现",
          }} />
        </p>

        {/* Stage detail tooltip area */}
        <div className="min-h-[42px] mb-2" aria-live="polite">
          {activeStage ? (
            <div className="flex items-start gap-3">
              <span
                className="label-mono text-[0.62rem] shrink-0 mt-0.5"
                style={{ color: stageColor(activeStage.awareness) }}
              >
                {t(activeStage.stage, lang)}
              </span>
              <span className="label-mono text-[0.62rem]" style={{ color: HEX.bone300 }}>
                <span className="font-semibold">{t(activeStage.title, lang)}</span>
                {" — "}
                {t(activeStage.detail, lang)}
              </span>
            </div>
          ) : (
            <p className="label-mono text-[0.6rem]" style={{ color: hexAlpha(HEX.bone500, 0.4) }}>
              <T v={{ en: "hover a node to explore", zh: "悬停节点以探索" }} />
            </p>
          )}
        </div>

        {/* SVG strip */}
        <svg
          viewBox={`0 0 ${stripW} ${STRIP_H}`}
          preserveAspectRatio="xMidYMid meet"
          style={{ width: "100%", display: "block" }}
          role="img"
          aria-label={t({ en: "Emergence of self-aware suffering across mind stages", zh: "苦之觉知在各心智阶段的浮现" }, lang)}
        >
          <defs>
            {/* Gradient for the ridge fill */}
            <linearGradient id={`${svgUid}rg`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor={HEX.jade500}     stopOpacity="0.3" />
              <stop offset="40%"  stopColor={HEX.amethyst500} stopOpacity="0.35" />
              <stop offset="70%"  stopColor={HEX.bodhi500}    stopOpacity="0.4" />
              <stop offset="100%" stopColor={HEX.ember500}    stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id={`${svgUid}stroke`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor={HEX.jade400}     stopOpacity="0.6" />
              <stop offset="40%"  stopColor={HEX.amethyst400} stopOpacity="0.7" />
              <stop offset="70%"  stopColor={HEX.bodhi400}    stopOpacity="0.8" />
              <stop offset="100%" stopColor={HEX.ember400}    stopOpacity="1.0" />
            </linearGradient>
            <filter id={`${svgUid}glow`} x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Area fill below ridge */}
          <path
            d={`${ridgePath} L ${stageX(stageCount - 1)},${STRIP_H} L ${stageX(0)},${STRIP_H} Z`}
            fill={`url(#${svgUid}rg)`}
          />

          {/* Ridge line */}
          <path
            d={ridgePath}
            fill="none"
            stroke={`url(#${svgUid}stroke)`}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Stage nodes */}
          {SUFFERING_EMERGENCE.map((stage, i) => {
            const x = stageX(i);
            const y = stageY(stage.awareness);
            const color = stageColor(stage.awareness);
            const isHovered = hoveredStage === i;

            return (
              <g
                key={stage.era}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHoveredStage(i)}
                onMouseLeave={() => setHoveredStage(null)}
                onFocus={() => setHoveredStage(i)}
                onBlur={() => setHoveredStage(null)}
                tabIndex={0}
                role="button"
                aria-label={`${t(stage.stage, lang)}: ${t(stage.title, lang)}`}
              >
                {/* Outer glow ring on hover */}
                {isHovered && (
                  <circle
                    cx={x} cy={y} r={11}
                    fill={hexAlpha(color, 0.18)}
                    stroke={hexAlpha(color, 0.5)}
                    strokeWidth="1"
                    className="node-pulse"
                  />
                )}
                {/* Pulsing halo for all nodes */}
                <circle
                  cx={x} cy={y} r={isHovered ? 8 : 6}
                  fill={hexAlpha(color, isHovered ? 0.35 : 0.15)}
                  stroke={hexAlpha(color, isHovered ? 0.9 : 0.55)}
                  strokeWidth={isHovered ? 1.5 : 1}
                  filter={`url(#${svgUid}glow)`}
                  className={isHovered ? "" : "node-pulse"}
                  style={{ transition: "r 0.2s, fill 0.2s, stroke-opacity 0.2s" }}
                />
                {/* Core dot */}
                <circle
                  cx={x} cy={y} r={isHovered ? 3.5 : 2.5}
                  fill={color}
                  style={{ transition: "r 0.2s" }}
                />

                {/* Label below node */}
                <text
                  x={x}
                  y={STRIP_H - 4}
                  textAnchor="middle"
                  fontSize={lang === "zh" ? 8.5 : 7}
                  fontFamily="'IBM Plex Mono', monospace"
                  fill={hexAlpha(color, isHovered ? 1 : 0.65)}
                  style={{ transition: "fill 0.2s", pointerEvents: "none" }}
                >
                  {t(stage.stage, lang)}
                </text>

                {/* Awareness value on hover */}
                {isHovered && (
                  <text
                    x={x}
                    y={y - 13}
                    textAnchor="middle"
                    fontSize={6.5}
                    fontFamily="'IBM Plex Mono', monospace"
                    fill={hexAlpha(color, 0.8)}
                    style={{ pointerEvents: "none" }}
                  >
                    {stage.awareness}%
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Awareness axis label */}
        <div className="flex justify-between items-center mt-1">
          <span className="label-mono text-[0.55rem]" style={{ color: hexAlpha(HEX.jade400, 0.7) }}>
            <T v={{ en: "reflex / dim", zh: "反射 / 暗" }} />
          </span>
          <span className="label-mono text-[0.55rem]" style={{ color: hexAlpha(HEX.ember400, 0.8) }}>
            <T v={{ en: "existential / full self-awareness", zh: "存在 / 完全自我觉知" }} />
          </span>
        </div>
      </div>

      {/* ── MAIN RADIAL MAP + DETAIL PANEL ─────────────────────────────────── */}
      <div className="flex flex-col md:flex-row gap-6 items-start">

        {/* Radial SVG */}
        <div className="flex-shrink-0 w-full md:w-auto mx-auto md:mx-0" style={{ maxWidth: VB }}>
          <svg
            viewBox={`0 0 ${VB} ${VB}`}
            preserveAspectRatio="xMidYMid meet"
            style={{ width: "100%", display: "block" }}
            role="img"
            aria-label={t({ en: "Radial mind-map of suffering roots", zh: "苦之根的辐射心智图" }, lang)}
          >
            <defs>
              <radialGradient id={`${svgUid}bg`} cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor={HEX.void800} stopOpacity="0.9" />
                <stop offset="100%" stopColor={HEX.void950} stopOpacity="1"   />
              </radialGradient>
              <filter id={`${svgUid}halo`} x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id={`${svgUid}center`} x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background */}
            <circle cx={CX} cy={CY} r={CX} fill={`url(#${svgUid}bg)`} />

            {/* Outer breathing ring */}
            <circle
              cx={CX} cy={CY}
              r={SPOKE_LEN + MAX_NODE_R + 12}
              fill="none"
              stroke={hexAlpha(HEX.amethyst500, 0.06)}
              strokeWidth="1"
              className="breathe-soft"
            />

            {/* Spokes */}
            {SUFFERING_ROOTS.map((root, i) => {
              const x2 = rootX(i);
              const y2 = rootY(i);
              const isActive = root.id === activeRoot;
              const color = kindColor(root.kind);
              return (
                <line
                  key={`spoke-${root.id}`}
                  x1={CX} y1={CY}
                  x2={x2} y2={y2}
                  stroke={hexAlpha(color, isActive ? 0.45 : 0.15)}
                  strokeWidth={isActive ? 1.2 : 0.7}
                  strokeDasharray={isActive ? "none" : "3 3"}
                  style={{ transition: "stroke 0.3s, stroke-width 0.3s" }}
                />
              );
            })}

            {/* Root nodes */}
            {SUFFERING_ROOTS.map((root, i) => {
              const x = rootX(i);
              const y = rootY(i);
              const r = nodeRadius(root.intensity);
              const isActive = root.id === activeRoot;
              const color = kindColor(root.kind);
              const lightColor = kindColorLight(root.kind);

              // Label positioning: push outward from center
              const angle = spokeAngle(i, rootCount);
              const labelDist = r + 14;
              const lx = x + labelDist * Math.cos(angle);
              const ly = y + labelDist * Math.sin(angle);
              const anchor =
                Math.cos(angle) > 0.2 ? "start" :
                Math.cos(angle) < -0.2 ? "end" : "middle";

              return (
                <g
                  key={root.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => setActiveRoot(root.id)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setActiveRoot(root.id); }}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isActive}
                  aria-label={t(root.label, lang)}
                >
                  {/* Outer pulse halo */}
                  {isActive && (
                    <circle
                      cx={x} cy={y} r={r + 7}
                      fill={hexAlpha(color, 0.1)}
                      stroke={hexAlpha(color, 0.3)}
                      strokeWidth="1"
                      className="node-pulse"
                    />
                  )}

                  {/* Main node circle */}
                  <circle
                    cx={x} cy={y} r={r}
                    fill={hexAlpha(color, isActive ? 0.28 : 0.12)}
                    stroke={hexAlpha(color, isActive ? 0.85 : 0.35)}
                    strokeWidth={isActive ? 1.8 : 1}
                    filter={isActive ? `url(#${svgUid}halo)` : undefined}
                    className={!isActive ? "node-pulse" : ""}
                    style={{ transition: "fill 0.3s, stroke 0.3s" }}
                  />

                  {/* Inner dot */}
                  <circle
                    cx={x} cy={y} r={isActive ? 4 : 2.5}
                    fill={isActive ? lightColor : hexAlpha(color, 0.6)}
                    style={{ transition: "r 0.3s, fill 0.3s", pointerEvents: "none" }}
                  />

                  {/* Node label */}
                  <text
                    x={lx} y={ly}
                    textAnchor={anchor}
                    dominantBaseline="middle"
                    fontSize={lang === "zh" ? 8.5 : 7.5}
                    fontFamily="'IBM Plex Mono', monospace"
                    fill={hexAlpha(isActive ? lightColor : color, isActive ? 1 : 0.65)}
                    style={{ transition: "fill 0.3s", pointerEvents: "none" }}
                  >
                    {t(root.label, lang)}
                  </text>
                </g>
              );
            })}

            {/* Center node */}
            <circle
              cx={CX} cy={CY} r={CENTER_R + 4}
              fill={hexAlpha(HEX.bodhi500, 0.06)}
              stroke={hexAlpha(HEX.bodhi500, 0.2)}
              strokeWidth="1"
              className="breathe"
            />
            <circle
              cx={CX} cy={CY} r={CENTER_R}
              fill={hexAlpha(HEX.void800, 0.95)}
              stroke={hexAlpha(HEX.bodhi500, 0.4)}
              strokeWidth="1.2"
              filter={`url(#${svgUid}center)`}
            />
            <text
              x={CX} y={CY - 5}
              textAnchor="middle"
              fontSize={lang === "zh" ? 8 : 6.5}
              fontFamily="'IBM Plex Mono', monospace"
              fill={hexAlpha(HEX.bodhi300, 0.85)}
              style={{ pointerEvents: "none" }}
            >
              {lang === "zh" ? "苦的心智" : "The"}
            </text>
            <text
              x={CX} y={CY + 6}
              textAnchor="middle"
              fontSize={lang === "zh" ? 8 : 6.5}
              fontFamily="'IBM Plex Mono', monospace"
              fill={hexAlpha(HEX.bodhi300, 0.85)}
              style={{ pointerEvents: "none" }}
            >
              {lang === "zh" ? "" : "suffering"}
            </text>
            {lang === "en" && (
              <text
                x={CX} y={CY + 15}
                textAnchor="middle"
                fontSize={6.5}
                fontFamily="'IBM Plex Mono', monospace"
                fill={hexAlpha(HEX.bodhi300, 0.85)}
                style={{ pointerEvents: "none" }}
              >
                mind
              </text>
            )}
          </svg>

          {/* Kind legend */}
          <div className="flex justify-center gap-5 mt-2">
            {(["body", "emotion", "existential"] as const).map((kind) => (
              <div key={kind} className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: kindColor(kind), opacity: 0.85 }}
                />
                <span className="label-mono text-[0.58rem]" style={{ color: hexAlpha(HEX.bone500, 0.7) }}>
                  {kind === "body" && <T v={{ en: "body", zh: "身体" }} />}
                  {kind === "emotion" && <T v={{ en: "emotion", zh: "情绪" }} />}
                  {kind === "existential" && <T v={{ en: "existential", zh: "存在" }} />}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Detail panel ──────────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Root title */}
          <div
            className="rounded-2xl border bg-void-900/50 p-5 space-y-4"
            style={{ borderColor: hexAlpha(kindColor(selectedRoot.kind), 0.28) }}
          >
            {/* Header row */}
            <div className="flex items-baseline gap-3 flex-wrap">
              <span
                className="display text-2xl"
                style={{ color: kindColorLight(selectedRoot.kind) }}
                key={`title-${activeRoot}-${lang}`}
              >
                {t(selectedRoot.label, lang)}
              </span>
              <span
                className="label-mono text-[0.58rem] px-2 py-0.5 rounded-full"
                style={{
                  background: hexAlpha(kindColor(selectedRoot.kind), 0.15),
                  color: kindColorLight(selectedRoot.kind),
                  border: `1px solid ${hexAlpha(kindColor(selectedRoot.kind), 0.35)}`,
                }}
              >
                {selectedRoot.kind === "body" && <T v={{ en: "body", zh: "身体" }} />}
                {selectedRoot.kind === "emotion" && <T v={{ en: "emotion", zh: "情绪" }} />}
                {selectedRoot.kind === "existential" && <T v={{ en: "existential", zh: "存在" }} />}
              </span>
              {/* Intensity bar */}
              <div className="flex items-center gap-1.5 ml-auto">
                <span className="label-mono text-[0.58rem]" style={{ color: hexAlpha(HEX.bone500, 0.5) }}>
                  <T v={{ en: "intensity", zh: "强度" }} />
                </span>
                <div className="w-20 h-1.5 rounded-full" style={{ background: hexAlpha(HEX.void700, 0.8) }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${selectedRoot.intensity}%`,
                      background: kindColor(selectedRoot.kind),
                      transition: "width 0.4s",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Bio / Psych side-by-side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Biological root */}
              <div
                className="rounded-xl p-3.5 space-y-1.5"
                style={{ background: hexAlpha(HEX.void800, 0.7), border: `1px solid ${hexAlpha(HEX.jade500, 0.18)}` }}
              >
                <p className="label-mono text-[0.56rem] uppercase tracking-widest" style={{ color: HEX.jade400 }}>
                  <T v={{ en: "biological root", zh: "生物学之根" }} />
                </p>
                <p
                  className={`text-xs leading-relaxed ${lang === "zh" ? "zh" : ""} lang-fade`}
                  style={{ color: HEX.bone100 }}
                  key={`bio-${activeRoot}-${lang}`}
                >
                  {t(selectedRoot.bio, lang)}
                </p>
              </div>

              {/* Psychological root */}
              <div
                className="rounded-xl p-3.5 space-y-1.5"
                style={{ background: hexAlpha(HEX.void800, 0.7), border: `1px solid ${hexAlpha(HEX.amethyst500, 0.18)}` }}
              >
                <p className="label-mono text-[0.56rem] uppercase tracking-widest" style={{ color: HEX.amethyst400 }}>
                  <T v={{ en: "psychological root", zh: "心理学之根" }} />
                </p>
                <p
                  className={`text-xs leading-relaxed ${lang === "zh" ? "zh" : ""} lang-fade`}
                  style={{ color: HEX.bone100 }}
                  key={`psych-${activeRoot}-${lang}`}
                >
                  {t(selectedRoot.psych, lang)}
                </p>
              </div>
            </div>

            {/* The two arrows */}
            <div
              className="rounded-xl p-3 flex items-start gap-2"
              style={{ background: hexAlpha(HEX.bodhi500, 0.06), border: `1px solid ${hexAlpha(HEX.bodhi500, 0.18)}` }}
            >
              <span style={{ color: HEX.bodhi400, fontSize: "0.85rem", lineHeight: 1, marginTop: "1px", flexShrink: 0 }}>
                ↯
              </span>
              <p className="label-mono text-[0.62rem] leading-relaxed" style={{ color: hexAlpha(HEX.bodhi300, 0.85) }}>
                <T v={{
                  en: "The first arrow is pain — it arrives uninvited. The second arrow, which we add, is suffering: the resistance, the dread, the story that it should not be.",
                  zh: "第一支箭是痛——它不请自来。第二支箭，是我们自己射出的：抵抗、惊惧、「它本不该如此」的故事——这才是苦。",
                }} />
              </p>
            </div>
          </div>

          {/* Root selector chips */}
          <div className="flex flex-wrap gap-2">
            {SUFFERING_ROOTS.map((root) => {
              const isActive = root.id === activeRoot;
              const color = kindColor(root.kind);
              return (
                <button
                  key={root.id}
                  onClick={() => setActiveRoot(root.id)}
                  aria-pressed={isActive}
                  className="label-mono text-[0.62rem] px-3 py-1.5 rounded-full transition-all duration-300 border"
                  style={{
                    borderColor: isActive ? hexAlpha(color, 0.6) : hexAlpha(color, 0.22),
                    background: isActive ? hexAlpha(color, 0.14) : hexAlpha(HEX.void900, 0.6),
                    color: isActive ? kindColorLight(root.kind) : hexAlpha(HEX.bone500, 0.8),
                    boxShadow: isActive ? `0 0 12px ${hexAlpha(color, 0.18)}` : "none",
                  }}
                >
                  <span className={lang === "zh" ? "zh" : ""}>{t(root.label, lang)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
