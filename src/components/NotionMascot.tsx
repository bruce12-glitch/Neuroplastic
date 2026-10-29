import React, { useRef } from "react";

export type MascotVariant =
  | "philosopher" | "architect" | "observer" | "analyst"
  | "cartographer" | "critic" | "celebrating" | "steward";
export type MascotMood = "neutral" | "curious" | "excited" | "thinking" | "oops";

interface NotionMascotProps {
  variant?: MascotVariant;
  mood?: MascotMood;
  size?: number;
  className?: string;
  interactive?: boolean;
  /** Compatibility with existing readers. Artwork now follows the pointer as a whole. */
  interactiveEyes?: boolean;
  /** Use when a surrounding control already supplies the character's accessible name. */
  decorative?: boolean;
}

interface ThinkerPortrait {
  name: string;
  asset: string;
  color: string;
  paper: string;
  role: string;
  question: string;
  alt: string;
}

/** Original editorial portraits. Questions are product prompts, not historical quotations. */
export const THINKER_PORTRAITS: Record<MascotVariant, ThinkerPortrait> = {
  steward: {
    name: "Charlie Munger", asset: "charlie-munger", color: "#426545", paper: "#eaf4e8",
    role: "A patient approach to money",
    question: "Which assumptions deserve a closer look?",
    alt: "Charlie Munger with swept white hair, dark rectangular glasses, a navy suit, and a cream notebook.",
  },
  philosopher: {
    name: "Socrates", asset: "socrates", color: "#75609b", paper: "#eee8f5",
    role: "The art of a better question",
    question: "What if the question is where we should begin?",
    alt: "Socrates with an unruly silver beard, a raised eyebrow, and an inquisitive finger.",
  },
  cartographer: {
    name: "Aristotle", asset: "aristotle", color: "#a26745", paper: "#f7eadf",
    role: "A little closer to the world",
    question: "What changes when we look a little closer?",
    alt: "Aristotle in a terracotta sash, observing a leaf in his field notebook.",
  },
  observer: {
    name: "Plato", asset: "plato", color: "#54785d", paper: "#e8efe5",
    role: "Beyond the familiar",
    question: "Which patterns are hiding in plain sight?",
    alt: "Plato with a long brown beard and a sage robe, considering a geometric form.",
  },
  architect: {
    name: "Claude Shannon", asset: "shannon", color: "#4e7298", paper: "#e6edf5",
    role: "Finding the signal",
    question: "What is the signal, and what can we let go?",
    alt: "Claude Shannon in a blue jacket, sharing a hand-drawn signal on an index card.",
  },
  analyst: {
    name: "Sigmund Freud", asset: "freud", color: "#98616c", paper: "#f4e7ea",
    role: "Listening beneath the surface",
    question: "What might we notice if we pause and listen?",
    alt: "Sigmund Freud with silver hair and round spectacles, listening with a notebook.",
  },
  critic: {
    name: "Diogenes", asset: "diogenes", color: "#916e3e", paper: "#f2ebdf",
    role: "A useful dose of doubt",
    question: "Is that an answer, or just a comfortable assumption?",
    alt: "Diogenes with a wild beard, a skeptical eyebrow, and a small brass lantern.",
  },
  celebrating: {
    name: "Archimedes", asset: "archimedes", color: "#9b792f", paper: "#f7f0d9",
    role: "Room for a little discovery",
    question: "One small discovery. A whole new way to see.",
    alt: "A delighted Archimedes with silver curls, a raised hand, and a spiral sketch.",
  },
};

/**
 * Shared artwork for the symposium, essay cards, and reader.
 * Names and labels live in HTML to stay legible at small sizes.
 * Pointer response is local: no window listeners, SVG IDs, or React rerenders.
 */
export const NotionMascot: React.FC<NotionMascotProps> = ({
  variant = "philosopher", mood = "neutral", size = 110, className = "",
  interactive, interactiveEyes = true, decorative = false,
}) => {
  const portraitRef = useRef<HTMLSpanElement>(null);
  const cfg = THINKER_PORTRAITS[variant] || THINKER_PORTRAITS.philosopher;
  const followsPointer = interactive ?? interactiveEyes;

  const resetPose = () => {
    portraitRef.current?.style.removeProperty("--mascot-turn");
    portraitRef.current?.style.removeProperty("--mascot-lean");
  };

  const followPointer = (event: React.PointerEvent<HTMLSpanElement>) => {
    if (!followsPointer || event.pointerType !== "mouse" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2));
    const y = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2));
    event.currentTarget.style.setProperty("--mascot-turn", `${x * 3}deg`);
    event.currentTarget.style.setProperty("--mascot-lean", `${y * -2}deg`);
  };

  return (
    <span
      ref={portraitRef}
      className={`notion-mascot ${className}`}
      data-mood={mood}
      data-interactive={followsPointer || undefined}
      style={{ width: size, height: size }}
      onPointerMove={followsPointer ? followPointer : undefined}
      onPointerLeave={resetPose}
      onPointerCancel={resetPose}
      aria-hidden={decorative || undefined}
    >
      <img
        className="notion-mascot__art"
        src={`${import.meta.env.BASE_URL}mascots/${cfg.asset}.webp`}
        width={512}
        height={512}
        alt={decorative ? "" : cfg.alt}
        draggable={false}
        decoding="async"
      />
    </span>
  );
};
