export function updateUIState(stateType) {
  const orb = document.getElementById("status-orb");
  if (!orb) return;
  
  switch (stateType) {
    case "THINKING_ORB_ACTIVE":
      orb.style.animation = "pulse 0.5s infinite alternate";
      orb.style.background = "var(--neon-purple)";
      break;
    case "SUCCESS_ORB_ACTIVE":
      orb.style.animation = "none";
      orb.style.background = "var(--neon-green)";
      break;
    case "ERROR_ORB_ACTIVE":
      orb.style.animation = "none";
      orb.style.background = "var(--neon-red)";
      break;
    default:
      orb.style.animation = "none";
      orb.style.background = "var(--neutral-blue)";
  }
}

export function renderOutputCards(matches, deciphered) {
  const container = document.getElementById("output-container");
  container.innerHTML = "";

  // Render Local Matches with rich biochemical badges
  if (Object.keys(matches).length > 0) {
    let matchHTML = `<div style="font-weight: bold; margin-bottom: 0.75rem; font-size: 1.05rem;">🔬 Biochemical Matrix Profile</div>`;
    
    for (const [ing, d] of Object.entries(matches)) {
      matchHTML += `
      <div style="background: #252525; padding: 12px; border-radius: 6px; margin-bottom: 10px; border: 1px solid #333;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <span style="font-size: 1rem; font-weight: bold; color: var(--text-main); text-transform: capitalize;">${ing}</span>
          <span style="font-size: 0.7rem; font-family: monospace; background: #111; color: var(--neon-green); padding: 2px 6px; border-radius: 4px; border: 1px solid #222;">
            ${d.category || 'Excipient / Compound'}
          </span>
        </div>
        
        <p style="margin: 0 0 8px 0; font-size: 0.85rem; color: #bbb; line-height: 1.4;">${d.description || d}</p>
        
        <div style="display: grid; grid-template-columns: 1fr; gap: 4px; font-size: 0.75rem; font-family: monospace; color: #888;">
          <div><strong style="color: #60a5fa;">💧 Solubility:</strong> ${d.solubility || 'Not specified'}</div>
          <div><strong style="color: #34d399;">⚡ Bioavailability:</strong> ${d.bioavailability || 'Standard'}</div>
          <div><strong style="color: #fbbf24;">🍽️ Absorption Protocol:</strong> ${d.absorption || 'Standard oral administration'}</div>
        </div>
      </div>`;
    }
    container.innerHTML += `<div class="card success">${matchHTML}</div>`;
  } else {
    container.innerHTML += `<div class="card">No known excipients found in local dictionary.</div>`;
  }

  // Render Intelligence Layer Output
  if (deciphered) {
    container.innerHTML += `<div class="card"><strong>Intelligence Layer Output:</strong><br><br>${deciphered}</div>`;
  }
}

export function renderFallbackUI(message) {
  const container = document.getElementById("output-container");
  container.innerHTML = `<div class="card error"><strong>Error:</strong> ${message}</div>`;
}

export function updateApiBadge(count) {
  const badge = document.getElementById("api-counter");
  if (badge) badge.textContent = `API: ${count}/1000`;
}
