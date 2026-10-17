# Home Assistant (config notes + dashboards)

Saved copies of the Claude-built Lovelace dashboards (`ha-*.yaml`, `dashboards/`) for the user's Home Assistant
(HA OS on a Raspberry Pi 4, 192.168.0.227, Tailscale `homeassistant.tail8d3740.ts.net`). Owner: ssteinbr (private repo).

## Access

- The hass-mcp server (configured in `~/.claude.json`) is the normal way in. For what it can't do (automation configs,
  core config, repairs, entity/device registry), use REST/websocket with the token from hass-mcp's `env` — read it into
  a shell variable, never print it.
- Use `http://192.168.0.227:8123` or the Tailscale name (`homeassistant.local` resolves to IPv6 link-local first and breaks some clients).
- **Never send unauthenticated requests** (they count toward ip_ban). Never forward port 8123 or use DMZ.

## Rules

- **Only the `ha-*` dashboards may be rewritten** (ha-overview, ha-lights, ha-sonos, ha-all). The user's own dashboards
  (light-switches, dashboard-sonos, apple-tv, map, lovelace, default Overview) are off-limits unless the user asks for
  a specific change to one (then make only that change, backing up the config first). Dry-run first.
  hass-mcp can't create dashboards; new ones are made in the HA UI first.
- After changing an `ha-*` dashboard, save the live config into `dashboards/<url_path>.yaml` (keep the comment header).
- Entity IDs are stale after renames — trust `friendly_name`. Two ecobees: `climate.my_ecobee_2` = **house** (ecobee3),
  `climate.my_ecobee` = **rental** (ecobee4) — not duplicates. `light.reading_lamp` = **TV Lamp** (Living room).
- Hue: the bridge is at 192.168.0.229 and its local API key is not stored. Auto mode blocks Claude from searching for it,
  so the user recovers it from old session `.jsonl` files with grep for `192.168.0.229/api/`. HA's Hue integration can't delete
  bulbs that are still paired, so "remove from HA" means disabling the device. Deleting a bulb or room on the bridge
  removes it from HA automatically. As of 2026-10-16, the unused bulbs and the Other and Andrea HQ rooms are disabled
  in HA but still paired.
- `person.ssteinbr` tracks every household device (user declined trimming it) — suspect it in presence bugs.
- Say plainly before any change the user hasn't asked for, and before anything that may trigger a macOS permission prompt.
- End commit messages with the Co-Authored-By line; commit/push only as part of an agreed change. Auto mode blocks
  pushing straight to `main`, so push a branch, open a PR with `gh`, and merge it.

Related project: ~/MissionControl (monitoring collector that reads HA).
