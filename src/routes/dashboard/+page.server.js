export async function load({ fetch }) {
    const telemetryResponse = await fetch('/api/v1/telemetry');
    const telemetry = await telemetryResponse.json();

    const statusResponse = await fetch('/api/v1/status');
    const status = await statusResponse.json();

    const sensorData =
        telemetry.message === 'Keine Sensordaten vorhanden'
            ? {
                  measuredAt: null,
                  temperature: null,
                  humidity: null,
                  soilMoisture: null,
                  soilTemperature: null,
                  light: null,
                  dli: null,
                  sensorHealth: null
              }
            : {
                  measuredAt: telemetry.measured_at,
                  temperature: telemetry.air_temp_c,
                  humidity: telemetry.air_humidity_pct,
                  soilMoisture: telemetry.soil_moisture_pct,
                  soilTemperature: telemetry.soil_temp_c,
                  light: telemetry.light_lux,
                  dli: telemetry.dli_est_mol,
                  sensorHealth: telemetry.sensor_health
              };

    return {
        sensorData,
        statusData: status
    };
}