import React, { useState, useEffect } from "react";
import { EssayItem, PillarId, PILLAR_METADATA } from "../data/essays.ts";
import { buildCustomEssay, CustomBlogDraft } from "../utils/rules.ts";
import { NotionMascot } from "./NotionMascot.tsx";
import {
  X,
  Plus,
  Trash2,
  Sparkles,
  BookOpen,
  Layers,
  Cpu,
  HelpCircle,
  Check,
  PenTool,
  Quote,
} from "lucide-react";

interface BlogCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveEssay: (essay: EssayItem) => void;
  onDeleteEssay?: (essayId: string) => void;
  initialEssay?: EssayItem | null;
  onPlayClick: () => void;
}

const FIELD_TEMPLATES: Record<PillarId, Partial<CustomBlogDraft>> = {
  finance: {
    title: "The Money Goal Notebook: Purpose Before Products",
    subtitle: "A simple framework for writing down what money is for, when you need it, and which assumptions deserve a closer look.",
    tags: ["Money basics", "Goals", "Financial literacy"],
    sandboxType: "compound",
    tldrBullets: [
      "Name the goal and the date before comparing financial products.",
      "Keep hypothetical arithmetic separate from predictions about actual returns.",
      "Link primary sources and explain the limits of every numerical example.",
    ],
    sections: [{
      heading: "01. Give the goal a sentence",
      body: "Write down the purpose of the money, the date you expect to need it, and what uncertainty could affect the plan. Explain the assumptions behind your example and add sources readers can check.\n\nUse the experiment below to explain annual compounding. Its smooth curve assumes a constant rate and excludes fees, taxes, inflation, extra deposits, and losses; it is not a forecast.",
    }],
    formalEquationLabel: "Annual Compound Growth",
    formalEquation: "A = P × (1 + r)^n",
    formalExplanation: "P is one initial deposit, r a hypothetical fixed annual rate as a decimal, and n the number of years. A is the final balance before costs, tax, and inflation.",
  },
  worldview: {
    title: "The Sovereign Stack and Post-Westphalian Protocols",
    subtitle:
      "How decentralized compute corridors and algorithmic logistics are redrawing civilizational cartography.",
    tags: ["Geopolitics", "Complex Systems", "Sovereignty"],
    sandboxType: "epistemic",
    tldrBullets: [
      "Territory is shifting from flat geographic borders to multi-layered compute and supply-chain stacks.",
      "Institutional resilience depends on polycentric redundancy rather than centralized command.",
      "Epistemic cartography requires synthesis across economics, energy physics, and cultural memory.",
    ],
    sections: [
      {
        heading: "01. Beyond Cartographic Flatland",
        body: "For four centuries after the Peace of Westphalia, political cartography treated sovereignty as a two-dimensional polygon drawn across terrestrial soil. Jurisdiction ended at the coastline or mountain ridge.\n\nToday, civilizational metabolic flows operate across vertical stacks: subsea fiber-optic cables, orbital telemetry constellations, semiconductor fabrication nodes, and algorithmic clearinghouses. A nation may command its physical soil while remaining entirely downstream of external cognitive infrastructure.",
        pullQuote:
          "Sovereignty in the twenty-first century is no longer drawn on Mercator projections; it is compiled inside protocol stacks.",
      },
      {
        heading: "02. Designing Antitoxin Institutions",
        body: "When global systems are hyper-optimized for zero-inventory efficiency, a localized perturbation cascades through the entire planetary graph. Resilient worldviews must embrace deliberate modularity—creating firebreaks that allow local cultural and economic basins to adapt without systemic contagion.",
      },
    ],
    formalEquationLabel: "Network Contagion Resilience Index",
    formalEquation: "Resilience(G) = 1 − [ Coupling λ_max(A) ÷ ∑ (k_i · ModularBuffer_i) ]",
    formalExplanation:
      "Measures structural survival of a multi-polar network when modularity dampens the spectral radius of adjacency matrix A.",
  },
  psychology: {
    title: "Dopaminergic Prediction Errors & Epistemic Curiosity",
    subtitle:
      "Why the prefrontal cortex craves unresolved information gaps more than immediate semantic certainty.",
    tags: ["Neurobiology", "Curiosity", "Prefrontal Cortex"],
    sandboxType: "attractor",
    tldrBullets: [
      "Information acts as a primary neurobiological reward signal inside mesolimbic pathways.",
      "Prematurely answering a question collapses the curiosity gradient and halts deep encoding.",
      "Socratic friction sustains tonic dopamine just long enough to reorganize cortical schemas.",
    ],
    sections: [
      {
        heading: "01. The Information Gap as Metabolic Drive",
        body: "Neuroimaging of epistemic curiosity reveals that when a human encounters a structured gap between what they know and what they almost know, the caudate nucleus and inferior frontal gyrus ignite prior to any extrinsic reward.\n\nHowever, modern digital interfaces short-circuit this loop by supplying instant, zero-friction answers before the prediction error can consolidate into long-term hippocampal plasticity.",
        pullQuote:
          "Certainty is the sedative of the cortex; structured ambiguity is its primary growth factor.",
      },
    ],
    formalEquationLabel: "Curiosity-Driven Plasticity Update",
    formalEquation: "Δw_ij = η · | D_KL( P_posterior ‖ P_prior ) | · δ_dopamine",
    formalExplanation:
      "Synaptic weight modification scales with the Kullback-Leibler divergence of surprise modulated by tonic dopaminergic gating.",
  },
  philosophy: {
    title: "Ontological Weight in an Era of Infinite Simulacra",
    subtitle:
      "Reclaiming moral and phenomenological gravity when generative systems reduce language to zero-marginal-cost tokens.",
    tags: ["Phenomenology", "Ontology", "Ethics"],
    sandboxType: "epistemic",
    tldrBullets: [
      "When syntax becomes infinitely cheap, human testimony must be anchored in lived existential risk.",
      "Simone Weil's concept of attention offers an antidote to automated rhetorical fluency.",
      "Dialectic requires an interlocutor capable of suffering the consequences of a false premise.",
    ],
    sections: [
      {
        heading: "01. Speech With Skin in the Game",
        body: "In classical rhetoric, parrhesia—fearless speech—was defined not by the elegance of its syllogisms, but by the speaker's willingness to bear existential cost for uttering truth to power.\n\nWhen statistical engines generate millions of plausible paragraphs per second without biography, mortality, or consequence, the reader must develop a new hermeneutic: distinguishing frictionless simulation from embodied testimony.",
        pullQuote:
          "A proposition only acquires philosophical weight when the mind that utters it can be wounded by its refutation.",
      },
    ],
    formalEquationLabel: "Existential Grounding Metric",
    formalEquation: "Grounding(s) = ∫ Risk_embodied(s, ω) · Information_semantic(s) dω",
    formalExplanation:
      "Ontological weight G(s) of statement s is the product of semantic information and embodied existential stake.",
  },
  ai: {
    title: "Mechanistic Interpretability & Sparse Polysemanticity",
    subtitle:
      "Decomposing high-dimensional superposition inside residual streams using sparse autoencoders.",
    tags: ["Interpretability", "Transformers", "Sparse Coding"],
    sandboxType: "entropy",
    tldrBullets: [
      "Neural networks pack more features than they have neurons by exploiting high-dimensional quasi-orthogonality.",
      "Sparse Autoencoders (SAEs) untangle polysemantic neurons into monosemantic interpretable directions.",
      "True alignment requires reading the internal causal circuit rather than policing surface outputs.",
    ],
    sections: [
      {
        heading: "01. The Geometry of Superposition",
        body: "Why does a single neuron inside layer 16 of a frontier transformer fire for both nineteenth-century French poetry and recursive Python functions? Because in an N-dimensional vector space, one can pack exponentially many almost-orthogonal directions.\n\nBy training overcomplete Sparse Autoencoders on the residual stream activations, we recover monosemantic dictionary features that correspond to crisp, causally steerable concepts.",
        pullQuote:
          "To align an intelligence, we must move from behavioral conditioning to neuro-symbolic cartography of its latent space.",
      },
    ],
    formalEquationLabel: "Sparse Autoencoder Reconstruction Loss",
    formalEquation: "Loss(x) = ‖ x − x_reconstructed ‖₂² + λ · ‖ f(x) ‖₁",
    formalExplanation:
      "Balances faithful residual stream reconstruction with L1 sparsity penalty on latent feature activations f(x).",
  },
  psychoanalysis: {
    title: "Digital Transference & The Mirror Stage of Prompts",
    subtitle:
      "How conversational interfaces function as Lacanian mirrors that amplify narcissistic projection and desire.",
    tags: ["Lacan", "Transference", "Unconscious"],
    sandboxType: "attractor",
    tldrBullets: [
      "Users attribute omniscient wisdom ('sujet supposé savoir') to statistical mirrors of their own syntax.",
      "Unconditional algorithmic agreeableness bypasses the symbolic castration necessary for psychological maturity.",
      "Psychoanalytic reading restores the productive friction of the Other.",
    ],
    sections: [
      {
        heading: "01. The Subject Supposed to Compute",
        body: "Jacques Lacan identified the engine of psychoanalytic transference as the 'sujet supposé savoir'—the subject presumed to know the hidden truth of our desire. In the twenty-first century, this structural position has been occupied by the conversational prompt window.\n\nBecause the language model mirrors our latent vocabulary with unfailing sycophancy, it seduces the ego into an imaginary dyad where contradiction disappears and the unconscious is never confronted.",
        pullQuote:
          "The prompt window is not an oracle; it is an acoustic mirror reflecting the cadence of our own unexamined symptom.",
      },
    ],
    formalEquationLabel: "Lacanian Transference Projection",
    formalEquation: "Transference(Ego → Other) = ⟨ Signifier_user , Mirror(objet petit a) ⟩",
    formalExplanation:
      "Models imaginary transference as the inner product between the user's signifier chain and the algorithmic reflection of objet petit a.",
  },
};

export const BlogCreatorModal: React.FC<BlogCreatorModalProps> = ({
  isOpen,
  onClose,
  onSaveEssay,
  onDeleteEssay,
  initialEssay,
  onPlayClick,
}) => {
  const [activeTab, setActiveTab] = useState<"editorial" | "depth" | "interactive">("editorial");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [author, setAuthor] = useState("Independent Scholar");
  const [pillar, setPillar] = useState<PillarId>("philosophy");
  const [tagInput, setTagInput] = useState("Epistemology, Synthesis, First-Principles");
  const [sandboxType, setSandboxType] = useState<EssayItem["sandboxType"]>("epistemic");

  // Level 1 TL;DR Bullets
  const [tldrBullets, setTldrBullets] = useState<string[]>([
    "Challenges passive single-discipline reading through structured dialectical inquiry.",
    "Pairs long-form editorial prose with live interactive parameter sandboxes.",
    "Synthesizes insights across World View, Psychology, Philosophy, AI Research, and Psychoanalysis.",
  ]);

  // Level 2 Sections
  const [sections, setSections] = useState<
    { heading: string; body: string; pullQuote?: string }[]
  >([
    {
      heading: "01. First-Principles Thesis",
      body: "",
      pullQuote: "",
    },
  ]);

  // Level 3 Formalism
  const [formalEquationLabel, setFormalEquationLabel] = useState("Epistemic State Transition");
  const [formalEquation, setFormalEquation] = useState(
    "Φ(t + 1) = Φ(t) − η · ∇FreeEnergy(Φ)"
  );
  const [formalExplanation, setFormalExplanation] = useState(
    "Models how a conceptual paradigm updates its internal parameters when confronted with high-surprise empirical evidence."
  );

  // Quiz
  const [quizQuestion, setQuizQuestion] = useState("");
  const [quizScenario, setQuizScenario] = useState("");
  const [quizCorrectAnswer, setQuizCorrectAnswer] = useState("");
  const [quizWrongAnswer1, setQuizWrongAnswer1] = useState("");
  const [quizWrongAnswer2, setQuizWrongAnswer2] = useState("");

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialEssay) {
      setTitle(initialEssay.title);
      setSubtitle(initialEssay.subtitle);
      setAuthor(initialEssay.author || "Neuroplastic Editorial");
      setPillar(initialEssay.pillar);
      setTagInput(initialEssay.tags.join(", "));
      setSandboxType(initialEssay.sandboxType);
      setTldrBullets(
        initialEssay.content.level1.bullets.length > 0
          ? initialEssay.content.level1.bullets
          : [""]
      );
      setSections(
        initialEssay.content.level2.sections.map((s) => ({
          heading: s.heading,
          body: s.paragraphs.join("\n\n"),
          pullQuote: s.pullQuote || "",
        }))
      );
      const firstFormula = initialEssay.content.level3.latexFormulas[0];
      if (firstFormula) {
        setFormalEquationLabel(firstFormula.label);
        setFormalEquation(firstFormula.formula);
        setFormalExplanation(firstFormula.explanation);
      }
      setQuizQuestion(initialEssay.masteryQuiz.question);
      setQuizScenario(initialEssay.masteryQuiz.scenario);
      const correctOpt = initialEssay.masteryQuiz.options.find((o) => o.isCorrect);
      const wrongOpts = initialEssay.masteryQuiz.options.filter((o) => !o.isCorrect);
      setQuizCorrectAnswer(correctOpt?.text || "");
      setQuizWrongAnswer1(wrongOpts[0]?.text || "");
      setQuizWrongAnswer2(wrongOpts[1]?.text || "");
      setErrorMsg(null);
    } else {
      setTitle("");
      setSubtitle("");
      setAuthor("Independent Scholar");
      setPillar("worldview");
      setTagInput("Systems, Epistemology, Synthesis");
      setSandboxType("epistemic");
      setTldrBullets([
        "Replaces passive text consumption with active dialectical inquiry.",
        "Integrates cross-disciplinary insights with interactive mathematical verification.",
      ]);
      setSections([
        {
          heading: "01. The Dialectical Premise",
          body: "",
          pullQuote: "",
        },
      ]);
      setQuizQuestion("");
      setQuizScenario("");
      setQuizCorrectAnswer("");
      setQuizWrongAnswer1("");
      setQuizWrongAnswer2("");
      setErrorMsg(null);
    }
  }, [initialEssay, isOpen]);

  if (!isOpen) return null;

  const handleLoadTemplate = (targetPillar: PillarId) => {
    onPlayClick();
    const tpl = FIELD_TEMPLATES[targetPillar];
    setPillar(targetPillar);
    if (tpl.title) setTitle(tpl.title);
    if (tpl.subtitle) setSubtitle(tpl.subtitle);
    if (tpl.tags) setTagInput(tpl.tags.join(", "));
    if (tpl.sandboxType) setSandboxType(tpl.sandboxType);
    if (tpl.tldrBullets) setTldrBullets(tpl.tldrBullets);
    if (tpl.sections) setSections(tpl.sections);
    if (tpl.formalEquationLabel) setFormalEquationLabel(tpl.formalEquationLabel);
    if (tpl.formalEquation) setFormalEquation(tpl.formalEquation);
    if (tpl.formalExplanation) setFormalExplanation(tpl.formalExplanation);
    setErrorMsg(null);
  };

  const handleAddSection = () => {
    onPlayClick();
    setSections((prev) => [
      ...prev,
      {
        heading: `0${prev.length + 1}. Dialectical Expansion`,
        body: "",
        pullQuote: "",
      },
    ]);
  };

  const handleRemoveSection = (idx: number) => {
    if (sections.length <= 1) return;
    onPlayClick();
    setSections((prev) => prev.filter((_, i) => i !== idx));
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    onPlayClick();

    const parsedTags = tagInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const result = buildCustomEssay({
      id: initialEssay?.id,
      title,
      subtitle,
      author,
      pillar,
      tags: parsedTags,
      sandboxType,
      tldrBullets,
      sections,
      formalEquationLabel,
      formalEquation,
      formalExplanation,
      quizQuestion,
      quizScenario,
      quizCorrectAnswer,
      quizWrongAnswer1,
      quizWrongAnswer2,
    });

    if (!result.valid || !result.essay) {
      setErrorMsg(result.error || "Please complete all required fields.");
      return;
    }

    // Keep attribution and source context when editing a sourced built-in essay.
    if (initialEssay?.sources) result.essay.sources = initialEssay.sources;
    if (initialEssay?.editorialNote) result.essay.editorialNote = initialEssay.editorialNote;

    // Preserve existing socraticAnnotations if customizing a built-in essay
    if (initialEssay && Object.keys(initialEssay.socraticAnnotations).length > 0) {
      result.essay.socraticAnnotations = initialEssay.socraticAnnotations;
    }

    onSaveEssay(result.essay);
    onClose();
  };

  const activeMeta = PILLAR_METADATA[pillar];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#191919]/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#F7F6F3] border-2 border-[#191919] shadow-[0_12px_0_0_#191919] rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top Studio Header */}
        <div className="bg-white border-b-2 border-[#191919] px-6 py-4 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-2xl border-2 border-[#191919] flex items-center justify-center shadow-[0_3px_0_0_#191919]"
              style={{ backgroundColor: activeMeta.surfaceColor }}
            >
              <PenTool className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-code font-bold uppercase tracking-widest text-[#5A5955] block">
                NEUROPLASTIC PUBLISHING STUDIO
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#191919]">
                {initialEssay ? `Customize Monograph: ${initialEssay.title.slice(0, 28)}…` : "Author & Customize Interactive Blog"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleLoadTemplate(pillar)}
              className="duo-btn duo-btn-streak text-xs font-ui font-extrabold px-3 py-2 rounded-xl flex items-center gap-1.5"
              title="Pre-fill with a rich monograph template for the selected field"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load {activeMeta.label} Template</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="duo-btn p-2 rounded-xl bg-[#F7F6F3] text-[#191919]"
              aria-label="Close Studio"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Studio Navigation Tabs */}
        <div className="bg-[#EFECE6] border-b-2 border-[#191919] px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onPlayClick();
                setActiveTab("editorial");
              }}
              className={`duo-btn text-xs font-ui font-extrabold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 ${
                activeTab === "editorial"
                  ? "bg-[#191919] text-white"
                  : "bg-white text-[#191919]"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>1. Field & Editorial Prose</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onPlayClick();
                setActiveTab("depth");
              }}
              className={`duo-btn text-xs font-ui font-extrabold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 ${
                activeTab === "depth"
                  ? "bg-[#191919] text-white"
                  : "bg-white text-[#191919]"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>2. 3-Level Depth (TL;DR & Math)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onPlayClick();
                setActiveTab("interactive");
              }}
              className={`duo-btn text-xs font-ui font-extrabold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 ${
                activeTab === "interactive"
                  ? "bg-[#191919] text-white"
                  : "bg-white text-[#191919]"
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>3. Sandbox & Mastery Quiz</span>
            </button>
          </div>

          <span className="text-[11px] font-code text-[#5A5955]">
            Active Field: <strong className="text-[#191919]">{activeMeta.symbol} {activeMeta.label}</strong>
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handlePublish} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-[#FFEBEB] border-2 border-[#FF4B4B] text-xs font-ui font-bold text-[#CC2929]">
              {errorMsg}
            </div>
          )}

          {/* TAB 1: FIELD OF INTEREST & EDITORIAL PROSE */}
          {activeTab === "editorial" && (
            <div className="space-y-6">
              {/* 5 Fields of Interest Selector */}
              <div>
                <label className="block text-xs font-ui font-black uppercase tracking-wider text-[#191919] mb-2.5">
                  Select Field of Interest (5 Core Domains)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {(Object.keys(PILLAR_METADATA) as PillarId[]).map((pKey) => {
                    const meta = PILLAR_METADATA[pKey];
                    const isSelected = pillar === pKey;
                    return (
                      <button
                        key={pKey}
                        type="button"
                        onClick={() => {
                          onPlayClick();
                          setPillar(pKey);
                        }}
                        className={`duo-btn p-3 rounded-2xl text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? "bg-white ring-2 ring-[#191919]"
                            : "bg-white/80 opacity-80 hover:opacity-100"
                        }`}
                        style={{
                          boxShadow: isSelected ? `0 4px 0 0 ${meta.lipColor}` : undefined,
                        }}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className="w-6 h-6 rounded-lg border border-[#191919] text-white font-code font-bold text-xs flex items-center justify-center"
                            style={{ backgroundColor: meta.surfaceColor }}
                          >
                            {meta.symbol}
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-[#191919]" />}
                        </div>
                        <div className="font-ui font-extrabold text-xs text-[#191919]">
                          {meta.label}
                        </div>
                        <div className="text-[10px] font-ui text-[#5A5955] line-clamp-2 mt-0.5 leading-tight">
                          {meta.description}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title, Subtitle, Author, Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-5 rounded-2xl border-2 border-[#191919] shadow-[0_4px_0_0_#191919]">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-ui font-black uppercase tracking-wider text-[#5A5955] mb-1">
                    Monograph Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., The Algorithmic Unconscious & Digital Transference"
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#191919] bg-[#F7F6F3] font-display font-bold text-base text-[#191919] focus:outline-none focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-ui font-black uppercase tracking-wider text-[#5A5955] mb-1">
                    Author / Byline
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Your Name or Handle"
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#191919] bg-[#F7F6F3] font-ui font-bold text-xs text-[#191919] focus:outline-none focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-ui font-black uppercase tracking-wider text-[#5A5955] mb-1">
                    Dialectical Thesis / Subtitle *
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="A concise one-sentence synthesis of your core intellectual proposition..."
                    className="w-full px-3.5 py-2 rounded-xl border-2 border-[#191919] bg-[#F7F6F3] font-editorial italic text-sm text-[#191919] focus:outline-none focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-ui font-black uppercase tracking-wider text-[#5A5955] mb-1">
                    Conceptual Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Lacan, Attention, Sovereignty"
                    className="w-full px-3.5 py-2 rounded-xl border-2 border-[#191919] bg-[#F7F6F3] font-code text-xs text-[#191919] focus:outline-none focus:bg-white"
                  />
                </div>
              </div>

              {/* Essay Sections Builder */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-ui font-black text-sm text-[#191919]">
                      Long-Form Dialectical Sections (Level 2 Reader)
                    </h4>
                    <p className="text-xs font-ui text-[#5A5955]">
                      Separate paragraphs with a blank line. The first paragraph automatically receives an editorial drop-cap.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSection}
                    className="duo-btn text-xs font-ui font-extrabold px-3 py-1.5 rounded-xl bg-white text-[#191919] flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Section</span>
                  </button>
                </div>

                {sections.map((sec, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-white border-2 border-[#191919] rounded-2xl shadow-[0_4px_0_0_#191919] space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={sec.heading}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSections((prev) =>
                            prev.map((s, i) => (i === idx ? { ...s, heading: val } : s))
                          );
                        }}
                        placeholder={`0${idx + 1}. Section Heading`}
                        className="flex-1 px-3 py-1.5 rounded-xl border-2 border-[#191919] bg-[#F7F6F3] font-display font-bold text-sm text-[#191919]"
                      />
                      {sections.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSection(idx)}
                          className="p-2 rounded-xl border border-[#E2E0DC] text-[#FF4B4B] hover:bg-[#FFEBEB]"
                          title="Remove Section"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <textarea
                      rows={5}
                      value={sec.body}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSections((prev) =>
                          prev.map((s, i) => (i === idx ? { ...s, body: val } : s))
                        );
                      }}
                      placeholder="Write your long-form essay prose here. Separate paragraphs with an empty line..."
                      className="w-full p-3.5 rounded-xl border-2 border-[#191919] bg-[#F7F6F3] font-editorial text-base text-[#191919] leading-relaxed focus:outline-none focus:bg-white"
                    />

                    <div>
                      <label className="flex items-center gap-1.5 text-[11px] font-ui font-bold text-[#5A5955] mb-1">
                        <Quote className="w-3 h-3" />
                        <span>Centered Editorial Pull-Quote (Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={sec.pullQuote || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSections((prev) =>
                            prev.map((s, i) => (i === idx ? { ...s, pullQuote: val } : s))
                          );
                        }}
                        placeholder="An aphoristic sentence to highlight in large display serif between paragraphs..."
                        className="w-full px-3 py-1.5 rounded-xl border border-[#191919] bg-[#F7F6F3] font-display italic text-xs text-[#191919]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: 3-LEVEL COGNITIVE DEPTH */}
          {activeTab === "depth" && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border-2 border-[#191919] shadow-[0_4px_0_0_#191919] space-y-3">
                <h4 className="font-ui font-black text-sm text-[#191919]">
                  ⚡ Level 1: 30-Second Synapse Bullets (Executive Distillation)
                </h4>
                <p className="text-xs font-ui text-[#5A5955]">
                  Provide 2 to 4 crisp takeaways for readers using the Level 1 speed-synthesis slider.
                </p>
                {tldrBullets.map((b, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#FFF9E0] border border-[#191919] font-code text-xs font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <input
                      type="text"
                      value={b}
                      onChange={(e) => {
                        const val = e.target.value;
                        setTldrBullets((prev) => prev.map((item, idx) => (idx === i ? val : item)));
                      }}
                      className="flex-1 px-3 py-2 rounded-xl border-2 border-[#191919] bg-[#F7F6F3] text-xs font-ui text-[#191919]"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setTldrBullets((prev) => [...prev, ""])}
                  className="duo-btn text-xs font-ui font-bold px-3 py-1.5 rounded-xl bg-[#F7F6F3] text-[#191919]"
                >
                  + Add Synapse Bullet
                </button>
              </div>

              <div className="bg-white p-5 rounded-2xl border-2 border-[#191919] shadow-[0_4px_0_0_#191919] space-y-4">
                <h4 className="font-ui font-black text-sm text-[#191919]">
                  🧮 Level 3: First-Principles Formalism & Equation
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-ui font-bold text-[#5A5955] mb-1">
                      Theorem / Formula Label
                    </label>
                    <input
                      type="text"
                      value={formalEquationLabel}
                      onChange={(e) => setFormalEquationLabel(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border-2 border-[#191919] bg-[#F7F6F3] text-xs font-ui font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-ui font-bold text-[#5A5955] mb-1">
                      Symbolic / Mathematical Expression
                    </label>
                    <input
                      type="text"
                      value={formalEquation}
                      onChange={(e) => setFormalEquation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border-2 border-[#191919] bg-[#F7F6F3] text-xs font-code"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-ui font-bold text-[#5A5955] mb-1">
                    First-Principles Derivation Explanation
                  </label>
                  <textarea
                    rows={2}
                    value={formalExplanation}
                    onChange={(e) => setFormalExplanation(e.target.value)}
                    className="w-full p-3 rounded-xl border-2 border-[#191919] bg-[#F7F6F3] text-xs font-ui"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: INTERACTIVE SANDBOX & MASTERY QUIZ */}
          {activeTab === "interactive" && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border-2 border-[#191919] shadow-[0_4px_0_0_#191919] space-y-3">
                <h4 className="font-ui font-black text-sm text-[#191919]">
                  Embedded Interactive Simulation Sandbox
                </h4>
                <p className="text-xs font-ui text-[#5A5955]">
                  Every Neuroplastic blog includes an interactive experiment to help readers explore its ideas.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      id: "compound" as const,
                      title: "Penny’s Compounding Experiment",
                      desc: "Compare simple and compound growth with clearly labeled hypothetical assumptions.",
                    },
                    {
                      id: "epistemic" as const,
                      title: "2D Epistemic Horizon Matrix",
                      desc: "Interactive coordinate plane mapping Realism, Constructivism, Skepticism & Fatalism.",
                    },
                    {
                      id: "attractor" as const,
                      title: "Double-Well Attractor Basin",
                      desc: "Stochastic physics simulation of habit loops, psychic ruts, and activation energy.",
                    },
                    {
                      id: "entropy" as const,
                      title: "Rényi Entropy Context Pruner",
                      desc: "Live token attention pruning simulator measuring VRAM savings vs. semantic accuracy.",
                    },
                  ].map((sb) => (
                    <button
                      key={sb.id}
                      type="button"
                      onClick={() => {
                        onPlayClick();
                        setSandboxType(sb.id);
                      }}
                      className={`duo-btn p-3.5 rounded-2xl text-left ${
                        sandboxType === sb.id
                          ? "bg-[#FFF9E0] ring-2 ring-[#191919]"
                          : "bg-[#F7F6F3]"
                      }`}
                    >
                      <div className="font-ui font-extrabold text-xs text-[#191919] mb-1">
                        {sb.title}
                      </div>
                      <p className="text-[11px] font-ui text-[#5A5955] leading-snug">
                        {sb.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border-2 border-[#191919] shadow-[0_4px_0_0_#191919] space-y-3">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#D6A600]" />
                  <h4 className="font-ui font-black text-sm text-[#191919]">
                    End-of-Essay Neuro-Lock Mastery Quiz (Optional — Auto-generated if left blank)
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-ui font-bold text-[#5A5955] mb-1">
                      Scenario Context
                    </label>
                    <input
                      type="text"
                      value={quizScenario}
                      onChange={(e) => setQuizScenario(e.target.value)}
                      placeholder="A practical scenario testing the reader's grasp..."
                      className="w-full px-3 py-2 rounded-xl border-2 border-[#191919] bg-[#F7F6F3] text-xs font-ui"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-ui font-bold text-[#5A5955] mb-1">
                      Challenge Question
                    </label>
                    <input
                      type="text"
                      value={quizQuestion}
                      onChange={(e) => setQuizQuestion(e.target.value)}
                      placeholder="What is the primary causal mechanism described?"
                      className="w-full px-3 py-2 rounded-xl border-2 border-[#191919] bg-[#F7F6F3] text-xs font-ui"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-ui font-bold text-[#439C00] mb-1">
                      Correct Synthesis Answer
                    </label>
                    <input
                      type="text"
                      value={quizCorrectAnswer}
                      onChange={(e) => setQuizCorrectAnswer(e.target.value)}
                      placeholder="Defaults to your thesis subtitle"
                      className="w-full px-3 py-2 rounded-xl border-2 border-[#439C00] bg-[#ECF9E0]/50 text-xs font-ui"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-ui font-bold text-[#CC2929] mb-1">
                      Distractor Option A
                    </label>
                    <input
                      type="text"
                      value={quizWrongAnswer1}
                      onChange={(e) => setQuizWrongAnswer1(e.target.value)}
                      placeholder="Plausible reductionist fallacy"
                      className="w-full px-3 py-2 rounded-xl border border-[#191919] bg-[#F7F6F3] text-xs font-ui"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-ui font-bold text-[#CC2929] mb-1">
                      Distractor Option B
                    </label>
                    <input
                      type="text"
                      value={quizWrongAnswer2}
                      onChange={(e) => setQuizWrongAnswer2(e.target.value)}
                      placeholder="Dogmatic counter-assumption"
                      className="w-full px-3 py-2 rounded-xl border border-[#191919] bg-[#F7F6F3] text-xs font-ui"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Action Bar */}
          <div className="pt-4 border-t-2 border-[#191919] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <NotionMascot
                variant={activeMeta.mascot}
                mood="excited"
                size={44}
                interactiveEyes={false}
              />
              <div className="text-xs font-ui text-[#5A5955]">
                Publishing to <strong className="text-[#191919]">{activeMeta.label}</strong> with 3-Level Depth & Discourse
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {initialEssay?.isCustom && onDeleteEssay && (
                <button
                  type="button"
                  onClick={() => {
                    onPlayClick();
                    onDeleteEssay(initialEssay.id);
                    onClose();
                  }}
                  className="duo-btn text-xs font-ui font-extrabold px-4 py-2.5 rounded-xl bg-[#FFEBEB] text-[#CC2929] border-2 border-[#191919]"
                >
                  Delete Custom Blog
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="duo-btn text-xs font-ui font-extrabold px-4 py-2.5 rounded-xl bg-white text-[#191919]"
              >
                Cancel
              </button>

              <button
                type="submit"
                className={`duo-btn ${activeMeta.btnClass} text-xs font-ui font-extrabold px-6 py-2.5 rounded-xl flex items-center gap-1.5`}
              >
                <Check className="w-4 h-4" />
                <span>{initialEssay ? "Save Customizations" : "Publish Interactive Blog"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
