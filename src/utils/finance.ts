/** One deposit, annual compounding, no deposits/withdrawals, costs, tax, or inflation. */
export function calculateCompoundGrowth(principal: number, annualRatePercent: number, years: number) {
  const rate = annualRatePercent / 100;
  const points = Array.from({ length: years + 1 }, (_, year) => ({
    year,
    compound: principal * (1 + rate) ** year,
    simple: principal * (1 + rate * year),
  }));
  const balance = points[years].compound;
  const simpleBalance = points[years].simple;
  return { balance, simpleBalance, compoundBonus: balance - simpleBalance, points };
}
