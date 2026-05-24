"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useLang, T } from "./lang";
import { LENSES, ANALYST_QUESTIONS, type AnalystQ } from "./content";

/* ── per-lens accent tokens ── */
const LENS_ACCENTS: {
  label: string;
  border: string;
  glow: string;
  dot: string;
  ring: string;
}[] = [
  {
    /* philosopher — bodhi gold */
    label: "text-bodhi-400",
    border: "border-bodhi-500/30",
    glow: "shadow-bodhi-500/10",
    dot: "bg-bodhi-500",
    ring: "border-bodhi-500/40",
  },
  {
    /* psychologist — lotus rose */
    label: "text-lotus-500",
    border: "border-lotus-500/30",
    glow: "shadow-lotus-500/10",
    dot: "bg-lotus-500",
    ring: "border-lotus-500/40",
  },
  {
    /* contemplative — jade */
    label: "text-jade-500",
    border: "border-jade-500/30",
    glow: "shadow-jade-500/10",
    dot: "bg-jade-500",
    ring: "border-jade-500/40",
  },
  {
    /* ethicist — amethyst */
    label: "text-amethyst-500",
    border: "border-amethyst-500/30",
    glow: "shadow-amethyst-500/10",
    dot: "bg-amethyst-500",
    ring: "border-amethyst-500/40",
  },
  {
    /* consciousness theorist — amethyst-300, lighter */
    label: "text-amethyst-300",
    border: "border-amethyst-300/30",
    glow: "shadow-amethyst-300/10",
    dot: "bg-amethyst-300",
    ring: "border-amethyst-300/40",
  },
  {
    /* systems analyst — bodhi-300, warm pale gold */
    label: "text-bodhi-300",
    border: "border-bodhi-300/30",
    glow: "shadow-bodhi-300/10",
    dot: "bg-bodhi-300",
    ring: "border-bodhi-300/40",
  },
];

/* ── decorative top-rule for each card ── */
function LensRule({ accent }: { accent: (typeof LENS_ACCENTS)[0] }) {
  return (
    <div className={`h-px w-10 mb-4 rounded-full opacity-50 ${accent.dot}`} />
  );
}

type CardState = "hidden" | "visible";

export default function LiberationAnalyst() {
  const { lang } = useLang();

  const [qIdx, setQIdx] = useState(0);
  const [focusedLens, setFocusedLens] = useState<string | null>(null);
  const [cardStates, setCardStates] = useState<CardState[]>(
    LENSES.map(() => "hidden")
  );
  const [inputVal, setInputVal] = useState("");
  const [inputFeedback, setInputFeedback] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  /* stagger the six lens cards in on question change */
  const staggerReveal = useCallback(() => {
    timerRefs.current.forEach(clearTimeout);
    timerRefs.current = [];

    setCardStates(LENSES.map(() => "hidden"));
    setFocusedLens(null);

    /* brief "analyzing…" shimmer */
    setAnalyzing(true);
    const shimmerTimer = setTimeout(() => setAnalyzing(false), 520);
    timerRefs.current.push(shimmerTimer);

    LENSES.forEach((_, i) => {
      const delay = 520 + i * 120;
      const t = setTimeout(() => {
        setCardStates((prev) => {
          const next = [...prev] as CardState[];
          next[i] = "visible";
          return next;
        });
      }, delay);
      timerRefs.current.push(t);
    });
  }, []);

  useEffect(() => {
    staggerReveal();
    return () => {
      timerRefs.current.forEach(clearTimeout);
    };
  }, [qIdx, staggerReveal]);

  useEffect(() => {
    return () => {
      timerRefs.current.forEach(clearTimeout);
    };
  }, []);

  const selectedQ: AnalystQ = ANALYST_QUESTIONS[qIdx];

  /* naive keyword match to pick the closest curated question */
  function pickClosestQuestion(input: string): number {
    if (!input.trim()) return 0;
    const lower = input.toLowerCase();
    let best = 0;
    let bestScore = -1;
    ANALYST_QUESTIONS.forEach((aq, i) => {
      const qWords = aq.q.en.toLowerCase().split(/\s+/);
      const score = qWords.filter((w) => w.length > 3 && lower.includes(w)).length;
      if (score > bestScore) {
        bestScore = score;
        best = i;
      }
    });
    return best;
  }

  function handleInputSubmit(e: React.FormEvent) {
    e.preventDefault();
    const closest = pickClosestQuestion(inputVal);
    setQIdx(closest);
    setInputFeedback(true);
    setTimeout(() => setInputFeedback(false), 3400);
  }

  const isZh = lang === "zh";

  return (
    <section className="w-full py-20 px-4">

      {/* ── section heading ── */}
      <div className="max-w-4xl mx-auto mb-14 text-center">
        {/* eyebrow */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="h-px w-8 bg-bodhi-500/40 rounded-full" />
          <span className="label-mono text-bodhi-400 text-xs tracking-widest uppercase">
            <T v={{ en: "AI Layer · Liberation Analyst", zh: "AI 层 · 解脱分析师" }} />
          </span>
          <span className="h-px w-8 bg-bodhi-500/40 rounded-full" />
        </div>

        <h2
          className={`display text-3xl md:text-4xl lg:text-5xl font-light text-bone-50 leading-tight mb-5 ${isZh ? "zh" : ""} lang-fade`}
          key={lang + "-title"}
        >
          <T v={{ en: "Six Heights, One Question", zh: "六种高度，一个问题" }} />
        </h2>

        <p
          className={`font-serif text-bone-300 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-8 ${isZh ? "zh" : ""} lang-fade`}
          key={lang + "-sub"}
        >
          <T
            v={{
              en: "Each question is read through six irreducible perspectives — not as spiritual clichés or competing slogans, but as six elevations from which the structure of suffering, compassion and liberation appears differently. No single lens is the whole view; all six are required.",
              zh: "每一个问题都被六种不可化约的视角阅读——不是灵性的陈词滥调，也不是相互竞争的口号，而是六种高度，苦、慈悲与解脱的结构在那里呈现出各异的面貌。没有哪一个镜头是全部的视野；六者皆需。",
            }}
          />
        </p>

        {/* lens legend strip */}
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
          {LENSES.map((lens, i) => {
            const acc = LENS_ACCENTS[i];
            return (
              <span
                key={lens.id}
                className={`label-mono text-[0.65rem] tracking-wide ${acc.label} opacity-70`}
              >
                <T v={lens.label} />
              </span>
            );
          })}
        </div>
      </div>

      {/* ── question selector ── */}
      <div className="max-w-3xl mx-auto mb-14">
        <p className="label-mono text-bone-500 text-xs tracking-widest mb-5 text-center uppercase">
          <T v={{ en: "Curated example analyses", zh: "精选示例分析" }} />
        </p>

        {/* question chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {ANALYST_QUESTIONS.map((aq, i) => {
            const isActive = i === qIdx;
            return (
              <button
                key={i}
                onClick={() => setQIdx(i)}
                className={`
                  group relative text-left px-5 py-4 rounded-2xl border transition-all duration-300
                  ${
                    isActive
                      ? "border-bodhi-500/50 bg-bodhi-500/8 shadow-lg shadow-bodhi-500/8"
                      : "border-void-700/60 bg-void-900/40 hover:border-bodhi-500/25 hover:bg-void-800/60"
                  }
                `}
              >
                {/* active pip */}
                <span
                  className={`absolute top-3.5 right-4 w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    isActive
                      ? "bg-bodhi-400 opacity-100"
                      : "bg-void-600 opacity-0 group-hover:opacity-40"
                  }`}
                />
                <span
                  className={`
                    display text-sm md:text-base font-light leading-snug block transition-colors duration-300
                    ${isActive ? "text-bone-50" : "text-bone-300 group-hover:text-bone-100"}
                    ${isZh ? "zh" : ""} lang-fade
                  `}
                  key={lang + "-q" + i}
                >
                  {aq.q[lang]}
                </span>
              </button>
            );
          })}
        </div>

        {/* free-text input */}
        <form
          onSubmit={handleInputSubmit}
          className="relative flex items-center gap-0 rounded-2xl border border-void-700/50 bg-void-900/30 overflow-hidden transition-all duration-300 focus-within:border-bodhi-500/30 focus-within:bg-void-900/50"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={
              isZh ? "向解脱分析师提问……" : "Ask the Liberation Analyst…"
            }
            className={`flex-1 bg-transparent px-5 py-3.5 text-sm text-bone-200 placeholder:text-bone-500/50 outline-none font-serif ${isZh ? "zh" : ""}`}
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="px-5 py-3.5 text-xs label-mono text-bone-500 hover:text-bodhi-300 disabled:opacity-30 transition-colors duration-200"
          >
            <T v={{ en: "ASK", zh: "提问" }} />
          </button>
        </form>

        {/* input feedback */}
        {inputFeedback && (
          <p className="text-center mt-3 text-xs label-mono text-bodhi-400/80 animate-pulse">
            <T
              v={{
                en: "Interpreting through the six lenses…",
                zh: "正通过六个镜头诠释……",
              }}
            />
          </p>
        )}
      </div>

      {/* ── active question banner ── */}
      <div className="max-w-4xl mx-auto mb-10">
        <div className="flex items-start gap-4 px-5 py-5 rounded-2xl bg-void-900/60 border border-bodhi-500/15">
          <span className="mt-0.5 shrink-0 w-6 h-6 rounded-full border border-bodhi-500/40 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-bodhi-400 breathe" />
          </span>
          <p
            className={`display text-xl md:text-2xl font-light text-bone-50 leading-snug flex-1 ${isZh ? "zh" : ""} lang-fade`}
            key={lang + "-activeq"}
          >
            {selectedQ.q[lang]}
          </p>
        </div>
      </div>

      {/* ── analyzing shimmer ── */}
      {analyzing && (
        <div className="max-w-4xl mx-auto mb-6 flex items-center justify-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-bodhi-400 animate-pulse" />
          <span className="label-mono text-xs text-bodhi-400/70 tracking-widest animate-pulse">
            <T v={{ en: "Analyzing through six lenses…", zh: "正从六个视角分析中…" }} />
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-bodhi-400 animate-pulse" />
        </div>
      )}

      {/* ── lens grid ── */}
      <div
        className={`max-w-4xl mx-auto grid gap-4 ${
          focusedLens
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {LENSES.map((lens, i) => {
          const acc = LENS_ACCENTS[i];
          const answer = selectedQ.answers[lens.id];
          const isVisible = cardStates[i] === "visible";
          const isFocused = focusedLens === lens.id;
          const isDimmed = focusedLens !== null && !isFocused;

          return (
            <div
              key={lens.id}
              className={`
                group relative flex flex-col rounded-2xl border p-6 cursor-pointer
                transition-all duration-500 ease-out
                ${acc.border}
                ${
                  isFocused
                    ? `bg-void-800/80 shadow-2xl ${acc.glow} shadow-[0_0_40px_0px]`
                    : "bg-void-900/50 hover:bg-void-800/60"
                }
                ${isDimmed ? "opacity-25 scale-[0.97]" : "opacity-100 scale-100"}
                ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-6 opacity-0"
                }
                ${isFocused ? "lg:col-span-3 md:col-span-2 col-span-1" : ""}
              `}
              style={{
                transitionDelay: isVisible ? "0ms" : `${i * 60}ms`,
              }}
              onClick={() => setFocusedLens(isFocused ? null : lens.id)}
              role="button"
              tabIndex={0}
              aria-expanded={isFocused}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setFocusedLens(isFocused ? null : lens.id);
                }
              }}
            >
              {/* top accent rule */}
              <LensRule accent={acc} />

              {/* lens identity header */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`label-mono text-xs tracking-wider font-medium ${acc.label}`}>
                    <T v={lens.label} />
                  </span>
                  <span className={`w-1 h-1 rounded-full opacity-50 ${acc.dot}`} />
                  <span className="label-mono text-xs text-bone-500/50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <p
                  className={`text-xs text-bone-500 leading-relaxed ${isZh ? "zh" : ""} lang-fade`}
                  key={lang + "-role-" + lens.id}
                >
                  {lens.role[lang]}
                </p>
              </div>

              {/* divider */}
              <div className="h-px bg-void-700/50 w-full mb-4" />

              {/* answer prose */}
              {answer && (
                <p
                  className={`font-serif text-bone-200 text-sm leading-relaxed flex-1 ${
                    isFocused ? "text-base md:text-[1.05rem] leading-loose" : ""
                  } ${isZh ? "zh" : ""} lang-fade`}
                  key={lang + "-ans-" + lens.id}
                >
                  {answer[lang]}
                </p>
              )}

              {/* expand / collapse hint */}
              <div
                className={`mt-5 flex items-center gap-1.5 transition-opacity duration-300 ${
                  isFocused ? "opacity-70" : "opacity-0 group-hover:opacity-40"
                }`}
              >
                <span className={`label-mono text-[0.6rem] tracking-widest ${acc.label} opacity-60`}>
                  {isFocused ? (
                    <T v={{ en: "↑ COLLAPSE", zh: "↑ 收起" }} />
                  ) : (
                    <T v={{ en: "↓ EXPAND", zh: "↓ 展开" }} />
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── return-to-grid button ── */}
      {focusedLens && (
        <div className="max-w-4xl mx-auto mt-6 flex justify-center">
          <button
            onClick={() => setFocusedLens(null)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-void-700/50 bg-void-900/40 hover:border-bodhi-500/30 hover:bg-void-800/60 transition-all duration-300 group"
          >
            {/* mini grid icon */}
            <span className="w-3 h-3 grid grid-cols-2 gap-0.5 opacity-60 group-hover:opacity-90 transition-opacity">
              {[0, 1, 2, 3].map((n) => (
                <span key={n} className="rounded-[1px] bg-bone-300" />
              ))}
            </span>
            <span className="label-mono text-xs text-bone-400 group-hover:text-bone-200 transition-colors">
              <T v={{ en: "All six lenses", zh: "六个视角" }} />
            </span>
          </button>
        </div>
      )}

      {/* ── closing note ── */}
      <div className="max-w-2xl mx-auto mt-16 text-center">
        <div className="h-px bg-gradient-to-r from-transparent via-bodhi-500/20 to-transparent mb-8" />
        <p
          className={`font-serif text-bone-500 text-sm leading-relaxed italic ${isZh ? "zh" : ""} lang-fade`}
          key={lang + "-footer"}
        >
          <T
            v={{
              en: "These analyses are curated thought experiments, not pronouncements. Each lens is a partial truth; real understanding lives in the tension between them. No tradition is endorsed; all six heights are required.",
              zh: "这些分析是精心策划的思想实验，而非权威裁断。每一个镜头都是一份局部的真相；真正的理解，栖居于它们之间的张力之中。没有传统被背书；六种高度，缺一不可。",
            }}
          />
        </p>
      </div>
    </section>
  );
}
