# Finance: the Money Garden

The Finance section combines a quiet editorial layout with a short learning loop: read the guide, try a compounding experiment, answer a knowledge check. It is the sixth subject in the garden, the symposium, the Living Atlas, the writer, and the vault.

## Visual direction

- Notion Design: warm charcoal, flat cream and mint surfaces, hairlines, a purple primary action, 8px buttons, and 12px cards.
- Duolingo Design: visible numbered learning steps, lime feedback with dark text, brief action-led copy, and explicit correct/retry feedback.
- Mascot: Penny is an original fictional tortoise with glasses, a notebook, and a sprouting coin. It is a patient learning companion, not a financial adviser or historical figure.

Existing site typography and the current Classical Symposium default are preserved. Narrow screens stack the finance panel and use a three-column subject selector. Controls have 44px minimum targets, visible keyboard focus, and reduced-motion equivalents. Quiz confetti observes the system motion preference.

## Content and assumptions

`src/data/financeEssay.ts` contains original educational writing and five primary-source links from the CFPB and SEC's Investor.gov. Paragraph reference numbers map to the article's source list. Definitions and educational claims are paraphrased; the numerical examples and learning exercise are original calculations.

The experiment uses one initial deposit and annual compounding at a constant hypothetical rate. It excludes additional deposits, withdrawals, fees, taxes, inflation, and volatility. It compares compound and simple interest in currency-neutral units. The article separately explains inflation and fees and does not recommend an investment product or promise returns.

`public/mascots/penny.webp` was generated with the built-in image-generation tool and encoded to WebP while preserving transparency. The complete prompt is recorded in `finance-mascot-prompt.json`.

## Compatibility

Visible branding is corrected to **Neuroplastic**. Legacy `nureo_*` local-storage keys, the existing Firebase database ID, and the stored `nureoplasticSynthesis` field remain compatible with saved data. The logo component is renamed to `NeuroplasticLogo`.

Sources and editorial notes are retained when a sourced essay is customized and round-trip in the Firestore payload. The rules permit the new `finance` pillar and `compound` sandbox. GitHub Pages publishes the frontend; publishing these Firestore rules remains a separate Firebase deployment.

## Validation

- TypeScript check and GitHub Pages production build.
- Ten utility tests, including compounding arithmetic, zero interest, and constructing a Finance post.
- Existing Firestore structural tests and rules lint.
- Browser review is performed against the deployed GitHub Pages site; this environment blocked the local preview server.
