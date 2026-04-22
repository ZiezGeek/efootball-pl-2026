// =============================================
//  TEAM LOGO SVG GENERATOR
//  Creates unique SVG crests for each team
// =============================================

const LOGOS = {
  ziezgeek: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">
    <defs>
      <linearGradient id="zg1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#001a2e"/>
        <stop offset="100%" style="stop-color:#003055"/>
      </linearGradient>
    </defs>
    <polygon points="30,3 55,15 55,45 30,57 5,45 5,15" fill="url(#zg1)" stroke="#00d4ff" stroke-width="2"/>
    <polygon points="30,8 51,19 51,42 30,53 9,42 9,19" fill="none" stroke="#00d4ff" stroke-width="0.5" opacity="0.4"/>
    <text x="30" y="26" text-anchor="middle" font-family="Bebas Neue,sans-serif" font-size="11" fill="#00d4ff" letter-spacing="1">ZG</text>
    <text x="30" y="38" text-anchor="middle" font-family="Bebas Neue,sans-serif" font-size="7" fill="#00d4ff" opacity="0.8" letter-spacing="2">FC</text>
    <circle cx="30" cy="14" r="4" fill="none" stroke="#00d4ff" stroke-width="1.5"/>
    <line x1="28" y1="14" x2="32" y2="14" stroke="#00d4ff" stroke-width="1"/>
    <line x1="30" y1="12" x2="30" y2="16" stroke="#00d4ff" stroke-width="1"/>
  </svg>`,

  strasbourg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">
    <defs>
      <linearGradient id="str1" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#0044aa"/>
        <stop offset="100%" style="stop-color:#002266"/>
      </linearGradient>
    </defs>
    <path d="M30,3 L55,12 L55,38 Q55,54 30,57 Q5,54 5,38 L5,12 Z" fill="url(#str1)" stroke="#ffffff" stroke-width="1.5"/>
    <rect x="5" y="12" width="50" height="6" fill="#ffffff" opacity="0.15"/>
    <text x="30" y="32" text-anchor="middle" font-family="Bebas Neue,sans-serif" font-size="10" fill="#ffffff" letter-spacing="1">RCS</text>
    <text x="30" y="44" text-anchor="middle" font-family="Bebas Neue,sans-serif" font-size="6.5" fill="#ffffff" opacity="0.8" letter-spacing="1.5">STRASBOURG</text>
    <polygon points="30,8 36,11 36,17 30,20 24,17 24,11" fill="none" stroke="#ffffff" stroke-width="1" opacity="0.6"/>
  </svg>`,

  intermilan: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">
    <defs>
      <linearGradient id="int1" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#0d0d0d"/>
        <stop offset="50%" style="stop-color:#0066cc"/>
        <stop offset="100%" style="stop-color:#0d0d0d"/>
      </linearGradient>
    </defs>
    <path d="M30,3 L57,15 L57,40 Q57,55 30,58 Q3,55 3,40 L3,15 Z" fill="url(#int1)" stroke="#0066cc" stroke-width="2"/>
    <line x1="20" y1="3" x2="20" y2="58" stroke="#0066cc" stroke-width="3" opacity="0.6"/>
    <line x1="30" y1="3" x2="30" y2="58" stroke="#0066cc" stroke-width="3" opacity="0.6"/>
    <line x1="40" y1="3" x2="40" y2="58" stroke="#0066cc" stroke-width="3" opacity="0.6"/>
    <text x="30" y="34" text-anchor="middle" font-family="Bebas Neue,sans-serif" font-size="13" fill="#ffffff" letter-spacing="2">INTER</text>
    <text x="30" y="45" text-anchor="middle" font-family="Bebas Neue,sans-serif" font-size="7" fill="#0099ff" letter-spacing="2">MILAN</text>
  </svg>`,

  barcelona: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">
    <defs>
      <linearGradient id="bar1" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#a50044"/>
        <stop offset="100%" style="stop-color:#004d98"/>
      </linearGradient>
    </defs>
    <path d="M30,3 L54,13 L54,40 Q54,55 30,58 Q6,55 6,40 L6,13 Z" fill="url(#bar1)" stroke="#ffd700" stroke-width="2"/>
    <rect x="6" y="13" width="48" height="8" fill="#ffd700" opacity="0.3"/>
    <text x="30" y="32" text-anchor="middle" font-family="Bebas Neue,sans-serif" font-size="9" fill="#ffd700" letter-spacing="1">FCB</text>
    <circle cx="30" cy="44" r="7" fill="none" stroke="#ffd700" stroke-width="1.5"/>
    <text x="30" y="47" text-anchor="middle" font-family="Bebas Neue,sans-serif" font-size="7" fill="#ffd700">✦</text>
  </svg>`,

  rotterdam: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">
    <defs>
      <linearGradient id="spr1" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#cc0000"/>
        <stop offset="100%" style="stop-color:#880000"/>
      </linearGradient>
    </defs>
    <path d="M30,3 L55,14 L55,42 Q55,56 30,58 Q5,56 5,42 L5,14 Z" fill="url(#spr1)" stroke="#ffffff" stroke-width="2"/>
    <path d="M30,3 L55,14 L55,31 L5,31 L5,14 Z" fill="#ffffff" opacity="0.12"/>
    <text x="30" y="28" text-anchor="middle" font-family="Bebas Neue,sans-serif" font-size="9" fill="#ffffff" letter-spacing="1">SPARTA</text>
    <text x="30" y="40" text-anchor="middle" font-family="Bebas Neue,sans-serif" font-size="7" fill="#ffcccc" letter-spacing="1">ROTTERDAM</text>
    <polygon points="30,46 33,51 28,51" fill="#ffffff" opacity="0.7"/>
  </svg>`,

  benfica: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">
    <defs>
      <linearGradient id="ben1" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#cc0000"/>
        <stop offset="100%" style="stop-color:#990000"/>
      </linearGradient>
    </defs>
    <circle cx="30" cy="30" r="27" fill="url(#ben1)" stroke="#ffffff" stroke-width="2"/>
    <circle cx="30" cy="30" r="22" fill="none" stroke="#ffffff" stroke-width="0.8" opacity="0.4"/>
    <text x="30" y="22" text-anchor="middle" font-family="sans-serif" font-size="14">🦅</text>
    <text x="30" y="36" text-anchor="middle" font-family="Bebas Neue,sans-serif" font-size="9" fill="#ffffff" letter-spacing="1">BENFICA</text>
    <text x="30" y="46" text-anchor="middle" font-family="Bebas Neue,sans-serif" font-size="6.5" fill="#ffaaaa" letter-spacing="2">SL</text>
  </svg>`,

  ndabezitha: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">
    <defs>
      <linearGradient id="nda1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#004400"/>
        <stop offset="100%" style="stop-color:#002200"/>
      </linearGradient>
    </defs>
    <path d="M30,3 L55,13 L55,42 Q55,56 30,58 Q5,56 5,42 L5,13 Z" fill="url(#nda1)" stroke="#ffcc00" stroke-width="2"/>
    <text x="30" y="21" text-anchor="middle" font-family="sans-serif" font-size="14">👑</text>
    <text x="30" y="34" text-anchor="middle" font-family="Bebas Neue,sans-serif" font-size="7.5" fill="#ffcc00" letter-spacing="1">NDABEZITHA</text>
    <text x="30" y="45" text-anchor="middle" font-family="Bebas Neue,sans-serif" font-size="7" fill="#ffcc00" opacity="0.8" letter-spacing="2">FC</text>
  </svg>`,

  psg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">
    <defs>
      <linearGradient id="psg1" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#004170"/>
        <stop offset="100%" style="stop-color:#002040"/>
      </linearGradient>
    </defs>
    <circle cx="30" cy="30" r="27" fill="url(#psg1)" stroke="#da020e" stroke-width="2"/>
    <circle cx="30" cy="30" r="20" fill="none" stroke="#ffffff" stroke-width="1" opacity="0.3"/>
    <text x="30" y="22" text-anchor="middle" font-family="sans-serif" font-size="12">🗼</text>
    <text x="30" y="36" text-anchor="middle" font-family="Bebas Neue,sans-serif" font-size="12" fill="#ffffff" letter-spacing="3">PSG</text>
    <rect x="15" y="38" width="30" height="2" fill="#da020e" opacity="0.8"/>
  </svg>`,

  dortmund: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">
    <defs>
      <linearGradient id="bvb1" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#fde100"/>
        <stop offset="100%" style="stop-color:#e6c800"/>
      </linearGradient>
    </defs>
    <path d="M30,3 L55,13 L55,43 Q55,57 30,58 Q5,57 5,43 L5,13 Z" fill="url(#bvb1)" stroke="#000000" stroke-width="2"/>
    <path d="M30,3 L55,13 L55,25 L5,25 L5,13 Z" fill="#000000" opacity="0.85"/>
    <text x="30" y="20" text-anchor="middle" font-family="Bebas Neue,sans-serif" font-size="10" fill="#fde100" letter-spacing="2">BVB</text>
    <text x="30" y="40" text-anchor="middle" font-family="Bebas Neue,sans-serif" font-size="7" fill="#000000" letter-spacing="1">DORTMUND</text>
  </svg>`,

  roma: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">
    <defs>
      <linearGradient id="rom1" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#8b0000"/>
        <stop offset="100%" style="stop-color:#5a0000"/>
      </linearGradient>
    </defs>
    <path d="M30,3 L55,13 L55,42 Q55,57 30,58 Q5,57 5,42 L5,13 Z" fill="url(#rom1)" stroke="#ffd700" stroke-width="2"/>
    <text x="30" y="22" text-anchor="middle" font-family="sans-serif" font-size="12">🐺</text>
    <text x="30" y="35" text-anchor="middle" font-family="Bebas Neue,sans-serif" font-size="11" fill="#ffd700" letter-spacing="2">ROMA</text>
    <text x="30" y="46" text-anchor="middle" font-family="Bebas Neue,sans-serif" font-size="7" fill="#ffcc66" letter-spacing="2">GR</text>
  </svg>`
};

export function getTeamLogo(teamId, size = 28) {
  const svg = LOGOS[teamId] || `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><circle cx="30" cy="30" r="27" fill="#1a2a3a" stroke="#c9a84c" stroke-width="2"/></svg>`;
  const encoded = btoa(unescape(encodeURIComponent(svg)));
  return `<img src="data:image/svg+xml;base64,${encoded}" width="${size}" height="${size}" style="border-radius:50%;object-fit:contain;" alt="logo"/>`;
}

export function getTeamLogoSVG(teamId) {
  return LOGOS[teamId] || '';
}
