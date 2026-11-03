import { ArrowRight, BookOpen } from "lucide-react";
import { PILLAR_METADATA, type EssayItem } from "../data/essays.ts";
import { NotionMascot, THINKER_PORTRAITS } from "./NotionMascot.tsx";
import "./PhilosophyReadingRoom.css";
import "./PsychoanalysisReadingRoom.css";

export function PsychoanalysisReadingRoom({ essay, onRead }: { essay: EssayItem; onRead: () => void }) {
  const guideVariant = PILLAR_METADATA.psychoanalysis.mascot;
  return (
    <section className="philosophy-reading-room psychoanalysis-reading-room" aria-labelledby="psychoanalysis-reading-room-heading">
      <div className="philosophy-reading-room__copy">
        <span className="philosophy-reading-room__eyebrow"><BookOpen size={14} aria-hidden="true" /> Psychoanalysis · New essay</span>
        <h2 id="psychoanalysis-reading-room-heading" className="font-display">From instinct to immortality.</h2>
        <p>The Oedipal project through Freud’s account of guilt and Becker’s account of mortality and cultural heroism.</p>
        <ol className="psychoanalysis-reading-room__path" aria-label="Ideas explored in the essay">
          <li><span>01</span>Desire &amp; guilt</li>
          <li><span>02</span>Mortality</li>
          <li><span>03</span>Cultural heroism</li>
        </ol>
        <div className="philosophy-reading-room__footer">
          <button type="button" onClick={onRead}>Read the essay<ArrowRight size={16} aria-hidden="true" /></button>
          <span>{essay.content.level2.sections.length} sections · {essay.sources?.length ?? 0} references · {essay.readingTimeMinutes} min</span>
        </div>
      </div>
      <figure className="philosophy-reading-room__illustration psychoanalysis-reading-room__guide">
        <NotionMascot variant={guideVariant} size={174} decorative interactiveEyes={false} />
        <figcaption><strong>{THINKER_PORTRAITS[guideVariant].name}</strong><br />Illustrated subject guide</figcaption>
      </figure>
    </section>
  );
}
