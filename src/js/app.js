import { fetchDensityFromIntelligence, calculateSpoonVolume } from './converter.js';
import { checkLocalDictionary, buildQuickTake, getRelevantComparisons } from './dictionary.js';
import { updateUIState, renderOutputCards, renderFallbackUI, updateApiBadge } from './ui.js';
import { getApiCount, runBrowserNativeAI, fetchFromServerProxyAPI } from './api.js';

let activeDensity = null;
let activeSubstance = "Creatine";
let latestIngredientMatrix = null;
let latestSupplementName = "Scanned Supplement " + new Date().toLocaleTimeString();

async function updateConverterUI(forceDensityFetch = false) {
  const substanceEl = document.getElementById('converter-substance');
  const weightEl = document.getElementById('converter-weight');
  if (!substanceEl || !weightEl) return;

  const weight = parseFloat(weightEl.value || 0);
  if (weight <= 0) return;

  if (forceDensityFetch || substanceEl.value !== activeSubstance) {
    const data = await fetchDensityFromIntelligence(substanceEl.value || activeSubstance);
    activeDensity = data.density;           // may be null
    activeSubstance = substanceEl.value || activeSubstance;
    const sourceEl = document.getElementById('conv-source');
    if (sourceEl) {
      if (data.density == null) {
        sourceEl.innerHTML = data.source;
      } else if (data.url) {
        sourceEl.innerHTML = `<a href="${data.url}" target="_blank" rel="noopener" style="color:#60a5fa;text-decoration:underline;">${data.source}</a> (${data.density.toFixed(2)} g/mL)`;
      } else {
        sourceEl.textContent = `${data.source} (${data.density.toFixed(2)} g/mL)`;
      }
    }
  }

  const res = calculateSpoonVolume(weight, activeDensity);
  const spoonEl = document.getElementById('conv-spoon');
  const mlEl = document.getElementById('conv-ml');
  const tspEl = document.getElementById('conv-tsp');

  if (spoonEl) spoonEl.textContent = res.spoonDescription;
  if (mlEl) mlEl.textContent = res.volumeMl != null ? `${res.volumeMl} mL` : "—";
  if (tspEl) tspEl.textContent = res.tsp != null ? `${res.tsp} tsp (${res.tbsp} tbsp)` : "—";
}

function extractPrimaryCompound(rawInputText, foundMatches) {
  const matchKeys = Object.keys(foundMatches || {});
  if (matchKeys.length > 0) return matchKeys[0];

  const tokens = rawInputText
    .split(/[,;\n]+/)
    .map(t => t.trim())
    .filter(t => t.length > 2 && !/^\d/.test(t));
  return tokens[0] || "Unknown compound";
}

export async function processSupplementLabel(rawInputText) {
  updateUIState("THINKING_ORB_ACTIVE");
  const outputContainer = document.getElementById("output-container");
  if (outputContainer) outputContainer.innerHTML = "";

  // Local dictionary
  const foundMatches = checkLocalDictionary(rawInputText);
  latestIngredientMatrix = foundMatches;

  // Drive converter from primary compound
  const primary = extractPrimaryCompound(rawInputText, foundMatches);
  const substanceEl = document.getElementById('converter-substance');
  if (substanceEl) {
    substanceEl.value = primary;
    activeSubstance = primary;
  }
  await updateConverterUI(true);

  // Intelligence path
  try {
    let decipheredText = "";
    const browserAI = await runBrowserNativeAI(rawInputText);
    if (browserAI) {
      decipheredText = browserAI;
    } else {
      decipheredText = await fetchFromServerProxyAPI(rawInputText);
    }

    const quickTake = buildQuickTake(foundMatches);
    const comparisons = getRelevantComparisons(foundMatches);

    renderOutputCards(foundMatches, decipheredText, quickTake, comparisons);
    updateUIState("SUCCESS_ORB_ACTIVE");
  } catch (error) {
    console.error(error);
    renderFallbackUI(error.message || "Connection or processing limit reached.");
    updateUIState("ERROR_ORB_ACTIVE");
  }
}

export function handleProcessClick() {
  const text = document.getElementById("ingredient-input")?.value;
  if (!text || !text.trim()) return;
  processSupplementLabel(text);
}

export function saveCurrentToFavorites() {
  if (!latestIngredientMatrix || Object.keys(latestIngredientMatrix).length === 0) {
    return alert("Nothing to save yet! Analyze a label first.");
  }
  const currentLog = JSON.parse(localStorage.getItem("favorites_matrix")) || [];
  currentLog.push({
    name: latestSupplementName,
    data: latestIngredientMatrix,
    date: Date.now()
  });
  localStorage.setItem("favorites_matrix", JSON.stringify(currentLog));
  alert(`Saved "${latestSupplementName}" to Favorites!`);
}

window.addEventListener("DOMContentLoaded", () => {
  updateApiBadge(getApiCount());
  document.getElementById("analyze-btn")?.addEventListener("click", handleProcessClick);
  document.getElementById("save-btn")?.addEventListener("click", saveCurrentToFavorites);

  const weightEl = document.getElementById("converter-weight");
  if (weightEl) weightEl.addEventListener("input", () => updateConverterUI(false));

  updateConverterUI(true);
});
