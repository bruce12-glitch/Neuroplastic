import { ArrowRight, BookOpen } from "lucide-react";
import type { EssayItem } from "../data/essays.ts";
import "./PhilosophyReadingRoom.css";
import "./PsychologyReadingRoom.css";

export function PsychologyReadingRoom({ essay, onRead }: { essay: EssayItem; onRead: () => void }) {
  return (
    <section className="philosophy-reading-room psychology-reading-room" aria-labelledby="psychology-reading-room-heading">
      <div className="philosophy-reading-room__copy">
        <span className="philosophy-reading-room__eyebrow"><BookOpen size={14} aria-hidden="true" /> Psychology · New essay</span>
        <h2 id="psychology-reading-room-heading" className="font-display">Chance rewrites the plan.</h2>
        <p>Albert Bandura on chance encounters and fortuitous determinants — how independent chains of causality cross and rewrite a life path.</p>
        <ol className="psychology-reading-room__path" aria-label="Ideas explored in the essay">
          <li><span>01</span>Chance encounters</li>
          <li><span>02</span>Fortuitous turns</li>
          <li><span>03</span>The prepared mind</li>
        </ol>
        <div className="philosophy-reading-room__footer">
          <button type="button" onClick={onRead}>Read the essay<ArrowRight size={16} aria-hidden="true" /></button>
          <span>{essay.content.level2.sections.length} sections · {essay.sources?.length ?? 0} references · {essay.readingTimeMinutes} min</span>
        </div>
      </div>
      <figure className="philosophy-reading-room__illustration">
        <img src={`${import.meta.env.BASE_URL}mascots/readers/pink-book-reader.webp`} width={713} height={361} alt="A cross-legged reader absorbed in a pink book inside a warm yellow halo." loading="lazy" decoding="async" />
        <figcaption>Bandura · Chance · Prepared minds</figcaption>
      </figure>
    </section>
  );
}
