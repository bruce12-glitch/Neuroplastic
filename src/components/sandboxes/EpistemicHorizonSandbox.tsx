import React, { useState, useRef, useCallback } from "react";
import { getEpistemicDiagnosis } from "../../utils/rules.ts";
import { NotionMascot } from "../NotionMascot.tsx";
import { Compass, BookOpen, AlertCircle, Sparkles } from "lucide-react";

interface EpistemicHorizonSandboxProps {
  onInteract?: () => void;
}

export const EpistemicHorizonSandbox: React.FC<EpistemicHorizonSandboxProps> = ({ onInteract }) => {
  // Coordinates in normalized space [-1, 1]
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: -0.4, y: 0.6 });
  const [isDragging, setIsDragging] = useState(false);
  const planeRef = useRef<HTMLDivElement | null>(null);

  const diagnosis = getEpistemicDiagnosis(coords.x, coords.y);

  const updateCoordinatesFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      if (!planeRef.current) return;
      const rect = planeRef.current.getBoundingClientRect();
      const rawX = (clientX - rect.left) / rect.width; // 0 to 1
      const rawY = (clientY - rect.top) / rect.height; // 0 to 1

      // Convert to [-1, 1] where top is +1 and bottom is -1
      const normX = Math.max(-1, Math.min(1, (rawX - 0.5) * 2));
      const normY = Math.max(-1, Math.min(1, (0.5 - rawY) * 2));

      setCoords({
        x: Math.round(normX * 100) / 100,
        y: Math.round(normY * 100) / 100,
      });
      onInteract?.();
    },
    [onInteract]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateCoordinatesFromPointer(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    updateCoordinatesFromPointer(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const setPreset = (x: number, y: number) => {
    setCoords({ x, y });
    onInteract?.();
  };

  // Convert coords back to pixel percentage for mascot position
  const mascotLeft = ((coords.x + 1) / 2) * 100;
  const mascotTop = ((1 - coords.y) / 2) * 100;

  return (
    <div
      className="border-2 border-[#191919] shadow-[0_6px_0_0_#191919] rounded-2xl bg-white p-6 my-8 select-none"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b-2 border-[#E2E0DC]">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#CE82FF] text-white border-2 border-[#191919] text-xs font-bold shadow-[0_2px_0_0_#9B42D6]">
              <Compass className="w-4 h-4" />
            </span>
            <h4 className="font-ui font-extrabold text-lg text-[#191919]">
              The Epistemic Horizon Plane
            </h4>
          </div>
          <p className="text-xs font-ui text-[#5A5955] mt-1">
            Drag the Solipsist mascot across ontological quadrants to navigate certainty, skepticism, and human agency
          </p>
        </div>

        {/* Preset Dialectics */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setPreset(-0.7, -0.65)}
            className={`duo-btn text-[11px] font-ui font-bold px-2.5 py-1 rounded-lg ${
              coords.x < 0 && coords.y < 0 ? "bg-[#CE82FF] text-white" : "bg-[#F7F6F3] text-[#191919]"
            }`}
          >
            Descartes' Doubt
          </button>
          <button
            onClick={() => setPreset(-0.6, 0.7)}
            className={`duo-btn text-[11px] font-ui font-bold px-2.5 py-1 rounded-lg ${
              coords.x < 0 && coords.y >= 0 ? "bg-[#CE82FF] text-white" : "bg-[#F7F6F3] text-[#191919]"
            }`}
          >
            Kant's Construct
          </button>
          <button
            onClick={() => setPreset(0.65, 0.75)}
            className={`duo-btn text-[11px] font-ui font-bold px-2.5 py-1 rounded-lg ${
              coords.x >= 0 && coords.y >= 0 ? "bg-[#CE82FF] text-white" : "bg-[#F7F6F3] text-[#191919]"
            }`}
          >
            Friston's Realism
          </button>
          <button
            onClick={() => setPreset(0.7, -0.65)}
            className={`duo-btn text-[11px] font-ui font-bold px-2.5 py-1 rounded-lg ${
              coords.x >= 0 && coords.y < 0 ? "bg-[#CE82FF] text-white" : "bg-[#F7F6F3] text-[#191919]"
            }`}
          >
            Spinoza's Grid
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-6 items-center">
        {/* The 2D Coordinate Plane */}
        <div className="md:col-span-7 flex flex-col items-center">
          <div className="w-full text-center text-xs font-ui font-bold text-[#191919] mb-1 flex items-center justify-center gap-1">
            <span>▲ +1.0 Radically Grounded Agency</span>
          </div>

          <div className="w-full flex items-center">
            <span className="text-[11px] font-ui font-bold text-[#191919] -rotate-90 origin-center whitespace-nowrap w-4 text-center">
              ◄ Radical Solipsism
            </span>

            <div
              ref={planeRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              className="relative flex-1 aspect-square max-h-[320px] bg-[#F7F6F3] border-2 border-[#191919] rounded-2xl cursor-crosshair overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]"
            >
              {/* Grid Lines */}
              <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none opacity-20">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className="border border-[#191919]" />
                ))}
              </div>

              {/* Axes */}
              <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-[#191919] pointer-events-none" />
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#191919] pointer-events-none" />

              {/* Quadrant labels */}
              <span className="absolute top-2 left-2 text-[10px] font-ui font-black text-[#9B42D6] opacity-80 uppercase">
                Constructivist Agency
              </span>
              <span className="absolute top-2 right-2 text-[10px] font-ui font-black text-[#1185BA] opacity-80 uppercase">
                Active Inference
              </span>
              <span className="absolute bottom-2 left-2 text-[10px] font-ui font-black text-[#5A5955] opacity-80 uppercase">
                Skeptical Aporia
              </span>
              <span className="absolute bottom-2 right-2 text-[10px] font-ui font-black text-[#5A5955] opacity-80 uppercase">
                Fatalistic Determinism
              </span>

              {/* Draggable Mascot Target Node */}
              <div
                style={{
                  left: `${mascotLeft}%`,
                  top: `${mascotTop}%`,
                  transform: "translate(-50%, -50%)",
                }}
                className="absolute pointer-events-none transition-transform duration-75 flex flex-col items-center"
              >
                <div className="w-12 h-12 rounded-full bg-white border-2 border-[#191919] shadow-[0_3px_0_0_#9B42D6] flex items-center justify-center p-1">
                  <NotionMascot
                    variant="philosopher"
                    mood={coords.y > 0 ? "excited" : "thinking"}
                    size={40}
                    interactiveEyes={false}
                  />
                </div>
                <div className="bg-[#191919] text-white text-[9px] font-code font-bold px-1.5 py-0.5 rounded shadow mt-1 whitespace-nowrap">
                  ({coords.x > 0 ? `+${coords.x}` : coords.x}, {coords.y > 0 ? `+${coords.y}` : coords.y})
                </div>
              </div>
            </div>

            <span className="text-[11px] font-ui font-bold text-[#191919] rotate-90 origin-center whitespace-nowrap w-4 text-center">
              Naive Realism ►
            </span>
          </div>

          <div className="w-full text-center text-xs font-ui font-bold text-[#5A5955] mt-1">
            ▼ -1.0 Epistemic Paralysis
          </div>
        </div>

        {/* Diagnosis & Philosophic Readout */}
        <div className="md:col-span-5 bg-[#F7E8FF] border-2 border-[#191919] rounded-2xl p-5 shadow-[0_4px_0_0_#9B42D6]">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-[#9B42D6]" />
            <span className="text-xs font-ui font-black uppercase tracking-wider text-[#9B42D6]">
              {diagnosis.stance}
            </span>
          </div>

          <h5 className="font-editorial text-2xl font-bold text-[#191919] leading-tight">
            "{diagnosis.quadrantName}"
          </h5>

          <p className="text-xs font-ui text-[#191919] mt-3 leading-relaxed">
            {diagnosis.summary}
          </p>

          <div className="mt-4 pt-4 border-t border-[#9B42D6]/30 space-y-2.5">
            <div className="flex items-start gap-2 text-xs">
              <BookOpen className="w-4 h-4 text-[#9B42D6] shrink-0 mt-0.5" />
              <div>
                <span className="font-ui font-bold text-[#191919]">Key Thinkers: </span>
                <span className="font-ui text-[#5A5955]">{diagnosis.coreThinker}</span>
                <div className="text-[11px] font-editorial italic text-[#5A5955]">({diagnosis.keyWork})</div>
              </div>
            </div>

            <div className="flex items-start gap-2 text-xs">
              <AlertCircle className="w-4 h-4 text-[#FF4B4B] shrink-0 mt-0.5" />
              <div>
                <span className="font-ui font-bold text-[#191919]">Cognitive Trade-Off: </span>
                <span className="font-ui text-[#5A5955]">{diagnosis.cognitiveTradeoff}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
