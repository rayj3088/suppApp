export const BASELINE_DICTIONARY = {
  "calcium citrate": {
    category: "Active Mineral / Chelated Salt",
    solubility: "Water-soluble (Mildly acidic)",
    bioavailability: "High (~24% elemental absorption)",
    absorption: "Does not require stomach acid; can be taken with or without food",
    description: "Highly absorbable calcium bound to citric acid, gentle on the GI tract and ideal for individuals with low stomach acid."
  },
  "calcium carbonate": {
    category: "Active Mineral / Inorganic Salt",
    solubility: "Insoluble in neutral water; dissolves in gastric acid",
    bioavailability: "Moderate (~20% elemental absorption)",
    absorption: "Requires stomach acid; must be taken with meals",
    description: "Common calcium salt containing 40% elemental calcium by weight, but can cause digestive gas or constipation in some users."
  },
  "magnesium stearate": {
    category: "Excipient / Flow Agent",
    solubility: "Insoluble in water and alcohol",
    bioavailability: "Minimal (Biochemically inert excipient)",
    absorption: "Acts solely inside manufacturing machines to prevent powder binding",
    description: "Lubricant composed of magnesium and stearic acid that prevents powders from sticking to industrial encapsulation equipment."
  },
  "silicon dioxide": {
    category: "Excipient / Anti-Caking Agent",
    solubility: "Insoluble in water and acid",
    bioavailability: "Zero (Passes unabsorbed)",
    absorption: "Absorbs ambient humidity in the capsule matrix to prevent clumping",
    description: "Microscopic quartz sand particles that maintain powder flowability and dose uniformity."
  },
  "microcrystalline cellulose": {
    category: "Excipient / Bulking Agent & Binder",
    solubility: "Insoluble in water",
    bioavailability: "Zero (Digestive plant fiber)",
    absorption: "Swells gently and ruptures tablet matrices in gastric fluid",
    description: "Refined plant pulp that provides mechanical structure and facilitates uniform pill disintegration."
  },
  "stearic acid": {
    category: "Excipient / Tablet Hardener & Lubricant",
    solubility: "Insoluble in water; soluble in lipids",
    bioavailability: "Digested as a standard dietary saturated fatty acid",
    absorption: "Hydrolyzed by pancreatic lipases",
    description: "Natural saturated fatty acid used to harden tablets and lubricate compression dies."
  },
  "hypromellose": {
    category: "Capsule Shell / Film Former",
    solubility: "Soluble in cold water; swells into gel",
    bioavailability: "Zero (Plant polysaccharide)",
    absorption: "Dissolves rapidly in standard gastric environments (<15 min)",
    description: "Hydroxypropyl methylcellulose (HPMC), the primary vegetarian alternative to animal gelatin capsules."
  },
  "gelatin": {
    category: "Capsule Shell",
    solubility: "Soluble in warm water / gastric acid",
    bioavailability: "Digestible protein (Collagen peptides)",
    absorption: "Broken down into amino acids by gastric proteases",
    description: "Animal collagen-derived structural protein used for traditional hard capsules and softgels."
  },
  "titanium dioxide": {
    category: "Excipient / Color Opacifier",
    solubility: "Insoluble in water, acids, and organic solvents",
    bioavailability: "Nanoparticle cellular bioaccumulation concern",
    absorption: "Minimal systemic uptake; increasingly restricted in the EU",
    description: "Inert mineral powder used strictly to impart high opacity and brilliant white coloration to capsules."
  },
  "croscarmellose sodium": {
    category: "Excipient / Superdisintegrant",
    solubility: "Insoluble in water; cross-linked fiber",
    bioavailability: "Zero",
    absorption: "Rapidly wicks moisture and swells up to 8x to break tablets apart",
    description: "Internally cross-linked sodium carboxymethylcellulose designed to rupture dense tablets within minutes."
  }
};

export function checkLocalDictionary(inputText) {
  const matches = {};
  const lowerText = inputText.toLowerCase();
  for (const [ingredient, details] of Object.entries(BASELINE_DICTIONARY)) {
    if (lowerText.includes(ingredient)) {
      matches[ingredient] = details;
    }
  }
  return matches;
}
