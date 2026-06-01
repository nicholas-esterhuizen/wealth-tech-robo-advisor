// ============================================================
// data.js — Wealth Tech Robo-Advisor v3
// Static dataset: ETFs, asset class definitions, profile allocations
// To add a new ETF or adjust allocations, edit this file only.
// No changes to engine.js or index.html required.
// ============================================================

const ETF_DATA = {
  VT: {
    ticker: "VT",
    name: "Vanguard Total World Stock ETF",
    assetClass: "equities",
    issuer: "Vanguard",
    index: "FTSE Global All Cap Index",
    ter: 0.07,
    currency: "USD",
    grossReturn: 0.09,
    taxType: "cgt",
    description: "Provides exposure to the entire global equity market in a single fund — US large cap, international developed markets, and emerging markets — weighted by market capitalisation.",
    rationale: "Single-ticker global equity exposure at near-zero cost. Used as the core equity building block across all growth-oriented profiles."
  },
  VNQ: {
    ticker: "VNQ",
    name: "Vanguard Real Estate ETF",
    assetClass: "property",
    issuer: "Vanguard",
    index: "MSCI US Investable Market Real Estate 25/50 Index",
    ter: 0.13,
    currency: "USD",
    grossReturn: 0.075,
    taxType: "cgt",
    description: "Tracks US-listed Real Estate Investment Trusts (REITs) across retail, industrial, healthcare, and infrastructure sectors.",
    rationale: "Low-cost REIT exposure providing income generation and real asset diversification alongside the equity sleeve."
  },
  AGG: {
    ticker: "AGG",
    name: "iShares Core US Aggregate Bond ETF",
    assetClass: "fixedIncome",
    issuer: "BlackRock",
    index: "Bloomberg US Aggregate Bond Index",
    ter: 0.03,
    currency: "USD",
    grossReturn: 0.045,
    taxType: "income",
    description: "Covers the full US investment-grade bond market — Treasuries, government agency bonds, corporate bonds, and mortgage-backed securities.",
    rationale: "The industry-standard core fixed income holding. Extremely low cost, deep liquidity, and broad diversification across the full investment-grade bond market."
  },
  SGOV: {
    ticker: "SGOV",
    name: "iShares 0-3 Month Treasury Bond ETF",
    assetClass: "cash",
    issuer: "BlackRock",
    index: "ICE 0-3 Month US Treasury Securities Index",
    ter: 0.09,
    currency: "USD",
    grossReturn: 0.03,
    taxType: "income",
    description: "Holds US Treasury Bills maturing in zero to three months, rolled over continuously. Near-zero price volatility with monthly income distributions.",
    rationale: "The modern cash equivalent — Treasury safety, ETF convenience, monthly income, and a lower cost than most retail money market funds."
  }
};

// ============================================================
// Strategic Asset Allocation per risk profile
// ============================================================

const PROFILE_ALLOCATIONS = {
  defensive: {
    label: "Defensive",
    code: "DEF",
    cpiTarget: 1,
    description: "Capital preservation is the priority. No equity exposure. Suited to investors at or near retirement, with very low risk tolerance, or significant near-term capital demands.",
    objective: "Target return: CPI + 1% per annum. The goal is to preserve purchasing power while generating modest income from fixed income and cash holdings.",
    rebalanceMonths: 36,
    allocation: {
      equities: 0,
      property: 0,
      fixedIncome: 80,
      cash: 20
    },
    etfs: {
      equities: null,
      property: null,
      fixedIncome: "AGG",
      cash: "SGOV"
    }
  },
  conservative: {
    label: "Conservative",
    code: "CON",
    cpiTarget: 2,
    description: "Modest growth with meaningful downside protection. Predominantly fixed income with limited equity exposure. Suited to investors with a medium-term horizon who cannot afford significant drawdowns.",
    objective: "Target return: CPI + 2% per annum. Prioritises stability while allowing modest participation in equity market growth.",
    rebalanceMonths: 36,
    allocation: {
      equities: 20,
      property: 5,
      fixedIncome: 60,
      cash: 15
    },
    etfs: {
      equities: "VT",
      property: "VNQ",
      fixedIncome: "AGG",
      cash: "SGOV"
    }
  },
  balanced: {
    label: "Balanced",
    code: "BAL",
    cpiTarget: 3,
    description: "A diversified portfolio balancing growth and stability. Equal weighting between equities and fixed income, with small allocations to property and cash.",
    objective: "Target return: CPI + 3% per annum. The long-term industry standard for moderate-risk investors seeking steady wealth accumulation.",
    rebalanceMonths: 24,
    allocation: {
      equities: 40,
      property: 5,
      fixedIncome: 40,
      cash: 15
    },
    etfs: {
      equities: "VT",
      property: "VNQ",
      fixedIncome: "AGG",
      cash: "SGOV"
    }
  },
  balancedGrowth: {
    label: "Balanced Growth",
    code: "BAL-GRW",
    cpiTarget: 4,
    description: "Higher equity weighting than Balanced, accepting more short-term volatility in exchange for higher expected long-term returns. Suited to investors with a longer horizon and strong financial capacity.",
    objective: "Target return: CPI + 4% per annum. Tilted toward growth while maintaining meaningful diversification across all asset classes.",
    rebalanceMonths: 12,
    allocation: {
      equities: 60,
      property: 5,
      fixedIncome: 20,
      cash: 15
    },
    etfs: {
      equities: "VT",
      property: "VNQ",
      fixedIncome: "AGG",
      cash: "SGOV"
    }
  },
  growth: {
    label: "Growth",
    code: "GRW",
    cpiTarget: 5,
    description: "Maximum equity exposure. Designed for investors with a long time horizon, strong financial capacity, and high tolerance for short-term drawdowns. Significant losses in any given year are possible and expected.",
    objective: "Target return: CPI + 5% per annum. Maximises long-term wealth accumulation through aggressive equity participation.",
    rebalanceMonths: 12,
    allocation: {
      equities: 80,
      property: 5,
      fixedIncome: 10,
      cash: 5
    },
    etfs: {
      equities: "VT",
      property: "VNQ",
      fixedIncome: "AGG",
      cash: "SGOV"
    }
  }
};

// ============================================================
// Profile score bands — maps 0-100 score to profile key
// ============================================================

const SCORE_BANDS = [
  { min: 0,  max: 15, profile: "defensive" },
  { min: 16, max: 35, profile: "conservative" },
  { min: 36, max: 55, profile: "balanced" },
  { min: 56, max: 75, profile: "balancedGrowth" },
  { min: 76, max: 100, profile: "growth" }
];

// ============================================================
// Global assumptions
// ============================================================

const ASSUMPTIONS = {
  inflation: 0.025,
  projectionYears: 20
};

// ============================================================
// EmailJS credentials
// ============================================================

const EMAILJS_CONFIG = {
  serviceId:  "service_myzqyvl",
  templateId: "template_a36uvxv",
  publicKey:  "93RyQPsSC_WKW0YQb"
};