import React, { useState, useEffect, useRef } from "react";
import { calculateAttractorPotential, stepAttractorPhysics } from "../../utils/rules.ts";
import { Flame, Activity, RotateCcw, CheckCircle2 } from "lucide-react";

interface AttractorBasinSandboxProps {
  onInteract?: () => void;
  onSuccessEscape?: () => void;
}

export const AttractorBasinSandbox: React.FC<AttractorBasinSandboxProps> = ({
  onInteract,
  onSuccessEscape,
}) => {
  // Ball state in x [-2.2, 2.2]
  const [ballX, setBallX] = useState<number>(-1.45);
  const [velocity, setVelocity] = useState<number>(0);
  const [impulseActive, setImpulseActive] = useState<boolean>(false);
  const [escapeCount, setEscapeCount] = useState<number>(0);

  const animRef = useRef<number | null>(null);
  const stateRef = useRef({ x: -1.45, v: 0, impulse: 0 });

  // Generate SVG path points for the potential energy curve
  const curvePoints = React.useMemo(() => {
    const points: string[] = [];
    const width = 500;
    const height = 180;

    for (let px = 0; px <= width; px += 4) {
      // Map px (0 to 500) to x (-2.4 to 2.4)
      const x = ((px / width) - 0.5) * 4.8;
      const { potential } = calculateAttractorPotential(x);
      // Map potential (approx 0 to 4.5) to py (150 to 30)
      const py = height - (potential * 32);
      points.push(`${px},${Math.max(20, Math.min(height - 10, py))}`);
    }
    return points.join(" ");
  }, []);

  // Compute ball's screen pixel coordinates
  const ballPx = ((ballX / 4.8) + 0.5) * 500;
  const currentPotential = calculateAttractorPotential(ballX).potential;
  const ballPy = 180 - (currentPotential * 32);
  const kineticEnergy = Math.round(0.5 * Math.pow(velocity, 2) * 100) / 100;

  const isEscaped = ballX > 0.8;

  // Run physical integration loop
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.03);
      lastTime = currentTime;

      const current = stateRef.current;
      const step = stepAttractorPhysics(current.x, current.v, current.impulse, 0.96, dt * 10);

      current.x = step.nextX;
      current.v = step.nextVelocity;
      // Decay impulse
      current.impulse *= 0.85;

      setBallX(current.x);
      setVelocity(current.v);

      if (current.x > 0.8 && !isEscaped) {
        setEscapeCount((c) => c + 1);
        onSuccessEscape?.();
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isEscaped, onSuccessEscape]);

  const injectEpistemicDrive = () => {
    // Impart a vigorous stochastic push towards the barrier
    const impulseStrength = 8.5 + Math.random() * 4.5;
    stateRef.current.impulse = impulseStrength;
    setImpulseActive(true);
    setTimeout(() => setImpulseActive(false), 200);
    onInteract?.();
  };

  const resetToBadHabit = () => {
    stateRef.current.x = -1.45;
    stateRef.current.v = 0;
    stateRef.current.impulse = 0;
    setBallX(-1.45);
    setVelocity(0);
    onInteract?.();
  };

  return (
    <div className="border-2 border-[#191919] shadow-[0_6px_0_0_#191919] rounded-2xl bg-white p-6 my-8 select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b-2 border-[#E2E0DC]">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#58CC02] text-white border-2 border-[#191919] text-xs font-bold shadow-[0_2px_0_0_#439C00]">
              <Activity className="w-4 h-4" />
            </span>
            <h4 className="font-ui font-extrabold text-lg text-[#191919]">
              Attractor Basin Escape Simulator
            </h4>
          </div>
          <p className="text-xs font-ui text-[#5A5955] mt-1">
            Visualizing how neural habit loops entrap the prefrontal cortex in local potential wells
          </p>
        </div>

        <button
          onClick={resetToBadHabit}
          className="duo-btn text-xs font-ui font-bold px-3 py-1.5 rounded-lg bg-[#EFECE6] text-[#191919] flex items-center gap-1.5 hover:bg-[#E2E0DC]"
          title="Reset to local habit minimum"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Rut
        </button>
      </div>

      {/* SVG Potential Energy Canvas */}
      <div className="relative my-6 bg-[#F7F6F3] border-2 border-[#191919] rounded-2xl p-4 overflow-hidden">
        {/* Basin zone labels */}
        <div className="absolute top-3 left-4 text-xs font-ui font-black text-[#FF4B4B] flex items-center gap-1">
          <span>● Local Habit Rut</span>
          <span className="text-[10px] text-[#5A5955] font-normal">(Comfortable Dopamine Loop)</span>
        </div>

        <div className="absolute top-3 left-1/2 -translate-x-1/2 text-xs font-ui font-bold text-[#191919] bg-white/80 px-2 py-0.5 rounded border border-[#191919]">
          ▲ Activation Barrier (ΔE)
        </div>

        <div className="absolute top-3 right-4 text-xs font-ui font-black text-[#439C00] flex items-center gap-1">
          <span>★ Optimal Growth Basin</span>
          <span className="text-[10px] text-[#5A5955] font-normal">(High Plasticity)</span>
        </div>

        <svg
          viewBox="0 0 500 180"
          className="w-full h-44 overflow-visible"
        >
          {/* Shaded area under the potential curve */}
          <path
            d={`M 0 180 L 0 100 ${curvePoints} L 500 180 Z`}
            fill="#EFECE6"
            opacity="0.6"
          />

          {/* Potential energy line */}
          <polyline
            points={curvePoints}
            fill="none"
            stroke="#191919"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Barrier peak indicator line */}
          <line x1="250" y1="20" x2="250" y2="170" stroke="#FFC800" strokeWidth="1.5" strokeDasharray="4 4" />

          {/* Rolling Ball (The Prefrontal Cortex State) */}
          <g transform={`translate(${ballPx}, ${ballPy})`}>
            {/* Contact drop shadow */}
            <ellipse cx="0" cy="9" rx="8" ry="2.5" fill="#191919" opacity="0.3" />
            {/* Outer ball circle */}
            <circle
              cx="0"
              cy="0"
              r="10"
              fill={isEscaped ? "#58CC02" : impulseActive ? "#FFC800" : "#1CB0F6"}
              stroke="#191919"
              strokeWidth="2.5"
            />
            {/* Specular highlight */}
            <circle cx="-3" cy="-3" r="2.5" fill="#FFFFFF" opacity="0.8" />
          </g>
        </svg>

        {/* Status ticker */}
        <div className="flex items-center justify-between text-xs font-code mt-1 text-[#5A5955] px-2">
          <div>
            Position x: <span className="text-[#191919] font-bold">{ballX.toFixed(2)}</span>
          </div>
          <div>
            Kinetic E: <span className="text-[#1185BA] font-bold">{kineticEnergy}</span>
          </div>
          <div className="font-ui font-bold">
            {isEscaped ? (
              <span className="text-[#439C00] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 inline" /> Growth Attractor Locked!
              </span>
            ) : (
              <span className="text-[#FF4B4B]">Trapped in Local Minimum</span>
            )}
          </div>
        </div>
      </div>

      {/* Control Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <button
          onClick={injectEpistemicDrive}
          className="w-full sm:w-auto duo-btn duo-btn-bio font-ui font-extrabold text-sm px-6 py-3 rounded-xl flex items-center justify-center gap-2"
        >
          <Flame className="w-4 h-4 fill-white" />
          <span>Inject Epistemic Drive (Curiosity Impulse)</span>
        </button>

        <div className="text-xs font-ui text-[#5A5955] text-center sm:text-right">
          <div>Escaped: <strong className="text-[#191919]">{escapeCount} times</strong></div>
          <p className="text-[11px] text-[#5A5955] mt-0.5">
            Single impulses often bounce back; rhythmic stochastic bursts breach the activation hill.
          </p>
        </div>
      </div>
    </div>
  );
};
