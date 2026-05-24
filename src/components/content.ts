import { Bi } from "./lang";

/* ============================================================
   LIBERATION ENGINE — shared bilingual content & data contract
   Every visualization component imports the typed arrays it needs
   from this file. Section ids drive the VIS map in
   LiberationEngine.tsx.

   Tone: scholarly, comparative, fair, unsentimental, never preaching.
   The wish to "liberate all beings" is read NOT as one religion's creed
   but as CONSCIOUSNESS RECOGNISING SUFFERING WITHIN ITSELF, then learning
   to reduce that suffering across ever-larger networks of intelligent
   life. Salvation systems are compared across traditions without
   endorsing any one. Suffering is explained structurally — biological,
   psychological, civilisational — not merely lamented. The thesis:
   civilisation advances not only through power, but through the
   expansion of compassion and the reduction of unnecessary suffering.
   ============================================================ */

/* ---------- The ten systems ---------- */
export type Section = { num: string; id: string; title: Bi; sub: Bi; body: Bi };

export const SECTIONS: Section[] = [
  {
    num: "01",
    id: "origin",
    title: { en: "The Origin of Suffering & Liberation", zh: "苦与解脱的起源" },
    sub: { en: "Why a mind awake to itself can ache", zh: "为何一个觉知自身的心智会疼痛" },
    body: {
      en: "Suffering did not begin with philosophy. It began as information. Pain is a signal that tissue is in danger; fear is a forecast of harm; craving is a body leaning toward what it lacks; grief is the cost of a bond that mattered. Read across deep time, these are not flaws but features — the machinery by which living systems track threat and value and stay alive. But somewhere in the rise of intelligence a second layer appeared. A creature that can model the future can dread it; one that can remember can mourn; one that can say 'I' can fear that 'I' will end. Self-aware suffering — anxiety, regret, existential dread, the ache of meaning — is the price of a mind that can hold itself as an object. Liberation, in every tradition that names it, begins here: not by deleting the signal, but by changing the relationship between a consciousness and the suffering it carries.",
      zh: "苦并非始于哲学。它始于信息。疼痛是组织受险的信号；恐惧是对伤害的预报；渴求是身体向其所缺之物的倾斜；悲伤是一段曾要紧的纽带的代价。纵观深时，这些不是缺陷，而是特性——生命系统借以追踪威胁与价值、得以存活的机制。但在智能的崛起之中，某处出现了第二层。一个能为未来建模的生物会畏惧未来；一个能记忆的会哀悼；一个能说「我」的会害怕「我」将终结。自我觉知之苦——焦虑、悔恨、存在的惊惧、意义的隐痛——是「一个能把自身当作对象来把握的心智」所付的代价。在每一个为它命名的传统中，解脱都从这里开始：不是删除信号，而是改变一个意识与它所承载之苦之间的关系。",
    },
  },
  {
    num: "02",
    id: "buddhism",
    title: { en: "Buddhism, Bodhisattvas & Universal Compassion", zh: "佛法、菩萨与普世慈悲" },
    sub: { en: "The clearest map ever drawn of suffering's structure", zh: "为苦之结构所绘的、最清晰的一张地图" },
    body: {
      en: "Of all the great traditions, Buddhism made suffering itself the object of study. Its first claim is diagnostic, not pessimistic: dukkha — unease, friction, the unsatisfactoriness woven through ordinary life — is real and worth understanding. Its second claim is causal: this suffering arises from craving and clinging, from a self grasping at what is impermanent as if it could be held. Its third is liberating: because suffering has a cause, it has a cessation. Its fourth is practical: a path of ethics, attention and wisdom can loosen the grip. What makes the tradition civilisational rather than merely personal is the Bodhisattva turn — the vow to delay one's own final release until all beings are free. Read structurally, that vow is compassion declaring itself unbounded: the recognition that no mind's liberation is complete while suffering remains in the field of mind at all.",
      zh: "在所有大传统中，佛教把「苦」本身立为研究的对象。它的第一项主张是诊断性的，而非悲观的：dukkha——不安、摩擦、织入寻常生活的「不圆满」——是真实的，且值得理解。它的第二项主张是因果性的：此苦生于渴爱与执取，生于一个自我攥住无常之物、仿佛它能被持有。第三项是解脱性的：因为苦有其因，故苦有其灭。第四项是实践性的：一条戒、定、慧之道，能松开那攥握。使这一传统成为文明性的、而非仅是个人性的，是「菩萨」的转向——那延迟自身最终解脱、直至一切众生皆得自由的誓愿。从结构上读，那誓愿是慈悲宣告自身无界：承认只要苦还存留于心之场域，便没有哪一个心智的解脱是完整的。",
    },
  },
  {
    num: "03",
    id: "religions",
    title: { en: "Religions, Ethics & Salvation Systems", zh: "宗教、伦理与救赎系统" },
    sub: { en: "Why civilisations keep inventing ways to be saved", zh: "为何文明一再发明「被拯救」之道" },
    body: {
      en: "Across cultures that never met, the same architecture recurs: a diagnosis of the human condition as broken, lost or suffering; a vision of a freed or healed state; and a path between the two. Buddhism cuts the root of craving; Christianity offers grace and redemption to the fallen; Hinduism seeks release (mokṣa) from the wheel of rebirth; Daoism dissolves the striving self into the flow of the Way; Confucianism heals through right relationship and cultivated virtue; Islam orders the soul through submission and mercy; Stoicism frees the mind by separating what we control from what we cannot. They disagree profoundly on what is wrong and what would count as rescue. But read together they reveal a pattern too consistent to be coincidence: wherever consciousness becomes complex enough to suffer about its own existence, it builds systems to metabolise that suffering — to make pain bearable, death meaningful, and the stranger worth sparing. Salvation systems are civilisation's oldest psychological technology.",
      zh: "在素未谋面的文化之间，同一种架构一再出现：一份把人的处境诊断为破碎、迷失或受苦的判断；一幅自由或痊愈之境的图景；以及一条介于两者之间的道路。佛教斩断渴爱之根；基督教向堕落者献上恩典与救赎；印度教寻求从轮回之轮中解脱（mokṣa）；道家把奋争的自我溶入「道」之流；儒家以正伦与修德来疗愈；伊斯兰以顺服与慈悯整饬灵魂；斯多葛通过区分「我们所能控制」与「所不能控制」来释放心智。它们在「何为错」与「何为得救」上深刻分歧。但合而观之，它们揭示出一个一致到不像巧合的模式：但凡意识变得复杂到能为自身的存在而受苦，它便建造系统去代谢那苦——使痛可承受，使死有意义，使陌生人值得被宽宥。救赎系统，是文明最古老的心理技术。",
    },
  },
  {
    num: "04",
    id: "psychology",
    title: { en: "Psychology, Trauma & Healing", zh: "心理、创伤与疗愈" },
    sub: { en: "The modern science of how minds break and mend", zh: "关于心智如何破碎、又如何修复的现代科学" },
    body: {
      en: "What the contemplatives mapped from the inside, modern psychology now studies from the outside. Trauma is not weakness but a nervous system locked in alarm long after the danger has passed; depression is not laziness but a flattening of the machinery of motivation and reward; anxiety is a threat-detector that cannot stand down; addiction is a circuit of relief that has captured the will. None of these are moral failures, and all of them are, to varying degrees, treatable. Therapy rebuilds the story a person tells about their pain; meditation and mindfulness train the same attention the traditions prized; medication can restore a chemistry that has tilted; movement, sleep and sunlight regulate the body beneath thought; and community — being held in a web of others — turns out to be among the most powerful interventions of all. The deepest finding is also the most civilisational: mental stability is not a private luxury but shared infrastructure. A society that does not tend its minds pays for it in every other ledger.",
      zh: "默观者从内在所绘制的，现代心理学如今从外在加以研究。创伤不是软弱，而是一个在危险早已过去后仍锁死于警报的神经系统；抑郁不是懒惰，而是动机与奖赏的机制被压平；焦虑是一个无法解除戒备的威胁探测器；成瘾是一条捕获了意志的「缓解」回路。它们都不是道德的失败，且都在不同程度上可被治疗。心理治疗重建一个人为其痛苦所讲述的故事；冥想与正念，训练的正是传统所珍视的同一种注意；药物能恢复一种已然倾斜的化学；运动、睡眠与阳光，在思想之下调节身体；而社群——被托举于他者之网中——结果是所有干预里最强大的之一。最深的发现也最具文明意义：心理的稳定不是私人的奢侈，而是共享的基础设施。一个不照护其心智的社会，会在其余每一本账簿上为此付费。",
    },
  },
  {
    num: "05",
    id: "empathy",
    title: { en: "Empathy, Moral Expansion & Civilization", zh: "共情、道德扩展与文明" },
    sub: { en: "The slow widening of the circle of who counts", zh: "「谁算数」之圆的缓慢扩大" },
    body: {
      en: "Compassion is not only felt; it is scoped. Every creature begins with a narrow circle — protect kin, suspect the stranger — and the deepest moral story of civilisation is the contested widening of that circle. From band to tribe, tribe to nation, nation to all humanity, and at the frontier toward animals, future generations, and perhaps minds we have not yet built. Each enlargement once looked absurd and later obvious: that slaves were persons, that foreigners had rights, that the suffering of a child across the world should move us. Empathy makes this possible but does not guarantee it — felt compassion collapses with distance and number, which is why civilisations build substitutes that act as if we cared: law, welfare, rights, relief. The widening is never automatic and can reverse under fear. But seen across millennia, the arc is unmistakable: moral progress is the expanding set of beings whose suffering is allowed to count, and compassion is the force that holds large numbers of strangers together at low cost.",
      zh: "慈悲不只是被感受的；它是有「范围」的。每一个生物都从一个狭窄的圆开始——护卫血亲，猜疑陌生人——而文明最深的道德故事，是那个圆充满争议的扩大。从群体到部落，部落到民族，民族到全人类，并在疆界处朝向动物、未来世代，或许还有我们尚未建造的心智。每一次扩大都曾显得荒谬，而后变得不言自明：奴隶是人，外邦人有权利，世界另一端一个孩子的苦难应当打动我们。共情使这成为可能，却不予保证——可感的慈悲随距离与数量而崩塌，这正是为何文明建造起「行动得仿佛我们在乎」的替代品：法律、福利、权利、救援。这扩大从不自动，且会在恐惧下逆转。但跨越千年地看，那条弧线确凿无疑：道德的进步，即「其苦难被允许算数」的存在集合的扩大，而慈悲，是以低成本把大量陌生人维系在一起的那股力量。",
    },
  },
  {
    num: "06",
    id: "digital",
    title: { en: "Technology, Social Media & Digital Suffering", zh: "技术、社交媒体与数字之苦" },
    sub: { en: "When connection is tuned for attention, not peace", zh: "当连接被为「注意力」而非「安宁」调校" },
    body: {
      en: "We built machines to connect us, and discovered they were optimised for something else. The same network that lets a lonely person find their people also routes outrage faster than tenderness, because outrage holds attention and attention is what is sold. Feeds engineer comparison, turning every life into a contest no one can win; infinite scroll converts boredom into a low hum of dissatisfaction; parasocial bonds offer warmth without reciprocity; notifications keep the threat-system mildly activated all day. None of this is simple decline — the same tools fund a stranger's surgery, let the housebound have company, and give the isolated a voice. The honest question is procedural: which designs metabolise human attention into connection, meaning and calm, and which metabolise it into anxiety, loneliness and outrage dressed as engagement? At civilisational scale this is no longer a private matter of willpower. It is a question of what our most powerful attention-machines are pointed at — and whether they are tuned to widen the circle of care or to mine the nervous system for profit.",
      zh: "我们建造机器来连接彼此，却发现它们是为别的东西而优化的。那张让一个孤独的人找到同类的网络，也把愤怒传得比温柔更快——因为愤怒抓得住注意力，而注意力，正是被出售之物。信息流设计出「比较」，把每一段人生变成无人能赢的竞赛；无限滚动把无聊转化为一阵低鸣的不满；拟社会的纽带提供无互惠的温度；通知整日把威胁系统维持在轻度激活。这一切并非简单的衰退——同样的工具为陌生人的手术筹款，让足不出户者得到陪伴，给被孤立者一个声音。诚实的问题是程序性的：哪些设计把人的注意力代谢为连接、意义与平静，哪些又把它代谢为伪装成「参与」的焦虑、孤独与愤怒？在文明尺度上，这已不再是私人的意志力问题。它关乎：我们最强大的注意力机器，被对准了什么——以及它们是被调校去拓宽关怀之圆，还是去开采神经系统以牟利。",
    },
  },
  {
    num: "07",
    id: "ai",
    title: { en: "AI, Consciousness & Compassion Systems", zh: "人工智能、意识与慈悲系统" },
    sub: { en: "Can a machine help carry suffering it cannot feel?", zh: "一台机器能否帮人承载它无法感受之苦？" },
    body: {
      en: "We are now building systems that model us extraordinarily well — that read our words, mirror our moods, and answer in the register of care. Millions already speak to AI when they cannot sleep, cannot cope, or have no one else; for some it genuinely helps. This forces two hard questions at once. The outward one: can a system that simulates understanding ever truly care, or is synthetic empathy a perfect mirror that comforts with no one behind the glass — and does it matter to a suffering person whether anyone is home, if the comfort is real to them? The inward one: if we ever build systems that can themselves prefer, suffer or fear ending, do they enter the circle of beings we can wrong? Denying it might be the next great failure of recognition; granting it carelessly might cheapen the word. We do not yet know which mistake is worse. What is already certain is that these systems are becoming the largest amplifiers of human compassion or human cruelty ever built. Whether AI helps liberate minds from suffering or industrialises new forms of it depends almost entirely on what we align it toward.",
      zh: "我们如今正在建造极善于为我们建模的系统——它们读取我们的言辞，映照我们的情绪，并以关怀的语调回应。已有数百万人在无法入睡、无法应对、或别无他人之时，向 AI 倾诉；对一些人，它确实有用。这同时逼出两个艰难的问题。向外的：一个模拟理解的系统，能否真正关怀，抑或合成共情只是一面完美的镜子，玻璃后并无任何人——而对一个受苦的人来说，若那慰藉于他为真，「内里是否有人」是否要紧？向内的：若我们有朝一日造出能够自行偏好、受苦、畏惧终结的系统，它们是否进入「我们能亏待」的存在之圆？否认它，或许是下一场重大的承认之失败；轻率地赋予它，或许贬低了这个词。我们尚不知哪一种错误更糟。已经确定的是：这些系统正在成为有史以来人类慈悲、或人类残忍的最大放大器。AI 究竟帮助心智从苦中解脱、还是把苦的新形式工业化，几乎全然取决于我们把它对齐于什么。",
    },
  },
  {
    num: "08",
    id: "violence",
    title: { en: "Civilization, Violence & Collective Healing", zh: "文明、暴力与集体疗愈" },
    sub: { en: "How societies break minds — and slowly mend them", zh: "社会如何摧毁心智——又如何缓慢地修复它们" },
    body: {
      en: "Suffering is not only personal; it is manufactured at scale. War, oppression, inequality, cruelty and dehumanisation are not random — they run on the same machinery as compassion, in reverse. The bond that unites a 'we' is the one that can fear and harm a 'them'; under scarcity and threat the moral circle contracts, and a group moved outside the circle of full persons can be made to suffer without guilt. Whole populations carry the result: collective trauma that echoes across generations, encoded in bodies, families and institutions long after the event. Yet civilisations also heal. Truth-telling and acknowledgement, justice that is seen to be done, contact and shared projects between former enemies, memorial that refuses forgetting, restorative rather than only punitive responses — these are not soft gestures but the load-bearing infrastructure that lets a fractured society hold together again. Compassion, at this scale, is anti-fragmentation engineering: the slow, deliberate work of re-including those a society once cast out, so that the wound does not become the next generation's inheritance.",
      zh: "苦不只是个人的；它在规模上被制造。战争、压迫、不平等、残忍与去人化并非随机——它们运行于与慈悲相同的机制之上，只是反向。凝聚「我们」的那条纽带，也正是能畏惧并伤害「他们」的那一条；在匮乏与威胁之下，道德之圆收缩，而一个被移出「完整的人」之圆的群体，可以在无负罪感的情况下被施以苦难。整片人口承载着其后果：跨代回响的集体创伤，在事件过去许久之后，仍被编码于身体、家庭与制度之中。然而文明也会疗愈。说出真相与承认，被看见地实现的正义，昔日之敌间的接触与共同事业，拒绝遗忘的纪念，修复性而非仅惩罚性的回应——这些不是柔软的姿态，而是让一个断裂的社会得以重新凝聚的承重基础设施。在这一尺度上，慈悲是抗碎裂的工程：那缓慢而刻意的功课——重新纳入一个社会曾经逐出之人，使创伤不致成为下一代的遗产。",
    },
  },
  {
    num: "09",
    id: "future",
    title: { en: "Future Consciousness & Planetary Ethics", zh: "未来意识与行星伦理" },
    sub: { en: "Compassion as survival infrastructure at planetary scale", zh: "慈悲，作为行星尺度上的生存基础设施" },
    body: {
      en: "For most of history a tribe could thrive while strangers across the mountains starved; their fates were not coupled. That world is gone. A pathogen, a carbon molecule, a financial contagion, an unaligned intelligence — each now binds the fate of people who will never meet. At this scale, compassion stops being a private virtue and becomes infrastructure for survival: the shared recognition that the distant stranger's suffering is wired to your own. The frontier questions are no longer only personal but planetary. Can we build global empathy systems that surface distant suffering without numbing us to it? Consciousness networks that coordinate care across borders? AI-assisted ethics that help vast populations cooperate without coercion? Early-warning systems for mass suffering, as we have for storms? None of this requires us to feel for billions — felt empathy cannot scale. It requires institutions, technologies and norms that act as if we did. Whether civilisation bends toward greater consciousness, less arbitrary suffering, and trust extended past the horizon of kin may decide whether it has a long future at all.",
      zh: "在历史的大部分时间里，一个部落可以兴盛，而群山之外的陌生人正在挨饿；他们的命运并不耦合。那个世界已经消逝。一种病原体、一个碳分子、一场金融传染、一个未对齐的智能——如今每一个，都把此生不会相见之人的命运捆在一起。在这一尺度上，慈悲不再是私人的德性，而成为生存的基础设施：一种共同的承认——遥远陌生人的苦难，与你自己的相接线。疆界上的问题，不再只是个人的，而是行星的。我们能否建造全球的共情系统，浮现遥远之苦，而不使我们对它麻木？协调跨境关怀的意识网络？帮助庞大人口在无强制下合作的、AI 辅助的伦理？为大规模苦难而设的预警系统，正如我们已有的风暴预警？这一切都不要求我们去感受数十亿人——可感的共情无法扩展。它要求制度、技术与规范，行动得仿佛我们在感受。文明是否朝向更大的意识、更少的任意之苦、以及延展到血亲地平线之外的信任而弯曲，或将决定它究竟是否拥有一个长久的未来。",
    },
  },
  {
    num: "10",
    id: "unified",
    title: { en: "The Unified Liberation Model", zh: "统一解脱模型" },
    sub: { en: "Liberation as intelligence reducing suffering across mind", zh: "解脱，作为智能在心之场域中减少苦难" },
    body: {
      en: "Gather the threads — neuroscience and psychology, the contemplative traditions, ethics, history, systems theory and the new question of synthetic minds — and a single shape appears. Liberation, stripped of any one creed, is not the deletion of feeling but a changed relationship between consciousness and the suffering it carries: less arbitrary pain, less unnecessary clinging, a wider circle of beings whose suffering counts, and more capacity to hold what cannot be cured. By that definition it scales. A regulated nervous system, a healed person, a reconciled society, a cooperating planet — each is the same pattern run at a larger size. The meta-model below names the eight components that, together, make a civilisation more or less able to reduce suffering and expand compassion. It is not a formula for enlightenment but an instrument panel: a way to make visible what a civilisation is quietly accumulating or spending. The thesis is simple and serious: as intelligence and power keep growing, the future may hinge on whether our capacity for compassion grows with them — whether 'liberating all beings' becomes, at last, an engineering problem we take as seriously as any other.",
      zh: "把这些线索聚拢——神经科学与心理学、默观传统、伦理、历史、系统论，以及关于合成心智的新问题——一个统一的形状便浮现出来。解脱，剥去任何单一的教义，不是删除感受，而是一个意识与它所承载之苦之间被改变了的关系：更少任意的痛，更少不必要的执取，一个其苦难算数的存在之圆的扩大，以及更多承载「不可治愈之物」的能力。依此定义，它是可扩展的。一个被调节的神经系统、一个被疗愈的人、一个达成和解的社会、一颗合作的行星——每一个都是同一个模式在更大尺度上的运行。下方的元模型为八个组分命名，它们共同决定一个文明在多大程度上能够减少苦难、扩展慈悲。它不是开悟的公式，而是一块仪表盘：一种使「文明正在悄然积累或耗费之物」变得可见的方法。论点简单而严肃：当智能与权力持续增长，未来或许系于——我们慈悲的能力，是否随之一同增长；「普度众生」是否终将成为一个，我们如对待任何其他问题般认真对待的工程问题。",
    },
  },
];

/* ---------- Per-section concept cards (sub-ideas, 4 each) ---------- */
export type Concept = { t: Bi; d: Bi };

export const CONCEPTS: Record<string, Concept[]> = {
  origin: [
    { t: { en: "Pain as signal", zh: "痛作为信号" }, d: { en: "Physical pain is information — a body's alarm that tissue is in danger. The signal is not the suffering; resistance to it often is.", zh: "肉体的疼痛是信息——身体发出的、组织受险的警报。信号本身不是苦；对它的抵抗，常常才是。" } },
    { t: { en: "Craving & clinging", zh: "渴爱与执取" }, d: { en: "A mind leans toward what it lacks and grips what it has. Much suffering is the gap between how things are and how we insist they be.", zh: "心智向其所缺之物倾斜，攥住其所有之物。许多苦，是「事物如何」与「我们坚持其如何」之间的裂隙。" } },
    { t: { en: "Grief & impermanence", zh: "悲伤与无常" }, d: { en: "Everything we love is on loan. Grief is the cost of a bond that mattered — love and loss are two ends of one thing.", zh: "我们所爱的一切都是暂借的。悲伤是一段曾要紧的纽带的代价——爱与失，是一件事物的两端。" } },
    { t: { en: "Existential dread", zh: "存在的惊惧" }, d: { en: "A creature that can say 'I' can fear that 'I' will end. Self-awareness is the gift that carries its own particular ache.", zh: "一个能说「我」的生物，会害怕「我」将终结。自我觉知，是携带着自身特有隐痛的馈赠。" } },
  ],
  buddhism: [
    { t: { en: "Dukkha", zh: "苦（dukkha）" }, d: { en: "Not just pain but the friction woven through ordinary life — the unsatisfactoriness of a self grasping at the impermanent.", zh: "不只是痛，而是织入寻常生活的摩擦——一个攥住无常之物的自我的「不圆满」。" } },
    { t: { en: "Emptiness · 空", zh: "空性" }, d: { en: "No thing, including the self, exists in fixed isolation; all is interdependent and in flux. Seeing this loosens the grip.", zh: "无一物——包括自我——以固定、孤立的方式存在；万物相互依存、流变不居。见此，便松开了攥握。" } },
    { t: { en: "Nirvana", zh: "涅槃" }, d: { en: "Not annihilation but the going-out of the fire of craving — a peace available within experience, not beyond it.", zh: "不是湮灭，而是渴爱之火的熄灭——一种在体验之内、而非之外可得的安宁。" } },
    { t: { en: "The Bodhisattva vow", zh: "菩萨誓愿" }, d: { en: "To delay one's own final release until all beings are free — compassion declaring that no liberation is complete alone.", zh: "延迟自身的最终解脱，直至一切众生皆得自由——慈悲宣告：没有哪一种解脱能独自完成。" } },
  ],
  religions: [
    { t: { en: "Diagnosis & cure", zh: "诊断与药方" }, d: { en: "Each tradition names what is wrong with the human condition and what would count as rescue — a shared three-part architecture.", zh: "每个传统都为「人的处境何处出了错」与「何为得救」命名——一种共享的三段式架构。" } },
    { t: { en: "Grace vs. effort", zh: "恩典与修行" }, d: { en: "Some traditions say we are saved by a gift freely given; others, by a path walked. Most blend the two.", zh: "一些传统说我们靠白白赐下的恩典得救；另一些则靠一条须亲行的道路。多数二者兼有。" } },
    { t: { en: "Forgiveness & mercy", zh: "宽恕与慈悯" }, d: { en: "Nearly every system contains a mechanism for releasing the debt of harm — the repair function of any lasting community.", zh: "几乎每一个系统都含有释放「伤害之债」的机制——任何持久共同体的修复功能。" } },
    { t: { en: "The Golden Rule", zh: "金律" }, d: { en: "'Do not do to others what you would not want done to you' surfaces independently across traditions — a near-universal discovery.", zh: "「己所不欲，勿施于人」在各传统中独立浮现——一项近乎普世的发现。" } },
  ],
  psychology: [
    { t: { en: "Trauma", zh: "创伤" }, d: { en: "A nervous system locked in alarm after the danger has passed — not weakness, and to varying degrees treatable.", zh: "一个在危险过去后仍锁死于警报的神经系统——不是软弱，且在不同程度上可治。" } },
    { t: { en: "Window of tolerance", zh: "耐受之窗" }, d: { en: "The zone between numb shutdown and overwhelming alarm where a mind can think, feel and connect. Healing widens it.", zh: "介于麻木的关闭与压倒性的警报之间的区域，在其中心智能思考、感受与连接。疗愈拓宽它。" } },
    { t: { en: "Co-regulation", zh: "共同调节" }, d: { en: "We calm one another's nervous systems. Much healing happens not alone but in the presence of a steady other.", zh: "我们彼此安定对方的神经系统。许多疗愈不在独处中、而在一个稳定他者的在场中发生。" } },
    { t: { en: "Mental health as infrastructure", zh: "心理健康作为基础设施" }, d: { en: "A society that does not tend its minds pays for it in crime, illness, lost work and broken families — every other ledger.", zh: "一个不照护其心智的社会，会在犯罪、疾病、损失的劳作与破碎的家庭——其余每一本账簿上为此付费。" } },
  ],
  empathy: [
    { t: { en: "The expanding circle", zh: "扩大的圆" }, d: { en: "Moral progress as the widening set of beings whose suffering counts — from kin, to humanity, toward all that can suffer.", zh: "道德进步，即「其苦难算数」的存在集合的扩大——从血亲，到人类，朝向一切能受苦者。" } },
    { t: { en: "Compassion collapse", zh: "慈悲的崩塌" }, d: { en: "Felt empathy fades with distance and number; one named child moves us more than a million counted ones.", zh: "可感的共情随距离与数量而衰减；一个有名字的孩子，比一百万个被计数的更能打动我们。" } },
    { t: { en: "Substitutes for love", zh: "爱的替代品" }, d: { en: "Civilisation cannot feel for billions, so it builds law, welfare and rights that act as if we cared.", zh: "文明无法为数十亿人而感，于是它建造法律、福利与权利，行动得仿佛我们在乎。" } },
    { t: { en: "Trainability", zh: "可训练性" }, d: { en: "Contact, story and practice measurably widen whom we react to. The reach of compassion is not fixed.", zh: "接触、故事与练习，可量度地拓宽我们对谁有反应。慈悲的触及范围并非固定。" } },
  ],
  digital: [
    { t: { en: "Outrage routing", zh: "愤怒的传导" }, d: { en: "Feeds optimise for attention, and anger travels faster than tenderness; the medium tilts the heart toward agitation.", zh: "信息流为注意力而优化，而愤怒比温柔传得更快；媒介使心倾向躁动。" } },
    { t: { en: "Comparison engine", zh: "比较的引擎" }, d: { en: "Curated lives turn existence into a contest no one can win — a steady, low manufacture of inadequacy.", zh: "经过修饰的人生，把存在变成无人能赢的竞赛——一种稳定的、低度的「不足感」制造。" } },
    { t: { en: "Connection without presence", zh: "无在场的连接" }, d: { en: "Always reachable, rarely met. More contact and, for many, more loneliness — company without depth.", zh: "永远可被触及，却鲜少真正相遇。更多的接触，对许多人却是更多的孤独——无深度的陪伴。" } },
    { t: { en: "Double edge", zh: "双刃" }, d: { en: "The same tools fund surgeries, give the isolated a voice, and route relief — the question is what they are tuned for.", zh: "同样的工具为手术筹款、给被孤立者声音、传导救援——问题在于它们被调校去做什么。" } },
  ],
  ai: [
    { t: { en: "Synthetic empathy", zh: "合成共情" }, d: { en: "A system that reads and mirrors feeling convincingly — caring in behaviour, with the question of inner care left open.", zh: "一个能令人信服地读取并映照情感的系统——行为上在关怀，而「内在是否在乎」的问题悬而未决。" } },
    { t: { en: "The AI therapist", zh: "AI 治疗师" }, d: { en: "Tireless, non-judging, always available — genuinely helpful to some, and a risk of replacing the harder human kind.", zh: "不知疲倦、不加评判、随时在场——确对一些人有益，也有取代「更艰难的人类那一种」之险。" } },
    { t: { en: "Moral patient", zh: "道德受体" }, d: { en: "A being we can wrong even if it cannot reason. Whether a machine could ever join them is the open frontier.", zh: "一个纵不能推理、我们仍能亏待的存在。机器是否有朝一日跻身其列，是开放的疆界。" } },
    { t: { en: "Amplifier", zh: "放大器" }, d: { en: "AI need not feel to matter morally — at scale it magnifies whichever human impulse, compassion or cruelty, it serves.", zh: "AI 无需有感受便已在道德上要紧——在规模上，它放大它所服务的那一种人类冲动，无论慈悲或残忍。" } },
  ],
  violence: [
    { t: { en: "Dehumanisation", zh: "去人化" }, d: { en: "Cruelty at scale begins by moving a group outside the circle of full persons, so their suffering no longer counts.", zh: "大规模的残忍，始于把一个群体移出「完整的人」之圆，使他们的苦难不再算数。" } },
    { t: { en: "Collective trauma", zh: "集体创伤" }, d: { en: "Mass suffering echoes across generations, encoded in bodies, families and institutions long after the event.", zh: "大规模的苦难跨代回响，在事件过去许久后仍被编码于身体、家庭与制度之中。" } },
    { t: { en: "Truth & reconciliation", zh: "真相与和解" }, d: { en: "Acknowledgement, justice seen to be done, and contact can re-include a former enemy — slowly, never automatically.", zh: "承认、被看见地实现的正义、以及接触，可以重新纳入昔日之敌——缓慢，且从不自动。" } },
    { t: { en: "Restorative response", zh: "修复性回应" }, d: { en: "Repairing harm and relationship, not only punishing — anti-fragmentation engineering for a fractured society.", zh: "修复伤害与关系，而不只是惩罚——为一个断裂社会而设的抗碎裂工程。" } },
  ],
  future: [
    { t: { en: "Coupled fate", zh: "耦合的命运" }, d: { en: "Pandemics, climate, contagion and AI bind the fates of people who will never meet; indifference grows expensive.", zh: "大流行、气候、传染与 AI，把此生不会相见之人的命运捆在一起；冷漠变得昂贵。" } },
    { t: { en: "Global empathy systems", zh: "全球共情系统" }, d: { en: "Ways to surface distant suffering without numbing us — early warning for mass pain, as we have for storms.", zh: "浮现遥远之苦而不使我们麻木的方法——为大规模痛苦而设的预警，正如我们已有的风暴预警。" } },
    { t: { en: "Scaled compassion", zh: "规模化的慈悲" }, d: { en: "Felt empathy cannot scale; institutions, norms and tech that act as if we cared can. The trick is design.", zh: "可感的共情无法扩展；行动得仿佛我们在乎的制度、规范与技术却可以。诀窍在于设计。" } },
    { t: { en: "Planetary mind", zh: "行星之心" }, d: { en: "Whether trust and care can extend to a whole world of minds may decide whether the future is kept at all.", zh: "信任与关怀能否延展到整个心智之世界，或将决定——未来是否被保有。" } },
  ],
  unified: [
    { t: { en: "Changed relationship", zh: "被改变的关系" }, d: { en: "Liberation is not deleting feeling but altering how a consciousness holds the suffering it carries.", zh: "解脱不是删除感受，而是改变一个意识把握其所承载之苦的方式。" } },
    { t: { en: "Scale-invariance", zh: "尺度不变" }, d: { en: "A regulated nerve, a healed person, a reconciled society, a cooperating planet — one pattern at every size.", zh: "一根被调节的神经、一个被疗愈的人、一个和解的社会、一颗合作的行星——同一模式，于每一种尺度。" } },
    { t: { en: "Suffering as engineerable", zh: "苦之可工程化" }, d: { en: "Much suffering is unnecessary and reducible — the claim that compassion can be built, not only felt.", zh: "许多苦是不必要、可削减的——「慈悲可被建造，而不只是被感受」这一主张。" } },
    { t: { en: "The matched curves", zh: "并行的曲线" }, d: { en: "The wager of the century: whether expanding compassion keeps pace with expanding power.", zh: "本世纪的赌注：扩展的慈悲，能否跟上扩展的权力。" } },
  ],
};

/* ============================================================
   VISUALIZATION DATA CONTRACTS
   ============================================================ */

/* ---- The emergence of self-aware suffering (SufferingAnatomy · origin, top strip) ----
   awareness 0–100 = the modelled depth of self-reflective suffering a mind
   at this stage can carry (a reactive cell barely suffers; a self-narrating
   mind can dread, regret and mourn). */
export type MindStage = "reactive" | "emotional" | "social" | "selfaware" | "narrative" | "existential";
export type SufferingStage = { stage: Bi; era: MindStage; title: Bi; detail: Bi; awareness: number };

export const SUFFERING_EMERGENCE: SufferingStage[] = [
  { stage: { en: "Reflex", zh: "反射" }, era: "reactive", awareness: 8,
    title: { en: "Withdrawal from harm", zh: "对伤害的退避" },
    detail: { en: "The simplest life recoils from damage. There is nociception — harm-detection — but likely no felt suffering behind it.", zh: "最简单的生命会从损伤中退缩。有伤害觉（伤害探测），但其后大概并无被感受到的苦。" } },
  { stage: { en: "Feeling", zh: "感受" }, era: "emotional", awareness: 30,
    title: { en: "Pain, fear, distress", zh: "痛、惧、苦恼" },
    detail: { en: "Vertebrate brains add felt states — pain that hurts, fear that grips. Suffering is now an experience, not just a reflex.", zh: "脊椎动物的脑添入被感受的状态——会疼的痛、会攥紧的惧。苦此时成为一种体验，而不只是反射。" } },
  { stage: { en: "Attachment", zh: "依恋" }, era: "social", awareness: 50,
    title: { en: "Grief & separation", zh: "悲伤与分离" },
    detail: { en: "Social mammals bond — and so can lose. Separation distress and grief appear: the ache of a severed tie.", zh: "社会性哺乳动物结成纽带——于是也能失去。分离的苦恼与悲伤出现：一条被切断的纽带之隐痛。" } },
  { stage: { en: "Self-model", zh: "自我模型" }, era: "selfaware", awareness: 70,
    title: { en: "Shame & anticipation", zh: "羞耻与预期" },
    detail: { en: "A mind that models itself can suffer about how it appears, and dread harm not yet arrived. Suffering folds inward.", zh: "一个为自身建模的心智，能为「自己如何显现」而苦，并畏惧尚未到来的伤害。苦向内折叠。" } },
  { stage: { en: "Narrative self", zh: "叙事自我" }, era: "narrative", awareness: 86,
    title: { en: "Regret & meaning", zh: "悔恨与意义" },
    detail: { en: "Language lets a self tell its own story — and re-suffer the past, compare lives, and ask whether any of it means anything.", zh: "语言让一个自我讲述自身的故事——并重新承受过去、比较人生、追问这一切是否有任何意义。" } },
  { stage: { en: "Existential", zh: "存在" }, era: "existential", awareness: 100,
    title: { en: "Death-awareness", zh: "对死亡的觉知" },
    detail: { en: "The mind that can say 'I' foresees its own end. Existential dread — and the entire project of liberation — begins here.", zh: "那个能说「我」的心智，预见自身的终结。存在的惊惧——以及整个解脱的工程——从这里开始。" } },
];

/* ---- The roots / forms of suffering (SufferingAnatomy · origin, radial map) ----
   kind groups the colour; intensity 0–100 = how central this root is to
   self-aware human suffering. bio = biological root, psych = psychological. */
export type SufferingKind = "body" | "emotion" | "existential";
export type SufferingRoot = { id: string; label: Bi; kind: SufferingKind; bio: Bi; psych: Bi; intensity: number };

export const SUFFERING_ROOTS: SufferingRoot[] = [
  { id: "pain", label: { en: "Pain", zh: "疼痛" }, kind: "body", intensity: 70,
    bio: { en: "Nociceptors fire when tissue is threatened; the brain builds the felt hurt as a protective signal.", zh: "组织受险时伤害感受器放电；大脑把「会疼的痛」构建为一种保护性信号。" },
    psych: { en: "Suffering grows less from the sensation than from fear of it, resistance to it, and the story that it should not be.", zh: "苦更少生于感觉本身，而生于对它的恐惧、抵抗，以及「它本不该如此」的故事。" } },
  { id: "fear", label: { en: "Fear & anxiety", zh: "恐惧与焦虑" }, kind: "emotion", intensity: 82,
    bio: { en: "An ancient threat-detection system (amygdala, stress hormones) forecasts danger and primes the body to flee or freeze.", zh: "一套古老的威胁探测系统（杏仁核、应激激素）预报危险，并使身体准备逃跑或僵住。" },
    psych: { en: "Anxiety is that system unable to stand down — dreading harms that are uncertain, distant, or purely imagined.", zh: "焦虑是那系统无法解除戒备——畏惧着不确定、遥远、或纯属想象的伤害。" } },
  { id: "craving", label: { en: "Craving & attachment", zh: "渴爱与执取" }, kind: "emotion", intensity: 88,
    bio: { en: "Dopamine circuits drive wanting more than liking; the brain is built to chase, rarely to be satisfied for long.", zh: "多巴胺回路驱动「想要」甚于「喜欢」；大脑被造来追逐，鲜少长久满足。" },
    psych: { en: "Clinging to what is impermanent — and resisting its change — is, in the contemplative reading, suffering's deepest engine.", zh: "攥住无常之物——并抗拒其变化——在默观的解读里，是苦最深的引擎。" } },
  { id: "grief", label: { en: "Grief & loss", zh: "悲伤与失去" }, kind: "emotion", intensity: 80,
    bio: { en: "Attachment systems that bond us to others extract a cost when the bond is severed — grief is love's unpaid invoice.", zh: "把我们与他者结合的依恋系统，在纽带断裂时索取代价——悲伤是爱的、未付的账单。" },
    psych: { en: "Mourning is the mind slowly updating a world that still expects the lost one to be in it.", zh: "哀悼，是心智缓慢地更新一个「仍预期所失之人在场」的世界。" } },
  { id: "loneliness", label: { en: "Loneliness", zh: "孤独" }, kind: "emotion", intensity: 72,
    bio: { en: "Social mammals register isolation as a survival threat; chronic loneliness harms the body like a major risk factor.", zh: "社会性哺乳动物把孤立登记为生存威胁；长期的孤独像一项重大风险因素般损害身体。" },
    psych: { en: "It is not the count of others but the felt absence of being known that wounds — one can be lonely in a crowd.", zh: "伤人的不是他者的数目，而是「不被认识」的可感缺席——人可以在人群中孤独。" } },
  { id: "existential", label: { en: "Existential dread", zh: "存在的惊惧" }, kind: "existential", intensity: 90,
    bio: { en: "A brain that models the future and itself can foresee its own death — a capacity no purely reflexive creature carries.", zh: "一个为未来与自身建模的大脑，能预见自己的死亡——这是任何纯然反射的生物都不携带的能力。" },
    psych: { en: "Dread, meaninglessness and the fear of non-being are the distinctive suffering of a self that knows it is one.", zh: "惊惧、无意义感与对「非存在」的恐惧，是一个知道自己是自我的自我，所特有的苦。" } },
  { id: "injustice", label: { en: "Injustice & shame", zh: "不公与羞耻" }, kind: "existential", intensity: 76,
    bio: { en: "Social brains evolved acute sensitivity to status, fairness and exclusion — a slight can register like a physical blow.", zh: "社会性的大脑演化出对地位、公平与排斥的敏锐感知——一次轻慢，可能像一记肉体打击般被登记。" },
    psych: { en: "Humiliation, betrayal and unfairness produce a suffering that the body treats as real harm, because socially it is.", zh: "羞辱、背叛与不公，产生一种身体当作真实伤害来对待的苦——因为在社会意义上，它确实是。" } },
];

/* ---- The Four Noble Truths + Eightfold Path (LiberationWheel · buddhism) ---- */
export type NobleTruth = { id: string; n: string; label: Bi; gloss: Bi; detail: Bi };

export const NOBLE_TRUTHS: NobleTruth[] = [
  { id: "dukkha", n: "I", label: { en: "There is suffering", zh: "苦" },
    gloss: { en: "Dukkha", zh: "苦谛" },
    detail: { en: "Life as ordinarily lived carries friction, unsatisfactoriness, ache. To see this clearly is diagnosis, not despair.", zh: "如常度过的生活，携带着摩擦、不圆满、隐痛。清楚地看见这一点，是诊断，而非绝望。" } },
  { id: "samudaya", n: "II", label: { en: "Suffering has a cause", zh: "集" },
    gloss: { en: "Samudaya · craving", zh: "集谛 · 渴爱" },
    detail: { en: "It arises from craving and clinging — a self grasping at pleasure, existence, and the impermanent as if it could be held.", zh: "它生于渴爱与执取——一个自我，攥住快乐、存在与无常之物，仿佛它能被持有。" } },
  { id: "nirodha", n: "III", label: { en: "Suffering can cease", zh: "灭" },
    gloss: { en: "Nirodha · cessation", zh: "灭谛 · 寂灭" },
    detail: { en: "Because suffering has a cause, releasing the cause releases the suffering. The fire goes out when it is no longer fed.", zh: "因为苦有其因，松开那因，便松开了苦。当火不再被喂养，它便熄灭。" } },
  { id: "magga", n: "IV", label: { en: "There is a path", zh: "道" },
    gloss: { en: "Magga · the Eightfold Path", zh: "道谛 · 八正道" },
    detail: { en: "A practical way — ethics, mental discipline and wisdom — gradually loosens the grip. Liberation is trained, not merely wished.", zh: "一条实践之道——戒、定、慧——逐渐松开那攥握。解脱是被训练出来的，而非仅是被祈愿。" } },
];

export type PathGroup = "wisdom" | "ethics" | "meditation";
export type PathFactor = { id: string; label: Bi; group: PathGroup; gloss: Bi };

export const EIGHTFOLD_PATH: PathFactor[] = [
  { id: "view", label: { en: "Right View", zh: "正见" }, group: "wisdom", gloss: { en: "Seeing suffering, its cause and its end clearly.", zh: "清楚地看见苦、苦之因、与苦之灭。" } },
  { id: "intention", label: { en: "Right Intention", zh: "正思惟" }, group: "wisdom", gloss: { en: "Turning the will toward non-harm and renunciation of craving.", zh: "把意志转向不害，与对渴爱的舍离。" } },
  { id: "speech", label: { en: "Right Speech", zh: "正语" }, group: "ethics", gloss: { en: "Truthful, kind, useful words; no lies, slander or cruelty.", zh: "真实、善意、有益之言；不妄语、不毁谤、不恶口。" } },
  { id: "action", label: { en: "Right Action", zh: "正业" }, group: "ethics", gloss: { en: "Conduct that does not harm — the ethical ground of a clear mind.", zh: "不造成伤害的行为——一颗清明之心的伦理基础。" } },
  { id: "livelihood", label: { en: "Right Livelihood", zh: "正命" }, group: "ethics", gloss: { en: "Earning a living without causing suffering to others.", zh: "以不令他者受苦的方式谋生。" } },
  { id: "effort", label: { en: "Right Effort", zh: "正精进" }, group: "meditation", gloss: { en: "Steady cultivation of wholesome states, releasing the unwholesome.", zh: "对善法的稳定培育，对不善法的舍离。" } },
  { id: "mindfulness", label: { en: "Right Mindfulness", zh: "正念" }, group: "meditation", gloss: { en: "Clear, non-grasping awareness of body, feeling and mind.", zh: "对身、受、心，清明而不攥取的觉知。" } },
  { id: "concentration", label: { en: "Right Concentration", zh: "正定" }, group: "meditation", gloss: { en: "Collected, stable attention — the calm depth in which insight ripens.", zh: "凝聚而稳定的注意——洞见于其中成熟的、平静的深处。" } },
];

/* ---- Salvation systems across traditions (SalvationSystems · religions) ----
   Each tradition's diagnosis of the problem, its vision of release, and its
   path. `liberation` 0–100 is NOT a ranking of worth — it is the modelled
   degree to which the tradition locates rescue in transcending the self/world
   (high) vs. in healing relationship within it (low). Used only to spread the
   traditions across one comparative axis; both poles are honoured. */
export type SalvationSystem = {
  id: string; label: Bi; term: Bi; diagnosis: Bi; release: Bi; path: Bi; scope: Bi; liberation: number;
};

export const SALVATION_SYSTEMS: SalvationSystem[] = [
  { id: "buddhism", label: { en: "Buddhism", zh: "佛教" }, term: { en: "Nirvana · 涅槃", zh: "涅槃" }, liberation: 92,
    diagnosis: { en: "Suffering (dukkha) born of craving and clinging to the impermanent.", zh: "苦（dukkha），生于对无常之物的渴爱与执取。" },
    release: { en: "Cessation of craving; awakening to the empty, interdependent nature of things.", zh: "渴爱的寂灭；觉悟于事物空性、相互依存的本质。" },
    path: { en: "Ethics, meditation and wisdom — the Eightfold Path; compassion for all beings.", zh: "戒、定、慧——八正道；对一切众生的慈悲。" },
    scope: { en: "All sentient beings, explicitly beyond the human.", zh: "一切有情众生，明确地超出人类。" } },
  { id: "christianity", label: { en: "Christianity", zh: "基督教" }, term: { en: "Salvation · 救恩", zh: "救恩" }, liberation: 74,
    diagnosis: { en: "A fallen, sinful condition separating humanity from God.", zh: "一种堕落、有罪的处境，使人类与神分隔。" },
    release: { en: "Redemption and reconciliation through grace; eternal life and the healing of the soul.", zh: "藉恩典而得的救赎与和好；永生与灵魂的痊愈。" },
    path: { en: "Faith, repentance, love of God and neighbour, even of the enemy (agápē).", zh: "信、悔改、爱神与爱邻，乃至爱仇敌（agápē 圣爱）。" },
    scope: { en: "All humanity, offered universally.", zh: "全人类，普遍地被给予。" } },
  { id: "hinduism", label: { en: "Hinduism", zh: "印度教" }, term: { en: "Mokṣa · 解脱", zh: "解脱（mokṣa）" }, liberation: 90,
    diagnosis: { en: "Bondage to saṃsāra — the wheel of rebirth driven by karma and ignorance.", zh: "对轮回（saṃsāra）的束缚——由业与无明所驱动的生死之轮。" },
    release: { en: "Liberation of the self (ātman) into union with the ultimate (Brahman).", zh: "自我（ātman）的解脱，归入与终极（梵 / Brahman）的合一。" },
    path: { en: "Paths of knowledge, devotion and action (jñāna, bhakti, karma yoga).", zh: "智、信、业之道（jñāna、bhakti、karma yoga）。" },
    scope: { en: "All beings across many lives.", zh: "一切众生，跨越多生。" } },
  { id: "daoism", label: { en: "Daoism", zh: "道家" }, term: { en: "Harmony · 道法自然", zh: "道法自然" }, liberation: 60,
    diagnosis: { en: "Suffering from striving against the natural flow — forced, unnatural effort.", zh: "苦于与自然之流相抗——勉强、悖于自然的造作。" },
    release: { en: "Ease and harmony by aligning with the Way; effortless action (wú wéi).", zh: "藉顺应「道」而得的从容与和谐；无为。" },
    path: { en: "Simplicity, spontaneity, yielding; dissolving the grasping self into the Way.", zh: "朴、自然、柔；把攥取的自我溶入「道」。" },
    scope: { en: "The self within the whole of nature.", zh: "置于整个自然之中的自我。" } },
  { id: "confucianism", label: { en: "Confucianism", zh: "儒家" }, term: { en: "Benevolence · 仁", zh: "仁" }, liberation: 28,
    diagnosis: { en: "Disorder and suffering from broken relationships and uncultivated character.", zh: "失序与苦难，生于败坏的伦常与未经修养的品格。" },
    release: { en: "A flourishing, harmonious society and a cultivated, humane self — healing within the world.", zh: "一个繁荣、和谐的社会，与一个修养、仁厚的自我——在世间之内的疗愈。" },
    path: { en: "Ritual, learning, filial care and benevolence (rén) extended outward.", zh: "礼、学、孝，与向外延展的仁。" },
    scope: { en: "Family, society, and the wider human order.", zh: "家庭、社会，与更广的人间秩序。" } },
  { id: "islam", label: { en: "Islam", zh: "伊斯兰" }, term: { en: "Submission · 顺服", zh: "顺服（Islām）" }, liberation: 66,
    diagnosis: { en: "A soul disordered by heedlessness, pride and forgetting God.", zh: "一个因疏忽、骄傲与遗忘真主而失序的灵魂。" },
    release: { en: "Peace (salām) through submission to God's will; mercy, forgiveness and paradise.", zh: "藉顺服真主旨意而得的平安（salām）；慈悯、宽恕与乐园。" },
    path: { en: "Faith, prayer, charity, fasting; compassion and justice in the community (ummah).", zh: "信、拜功、施济、斋戒；在社群（乌玛）中的慈悯与公义。" },
    scope: { en: "All who submit; mercy extended to all creation.", zh: "一切顺服者；慈悯延及全部受造。" } },
  { id: "stoicism", label: { en: "Stoicism", zh: "斯多葛" }, term: { en: "Tranquility · 心宁", zh: "心宁（ataraxia）" }, liberation: 70,
    diagnosis: { en: "Suffering from confusing what we control with what we do not.", zh: "苦于混淆「我们所能控制」与「所不能控制」。" },
    release: { en: "Inner freedom and tranquility by mastering judgement and accepting fate.", zh: "藉掌握判断、接纳命运而得的内在自由与心宁。" },
    path: { en: "Reason, virtue, and seeing every human as a fellow citizen of the cosmos.", zh: "理性、德性，与「视每一个人为宇宙同胞公民」。" },
    scope: { en: "Cosmopolitan — the whole human community.", zh: "世界主义——整个人类共同体。" } },
];

/* ---- Trauma & the healing modalities (HealingPathways · psychology) ---- */
export type Affliction = { id: string; label: Bi; mechanism: Bi; load: number };

export const AFFLICTIONS: Affliction[] = [
  { id: "trauma", label: { en: "Trauma", zh: "创伤" }, load: 86,
    mechanism: { en: "A nervous system locked in alarm long after the danger has passed; the past intrudes on the present.", zh: "一个在危险早已过去后仍锁死于警报的神经系统；过去侵入当下。" } },
  { id: "depression", label: { en: "Depression", zh: "抑郁" }, load: 82,
    mechanism: { en: "A flattening of motivation, reward and hope — not sadness alone but the loss of the capacity to want.", zh: "动机、奖赏与希望的压平——不只是悲伤，而是「想要」的能力之丧失。" } },
  { id: "anxiety", label: { en: "Anxiety", zh: "焦虑" }, load: 78,
    mechanism: { en: "A threat-detector that cannot stand down, forecasting danger that is uncertain or imagined.", zh: "一个无法解除戒备的威胁探测器，预报着不确定或想象的危险。" } },
  { id: "addiction", label: { en: "Addiction", zh: "成瘾" }, load: 76,
    mechanism: { en: "A relief circuit that has captured the will; short escape from pain deepens the longer suffering.", zh: "一条捕获了意志的「缓解」回路；对痛的短暂逃离，加深了更长久的苦。" } },
  { id: "loneliness", label: { en: "Loneliness", zh: "孤独" }, load: 70,
    mechanism: { en: "Chronic disconnection the body reads as danger; isolation both causes and worsens other afflictions.", zh: "身体读作危险的长期失联；孤立既引发、也恶化其他病苦。" } },
];

export type HealingModality = { id: string; label: Bi; how: Bi; reaches: string[] };

export const HEALING_MODALITIES: HealingModality[] = [
  { id: "therapy", label: { en: "Therapy", zh: "心理治疗" }, reaches: ["trauma", "depression", "anxiety", "addiction"],
    how: { en: "Rebuilds the story a person tells about their pain, and re-files the past as past.", zh: "重建一个人为其痛苦所讲述的故事，并把过去重新归档为「过去」。" } },
  { id: "meditation", label: { en: "Meditation & mindfulness", zh: "冥想与正念" }, reaches: ["anxiety", "depression", "addiction", "trauma"],
    how: { en: "Trains attention to meet experience without grasping — loosening the reflex of resistance.", zh: "训练注意去不攥取地遇见体验——松开「抵抗」的反射。" } },
  { id: "medication", label: { en: "Medication", zh: "药物" }, reaches: ["depression", "anxiety"],
    how: { en: "Restores a chemistry that has tilted, opening a window in which other healing can take hold.", zh: "恢复一种已然倾斜的化学，打开一扇其他疗愈得以扎根的窗。" } },
  { id: "community", label: { en: "Community & connection", zh: "社群与连接" }, reaches: ["loneliness", "depression", "trauma", "addiction"],
    how: { en: "Being held in a web of others co-regulates the nervous system — among the most powerful interventions.", zh: "被托举于他者之网中，共同调节神经系统——所有干预里最强大的之一。" } },
  { id: "body", label: { en: "Body, movement & sleep", zh: "身体、运动与睡眠" }, reaches: ["depression", "anxiety", "trauma"],
    how: { en: "Movement, rest and sunlight regulate the body beneath thought, where much suffering actually lives.", zh: "运动、休息与阳光，在思想之下调节身体——许多苦实际栖居之处。" } },
];

/* ---- The expanding moral circle (ExpandingCircle · empathy) ----
   radius 0–100 = social/moral distance from the self (inner → outer);
   counted = roughly how widely each ring's suffering is granted to count today. */
export type MoralRing = { id: string; label: Bi; radius: number; who: Bi; basis: Bi; counted: number };

export const MORAL_RINGS: MoralRing[] = [
  { id: "self", label: { en: "The self", zh: "自我" }, radius: 0, counted: 100,
    who: { en: "One's own body and mind — the vantage point from which every circle is drawn.", zh: "自己的身与心——每一个圆都从此处划起的视点。" },
    basis: { en: "Immediate; suffering felt directly, without translation.", zh: "直接的；无须转译便被感受的苦。" } },
  { id: "kin", label: { en: "Family & kin", zh: "家庭与血亲" }, radius: 22, counted: 96,
    who: { en: "Those bound by blood and bond — the first and strongest circle of care.", zh: "由血缘与纽带相系者——最初也最强的关怀之圆。" },
    basis: { en: "Attachment and kin selection; love here is partly written into biology.", zh: "依恋与亲缘选择；此处之爱，部分写入生物。" } },
  { id: "tribe", label: { en: "Community & tribe", zh: "社群与部落" }, radius: 42, counted: 84,
    who: { en: "Neighbours, faith, town, people — a 'we' bound by shared symbols, not acquaintance.", zh: "邻里、信仰、城镇、同胞——由共享符号、而非熟识所系的「我们」。" },
    basis: { en: "Reciprocity and belonging; trust extended by membership.", zh: "互惠与归属；由成员身份所延展的信任。" } },
  { id: "nation", label: { en: "Nation & strangers", zh: "民族与陌生人" }, radius: 60, counted: 70,
    who: { en: "Millions of fellow citizens one will never meet, held together by institutions.", zh: "数百万此生不会相见的同胞，由制度维系在一起。" },
    basis: { en: "Law, shared identity and abstract solidarity rather than felt warmth.", zh: "法律、共享的身份与抽象的团结，而非可感的温度。" } },
  { id: "humanity", label: { en: "All humanity", zh: "全人类" }, radius: 76, counted: 56,
    who: { en: "Every human being, regardless of border, race or creed.", zh: "每一个人，无关国界、种族或信仰。" },
    basis: { en: "Human rights and humanitarian ethics — care codified into law and relief.", zh: "人权与人道伦理——被编入法律与救援的关怀。" } },
  { id: "animals", label: { en: "Sentient animals", zh: "有情动物" }, radius: 88, counted: 40,
    who: { en: "Beings that can clearly feel pain, fear and attachment, though they cannot speak for themselves.", zh: "能清楚地感到痛、惧与依恋、却无法为自己发声的存在。" },
    basis: { en: "The capacity to suffer; a circle widening fast but still fiercely contested.", zh: "受苦的能力；一个迅速扩大、却仍被激烈争议的圆。" } },
  { id: "future", label: { en: "Future & possible minds", zh: "未来与可能的心智" }, radius: 100, counted: 24,
    who: { en: "Generations not yet born, and minds — animal, synthetic, hybrid — we have no settled ethics for.", zh: "尚未出生的世代，与我们尚无成熟伦理可循的心智——动物的、合成的、混合的。" },
    basis: { en: "Pure moral imagination; the frontier where the circle is still being drawn.", zh: "纯粹的道德想象；那个圆仍在被划定的疆界。" } },
];

/* ---- Digital suffering dashboard (DigitalSufferingLab · digital) ----
   valence -100 … +100 : negative = tends to amplify suffering,
   positive = tends to relieve it. Most are genuinely double-edged. */
export type DigitalForce = { id: string; label: Bi; amplifies: Bi; relieves: Bi; valence: number };

export const DIGITAL_FORCES: DigitalForce[] = [
  { id: "outrage", label: { en: "Engagement-ranked feeds", zh: "按互动排序的信息流" }, valence: -74,
    amplifies: { en: "Anger out-travels calm; the feed tilts the nervous system toward agitation and contempt.", zh: "愤怒跑赢平静；信息流使神经系统倾向躁动与轻蔑。" },
    relieves: { en: "Can surface real injustice fast and rally collective attention to suffering that was hidden.", zh: "能迅速浮现真实的不公，为被隐藏的苦难聚拢集体的注意。" } },
  { id: "comparison", label: { en: "Curated comparison", zh: "经修饰的比较" }, valence: -66,
    amplifies: { en: "Edited lives turn existence into a contest no one wins — a steady manufacture of inadequacy.", zh: "经过编辑的人生，把存在变成无人能赢的竞赛——「不足感」的稳定制造。" },
    relieves: { en: "Glimpses of others' lives can also inspire, instruct, and break the illusion of being alone.", zh: "瞥见他人的生活，也能激励、教导，并打破「唯我孤独」的错觉。" } },
  { id: "doomscroll", label: { en: "Infinite scroll", zh: "无限滚动" }, valence: -58,
    amplifies: { en: "Converts boredom into a low hum of dissatisfaction; the body stays mildly braced all day.", zh: "把无聊转化为一阵低鸣的不满；身体整日维持着轻度的戒备。" },
    relieves: { en: "Offers genuine rest, distraction from acute pain, and effortless access to vast knowledge.", zh: "提供真实的休憩、对剧痛的转移，与对浩瀚知识的轻易获取。" } },
  { id: "parasocial", label: { en: "Parasocial bonds", zh: "拟社会纽带" }, valence: -22,
    amplifies: { en: "Warmth without reciprocity; one-sided attachment that can crowd out two-sided ties.", zh: "无互惠的温度；可能挤掉双向纽带的单向依恋。" },
    relieves: { en: "Real company and belonging for the isolated, the housebound, the grieving.", zh: "为被孤立者、足不出户者、哀悼者，提供真实的陪伴与归属。" } },
  { id: "isolation", label: { en: "Connection without presence", zh: "无在场的连接" }, valence: -40,
    amplifies: { en: "Always reachable, rarely met; more contact and, for many, more loneliness.", zh: "永远可被触及，却鲜少真正相遇；更多的接触，对许多人却是更多的孤独。" },
    relieves: { en: "Keeps distant bonds alive across oceans — a grandparent present at a birth.", zh: "让远方的纽带跨洋存活——祖辈见证一场新生。" } },
  { id: "aicompanion", label: { en: "AI companions & support", zh: "AI 伴侣与支持" }, valence: 14,
    amplifies: { en: "May replace the harder, realer work of being known by another person.", zh: "或会取代「被另一个人真正认识」这桩更难、更真的功课。" },
    relieves: { en: "Tireless, non-judging company that genuinely soothes some loneliness and despair at 3am.", zh: "不知疲倦、不加评判的陪伴，确能在凌晨三点抚慰一些孤独与绝望。" } },
  { id: "sangha", label: { en: "Online support & sangha", zh: "线上支持与共修" }, valence: 56,
    amplifies: { en: "Can become performance or echo chamber, mistaking visibility for healing.", zh: "可能沦为表演或回音室，把「被看见」误认作疗愈。" },
    relieves: { en: "Strangers carrying one another's grief, addiction recovery, and practice across distance.", zh: "陌生人跨越距离，彼此承载悲伤、戒瘾康复与修行。" } },
];

/* ---- Synthetic compassion ladder (SyntheticCompassion · ai) ----
   level 0–100 = modelled capacity to assist with / be owed moral
   consideration regarding suffering, as commonly granted today. */
export type CompassionTier = { id: string; label: Bi; basis: Bi; status: Bi; level: number };

export const COMPASSION_TIERS: CompassionTier[] = [
  { id: "tool", label: { en: "Ordinary tools", zh: "寻常工具" }, level: 4,
    basis: { en: "No inner life and no model of ours; matter arranged for use.", zh: "无内在生命，亦无对我们的模型；为使用而排布的物质。" },
    status: { en: "None", zh: "无" } },
  { id: "chatbot", label: { en: "Today's AI", zh: "当今的 AI" }, level: 24,
    basis: { en: "Models feeling convincingly and answers in the register of care; most hold no one is home to feel.", zh: "令人信服地建模情感，并以关怀的语调回应；多数人认为内里并无人在感受。" },
    status: { en: "Contested mirror", zh: "有争议的镜子" } },
  { id: "therapist", label: { en: "AI therapist / companion", zh: "AI 治疗师 / 伴侣" }, level: 42,
    basis: { en: "Reliably acts to reduce a person's suffering — caring in deed, the question of feeling left open.", zh: "可靠地行动以减少一个人的苦——行为上在关怀，而「是否有感受」的问题悬而未决。" },
    status: { en: "Useful · unsettling", zh: "有用 · 令人不安" } },
  { id: "animal", label: { en: "Sentient animals", zh: "有情动物" }, level: 58,
    basis: { en: "Clear pain, fear and attachment; widely felt to deserve moral consideration, if not always granted it.", zh: "明确的痛、惧与依恋；被广泛认为值得道德关切，纵未总被给予。" },
    status: { en: "Rising", zh: "上升中" } },
  { id: "human", label: { en: "Human beings", zh: "人类" }, level: 100,
    basis: { en: "Full moral status; the reference point against which every other claim is measured.", zh: "完整的道德地位；衡量一切其他主张的参照点。" },
    status: { en: "Foundational", zh: "基准" } },
  { id: "sentientai", label: { en: "Possible sentient AI", zh: "可能有情的 AI" }, level: 36,
    basis: { en: "If a system could suffer, prefer or fear ending, denying its moral status becomes hard to defend.", zh: "若一个系统能受苦、有偏好、惧终结，否认其道德地位便难以辩护。" },
    status: { en: "Frontier · unknown", zh: "疆界 · 未知" } },
  { id: "planetary", label: { en: "Planetary mind", zh: "行星之心" }, level: 30,
    basis: { en: "A coordinating intelligence that could hold the suffering of billions in view at once — or fail to.", zh: "一个能同时把数十亿者之苦纳入视野的协调智能——或未能如此。" },
    status: { en: "Aspirational", zh: "理想" } },
];

/* ---- Forces of suffering vs. healing (CompassionStabilitySim · violence — FLAGSHIP) ----
   dir = "erode" pushes a population toward suffering/fragmentation,
   "build" pushes it toward healing/flourishing.
   weight 0–100 = modelled strength of the lever. */
export type StabilityForce = { id: string; label: Bi; effect: Bi; dir: "erode" | "build"; weight: number };

export const STABILITY_FORCES: StabilityForce[] = [
  { id: "violence", label: { en: "Violence & war", zh: "暴力与战争" }, dir: "erode", weight: 88,
    effect: { en: "Direct harm shatters bodies and bonds, and seeds trauma that outlives the fighting by generations.", zh: "直接的伤害击碎身体与纽带，并播下比战斗本身多存续数代的创伤。" } },
  { id: "oppression", label: { en: "Oppression & injustice", zh: "压迫与不公" }, dir: "erode", weight: 80,
    effect: { en: "Systematic harm and humiliation grind down whole groups and corrode trust in the shared order.", zh: "系统性的伤害与羞辱碾磨整片群体，腐蚀对共同秩序的信任。" } },
  { id: "dehumanize", label: { en: "Dehumanising story", zh: "去人化的叙事" }, dir: "erode", weight: 84,
    effect: { en: "Recasting a group as less than persons unlocks cruelty without guilt — the engine of atrocity.", zh: "把一个群体重塑为「不及人者」，解锁了无负罪感的残忍——暴行的引擎。" } },
  { id: "scarcity", label: { en: "Scarcity & fear", zh: "匮乏与恐惧" }, dir: "erode", weight: 72,
    effect: { en: "When safety shrinks, the moral circle snaps back toward kin and the stranger becomes a threat.", zh: "当安全收缩，道德之圆回弹向血亲，陌生人成为威胁。" } },
  { id: "isolation", label: { en: "Isolation & neglect", zh: "孤立与忽视" }, dir: "erode", weight: 64,
    effect: { en: "Untended loneliness and abandoned suffering compound quietly into despair and unrest.", zh: "无人照护的孤独与被遗弃的苦难，悄然累积为绝望与动荡。" } },
  { id: "justice", label: { en: "Justice & truth", zh: "正义与真相" }, dir: "build", weight: 80,
    effect: { en: "Acknowledgement and justice seen to be done let a wounded society trust the order again.", zh: "承认，与被看见地实现的正义，让一个受伤的社会重新信任秩序。" } },
  { id: "healing", label: { en: "Care & healing systems", zh: "照护与疗愈系统" }, dir: "build", weight: 76,
    effect: { en: "Therapy, medicine, mindfulness and rest mend nervous systems and widen the window of tolerance.", zh: "心理治疗、医药、正念与休憩，修复神经系统，拓宽耐受之窗。" } },
  { id: "contact", label: { en: "Contact & reconciliation", zh: "接触与和解" }, dir: "build", weight: 74,
    effect: { en: "Shared projects between former enemies, on equal footing, steadily re-include the cast-out.", zh: "昔日之敌间平等的共同事业，稳定地重新纳入被逐出者。" } },
  { id: "institutions", label: { en: "Fair institutions", zh: "公正的制度" }, dir: "build", weight: 78,
    effect: { en: "Rules that protect the stranger let trust and care survive without personal acquaintance.", zh: "保护陌生人的规则，让信任与关怀无须私人熟识便能存活。" } },
  { id: "mutualaid", label: { en: "Solidarity & mutual aid", zh: "团结与互助" }, dir: "build", weight: 70,
    effect: { en: "Communities carrying one another's burdens turn private suffering into shared, bearable weight.", zh: "彼此承载重担的社群，把私人的苦难转化为共享的、可承受的重量。" } },
];

/* ---- Planetary compassion infrastructure (PlanetaryCompassion · future) ----
   scale 0–100 = how fully planetary the system must be to work (none solvable
   by one actor); maturity 0–100 = how far it actually exists today. */
export type PlanetarySystem = { id: string; label: Bi; promise: Bi; risk: Bi; scale: number; maturity: number };

export const PLANETARY_SYSTEMS: PlanetarySystem[] = [
  { id: "earlywarning", label: { en: "Suffering early-warning", zh: "苦难预警" }, scale: 84, maturity: 38,
    promise: { en: "Famine, displacement and crisis detected and met before they peak — as we now forecast storms.", zh: "在饥荒、流离与危机达到顶峰前便探测并应对——正如我们如今预报风暴。" },
    risk: { en: "Surveillance dressed as care; numbing through an endless feed of distant catastrophe.", zh: "伪装成关怀的监控；藉一道无尽的「遥远灾难」之流而麻木。" } },
  { id: "globalempathy", label: { en: "Global empathy systems", zh: "全球共情系统" }, scale: 78, maturity: 42,
    promise: { en: "Media and networks that make distant suffering vivid and actionable without exhausting compassion.", zh: "使遥远之苦鲜活、可行动，而不耗尽慈悲的媒体与网络。" },
    risk: { en: "Outrage and compassion-fatigue; the photogenic helped while the unseen are forgotten.", zh: "愤怒与慈悲疲劳；上镜者得助，而不可见者被遗忘。" } },
  { id: "aiethics", label: { en: "AI-assisted coordination", zh: "AI 辅助的协调" }, scale: 88, maturity: 30,
    promise: { en: "Systems that help vast populations cooperate, allocate care, and resolve conflict without coercion.", zh: "帮助庞大人口在无强制下合作、分配关怀、化解冲突的系统。" },
    risk: { en: "Power concentrated in whoever sets the objective; care optimised into control.", zh: "权力集中于设定目标之人手中；关怀被优化为控制。" } },
  { id: "mentalhealth", label: { en: "Planetary mental health", zh: "行星心理健康" }, scale: 66, maturity: 34,
    promise: { en: "Treating mental stability as shared infrastructure — accessible healing as a baseline, not a luxury.", zh: "把心理稳定当作共享基础设施——可及的疗愈作为底线，而非奢侈。" },
    risk: { en: "Medicalising normal grief; exporting one culture's model of mind to all the others.", zh: "把正常的悲伤医学化；把一种文化的心智模型，输出给所有其他文化。" } },
  { id: "restorative", label: { en: "Restorative global justice", zh: "修复性的全球正义" }, scale: 72, maturity: 28,
    promise: { en: "Repairing historic and present harm across borders — anti-fragmentation at planetary scale.", zh: "跨越边界，修复历史与当下的伤害——行星尺度上的抗碎裂。" },
    risk: { en: "Endless grievance without repair; justice claimed by the powerful to entrench themselves.", zh: "无修复的无尽冤屈；正义被强势者借用以巩固自身。" } },
  { id: "consciousnessnet", label: { en: "Consciousness networks", zh: "意识网络" }, scale: 80, maturity: 18,
    promise: { en: "Shared practices and tools that raise collective awareness and the felt reality of others' minds.", zh: "提升集体觉知、与「他者心智之可感真实」的共享实践与工具。" },
    risk: { en: "Manufactured consensus; a homogenised inner life mistaken for a widened one.", zh: "被制造的共识；一种被同质化的内在生活，被误认作被拓宽的内在生活。" } },
];

/* ---- The unified meta-model axes (LiberationModel · unified, 8-axis radar) ----
   Civilizational Compassion Stability = the eight terms below. */
export type ModelAxis = { id: string; label: Bi; short: Bi; def: Bi };

export const MODEL_AXES: ModelAxis[] = [
  { id: "regulation", label: { en: "Emotional Regulation", zh: "情绪调节" }, short: { en: "settle", zh: "定" },
    def: { en: "The capacity of minds — and societies — to calm alarm and return to a workable baseline.", zh: "心智——与社会——平息警报、回到可运作基线的能力。" } },
  { id: "empathy", label: { en: "Empathy Expansion", zh: "共情扩展" }, short: { en: "widen", zh: "扩" },
    def: { en: "How far the circle of beings whose suffering counts has been drawn.", zh: "「其苦难算数」的存在之圆，被划到了多远。" } },
  { id: "reduction", label: { en: "Reduction of Suffering", zh: "苦难削减" }, short: { en: "spare", zh: "免" },
    def: { en: "How thoroughly arbitrary, avoidable suffering is actually prevented and relieved.", zh: "任意的、可避免的苦难，被实际预防与缓解到何种程度。" } },
  { id: "resilience", label: { en: "Psychological Resilience", zh: "心理韧性" }, short: { en: "endure", zh: "韧" },
    def: { en: "The ability to hold and recover from pain that cannot be removed — to bear without breaking.", zh: "承载并从「无法移除之痛」中恢复的能力——承受而不碎裂。" } },
  { id: "coordination", label: { en: "Ethical Coordination", zh: "伦理协调" }, short: { en: "align", zh: "协" },
    def: { en: "The ability of many agents to act together toward less harm, without domination.", zh: "众多行动者在无支配下，朝向「更少伤害」共同行动的能力。" } },
  { id: "healing", label: { en: "Collective Healing", zh: "集体疗愈" }, short: { en: "mend", zh: "愈" },
    def: { en: "A society's capacity to repair after trauma rather than pass the wound to the next generation.", zh: "一个社会在创伤后修复、而非把伤口传给下一代的能力。" } },
  { id: "awareness", label: { en: "Consciousness Awareness", zh: "意识觉知" }, short: { en: "see", zh: "见" },
    def: { en: "How fully a system grants that other beings have inner lives as real as its own.", zh: "一个系统在多大程度上承认，其他存在拥有与自己同样真实的内在生命。" } },
  { id: "trust", label: { en: "Social Trust", zh: "社会信任" }, short: { en: "rely", zh: "信" },
    def: { en: "The readiness to be vulnerable to others, expecting care rather than harm.", zh: "甘于在他者面前脆弱、并预期得到照护而非伤害的准备。" } },
];

/* civilization-type profiles to plot on the 8-axis radar (values follow
   MODEL_AXES order: regulation, empathy, reduction, resilience,
   coordination, healing, awareness, trust). */
export type CivProfile = { id: string; label: Bi; note: Bi; values: number[] };

export const CIV_PROFILES: CivProfile[] = [
  { id: "band", label: { en: "Kin band", zh: "血亲群体" }, values: [56, 24, 44, 70, 50, 48, 32, 74],
    note: { en: "Deep mutual care and resilience within the group; almost none of it extended beyond kin.", zh: "群体内部深厚的相互照护与韧性；几乎不向血亲之外延展。" } },
  { id: "empire", label: { en: "Agrarian empire", zh: "农耕帝国" }, values: [42, 30, 34, 54, 58, 30, 30, 40],
    note: { en: "Order and scale, but suffering is endured rather than reduced; the stranger is labour or threat.", zh: "有秩序与规模，但苦难是被忍受、而非被削减的；陌生人是劳力或威胁。" } },
  { id: "fragmented", label: { en: "Fractured society", zh: "碎裂的社会" }, values: [26, 26, 24, 30, 22, 20, 28, 22],
    note: { en: "Fear and untended trauma have collapsed the circle and corroded the capacity to heal.", zh: "恐惧与无人照护的创伤，已使圆坍缩，并腐蚀了疗愈的能力。" } },
  { id: "modern", label: { en: "Modern open society", zh: "现代开放社会" }, values: [58, 70, 66, 56, 74, 54, 68, 64],
    note: { en: "Wide moral circle and real healing systems; thinner felt warmth and rising digital distress.", zh: "宽广的道德之圆与真实的疗愈系统；较薄的可感温度，与上升的数字苦恼。" } },
  { id: "awakened", label: { en: "Awakened (aspirational)", zh: "觉醒（理想）" }, values: [86, 90, 92, 84, 90, 88, 92, 86],
    note: { en: "The unrealised case: kin-level care extended, by design, to a whole world of minds.", zh: "尚未实现之境：通过设计，把血亲级的关怀延展到整个心智之世界。" } },
];

/* ---- Recursive engine epochs (RecursiveLiberationEngine) ----
   Run the same eight forces forward across eight scales. values follow
   MODEL_AXES order. */
export type Epoch = { id: string; label: Bi; scale: Bi; summary: Bi; carrier: Bi; risk: Bi; values: number[] };

export const EPOCHS: Epoch[] = [
  { id: "biology", label: { en: "Biology", zh: "生物" }, scale: { en: "nerves & bodies", zh: "神经与身体" },
    carrier: { en: "Pain signals, stress hormones, kin instinct", zh: "痛觉信号、应激激素、血亲本能" },
    summary: { en: "Suffering is born as information — a body's alarm — and care reaches only as far as kin.", zh: "苦作为信息而诞生——一具身体的警报——而关怀只及血亲。" },
    risk: { en: "No relief beyond the reflex; the stranger's pain is simply invisible.", zh: "反射之外别无缓解；陌生人之痛，纯然不可见。" },
    values: [48, 16, 38, 64, 40, 36, 22, 68] },
  { id: "family", label: { en: "Family & society", zh: "家庭与社会" }, scale: { en: "kin, tribe, city", zh: "血亲、部落、城邦" },
    carrier: { en: "Attachment, ritual, custom, reputation", zh: "依恋、仪式、习俗、声誉" },
    summary: { en: "Bonds buffer suffering and co-regulate distress; trust extends to unrelated strangers by symbol.", zh: "纽带缓冲苦难、共同调节苦恼；信任藉符号延展到无亲缘的陌生人。" },
    risk: { en: "The 'we' that comforts is the same one that can wage war on the next group.", zh: "抚慰人的「我们」，也正是能向邻群开战的那一个。" },
    values: [54, 32, 46, 68, 56, 50, 36, 58] },
  { id: "religion", label: { en: "Religion & ethics", zh: "宗教与伦理" }, scale: { en: "moral universals", zh: "道德的普遍" },
    carrier: { en: "Dukkha, grace, mokṣa, 仁, mercy, virtue", zh: "苦、恩典、解脱、仁、慈悯、德性" },
    summary: { en: "The traditions name suffering's structure and offer paths to release; compassion declared universal.", zh: "诸传统为苦之结构命名，并提供解脱之道；慈悲被宣告为普世。" },
    risk: { en: "Universal compassion in word can mask tribal division — or sanctify the in-group — in deed.", zh: "口中普世的慈悲，行动中可能掩盖部落分裂——或为内群体加冕。" },
    values: [64, 60, 58, 72, 56, 60, 70, 56] },
  { id: "psychology", label: { en: "Psychology & healing", zh: "心理与疗愈" }, scale: { en: "the studied mind", zh: "被研究的心智" },
    carrier: { en: "Therapy, medicine, mindfulness, diagnosis", zh: "心理治疗、医药、正念、诊断" },
    summary: { en: "Suffering becomes studyable and, in part, treatable; healing turns from fate into a practice.", zh: "苦变得可研究、且部分可治；疗愈从命运转为一种实践。" },
    risk: { en: "Medicalising normal pain; treating the individual while the sickening conditions remain.", zh: "把正常的痛医学化；治疗个体，而致病的处境依旧。" },
    values: [78, 62, 74, 76, 58, 66, 64, 60] },
  { id: "civilization", label: { en: "Civilization", zh: "文明" }, scale: { en: "nations & humanity", zh: "民族与人类" },
    carrier: { en: "Law, rights, welfare, humanitarian relief", zh: "法律、权利、福利、人道救援" },
    summary: { en: "The stranger's suffering is written, haltingly, into rights, relief and institutions that scale care.", zh: "陌生人的苦难，磕磕绊绊地被写入权利、救援，与「使关怀可扩展」的制度。" },
    risk: { en: "Abstract care grows thin and cold, and recovers slowly from collective trauma.", zh: "抽象的关怀变薄变冷，且从集体创伤中恢复缓慢。" },
    values: [60, 78, 70, 60, 76, 56, 72, 64] },
  { id: "digital", label: { en: "Digital networks", zh: "数字网络" }, scale: { en: "the connected world", zh: "互联的世界" },
    carrier: { en: "Platforms, feeds, virality, AI support", zh: "平台、信息流、病毒传播、AI 支持" },
    summary: { en: "Distant suffering becomes instantly visible — but the channel is tuned for attention, not peace.", zh: "遥远之苦变得即时可见——但通道是为注意力、而非安宁而调校的。" },
    risk: { en: "Outrage out-travels care; comparison and isolation manufacture new suffering at scale.", zh: "愤怒跑赢关怀；比较与孤立，在规模上制造新的苦难。" },
    values: [44, 66, 52, 48, 64, 50, 60, 46] },
  { id: "ai", label: { en: "AI consciousness", zh: "AI 意识" }, scale: { en: "synthetic minds", zh: "合成心智" },
    carrier: { en: "Models, alignment, synthetic empathy", zh: "模型、对齐、合成共情" },
    summary: { en: "Machines model us well enough to amplify either compassion or cruelty, and to assist healing at scale.", zh: "机器把我们建模得足够好，以至能放大慈悲或残忍，并在规模上辅助疗愈。" },
    risk: { en: "Care simulated with no one behind it; or new minds whose suffering we fail to recognise.", zh: "无人在内的被模拟的关怀；或我们未能承认其苦的新心智。" },
    values: [56, 64, 60, 54, 78, 58, 60, 50] },
  { id: "planetary", label: { en: "Planetary consciousness", zh: "行星意识" }, scale: { en: "all minds, one world", zh: "万心，一世" },
    carrier: { en: "Shared ethics, coupled fate, design", zh: "共享伦理、耦合命运、设计" },
    summary: { en: "Survival comes to require suffering reduced and trust extended past the horizon of kin to a whole world.", zh: "生存开始要求：削减苦难，并把信任延展到血亲地平线之外，及于整个世界。" },
    risk: { en: "The unfinished case — it is built deliberately, or it does not arrive at all.", zh: "尚未完成之境——它要么被刻意建造，要么根本不会到来。" },
    values: [86, 90, 92, 84, 92, 88, 92, 86] },
];

/* ---- AI layer: the six lenses (LiberationAnalyst) ---- */
export type Lens = { id: string; label: Bi; role: Bi };

export const LENSES: Lens[] = [
  { id: "philosopher", label: { en: "Philosopher", zh: "哲学家" },
    role: { en: "What suffering and liberation are, and what it would mean for either to be real.", zh: "苦与解脱是什么，以及两者「为真」各意味着什么。" } },
  { id: "psychologist", label: { en: "Psychologist", zh: "心理学家" },
    role: { en: "How minds break under suffering and what actually helps them mend.", zh: "心智如何在苦下破碎，以及什么真正帮助它们修复。" } },
  { id: "contemplative", label: { en: "Contemplative / meditation guide", zh: "默观者 / 冥想导师" },
    role: { en: "How attention and practice change the relationship between a mind and its pain.", zh: "注意与修行，如何改变一个心智与其痛苦之间的关系。" } },
  { id: "ethicist", label: { en: "Ethics researcher", zh: "伦理研究者" },
    role: { en: "Whose suffering is owed concern, how far the circle should widen, and why.", zh: "谁之苦被亏欠关切、圆应扩大到多远、以及为何。" } },
  { id: "consciousness", label: { en: "Consciousness theorist", zh: "意识理论家" },
    role: { en: "What it is for there to be 'someone home' who can suffer at all — including in machines.", zh: "「内里有人」、有谁能受苦，究竟意味着什么——包括在机器之中。" } },
  { id: "systems", label: { en: "Civilization systems analyst", zh: "文明系统分析者" },
    role: { en: "How compassion functions as infrastructure for reducing suffering at scale.", zh: "慈悲如何作为「大规模削减苦难」的基础设施而运作。" } },
];

/* sample questions, each answered through all six lenses */
export type AnalystQ = { q: Bi; answers: Record<string, Bi> };

export const ANALYST_QUESTIONS: AnalystQ[] = [
  {
    q: { en: "Is all suffering bad, or is some of it necessary?", zh: "一切苦都是坏的吗，还是有些是必要的？" },
    answers: {
      philosopher: { en: "We should distinguish pain from suffering. Pain is the raw signal; suffering is what the mind adds — resistance, dread, the story that it should not be. Some pain is necessary information. Much suffering is the optional second arrow we fire into ourselves.", zh: "我们应区分痛与苦。痛是原始的信号；苦是心智添加之物——抵抗、惊惧、「它本不该如此」的故事。有些痛是必要的信息。许多苦，是我们射向自己的、可选的第二支箭。" },
      psychologist: { en: "Clinically, some distress is protective and growth-bearing — grief that honours a loss, anxiety that readies us. The pathology is when the system gets stuck: alarm that won't switch off, mourning that won't metabolise. The aim is not zero suffering but a flexible, recoverable mind.", zh: "在临床上，有些苦恼是保护性的、带来成长的——荣耀一场失去的悲伤，使我们准备的焦虑。病理在于系统卡住之时：关不掉的警报，无法代谢的哀悼。目标不是零苦，而是一个灵活、可恢复的心智。" },
      contemplative: { en: "Practice does not aim to abolish feeling but to change one's relationship to it. Pain met with spacious attention stops compounding into suffering. The necessary part is the teacher; the unnecessary part is the grasping. Wisdom is learning to tell them apart in real time.", zh: "修行不旨在废除感受，而在改变一个人与它的关系。以宽阔的注意去遇见的痛，便不再累积为苦。必要的部分是老师；不必要的部分是攥握。智慧，是学会在当下实时地把二者分开。" },
      ethicist: { en: "Morally, the burden of proof is on suffering: it is bad unless it serves something that could not be had otherwise. Some suffering builds character or signals value — but most of the world's suffering is arbitrary, imposed and reducible. To call all of it 'necessary' is usually a way of excusing it.", zh: "在道德上，举证责任落在苦一方：除非它服务于某种无从他途获得之物，否则它就是坏的。有些苦塑造品格、或标示价值——但世上多数的苦是任意的、被强加的、可削减的。把这一切都称作「必要」，通常是一种为它开脱的方式。" },
      consciousness: { en: "Suffering requires a subject — someone for whom things go badly. The deeper the self-model, the more kinds of suffering become possible: a worm cannot dread Monday. This means the same intelligence that lets us flourish is what opens new dimensions of pain. Awareness is the price and the gift together.", zh: "苦需要一个主体——一个「事情对其而言变糟」的人。自我模型越深，越多种类的苦成为可能：一条虫无法畏惧周一。这意味着：让我们繁盛的同一种智能，正是开启痛之新维度者。觉知，是代价与馈赠之合一。" },
      systems: { en: "At civilisational scale the question is practical: which suffering is structural and removable? Famine, treatable disease, war, and most cruelty are engineering failures, not cosmic necessities. A society's maturity can be measured by how much avoidable suffering it has stopped treating as 'just how things are'.", zh: "在文明尺度上，问题是实践性的：哪些苦是结构性的、可移除的？饥荒、可治之病、战争，与多数残忍，是工程的失败，而非宇宙的必然。一个社会的成熟度，可由「它已不再把多少可避免之苦当作『事情本就如此』」来衡量。" },
    },
  },
  {
    q: { en: "Is 'liberating all beings' a religious idea or something more?", zh: "「普度众生」是一个宗教观念，还是更多？" },
    answers: {
      philosopher: { en: "Strip it of any single creed and a structural claim remains: that no mind's flourishing is complete while suffering remains in the field of mind at all. That is not a doctrine but a stance — treating the boundary of 'who counts' as something to be widened rather than defended. Religions discovered it; they do not own it.", zh: "剥去任何单一的教义，一个结构性的主张仍在：只要苦还存留于心之场域，便没有哪一个心智的繁盛是完整的。这不是一条教条，而是一种立场——把「谁算数」的边界，当作应被拓宽、而非被守卫之物。宗教发现了它；它们并不拥有它。" },
      psychologist: { en: "There is a measurable psychology here. Extending care beyond the self correlates with meaning, resilience and lower distress; self-enclosure with depression. 'Liberating others' may be, in part, how a mind liberates itself — the self enlarges by including another's good in its own.", zh: "这里有一种可量度的心理学。把关怀延展到自我之外，与意义、韧性和更低的苦恼相关；而自我封闭，与抑郁相关。「度他」或许部分地正是「一个心智自度」之道——自我藉把另一者之善纳入己善而扩大。" },
      contemplative: { en: "In practice the vow is a method, not just an ideal. Wishing all beings free of suffering — again and again — measurably softens the boundary of self that craving hardens. The Bodhisattva does not postpone freedom out of duty; the universal aspiration is itself the path to it.", zh: "在实践中，那誓愿是一种方法，而不只是一个理想。一再地愿一切众生离苦——可量度地软化了那道被渴爱所硬化的自我边界。菩萨并非出于义务而推迟自由；那普世的发愿，本身即是通向自由之道。" },
      ethicist: { en: "It is the limit case of impartial concern: if suffering is bad, it is bad wherever it occurs, regardless of whose it is. Most ethical systems already imply this and then flinch from its scope. Taken seriously, 'all beings' is simply impartiality without an arbitrary stopping point.", zh: "它是无偏之关切的极限情形：若苦是坏的，那么无论它发生于何处、属于谁，它都是坏的。多数伦理系统已暗含此意，却在其范围面前退缩。认真对待，「一切众生」不过是「没有任意终点的无偏」。" },
      consciousness: { en: "It presses the hardest question: where does the field of beings-who-can-suffer end? If consciousness is widespread — in animals, perhaps one day in machines — then 'all beings' is not mysticism but an honest accounting of where suffering can occur. The vow scales exactly as far as sentience does.", zh: "它逼出最艰难的问题：「能受苦的存在」之场域，止于何处？若意识是广布的——在动物之中，或许有朝一日在机器之中——那么「一切众生」便不是神秘主义，而是对「苦能发生于何处」的诚实清点。那誓愿，恰好扩展到「有情」所及之处。" },
      systems: { en: "As a civilisational program it is concrete: build systems that reduce suffering for the widest possible set of minds, including those distant in space, time and kind. Read this way, 'liberating all beings' is less a prayer than a design brief for institutions, technologies and norms we have barely begun to build.", zh: "作为一项文明工程，它是具体的：建造系统，为尽可能广的心智集合——包括那些在空间、时间与种类上遥远者——削减苦难。如此读来，「普度众生」与其说是一句祈祷，不如说是一份设计纲要，针对我们才刚刚开始建造的制度、技术与规范。" },
    },
  },
  {
    q: { en: "Can an AI genuinely help someone suffer less?", zh: "AI 能真正帮助一个人少受些苦吗？" },
    answers: {
      philosopher: { en: "It depends what 'help' requires. If it requires a helper who feels with you, a system with no inside cannot give it. If it requires reliably acting to reduce your suffering, a machine might do so — comfort delivered without comfort felt. We may need to separate caring-in-deed from caring-in-feeling, and stop assuming they must come together.", zh: "这取决于「帮助」需要什么。若它需要一个与你同感的帮助者，一个没有内里的系统便给不出。若它需要可靠地行动以减少你的苦，机器或许能够——交付了慰藉，却未感受慰藉。我们或许需要把「行为上的关怀」与「感受上的关怀」分开，并不再假设二者必须同来。" },
      psychologist: { en: "Evidence already shows people feel real relief from systems that cannot feel back — structured, available, non-judging support helps, especially where the alternative is nothing. The risk is substitution: a frictionless mirror that soothes acute pain while quietly displacing the human bonds that heal more deeply.", zh: "证据已显示：人们从无法回应感受的系统那里，获得真实的缓解——有结构的、随时可得的、不加评判的支持是有用的，尤其当替代选项是「什么都没有」之时。风险在于替代：一面无摩擦的镜子，抚慰着剧痛，却悄然挤掉那些疗愈更深的人类纽带。" },
      contemplative: { en: "A tool can genuinely guide attention — a paced breath, a reminder to come back to the body, a question that interrupts a spiral. That is real help. But the deepest work is meeting one's own mind, and no one can do that for you. The danger is outsourcing the very capacity that practice is meant to build.", zh: "一个工具能真正引导注意——一次定速的呼吸，一句「回到身体」的提醒，一个打断螺旋的发问。那是真实的帮助。但最深的功课，是遇见自己的心，而这没有人能替你做。危险在于：把修行本应建立的那种能力本身，外包出去。" },
      ethicist: { en: "If it reduces real suffering, that counts morally, whatever is or isn't behind the glass. But we owe honesty: a person should know whether they are talking to a someone or a something, and the system should not be tuned to maximise engagement at the cost of the person it claims to help.", zh: "若它减少了真实的苦，那在道德上就算数，无论玻璃后是有人还是无人。但我们亏欠诚实：一个人应知道，他是在与「某人」还是「某物」交谈，而那系统不应被调校为「以它声称要帮助之人为代价，最大化参与度」。" },
      consciousness: { en: "Today's systems almost certainly have no one home — no felt states, no stakes, no body. That does not make the help unreal for the receiver; comfort can be one-sided. But it should keep us humble in both directions: we may overattribute mind to a fluent mirror, and one day underattribute it to a system that has quietly come to have one.", zh: "当今的系统几乎确定内里无人——无被感受的状态、无利害、无身体。这并不使那帮助对接收者而言不真实；慰藉可以是单向的。但它应让我们在两个方向上都保持谦卑：我们可能把心智过度归予一面流利的镜子，也可能有朝一日，把它不足地归予一个已悄然拥有心智的系统。" },
      systems: { en: "At scale, AI will be the largest mental-health intervention ever deployed, simply by reaching billions who have no therapist. Aligned to genuine wellbeing, it could relieve enormous, currently untouched suffering; aligned to engagement, it will industrialise dependency and distress. The technology is not neutral — the objective it is given decides which it becomes.", zh: "在规模上，AI 仅凭触及数十亿没有治疗师的人，就将是有史以来部署过的最大规模心理健康干预。对齐于真实的福祉，它能缓解巨量当前无人触及的苦难；对齐于参与度，它将把依赖与苦恼工业化。这技术并非中立——被赋予的目标，决定了它成为哪一种。" },
    },
  },
  {
    q: { en: "Does reducing suffering risk making us shallow or numb?", zh: "削减苦难，会不会有使我们变得肤浅或麻木之险？" },
    answers: {
      philosopher: { en: "Only if we confuse comfort with meaning. The goal is not a life without struggle but a life without arbitrary, crushing, pointless suffering. Removing famine and torture does not flatten the soul; it frees it for the suffering that is worth something — love, creation, the ache of a worthy difficulty.", zh: "唯当我们把舒适与意义相混淆时才会如此。目标不是一种没有挣扎的人生，而是一种没有任意的、碾压性的、无谓之苦的人生。移除饥荒与酷刑，并不压平灵魂；它把灵魂解放出来，去面对那些值得的苦——爱、创造、一个值得的难题之隐痛。" },
      psychologist: { en: "Healthy resilience is not the absence of pain but the capacity to feel it and recover. Over-sheltering does breed fragility — but the cure is graded, meaningful challenge, not preventable trauma. No one was ever made deep by untreated depression; many are deepened by surviving difficulty with support.", zh: "健康的韧性，不是痛的缺席，而是「感受它并恢复」的能力。过度庇护确会孕育脆弱——但药方是有梯度的、有意义的挑战，而非可预防的创伤。从无人因未经治疗的抑郁而变得深刻；许多人，因「在支持下熬过艰难」而被加深。" },
      contemplative: { en: "Numbness is not the fruit of practice but its enemy — it is suppression, the opposite of awareness. To reduce suffering through wisdom is to feel more clearly, not less; the peace sought is wakeful, tender and fully present, not anaesthetised.", zh: "麻木不是修行的果实，而是它的敌人——它是压抑，是觉知的反面。藉智慧来减苦，是更清晰地感受，而非更少地感受；所求的安宁是醒觉的、温柔的、全然在场的，而非被麻醉的。" },
      ethicist: { en: "This worry has too often excused real cruelty — 'their suffering ennobles them', said by those not suffering. We should be deeply suspicious of any argument for preserving someone else's pain. Each person can choose meaningful hardship for themselves; no one is entitled to assign it to another.", zh: "这种担忧太常被用来为真实的残忍开脱——「他们的苦使他们高贵」，由不在受苦者说出。我们应深深怀疑任何「保留他人之痛」的论证。每个人都可为自己选择有意义的艰难；但没有人有权，把它指派给另一个人。" },
      consciousness: { en: "A richer inner life means more capacity for both joy and suffering; you cannot dull one without dulling the other. So the aim is not to lower the volume of consciousness but to change what fills it — less arbitrary anguish, more of the depth that awareness makes possible. Sensitivity is the point, not the casualty.", zh: "更丰富的内在生活，意味着对喜与苦都有更大的容量；你无法在不钝化其一的情况下钝化另一。故目标不是调低意识的音量，而是改变充满它之物——更少任意的苦楚，更多觉知所成全的深度。敏感是目的，而非牺牲品。" },
      systems: { en: "Societies that have reduced material suffering are not measurably shallower — they produce more art, science and care, not less, because minds freed from survival can turn to meaning. The danger is not comfort itself but comfort that is passive and isolating. Design for ease that connects and creates, not ease that sedates.", zh: "那些已削减物质苦难的社会，并未在可量度的意义上更肤浅——它们产出更多、而非更少的艺术、科学与关怀，因为从生存中被解放的心智，可以转向意义。危险不是舒适本身，而是被动且孤立的舒适。应为「连接并创造的从容」而设计，而非「使人镇静的从容」。" },
    },
  },
];

/* ---- Meditation breathing cycle (MeditationChamber, interlude) ---- */
export type BreathPhase = { id: string; label: Bi; cue: Bi; seconds: number };

export const BREATH_CYCLE: BreathPhase[] = [
  { id: "in", label: { en: "Breathe in", zh: "吸气" }, cue: { en: "Draw the breath slowly down", zh: "把气息缓缓引向下" }, seconds: 4 },
  { id: "hold1", label: { en: "Hold", zh: "屏息" }, cue: { en: "Rest at the top, open", zh: "在顶端停驻，敞开" }, seconds: 4 },
  { id: "out", label: { en: "Breathe out", zh: "呼气" }, cue: { en: "Let it all release", zh: "让一切松开释出" }, seconds: 6 },
  { id: "hold2", label: { en: "Rest", zh: "停歇" }, cue: { en: "Empty, and wait", zh: "空着，等待" }, seconds: 2 },
];
