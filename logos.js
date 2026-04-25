// =============================================
//  LOGOS.JS — Real Club Logo URLs
//  All 10 teams use real club crests from Wikimedia Commons
// =============================================

const LOGO_URLS = {
  barcelona:  "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg",
  psg:        "https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg",
  intermilan: "https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg",
  dortmund:   "https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg",
  roma:       "https://upload.wikimedia.org/wikipedia/en/f/f7/AS_Roma_logo_%282013%29.svg",
  benfica:    "https://upload.wikimedia.org/wikipedia/en/f/f2/SL_Benfica_logo.svg",
  strasbourg: "https://upload.wikimedia.org/wikipedia/en/9/9a/RC_Strasbourg_Alsace.svg",
  rotterdam:  "https://upload.wikimedia.org/wikipedia/en/5/5e/Sparta_Rotterdam_logo.svg",
  ziezgeek:   "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg",
  ndabezitha: "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg",
};

// =============================================
//  PUBLIC FUNCTIONS
// =============================================

export function getTeamLogo(teamId, size = 28) {
  const style = `width:${size}px;height:${size}px;object-fit:contain;border-radius:3px;vertical-align:middle;`;

  if (LOGO_URLS[teamId]) {
    return `<img src="${LOGO_URLS[teamId]}" style="${style}" alt="${teamId}" onerror="this.src=window._fallbackLogo()" crossorigin="anonymous"/>`;
  }

  return `<span style="display:inline-flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;border-radius:50%;background:#0f2040;border:1px solid #c9a84c;font-size:${Math.floor(size*0.45)}px;">⚽</span>`;
}

export function getTeamLogoSVG(teamId) {
  return null; // All logos now use URLs — no inline SVGs needed
}

export function getTeamLogoURL(teamId) {
  return LOGO_URLS[teamId] || null;
}

// Global fallback for broken image loads
window._fallbackLogo = () => `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'><circle cx='30' cy='30' r='28' fill='%230f2040' stroke='%23c9a84c' stroke-width='2'/><text x='30' y='36' text-anchor='middle' font-size='20' fill='%23c9a84c'>⚽</text></svg>`;
