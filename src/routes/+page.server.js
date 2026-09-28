export async function load({ fetch }) {
	const response = await fetch('/api/v1/telemetry');
	const telemetry = await response.json();

	return {
		sensorData: {
			measuredAt: telemetry.measured_at,
			temperature: telemetry.air_temp_c,
			humidity: telemetry.air_humidity_pct,
			soilMoisture: telemetry.soil_moisture_pct,
			soilTemperature: telemetry.soil_temp_c,
			light: telemetry.light_lux,
			dli: telemetry.dli_est_mol,
			sensorHealth: telemetry.sensor_health
		}
	};
}