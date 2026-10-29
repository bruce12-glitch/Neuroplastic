import React, { useState } from "react";
import { exportVaultToMarkdown } from "../utils/rules.ts";
import { NotionMascot } from "./NotionMascot.tsx";
import { PILLAR_METADATA, type PillarId } from "../data/essays.ts";
import {
  X,
  Download,
  Trash2,
  Copy,
  Check,
  Search,
  Sparkles,
  FileText,
  Share2,
} from "lucide-react";

export interface VaultItem {
  id: string;
  text: string;
  pillar: string;
  essayTitle: string;
  userNote?: string;
  createdAt: string;
}

interface SynapseVaultDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  vaultItems: VaultItem[];
  onDeleteItem: (id: string) => void;
}

export const SynapseVaultDrawer: React.FC<SynapseVaultDrawerProps> = ({
  isOpen,
  onClose,
  vaultItems,
  onDeleteItem,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPillar, setSelectedPillar] = useState<string>("all");
  const [copiedMd, setCopiedMd] = useState(false);
  const [quoteCardItem, setQuoteCardItem] = useState<VaultItem | null>(null);
  const [quoteCardTheme, setQuoteCardTheme] = useState<"notion" | "philosophy" | "ai" | "behavior">("notion");

  if (!isOpen) return null;

  const filteredItems = vaultItems.filter((item) => {
    const matchesPillar = selectedPillar === "all" || item.pillar.toLowerCase() === selectedPillar.toLowerCase();
    const matchesSearch =
      item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.essayTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.userNote && item.userNote.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesPillar && matchesSearch;
  });

  const handleExportMarkdown = () => {
    const mdContent = exportVaultToMarkdown(vaultItems);
    const blob = new Blob([mdContent], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `neuroplastic-study-notes-${new Date().toISOString().slice(0, 10)}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyMarkdown = () => {
    const mdContent = exportVaultToMarkdown(vaultItems);
    navigator.clipboard.writeText(mdContent).then(() => {
      setCopiedMd(true);
      setTimeout(() => setCopiedMd(false), 2000);
    });
  };

  const getPillarBadge = (pillar: string) => {
    switch (pillar.toLowerCase()) {
      case "finance":
        return <span className="px-2 py-0.5 rounded text-[10px] font-ui font-extrabold bg-[#EAF4E8] text-[#426545] border border-[#426545]">Finance</span>;
      case "philosophy":
        return <span className="px-2 py-0.5 rounded text-[10px] font-ui font-extrabold bg-[#F7E8FF] text-[#9B42D6] border border-[#9B42D6]">Philosophy</span>;
      case "ai":
      case "ai research":
        return <span className="px-2 py-0.5 rounded text-[10px] font-ui font-extrabold bg-[#E5F6FD] text-[#1185BA] border border-[#1185BA]">AI Research</span>;
      case "behavior":
      case "human behavior":
        return <span className="px-2 py-0.5 rounded text-[10px] font-ui font-extrabold bg-[#ECF9E0] text-[#439C00] border border-[#439C00]">Human Behavior</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-ui font-extrabold bg-[#FFF9E0] text-[#D6A600] border border-[#D6A600]">{pillar}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#191919]/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-[#F7F6F3] border-l-2 border-[#191919] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 bg-white border-b-2 border-[#191919] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFC800] border-2 border-[#191919] flex items-center justify-center shadow-[0_2px_0_0_#D6A600]">
                <FileText className="w-5 h-5 text-[#191919]" />
              </div>
              <div>
                <h3 className="font-ui font-black text-lg text-[#191919]">Synapse Vault</h3>
                <p className="text-xs font-ui text-[#5A5955]">
                  {vaultItems.length} saved cognitive insights & annotations
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#5A5955] hover:text-[#191919] hover:bg-[#F7F6F3] border border-transparent hover:border-[#E2E0DC] transition-all"
              aria-label="Close vault drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action Toolbar */}
          <div className="p-4 bg-white/70 border-b-2 border-[#E2E0DC] space-y-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5A5955]" />
              <input
                type="text"
                placeholder="Search quotes, ideas, or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs font-ui pl-9 pr-3 py-2 rounded-xl border-2 border-[#191919] bg-white focus:outline-none shadow-[0_2px_0_0_#191919]"
              />
            </div>

            {/* Pillar Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {["all", ...Object.keys(PILLAR_METADATA), "behavior"].map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPillar(p)}
                  className={`duo-btn text-[11px] font-ui font-bold px-2.5 py-1 rounded-lg capitalize whitespace-nowrap ${
                    selectedPillar === p
                      ? "bg-[#191919] text-white"
                      : "bg-white text-[#191919]"
                  }`}
                >
                  {p === "all" ? "All Pillars" : PILLAR_METADATA[p as PillarId]?.label || p}
                </button>
              ))}
            </div>

            {/* Export Actions */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] font-ui text-[#5A5955]">
                Showing {filteredItems.length} items
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyMarkdown}
                  disabled={vaultItems.length === 0}
                  className="duo-btn text-xs font-ui font-bold px-2.5 py-1.5 rounded-lg bg-white text-[#191919] flex items-center gap-1.5"
                  title="Copy formatted Markdown notes"
                >
                  {copiedMd ? <Check className="w-3.5 h-3.5 text-[#58CC02]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedMd ? "Copied" : "Copy MD"}</span>
                </button>

                <button
                  onClick={handleExportMarkdown}
                  disabled={vaultItems.length === 0}
                  className="duo-btn duo-btn-streak text-xs font-ui font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export .MD Notes</span>
                </button>
              </div>
            </div>
          </div>

          {/* List of Saved Insights */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {filteredItems.length === 0 ? (
              <div className="text-center py-12 px-4">
                <NotionMascot variant="observer" mood="curious" size={100} className="mx-auto opacity-70" />
                <h5 className="font-ui font-bold text-sm text-[#191919] mt-3">
                  Your Vault is Ready to Bloom
                </h5>
                <p className="text-xs font-ui text-[#5A5955] mt-1 max-w-xs mx-auto">
                  Highlight sentences inside essays or click Socratic margin callouts to collect ideas into your personal garden.
                </p>
              </div>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-white border-2 border-[#191919] rounded-xl shadow-[0_3px_0_0_#191919] transition-all hover:translate-y-[-1px]"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    {getPillarBadge(item.pillar)}
                    <span className="text-[10px] font-code text-[#5A5955]">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <blockquote className="font-editorial text-sm text-[#191919] italic leading-relaxed border-l-2 border-[#FFC800] pl-3 my-2">
                    "{item.text}"
                  </blockquote>

                  {item.userNote && (
                    <div className="mt-2 text-xs font-ui text-[#5A5955] bg-[#F7F6F3] p-2 rounded-lg border border-[#E2E0DC]">
                      <strong className="text-[#191919]">My Reflection: </strong>
                      {item.userNote}
                    </div>
                  )}

                  <div className="mt-3 pt-2 border-t border-[#E2E0DC] flex items-center justify-between text-xs">
                    <span className="text-[11px] font-ui text-[#5A5955] truncate max-w-[200px]">
                      From: <em>{item.essayTitle}</em>
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setQuoteCardItem(item)}
                        className="p-1 rounded text-[#5A5955] hover:text-[#1185BA] hover:bg-[#E5F6FD]"
                        title="Generate Visual Quote Card"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="p-1 rounded text-[#5A5955] hover:text-[#FF4B4B] hover:bg-[#FFEBEB]"
                        title="Remove from vault"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Visual Quote Card Generator Modal */}
      {quoteCardItem && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-[#191919]/60 backdrop-blur-xs">
          <div className="bg-white border-2 border-[#191919] rounded-3xl p-6 max-w-md w-full shadow-[0_12px_0_0_#191919] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#E2E0DC]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FFC800]" />
                <h4 className="font-ui font-black text-base text-[#191919]">
                  Visual Quote Card
                </h4>
              </div>
              <button
                onClick={() => setQuoteCardItem(null)}
                className="p-1 text-[#5A5955] hover:text-[#191919]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Theme Selector */}
            <div className="flex items-center gap-2 my-4">
              <span className="text-xs font-ui font-bold text-[#5A5955]">Theme:</span>
              <button
                onClick={() => setQuoteCardTheme("notion")}
                className={`w-6 h-6 rounded-full border-2 border-[#191919] bg-[#F7F6F3] ${quoteCardTheme === "notion" ? "ring-2 ring-[#191919]" : ""}`}
                title="Notion Editorial Cream"
              />
              <button
                onClick={() => setQuoteCardTheme("philosophy")}
                className={`w-6 h-6 rounded-full border-2 border-[#191919] bg-[#CE82FF] ${quoteCardTheme === "philosophy" ? "ring-2 ring-[#9B42D6]" : ""}`}
                title="Beetle Purple"
              />
              <button
                onClick={() => setQuoteCardTheme("ai")}
                className={`w-6 h-6 rounded-full border-2 border-[#191919] bg-[#1CB0F6] ${quoteCardTheme === "ai" ? "ring-2 ring-[#1185BA]" : ""}`}
                title="Macaw Blue"
              />
              <button
                onClick={() => setQuoteCardTheme("behavior")}
                className={`w-6 h-6 rounded-full border-2 border-[#191919] bg-[#58CC02] ${quoteCardTheme === "behavior" ? "ring-2 ring-[#439C00]" : ""}`}
                title="Feather Green"
              />
            </div>

            {/* The Rendered Card Preview */}
            <div
              id="quote-card-preview"
              className={`p-6 rounded-2xl border-2 border-[#191919] shadow-[0_6px_0_0_#191919] my-3 transition-colors ${
                quoteCardTheme === "notion"
                  ? "bg-[#F7F6F3] text-[#191919]"
                  : quoteCardTheme === "philosophy"
                  ? "bg-[#F7E8FF] text-[#191919]"
                  : quoteCardTheme === "ai"
                  ? "bg-[#E5F6FD] text-[#191919]"
                  : "bg-[#ECF9E0] text-[#191919]"
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#191919]/20">
                <span className="font-ui font-black text-xs tracking-widest uppercase">
                  NEUROPLASTIC
                </span>
                <span className="text-[10px] font-code opacity-70">
                  Epistemic Vault
                </span>
              </div>

              <blockquote className="font-editorial text-lg italic leading-relaxed my-4">
                "{quoteCardItem.text}"
              </blockquote>

              <div className="pt-3 border-t border-[#191919]/20 flex items-center justify-between">
                <div>
                  <div className="font-ui font-bold text-xs">{quoteCardItem.essayTitle}</div>
                  <div className="text-[10px] font-ui opacity-70 capitalize">{quoteCardItem.pillar}</div>
                </div>
                <NotionMascot variant="celebrating" mood="excited" size={40} interactiveEyes={false} />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`"${quoteCardItem.text}" — Neuroplastic (${quoteCardItem.essayTitle})`);
                  setQuoteCardItem(null);
                }}
                className="duo-btn text-xs font-ui font-bold px-4 py-2 rounded-xl bg-white text-[#191919]"
              >
                Copy Quote Text
              </button>
              <button
                onClick={() => setQuoteCardItem(null)}
                className="duo-btn duo-btn-streak text-xs font-ui font-extrabold px-4 py-2 rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
