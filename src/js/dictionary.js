export const BASELINE_DICTIONARY = {
  "magnesium stearate": "Lubricant: Stops powders from sticking to factory machines.",
  "silicon dioxide": "Anti-caking: Absorbs ambient humidity so powder won't clump.",
  "microcrystalline cellulose": "Bulking agent / Binder: Refined plant pulp that holds tablets together.",
  "stearic acid": "Binder / Lubricant: Saturated fatty acid ensuring smooth encapsulation.",
  "hypromellose": "Capsule shell (HPMC): Plant-based vegetarian capsule material.",
  "gelatin": "Capsule shell: Protein derived from collagen (non-vegetarian).",
  "titanium dioxide": "Color opacifier: Mineral used to make capsules bright white or opaque.",
  "croscarmellose sodium": "Disintegrant: Swells rapidly in stomach acid to break pills apart."
};

export function checkLocalDictionary(inputText) {
  const matches = {};
  const lowerText = inputText.toLowerCase();
  for (const [ingredient, description] of Object.entries(BASELINE_DICTIONARY)) {
    if (lowerText.includes(ingredient)) {
      matches[ingredient] = description;
    }
  }
  return matches;
}
