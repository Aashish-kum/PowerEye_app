document.addEventListener('DOMContentLoaded', () => {
  // Check authentication
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  }

  // Display user info
  const empIdEl = document.getElementById('employee-id');
  if (empIdEl) empIdEl.textContent = currentUser.empid;

  // Get Pole ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const poleId = urlParams.get('id');

  if (!poleId) {
    alert('No Pole ID provided!');
    window.location.href = 'Dashboard.html';
    return;
  }

  // Fetch current details from localStorage
  const poles = JSON.parse(localStorage.getItem('poles') || '[]');
  const pole = poles.find(p => p.id === poleId);

  if (!pole) {
    alert('Pole not found!');
    window.location.href = 'Dashboard.html';
    return;
  }

  // Populate form fields
  document.getElementById('poleDisplayId').textContent = pole.id;
  document.getElementById('poleId').value = pole.id;
  document.getElementById('location').value = pole.location || '';
  document.getElementById('status').value = pole.statusLabel || 'Normal';
  document.getElementById('poleType').value = pole.type || 'Overhead';
  document.getElementById('phase').value = pole.phase || 'Three Phase';
  document.getElementById('voltage').value = pole.expectedVoltage || 0;
  document.getElementById('current').value = pole.expectedCurrent || 0;
  document.getElementById('power').value = pole.expectedPower || 0;
  document.getElementById('connections').value = pole.connections || 0;
  document.getElementById('transformer').value = pole.transformer || '';
  document.getElementById('circuit').value = pole.circuit || '';
  document.getElementById('lastInspection').value = pole.lastInspection || '';
});

function handleUpdate(event) {
  event.preventDefault();

  const poleId = document.getElementById('poleId').value;
  const location = document.getElementById('location').value;
  const statusLabel = document.getElementById('status').value;
  const type = document.getElementById('poleType').value;
  const phase = document.getElementById('phase').value;
  const voltage = parseFloat(document.getElementById('voltage').value);
  const current = parseFloat(document.getElementById('current').value);
  const power = parseFloat(document.getElementById('power').value);
  const connections = parseInt(document.getElementById('connections').value);
  const transformer = document.getElementById('transformer').value;
  const circuit = document.getElementById('circuit').value;
  const lastInspection = document.getElementById('lastInspection').value;

  // Get current poles from localStorage
  const poles = JSON.parse(localStorage.getItem('poles') || '[]');
  const poleIndex = poles.findIndex(p => p.id === poleId);

  if (poleIndex === -1) {
    showError('Pole not found in storage!');
    return;
  }

  // Update pole data
  poles[poleIndex] = {
    ...poles[poleIndex],
    location,
    statusLabel,
    status: statusLabel.toLowerCase(),
    type,
    phase,
    expectedVoltage: voltage,
    expectedCurrent: current,
    expectedPower: power,
    connections,
    transformer,
    circuit,
    lastInspection,
    lastUpdate: 'Just now'
  };

  // Save back to localStorage
  localStorage.setItem('poles', JSON.stringify(poles));

  showSuccess('Pole updated successfully!');

  // Redirect after delay
  setTimeout(() => {
    window.location.href = 'Dashboard.html';
  }, 1500);
}

function showError(message) {
  const alert = document.getElementById('errorAlert');
  const messageEl = document.getElementById('errorMessage');
  messageEl.textContent = message;
  alert.classList.add('show');
  alert.style.display = 'flex';
  window.scrollTo(0, 0);
}

function showSuccess(message) {
  const alert = document.getElementById('successAlert');
  alert.classList.add('show');
  alert.style.display = 'flex';
  window.scrollTo(0, 0);
}

function goBack() {
  const confirmed = confirm('Are you sure? Unsaved changes will be lost.');
  if (confirmed) {
    window.location.href = 'Dashboard.html';
  }
}

function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
}
