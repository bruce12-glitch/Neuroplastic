import type { EssayItem } from "./essays.ts";

/** Original educational writing. Bracketed references correspond to the source list. */
export const FINANCE_ESSAY: EssayItem = {
  id: "money-time-and-compounding",
  slug: "give-your-money-time",
  title: "Give Your Money Time: A Beginner’s Guide to Compounding",
  subtitle: "Build a buffer, understand how growth builds on growth, and learn why patience still needs a plan for risk.",
  author: "Neuroplastic Editorial",
  pillar: "finance",
  pillarLabel: "Finance",
  readingTimeMinutes: 6,
  xpReward: 60,
  publishedDate: "Oct 29, 2026",
  tags: ["Money basics", "Compounding", "Risk"],
  prerequisites: ["No finance background needed"],
  sandboxType: "compound",
  socraticAnnotations: {},
  editorialNote: "General financial education, not a personal investment recommendation. Sources are U.S. public education resources; account rules, taxes, and protections vary by country. All numerical examples are hypothetical.",
  sources: [
    {
      title: "An essential guide to building an emergency fund",
      publisher: "Consumer Financial Protection Bureau",
      url: "https://www.consumerfinance.gov/an-essential-guide-to-building-an-emergency-fund/",
      note: "Emergency reserves, accessible savings, and choosing a goal that fits your circumstances.",
    },
    {
      title: "Compound Interest",
      publisher: "SEC · Investor.gov",
      url: "https://www.investor.gov/introduction-investing/investing-basics/glossary/compound-interest",
      note: "The definition of interest earned on principal and previously earned interest.",
    },
    {
      title: "Asset Allocation and Diversification",
      publisher: "SEC · Investor.gov",
      url: "https://www.investor.gov/introduction-investing/getting-started/asset-allocation",
      note: "Time horizon, risk tolerance, and spreading investments across and within asset classes.",
    },
    {
      title: "How Fees and Expenses Affect Your Investment Portfolio",
      publisher: "SEC · Investor.gov · July 23, 2025",
      url: "https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/updated",
      note: "How ongoing costs reduce the amount left invested to earn future returns.",
    },
    {
      title: "What is Risk?",
      publisher: "SEC · Investor.gov",
      url: "https://www.investor.gov/introduction-investing/investing-basics/what-risk",
      note: "Investment losses, inflation risk, and the purchasing power of money.",
    },
  ],
  content: {
    level1: {
      bullets: [
        "Give money a purpose and a date: an emergency reserve and a distant goal have different jobs.",
        "Compounding means earning interest on both your starting money and earlier interest. It describes a mechanism, not a guaranteed return.",
        "In a made-up example, 1,000 growing at a constant 5% annually becomes 1,628.89 after ten years, with no extra deposits.",
        "Diversification can reduce concentration risk. It cannot make investing loss-free. Fees and inflation also matter.",
      ],
      mentalModelTable: [
        { dimension: "A cash buffer", traditionalView: "Money waiting around.", nureoplasticSynthesis: "Room to handle an unexpected expense without selling a long-term investment." },
        { dimension: "Compounding", traditionalView: "The same gain added every year.", nureoplasticSynthesis: "A percentage applied to an evolving balance, including earlier gains." },
        { dimension: "A long horizon", traditionalView: "Enough time makes every investment safe.", nureoplasticSynthesis: "Time changes the planning problem; it does not erase the possibility of loss." },
      ],
    },
    level2: {
      sections: [
        {
          heading: "01. Start with the job, then the number",
          paragraphs: [
            "Money questions often arrive dressed as predictions: which asset will rise, what return is enough, when should I start? A quieter opening question is easier to answer: what will this money need to do, and when? Rent next month, an unexpected repair, and a goal ten years away are three different promises. Writing down the purpose and the date makes the rest of the discussion more concrete.",
            "An emergency fund is money reserved for surprises. The CFPB emphasizes that the amount depends on your circumstances; even a modest reserve can help. A useful first exercise is to name one plausible unexpected expense and work toward covering it. Keep the fund somewhere accessible and appropriate for its purpose, considering local account protections and fees. [1]",
          ],
          pullQuote: "A buffer buys something a balance sheet cannot show: room to choose.",
        },
        {
          heading: "02. Let the second year explain compounding",
          paragraphs: [
            "Compound interest is interest earned on the original principal and on interest already accumulated. [2] Imagine 1,000 units of any currency earning a fixed 5% once each year. After year one, 50 is added and the balance is 1,050. In year two, 5% applies to 1,050: the gain is 52.50 and the balance is 1,102.50. That extra 2.50 is the first visible trace of interest earning interest.",
            "Repeat the same calculation for ten years and the balance is 1,628.89. With simple interest on the original 1,000 alone, it would be 1,500. The difference, 128.89, comes from reinvesting the gains. These are our own calculations under deliberately simplified assumptions: one deposit, a constant annual rate, annual compounding, and no withdrawals, taxes, fees, or inflation. They are not a forecast for any account or market investment.",
          ],
        },
        {
          heading: "03. Patience needs a plan for risk",
          paragraphs: [
            "A smooth curve is a model. Market returns vary and investments can lose value. [5] The SEC’s education guide links asset allocation to both time horizon and risk tolerance: when you need the money matters alongside your ability and willingness to absorb losses. [3] A long wait is not a reason to stop asking what could go wrong.",
            "Diversification spreads exposure across different investments and asset classes. It can reduce dependence on one company or sector, but cannot prevent every loss. Several funds can still hold many of the same companies; counting fund names is not the same as checking their underlying holdings. [3] This is why a useful reading habit is to ask what you actually own, rather than how many entries appear in an account.",
          ],
        },
        {
          heading: "04. Read the small percentages",
          paragraphs: [
            "Fees leave less money in the portfolio to earn future returns. The SEC’s fee bulletin explains why small recurring charges can accumulate into a meaningful difference over time. Read the fee schedule and product disclosures, including ongoing costs and transaction charges; a headline return alone does not tell you what you keep. [4]",
            "Inflation asks a separate question: how much will the balance buy? Rising prices reduce purchasing power. [5] In a hypothetical year with a 5% return and 3% inflation, the purchasing-power gain is about 1.94%, calculated as 1.05 divided by 1.03, minus one. The result is lower than 5%, even before taxes or fees. A larger number and a larger ability to buy things are different measurements.",
          ],
        },
        {
          heading: "05. Make one idea your own",
          paragraphs: [
            "Try the experiment below. Change the time horizon first and leave the annual rate alone. Then set the rate to zero. Explain to yourself why the curve becomes flat. Finally, compare simple and compound interest: can you describe what creates the gap without using the word ‘magic’?",
            "For a practical reflection, write one sentence about a money goal, its date, and what uncertainty would make it harder to meet. No account needs to be opened to complete that exercise. The aim of this first guide is a clearer set of questions: what is this money for, how does the arithmetic work, and which assumptions deserve a second look?",
          ],
        },
      ],
    },
    level3: {
      formalProofTitle: "Compounding, one year at a time",
      latexFormulas: [
        { label: "Annual Compound Growth", formula: "A = P × (1 + r)^n", explanation: "A is the final balance, P the initial deposit, r the fixed annual rate as a decimal, and n the number of years. With P = 1,000, r = 0.05, and n = 10, A = 1,628.89. No extra deposits or withdrawals; fees, tax, and inflation are excluded." },
        { label: "Simple Interest Comparison", formula: "S = P × (1 + r × n)", explanation: "S adds interest only on the original deposit. The same 1,000 at 5% for ten years gives 1,500. The compound balance is 128.89 higher because earlier interest also earns interest." },
        { label: "Purchasing Power After Inflation", formula: "real growth = (1 + nominal return) ÷ (1 + inflation) − 1", explanation: "For one hypothetical year at 5% nominal growth and 3% inflation: 1.05 ÷ 1.03 − 1 ≈ 1.94%. This compares growth in money with growth in prices, before tax and fees." },
      ],
      architecturalProof: [
        "Begin with the initial balance P. One year at rate r multiplies the balance by (1 + r).",
        "Year two multiplies that whole new balance by (1 + r) again. Repeating n times gives P × (1 + r)^n.",
        "At r = 0, the multiplier is 1 every year and the balance remains P. This is a useful check on the experiment.",
        "A constant-rate curve illustrates the arithmetic. It does not model volatility, loss, changing rates, fees, tax, or inflation, and it does not establish that an investment is suitable.",
      ],
    },
  },
  masteryQuiz: {
    question: "What actually creates the extra growth from compounding?",
    scenario: "Penny leaves 1,000 in a hypothetical account paying a fixed 5% annually, with all interest kept in the account. The second year earns 52.50 instead of 50. Why?",
    options: [
      { id: "reinvested-interest", text: "The second year earns interest on the first year’s interest too.", isCorrect: true, explanation: "Exactly. The second year starts with 1,050, so 5% of that balance is 52.50. This example assumes a fixed rate and excludes fees and taxes." },
      { id: "higher-rate", text: "The interest rate must have increased.", isCorrect: false, explanation: "The rate stayed at 5%. It is applied to a larger starting balance in the second year." },
      { id: "guaranteed-market", text: "Every investment grows by at least 5% if you wait.", isCorrect: false, explanation: "A hypothetical fixed-rate example is not a promise about real investments. Returns can vary and losses are possible." },
    ],
    hint: "Work out 5% of 1,050, rather than 5% of the original 1,000.",
  },
};
