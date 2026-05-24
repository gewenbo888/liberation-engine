"use client";

import { useState } from "react";
import { useLang, T, t } from "./lang";
import { Lang } from "./lang";
import { AFFLICTIONS, HEALING_MODALITIES } from "./content";

// ── Palette hex (no rgba inputs to hexAlpha) ────────────────────────────────
const HEX = {
  ember500: "#e0664f",
  ember400: "#ea8773",
  ember300: "#f2aa9b",
  jade500:  "#4fd6c0",
  jade400:  "#82e3d3",
  jade300:  "#aeefe4",
  lotus500: "#ef84b1",
  lotus400: "#f6abc8",
  bodhi500: "#f4c25a",
  bodhi400: "#ffd584",
  amethyst500: "#9d8bf0",
  amethyst400: "#b8aaf6",
  bone300:  "#d6c9b8",
  bone500:  "#9b8d79",
  void800:  "#141128",
  void900:  "#0c0a1c",
};

function hexAlpha(hex: string, a: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a.toFixed(3)})`;
}

// Modality colour cycle: jade, lotus, bodhi, amethyst, jade400
const MODALITY_COLORS = [
  HEX.jade500,
  HEX.lotus500,
  HEX.bodhi500,
  HEX.amethyst500,
  HEX.jade400,
];

function modalityColor(idx: number) {
  return MODALITY_COLORS[idx % MODALITY_COLORS.length];
}

// ── Affliction node size: 28–52px diameter ∝ load ─────────────────────────
function afflNodeR(load: number) {
  return 14 + (load / 100) * 22; // radius 14–36
}

// ── Window of Tolerance sub-visual ─────────────────────────────────────────
function WindowOfTolerance({ lang }: { lang: Lang }) {
  return (
    <div className="rounded-2xl border border-bodhi-500/15 bg-void-900/50 p-5 mt-6">
      <div className="flex items-center justify-between mb-4">
        <span className="label-mono text-[0.62rem] tracking-widest text-bodhi-400">
          <T v={{ en: "WINDOW OF TOLERANCE", zh: "耐受之窗" }} />
        </span>
        <span className="label-mono text-[0.55rem] text-bone-500/50">
          <T v={{ en: "healing widens this window", zh: "疗愈拓宽这扇窗" }} />
        </span>
      </div>

      <div className="flex gap-4 items-stretch">
        {/* Vertical band */}
        <div className="flex flex-col items-center gap-0 shrink-0 w-20 md:w-24">
          {/* Hyper-arousal zone */}
          <div
            className="w-full rounded-t-lg flex items-center justify-center py-2.5"
            style={{ background: hexAlpha(HEX.ember500, 0.18), border: `1px solid ${hexAlpha(HEX.ember400, 0.3)}` }}
          >
            <span className={`label-mono text-[0.5rem] text-ember-400 text-center leading-tight ${lang === "zh" ? "zh" : ""}`}>
              {lang === "zh" ? "过度警觉" : "alarm"}
            </span>
          </div>
          {/* Tolerable window */}
          <div
            className="w-full flex items-center justify-center py-4 relative"
            style={{
              background: hexAlpha(HEX.jade500, 0.15),
              border: `1px solid ${hexAlpha(HEX.jade400, 0.35)}`,
              borderTop: "none",
              borderBottom: "none",
            }}
          >
            <div
              className="absolute inset-1 rounded-sm opacity-30"
              style={{ background: `linear-gradient(to bottom, ${hexAlpha(HEX.jade500, 0.2)}, ${hexAlpha(HEX.bodhi500, 0.2)})` }}
            />
            <span className={`label-mono text-[0.5rem] text-jade-400 text-center leading-tight z-10 ${lang === "zh" ? "zh" : ""}`}>
              {lang === "zh" ? "可运作区" : "workable"}
            </span>
          </div>
          {/* Hypo-arousal zone */}
          <div
            className="w-full rounded-b-lg flex items-center justify-center py-2.5"
            style={{ background: hexAlpha(HEX.amethyst500, 0.15), border: `1px solid ${hexAlpha(HEX.amethyst400, 0.25)}` }}
          >
            <span className={`label-mono text-[0.5rem] text-amethyst-400 text-center leading-tight ${lang === "zh" ? "zh" : ""}`}>
              {lang === "zh" ? "关闭麻木" : "shutdown"}
            </span>
          </div>
        </div>

        {/* Labels + description */}
        <div className="flex flex-col justify-between flex-1 gap-2 py-0.5">
          <div>
            <p className={`label-mono text-[0.58rem] text-ember-400 leading-tight ${lang === "zh" ? "zh" : ""}`}>
              {lang === "zh" ? "过度警觉（alarm）" : "hyper-arousal · alarm"}
            </p>
            <p className={`text-[0.7rem] text-bone-500 leading-relaxed mt-0.5 ${lang === "zh" ? "zh" : ""}`}>
              {lang === "zh"
                ? "神经系统锁定于戒备——惊吓、闯入性记忆、无法平静。"
                : "Nervous system locked in alarm — startle, intrusion, unable to settle."}
            </p>
          </div>
          <div className="text-center">
            <p className={`text-[0.72rem] text-jade-300 leading-relaxed italic ${lang === "zh" ? "zh" : ""}`}>
              {lang === "zh"
                ? "↕ 可运作区：能思考、感受与连接"
                : "↕ workable zone: can think, feel and connect"}
            </p>
          </div>
          <div>
            <p className={`label-mono text-[0.58rem] text-amethyst-400 leading-tight ${lang === "zh" ? "zh" : ""}`}>
              {lang === "zh" ? "关闭麻木（shutdown）" : "hypo-arousal · shutdown"}
            </p>
            <p className={`text-[0.7rem] text-bone-500 leading-relaxed mt-0.5 ${lang === "zh" ? "zh" : ""}`}>
              {lang === "zh"
                ? "系统关闭——解离、麻木、情感缺席。"
                : "System shuts down — dissociation, numbness, emotional absence."}
            </p>
          </div>
        </div>

        {/* Arrow showing widening */}
        <div className="flex flex-col items-center justify-center shrink-0 gap-2 pr-1">
          <div className="flex flex-col items-center gap-1">
            <div className="w-px h-8" style={{ background: `linear-gradient(to bottom, ${hexAlpha(HEX.bodhi500, 0)}, ${hexAlpha(HEX.bodhi500, 0.6)})` }} />
            <div
              className="rounded-full px-2 py-1 text-center"
              style={{ background: hexAlpha(HEX.bodhi500, 0.12), border: `1px solid ${hexAlpha(HEX.bodhi400, 0.3)}` }}
            >
              <span className={`label-mono text-[0.48rem] text-bodhi-400 block leading-tight ${lang === "zh" ? "zh" : ""}`}>
                {lang === "zh" ? "疗愈拓宽" : "healing"}
              </span>
              <span className="label-mono text-[0.48rem] text-bodhi-300 block mt-0.5">↕</span>
            </div>
            <div className="w-px h-8" style={{ background: `linear-gradient(to top, ${hexAlpha(HEX.bodhi500, 0)}, ${hexAlpha(HEX.bodhi500, 0.6)})` }} />
          </div>
        </div>
      </div>

      <p className={`mt-3 text-[0.68rem] text-bone-500/70 leading-relaxed border-t border-bodhi-500/10 pt-3 ${lang === "zh" ? "zh" : ""}`}>
        {lang === "zh"
          ? "每一种疗愈模式都在拓宽「可运作区」——使心智能在不被淹没的情况下承载更多。"
          : "Each modality widens the workable zone — so the mind can hold more without being overwhelmed."}
      </p>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
export default function HealingPathways() {
  const { lang } = useLang();
  const [activeAffliction, setActiveAffliction] = useState<string | null>(null);
  const [activeModality, setActiveModality] = useState<string | null>(null);

  // Compute which connections are active
  function isConnectionActive(afflictionId: string, modalityIdx: number): boolean {
    const modality = HEALING_MODALITIES[modalityIdx];
    if (activeAffliction) {
      return modality.reaches.includes(activeAffliction) && afflictionId === activeAffliction;
    }
    if (activeModality) {
      return activeModality === modality.id && modality.reaches.includes(afflictionId);
    }
    return false;
  }

  function isAfflictionHighlighted(id: string): boolean {
    if (activeAffliction) return activeAffliction === id;
    if (activeModality) {
      const mod = HEALING_MODALITIES.find((m) => m.id === activeModality);
      return mod ? mod.reaches.includes(id) : false;
    }
    return false;
  }

  function isModalityHighlighted(id: string): boolean {
    if (activeModality) return activeModality === id;
    if (activeAffliction) {
      const mod = HEALING_MODALITIES.find((m) => m.id === id);
      return mod ? mod.reaches.includes(activeAffliction) : false;
    }
    return false;
  }

  const activeAfflictionData = AFFLICTIONS.find((a) => a.id === activeAffliction);
  const activeModalityData = HEALING_MODALITIES.find((m) => m.id === activeModality);

  // SVG layout — afflictions left column, modalities right column
  // We'll render a pure SVG for the bipartite graph + HTML nodes overlaid
  const SVG_W = 640;
  const SVG_H = 340;
  const LEFT_X = 90;
  const RIGHT_X = SVG_W - 90;
  const N_AFFLIC = AFFLICTIONS.length; // 5
  const N_MOD = HEALING_MODALITIES.length; // 5

  function afflY(i: number) {
    return ((i + 0.5) / N_AFFLIC) * SVG_H;
  }
  function modY(i: number) {
    return ((i + 0.5) / N_MOD) * SVG_H;
  }

  // Determine edge opacity
  function edgeOpacity(afflIdx: number, modIdx: number): number {
    const modality = HEALING_MODALITIES[modIdx];
    const affId = AFFLICTIONS[afflIdx].id;
    if (!modality.reaches.includes(affId)) return 0;
    if (!activeAffliction && !activeModality) return 0.18;
    if (isConnectionActive(affId, modIdx)) return 0.85;
    return 0.06;
  }

  function edgeColor(modIdx: number): string {
    return modalityColor(modIdx);
  }

  return (
    <div className="w-full select-none">
      {/* Framing line */}
      <p className={`text-[0.78rem] text-bone-500/70 italic leading-relaxed mb-6 border-l-2 border-bodhi-500/30 pl-4 ${lang === "zh" ? "zh" : ""}`}>
        <T v={{
          en: "Mental stability is shared infrastructure, not private luxury — how afflictions meet their healers.",
          zh: "心理的稳定是共享的基础设施，而非私人的奢侈——苦难如何遇见它的疗愈者。",
        }} />
      </p>

      {/* Bipartite network */}
      <div
        className="rounded-2xl border border-bodhi-500/15 bg-void-900/50 overflow-hidden"
        style={{ minHeight: 320 }}
      >
        {/* Column headers */}
        <div className="flex justify-between px-6 pt-4 pb-1">
          <span className="label-mono text-[0.58rem] tracking-widest text-ember-400">
            <T v={{ en: "AFFLICTIONS", zh: "病苦" }} />
          </span>
          <span className="label-mono text-[0.58rem] tracking-widest text-jade-400">
            <T v={{ en: "HEALING MODALITIES", zh: "疗愈方式" }} />
          </span>
        </div>

        {/* SVG + node overlays — responsive via viewBox */}
        <div className="relative w-full" style={{ paddingBottom: `${(SVG_H / SVG_W) * 100}%` }}>
          <div className="absolute inset-0">
            <svg
              viewBox={`0 0 ${SVG_W} ${SVG_H}`}
              preserveAspectRatio="xMidYMid meet"
              className="absolute inset-0 w-full h-full"
              aria-hidden="true"
            >
              {/* Draw all edges */}
              {AFFLICTIONS.map((afflic, ai) =>
                HEALING_MODALITIES.map((mod, mi) => {
                  if (!mod.reaches.includes(afflic.id)) return null;
                  const op = edgeOpacity(ai, mi);
                  if (op === 0) return null;
                  const color = edgeColor(mi);
                  const x1 = LEFT_X + afflNodeR(afflic.load);
                  const y1 = afflY(ai);
                  const x2 = RIGHT_X - 18;
                  const y2 = modY(mi);
                  // Cubic bezier through midpoint
                  const mx = (x1 + x2) / 2;
                  return (
                    <path
                      key={`${afflic.id}-${mod.id}`}
                      d={`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`}
                      fill="none"
                      stroke={color}
                      strokeWidth={op > 0.5 ? 2 : 1}
                      strokeOpacity={op}
                      strokeLinecap="round"
                    />
                  );
                })
              )}

              {/* Affliction nodes */}
              {AFFLICTIONS.map((afflic, ai) => {
                const r = afflNodeR(afflic.load);
                const cx = LEFT_X;
                const cy = afflY(ai);
                const isActive = isAfflictionHighlighted(afflic.id);
                const muted = (activeAffliction || activeModality) && !isActive;
                return (
                  <g
                    key={afflic.id}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setActiveModality(null);
                      setActiveAffliction(activeAffliction === afflic.id ? null : afflic.id);
                    }}
                  >
                    {/* Glow */}
                    {isActive && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={r + 10}
                        fill="none"
                        stroke={HEX.ember400}
                        strokeWidth={8}
                        strokeOpacity={0.12}
                      />
                    )}
                    {/* Node circle */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={r}
                      fill={hexAlpha(HEX.ember500, muted ? 0.12 : isActive ? 0.55 : 0.32)}
                      stroke={HEX.ember400}
                      strokeWidth={isActive ? 2 : 1}
                      strokeOpacity={muted ? 0.2 : isActive ? 0.9 : 0.55}
                    />
                    {/* Label */}
                    <text
                      x={cx - r - 7}
                      y={cy}
                      textAnchor="end"
                      dominantBaseline="middle"
                      fontSize={lang === "zh" ? 10 : 9}
                      fill={HEX.bone300}
                      fillOpacity={muted ? 0.3 : 0.85}
                      fontFamily="'IBM Plex Mono', monospace"
                    >
                      {t(afflic.label, lang)}
                    </text>
                    {/* Load badge */}
                    <text
                      x={cx}
                      y={cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={8}
                      fill={HEX.ember300}
                      fillOpacity={muted ? 0.25 : 0.9}
                      fontFamily="'IBM Plex Mono', monospace"
                    >
                      {afflic.load}
                    </text>
                  </g>
                );
              })}

              {/* Modality nodes */}
              {HEALING_MODALITIES.map((mod, mi) => {
                const cx = RIGHT_X;
                const cy = modY(mi);
                const color = modalityColor(mi);
                const isActive = isModalityHighlighted(mod.id);
                const muted = (activeAffliction || activeModality) && !isActive;
                const r = 18;
                return (
                  <g
                    key={mod.id}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setActiveAffliction(null);
                      setActiveModality(activeModality === mod.id ? null : mod.id);
                    }}
                  >
                    {isActive && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={r + 10}
                        fill="none"
                        stroke={color}
                        strokeWidth={8}
                        strokeOpacity={0.15}
                      />
                    )}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={r}
                      fill={hexAlpha(color, muted ? 0.08 : isActive ? 0.4 : 0.2)}
                      stroke={color}
                      strokeWidth={isActive ? 2 : 1}
                      strokeOpacity={muted ? 0.2 : isActive ? 0.95 : 0.6}
                    />
                    <text
                      x={cx + r + 7}
                      y={cy}
                      textAnchor="start"
                      dominantBaseline="middle"
                      fontSize={lang === "zh" ? 10 : 9}
                      fill={HEX.bone300}
                      fillOpacity={muted ? 0.3 : 0.85}
                      fontFamily="'IBM Plex Mono', monospace"
                    >
                      {t(mod.label, lang)}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Hint */}
        <div className="text-center pb-3">
          <span className="label-mono text-[0.55rem] text-bone-500/40">
            <T v={{ en: "click a node to explore connections", zh: "点击节点以探索连接" }} />
          </span>
        </div>
      </div>

      {/* Detail panel — affliction or modality */}
      {(activeAfflictionData || activeModalityData) && (
        <div
          className="mt-4 rounded-2xl border border-bodhi-500/15 bg-void-900/60 p-5 transition-all"
          key={activeAffliction ?? activeModality}
        >
          {activeAfflictionData && (
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ background: HEX.ember400, boxShadow: `0 0 10px ${HEX.ember400}` }}
                />
                <span
                  className={`display text-base font-medium ${lang === "zh" ? "zh" : ""} lang-fade`}
                  style={{ color: HEX.ember400 }}
                  key={lang}
                >
                  {t(activeAfflictionData.label, lang)}
                </span>
                <span
                  className="label-mono text-[0.6rem] rounded-full px-2 py-0.5"
                  style={{
                    background: hexAlpha(HEX.ember500, 0.15),
                    border: `1px solid ${hexAlpha(HEX.ember400, 0.3)}`,
                    color: HEX.ember400,
                  }}
                >
                  <T v={{ en: "severity", zh: "严重度" }} /> {activeAfflictionData.load}
                </span>
              </div>
              <p
                className={`text-[0.78rem] text-bone-300 leading-relaxed ${lang === "zh" ? "zh" : ""} lang-fade`}
                key={`mech-${lang}`}
              >
                {t(activeAfflictionData.mechanism, lang)}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="label-mono text-[0.55rem] text-bone-500/50 self-center">
                  <T v={{ en: "helped by →", zh: "可被帮助于 →" }} />
                </span>
                {HEALING_MODALITIES.filter((m) => m.reaches.includes(activeAfflictionData.id)).map((m, i) => {
                  const color = modalityColor(HEALING_MODALITIES.indexOf(m));
                  return (
                    <button
                      key={m.id}
                      onClick={() => { setActiveAffliction(null); setActiveModality(m.id); }}
                      className={`label-mono text-[0.6rem] rounded-full px-2.5 py-0.5 transition-all hover:opacity-80 ${lang === "zh" ? "zh" : ""}`}
                      style={{
                        background: hexAlpha(color, 0.12),
                        border: `1px solid ${hexAlpha(color, 0.35)}`,
                        color,
                      }}
                    >
                      {t(m.label, lang)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeModalityData && !activeAfflictionData && (() => {
            const modIdx = HEALING_MODALITIES.findIndex((m) => m.id === activeModalityData.id);
            const color = modalityColor(modIdx);
            return (
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ background: color, boxShadow: `0 0 10px ${color}` }}
                  />
                  <span
                    className={`display text-base font-medium ${lang === "zh" ? "zh" : ""} lang-fade`}
                    style={{ color }}
                    key={lang}
                  >
                    {t(activeModalityData.label, lang)}
                  </span>
                </div>
                <p
                  className={`text-[0.78rem] text-bone-300 leading-relaxed ${lang === "zh" ? "zh" : ""} lang-fade`}
                  key={`how-${lang}`}
                >
                  {t(activeModalityData.how, lang)}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="label-mono text-[0.55rem] text-bone-500/50 self-center">
                    <T v={{ en: "reaches →", zh: "触及 →" }} />
                  </span>
                  {activeModalityData.reaches.map((afflId) => {
                    const afflic = AFFLICTIONS.find((a) => a.id === afflId);
                    if (!afflic) return null;
                    return (
                      <button
                        key={afflId}
                        onClick={() => { setActiveModality(null); setActiveAffliction(afflId); }}
                        className={`label-mono text-[0.6rem] rounded-full px-2.5 py-0.5 transition-all hover:opacity-80 ${lang === "zh" ? "zh" : ""}`}
                        style={{
                          background: hexAlpha(HEX.ember500, 0.12),
                          border: `1px solid ${hexAlpha(HEX.ember400, 0.3)}`,
                          color: HEX.ember400,
                        }}
                      >
                        {t(afflic.label, lang)}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Legend row */}
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 items-center">
        <div className="flex items-center gap-2">
          <div
            className="rounded-full"
            style={{
              width: 10, height: 10,
              background: hexAlpha(HEX.ember500, 0.6),
              border: `1px solid ${HEX.ember400}`,
            }}
          />
          <span className="label-mono text-[0.58rem] text-bone-500">
            <T v={{ en: "affliction · size = severity", zh: "病苦 · 大小 = 严重度" }} />
          </span>
        </div>
        {HEALING_MODALITIES.map((mod, mi) => (
          <div key={mod.id} className="flex items-center gap-2">
            <div
              className="rounded-full"
              style={{
                width: 8, height: 8,
                background: hexAlpha(modalityColor(mi), 0.4),
                border: `1px solid ${modalityColor(mi)}`,
              }}
            />
            <span className={`label-mono text-[0.55rem] text-bone-500/60 ${lang === "zh" ? "zh" : ""}`}>
              {t(mod.label, lang)}
            </span>
          </div>
        ))}
      </div>

      {/* Window of tolerance */}
      <WindowOfTolerance lang={lang} />
    </div>
  );
}
