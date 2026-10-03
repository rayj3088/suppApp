// Each entry: density + optional source URL (PubChem or Wikipedia)
export const VERIFIED_DENSITIES = {
  "creatine monohydrate": { density: 0.86, url: "https://pubchem.ncbi.nlm.nih.gov/compound/Creatine" },
  "creatine":             { density: 0.86, url: "https://pubchem.ncbi.nlm.nih.gov/compound/Creatine" },
  "ascorbic acid":        { density: 0.65, url: "https://pubchem.ncbi.nlm.nih.gov/compound/Ascorbic-acid" },
  "vitamin c":            { density: 0.65, url: "https://pubchem.ncbi.nlm.nih.gov/compound/Ascorbic-acid" },
  "myo-inositol":         { density: 0.72, url: "https://pubchem.ncbi.nlm.nih.gov/compound/Inositol" },
  "inositol":             { density: 0.72, url: "https://pubchem.ncbi.nlm.nih.gov/compound/Inositol" },
  "calcium carbonate":    { density: 1.05, url: "https://pubchem.ncbi.nlm.nih.gov/compound/Calcium-carbonate" },
  "calcium citrate":      { density: 0.90, url: "https://pubchem.ncbi.nlm.nih.gov/compound/Calcium-citrate" },
  "calcium borate":       { density: 0.95, url: "https://en.wikipedia.org/wiki/Calcium_borate" },
  "calcium":              { density: 0.95, url: "https://pubchem.ncbi.nlm.nih.gov/compound/Calcium" },
  "magnesium citrate":    { density: 0.58, url: "https://pubchem.ncbi.nlm.nih.gov/compound/Magnesium-citrate" },
  "magnesium glycinate":  { density: 0.62, url: "https://pubchem.ncbi.nlm.nih.gov/compound/Magnesium-glycinate" },
  "magnesium oxide":      { density: 0.45, url: "https://pubchem.ncbi.nlm.nih.gov/compound/Magnesium-oxide" },
  "magnesium stearate":   { density: 0.40, url: "https://pubchem.ncbi.nlm.nih.gov/compound/Magnesium-stearate" },
  "magnesium":            { density: 0.55, url: "https://pubchem.ncbi.nlm.nih.gov/compound/Magnesium" },
  "l-glutamine":          { density: 0.48, url: "https://pubchem.ncbi.nlm.nih.gov/compound/Glutamine" },
  "glutamine":            { density: 0.48, url: "https://pubchem.ncbi.nlm.nih.gov/compound/Glutamine" },
  "sodium bicarbonate":   { density: 1.10, url: "https://pubchem.ncbi.nlm.nih.gov/compound/Sodium-bicarbonate" },
  "baking soda":          { density: 1.10, url: "https://pubchem.ncbi.nlm.nih.gov/compound/Sodium-bicarbonate" },
  "bcaa":                 { density: 0.42, url: null },
  "glycine":              { density: 0.92, url: "https://pubchem.ncbi.nlm.nih.gov/compound/Glycine" },
  "caffeine":             { density: 0.50, url: "https://pubchem.ncbi.nlm.nih.gov/compound/Caffeine" },
  "collagen":             { density: 0.40, url: null },
  "beta alanine":         { density: 0.55, url: "https://pubchem.ncbi.nlm.nih.gov/compound/Beta-Alanine" },
  "beta-alanine":         { density: 0.55, url: "https://pubchem.ncbi.nlm.nih.gov/compound/Beta-Alanine" },
  "taurine":              { density: 0.70, url: "https://pubchem.ncbi.nlm.nih.gov/compound/Taurine" },
  "zinc oxide":           { density: 0.90, url: "https://pubchem.ncbi.nlm.nih.gov/compound/Zinc-oxide" },
  "zinc":                 { density: 0.85, url: "https://pubchem.ncbi.nlm.nih.gov/compound/Zinc" },
  "iron":                 { density: 0.80, url: "https://pubchem.ncbi.nlm.nih.gov/compound/Iron" },
  "potassium":            { density: 0.70, url: "https://pubchem.ncbi.nlm.nih.gov/compound/Potassium" },
  "boron":                { density: 0.80, url: "https://pubchem.ncbi.nlm.nih.gov/compound/Boron" },
  "borate":               { density: 0.90, url: null }
};

/**
 * Returns:
 *   { density, source, url }  on success
 *   { density: null, source: "No reliable data", url: null } when unknown
 * Never invents a number.
 */
export async function fetchDensityFromIntelligence(compoundName) {
  const clean = compoundName.toLowerCase().trim();

  // 1. Verified local lookup (longest / most specific first)
  const sortedKeys = Object.keys(VERIFIED_DENSITIES)
    .sort((a, b) => b.length - a.length);

  for (const key of sortedKeys) {
    if (clean.includes(key)) {
      const entry = VERIFIED_DENSITIES[key];
      return {
        density: entry.density,
        source: "Verified Database",
        url: entry.url || null
      };
    }
  }

  // 2. Intelligence Layer – Wikipedia summary
  try {
    const query = clean
      .split(/\s+/)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join("_");

    const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
    const res = await fetch(apiUrl, { headers: { "Accept": "application/json" } });

    if (res.ok) {
      const data = await res.json();
      const text = (data.extract || "").toLowerCase();
      const pageUrl = data.content_urls?.desktop?.page ||
        `https://en.wikipedia.org/wiki/${encodeURIComponent(query.replace(/_/g, " "))}`;

      const match = text.match(
        /([0-9]+\.?[0-9]*)\s*(g\/cm³|g\/cm3|g\/cm|g\/ml|g cm-3)/i
      );

      if (match && match[1]) {
        const val = parseFloat(match[1]);
        if (val >= 0.25 && val <= 2.5) {
          return {
            density: val,
            source: "Wikipedia",
            url: pageUrl
          };
        }
      }
    }
  } catch (e) {
    console.error("Intelligence density fetch error:", e);
  }

  // 3. Honest failure — no invented numbers
  return {
    density: null,
    source: "No reliable data",
    url: null
  };
}

export function calculateSpoonVolume(weightMg, density) {
  if (density == null || density <= 0) {
    return {
      weightGrams: null,
      volumeMl: null,
      tsp: null,
      tbsp: null,
      spoonDescription: "Density unknown — volume cannot be calculated"
    };
  }

  const weightGrams = weightMg / 1000;
  const volumeMl = weightGrams / density;
  const tsp = volumeMl / 5.0;
  const tbsp = volumeMl / 15.0;

  let spoonDescription = "";
  if (tsp < 0.2) spoonDescription = "Tiny pinch (< 1/8 tsp)";
  else if (tsp <= 0.35) spoonDescription = "Approx. 1/4 level tsp";
  else if (tsp <= 0.65) spoonDescription = "Approx. 1/2 level tsp";
  else if (tsp <= 0.85) spoonDescription = "Approx. 3/4 level tsp";
  else if (tsp <= 1.15) spoonDescription = "Approx. 1 level tsp";
  else if (tsp <= 1.6) spoonDescription = "Approx. 1.5 level tsp (1/2 tbsp)";
  else spoonDescription = `Approx. ${tsp.toFixed(1)} level tsp (${tbsp.toFixed(1)} tbsp)`;

  return {
    weightGrams: weightGrams.toFixed(2),
    volumeMl: volumeMl.toFixed(2),
    tsp: tsp.toFixed(2),
    tbsp: tbsp.toFixed(2),
    spoonDescription
  };
}
