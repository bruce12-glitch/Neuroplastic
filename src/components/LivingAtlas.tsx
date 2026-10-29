import React, { useEffect, useId, useRef, useState } from "react";
import { ArrowUpRight, MoveUpRight, Pause, Play, Sparkles } from "lucide-react";
import { NotionMascot, THINKER_PORTRAITS, type MascotVariant } from "./NotionMascot.tsx";
import type { PillarId } from "../data/essays.ts";
import "./LivingAtlas.css";

interface LivingAtlasProps {
  onSelectPillar?: (pillar: PillarId) => void;
  activePillarFilter?: string;
}

interface AtlasDomain {
  id: PillarId;
  label: string;
  mascot: MascotVariant;
  x: number;
  y: number;
  path: string;
  invitation: string;
}

const DOMAINS: AtlasDomain[] = [
  { id: "philosophy", label: "Philosophy", mascot: "philosopher", x: 19, y: 25,
    path: "M305 154C250 150 240 34 129 93",
    invitation: "Start with a question. See where it takes you." },
  { id: "worldview", label: "World View", mascot: "cartographer", x: 15, y: 69,
    path: "M301 188C207 198 237 304 102 255",
    invitation: "Step back. Notice how the pieces fit together." },
  { id: "psychology", label: "Psychology", mascot: "observer", x: 78, y: 23,
    path: "M372 145C420 59 458 36 530 85",
    invitation: "Follow the patterns that shape the way we think." },
  { id: "ai", label: "AI Research", mascot: "architect", x: 85, y: 68,
    path: "M388 182C470 161 487 307 578 252",
    invitation: "Trace an idea from human curiosity to machine intelligence." },
  { id: "psychoanalysis", label: "Psychoanalysis", mascot: "analyst", x: 51, y: 85,
    path: "M343 210C424 242 286 285 347 315",
    invitation: "Look beneath the familiar. There may be more to the story." },
];

/** Ambient motion belongs to the illustration; controls and text stay still. */
export function LivingAtlas({ onSelectPillar, activePillarFilter }: LivingAtlasProps) {
  const rootRef = useRef<HTMLElement>(null);
  const infoId = useId();
  const [selected, setSelected] = useState<PillarId>("philosophy");
  const [hovered, setHovered] = useState<PillarId | null>(null);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [onScreen, setOnScreen] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(media.matches);
    const updateVisibility = () => setPageVisible(document.visibilityState === "visible");
    updateMotion();
    updateVisibility();
    media.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    if (rootRef.current) observer.observe(rootRef.current);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    const match = DOMAINS.find((domain) => domain.id === activePillarFilter);
    if (match) setSelected(match.id);
  }, [activePillarFilter]);

  const active = DOMAINS.find((domain) => domain.id === selected)!;
  const portrait = THINKER_PORTRAITS[active.mascot];
  const motionOff = paused || reducedMotion || !onScreen || !pageVisible;
  const illuminated = hovered || selected;

  return (
    <section
      ref={rootRef}
      className="living-atlas"
      aria-label="The Living Atlas — explore five connected subjects"
      data-motion={motionOff ? "paused" : "playing"}
      style={{ "--atlas-active": portrait.color, "--atlas-paper": portrait.paper } as React.CSSProperties}
    >
      <header className="living-atlas__header">
        <div>
          <p className="living-atlas__eyebrow"><span aria-hidden="true" /> THE LIVING ATLAS</p>
          <h4 className="font-display">Curiosity has a way of connecting things.</h4>
        </div>
        <button
          className="living-atlas__motion"
          type="button"
          aria-label={reducedMotion ? "Animation disabled by your reduced-motion preference" : paused ? "Resume atlas animation" : "Pause atlas animation"}
          title={reducedMotion ? "Reduced motion is enabled" : paused ? "Resume animation" : "Pause animation"}
          disabled={reducedMotion}
          aria-pressed={paused || reducedMotion}
          onClick={() => setPaused((value) => !value)}
        >
          {paused || reducedMotion ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}
        </button>
      </header>

      <div className="living-atlas__canvas">
        <div className="living-atlas__wash" aria-hidden="true" />
        <svg className="living-atlas__paths" viewBox="0 0 680 370" preserveAspectRatio="none" fill="none" aria-hidden="true">
          <path className="atlas-dotted-loop" d="M146 70C285-38 535 11 597 191C664 357 378 413 174 298" />
          {DOMAINS.map((domain, index) => (
            <g key={domain.id} className="atlas-thread" data-lit={illuminated === domain.id} style={{ color: THINKER_PORTRAITS[domain.mascot].color } as React.CSSProperties}>
              <path className="atlas-thread__underlay" d={domain.path} />
              <path className="atlas-thread__ink" d={domain.path} />
              <circle className="atlas-thread__thought" r="3.2" fill="currentColor" style={{ offsetPath: `path('${domain.path}')`, animationDelay: `${index * -1.7}s` }} />
              <circle className="atlas-thread__thought atlas-thread__thought--echo" r="2" fill="currentColor" style={{ offsetPath: `path('${domain.path}')`, animationDelay: `${index * -1.7 - 4}s` }} />
            </g>
          ))}
          <g className="atlas-spark atlas-spark--one" stroke="#a68a50" strokeWidth="1.5" strokeLinecap="round">
            <path d="M248 58v14m-7-7h14M251 62l-6 6m0-6 6 6" />
          </g>
          <g className="atlas-spark atlas-spark--two" stroke="#9589ab" strokeWidth="1.5" strokeLinecap="round">
            <path d="M459 278v12m-6-6h12" />
          </g>
          <g stroke="#aca391" strokeWidth="1.3" strokeLinecap="round">
            <path d="m68 158 9-2m-7-8 7 5m-3-12 5 9M584 119l8-5m-3 13 8-1" />
          </g>
        </svg>

        <div className="living-atlas__book" aria-hidden="true">
          <svg viewBox="0 0 210 164" fill="none" className="atlas-book">
            <ellipse cx="105" cy="147" rx="76" ry="7" fill="#37352f" fillOpacity=".07" />
            <g className="atlas-book__float" stroke="#524a40" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
              <path d="M19 40 101 53 191 35 190 127 108 146 17 126Z" fill="#b6a2cc" />
              <path d="m22 119 85 20 78-18m-78 18 1 7" stroke="#746482" />
              <path d="M28 31c24-6 52 0 77 14 29-18 55-25 77-20l1 92c-28-2-53 5-77 17-28-14-54-20-81-16Z" fill="#f4eee1" />
              <path d="M31 24c28-5 51 3 74 16v89c-25-13-51-20-77-17Z" fill="#fffdf5" />
              <path d="M105 40c24-17 48-25 73-20l2 91c-26-3-51 6-75 18Z" fill="#fbf6e9" />
              <path d="M105 40v89" stroke="#cfc5af" />
              <path d="m39 83 47 11m-48 0 41 10m-42 0 27 7" stroke="#c0b6a3" />
              <path d="M123 93c17-18 31-24 39-23-1 15-12 26-32 25m-7 8 31-27" fill="#e0e7d8" stroke="#78856d" />
              <path d="m110 131 4-50 8-3-3 55-4-5Z" fill="#bca9d7" stroke="#8f7aab" strokeWidth="1" />
              <g className="atlas-book__page">
                <path d="M106 40c23-18 46-31 67-27l4 85c-24 1-48 14-71 31Z" fill="#fffdf5" />
                <path d="m121 48 34-15m-33 25 30-13m-29 24 20-9" stroke="#d3c4e3" strokeWidth="2" />
                <path d="M153 77v11m-5-6h10" stroke="#9580b2" />
              </g>
              <path d="M103 41c-23-12-46-19-72-17" stroke="#e1d8c5" />
            </g>
          </svg>
          <span className="living-atlas__book-note font-display">what if?</span>
          <span className="living-atlas__annotation font-editorial">one idea leads to another</span>
        </div>

        <div className="living-atlas__nodes" role="group" aria-label="Choose a subject to explore">
          {DOMAINS.map((domain, index) => {
            const guide = THINKER_PORTRAITS[domain.mascot];
            return (
              <button
                key={domain.id}
                type="button"
                className="atlas-node"
                data-active={selected === domain.id}
                aria-pressed={selected === domain.id}
                aria-label={`Explore ${domain.label} with ${guide.name}`}
                aria-describedby={selected === domain.id ? infoId : undefined}
                onClick={() => setSelected(domain.id)}
                onPointerEnter={() => setHovered(domain.id)}
                onPointerLeave={() => setHovered(null)}
                onFocus={() => setHovered(domain.id)}
                onBlur={() => setHovered(null)}
                style={{ left: `${domain.x}%`, top: `${domain.y}%`, "--node-ink": guide.color, "--node-paper": guide.paper, "--node-delay": `${index * -1.3}s`, "--node-tilt": `${[-6, 5, 4, -4, 3][index]}deg` } as React.CSSProperties}
              >
                <span className="atlas-node__portrait">
                  <span className="atlas-node__halo" aria-hidden="true" />
                  <NotionMascot variant={domain.mascot} size={86} interactive={false} decorative />
                  <span className="atlas-node__arrow" aria-hidden="true"><MoveUpRight size={12} /></span>
                </span>
                <span className="atlas-node__label">{domain.label}</span>
                <span className="atlas-node__name">{guide.name.split(" ").pop()}</span>
              </button>
            );
          })}
        </div>
        <span className="living-atlas__hint"><Sparkles size={11} aria-hidden="true" /> Pick a curious mind</span>
      </div>

      <footer className="living-atlas__footer" id={infoId}>
        <div className="living-atlas__invitation" aria-live="polite" aria-atomic="true">
          <p className="living-atlas__eyebrow"><span className="living-atlas__subject-dot" aria-hidden="true" /> {active.label.toUpperCase()} <span className="living-atlas__guide">WITH {portrait.name.toUpperCase()}</span></p>
          <p className="font-editorial">{active.invitation}</p>
        </div>
        <button className="living-atlas__open" type="button" disabled={!onSelectPillar} onClick={() => onSelectPillar?.(active.id)} aria-label={`Open ${active.label} essay`}>
          Explore <ArrowUpRight size={16} aria-hidden="true" />
        </button>
      </footer>
    </section>
  );
}
