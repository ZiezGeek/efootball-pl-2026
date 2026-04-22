// =============================================
//  FIXTURES.JS — Fixtures & Results Logic
// =============================================

import { db } from './firebase-config.js';
import { ref, get, set, update, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { TEAMS, generateFixtures, formatDate, formatTime, getTeamById } from './data.js';
import { getTeamLogo } from './logos.js';
import { showToast, setupAdminPin, hashPin } from './admin.js';

const ADMIN_PIN_HASH = hashPin("020707");
const fixturesRef = ref(db, 'fixtures');

let allFixtures = {};
let isAdmin = false;

// =============================================
//  INIT
// =============================================

async function init() {
  const snap = await get(fixturesRef);
  if (!snap.exists()) {
    const fixtures = generateFixtures();
    const obj = {};
    fixtures.forEach(f => { obj[f.id] = f; });
    await set(fixturesRef, obj);
  }

  // Check if redirected from admin unlock
  if (window.location.search.includes('admin=1')) {
    isAdmin = true;
    document.getElementById('openAdmin').textContent = '✅ Admin';
    document.getElementById('openAdmin').style.color = 'var(--green)';
    showToast('Admin mode active');
    populateMatchSelect();
  }
}

// =============================================
//  REAL-TIME LISTENER
// =============================================

onValue(fixturesRef, (snap) => {
  if (snap.exists()) {
    allFixtures = snap.val();
    window._renderFixtures = renderFixtures;
    renderFixtures();
    if (isAdmin) populateMatchSelect();
  }
});

// =============================================
//  RENDER FIXTURES
// =============================================

function renderFixtures() {
  const filter = window._fixtureFilter || 'all';
  const container = document.getElementById('fixturesContainer');
  let arr = Object.values(allFixtures);

  if (filter === 'played') arr = arr.filter(f => f.played);
  if (filter === 'upcoming') arr = arr.filter(f => !f.played);

  // Group by date
  const groups = {};
  arr.sort((a, b) => new Date(a.date) - new Date(b.date)).forEach(f => {
    const day = formatDate(f.date);
    if (!groups[day]) groups[day] = [];
    groups[day].push(f);
  });

  if (Object.keys(groups).length === 0) {
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

  const adminEdit = isAdmin
    ? `<div style="text-align:center;margin-top:4px;">
         <button class="btn btn-ghost" style="font-size:10px;padding:3px 10px;" onclick="openEditMatch('${f.id}')">✏ Edit</button>
       </div>` : '';

  return `
    <div class="match-card ${played ? 'played' : ''}">
      <div class="match-team home">
        ${getTeamLogo(home.id, 32)}
        <span>${home.name}</span>
      </div>
      <div class="match-score-area">
        ${scoreHtml}
        ${adminEdit}
      </div>
      <div class="match-team away">
        ${getTeamLogo(away.id, 32)}
        <span>${away.name}</span>
      </div>
    </div>`;
}

// =============================================
//  ADMIN: POPULATE SELECT
// =============================================

function populateMatchSelect() {
  const sel = document.getElementById('matchSelect');
  if (!sel) return;
  const arr = Object.values(allFixtures).sort((a, b) => new Date(a.date) - new Date(b.date));
  sel.innerHTML = `<option value="">— Select Match —</option>` +
    arr.map(f => {
      const h = getTeamById(f.homeTeam);
      const a = getTeamById(f.awayTeam);
      if (!h || !a) return '';
      const played = f.played ? `[${f.homeScore}–${f.awayScore}] ` : '';
      return `<option value="${f.id}">${played}${h.shortName} vs ${a.shortName} (${formatDate(f.date)})</option>`;
    }).join('');
}

// =============================================
//  ADMIN: OPEN EDIT SPECIFIC MATCH
// =============================================

window.openEditMatch = function(matchId) {
  const sel = document.getElementById('matchSelect');
  if (sel) sel.value = matchId;
  updateMatchInfo(matchId);
  document.getElementById('resultOverlay').classList.remove('hidden');
};

// =============================================
//  ADMIN: MATCH SELECT INFO
// =============================================

document.getElementById('matchSelect')?.addEventListener('change', function() {
  updateMatchInfo(this.value);
});

function updateMatchInfo(id) {
  const el = document.getElementById('matchInfo');
  const hs = document.getElementById('homeScore');
  const as = document.getElementById('awayScore');
  if (!id || !allFixtures[id]) {
    el.textContent = 'Select a match above';
    return;
  }
  const f = allFixtures[id];
  const h = getTeamById(f.homeTeam);
  const a = getTeamById(f.awayTeam);
  el.textContent = `${h?.name} vs ${a?.name} · ${formatDate(f.date)} ${formatTime(f.date)}`;
  if (f.played) {
    hs.value = f.homeScore;
    as.value = f.awayScore;
  } else {
    hs.value = '';
    as.value = '';
  }
}

// =============================================
//  SAVE RESULT
// =============================================

document.getElementById('saveResult')?.addEventListener('click', async () => {
  const id = document.getElementById('matchSelect').value;
  const hs = document.getElementById('homeScore').value;
  const as = document.getElementById('awayScore').value;

  if (!id) { showToast('Select a match first'); return; }
  if (hs === '' || as === '') { showToast('Enter both scores'); return; }

  await update(ref(db, `fixtures/${id}`), {
    homeScore: parseInt(hs),
    awayScore: parseInt(as),
    played: true
  });

  showToast('✅ Result saved!');
  document.getElementById('resultOverlay').classList.add('hidden');
});

// =============================================
//  CLEAR RESULT
// =============================================

document.getElementById('clearResult')?.addEventListener('click', async () => {
  const id = document.getElementById('matchSelect').value;
  if (!id) { showToast('Select a match first'); return; }

  await update(ref(db, `fixtures/${id}`), {
    homeScore: null,
    awayScore: null,
    played: false
  });

  showToast('Result cleared');
  document.getElementById('resultOverlay').classList.add('hidden');
});

document.getElementById('closeResult')?.addEventListener('click', () => {
  document.getElementById('resultOverlay').classList.add('hidden');
});

// =============================================
//  ADMIN PIN SETUP
// =============================================

setupAdminPin(ADMIN_PIN_HASH, () => {
  isAdmin = true;
  document.getElementById('openAdmin').textContent = '✅ Admin';
  document.getElementById('openAdmin').style.color = 'var(--green)';
  showToast('Admin mode active');
  populateMatchSelect();
  document.getElementById('resultOverlay').classList.remove('hidden');
});

// INIT
init().catch(console.error);
