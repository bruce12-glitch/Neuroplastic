import React, { useId } from "react";

interface NureoplasticLogoProps {
  /**
   * "mark": Compact square/rounded emblem for navbar, footer, and brand lockup
   * "scene": Full wide editorial emblem illustration with dusk arch, botanicals, and contemplative figures
   */
  variant?: "mark" | "scene";
  size?: number;
  className?: string;
  onClick?: () => void;
}

/**
 * Custom SVG Brand Logo & Editorial Mind-Weave Emblem for Nureoplastic.
 * Inspired by the sculpted human profile head filled with interwoven colourful
 * neuroplastic ribbons (ochre gold, coral rose, sky cyan, soft lavender, warm cream)
 * set against a slate-indigo dusk horizon.
 */
export const NureoplasticLogo: React.FC<NureoplasticLogoProps> = ({
  variant = "mark",
  size = 44,
  className = "",
  onClick,
}) => {
  const uid = useId().replace(/:/g, "");
  const brainClipId = `brain-clip-${uid}`;
  const stripePatternId = `slate-stripes-${uid}`;
  const headClipId = `head-clip-${uid}`;

  if (variant === "scene") {
    return (
      <div
        onClick={onClick}
        className={`relative overflow-hidden rounded-2xl border-2 border-[#191919] bg-[#363B4E] shadow-[0_5px_0_0_#191919] select-none ${
          onClick ? "cursor-pointer group" : ""
        } ${className}`}
      >
        <svg
          viewBox="0 0 640 320"
          className="w-full h-auto block"
          role="img"
          aria-label="Nureoplastic — Interwoven Mind & Cognitive Horizon Emblem"
        >
          <defs>
            {/* Subtle diagonal hatch pattern matching the reference backdrop */}
            <pattern
              id={stripePatternId}
              width="8"
              height="8"
              patternTransform="rotate(45 0 0)"
              patternUnits="userSpaceOnUse"
            >
              <rect width="8" height="8" fill="#373C4F" />
              <line x1="0" y1="0" x2="0" y2="8" stroke="#2E3344" strokeWidth="3" />
            </pattern>

            {/* Brain cranium clip path for the interwoven neuroplastic ribbons */}
            <clipPath id={brainClipId}>
              <path d="M 252 132 C 242 98, 268 62, 314 58 C 354 55, 382 78, 384 114 C 385 138, 366 152, 344 156 C 334 158, 330 168, 326 178 C 316 174, 308 160, 294 156 C 274 150, 258 146, 252 132 Z" />
            </clipPath>
          </defs>

          {/* 1. Textured Slate Pinstripe Sky */}
          <rect width="640" height="320" fill={`url(#${stripePatternId})`} />

          {/* 2. Atmospheric Dusk Dome Silhouette */}
          <path
            d="M 56 276 C 34 236, 62 184, 114 178 C 134 112, 206 72, 276 86 C 318 42, 404 46, 444 98 C 504 86, 566 126, 574 186 C 606 208, 600 258, 562 276 Z"
            fill="#4B5063"
          />

          {/* 3. Layered Horizon Clouds (Left & Right) */}
          {/* Left main cloud */}
          <g opacity="0.95">
            <path
              d="M 82 152 H 214 C 214 140, 202 132, 190 134 C 184 120, 164 118, 152 128 C 140 112, 112 114, 104 132 C 90 132, 82 140, 82 152 Z"
              fill="#B2BEC6"
            />
            <path
              d="M 128 152 H 204 C 204 143, 194 137, 184 139 C 178 128, 160 128, 152 138 C 140 136, 128 142, 128 152 Z"
              fill="#2B3042"
            />
          </g>

          {/* Upper-left small cloud */}
          <path
            d="M 204 96 H 236 C 236 91, 230 88, 225 90 C 221 84, 212 85, 209 91 C 206 91, 204 93, 204 96 Z"
            fill="#B8CFD8"
          />

          {/* Right main cloud */}
          <g opacity="0.95">
            <path
              d="M 418 148 H 526 C 526 136, 514 128, 502 131 C 494 116, 470 116, 460 129 C 448 122, 432 126, 428 136 C 421 137, 418 142, 418 148 Z"
              fill="#B8CFD8"
            />
            <path
              d="M 448 148 H 502 C 502 141, 494 136, 486 138 C 480 130, 466 131, 462 139 C 454 138, 448 142, 448 148 Z"
              fill="#2B3042"
            />
          </g>

          {/* Lower-right small cloud */}
          <path
            d="M 508 178 H 538 C 538 174, 533 171, 528 173 C 525 168, 516 168, 513 173 C 510 173, 508 175, 508 178 Z"
            fill="#B8CFD8"
          />

          {/* 4. Botanical Fern Silhouettes & Rolling Mounds */}
          {/* Left botanical stems */}
          <g stroke="#262A3B" strokeWidth="2.2" fill="#262A3B" strokeLinecap="round">
            <path d="M 156 266 Q 144 234 126 208" fill="none" />
            <ellipse cx="132" cy="216" rx="7" ry="3" transform="rotate(-35 132 216)" />
            <ellipse cx="142" cy="212" rx="7" ry="3" transform="rotate(25 142 212)" />
            <ellipse cx="140" cy="230" rx="8" ry="3.2" transform="rotate(-30 140 230)" />
            <ellipse cx="150" cy="226" rx="8" ry="3.2" transform="rotate(30 150 226)" />
            <ellipse cx="147" cy="244" rx="7" ry="3" transform="rotate(-25 147 244)" />

            <path d="M 176 266 Q 186 228 202 194" fill="none" />
            <ellipse cx="196" cy="202" rx="7" ry="3" transform="rotate(-25 196 202)" />
            <ellipse cx="204" cy="208" rx="7" ry="3" transform="rotate(35 204 208)" />
            <ellipse cx="188" cy="218" rx="8" ry="3.2" transform="rotate(-25 188 218)" />
            <ellipse cx="196" cy="224" rx="8" ry="3.2" transform="rotate(35 196 224)" />
            <ellipse cx="182" cy="236" rx="7" ry="3" transform="rotate(-20 182 236)" />
            <ellipse cx="190" cy="242" rx="7" ry="3" transform="rotate(35 190 242)" />
          </g>

          {/* Right botanical fern plumes */}
          <g stroke="#262A3B" strokeWidth="2.4" fill="#262A3B" strokeLinecap="round">
            <path d="M 454 264 Q 444 206 432 154" fill="none" />
            {[-42, -28, -14, 0, 14, 28].map((offset, idx) => {
              const cy = 166 + idx * 14;
              const cx = 435 + idx * 2.8;
              return (
                <g key={offset}>
                  <ellipse cx={cx - 9} cy={cy} rx="9" ry="3.2" transform={`rotate(-28 ${cx - 9} ${cy})`} />
                  <ellipse cx={cx + 9} cy={cy - 2} rx="9" ry="3.2" transform={`rotate(28 ${cx + 9} ${cy - 2})`} />
                </g>
              );
            })}

            <path d="M 484 264 Q 502 222 524 184" fill="none" />
            {[0, 1, 2, 3, 4].map((idx) => {
              const cy = 194 + idx * 13;
              const cx = 518 - idx * 6.5;
              return (
                <g key={idx}>
                  <ellipse cx={cx - 8} cy={cy - 2} rx="8" ry="3" transform={`rotate(-15 ${cx - 8} ${cy - 2})`} />
                  <ellipse cx={cx + 7} cy={cy + 3} rx="8" ry="3" transform={`rotate(42 ${cx + 7} ${cy + 3})`} />
                </g>
              );
            })}
          </g>

          {/* Ground Mounds */}
          <path d="M 116 268 C 132 248, 174 248, 192 268 Z" fill="#262A3B" />
          <path d="M 168 268 C 182 252, 214 252, 226 268 Z" fill="#262A3B" />
          <path d="M 412 268 C 434 242, 488 242, 514 268 Z" fill="#262A3B" />
          <path d="M 486 268 C 504 252, 542 252, 558 268 Z" fill="#262A3B" />

          {/* 5. Sculpted Human Profile Silhouette (Facing Right) */}
          <path
            d="M 218 268
               L 246 210
               C 234 188, 226 156, 230 122
               C 234 74, 272 42, 324 44
               C 368 46, 398 72, 402 108
               C 403 118, 401 126, 405 134
               L 424 160
               C 427 165, 424 170, 417 171
               L 406 173
               C 408 180, 414 184, 413 189
               C 412 194, 405 196, 405 200
               C 406 204, 412 207, 410 212
               C 408 217, 400 220, 402 228
               C 404 242, 394 252, 372 252
               L 346 250
               L 354 268
               Z"
            fill="#262A3B"
          />

          {/* 6. Interwoven Colorful Neuroplastic Ribbons inside the Mind */}
          <g clipPath={`url(#${brainClipId})`}>
            {/* Base dark interior */}
            <rect x="240" y="50" width="160" height="140" fill="#212534" />

            {/* Ribbon 1: Warm Cream diagonal */}
            <path d="M 238 102 L 372 64" stroke="#F3DEC2" strokeWidth="9" strokeLinecap="square" />
            {/* Ribbon 2: Coral Rose */}
            <path d="M 244 134 L 388 94" stroke="#E58B88" strokeWidth="9.5" strokeLinecap="square" />
            {/* Ribbon 3: Sky Cyan */}
            <path d="M 258 64 L 368 158" stroke="#9AC5D8" strokeWidth="9" strokeLinecap="square" />
            {/* Ribbon 4: Ochre Gold */}
            <path d="M 240 116 L 386 128" stroke="#F0B342" strokeWidth="9.5" strokeLinecap="square" />
            {/* Ribbon 5: Soft Lavender */}
            <path d="M 284 52 L 324 178" stroke="#C5A3CB" strokeWidth="9" strokeLinecap="square" />
            {/* Ribbon 6: Warm Cream steep */}
            <path d="M 332 54 L 268 164" stroke="#F3DEC2" strokeWidth="8.5" strokeLinecap="square" />
            {/* Ribbon 7: Ochre Gold upper arch */}
            <path d="M 246 84 L 358 146" stroke="#F0B342" strokeWidth="8.5" strokeLinecap="square" />
            {/* Ribbon 8: Sky Cyan cross */}
            <path d="M 250 150 L 382 76" stroke="#9AC5D8" strokeWidth="8.5" strokeLinecap="square" />
            {/* Ribbon 9: Coral Rose steep */}
            <path d="M 306 54 L 356 168" stroke="#E58B88" strokeWidth="8" strokeLinecap="square" />
            {/* Ribbon 10: Lavender lower weave */}
            <path d="M 246 142 L 348 166" stroke="#C5A3CB" strokeWidth="8.5" strokeLinecap="square" />

            {/* Subtle dark shadow notches for weave depth */}
            <circle cx="295" cy="96" r="2.5" fill="#212534" />
            <circle cx="332" cy="112" r="2.5" fill="#212534" />
            <circle cx="312" cy="136" r="2.5" fill="#212534" />
          </g>

          {/* Trailing ribbon tails extending into lower brain stem */}
          <path d="M 320 156 L 330 176" stroke="#C5A3CB" strokeWidth="6.5" strokeLinecap="butt" />
          <path d="M 312 152 L 334 168" stroke="#9AC5D8" strokeWidth="6" strokeLinecap="butt" />

          {/* 7. Four-Point Stars / Cognitive Sparkles */}
          {[
            { x: 416, y: 98, r: 6 },
            { x: 222, y: 184, r: 4.5 },
            { x: 294, y: 182, r: 5.5 },
          ].map((star, idx) => (
            <path
              key={idx}
              d={`M ${star.x} ${star.y - star.r} Q ${star.x} ${star.y} ${star.x + star.r} ${star.y} Q ${star.x} ${star.y} ${star.x} ${star.y + star.r} Q ${star.x} ${star.y} ${star.x - star.r} ${star.y} Q ${star.x} ${star.y} ${star.x} ${star.y - star.r} Z`}
              fill="#FFFFFF"
            />
          ))}

          {/* 8. Two Contemplative Scholars Observing the Mind */}
          {/* Left Figure (Hands on hips, looking up) */}
          <g>
            {/* Legs */}
            <path d="M 254 272 L 260 232 L 268 232 L 274 272" stroke="#7A8B99" strokeWidth="5.5" fill="none" strokeLinecap="round" />
            {/* Torso & Arms */}
            <path d="M 257 204 L 271 204 L 269 233 L 259 233 Z" fill="#B8CFD8" />
            <path d="M 257 206 L 248 218 L 258 228" stroke="#B8CFD8" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 271 206 L 280 218 L 270 228" stroke="#B8CFD8" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            {/* Head */}
            <circle cx="265" cy="195" r="5.5" fill="#F2C2B3" />
            <path d="M 261 193 C 261 189, 268 189, 269 193" fill="#262A3B" />
          </g>

          {/* Right Figure (Reaching upward toward the woven mind) */}
          <g>
            {/* Legs */}
            <path d="M 298 272 L 302 234 L 309 234 L 315 272" stroke="#6E5A6F" strokeWidth="5" fill="none" strokeLinecap="round" />
            {/* Coral Jacket Torso */}
            <path d="M 300 206 L 311 206 L 312 235 L 299 235 Z" fill="#D95B5B" />
            {/* Left arm on hip */}
            <path d="M 300 208 L 292 219 L 300 228" stroke="#7A8B99" strokeWidth="3.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            {/* Right arm raised pointing up at the ribbons */}
            <path d="M 310 208 L 320 198 L 322 183" stroke="#7A8B99" strokeWidth="3.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            {/* Head */}
            <circle cx="306" cy="197" r="5.2" fill="#F2C2B3" />
            <path d="M 301 196 C 301 191, 309 191, 309 199 C 306 202, 301 200, 301 196 Z" fill="#5A3838" />
          </g>

          {/* Small Coral Botanical Sprout on Right Ground */}
          <g>
            <path d="M 366 268 C 374 260, 396 260, 404 268 Z" fill="#F0837C" />
            <path d="M 384 263 L 380 248 M 384 263 L 391 251" stroke="#D96B66" strokeWidth="1.4" strokeLinecap="round" />
          </g>

          {/* 9. Ground Horizon Platform Bar */}
          <rect x="86" y="268" width="468" height="14" rx="7" fill="#3D4255" />
        </svg>
      </div>
    );
  }

  // Default "mark" variant: Crisp website logo badge featuring the sculpted head profile & woven ribbons
  return (
    <div
      onClick={onClick}
      style={{ width: size, height: size }}
      className={`relative rounded-xl bg-[#363B4E] border-2 border-[#191919] shadow-[0_3px_0_0_#191919] flex items-center justify-center overflow-hidden select-none shrink-0 ${
        onClick ? "cursor-pointer hover:translate-y-[-1px] transition-transform" : ""
      } ${className}`}
      title="Nureoplastic — Interwoven Cognitive Studio"
    >
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full block"
        role="img"
        aria-label="Nureoplastic Logo"
      >
        <defs>
          <clipPath id={headClipId}>
            <path d="M 28 56 C 24 36, 38 18, 62 18 C 84 18, 96 30, 96 48 C 96 62, 86 70, 74 72 C 68 73, 66 78, 64 84 C 58 81, 54 74, 46 71 C 36 68, 30 64, 28 56 Z" />
          </clipPath>
        </defs>

        {/* Dusk Arch Background */}
        <circle cx="60" cy="66" r="48" fill="#4B5063" />

        {/* Sculpted Head Silhouette (Facing Right) */}
        <path
          d="M 20 116
             L 32 88
             C 24 76, 20 60, 22 44
             C 25 20, 44 8, 68 10
             C 88 12, 102 24, 104 42
             C 104 47, 103 51, 106 55
             L 114 67
             C 115 70, 113 72, 110 73
             L 104 74
             C 105 78, 108 80, 107 83
             C 106 86, 102 87, 102 90
             C 102 94, 98 99, 88 99
             L 76 98
             L 80 116
             Z"
          fill="#232738"
        />

        {/* Interwoven Colorful Neuroplastic Ribbons Inside the Brain */}
        <g clipPath={`url(#${headClipId})`}>
          <rect x="20" y="12" width="82" height="76" fill="#1E2231" />
          <path d="M 20 42 L 96 22" stroke="#F3DEC2" strokeWidth="7" strokeLinecap="square" />
          <path d="M 22 60 L 100 38" stroke="#E58B88" strokeWidth="7.5" strokeLinecap="square" />
          <path d="M 30 20 L 92 74" stroke="#9AC5D8" strokeWidth="7" strokeLinecap="square" />
          <path d="M 20 50 L 98 58" stroke="#F0B342" strokeWidth="7.5" strokeLinecap="square" />
          <path d="M 46 14 L 70 86" stroke="#C5A3CB" strokeWidth="7" strokeLinecap="square" />
          <path d="M 74 14 L 36 78" stroke="#F3DEC2" strokeWidth="6.5" strokeLinecap="square" />
          <path d="M 26 32 L 88 68" stroke="#F0B342" strokeWidth="6.5" strokeLinecap="square" />
          <path d="M 28 70 L 96 28" stroke="#9AC5D8" strokeWidth="6.5" strokeLinecap="square" />
        </g>

        {/* Four-Point Sparkle Star */}
        <path
          d="M 106 28 Q 106 33 111 33 Q 106 33 106 38 Q 106 33 101 33 Q 106 33 106 28 Z"
          fill="#FFFFFF"
        />
      </svg>
    </div>
  );
};
