import React, { useEffect, useRef, useState } from "react";

export type MascotVariant =
  | "philosopher"
  | "architect"
  | "observer"
  | "analyst"
  | "cartographer"
  | "critic"
  | "celebrating";

export type MascotMood = "neutral" | "curious" | "excited" | "thinking" | "oops";

interface NotionMascotProps {
  variant?: MascotVariant;
  mood?: MascotMood;
  size?: number;
  className?: string;
  interactiveEyes?: boolean;
}

interface ThinkerConfig {
  name: string;
  maxim: string;
  frameBg: string;
  accentColor: string;
  robeColor: string;
  hairColor: string;
  beardStyle: "full-curled" | "pointed" | "clean-scholar" | "trimmed-freud" | "classical-square";
  hasGlasses?: boolean;
}

const THINKER_CONFIG: Record<MascotVariant, ThinkerConfig> = {
  philosopher: {
    name: "SOCRATES",
    maxim: "MAIEUTIKÉ",
    frameBg: "#7B68EE",
    accentColor: "#CE82FF",
    robeColor: "#F8F7F4",
    hairColor: "#9E9E9E",
    beardStyle: "full-curled",
  },
  cartographer: {
    name: "ARISTOTLE",
    maxim: "P → Q",
    frameBg: "#8D5B4C",
    accentColor: "#FF9600",
    robeColor: "#F8F7F4",
    hairColor: "#8D8B88",
    beardStyle: "classical-square",
  },
  observer: {
    name: "PLATO",
    maxim: "EIDOS",
    frameBg: "#2E8B57",
    accentColor: "#58CC02",
    robeColor: "#F8F7F4",
    hairColor: "#8B6914",
    beardStyle: "pointed",
  },
  architect: {
    name: "SHANNON",
    maxim: "H(X)",
    frameBg: "#2B6CB0",
    accentColor: "#1CB0F6",
    robeColor: "#2D3748",
    hairColor: "#4A3728",
    beardStyle: "clean-scholar",
    hasGlasses: true,
  },
  analyst: {
    name: "FREUD",
    maxim: "$ ◊ a",
    frameBg: "#9B2C2C",
    accentColor: "#FF6B8B",
    robeColor: "#3B2F2F",
    hairColor: "#B0B0B0",
    beardStyle: "trimmed-freud",
    hasGlasses: true,
  },
  critic: {
    name: "DIOGENES",
    maxim: "APORIA?",
    frameBg: "#9C4221",
    accentColor: "#FF4B4B",
    robeColor: "#E2D9C8",
    hairColor: "#718096",
    beardStyle: "full-curled",
  },
  celebrating: {
    name: "ARCHIMEDES",
    maxim: "EUREKA!",
    frameBg: "#B7791F",
    accentColor: "#FFC800",
    robeColor: "#FFFBEB",
    hairColor: "#A0AEC0",
    beardStyle: "classical-square",
  },
};

/**
 * Classical Philosopher & Thinker Medallion Busts
 * Inspired directly by classical portrait medallions (Socrates, Plato, Aristotle, Freud, Shannon)
 * with carved stone oval frames, textured beards, warm human features, speech bubbles, and ribbon banners.
 */
export const NotionMascot: React.FC<NotionMascotProps> = ({
  variant = "philosopher",
  mood = "neutral",
  size = 110,
  className = "",
  interactiveEyes = true,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [pupilOffset, setPupilOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!interactiveEyes) return;

    let rafId: number | null = null;
    const handleMouseMove = (e: MouseEvent) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        if (svgRef.current) {
          const rect = svgRef.current.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const dx = e.clientX - centerX;
          const dy = e.clientY - centerY;
          const angle = Math.atan2(dy, dx);
          const dist = Math.min(2.2, Math.hypot(dx, dy) / 50);
          setPupilOffset({
            x: Math.cos(angle) * dist,
            y: Math.sin(angle) * dist,
          });
        }
        rafId = null;
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [interactiveEyes]);

  const cfg = THINKER_CONFIG[variant] || THINKER_CONFIG.philosopher;
  const uid = `thinker-${variant}-${size}`;

  return (
    <div
      className={`inline-flex items-center justify-center select-none transition-transform duration-200 ${
        isHovered ? "scale-105" : ""
      } ${className}`}
      style={{ width: size, height: size }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 160 155"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
        role="img"
        aria-label={`Classical Thinker Portrait: ${cfg.name} (${cfg.maxim})`}
      >
        <defs>
          <clipPath id={`${uid}-oval-clip`}>
            <ellipse cx="74" cy="76" rx="44" ry="54" />
          </clipPath>
        </defs>

        {/* --- 1. CARVED CLASSICAL STONE MEDALLION FRAME --- */}
        {/* Outer Stone Frame Shadow */}
        <ellipse cx="74" cy="80" rx="52" ry="61" fill="#191919" fillOpacity="0.18" />

        {/* Outer Carved Marble Oval */}
        <ellipse
          cx="74"
          cy="76"
          rx="51"
          ry="60"
          fill="#D6D3CB"
          stroke="#191919"
          strokeWidth="2.5"
        />

        {/* Inner Stone Bevel Ring */}
        <ellipse
          cx="74"
          cy="76"
          rx="47"
          ry="56"
          fill="#EAE7DF"
          stroke="#8C887F"
          strokeWidth="1.5"
        />

        {/* Architectural Stone Chisel Cracks (Authentic classical medallion detail) */}
        <path d="M36 42 L41 46 M112 45 L107 48 M26 85 L32 84" stroke="#6E6A63" strokeWidth="1.5" strokeLinecap="round" />

        {/* Interior Portrait Backdrop */}
        <ellipse
          cx="74"
          cy="76"
          rx="44"
          ry="53"
          fill={cfg.frameBg}
          stroke="#191919"
          strokeWidth="2"
        />

        {/* --- 2. THINKER BUST INSIDE MEDALLION --- */}
        <g clipPath={`url(#${uid}-oval-clip)`}>
          {/* Subtle Inner Halo Glow */}
          <circle cx="74" cy="72" r="38" fill="#FFFFFF" fillOpacity="0.12" />

          {/* Shoulders & Classical Draped Toga / Suit */}
          <path
            d="M34 134 C36 108, 52 102, 74 102 C96 102, 112 108, 114 134 Z"
            fill="#F2B880"
            stroke="#191919"
            strokeWidth="2.2"
          />

          {/* Classical Draped Himation / Robe or Scholar Suit */}
          {cfg.beardStyle === "clean-scholar" || cfg.beardStyle === "trimmed-freud" ? (
            <g>
              {/* Scholar Suit & Collar */}
              <path
                d="M34 135 C38 110, 54 104, 74 104 C94 104, 110 110, 114 135 Z"
                fill={cfg.robeColor}
                stroke="#191919"
                strokeWidth="2.2"
              />
              <polygon points="62,104 74,124 86,104" fill="#FFFFFF" stroke="#191919" strokeWidth="1.8" />
              <polygon points="71,110 77,110 76,126 72,126" fill={cfg.accentColor} stroke="#191919" strokeWidth="1.4" />
            </g>
          ) : (
            <g>
              {/* Draped White Classical Toga over Right Shoulder */}
              <path
                d="M46 135 C52 112, 78 104, 112 108 L115 135 Z"
                fill={cfg.robeColor}
                stroke="#191919"
                strokeWidth="2.2"
              />
              {/* Drapery Folds */}
              <path
                d="M58 132 C66 118, 84 112, 106 114 M68 134 C76 123, 90 118, 108 120"
                stroke="#BDB9B0"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* Back Hair / Crown Volume */}
          <path
            d="M44 64 C40 36, 54 26, 74 26 C94 26, 108 36, 104 64 Z"
            fill={cfg.hairColor}
            stroke="#191919"
            strokeWidth="2.2"
          />

          {/* Ears */}
          <ellipse cx="45" cy="68" rx="5" ry="8" fill="#EAA86E" stroke="#191919" strokeWidth="2" />
          <ellipse cx="103" cy="68" rx="5" ry="8" fill="#EAA86E" stroke="#191919" strokeWidth="2" />

          {/* Head / Warm Human Face */}
          <path
            d="M48 56 C48 36, 58 32, 74 32 C90 32, 100 36, 100 56 C100 82, 88 98, 74 98 C60 98, 48 82, 48 56 Z"
            fill="#F4BC87"
            stroke="#191919"
            strokeWidth="2.2"
          />

          {/* Forehead Wrinkles (Philosophical contemplation lines) */}
          <path
            d="M60 43 Q74 40 88 43 M63 47 Q74 45 85 47"
            stroke="#C98A55"
            strokeWidth="1.6"
            strokeLinecap="round"
          />

          {/* Hair Fringe / Classical Bangs */}
          {cfg.beardStyle === "pointed" && (
            <path
              d="M47 52 C52 32, 96 32, 101 52 C94 44, 84 42, 74 42 C64 42, 54 44, 47 52 Z"
              fill={cfg.hairColor}
              stroke="#191919"
              strokeWidth="2"
            />
          )}
          {cfg.beardStyle === "classical-square" && (
            <path
              d="M46 54 C48 32, 100 32, 102 54 C96 45, 86 41, 74 42 C62 41, 52 45, 46 54 Z"
              fill={cfg.hairColor}
              stroke="#191919"
              strokeWidth="2"
            />
          )}
          {cfg.beardStyle === "clean-scholar" && (
            <path
              d="M47 52 C48 32, 100 32, 101 50 C92 40, 68 38, 47 52 Z"
              fill={cfg.hairColor}
              stroke="#191919"
              strokeWidth="2"
            />
          )}

          {/* Expressive Eyes with Real-Time Cursor Tracking */}
          <g>
            {/* Left Eye */}
            <ellipse cx="62" cy="60" rx="5.5" ry="4.2" fill="#FFFFFF" stroke="#191919" strokeWidth="1.8" />
            <circle
              cx={62 + pupilOffset.x}
              cy={60 + pupilOffset.y}
              r="2.4"
              fill="#191919"
            />
            <circle cx={61 + pupilOffset.x} cy={59 + pupilOffset.y} r="0.9" fill="#FFFFFF" />

            {/* Right Eye */}
            <ellipse cx="86" cy="60" rx="5.5" ry="4.2" fill="#FFFFFF" stroke="#191919" strokeWidth="1.8" />
            <circle
              cx={86 + pupilOffset.x}
              cy={60 + pupilOffset.y}
              r="2.4"
              fill="#191919"
            />
            <circle cx={85 + pupilOffset.x} cy={59 + pupilOffset.y} r="0.9" fill="#FFFFFF" />

            {/* Optional Scholar Glasses (Shannon / Freud) */}
            {cfg.hasGlasses && (
              <g stroke="#191919" strokeWidth="2">
                <circle cx="62" cy="60" r="8" fill="none" />
                <circle cx="86" cy="60" r="8" fill="none" />
                <line x1="70" y1="60" x2="78" y2="60" />
              </g>
            )}
          </g>

          {/* Sculpted Eyebrows */}
          <path
            d={mood === "curious" ? "M54 51 Q62 47 69 52" : "M55 52 Q62 49 69 53"}
            stroke={cfg.hairColor === "#9E9E9E" ? "#555" : "#191919"}
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <path
            d={mood === "curious" ? "M79 52 Q86 47 94 51" : "M79 53 Q86 49 93 52"}
            stroke={cfg.hairColor === "#9E9E9E" ? "#555" : "#191919"}
            strokeWidth="2.8"
            strokeLinecap="round"
          />

          {/* Sculpted Classical Nose */}
          <path
            d="M74 55 C72 64, 70 72, 71 75 C73 77, 77 77, 78 74"
            fill="#E09E65"
            stroke="#191919"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* --- BEARD & MUSTACHE STYLES (Matching Socrates, Plato, Aristotle, Freud, Shannon) --- */}
          {cfg.beardStyle === "full-curled" && (
            <g>
              {/* Full Rounded Socrates Beard with Vertical Texture Strands */}
              <path
                d="M47 68 C45 92, 56 109, 74 109 C92 109, 103 92, 101 68 C96 76, 88 78, 84 76 C79 73, 69 73, 64 76 C60 78, 52 76, 47 68 Z"
                fill={cfg.hairColor}
                stroke="#191919"
                strokeWidth="2.2"
                strokeLinejoin="round"
              />
              {/* Beard Texture Lines */}
              <path
                d="M58 80 V103 M66 78 V107 M74 86 V108 M82 78 V107 M90 80 V103"
                stroke="#757575"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* Mouth Opening */}
              <ellipse cx="74" cy="82" rx="6" ry="3.5" fill="#7B241C" stroke="#191919" strokeWidth="1.6" />
            </g>
          )}

          {cfg.beardStyle === "pointed" && (
            <g>
              {/* Plato Sculpted Tapered Beard */}
              <path
                d="M48 70 C48 94, 60 112, 74 112 C88 112, 100 94, 100 70 C94 77, 86 78, 82 76 C77 73, 71 73, 66 76 C62 78, 54 77, 48 70 Z"
                fill={cfg.hairColor}
                stroke="#191919"
                strokeWidth="2.2"
                strokeLinejoin="round"
              />
              <path
                d="M59 80 V104 M67 79 V109 M74 87 V111 M81 79 V109 M89 80 V104"
                stroke="#6E510F"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <ellipse cx="74" cy="82" rx="5.5" ry="3" fill="#7B241C" stroke="#191919" strokeWidth="1.6" />
            </g>
          )}

          {cfg.beardStyle === "classical-square" && (
            <g>
              {/* Aristotle Broad Classical Beard */}
              <path
                d="M47 69 C46 92, 55 106, 74 106 C93 106, 102 92, 101 69 C95 76, 86 77, 82 75 C77 73, 71 73, 66 75 C62 77, 53 76, 47 69 Z"
                fill={cfg.hairColor}
                stroke="#191919"
                strokeWidth="2.2"
                strokeLinejoin="round"
              />
              <path
                d="M57 79 V101 M65 78 V104 M74 86 V105 M83 78 V104 M91 79 V101"
                stroke="#696764"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path d="M68 81 Q74 85 80 81" fill="#7B241C" stroke="#191919" strokeWidth="1.8" strokeLinecap="round" />
            </g>
          )}

          {cfg.beardStyle === "trimmed-freud" && (
            <g>
              {/* Freud / Lacan Trimmed Silver Goatee & Mustache */}
              <path
                d="M54 76 C56 94, 64 103, 74 103 C84 103, 92 94, 94 76 C88 80, 82 78, 74 78 C66 78, 60 80, 54 76 Z"
                fill={cfg.hairColor}
                stroke="#191919"
                strokeWidth="2"
              />
              <path d="M68 83 Q74 86 80 83" stroke="#191919" strokeWidth="2" strokeLinecap="round" />
            </g>
          )}

          {cfg.beardStyle === "clean-scholar" && (
            <g>
              {/* Clean-Shaven Mid-Century Thinker (Shannon / Turing) */}
              <path
                d="M66 83 Q74 88 82 83"
                stroke="#191919"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </g>
          )}
        </g>

        {/* --- 3. EXPRESSIVE HAND GESTURE BREAKING OUT OF FRAME (Socrates Finger / Aristotle Palm) --- */}
        <g transform="translate(106, 78)">
          {/* Raised Forearm & Pointing Index Finger (Maieutiké / Dialectical Gesture) */}
          <path
            d="M4 34 L6 12 C6 7, 11 7, 11 12 L11 20 C14 18, 19 20, 18 26 L16 36 Z"
            fill="#F4BC87"
            stroke="#191919"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </g>

        {/* --- 4. SPEECH BUBBLE WITH PHILOSOPHICAL MAXIM / SYMBOL --- */}
        <g transform="translate(96, 8)">
          {/* Speech Bubble Drop Shadow */}
          <ellipse cx="32" cy="28" rx="28" ry="22" fill="#191919" fillOpacity="0.16" />
          {/* Speech Bubble Body */}
          <path
            d="M8 26 C8 12, 20 4, 34 4 C48 4, 60 12, 60 26 C60 39, 48 47, 34 47 C27 47, 21 45, 16 42 L6 46 L11 36 C9 33, 8 30, 8 26 Z"
            fill="#FFFFFF"
            stroke="#191919"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Speech Bubble Text / Maxim */}
          <text
            x="34"
            y="29"
            textAnchor="middle"
            fill="#191919"
            fontSize={cfg.maxim.length > 6 ? "7.5" : "10.5"}
            fontWeight="900"
            fontFamily="JetBrains Mono, Plus Jakarta Sans, sans-serif"
            letterSpacing="0.3"
          >
            {cfg.maxim}
          </text>
        </g>

        {/* --- 5. CLASSICAL PARCHMENT RIBBON BANNER AT BASE --- */}
        <g transform="translate(14, 124)">
          {/* Left & Right Ribbon Tails */}
          <polygon
            points="2,6 16,6 12,15 2,22 6,14"
            fill="#D8CEAC"
            stroke="#191919"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <polygon
            points="118,6 104,6 108,15 118,22 114,14"
            fill="#D8CEAC"
            stroke="#191919"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          {/* Main Center Scroll Banner */}
          <rect
            x="12"
            y="0"
            width="96"
            height="20"
            rx="3"
            fill="#F4EBC8"
            stroke="#191919"
            strokeWidth="2.2"
          />
          {/* Thinker Name on Banner */}
          <text
            x="60"
            y="13.5"
            textAnchor="middle"
            fill="#191919"
            fontSize="9.5"
            fontWeight="900"
            fontFamily="Plus Jakarta Sans, sans-serif"
            letterSpacing="1.2"
          >
            {cfg.name}
          </text>
        </g>
      </svg>
    </div>
  );
};
