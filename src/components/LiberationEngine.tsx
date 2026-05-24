"use client";

import { ReactNode } from "react";
import { LangProvider, LangToggle, T, useLang } from "./lang";
import { SECTIONS, CONCEPTS } from "./content";

import LiberationField from "./LiberationField";
import SufferingAnatomy from "./SufferingAnatomy";
import LiberationWheel from "./LiberationWheel";
import SalvationSystems from "./SalvationSystems";
import HealingPathways from "./HealingPathways";
import ExpandingCircle from "./ExpandingCircle";
import DigitalSufferingLab from "./DigitalSufferingLab";
import SyntheticCompassion from "./SyntheticCompassion";
import CompassionStabilitySim from "./CompassionStabilitySim";
import PlanetaryCompassion from "./PlanetaryCompassion";
import LiberationModel from "./LiberationModel";
import RecursiveLiberationEngine from "./RecursiveLiberationEngine";
import LiberationAnalyst from "./LiberationAnalyst";
import MeditationChamber from "./MeditationChamber";

const VIS: Record<string, ReactNode> = {
  origin: <SufferingAnatomy />,
  buddhism: <LiberationWheel />,
  religions: <SalvationSystems />,
  psychology: <HealingPathways />,
  empathy: <ExpandingCircle />,
  digital: <DigitalSufferingLab />,
  ai: <SyntheticCompassion />,
  violence: <CompassionStabilitySim />,
  future: <PlanetaryCompassion />,
};

const NAV: { id: string; en: string; zh: string }[] = [
  { id: "origin", en: "Suffering", zh: "苦" },
  { id: "buddhism", en: "Awakening", zh: "觉" },
  { id: "religions", en: "Salvation", zh: "救赎" },
  { id: "psychology", en: "Healing", zh: "疗愈" },
  { id: "empathy", en: "Circle", zh: "道德圈" },
  { id: "violence", en: "Repair", zh: "修复" },
  { id: "future", en: "Planetary", zh: "行星" },
  { id: "model", en: "Model", zh: "模型" },
  { id: "engine", en: "Engine", zh: "引擎" },
  { id: "analyst", en: "Analyst", zh: "分析" },
];

/* Bodhi-leaf mark — the tree of awakening, a seed of awareness at its heart. */
function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <defs>
        <radialGradient id="logo-g" cx="50%" cy="34%" r="70%">
          <stop offset="0%" stopColor="#ffe7b0" />
          <stop offset="46%" stopColor="#f4c25a" />
          <stop offset="100%" stopColor="#9d8bf0" />
        </radialGradient>
      </defs>
      <path
        d="M16 5 C 10.5 8.4 6.6 12.8 6.6 17.4 C 6.6 21.8 10.5 24.4 14.4 24.7 L 16 28 L 17.6 24.7 C 21.5 24.4 25.4 21.8 25.4 17.4 C 25.4 12.8 21.5 8.4 16 5 Z"
        fill="none"
        stroke="url(#logo-g)"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <line x1="16" y1="8.5" x2="16" y2="24" stroke="#ffd584" strokeWidth="1.1" strokeLinecap="round" />
      <circle cx="16" cy="16.4" r="1.9" fill="#ffe7b0" className="node-pulse" />
    </svg>
  );
}

function Header() {
  const { lang } = useLang();
  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b border-bodhi-500/12 bg-void-950/80 px-5 py-3 backdrop-blur md:px-9">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-md border border-bodhi-500/25 bg-void-800">
          <Logo />
        </div>
        <div className="leading-tight">
          <div className="display text-base text-bone-50">Liberation Engine</div>
          <div className="zh text-[0.6rem] text-bone-500">解脱引擎</div>
        </div>
      </div>
      <nav className="hidden gap-5 font-mono text-[0.58rem] uppercase tracking-[0.18em] text-bone-500 lg:flex">
        {NAV.map((n) => (
          <a key={n.id} href={`#${n.id}`} className="hover:text-bodhi-300">
            {lang === "zh" ? n.zh : n.en}
          </a>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        <LangToggle />
        <a
          href="https://psyverse.fun"
          className="hidden font-mono text-[0.58rem] uppercase tracking-[0.18em] text-bodhi-400 hover:text-bodhi-300 sm:block"
        >
          ← Psyverse
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-24">
      <div className="absolute inset-0 z-0">
        <LiberationField />
      </div>
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-void-950/30 via-transparent to-void-950" />
      <div className="relative z-20 mx-auto w-full max-w-6xl px-6 md:px-12">
        <div className="label-mono">Psyverse · liberation as intelligence learning to reduce suffering</div>
        <div className="mt-2 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-bone-500">
          EN · 中文 · suffering × compassion × consciousness × healing × moral expansion × ai empathy × planetary ethics
        </div>
        <h1 className="display mt-6 text-6xl leading-[0.92] text-bone-50 md:text-8xl">
          Liberation <span className="glow-text">Engine</span>
        </h1>
        <h2 className="zh mt-3 text-3xl text-bone-200 md:text-5xl">解脱引擎</h2>

        <p className="mt-9 max-w-2xl font-serif text-lg leading-relaxed text-bone-100 md:text-xl">
          <T
            v={{
              en: "Suffering did not begin as philosophy. It began as information — pain, fear, craving, grief — the machinery by which living systems track danger and value. But a mind that can say 'I' can also dread, mourn and despair. This is a bilingual atlas of suffering, compassion, consciousness and liberation, read not as one religion's creed but as the deepest engineering problem a civilisation ever faces.",
              zh: "苦并非始于哲学。它始于信息——痛、惧、渴爱、悲伤——生命系统借以追踪危险与价值的机制。但一个能说「我」的心智，也能畏惧、哀悼与绝望。这是一部关于苦、慈悲、意识与解脱的双语图志，读它的，不是某一宗教的教义，而是一个文明所曾面对的、最深的工程问题。",
            }}
          />
        </p>

        <div className="mt-10 max-w-2xl rounded-lg border border-bodhi-500/15 bg-void-900/70 p-6 backdrop-blur">
          <div className="label-mono">Central thesis · 核心论点</div>
          <p className="mt-3 font-serif text-xl leading-relaxed text-bone-50 md:text-2xl">
            <T
              v={{
                en: "“Liberating all beings” may not be merely religion. It may be consciousness recognising suffering within itself, then learning to reduce that suffering across ever-larger networks of intelligent life. As intelligence and power keep growing, the future may hinge on whether compassion grows with them.",
                zh: "「普度众生」或许不只是宗教。它或许是意识在自身之中认出苦，进而学会在越来越大的智能生命网络中减少那苦。当智能与权力持续增长，未来或许系于：慈悲，是否随之一同增长。",
              }}
            />
          </p>
        </div>

        <div className="mt-12 flex flex-wrap gap-x-8 gap-y-2 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-bone-500">
          <span>10 systems · 十大系统</span>
          <span>1 unified model · 一个统一模型</span>
          <span>the circle of who counts keeps widening</span>
        </div>
      </div>
    </section>
  );
}

function SectionBlock({
  num,
  id,
  title,
  sub,
  body,
  vis,
  concepts,
}: {
  num: string;
  id: string;
  title: any;
  sub: any;
  body: any;
  vis?: ReactNode;
  concepts?: { t: any; d: any }[];
}) {
  const { lang } = useLang();
  return (
    <section id={id} className="relative border-t border-bodhi-500/10 px-6 py-24 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-baseline gap-4">
          <span className="display text-5xl text-bodhi-500/30">{num}</span>
          <div>
            <h2 className="display text-4xl text-bone-50 md:text-5xl">
              <T v={title} />
            </h2>
            <h3 className="mt-1 text-lg text-bodhi-400">
              <T v={sub} />
            </h3>
          </div>
        </div>
        <div className="mt-5 rule-gold opacity-60" />
        <p className="mt-8 max-w-3xl font-serif text-lg leading-relaxed text-bone-200">
          <T v={body} />
        </p>
        {vis && <div className="mt-12">{vis}</div>}
        {concepts && (
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {concepts.map((c, i) => (
              <div key={i} className="card rounded-xl p-5">
                <div key={`t-${lang}`} className={`display text-lg text-bodhi-300 lang-fade ${lang === "zh" ? "zh" : ""}`}>
                  {c.t[lang]}
                </div>
                <p key={`d-${lang}`} className={`mt-2 text-sm leading-relaxed text-bone-300 lang-fade ${lang === "zh" ? "zh" : ""}`}>
                  {c.d[lang]}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Body() {
  const { lang } = useLang();
  const unified = SECTIONS.find((s) => s.id === "unified")!;
  return (
    <main className="relative bg-void-950 text-bone-100">
      <Header />
      <Hero />

      {/* marquee */}
      <div className="overflow-hidden border-y border-bodhi-500/12 bg-void-900/60 py-2.5">
        <div className="whitespace-nowrap font-mono text-[0.64rem] uppercase tracking-[0.3em] text-bodhi-400/80">
          {(lang === "zh"
            ? "苦 · 慈悲 · 意识 · 解脱 · 共情 · 创伤 · 疗愈 · 涅槃 · 救恩 · 仁 · 道德之圆不断扩大 · 解脱是智能学会减少不必要的苦 · 当权力增长，慈悲能否随之一同增长 · "
            : "DUKKHA · COMPASSION · CONSCIOUSNESS · LIBERATION · EMPATHY · TRAUMA · HEALING · NIRVANA · GRACE · 仁 · THE CIRCLE OF WHO COUNTS KEEPS WIDENING · LIBERATION IS INTELLIGENCE LEARNING TO REDUCE SUFFERING · WILL COMPASSION GROW AS FAST AS POWER · ").repeat(2)}
        </div>
      </div>

      {/* sections 01–09 */}
      {SECTIONS.filter((s) => s.id !== "unified").map((s) => (
        <SectionBlock
          key={s.id}
          num={s.num}
          id={s.id}
          title={s.title}
          sub={s.sub}
          body={s.body}
          vis={VIS[s.id]}
          concepts={CONCEPTS[s.id]}
        />
      ))}

      {/* The Golden Rule — the shared root across traditions */}
      <section id="golden-rule" className="relative border-t border-bodhi-500/10 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <div className="label-mono">The shared root · 共同的根 · the ethic of reciprocity</div>
          <p className="mx-auto mt-7 max-w-3xl font-serif text-2xl leading-relaxed text-bone-50 md:text-3xl">
            <T
              v={{
                en: "“What you do not wish for yourself, do not do to others.” The same rule surfaces independently in Confucius, the Buddha, Hillel, Jesus and a dozen traditions that never met — the closest thing our species has to a universal discovery about how to spare one another's suffering.",
                zh: "「己所不欲，勿施于人。」同一条法则，在孔子、佛陀、希勒尔、耶稣，以及十多个素未谋面的传统中，各自独立地浮现——这是我们这个物种最接近「一项关于如何彼此免除苦难的普世发现」之物。",
              }}
            />
          </p>
          <p className="mt-7 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-bone-500">
            confucius · 论语 · the buddha · hillel · jesus · kant · the ethic of reciprocity
          </p>
        </div>
      </section>

      {/* Meditation interlude — the practice itself */}
      <section id="practice" className="relative border-t border-bodhi-500/10 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="label-mono">A pause · 一次停歇 · the practice itself</div>
          <h2 className="display mt-3 text-4xl text-bone-50 md:text-5xl">
            <T v={{ en: "Before the synthesis, a breath", zh: "在综合之前，一次呼吸" }} />
          </h2>
          <p className="mt-6 max-w-3xl font-serif text-lg leading-relaxed text-bone-200">
            <T
              v={{
                en: "Every tradition on this page agrees on one humble thing: the relationship between a mind and its suffering can be trained, and it begins with attention to the breath. This is not a metaphor on the page but a practice you can do right now. Follow the light as it expands and releases.",
                zh: "这一页上的每一个传统，都在一件谦卑之事上达成一致：一个心智与其苦之间的关系，是可被训练的，而它始于对呼吸的注意。这不是页面上的一个比喻，而是一项你此刻就能做的练习。跟随那光，看它扩张，又松开释出。",
              }}
            />
          </p>
          <div className="mt-12">
            <MeditationChamber />
          </div>
        </div>
      </section>

      {/* unified meta-model */}
      <section id="model" className="relative border-t border-bodhi-500/10 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-baseline gap-4">
            <span className="display text-5xl text-bodhi-500/30">{unified.num}</span>
            <div>
              <h2 className="display text-4xl text-bone-50 md:text-5xl">
                <T v={unified.title} />
              </h2>
              <h3 className="mt-1 text-lg text-bodhi-400">
                <T v={unified.sub} />
              </h3>
            </div>
          </div>
          <div className="mt-5 rule-gold opacity-60" />
          <p className="mt-8 max-w-3xl font-serif text-lg leading-relaxed text-bone-200">
            <T v={unified.body} />
          </p>
          <div className="mt-8 max-w-3xl rounded-lg border border-bodhi-500/20 bg-void-900/60 p-5">
            <div className="label-mono" style={{ color: "#ffe7b0" }}>Meta-model · 元模型</div>
            <p className="mt-2 font-mono text-sm leading-relaxed text-bone-200">
              {lang === "zh"
                ? "文明慈悲稳定度 = 情绪调节 + 共情扩展 + 苦难削减 + 心理韧性 + 伦理协调 + 集体疗愈 + 意识觉知 + 社会信任"
                : "Civilizational Compassion Stability = Emotional Regulation + Empathy Expansion + Reduction of Suffering + Psychological Resilience + Ethical Coordination + Collective Healing + Consciousness Awareness + Social Trust"}
            </p>
          </div>
          <div className="mt-12">
            <LiberationModel />
          </div>
        </div>
      </section>

      {/* recursive engine */}
      <section id="engine" className="relative border-t border-bodhi-500/10 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="label-mono">The recursive engine · 递归引擎</div>
          <h2 className="display mt-3 text-4xl text-bone-50 md:text-5xl">
            <T v={{ en: "How Liberation Evolves Across Eight Scales", zh: "解脱如何跨越八个尺度演化" }} />
          </h2>
          <p className="mt-6 max-w-3xl font-serif text-lg leading-relaxed text-bone-200">
            <T
              v={{
                en: "Run the same eight forces forward through every scale — from a nervous system flinching from harm, through family, religion, psychology, civilisation, digital networks and synthetic minds, to a possible planetary consciousness. Watch which dimensions of compassion rise, which collapse, and how the relationship between mind and suffering re-opens at each new size.",
                zh: "让同样的八种力量在每一个尺度上向前运行——从一个从伤害中退缩的神经系统，经家庭、宗教、心理学、文明、数字网络与合成心智，直到一种可能的行星意识。看慈悲的哪些维度上升，哪些崩塌，以及「心智与苦」之间的关系，如何在每一个新的尺度上重新打开。",
              }}
            />
          </p>
          <div className="mt-12">
            <RecursiveLiberationEngine />
          </div>
        </div>
      </section>

      {/* AI layer */}
      <section id="analyst" className="relative border-t border-bodhi-500/10 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="label-mono">AI layer · 人工智能层</div>
          <h2 className="display mt-3 text-4xl text-bone-50 md:text-5xl">
            <T v={{ en: "The Liberation Analyst", zh: "解脱分析师" }} />
          </h2>
          <p className="mt-6 max-w-3xl font-serif text-lg leading-relaxed text-bone-200">
            <T
              v={{
                en: "Ask a real question about suffering, compassion or liberation, and hear it answered through six lenses at once — philosopher, psychologist, contemplative, ethicist, consciousness theorist and civilisation systems analyst. Not spiritual clichés, but the structure of the question, seen from six heights.",
                zh: "提出一个关于苦、慈悲或解脱的真实问题，听它同时从六重视角被回答——哲学家、心理学家、默观者、伦理研究者、意识理论家，与文明系统分析者。不是灵性的套话，而是这个问题的结构，从六种高度被看见。",
              }}
            />
          </p>
          <div className="mt-12">
            <LiberationAnalyst />
          </div>
        </div>
      </section>

      {/* closing */}
      <section className="relative border-t border-bodhi-500/10 px-6 py-32 md:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-8 h-px w-40 rule-gold" />
          <h2 className="display text-4xl leading-snug text-bone-50 md:text-6xl">
            <T
              v={{
                en: "Liberating all beings is not merely religion. It may be civilisation's deepest engineering problem.",
                zh: "普度众生不只是宗教。它或许是文明最深的工程问题。",
              }}
            />
          </h2>
          <p className="mx-auto mt-8 max-w-2xl font-serif text-lg leading-relaxed text-bone-300">
            <T
              v={{
                en: "Across neuroscience, the contemplative traditions, psychology, ethics and the new question of synthetic minds, the same pattern returns. Liberation is a changed relationship between consciousness and the suffering it carries — and the arc of civilisation is the slow widening of the circle of beings whose suffering is allowed to count. As our intelligence and power keep growing, the future may depend on a single question: whether our capacity to recognise each other, reduce unnecessary suffering and heal across difference can grow just as fast.",
                zh: "穿越神经科学、默观传统、心理学、伦理，与关于合成心智的新问题，同一个模式一再回返。解脱是意识与它所承载之苦之间的、一个被改变了的关系——而文明的弧线，是「其苦难被允许算数」的存在之圆的缓慢扩大。当我们的智能与权力持续增长，未来或许取决于一个问题：我们彼此承认、减少不必要之苦、跨越差异而疗愈的能力，能否同样快地增长。",
              }}
            />
          </p>
          <p className="mt-10 font-mono text-[0.6rem] uppercase tracking-[0.4em] text-bodhi-400/70">
            Liberation Engine · 解脱引擎 · Psyverse · 2026
          </p>
        </div>
      </section>

      {/* footer */}
      <footer className="border-t border-bodhi-500/12 bg-void-950 px-6 py-16 md:px-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-3">
          <div>
            <div className="display text-xl text-bone-50">Liberation Engine</div>
            <div className="zh mt-1 text-sm text-bone-300">解脱引擎</div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-bone-500">
              <T
                v={{
                  en: "How suffering, compassion, consciousness, healing and AI empathy converge into one model of liberation as intelligence learning to reduce unnecessary suffering while widening the circle of who counts.",
                  zh: "苦、慈悲、意识、疗愈与 AI 共情，如何汇聚成一个模型——关于解脱作为智能学会减少不必要的苦，同时拓宽「谁算数」之圆。",
                }}
              />
            </p>
          </div>
          <div>
            <div className="label-mono">Systems · 系统</div>
            <ul className="mt-4 space-y-1.5 font-mono text-[0.62rem] uppercase tracking-[0.15em] text-bone-500">
              {SECTIONS.slice(0, 6).map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="hover:text-bodhi-300">
                    {s.num} · <T v={s.title} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="label-mono">Companion archives</div>
            <ul className="mt-4 space-y-1.5 text-sm text-bone-300">
              <li><a href="https://universal-love-engine.psyverse.fun" className="hover:text-bodhi-300">Universal Love Engine · 普世之爱引擎</a></li>
              <li><a href="https://happiness-engine.psyverse.fun" className="hover:text-bodhi-300">Happiness Engine · 幸福引擎</a></li>
              <li><a href="https://human-rights-engine.psyverse.fun" className="hover:text-bodhi-300">Human Rights Engine · 人权引擎</a></li>
              <li className="pt-3"><a href="https://psyverse.fun" className="text-bodhi-400 hover:text-bodhi-300">↩ All Psyverse archives</a></li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-12 h-px max-w-7xl rule-gold" />
        <div className="mx-auto mt-6 flex max-w-7xl items-center justify-between text-[0.58rem] uppercase tracking-[0.3em] text-bone-500">
          <div>© 2026 Gewenbo · Psyverse</div>
          <div>EN · 中文 · an atlas of suffering & liberation</div>
        </div>
      </footer>
    </main>
  );
}

export default function LiberationEngine() {
  return (
    <LangProvider>
      <Body />
    </LangProvider>
  );
}
