import React, { useState } from "react";
import { NotionMascot, THINKER_PORTRAITS } from "./NotionMascot.tsx";
import { EssayItem, PILLAR_METADATA, PillarId } from "../data/essays.ts";
import { ArrowRight, BookOpen, Check } from "lucide-react";

interface SynapseGraph2DProps {
  essays: EssayItem[];
  onSelectEssay: (id: string) => void;
  masteredEssays: string[];
}

const DOMAIN_ORDER: PillarId[] = [
  "philosophy", "worldview", "psychology", "ai", "psychoanalysis",
];

/** The existing domain/essay navigation, with room for the original illustrated cast. */
export const SynapseGraph2D: React.FC<SynapseGraph2DProps> = ({
  essays, onSelectEssay, masteredEssays,
}) => {
  const [selectedEssayId, setSelectedEssayId] = useState<string>(essays[0]?.id || "");
  const activeEssay = essays.find((essay) => essay.id === selectedEssayId) || essays[0];
  if (!activeEssay) return null;

  const activeMeta = PILLAR_METADATA[activeEssay.pillar] || PILLAR_METADATA.philosophy;
  const portrait = THINKER_PORTRAITS[activeMeta.mascot];
  const domainEssays = essays.filter((essay) => essay.pillar === activeEssay.pillar);
  const theme = {
    "--notion-design-portrait-paper": portrait.paper,
    "--notion-design-portrait-accent": portrait.color,
  } as React.CSSProperties;

  return (
    <section className="thinker-salon" aria-label="The thinking room" style={theme}>
      <header className="thinker-salon__header">
        <div>
          <p className="thinker-salon__eyebrow">THE THINKING ROOM</p>
          <h4 className="font-display">Good company for curious minds.</h4>
        </div>
        <span className="thinker-salon__edition" aria-label={`${essays.length} essays to explore`}>
          <BookOpen size={13} aria-hidden="true" />
          {essays.length} essays
        </span>
      </header>

      <div className="thinker-feature">
        <div className="thinker-feature__portrait">
          <span className="thinker-feature__arch" aria-hidden="true" />
          <svg className="thinker-feature__doodle" viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <path d="M20 3c0 11-5 17-17 17 12 0 17 5 17 17 0-12 5-17 17-17C25 20 20 14 20 3Z" />
          </svg>
          <NotionMascot variant={activeMeta.mascot} mood="curious" size={184} decorative />
        </div>
        <div className="thinker-feature__intro">
          <p className="thinker-salon__eyebrow">YOUR GUIDE TO {activeMeta.label.toUpperCase()}</p>
          <h5 className="font-display">{portrait.name}</h5>
          <p className="thinker-feature__role">{portrait.role}</p>
          <p className="thinker-feature__question font-editorial">{portrait.question}</p>
        </div>
      </div>

      <div className="thinker-selector" role="group" aria-label="Choose a thinker and subject">
        {DOMAIN_ORDER.map((pillar) => {
          const meta = PILLAR_METADATA[pillar];
          const thinker = THINKER_PORTRAITS[meta.mascot];
          const selected = activeEssay.pillar === pillar;
          const domainEssay = essays.find((essay) => essay.pillar === pillar);
          const mastered = domainEssay && masteredEssays.includes(domainEssay.id);
          return (
            <button
              key={pillar}
              type="button"
              className="thinker-selector__item"
              aria-pressed={selected}
              aria-label={`Explore ${meta.label} with ${thinker.name}${mastered ? ", mastered" : ""}`}
              disabled={!domainEssay}
              onClick={() => domainEssay && setSelectedEssayId(domainEssay.id)}
              style={{
                "--notion-design-portrait-paper": thinker.paper,
                "--notion-design-portrait-accent": thinker.color,
              } as React.CSSProperties}
            >
              <span className="thinker-selector__art">
                <NotionMascot variant={meta.mascot} size={78} interactive={false} decorative />
                {mastered && <span className="thinker-selector__mastered"><Check size={11} /></span>}
              </span>
              <span className="thinker-selector__name">{thinker.name.split(" ").pop()}</span>
              <span className="thinker-selector__subject">{meta.label}</span>
              <span className="thinker-selector__dot" aria-hidden="true" />
            </button>
          );
        })}
      </div>

      <div className="thinker-reading">
        <div className="thinker-reading__details">
          <p className="thinker-salon__eyebrow">
            START EXPLORING <span aria-hidden="true">·</span> {activeEssay.readingTimeMinutes} MIN READ
          </p>
          <h6 className="font-display">{activeEssay.title}</h6>
        </div>
        <button
          type="button"
          className="thinker-reading__open"
          onClick={() => onSelectEssay(activeEssay.id)}
          aria-label={`Read Monograph: ${activeEssay.title}`}
        >
          <span>Read essay</span>
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>

      {domainEssays.length > 1 && (
        <div className="thinker-reading__switcher" role="group" aria-label="More essays in this subject">
          {domainEssays.map((essay, index) => (
            <button
              type="button"
              key={essay.id}
              aria-pressed={essay.id === activeEssay.id}
              aria-label={`Select essay ${index + 1}: ${essay.title}`}
              onClick={() => setSelectedEssayId(essay.id)}
            >
              Essay {index + 1}
            </button>
          ))}
        </div>
      )}
    </section>
  );
};
