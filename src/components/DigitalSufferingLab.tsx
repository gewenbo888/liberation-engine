"use client";

import { useState, useEffect, useMemo } from "react";
import { useLang, T, t } from "./lang";
import { Lang, Bi } from "./lang";
import { DIGITAL_FORCES, DigitalForce } from "./content";

// ── Palette ─────────────────────────────────────────────────────────────────
const HEX = {
  ember500: "#e0664f",
  ember400: "#ea8773",
  ember300: "#f2aa9b",
  jade500:  "#4fd6c0",
  jade400:  "#82e3d3",
  jade300:  "#aeefe4",
  bodhi500: "#f4c25a",
  bodhi400: "#ffd584",
  bodhi300: "#ffe7b0",
  bone50:   "#fbf6ee",
  bone100:  "#f3ebdf",
  bone300:  "#d6c9b8",
  bone500:  "#9b8d79",
  void700:  "#1d1938",
  void800:  "#141128",
  void900:  "#0c0a1c",
};

function hexAlpha(hex: string, a: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a.toFixed(3)})`;
}

// Map a valence (−100..+100) → a color between ember500 and jade500
// Uses only #rrggbb hex constants — no computed colors into hexAlpha.
function valenceColor(v: number): string {
  // clamp
  const clamped = Math.max(-100, Math.min(100, v));
  if (clamped >= 0) {
    // 0 → bone300,  +100 → jade500
    const t = clamped / 100;
    const r = Math.round(0xd6 + t * (0x4f - 0xd6));
    const g = Math.round(0xc9 + t * (0xd6 - 0xc9));
    const b = Math.round(0xb8 + t * (0xc0 - 0xb8));
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  } else {
    // 0 → bone300,  -100 → ember500
    const t = (-clamped) / 100;
    const r = Math.round(0xd6 + t * (0xe0 - 0xd6));
    const g = Math.round(0xc9 + t * (0x66 - 0xc9));
    const b = Math.round(0xb8 + t * (0x4f - 0xb8));
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  }
}

// ── Valence Meter — horizontal bar ─────────────────────────────────────────
function ValenceMeter({
  valence,
  tuned,
  animate,
}: {
  valence: number;
  tuned: number;
  animate: boolean;
}) {
  const color = valenceColor(tuned);
  // Convert valence range -100..+100 → left% 0..100
  const leftPct = ((tuned + 100) / 200) * 100;
  return (
    <div className="relative h-2 w-full rounded-full overflow-visible" style={{ background: hexAlpha(HEX.void700, 0.8) }}>
      {/* Zero tick */}
      <div
        className="absolute top-1/2 -translate-y-1/2 w-px h-3"
        style={{ left: "50%", background: hexAlpha(HEX.bone500, 0.3) }}
      />
      {/* Filled track from 50% to marker */}
      <div
        className="absolute top-0 h-full rounded-full"
        style={{
          left: tuned >= 0 ? "50%" : `${leftPct}%`,
          width: `${Math.abs(tuned) / 2}%`,
          background: color,
          opacity: 0.45,
          transition: animate ? "all 0.5s ease" : "none",
        }}
      />
      {/* Marker dot */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full"
        style={{
          left: `${leftPct}%`,
          width: 10,
          height: 10,
          background: color,
          boxShadow: `0 0 8px ${color}`,
          transition: animate ? "all 0.5s ease" : "none",
        }}
      />
    </div>
  );
}

// ── Net Effect Gauge ─────────────────────────────────────────────────────────
function NetGauge({ net, animate }: { net: number; animate: boolean }) {
  const { lang } = useLang();
  const color = valenceColor(net);
  const needleAngle = (net / 100) * 90; // -90 → +90 deg from vertical center
  // SVG arc gauge: semicircle
  const R = 54;
  const CX = 80;
  const CY = 74;

  // Arc from -90 deg (left) to 90 deg (right) = bottom semicircle
  // We want a track from left (−100 = ember) through center (0) to right (+100 = jade)
  function polarToXY(angleDeg: number, r: number) {
    const rad = (angleDeg - 90) * (Math.PI / 180);
    return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
  }

  const startAngle = -90;
  const endAngle = 90;
  const startPt = polarToXY(startAngle, R);
  const endPt = polarToXY(endAngle, R);

  const needlePt = polarToXY(needleAngle, R - 8);
  const needleBase1 = polarToXY(needleAngle + 90, 6);
  const needleBase2 = polarToXY(needleAngle - 90, 6);

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={160} height={90} viewBox={`0 0 ${160} 90`} aria-hidden="true">
        {/* Track arc */}
        <path
          d={`M${startPt.x},${startPt.y} A${R},${R} 0 0,1 ${endPt.x},${endPt.y}`}
          fill="none"
          stroke={hexAlpha(HEX.bone500, 0.15)}
          strokeWidth={8}
          strokeLinecap="round"
        />
        {/* Colored fill arc from center to needle */}
        {(() => {
          const centerPt = polarToXY(0, R);
          const fillEnd = polarToXY(needleAngle, R);
          const sweep = needleAngle > 0 ? 1 : 0;
          const large = Math.abs(needleAngle) > 180 ? 1 : 0;
          const startFill = needleAngle >= 0 ? centerPt : fillEnd;
          const endFill = needleAngle >= 0 ? fillEnd : centerPt;
          const actualSweep = needleAngle >= 0 ? 1 : 0;
          return (
            <path
              d={`M${startFill.x},${startFill.y} A${R},${R} 0 0,${actualSweep} ${endFill.x},${endFill.y}`}
              fill="none"
              stroke={color}
              strokeWidth={8}
              strokeLinecap="round"
              strokeOpacity={0.7}
              style={{ transition: animate ? "all 0.5s ease" : "none" }}
            />
          );
        })()}
        {/* Needle */}
        <path
          d={`M${needleBase1.x},${needleBase1.y} L${needlePt.x},${needlePt.y} L${needleBase2.x},${needleBase2.y}`}
          fill={color}
          fillOpacity={0.9}
          style={{ transition: animate ? "all 0.5s ease" : "none" }}
        />
        {/* Center pivot */}
        <circle cx={CX} cy={CY} r={5} fill={hexAlpha(HEX.bone300, 0.7)} />
        {/* Labels */}
        <text x={startPt.x - 4} y={startPt.y + 14} fontSize={8} fill={HEX.ember400} fillOpacity={0.7} textAnchor="middle" fontFamily="'IBM Plex Mono', monospace">
          −100
        </text>
        <text x={endPt.x + 4} y={endPt.y + 14} fontSize={8} fill={HEX.jade400} fillOpacity={0.7} textAnchor="middle" fontFamily="'IBM Plex Mono', monospace">
          +100
        </text>
        {/* Net value */}
        <text
          x={CX}
          y={CY - 20}
          fontSize={16}
          fontWeight="700"
          fill={color}
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="'IBM Plex Mono', monospace"
          style={{ transition: animate ? "all 0.5s ease" : "none" }}
        >
          {net > 0 ? "+" : ""}{net}
        </text>
      </svg>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function DigitalSufferingLab() {
  const { lang } = useLang();

  // peaceSlider 0 (attention) → 100 (peace)
  const [peaceSlider, setPeaceSlider] = useState(30);
  const [animating, setAnimating] = useState(false);

  // Each force gets a tuned valence based on the slider
  // Negative forces are shifted toward 0 as slider → 100 (peace)
  // Positive forces stay the same
  function tunedValence(force: DigitalForce): number {
    if (force.valence >= 0) return force.valence;
    // At peaceSlider=0 → original valence; at peaceSlider=100 → 0 (neutral)
    const shift = (-force.valence) * (peaceSlider / 100) * 0.8; // max 80% reduction
    return Math.round(force.valence + shift);
  }

  const tunedValences = useMemo(() => {
    return DIGITAL_FORCES.map((f) => tunedValence(f));
  }, [peaceSlider]); // eslint-disable-line react-hooks/exhaustive-deps

  const netEffect = useMemo(() => {
    const sum = tunedValences.reduce((s, v) => s + v, 0);
    return Math.round(sum / tunedValences.length);
  }, [tunedValences]);

  function handleSlider(e: React.ChangeEvent<HTMLInputElement>) {
    setAnimating(true);
    setPeaceSlider(Number(e.target.value));
  }

  // Debounce animating off
  useEffect(() => {
    if (!animating) return;
    const t = setTimeout(() => setAnimating(false), 600);
    return () => clearTimeout(t);
  }, [peaceSlider, animating]);

  const netLabel: Bi = useMemo(() => {
    if (netEffect > 10) return { en: "the net pull, as tuned, relieves more than it harms", zh: "如此调校后，净拉力缓解多于伤害" };
    if (netEffect < -10) return { en: "the net pull, as tuned, amplifies more than it soothes", zh: "如此调校后，净拉力加剧多于缓解" };
    return { en: "the net pull sits in uncertain balance", zh: "净拉力悬于不确定的平衡之中" };
  }, [netEffect]);

  return (
    <div className="w-full flex flex-col gap-6">

      {/* ── NET EFFECT gauge + slider ──────────────────────────────────────── */}
      <div className="rounded-2xl border border-bodhi-500/15 bg-void-900/50 p-5">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <span className="label-mono text-[0.62rem] tracking-widest text-bodhi-400">
            <T v={{ en: "NET EFFECT / 净效应", zh: "净效应" }} />
          </span>
          <span
            className={`text-[0.72rem] italic text-bone-400 ${lang === "zh" ? "zh" : ""} lang-fade`}
            key={`verdict-${lang}`}
          >
            {t(netLabel, lang)}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Gauge */}
          <div className="shrink-0">
            <NetGauge net={netEffect} animate={animating} />
          </div>

          {/* Slider + explanation */}
          <div className="flex-1 w-full">
            {/* Slider label */}
            <div className="flex justify-between mb-2">
              <span className={`label-mono text-[0.6rem] text-ember-400 ${lang === "zh" ? "zh" : ""}`}>
                {lang === "zh" ? "← 为注意力而调校" : "← tune for: attention"}
              </span>
              <span className={`label-mono text-[0.6rem] text-jade-400 ${lang === "zh" ? "zh" : ""}`}>
                {lang === "zh" ? "为安宁而调校 →" : "tune for: peace →"}
              </span>
            </div>

            {/* Slider */}
            <div className="relative">
              <input
                type="range"
                min={0}
                max={100}
                value={peaceSlider}
                onChange={handleSlider}
                className="w-full h-2 appearance-none rounded-full cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${hexAlpha(HEX.ember500, 0.6)} 0%, ${hexAlpha(HEX.bodhi500, 0.5)} 50%, ${hexAlpha(HEX.jade500, 0.6)} 100%)`,
                  outline: "none",
                }}
                aria-label={lang === "zh" ? "注意力 ↔ 安宁调校" : "attention ↔ peace tuning slider"}
              />
              {/* Thumb position indicator */}
              <div
                className="mt-1 label-mono text-[0.58rem] text-center transition-colors"
                style={{ color: valenceColor(peaceSlider - 50) }}
              >
                {peaceSlider < 20
                  ? (lang === "zh" ? "为注意力优化" : "optimised for attention")
                  : peaceSlider > 75
                  ? (lang === "zh" ? "为安宁优化" : "optimised for peace")
                  : (lang === "zh" ? "混合设计目标" : "mixed design objective")}
              </div>
            </div>

            <p className={`mt-3 text-[0.68rem] text-bone-500/65 leading-relaxed ${lang === "zh" ? "zh" : ""}`}>
              {lang === "zh"
                ? "同样的工具——设计目标决定它们疗愈还是伤害。拖动滑块，观察当负向力被重新指向安宁时，净效应如何变化。"
                : "Same tools — the design objective decides whether they heal or harm. Drag to see how the net shifts when negative forces are re-pointed toward peace."}
            </p>
          </div>
        </div>
      </div>

      {/* ── FORCE CARDS grid ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {DIGITAL_FORCES.map((force, i) => {
          const tv = tunedValences[i];
          const color = valenceColor(tv);
          const isNeg = tv < 0;
          return (
            <div
              key={force.id}
              className="rounded-2xl border bg-void-900/50 p-4 flex flex-col gap-3"
              style={{
                borderColor: hexAlpha(color, 0.2),
                boxShadow: `0 0 24px -12px ${color}`,
              }}
            >
              {/* Label + valence badge */}
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`display text-[0.82rem] font-medium leading-tight flex-1 ${lang === "zh" ? "zh" : ""} lang-fade`}
                  style={{ color }}
                  key={`lbl-${lang}`}
                >
                  {t(force.label, lang)}
                </span>
                <span
                  className="label-mono text-[0.6rem] rounded-full px-2 py-0.5 shrink-0 tabular-nums"
                  style={{
                    background: hexAlpha(color, 0.1),
                    border: `1px solid ${hexAlpha(color, 0.3)}`,
                    color,
                    transition: animating ? "all 0.5s ease" : "none",
                  }}
                >
                  {tv > 0 ? "+" : ""}{tv}
                </span>
              </div>

              {/* Valence meter */}
              <ValenceMeter valence={force.valence} tuned={tv} animate={animating} />

              {/* Axis labels below meter */}
              <div className="flex justify-between -mt-1">
                <span className="label-mono text-[0.48rem] text-ember-400/60">
                  <T v={{ en: "amplifies ←", zh: "加剧 ←" }} />
                </span>
                <span className="label-mono text-[0.48rem] text-jade-400/60">
                  <T v={{ en: "→ relieves", zh: "→ 缓解" }} />
                </span>
              </div>

              {/* Amplifies side */}
              <div
                className="rounded-lg p-2.5"
                style={{
                  background: hexAlpha(HEX.ember500, 0.07),
                  border: `1px solid ${hexAlpha(HEX.ember400, 0.15)}`,
                }}
              >
                <span className="label-mono text-[0.5rem] text-ember-400/80 block mb-1 tracking-wider">
                  <T v={{ en: "AMPLIFIES SUFFERING / 加剧苦", zh: "加剧苦" }} />
                </span>
                <p
                  className={`text-[0.66rem] text-bone-400 leading-relaxed ${lang === "zh" ? "zh" : ""} lang-fade`}
                  key={`amp-${lang}`}
                >
                  {t(force.amplifies, lang)}
                </p>
              </div>

              {/* Relieves side */}
              <div
                className="rounded-lg p-2.5"
                style={{
                  background: hexAlpha(HEX.jade500, 0.07),
                  border: `1px solid ${hexAlpha(HEX.jade400, 0.15)}`,
                }}
              >
                <span className="label-mono text-[0.5rem] text-jade-400/80 block mb-1 tracking-wider">
                  <T v={{ en: "RELIEVES / 缓解", zh: "缓解" }} />
                </span>
                <p
                  className={`text-[0.66rem] text-bone-400 leading-relaxed ${lang === "zh" ? "zh" : ""} lang-fade`}
                  key={`rel-${lang}`}
                >
                  {t(force.relieves, lang)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Footer thesis ──────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl border border-bodhi-500/12 bg-void-900/40 px-5 py-4"
      >
        <div className="flex items-start gap-3">
          <div
            className="mt-1 h-8 w-1 rounded-full shrink-0"
            style={{ background: `linear-gradient(to bottom, ${HEX.ember500}, ${HEX.jade500})` }}
          />
          <p className={`text-[0.72rem] text-bone-400/80 leading-relaxed italic ${lang === "zh" ? "zh" : ""} lang-fade`} key={`thesis-${lang}`}>
            {lang === "zh"
              ? "这已不再是意志力的私人问题。它关乎：我们最强大的注意力机器被对准了什么——以及它们是被调校去拓宽关怀之圆，还是去开采神经系统以牟利。"
              : "This is no longer a private matter of willpower. It is a question of what our most powerful attention-machines are pointed at — and whether they are tuned to widen the circle of care or to mine the nervous system for profit."}
          </p>
        </div>
      </div>
    </div>
  );
}
