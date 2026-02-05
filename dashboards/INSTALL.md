# Installing Home Assistant Dashboards

This guide explains how to install the custom dashboards for Lights, Sonos, and Apple TV.

## Prerequisites

### Required Custom Cards (via HACS)

These dashboards use custom cards for a better UI. Install them through [HACS](https://hacs.xyz/):

1. **Mushroom Cards** (required for all dashboards)
   - HACS → Frontend → Search "Mushroom" → Install

2. **Mini Media Player** (required for Sonos and Apple TV)
   - HACS → Frontend → Search "Mini Media Player" → Install

3. **Apple TV Card** (optional, for Apple TV remote)
   - HACS → Frontend → Search "Apple TV Card" → Install

After installing, restart Home Assistant.

## Installation Methods

### Method 1: UI Dashboard Import (Recommended)

1. Go to **Settings** → **Dashboards**
2. Click **Add Dashboard** (+ button)
3. Choose **New dashboard from scratch**
4. Name it (e.g., "Lights", "Sonos", or "Apple TV")
5. Set an icon (e.g., `mdi:lightbulb`, `mdi:speaker`, `mdi:apple`)
6. Click **Create**
7. Open the new dashboard
8. Click the three dots menu (⋮) → **Edit Dashboard**
9. Click the three dots menu again → **Raw configuration editor**
10. Paste the contents of the corresponding YAML file
11. Click **Save**

### Method 2: YAML Mode (Advanced)

If you prefer YAML configuration:

1. Edit your `configuration.yaml`:

```yaml
lovelace:
  mode: storage
  dashboards:
    lights-dashboard:
      mode: yaml
      title: Lights
      icon: mdi:lightbulb
      show_in_sidebar: true
      filename: dashboards/lights.yaml

    sonos-dashboard:
      mode: yaml
      title: Sonos
      icon: mdi:speaker
      show_in_sidebar: true
      filename: dashboards/sonos.yaml

    appletv-dashboard:
      mode: yaml
      title: Apple TV
      icon: mdi:apple
      show_in_sidebar: true
      filename: dashboards/appletv.yaml
```

2. Copy the dashboard YAML files to your Home Assistant config directory
3. Restart Home Assistant

## Customizing Entity IDs

**Important:** You'll need to update the entity IDs in the YAML files to match your actual devices.

### Finding Your Entity IDs

1. Go to **Settings** → **Devices & Services** → **Entities**
2. Filter by domain:
   - Lights: `light.`
   - Sonos: `media_player.` (filter by Sonos integration)
   - Apple TV: `media_player.` and `remote.` (filter by Apple TV integration)

### Common Entity Patterns

| Device Type | Example Entity ID |
|-------------|-------------------|
| Light | `light.living_room` |
| Sonos Speaker | `media_player.living_room_sonos` |
| Apple TV Media Player | `media_player.living_room_apple_tv` |
| Apple TV Remote | `remote.living_room_apple_tv` |

### Find & Replace

Use your text editor to find and replace the example entity IDs:

**Lights Dashboard:**
- `light.living_room` → your entity
- `light.kitchen` → your entity
- etc.

**Sonos Dashboard:**
- `media_player.living_room_sonos` → your entity
- etc.

**Apple TV Dashboard:**
- `media_player.living_room_apple_tv` → your entity
- `remote.living_room_apple_tv` → your entity
- etc.

## Customizing Rooms & Sections

### Adding a Room

Copy an existing card block and modify:

```yaml
- type: custom:mushroom-light-card
  entity: light.your_new_room
  name: Your Room Name
  icon: mdi:ceiling-light
  use_light_color: true
  show_brightness_control: true
```

### Removing a Room

Simply delete the card block for rooms you don't have.

### Changing Icons

Find icons at [Material Design Icons](https://pictogrammers.com/library/mdi/).

Common icons:
- `mdi:lightbulb` - General light
- `mdi:ceiling-light` - Ceiling light
- `mdi:floor-lamp` - Floor lamp
- `mdi:led-strip` - LED strip
- `mdi:outdoor-lamp` - Outdoor light
- `mdi:speaker` - Speaker
- `mdi:speaker-wireless` - Wireless speaker
- `mdi:television` - TV
- `mdi:apple` - Apple device

## Troubleshooting

### Cards not appearing

1. Make sure you installed the required custom cards via HACS
2. Clear your browser cache (Ctrl+Shift+R)
3. Check Developer Tools → Logs for errors

### "Entity not found" errors

The entity ID doesn't exist. Check your entity IDs in Settings → Entities.

### Buttons not working

1. Verify the entity ID is correct
2. Check that the integration is properly set up
3. Test the service call in Developer Tools → Services

## Dashboard Themes

These dashboards work best with dark themes. Recommended themes from HACS:
- **Mushroom Shadow** (complements Mushroom cards)
- **iOS Dark Mode**
- **Caule Themes Pack**

To apply a theme:
1. Install via HACS → Frontend
2. Go to your Profile (bottom left)
3. Select the theme

## Getting Help

- [Home Assistant Community Forums](https://community.home-assistant.io/)
- [Home Assistant Discord](https://discord.gg/home-assistant)
- [Mushroom Cards Documentation](https://github.com/piitaya/lovelace-mushroom)
- [Mini Media Player Documentation](https://github.com/kalkih/mini-media-player)
