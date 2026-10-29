import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateEntropyPruning,
  getEpistemicDiagnosis,
  calculateAttractorPotential,
  stepAttractorPhysics,
  calculateCognitiveRank,
  exportVaultToMarkdown,
  buildCustomEssay,
  filterAndSortComments,
  TokenItem,
} from "./rules.ts";
import { INITIAL_COMMENTS } from "../data/essays.ts";
import { calculateCompoundGrowth } from "./finance.ts";

test("compounding reproduces the article's worked example without rounding each year", () => {
  const result = calculateCompoundGrowth(1000, 5, 10);
  assert.ok(Math.abs(result.balance - 1628.894626777442) < 1e-8);
  assert.equal(result.simpleBalance, 1500);
  assert.ok(Math.abs(result.compoundBonus - 128.894626777442) < 1e-8);
  assert.equal(result.points[1].compound, 1050);
  assert.equal(result.points[2].compound, 1102.5);
});

test("zero interest stays flat, and the first year has no compounding bonus", () => {
  const flat = calculateCompoundGrowth(2400, 0, 30);
  assert.equal(flat.balance, 2400);
  assert.equal(flat.compoundBonus, 0);
  assert.ok(flat.points.every((point) => point.compound === 2400 && point.simple === 2400));
  assert.equal(calculateCompoundGrowth(1000, 5, 1).compoundBonus, 0);
});

test("the publishing builder creates Finance essays with the compounding experiment", () => {
  const result = buildCustomEssay({
    title: "Time and the Money Goal",
    subtitle: "A beginner-friendly explanation of the assumptions behind compound growth.",
    author: "Finance Editor",
    pillar: "finance",
    tags: ["Money basics"],
    sandboxType: "compound",
    tldrBullets: ["A constant-rate example illustrates arithmetic, not a forecast."],
    sections: [{ heading: "Start with the assumptions", body: "Compare simple and compound interest before drawing a conclusion." }],
  });
  assert.equal(result.valid, true);
  assert.equal(result.essay?.pillarLabel, "Finance");
  assert.equal(result.essay?.sandboxType, "compound");
});

test("calculateEntropyPruning prunes high entropy syntactic noise at elevated tau", () => {
  const sampleTokens: TokenItem[] = [
    { id: "1", text: "Attention", entropy: 0.1, attentionWeight: 0.95, isSyntacticNoise: false },
    { id: "2", text: "is", entropy: 0.85, attentionWeight: 0.1, isSyntacticNoise: true },
    { id: "3", text: "all", entropy: 0.8, attentionWeight: 0.15, isSyntacticNoise: true },
    { id: "4", text: "you", entropy: 0.82, attentionWeight: 0.12, isSyntacticNoise: true },
    { id: "5", text: "need", entropy: 0.2, attentionWeight: 0.9, isSyntacticNoise: false },
  ];

  const lowTauResult = calculateEntropyPruning(sampleTokens, 0.1);
  assert.equal(lowTauResult.retainedTokens.length, 5, "Low tau retains all tokens");

  const highTauResult = calculateEntropyPruning(sampleTokens, 0.8);
  assert.ok(highTauResult.retainedTokens.length < 5, "High tau prunes noise tokens");
  assert.ok(highTauResult.vramSavedPercent > 0, "VRAM savings are calculated");
  assert.ok(highTauResult.retrievalAccuracyPercent >= 50, "Retrieval accuracy maintained for core tokens");
  const retainedTexts = highTauResult.retainedTokens.map((t) => t.text);
  assert.ok(retainedTexts.includes("Attention"), "Key token Attention is retained");
});

test("getEpistemicDiagnosis correctly maps 4 quadrants", () => {
  const upperLeft = getEpistemicDiagnosis(-0.8, 0.5);
  assert.equal(upperLeft.quadrantName, "Constructivist Pragmatism");
  assert.ok(upperLeft.coreThinker.includes("Kant"));

  const upperRight = getEpistemicDiagnosis(0.6, 0.8);
  assert.equal(upperRight.quadrantName, "Critical Realism & Active Inference");
  assert.ok(upperRight.coreThinker.includes("Karl Friston"));

  const lowerLeft = getEpistemicDiagnosis(-0.5, -0.7);
  assert.equal(lowerLeft.quadrantName, "Skeptical Aporia");
  assert.ok(lowerLeft.coreThinker.includes("Descartes"));

  const lowerRight = getEpistemicDiagnosis(0.7, -0.4);
  assert.equal(lowerRight.quadrantName, "Fatalistic Determinism");
  assert.ok(lowerRight.coreThinker.includes("Spinoza"));
});

test("calculateAttractorPotential evaluates double well landscape", () => {
  const barrier = calculateAttractorPotential(0);
  assert.ok(barrier.potential > 0, "Barrier potential is positive");

  const step = stepAttractorPhysics(-1.5, 0, 15.0);
  assert.ok(step.nextVelocity > 0, "Impulse produces positive velocity towards barrier");
});

test("calculateCognitiveRank calculates levels and titles properly", () => {
  const novice = calculateCognitiveRank(40);
  assert.equal(novice.level, 1);
  assert.equal(novice.rankName, "Epistemic Novice");
  assert.equal(novice.progressToNext, 0.4);

  const cartographer = calculateCognitiveRank(150);
  assert.equal(cartographer.level, 2);
  assert.equal(cartographer.rankName, "Synaptic Cartographer");
  assert.equal(cartographer.xpInCurrentLevel, 50);
});

test("exportVaultToMarkdown formats study notes with pillars", () => {
  const items = [
    {
      id: "v1",
      text: "Attention entropy collapses into deterministic blindness.",
      pillar: "ai",
      essayTitle: "Entropy-Guided Context Pruning",
      userNote: "Connect with thermodynamic dissipation",
      createdAt: "2026-10-28T22:00:00Z",
    },
  ];
  const md = exportVaultToMarkdown(items);
  assert.ok(md.includes("Pillar: AI"));
  assert.ok(md.includes("Attention entropy collapses"));
  assert.ok(md.includes("Connect with thermodynamic dissipation"));
});

test("buildCustomEssay validates required inputs and constructs 3-level essay", () => {
  const invalid = buildCustomEssay({
    title: "Hi",
    subtitle: "Too short",
    author: "Tester",
    pillar: "psychoanalysis",
    tags: [],
    sandboxType: "epistemic",
    tldrBullets: [],
    sections: [],
  });
  assert.equal(invalid.valid, false);

  const valid = buildCustomEssay({
    title: "Jungian Shadow in Neural Weights",
    subtitle: "Exploring collective unconscious archetypes in large-scale foundation models.",
    author: "Dr. Carl",
    pillar: "psychoanalysis",
    tags: ["Jung", "Archetypes"],
    sandboxType: "epistemic",
    tldrBullets: ["Foundation models encode collective cultural archetypes."],
    sections: [
      {
        heading: "The Shadow Projection",
        body: "When humanity trains a model on all digital text, the shadow is inevitably digitized.\n\nSecond paragraph of analysis.",
        pullQuote: "Every repressed signifier returns in the latent manifold.",
      },
    ],
  });

  assert.equal(valid.valid, true);
  assert.ok(valid.essay);
  assert.equal(valid.essay.pillar, "psychoanalysis");
  assert.equal(valid.essay.pillarLabel, "Psychoanalysis");
  assert.equal(valid.essay.content.level2.sections[0].paragraphs.length, 2);
});

test("filterAndSortComments filters by stance and sorts by upvotes", () => {
  const allForEntropy = filterAndSortComments(INITIAL_COMMENTS, "entropy-pruning", "all", "top");
  assert.equal(allForEntropy.length, 2);
  assert.ok(allForEntropy[0].upvotes >= allForEntropy[1].upvotes);

  const antithesisOnly = filterAndSortComments(INITIAL_COMMENTS, "entropy-pruning", "antithesis", "top");
  assert.equal(antithesisOnly.length, 1);
  assert.equal(antithesisOnly[0].author, "Julian Thorne");
});
