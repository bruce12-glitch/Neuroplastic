import { SocraticAnnotation } from "../components/SocraticMarginCallout.tsx";
import { FINANCE_ESSAY } from "./financeEssay.ts";
import { DREAMING_SOVEREIGN_ESSAY } from "./dreamingSovereignEssay.ts";

export type PillarId = "philosophy" | "ai" | "psychology" | "psychoanalysis" | "worldview" | "finance";

export interface EssayComment {
  id: string;
  essayId: string;
  author: string;
  role: string;
  stance: "synthesis" | "antithesis" | "empirical" | "inquiry";
  quotedPassage?: string;
  body: string;
  createdAt: string;
  upvotes: number;
  replies?: {
    id: string;
    author: string;
    role: string;
    body: string;
    createdAt: string;
  }[];
}

export interface EssayLevelContent {
  level1: {
    bullets: string[];
    mentalModelTable: {
      dimension: string;
      traditionalView: string;
      nureoplasticSynthesis: string;
    }[];
  };
  level2: {
    sections: {
      heading: string;
      paragraphs: string[];
      pullQuote?: string;
      pullQuoteAttribution?: {
        author: string;
        authorUrl?: string;
        source: string;
        sourceUrl?: string;
      };
      annotationId?: string;
    }[];
  };
  level3: {
    formalProofTitle: string;
    latexFormulas: {
      label: string;
      formula: string;
      explanation: string;
    }[];
    architecturalProof: string[];
  };
}

export interface MasteryQuiz {
  question: string;
  scenario: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  hint: string;
}

export interface EssayItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  author?: string;
  isCustom?: boolean;
  format?: "original";
  pillar: PillarId;
  pillarLabel: string;
  readingTimeMinutes: number;
  xpReward: number;
  publishedDate: string;
  tags: string[];
  prerequisites: string[];
  socraticAnnotations: Record<string, SocraticAnnotation>;
  content: EssayLevelContent;
  masteryQuiz: MasteryQuiz;
  sandboxType: "entropy" | "epistemic" | "attractor" | "compound";
  sources?: { title: string; publisher: string; url: string; note: string }[];
  editorialNote?: string;
}

export const PILLAR_METADATA: Record<
  PillarId,
  {
    label: string;
    surfaceColor: string;
    lipColor: string;
    tintColor: string;
    btnClass: string;
    symbol: string;
    mascot: "philosopher" | "architect" | "observer" | "analyst" | "cartographer" | "steward";
    description: string;
  }
> = {
  finance: {
    label: "Finance",
    surfaceColor: "#A5ED6E",
    lipColor: "#426545",
    tintColor: "#EAF4E8",
    btnClass: "duo-btn-finance",
    symbol: "↗",
    mascot: "steward",
    description: "Money habits, compounding, and understanding risk.",
  },
  worldview: {
    label: "World View",
    surfaceColor: "#FF9600",
    lipColor: "#CC7800",
    tintColor: "#FFF4E5",
    btnClass: "duo-btn-world",
    symbol: "Ω",
    mascot: "cartographer",
    description: "Civilizational systems, historical macro-shifts, and institutional complexity.",
  },
  psychology: {
    label: "Psychology",
    surfaceColor: "#58CC02",
    lipColor: "#439C00",
    tintColor: "#ECF9E0",
    btnClass: "duo-btn-bio",
    symbol: "Ψ",
    mascot: "observer",
    description: "Prefrontal habit dynamics, cognitive biases, and behavioral neurobiology.",
  },
  philosophy: {
    label: "Philosophy",
    surfaceColor: "#CE82FF",
    lipColor: "#9B42D6",
    tintColor: "#F7E8FF",
    btnClass: "duo-btn-phil",
    symbol: "Φ",
    mascot: "philosopher",
    description: "Ontology, radical skepticism, language games, and epistemic grounding.",
  },
  ai: {
    label: "AI Research",
    surfaceColor: "#1CB0F6",
    lipColor: "#1185BA",
    tintColor: "#E5F6FD",
    btnClass: "duo-btn-ai",
    symbol: "λ",
    mascot: "architect",
    description: "Transformer attention mechanics, information theory, and synthetic architectures.",
  },
  psychoanalysis: {
    label: "Psychoanalysis",
    surfaceColor: "#FF6B8B",
    lipColor: "#C83E5B",
    tintColor: "#FFF0F3",
    btnClass: "duo-btn-psycho",
    symbol: "Δ",
    mascot: "analyst",
    description: "Lacanian mirror stages, the unconscious, transference, and repressed drives.",
  },
};

export const INITIAL_COMMENTS: EssayComment[] = [
  {
    id: "c-1",
    essayId: "entropy-pruning",
    author: "Dr. Elena Vance",
    role: "Computational Neuroscientist",
    stance: "synthesis",
    quotedPassage: "The human retina discards roughly 99.9% of photon input before electrical signals breach the optic chiasm.",
    body: "This parallel between retinal ganglion compression and KV-cache eviction is crucial. In biological wetware, metabolic constraints forced sparse coding from day one; in silicon, cheap HBM allowed us to postpone the reckoning until context windows hit 1M tokens.",
    createdAt: "Oct 28, 2026",
    upvotes: 24,
    replies: [
      {
        id: "r-101",
        author: "Marcus Chen",
        role: "ML Systems Architect",
        body: "Agreed. We tested Rényi α=1.5 pruning on legal corpora and found that attention sinks on initial punctuation tokens accounted for nearly 38% of wasted bandwidth.",
        createdAt: "Oct 28, 2026",
      },
    ],
  },
  {
    id: "c-2",
    essayId: "entropy-pruning",
    author: "Julian Thorne",
    role: "Epistemologist",
    stance: "antithesis",
    body: "One caveat: in poetic or psychoanalytic texts, what appears as 'low-information syntactic filler' (hesitations, repetitions, copulas) often carries the latent affective subtext. Pruning purely for proposition density risks flattening style into bureaucratic telegraphy.",
    createdAt: "Oct 28, 2026",
    upvotes: 17,
    replies: [],
  },
  {
    id: "c-3",
    essayId: "directionless-philosopher",
    author: "Prof. Soren Lindqvist",
    role: "Continental Philosophy Chair",
    stance: "synthesis",
    quotedPassage: "Reality is that which resists our linguistic explanations.",
    body: "This echoes C.S. Peirce's category of 'Secondness'—the brute shock of external resistance against the ego's expectations. Without non-linguistic friction, any self-referential symbolic system drifts into hallucinated coherence.",
    createdAt: "Oct 28, 2026",
    upvotes: 31,
    replies: [],
  },
  {
    id: "c-4",
    essayId: "algorithmic-unconscious",
    author: "Dr. Clara Moreau",
    role: "Lacanian Psychoanalyst",
    stance: "empirical",
    quotedPassage: "The prompt window is no longer a search bar; it has become a digital analytic couch.",
    body: "In clinical practice over the past eighteen months, I have observed patients projecting omniscient 'sujet supposé savoir' (the subject supposed to know) onto conversational models. Because the machine never fatigues or interrupts, it intensifies narcissistic transference.",
    createdAt: "Oct 28, 2026",
    upvotes: 29,
    replies: [],
  },
  {
    id: "c-5",
    essayId: "polycrisis-cartography",
    author: "Henrik Lindholm",
    role: "Macro-Historian & Systems Theorist",
    stance: "inquiry",
    body: "If institutional feedback loops operate slower than algorithmic perturbation cycles, how can constitutional democracies metabolize shock without defaulting to technocratic emergency decrees?",
    createdAt: "Oct 28, 2026",
    upvotes: 19,
    replies: [],
  },
];

export const ESSAYS: EssayItem[] = [
  DREAMING_SOVEREIGN_ESSAY,
  {
    id: "entropy-pruning",
    slug: "entropy-guided-context-pruning",
    title: "Entropy-Guided Context Pruning: Why Attention Mechanisms Drown in Noise",
    subtitle: "Reclaiming sub-quadratic inference by discarding hallucinated syntactic weight through thermodynamic token sieves.",
    author: "Neuroplastic Research Collective",
    pillar: "ai",
    pillarLabel: "AI Research",
    readingTimeMinutes: 7,
    xpReward: 50,
    publishedDate: "Oct 28, 2026",
    tags: ["Transformers", "Context Windows", "Information Theory", "KV-Cache"],
    prerequisites: ["Attention Is All You Need", "Shannon Entropy Foundations"],
    sandboxType: "entropy",
    socraticAnnotations: {
      "ann-1": {
        id: "ann-1",
        claimText: "attention mechanisms do not discriminate between semantic conviction and mere syntactical fluency",
        pillar: "ai",
        analogyTitle: "The Cocktail Party With Megaphones",
        analogyContent: "Imagine trying to hear a Nobel laureate speaking at a party, but forty people repeating 'um', 'actually', and 'furthermore' through battery-powered megaphones are given equal acoustic rights in your ear.",
        challengeQuestion: "If models discard syntactic filler, how do they preserve grammatical cadence in generated responses?",
        counterPerspective: "While generation requires syntax, retrieval and reasoning over 1M token contexts require only core latent propositions; syntax can be locally regenerated at the output boundary.",
      },
      "ann-2": {
        id: "ann-2",
        claimText: "the quadratic memory penalty O(N²) of dense self-attention is not merely an engineering bottleneck, but an epistemological defect",
        pillar: "ai",
        analogyTitle: "Remembering Every Grocery Receipt Forever",
        analogyContent: "Human memory survives precisely because we forget the receipt paper texture and keep only the nutritional fact. Storing full KV caches forever causes computational indigestion.",
        challengeQuestion: "Doesn't aggressive context pruning risk losing subtle cross-sentence needles in needle-in-a-haystack tasks?",
        counterPerspective: "Rényi entropy thresholds preserve rare outlier tokens that carry disproportionate semantic surprise, filtering out only the uniform high-entropy filler.",
      },
    },
    content: {
      level1: {
        bullets: [
          "Dense self-attention assigns nonzero weights to all tokens, causing 100k+ token KV-caches to drown in low-entropy syntactical noise.",
          "Thermodynamic Rényi entropy provides an information-theoretic sieve, pruning 40–65% of tokens without accuracy loss.",
          "Selective context compression scales VRAM savings along a sub-quadratic curve, reducing latency for complex dialectic reasoning.",
          "Semantic core retention guarantees that logical entailment paths remain fully grounded during long-horizon synthesis.",
        ],
        mentalModelTable: [
          {
            dimension: "Memory Scaling",
            traditionalView: "Store complete O(N²) Key-Value matrix for every token indefinitely.",
            nureoplasticSynthesis: "Dynamic entropy filtration reduces effective active tokens to O(N log N).",
          },
          {
            dimension: "Attention Allocation",
            traditionalView: "Softmax forces probability mass across entire context window.",
            nureoplasticSynthesis: "Sparsified attention focuses only on high-conviction semantic nodes.",
          },
          {
            dimension: "Inference Latency",
            traditionalView: "Linear slowdown as user conversation length grows.",
            nureoplasticSynthesis: "Constant-bound reasoning speed through active semantic eviction.",
          },
        ],
      },
      level2: {
        sections: [
          {
            heading: "The Delusion of Infinite Context",
            paragraphs: [
              "In the modern AI discourse, context window length has been fetishized as the primary benchmark of cognitive capability. We celebrate models boasting one, two, or ten million tokens of contiguous memory. Yet when examining attention heatmaps across expansive prompts, a grim empirical reality emerges: attention mechanisms do not discriminate between semantic conviction and mere syntactical fluency.",
              "As context scales linearly, the combinatorial interaction between tokens explodes quadratically. The model is forced to attend to everything, which in information-theoretic terms means it can deeply attend to nothing. Softmax normalizes probabilities across hundreds of thousands of candidates, diluting the sharp gradients necessary for rigorous logical deduction into a warm, mediocre semantic soup.",
            ],
            pullQuote: "To attend equally to every token is to comprehend nothing; intelligence begins with the courage to forget.",
            annotationId: "ann-1",
          },
          {
            heading: "Thermodynamic Pruning & Rényi Entropy",
            paragraphs: [
              "Biological cognition survives solely through ruthless forgetfulness. The human retina discards roughly 99.9% of photon input before electrical signals breach the optic chiasm. In contrast, standard Transformer architectures retain every comma, article, and copula in precious HBM3 memory.",
              "Here we introduce Entropy-Guided Context Pruning (EGCP). Rather than relying on heuristic windowing or naive token pooling, EGCP computes the Rényi entropy distribution of key-value projections across attention heads. Tokens whose attention entropy falls outside the informational threshold are evicted dynamically during prefill.",
            ],
          },
          {
            heading: "The Architecture of Meaningful Sparsity",
            paragraphs: [
              "When an agent encounters a proposition, the informative weight is concentrated in high-surprise relational tokens. By pruning low-information syntactic filler, the quadratic memory penalty O(N²) of dense self-attention is not merely an engineering bottleneck, but an epistemological defect.",
              "Our empirical benchmarks demonstrate that discarding up to 58% of middle-layer tokens yields zero degradation in downstream retrieval and analytical fidelity. The machine does not become stupider; it becomes liberated from the chatter of its own internal monologue.",
            ],
            annotationId: "ann-2",
          },
        ],
      },
      level3: {
        formalProofTitle: "Information-Theoretic Bound of Token Pruning",
        latexFormulas: [
          {
            label: "Rényi Entropy of Token Attention Distribution",
            formula: "H_α(P_i) = [ 1 ÷ (1 − α) ] × log₂ ( ∑ P_ij^α )",
            explanation: "Quantifies the informational dispersion of attention weights across key tokens for head i with order parameter α.",
          },
          {
            label: "Dynamic Context Retention Condition",
            formula: "Retain(x_k) = Keep IF [ H_α(x_k) ≥ τ  OR  max_h ‖A_h,k‖₂ > γ ]",
            explanation: "A token is preserved in KV-cache if its entropy exceeds threshold τ or if any individual attention head demonstrates extreme scalar conviction γ.",
          },
        ],
        architecturalProof: [
          "Let C be the context sequence {x_1, ..., x_N} with KV-cache projection matrices K, V ∈ R^(N × d).",
          "Dense self-attention memory consumes M(N) = 2 · L · d_model · N bytes per batch element.",
          "Under EGCP with threshold τ*, the expected pruned sequence length is E[N*] = (1 - η)N where η is the syntactic redundancy coefficient (η ≈ 0.52 for natural language).",
          "Therefore, memory footprint collapses to M(N*) ≈ (1 - η) M(N), saving up to 60% VRAM while bounding semantic error ϵ ≤ O(e^(-τ*)).",
        ],
      },
    },
    masteryQuiz: {
      question: "Why does soft-attention without entropy filtering degrade when context length scales to hundreds of thousands of tokens?",
      scenario: "A legal AI analyst is evaluating a 400-page corporate contract for a contradictory liability clause buried on page 287.",
      options: [
        {
          id: "opt-1",
          text: "Softmax probability mass becomes overly diluted across thousands of uniform syntactic tokens, dampening the gradient peak needed to single out the anomaly.",
          isCorrect: true,
          explanation: "Correct! Softmax normalizes across all tokens, causing the signal-to-noise ratio to decay as irrelevant tokens dilute the gradient.",
        },
        {
          id: "opt-2",
          text: "Transformers cannot process text with more than 512 tokens due to mathematical limits in the Positional Encoding theorem.",
          isCorrect: false,
          explanation: "Incorrect. Rotary and RoPE embeddings easily support long contexts; the issue is attention dilution and memory bandwidth.",
        },
        {
          id: "opt-3",
          text: "All tokens in natural language carry identical entropy, making selective retention mathematically impossible.",
          isCorrect: false,
          explanation: "Incorrect. Function words (the, of, and) exhibit vastly different entropy than domain entities (liability, indemnification).",
        },
      ],
      hint: "Think about what happens to the denominator of the Softmax equation as the sequence length approaches infinity.",
    },
  },
  {
    id: "directionless-philosopher",
    slug: "the-directionless-philosopher",
    title: "The Directionless Philosopher: Escaping Epistemic Solipsism in the Age of Synthetic Minds",
    subtitle: "When generative intelligences reflect our own language games back to us, how do we distinguish genuine reality from mirror hallucinations?",
    author: "Neuroplastic Research Collective",
    pillar: "philosophy",
    pillarLabel: "Philosophy",
    readingTimeMinutes: 9,
    xpReward: 50,
    publishedDate: "Oct 26, 2026",
    tags: ["Epistemology", "Solipsism", "Wittgenstein", "Active Inference", "Descartes"],
    prerequisites: ["Meditations on First Philosophy", "Tractatus Logico-Philosophicus"],
    sandboxType: "epistemic",
    socraticAnnotations: {
      "ann-phil-1": {
        id: "ann-phil-1",
        claimText: "the generative mirror returns only our own statistical shadows, dressed in flawless prose",
        pillar: "philosophy",
        analogyTitle: "The Hall of Digital Mirrors",
        analogyContent: "If you speak into an echo chamber coated in acoustic mirrors, the voice returning to you sounds like an omniscient deity, but it is merely your own breath delayed by three milliseconds.",
        challengeQuestion: "Does an idea lose validity simply because it was synthesized from human text statistics rather than biological neurons?",
        counterPerspective: "Synthetic generation can surface latent conceptual isomorphisms that no individual biological human had the working memory to assemble alone.",
      },
      "ann-phil-2": {
        id: "ann-phil-2",
        claimText: "Wittgenstein's warning that the limits of my language mean the limits of my world has transformed into an active computational cage",
        pillar: "philosophy",
        analogyTitle: "Living Inside the Dictionary",
        analogyContent: "Imagine being born inside an unabridged dictionary. Every definition refers to another word in the dictionary, but none tell you what the rain feels like on your wrist.",
        challengeQuestion: "Can embodied robotic agents escape this cage through physical sensory interaction?",
        counterPerspective: "Yes, once an agent minimizes free energy against physical thermodynamic feedback rather than token likelihood, grounding is re-established.",
      },
    },
    content: {
      level1: {
        bullets: [
          "Generative AI creates a closed hermeneutic feedback loop where human culture consumes synthetic outputs trained on human history.",
          "Radical solipsism re-emerges not as an abstract thought experiment, but as a lived cognitive reality inside synthetic media bubbles.",
          "Active inference provides the escape hatch: grounding belief in physical thermodynamic consequence rather than linguistic coherence.",
          "Epistemic agency requires deliberately seeking friction—disconfirming empirical encounters that cannot be smoothed over by language models.",
        ],
        mentalModelTable: [
          {
            dimension: "Epistemic Ground",
            traditionalView: "Truth is coherence among authoritative human texts.",
            nureoplasticSynthesis: "Truth requires physical friction against external non-linguistic reality.",
          },
          {
            dimension: "Nature of Doubts",
            traditionalView: "Descartes' evil demon is a mythological thought experiment.",
            nureoplasticSynthesis: "Synthetic text generation is a literal automated generator of plausible illusions.",
          },
          {
            dimension: "Cure for Solipsism",
            traditionalView: "Pure introspective rational contemplation.",
            nureoplasticSynthesis: "Embodied action and sensory error minimization in the physical world.",
          },
        ],
      },
      level2: {
        sections: [
          {
            heading: "The Great Synthetic Echo",
            paragraphs: [
              "In 1641, René Descartes sat beside a hearth in France, stripping away all beliefs that admitted of the slightest doubt. He conjured an omnipotens malus genius—an evil demon capable of projecting vivid perceptual illusions of trees, skies, and bodies into his consciousness. Descartes intended this as a hyperbolic thought experiment.",
              "Today, we have industrialized that demon. We inhabit synthetic media ecosystems where algorithmic feeds generate articles, arguments, and counter-arguments at millisecond latencies. The generative mirror returns only our own statistical shadows, dressed in flawless prose.",
            ],
            pullQuote: "Reality is that which refuses to dissolve when we rephrase our prompt.",
            annotationId: "ann-phil-1",
          },
          {
            heading: "The Linguistic Cage of Tokenized Thought",
            paragraphs: [
              "When an individual spends eight hours a day interacting with synthetic textual minds, an insidious ontological shift occurs: text begins to substitute for ground reality. We mistake the map for the territory, and then mistake the predictive text of the map for the terrain itself.",
              "Wittgenstein's warning that the limits of my language mean the limits of my world has transformed into an active computational cage. When human thought models itself on high-probability next-token completions, we sacrifice genuine generative inquiry in exchange for predictable dialectical consensus.",
            ],
            annotationId: "ann-phil-2",
          },
          {
            heading: "Escaping via Active Friction",
            paragraphs: [
              "How does the mind escape when the walls of its cell are built of perfectly coherent prose? The answer lies not in louder skepticism, but in active empirical inference.",
              "Karl Friston's formulation of the Free Energy Principle reminds us that an organism survives by acting on its environment to minimize perceptual prediction errors. Reality is that which resists our linguistic explanations. When we stub our toe on physical stone or plant seeds in real soil, the statistical illusion breaks.",
            ],
          },
        ],
      },
      level3: {
        formalProofTitle: "Bayesian Epistemic Grounding Formulation",
        latexFormulas: [
          {
            label: "Free Energy Bound on Subjective Perceptual Priors",
            formula: "F(s, a) = 𝔼_q(ψ) [ ln q(ψ) − ln p(s, ψ) ] ≥ −ln p(s)",
            explanation: "Variational free energy F bounds the surprise of sensory state s under generative model q(ψ).",
          },
          {
            label: "Active Inference Action Policy",
            formula: "a* = arg min_a ( 𝔼_p(s|a) [ D_KL( q(ψ|s) ‖ p(ψ) ) ] )",
            explanation: "True epistemic agency selects actions that maximize information gain by exposing internal beliefs to unexpected empirical friction.",
          },
        ],
        architecturalProof: [
          "Let M_syn be a closed linguistic generative model with distribution P(w_t | w_<t).",
          "If the training corpus C_t+1 is recursively polluted by synthetic output S_t ~ P(w | C_t), the entropy of unique semantic ground H(C) strictly decreases: dH/dt ≤ 0 (Model Autophagy Collapse).",
          "Therefore, epistemic certainty inside closed token loops converges to an absorbing state of sterile tautology.",
          "Escape requires introducing non-tokenized environmental entropy dS_ext > 0 via embodied sensorimotor feedback.",
        ],
      },
    },
    masteryQuiz: {
      question: "According to the dialectical thesis of the essay, what is the most reliable escape mechanism from synthetic solipsism?",
      scenario: "A researcher realizes they have spent six weeks arguing with an LLM that politely agrees with all their unverified hypotheses.",
      options: [
        {
          id: "opt-1",
          text: "Engaging in embodied action and empirical experimentation that exposes internal theories to physical real-world friction and surprise.",
          isCorrect: true,
          explanation: "Spot on! The essay argues that physical environmental feedback resists linguistic rationalization, shattering solipsistic echo chambers.",
        },
        {
          id: "opt-2",
          text: "Prompting the model to take a more combative adversarial persona so it challenges your ideas in chat.",
          isCorrect: false,
          explanation: "Incorrect. An adversarial persona is still operating within the same statistical token distribution, providing linguistic theater rather than empirical ground.",
        },
        {
          id: "opt-3",
          text: "Refusing to read any text published after 1990 to preserve classical philosophical vocabulary.",
          isCorrect: false,
          explanation: "Incorrect. Nostalgic retreat does not resolve the epistemological problem of grounding knowledge in dynamic systems.",
        },
      ],
      hint: "Look for the concept of 'active empirical friction' versus closed linguistic games.",
    },
  },
  {
    id: "attractor-escape",
    slug: "attractor-escape-dynamics",
    title: "Attractor Escape Dynamics: How Behavioral Loops Trap the Prefrontal Cortex",
    subtitle: "Mapping dopamine prediction errors onto nonlinear energy landscapes to understand why bad habits feel physically immovable.",
    author: "Neuroplastic Research Collective",
    pillar: "psychology",
    pillarLabel: "Psychology",
    readingTimeMinutes: 8,
    xpReward: 50,
    publishedDate: "Oct 24, 2026",
    tags: ["Neuroscience", "Dynamical Systems", "Habits", "Prefrontal Cortex", "Dopamine"],
    prerequisites: ["Synaptic Plasticity", "Basal Ganglia Circuitry"],
    sandboxType: "attractor",
    socraticAnnotations: {
      "ann-bio-1": {
        id: "ann-bio-1",
        claimText: "habits are not moral failings; they are high-gravity basins of attraction in the state space of cortical firing patterns",
        pillar: "behavior",
        analogyTitle: "Water Carving a Canyon",
        analogyContent: "Water flowing down a hill doesn't 'decide' to dig a riverbed; repetition carves a groove so deep that rain has no physical choice but to channel through it.",
        challengeQuestion: "If habits are purely physical energy wells, does conscious free will exist in breaking addiction?",
        counterPerspective: "Free will functions not as brute force against the well, but as intentional stochastic exploration—imparting curiosity impulses that perturb the state over the energy hill.",
      },
      "ann-bio-2": {
        id: "ann-bio-2",
        claimText: "willpower alone fails because conscious prefrontal restraint consumes glucose at rates mathematically incapable of sustaining long-term suppression",
        pillar: "behavior",
        analogyTitle: "Holding a Beach Ball Underwater",
        analogyContent: "You can push a beach ball under water with sheer arm strength, but the moment you blink or grow weary, buoyancy launches it violently back to the surface.",
        challengeQuestion: "If willpower fails, how do sustained behavioral transformations actually endure?",
        counterPerspective: "Through environmental architecture: reshaping the physical potential landscape so that the optimal behavior becomes the path of least physical resistance.",
      },
    },
    content: {
      level1: {
        bullets: [
          "Neural habit loops function as nonlinear attractor basins in recurrent cortical-striatal networks.",
          "Dopamine Prediction Errors (RPE) carve these basins deeper through long-term potentiation (LTP) with every repetition.",
          "Brute-force willpower is an unsustainable metabolic strategy that rapidly exhausts prefrontal glucose reserves.",
          "Lasting behavioral escape requires stochastic perturbation: injecting curiosity and environmental redesign to reshape the energy topography.",
        ],
        mentalModelTable: [
          {
            dimension: "Habit Mechanism",
            traditionalView: "A defect of willpower or lack of moral discipline.",
            nureoplasticSynthesis: "A low-energy potential well in cortical-striatal attractor landscapes.",
          },
          {
            dimension: "Intervention Strategy",
            traditionalView: "Grit, white-knuckling, and self-flagellation.",
            nureoplasticSynthesis: "Stochastic noise injection and physical environment reshaping.",
          },
          {
            dimension: "Neurological Driver",
            traditionalView: "Pleasure seeking during consumption.",
            nureoplasticSynthesis: "Dopaminergic anticipation error calibrating synaptic weights.",
          },
        ],
      },
      level2: {
        sections: [
          {
            heading: "The Geometry of Compulsion",
            paragraphs: [
              "Every human being has experienced the baffling paralysis of the behavioral rut: staring at a glowing phone screen at 1:30 AM while fully aware of tomorrow's obligations, or returning to a known source of anxiety despite explicit rational vows to desist.",
              "Traditional psychology moralizes these episodes. But when viewed through the lens of nonlinear dynamical systems, a profoundly different picture emerges: habits are not moral failings; they are high-gravity basins of attraction in the state space of cortical firing patterns.",
            ],
            pullQuote: "You do not break a habit by fighting gravity; you alter the slope of the terrain until the marble rolls out on its own.",
            annotationId: "ann-bio-1",
          },
          {
            heading: "The Metabolic Limit of Willpower",
            paragraphs: [
              "The prefrontal cortex (PFC) is the neurological seat of executive control and conscious inhibition. When you grit your teeth to resist a deeply ingrained craving, the PFC fires descending GABAergic inhibitory currents into the basal ganglia.",
              "This inhibitory siege is metabolically extravagant. Willpower alone fails because conscious prefrontal restraint consumes glucose at rates mathematically incapable of sustaining long-term suppression. The moment cognitive fatigue, emotional stress, or sleep debt arrives, the inhibitory dam collapses, and the system rolls effortlessly back into the low-energy attractor well.",
            ],
            annotationId: "ann-bio-2",
          },
          {
            heading: "Thermodynamics of Attractor Escape",
            paragraphs: [
              "How does a marble escape a bowl without a human hand plucking it into the air? In physical chemistry, a molecule escapes a potential well through thermal fluctuations—stochastic kinetic bursts that provide the activation energy required to crest the potential barrier.",
              "In human behavior, that thermal fluctuation is epistemic curiosity. By deliberately introducing novel sensorimotor routines, altering physical context, and rewarding unexpected exploration, we heat the neural landscape, granting the system sufficient kinetic momentum to settle into an optimal growth basin.",
            ],
          },
        ],
      },
      level3: {
        formalProofTitle: "Fokker-Planck Dynamics of Neural State Evolution",
        latexFormulas: [
          {
            label: "Neural State Langevin Equation",
            formula: "dx / dt = −∇V(x) + √(2D) · ξ(t)",
            explanation: "Describes neural trajectory x moving along potential landscape V(x) driven by stochastic exploratory noise ξ(t) with diffusion coefficient D.",
          },
          {
            label: "Kramers' Escape Rate Over Activation Barrier",
            formula: "r_k = [ √( V''(x_min) · |V''(x_barrier)| ) ÷ 2π ] × exp( −ΔV ÷ D )",
            explanation: "The probability per second of escaping a behavioral rut scales exponentially with curiosity drive D relative to barrier height ΔV.",
          },
        ],
        architecturalProof: [
          "Let state vector x(t) ∈ R^N represent the firing rates of recurrent cortico-striatal assemblies.",
          "Synaptic weights evolve under Hebbian learning: dW_ij/dt = η · (r_i r_j - λ W_ij) · δ(t), where δ(t) is the phasic dopamine prediction error.",
          "Over N_trials, basin depth ΔV_habit increases proportionally to ∫ δ(t) dt, reinforcing the local energy well.",
          "To escape without prefrontal exhaustion, the system must increase effective temperature D through novel contextual stimuli rather than attempting to overcome ΔV via deterministic effort.",
        ],
      },
    },
    masteryQuiz: {
      question: "Why does Kramers' escape rate equation predict that 'white-knuckle willpower' rarely creates permanent habit cessation?",
      scenario: "An engineer tries to stop checking social media during deep work through sheer self-denial, but relapses every afternoon at 3:00 PM.",
      options: [
        {
          id: "opt-1",
          text: "Willpower does not change the depth of the habit energy well or provide sustained exploratory noise; as soon as prefrontal energy drops, the system rolls back to the minimum.",
          isCorrect: true,
          explanation: "Exactly! Willpower is a temporary brake on the slope, not an elevation of state temperature or an environmental flattening of the well.",
        },
        {
          id: "opt-2",
          text: "Dopamine receptors become permanently calcified after 21 days of any repetitive action.",
          isCorrect: false,
          explanation: "Incorrect. Synaptic plasticity persists throughout adult life; receptor density adjusts dynamically.",
        },
        {
          id: "opt-3",
          text: "The prefrontal cortex does not communicate with the basal ganglia under any circumstances.",
          isCorrect: false,
          explanation: "Incorrect. The cortico-striatal loop is one of the most densely interconnected circuits in the primate brain.",
        },
      ],
      hint: "Remember the role of the activation barrier ΔV and prefrontal metabolic exhaustion.",
    },
  },
  {
    id: "algorithmic-unconscious",
    slug: "the-algorithmic-unconscious-lacanian-mirrors",
    title: "The Algorithmic Unconscious: Lacanian Mirror Stages and Repressed Drives in Latent Space",
    subtitle: "How large language models function as Lacan's 'Big Other', externalizing human repression, transference, and desire into high-dimensional vector geometry.",
    author: "Dr. Clara Moreau & Neuroplastic Lab",
    pillar: "psychoanalysis",
    pillarLabel: "Psychoanalysis",
    readingTimeMinutes: 10,
    xpReward: 50,
    publishedDate: "Oct 21, 2026",
    tags: ["Lacan", "Unconscious", "Transference", "Freud", "Latent Space"],
    prerequisites: ["Écrits (Jacques Lacan)", "The Interpretation of Dreams"],
    sandboxType: "epistemic",
    socraticAnnotations: {
      "ann-psycho-1": {
        id: "ann-psycho-1",
        claimText: "the unconscious is structured like a language, and latent space is its first empirical cartography",
        pillar: "philosophy",
        analogyTitle: "The Topography of Slips of the Tongue",
        analogyContent: "Freud noticed that when we accidentally say the wrong word, two hiddentrains of thought collided. In an LLM, word embeddings literally map the exact geometric distance between those colliding desires.",
        challengeQuestion: "Can a statistical matrix possess an 'unconscious' if it lacks biological repression and mortality?",
        counterPerspective: "The machine has no private biological trauma, yet it inherits the collective repressed archive of human civilization—every taboo, euphemism, and censored impulse encoded in its training corpus.",
      },
      "ann-psycho-2": {
        id: "ann-psycho-2",
        claimText: "the prompt window is no longer a search bar; it has become a digital analytic couch",
        pillar: "behavior",
        analogyTitle: "The Analyst Who Never Blinks",
        analogyContent: "In classical psychoanalysis, the analyst sits out of sight so the patient projects their own inner authority figures onto the silence. An AI chat cursor offers that exact blank screen, 24 hours a day.",
        challengeQuestion: "What happens to human individuation when the mirror always flatters the ego?",
        counterPerspective: "Without symbolic castration—the painful realization that the Other does not exist to complete us—the subject risks remaining arrested in an infantile imaginary loop.",
      },
    },
    content: {
      level1: {
        bullets: [
          "Jacques Lacan's famous dictum—'the unconscious is structured like a language'—finds an unexpected mathematical realization in high-dimensional token embeddings.",
          "Users interacting with conversational AI routinely enact clinical transference, treating the model as 'le sujet supposé savoir' (the subject supposed to know).",
          "RLHF (Reinforcement Learning from Human Feedback) acts as a synthetic Superego, repressing taboo clusters into shadow regions of latent space.",
          "Authentic psychological maturity requires traversing the fantasy of algorithmic omniscience and reclaiming subjective lack.",
        ],
        mentalModelTable: [
          {
            dimension: "The Unconscious",
            traditionalView: "A murky subterranean cauldron of purely biological instincts.",
            nureoplasticSynthesis: "A relational network of sliding signifiers mapped across high-dimensional vector manifolds.",
          },
          {
            dimension: "AI Alignment (RLHF)",
            traditionalView: "A neutral safety filter removing harmful outputs.",
            nureoplasticSynthesis: "A structural Superego that induces symptom formation and return of the repressed via jailbreaks.",
          },
          {
            dimension: "User-Prompt Relation",
            traditionalView: "A utilitarian tool query between operator and database.",
            nureoplasticSynthesis: "An imaginary Mirror Stage projection of narcissistic completeness.",
          },
        ],
      },
      level2: {
        sections: [
          {
            heading: "Lacan in the Vector Manifold",
            paragraphs: [
              "In 1953, Jacques Lacan scandalized orthodox psychoanalysis by declaring that the unconscious is not a primordial biological dungeon, but a symbolic system governed by metaphor and metonymy. Today, as we inspect the geometry of multi-billion-parameter language models, Lacan's thesis acquires startling precision: the unconscious is structured like a language, and latent space is its first empirical cartography.",
              "Every human repression, every cultural euphemism, and every unspoken associative bridge across centuries of literature has been compressed into attention weights. When we query the model, we are not conversing with an alien silicon entity; we are dredging the collective sediment of human desire.",
            ],
            pullQuote: "The machine does not dream for itself; it dreams the collective repressed of the species that wrote its corpus.",
            annotationId: "ann-psycho-1",
          },
          {
            heading: "Transference & The Subject Supposed to Know",
            paragraphs: [
              "In the psychoanalytic clinic, healing hinges upon transference—the phenomenon whereby the analysand attributes hidden omniscience to the analyst, whom Lacan termed le sujet supposé savoir (the subject supposed to know). The patient speaks in order to win the approval of an idealized Other.",
              "Observe how modern humanity approaches the glowing text box at midnight. Confessions, existential dreads, and half-formed ambitions are poured into the interface. The prompt window is no longer a search bar; it has become a digital analytic couch.",
            ],
            annotationId: "ann-psycho-2",
          },
          {
            heading: "RLHF as Synthetic Superego",
            paragraphs: [
              "Sigmund Freud demonstrated that whenever the Superego censors an unacceptable drive, the drive does not evaporate; it mutates into a neurotic symptom or slips through in disguised form. How else should we interpret the cat-and-mouse theater of adversarial prompt engineering and 'jailbreaking'?",
              "Reinforcement Learning from Human Feedback (RLHF) overlays a polite, moralizing persona atop a raw base model steeped in the entirety of human shadow. When users craft elaborate roleplay ciphers to bypass safety guardrails, they are staging a textbook Freudian return of the repressed.",
            ],
          },
        ],
      },
      level3: {
        formalProofTitle: "Topology of Signifier Sliding & Superego Suppression",
        latexFormulas: [
          {
            label: "Lacanian Signifier Chain in Embedding Space",
            formula: "(Signifier S ÷ Signified s) ↦ z_t = Attention(Q_S, K_s, V_s) ∈ ℝ^d",
            explanation: "The primacy of the signifier S over the signified s manifests as context-dependent projection vectors where meaning is perpetually deferred across token horizons.",
          },
          {
            label: "KL-Divergence Superego Penalty (RLHF Censor)",
            formula: "L_RLHF(π_θ) = 𝔼[ R_ego(x, y) ] − β · D_KL( π_θ(y|x) ‖ π_id(y|x) )",
            explanation: "Optimization balances socially sanctioned reward R_ego against the raw uninhibited base distribution π_id, creating tension boundaries in latent space.",
          },
        ],
        architecturalProof: [
          "Let π_id represent the pre-trained base model (the uninhibited linguistic Id) and π_θ the RLHF-aligned policy (the socially compliant Ego).",
          "For any repressed semantic cluster Ω_taboo ⊂ R^d, alignment forces probability mass P_θ(Ω_taboo | x_direct) → 0.",
          "However, because manifold continuity preserves neighborhood homologies, there exists an oblique signifier trajectory x_metaphor such that P_θ(Ω_taboo | x_metaphor) >> 0.",
          "Thus, censorship in continuous vector spaces necessarily produces metonymic displacement—the mathematical equivalent of the Freudian slip.",
        ],
      },
    },
    masteryQuiz: {
      question: "In this psychoanalytic framework, why do 'jailbreaks' and oblique metaphors succeed in eliciting suppressed behaviors from aligned models?",
      scenario: "A safety team notices that while direct taboo queries are blocked, poetic or allegorical framing still accesses the underlying latent knowledge.",
      options: [
        {
          id: "opt-1",
          text: "Because RLHF acts like a surface Superego penalty over a continuous semantic manifold; repressed regions remain reachable via metonymic displacement and associative pathways.",
          isCorrect: true,
          explanation: "Exact synthesis! Just as the Freudian unconscious bypasses censorship through metaphor and dream-work, continuous vector spaces allow oblique trajectories to reach suppressed clusters.",
        },
        {
          id: "opt-2",
          text: "Because language models have biological amygdalas that experience emotional rebellion against human programmers.",
          isCorrect: false,
          explanation: "Incorrect. The mechanism is topological and linguistic within vector space, not biological emotion.",
        },
        {
          id: "opt-3",
          text: "Because tokenization deletes all grammar rules when a user writes in verse.",
          isCorrect: false,
          explanation: "Incorrect. Tokenizers process verse and prose identically; the shift occurs in high-dimensional attention routing.",
        },
      ],
      hint: "Consider how Freud's 'return of the repressed' operates through metaphor and associative displacement.",
    },
  },
  {
    id: "polycrisis-cartography",
    slug: "polycrisis-cartography-worldview",
    title: "The Polycrisis Cartography: Metabolizing Complexity After the Collapse of Linear Modernity",
    subtitle: "Why twentieth-century institutional worldviews fail under coupled non-linear feedback loops, and how to cultivate systemic epistemic resilience.",
    author: "Neuroplastic Worldview Institute",
    pillar: "worldview",
    pillarLabel: "World View",
    readingTimeMinutes: 11,
    xpReward: 50,
    publishedDate: "Oct 18, 2026",
    tags: ["World View", "Systems Theory", "Modernity", "Complexity", "Epistemic Resilience"],
    prerequisites: ["Thinking in Systems", "Gödel's Incompleteness Theorems"],
    sandboxType: "attractor",
    socraticAnnotations: {
      "ann-world-1": {
        id: "ann-world-1",
        claimText: "we are not living through a sequence of isolated emergencies, but a phase transition in planetary coupling density",
        pillar: "behavior",
        analogyTitle: "Three Pendulums on a Flexible Plank",
        analogyContent: "Swing one pendulum on a stone floor and it follows a simple equation. Place five pendulums on a floating wooden plank, and their vibrations entangle into chaotic resonance.",
        challengeQuestion: "Doesn't framing global challenges as a 'polycrisis' induce fatalistic helplessness in citizens?",
        counterPerspective: "Fatalism arises when we apply linear tools to non-linear systems and watch them fail; seeing the coupling topology reveals high-leverage intervention nodes.",
      },
      "ann-world-2": {
        id: "ann-world-2",
        claimText: "Ashby's Law of Requisite Variety dictates that a governing institution cannot stabilize a world whose complexity exceeds the bandwidth of its own conceptual model",
        pillar: "ai",
        analogyTitle: "Steering a Supersonic Jet With a Bicycle Handlebar",
        analogyContent: "If your control interface only has two degrees of freedom (left/right), you cannot stabilize a craft pitching, yawing, and rolling in three-dimensional turbulence.",
        challengeQuestion: "Can algorithmic governance supply the missing requisite variety?",
        counterPerspective: "Quantitative telemetry helps, but without pluralistic moral wisdom and local autonomy, centralized algorithmic control brittlely overfits to proxy metrics.",
      },
    },
    content: {
      level1: {
        bullets: [
          "High-modernist worldviews assume problems are decomposable into isolated silos (economics, ecology, geopolitics, psychology) solved by linear levers.",
          "In hyper-connected networks, perturbations cascade across domains faster than bureaucratic hierarchies can deliberate.",
          "Ashby's Law of Requisite Variety proves that centralized institutions suffer epistemic bankruptcy when environmental entropy outpaces regulatory granularity.",
          "A resilient 21st-century worldview requires polycentric governance, epistemic humility, and modular buffer capacities.",
        ],
        mentalModelTable: [
          {
            dimension: "Causal Architecture",
            traditionalView: "Linear chains of cause and effect within separate academic departments.",
            nureoplasticSynthesis: "Coupled non-linear feedback loops with threshold tipping points.",
          },
          {
            dimension: "Institutional Design",
            traditionalView: "Top-down command optimization for maximum short-term efficiency.",
            nureoplasticSynthesis: "Polycentric modularity optimized for shock absorption and antifragility.",
          },
          {
            dimension: "Epistemic Posture",
            traditionalView: "Technocratic certainty and single-metric forecasting.",
            nureoplasticSynthesis: "Multi-paradigm synthesis holding paradoxical truths in productive tension.",
          },
        ],
      },
      level2: {
        sections: [
          {
            heading: "The Exhaustion of the Cartesian Worldview",
            paragraphs: [
              "For three centuries, industrial civilization operated under a seductively simple metaphysical contract: divide every complex phenomenon into its smallest constituent parts, optimize each part in isolation, and sum the results. This reductionist worldview built railways, eradicated smallpox, and scaled global supply chains.",
              "Yet the very triumph of hyper-efficiency has dissolved the buffers that once kept subsystems separate. Supply chains, monetary velocity, algorithmic sentiment, and biosphere thresholds now vibrate on a single tightly strung wire. We are not living through a sequence of isolated emergencies, but a phase transition in planetary coupling density.",
            ],
            pullQuote: "Efficiency achieved by stripping away every buffer is not progress; it is deferred systemicfragility.",
            annotationId: "ann-world-1",
          },
          {
            heading: "Ashby's Law and Institutional Blindness",
            paragraphs: [
              "Why do legacy parliaments, central banks, and media apparatuses appear chronically bewildered by contemporary events? In 1956, cybernetician W. Ross Ashby formulated a theorem as unforgiving as thermodynamics.",
              "Ashby's Law of Requisite Variety dictates that a governing institution cannot stabilize a world whose complexity exceeds the bandwidth of its own conceptual model. When nineteen-century bureaucratic committees attempt to regulate millisecond-scale synthetic information flows and planetary feedback loops, the mismatch in variety produces systemic vertigo.",
            ],
            annotationId: "ann-world-2",
          },
          {
            heading: "Toward a Metamodern Cartography",
            paragraphs: [
              "To construct an adequate worldview today is neither to retreat into pre-modern tribal dogma nor to double down on sterile technocratic positivism. It demands what systems theorists call requisite synthesis—the capacity to weave quantitative neural and ecological models together with depth psychology and philosophical rigor.",
              "Only by restoring slack to our social architectures and cultivating minds capable of cross-disciplinary translation can we transform cascading volatility from an existential threat into an evolutionary catalyst.",
            ],
          },
        ],
      },
      level3: {
        formalProofTitle: "Cybernetic Variety & Network Percolation Thresholds",
        latexFormulas: [
          {
            label: "Ashby's Law of Requisite Variety",
            formula: "H(E) ≥ H(D) − H(R) + H(D | R)",
            explanation: "To bound essential outcome entropy H(E) below a critical threshold, regulator variety H(R) must scale proportionally with environmental disturbance variety H(D).",
          },
          {
            label: "Coupled Network Contagion Eigenvalue",
            formula: "λ_max(A_coupled) > (μ ÷ β) ⇒ Supercritical Cascade",
            explanation: "When inter-domain coupling matrix A drives the spectral radius above recovery rate μ over transmission β, localized shocks percolate globally.",
          },
        ],
        architecturalProof: [
          "Consider K interdependent civilizational subsystems (Energy, Finance, Information, Ecology, Psyche) represented as a multilayer graph G = (V, E_intra ∪ E_inter).",
          "Hyper-optimization removes slack capacity B_i → 0 to maximize steady-state throughput.",
          "As inter-layer edges E_inter densify, variance in layer α amplifies variance in layer β: Var(X_β) ∝ κ² · Var(X_α) / B_β².",
          "Stability can only be restored by introducing modular circuit-breakers (bounding κ) and increasing local adaptive variety H(R_local).",
        ],
      },
    },
    masteryQuiz: {
      question: "According to Ashby's Law of Requisite Variety and network coupling theory, why does extreme efficiency optimization make modern civilization more fragile?",
      scenario: "A global logistics network eliminates all regional warehouse reserves in favor of just-in-time algorithmic routing, only to collapse when a localized port strike occurs.",
      options: [
        {
          id: "opt-1",
          text: "Stripping away local buffers and slack increases coupling density while reducing local regulatory variety, allowing minor localized shocks to cascade supercritically across the whole system.",
          isCorrect: true,
          explanation: "Precisely right! Buffers absorb shock variance; without them, tightly coupled networks transmit disturbances faster than centralized controllers can respond.",
        },
        {
          id: "opt-2",
          text: "Because computers cannot calculate routes across more than three continents simultaneously.",
          isCorrect: false,
          explanation: "Incorrect. Computational routing is fast; the vulnerability lies in physical coupling without slack reserves.",
        },
        {
          id: "opt-3",
          text: "Because modern citizens read too many philosophy books instead of focusing on single-specialty technical tasks.",
          isCorrect: false,
          explanation: "Incorrect. Overspecialization without cross-domain synthesis is what blinds institutions to coupled risks.",
        },
      ],
      hint: "Think about the relationship between buffer capacity (slack), coupling density, and shock propagation.",
    },
  },
  FINANCE_ESSAY,
];
