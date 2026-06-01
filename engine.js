// ============================================================
// engine.js — Wealth Tech Robo-Advisor v3
// ============================================================

function scoreQuestionnaire(answers) {
  let attitudeScore = 0;
  let capacityScore = 0;
  let horizonScore  = 0;

  const q10Map = { sell: 0, reduce: 8, hold: 16, buy: 25 };
  attitudeScore += q10Map[answers.q10] ?? 0;
  const q11Map = { preserve: 0, income: 5, grow: 12, maximise: 15 };
  attitudeScore += q11Map[answers.q11] ?? 0;
  const q12Map = { never: 0, stressful: 3, comfortable: 7, active: 10 };
  attitudeScore += q12Map[answers.q12] ?? 0;
  const attitudeNormalised = Math.min(attitudeScore, 50);

  const totalAssets = (answers.fixedAssets ?? 0) + (answers.investableAssets ?? 0);
  const netWorth    = totalAssets - (answers.q2 ?? 0);
  if      (netWorth > 2000000) capacityScore += 12;
  else if (netWorth > 500000)  capacityScore += 9;
  else if (netWorth > 100000)  capacityScore += 6;
  else if (netWorth > 0)       capacityScore += 3;

  const surplus      = (answers.q3 ?? 0) - (answers.q4 ?? 0);
  const surplusRatio = answers.q3 > 0 ? surplus / answers.q3 : 0;
  if      (surplusRatio > 0.4)  capacityScore += 10;
  else if (surplusRatio > 0.2)  capacityScore += 7;
  else if (surplusRatio > 0.1)  capacityScore += 4;
  else if (surplusRatio > 0)    capacityScore += 2;

  const liabilityRatio = totalAssets > 0 ? (answers.q2 ?? 0) / totalAssets : 1;
  if      (liabilityRatio < 0.1) capacityScore += 8;
  else if (liabilityRatio < 0.3) capacityScore += 6;
  else if (liabilityRatio < 0.5) capacityScore += 4;
  else if (liabilityRatio < 0.7) capacityScore += 2;
  const capacityNormalised = Math.min(capacityScore, 30);

  const yearsToRetirement = Math.max((answers.q6 ?? 65) - (answers.q5 ?? 40), 0);
  if      (yearsToRetirement > 25) horizonScore += 10;
  else if (yearsToRetirement > 15) horizonScore += 8;
  else if (yearsToRetirement > 10) horizonScore += 6;
  else if (yearsToRetirement > 5)  horizonScore += 4;
  else                             horizonScore += 1;

  let capitalCallPenalty = 0;
  if (answers.q8_university === true) {
    const yearsToUni = answers.q8_years ?? 5;
    if      (yearsToUni <= 2) capitalCallPenalty += 6;
    else if (yearsToUni <= 5) capitalCallPenalty += 4;
    else                      capitalCallPenalty += 2;
  }
  if (answers.q9_other === true) capitalCallPenalty += 3;
  horizonScore = Math.max(horizonScore - capitalCallPenalty, 0);
  const horizonNormalised = Math.min(horizonScore, 20);

  return {
    totalScore: attitudeNormalised + capacityNormalised + horizonNormalised,
    breakdown: { attitude: attitudeNormalised, capacity: capacityNormalised, horizon: horizonNormalised }
  };
}

function assignProfile(scoreResult, answers) {
  const { totalScore } = scoreResult;
  let profileKey = "balanced";
  for (const band of SCORE_BANDS) {
    if (totalScore >= band.min && totalScore <= band.max) { profileKey = band.profile; break; }
  }

  const investableAssets  = answers.investableAssets ?? 0;
  const yearsToRetirement = Math.max((answers.q6 ?? 65) - (answers.q5 ?? 40), 0);
  const yearsToUni        = answers.q8_university ? (answers.q8_years ?? 5) : null;
  const annualIncome      = answers.q3 ?? 0;
  const uniCostEstimate   = annualIncome * 0.5;
  const capOrder = ["defensive", "conservative", "balanced", "balancedGrowth", "growth"];

  if (yearsToUni !== null && yearsToUni <= 3 && investableAssets > 0 &&
      (uniCostEstimate * 4) / investableAssets > 0.2) {
    const ci = capOrder.indexOf(profileKey);
    if (ci > capOrder.indexOf("balancedGrowth")) profileKey = "balancedGrowth";
  }
  if (yearsToRetirement < 5) {
    const ci = capOrder.indexOf(profileKey);
    if (ci > capOrder.indexOf("balanced")) profileKey = "balanced";
  }
  if (scoreResult.breakdown.horizon === 0) {
    const ci = capOrder.indexOf(profileKey);
    if (ci > capOrder.indexOf("balanced")) profileKey = "balanced";
  }

  return { profileKey, profile: PROFILE_ALLOCATIONS[profileKey] };
}

function calculateBlendedTER(profileKey) {
  const profile = PROFILE_ALLOCATIONS[profileKey];
  let blendedTER = 0;
  for (const [assetClass, weight] of Object.entries(profile.allocation)) {
    const ticker = profile.etfs[assetClass];
    if (ticker && ETF_DATA[ticker]) blendedTER += (weight / 100) * ETF_DATA[ticker].ter;
  }
  return Math.round(blendedTER * 1000) / 1000;
}

function calculateETFAllocations(profileKey, investableAssets) {
  const profile = PROFILE_ALLOCATIONS[profileKey];
  const result  = {};
  for (const [assetClass, pct] of Object.entries(profile.allocation)) {
    result[assetClass] = {
      ticker:       profile.etfs[assetClass],
      percentage:   pct,
      dollarAmount: Math.round((pct / 100) * investableAssets)
    };
  }
  return result;
}

function calculateProjections(profileKey, initialAmount, monthlyContribution, incomeTaxRate, cgtRate) {
  const profile    = PROFILE_ALLOCATIONS[profileKey];
  const allocation = profile.allocation;
  const inflation  = ASSUMPTIONS.inflation;
  const years      = ASSUMPTIONS.projectionYears;

  const returns = {
    equities:    ETF_DATA["VT"]   ? ETF_DATA["VT"].grossReturn   : 0.09,
    property:    ETF_DATA["VNQ"]  ? ETF_DATA["VNQ"].grossReturn  : 0.075,
    fixedIncome: ETF_DATA["AGG"]  ? ETF_DATA["AGG"].grossReturn  : 0.045,
    cash:        ETF_DATA["SGOV"] ? ETF_DATA["SGOV"].grossReturn : 0.03
  };

  const annualContribution = monthlyContribution * 12;
  const incomeReturnRate   = (allocation.fixedIncome / 100) * returns.fixedIncome + (allocation.cash / 100) * returns.cash;
  const capitalReturnRate  = (allocation.equities / 100) * returns.equities + (allocation.property / 100) * returns.property;

  const grossNominal = [], grossReal = [], netNominal = [], netReal = [];
  let navGross = initialAmount, navNet = initialAmount;

  for (let yr = 1; yr <= years; yr++) {
    navGross += annualContribution;
    navNet   += annualContribution;

    navGross += navGross * incomeReturnRate + navGross * capitalReturnRate;
    grossNominal.push(Math.round(navGross));
    grossReal.push(Math.round(navGross / Math.pow(1 + inflation, yr)));

    const netIncome  = navNet * incomeReturnRate;
    const netCapital = navNet * capitalReturnRate;
    navNet = navNet + netIncome + netCapital - (netIncome * incomeTaxRate) - (netCapital * cgtRate);
    netNominal.push(Math.round(navNet));
    netReal.push(Math.round(navNet / Math.pow(1 + inflation, yr)));
  }

  return { grossNominal, grossReal, netNominal, netReal };
}

function detectEducationLiabilities(answers) {
  const liabilities = [];
  if (!answers.q7_dependents || answers.q7_dependents.length === 0) return liabilities;
  for (const dependent of answers.q7_dependents) {
    const age               = dependent.age ?? 0;
    const yearsToUniversity = Math.max(18 - age, 0);
    if (yearsToUniversity <= 12) {
      liabilities.push({
        age, yearsToUniversity,
        urgency: yearsToUniversity <= 2 ? "high" : yearsToUniversity <= 5 ? "medium" : "low",
        message: yearsToUniversity === 0
          ? `A dependent aged ${age} is at or near university age. Ensure funds are accessible now.`
          : `A dependent aged ${age} will reach university age in approximately ${yearsToUniversity} year${yearsToUniversity === 1 ? "" : "s"}. Plan accordingly.`
      });
    }
  }
  return liabilities;
}

function calculateSuggestedMonthly(answers) {
  return Math.round(Math.max((answers.q3 ?? 0) - (answers.q4 ?? 0), 0) / 12 * 0.2);
}

function generateImplementationGuide(profileKey, etfAllocations, monthlyContribution, contributionFrequency, answers) {
  const profile       = PROFILE_ALLOCATIONS[profileKey];
  const investableAmt = answers.investableAssets ?? 0;

  const freqLabel = contributionFrequency === 'quarterly'
    ? 'quarterly (every 3 months)'
    : 'semi-annually (every 6 months)';

  const freqShort = contributionFrequency === 'quarterly' ? 'three months' : 'six months';

  const rebalDates = contributionFrequency === 'quarterly'
    ? 'March, June, September, and December'
    : 'June and December';

  // Tactical drift ranges per asset class
  const tacticalRanges = Object.entries(profile.allocation)
    .filter(([, pct]) => pct > 0)
    .map(([cls, pct]) => {
      const label = { equities: 'Equities', property: 'Property', fixedIncome: 'Fixed Income', cash: 'Cash' }[cls];
      return `${label}: target ${pct}% — acceptable range ${Math.max(pct - 15, 0)}%–${pct + 15}%`;
    }).join('\n');

  // Strategic tolerance ranges per asset class
  const strategicRanges = Object.entries(profile.allocation)
    .filter(([, pct]) => pct > 0)
    .map(([cls, pct]) => {
      const label = { equities: 'Equities', property: 'Property', fixedIncome: 'Fixed Income', cash: 'Cash' }[cls];
      return `${label}: target ${pct}% — tolerance ${Math.max(pct - 10, 0)}%–${pct + 10}%`;
    }).join('\n');

  const steps = [];

  // Step 1
  if (investableAmt > 0) {
    const allocationLines = Object.entries(etfAllocations)
      .filter(([, d]) => d.percentage > 0 && d.ticker)
      .map(([cls, d]) => {
        const etf   = ETF_DATA[d.ticker];
        const label = { equities: 'Equities', property: 'Property', fixedIncome: 'Fixed Income', cash: 'Cash' }[cls];
        return `${label} — ${etf.name} (${etf.ticker}): ${formatUSDEngine(d.dollarAmount)} — ${d.percentage}% of portfolio`;
      });
    steps.push({
      number: 1,
      title: "Deploy your investable assets",
      body: `Open a brokerage account if you do not already have one (examples: Fidelity, Charles Schwab, Interactive Brokers). Purchase the following ETFs in the amounts shown, based on your total investable assets of ${formatUSDEngine(investableAmt)}:\n\n${allocationLines.join("\n")}\n\nIf you already hold equities, bonds, or other investments, deduct their current market value from the relevant allocation above. Only purchase the difference needed to reach your target allocation — do not sell existing holdings to fund this initial portfolio.`
    });
  }

  // Step 2
  steps.push({
    number: 2,
    title: "Set up a monthly contribution into SGOV",
    body: `Set up an automatic transfer of ${formatUSDEngine(monthlyContribution)} per month from your bank account into your brokerage account. As each contribution arrives, purchase SGOV (iShares 0-3 Month Treasury Bond ETF — ticker: SGOV).\n\nSGOV holds ultra-short US Treasury Bills and earns a competitive short-term yield. Your contributions are never sitting idle — they earn while they wait to be deployed at your next rebalancing date.`
  });

  // Step 3 — Tactical
  steps.push({
    number: 3,
    title: `Tactical rebalancing — deploy cash ${freqLabel}`,
    body: `On your tactical rebalancing dates (${rebalDates}), deploy your accumulated SGOV cash toward underweight asset classes. This is a buy-only exercise — the goal is to use available cash to bring your portfolio as close to your strategic asset allocation as possible without selling any existing positions.\n\nYour tactical drift ranges (15% tolerance either side of target):\n\n${tacticalRanges}\n\nIf an asset class has drifted beyond its tactical range, you may sell a portion of the overweight position and redeploy into underweight asset classes. However, avoid unnecessary selling — the primary mechanism is always cash deployment first.\n\nAfter ${freqShort} of contributions, even modest monthly amounts accumulate meaningfully. Deploy them where they are needed most.`
  });

  // Step 4 — Strategic
  steps.push({
    number: 4,
    title: "Strategic rebalancing — annual full portfolio review",
    body: `Once per year, conduct a full strategic rebalancing review. The goal is to bring every asset class back within 10% of its strategic asset allocation target. This review is mandatory regardless of market conditions.\n\nYour strategic tolerance ranges (10% tolerance either side of target):\n\n${strategicRanges}\n\nAny asset class outside its tolerance band must be rebalanced. This may involve selling overweight positions and purchasing underweight ones. Unlike tactical rebalancing, selling is an accepted part of this process when required to maintain the long-term strategy.\n\nIf your annual strategic rebalancing date coincides with a tactical cash deployment date, always rebalance the portfolio first to bring it within tolerance, then deploy the accumulated cash — keeping the post-deployment allocation within range.\n\nNote: in a real-world scenario, selling investments may trigger capital gains tax and/or dividends tax. This tool is for illustrative modelling purposes only.`
  });

  // Step 5 — Reminders
  steps.push({
    number: 5,
    title: "Set your calendar reminders and save your reports",
    body: `Open your calendar app and set the following recurring reminders:\n\n1. Tactical rebalancing — repeat ${freqLabel} on your chosen dates (${rebalDates}). Label it: "Portfolio review — deploy SGOV cash, check tactical allocation ranges."\n\n2. Strategic rebalancing — repeat annually on a fixed date of your choosing. Label it: "Annual portfolio rebalance — review against strategic asset allocation targets, rebalance to within 10% of targets."\n\nDownload and save both PDF reports generated by this tool in a safe place — your personal files, cloud storage, or email them to yourself. You will need the target allocation figures and the implementation guide when conducting each review. If your circumstances change significantly, re-run the questionnaire to reassess your risk profile.`
  });

  return steps;
}

function formatUSDEngine(n) {
  if (n >= 1000000) return '$' + (n / 1000000).toFixed(2) + 'M';
  if (n >= 1000)    return '$' + (n / 1000).toFixed(0) + ',000';
  return '$' + n.toFixed(0);
}

function runEngine(answers) {
  const scoreResult   = scoreQuestionnaire(answers);
  const { profileKey, profile } = assignProfile(scoreResult, answers);
  const blendedTER    = calculateBlendedTER(profileKey);

  const incomeTaxRate       = (answers.incomeTaxRate ?? 40) / 100;
  const cgtRate             = (answers.cgtRate       ?? 20) / 100;
  const investableAssets    = answers.investableAssets ?? 0;
  const monthlyContribution = answers.monthlyContribution ?? calculateSuggestedMonthly(answers);
  const contributionFreq    = answers.contributionFrequency ?? 'semiannual';

  const etfAllocations       = calculateETFAllocations(profileKey, investableAssets);
  const projections          = calculateProjections(profileKey, investableAssets, monthlyContribution, incomeTaxRate, cgtRate);
  const educationLiabilities = detectEducationLiabilities(answers);
  const implementationGuide  = generateImplementationGuide(profileKey, etfAllocations, monthlyContribution, contributionFreq, answers);
  const suggestedMonthly     = calculateSuggestedMonthly(answers);

  return {
    score: scoreResult, profileKey, profile, blendedTER,
    monthlyContribution, suggestedMonthly, contributionFreq,
    etfAllocations, projections, educationLiabilities, implementationGuide,
    etfData: ETF_DATA, incomeTaxRate: answers.incomeTaxRate ?? 40,
    cgtRate: answers.cgtRate ?? 20, investableAssets
  };
}