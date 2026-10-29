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

- All eight generated portraits were inspected for identity, pose, hands, props, and consistent rendering. All configured assets exist in the production build, are square, and retain transparency.
- TypeScript, all 19 existing utility/Firestore checks, Firestore rules lint, and the GitHub Pages production build passed. Both GitHub Actions build and deployment completed successfully.
- Live desktop review at 1363px passed with no horizontal overflow. All six subject portraits loaded from the new URLs on the homepage and in the atlas; the reader's Diogenes hint and Archimedes success portraits also loaded correctly.
- Keyboard selection with Enter passed. A real pointer interaction produced 3.5 degrees of yaw, 1.5 degrees of pitch, and the intended 10px hover depth in the computed CSS transform.
- The final deployed views are recorded in `mascots-3d-desktop.jpg` and the updated `finance-desktop.jpg`.
- Phone/tablet viewport rendering and OS-level motion-preference switching remain outside this environment's available browser checks.
