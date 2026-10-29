import React, { useState } from "react";
import { NotionMascot } from "./NotionMascot.tsx";
import { EssayItem, PILLAR_METADATA, PillarId } from "../data/essays.ts";
import { ArrowRight, BookOpen, Quote, Sparkles } from "lucide-react";

interface SynapseGraph2DProps {
  essays: EssayItem[];
  onSelectEssay: (id: string) => void;
  masteredEssays: string[];
}

const DOMAIN_ORDER: PillarId[] = [
  "philosophy",
  "worldview",
  "psychology",
  "ai",
  "psychoanalysis",
];

const DIALECTICAL_DIALOGUES: Record<
  PillarId,
  { thinker: string; maxim: string; interlocutor: string; tension: string }
> = {
  philosophy: {
    thinker: "Socrates",
    maxim: "MAIEUTIKÉ (Epistemic Midwifery)",
    interlocutor: "Claude Shannon",
    tension:
      "When synthetic models mirror our own language games, only Socratic elenchus and embodied consequence can distinguish wisdom from fluent simulation.",
  },
  worldview: {
    thinker: "Aristotle",
    maxim: "P → Q (First-Principles Causality)",
    interlocutor: "Ibn Khaldun",
    tension:
      "Civilizational resilience requires moving from brittle linear optimization to modular, polycentric governance capable of absorbing non-linear shocks.",
  },
  psychology: {
    thinker: "Plato",
    maxim: "EIDOS & Allegory of the Basin",
    interlocutor: "William James",
    tension:
      "Habit loops act as energetic chains inside the prefrontal cave; escaping local dopamine basins demands deliberate stochastic activation energy.",
  },
  ai: {
    thinker: "Claude Shannon",
    maxim: "H(X) = -Σ P(x) log P(x)",
    interlocutor: "Ludwig Wittgenstein",
    tension:
      "Information entropy separates high-conviction semantic propositions from low-entropy syntactic noise inside transformer context windows.",
  },
  psychoanalysis: {
    thinker: "Sigmund Freud & Lacan",
    maxim: "$ ◊ a (The Algorithmic Mirror)",
    interlocutor: "Socrates",
    tension:
      "The prompt window functions as Lacan's 'sujet supposé savoir', reflecting the user's repressed signifiers back in idealized form.",
  },
};

/**
 * Classical Symposium & Dialectical Gallery Stage
 * Replaces the sparse node-dot graph with a warm, museum-grade interactive Symposium
 * featuring the 5 Classical Thinker Medallions, live Dialectical Tension cards, and Monograph previews.
 */
export const SynapseGraph2D: React.FC<SynapseGraph2DProps> = ({
  essays,
  onSelectEssay,
  masteredEssays,
}) => {
  const [selectedEssayId, setSelectedEssayId] = useState<string>(
    essays[0]?.id || "directionless-philosopher"
  );

  const activeEssay =
    essays.find((e) => e.id === selectedEssayId) || essays[0];

  if (!activeEssay) return null;

  const activeMeta =
    PILLAR_METADATA[activeEssay.pillar] || PILLAR_METADATA.philosophy;
  const dialogue =
    DIALECTICAL_DIALOGUES[activeEssay.pillar] ||
    DIALECTICAL_DIALOGUES.philosophy;

  const handleSelectDomain = (pillar: PillarId) => {
    const match = essays.find((e) => e.pillar === pillar);
    if (match) {
      setSelectedEssayId(match.id);
    }
  };

  return (
    <div className="border-2 border-[#191919] shadow-[0_8px_0_0_#191919] rounded-3xl bg-[#EAE5D9] p-4 sm:p-5 flex flex-col justify-between h-full">
      {/* Classical Ribbon Header */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b-2 border-[#191919]">
        <div>
          <span className="text-[10px] font-code font-bold uppercase tracking-widest text-[#5A5955] block">
            SYMPOSIUM OF THE FIVE DOMAINS · SELECT A THINKER
          </span>
          <h4 className="font-display font-bold text-base sm:text-lg text-[#191919]">
            Classical Thinkers &amp; Dialectical Synthesis
          </h4>
        </div>

        <span className="px-2.5 py-1 rounded-xl bg-[#F4EBC8] border-2 border-[#191919] text-[10px] font-code font-bold text-[#191919] shadow-[0_2px_0_0_#191919]">
          {essays.length} MONOGRAPHS
        </span>
      </div>

      {/* Row of 5 Interactive Classical Thinker Portrait Medallions */}
      <div className="grid grid-cols-5 gap-2 my-3">
        {DOMAIN_ORDER.map((pillarKey) => {
          const meta = PILLAR_METADATA[pillarKey];
          const isSelected = activeEssay.pillar === pillarKey;
          const domainEssay = essays.find((e) => e.pillar === pillarKey);
          const isMastered =
            domainEssay && masteredEssays.includes(domainEssay.id);

          return (
            <button
              key={pillarKey}
              type="button"
              onClick={() => handleSelectDomain(pillarKey)}
              className={`group relative rounded-2xl p-1.5 pt-2 transition-all flex flex-col items-center cursor-pointer border-2 ${
                isSelected
                  ? "bg-white border-[#191919] shadow-[0_4px_0_0_#191919] -translate-y-1"
                  : "bg-[#F7F5EE]/75 border-transparent hover:border-[#191919]/40 hover:bg-white/90"
              }`}
            >
              {isMastered && (
                <span
                  className="absolute top-1.5 left-1.5 w-4 h-4 rounded-full bg-[#FFC800] border border-[#191919] text-[9px] font-black flex items-center justify-center z-10"
                  title="Concept Mastered"
                >
                  ✓
                </span>
              )}

              <NotionMascot
                variant={meta.mascot}
                mood={isSelected ? "curious" : "neutral"}
                size={76}
                interactiveEyes={isSelected}
              />

              <span
                className={`mt-1 text-[10px] font-ui font-extrabold uppercase tracking-tight truncate max-w-full px-1.5 py-0.5 rounded ${
                  isSelected
                    ? "bg-[#191919] text-[#F4EBC8]"
                    : "text-[#5A5955] group-hover:text-[#191919]"
                }`}
              >
                {meta.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Thinker's Dialectical Salon Card */}
      <div className="bg-white border-2 border-[#191919] rounded-2xl p-4 shadow-[0_4px_0_0_#191919] flex flex-col justify-between gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E0DC] pb-2.5">
          <div className="flex items-center gap-2">
            <span
              className="px-2.5 py-0.5 rounded-md border border-[#191919] text-[10px] font-code font-bold uppercase text-[#191919]"
              style={{ backgroundColor: activeMeta.surfaceColor }}
            >
              {activeMeta.symbol} {activeMeta.label}
            </span>
            <span className="text-xs font-ui font-extrabold text-[#191919]">
              {dialogue.thinker} · <span className="font-code text-[#5A5955]">{dialogue.maxim}</span>
            </span>
          </div>

          {/* Domain Monograph Switcher if multiple exist */}
          <div className="flex items-center gap-1">
            {essays
              .filter((e) => e.pillar === activeEssay.pillar)
              .map((e, idx) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => setSelectedEssayId(e.id)}
                  className={`px-2 py-0.5 rounded text-[10px] font-code font-bold border ${
                    e.id === activeEssay.id
                      ? "bg-[#191919] text-white border-[#191919]"
                      : "bg-[#F7F6F3] text-[#5A5955] border-[#E2E0DC]"
                  }`}
                >
                  Paper #{idx + 1}
                </button>
              ))}
          </div>
        </div>

        {/* Selected Monograph Headline & Dialectical Tension */}
        <div className="space-y-1.5">
          <h5 className="font-display font-bold text-base sm:text-lg text-[#191919] leading-snug line-clamp-1">
            {activeEssay.title}
          </h5>
          <p className="font-editorial italic text-xs sm:text-sm text-[#5A5955] line-clamp-2 leading-relaxed">
            “{dialogue.tension}”
          </p>
        </div>

        {/* Bottom Action Row */}
        <div className="pt-2 border-t border-[#E2E0DC] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] font-code text-[#5A5955]">
            <span>{activeEssay.readingTimeMinutes} MIN READ</span>
            <span>·</span>
            <span>3-LEVEL DEPTH</span>
            <span>·</span>
            <span className="text-[#191919] font-bold">+{activeEssay.xpReward} XP</span>
          </div>

          <button
            type="button"
            onClick={() => onSelectEssay(activeEssay.id)}
            className="duo-btn duo-btn-streak text-xs font-ui font-extrabold px-4 py-2 rounded-xl shrink-0 flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Read Monograph</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
