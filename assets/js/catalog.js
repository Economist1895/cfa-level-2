/* Catalog of volumes & modules (CFA Program 2027 · Level II).
   status: "ready" = notes published; anything else shows as "soon".
   href is relative to the site root. */
window.CATALOG = [
  { n: 1, title: "Quantitative Methods", modules: [
    { code: "CFA2451", title: "Basics of Multiple Regression and Underlying Assumptions" },
    { code: "CFA2452", title: "Evaluating Regression Model Fit and Interpreting Model Results" },
    { code: "CFA2453", title: "Model Misspecification" },
    { code: "CFA2454", title: "Extensions of Multiple Regression" },
    { code: "CFA0072", title: "Time-Series Analysis" },
    { code: "CFA2007", title: "Machine Learning" },
    { code: "CFA2008", title: "Big Data Projects" },
  ]},
  { n: 2, title: "Economics", modules: [
    { code: "CFA1813", title: "Currency Exchange Rates: Understanding Equilibrium Value" },
    { code: "CFA0236", title: "Economic Growth" },
  ]},
  { n: 3, title: "Financial Statement Analysis", modules: [
    { code: "CFA0081", title: "Intercorporate Investments" },
    { code: "CFA0228", title: "Employee Compensation: Post-Employment and Share-Based" },
    { code: "CFA0082", title: "Multinational Operations" },
    { code: "CFA1917", title: "Analysis of Financial Institutions" },
    { code: "CFA1522", title: "Evaluating Quality of Financial Reports" },
    { code: "CFA1720", title: "Integration of Financial Statement Analysis Techniques" },
  ]},
  { n: 4, title: "Corporate Finance", modules: [
    { code: "CFA0087", title: "Analysis of Dividends and Share Repurchases" },
    { code: "CFA2022", title: "ESG Considerations in Investment Analysis" },
    { code: "CFA2318", title: "Cost of Capital: Advanced Topics" },
    { code: "CFA0089", title: "Corporate Restructuring" },
  ]},
  { n: 5, title: "Equity Valuation", modules: [
    { code: "CFA0091", title: "Equity Valuation: Applications and Processes" },
    { code: "CFA0096", title: "Discounted Dividend Valuation" },
    { code: "CFA0097", title: "Free Cash Flow Valuation" },
    { code: "CFA0098", title: "Market-Based Valuation: Price and EV Multiples" },
    { code: "CFA0099", title: "Residual Income Valuation", status: "ready", mins: 7,
      href: "v05/residual-income.html",
      tags: "RI EVA MVA clean surplus persistence P/B Tobin's q continuing residual income" },
    { code: "CFA0100", title: "Private Company Valuation" },
  ]},
  { n: 6, title: "Fixed Income", modules: [
    { code: "CFA1542", title: "The Term Structure and Interest Rate Dynamics" },
    { code: "CFA1543", title: "The Arbitrage-Free Valuation Framework" },
    { code: "CFA1544", title: "Valuation and Analysis of Bonds with Embedded Options" },
    { code: "CFA1937", title: "Credit Analysis Models" },
    { code: "CFA1456", title: "Credit Default Swaps" },
  ]},
  { n: 7, title: "Derivatives", modules: [
    { code: "CFA1746", title: "Pricing and Valuation of Forward Commitments" },
    { code: "CFA1740", title: "Valuation of Contingent Claims" },
  ]},
  { n: 8, title: "Alternative Investments", modules: [
    { code: "CFA1745", title: "Introduction to Commodities and Commodity Derivatives" },
    { code: "CFA2516", title: "Overview of Types of Real Estate Investment" },
    { code: "CFA2462", title: "Investments in Real Estate through Publicly Traded Securities" },
    { code: "CFA2469", title: "Hedge Fund Strategies" },
  ]},
  { n: 9, title: "Portfolio Management", modules: [
    { code: "CFA1655", title: "Economics and Investment Markets" },
    { code: "CFA1652", title: "Analysis of Active Portfolio Management" },
    { code: "CFA2043", title: "Exchange-Traded Funds: Mechanics and Applications" },
    { code: "CFA1653", title: "Using Multifactor Models" },
    { code: "CFA1749", title: "Measuring and Managing Market Risk" },
    { code: "CFA2109", title: "Backtesting and Simulation" },
  ]},
  { n: 10, title: "Ethical and Professional Standards", modules: [
    { code: "CFA0206", title: "Code of Ethics and Standards of Professional Conduct" },
    { code: "CFA2751", title: "Standard I: Professionalism" },
    { code: "CFA2752", title: "Standard II: Integrity of Capital Markets" },
    { code: "CFA2753", title: "Standard III: Duties to Clients" },
    { code: "CFA2754", title: "Standard IV: Duties to Employers" },
    { code: "CFA2755", title: "Standard V: Investment Analysis, Recommendations, and Actions" },
    { code: "CFA2756", title: "Standard VI: Conflicts of Interest" },
    { code: "CFA2757", title: "Standard VII: Responsibilities as a Member or Candidate" },
    { code: "CFA2758", title: "Application of the Code and Standards" },
  ]},
];
