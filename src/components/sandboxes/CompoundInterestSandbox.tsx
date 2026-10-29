import React, { useId, useState } from "react";
import { NotionMascot } from "../NotionMascot.tsx";
import { calculateCompoundGrowth } from "../../utils/finance.ts";
import "../FinanceGarden.css";

const number = (value: number) => value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function CompoundInterestSandbox() {
  const id = useId();
  const [principal, setPrincipal] = useState(1000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(5);
  const { balance, simpleBalance, compoundBonus, points } = calculateCompoundGrowth(principal, rate, years);
  const maximum = balance * 1.12;
  const x = (year: number) => 52 + (year / years) * 510;
  const y = (value: number) => 185 - (value / maximum) * 160;
  const line = (kind: "compound" | "simple") => points.map((point) => `${x(point.year)},${y(point[kind])}`).join(" ");

  return (
    <div className="compound-lab">
      <header className="compound-lab__header">
        <NotionMascot variant="steward" size={72} decorative interactive={false} />
        <div>
          <span className="finance-garden__eyebrow">PENNY’S LITTLE EXPERIMENT</span>
          <h3 className="font-display">What changes when you give it time?</h3>
          <p>Move one slider. Compare simple and compound growth.</p>
        </div>
      </header>

      <div className="compound-lab__controls">
        <label className="compound-lab__control" htmlFor={`${id}-principal`}>
          Starting amount · currency units
          <output htmlFor={`${id}-principal`}>{principal.toLocaleString("en-US")}</output>
          <input id={`${id}-principal`} type="range" min="100" max="10000" step="100" value={principal} onChange={(event) => setPrincipal(Number(event.target.value))} />
        </label>
        <label className="compound-lab__control" htmlFor={`${id}-years`}>
          Time to grow
          <output htmlFor={`${id}-years`}>{years} {years === 1 ? "year" : "years"}</output>
          <input id={`${id}-years`} type="range" min="1" max="30" step="1" value={years} onChange={(event) => setYears(Number(event.target.value))} />
        </label>
        <label className="compound-lab__control" htmlFor={`${id}-rate`}>
          Hypothetical annual return
          <output htmlFor={`${id}-rate`}>{rate}%</output>
          <input id={`${id}-rate`} type="range" min="0" max="10" step="0.5" value={rate} onChange={(event) => setRate(Number(event.target.value))} />
        </label>
      </div>

      <figure className="compound-lab__chart">
        <svg viewBox="0 0 600 220" role="img" aria-labelledby={`${id}-chart-title ${id}-chart-desc`}>
          <title id={`${id}-chart-title`}>Simple and compound growth over {years} years</title>
          <desc id={`${id}-chart-desc`}>At a constant {rate}% annual rate, {principal} becomes {number(balance)} with compounding and {number(simpleBalance)} with simple interest. Values are hypothetical currency units.</desc>
          {[0, maximum / 2, maximum].map((value, index) => (
            <g key={index}>
              <line x1="52" x2="562" y1={y(value)} y2={y(value)} stroke="#d3ddce" strokeWidth="1" />
              <text x="44" y={y(value) + 4} textAnchor="end" fontSize="10" fill="#5d5b54">{Math.round(value).toLocaleString("en-US")}</text>
            </g>
          ))}
          <polygon points={`52,185 ${line("compound")} ${x(years)},185`} fill="#dff2d1" />
          <polyline points={line("compound")} fill="none" stroke="#426545" strokeWidth="3" strokeLinejoin="round" />
          <polyline points={line("simple")} fill="none" stroke="#75609b" strokeWidth="2.5" strokeDasharray="6 5" />
          <circle cx={x(years)} cy={y(balance)} r="4" fill="#426545" />
          <text x="52" y="210" fontSize="11" fill="#5d5b54">Today</text>
          <text x="562" y="210" textAnchor="end" fontSize="11" fill="#5d5b54">Year {years}</text>
        </svg>
        <figcaption className="compound-lab__legend"><span><i aria-hidden="true" />Compound · gains stay invested</span><span><i data-simple aria-hidden="true" />Simple · original amount earns interest</span></figcaption>
      </figure>

      <dl className="compound-lab__results" aria-live="polite" aria-atomic="true">
        <div><dt>With compounding</dt><dd>{number(balance)}</dd></div>
        <div><dt>With simple interest</dt><dd>{number(simpleBalance)}</dd></div>
        <div><dt>Extra from compounding</dt><dd>+{number(compoundBonus)}</dd></div>
      </dl>
      <p className="compound-lab__note">Try 0%: both balances stay the same. This illustration assumes one deposit and a constant rate, compounded annually. No extra deposits, withdrawals, fees, tax, or inflation. Actual returns can vary and investments can lose value. This is an experiment, not a prediction.</p>
    </div>
  );
}
