// Home Assistant Dashboard App

const API_BASE = '/api';

// State
let devices = {
  lights: [],
  switches: []
};

// DOM Elements
const lightsGrid = document.getElementById('lights-grid');
const switchesGrid = document.getElementById('switches-grid');
const connectionStatus = document.getElementById('connection-status');
const errorBanner = document.getElementById('error-banner');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  checkConnection();
  refreshDevices();

  // Auto-refresh every 10 seconds
  setInterval(refreshDevices, 10000);
});

// API Functions
async function fetchAPI(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
}

async function checkConnection() {
  try {
    const result = await fetchAPI('/status');
    updateConnectionStatus(result.connected);
    if (!result.connected) {
      showError(result.error || 'Unable to connect to Home Assistant');
    }
  } catch (error) {
    updateConnectionStatus(false);
    showError('Cannot reach dashboard server');
  }
}

async function refreshDevices() {
  try {
    const data = await fetchAPI('/devices');
    devices.lights = data.lights || [];
    devices.switches = data.switches || [];

    renderLights();
    renderSwitches();
    hideError();
    updateConnectionStatus(true);
  } catch (error) {
    showError(error.message);
    updateConnectionStatus(false);
  }
}

async function toggleDevice(entityId) {
  const card = document.querySelector(`[data-entity-id="${entityId}"]`);
  if (card) {
    card.classList.add('loading');
  }

  try {
    await fetchAPI('/toggle', {
      method: 'POST',
      body: JSON.stringify({ entity_id: entityId })
    });

    // Refresh after a short delay to get updated state
    setTimeout(refreshDevices, 500);
  } catch (error) {
    showError(`Failed to toggle device: ${error.message}`);
    if (card) {
      card.classList.remove('loading');
    }
  }
}

// Render Functions
function renderLights() {
  if (devices.lights.length === 0) {
    lightsGrid.innerHTML = `
      <div class="empty-state">
        <div class="icon">💡</div>
        <p>No lights found</p>
      </div>
    `;
    return;
  }

  lightsGrid.innerHTML = devices.lights.map(light => createDeviceCard(light, 'light')).join('');
}

function renderSwitches() {
  if (devices.switches.length === 0) {
    switchesGrid.innerHTML = `
      <div class="empty-state">
        <div class="icon">🔌</div>
        <p>No switches found</p>
      </div>
    `;
    return;
  }

  switchesGrid.innerHTML = devices.switches.map(sw => createDeviceCard(sw, 'switch')).join('');
}

function createDeviceCard(device, type) {
  const isOn = device.state === 'on';
  const friendlyName = device.attributes?.friendly_name || formatEntityName(device.entity_id);
  const icon = type === 'light' ? '💡' : '🔌';

  return `
    <div class="device-card ${isOn ? 'on' : ''}"
         data-entity-id="${device.entity_id}"
         onclick="toggleDevice('${device.entity_id}')">
      <div class="toggle-switch"></div>
      <div class="device-icon">${icon}</div>
      <div class="device-name" title="${friendlyName}">${friendlyName}</div>
      <div class="device-state">${device.state}</div>
    </div>
  `;
}

function formatEntityName(entityId) {
  // Convert entity_id like "light.living_room" to "Living Room"
  return entityId
    .split('.')[1]
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// UI Functions
function updateConnectionStatus(connected) {
  const dot = connectionStatus.querySelector('.status-dot');
  const text = connectionStatus.querySelector('.status-text');

  dot.classList.remove('connected', 'error');

  if (connected) {
    dot.classList.add('connected');
    text.textContent = 'Connected';
  } else {
    dot.classList.add('error');
    text.textContent = 'Disconnected';
  }
}

function showError(message) {
  const errorMessage = errorBanner.querySelector('.error-message');
  errorMessage.textContent = message;
  errorBanner.classList.remove('hidden');
}

function hideError() {
  errorBanner.classList.add('hidden');
}

// Export for inline onclick handlers
window.toggleDevice = toggleDevice;
window.refreshDevices = refreshDevices;
window.hideError = hideError;
