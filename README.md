# sim-tool

MQTT-based building/device simulation tool. Publishes building data, EOS device states, and sensor updates to an MQTT broker. Listens for demo commands (add building, start/stop simulation).

## Run the project

```bash
npm install
npm start
```

The app connects to an MQTT broker and:

1. **On connect**: Publishes buildings from `sim-tool/data/buildings.json` to `service/demo/buildings/<name>`.
2. **Subscribes to**:
   - `service/demo/settings/post/request` – add new building (JSON: `building`, `floors`, `rooms`, `eos`, etc.).
   - `service/demo/start` – start simulation (JSON: `{ "buildingName": "RA", "time": 60 }`).
   - `service/demo/stop` – stop simulation.
3. **When simulation runs**: Publishes EOS status and sensor topics for the building (per floor/office/eos), plus `service/demo/status` (`online`/`offline`).
4. **Periodically**: Re-publishes buildings every 60s; updates device/sensor state every 1s during simulation.

---


## Local broker

1. **Start a local MQTT broker** (e.g. Mosquitto):

   ```bash
   # macOS (Homebrew)
   brew install mosquitto
   mosquitto -v
   ```

   Default port: `1883`.

2. **Run the sim-tool** pointing at localhost:

   ```bash
   MQTT_BROKER_URL=mqtt://localhost:1883 npm start
   ```

3. **Open MQTT Explorer** and create a connection:
   - **Host**: `localhost`
   - **Port**: `1883`
   - **Protocol**: `mqtt://` (no TLS)
   - Connect.

4. **Subscribe** to see all demo traffic:
   - `service/demo/#`
   - Or subscribe to `#` to see every topic (buildings, EOS status, sensors, etc.).

5. **Trigger actions from MQTT Explorer** (publish to these topics):

   - **List buildings** (sim-tool publishes them on start): look at `service/demo/buildings/RA` (and any other building names).
   - **Add a building**: publish to `service/demo/settings/post/request` with payload, e.g.:
     ```json
     {"building": "DemoBuilding", "floors": 2, "rooms": 2, "eos": 2}
     ```
     Responses appear on `service/demo/settings/post/response`.
   - **Start simulation** (building must exist in `buildings.json`): publish to `service/demo/start`:
     ```json
     {"buildingName": "RA", "time": 120}
     ```
     `time` is runtime in seconds. You’ll see many topics under `RA/...` (floors, offices, eos, sensors).
   - **Stop simulation**: publish (any payload) to `service/demo/stop`.



## Main MQTT topics

| Topic | Direction | Description |
|-------|-----------|-------------|
| `service/demo/buildings/<name>` | App → Broker | Building info (from `buildings.json`) |
| `service/demo/settings/post/request` | You → App | Add building (JSON) |
| `service/demo/settings/post/response` | App → Broker | Add building result |
| `service/demo/start` | You → App | Start simulation `{ "buildingName", "time" }` |
| `service/demo/stop` | You → App | Stop simulation |
| `service/demo/status` | App → Broker | `online` / `offline` |
| `<building>/<floor>/office/<room>/eos/<eos>/status` | App → Broker | EOS device status |
| `<building>/.../eos/<eos>/sensor/<type>/state` | App → Broker | Sensor values (temperature, light, uptime, etc.) |

---

## Configuration

- **Broker URL**: set `MQTT_BROKER_URL` (e.g. `mqtt://localhost:1883`). 
- **Buildings data**: edit `sim-tool/data/buildings.json`. The built-in example includes building `"RA"` with floors, rooms, EOS devices, and sateraitos.

## Demo

https://github.com/user-attachments/assets/99d2ce51-649b-4357-90d4-b24bc34aa6a0