require('dotenv').config();
const express = require('express');
const path = require('path');
const HomeAssistantClient = require('./lib/homeassistant');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Home Assistant client
const haUrl = process.env.HA_URL || 'http://homeassistant.local:8123';
const haToken = process.env.HA_TOKEN;

let haClient = null;

if (haToken) {
  haClient = new HomeAssistantClient(haUrl, haToken);
  console.log(`Home Assistant client configured for: ${haUrl}`);
} else {
  console.warn('Warning: HA_TOKEN not set. API calls will fail.');
  console.warn('Please copy .env.example to .env and configure your Home Assistant credentials.');
}

// API Routes

// Check connection status
app.get('/api/status', async (req, res) => {
  if (!haClient) {
    return res.json({
      connected: false,
      error: 'Home Assistant not configured. Please set HA_URL and HA_TOKEN in .env file.'
    });
  }

  const status = await haClient.checkConnection();
  res.json(status);
});

// Get all lights and switches
app.get('/api/devices', async (req, res) => {
  if (!haClient) {
    return res.status(503).json({
      error: 'Home Assistant not configured'
    });
  }

  try {
    const [lights, switches] = await Promise.all([
      haClient.getLights(),
      haClient.getSwitches()
    ]);

    res.json({ lights, switches });
  } catch (error) {
    console.error('Error fetching devices:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get lights only
app.get('/api/lights', async (req, res) => {
  if (!haClient) {
    return res.status(503).json({ error: 'Home Assistant not configured' });
  }

  try {
    const lights = await haClient.getLights();
    res.json(lights);
  } catch (error) {
    console.error('Error fetching lights:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get switches only
app.get('/api/switches', async (req, res) => {
  if (!haClient) {
    return res.status(503).json({ error: 'Home Assistant not configured' });
  }

  try {
    const switches = await haClient.getSwitches();
    res.json(switches);
  } catch (error) {
    console.error('Error fetching switches:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Toggle a device
app.post('/api/toggle', async (req, res) => {
  if (!haClient) {
    return res.status(503).json({ error: 'Home Assistant not configured' });
  }

  const { entity_id } = req.body;

  if (!entity_id) {
    return res.status(400).json({ error: 'entity_id is required' });
  }

  try {
    const result = await haClient.toggle(entity_id);
    res.json({ success: true, result });
  } catch (error) {
    console.error(`Error toggling ${entity_id}:`, error.message);
    res.status(500).json({ error: error.message });
  }
});

// Turn on a device
app.post('/api/turn_on', async (req, res) => {
  if (!haClient) {
    return res.status(503).json({ error: 'Home Assistant not configured' });
  }

  const { entity_id } = req.body;

  if (!entity_id) {
    return res.status(400).json({ error: 'entity_id is required' });
  }

  try {
    const result = await haClient.turnOn(entity_id);
    res.json({ success: true, result });
  } catch (error) {
    console.error(`Error turning on ${entity_id}:`, error.message);
    res.status(500).json({ error: error.message });
  }
});

// Turn off a device
app.post('/api/turn_off', async (req, res) => {
  if (!haClient) {
    return res.status(503).json({ error: 'Home Assistant not configured' });
  }

  const { entity_id } = req.body;

  if (!entity_id) {
    return res.status(400).json({ error: 'entity_id is required' });
  }

  try {
    const result = await haClient.turnOff(entity_id);
    res.json({ success: true, result });
  } catch (error) {
    console.error(`Error turning off ${entity_id}:`, error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get state of a specific entity
app.get('/api/state/:entity_id', async (req, res) => {
  if (!haClient) {
    return res.status(503).json({ error: 'Home Assistant not configured' });
  }

  try {
    const state = await haClient.getState(req.params.entity_id);
    res.json(state);
  } catch (error) {
    console.error(`Error fetching state for ${req.params.entity_id}:`, error.message);
    res.status(500).json({ error: error.message });
  }
});

// Serve the dashboard for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║           Home Assistant Demo Dashboard                       ║
╠═══════════════════════════════════════════════════════════════╣
║  Server running at: http://localhost:${PORT}                     ║
║  Home Assistant URL: ${haUrl.padEnd(39)}║
║  Token configured: ${haToken ? 'Yes'.padEnd(41) : 'No (check .env file)'.padEnd(41)}║
╚═══════════════════════════════════════════════════════════════╝
  `);
});
