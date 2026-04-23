// =============================================
//  TEAM.JS — Team Profile + Form Chart
// =============================================

import { db } from './firebase-config.js';
import { ref, get, set, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { TEAMS, generateFixtures, computeTable, formatDate, formatTime, getTeamById } from './data.js';
import { getTeamLogo, getTeamLogoSVG } from './logos.js';

const fixturesRef = ref(db, 'fixtures');
let allFixtures = {};
let currentTeamId = null;

// =============================================
//  INIT
// =============================================

async function init() {
  const sel = document.getElementById('teamSelect');
  sel.innerHTML = `<option value="">— Choose a Team —</option>` +
    TEAMS.map(t => `<option value="${t.id}">${t.name}</option>`).join('');

  sel.addEventListener('change', () => {
    currentTeamId = sel.value;
    if (currentTeamId) renderProfile(currentTeamId);
    else document.getElementById('profileContent').style.display = 'none';
  });

  // URL param
  const params = new URLSearchParams(window.location.search);
  const t = params.get('team');
  if (t) {
    sel.value = t;
    currentTeamId = t;
  }

  const snap = await get(fixturesRef);
  if (!snap.exists()) {
    const fx = generateFixtures();
    const obj = {};
    fx.forEach(f => { obj[f.id] = f; });
    await set(fixturesRef, obj);
  }
}

onValue(fixturesRef, (snap) => {
  if (snap.exists()) {
    allFixtures = snap.val();
    if (currentTeamId) renderProfile(currentTeamId);
  }
});

// =============================================
//  RENDER PROFILE
// =============================================

function renderProfile(teamId) {
  const team = getTeamById(teamId);
  if (!team) return;

  document.getElementById('profileContent').style.display = 'block';

  const allArr = Object.values(allFixtures);
  const allSorted = computeTable(TEAMS, allArr);
  const position = allSorted.findIndex(t => t.id === teamId) + 1;
  const stats = allSorted.find(t => t.id === teamId) || {};

  // Hero
  const hero = document.getElementById('teamHero');
  hero.style.setProperty('--hero-gradient',
    `linear-gradient(135deg, ${team.primaryColor}22, transparent 60%)`);
  hero.style.setProperty('--hero-accent', team.primaryColor);

  document.getElementById('heroLogo').innerHTML = getTeamLogo(teamId, 80);
  document.getElementById('heroName').textContent = team.name;
  document.getElementById('heroShort').textContent = team.shortName;
  document.getElementById('heroPosition').innerHTML =
    `${posEmoji(position)} ${ordinal(position)} place · ${stats.points || 0} pts`;

  // Key stats
  const gd = (stats.gd || 0);
  document.getElementById('ksP').textContent   = stats.played  || 0;
  document.getElementById('ksW').textContent   = stats.won     || 0;
  document.getElementById('ksD').textContent   = stats.drawn   || 0;
  document.getElementById('ksL').textContent   = stats.lost    || 0;
  document.getElementById('ksPts').textContent = stats.points  || 0;
  document.getElementById('ksGF').textContent  = stats.gf      || 0;
  document.getElementById('ksGA').textContent  = stats.ga      || 0;
  document.getElementById('ksGD').textContent  = (gd > 0 ? '+' : '') + gd;

  // Team's matches
  const teamMatches = allArr
    .filter(f => f.homeTeam === teamId || f.awayTeam === teamId)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const played   = teamMatches.filter(f => f.played);
  const upcoming = teamMatches.filter(f => !f.played).slice(0, 5);

  // Form chart
  renderFormChart(played, teamId, team);

  // Recent results (last 8)
  const recentEl = document.getElementById('recentResults');
  const recent = [...played].reverse().slice(0, 8);
  if (recent.length === 0) {
    recentEl.innerHTML = `<div class="no-data">No results yet.</div>`;
  } else {
    recentEl.innerHTML = recent.map(f => {
      const isHome  = f.homeTeam === teamId;
      const opp     = getTeamById(isHome ? f.awayTeam : f.homeTeam);
      const myScore = isHome ? f.homeScore : f.awayScore;
      const thScore = isHome ? f.awayScore : f.homeScore;
      const outcome = myScore > thScore ? 'W' : myScore < thScore ? 'L' : 'D';

      return `
        <div class="result-row">
          <div class="result-outcome ${outcome}">${outcome}</div>
          <div class="result-opponent">
            ${getTeamLogo(opp.id, 22)}
            ${opp.name}
            <span class="home-away-tag">${isHome ? 'H' : 'A'}</span>
          </div>
          <div class="result-score">${myScore} – ${thScore}</div>
          <div class="result-date">${formatDate(f.date)}</div>
        </div>`;
    }).join('');
  }

  // Upcoming
  const upcomingEl = document.getElementById('upcomingFixtures');
  if (upcoming.length === 0) {
    upcomingEl.innerHTML = `<div class="no-data">No upcoming matches.</div>`;
  } else {
    upcomingEl.innerHTML = upcoming.map(f => {
      const isHome = f.homeTeam === teamId;
      const opp    = getTeamById(isHome ? f.awayTeam : f.homeTeam);
      return `
        <div class="upcoming-row">
          <span class="home-away-tag">${isHome ? 'HOME' : 'AWAY'}</span>
          <div style="display:flex;align-items:center;gap:8px;font-family:var(--font-ui);font-weight:600;">
            ${getTeamLogo(opp.id, 22)} ${opp.name}
          </div>
          <span style="font-family:var(--font-ui);font-size:12px;color:var(--muted);">
            ${formatDate(f.date)} · ${formatTime(f.date)}
          </span>
        </div>`;
    }).join('');
  }

  // H2H links
  const h2hEl = document.getElementById('h2hLinks');
  h2hEl.innerHTML = TEAMS
    .filter(t => t.id !== teamId)
    .map(t => `
      <a class="h2h-link-btn" href="h2h.html?a=${teamId}&b=${t.id}">
        ${getTeamLogo(t.id, 18)} ${t.shortName}
      </a>`)
    .join('');
}

// =============================================
//  FORM CHART — SVG line graph
// =============================================

function renderFormChart(played, teamId, team) {
  const wrap = document.getElementById('chartWrap');
  const dotsRow = document.getElementById('formDots');

  if (played.length === 0) {
    wrap.innerHTML = `<div class="no-data">No matches played yet.</div>`;
    dotsRow.innerHTML = '';
    return;
  }

  // Build cumulative points array
  const points = [];
  let cumPts = 0;
  const matchLabels = [];
  const outcomes = [];

  played.forEach((f, i) => {
    const isHome  = f.homeTeam === teamId;
    const myScore = parseInt(isHome ? f.homeScore : f.awayScore);
    const thScore = parseInt(isHome ? f.awayScore : f.homeScore);
    const opp     = getTeamById(isHome ? f.awayTeam : f.homeTeam);

    let outcome = 'D';
    if (myScore > thScore)      { cumPts += 3; outcome = 'W'; }
    else if (myScore < thScore) { outcome = 'L'; }
    else                         { cumPts += 1; }

    points.push(cumPts);
    outcomes.push({ outcome, opp: opp?.shortName || '?', myScore, thScore });
    matchLabels.push(i + 1);
  });

  // SVG dimensions
  const W = Math.max(400, played.length * 48);
  const H = 180;
  const PAD = { top: 20, right: 24, bottom: 36, left: 40 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const maxPts = Math.max(...points, 3);
  const minPts = 0;

  const xScale = (i) => PAD.left + (i / (points.length - 1 || 1)) * chartW;
  const yScale = (v) => PAD.top + chartH - ((v - minPts) / (maxPts - minPts || 1)) * chartH;

  // Grid lines
  const gridCount = 4;
  const gridStep  = Math.ceil(maxPts / gridCount);
  let gridLines = '';
  for (let g = 0; g <= gridCount; g++) {
    const val = g * gridStep;
    const y   = yScale(Math.min(val, maxPts));
    gridLines += `
      <line x1="${PAD.left}" y1="${y}" x2="${W - PAD.right}" y2="${y}"
            stroke="#162840" stroke-width="1" stroke-dasharray="3,4"/>
      <text x="${PAD.left - 6}" y="${y + 4}" text-anchor="end"
            font-family="Rajdhani,sans-serif" font-size="10" fill="#8899aa">${val}</text>`;
  }

  // Path
  const pathD = points.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(v)}`).join(' ');

  // Area fill path
  const areaD = `${pathD} L ${xScale(points.length - 1)} ${yScale(0)} L ${xScale(0)} ${yScale(0)} Z`;

  // Data points
  let dotsSVG = '';
  points.forEach((v, i) => {
    const cx = xScale(i);
    const cy = yScale(v);
    const o  = outcomes[i];
    const fill = o.outcome === 'W' ? '#00e676' : o.outcome === 'L' ? '#ff4444' : '#ffd740';
    dotsSVG += `
      <circle cx="${cx}" cy="${cy}" r="6" fill="${fill}" stroke="#050e1a" stroke-width="2"/>
      <title>${o.opp} ${o.myScore}–${o.thScore} (${o.outcome})</title>`;
  });

  // X labels
  let xLabels = '';
  points.forEach((v, i) => {
    xLabels += `
      <text x="${xScale(i)}" y="${H - 6}" text-anchor="middle"
            font-family="Rajdhani,sans-serif" font-size="10" fill="#8899aa">M${i + 1}</text>`;
  });

  const accentColor = team.primaryColor || '#c9a84c';

  const svg = `
    <svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="${accentColor}" stop-opacity="0.01"/>
        </linearGradient>
      </defs>

      <!-- Grid -->
      ${gridLines}

      <!-- Area -->
      <path d="${areaD}" fill="url(#areaGrad)"/>

      <!-- Line -->
      <path d="${pathD}" fill="none" stroke="${accentColor}" stroke-width="2.5"
            stroke-linecap="round" stroke-linejoin="round"/>

      <!-- Dots -->
      ${dotsSVG}

      <!-- X labels -->
      ${xLabels}
    </svg>`;

  wrap.innerHTML = svg;

  // Form dots summary
  dotsRow.innerHTML = outcomes.map(o => {
    const fill = o.outcome === 'W' ? '#00e676' : o.outcome === 'L' ? '#ff4444' : '#ffd740';
    const txt  = o.outcome === 'W' ? '#000' : o.outcome === 'L' ? '#fff' : '#000';
    return `
      <div class="form-chip">
        <span class="badge ${o.outcome}">${o.outcome}</span>
        vs ${o.opp} (${o.myScore}–${o.thScore})
      </div>`;
  }).join('');
}

// =============================================
//  HELPERS
// =============================================

function ordinal(n) {
  const s = ['th','st','nd','rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function posEmoji(pos) {
  if (pos === 1) return '🥇';
  if (pos === 2) return '🥈';
  if (pos === 3) return '🥉';
  if (pos <= 4)  return '🏆';
  if (pos >= 8)  return '🔻';
  return '📍';
}

init().catch(console.error);
