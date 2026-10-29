/**
 * Pure logic and algorithms for Nureoplastic cognitive platform.
 * Fully decoupled for deterministic unit testing.
 */

import type { EssayItem, EssayComment, PillarId } from "../data/essays.ts";
import { PILLAR_METADATA } from "../data/essays.ts";

export interface TokenItem {
  id: string;
  text: string;
  entropy: number; // Rényi entropy score (0.0 to 1.0)
  attentionWeight: number; // normalized attention weight (0.0 to 1.0)
  isSyntacticNoise: boolean;
}

export interface EntropySimulationResult {
  retainedTokens: TokenItem[];
  prunedTokens: TokenItem[];
  vramSavedPercent: number;
  retrievalAccuracyPercent: number;
  semanticInformationRetained: number;
}

/**
 * Calculates token pruning based on Rényi entropy threshold tau.
 * Tokens with entropy below tau are pruned unless they have high semantic attention.
 */
export function calculateEntropyPruning(
  tokens: TokenItem[],
  tau: number,
  semanticBonusWeight: number = 0.3
): EntropySimulationResult {
  const retainedTokens: TokenItem[] = [];
  const prunedTokens: TokenItem[] = [];

  let totalInfo = 0;
  let retainedInfo = 0;

  for (const token of tokens) {
    const effectiveImportance = (1 - token.entropy) + (token.attentionWeight * semanticBonusWeight);
    const tokenInfo = token.isSyntacticNoise ? 0.2 : 1.0;
    totalInfo += tokenInfo;

    // If tau <= 0.15, keep everything; otherwise check effective importance
    if (tau <= 0.15 || effectiveImportance >= tau || token.attentionWeight >= 0.85) {
      retainedTokens.push(token);
      retainedInfo += tokenInfo;
    } else {
      prunedTokens.push(token);
    }
  }

  const prunedRatio = tokens.length > 0 ? prunedTokens.length / tokens.length : 0;
  const vramSavedPercent = Math.min(95, Math.round((1 - Math.pow(1 - prunedRatio, 1.8)) * 100));

  const semanticInformationRetained = totalInfo > 0 ? (retainedInfo / totalInfo) : 1;
  const retrievalAccuracyPercent = Math.max(
    10,
    Math.min(100, Math.round(semanticInformationRetained * 98 - (prunedRatio > 0.8 ? (prunedRatio - 0.8) * 120 : 0)))
  );

  return {
    retainedTokens,
    prunedTokens,
    vramSavedPercent,
    retrievalAccuracyPercent,
    semanticInformationRetained: Math.round(semanticInformationRetained * 100) / 100,
  };
}

export interface EpistemicQuadrant {
  quadrantName: string;
  stance: string;
  coreThinker: string;
  keyWork: string;
  summary: string;
  cognitiveTradeoff: string;
}

/**
 * Maps 2D coordinate space (-1 to +1 on X and Y) to philosophical epistemology
 */
export function getEpistemicDiagnosis(x: number, y: number): EpistemicQuadrant {
  const clampedX = Math.max(-1, Math.min(1, x));
  const clampedY = Math.max(-1, Math.min(1, y));

  if (clampedX < 0 && clampedY >= 0) {
    return {
      quadrantName: "Constructivist Pragmatism",
      stance: "Radical Constructivism",
      coreThinker: "Immanuel Kant & Ludwig Wittgenstein",
      keyWork: "Critique of Pure Reason & Philosophical Investigations",
      summary: "Acknowledges the mind-dependent nature of all perceptual models while asserting intentional world-making agency.",
      cognitiveTradeoff: "Avoids naive dogmatism, but risks cognitive isolation and linguistic solipsism.",
    };
  } else if (clampedX >= 0 && clampedY >= 0) {
    return {
      quadrantName: "Critical Realism & Active Inference",
      stance: "Empirical Realism with Bayesian Plasticity",
      coreThinker: "Karl Friston & Charles Sanders Peirce",
      keyWork: "The Free Energy Principle & Pragmaticism",
      summary: "Posits an external objective ground that can be continuously approximated through active experimentation and perceptual error minimization.",
      cognitiveTradeoff: "High pragmatic efficacy, but requires perpetual cognitive energy to revise stale internal priors.",
    };
  } else if (clampedX < 0 && clampedY < 0) {
    return {
      quadrantName: "Skeptical Aporia",
      stance: "Pyrrhonian Skepticism & Solipsistic Void",
      coreThinker: "René Descartes (Meditations I) & Sextus Empiricus",
      keyWork: "Outlines of Pyrrhonism",
      summary: "Suspension of all ontological judgment. Trapped in doubts regarding whether any reality exists outside subjective phantom tokens.",
      cognitiveTradeoff: "Immunity to false beliefs, but total paralysis in moral and systemic decision-making.",
    };
  } else {
    return {
      quadrantName: "Fatalistic Determinism",
      stance: "Naive Physicalist Fatalism",
      coreThinker: "Baruch Spinoza & B.F. Skinner",
      keyWork: "Ethics & Beyond Freedom and Dignity",
      summary: "Belief in an uncompromising mechanistic universe where human consciousness is a passive spectator without causal leverage.",
      cognitiveTradeoff: "Comforting surrender of personal accountability, but loss of generative will and adaptive agency.",
    };
  }
}

/**
 * Attractor basin potential energy function V(x)
 */
export function calculateAttractorPotential(x: number): { potential: number; gradient: number } {
  const potential = 0.25 * Math.pow(x, 4) - 0.2 * Math.pow(x, 3) - 1.2 * Math.pow(x, 2) + 0.3 * x + 2.0;
  const gradient = Math.pow(x, 3) - 0.6 * Math.pow(x, 2) - 2.4 * x + 0.3;
  return { potential, gradient };
}

/**
 * Simulates one physical step of stochastic attractor escape
 */
export function stepAttractorPhysics(
  x: number,
  velocity: number,
  impulseForce: number,
  damping: number = 0.94,
  dt: number = 0.1
): { nextX: number; nextVelocity: number; escapedBarrier: boolean } {
  const { gradient } = calculateAttractorPotential(x);
  const force = -gradient + impulseForce;
  const nextVelocity = (velocity + force * dt) * damping;
  const nextX = Math.max(-2.5, Math.min(2.5, x + nextVelocity * dt));
  const escapedBarrier = nextX > 0.5;

  return {
    nextX,
    nextVelocity,
    escapedBarrier,
  };
}

/**
 * Generates formatted Markdown study notes from saved highlights
 */
export function exportVaultToMarkdown(
  vaultItems: Array<{
    id: string;
    text: string;
    pillar: string;
    essayTitle: string;
    userNote?: string;
    createdAt: string;
  }>
): string {
  const dateStr = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  let md = `# Nureoplastic Cognitive Vault — Study Notes\n`;
  md += `*Exported on ${dateStr} | Synthesized Digital Garden*\n\n`;
  md += `---\n\n`;

  const grouped = vaultItems.reduce<Record<string, typeof vaultItems>>((acc, item) => {
    acc[item.pillar] = acc[item.pillar] || [];
    acc[item.pillar].push(item);
    return acc;
  }, {});

  for (const [pillar, items] of Object.entries(grouped)) {
    md += `## ◈ Pillar: ${pillar.toUpperCase()}\n\n`;
    for (const item of items) {
      md += `> "${item.text}"\n\n`;
      md += `- **Source Essay**: *${item.essayTitle}*\n`;
      if (item.userNote) {
        md += `- **Socratic Annotation**: ${item.userNote}\n`;
      }
      md += `- **Captured**: ${new Date(item.createdAt).toLocaleDateString()}\n\n`;
    }
  }

  md += `---\n*Generated by Nureoplastic Knowledge Engine*\n`;
  return md;
}

/**
 * Calculates user cognitive streak and rank progression
 */
export function calculateCognitiveRank(totalXP: number): {
  rankName: string;
  level: number;
  progressToNext: number;
  xpInCurrentLevel: number;
  xpNeededForNext: number;
} {
  const level = Math.floor(totalXP / 100) + 1;
  const xpInCurrentLevel = totalXP % 100;
  const xpNeededForNext = 100;
  const progressToNext = xpInCurrentLevel / xpNeededForNext;

  const ranks = [
    "Epistemic Novice",
    "Synaptic Cartographer",
    "Dialectical Craftsman",
    "Cognitive Plasticist",
    "Tensor Epistemologist",
    "Neuro-Philosophic Master",
  ];

  const rankName = ranks[Math.min(ranks.length - 1, level - 1)];

  return {
    rankName,
    level,
    progressToNext,
    xpInCurrentLevel,
    xpNeededForNext,
  };
}

/**
 * Validates and constructs a custom user blog post across any of the 5 pillars
 */
export interface CustomBlogDraft {
  id?: string;
  title: string;
  subtitle: string;
  author: string;
  pillar: PillarId;
  tags: string[];
  sandboxType: "entropy" | "epistemic" | "attractor";
  tldrBullets: string[];
  sections: {
    heading: string;
    body: string;
    pullQuote?: string;
  }[];
  formalEquationLabel?: string;
  formalEquation?: string;
  formalExplanation?: string;
  quizQuestion?: string;
  quizScenario?: string;
  quizCorrectAnswer?: string;
  quizWrongAnswer1?: string;
  quizWrongAnswer2?: string;
}

export function buildCustomEssay(draft: CustomBlogDraft): { valid: boolean; error?: string; essay?: EssayItem } {
  const cleanTitle = draft.title.trim();
  const cleanSubtitle = draft.subtitle.trim();

  if (!cleanTitle || cleanTitle.length < 4) {
    return { valid: false, error: "Title must be at least 4 characters long." };
  }
  if (!cleanSubtitle || cleanSubtitle.length < 8) {
    return { valid: false, error: "Subtitle thesis must be at least 8 characters long." };
  }
  if (!draft.sections || draft.sections.length === 0 || !draft.sections[0].body.trim()) {
    return { valid: false, error: "At least one essay section with body prose is required." };
  }

  const meta = PILLAR_METADATA[draft.pillar] || PILLAR_METADATA.philosophy;
  const totalWords = draft.sections.reduce((acc, s) => acc + s.body.split(/\s+/).length, 0);
  const readingTimeMinutes = Math.max(3, Math.ceil(totalWords / 130));
  const id = draft.id || `custom-${Date.now()}`;

  const bullets =
    draft.tldrBullets.filter((b) => b.trim().length > 0).length > 0
      ? draft.tldrBullets.filter((b) => b.trim().length > 0)
      : [
          cleanSubtitle,
          `Explores ${meta.label} through dialectical synthesis and first-principles modeling.`,
          "Challenges passive assumptions by pairing conceptual rigor with interactive simulations.",
        ];

  const essay: EssayItem = {
    id,
    slug: cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    title: cleanTitle,
    subtitle: cleanSubtitle,
    author: draft.author.trim() || "Independent Scholar",
    isCustom: true,
    pillar: draft.pillar,
    pillarLabel: meta.label,
    readingTimeMinutes,
    xpReward: 50,
    publishedDate: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    tags: draft.tags.length > 0 ? draft.tags : [meta.label, "Synthesis"],
    prerequisites: ["First-Principles Inquiry"],
    sandboxType: draft.sandboxType,
    socraticAnnotations: {},
    content: {
      level1: {
        bullets,
        mentalModelTable: [
          {
            dimension: "Core Paradigm",
            traditionalView: "Linear, single-discipline analysis.",
            nureoplasticSynthesis: `Cross-pillar ${meta.label} synthesis.`,
          },
          {
            dimension: "Epistemic Method",
            traditionalView: "Passive consumption of static text.",
            nureoplasticSynthesis: "Active verification via interactive sandboxes and discourse.",
          },
        ],
      },
      level2: {
        sections: draft.sections.map((s, idx) => ({
          heading: s.heading.trim() || `0${idx + 1}. Dialectical Inquiry`,
          paragraphs: s.body
            .split(/\n\n+/)
            .map((p) => p.trim())
            .filter(Boolean),
          pullQuote: s.pullQuote?.trim() || undefined,
        })),
      },
      level3: {
        formalProofTitle: `Formal Axiomatization — ${cleanTitle}`,
        latexFormulas: [
          {
            label: draft.formalEquationLabel?.trim() || "System State Evolution",
            formula: draft.formalEquation?.trim() || "\\Phi(t+1) = \\mathcal{F}\\left(\\Phi(t), \\nabla \\mathcal{H}_{\\text{epistemic}}\\right)",
            explanation:
              draft.formalExplanation?.trim() ||
              "Formalizes the transition of the conceptual state under epistemic gradient updates.",
          },
        ],
        architecturalProof: [
          `Let the domain manifold M represent the state space of ${meta.label}.`,
          "Every observation induces a Bayesian update reducing structural uncertainty.",
          "Convergence requires balancing empirical grounding with conceptual plasticity.",
        ],
      },
    },
    masteryQuiz: {
      question:
        draft.quizQuestion?.trim() ||
        `What is the primary synthesis proposed in "${cleanTitle}"?`,
      scenario:
        draft.quizScenario?.trim() ||
        `Applying the core thesis of this ${meta.label} monograph to a real-world complex system.`,
      options: [
        {
          id: "opt-1",
          text: draft.quizCorrectAnswer?.trim() || cleanSubtitle,
          isCorrect: true,
          explanation: "Correct! This captures the central dialectical thesis of the essay.",
        },
        {
          id: "opt-2",
          text:
            draft.quizWrongAnswer1?.trim() ||
            "Relying exclusively on isolated single-variable linear extrapolations without feedback.",
          isCorrect: false,
          explanation: "Incorrect. The essay explicitly critiques static reductionism.",
        },
        {
          id: "opt-3",
          text:
            draft.quizWrongAnswer2?.trim() ||
            "Abandoning empirical inquiry altogether in favor of unexamined dogma.",
          isCorrect: false,
          explanation: "Incorrect. Rigorous epistemic friction is essential to the thesis.",
        },
      ],
      hint: "Review the subtitle and executive synthesis bullets in Level 1.",
    },
  };

  return { valid: true, essay };
}

/**
 * Filters and sorts essay comments by stance and sort order
 */
export function filterAndSortComments(
  comments: EssayComment[],
  essayId: string,
  stanceFilter: "all" | "synthesis" | "antithesis" | "empirical" | "inquiry" = "all",
  sortBy: "top" | "newest" = "top"
): EssayComment[] {
  const matching = comments.filter(
    (c) => c.essayId === essayId && (stanceFilter === "all" || c.stance === stanceFilter)
  );

  return [...matching].sort((a, b) => {
    if (sortBy === "top") {
      return b.upvotes - a.upvotes;
    }
    return b.id.localeCompare(a.id);
  });
}
