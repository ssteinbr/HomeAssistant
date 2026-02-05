# Home Assistant Demo Dashboard

A modern, responsive web dashboard for controlling Home Assistant lights and switches.

## Features

- View all lights and switches from your Home Assistant instance
- Toggle devices on/off with a single click
- Real-time connection status indicator
- Auto-refresh every 10 seconds
- Modern dark theme UI
- Mobile-responsive design

## Prerequisites

- Node.js 14.0 or higher
- A running Home Assistant instance
- A Long-Lived Access Token from Home Assistant

## Quick Start

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure your Home Assistant connection:**
   ```bash
   cp .env.example .env
   ```

3. **Edit the `.env` file with your settings:**
   ```
   HA_URL=http://your-home-assistant-ip:8123
   HA_TOKEN=your_long_lived_access_token
   ```

4. **Start the dashboard:**
   ```bash
   npm start
   ```

5. **Open in browser:**
   Navigate to `http://localhost:3000`

## Getting a Home Assistant Access Token

1. Log into your Home Assistant instance
2. Click on your profile (bottom left corner)
3. Scroll down to "Long-Lived Access Tokens"
4. Click "Create Token"
5. Give it a name (e.g., "Dashboard")
6. Copy the token immediately (it won't be shown again)

## API Endpoints

The dashboard server exposes the following API endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/status` | GET | Check Home Assistant connection |
| `/api/devices` | GET | Get all lights and switches |
| `/api/lights` | GET | Get all lights |
| `/api/switches` | GET | Get all switches |
| `/api/toggle` | POST | Toggle a device (body: `{entity_id}`) |
| `/api/turn_on` | POST | Turn on a device (body: `{entity_id}`) |
| `/api/turn_off` | POST | Turn off a device (body: `{entity_id}`) |
| `/api/state/:entity_id` | GET | Get state of specific entity |

## Project Structure

```
HomeAssistant/
├── server.js           # Express server
├── lib/
│   └── homeassistant.js  # Home Assistant API client
├── public/
│   ├── index.html      # Dashboard HTML
│   ├── styles.css      # Dashboard styles
│   └── app.js          # Dashboard JavaScript
├── .env.example        # Example configuration
├── .gitignore          # Git ignore file
└── package.json        # Node.js dependencies
```

## Troubleshooting

### "Home Assistant not configured"
Make sure you have created a `.env` file with valid `HA_URL` and `HA_TOKEN` values.

### "Unable to connect to Home Assistant"
- Verify your Home Assistant URL is correct
- Ensure your Home Assistant instance is running
- Check that your access token is valid
- Make sure there's no firewall blocking the connection

### Devices not showing up
- Check that you have light and switch entities in Home Assistant
- Verify the API token has sufficient permissions
