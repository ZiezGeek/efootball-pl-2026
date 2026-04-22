// =============================================
//  TABLE.JS — League Table Logic
// =============================================

import { db } from './firebase-config.js';
import { ref, get, set, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { TEAMS, generateFixtures, computeTable, getTeamById } from './data.js';
import { getTeamLogo } from './logos.js';
import { showToast, setupAdminPin, hashPin } from './admin.js';

const ADMIN_PIN_HASH = hashPin("020707");
const fixturesRef = ref(db, 'fixtures');
const tableBody = document.getElementById('tableBody');

// =============================================
//  INITIALISE: seed fixtures if first time
// =============================================

async function init() {
  const snap = await get(fixturesRef);
  if (!snap.exists()) {
    const fixtures = generateFixtures();
    const obj = {};
    fixtures.forEach(f => { obj[f.id] = f; });
    await set(fixturesRef, obj);
    console.log('Fixtures seeded to Firebase.');
  }
}

// =============================================
//  RENDER TABLE
// =============================================

function renderTable(fixtures) {
  const arr = Object.values(fixtures);
  const sorted = computeTable(TEAMS, arr);

  let played = 0, goals = 0, remaining = 0;
  arr.forEach(f => {
    if (f.played) { played++; goals += (parseInt(f.homeScore)||0) + (parseInt(f.awayScore)||0); }
    else { remaining++; }
  });

  document.getElementById('statMatches').textContent = played;
  document.getElementById('statGoals').textContent = goals;
  document.getElementById('statFixtures').textContent = remaining;

  // Compute form per team
  const form = {};
  TEAMS.forEach(t => { form[t.id] = []; });
  const playedMatches = arr.filter(f => f.played)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  playedMatches.forEach(f => {
    const hs = parseInt(f.homeScore), as = parseInt(f.awayScore);
    const addForm = (tid, result) => {
      if (!form[tid]) form[tid] = [];
      if (form[tid].length < 5) form[tid].push(result);
    };
    if (hs > as) { addForm(f.homeTeam, 'W'); addForm(f.awayTeam, 'L'); }
    else if (hs < as) { addForm(f.homeTeam, 'L'); addForm(f.awayTeam, 'W'); }
    else { addForm(f.homeTeam, 'D'); addForm(f.awayTeam, 'D'); }
  });

  tableBody.innerHTML = sorted.map((team, i) => {
    const pos = i + 1;
    const rowClass = pos <= 4 ? 'top-4' : pos >= 8 ? 'relegation' : '';
    const gdStr = team.gd > 0 ? `+${team.gd}` : `${team.gd}`;
    const gdClass = team.gd > 0 ? 'gd-pos' : team.gd < 0 ? 'gd-neg' : '';
    const formHtml = (form[team.id] || []).reverse().map(r =>
      `<div class="form-badge ${r}">${r}</div>`
    ).join('');

    return `
      <tr class="${rowClass}">
        <td>${pos}</td>
        <td>
          <div class="team-cell">
            <div class="team-logo-sm">${getTeamLogo(team.id, 28)}</div>
            <span class="team-name-full">${team.name}</span>
            <span class="team-name-short">${team.shortName}</span>
          </div>
        </td>
        <td>${team.played}</td>
        <td>${team.won}</td>
        <td>${team.drawn}</td>
        <td>${team.lost}</td>
        <td>${team.gf}</td>
        <td>${team.ga}</td>
        <td class="${gdClass}">${gdStr}</td>
        <td class="pts-cell">${team.points}</td>
        <td><div class="form-badges">${formHtml}</div></td>
      </tr>`;
  }).join('');
}

// =============================================
//  REAL-TIME LISTENER
// =============================================

onValue(fixturesRef, (snap) => {
  if (snap.exists()) {
    renderTable(snap.val());
  }
});

// =============================================
//  ADMIN PIN SETUP
// =============================================

setupAdminPin(ADMIN_PIN_HASH, () => {
  // On unlock: redirect to fixtures page (admin is there)
  window.location.href = 'fixtures.html?admin=1';
});

// INIT
init().catch(console.error);
