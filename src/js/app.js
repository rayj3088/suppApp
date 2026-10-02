import { checkLocalDictionary } from './dictionary.js';
import { updateUIState, renderOutputCards, renderFallbackUI, updateApiBadge } from './ui.js';
import { getApiCount, runBrowserNativeAI, fetchFromServerProxyAPI } from './api.js';

let latestIngredientMatrix = null;
let latestSupplementName = "Scanned Supplement " + new Date().toLocaleTimeString();

export async function processSupplementLabel(rawInputText) {
  updateUIState("THINKING_ORB_ACTIVE");
  const outputContainer = document.getElementById("output-container");
  outputContainer.innerHTML = "";

  let foundMatches = checkLocalDictionary(rawInputText);
  latestIngredientMatrix = foundMatches;

  try {
    let decipheredText = "";

    // Strategy 1: Browser-Native AI
    const browserAI = await runBrowserNativeAI(rawInputText);
    if (browserAI) {
      decipheredText = browserAI;
    } 
    // Strategy 2: Server API Fallback
    else {
      decipheredText = await fetchFromServerProxyAPI(rawInputText);
    }

    renderOutputCards(foundMatches, decipheredText);
    updateUIState("SUCCESS_ORB_ACTIVE");
  } catch (error) {
    console.error(error);
    renderFallbackUI(error.message || "Connection or processing limit reached.");
    updateUIState("ERROR_ORB_ACTIVE");
  }
}

export function handleProcessClick() {
  const text = document.getElementById("ingredient-input").value;
  if (!text.trim()) return;
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

// Wire up events
window.addEventListener("DOMContentLoaded", () => {
  updateApiBadge(getApiCount());
  
  document.getElementById("analyze-btn").addEventListener("click", handleProcessClick);
  document.getElementById("save-btn").addEventListener("click", saveCurrentToFavorites);
});
