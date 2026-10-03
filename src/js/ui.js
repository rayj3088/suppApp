export function updateUIState(stateType) {
  const orb = document.getElementById("status-orb");
  if (!orb) return;
  const map = {
    THINKING_ORB_ACTIVE: { anim: "pulse 0.5s infinite alternate", bg: "var(--neon-purple)" },
    SUCCESS_ORB_ACTIVE:  { anim: "none", bg: "var(--neon-green)" },
    ERROR_ORB_ACTIVE:    { anim: "none", bg: "var(--neon-red)" }
  };
  const s = map[stateType] || { anim: "none", bg: "var(--neutral-blue)" };
  orb.style.animation = s.anim;
  orb.style.background = s.bg;
}

function concernBadge(level) {
  if (!level || level === "low") return "";
  const styles = {
    moderate: { bg: "#422006", color: "#fbbf24", label: "MODERATE" },
    watched:  { bg: "#450a0a", color: "#f87171", label: "WATCHED" }
  };
  const c = styles[level];
  if (!c) return "";
  return `<span style="font-size:0.65rem;font-family:monospace;background:${c.bg};color:${c.color};padding:2px 6px;border-radius:4px;border:1px solid #333;margin-left:6px;">${c.label}</span>`;
}

export function renderOutputCards(matches, deciphered, quickTake, comparisons = []) {
  const container = document.getElementById("output-container");
  if (!container) return;
  container.innerHTML = "";

  // ── Quick Take ──
  if (quickTake) {
    container.innerHTML += `
      <div class="card" style="border-left-color: var(--neon-green);">
        <div style="font-weight:700;margin-bottom:0.5rem;font-size:1.05rem;">⚡ Quick Take</div>
        <p style="margin:0;font-size:0.95rem;line-height:1.55;color:#ddd;">${quickTake}</p>
      </div>`;
  }

  // ── Form Comparison Tables (only when relevant) ──
  for (const table of comparisons) {
    let rows = table.rows.map(r => `
      <tr>
        <td style="padding:6px 8px;border-bottom:1px solid #333;font-weight:600;text-transform:capitalize;">${r.name}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #333;font-family:monospace;font-size:0.85rem;">${r.elemental}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #333;font-size:0.85rem;">${r.absorption}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #333;font-size:0.85rem;color:#aaa;">${r.notes}</td>
      </tr>`).join("");

    container.innerHTML += `
      <div class="card" style="border-left-color:#60a5fa;">
        <div style="font-weight:700;margin-bottom:0.75rem;font-size:1.05rem;">
          📊 ${table.mineral.charAt(0).toUpperCase() + table.mineral.slice(1)} Form Comparison
        </div>
        <div style="overflow-x:auto;">
          <table style="width:100%;border-collapse:collapse;font-size:0.9rem;">
            <thead>
              <tr style="color:#888;font-size:0.75rem;text-align:left;">
                <th style="padding:4px 8px;">Form</th>
                <th style="padding:4px 8px;">Elemental</th>
                <th style="padding:4px 8px;">Absorption</th>
                <th style="padding:4px 8px;">Notes</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>`;
  }

  // ── Ingredient Cards ──
  if (Object.keys(matches).length > 0) {
    let html = `<div style="font-weight:700;margin-bottom:0.75rem;font-size:1.05rem;">🔬 Ingredient Detail</div>`;

    for (const [ing, d] of Object.entries(matches)) {
      html += `
      <div style="background:#252525;padding:12px;border-radius:6px;margin-bottom:10px;border:1px solid #333;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;flex-wrap:wrap;gap:4px;">
          <span style="font-size:1rem;font-weight:700;color:var(--text-main);text-transform:capitalize;">
            ${ing}${concernBadge(d.concern)}
          </span>
          <span style="font-size:0.7rem;font-family:monospace;background:#111;color:var(--neon-green);padding:2px 6px;border-radius:4px;border:1px solid #222;">
            ${d.category}
          </span>
        </div>
        <p style="margin:0 0 8px 0;font-size:0.85rem;color:#bbb;line-height:1.4;">${d.description}</p>
        <div style="display:grid;grid-template-columns:1fr;gap:3px;font-size:0.75rem;font-family:monospace;color:#888;">
          ${d.elemental ? `<div><strong style="color:#a78bfa;">Elemental:</strong> ${d.elemental}</div>` : ""}
          <div><strong style="color:#60a5fa;">Solubility:</strong> ${d.solubility}</div>
          <div><strong style="color:#34d399;">Bioavailability:</strong> ${d.bioavailability}</div>
          <div><strong style="color:#fbbf24;">Absorption:</strong> ${d.absorption}</div>
        </div>
      </div>`;
    }
    container.innerHTML += `<div class="card success">${html}</div>`;
  } else {
    container.innerHTML += `<div class="card">No known ingredients matched the local dictionary.</div>`;
  }

  // ── Intelligence Layer ──
  if (deciphered) {
    container.innerHTML += `
      <div class="card">
        <strong>Intelligence Layer</strong><br><br>
        ${deciphered}
      </div>`;
  }
}

export function renderFallbackUI(message) {
  const container = document.getElementById("output-container");
  if (container) {
    container.innerHTML = `<div class="card error"><strong>Error:</strong> ${message}</div>`;
  }
}

export function updateApiBadge(count) {
  const badge = document.getElementById("api-counter");
  if (badge) badge.textContent = `API: ${count}/1000`;
}
