import type { EssayItem, EssayLevelContent } from "../data/essays.ts";
import "./EssayReferenceNotes.css";

interface EssayReferenceNotesProps {
  section: EssayLevelContent["level2"]["sections"][number];
  sources?: EssayItem["sources"];
}

export function EssayReferenceNotes({ section, sources = [] }: EssayReferenceNotesProps) {
  const references = [...new Set(section.references ?? [])].filter(
    (number) => Number.isInteger(number) && number > 0 && number <= sources.length
  );
  if (!references.length && !section.referenceNote) return null;

  return (
    <aside className="essay-reference-notes" aria-label={`Reference notes for ${section.heading}`}>
      <span className="essay-reference-notes__label">Reference notes</span>
      {section.referenceNote && <p>{section.referenceNote}</p>}
      {references.length > 0 && (
        <ul aria-label="Sources for this section">
          {references.map((number) => (
            <li key={number}>
              <a href={`#essay-source-${number}`}>
                <span className="essay-reference-notes__number">[{number}]</span>
                <span>{sources[number - 1].title}</span>
                <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
