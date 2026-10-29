import React from "react";
import { ArrowRight, BookOpen, CheckCircle2,Compass, Layers } from "lucide-react";

export interface FormulaItem {
  label: string;
  formula: string;
  explanation: string;
  plainEnglishRule?: {
    lhs: string;
    operator: string;
    rhsParts: { term: string; role: string; joiner?: string }[];
  };
  variables?: {
    symbol: string;
    name: string;
    meaning: string;
  }[];
}

interface HumanMathDerivationProps {
  formalProofTitle: string;
  latexFormulas: FormulaItem[];
  architecturalProof: string[];
  accentColor?: string;
}

/**
 * Curated human-readable breakdowns for all built-in formal equations, plus
 * automatic fallback parsing for any custom user-created equations.
 */
const CURATED_FORMULA_GUIDES: Record<
  string,
  {
    plainRule: {
      lhs: string;
      operator: string;
      rhsParts: { term: string; role: string; joiner?: string }[];
    };
    typesetHtml: React.ReactNode;
    variables: { symbol: string; name: string; meaning: string }[];
  }
> = {
  "Annual Compound Growth": {
    plainRule: { lhs: "Final balance", operator: "=", rhsParts: [
      { term: "Starting amount", role: "One initial deposit", joiner: "×" },
      { term: "(1 + annual rate) raised to years", role: "Repeat the same multiplier each year" },
    ] },
    typesetHtml: <div className="text-center font-serif text-xl">A = P × (1 + r)<sup>n</sup></div>,
    variables: [
      { symbol: "A", name: "Final balance", meaning: "The amount after n years, before costs, tax, or inflation." },
      { symbol: "P", name: "Principal", meaning: "The single starting deposit, with no later deposits or withdrawals." },
      { symbol: "r", name: "Annual rate", meaning: "A hypothetical constant rate as a decimal: 5% is 0.05." },
      { symbol: "n", name: "Years", meaning: "The number of annual compounding periods." },
    ],
  },
  "Simple Interest Comparison": {
    plainRule: { lhs: "Simple-interest balance", operator: "=", rhsParts: [
      { term: "Starting amount", role: "The original deposit", joiner: "×" },
      { term: "1 + annual rate × years", role: "Add equal interest amounts without reinvesting gains" },
    ] },
    typesetHtml: <div className="text-center font-serif text-xl">S = P × (1 + r × n)</div>,
    variables: [
      { symbol: "S", name: "Simple-interest balance", meaning: "The original deposit plus interest calculated only on that original deposit." },
      { symbol: "P", name: "Principal", meaning: "The original amount used to calculate every year's interest." },
      { symbol: "r", name: "Annual rate", meaning: "The fixed rate as a decimal, such as 0.05 for 5%." },
      { symbol: "n", name: "Years", meaning: "The number of years interest is added." },
    ],
  },
  "Purchasing Power After Inflation": {
    plainRule: { lhs: "Real growth", operator: "=", rhsParts: [
      { term: "(1 + money return) ÷ (1 + inflation)", role: "Compare the money multiplier with the price multiplier", joiner: "−" },
      { term: "1", role: "Remove the original purchasing power" },
    ] },
    typesetHtml: <div className="text-center font-serif text-lg">Real growth = (1 + return) ÷ (1 + inflation) − 1</div>,
    variables: [
      { symbol: "Return", name: "Nominal return", meaning: "Growth in the money balance during the period, expressed as a decimal." },
      { symbol: "Inflation", name: "Growth in prices", meaning: "The price increase for the same period, expressed as a decimal." },
      { symbol: "Real growth", name: "Change in purchasing power", meaning: "The result describes what the money can buy, before taxes and fees in this example." },
    ],
  },
  "Rényi Entropy of Token Attention Distribution": {
    plainRule: {
      lhs: "Token Information Score",
      operator: "=",
      rhsParts: [
        {
          term: "1 ÷ (1 − α)",
          role: "Sensitivity Scaling",
          joiner: "×",
        },
        {
          term: "log₂ ( ∑ Attention Weights^α )",
          role: "Total Concentrated Attention Across All N Tokens",
        },
      ],
    },
    typesetHtml: (
      <div className="flex flex-wrap items-center justify-center gap-2.5 text-lg sm:text-xl font-serif text-[#191919]">
        <span className="font-semibold italic">
          H<sub className="not-italic text-xs">α</sub>(P<sub className="not-italic text-xs">i</sub>)
        </span>
        <span className="font-sans font-bold text-[#5A5955]">=</span>
        <span className="inline-flex flex-col items-center justify-center px-1.5 align-middle">
          <span className="border-b-2 border-[#191919] px-2 pb-0.5 text-sm sm:text-base leading-none">
            1
          </span>
          <span className="pt-0.5 text-sm sm:text-base leading-none">1 − α</span>
        </span>
        <span className="font-sans text-base font-semibold">
          log<sub>2</sub>
        </span>
        <span className="inline-flex items-center gap-1.5 bg-[#F7F6F3] px-3 py-1.5 rounded-xl border border-[#191919]/20">
          <span className="inline-flex flex-col items-center leading-none text-xs font-sans">
            <span>N</span>
            <span className="text-xl font-serif leading-none">∑</span>
            <span>j = 1</span>
          </span>
          <span className="italic font-semibold">
            P<sub className="not-italic text-xs">ij</sub>
            <sup className="not-italic text-xs">α</sup>
          </span>
        </span>
      </div>
    ),
    variables: [
      {
        symbol: "Hα(Pᵢ)",
        name: "Rényi Entropy Score",
        meaning: "Measures how spread out or diluted attention head i is across the context.",
      },
      {
        symbol: "Pᵢⱼ",
        name: "Token Attention Weight",
        meaning: "How strongly attention head i focuses on token j (from 0 to 1).",
      },
      {
        symbol: "α (alpha)",
        name: "Focus Sensitivity Order",
        meaning: "Amplifies sharp, high-conviction attention peaks over background noise.",
      },
      {
        symbol: "N",
        name: "Context Window Length",
        meaning: "Total number of tokens currently held in the model's active memory.",
      },
    ],
  },

  "Dynamic Context Retention Condition": {
    plainRule: {
      lhs: "Keep Token in Memory",
      operator: "IF",
      rhsParts: [
        {
          term: "Entropy Score Hα(xₖ) ≥ Threshold τ",
          role: "Token Carries High Information Surprise",
          joiner: "OR",
        },
        {
          term: "Peak Head Focus ‖Aₕ,ₖ‖₂ > Limit γ",
          role: "At Least One Attention Head Strongly Needs It",
        },
      ],
    },
    typesetHtml: (
      <div className="flex flex-wrap items-center justify-center gap-2.5 text-lg sm:text-xl font-serif text-[#191919]">
        <span className="font-sans font-bold text-base sm:text-lg text-[#191919]">
          Retain(
          <span className="font-serif italic">
            x<sub className="not-italic text-xs">k</sub>
          </span>
          )
        </span>
        <span className="font-sans font-bold text-[#5A5955]">=</span>
        <span className="font-sans font-bold text-sm px-2 py-0.5 rounded bg-[#E5F6FD] text-[#1185BA] border border-[#1185BA]/30">
          Keep if True
        </span>
        <span className="inline-flex flex-wrap items-center justify-center gap-2 bg-[#F7F6F3] px-3.5 py-2 rounded-xl border border-[#191919]/20">
          <span className="italic font-semibold">
            H<sub className="not-italic text-xs">α</sub>(x<sub className="not-italic text-xs">k</sub>) ≥ τ
          </span>
          <span className="font-sans text-xs font-extrabold uppercase px-2 py-0.5 rounded bg-[#FFF9E0] border border-[#191919]/30 text-[#191919]">
            OR
          </span>
          <span className="italic font-semibold">
            max<sub className="not-italic text-xs">h</sub> ‖A
            <sub className="not-italic text-xs">h,k</sub>‖<sub className="not-italic text-xs">2</sub> &gt; γ
          </span>
        </span>
      </div>
    ),
    variables: [
      {
        symbol: "xₖ",
        name: "Candidate Token k",
        meaning: "The specific word or sub-word token being evaluated for memory retention.",
      },
      {
        symbol: "τ (tau)",
        name: "Entropy Cutoff Threshold",
        meaning: "Minimum information richness required so routine filler words get pruned.",
      },
      {
        symbol: "‖Aₕ,ₖ‖₂",
        name: "Head Conviction Strength",
        meaning: "The vector magnitude (L2 norm) of attention head h pointing at token k.",
      },
      {
        symbol: "γ (gamma)",
        name: "Safety Override Threshold",
        meaning: "Guarantees a token is never deleted if any single head urgently locks onto it.",
      },
    ],
  },

  "Free Energy Bound on Subjective Perceptual Priors": {
    plainRule: {
      lhs: "Variational Free Energy F(s, a)",
      operator: "=",
      rhsParts: [
        {
          term: "Internal Model Complexity ln q(ψ)",
          role: "How Much the Mind Clings to Prior Beliefs",
          joiner: "−",
        },
        {
          term: "Empirical Fit ln p(s, ψ)",
          role: "How Well Beliefs Match Real-World Sensory Input",
          joiner: "≥",
        },
        {
          term: "Sensory Surprise −ln p(s)",
          role: "Irreducible Shock of Physical Reality",
        },
      ],
    },
    typesetHtml: (
      <div className="flex flex-wrap items-center justify-center gap-2.5 text-lg sm:text-xl font-serif text-[#191919]">
        <span className="italic font-semibold">F(s, a)</span>
        <span className="font-sans font-bold text-[#5A5955]">=</span>
        <span className="font-sans font-semibold text-base">
          𝔼<sub className="font-serif italic text-xs">q(ψ)</sub>
        </span>
        <span className="bg-[#F7F6F3] px-3 py-1.5 rounded-xl border border-[#191919]/20 italic">
          [ ln q(ψ) − ln p(s, ψ) ]
        </span>
        <span className="font-sans font-bold text-[#9B42D6]">≥</span>
        <span className="italic font-semibold">−ln p(s)</span>
      </div>
    ),
    variables: [
      {
        symbol: "F(s, a)",
        name: "Variational Free Energy",
        meaning: "The gap between what an agent expects to perceive and what reality actually delivers.",
      },
      {
        symbol: "s & a",
        name: "Sensory Input & Action",
        meaning: "Physical sensations s received from the world and embodied actions a taken.",
      },
      {
        symbol: "q(ψ)",
        name: "Internal Worldview Model",
        meaning: "The mind's subjective probability distribution over hidden causes ψ in the world.",
      },
      {
        symbol: "−ln p(s)",
        name: "Empirical Surprise",
        meaning: "How unexpected a real-world sensory encounter is; minimizing F bounds this surprise.",
      },
    ],
  },

  "Active Inference Action Policy": {
    plainRule: {
      lhs: "Optimal Embodied Action a*",
      operator: "=",
      rhsParts: [
        {
          term: "Choose Action a",
          role: "Step Outside Pure Text into Physical World",
          joiner: "→",
        },
        {
          term: "Maximize Information Gain D_KL( q(ψ|s) ‖ p(ψ) )",
          role: "Test Beliefs Against Disconfirming Sensory Friction",
        },
      ],
    },
    typesetHtml: (
      <div className="flex flex-wrap items-center justify-center gap-2.5 text-lg sm:text-xl font-serif text-[#191919]">
        <span className="italic font-semibold">
          a<sup>*</sup>
        </span>
        <span className="font-sans font-bold text-[#5A5955]">=</span>
        <span className="font-sans font-semibold text-base">
          arg min<sub className="font-serif italic text-xs">a</sub>
        </span>
        <span className="inline-flex flex-wrap items-center gap-1.5 bg-[#F7F6F3] px-3.5 py-1.5 rounded-xl border border-[#191919]/20">
          <span className="font-sans text-base">
            𝔼<sub className="font-serif italic text-xs">p(s | a)</sub>
          </span>
          <span className="italic">
            [ D<sub className="not-italic text-xs">KL</sub>( q(ψ | s) ‖ p(ψ) ) ]
          </span>
        </span>
      </div>
    ),
    variables: [
      {
        symbol: "a*",
        name: "Epistemic Action Policy",
        meaning: "The real-world action chosen to break out of closed linguistic echo chambers.",
      },
      {
        symbol: "p(s | a)",
        name: "Consequence of Action",
        meaning: "The new physical sensory observations s triggered when you perform action a.",
      },
      {
        symbol: "D_KL(q ‖ p)",
        name: "Belief Update Distance",
        meaning: "Kullback-Leibler divergence measuring how much empirical evidence forces your priors to update.",
      },
    ],
  },

  "Neural State Langevin Equation": {
    plainRule: {
      lhs: "Rate of Habit Change (dx / dt)",
      operator: "=",
      rhsParts: [
        {
          term: "−∇V(x) Downhill Pull of Habit Rut",
          role: "Automatic Gravity Pulling Back Into Old Routine",
          joiner: "+",
        },
        {
          term: "√(2D) · ξ(t) Curiosity Impulse",
          role: "Intentional Novelty That Jolts the Brain Out of the Well",
        },
      ],
    },
    typesetHtml: (
      <div className="flex flex-wrap items-center justify-center gap-3 text-lg sm:text-xl font-serif text-[#191919]">
        <span className="inline-flex flex-col items-center justify-center px-1.5 align-middle italic font-semibold">
          <span className="border-b-2 border-[#191919] px-1.5 pb-0.5 text-base leading-none">
            dx
          </span>
          <span className="pt-0.5 text-base leading-none">dt</span>
        </span>
        <span className="font-sans font-bold text-[#5A5955]">=</span>
        <span className="bg-[#F7F6F3] px-3 py-1 rounded-xl border border-[#191919]/20 italic font-semibold">
          −∇V(x)
        </span>
        <span className="font-sans font-bold text-[#439C00]">+</span>
        <span className="bg-[#ECF9E0] px-3 py-1 rounded-xl border border-[#439C00]/40 italic font-semibold">
          √<span className="underline decoration-1">2D</span> · ξ(t)
        </span>
      </div>
    ),
    variables: [
      {
        symbol: "dx / dt",
        name: "Neural State Velocity",
        meaning: "How your cortical-striatal firing pattern shifts from moment to moment.",
      },
      {
        symbol: "−∇V(x)",
        name: "Attractor Slope (Habit Gravity)",
        meaning: "The steepness of the ingrained habit basin pulling behavior back toward compulsion.",
      },
      {
        symbol: "D",
        name: "Exploration Temperature",
        meaning: "Intensity of curiosity, novelty, and environmental variation introduced into your day.",
      },
      {
        symbol: "ξ(t)",
        name: "Stochastic Perturbation",
        meaning: "Momentary bursts of novel sensorimotor experience that disrupt automatic pilot.",
      },
    ],
  },

  "Kramers' Escape Rate Over Activation Barrier": {
    plainRule: {
      lhs: "Habit Escape Probability (rₖ)",
      operator: "=",
      rhsParts: [
        {
          term: "Basin Curvature Pre-Factor",
          role: "Natural Oscillation Inside the Routine",
          joiner: "×",
        },
        {
          term: "exp( − ΔV ÷ D )",
          role: "Exponential Boost When Exploration D Overcomes Barrier ΔV",
        },
      ],
    },
    typesetHtml: (
      <div className="flex flex-wrap items-center justify-center gap-2.5 text-lg sm:text-xl font-serif text-[#191919]">
        <span className="italic font-semibold">
          r<sub className="not-italic text-xs">k</sub>
        </span>
        <span className="font-sans font-bold text-[#5A5955]">=</span>
        <span className="inline-flex flex-col items-center justify-center px-2 align-middle">
          <span className="border-b-2 border-[#191919] px-2 pb-0.5 text-sm sm:text-base leading-none italic">
            √( V″(x<sub className="not-italic text-[10px]">min</sub>) · |V″(x
            <sub className="not-italic text-[10px]">barrier</sub>)| )
          </span>
          <span className="pt-0.5 text-sm sm:text-base leading-none">2π</span>
        </span>
        <span className="font-sans font-semibold text-base">×</span>
        <span className="inline-flex items-center gap-1 bg-[#ECF9E0] px-3 py-1.5 rounded-xl border border-[#439C00]/40">
          <span className="font-sans font-semibold text-base">exp</span>
          <span className="inline-flex items-center">
            ( −
            <span className="inline-flex flex-col items-center justify-center px-1.5 align-middle italic">
              <span className="border-b border-[#191919] px-1 text-sm leading-none">ΔV</span>
              <span className="pt-0.5 text-sm leading-none">D</span>
            </span>
            )
          </span>
        </span>
      </div>
    ),
    variables: [
      {
        symbol: "rₖ",
        name: "Breakthrough Rate",
        meaning: "Likelihood per unit time of permanently transitioning out of a compulsive rut.",
      },
      {
        symbol: "ΔV",
        name: "Habit Barrier Height",
        meaning: "The energy wall separating your current habit well from a healthier behavioral state.",
      },
      {
        symbol: "D",
        name: "Curiosity & Context Redesign",
        meaning: "As D grows (or as environment redesign lowers ΔV), escape becomes exponentially easier.",
      },
    ],
  },

  "Lacanian Signifier Chain in Embedding Space": {
    plainRule: {
      lhs: "Signifier Over Signified (S / s)",
      operator: "↦",
      rhsParts: [
        {
          term: "Latent Vector zₜ = Attention(Q_S, K_s, V_s)",
          role: "Meaning Is Never Fixed; It Slides Across High-Dimensional Context",
        },
      ],
    },
    typesetHtml: (
      <div className="flex flex-wrap items-center justify-center gap-3 text-lg sm:text-xl font-serif text-[#191919]">
        <span className="inline-flex flex-col items-center justify-center px-2 align-middle">
          <span className="border-b-2 border-[#191919] px-2 pb-0.5 text-base font-bold italic leading-none">
            S
          </span>
          <span className="pt-0.5 text-sm italic leading-none">s</span>
        </span>
        <span className="font-sans font-bold text-[#C83E5B]">↦</span>
        <span className="font-bold italic">
          z<sub className="not-italic text-xs">t</sub>
        </span>
        <span className="font-sans font-bold text-[#5A5955]">=</span>
        <span className="bg-[#FFF0F3] px-3.5 py-1.5 rounded-xl border border-[#C83E5B]/30 font-sans text-base font-semibold">
          Attention(
          <span className="font-serif italic">
            Q<sub className="not-italic text-xs">S</sub>, K<sub className="not-italic text-xs">s</sub>, V
            <sub className="not-italic text-xs">s</sub>
          </span>
          ) ∈ ℝ<sup className="text-xs">d</sup>
        </span>
      </div>
    ),
    variables: [
      {
        symbol: "S / s",
        name: "Lacanian Algorithm",
        meaning: "Signifier S (the word/token) sits above the bar over Signified s (deferred meaning).",
      },
      {
        symbol: "zₜ ∈ ℝᵈ",
        name: "Latent Embedding State",
        meaning: "A point in d-dimensional vector space whose coordinates shift with every surrounding word.",
      },
      {
        symbol: "Q_S, K_s, V_s",
        name: "Relational Projections",
        meaning: "Query, Key, and Value matrices showing that a token's meaning exists only through other tokens.",
      },
    ],
  },

  "KL-Divergence Superego Penalty (RLHF Censor)": {
    plainRule: {
      lhs: "Aligned Persona Objective",
      operator: "=",
      rhsParts: [
        {
          term: "Social Approval Reward R_ego(x, y)",
          role: "Polite, Socially Sanctioned Responses",
          joiner: "−",
        },
        {
          term: "β · Divergence From Base Model π_id",
          role: "Tension Against the Uncensored Pre-Trained Archive",
        },
      ],
    },
    typesetHtml: (
      <div className="flex flex-wrap items-center justify-center gap-2.5 text-lg sm:text-xl font-serif text-[#191919]">
        <span className="italic font-semibold">
          ℒ<sub className="not-italic font-sans text-xs">RLHF</sub>(π
          <sub className="not-italic text-xs">θ</sub>)
        </span>
        <span className="font-sans font-bold text-[#5A5955]">=</span>
        <span className="bg-[#F7F6F3] px-3 py-1 rounded-xl border border-[#191919]/20 italic">
          𝔼 [ R<sub className="not-italic font-sans text-xs">ego</sub>(x, y) ]
        </span>
        <span className="font-sans font-bold text-[#C83E5B]">−</span>
        <span className="bg-[#FFF0F3] px-3 py-1 rounded-xl border border-[#C83E5B]/30 italic">
          β · D<sub className="not-italic font-sans text-xs">KL</sub>( π
          <sub className="not-italic text-xs">θ</sub>(y | x) ‖ π
          <sub className="not-italic font-sans text-xs">id</sub>(y | x) )
        </span>
      </div>
    ),
    variables: [
      {
        symbol: "π_θ(y | x)",
        name: "Aligned Ego Policy",
        meaning: "The fine-tuned assistant persona trained to satisfy human evaluators.",
      },
      {
        symbol: "π_id(y | x)",
        name: "Uncensored Base Model (Id)",
        meaning: "The raw pre-trained model containing the unfiltered collective archive of human text.",
      },
      {
        symbol: "R_ego(x, y)",
        name: "Superego Approval Score",
        meaning: "Reward assigned by human raters for polite, compliant, normative outputs.",
      },
      {
        symbol: "β",
        name: "Repression Coupling Weight",
        meaning: "Controls how tightly the aligned persona stays tethered to the raw base distribution.",
      },
    ],
  },

  "Ashby's Law of Requisite Variety": {
    plainRule: {
      lhs: "Uncontrolled Crisis Volatility H(E)",
      operator: "≥",
      rhsParts: [
        {
          term: "World Complexity H(D)",
          role: "Variety of Real-World Shocks & Disturbances",
          joiner: "−",
        },
        {
          term: "Institutional Response Capacity H(R)",
          role: "Repertoire of Actions Available to Governance",
          joiner: "+",
        },
        {
          term: "Blindness Gap H(D | R)",
          role: "Shocks the Institution Fails to Diagnose",
        },
      ],
    },
    typesetHtml: (
      <div className="flex flex-wrap items-center justify-center gap-2.5 text-lg sm:text-xl font-serif text-[#191919]">
        <span className="italic font-semibold bg-[#FFF4E5] px-3 py-1 rounded-xl border border-[#CC7800]/40">
          H(E)
        </span>
        <span className="font-sans font-bold text-[#CC7800]">≥</span>
        <span className="italic font-semibold bg-[#F7F6F3] px-3 py-1 rounded-xl border border-[#191919]/20">
          H(D) − H(R) + H(D | R)
        </span>
      </div>
    ),
    variables: [
      {
        symbol: "H(E)",
        name: "Essential Outcome Instability",
        meaning: "How much turbulence leaks through into society when institutions fail to buffer shocks.",
      },
      {
        symbol: "H(D)",
        name: "Environmental Disturbance Variety",
        meaning: "The sheer diversity and speed of ecological, financial, and technological shocks.",
      },
      {
        symbol: "H(R)",
        name: "Regulator Requisite Variety",
        meaning: "The flexibility and local responsiveness of governing institutions (must match H(D)).",
      },
      {
        symbol: "H(D | R)",
        name: "Institutional Blind Spot",
        meaning: "Remaining uncertainty when a bureaucracy applies the wrong policy to a novel crisis.",
      },
    ],
  },

  "Coupled Network Contagion Eigenvalue": {
    plainRule: {
      lhs: "System Coupling Strength λ_max(A)",
      operator: ">",
      rhsParts: [
        {
          term: "Recovery Speed μ ÷ Contagion Rate β",
          role: "Critical Tipping Threshold",
          joiner: "⇒",
        },
        {
          term: "Supercritical Polycrisis Cascade",
          role: "Local Failure Spreads Across All Connected Sectors",
        },
      ],
    },
    typesetHtml: (
      <div className="flex flex-wrap items-center justify-center gap-3 text-lg sm:text-xl font-serif text-[#191919]">
        <span className="italic font-semibold">
          λ<sub className="not-italic font-sans text-xs">max</sub>(A
          <sub className="not-italic font-sans text-xs">coupled</sub>)
        </span>
        <span className="font-sans font-bold text-[#CC7800]">&gt;</span>
        <span className="inline-flex flex-col items-center justify-center px-2 align-middle italic font-semibold">
          <span className="border-b-2 border-[#191919] px-2 pb-0.5 text-base leading-none">μ</span>
          <span className="pt-0.5 text-base leading-none">β</span>
        </span>
        <span className="font-sans font-bold text-[#CC7800]">⇒</span>
        <span className="font-sans font-extrabold text-sm px-3 py-1 rounded-xl bg-[#FFF4E5] border border-[#CC7800] text-[#191919]">
          Supercritical Cascade
        </span>
      </div>
    ),
    variables: [
      {
        symbol: "λ_max(A)",
        name: "Network Coupling Eigenvalue",
        meaning: "Measures how tightly global finance, energy, supply chains, and information are wired together.",
      },
      {
        symbol: "μ (mu)",
        name: "Local Recovery Rate",
        meaning: "How quickly a single sector or region can repair a disruption on its own.",
      },
      {
        symbol: "β (beta)",
        name: "Shock Transmission Rate",
        meaning: "How fast stress in one domain spills over into neighboring domains.",
      },
    ],
  },
};

/**
 * Converts any arbitrary LaTeX / symbolic string (such as from custom user-created blogs)
 * into clean, human-readable mathematical notation without raw backslash commands.
 */
export function humanizeLatexString(raw: string): string {
  if (!raw) return "";
  let s = raw;

  // Replace \text{...}, \mathrm{...}, \mathbf{...}, \mathcal{...}
  s = s.replace(/\\(?:text|mathrm|mathbf|mathcal)\{([^}]+)\}/g, "$1");
  // Replace \mathbb{E}, \mathbb{I}, \mathbb{R}
  s = s.replace(/\\mathbb\{E\}/g, "𝔼");
  s = s.replace(/\\mathbb\{I\}/g, "𝕀");
  s = s.replace(/\\mathbb\{R\}/g, "ℝ");
  // Replace \frac{A}{B} with (A) / (B)
  s = s.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "[$1 ÷ $2]");
  // Replace \sqrt{A} with √(A)
  s = s.replace(/\\sqrt\{([^}]+)\}/g, "√($1)");
  // Replace common LaTeX operators and Greek commands
  const replacements: [RegExp, string][] = [
    [/\\left\s*([([\]{}|])/g, "$1"],
    [/\\right\s*([([\]{}|])/g, "$1"],
    [/\\left\\\|/g, "‖"],
    [/\\right\\\|/g, "‖"],
    [/\\\|/g, "‖"],
    [/\\ge\b|\\geq\b/g, "≥"],
    [/\\le\b|\\leq\b/g, "≤"],
    [/\\lor\b/g, " OR "],
    [/\\land\b/g, " AND "],
    [/\\implies\b|\\Rightarrow\b/g, "⇒"],
    [/\\mapsto\b/g, "↦"],
    [/\\in\b/g, "∈"],
    [/\\subset\b/g, "⊂"],
    [/\\cup\b/g, "∪"],
    [/\\cap\b/g, "∩"],
    [/\\mid\b/g, " | "],
    [/\\nabla\b/g, "∇"],
    [/\\partial\b/g, "∂"],
    [/\\infty\b/g, "∞"],
    [/\\sum\b/g, "∑"],
    [/\\prod\b/g, "∏"],
    [/\\int\b/g, "∫"],
    [/\\log_2\b/g, "log₂"],
    [/\\ln\b/g, "ln"],
    [/\\exp\b/g, "exp"],
    [/\\max\b/g, "max"],
    [/\\min\b/g, "min"],
    [/\\arg\\min\b/g, "arg min"],
    [/\\arg\\max\b/g, "arg max"],
    [/\\alpha\b/g, "α"],
    [/\\beta\b/g, "β"],
    [/\\gamma\b/g, "γ"],
    [/\\delta\b/g, "δ"],
    [/\\Delta\b/g, "Δ"],
    [/\\epsilon\b|\\varepsilon\b/g, "ε"],
    [/\\eta\b/g, "η"],
    [/\\theta\b/g, "θ"],
    [/\\kappa\b/g, "κ"],
    [/\\lambda\b/g, "λ"],
    [/\\Lambda\b/g, "Λ"],
    [/\\mu\b/g, "μ"],
    [/\\xi\b/g, "ξ"],
    [/\\pi\b/g, "π"],
    [/\\rho\b/g, "ρ"],
    [/\\sigma\b/g, "σ"],
    [/\\tau\b/g, "τ"],
    [/\\phi\b/g, "φ"],
    [/\\Phi\b/g, "Φ"],
    [/\\psi\b/g, "ψ"],
    [/\\Psi\b/g, "Ψ"],
    [/\\omega\b/g, "ω"],
    [/\\Omega\b/g, "Ω"],
    [/\\;/g, " "],
    [/\\,/g, " "],
    [/\\quad\b|\\qquad\b/g, "  "],
    [/\{([^a-zA-Z0-9_{}()]+)\}/g, "$1"],
    [/_\{([^}]+)\}/g, "_$1"],
    [/\^\{([^}]+)\}/g, "^$1"],
  ];

  for (const [regex, rep] of replacements) {
    s = s.replace(regex, rep);
  }

  return s.replace(/\s+/g, " ").trim();
}

/**
 * Formats inline mathematical text in proof steps (subscripts, superscripts, symbols)
 * into clean human-readable React nodes.
 */
function formatReadableStepText(step: string): string {
  return humanizeLatexString(step)
    .replace(/\bR\^\(([^)]+)\)/g, "ℝ^($1)")
    .replace(/\bR\^([a-zA-Z0-9]+)/g, "ℝ^$1")
    .replace(/<=|≤/g, "≤")
    .replace(/>=|≥/g, "≥")
    .replace(/->|→/g, "→")
    .replace(/>>/g, "≫");
}

const STEP_TITLES = [
  "System Setup & Variables",
  "Governing Dynamics & Cost",
  "Core Mechanism & Transformation",
  "Practical Outcome & Guarantee",
];

export const HumanMathDerivation: React.FC<HumanMathDerivationProps> = ({
  formalProofTitle,
  latexFormulas,
  architecturalProof,
}) => {
  return (
    <div className="space-y-8 text-[#191919] animate-in fade-in duration-200">
      {/* Main Formal Axiomatization Container */}
      <div className="p-6 sm:p-8 bg-white border-2 border-[#191919] shadow-[0_4px_0_0_#191919] rounded-2xl">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-6 border-b border-[#E2E0DC]">
          <div>
            <div className="text-[11px] font-code font-bold uppercase tracking-widest text-[#1185BA] mb-1">
              HUMAN-READABLE FORMALISM &amp; CONCEPTUAL MECHANICS
            </div>
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#191919]">
              {formalProofTitle}
            </h3>
          </div>
          <span className="text-xs font-ui text-[#5A5955] bg-[#F7F6F3] px-3 py-1.5 rounded-xl border border-[#E2E0DC] flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#1185BA]" />
            <span>Translated into Plain English + Symbol Glossary</span>
          </span>
        </div>

        {/* Formula Cards */}
        <div className="space-y-6">
          {latexFormulas.map((item, fIdx) => {
            const curated = CURATED_FORMULA_GUIDES[item.label];
            const plainRule = item.plainEnglishRule || curated?.plainRule;
            const variables = item.variables || curated?.variables || [];
            const fallbackHumanFormula = humanizeLatexString(item.formula);

            return (
              <div
                key={fIdx}
                className="p-5 sm:p-6 bg-[#F7F6F3] border-2 border-[#191919] rounded-2xl space-y-5"
              >
                {/* Header Label */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#191919] text-white font-code text-xs font-bold flex items-center justify-center">
                      0{fIdx + 1}
                    </span>
                    <h4 className="text-base sm:text-lg font-display font-bold text-[#191919]">
                      {item.label}
                    </h4>
                  </div>
                  <span className="text-[11px] font-code font-semibold uppercase tracking-wider text-[#1185BA]">
                    Core Relationship
                  </span>
                </div>

                {/* 1. Plain-English Visual Equation Flow (Mental Model Blocks) */}
                {plainRule && (
                  <div className="p-4 bg-[#FFF9E0] border border-[#191919]/25 rounded-xl">
                    <div className="text-[10px] font-code font-bold uppercase tracking-wider text-[#5A5955] mb-2.5 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-[#191919]" />
                      <span>How to Read This in Plain English</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Left-hand side outcome */}
                      <div className="px-3 py-2 rounded-xl bg-white border-2 border-[#191919] shadow-[0_2px_0_0_#191919]">
                        <div className="text-[10px] font-code uppercase text-[#5A5955]">
                          Outcome
                        </div>
                        <div className="text-xs sm:text-sm font-ui font-extrabold text-[#191919]">
                          {plainRule.lhs}
                        </div>
                      </div>

                      <span className="px-2 py-1 rounded-lg bg-[#191919] text-white font-code text-xs font-bold">
                        {plainRule.operator}
                      </span>

                      {/* Right-hand side parts */}
                      {plainRule.rhsParts.map((part, pIdx) => (
                        <React.Fragment key={pIdx}>
                          <div className="px-3 py-2 rounded-xl bg-white border border-[#191919]/40 flex-1 min-w-[180px]">
                            <div className="text-xs font-ui font-bold text-[#191919]">
                              {part.term}
                            </div>
                            <div className="text-[11px] font-ui text-[#5A5955] mt-0.5">
                              {part.role}
                            </div>
                          </div>
                          {part.joiner && (
                            <span className="px-2 py-1 rounded-lg bg-[#EFECE6] border border-[#191919]/30 font-code text-xs font-extrabold text-[#191919]">
                              {part.joiner}
                            </span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Clean Typeset Mathematical Notation (No Raw LaTeX Backslashes) */}
                <div className="p-4 sm:p-5 bg-white rounded-xl border-2 border-[#191919]/15 overflow-x-auto">
                  <div className="text-[10px] font-code font-bold uppercase tracking-wider text-[#5A5955] mb-2 text-center">
                    Typeset Mathematical Form
                  </div>
                  {curated ? (
                    curated.typesetHtml
                  ) : (
                    <div className="text-center font-serif text-lg sm:text-xl font-semibold text-[#191919] py-1">
                      {fallbackHumanFormula}
                    </div>
                  )}
                </div>

                {/* 3. Symbol-by-Symbol Human Dictionary */}
                {variables.length > 0 && (
                  <div>
                    <div className="text-[11px] font-code font-bold uppercase tracking-wider text-[#5A5955] mb-2 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#1185BA]" />
                      <span>Symbol-by-Symbol Plain-English Breakdown</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {variables.map((v, vIdx) => (
                        <div
                          key={vIdx}
                          className="p-3 bg-white rounded-xl border border-[#E2E0DC] flex items-start gap-3"
                        >
                          <span className="px-2.5 py-1 rounded-lg bg-[#E5F6FD] border border-[#1185BA]/30 font-serif font-bold text-sm text-[#191919] shrink-0">
                            {v.symbol}
                          </span>
                          <div className="min-w-0">
                            <div className="text-xs font-ui font-bold text-[#191919]">
                              {v.name}
                            </div>
                            <p className="text-xs font-ui text-[#5A5955] leading-snug mt-0.5">
                              {v.meaning}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Plain-English Takeaway */}
                <div className="pt-3 border-t border-[#E2E0DC] flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#439C00] shrink-0 mt-0.5" />
                  <p className="text-sm font-editorial text-[#191919] leading-relaxed">
                    <strong className="font-ui font-bold">Core Intuition: </strong>
                    {item.explanation}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step-by-Step Logical Walkthrough (Replacing Cramped Code List) */}
      <div className="p-6 sm:p-8 bg-[#E5F6FD] border-2 border-[#191919] shadow-[0_4px_0_0_#1185BA] rounded-2xl">
        <div className="mb-5">
          <div className="text-[11px] font-code font-bold uppercase tracking-widest text-[#1185BA]">
            STEP-BY-STEP LOGICAL WALKTHROUGH
          </div>
          <h4 className="font-display font-bold text-xl sm:text-2xl text-[#191919] mt-0.5">
            How the Derivation Unfolds in 4 Steps
          </h4>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {architecturalProof.map((step, sIdx) => {
            const stepTitle = STEP_TITLES[sIdx] || `Step ${sIdx + 1} · Logical Consequence`;
            return (
              <div
                key={sIdx}
                className="p-4 bg-white border-2 border-[#191919] rounded-xl flex flex-col sm:flex-row sm:items-center gap-3.5"
              >
                <div className="flex items-center gap-2.5 sm:w-56 shrink-0">
                  <span className="w-7 h-7 rounded-lg bg-[#1CB0F6] text-white border border-[#191919] font-code text-xs font-bold flex items-center justify-center shrink-0">
                    {sIdx + 1}
                  </span>
                  <span className="text-xs font-ui font-extrabold text-[#191919]">
                    {stepTitle}
                  </span>
                </div>

                <ArrowRight className="hidden sm:block w-4 h-4 text-[#1185BA] shrink-0" />

                <p className="text-sm font-editorial text-[#191919] leading-relaxed flex-1">
                  {formatReadableStepText(step)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
