const socket = io("http://10.98.59.72:9000");

socket.onAny((event, data) => {
  console.log("📡 EVENT RECEIVED:", event, data);
});


// ═══════════════════════════════════════
//  GLOBAL STATE
// ═══════════════════════════════════════
let currentFilter = 'all';
let isRefreshing = false;
let lastRefreshTime = null;

// ═══════════════════════════════════════
//  CLOCK
// ═══════════════════════════════════════
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2,'0');
  const m = String(now.getMinutes()).padStart(2,'0');
  const s = String(now.getSeconds()).padStart(2,'0');
  document.getElementById('clock').textContent = `${h}:${m}:${s}`;
}

setInterval(updateClock, 1000);
updateClock();

//==============================
// Employee Id 
//==============================
const element = document.getElementById('employee-id');
element.innerText = 'hello';


const poleIdMap = {
  "001": "P0L-101",
  "002": "P0L-102",
  "003": "P0L-103",
  "004": "P0L-104",
  "005": "P0L-105",
  "006": "P0L-106",
  "007": "P0L-107",
  "008": "P0L-08"
};

socket.on("connect", () => {
  console.log("✅ Connected:", socket.id);
  const backendPoleIds = Object.keys(poleIdMap);
  socket.emit("join-multiple-poles", backendPoleIds);
});

socket.on("reading", (data) => {
  console.log("⚡ Live update:", data);

  const mappedId = poleIdMap[data.pole_id];
  if (!mappedId) return;

  const pole = poles.find(p => p.id === mappedId);
  if (!pole) return;

  pole.currentPower = data.voltage * data.current;
  pole.currentVoltage = data.voltage;
  pole.currentCurrent = data.current;

  updateSinglePoleUI(mappedId);
});

socket.on("baseline-update", (data) => {
  console.log("🔥 BASELINE RECEIVED:", data);

  const mappedId = poleIdMap[data.pole_id];
  if (!mappedId) return;

  const pole = poles.find(p => p.id === mappedId);
  if (!pole) return;

  // ✅ UPDATE EXPECTED VALUES
  pole.expectedCurrent = data.expected_current;
  pole.expectedVoltage = data.expected_voltage;

  // optional: expected power
  pole.expectedPower = data.expected_current * data.expected_voltage;

  // ✅ UPDATE UI
  updateBaselineUI(mappedId);
});

const poles = [
  {
    id: 'P0L-101', location: 'Main St & 1st Ave',
    status: 'active', powerColor: 'green',
    currentPower: 1900.08, expectedPower: 2200,
    currentVoltage: 218.4, expectedVoltage: 220,
    currentCurrent: 8.7, expectedCurrent: 10,
    connections: 12, transformer: 'TRF-101', phase: 'Three Phase',
    statusLabel: 'Active', type: 'Overhead', circuit: 'CKT-A12', lastInspection: '2026-02-15',
    open: true
  },
  {
    id: 'P0L-102', location: 'Oak Rd & 3rd St',
    status: 'active', powerColor: 'green',
    currentPower: 2719.53, expectedPower: 3000,
    currentVoltage: 221.1, expectedVoltage: 220,
    currentCurrent: 12.3, expectedCurrent: 13,
    connections: 8, transformer: 'TRF-104', phase: 'Three Phase',
    statusLabel: 'Active', type: 'Overhead', circuit: 'CKT-B04', lastInspection: '2026-01-20'
  },
  {
    id: 'P0L-103', location: 'Industrial Blvd #7',
    status: 'inactive', powerColor: 'orange',
    currentPower: 1890.98, expectedPower: 2500,
    currentVoltage: 209.5, expectedVoltage: 220,
    currentCurrent: 9.0, expectedCurrent: 11,
    connections: 15, transformer: 'TRF-209', phase: 'Single Phase',
    statusLabel: 'Degraded', type: 'Underground', circuit: 'CKT-C07', lastInspection: '2025-12-10'
  },
  {
    id: 'P0L-104', location: 'Elm Park Lane',
    status: 'active', powerColor: 'green',
    currentPower: 1188, expectedPower: 1200,
    currentVoltage: 219.8, expectedVoltage: 220,
    currentCurrent: 5.4, expectedCurrent: 5.5,
    connections: 6, transformer: 'TRF-310', phase: 'Single Phase',
    statusLabel: 'Active', type: 'Overhead', circuit: 'CKT-A01', lastInspection: '2026-02-28'
  },
  {
    id: 'P0L-105', location: 'Harbor View Dr',
    status: 'error', powerColor: 'red',
    currentPower: 2888.96, expectedPower: 2400,
    currentVoltage: 232.7, expectedVoltage: 220,
    currentCurrent: 12.4, expectedCurrent: 10,
    connections: 10, transformer: 'TRF-118', phase: 'Three Phase',
    statusLabel: 'Fault', type: 'Overhead', circuit: 'CKT-D03', lastInspection: '2026-01-05'
  },
  {
    id: 'P0L-106', location: 'Cedar Heights Rd',
    status: 'active', powerColor: 'green',
    currentPower: 1581.12, expectedPower: 1800,
    currentVoltage: 217.9, expectedVoltage: 220,
    currentCurrent: 7.3, expectedCurrent: 8.2,
    connections: 9, transformer: 'TRF-405', phase: 'Three Phase',
    statusLabel: 'Active', type: 'Overhead', circuit: 'CKT-B11', lastInspection: '2026-03-01'
  },
  {
    id: 'P0L-107', location: 'Riverside Walk',
    status: 'inactive', powerColor: 'green',
    currentPower: 2458.5, expectedPower: 2600,
    currentVoltage: 218.0, expectedVoltage: 220,
    currentCurrent: 11.2, expectedCurrent: 11.8,
    connections: 11, transformer: 'TRF-502', phase: 'Three Phase',
    statusLabel: 'Active', type: 'Underground', circuit: 'CKT-C02', lastInspection: '2025-11-18'
  },
  {
    id: 'P0L-08', location: 'Commerce Square',
    status: 'active', powerColor: 'green',
    currentPower: 1498.04, expectedPower: 1600,
    currentVoltage: 220.2, expectedVoltage: 220,
    currentCurrent: 6.8, expectedCurrent: 7.3,
    connections: 7, transformer: 'TRF-601', phase: 'Single Phase',
    statusLabel: 'Active', type: 'Overhead', circuit: 'CKT-A09', lastInspection: '2026-03-10'
  }
];

const iconBolt = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
const iconActivity = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`;
const iconZap = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
const iconPin = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
const iconUsers = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
const iconGear = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>`;
const iconCpu = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>`;
const iconLayers = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`;
const iconCalendar = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
const iconCheck = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
const iconChevron = `<svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`;
const iconRefresh = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36M20.49 15a9 9 0 0 1-14.85 3.36"/></svg>`;
const iconLogout = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`;

// ═══════════════════════════════════════
//  FORMAT NUMBER
// ═══════════════════════════════════════
function fmt(n) {
  return Number.isInteger(n) ? n.toString() : n.toFixed(2);
}

// ═══════════════════════════════════════
//  RENDER POLE CARD
// ═══════════════════════════════════════
function renderPole(pole) {
  const highlightClass = pole.powerColor === 'red' ? 'highlight-orange' : (pole.powerColor === 'orange' ? 'highlight-orange' : 'highlight');

  return `
  <div class="pole-card" data-id="${pole.id}">
    <div class="pole-header" onclick="toggleCard(this)">
      <div class="status-dot ${pole.status}"></div>
      <div class="pole-info">
        <div class="pole-id">${pole.id}</div>
        <div class="pole-location">${iconPin} ${pole.location}</div>
      </div>
      <div class="pole-power ${pole.powerColor}">${fmt(pole.currentPower)}<span class="power-unit">W</span></div>
      ${iconChevron}
    </div>
    <div class="pole-body">
      <div class="metrics-grid">
        <div class="metric-cell">
          <div class="metric-label">${iconBolt} Expected Power</div>
          <div class="metric-value">${fmt(pole.expectedPower)}<span class="metric-unit">W</span></div>
        </div>
        <div class="metric-cell">
          <div class="metric-label">${iconBolt} Current Power</div>
          <div class="metric-value ${highlightClass}">${fmt(pole.currentPower)}<span class="metric-unit">W</span></div>
        </div>
        <div class="metric-cell">
          <div class="metric-label">${iconZap} Expected Voltage</div>
          <div class="metric-value">${fmt(pole.expectedVoltage)}<span class="metric-unit">V</span></div>
        </div>
        <div class="metric-cell">
          <div class="metric-label">${iconZap} Current Voltage</div>
          <div class="metric-value ${highlightClass}">${fmt(pole.currentVoltage)}<span class="metric-unit">V</span></div>
        </div>
        <div class="metric-cell">
          <div class="metric-label">${iconActivity} Expected Current</div>
          <div class="metric-value">${fmt(pole.expectedCurrent)}<span class="metric-unit">A</span></div>
        </div>
        <div class="metric-cell">
          <div class="metric-label">${iconActivity} Current Current</div>
          <div class="metric-value ${highlightClass}">${fmt(pole.currentCurrent)}<span class="metric-unit">A</span></div>
        </div>
      </div>
      <div class="connection-section">
        <div class="connection-title">Details</div>
        <div class="connection-grid">
          <div class="conn-row">
            <div class="conn-key">${iconUsers} Connections</div>
            <div class="conn-val">${pole.connections}</div>
          </div>
          <div class="conn-row">
            <div class="conn-key">${iconGear} Transformer</div>
            <div class="conn-val">${pole.transformer}</div>
          </div>
          <div class="conn-row">
            <div class="conn-key">${iconCpu} Phase</div>
            <div class="conn-val">${pole.phase}</div>
          </div>
          <div class="conn-row">
            <div class="conn-key">${iconLayers} Circuit</div>
            <div class="conn-val">${pole.circuit}</div>
          </div>
          <div class="conn-row">
            <div class="conn-key">${iconGear} Type</div>
            <div class="conn-val">${pole.type}</div>
          </div>
          <div class="conn-row">
            <div class="conn-key">${iconCalendar} Last Inspection</div>
            <div class="conn-val">${pole.lastInspection}</div>
          </div>
          <div class="conn-row">
            <div class="conn-key">${iconCheck} Status</div>
            <div class="conn-val active">${pole.statusLabel}</div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

// ═══════════════════════════════════════
//  RENDER ALL POLES
// ═══════════════════════════════════════
function renderAllPoles() {
  const poleList = document.getElementById('poleList');
  poleList.innerHTML = poles.map(renderPole).join('');
  
  applyFilters();
  
  // const firstOpenPole = poles.find(p => p.open);
  if (firstOpenPole) {
    const card = document.querySelector(`.pole-card[data-id="${firstOpenPole.id}"]`);
    if (card) card.classList.add('open');
  }
}

// ═══════════════════════════════════════
//  FILTER & SEARCH FUNCTIONS
// ═══════════════════════════════════════
function setFilter(filterType, buttonElement) {
  currentFilter = filterType;

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  buttonElement.classList.add('active');

  applyFilters();
}

function filterPoles() {
  applyFilters();
}

function applyFilters() {
  const searchInput = document.getElementById("searchInput").value.toLowerCase();
  const cards = document.querySelectorAll(".pole-card");
  const counts = { all: 0, active: 0, warning: 0, error: 0 };

  cards.forEach(card => {
    const statusDot = card.querySelector('.status-dot');
    const poleStatus = Array.from(statusDot.classList).find(cls => 
      ['active', 'inactive', 'warning', 'error'].includes(cls)
    ) || 'inactive';

    const polesData = card.querySelector(".pole-id").textContent.toLowerCase();
    const location = card.querySelector(".pole-location").textContent.toLowerCase();

    const matchesSearch = 
      polesData.includes(searchInput) ||
      location.includes(searchInput);

    const matchesFilter = 
      currentFilter === 'all' ||
      currentFilter === poleStatus;

    if (matchesSearch && matchesFilter) {
      card.style.display = "block";
      counts.all++;
      
      if (poleStatus === 'active') counts.active++;
      else if (poleStatus === 'warning' || poleStatus === 'inactive') counts.warning++;
      else if (poleStatus === 'error') counts.error++;
    } else {
      card.style.display = "none";
    }
  });

  document.getElementById('fc-all').textContent = counts.all;
  document.getElementById('fc-active').textContent = counts.active;
  document.getElementById('fc-warn').textContent = counts.warning;
  document.getElementById('fc-fault').textContent = counts.error;

  const visibleCount = counts.all;
  document.querySelector(".page-subtitle").textContent = 
    visibleCount === 0 ? "No poles found" : visibleCount + " pole" + (visibleCount !== 1 ? "s" : "") + " found";
}

// ═══════════════════════════════════════
//  TOGGLE CARD EXPANDED STATE
// ═══════════════════════════════════════
function toggleCard(header) {
  const card = header.closest('.pole-card');
  card.classList.toggle('open');
}

// ═══════════════════════════════════════
//  FLASH VALUE ANIMATION
// ═══════════════════════════════════════
function flashValue(element) {
  element.classList.remove('value-updated');
  void element.offsetWidth;
  element.classList.add('value-updated');
}

// ═══════════════════════════════════════
//  TOAST NOTIFICATION
// ═══════════════════════════════════════
function showToast(message = 'Data refreshed', time = '') {
  const toast = document.getElementById('toast');
  const messageSpan = toast.querySelector('span:nth-of-type(1)');
  const timeSpan = document.getElementById('toastTime');
  
  if (messageSpan) messageSpan.textContent = message;
  if (time) timeSpan.textContent = time;
  
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

// ═══════════════════════════════════════
//  REFRESH DATA
// ═══════════════════════════════════════
function refreshData() {
  if (isRefreshing) return;
  
  isRefreshing = true;
  const refreshBtn = document.getElementById('refreshBtn');
  const progressBar = document.getElementById('progressBar');
  
  refreshBtn.classList.add('refreshing');
  progressBar.classList.add('active');
  
  // Simulate data refresh - replace with actual API call
  setTimeout(() => {
    // Add small random variations to simulate fresh data
    poles.forEach(pole => {
      const variation = (Math.random() - 0.5) * 10;
      pole.currentPower = Math.max(100, pole.currentPower + variation);
      pole.currentVoltage = 220 + (Math.random() - 0.5) * 2;
      pole.currentCurrent = Math.max(1, pole.currentCurrent + (Math.random() - 0.5) * 0.5);
    });
    
    // Update all cards with flash animation
    document.querySelectorAll('.pole-card').forEach((card, index) => {
      const pole = poles[index];
      if (pole) updateSinglePoleUI(pole.id);
    });
    
    // Update timestamps
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    lastRefreshTime = time;
    
    // Update UI state
    refreshBtn.classList.remove('refreshing');
    refreshBtn.classList.add('done');
    progressBar.style.width = '100%';
    
    showToast('Data refreshed', time);
    
    // Reset states
    setTimeout(() => {
      refreshBtn.classList.remove('done');
      progressBar.classList.remove('active');
      progressBar.style.width = '0%';
      isRefreshing = false;
    }, 800);
    
  }, 1000);
}

// ═══════════════════════════════════════
//  LOGOUT
// ═══════════════════════════════════════
function logout() {
  // const confirmed = confirm('Are you sure you want to logout?');
  // if (!confirmed) return;
  
  isRefreshing = true;
  const body = document.body;
  body.style.opacity = '0.5';
  body.style.pointerEvents = 'none';
  
  // Simulate logout process
  setTimeout(() => {
    // Clear session/local storage
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('userSession');
    
    // Redirect to login page (adjust URL as needed)
    window.location.href = '/frontend/logout.html';
  }, 600);
}

// ═══════════════════════════════════════
//  UPDATE SINGLE POLE
// ═══════════════════════════════════════
function updateSinglePoleUI(pole_id) {
  const card = document.querySelector(`.pole-card[data-id="${pole_id}"]`);
  if (!card) return;

  const pole = poles.find(p => p.id === pole_id);
  if (!pole) return;

  const pw = card.querySelector('.pole-power');
  if (pw) {
    pw.childNodes[0].textContent = fmt(pole.currentPower);
    flashValue(pw);
  }

  const cells = card.querySelectorAll('.metric-value');

  if (cells[1]) {
    cells[1].childNodes[0].textContent = fmt(pole.currentPower);
    flashValue(cells[1]);
  }

  if (cells[3]) {
    cells[3].childNodes[0].textContent = fmt(pole.currentVoltage);
    flashValue(cells[3]);
  }

  if (cells[5]) {
    cells[5].childNodes[0].textContent = fmt(pole.currentCurrent);
    flashValue(cells[5]);
  }

  card.classList.add("flashing");
  setTimeout(() => card.classList.remove("flashing"), 600);
}

// ═══════════════════════════════════════
//  INITIALIZATION
// ═══════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  renderAllPoles();
});




function updateBaselineUI(pole_id) {
  const card = document.querySelector(`.pole-card[data-id="${pole_id}"]`);
  if (!card) return;

  const pole = poles.find(p => p.id === pole_id);
  if (!pole) return;

  const cells = card.querySelectorAll('.metric-value');

  // Expected Power (index 0)
  if (cells[0]) {
    cells[0].childNodes[0].textContent = fmt(pole.expectedPower);
    flashValue(cells[0]);
  }

  // Expected Voltage (index 2)
  if (cells[2]) {
    cells[2].childNodes[0].textContent = fmt(pole.expectedVoltage);
    flashValue(cells[2]);
  }

  // Expected Current (index 4)
  if (cells[4]) {
    cells[4].childNodes[0].textContent = fmt(pole.expectedCurrent);
    flashValue(cells[4]);
  }
}