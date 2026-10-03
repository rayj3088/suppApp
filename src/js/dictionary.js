export const BASELINE_DICTIONARY = {
  // ── Calcium forms ──
  "calcium citrate": {
    category: "Active Mineral",
    form: "calcium",
    elemental: "~21%",
    solubility: "Good (mildly acidic)",
    bioavailability: "High",
    absorption: "Works with or without food; gentle on stomach",
    description: "Well-absorbed calcium bound to citric acid. Preferred when stomach acid is low.",
    concern: "low"
  },
  "calcium carbonate": {
    category: "Active Mineral",
    form: "calcium",
    elemental: "~40%",
    solubility: "Requires acid",
    bioavailability: "Moderate",
    absorption: "Best taken with meals; can cause gas or constipation",
    description: "Highest elemental calcium by weight, but needs stomach acid to absorb well.",
    concern: "low"
  },
  "calcium borate": {
    category: "Active Mineral",
    form: "calcium",
    elemental: "Variable + boron",
    solubility: "Low–moderate",
    bioavailability: "Moderate",
    absorption: "Delivers both calcium and boron",
    description: "Less common form used in some joint/bone formulas for its boron content.",
    concern: "low"
  },

  // ── Magnesium forms ──
  "magnesium citrate": {
    category: "Active Mineral",
    form: "magnesium",
    elemental: "~16%",
    solubility: "High",
    bioavailability: "High",
    absorption: "Well absorbed; mild laxative effect at higher doses",
    description: "One of the most reliable and commonly recommended magnesium forms.",
    concern: "low"
  },
  "magnesium glycinate": {
    category: "Active Mineral",
    form: "magnesium",
    elemental: "~14%",
    solubility: "High",
    bioavailability: "High",
    absorption: "Very gentle; often preferred for evening / sensitive stomachs",
    description: "Chelated with glycine. Excellent tolerability and calming profile.",
    concern: "low"
  },
  "magnesium oxide": {
    category: "Active Mineral",
    form: "magnesium",
    elemental: "~60%",
    solubility: "Poor",
    bioavailability: "Low (~4%)",
    absorption: "Mostly used for constipation; poor systemic magnesium source",
    description: "High elemental percentage but poorly absorbed. Common in cheaper products.",
    concern: "moderate"
  },
  "magnesium stearate": {
    category: "Excipient",
    form: null,
    elemental: null,
    solubility: "Insoluble",
    bioavailability: "Negligible",
    absorption: "Manufacturing lubricant only",
    description: "Flow agent that keeps powder from sticking to machines. Present in tiny amounts.",
    concern: "moderate"
  },

  // ── Common fillers & shells ──
  "silicon dioxide": {
    category: "Excipient",
    form: null,
    elemental: null,
    solubility: "Insoluble",
    bioavailability: "Zero",
    absorption: "Anti-caking only",
    description: "Prevents clumping. Passes through unabsorbed.",
    concern: "low"
  },
  "microcrystalline cellulose": {
    category: "Excipient",
    form: null,
    elemental: null,
    solubility: "Insoluble",
    bioavailability: "Zero",
    absorption: "Binder / disintegrant",
    description: "Plant-derived bulk and binder. Helps tablets break apart properly.",
    concern: "low"
  },
  "stearic acid": {
    category: "Excipient",
    form: null,
    elemental: null,
    solubility: "Insoluble in water",
    bioavailability: "Digested as fat",
    absorption: "Lubricant / hardener",
    description: "Fatty acid used to harden tablets and lubricate equipment.",
    concern: "low"
  },
  "hypromellose": {
    category: "Capsule Shell",
    form: null,
    elemental: null,
    solubility: "Forms gel in water",
    bioavailability: "Zero",
    absorption: "Vegetarian capsule material",
    description: "HPMC — the standard plant-based alternative to gelatin.",
    concern: "low"
  },
  "gelatin": {
    category: "Capsule Shell",
    form: null,
    elemental: null,
    solubility: "Dissolves in warm / acidic conditions",
    bioavailability: "Digestible protein",
    absorption: "Animal-derived capsule",
    description: "Traditional capsule made from collagen.",
    concern: "low"
  },
  "titanium dioxide": {
    category: "Excipient",
    form: null,
    elemental: null,
    solubility: "Insoluble",
    bioavailability: "Minimal (nanoparticle questions remain)",
    absorption: "Color / opacity only",
    description: "Whitening agent. Restricted in the EU; still common in many US products.",
    concern: "watched"
  },
  "croscarmellose sodium": {
    category: "Excipient",
    form: null,
    elemental: null,
    solubility: "Swells strongly",
    bioavailability: "Zero",
    absorption: "Superdisintegrant",
    description: "Makes tablets break apart quickly once wet.",
    concern: "low"
  }
};

// Comparison tables for the major mineral families
export const FORM_COMPARISONS = {
  calcium: [
    { name: "Calcium Citrate", elemental: "~21%", absorption: "High, with or without food", notes: "Best when stomach acid is low" },
    { name: "Calcium Carbonate", elemental: "~40%", absorption: "Moderate, needs food/acid", notes: "Highest elemental %, cheapest" },
    { name: "Calcium Borate", elemental: "Lower + boron", absorption: "Moderate", notes: "Specialty form for boron content" }
  ],
  magnesium: [
    { name: "Magnesium Glycinate", elemental: "~14%", absorption: "High, very gentle", notes: "Best tolerability / evening use" },
    { name: "Magnesium Citrate", elemental: "~16%", absorption: "High", notes: "Reliable everyday form; mild laxative" },
    { name: "Magnesium Oxide", elemental: "~60%", absorption: "Very low", notes: "Mostly for constipation, not systemic Mg" }
  ]
};

export function checkLocalDictionary(inputText) {
  const matches = {};
  const lower = inputText.toLowerCase();
  for (const [ing, details] of Object.entries(BASELINE_DICTIONARY)) {
    if (lower.includes(ing)) matches[ing] = details;
  }
  return matches;
}

export function buildQuickTake(matches) {
  const entries = Object.entries(matches || {});
  if (!entries.length) {
    return "No familiar ingredients hit the local dictionary. Check the intelligence output below for a broader read.";
  }

  const actives = [];
  const watched = [];
  const moderate = [];
  const formsSeen = new Set();

  for (const [name, d] of entries) {
    if (d.form) formsSeen.add(d.form);
    if (d.concern === "watched") watched.push(name);
    else if (d.concern === "moderate") moderate.push(name);
    else if (d.category === "Active Mineral") actives.push(name);
  }

  const parts = [];

  if (actives.length) {
    parts.push(`Solid actives detected: ${actives.join(", ")}.`);
  }

  if (watched.length) {
    parts.push(`${watched.map(w => w.replace(/\b\w/g, c => c.toUpperCase())).join(" & ")} is present — some people actively avoid it (EU restricted).`);
  }

  if (moderate.length) {
    const clean = moderate.map(m => m.replace(/\b\w/g, c => c.toUpperCase()));
    parts.push(`${clean.join(", ")} also appears — commonly discussed, usually only in small manufacturing amounts.`);
  }

  // Absorption signal (check all matched names, not just low-concern actives)
  const allNames = entries.map(([n]) => n);
  const hasHigh = allNames.some(a => a.includes("citrate") || a.includes("glycinate"));
  const hasLow = allNames.some(a => a.includes("oxide") || a.includes("carbonate"));
  if (hasHigh && !hasLow) parts.push("Absorption profile looks favorable.");
  else if (hasLow && !hasHigh) parts.push("Absorption may be limited with these forms — timing with meals matters.");
  else if (hasHigh && hasLow) parts.push("Mixed absorption profile across the forms present.");

  if (!parts.length) parts.push("Ingredients matched the dictionary. See details below.");

  return parts.join(" ");
}

export function getRelevantComparisons(matches) {
  const forms = new Set();
  for (const d of Object.values(matches || {})) {
    if (d.form) forms.add(d.form);
  }
  const tables = [];
  for (const f of forms) {
    if (FORM_COMPARISONS[f]) {
      tables.push({ mineral: f, rows: FORM_COMPARISONS[f] });
    }
  }
  return tables;
}
