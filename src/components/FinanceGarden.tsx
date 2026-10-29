import React from "react";
import { ArrowRight, Check, ShieldCheck, Sprout, Waypoints } from "lucide-react";
import { NotionMascot } from "./NotionMascot.tsx";
import type { EssayItem } from "../data/essays.ts";
import "./FinanceGarden.css";

interface FinanceGardenProps {
  essay: EssayItem;
  mastered: boolean;
  onRead: () => void;
}

export function FinanceGarden({ essay, mastered, onRead }: FinanceGardenProps) {
  return (
    <section className="finance-garden" aria-labelledby="finance-heading">
      <div className="finance-garden__intro">
        <span className="finance-garden__eyebrow"><Sprout size={14} aria-hidden="true" /> FINANCE · THE MONEY GARDEN</span>
        <h2 id="finance-heading" className="font-display">A little money knowledge.<br />More room to choose.</h2>
        <p>Explore saving, growth, and risk with Charlie Munger as our illustrated guide. Clear ideas, small experiments, and time to let them sink in.</p>
        <div className="finance-garden__action">
          <button type="button" className="finance-garden__primary" onClick={onRead}>
            {mastered ? "Revisit the first guide" : "Read the first guide"}<ArrowRight size={16} aria-hidden="true" />
          </button>
          <span>{essay.readingTimeMinutes} min · Beginner friendly</span>
        </div>
      </div>
      <div className="finance-garden__guide">
        <div className="finance-garden__mascot"><NotionMascot variant="steward" size={160} decorative /><span className="finance-garden__name">Charlie Munger</span></div>
        <div className="finance-garden__guide-copy">
          <span className="finance-garden__eyebrow">YOUR FIRST FIELD GUIDE</span>
          <h3 className="font-display">Give your money time.</h3>
          <ol className="finance-garden__path" aria-label="Ideas covered in the first guide">
            <li><span>01</span><ShieldCheck size={15} aria-hidden="true" />Build a buffer</li>
            <li><span>02</span><Sprout size={15} aria-hidden="true" />Understand compounding</li>
            <li><span>03</span><Waypoints size={15} aria-hidden="true" />Get to know risk</li>
          </ol>
          <p className="finance-garden__status">{mastered ? <><Check size={14} aria-hidden="true" /> Knowledge check complete</> : "One guide · One experiment · One knowledge check"}</p>
        </div>
      </div>
    </section>
  );
}
