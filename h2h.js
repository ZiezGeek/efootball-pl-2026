// =============================================
//  H2H.JS — Head to Head Stats Logic
// =============================================

import { db } from './firebase-config.js';
import { ref, get, set, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { TEAMS, generateFixtures, formatDate, formatTime, getTeamById } from './data.js';
import { getTeamLogo, getTeamLogoSVG } from './logos.js';

const fixturesRef = ref(db, 'fixtures');
let allFixtures = {};

// =============================================
//  POPULATE SELECTS
// =============================================

function populateSelects() {
  const selA = document.getElementById('teamA');
  const selB = document.getElementById('teamB');
  const opts = TEAMS.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
  selA.innerHTML = `<option value="">— Select Team —</option>` + opts;
  selB.innerHTML = `<option value="">— Select Team —</option>` + opts;
}

// =============================================
//  LOGO PREVIEW ON SELECT
// =============================================

function svgToDataUrl(svgStr) {
  const encoded = btoa(unescape(encodeURIComponent(svgStr)));
  return `data:image/svg+xml;base64,${encoded}`;
}

function onTeamSelect(selectId, logoId) {
  const sel = document.getElementById(selectId);
  const logoEl = document.getElementById(logoId);
  sel.addEventListener('change', () => {
    const id = sel.value;
    if (id) {
      const svg = getTeamLogoSVG(id);
      if (svg) {
        logoEl.src = svgToDataUrl(svg);
        logoEl.style.display = 'block';
      }
    } else {
      logoEl.style.display = 'none';
    }
    tryRenderH2H();
  });
}

// =============================================
//  INIT
// =============================================

async function init() {
  populateSelects();
  onTeamSelect('teamA', 'logoA');
  onTeamSelect('teamB', 'logoB');

  // Pre-select from URL params if present
  const params = new URLSearchParams(window.location.search);
  const pA = params.get('a');
  const pB = params.get('b');
  if (pA) document.getElementById('teamA').value = pA;
  if (pB) document.getElementById('teamB').value = pB;

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
    tryRenderH2H();
  }
});

// =============================================
//  RENDER H2H
// =============================================

function tryRenderH2H() {
  const idA = document.getElementById('teamA').value;
  const idB = document.getElementById('teamB').value;
  const summary = document.getElementById('h2hSummary');

  if (!idA || !idB || idA === idB) {
    summary.classList.remove('visible');
    return;
  }

  summary.classList.add('visible');
  renderH2H(idA, idB);
}

function renderH2H(idA, idB) {
  const teamA = getTeamById(idA);
  const teamB = getTeamById(idB);
  if (!teamA || !teamB) return;

  const allArr = Object.values(allFixtures);

  // H2H matches between the two teams
  const h2hMatches = allArr.filter(f =>
    (f.homeTeam === idA && f.awayTeam === idB) ||
    (f.homeTeam === idB && f.awayTeam === idA)
  );

  const played   = h2hMatches.filter(f => f.played);
  const upcoming = h2hMatches.filter(f => !f.played).sort((a, b) => new Date(a.date) - new Date(b.date));

  // Compute stats
  let winsA = 0, winsB = 0, draws = 0;
  let goalsA = 0, goalsB = 0;

  played.forEach(f => {
    const hs = parseInt(f.homeScore);
    const as = parseInt(f.awayScore);
    const isHomeA = f.homeTeam === idA;

    const gA = isHomeA ? hs : as;
    const gB = isHomeA ? as : hs;

    goalsA += gA;
    goalsB += gB;

    if (gA > gB) winsA++;
    else if (gB > gA) winsB++;
    else draws++;
  });

  const totalPlayed = played.length;
  const totalGoals  = goalsA + goalsB;
  const avgGoals    = totalPlayed > 0 ? (totalGoals / totalPlayed).toFixed(1) : '0.0';

  // Banner
  document.getElementById('bannerLogoA').innerHTML = getTeamLogo(idA, 60);
  document.getElementById('bannerLogoB').innerHTML = getTeamLogo(idB, 60);
  document.getElementById('bannerNameA').textContent = teamA.name;
  document.getElementById('bannerNameB').textContent = teamB.name;
  document.getElementById('winsA').textContent  = winsA;
  document.getElementById('winsB').textContent  = winsB;
  document.getElementById('drawsC').textContent = draws;
  document.getElementById('totalMatchesPlayed').textContent =
    `${totalPlayed} match${totalPlayed !== 1 ? 'es' : ''} played`;

  // Win bar
  const total = totalPlayed || 1;
  const pctA  = Math.round((winsA / total) * 100);
  const pctD  = Math.round((draws  / total) * 100);
  const pctB  = 100 - pctA - pctD;

  document.getElementById('barHome').style.width  = pctA + '%';
  document.getElementById('barDraw').style.width  = pctD + '%';
  document.getElementById('barAway').style.width  = Math.max(pctB, 0) + '%';
  document.getElementById('barLabelA').textContent = `${teamA.shortName} ${pctA}%`;
  document.getElementById('barLabelB').textContent = `${pctB}% ${teamB.shortName}`;

  // Stats
  document.getElementById('statTotalGoals').textContent  = totalGoals;
  document.getElementById('statAvgGoals').textContent    = avgGoals;
  document.getElementById('statGoalsA').textContent      = goalsA;
  document.getElementById('statGoalsB').textContent      = goalsB;
  document.getElementById('statGoalsALabel').textContent = `${teamA.shortName} Goals`;
  document.getElementById('statGoalsBLabel').textContent = `${teamB.shortName} Goals`;

  // Upcoming
  const upcomingSection = document.getElementById('upcomingSection');
  const upcomingContainer = document.getElementById('upcomingMatches');
  if (upcoming.length > 0) {
    upcomingSection.style.display = 'block';
    upcomingContainer.innerHTML = upcoming.map(f => {
      const isHomeA = f.homeTeam === idA;
      const homeT = isHomeA ? teamA : teamB;
      const awayT = isHomeA ? teamB : teamA;
      return `
        <div class="upcoming-badge">
          <span>${getTeamLogo(homeT.id, 22)} ${homeT.shortName}</span>
          <span style="font-family:var(--font-display);color:var(--gold);font-size:18px;">VS</span>
          <span>${awayT.shortName} ${getTeamLogo(awayT.id, 22)}</span>
          <span style="color:var(--muted);font-size:12px;">${formatDate(f.date)} · ${formatTime(f.date)}</span>
        </div>`;
    }).join('');
  } else {
    upcomingSection.style.display = 'none';
  }

  // Match history
  const historyEl = document.getElementById('matchHistory');
  const sortedPlayed = [...played].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (sortedPlayed.length === 0) {
    historyEl.innerHTML = `<div class="no-results">No played matches yet between these teams.</div>`;
    return;
  }

  historyEl.innerHTML = sortedPlayed.map(f => {
    const hs = parseInt(f.homeScore);
    const as = parseInt(f.awayScore);
    const isHomeA = f.homeTeam === idA;
    const homeT  = isHomeA ? teamA : teamB;
    const awayT  = isHomeA ? teamB : teamA;

    let rowClass = 'draw';
    if (hs > as) rowClass = isHomeA ? 'home-win' : 'away-win';
    else if (as > hs) rowClass = isHomeA ? 'away-win' : 'home-win';

    return `
      <div class="h2h-match ${rowClass}">
        <div class="h2h-match-team">
          ${getTeamLogo(homeT.id, 26)}
          <span>${homeT.name}</span>
        </div>
        <div>
          <div class="h2h-score">${hs} – ${as}</div>
          <div class="h2h-match-date">${formatDate(f.date)}</div>
        </div>
        <div class="h2h-match-team away">
          ${getTeamLogo(awayT.id, 26)}
          <span>${awayT.name}</span>
        </div>
      </div>`;
  }).join('');
}

init().catch(console.error);
