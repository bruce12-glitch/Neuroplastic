import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { EssayItem, EssayComment, PILLAR_METADATA } from "../data/essays.ts";
import { NotionMascot } from "./NotionMascot.tsx";
import { NeuroplasticLogo } from "./NeuroplasticLogo.tsx";
import { SocraticMarginCallout } from "./SocraticMarginCallout.tsx";
import { EntropyPruningSandbox } from "./sandboxes/EntropyPruningSandbox.tsx";
import { EpistemicHorizonSandbox } from "./sandboxes/EpistemicHorizonSandbox.tsx";
import { AttractorBasinSandbox } from "./sandboxes/AttractorBasinSandbox.tsx";
import { CompoundInterestSandbox } from "./sandboxes/CompoundInterestSandbox.tsx";
import { DialecticalComments } from "./DialecticalComments.tsx";
import { HumanMathDerivation } from "./HumanMathDerivation.tsx";
import {
  ArrowLeft,
  Bookmark,
  Sparkles,
  Award,
  HelpCircle,
  Volume2,
  VolumeX,
  PenTool,
  Type,
  MessageSquareQuote,
  AlignJustify,
} from "lucide-react";

interface CognitiveReaderProps {
  essay: EssayItem;
  onBack: () => void;
  onEditEssay: (essay: EssayItem) => void;
  onSaveToVault: (item: { text: string; pillar: string; essayTitle: string; userNote?: string }) => void;
  onCompleteMastery: (essayId: string, xp: number) => void;
  isMastered: boolean;
  savedAnnotationIds: string[];
  comments: EssayComment[];
  onAddComment: (comment: Omit<EssayComment, "id" | "createdAt" | "upvotes" | "replies">) => void;
  onReplyComment: (commentId: string, author: string, role: string, body: string) => void;
  onUpvoteComment: (commentId: string) => void;
  audio: {
    isMuted: boolean;
    toggleMute: () => void;
    playClick: () => void;
    playToggle: () => void;
    playSuccessChord: () => void;
    playRustle: () => void;
    playErrorThud: () => void;
  };
}

type FontSizePreset = "sm" | "md" | "lg" | "xl";
type LineSpacingPreset = "compact" | "editorial" | "spacious";
type PaperTheme = "archival" | "gallery" | "sepia" | "nocturnal";

const PAPER_THEMES: Record<
  PaperTheme,
  { label: string; bg: string; cardBg: string; text: string; subtext: string; swatch: string }
> = {
  archival: {
    label: "Archival Cream",
    bg: "bg-[#F7F6F3]",
    cardBg: "bg-white",
    text: "text-[#191919]",
    subtext: "text-[#5A5955]",
    swatch: "#F7F6F3",
  },
  gallery: {
    label: "Gallery White",
    bg: "bg-white",
    cardBg: "bg-[#F7F6F3]",
    text: "text-[#191919]",
    subtext: "text-[#5A5955]",
    swatch: "#FFFFFF",
  },
  sepia: {
    label: "Sepia Manuscript",
    bg: "bg-[#F4ECD8]",
    cardBg: "bg-[#FAF4E4]",
    text: "text-[#261E18]",
    subtext: "text-[#655648]",
    swatch: "#F4ECD8",
  },
  nocturnal: {
    label: "Nocturnal Ink",
    bg: "bg-[#17171A]",
    cardBg: "bg-[#222226]",
    text: "text-[#EFECE6]",
    subtext: "text-[#A8A49C]",
    swatch: "#17171A",
  },
};

const FONT_SIZE_MAP: Record<FontSizePreset, { label: string; className: string }> = {
  sm: { label: "S", className: "text-base" },
  md: { label: "M", className: "text-[19px]" },
  lg: { label: "L", className: "text-[21px]" },
  xl: { label: "XL", className: "text-[24px]" },
};

const LINE_SPACING_MAP: Record<LineSpacingPreset, { label: string; className: string }> = {
  compact: { label: "1.6", className: "leading-[1.65]" },
  editorial: { label: "1.85", className: "leading-[1.85]" },
  spacious: { label: "2.1", className: "leading-[2.1]" },
};

export const CognitiveReader: React.FC<CognitiveReaderProps> = ({
  essay,
  onBack,
  onEditEssay,
  onSaveToVault,
  onCompleteMastery,
  isMastered,
  savedAnnotationIds,
  comments,
  onAddComment,
  onReplyComment,
  onUpvoteComment,
  audio,
}) => {
  const [depthLevel, setDepthLevel] = useState<1 | 2 | 3>(2);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activeAnnotationId, setActiveAnnotationId] = useState<string | null>(null);

  // Reader Comfort & Typography Customization State
  const [fontSize, setFontSize] = useState<FontSizePreset>("md");
  const [lineSpacing, setLineSpacing] = useState<LineSpacingPreset>("editorial");
  const [paperTheme, setPaperTheme] = useState<PaperTheme>("archival");

  // Floating text selection toolbar state
  const [selectedText, setSelectedText] = useState<string>("");
  const [selectionPosition, setSelectionPosition] = useState<{ x: number; y: number } | null>(null);
  const [pendingQuote, setPendingQuote] = useState<string | null>(null);

  // Mastery Quiz State
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [quizState, setQuizState] = useState<"idle" | "correct" | "wrong">("idle");
  const [showQuizHint, setShowQuizHint] = useState<boolean>(false);

  // Reading progress tracker
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Text selection handler
  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        setSelectionPosition(null);
        setSelectedText("");
        return;
      }
      const text = selection.toString().trim();
      if (text.length > 8) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setSelectedText(text);
        setSelectionPosition({
          x: rect.left + rect.width / 2,
          y: rect.top - 12 + window.scrollY,
        });
      } else {
        setSelectionPosition(null);
        setSelectedText("");
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, []);

  const handleLevelChange = (lvl: 1 | 2 | 3) => {
    audio.playRustle();
    audio.playToggle();
    setDepthLevel(lvl);
  };

  const handleQuizSubmit = (optionId: string) => {
    setSelectedOptionId(optionId);
    audio.playClick();

    const chosenOption = essay.masteryQuiz.options.find((o) => o.id === optionId);
    if (chosenOption?.isCorrect) {
      setQuizState("correct");
      audio.playSuccessChord();

      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.8 },
          colors: ["#58CC02", "#1CB0F6", "#CE82FF", "#FFC800", "#FF6B8B"],
        });
      }

      onCompleteMastery(essay.id, essay.xpReward);
    } else {
      setQuizState("wrong");
      audio.playErrorThud();
      setShowQuizHint(true);
    }
  };

  const handleSaveSelection = () => {
    if (!selectedText) return;
    audio.playClick();
    onSaveToVault({
      text: selectedText,
      pillar: essay.pillar,
      essayTitle: essay.title,
    });
    setSelectionPosition(null);
    setSelectedText("");
  };

  const handleQuoteInDiscourse = () => {
    if (!selectedText) return;
    audio.playClick();
    setPendingQuote(selectedText);
    setSelectionPosition(null);
    setSelectedText("");
    const discourseEl = document.getElementById("discourse-section");
    if (discourseEl) {
      discourseEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const meta = PILLAR_METADATA[essay.pillar] || PILLAR_METADATA.philosophy;
  const activePaper = PAPER_THEMES[paperTheme];
  const essayCommentsCount = comments.filter((c) => c.essayId === essay.id).length;

  return (
    <div className={`min-h-screen ${activePaper.bg} ${activePaper.text} pb-24 font-ui transition-colors duration-200`}>
      {/* Sticky Top Reader Bar */}
      <div className="sticky top-0 z-30 bg-[#F7F6F3]/95 backdrop-blur-xs border-b-2 border-[#191919] px-4 py-3 text-[#191919]">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Mark & Back button */}
          <div className="flex items-center gap-2 shrink-0">
            <NeuroplasticLogo variant="mark" size={36} onClick={onBack} />
            <button
              onClick={onBack}
              className="duo-btn text-xs font-ui font-extrabold px-3 py-1.5 rounded-xl bg-white text-[#191919] flex items-center gap-1.5 shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Digital Garden</span>
            </button>
          </div>

          {/* Progress Bar with Specular Highlight */}
          <div className="flex-1 max-w-md">
            <div className="flex items-center justify-between text-[11px] font-ui font-bold text-[#5A5955] mb-1">
              <span className="truncate max-w-[220px]">{essay.title}</span>
              <span className="font-code text-[#191919]">{Math.round(scrollProgress)}%</span>
            </div>

            <div className="relative w-full h-3.5 bg-[#EFECE6] border-2 border-[#191919] rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-150 ease-out rounded-full"
                style={{
                  width: `${scrollProgress}%`,
                  backgroundColor: meta.surfaceColor,
                }}
              >
                <div className="h-1 bg-white/40 rounded-full mx-1 mt-0.5" />
              </div>
            </div>
          </div>

          {/* Right HUD Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {essay.isCustom && (
              <button
                onClick={() => {
                  audio.playClick();
                  onEditEssay(essay);
                }}
                className="duo-btn text-xs font-ui font-extrabold px-3 py-1.5 rounded-xl bg-white text-[#191919] flex items-center gap-1.5"
                title="Edit this Monograph"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Edit Monograph</span>
              </button>
            )}

            <button
              onClick={() => {
                audio.playClick();
                const el = document.getElementById("discourse-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="duo-btn text-xs font-ui font-extrabold px-2.5 py-1.5 rounded-xl bg-white text-[#191919] flex items-center gap-1"
              title="Jump to Dialectical Discourse & Comments"
            >
              <MessageSquareQuote className="w-3.5 h-3.5" />
              <span className="font-code">{essayCommentsCount}</span>
            </button>

            <button
              onClick={audio.toggleMute}
              className="duo-btn p-2 rounded-xl bg-white text-[#191919]"
              title={audio.isMuted ? "Unmute sounds" : "Mute sounds"}
            >
              {audio.isMuted ? (
                <VolumeX className="w-4 h-4 text-[#FF4B4B]" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#58CC02]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Floating Text-Selection Quote & Discourse Toolbar */}
      {selectionPosition && selectedText && (
        <div
          style={{
            position: "absolute",
            left: `${selectionPosition.x}px`,
            top: `${selectionPosition.y}px`,
            transform: "translate(-50%, -100%)",
          }}
          className="z-50 bg-[#191919] text-white rounded-xl p-1.5 shadow-[0_6px_16px_rgba(0,0,0,0.3)] flex items-center gap-1.5 text-xs font-ui font-bold animate-in fade-in zoom-in-95 duration-100"
        >
          <button
            onClick={handleSaveSelection}
            className="px-2.5 py-1.5 rounded-lg bg-[#FFC800] text-[#191919] hover:bg-[#FFC800]/90 flex items-center gap-1.5"
          >
            <Bookmark className="w-3.5 h-3.5 fill-[#191919]" />
            <span>Save to Vault</span>
          </button>

          <button
            onClick={handleQuoteInDiscourse}
            className="px-2.5 py-1.5 rounded-lg bg-white text-[#191919] hover:bg-[#EFECE6] flex items-center gap-1.5"
          >
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>Quote in Discourse</span>
          </button>
        </div>
      )}

      {/* Main Article Container */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-10">
        {/* Anti-Slop Editorial Meta Header (Unboxed typographic hierarchy with · separators) */}
        <header className="mb-8 pb-8 border-b-2 border-[#191919]">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div className="text-xs font-code font-bold uppercase tracking-widest flex flex-wrap items-center gap-2">
              <span
                className="px-2.5 py-0.5 rounded-md border border-[#191919] text-[#191919]"
                style={{ backgroundColor: meta.surfaceColor }}
              >
                {meta.symbol} {essay.pillarLabel}
              </span>
              <span className={activePaper.subtext}>·</span>
              <span className={activePaper.subtext}>{essay.readingTimeMinutes} MIN READ</span>
              <span className={activePaper.subtext}>·</span>
              <span className={activePaper.subtext}>{essay.publishedDate}</span>
              {essay.author && (
                <>
                  <span className={activePaper.subtext}>·</span>
                  <span className={activePaper.subtext}>BY {essay.author.toUpperCase()}</span>
                </>
              )}
              {isMastered && (
                <>
                  <span className={activePaper.subtext}>·</span>
                  <span className="text-[#439C00] font-extrabold">✓ MASTERED</span>
                </>
              )}
            </div>

            <span className="text-xs font-code font-bold text-[#D6A600]">
              +{essay.xpReward} XP
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-bold leading-[1.08] tracking-tight mb-4">
            {essay.title}
          </h1>

          <p className={`font-editorial text-lg sm:text-xl ${activePaper.subtext} leading-relaxed italic`}>
            {essay.subtitle}
          </p>

          {/* Clean Typographic Tags */}
          <div className={`flex flex-wrap items-center gap-2 mt-5 text-xs font-code ${activePaper.subtext}`}>
            <span>INDEXED CONCEPTS:</span>
            {essay.tags.map((tag, idx) => (
              <React.Fragment key={tag}>
                <span className="font-semibold underline decoration-dotted underline-offset-4">
                  #{tag}
                </span>
                {idx < essay.tags.length - 1 && <span>·</span>}
              </React.Fragment>
            ))}
          </div>
        </header>

        {/* Reader Comfort & Typography Customization Bar */}
        <section className="mb-6 p-3.5 bg-white text-[#191919] border-2 border-[#191919] shadow-[0_4px_0_0_#191919] rounded-2xl flex flex-wrap items-center justify-between gap-4">
          {/* Font Size Controls */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-ui font-black uppercase tracking-wider text-[#5A5955] flex items-center gap-1">
              <Type className="w-3.5 h-3.5" />
              <span>Type Scale:</span>
            </span>
            <div className="flex items-center gap-1 bg-[#EFECE6] p-1 rounded-xl border border-[#191919]">
              {(Object.keys(FONT_SIZE_MAP) as FontSizePreset[]).map((sz) => (
                <button
                  key={sz}
                  onClick={() => {
                    audio.playClick();
                    setFontSize(sz);
                  }}
                  className={`px-2.5 py-0.5 rounded-lg text-xs font-code font-bold transition-all ${
                    fontSize === sz
                      ? "bg-[#191919] text-white"
                      : "text-[#5A5955] hover:text-[#191919]"
                  }`}
                >
                  {FONT_SIZE_MAP[sz].label}
                </button>
              ))}
            </div>
          </div>

          {/* Line Spacing Controls */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-ui font-black uppercase tracking-wider text-[#5A5955] flex items-center gap-1">
              <AlignJustify className="w-3.5 h-3.5" />
              <span>Leading:</span>
            </span>
            <div className="flex items-center gap-1 bg-[#EFECE6] p-1 rounded-xl border border-[#191919]">
              {(Object.keys(LINE_SPACING_MAP) as LineSpacingPreset[]).map((ls) => (
                <button
                  key={ls}
                  onClick={() => {
                    audio.playClick();
                    setLineSpacing(ls);
                  }}
                  className={`px-2 py-0.5 rounded-lg text-xs font-code font-bold transition-all ${
                    lineSpacing === ls
                      ? "bg-[#191919] text-white"
                      : "text-[#5A5955] hover:text-[#191919]"
                  }`}
                >
                  {LINE_SPACING_MAP[ls].label}
                </button>
              ))}
            </div>
          </div>

          {/* Paper Surface Theme Controls */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-ui font-black uppercase tracking-wider text-[#5A5955]">
              Paper:
            </span>
            <div className="flex items-center gap-1.5">
              {(Object.keys(PAPER_THEMES) as PaperTheme[]).map((pt) => (
                <button
                  key={pt}
                  onClick={() => {
                    audio.playToggle();
                    setPaperTheme(pt);
                  }}
                  title={PAPER_THEMES[pt].label}
                  className={`w-6 h-6 rounded-full border-2 transition-transform ${
                    paperTheme === pt
                      ? "border-[#191919] scale-110 ring-2 ring-[#FFC800]"
                      : "border-[#191919]/40 hover:scale-105"
                  }`}
                  style={{ backgroundColor: PAPER_THEMES[pt].swatch }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 3-Level "Cognitive Plasticity" Depth Slider */}
        <section className="mb-10 p-2.5 bg-white text-[#191919] border-2 border-[#191919] shadow-[0_4px_0_0_#191919] rounded-2xl">
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-xs font-ui font-extrabold text-[#191919]">
              Cognitive Plasticity Depth Slider
            </span>
            <span className="text-[11px] font-code text-[#5A5955]">
              Highlight any sentence to save or quote in discourse
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={() => handleLevelChange(1)}
              className={`duo-btn text-xs font-ui font-extrabold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                depthLevel === 1
                  ? "bg-[#FFC800] text-[#191919] border-2 border-[#191919] shadow-[0_3px_0_0_#D6A600]"
                  : "bg-[#F7F6F3] text-[#5A5955] hover:text-[#191919]"
              }`}
            >
              <span>⚡ Level 1: 30s Synapse</span>
            </button>

            <button
              onClick={() => handleLevelChange(2)}
              className={`duo-btn text-xs font-ui font-extrabold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                depthLevel === 2
                  ? "bg-[#191919] text-white border-2 border-[#191919]"
                  : "bg-[#F7F6F3] text-[#5A5955] hover:text-[#191919]"
              }`}
            >
              <span>📖 Level 2: Dialectical Essay</span>
            </button>

            <button
              onClick={() => handleLevelChange(3)}
              className={`duo-btn text-xs font-ui font-extrabold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                depthLevel === 3
                  ? "bg-[#1CB0F6] text-white border-2 border-[#191919] shadow-[0_3px_0_0_#1185BA]"
                  : "bg-[#F7F6F3] text-[#5A5955] hover:text-[#191919]"
              }`}
            >
              <span>🧮 Level 3: Formalisms & Math</span>
            </button>
          </div>
        </section>

        {/* --- LEVEL 1: 30s SYNAPSE --- */}
        {depthLevel === 1 && (
          <article className="space-y-8 text-[#191919] animate-in fade-in duration-200">
            <div className="p-6 bg-white border-2 border-[#191919] shadow-[0_4px_0_0_#191919] rounded-2xl">
              <h3 className="font-display font-bold text-xl text-[#191919] mb-4">
                Executive Conceptual Distillation
              </h3>
              <ul className="space-y-3">
                {essay.content.level1.bullets.map((bullet, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 font-editorial text-base leading-relaxed text-[#191919]"
                  >
                    <span className="w-6 h-6 rounded-full bg-[#FFF9E0] text-[#191919] border border-[#191919] font-code text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      0{idx + 1}
                    </span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mental Model Table */}
            <div className="bg-white border-2 border-[#191919] shadow-[0_4px_0_0_#191919] rounded-2xl overflow-hidden">
              <div className="p-4 bg-[#EFECE6] border-b-2 border-[#191919] flex items-center justify-between">
                <h4 className="font-ui font-black text-sm text-[#191919]">
                  Paradigm Shift Matrix
                </h4>
                <span className="text-[10px] font-code text-[#5A5955]">ONTOLOGICAL COMPARISON</span>
              </div>
              <div className="divide-y divide-[#E2E0DC]">
                {essay.content.level1.mentalModelTable.map((row, i) => (
                  <div key={i} className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="font-ui font-bold text-[#191919] uppercase tracking-wider text-[11px]">
                      {row.dimension}
                    </div>
                    <div className="text-[#5A5955] bg-[#F7F6F3] p-3 rounded-xl border border-[#E2E0DC]">
                      <span className="font-bold text-[#CC2929] block mb-1">Standard Orthodox View</span>
                      {row.traditionalView}
                    </div>
                    <div className="text-[#191919] bg-[#FFF9E0] p-3 rounded-xl border border-[#191919]">
                      <span className="font-bold text-[#439C00] block mb-1">Neuroplastic Synthesis</span>
                      {row.nureoplasticSynthesis}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>
        )}

        {/* --- LEVEL 2: DIALECTICAL ESSAY (Enhanced Readability, Drop-caps, Pull Quotes) --- */}
        {depthLevel === 2 && (
          <article
            className={`font-editorial ${FONT_SIZE_MAP[fontSize].className} ${LINE_SPACING_MAP[lineSpacing].className} space-y-10 animate-in fade-in duration-200 max-w-[65ch] mx-auto`}
          >
            {/* Section Index Jump Bar */}
            {essay.content.level2.sections.length > 1 && (
              <nav className="p-4 rounded-2xl border border-[#191919]/25 bg-black/5 text-xs font-ui">
                <span className="font-code font-bold uppercase tracking-wider block mb-2 opacity-75">
                  Monograph Sections
                </span>
                <div className="flex flex-wrap gap-2">
                  {essay.content.level2.sections.map((sec, idx) => (
                    <a
                      key={idx}
                      href={`#section-${idx}`}
                      className="font-semibold hover:underline"
                    >
                      {sec.heading}
                      {idx < essay.content.level2.sections.length - 1 && " · "}
                    </a>
                  ))}
                </div>
              </nav>
            )}

            {essay.content.level2.sections.map((section, idx) => (
              <div key={idx} id={`section-${idx}`} className="space-y-5">
                <h2 className="font-display text-2xl sm:text-3xl font-bold mt-8 pt-2">
                  {section.heading}
                </h2>

                {section.paragraphs.map((para, pIdx) => {
                  const annotation = section.annotationId
                    ? essay.socraticAnnotations[section.annotationId]
                    : null;
                  const isFirstParagraphOfEssay = idx === 0 && pIdx === 0;

                  if (annotation && pIdx === 0 && para.includes(annotation.claimText)) {
                    const parts = para.split(annotation.claimText);
                    return (
                      <div
                        key={pIdx}
                        className={`my-5 ${isFirstParagraphOfEssay ? "editorial-dropcap" : ""}`}
                      >
                        <span>{parts[0]}</span>
                        <SocraticMarginCallout
                          annotation={annotation}
                          isOpen={activeAnnotationId === annotation.id}
                          onToggle={() =>
                            setActiveAnnotationId(
                              activeAnnotationId === annotation.id ? null : annotation.id
                            )
                          }
                          onSaveToVault={(ann, note) => {
                            audio.playClick();
                            onSaveToVault({
                              text: ann.claimText,
                              pillar: ann.pillar,
                              essayTitle: essay.title,
                              userNote: note,
                            });
                          }}
                          isSaved={savedAnnotationIds.includes(annotation.id)}
                        />
                        <span>{parts[1]}</span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={pIdx}
                      className={`my-5 ${isFirstParagraphOfEssay ? "editorial-dropcap" : ""}`}
                    >
                      {para}
                    </div>
                  );
                })}

                {/* Centered Editorial Pull Quote (Anti-Slop Rule: no thick left borders; uses centered serif + top/bottom hairline rules) */}
                {section.pullQuote && (
                  <figure className="my-10 py-6 border-y border-current/25 text-center px-4 sm:px-8">
                    <blockquote className="font-display italic text-xl sm:text-2xl leading-snug">
                      “{section.pullQuote}”
                    </blockquote>
                  </figure>
                )}
              </div>
            ))}
          </article>
        )}

        {/* --- LEVEL 3: HUMAN-READABLE FORMALISMS & CONCEPTUAL MECHANICS --- */}
        {depthLevel === 3 && (
          <HumanMathDerivation
            formalProofTitle={essay.content.level3.formalProofTitle}
            latexFormulas={essay.content.level3.latexFormulas}
            architecturalProof={essay.content.level3.architecturalProof}
            accentColor={meta.surfaceColor}
          />
        )}

        {essay.sources && essay.sources.length > 0 && (
          <section className="essay-sources" aria-labelledby="essay-sources-heading">
            <h3 id="essay-sources-heading" className="font-display">Sources & further reading</h3>
            {essay.editorialNote && <p>{essay.editorialNote}</p>}
            <ol>
              {essay.sources.map((source, index) => (
                <li key={source.url}>
                  <span>[{index + 1}]</span>
                  <div>
                    <a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}<span className="sr-only"> (opens in a new tab)</span></a>
                    <small>{source.publisher}</small>
                    <small>{source.note}</small>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Inline Interactive Concept Sandbox */}
        <section className="my-14 text-[#191919]">
          <div className="text-center mb-4">
            <span className="text-[11px] font-code font-bold uppercase tracking-widest text-[#5A5955]">
              INTERACTIVE VERIFICATION SANDBOX
            </span>
          </div>

          {essay.sandboxType === "entropy" && (
            <EntropyPruningSandbox onInteract={() => audio.playToggle()} />
          )}

          {essay.sandboxType === "compound" && <CompoundInterestSandbox />}

          {essay.sandboxType === "epistemic" && (
            <EpistemicHorizonSandbox onInteract={() => audio.playToggle()} />
          )}

          {essay.sandboxType === "attractor" && (
            <AttractorBasinSandbox
              onInteract={() => audio.playClick()}
              onSuccessEscape={() => audio.playSuccessChord()}
            />
          )}
        </section>

        {/* End-of-Essay "Neuro-Lock" Mastery Challenge Card */}
        <section className={`mt-14 pt-8 border-t-2 border-[#191919] text-[#191919] ${essay.pillar === "finance" ? "finance-quiz" : ""}`}>
          <div className="border-2 border-[#191919] shadow-[0_8px_0_0_#191919] rounded-3xl bg-white p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b-2 border-[#E2E0DC]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FFC800] border-2 border-[#191919] flex items-center justify-center shadow-[0_3px_0_0_#D6A600]">
                  <Award className="w-6 h-6 text-[#191919]" />
                </div>
                <div>
                  <span className="text-[10px] font-code font-bold uppercase tracking-widest text-[#D6A600]">
                    NEURO-LOCK CONCEPT VERIFICATION
                  </span>
                  <h3 className="font-display font-bold text-xl text-[#191919]">
                    {essay.pillar === "finance" ? "Penny’s Knowledge Check" : "Dialectical Mastery Check"}
                  </h3>
                </div>
              </div>

              <span className="font-code text-xs font-bold text-[#191919]">
                +{essay.xpReward} Insight XP
              </span>
            </div>

            <div className="my-5 p-4 bg-[#F7F6F3] border-2 border-[#191919] rounded-2xl">
              <div className="text-xs font-ui font-bold text-[#5A5955] uppercase tracking-wider mb-1 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Scenario Context</span>
              </div>
              <p className="text-sm font-editorial text-[#191919] mb-3">
                {essay.masteryQuiz.scenario}
              </p>
              <h4 className="text-base font-ui font-extrabold text-[#191919]">
                {essay.masteryQuiz.question}
              </h4>
            </div>

            <div className="space-y-3">
              {essay.masteryQuiz.options.map((opt, index) => {
                const isSelected = selectedOptionId === opt.id;
                const isWrong = isSelected && quizState === "wrong";
                const isCorrect = isSelected && quizState === "correct";

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleQuizSubmit(opt.id)}
                    disabled={quizState === "correct"}
                    aria-pressed={isSelected}
                    data-result={isCorrect ? "correct" : isWrong ? "retry" : undefined}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-3 duo-btn ${
                      isCorrect
                        ? "bg-[#58CC02] text-white border-[#191919] shadow-[0_4px_0_0_#439C00]"
                        : isWrong
                        ? "bg-[#FF4B4B] text-white border-[#191919] shadow-[0_4px_0_0_#CC2929] animate-shake"
                        : "bg-white text-[#191919] border-[#191919] hover:bg-[#F7F6F3]"
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full border-2 text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5 ${
                        isCorrect
                          ? "bg-white text-[#439C00] border-white"
                          : isWrong
                          ? "bg-white text-[#CC2929] border-white"
                          : "bg-[#EFECE6] text-[#191919] border-[#191919]"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-ui font-bold leading-relaxed">{opt.text}</p>
                      {(isCorrect || isWrong) && (
                        <p className="text-xs font-ui mt-2 opacity-95 leading-relaxed" role="status">
                          <strong>{isCorrect ? "Correct. " : "Try again. "}</strong>{opt.explanation}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {quizState === "wrong" && showQuizHint && (
              <div className="mt-4 p-4 bg-[#FFEBEB] border-2 border-[#FF4B4B] rounded-2xl flex items-center gap-3">
                <NotionMascot variant={essay.pillar === "finance" ? "steward" : "critic"} mood="oops" size={54} interactiveEyes={false} />
                <div className="text-xs font-ui">
                  <strong className="text-[#FF4B4B] block mb-0.5">Socratic Hint:</strong>
                  <p className="text-[#191919]">{essay.masteryQuiz.hint}</p>
                </div>
              </div>
            )}

            {quizState === "correct" && (
              <div className="mt-4 p-5 bg-[#ECF9E0] border-2 border-[#58CC02] rounded-2xl flex items-center justify-between gap-4 shadow-[0_4px_0_0_#439C00]">
                <div className="flex items-center gap-3">
                  <NotionMascot variant={essay.pillar === "finance" ? "steward" : "celebrating"} mood="excited" size={60} interactiveEyes={false} />
                  <div>
                    <h5 className="font-ui font-black text-base text-[#191919]">
                      Neuro-Lock Unlocked! (+{essay.xpReward} XP)
                    </h5>
                    <p className="text-xs font-ui text-[#439C00] font-bold">
                      This monograph node is now verified on your Synapse Knowledge Graph.
                    </p>
                  </div>
                </div>

                <button
                  onClick={onBack}
                  className="duo-btn duo-btn-bio text-xs font-ui font-extrabold px-4 py-2.5 rounded-xl shrink-0"
                >
                  Return to Garden
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Interactive Dialectical Discourse & Peer Commentary Section */}
        <div id="discourse-section" className="text-[#191919]">
          <DialecticalComments
            essayId={essay.id}
            essayTitle={essay.title}
            comments={comments}
            pendingQuote={pendingQuote ?? undefined}
            onClearPendingQuote={() => setPendingQuote(null)}
            onAddComment={onAddComment}
            onAddReply={onReplyComment}
            onUpvote={onUpvoteComment}
            onPlayClick={() => audio.playClick()}
          />
        </div>
      </main>
    </div>
  );
};
