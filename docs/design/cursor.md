# Reference cursor

The supplied crop shows a small dark arrow with a white edge and a soft cyan halo. Two original 36px SVG assets reproduce that visual treatment: `src/assets/cursors/glow-arrow.svg` for ordinary surfaces and `src/assets/cursors/glow-hand.svg` for clickable controls.

CSS uses native cursor images with an arrow hotspot at (11, 6) and a hand hotspot at (15, 6). The blue halo is transparent and static. The cursor tracks the actual pointer directly, without a DOM follower, a render loop, or a trailing animation. The assets are resolved by Vite, including builds under the GitHub Pages repository path.

The treatment applies when hover and a fine primary pointer are available and forced colors are off. Text fields retain a text cursor, existing crosshair and resize controls keep their explicit cursor styles, and disabled controls keep their unavailable state. Touch interfaces and forced-colors mode use standard system cursors. As the cursor has no animation, reduced-motion mode needs no moving equivalent.

Validation covers SVG structure, production asset resolution, and a desktop browser check of the computed cursor on ordinary surfaces, buttons, links, text inputs, precision controls, and disabled controls.
