import { fillerDictionary } from './dictionary.js';
import { init3DEngine, update3DGraph, meshNodeRefs } from './engine3d.js';

let activeFilter = 'all';

function runMatrixAnalysis() {
    const input = document.getElementById('ingredient-input').value.toLowerCase();
    const cardsList = document.getElementById('cards-list');
    const resultsDeck = document.getElementById('results-deck');
    const hudStatus = document.getElementById('hud-status');
    cardsList.innerHTML = '';
    let matchedData = [];
    
    Object.keys(fillerDictionary).forEach(key => {
        if (input.includes(key)) {
            matchedData.push(fillerDictionary[key]);
        }
    });
    
    update3DGraph(matchedData);
    
    const filteredData = matchedData.filter(item => {
        if (activeFilter === 'scrutinized') return item.safety.includes("Scrutinized");
        return true;
    });
    
    if (matchedData.length > 0) {
        hudStatus.textContent = `PARSED SUCCESS // ${matchedData.length} NODES COMPILED`;
        resultsDeck.style.display = 'block';
    } else {
        hudStatus.textContent = "SYSTEM EMPTY // 0 NODES MATCHED";
        resultsDeck.style.display = 'block';
        cardsList.innerHTML = '<div style="text-align: center; padding: 2rem; border: 1px dashed #334155; border-radius: 0.75rem;"><p style="font-size: 0.75rem; color: #64748b;">No known ingredient matrices compiled. Click \'Save Favorites\' to test components.</p></div>';
        return;
    }
    
    filteredData.forEach(item => {
        const card = document.createElement('div');
        card.style.backgroundColor = '#020617';
        card.style.border = '1px solid #1e293b';
        card.style.padding = '1rem';
        card.style.borderRadius = '0.75rem';
        card.style.marginBottom = '0.75rem';
        card.style.cursor = 'pointer';
        
        let tagColor = "#34d399";
        let tagBg = "rgba(6, 78, 59, 0.4)";
        if (item.safety.includes("Scrutinized")) { 
            tagColor = "#fbbf24"; tagBg = "rgba(120, 53, 4, 0.4)"; 
        } else if (item.safety.includes("Animal")) { 
            tagColor = "#f43f5e"; tagBg = "rgba(159, 18, 57, 0.4)"; 
        }
        
        card.innerHTML = `<div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem;">
            <div>
                <h4 style="font-weight: 700; font-size: 0.75rem; color: #f8fafc; display: flex; align-items: center; gap: 0.5rem;">
                    <span style="width: 0.5rem; height: 0.5rem; border-radius: 999px; background-color: #${item.color.toString(16).padStart(6, '0')}"></span>
                    ${item.name}
                </h4>
                <p style="font-size: 10px; color: #94a3b8; font-family: monospace; margin: 2px 0 0 0;">${item.class}</p>
            </div>
            <span style="font-size: 9px; font-family: monospace; padding: 2px 6px; border-radius: 999px; border: 1px solid ${tagColor}; color: ${tagColor}; background-color: ${tagBg};">
                ${item.safety}
            </span>
        </div>
        <p style="font-size: 11px; color: #94a3b8; line-height: 1.5; margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px solid #0f172a;">
            ${item.function}
        </p>`;
        
        card.addEventListener('click', () => {
            const inspector = document.getElementById('node-inspector');
            inspector.style.display = 'flex';
            const nameSpan = document.getElementById('inspector-name');
            nameSpan.textContent = item.name;
            nameSpan.style.color = "#" + item.color.toString(16).padStart(6, "0");
            const targetNode = meshNodeRefs.find(n => n.name === item.name);
            if (targetNode) {
                targetNode.mesh.scale.set(1.8, 1.8, 1.8);
                setTimeout(() => targetNode.mesh.scale.set(1, 1, 1), 600);
            }
        });
        cardsList.appendChild(card);
    });
}

function updateFilterTabs(activeBtn) {
    ['filter-all', 'filter-scrutinized'].forEach(id => {
        const btn = document.getElementById(id);
        if(btn) {
            btn.style.color = '#64748b'; btn.style.borderColor = '#1e293b'; btn.style.backgroundColor = '#0f172a';
        }
    });
    activeBtn.style.color = '#22d3ee'; activeBtn.style.borderColor = '#0891b2'; activeBtn.style.backgroundColor = 'rgba(8, 145, 178, 0.2)';
}

window.addEventListener('DOMContentLoaded', () => {
    init3DEngine();
    
    document.getElementById('analyze-btn').addEventListener('click', runMatrixAnalysis);
    document.getElementById('demo-btn').addEventListener('click', () => {
        document.getElementById('ingredient-input').value = "Microcrystalline Cellulose, Gelatin, Titanium Dioxide, Magnesium Stearate, Silicon Dioxide, Croscarmellose Sodium";
        runMatrixAnalysis();
    });
    document.getElementById('filter-all').addEventListener('click', (e) => { activeFilter = 'all'; updateFilterTabs(e.target); runMatrixAnalysis(); });
    document.getElementById('filter-scrutinized').addEventListener('click', (e) => { activeFilter = 'scrutinized'; updateFilterTabs(e.target); runMatrixAnalysis(); });
});
