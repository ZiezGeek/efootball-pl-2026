// =============================================
//  TEAMS & FIXTURES DATA
// =============================================

export const TEAMS = [
  {
    id: "ziezgeek",
    name: "ZiezGeek FC",
    shortName: "ZGK",
    primaryColor: "#00d4ff",
    secondaryColor: "#001a2e",
    emoji: "🔵"
  },
  {
    id: "strasbourg",
    name: "RC Strasbourg",
    shortName: "STR",
    primaryColor: "#005baa",
    secondaryColor: "#ffffff",
    emoji: "🔵"
  },
  {
    id: "intermilan",
    name: "Inter Milan",
    shortName: "INT",
    primaryColor: "#0066cc",
    secondaryColor: "#000000",
    emoji: "⚫🔵"
  },
  {
    id: "barcelona",
    name: "FC Barcelona",
    shortName: "BAR",
    primaryColor: "#a50044",
    secondaryColor: "#004d98",
    emoji: "🔴🔵"
  },
  {
    id: "rotterdam",
    name: "Sparta Rotterdam",
    shortName: "SPR",
    primaryColor: "#d00000",
    secondaryColor: "#ffffff",
    emoji: "🔴"
  },
  {
    id: "benfica",
    name: "SL Benfica",
    shortName: "BEN",
    primaryColor: "#cc0000",
    secondaryColor: "#ffffff",
    emoji: "🦅"
  },
  {
    id: "ndabezitha",
    name: "Ndabezitha FC",
    shortName: "NDA",
    primaryColor: "#ffcc00",
    secondaryColor: "#006600",
    emoji: "👑"
  },
  {
    id: "psg",
    name: "PSG",
    shortName: "PSG",
    primaryColor: "#004170",
    secondaryColor: "#da020e",
    emoji: "🗼"
  },
  {
    id: "dortmund",
    name: "Dortmund",
    shortName: "BVB",
    primaryColor: "#fde100",
    secondaryColor: "#000000",
    emoji: "🟡"
  },
  {
    id: "roma",
    name: "Roma GR",
    shortName: "ROM",
    primaryColor: "#8b0000",
    secondaryColor: "#ffd700",
    emoji: "🐺"
  }
];

// =============================================
//  GENERATE HOME & AWAY FIXTURES
//  Each team plays every other team twice (H&A)
//  Spread across Mon–Sun of current week
// =============================================

export function generateFixtures() {
  const fixtures = [];
  let id = 1;

  // Get Monday of current week
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun
  const monday = new Date(now);
  monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  monday.setHours(0, 0, 0, 0);

  // Build all home-and-away pairs
  const pairs = [];
  for (let i = 0; i < TEAMS.length; i++) {
    for (let j = i + 1; j < TEAMS.length; j++) {
      pairs.push({ home: TEAMS[i].id, away: TEAMS[j].id });
      pairs.push({ home: TEAMS[j].id, away: TEAMS[i].id });
    }
  }

  // 10 teams = 90 fixtures. Spread ~13/day over 7 days
  const matchesPerDay = Math.ceil(pairs.length / 7);
  const kickoffTimes = ["12:00", "14:00", "16:00", "18:00", "20:00", "21:00", "15:00", "17:00", "19:00", "22:00", "13:00", "11:00", "10:00"];

  pairs.forEach((pair, idx) => {
    const dayOffset = Math.floor(idx / matchesPerDay);
    const matchDate = new Date(monday);
    matchDate.setDate(monday.getDate() + Math.min(dayOffset, 6));
    const timeSlot = kickoffTimes[idx % kickoffTimes.length];
    const [h, m] = timeSlot.split(":").map(Number);
    matchDate.setHours(h, m, 0, 0);

    fixtures.push({
      id: `match_${id++}`,
      homeTeam: pair.home,
      awayTeam: pair.away,
      date: matchDate.toISOString(),
      homeScore: null,
      awayScore: null,
      played: false
    });
  });

  return fixtures;
}

// =============================================
//  COMPUTE LEAGUE TABLE FROM RESULTS
// =============================================

export function computeTable(teams, fixtures) {
  const table = {};

  teams.forEach(t => {
    table[t.id] = {
      ...t,
      played: 0, won: 0, drawn: 0, lost: 0,
      gf: 0, ga: 0, gd: 0, points: 0
    };
  });

  fixtures.forEach(f => {
    if (!f.played || f.homeScore === null || f.awayScore === null) return;
    const h = table[f.homeTeam];
    const a = table[f.awayTeam];
    if (!h || !a) return;

    const hs = parseInt(f.homeScore);
    const as = parseInt(f.awayScore);

    h.played++; a.played++;
    h.gf += hs; h.ga += as;
    a.gf += as; a.ga += hs;
    h.gd = h.gf - h.ga;
    a.gd = a.gf - a.ga;

    if (hs > as) { h.won++; h.points += 3; a.lost++; }
    else if (hs < as) { a.won++; a.points += 3; h.lost++; }
    else { h.drawn++; a.drawn++; h.points++; a.points++; }
  });

  return Object.values(table).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.gd !== a.gd) return b.gd - a.gd;
    return b.gf - a.gf;
  });
}

export function getTeamById(id) {
  return TEAMS.find(t => t.id === id);
}

export function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

export function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}
