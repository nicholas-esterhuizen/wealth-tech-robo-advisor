# Wealth Tech Robo-Advisor

A browser-based wealth management tool that builds your risk profile, models your balance sheet and upcoming capital demands, and recommends a personalised low-cost ETF portfolio across multiple asset classes.

Live demo: [nicholas-esterhuizen.github.io/wealth-tech-robo-advisor](https://nicholas-esterhuizen.github.io/wealth-tech-robo-advisor)

---

## What it does

The tool takes a user through a 12-question questionnaire across five sections — balance sheet, income and expenses, time horizon, upcoming capital demands, and risk attitude. It combines those inputs into a composite score and assigns one of five risk profiles:

- **Conservative** — capital preservation, 80% bonds
- **Conservative Balanced** — modest growth with downside protection
- **Balanced** — equal equities and bonds, diversified across all four asset classes
- **Balanced Growth** — higher equity weighting for longer-horizon investors
- **Growth** — maximum equity exposure for investors with long time horizons and high capacity

For each profile it outputs:
- Strategic asset allocation with visual breakdown
- ETF recommendation per asset class with TER and rationale
- Blended portfolio TER (weighted average cost)
- Suggested monthly investment amount
- Illustrative 10, 20, and 30-year growth projections across three scenarios
- Education liability callout for dependents approaching university age

---

## Investment philosophy

Approximately 90% of active fund managers underperform their benchmark index over long time horizons (SPIVA Global Scorecard). This tool is built entirely around low-cost, passive ETFs for that reason.

The four ETFs used across all profiles:

| Asset Class | ETF | TER |
|---|---|---|
| Equities | VT — Vanguard Total World Stock ETF | 0.07% |
| Property | VNQ — Vanguard Real Estate ETF | 0.13% |
| Bonds | AGG — iShares Core US Aggregate Bond ETF | 0.03% |
| Cash | SGOV — iShares 0-3 Month Treasury Bond ETF | 0.09% |

---

## How it works

The scoring engine weights inputs as follows:

- **Risk attitude** (Q10–12): 50% of total score
- **Financial capacity** — net worth, surplus, liability ratio (Q1–4): 30%
- **Time horizon and liquidity demands** (Q5–9): 20%

Override rules apply: aggressive profiles are capped if university fees are due within 3 years, or if the user is fewer than 5 years from retirement.

---

## Tech stack

- Vanilla HTML, CSS, JavaScript — no frameworks, no dependencies, no backend
- Single-session only — no data is stored or transmitted
- Static ETF dataset in `data.js` — adding a new fund requires no changes to the engine or UI

---

## File structure

```
wealth-tech-robo-advisor/
├── index.html    — UI, questionnaire, results display
├── data.js       — ETF dataset, allocations, score bands
├── engine.js     — Scoring, profile assignment, projections
├── PRD.md        — Full product requirements document
└── README.md
```

---

## Roadmap

**v2** — Tax layer: marginal rate calculation, pre-tax deduction modelling, net investable income output

**v3** — Live data: replace static ETF dataset with API feed

**v4/v5** — Retirement income modelling, rebalancing alerts, multi-currency support, goal-based sub-portfolios

**v6** — Full wealth management tool: multi-jurisdiction tax planning, estate considerations, brokerage integration

---

## Disclaimer

This tool is for illustrative and educational purposes only. It does not constitute financial advice. Past returns do not guarantee future results.

---

Built by [Nicholas Esterhuizen](https://github.com/nicholas-esterhuizen) — part of a fintech portfolio showcasing product thinking, financial domain knowledge, and applied development.