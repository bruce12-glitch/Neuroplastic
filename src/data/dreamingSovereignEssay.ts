import type { EssayItem } from "./essays.ts";

/** Site author's original submission; only pasted whitespace and markup were cleaned. */
export const DREAMING_SOVEREIGN_ESSAY: EssayItem = {
  id: "dreaming-sovereign",
  slug: "the-dreaming-sovereign",
  title: "The Dreaming Sovereign — On Descartes and the Solipsistic Void",
  subtitle: "A metaphysical thought experiment on consciousness, reality, and the closed circle of divine dreaming.",
  author: "Neuroplastic",
  format: "original",
  pillar: "philosophy",
  pillarLabel: "Philosophy",
  readingTimeMinutes: 3,
  xpReward: 0,
  publishedDate: "Oct 29, 2026",
  tags: ["Descartes", "Solipsism", "Consciousness", "Otto Rank"],
  prerequisites: [],
  socraticAnnotations: {},
  // Original essays use the full text; learning tiers, sandbox, and quiz are not displayed.
  sandboxType: "epistemic",
  content: {
    level1: { bullets: [], mentalModelTable: [] },
    level2: {
      sections: [
        {
          heading: "The dreaming divinity",
          paragraphs: [
            'Consider the theoretical paradox of the dreaming divinity: if existence is framed through Descartes\' cogito—"I think, therefore I am"—what occurs when the thinking mind is conceived as an eternal power dreaming its own reality?',
          ],
        },
        {
          heading: "The world as projection",
          paragraphs: [
            'In this metaphysical thought experiment, the external world and every individual within it are rendered as projections of a single consciousness. To assert "I think, therefore I am" in this context is to posit that thought itself constructs the illusion of objective reality. The presence of others, the cloud of objective concepts, and the disturbance of the world become necessary features of the dream—a self-manufactured framework designed to sustain the experience. The thought loop closes upon itself: the dream projects the world, and the world exists only as a continuation of the thought.',
          ],
        },
        {
          heading: "The circular trap",
          paragraphs: [
            "This logic ultimately disqualifies the external God. To disapprove or reject the reality of the divine dream is to simultaneously disapprove the very power attributed to God—leaving the external, objective deity as a non-entity. God does not exist outside the mind that conceives Him. Yet the trap is total: the moment anyone attempts to question, disprove, or escape this conclusion, they become instantly trapped within the circular loop of that same power. To argue against the dream requires using the thought-architecture the dream provides, forcing the critic to validate the loop in the very act of trying to break it.",
          ],
          pullQuote: "It seems to be difficult for the individual to realize that there exists a division between one’s spiritual and purely human needs, and that the satisfaction or fulfillment for each has to be found in different spheres. As a rule, we find the two aspects hopelessly confused in modern relationships, where one person is made the god-like judge over good and bad in the other person.\n\nIn the long run, such symbiotic relationship becomes demoralizing to both parties, for it is just as unbearable to be God as it is to remain an utter slave",
          pullQuoteAttribution: {
            author: "Otto Rank",
            authorUrl: "https://www.readandcobooks.co.uk/book-author/otto-rank/",
            source: "As quoted in Ernest Becker, The Denial of Death (1973), chapter eight.",
            sourceUrl: "https://www.enotes.com/topics/otto-rank/criticism/criticism/ernest-becker-essay-date-1973",
          },
        },
      ],
    },
    level3: { formalProofTitle: "", latexFormulas: [], architecturalProof: [] },
  },
  masteryQuiz: { question: "", scenario: "", options: [], hint: "" },
  editorialNote: "A metaphysical thought experiment. The single dreaming consciousness is the essay’s premise; the cogito alone does not establish it. The Rank passage is cited through Becker’s chapter-eight epigraph.",
  sources: [
    {
      title: "Discourse on the Method, Part IV",
      publisher: "René Descartes · Project Gutenberg · translated by John Veitch",
      url: "https://www.gutenberg.org/cache/epub/59/pg59-images.html",
      note: "Primary context for the cogito. Descartes’ own argument proceeds to the existence of God; this essay develops a separate thought experiment.",
    },
    {
      title: "Otto Rank and the Closure of Psychoanalysis on Kierkegaard",
      publisher: "Ernest Becker · The Denial of Death (1973), chapter eight · excerpt on eNotes",
      url: "https://www.enotes.com/topics/otto-rank/criticism/criticism/ernest-becker-essay-date-1973",
      note: "The chapter opens with the supplied passage attributed to Otto Rank. This is a quotation via Becker, rather than a direct citation checked against Rank’s original edition.",
    },
  ],
};
