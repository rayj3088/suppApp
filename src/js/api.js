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
    const queryWord = cleanWord
      .split(/\s+/)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join("_");

    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(queryWord)}`,
      { headers: { "Accept": "application/json" } }
    );

    if (response.ok) {
      const data = await response.json();
      decrementApiCount();

      const extract = data.extract || `Information compiled for ${data.title}.`;
      const pageUrl = data.content_urls?.desktop?.page ||
        `https://en.wikipedia.org/wiki/${encodeURIComponent(queryWord.replace(/_/g, " "))}`;

      // Return HTML snippet that includes a source link
      return `${extract}<br><br><a href="${pageUrl}" target="_blank" rel="noopener" style="color:#60a5fa;font-size:0.85rem;">Source: Wikipedia — ${data.title || queryWord}</a>`;
    }
  } catch (e) {
    console.error("Server Fallback lookup error:", e);
  }

  decrementApiCount();
  return "No additional intelligence data available for this input.";
}
