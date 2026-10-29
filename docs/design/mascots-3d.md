# 3D portrait collection

The eight shared mascots now use original 3D-rendered portraits, following the sculpted face, dimensional hair, expressive eyes, soft studio lighting, and fabric detail in the user's Charlie Munger reference.

## Collection

| Character | Asset | Identifying detail |
| --- | --- | --- |
| Socrates | `public/mascots/3d/socrates.webp` | Silver beard, raised finger, lavender drape |
| Aristotle | `public/mascots/3d/aristotle.webp` | Square beard, field notebook, terracotta drape |
| Plato | `public/mascots/3d/plato.webp` | Long brown beard, golden geometric form, sage drape |
| Claude Shannon | `public/mascots/3d/shannon.webp` | Blue suit, signal card, clean-shaven face |
| Sigmund Freud | `public/mascots/3d/freud.webp` | Round glasses, silver beard, rose-brown suit |
| Charlie Munger | `public/mascots/3d/charlie-munger.webp` | Rectangular glasses, swept white hair, navy suit, rust tie |
| Diogenes | `public/mascots/3d/diogenes.webp` | Wild beard, brass lantern, ochre cloak |
| Archimedes | `public/mascots/3d/archimedes.webp` | Short silver beard, delighted expression, spiral parchment |

The original portraits remain available in `public/mascots/` as source references. Active portrait configuration points to `public/mascots/3d/`, so the new collection has distinct URLs instead of relying on old image caches expiring.

## Generation and implementation

The built-in image-generation tool created each character separately on a transparent background. The existing character portrait supplies identity, clothes, pose, and props; the user's Munger image supplies the requested 3D finish. Socrates was completed first and used as a rendering reference for the remaining seven characters. The full prompt set is recorded in `mascot-3d-prompts.json`.

The original generated PNGs are encoded to WebP quality 86, preserving their dimensions and alpha channel. The portraits are rendered images, with a small CSS perspective response rather than rotatable 3D meshes. No new rendering library is required.

`NotionMascot` remains the shared entry point for the symposium, atlas, article cards, publishing studio, experiments, and quiz feedback. Every variant now selects its corresponding 3D asset. Pointer interaction is local to each portrait, limited to seven degrees horizontally and five vertically. A small hover lift and soft shadow complement the lighting baked into the artwork. Noninteractive portraits stay still. Existing keyboard controls, text labels, and reduced-motion behavior are retained.

## Verification

- Inspect all eight generated portraits for identity, pose, hands, props, and consistent rendering.
- Verify all configured asset files exist, are square, and retain transparency.
- Run TypeScript and the production build, plus the existing utility and rules checks.
- Verify the deployed site uses the new portrait URLs in the symposium, atlas, article cards, and reader feedback; record a desktop screenshot.
- Phone/tablet viewport rendering and OS-level motion-preference switching remain outside this environment's available browser checks.
