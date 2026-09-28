# BioBox API

The BioBox API uses version 1 under `/api/v1`.

The old `/api/sensors` endpoint is retired.

---

# 1. Telemetry API

## POST /api/v1/telemetry

Used by the ESP32 to send sensor measurements.

### Content-Type

application/json

### JSON format

```json
{
  "device_id": "biobox-01",
  "measured_at": "2026-09-28T14:30:00Z",
  "air_temp_c": 26.5,
  "air_humidity_pct": 60,
  "soil_moisture_pct": 45,
  "soil_temp_c": 23.0,
  "light_lux": 1000,
  "dli_est_mol": 12.5,
  "sensor_health": {
    "bme280": "ok",
    "ds18b20": "ok",
    "veml7700": "ok",
    "soil": "ok",
    "i2c_recoveries": 0,
    "buffer_dropped": 0,
    "uptime_s": 86000
  }
}
```

## Fields

- `device_id`: device code, for example `biobox-01`
- `measured_at`: measurement time in ISO 8601 UTC
- `air_temp_c`: air temperature in °C
- `air_humidity_pct`: air humidity in %
- `soil_moisture_pct`: soil moisture in %
- `soil_temp_c`: soil temperature in °C
- `light_lux`: light intensity in lux
- `dli_est_mol`: estimated DLI
- `sensor_health`: detailed sensor status information

All measured sensor fields may be `null`.

`null` means the value is unknown or unavailable.

`0` means the sensor actually measured zero.

## Sensor ranges

- `air_temp_c`: -10 to 60
- `air_humidity_pct`: 0 to 100
- `soil_moisture_pct`: 0 to 100
- `soil_temp_c`: -10 to 60
- `light_lux`: 0 to 200000
- `dli_est_mol`: 0 to 80

## Sensor health states

Possible sensor states:

- `ok`
- `stale`
- `fault`
- `uncalibrated`

## Successful response

```json
{
  "message": "Sensordaten wurden gespeichert"
}
```

## Duplicate response

```json
{
  "message": "Sensordaten wurden bereits gespeichert"
}
```

---

# 2. Telemetry GET API

## Latest measurement

```text
GET /api/v1/telemetry
```

Returns the newest stored measurement.

## Measurements in a time range

```text
GET /api/v1/telemetry?from=2026-09-28T10:00:00Z&to=2026-09-28T11:00:00Z
```

Returns all telemetry rows inside the requested UTC interval.

The measurements are returned in chronological order.

---

# 3. Status API

## POST /api/v1/status

Used by the ESP32 to send actuator and system state.

### JSON format

```json
{
  "device_id": "biobox-01",
  "reported_at": "2026-09-28T14:30:00Z",
  "mode": "AUTO",
  "estop_active": false,
  "led_duty_pct": 70,
  "heater_duty_pct": 35,
  "fan_duty_pct": 50,
  "fan_rpm": 1450,
  "plate_temp_c": 31.5,
  "fin_temp_c": 38.2,
  "pump_water_ms": 0,
  "pump_nutrient_ms": 0,
  "heartbeat_ok": true,
  "faults": [],
  "firmware_version": "1.0.0"
}
```

## Operating modes

- `BOOT`
- `SELFTEST`
- `AUTO`
- `MANUAL`
- `SAFE_MODE`

## Duty cycle fields

The following values are percentages from 0 to 100:

- `led_duty_pct`
- `heater_duty_pct`
- `fan_duty_pct`

The duty values represent the mean duty over the preceding interval.

## Successful response

```json
{
  "message": "Statusdaten wurden gespeichert"
}
```

---

# 4. Status GET API

## Latest status

```text
GET /api/v1/status
```

Returns the newest actuator state.

## Status in a time range

```text
GET /api/v1/status?from=2026-09-28T10:00:00Z&to=2026-09-28T11:00:00Z
```

The response contains:

```json
{
  "state_before_from": {},
  "states": []
}
```

`state_before_from` contains the last known actuator state before the requested interval.

`states` contains all actuator state changes inside the requested interval.

This allows the Digital Twin to know the actuator state from the beginning of the requested time range.

---

# 5. Timing

Sensor telemetry is sent approximately every 30 seconds.

All timestamps use ISO 8601 UTC.

Example:

```text
2026-09-28T14:30:00Z
```

Buffered measurements keep their original measurement timestamp.