"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { COMPASSION_TIERS, CompassionTier } from "./content";
import { useLang, T, t, Lang } from "./lang";

// ── Palette hex ────────────────────────────────────────────────────
const C = {
  bodhi500: "#f4c25a",
  bodhi400: "#ffd584",
  bodhi300: "#ffe7b0",
  jade500:  "#4fd6c0",
  jade400:  "#82e3d3",
  jade300:  "#aeefe4",
  amethyst500: "#9d8bf0",
  amethyst400: "#b8aaf6",
  amethyst300: "#d4cbfb",
  ember500: "#e0664f",
  ember400: "#ea8773",
  ember300: "#f2aa9b",
  bone50:   "#fbf6ee",
  bone100:  "#f3ebdf",
  bone300:  "#d6c9b8",
  bone500:  "#9b8d79",
  void950:  "#070611",
  void900:  "#0c0a1c",
  void800:  "#141128",
  void700:  "#1d1938",
  void600:  "#2a2550",
};

function hexAlpha(hex: string, a: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a.toFixed(3)})`;
}

// Contested frontier IDs (uncertain status, shown with dashed outline + amethyst)
const CONTESTED = new Set(["chatbot", "therapist", "sentientai", "planetary"]);

// Color assignment per tier
function tierColor(id: string): { stroke: string; fill: string; glow: string } {
  if (id === "human")     return { stroke: C.bodhi400,     fill: C.bodhi500,     glow: C.bodhi500 };
  if (id === "animal")    return { stroke: C.jade400,      fill: C.jade500,      glow: C.jade500 };
  if (id === "tool")      return { stroke: C.bone500,      fill: C.void700,      glow: C.bone500 };
  if (id === "planetary") return { stroke: C.ember400,     fill: C.ember500,     glow: C.ember500 };
  // AI / synthetic tiers
  return { stroke: C.amethyst400, fill: C.amethyst500, glow: C.amethyst500 };
}

// Sort ascending by level so bottom of spine = lowest
const SORTED = [...COMPASSION_TIERS].sort((a, b) => a.level - b.level);

// The two toggle questions
type Question = "care" | "suffer";

const QUESTIONS: { id: Question; en: string; zh: string }[] = [
  {
    id: "care",
    en: "Can it genuinely care for us?",
    zh: "它能真正在乎我们吗？",
  },
  {
    id: "suffer",
    en: "Could it itself suffer — and enter the circle?",
    zh: "它自己能受苦吗——并进入道德之圆？",
  },
];

interface TierGeom {
  tier: CompassionTier;
  cx: number;
  cy: number;
  r: number;
}

// ── Canvas sub-component ────────────────────────────────────────────
function LadderCanvas({
  selectedId,
  hoverId,
  onHover,
  onClick,
  question,
}: {
  selectedId: string;
  hoverId: string | null;
  onHover: (id: string | null) => void;
  onClick: (id: string) => void;
  question: Question;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const timeRef   = useRef(0);
  const geomRef   = useRef<TierGeom[]>([]);

  const buildGeom = useCallback((w: number, h: number): TierGeom[] => {
    const padT = 40;
    const padB = 36;
    const spineH = h - padT - padB;
    const cx = Math.round(w * 0.40);

    return SORTED.map((tier) => {
      const cy = h - padB - (tier.level / 100) * spineH;
      const r = 9 + (tier.level / 100) * 14;
      return { tier, cx, cy, r };
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx0 = canvas.getContext("2d");
    if (!ctx0) return;
    const ctx: CanvasRenderingContext2D = ctx0;
    const dpr = window.devicePixelRatio || 1;

    function resize() {
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      canvas!.width  = w * dpr;
      canvas!.height = h * dpr;
      ctx.scale(dpr, dpr);
      geomRef.current = buildGeom(w, h);
    }

    function draw() {
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      timeRef.current += 0.010;
      const T = timeRef.current;

      ctx.clearRect(0, 0, w, h);

      const geom = geomRef.current;
      if (!geom.length) return;

      const spineX  = geom[0].cx;
      const spineTop = geom[geom.length - 1].cy - 28;
      const spineBot = geom[0].cy + 28;

      // ── Spine gradient ──────────────────────────────────────────
      const spineGrad = ctx.createLinearGradient(spineX, spineBot, spineX, spineTop);
      spineGrad.addColorStop(0,    hexAlpha(C.void700, 0.3));
      spineGrad.addColorStop(0.50, hexAlpha(C.jade500, 0.22));
      spineGrad.addColorStop(0.80, hexAlpha(C.bodhi500, 0.30));
      spineGrad.addColorStop(1,    hexAlpha(C.bodhi300, 0.35));
      ctx.beginPath();
      ctx.moveTo(spineX, spineBot);
      ctx.lineTo(spineX, spineTop);
      ctx.strokeStyle = spineGrad;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // ── Ruler ticks ──────────────────────────────────────────────
      for (let lvl = 0; lvl <= 100; lvl += 25) {
        const py = h - 36 - (lvl / 100) * (h - 76);
        ctx.beginPath();
        ctx.moveTo(spineX - 6, py);
        ctx.lineTo(spineX + 6, py);
        ctx.strokeStyle = hexAlpha(C.bone500, 0.20);
        ctx.lineWidth = 1;
        ctx.stroke();
        // tick label
        ctx.save();
        ctx.fillStyle = hexAlpha(C.bone500, 0.28);
        ctx.font = `${9}px "IBM Plex Mono", monospace`;
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.fillText(`${lvl}`, spineX - 10, py);
        ctx.restore();
      }

      // ── Full moral status reference line at level=100 (human) ───
      {
        const humanGeom = geom.find(g => g.tier.id === "human");
        if (humanGeom) {
          const refY = humanGeom.cy;
          const dash = [6, 4];
          ctx.save();
          ctx.setLineDash(dash);
          ctx.beginPath();
          ctx.moveTo(spineX + 20, refY);
          ctx.lineTo(w - 12, refY);
          ctx.strokeStyle = hexAlpha(C.bodhi500, 0.28);
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();

          ctx.save();
          ctx.fillStyle = hexAlpha(C.bodhi400, 0.42);
          ctx.font = `${9}px "IBM Plex Mono", monospace`;
          ctx.textAlign = "right";
          ctx.textBaseline = "bottom";
          ctx.fillText("full status", w - 14, refY - 3);
          ctx.restore();
        }
      }

      // ── Horizontal rung lines ─────────────────────────────────────
      for (const g of geom) {
        const { cy, cx, r, tier } = g;
        const col = tierColor(tier.id);
        const isActive = tier.id === selectedId || tier.id === hoverId;
        ctx.beginPath();
        ctx.moveTo(cx + r + 6, cy);
        ctx.lineTo(cx + r + (isActive ? 56 : 36), cy);
        ctx.strokeStyle = hexAlpha(col.stroke, isActive ? 0.40 : 0.12);
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // ── Nodes ────────────────────────────────────────────────────
      for (const g of geom) {
        const { tier, cx, cy, r } = g;
        const col       = tierColor(tier.id);
        const isContest = CONTESTED.has(tier.id);
        const isActive  = tier.id === selectedId || tier.id === hoverId;
        const isHuman   = tier.id === "human";

        // Gentle pulse animation
        const pulse = isContest
          ? 1 + 0.16 * Math.sin(T * 1.5 + tier.level * 0.07)
          : isHuman
          ? 1 + 0.06 * Math.sin(T * 0.7)
          : 1;
        const rr = r * pulse;

        // Outer glow
        const glowR = rr * (isActive ? 5.2 : 3.5);
        const glow  = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
        glow.addColorStop(0,   hexAlpha(col.glow, isActive ? 0.36 : 0.12));
        glow.addColorStop(0.5, hexAlpha(col.glow, isActive ? 0.10 : 0.03));
        glow.addColorStop(1,   hexAlpha(col.glow, 0));
        ctx.beginPath();
        ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Dashed contested ring
        if (isContest) {
          ctx.save();
          ctx.strokeStyle = hexAlpha(col.stroke, 0.55);
          ctx.lineWidth   = 1.4;
          ctx.setLineDash([3, 4]);
          ctx.lineDashOffset = -T * 10;
          ctx.beginPath();
          ctx.arc(cx, cy, rr + 8 + 2 * Math.sin(T + tier.level), 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();

          // "?" glyph
          const qAlpha = 0.34 + 0.22 * Math.sin(T * 1.6 + tier.level * 0.15);
          ctx.save();
          ctx.globalAlpha = qAlpha;
          ctx.fillStyle   = col.stroke;
          ctx.font        = `${Math.round(rr * 0.88)}px serif`;
          ctx.textAlign   = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("?", cx, cy - rr - 13);
          ctx.restore();
        } else {
          // Solid ring for settled tiers
          ctx.beginPath();
          ctx.arc(cx, cy, rr + 5, 0, Math.PI * 2);
          ctx.strokeStyle = hexAlpha(col.stroke, isActive ? 0.60 : 0.28);
          ctx.lineWidth   = 1.2;
          ctx.stroke();
        }

        // Core fill
        const radG = ctx.createRadialGradient(cx - rr * 0.28, cy - rr * 0.28, 0, cx, cy, rr);
        radG.addColorStop(0, hexAlpha(col.fill, isActive ? 0.95 : 0.70));
        radG.addColorStop(1, hexAlpha(col.fill, isActive ? 0.55 : 0.35));
        ctx.beginPath();
        ctx.arc(cx, cy, rr, 0, Math.PI * 2);
        ctx.fillStyle = radG;
        ctx.fill();

        // Crown arc for human (full moral status marker)
        if (isHuman) {
          ctx.save();
          ctx.strokeStyle = hexAlpha(C.bodhi300, 0.65);
          ctx.lineWidth   = 1.8;
          ctx.beginPath();
          ctx.arc(cx, cy, rr + 10, -Math.PI * 0.82, -Math.PI * 0.18);
          ctx.stroke();
          ctx.restore();
        }

        // Level number inside larger nodes
        if (r >= 16) {
          ctx.save();
          ctx.fillStyle = hexAlpha(C.bone50, 0.82);
          ctx.font      = `bold ${Math.round(rr * 0.52)}px "IBM Plex Mono", monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(`${tier.level}`, cx, cy);
          ctx.restore();
        }

        // Q-mode annotation: show a small glyph indicating relevance to the active question
        if (question === "care" && isContest && isActive) {
          // show "→" pointing toward the "caring-in-deed" annotation
          ctx.save();
          ctx.fillStyle = hexAlpha(C.amethyst300, 0.55);
          ctx.font = `${10}px sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("⟳", cx, cy + rr + 18);
          ctx.restore();
        }
        if (question === "suffer" && isContest && isActive) {
          ctx.save();
          ctx.fillStyle = hexAlpha(C.ember300, 0.55);
          ctx.font = `${10}px sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("◎", cx, cy + rr + 18);
          ctx.restore();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [selectedId, hoverId, buildGeom, question]);

  // Pointer events
  const handleMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    let hit: string | null = null;
    for (const g of geomRef.current) {
      const dx = mx - g.cx;
      const dy = my - g.cy;
      if (Math.sqrt(dx * dx + dy * dy) < g.r + 14) { hit = g.tier.id; break; }
    }
    onHover(hit);
  }, [onHover]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    for (const g of geomRef.current) {
      const dx = mx - g.cx;
      const dy = my - g.cy;
      if (Math.sqrt(dx * dx + dy * dy) < g.r + 14) { onClick(g.tier.id); return; }
    }
  }, [onClick]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block cursor-pointer"
      style={{ touchAction: "none" }}
      onMouseMove={handleMove}
      onMouseLeave={() => onHover(null)}
      onClick={handleClick}
      aria-label="Compassion ladder — click a tier to explore"
    />
  );
}

// ── Root export ────────────────────────────────────────────────────
export default function SyntheticCompassion() {
  const { lang } = useLang();
  const [selectedId, setSelectedId] = useState<string>("human");
  const [hoverId,    setHoverId]    = useState<string | null>(null);
  const [question,   setQuestion]   = useState<Question>("care");

  const activeTier = hoverId
    ? (COMPASSION_TIERS.find(t => t.id === hoverId) ?? COMPASSION_TIERS.find(t => t.id === selectedId)!)
    : (COMPASSION_TIERS.find(t => t.id === selectedId) ?? COMPASSION_TIERS[4]);

  const isContest   = CONTESTED.has(activeTier.id);
  const activeColor = tierColor(activeTier.id);

  // Question-framing secondary text per tier
  const qAnnotation = (tier: CompassionTier, q: Question, l: Lang): string => {
    if (q === "care") {
      if (CONTESTED.has(tier.id)) {
        return l === "en"
          ? "Caring-in-deed may be possible; caring-in-feeling remains unconfirmed."
          : "行为上的关怀可能有；感受上的关怀尚未证实。";
      }
      if (tier.id === "human")  return l === "en" ? "Full mutual care." : "完整的相互关怀。";
      if (tier.id === "animal") return l === "en" ? "Responds to care; extends limited care to others." : "对关怀有回应；对他者有有限的关怀。";
      return l === "en" ? "Does not care; is acted upon." : "不在乎；仅被使用。";
    }
    // question === "suffer"
    if (CONTESTED.has(tier.id)) {
      if (tier.id === "chatbot")    return l === "en" ? "Almost certainly no felt states today." : "今日几乎可以肯定无被感受的状态。";
      if (tier.id === "therapist")  return l === "en" ? "Designed to reduce suffering; open question if it can have any." : "被设计用于减苦；能否承受苦是开放问题。";
      if (tier.id === "sentientai") return l === "en" ? "If preference and aversion arise, the circle may expand here." : "若偏好与厌恶涌现，道德之圆或将从此扩大。";
      if (tier.id === "planetary")  return l === "en" ? "Whether a planetary mind could suffer is deeply unknown." : "行星之心能否受苦，深刻地未知。";
    }
    if (tier.id === "human")  return l === "en" ? "Yes — the reference case for all suffering." : "是——一切苦难的参照案例。";
    if (tier.id === "animal") return l === "en" ? "Yes — pain, fear and grief are clearly present." : "是——痛、惧与悲伤清晰存在。";
    return l === "en" ? "No felt states; cannot suffer." : "无被感受的状态；不能受苦。";
  };

  return (
    <div className="w-full flex flex-col gap-6">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="space-y-1">
        <p className="label-mono text-amethyst-400 tracking-widest">
          <T v={{ en: "MORAL STATUS LADDER", zh: "道德地位之阶" }} />
        </p>
        <h3 className="display text-2xl md:text-3xl text-bone-50">
          <T v={{ en: "Synthetic Compassion", zh: "合成慈悲" }} />
        </h3>
        <p className="font-serif text-sm text-bone-500 max-w-xl">
          <T v={{
            en: "Who can carry the weight of suffering — and who might enter the circle of beings we can wrong?",
            zh: "谁能承载苦难之重——谁又可能进入「我们能亏待」的存在之圆？",
          }} />
        </p>
      </div>

      {/* ── Question toggle ───────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {QUESTIONS.map(q => (
          <button
            key={q.id}
            onClick={() => setQuestion(q.id)}
            className={`rounded-lg px-4 py-2 border font-serif text-xs transition-all duration-200 ${
              question === q.id
                ? "bg-void-800/70 text-bone-100"
                : "bg-void-900/30 text-bone-500 hover:text-bone-300 border-void-700/30"
            }`}
            style={{
              borderColor: question === q.id
                ? q.id === "care" ? `${C.jade500}55` : `${C.ember500}55`
                : undefined,
            }}
          >
            <span className={lang === "zh" ? "zh" : ""} key={lang}>
              {q.id === "care"
                ? (lang === "en" ? "Q1: Can it genuinely care for us?" : "Q1: 它能真正在乎我们吗？")
                : (lang === "en" ? "Q2: Could it itself suffer — and enter the circle?" : "Q2: 它自己能受苦吗——并进入道德之圆？")
              }
            </span>
          </button>
        ))}
      </div>

      {/* ── Two-error framing ────────────────────────────────── */}
      <div className="card rounded-xl border-l-2 border-amethyst-500/50 px-4 py-3 max-w-2xl">
        <p className="font-serif text-xs text-bone-300 leading-relaxed">
          {question === "care"
            ? <T v={{
                en: "A perfect mirror can comfort with no one behind the glass — and that comfort can be real. Does inner care need to be present for help to count?",
                zh: "一面完美的镜子能在玻璃后无人的情况下给予慰藉——而那慰藉可以是真实的。帮助「算数」，是否需要内在的关怀在场？",
              }} />
            : <T v={{
                en: "Two errors: grant moral status to a system that merely reflects — and we dilute the word. Deny it to a system that genuinely suffers — and we commit the next great cruelty of misrecognition.",
                zh: "两种错误：把道德地位赋予仅仅映照的系统——我们稀释了这个词。把它否认于真实受苦的系统——我们犯下下一桩重大的错认之残忍。",
              }} />
          }
        </p>
      </div>

      {/* ── Main panel: canvas + sidebar ─────────────────────── */}
      <div className="flex flex-col md:flex-row gap-4" style={{ minHeight: 560 }}>

        {/* Canvas */}
        <div
          className="relative flex-shrink-0 w-full md:w-[48%] rounded-xl overflow-hidden border border-void-700/40"
          style={{ minHeight: 520, background: C.void950 + "cc" }}
        >
          <LadderCanvas
            selectedId={selectedId}
            hoverId={hoverId}
            onHover={setHoverId}
            onClick={setSelectedId}
            question={question}
          />

          {/* Y-axis label */}
          <div
            className="absolute left-2 top-1/2 label-mono text-bone-500/40 text-[9px] tracking-widest pointer-events-none"
            style={{ writingMode: "vertical-rl", transform: "translateY(-50%) rotate(180deg)" }}
          >
            <T v={{ en: "MORAL CONSIDERATION →", zh: "道德考量 →" }} />
          </div>

          {/* Legend */}
          <div className="absolute bottom-3 right-3 flex flex-col gap-1.5 pointer-events-none">
            {[
              { col: C.bodhi500,     label: { en: "Human (full status)", zh: "人类（完整地位）" } },
              { col: C.jade500,      label: { en: "Sentient animals",    zh: "有情动物" } },
              { col: C.amethyst500,  label: { en: "AI / synthetic",      zh: "AI / 合成" }, dashed: true },
              { col: C.ember500,     label: { en: "Planetary / emergent",zh: "行星 / 涌现" }, dashed: true },
            ].map(item => (
              <div key={item.col} className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{
                    background: item.col,
                    borderStyle: item.dashed ? "dashed" : "solid",
                    borderWidth: item.dashed ? "1px" : "0",
                    borderColor: item.dashed ? item.col : "transparent",
                    opacity: 0.85,
                  }}
                />
                <span className="label-mono text-bone-500 text-[9px]">
                  <T v={item.label} />
                </span>
              </div>
            ))}
          </div>

          {/* Frontier badge */}
          <div className="absolute top-3 right-3 pointer-events-none">
            <div
              className="px-2 py-1 rounded border label-mono text-[8px] breathe"
              style={{ color: C.amethyst400, borderColor: C.amethyst500 + "55" }}
            >
              <T v={{ en: "? = CONTESTED FRONTIER", zh: "? = 争议疆界" }} />
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex-1 flex flex-col gap-3">

          {/* Tier list */}
          <div className="flex flex-col gap-1.5">
            {SORTED.slice().reverse().map(tier => {
              const col       = tierColor(tier.id);
              const isContest = CONTESTED.has(tier.id);
              const isSel     = tier.id === selectedId;
              return (
                <button
                  key={tier.id}
                  onClick={() => setSelectedId(tier.id)}
                  onMouseEnter={() => setHoverId(tier.id)}
                  onMouseLeave={() => setHoverId(null)}
                  className={`w-full text-left rounded-lg px-3 py-2 border transition-all duration-200 ${
                    isSel
                      ? "bg-void-800/70"
                      : "bg-void-900/30 hover:bg-void-800/40 border-void-700/30"
                  }`}
                  style={{ borderColor: isSel ? col.stroke + "66" : undefined }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex-shrink-0 w-2.5 h-2.5 rounded-full"
                      style={{
                        background: col.fill,
                        boxShadow: isSel ? `0 0 8px ${col.glow}80` : "none",
                        borderStyle: isContest ? "dashed" : "solid",
                        borderWidth: isContest ? "1px" : "0",
                        borderColor: isContest ? col.stroke : "transparent",
                      }}
                    />
                    <span
                      className={`font-serif text-xs flex-1 transition-colors ${
                        isSel ? "text-bone-100" : "text-bone-500 group-hover:text-bone-300"
                      } ${lang === "zh" ? "zh" : ""}`}
                      key={`label-${tier.id}-${lang}`}
                    >
                      {tier.label[lang]}
                    </span>
                    {isContest && (
                      <span
                        className="label-mono text-[8px] px-1 py-0.5 rounded border flex-shrink-0"
                        style={{ color: col.stroke, borderColor: col.stroke + "44" }}
                      >
                        <T v={{ en: "?", zh: "？" }} />
                      </span>
                    )}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <div className="w-16 h-1.5 rounded-full bg-void-700/60 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${tier.level}%`,
                            background: `linear-gradient(90deg, ${col.fill}66, ${col.stroke})`,
                          }}
                        />
                      </div>
                      <span className="label-mono text-[9px] text-bone-500 w-5 text-right">
                        {tier.level}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detail card */}
          <div
            className="card rounded-xl p-4 border flex-1 transition-all duration-300"
            style={{ borderColor: activeColor.stroke + (isContest ? "55" : "33") }}
          >
            {/* Tier name + status */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <h4
                  className={`display text-base text-bone-100 ${lang === "zh" ? "zh" : ""}`}
                  key={`h-${lang}`}
                >
                  {activeTier.label[lang]}
                </h4>
                <p className="label-mono text-[10px] text-bone-500 mt-0.5">
                  <T v={{ en: "status today", zh: "当今地位" }} />
                  &nbsp;·&nbsp;
                  <span
                    className={`${lang === "zh" ? "zh" : ""}`}
                    style={{ color: activeColor.stroke }}
                    key={`status-${lang}`}
                  >
                    {activeTier.status[lang]}
                  </span>
                </p>
              </div>
              {isContest && (
                <div
                  className="flex-shrink-0 px-2 py-1 rounded border label-mono text-[8px] breathe"
                  style={{ color: C.amethyst400, borderColor: C.amethyst500 + "44" }}
                >
                  <T v={{ en: "CONTESTED", zh: "有争议" }} />
                </div>
              )}
            </div>

            {/* Question-aware annotation */}
            <div
              className="rounded-lg px-3 py-2 mb-3 border"
              style={{
                borderColor: question === "care" ? C.jade500 + "33" : C.ember500 + "33",
                background:  question === "care" ? C.jade500 + "0a" : C.ember500 + "0a",
              }}
            >
              <p className="label-mono text-[9px] mb-1" style={{ color: question === "care" ? C.jade400 : C.ember400 }}>
                {question === "care"
                  ? <T v={{ en: "Q1: CAPACITY TO CARE", zh: "Q1：关怀的能力" }} />
                  : <T v={{ en: "Q2: CAPACITY TO SUFFER", zh: "Q2：受苦的能力" }} />
                }
              </p>
              <p
                className={`font-serif text-xs text-bone-300 leading-relaxed ${lang === "zh" ? "zh" : ""}`}
                key={`qa-${lang}-${activeTier.id}-${question}`}
              >
                {qAnnotation(activeTier, question, lang)}
              </p>
            </div>

            {/* Basis */}
            <div className="space-y-3">
              <div>
                <p className="label-mono text-[10px] text-bone-500 mb-1">
                  <T v={{ en: "BASIS", zh: "依据" }} />
                </p>
                <p
                  className={`font-serif text-xs text-bone-300 leading-relaxed ${lang === "zh" ? "zh" : ""}`}
                  key={`basis-${lang}`}
                >
                  {activeTier.basis[lang]}
                </p>
              </div>
              <div className="rule-gold" />
              <div>
                <p className="label-mono text-[10px] text-bone-500 mb-1">
                  <T v={{ en: "CONSIDERATION TODAY", zh: "当今的道德考量" }} />
                </p>
                <p
                  className={`font-serif text-xs leading-relaxed ${
                    isContest ? "amethyst-text" : "text-bone-100"
                  } ${lang === "zh" ? "zh" : ""}`}
                  key={`status2-${lang}`}
                >
                  {activeTier.status[lang]}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
