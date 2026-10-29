import React, { useState } from "react";
import { NotionMascot } from "./NotionMascot.tsx";
import { Sparkles, MessageCircleQuestion, BookmarkPlus, Check, X, ChevronDown, ChevronUp } from "lucide-react";

export interface SocraticAnnotation {
  id: string;
  claimText: string;
  pillar: "philosophy" | "ai" | "behavior";
  analogyTitle: string;
  analogyContent: string;
  challengeQuestion: string;
  counterPerspective: string;
}

interface SocraticMarginCalloutProps {
  annotation: SocraticAnnotation;
  isOpen: boolean;
  onToggle: () => void;
  onSaveToVault: (annotation: SocraticAnnotation, note?: string) => void;
  isSaved?: boolean;
}

export const SocraticMarginCallout: React.FC<SocraticMarginCalloutProps> = ({
  annotation,
  isOpen,
  onToggle,
  onSaveToVault,
  isSaved = false,
}) => {
  const [activeTab, setActiveTab] = useState<"analogy" | "challenge">("analogy");
  const [showCounter, setShowCounter] = useState<boolean>(false);
  const [userNote, setUserNote] = useState<string>("");
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = () => {
    onSaveToVault(annotation, userNote);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const getPillarColors = () => {
    switch (annotation.pillar) {
      case "philosophy":
        return {
          bg: "bg-[#F7E8FF]",
          border: "border-[#9B42D6]",
          text: "text-[#9B42D6]",
          accent: "#CE82FF",
        };
      case "ai":
        return {
          bg: "bg-[#E5F6FD]",
          border: "border-[#1185BA]",
          text: "text-[#1185BA]",
          accent: "#1CB0F6",
        };
      case "behavior":
      default:
        return {
          bg: "bg-[#ECF9E0]",
          border: "border-[#439C00]",
          text: "text-[#439C00]",
          accent: "#58CC02",
        };
    }
  };

  const colors = getPillarColors();

  return (
    <span className="relative inline">
      {/* Inline Socratic Trigger Phrase */}
      <span
        onClick={onToggle}
        className="border-b-2 border-dashed border-[#191919] bg-[#FFC800]/20 px-1 py-0.5 rounded cursor-pointer font-medium hover:bg-[#FFC800]/40 transition-colors inline-flex items-center gap-1 group"
        title="Click to summon Socratic Margin Mentor"
      >
        <span>{annotation.claimText}</span>
        <span className="text-[10px] font-ui font-extrabold px-1 rounded bg-[#191919] text-white group-hover:scale-105 transition-transform">
          ?
        </span>
      </span>

      {/* Floating 3D Speech Bubble Card */}
      {isOpen && (
        <div className="fixed inset-x-4 bottom-4 md:absolute md:inset-auto md:top-full md:left-0 md:mt-2 z-40 w-auto md:w-[380px] bg-white border-2 border-[#191919] shadow-[0_8px_0_0_#191919] rounded-2xl p-4 animate-in fade-in zoom-in-95 duration-150">
          {/* Comic Bubble Pointer (desktop only) */}
          <div className="hidden md:block absolute -top-2 left-6 w-3.5 h-3.5 bg-white border-t-2 border-l-2 border-[#191919] -rotate-45" />

          {/* Header with Mascot */}
          <div className="flex items-start justify-between gap-2 pb-3 border-b-2 border-[#E2E0DC]">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#F7F6F3] border-2 border-[#191919] p-0.5 flex items-center justify-center shrink-0">
                <NotionMascot
                  variant="critic"
                  mood={activeTab === "challenge" ? "curious" : "thinking"}
                  size={36}
                  interactiveEyes={false}
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-ui font-black uppercase tracking-wider ${colors.text}`}>
                    Socratic Margin Mentor
                  </span>
                </div>
                <h6 className="font-ui font-extrabold text-sm text-[#191919] leading-tight">
                  {activeTab === "analogy" ? "Feynman Translation" : "Dialectical Friction"}
                </h6>
              </div>
            </div>

            <button
              onClick={onToggle}
              className="p-1 rounded-lg text-[#5A5955] hover:text-[#191919] hover:bg-[#F7F6F3] transition-colors"
              aria-label="Close mentor bubble"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Segmented Control: Analogy vs Challenge */}
          <div className="grid grid-cols-2 gap-1.5 bg-[#F7F6F3] p-1 rounded-xl border border-[#E2E0DC] my-3">
            <button
              onClick={() => setActiveTab("analogy")}
              className={`text-xs font-ui font-bold py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "analogy"
                  ? "bg-white text-[#191919] border-2 border-[#191919] shadow-[0_2px_0_0_#191919]"
                  : "text-[#5A5955] hover:text-[#191919]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FFC800]" />
              <span>Plain Analogy</span>
            </button>

            <button
              onClick={() => setActiveTab("challenge")}
              className={`text-xs font-ui font-bold py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "challenge"
                  ? "bg-white text-[#191919] border-2 border-[#191919] shadow-[0_2px_0_0_#191919]"
                  : "text-[#5A5955] hover:text-[#191919]"
              }`}
            >
              <MessageCircleQuestion className="w-3.5 h-3.5 text-[#CE82FF]" />
              <span>Challenge This</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="text-xs font-ui text-[#191919] leading-relaxed max-h-[220px] overflow-y-auto pr-1">
            {activeTab === "analogy" ? (
              <div className="space-y-2">
                <div className="font-bold text-[#191919] text-xs flex items-center gap-1">
                  💡 {annotation.analogyTitle}
                </div>
                <p className="text-[#5A5955] leading-relaxed bg-[#F7F6F3] p-2.5 rounded-xl border border-[#E2E0DC]">
                  {annotation.analogyContent}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-2.5 bg-[#FFEBEB] border-2 border-[#FF4B4B] rounded-xl text-xs font-ui">
                  <div className="font-bold text-[#FF4B4B] mb-1">Socratic Counter-Question:</div>
                  <p className="text-[#191919] font-medium">{annotation.challengeQuestion}</p>
                </div>

                <div>
                  <button
                    onClick={() => setShowCounter(!showCounter)}
                    className="text-[11px] font-ui font-bold text-[#9B42D6] hover:underline flex items-center gap-1"
                  >
                    {showCounter ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    {showCounter ? "Hide Counter-Perspective" : "Reveal Dialectical Counter-Perspective"}
                  </button>

                  {showCounter && (
                    <div className="mt-2 p-2.5 bg-[#F7F6F3] border border-[#191919] rounded-xl text-[11px] text-[#5A5955] leading-relaxed">
                      {annotation.counterPerspective}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Annotation input */}
            <div className="mt-3 pt-3 border-t border-[#E2E0DC]">
              <input
                type="text"
                placeholder="Add a personal margin reflection..."
                value={userNote}
                onChange={(e) => setUserNote(e.target.value)}
                className="w-full text-xs font-ui px-2.5 py-1.5 rounded-lg border border-[#E2E0DC] focus:border-[#191919] focus:outline-none"
              />
            </div>
          </div>

          {/* Footer Save Action */}
          <div className="mt-3 pt-3 border-t-2 border-[#E2E0DC] flex items-center justify-between">
            <span className="text-[10px] font-ui text-[#5A5955]">
              {isSaved ? "Saved in Synapse Vault" : "Store in local garden vault"}
            </span>

            <button
              onClick={handleSave}
              className={`duo-btn text-xs font-ui font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
                savedSuccess || isSaved
                  ? "bg-[#58CC02] text-white border-[#191919]"
                  : "bg-[#FFC800] text-[#191919] border-[#191919]"
              }`}
            >
              {savedSuccess || isSaved ? <Check className="w-3.5 h-3.5" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
              <span>{savedSuccess ? "Saved!" : isSaved ? "In Vault" : "Save Insight"}</span>
            </button>
          </div>
        </div>
      )}
    </span>
  );
};
