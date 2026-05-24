"use client";

import { useState, useId } from "react";
import { SALVATION_SYSTEMS, type SalvationSystem } from "./content";
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
  ember500:    "#e0664f",
  ember400:    "#ea8773",
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

/* ── One distinct hue per tradition ─────────────────────────────────────── */
const TRAD_COLORS: Record<string, string> = {
  buddhism:     C.jade400,
  christianity: C.amethyst400,
  hinduism:     C.lotus400,
  daoism:       C.jade300,
  confucianism: C.bodhi400,
  islam:        C.amethyst300,
  stoicism:     C.bodhi300,
};

function hexA(hex: string, a: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a.toFixed(3)})`;
}

type View = "spectrum" | "table";

/* ── Spectrum axis geometry ─────────────────────────────────────────────── */
const AXIS_LEFT_LABEL  = { en: "healing within the world", zh: "在世间疗愈" };
const AXIS_RIGHT_LABEL = { en: "transcending self & world", zh: "超越自我与世界" };

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function SalvationSystems() {
  const { lang } = useLang();
  const uid = useId();
  const [view, setView]     = useState<View>("spectrum");
  const [selected, setSelected] = useState<string | null>(null);

  const selSystem = selected
    ? SALVATION_SYSTEMS.find((s) => s.id === selected) ?? null
    : null;

  function toggle(id: string) {
    setSelected((prev) => (prev === id ? null : id));
  }

  return (
    <div className="w-full select-none space-y-5">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="label-mono text-[0.6rem] tracking-widest text-bone-500/50 uppercase">
          <T v={{ en: "a comparative atlas of salvation — diagnosis → vision → path", zh: "救赎的比较图谱 · 诊断 → 愿景 → 道路" }} />
        </p>
        {/* View toggle */}
        <div className="flex rounded-full overflow-hidden border" style={{ borderColor: hexA(C.bodhi500, 0.25) }}>
          {(["spectrum", "table"] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="label-mono text-[0.62rem] px-3 py-1.5 transition-all duration-200"
              style={{
                background: view === v ? hexA(C.bodhi500, 0.14) : "transparent",
                color: view === v ? C.bodhi300 : C.bone500,
              }}
            >
              {v === "spectrum"
                ? <T v={{ en: "spectrum", zh: "光谱视图" }} />
                : <T v={{ en: "table", zh: "对比表格" }} />}
            </button>
          ))}
        </div>
      </div>

      {/* ── Spectrum view ─────────────────────────────────────────────────── */}
      {view === "spectrum" && (
        <div className="space-y-4">
          {/* Axis */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: hexA(C.void900, 0.7),
              border: `1px solid ${hexA(C.bodhi500, 0.12)}`,
            }}
          >
            {/* Axis labels */}
            <div className="flex justify-between items-center mb-1">
              <span className="label-mono text-[0.58rem]" style={{ color: hexA(C.jade400, 0.75) }}>
                ← <T v={AXIS_LEFT_LABEL} />
              </span>
              <span className="label-mono text-[0.58rem]" style={{ color: hexA(C.amethyst400, 0.75) }}>
                <T v={AXIS_RIGHT_LABEL} /> →
              </span>
            </div>

            {/* Track */}
            <div className="relative h-12 mt-1 mb-8" style={{ userSelect: "none" }}>
              {/* Gradient track line */}
              <div
                className="absolute top-1/2 left-0 right-0 h-px"
                style={{
                  background: `linear-gradient(to right, ${hexA(C.jade400, 0.35)}, ${hexA(C.bodhi500, 0.25)}, ${hexA(C.amethyst400, 0.35)})`,
                  transform: "translateY(-50%)",
                }}
              />
              {/* Tick marks */}
              {[0, 25, 50, 75, 100].map((pct) => (
                <div
                  key={pct}
                  className="absolute top-1/2"
                  style={{ left: `${pct}%`, transform: "translate(-50%, -50%)" }}
                >
                  <div className="w-px h-2" style={{ background: hexA(C.bone500, 0.25) }} />
                </div>
              ))}

              {/* Tradition nodes */}
              {SALVATION_SYSTEMS.map((sys) => {
                const col = TRAD_COLORS[sys.id] ?? C.bone300;
                const isSelected = selected === sys.id;
                const pct = sys.liberation; // 0–100

                return (
                  <button
                    key={sys.id}
                    onClick={() => toggle(sys.id)}
                    className="absolute"
                    style={{
                      left: `${pct}%`,
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                      zIndex: isSelected ? 10 : 1,
                    }}
                    aria-pressed={isSelected}
                    aria-label={t(sys.label, lang)}
                  >
                    <div
                      className="rounded-full transition-all duration-200"
                      style={{
                        width: isSelected ? 18 : 13,
                        height: isSelected ? 18 : 13,
                        background: isSelected ? col : hexA(col, 0.55),
                        border: `2px solid ${hexA(col, isSelected ? 0.9 : 0.45)}`,
                        boxShadow: isSelected ? `0 0 12px ${hexA(col, 0.45)}` : "none",
                      }}
                    />
                  </button>
                );
              })}
            </div>

            {/* Labels below nodes */}
            <div className="relative h-8">
              {SALVATION_SYSTEMS.map((sys) => {
                const col = TRAD_COLORS[sys.id] ?? C.bone300;
                const isSelected = selected === sys.id;
                const pct = sys.liberation;

                return (
                  <button
                    key={`lbl-${sys.id}`}
                    onClick={() => toggle(sys.id)}
                    className="absolute"
                    style={{
                      left: `${pct}%`,
                      top: 0,
                      transform: "translateX(-50%)",
                    }}
                  >
                    <span
                      className={`label-mono text-[0.58rem] whitespace-nowrap transition-all duration-200 ${lang === "zh" ? "zh" : ""}`}
                      style={{ color: isSelected ? col : hexA(col, 0.65) }}
                    >
                      {t(sys.label, lang)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Descriptive note */}
            <p className="label-mono text-[0.57rem] text-bone-500/35 mt-4">
              <T v={{
                en: "Axis is descriptive, not a ranking. Both poles reflect deep civilisational wisdom.",
                zh: "此轴为描述性，非排名。两极均体现深厚的文明智慧。",
              }} />
            </p>
          </div>

          {/* ── Selected system detail card ──────────────────────────────── */}
          {selSystem ? (
            <SystemCard sys={selSystem} lang={lang} />
          ) : (
            <div
              className="rounded-2xl p-5"
              style={{
                background: hexA(C.void800, 0.5),
                border: `1px solid ${hexA(C.bodhi500, 0.1)}`,
              }}
            >
              <p className="label-mono text-[0.62rem] text-bone-500/40 text-center">
                <T v={{ en: "Select a tradition to see its full diagnosis → vision → path", zh: "点击一个传统，查看其完整的诊断 → 愿景 → 道路" }} />
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Table view ────────────────────────────────────────────────────── */}
      {view === "table" && (
        <div className="space-y-3">
          {/* Column headers */}
          <div
            className="rounded-xl px-4 py-3"
            style={{
              background: hexA(C.void800, 0.6),
              border: `1px solid ${hexA(C.bodhi500, 0.12)}`,
            }}
          >
            <div className="grid grid-cols-[120px_1fr_1fr_1fr_1fr] gap-3 items-center">
              <span className="label-mono text-[0.58rem] text-bone-500/40 uppercase">
                <T v={{ en: "Tradition", zh: "传统" }} />
              </span>
              {[
                { en: "① Diagnosis", zh: "① 诊断" },
                { en: "② Release", zh: "② 解脱愿景" },
                { en: "③ Path", zh: "③ 道路" },
                { en: "Scope", zh: "范围" },
              ].map((col) => (
                <span key={col.en} className="label-mono text-[0.58rem] text-bone-500/40 uppercase">
                  <T v={col} />
                </span>
              ))}
            </div>
          </div>

          {/* Rows */}
          {SALVATION_SYSTEMS.map((sys) => {
            const col = TRAD_COLORS[sys.id] ?? C.bone300;
            const isSelected = selected === sys.id;
            return (
              <div
                key={sys.id}
                className="rounded-xl px-4 py-3 transition-all duration-200"
                style={{
                  background: isSelected ? hexA(col, 0.07) : hexA(C.void900, 0.55),
                  border: `1px solid ${isSelected ? hexA(col, 0.3) : hexA(C.bodhi500, 0.08)}`,
                  cursor: "pointer",
                }}
                onClick={() => toggle(sys.id)}
              >
                <div className="grid grid-cols-[120px_1fr_1fr_1fr_1fr] gap-3 items-start">
                  {/* Tradition label */}
                  <div>
                    <div
                      className={`text-sm font-medium ${lang === "zh" ? "zh" : ""}`}
                      style={{ color: col }}
                    >
                      {t(sys.label, lang)}
                    </div>
                    <div
                      className={`label-mono text-[0.55rem] mt-0.5 ${lang === "zh" ? "zh" : ""}`}
                      style={{ color: hexA(col, 0.65) }}
                    >
                      {t(sys.term, lang)}
                    </div>
                    {/* Liberation bar */}
                    <div className="mt-1.5 h-1 rounded-full overflow-hidden" style={{ background: hexA(col, 0.12) }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${sys.liberation}%`, background: hexA(col, 0.55) }}
                      />
                    </div>
                  </div>

                  {/* Diagnosis */}
                  <p
                    className={`text-[0.7rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
                    style={{ color: C.bone300 }}
                  >
                    {t(sys.diagnosis, lang)}
                  </p>

                  {/* Release */}
                  <p
                    className={`text-[0.7rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
                    style={{ color: C.bone300 }}
                  >
                    {t(sys.release, lang)}
                  </p>

                  {/* Path */}
                  <p
                    className={`text-[0.7rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
                    style={{ color: C.bone300 }}
                  >
                    {t(sys.path, lang)}
                  </p>

                  {/* Scope */}
                  <p
                    className={`text-[0.7rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
                    style={{ color: hexA(C.bone300, 0.65) }}
                  >
                    {t(sys.scope, lang)}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Insight note */}
          <p className="label-mono text-[0.6rem] text-bone-500/35 pt-1">
            <T v={{
              en: "Pattern: civilisations independently keep inventing diagnosis → vision → path systems to metabolise suffering.",
              zh: "模式：文明独立地不断发明「诊断 → 愿景 → 道路」体系，以代谢苦难。",
            }} />
          </p>
        </div>
      )}
    </div>
  );
}

/* ── Shared expanded card ────────────────────────────────────────────────── */
function SystemCard({ sys, lang }: { sys: SalvationSystem; lang: Lang }) {
  const col = TRAD_COLORS[sys.id] ?? C.bone300;

  return (
    <div
      className="rounded-2xl p-5 space-y-4"
      style={{
        background: hexA(C.void900, 0.8),
        border: `1px solid ${hexA(col, 0.3)}`,
        boxShadow: `0 0 24px ${hexA(col, 0.07)}`,
      }}
    >
      {/* Header */}
      <div className="flex items-baseline gap-3 flex-wrap">
        <span
          className={`display text-2xl ${lang === "zh" ? "zh" : ""}`}
          style={{ color: col }}
        >
          {t(sys.label, lang)}
        </span>
        <span
          className={`label-mono text-[0.65rem] ${lang === "zh" ? "zh" : ""}`}
          style={{ color: hexA(col, 0.7) }}
        >
          {t(sys.term, lang)}
        </span>
      </div>

      {/* Three-part architecture */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { num: "①", label: { en: "Diagnosis", zh: "诊断" }, text: sys.diagnosis },
          { num: "②", label: { en: "Release", zh: "解脱愿景" }, text: sys.release },
          { num: "③", label: { en: "Path", zh: "道路" }, text: sys.path },
        ].map((part) => (
          <div
            key={part.num}
            className="rounded-xl p-3 space-y-1.5"
            style={{
              background: hexA(col, 0.05),
              border: `1px solid ${hexA(col, 0.15)}`,
            }}
          >
            <div className="flex items-center gap-2">
              <span className="display text-base" style={{ color: hexA(col, 0.7) }}>{part.num}</span>
              <span
                className="label-mono text-[0.6rem] uppercase tracking-widest"
                style={{ color: hexA(col, 0.55) }}
              >
                <T v={part.label} />
              </span>
            </div>
            <p
              className={`text-xs leading-relaxed ${lang === "zh" ? "zh" : ""} lang-fade`}
              style={{ color: C.bone300 }}
            >
              {t(part.text, lang)}
            </p>
          </div>
        ))}
      </div>

      {/* Scope */}
      <div className="flex items-start gap-2 pt-1">
        <span
          className="label-mono text-[0.58rem] uppercase tracking-widest shrink-0 pt-0.5"
          style={{ color: hexA(col, 0.55) }}
        >
          <T v={{ en: "scope", zh: "范围" }} />
        </span>
        <p
          className={`text-xs leading-relaxed ${lang === "zh" ? "zh" : ""} lang-fade`}
          style={{ color: hexA(C.bone300, 0.7) }}
        >
          {t(sys.scope, lang)}
        </p>
      </div>
    </div>
  );
}
