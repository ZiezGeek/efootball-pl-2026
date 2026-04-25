// =============================================
//  LOGOS.JS — All 10 teams use Sofascore CDN
//  Format: https://api.sofascore.app/api/v1/team/{ID}/image
//  This CDN is reliable, never blocks hotlinking,
//  and serves high-quality PNG badges.
// =============================================

// Sofascore team IDs — confirmed from sofascore.com URLs
const SOFASCORE_IDS = {
  ziezgeek:   42,    // Arsenal FC
  ndabezitha: 2829,  // Real Madrid
  barcelona:  2817,  // FC Barcelona
  psg:        1644,  // Paris Saint-Germain
  intermilan: 2697,  // Inter Milan
  dortmund:   2673,  // Borussia Dortmund
  roma:       2702,  // AS Roma
  benfica:    3006,  // SL Benfica
  strasbourg: 1659,  // RC Strasbourg
  rotterdam:  2960,  // Sparta Rotterdam
};

const CDN = (id) => `https://api.sofascore.app/api/v1/team/${id}/image`;

// =============================================
//  PUBLIC FUNCTIONS
// =============================================

export function getTeamLogo(teamId, size = 28) {
  const id = SOFASCORE_IDS[teamId];
  const src = id ? CDN(id) : null;
  const style = `width:${size}px;height:${size}px;object-fit:contain;vertical-align:middle;border-radius:3px;`;

  if (src) {
    return `<img src="${src}" style="${style}" alt="${teamId}" onerror="this.src=window._fallbackLogo()"/>`;
  }

  return `<span style="display:inline-flex;align-items:center;justify-content:center;
    width:${size}px;height:${size}px;border-radius:50%;
    background:#0f2040;border:1px solid #c9a84c;
    font-size:${Math.floor(size*0.45)}px;">⚽</span>`;
}

export function getTeamLogoSVG(teamId) {
  return null; // All logos now from CDN
}

export function getTeamLogoURL(teamId) {
  const id = SOFASCORE_IDS[teamId];
  return id ? CDN(id) : null;
}

// Fallback for broken images
window._fallbackLogo = () =>
  `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'><circle cx='30' cy='30' r='28' fill='%230f2040' stroke='%23c9a84c' stroke-width='2'/><text x='30' y='36' text-anchor='middle' font-size='20' fill='%23c9a84c'>⚽</text></svg>`;
