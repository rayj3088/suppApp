export const VERIFIED_DENSITIES = {
  "creatine": 0.86,
  "creatine monohydrate": 0.86,
  "vitamin c": 0.65,
  "ascorbic acid": 0.65,
  "inositol": 0.72,
  "myo-inositol": 0.72,
  "calcium carbonate": 1.05,
  "calcium citrate": 0.90,
  "magnesium citrate": 0.58,
  "magnesium glycinate": 0.62,
  "magnesium stearate": 0.40,
  "bcaa": 0.42,
  "l-glutamine": 0.48,
  "glutamine": 0.48,
  "glycine": 0.92,
  "sodium bicarbonate": 1.10,
  "baking soda": 1.10,
  "caffeine": 0.50,
  "collagen": 0.40
};

export async function fetchDensityFromIntelligence(compoundName) {
  const clean = compoundName.toLowerCase().trim();
  
  // 1. Check verified local lookup first
  for (const [key, density] of Object.entries(VERIFIED_DENSITIES)) {
    if (clean.includes(key)) {
      return { density, source: "Verified Database" };
    }
  }

  // 2. Intelligence Layer fallback: Fetch live properties via Wikipedia/PubChem
  try {
    const query = clean.charAt(0).toUpperCase() + clean.slice(1);
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
    if (res.ok) {
      const data = await res.json();
      const text = (data.extract || "").toLowerCase();

      // Regex to search for density patterns like "1.65 g/cm3" or "0.8 g/ml"
      const match = text.match(/([0-9]+\.?[0-9]*)\s*(g\/cm|g\/ml|g\/cm³)/i);
      if (match && match[1]) {
        let val = parseFloat(match[1]);
        // Guard against molecular weights and invalid ranges (typical powder bulk densities are 0.3 - 2.5 g/ml)
        if (val >= 0.25 && val <= 2.5) {
          return { density: val, source: "Intelligence Layer" };
        }
      }
    }
  } catch (e) {
    console.error("Intelligence density fetch error:", e);
  }

  // Safe fallback if substance is unstructured
  return { density: 0.70, source: "Estimated Average" };
}

export function calculateSpoonVolume(weightMg, density) {
  const weightGrams = weightMg / 1000;
  const volumeMl = weightGrams / density;
  
  const tsp = volumeMl / 5.0;      // 1 metric tsp = 5 mL
  const tbsp = volumeMl / 15.0;    // 1 metric tbsp = 15 mL

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
