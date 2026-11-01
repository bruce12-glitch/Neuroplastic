import { ArrowRight, BookOpen } from "lucide-react";
import type { EssayItem } from "../data/essays.ts";
import "./PhilosophyReadingRoom.css";

interface PhilosophyReadingRoomProps {
  essay: EssayItem;
  onRead: () => void;
}

export function PhilosophyReadingRoom({ essay, onRead }: PhilosophyReadingRoomProps) {
  return (
    <section className="philosophy-reading-room" aria-labelledby="philosophy-reading-room-heading">
      <div className="philosophy-reading-room__copy">
        <span className="philosophy-reading-room__eyebrow"><BookOpen size={14} aria-hidden="true" /> Philosophy · New essay</span>
        <h2 id="philosophy-reading-room-heading" className="font-display">The internal generative mind.</h2>
        <p>Aquinas, Anselm, and the Dream Sovereign. Read the essay with the original arguments and reference notes close at hand.</p>
        <div className="philosophy-reading-room__footer">
          <button type="button" onClick={onRead}>
            Read the essay<ArrowRight size={16} aria-hidden="true" />
          </button>
          <span>{essay.content.level2.sections.length} sections · {essay.sources?.length ?? 0} references · {essay.readingTimeMinutes} min</span>
        </div>
      </div>
      <figure className="philosophy-reading-room__illustration">
        <img src={`${import.meta.env.BASE_URL}mascots/readers/seated-reader.webp`} width={404} height={338} alt="A reader in a pink shirt sitting beside a stack of books." loading="lazy" decoding="async" />
        <figcaption>Aquinas · Anselm · Descartes</figcaption>
      </figure>
    </section>
  );
}
