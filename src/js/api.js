import { updateApiBadge } from './ui.js';

export function getApiCount() {
  return parseInt(localStorage.getItem('api_calls_left') ?? '1000', 10);
}

export function decrementApiCount() {
  let count = getApiCount();
  if (count > 0) {
    count--;
    localStorage.setItem('api_calls_left', count);
    updateApiBadge(count);
  }
  return count;
}

export async function runBrowserNativeAI(inputText) {
  if (window.ai && window.ai.languageModel) {
    const session = await window.ai.languageModel.create();
    return await session.prompt(`Explain these supplement ingredients: ${inputText}`);
  }
  return null;
}

export async function fetchFromServerProxyAPI(inputText) {
  if (getApiCount() <= 0) {
    throw new Error("API call limit of 1,000 reached.");
  }

  try {
    const cleanWord = inputText.trim().split(/[,\n]/)[0].trim();
    const queryWord = cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1);
    
    const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(queryWord)}`);
    if (response.ok) {
      const data = await response.json();
      decrementApiCount();
      return data.extract || `Information compiled for ${data.title}.`;
    }
  } catch (e) {
    console.error("Server Fallback lookup error:", e);
  }

  decrementApiCount();
  return "Server API fallback response triggered for unstructured text.";
}
