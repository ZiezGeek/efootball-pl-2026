// =============================================
//  FIXTURES-PUBLIC.JS — Read-only view
//  No admin functionality. Clean for all users.
// =============================================

import { db } from './firebase-config.js';
import { ref, get, set, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { TEAMS, generateFixtures, formatDate, formatTime, getTeamById } from './data.js';
import { getTeamLogo } from './logos.js';

const fixturesRef = ref(db, 'fixtures');
let allFixtures = {};

// Seed fixtures if first time
async function init() {
  const snap = await get(fixturesRef);
  if (!snap.exists()) {
    const fx = generateFixtures();
    const obj = {};
    fx.forEach(f => { obj[f.id] = f; });
    await set(fixturesRef, obj);
  }
}

// Live updates
onValue(fixturesRef, (snap) => {
  if (snap.exists()) {
    allFixtures = snap.val();
    window._renderFixtures = renderFixtures;
    renderFixtures();
  }
});

function renderFixtures() {
  const filter = window._fixtureFilter || 'all';
  const container = document.getElementById('fixturesContainer');
  let arr = Object.values(allFixtures);

  if (filter === 'played')   arr = arr.filter(f => f.played);
  if (filter === 'upcoming') arr = arr.filter(f => !f.played);

  arr.sort((a, b) => new Date(a.date) - new Date(b.date));

  const groups = {};
  arr.forEach(f => {
    const day = formatDate(f.date);
    if (!groups[day]) groups[day] = [];
    groups[day].push(f);
  });

  if (arr.length === 0) {
    container.innerHTML = `<div class="loading">No matches found.</div>`;
    return;
  }

  container.innerHTML = Object.entries(groups).map(([day, matches]) => `
    <div class="day-group">
      <div class="day-label">${day}</div>
      ${matches.map(renderMatchCard).join('')}
    </div>
  `).join('');
}

function renderMatchCard(f) {
  const home = getTeamById(f.homeTeam);
  const away = getTeamById(f.awayTeam);
  if (!home || !away) return '';

  const played = f.played && f.homeScore !== null;
  const scoreHtml = played
    ? `<div class="score-display">${f.homeScore} – ${f.awayScore}</div>
       <div class="match-status status-played">FT</div>`
    : `<div class="match-time">${formatTime(f.date)}</div>
       <div class="match-status status-upcoming">Upcoming</div>`;

  return `
    <div class="match-card ${played ? 'played' : ''}">
      <div class="match-team home">
        ${getTeamLogo(home.id, 32)}
        <span>${home.name}</span>
      </div>
      <div class="match-score-area">${scoreHtml}</div>
      <div class="match-team away">
        ${getTeamLogo(away.id, 32)}
        <span>${away.name}</span>
      </div>
    </div>`;
}

init().catch(console.error);
