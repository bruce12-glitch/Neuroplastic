import type { EssayItem } from "./essays.ts";

/** Original author text, retaining its headings, claims, and emphasis. Notes are separate editorial context. */
export const MENTAL_REHEARSAL_ESSAY: EssayItem = {
  id: "mental-rehearsal",
  slug: "i-do-in-my-brain-as-cool-as-i-do-in-real-life",
  title: "I do in my brain as cool as I do in real life!",
  subtitle: "Something can be rehearsed by the brain before you do it!",
  author: "Neuroplastic",
  format: "original",
  pillar: "psychology",
  pillarLabel: "Psychology",
  readingTimeMinutes: 2,
  xpReward: 0,
  publishedDate: "Nov 4, 2026",
  tags: ["Albert Bandura", "Mental rehearsal", "Mind-muscle connection", "Self-efficacy", "Motor imagery"],
  prerequisites: [],
  sandboxType: "epistemic",
  socraticAnnotations: {},
  content: {
    level1: { bullets: [], mentalModelTable: [] },
    level2: {
      sections: [
        {
          heading: "1. Something the Brain Rehearses Before You Do It",
          paragraphs: [],
          markdown: [
            "In Social Foundations of Thought and Action, Albert Bandura explains the psychoneural mechanism (mind-muscle connection). It states that the muscles and mind are operated by the central nervous system, where in order to perform an action in reality, you are still able to use mental rehearsal so that the brain can send neural signals to the muscles to perform that particular action. “The stronger your signal and imagination, the stronger you do it in reality” — a cheat code.",
            "Studies recording muscle electrical activity (electromyography) demonstrate that imagining an action causes actual micro-innervation in the very muscles required to execute that action. For instance, consider that imagining lifting heavy weights produces significantly larger muscle action currents than imagining lifting light weights.",
          ].join("\n\n"),
          references: [1, 2],
          referenceNote: "Bandura’s psychoneural account of thought and action is treated in his 1986 book. The electromyography finding summarizes Bakker, Boschker, and Chung (1996), who recorded biceps EMG while participants imagined lifting 4.5 kg and 9 kg weights and found larger muscle action currents for the heavier imagined weight. The quoted line about signal strength is the author’s own phrasing, not a quotation from Bandura’s book.",
        },
        {
          heading: "2. Why Cognitive Rehearsal Works",
          paragraphs: [],
          markdown: [
            "In order to perform a complex action, we need an internal standard or blueprint. Mental rehearsal helps us build that effectively. When people repeatedly visualize themselves performing successfully, their belief in their own capability (self-efficacy) rises. This removes paralyzing self-doubt and mobilizes the effort needed to execute the real task.",
            "Visualizing an accurate performance improves future execution, whereas mentally rehearsing flawed or incorrect sequences actively impairs performance.",
          ].join("\n\n"),
          references: [1, 3, 4],
          referenceNote: "The internal-standard (blueprint) account and the self-efficacy wording follow Bandura’s social cognitive theory; Feltz and Landers’s 1983 meta-analysis reviews the mental-practice literature. The claim that rehearsing incorrect executions impairs performance summarizes Woolfolk, Parrish, and Murphy (1985): golf putters who imagined the ball narrowly missing the cup deteriorated, while positive imagery produced the most improvement.",
        },
      ],
    },
    level3: { formalProofTitle: "", latexFormulas: [], architecturalProof: [] },
  },
  masteryQuiz: { question: "", scenario: "", options: [], hint: "" },
  editorialNote: "This article is a popular introduction to mental rehearsal and the mind-muscle connection as framed by Albert Bandura’s social cognitive theory. The body text is the author’s own; the section headings and reference notes are editorial additions. The quoted “cheat code” line is the author’s phrasing rather than a quotation from Bandura’s book.",
  sources: [
    {
      title: "Social Foundations of Thought and Action: A Social Cognitive Theory (1986)",
      publisher: "Albert Bandura · Prentice-Hall · Internet Archive catalog record",
      url: "https://archive.org/details/socialfoundation0000band",
      note: "Section 1: the book the author cites for the psychoneural mechanism — mind and muscles coordinated through the central nervous system, and thought as a regulator of action within social cognitive theory.",
    },
    {
      title: "Changes in Muscular Activity While Imagining Weight Lifting Using Stimulus or Response Propositions (1996)",
      publisher: "F. C. Bakker, M. S. J. Boschker & T. Chung · Journal of Sport & Exercise Psychology, 18(3), 313–323",
      url: "https://psycnet.apa.org/record/1996-06149-006",
      note: "Section 1: biceps EMG recorded while participants imagined lifting 4.5 kg and 9 kg weights; EMG activity was significantly larger for the heavier imagined load — the micro-innervation behind the mind-muscle connection.",
    },
    {
      title: "The Effects of Mental Practice on Motor Skill Learning and Performance: A Meta-analysis (1983)",
      publisher: "D. L. Feltz & D. M. Landers · Journal of Sport Psychology, 5(1), 25–57",
      url: "https://psycnet.apa.org/record/1984-00325-001",
      note: "Section 2: the meta-analytic review concluding that mental practice improves motor performance, the evidence base behind cognitive rehearsal.",
    },
    {
      title: "The Effects of Positive and Negative Imagery on Motor Skill Performance (1985)",
      publisher: "R. L. Woolfolk, M. W. Parrish & S. M. Murphy · Cognitive Therapy and Research, 9(3), 335–341",
      url: "https://doi.org/10.1007/BF01183852",
      note: "Section 2: golf-putting imagery experiment in which positive imagery improved accuracy most, a control group improved less, and negative imagery — rehearsing the miss — actively impaired performance.",
    },
  ],
};
