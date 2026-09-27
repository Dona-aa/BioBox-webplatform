# BioBox Telemetry API

## Endpoint

POST /api/sensors

## Content-Type

application/json

## JSON format

```json
{
  "device_id": 1,
  "measured_at": "2026-09-27T15:52:45.849Z",
  "air_temp_c": 27.5,
  "air_humidity_pct": 64,
  "soil_moisture_pct": 41,
  "soil_temp_c": 23.6,
  "light_lux": 1120,
  "dli_est_mol": 13.1,
  "sensor_health": "ok"
}