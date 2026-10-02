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

  // Render Local Matches
  if (Object.keys(matches).length > 0) {
    let matchHTML = `<strong>Known Excipients Detected:</strong><ul style="margin: 8px 0 0 20px; padding: 0;">`;
    for (const [ing, desc] of Object.entries(matches)) {
      matchHTML += `<li><strong>${ing}:</strong> ${desc}</li>`;
    }
    matchHTML += `</ul>`;
    container.innerHTML += `<div class="card success">${matchHTML}</div>`;
  } else {
    container.innerHTML += `<div class="card">No known excipients found in local dictionary.</div>`;
  }

  // Render Intelligence Layer Output
  container.innerHTML += `<div class="card"><strong>Intelligence Layer Output:</strong><br><br>${deciphered}</div>`;
}

export function renderFallbackUI(message) {
  const container = document.getElementById("output-container");
  container.innerHTML = `<div class="card error"><strong>Error:</strong> ${message}</div>`;
}

export function updateApiBadge(count) {
  const badge = document.getElementById("api-counter");
  if (badge) badge.textContent = `API: ${count}/1000`;
}
