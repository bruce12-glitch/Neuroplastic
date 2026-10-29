import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import { TokenItem, calculateEntropyPruning } from "../../utils/rules.ts";
import { Cpu, Zap, Database, RotateCcw } from "lucide-react";

interface EntropyPruningSandboxProps {
  onInteract?: () => void;
}

const INITIAL_TOKENS: TokenItem[] = [
  { id: "t1", text: "The", entropy: 0.88, attentionWeight: 0.08, isSyntacticNoise: true },
  { id: "t2", text: "agent", entropy: 0.22, attentionWeight: 0.92, isSyntacticNoise: false },
  { id: "t3", text: "must", entropy: 0.75, attentionWeight: 0.18, isSyntacticNoise: true },
  { id: "t4", text: "minimize", entropy: 0.15, attentionWeight: 0.88, isSyntacticNoise: false },
  { id: "t5", text: "variational", entropy: 0.12, attentionWeight: 0.96, isSyntacticNoise: false },
  { id: "t6", text: "free", entropy: 0.18, attentionWeight: 0.91, isSyntacticNoise: false },
  { id: "t7", text: "energy", entropy: 0.14, attentionWeight: 0.94, isSyntacticNoise: false },
  { id: "t8", text: "by", entropy: 0.82, attentionWeight: 0.12, isSyntacticNoise: true },
  { id: "t9", text: "updating", entropy: 0.28, attentionWeight: 0.74, isSyntacticNoise: false },
  { id: "t10", text: "internal", entropy: 0.31, attentionWeight: 0.69, isSyntacticNoise: false },
  { id: "t11", text: "generative", entropy: 0.19, attentionWeight: 0.87, isSyntacticNoise: false },
  { id: "t12", text: "priors", entropy: 0.11, attentionWeight: 0.95, isSyntacticNoise: false },
  { id: "t13", text: "across", entropy: 0.79, attentionWeight: 0.14, isSyntacticNoise: true },
  { id: "t14", text: "time", entropy: 0.35, attentionWeight: 0.62, isSyntacticNoise: false },
];

export const EntropyPruningSandbox: React.FC<EntropyPruningSandboxProps> = ({ onInteract }) => {
  const [tau, setTau] = useState<number>(0.45);

  const simulation = useMemo(() => {
    return calculateEntropyPruning(INITIAL_TOKENS, tau);
  }, [tau]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTau(parseFloat(e.target.value));
    onInteract?.();
  };

  const resetToDefault = () => {
    setTau(0.45);
    onInteract?.();
  };

  return (
    <div className="border-2 border-[#191919] shadow-[0_6px_0_0_#191919] rounded-2xl bg-white p-6 my-8 overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b-2 border-[#E2E0DC]">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#1CB0F6] text-white border-2 border-[#191919] text-xs font-bold shadow-[0_2px_0_0_#1185BA]">
              <Cpu className="w-4 h-4" />
            </span>
            <h4 className="font-ui font-extrabold text-lg text-[#191919]">
              Interactive Rényi Entropy Pruner
            </h4>
          </div>
          <p className="text-xs font-ui text-[#5A5955] mt-1">
            Simulate attention entropy filtering ($\tau$) across a 14-token KV-cache context window
          </p>
        </div>

        <button
          onClick={resetToDefault}
          className="duo-btn text-xs font-ui font-bold px-3 py-1.5 rounded-lg bg-[#EFECE6] text-[#191919] flex items-center gap-1.5 hover:bg-[#E2E0DC]"
          title="Reset threshold"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* Chunky Slider Controller */}
      <div className="py-5 bg-[#F7F6F3] rounded-xl px-5 border-2 border-[#E2E0DC] my-5">
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="entropy-slider" className="font-ui font-bold text-sm text-[#191919] flex items-center gap-2">
            <span>Pruning Threshold ($\tau$):</span>
            <span className="font-code text-sm px-2 py-0.5 rounded bg-white border border-[#191919] text-[#1185BA] font-extrabold">
              {tau.toFixed(2)}
            </span>
          </label>
          <span className="text-xs font-ui font-semibold text-[#5A5955]">
            {tau < 0.25 ? "Lossless (All Tokens Kept)" : tau > 0.65 ? "Aggressive (High Compression)" : "Optimal Semantic Sieve"}
          </span>
        </div>

        <input
          id="entropy-slider"
          type="range"
          min="0.10"
          max="0.85"
          step="0.01"
          value={tau}
          onChange={handleSliderChange}
          className="w-full h-3 bg-[#E2E0DC] rounded-lg appearance-none cursor-pointer accent-[#1CB0F6] border border-[#191919]"
        />

        <div className="flex justify-between text-[11px] font-code text-[#5A5955] mt-1">
          <span>0.10 (Retain All)</span>
          <span className="text-[#1185BA] font-bold">0.45 (Optimal Trade-off)</span>
          <span>0.85 (High Sparsity)</span>
        </div>
      </div>

      {/* Live Context Window Stream */}
      <div className="my-4">
        <div className="text-xs font-ui font-bold uppercase tracking-wider text-[#5A5955] mb-2 flex items-center justify-between">
          <span>KV-Cache Attention Field (14 Tokens)</span>
          <span className="text-[11px] font-code">
            Retained: {simulation.retainedTokens.length} / 14 tokens
          </span>
        </div>

        <div className="p-4 bg-[#FFFFFF] border-2 border-[#191919] rounded-xl flex flex-wrap gap-2.5 min-h-[90px] items-center">
          {INITIAL_TOKENS.map((token) => {
            const isRetained = simulation.retainedTokens.some((t) => t.id === token.id);
            const isKeyToken = token.attentionWeight >= 0.85;

            return (
              <motion.div
                key={token.id}
                layout
                initial={false}
                animate={{
                  opacity: isRetained ? 1 : 0.22,
                  scale: isRetained ? 1 : 0.88,
                  backgroundColor: isRetained
                    ? isKeyToken
                      ? "#E5F6FD"
                      : "#FFFFFF"
                    : "#EFECE6",
                  borderColor: isRetained ? (isKeyToken ? "#1CB0F6" : "#191919") : "#E2E0DC",
                }}
                transition={{ type: "spring", stiffness: 450, damping: 26 }}
                className={`relative px-3 py-1.5 rounded-lg border-2 text-xs font-code font-bold transition-all ${
                  isRetained && isKeyToken ? "shadow-[0_2px_0_0_#1185BA]" : "shadow-[0_2px_0_0_#191919]"
                }`}
              >
                <span>{token.text}</span>
                <span
                  className={`ml-1.5 text-[9px] px-1 py-0.2 rounded font-mono ${
                    token.isSyntacticNoise ? "bg-red-100 text-red-700" : "bg-blue-100 text-[#1185BA]"
                  }`}
                  title={`Entropy: ${token.entropy}, Attn: ${token.attentionWeight}`}
                >
                  {token.entropy.toFixed(2)}
                </span>
                {!isRetained && (
                  <span className="absolute -top-1.5 -right-1 text-[8px] bg-[#FF4B4B] text-white px-1 rounded-full font-sans font-bold">
                    pruned
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Real-Time Metrics HUD */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-3">
        {/* VRAM Saved */}
        <div className="p-3 bg-[#E5F6FD] border-2 border-[#191919] rounded-xl shadow-[0_3px_0_0_#1185BA]">
          <div className="flex items-center gap-1.5 text-xs font-ui font-bold text-[#1185BA]">
            <Database className="w-3.5 h-3.5" />
            <span>VRAM Saved</span>
          </div>
          <div className="font-ui font-black text-2xl text-[#191919] mt-0.5">
            {simulation.vramSavedPercent}%
          </div>
          <div className="w-full bg-white h-2 rounded-full mt-2 border border-[#1185BA] overflow-hidden">
            <div
              className="bg-[#1CB0F6] h-full transition-all duration-200"
              style={{ width: `${simulation.vramSavedPercent}%` }}
            />
          </div>
        </div>

        {/* Retrieval Accuracy */}
        <div className="p-3 bg-[#ECF9E0] border-2 border-[#191919] rounded-xl shadow-[0_3px_0_0_#439C00]">
          <div className="flex items-center gap-1.5 text-xs font-ui font-bold text-[#439C00]">
            <Zap className="w-3.5 h-3.5" />
            <span>Retrieval Accuracy</span>
          </div>
          <div className="font-ui font-black text-2xl text-[#191919] mt-0.5">
            {simulation.retrievalAccuracyPercent}%
          </div>
          <div className="w-full bg-white h-2 rounded-full mt-2 border border-[#439C00] overflow-hidden">
            <div
              className="bg-[#58CC02] h-full transition-all duration-200"
              style={{ width: `${simulation.retrievalAccuracyPercent}%` }}
            />
          </div>
        </div>

        {/* Semantic Retention */}
        <div className="col-span-2 md:col-span-1 p-3 bg-white border-2 border-[#191919] rounded-xl shadow-[0_3px_0_0_#191919]">
          <div className="text-xs font-ui font-bold text-[#5A5955]">Semantic Info Retained</div>
          <div className="font-ui font-black text-2xl text-[#191919] mt-0.5">
            {Math.round(simulation.semanticInformationRetained * 100)}%
          </div>
          <p className="text-[10px] font-ui text-[#5A5955] mt-1.5">
            {simulation.vramSavedPercent > 60 && simulation.retrievalAccuracyPercent > 80
              ? "⚡ Pareto frontier achieved!"
              : simulation.retrievalAccuracyPercent < 70
              ? "⚠️ Warning: Critical prompt semantics clipped."
              : "Stable operational window."}
          </p>
        </div>
      </div>
    </div>
  );
};
