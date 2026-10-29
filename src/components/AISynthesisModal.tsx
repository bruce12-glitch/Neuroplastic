import React, { useState } from "react";
import { NotionMascot } from "./NotionMascot.tsx";
import {
  Sparkles,
  Search,
  Brain,
  Image as ImageIcon,
  X,
  Loader2,
  ExternalLink,
  Download,
  Copy,
  Check,
} from "lucide-react";

interface AISynthesisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayClick?: () => void;
}

export const AISynthesisModal: React.FC<AISynthesisModalProps> = ({
  isOpen,
  onClose,
  onPlayClick,
}) => {
  const [activeTab, setActiveTab] = useState<"search" | "thinking" | "image">("thinking");

  // Tab 1: Search Grounded
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [searchSources, setSearchSources] = useState<any[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  // Tab 2: Deep Thinking Synthesis
  const [conceptA, setConceptA] = useState("Epistemic Solipsism in Modern Philosophy");
  const [conceptB, setConceptB] = useState("Entropy Context Pruning in AI Transformers");
  const [thinkingResult, setThinkingResult] = useState<string | null>(null);
  const [isThinkingLoading, setIsThinkingLoading] = useState(false);

  // Tab 3: Image Generation
  const [imagePrompt, setImagePrompt] = useState("A rubber-hose character gazing into an attention tensor cube");
  const [imageSize, setImageSize] = useState<"1K" | "2K" | "4K">("1K");
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);

  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    onPlayClick?.();
    setIsSearchLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/ai/search-grounded", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await res.json();
      if (data.error && !data.fallback) {
        setErrorMsg(data.error);
      } else {
        setSearchResult(data.text || data.fallback);
        setSearchSources(data.groundingMetadata?.groundingChunks || []);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to query search grounding");
    } finally {
      setIsSearchLoading(false);
    }
  };

  const handleThinkingSubmit = async () => {
    onPlayClick?.();
    setIsThinkingLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/ai/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conceptA, conceptB }),
      });
      const data = await res.json();
      if (data.error && !data.fallback) {
        setErrorMsg(data.error);
      } else {
        setThinkingResult(data.text || data.fallback);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to execute high-thinking synthesis");
    } finally {
      setIsThinkingLoading(false);
    }
  };

  const handleImageSubmit = async () => {
    if (!imagePrompt.trim()) return;
    onPlayClick?.();
    setIsImageLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/ai/generate-concept-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: imagePrompt, size: imageSize }),
      });
      const data = await res.json();
      if (data.error) {
        setErrorMsg(data.error);
      } else if (data.imageUrl) {
        setGeneratedImageUrl(data.imageUrl);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to generate concept image");
    } finally {
      setIsImageLoading(false);
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-[#191919]/60 backdrop-blur-xs">
      <div className="bg-white border-2 border-[#191919] rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-[0_12px_0_0_#191919] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-6 pb-4 border-b-2 border-[#E2E0DC] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1CB0F6] border-2 border-[#191919] flex items-center justify-center shadow-[0_2px_0_0_#1185BA]">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-ui font-black text-lg text-[#191919]">
                AI Epistemic Synthesizer
              </h3>
              <p className="text-xs font-ui text-[#5A5955]">
                Cross-pillar reasoning with Search Grounding & Gemini 4 Argon
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#5A5955] hover:text-[#191919] hover:bg-[#F7F6F3]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-3 flex gap-2 border-b border-[#E2E0DC] bg-[#F7F6F3]">
          <button
            onClick={() => setActiveTab("thinking")}
            className={`duo-btn text-xs font-ui font-bold px-3 py-2 rounded-t-xl flex items-center gap-1.5 ${
              activeTab === "thinking"
                ? "bg-white text-[#191919] border-b-0"
                : "bg-transparent text-[#5A5955] border-transparent shadow-none"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#CE82FF]" />
            <span>High-Thinking Synthesis (Argon)</span>
          </button>

          <button
            onClick={() => setActiveTab("search")}
            className={`duo-btn text-xs font-ui font-bold px-3 py-2 rounded-t-xl flex items-center gap-1.5 ${
              activeTab === "search"
                ? "bg-white text-[#191919] border-b-0"
                : "bg-transparent text-[#5A5955] border-transparent shadow-none"
            }`}
          >
            <Search className="w-3.5 h-3.5 text-[#1CB0F6]" />
            <span>Search Grounding (Flash)</span>
          </button>

          <button
            onClick={() => setActiveTab("image")}
            className={`duo-btn text-xs font-ui font-bold px-3 py-2 rounded-t-xl flex items-center gap-1.5 ${
              activeTab === "image"
                ? "bg-white text-[#191919] border-b-0"
                : "bg-transparent text-[#5A5955] border-transparent shadow-none"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-[#58CC02]" />
            <span>Concept Diagram (1K-4K)</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-[#FFEBEB] border-2 border-[#FF4B4B] rounded-xl text-xs font-ui text-[#191919]">
              <strong className="text-[#FF4B4B] block mb-1">Notice:</strong>
              {errorMsg}
            </div>
          )}

          {/* TAB 1: THINKING SYNTHESIS */}
          {activeTab === "thinking" && (
            <div className="space-y-4">
              <p className="text-xs font-ui text-[#5A5955]">
                Gemini 4 Argon will utilize <strong>ThinkingLevel.HIGH</strong> to construct a dialectical bridge uniting two disparate cognitive concepts.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-ui font-bold text-[#191919] block mb-1">
                    Thesis Concept 1 (e.g. Epistemology):
                  </label>
                  <input
                    type="text"
                    value={conceptA}
                    onChange={(e) => setConceptA(e.target.value)}
                    className="w-full text-xs font-ui px-3 py-2 rounded-xl border-2 border-[#191919] bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-ui font-bold text-[#191919] block mb-1">
                    Antithesis Concept 2 (e.g. AI / Neuroscience):
                  </label>
                  <input
                    type="text"
                    value={conceptB}
                    onChange={(e) => setConceptB(e.target.value)}
                    className="w-full text-xs font-ui px-3 py-2 rounded-xl border-2 border-[#191919] bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleThinkingSubmit}
                  disabled={isThinkingLoading}
                  className="duo-btn duo-btn-phil text-xs font-ui font-extrabold px-4 py-2.5 rounded-xl flex items-center gap-2"
                >
                  {isThinkingLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>{isThinkingLoading ? "Reasoning with High Thinking..." : "Execute Conceptual Synthesis"}</span>
                </button>
              </div>

              {thinkingResult && (
                <div className="mt-4 p-4 bg-[#F7E8FF] border-2 border-[#9B42D6] rounded-2xl">
                  <div className="flex items-center justify-between pb-2 border-b border-[#9B42D6]/30 mb-3">
                    <span className="text-[10px] font-ui font-black uppercase tracking-wider text-[#9B42D6]">
                      Gemini 4 Argon High-Thinking Output
                    </span>
                    <button
                      onClick={() => handleCopyText(thinkingResult)}
                      className="text-xs font-ui text-[#9B42D6] font-bold hover:underline flex items-center gap-1"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  <div className="font-editorial text-sm text-[#191919] leading-relaxed whitespace-pre-wrap">
                    {thinkingResult}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SEARCH GROUNDED */}
          {activeTab === "search" && (
            <div className="space-y-4">
              <p className="text-xs font-ui text-[#5A5955]">
                Query real-time academic citations and web findings using <strong>gemini-3.8-flash</strong> with Google Search Grounding.
              </p>

              <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Rényi entropy in Transformer attention pruning 2026..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 text-xs font-ui px-3 py-2.5 rounded-xl border-2 border-[#191919] bg-white focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isSearchLoading}
                  className="duo-btn duo-btn-ai text-xs font-ui font-extrabold px-4 py-2.5 rounded-xl flex items-center gap-2 shrink-0"
                >
                  {isSearchLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  <span>{isSearchLoading ? "Searching..." : "Search Web"}</span>
                </button>
              </form>

              {searchResult && (
                <div className="p-4 bg-[#E5F6FD] border-2 border-[#1185BA] rounded-2xl">
                  <div className="text-[10px] font-ui font-black uppercase tracking-wider text-[#1185BA] mb-2">
                    Search Grounded Synthesis
                  </div>
                  <div className="font-editorial text-sm text-[#191919] leading-relaxed whitespace-pre-wrap">
                    {searchResult}
                  </div>

                  {searchSources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-[#1185BA]/30">
                      <div className="text-[11px] font-ui font-bold text-[#1185BA] mb-1">
                        Web Sources:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {searchSources.map((source, i) => (
                          <a
                            key={i}
                            href={source.web?.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-ui text-[#191919] bg-white px-2 py-1 rounded border border-[#1185BA] flex items-center gap-1 hover:underline"
                          >
                            <span>{source.web?.title || "Citation"}</span>
                            <ExternalLink className="w-2.5 h-2.5 text-[#1185BA]" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: IMAGE GENERATION WITH 1K, 2K, 4K */}
          {activeTab === "image" && (
            <div className="space-y-4">
              <p className="text-xs font-ui text-[#5A5955]">
                Generate high-resolution Notion-style editorial illustrations with <strong>gemini-3-pro-image</strong>.
              </p>

              <div>
                <label className="text-xs font-ui font-bold text-[#191919] block mb-1">
                  Concept Prompt:
                </label>
                <textarea
                  rows={2}
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  className="w-full text-xs font-ui px-3 py-2 rounded-xl border-2 border-[#191919] bg-white focus:outline-none"
                />
              </div>

              {/* Resolution Affordance (1K, 2K, 4K as requested) */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-ui font-bold text-[#191919]">Resolution:</span>
                  {(["1K", "2K", "4K"] as const).map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setImageSize(sz)}
                      className={`duo-btn text-xs font-ui font-bold px-3 py-1 rounded-lg ${
                        imageSize === sz
                          ? "bg-[#58CC02] text-white"
                          : "bg-[#F7F6F3] text-[#191919]"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleImageSubmit}
                  disabled={isImageLoading}
                  className="duo-btn duo-btn-bio text-xs font-ui font-extrabold px-4 py-2 rounded-xl flex items-center gap-2"
                >
                  {isImageLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                  <span>{isImageLoading ? "Generating..." : `Render ${imageSize} Image`}</span>
                </button>
              </div>

              {generatedImageUrl && (
                <div className="mt-4 p-4 bg-white border-2 border-[#191919] rounded-2xl shadow-[0_4px_0_0_#191919] flex flex-col items-center">
                  <img
                    src={generatedImageUrl}
                    alt="Concept Illustration"
                    className="max-h-72 object-contain rounded-xl border border-[#191919]"
                  />
                  <div className="mt-3 flex items-center justify-between w-full">
                    <span className="text-xs font-code text-[#5A5955]">
                      Size: {imageSize}
                    </span>
                    <a
                      href={generatedImageUrl}
                      download={`nureoplastic-concept-${imageSize}.png`}
                      className="duo-btn duo-btn-streak text-xs font-ui font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Image</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
