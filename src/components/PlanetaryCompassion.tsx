"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { PLANETARY_SYSTEMS, PlanetarySystem } from "./content";
import { useLang, T } from "./lang";

// ── Palette ────────────────────────────────────────────────────────
const C = {
  bodhi500:    "#f4c25a",
  bodhi400:    "#ffd584",
  bodhi300:    "#ffe7b0",
  jade500:     "#4fd6c0",
  jade400:     "#82e3d3",
  jade300:     "#aeefe4",
  amethyst500: "#9d8bf0",
  amethyst400: "#b8aaf6",
  amethyst300: "#d4cbfb",
  ember500:    "#e0664f",
  ember400:    "#ea8773",
  ember300:    "#f2aa9b",
  lotus500:    "#ef84b1",
  lotus400:    "#f6abc8",
  bone50:      "#fbf6ee",
  bone100:     "#f3ebdf",
  bone300:     "#d6c9b8",
  bone500:     "#9b8d79",
  void950:     "#070611",
  void900:     "#0c0a1c",
  void800:     "#141128",
  void700:     "#1d1938",
  void600:     "#2a2550",
};

function hexAlpha(hex: string, a: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a.toFixed(3)})`;
}

// Color per system — jade/bodhi gradient, amethyst for nascent
function systemColor(id: string, maturity: number): { stroke: string; fill: string; glow: string } {
  // maturity < 35 = mostly amethyst (nascent)
  // maturity 35–55 = jade (developing)
  // maturity > 55 = bodhi (more established)
  if (id === "earlywarning")    return { stroke: C.jade400,     fill: C.jade500,     glow: C.jade500 };
  if (id === "globalempathy")   return { stroke: C.bodhi400,    fill: C.bodhi500,    glow: C.bodhi500 };
  if (id === "aiethics")        return { stroke: C.amethyst400, fill: C.amethyst500, glow: C.amethyst500 };
  if (id === "mentalhealth")    return { stroke: C.lotus400,    fill: C.lotus500,    glow: C.lotus500 };
  if (id === "restorative")     return { stroke: C.ember400,    fill: C.ember500,    glow: C.ember500 };
  if (id === "consciousnessnet")return { stroke: C.amethyst300, fill: C.amethyst400, glow: C.amethyst400 };
  // fallback
  return { stroke: C.jade400, fill: C.jade500, glow: C.jade500 };
}

// Static angular positions for the 6 nodes orbiting the globe
// Spread evenly to avoid overlap; use an elliptical orbit
const BASE_ANGLES: Record<string, number> = {
  earlywarning:    -90,
  globalempathy:   -15,
  aiethics:         60,
  mentalhealth:    135,
  restorative:     200,
  consciousnessnet: 265,
};

interface NodeGeom {
  sys: PlanetarySystem;
  x: number;
  y: number;
  r: number;
  color: ReturnType<typeof systemColor>;
}

// Edges between coupled systems
const EDGES: [string, string][] = [
  ["earlywarning",    "globalempathy"],
  ["earlywarning",    "aiethics"],
  ["globalempathy",   "aiethics"],
  ["globalempathy",   "mentalhealth"],
  ["aiethics",        "restorative"],
  ["aiethics",        "consciousnessnet"],
  ["mentalhealth",    "restorative"],
  ["restorative",     "consciousnessnet"],
  ["consciousnessnet","earlywarning"],
];

// ── Globe canvas ────────────────────────────────────────────────────
function GlobeCanvas({
  activeId,
  onHover,
  onClick,
}: {
  activeId: string | null;
  onHover: (id: string | null) => void;
  onClick: (id: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const timeRef   = useRef(0);
  const geomRef   = useRef<NodeGeom[]>([]);

  const buildGeom = useCallback((w: number, h: number): NodeGeom[] => {
    const cx = w * 0.50;
    const cy = h * 0.50;
    const orbitRx = Math.min(w, h) * 0.38;
    const orbitRy = orbitRx * 0.68; // slightly flattened

    return PLANETARY_SYSTEMS.map(sys => {
      const angleDeg = BASE_ANGLES[sys.id] ?? 0;
      const rad = (angleDeg * Math.PI) / 180;
      const x = cx + orbitRx * Math.cos(rad);
      const y = cy + orbitRy * Math.sin(rad);
      // size ∝ scale
      const r = 12 + (sys.scale / 100) * 18;
      return { sys, x, y, r, color: systemColor(sys.id, sys.maturity) };
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
      timeRef.current += 0.007;
      const T = timeRef.current;

      ctx.clearRect(0, 0, w, h);

      const geom = geomRef.current;
      if (!geom.length) return;

      const cx = w * 0.50;
      const cy = h * 0.50;
      const orbitRx = Math.min(w, h) * 0.38;
      const orbitRy = orbitRx * 0.68;
      const sphereR = orbitRx * 0.82;

      // ── Globe fill ────────────────────────────────────────────
      const globeGrad = ctx.createRadialGradient(
        cx - sphereR * 0.22, cy - sphereR * 0.22, 0,
        cx, cy, sphereR
      );
      globeGrad.addColorStop(0,   hexAlpha(C.void700, 0.55));
      globeGrad.addColorStop(0.6, hexAlpha(C.void800, 0.40));
      globeGrad.addColorStop(1,   hexAlpha(C.void900, 0.15));
      ctx.beginPath();
      ctx.arc(cx, cy, sphereR, 0, Math.PI * 2);
      ctx.fillStyle = globeGrad;
      ctx.fill();

      // Outer glow ring
      const outerGlow = ctx.createRadialGradient(cx, cy, sphereR * 0.92, cx, cy, sphereR * 1.12);
      outerGlow.addColorStop(0, hexAlpha(C.jade500, 0.07));
      outerGlow.addColorStop(1, hexAlpha(C.jade500, 0));
      ctx.beginPath();
      ctx.arc(cx, cy, sphereR * 1.12, 0, Math.PI * 2);
      ctx.fillStyle = outerGlow;
      ctx.fill();

      // Globe border
      ctx.beginPath();
      ctx.arc(cx, cy, sphereR, 0, Math.PI * 2);
      ctx.strokeStyle = hexAlpha(C.jade500, 0.12);
      ctx.lineWidth = 1;
      ctx.stroke();

      // ── Latitude lines ────────────────────────────────────────
      for (const lat of [-0.5, 0, 0.45]) {
        const latR = sphereR * Math.sqrt(Math.max(0, 1 - lat * lat));
        const latY = cy + sphereR * lat * 0.65;
        ctx.beginPath();
        ctx.ellipse(cx, latY, latR, latR * 0.26, 0, 0, Math.PI * 2);
        ctx.strokeStyle = hexAlpha(C.jade500, 0.08);
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }

      // ── Longitude arcs ────────────────────────────────────────
      for (let li = 0; li < 3; li++) {
        const lx = cx + (li - 1) * sphereR * 0.52;
        const arcW = sphereR * 0.20;
        ctx.beginPath();
        ctx.moveTo(lx, cy - sphereR);
        ctx.bezierCurveTo(lx + arcW, cy - sphereR * 0.5, lx + arcW, cy + sphereR * 0.5, lx, cy + sphereR);
        ctx.strokeStyle = hexAlpha(C.bodhi500, 0.07);
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }

      // ── Slow orbit rotation hint: gentle drift of entire geom ──
      // Each node gets a very small angular drift (0.008 rad/s total)
      const driftedGeom = geom.map((g, i) => {
        const driftAngle = T * 0.012 + (i % 2 === 0 ? 0 : Math.PI);
        const driftAmt = 1.8; // pixels
        return {
          ...g,
          x: g.x + Math.cos(driftAngle) * driftAmt * 0.5,
          y: g.y + Math.sin(driftAngle) * driftAmt * 0.35,
        };
      });

      // ── Coupling edges ────────────────────────────────────────
      for (const [idA, idB] of EDGES) {
        const a = driftedGeom.find(g => g.sys.id === idA);
        const b = driftedGeom.find(g => g.sys.id === idB);
        if (!a || !b) continue;

        const isActive = activeId === idA || activeId === idB;
        const pulse = 0.5 + 0.5 * Math.sin(T * 0.6 + a.x * 0.008);
        const alpha = isActive ? 0.48 : 0.10 * pulse;

        // Arc through the center of the globe
        const cp1x = cx + (a.x - cx) * 0.30;
        const cp1y = cy + (a.y - cy) * 0.30;
        const cp2x = cx + (b.x - cx) * 0.30;
        const cp2y = cy + (b.y - cy) * 0.30;

        const lg = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        lg.addColorStop(0,   hexAlpha(a.color.stroke, alpha));
        lg.addColorStop(0.5, hexAlpha(C.bodhi300, alpha * 0.55));
        lg.addColorStop(1,   hexAlpha(b.color.stroke, alpha));

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, b.x, b.y);
        ctx.strokeStyle = lg;
        ctx.lineWidth = isActive ? 1.6 : 0.9;
        ctx.stroke();

        // Traveling light pulse on active edges
        if (isActive) {
          const tp = (T * 0.35) % 1;
          const bx =
            Math.pow(1 - tp, 3) * a.x +
            3 * Math.pow(1 - tp, 2) * tp * cp1x +
            3 * (1 - tp) * tp * tp * cp2x +
            Math.pow(tp, 3) * b.x;
          const by =
            Math.pow(1 - tp, 3) * a.y +
            3 * Math.pow(1 - tp, 2) * tp * cp1y +
            3 * (1 - tp) * tp * tp * cp2y +
            Math.pow(tp, 3) * b.y;
          const pg = ctx.createRadialGradient(bx, by, 0, bx, by, 7);
          pg.addColorStop(0, hexAlpha(C.bone50, 0.88));
          pg.addColorStop(1, hexAlpha(C.bone50, 0));
          ctx.beginPath();
          ctx.arc(bx, by, 7, 0, Math.PI * 2);
          ctx.fillStyle = pg;
          ctx.fill();
        }
      }

      // ── Nodes ─────────────────────────────────────────────────
      for (const g of driftedGeom) {
        const { sys, x, y, r, color } = g;
        const isActive  = sys.id === activeId;
        const isNascent = sys.maturity < 35;

        // Gentle breathe
        const breathe = 1 + 0.06 * Math.sin(T * 1.2 + sys.scale * 0.06);
        const rr = r * breathe;

        // Outer glow
        const glowR = rr * (isActive ? 5.0 : 3.2);
        const glow  = ctx.createRadialGradient(x, y, 0, x, y, glowR);
        glow.addColorStop(0,   hexAlpha(color.glow, isActive ? 0.42 : 0.15));
        glow.addColorStop(0.5, hexAlpha(color.glow, isActive ? 0.11 : 0.04));
        glow.addColorStop(1,   hexAlpha(color.glow, 0));
        ctx.beginPath();
        ctx.arc(x, y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Nascent = dashed ring (maturity < 35), mature = solid
        if (isNascent) {
          ctx.save();
          ctx.strokeStyle = hexAlpha(color.stroke, 0.52);
          ctx.lineWidth   = 1.4;
          ctx.setLineDash([3, 4]);
          ctx.lineDashOffset = -T * 8;
          ctx.beginPath();
          ctx.arc(x, y, rr + 7, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(x, y, rr + 5, 0, Math.PI * 2);
          ctx.strokeStyle = hexAlpha(color.stroke, isActive ? 0.65 : 0.30);
          ctx.lineWidth   = isActive ? 1.8 : 1.1;
          ctx.stroke();
        }

        // Maturity fill brightness: dim for nascent, bright for mature
        const fillAlpha = 0.35 + (sys.maturity / 100) * 0.55;
        const cg = ctx.createRadialGradient(x - rr * 0.28, y - rr * 0.28, 0, x, y, rr);
        cg.addColorStop(0, hexAlpha(color.fill, isActive ? 0.95 : fillAlpha + 0.10));
        cg.addColorStop(1, hexAlpha(color.fill, isActive ? 0.55 : fillAlpha - 0.10));
        ctx.beginPath();
        ctx.arc(x, y, rr, 0, Math.PI * 2);
        ctx.fillStyle = cg;
        ctx.fill();

        // Maturity number inside
        if (rr >= 14) {
          ctx.save();
          ctx.fillStyle = hexAlpha(C.void950, 0.85);
          ctx.font      = `bold ${Math.round(rr * 0.50)}px "IBM Plex Mono", monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(`${sys.maturity}`, x, y);
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
  }, [activeId, buildGeom]);

  // Pointer
  const handleMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    let hit: string | null = null;
    for (const g of geomRef.current) {
      const dx = mx - g.x;
      const dy = my - g.y;
      if (Math.sqrt(dx * dx + dy * dy) < g.r + 12) { hit = g.sys.id; break; }
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
      const dx = mx - g.x;
      const dy = my - g.y;
      if (Math.sqrt(dx * dx + dy * dy) < g.r + 12) { onClick(g.sys.id); return; }
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
      aria-label="Planetary compassion network — click a system to explore"
    />
  );
}

// ── Root export ────────────────────────────────────────────────────
export default function PlanetaryCompassion() {
  const { lang } = useLang();
  const [activeId, setActiveId] = useState<string>("earlywarning");
  const [hoverId,  setHoverId]  = useState<string | null>(null);

  const displayId = hoverId ?? activeId;
  const activeSys = PLANETARY_SYSTEMS.find(s => s.id === displayId)
    ?? PLANETARY_SYSTEMS[0];
  const activeCol = systemColor(activeSys.id, activeSys.maturity);
  const isNascent = activeSys.maturity < 35;

  // Overall average maturity
  const avgMaturity = Math.round(
    PLANETARY_SYSTEMS.reduce((s, p) => s + p.maturity, 0) / PLANETARY_SYSTEMS.length
  );

  const handleHover = useCallback((id: string | null) => setHoverId(id), []);
  const handleClick = useCallback((id: string) => setActiveId(id), []);

  return (
    <div className="w-full flex flex-col gap-6">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="space-y-1">
        <p className="label-mono text-jade-400 tracking-widest">
          <T v={{ en: "PLANETARY INFRASTRUCTURE", zh: "行星级基础设施" }} />
        </p>
        <h3 className="display text-2xl md:text-3xl text-bone-50">
          <T v={{ en: "Planetary Compassion", zh: "行星慈悲" }} />
        </h3>
        <p className="font-serif text-sm text-bone-500 max-w-xl">
          <T v={{
            en: "At planetary scale, compassion stops being a private virtue and becomes survival infrastructure.",
            zh: "在行星尺度上，慈悲不再是私人的德性，而成为生存的基础设施。",
          }} />
        </p>
      </div>

      {/* ── Maturity readout ──────────────────────────────────── */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="card rounded-xl px-4 py-2.5 border border-bodhi-500/20 flex items-center gap-3">
          <div>
            <p className="label-mono text-[9px] text-bone-500">
              <T v={{ en: "AVERAGE MATURITY", zh: "平均成熟度" }} />
            </p>
            <div className="flex items-baseline gap-1.5">
              <span
                className="display text-2xl"
                style={{ color: C.bodhi400 }}
              >
                {avgMaturity}
              </span>
              <span className="label-mono text-[10px] text-bone-500">/ 100</span>
            </div>
          </div>
          <div className="w-20 h-2 rounded-full bg-void-700/60 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${avgMaturity}%`,
                background: `linear-gradient(90deg, ${C.amethyst500}88, ${C.bodhi500})`,
              }}
            />
          </div>
        </div>

        <p className="font-serif text-xs text-bone-500 max-w-xs italic">
          <T v={{
            en: "Nascent infrastructure — most systems are early or aspirational.",
            zh: "方萌发的基础设施——多数系统尚在早期或仍属理想。",
          }} />
        </p>
      </div>

      {/* ── Main panel ───────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row gap-4" style={{ minHeight: 580 }}>

        {/* Globe canvas */}
        <div
          className="relative flex-shrink-0 w-full md:w-[54%] rounded-xl overflow-hidden border border-void-700/40"
          style={{ minHeight: 500, background: C.void950 + "cc" }}
        >
          <GlobeCanvas
            activeId={displayId}
            onHover={handleHover}
            onClick={handleClick}
          />

          {/* Legends */}
          <div className="absolute bottom-3 left-3 flex flex-col gap-1.5 pointer-events-none">
            <div className="flex items-center gap-1.5">
              <div className="w-9 h-1 rounded-full" style={{ background: `linear-gradient(90deg, ${C.amethyst500}88, ${C.bodhi500})` }} />
              <span className="label-mono text-bone-500 text-[9px]">
                <T v={{ en: "maturity (inner number)", zh: "成熟度（内部数字）" }} />
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded-full border border-dashed"
                style={{ borderColor: C.amethyst400, background: "transparent" }}
              />
              <span className="label-mono text-bone-500 text-[9px]">
                <T v={{ en: "nascent (< 35)", zh: "方萌发（< 35）" }} />
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full border" style={{ borderColor: C.jade400, background: C.jade500 + "88" }} />
              <span className="label-mono text-bone-500 text-[9px]">
                <T v={{ en: "more developed", zh: "较为成熟" }} />
              </span>
            </div>
          </div>

          <div className="absolute bottom-3 right-3 pointer-events-none label-mono text-[9px] text-bone-500/50">
            <T v={{ en: "node size = planetary scale", zh: "节点大小 = 行星尺度" }} />
          </div>
        </div>

        {/* Right column */}
        <div className="flex-1 flex flex-col gap-3">

          {/* System list */}
          <div className="flex flex-col gap-1.5">
            {PLANETARY_SYSTEMS.slice()
              .sort((a, b) => b.scale - a.scale)
              .map(sys => {
                const col    = systemColor(sys.id, sys.maturity);
                const isNas  = sys.maturity < 35;
                const isActv = sys.id === displayId;
                return (
                  <button
                    key={sys.id}
                    onMouseEnter={() => setHoverId(sys.id)}
                    onMouseLeave={() => setHoverId(null)}
                    onClick={() => setActiveId(sys.id)}
                    className={`w-full text-left rounded-lg px-3 py-2 border transition-all duration-200 ${
                      isActv
                        ? "bg-void-800/70"
                        : "bg-void-900/30 hover:bg-void-800/40 border-void-700/30"
                    }`}
                    style={{ borderColor: isActv ? col.stroke + "55" : undefined }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="flex-shrink-0 w-2.5 h-2.5 rounded-full"
                        style={{
                          background: col.fill,
                          boxShadow: isActv ? `0 0 8px ${col.glow}80` : "none",
                          borderStyle: isNas ? "dashed" : "solid",
                          borderWidth: isNas ? "1px" : "0",
                          borderColor: isNas ? col.stroke : "transparent",
                        }}
                      />
                      <span
                        className={`font-serif text-xs flex-1 transition-colors ${
                          isActv ? "text-bone-100" : "text-bone-500"
                        } ${lang === "zh" ? "zh" : ""}`}
                        key={`sl-${sys.id}-${lang}`}
                      >
                        {sys.label[lang]}
                      </span>
                      {/* Scale + maturity mini bars */}
                      <div className="flex flex-col gap-0.5 flex-shrink-0 w-20">
                        {/* Scale bar */}
                        <div className="flex items-center gap-1">
                          <span className="label-mono text-[8px] text-bone-500 w-3">S</span>
                          <div className="flex-1 h-1 rounded-full bg-void-700/60 overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${sys.scale}%`, background: col.stroke + "88" }}
                            />
                          </div>
                          <span className="label-mono text-[8px] text-bone-500 w-5 text-right">{sys.scale}</span>
                        </div>
                        {/* Maturity bar */}
                        <div className="flex items-center gap-1">
                          <span className="label-mono text-[8px] text-bone-500 w-3">M</span>
                          <div className="flex-1 h-1 rounded-full bg-void-700/60 overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${sys.maturity}%`,
                                background: `linear-gradient(90deg, ${C.amethyst500}88, ${col.stroke})`,
                              }}
                            />
                          </div>
                          <span className="label-mono text-[8px] text-bone-500 w-5 text-right">{sys.maturity}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>

          {/* Detail card: promise + risk */}
          <div
            className="card rounded-xl p-4 border flex-1 transition-all duration-300"
            style={{ borderColor: activeCol.stroke + (isNascent ? "44" : "33") }}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <h4
                  className={`display text-base text-bone-100 ${lang === "zh" ? "zh" : ""}`}
                  key={`dh-${lang}`}
                >
                  {activeSys.label[lang]}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="label-mono text-[9px] text-bone-500">
                    <T v={{ en: "scale", zh: "尺度" }} />&nbsp;{activeSys.scale}
                  </span>
                  <span className="text-bone-500/40 text-[9px]">·</span>
                  <span className="label-mono text-[9px] text-bone-500">
                    <T v={{ en: "maturity", zh: "成熟度" }} />&nbsp;
                    <span style={{ color: activeCol.stroke }}>{activeSys.maturity}</span>
                  </span>
                </div>
              </div>
              {isNascent && (
                <div
                  className="flex-shrink-0 px-2 py-1 rounded border label-mono text-[8px] breathe"
                  style={{ color: C.amethyst400, borderColor: C.amethyst500 + "44" }}
                >
                  <T v={{ en: "NASCENT", zh: "初生" }} />
                </div>
              )}
            </div>

            <div className="space-y-3">
              {/* Promise */}
              <div>
                <p className="label-mono text-[10px] mb-1" style={{ color: C.jade400 }}>
                  <T v={{ en: "PROMISE", zh: "承诺" }} />
                </p>
                <p
                  className={`font-serif text-xs text-bone-300 leading-relaxed ${lang === "zh" ? "zh" : ""}`}
                  key={`promise-${lang}`}
                >
                  {activeSys.promise[lang]}
                </p>
              </div>

              <div className="rule-gold" />

              {/* Risk */}
              <div>
                <p className="label-mono text-[10px] mb-1" style={{ color: C.ember400 }}>
                  <T v={{ en: "RISK", zh: "风险" }} />
                </p>
                <p
                  className={`font-serif text-xs text-bone-300 leading-relaxed ${lang === "zh" ? "zh" : ""}`}
                  key={`risk-${lang}`}
                >
                  {activeSys.risk[lang]}
                </p>
              </div>
            </div>
          </div>

          {/* Planetary framing note */}
          <div
            className="card rounded-xl px-4 py-3 border"
            style={{ borderColor: C.jade500 + "28", background: C.jade500 + "08" }}
          >
            <p className="font-serif text-xs leading-relaxed" style={{ color: C.jade300 }}>
              <T v={{
                en: "Felt empathy cannot scale to billions — but institutions, technologies and norms that act as if we cared can. Design is the only path.",
                zh: "可感的共情无法扩展到数十亿人——但「行动得仿佛我们在乎」的制度、技术与规范却可以。设计是唯一的路径。",
              }} />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
