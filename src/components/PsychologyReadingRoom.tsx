import { ArrowRight, BookOpen } from "lucide-react";
import type { EssayItem } from "../data/essays.ts";
import "./PhilosophyReadingRoom.css";
import "./PsychologyReadingRoom.css";

export function PsychologyReadingRoom({ essay, onRead }: { essay: EssayItem; onRead: () => void }) {
  return (
    <section className="philosophy-reading-room psychology-reading-room" aria-labelledby="psychology-reading-room-heading">
      <div className="philosophy-reading-room__copy">
        <span className="philosophy-reading-room__eyebrow"><BookOpen size={14} aria-hidden="true" /> Psychology · New essay</span>
        <h2 id="psychology-reading-room-heading" className="font-display">The brain rehearses it first.</h2>
        <p>Albert Bandura’s psychoneural mechanism — how mental rehearsal sends real neural signals to the muscles, builds the inner blueprint, and raises self-efficacy before you ever perform.</p>
        <ol className="psychology-reading-room__path" aria-label="Ideas explored in the essay">
          <li><span>01</span>Mind-muscle signals</li>
          <li><span>02</span>The inner blueprint</li>
          <li><span>03</span>Self-efficacy</li>
        </ol>
        <div className="philosophy-reading-room__footer">
          <button type="button" onClick={onRead}>Read the essay<ArrowRight size={16} aria-hidden="true" /></button>
          <span>{essay.content.level2.sections.length} sections · {essay.sources?.length ?? 0} references · {essay.readingTimeMinutes} min</span>
        </div>
      </div>
      <figure className="philosophy-reading-room__illustration">
        <img src={`${import.meta.env.BASE_URL}mascots/readers/beret-reader.webp`} width={316} height={240} alt="A beret-wearing reader blowing a bubblegum bubble while pointing at the page of a red book." loading="lazy" decoding="async" />
        <figcaption>Bandura · Rehearsal · Self-efficacy</figcaption>
      </figure>
    </section>
  );
}
