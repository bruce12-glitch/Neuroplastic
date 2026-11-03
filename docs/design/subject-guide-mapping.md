# Psychology and Psychoanalysis guides

[Open Neuroplastic](https://bruce12-glitch.github.io/Neuroplastic/).

On November 3, 2026, the user requested these subject guide assignments:

| Subject | Illustrated guide | Asset |
| --- | --- | --- |
| Psychology | Sigmund Freud | `public/mascots/3d/freud.webp` |
| Psychoanalysis | Carl Jung | `public/mascots/3d/carl-jung.webp` |

The shared portrait configuration controls the gallery, symposium, atlas, article cards, and accessible subject labels. The Psychoanalysis reading feature and original-essay header now derive their captions from the same configuration. This keeps the guide name and portrait synchronized. The author text, article categories, Freud/Becker references, and source notes retain their original content.

## Jung artwork

The built-in image-generation tool produced a new transparent Jung portrait with Freud's existing render as the visual style reference. Jung has swept white hair, a white moustache, a clean-shaven chin, round spectacles, a charcoal tweed suit, a plum waistcoat, and a notebook and pencil. The image is a 3D-rendered portrait with the existing restrained pointer response.

The 1254 × 1254 RGBA output is encoded to WebP at quality 86 with its dimensions and alpha channel preserved. The optimized asset is 255,406 bytes. The exact prompt and reference role are recorded in [carl-jung-prompt.json](carl-jung-prompt.json). The existing Freud asset is reused for Psychology, and Plato's original asset remains archived.

## Verification

TypeScript, all 21 existing tests, Firestore rules lint, and the GitHub Pages production build pass. The built Jung asset retains its 1254 × 1254 dimensions and a full alpha range of 0–255. The source diff is limited to guide configuration, derived captions, artwork, and documentation.

Deployment and live review results will be added after publication.
