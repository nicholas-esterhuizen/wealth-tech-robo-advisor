# Product Requirements Document
## Wealth Tech Robo-Advisor
**Version:** 1.0  
**Author:** Nicholas Esterhuizen  
**Status:** Ready to build  
**Last Updated:** May 2026

---

## 1. Product Overview

The Wealth Tech Robo-Advisor is a browser-based passive investment portfolio structuring tool. It takes a user through a structured questionnaire to assess their financial situation, upcoming capital demands, and risk attitude. Based on those inputs it assigns a risk profile and recommends a personalised, low-cost ETF portfolio across asset classes.

The investment philosophy is evidence-based: approximately 90% of active fund managers underperform their benchmark index over long time horizons (SPIVA Global Scorecard). The tool is built entirely around low-cost, passive ETFs. This is not a novel claim — it is the same approach used by Betterment and Wealthfront, and it is supported by decades of academic and empirical research.

**This is an illustrative modelling tool only. It does not constitute financial advice.**

---

## 2. Problem Statement

Most retail investors have no practical access to structured portfolio construction. Wealth managers serve clients with significant minimums. Generic savings products offer no personalisation. This tool fills the gap: a logic-driven, questionnaire-based portfolio recommendation that accounts for the user's actual financial situation, upcoming liabilities, and risk attitude — not just a slider.

---

## 3. Target User

**v1 Case Study (for testing and demonstration):**
A 45-year-old married professional. Two children: one aged 10, one aged 16. Earns a salary. Has investable capital but no existing structured investment portfolio. The 16-year-old creates a medium-term liability (university in approximately 2 years). The 10-year-old creates a longer-term liability (university in approximately 8 years). This user has a finite runway to retirement and competing capital demands — a realistic stress case for the tool.

**Broader target user:**
Salaried professionals, 30–60, with investable capital and no access to or appetite for traditional wealth management. Wants a clear, defensible answer to the question: what should I be investing in?

---

## 4. Investment Philosophy

- Passive, index-tracking ETFs only. No actively managed funds.
- Low-cost: TER (Total Expense Ratio) is a primary selection criterion.
- USD-denominated ETFs only in v1 and v2.
- Asset allocation is the primary driver of long-term returns. ETF selection within each asset class is secondary.
- The strategic asset allocation defined in Section 6 is the benchmark. It is expected to hold over market cycles. Tactical deviations are out of scope for v1.

---

## 5. ETF Universe

Four ETFs cover all asset classes in v1. All are from major issuers, carry significant AUM, and are among the most liquid instruments in their respective categories.

| Asset Class | ETF | Issuer | Index Tracked | TER |
|---|---|---|---|---|
| Equities | VT — Vanguard Total World Stock ETF | Vanguard | FTSE Global All Cap Index | 0.07% |
| Property | VNQ — Vanguard Real Estate ETF | Vanguard | MSCI US Investable Market Real Estate 25/50 | 0.13% |
| Bonds | AGG — iShares Core US Aggregate Bond ETF | BlackRock | Bloomberg US Aggregate Bond Index | 0.03% |
| Cash | SGOV — iShares 0–3 Month Treasury Bond ETF | BlackRock | ICE 0-3 Month US Treasury Securities Index | 0.09% |

**Notes:**
- VT provides exposure to US large cap, international developed markets, and emerging markets in a single ticker, weighted by market capitalisation (~60–65% US, ~25–30% developed international, ~10–15% emerging markets).
- VNQ is maintained as a separate asset class from equities. REITs in the US market are more correlated to equities than in other markets, but the allocation is small (5% across all profiles) and the separation adds transparency and future extensibility for non-USD versions.
- AGG covers the full US investment-grade bond market: Treasuries, government agencies, corporates, and mortgage-backed securities.
- SGOV functions as the cash equivalent in a portfolio context — ultra-short Treasury exposure with monthly income distributions and near-zero price volatility.

---

## 6. Strategic Asset Allocation

Five risk profiles are defined. The allocations below are the strategic benchmark — the long-term target weights the portfolio aims to maintain. They are derived from institutional portfolio construction practice (referenced against Nedbank Private Wealth mandate benchmarks and cross-validated against Betterment and Wealthfront portfolio structures).

| Profile | Equities (VT) | Property (VNQ) | Bonds (AGG) | Cash (SGOV) |
|---|---|---|---|---|
| Conservative | 0% | 0% | 80% | 20% |
| Conservative Balanced | 20% | 5% | 60% | 15% |
| Balanced | 40% | 5% | 40% | 15% |
| Balanced Growth | 60% | 5% | 20% | 15% |
| Growth | 80% | 5% | 10% | 5% |

**Important notes:**
- These allocations represent the strategic asset allocation (SAA) — the benchmark the portfolio is constructed around. They are not expected to change frequently.
- As markets evolve and the tool matures, the SAA may be reviewed. Any changes will be versioned.
- The Balanced profile at 40% equities is more conservative than the conventional 60/40 industry benchmark. This is because the remaining 60% is split across bonds, property, and cash rather than bonds alone — producing a more diversified defensive allocation rather than a pure bond-heavy one.

---

## 7. Questionnaire

The questionnaire captures three dimensions simultaneously and combines them into a single risk profile score:

- **Risk attitude** — psychological tolerance for volatility (weighted most heavily)
- **Risk capacity** — financial ability to absorb losses, derived from balance sheet and income
- **Risk horizon and liquidity demands** — time until capital is needed, and the size of known upcoming capital calls

This is a more complete approach than attitude-only profiling. A user can be psychologically aggressive but have low capacity or near-term capital demands — the tool moderates the profile accordingly.

---

### Section 1: Balance Sheet

**Q1. What is the estimated total value of your assets?**
Includes: property, investments, retirement funds, vehicles, cash, other.
*(Drives: net worth calculation, risk capacity)*

**Q2. What is the total value of your liabilities?**
Includes: mortgage balance, personal loans, vehicle finance, credit card debt, other.
*(Drives: net worth calculation, capacity score — high liabilities relative to assets reduce capacity)*

---

### Section 2: Income and Expenses

**Q3. What is your annual gross income?**
*(Drives: investable surplus, capacity score)*

**Q4. What are your total annual living expenses?**
*(Drives: investable surplus — the gap between Q3 and Q4 determines how much can realistically be invested and how sensitive the user is to a bad year in markets)*

---

### Section 3: Time Horizon

**Q5. How old are you?**

**Q6. At what age do you plan to retire?**
*(Q5 and Q6 together give years to retirement — the primary time horizon input. Longer horizon increases ability to take risk.)*

---

### Section 4: Upcoming Capital Demands

**Q7. Do you have dependents? If yes, how many and what are their ages?**
*(Drives: identification of education liabilities and care obligations)*

**Q8. Will any dependents be attending university? If yes, approximately when?**
*(Drives: near-term liquidity demand. A university fee due in 2 years is a hard constraint; one due in 10 years is manageable within a long-term portfolio.)*

**Q9. Are there any other significant non-recurring expenses expected in the next 10 years?**
Examples: elderly parent care, property purchase, business investment, other large capital event.
*(Drives: additional liquidity constraints layered on top of the base profile)*

---

### Section 5: Risk Attitude

**Q10. If your portfolio dropped 25% in value over 12 months, what would you do?**
- Sell everything and move to cash
- Reduce equity exposure
- Hold and wait for recovery
- Buy more while prices are low

**Q11. What is your primary investment objective?**
- Preserve what I have
- Generate steady income
- Grow my wealth steadily over time
- Maximise long-term growth — I can handle volatility

**Q12. Have you invested in equities or funds before?**
- No, this would be my first time
- Yes, but I found market swings stressful
- Yes, and I'm comfortable with normal market movements
- Yes, and I actively monitor and enjoy managing investments

---

### Scoring Logic

Each answer carries a point value. The total score maps to a risk profile band.

**Section 5 (Risk Attitude)** carries the highest weight — approximately 50% of total score.
**Sections 1–2 (Balance Sheet and Income)** carry approximately 30% — strong net worth and wide income-to-expense margin increase capacity.
**Sections 3–4 (Horizon and Liquidity Demands)** carry approximately 20% — long horizon increases score, near-term capital calls reduce it.

Point values and band thresholds: *[to be defined during build — scored 0–100, bands assigned per profile]*

**Profile override rules:**
- If a user scores in the Growth band but has a capital call within 3 years exceeding 20% of their investable assets, profile is capped at Balanced Growth.
- If a user scores in the Growth or Balanced Growth band but has fewer than 5 years to retirement, profile is capped at Balanced.
- These rules reflect real financial planning practice: attitude is subordinate to capacity and horizon when the two conflict.

---

## 8. Portfolio Output

For each user the tool produces:

- **Assigned risk profile** with plain-language explanation
- **Asset allocation breakdown** — percentage per asset class, displayed visually
- **ETF per asset class** — ticker, full name, TER, one-line rationale
- **Blended portfolio TER** — weighted average cost of the full portfolio
- **Suggested monthly investment amount** — derived from income, expenses, and stated goals
- **Illustrative projection table** — portfolio growth over 10, 20, and 30 years using conservative, base, and optimistic return assumptions
- **Education liability callout** — if dependents are approaching university age, the tool flags the timeline and recommended savings buffer
- **Illustrative disclaimer** — prominent, not buried in a footer

---

## 9. File Architecture

```
wealth-tech-robo-advisor/
├── index.html       — UI, questionnaire, results display
├── data.js          — ETF dataset, asset class definitions, profile allocations
├── engine.js        — Scoring logic, profile assignment, projection calculator
├── README.md
├── PRD.md
└── .gitignore
```

Adding a new ETF or adjusting an allocation must never require changes to the engine or UI.

---

## 10. Version Roadmap

### v1 — Working tool (current)
- 12-question questionnaire with scoring logic
- Five risk profiles with defined allocations
- Four ETFs covering all asset classes
- Portfolio output with projection table and education callout
- Illustrative disclaimer prominent in UI
- USD only, static dataset, no backend

### v2 — Tax Layer
Tax calculation is straightforward and will be added in v2. The questionnaire already collects gross income. With marginal tax rate tables for a defined jurisdiction, the tool can:
- Calculate estimated tax liability
- Apply pre-tax deductions (401k, retirement annuity contributions)
- Show net investable income after tax
- Recommend contribution amounts to maximise tax efficiency

This is a tax bracket lookup plus arithmetic — not complex. It will be implemented cleanly in v2.

### v3 — Live Data
- Replace static ETF dataset with live API (Yahoo Finance or similar)
- Real-time TER and pricing data
- Automated fund screening

### v4/v5 — Sophistication Layer
- Retirement income modelling
- Rebalancing alerts
- Multi-currency support
- Goal-based sub-portfolio segmentation (ring-fence education fund from retirement fund)
- UCITS/AIF fund inclusion for non-US users

### v6 — Full Wealth Management Tool
- Full multi-jurisdiction tax planning
- Estate and beneficiary considerations
- Insurance gap analysis
- Brokerage account integration for live portfolio tracking

---

## 11. Constraints and Non-Goals for v1

- No user accounts, no data persistence, session only
- No financial advice — illustrative modelling only (disclaimer mandatory and prominent)
- No actively managed funds
- No individual stock picks
- No live data
- No tax calculations
- No backend, no database, no API calls