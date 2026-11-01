import { db } from '$lib/server/db.js';

export async function load({ fetch }) {
	const telemetryResponse = await fetch('/api/v1/telemetry');
	const telemetry = await telemetryResponse.json();

	const statusResponse = await fetch('/api/v1/status');
	const status = await statusResponse.json();

	let sensorData = {
		temperature: null,
		humidity: null,
		soilMoisture: null,
		soilTemperature: null,
		light: null,
		dli: null,
		measuredAt: null
	};

	if (telemetry.message !== 'Keine Sensordaten vorhanden') {
		sensorData = {
			temperature: telemetry.air_temp_c,
			humidity: telemetry.air_humidity_pct,
			soilMoisture: telemetry.soil_moisture_pct,
			soilTemperature: telemetry.soil_temp_c,
			light: telemetry.light_lux,
			dli: telemetry.dli_est_mol,
			measuredAt: telemetry.measured_at
		};
	}

	const [alerts] = await db.execute(`
		SELECT
			id,
			alert_type,
			severity,
			message,
			created_at
		FROM alerts
		WHERE is_resolved = FALSE
		ORDER BY created_at DESC
		LIMIT 1
	`);

	return {
		sensorData,
		statusData: status,
		latestAlert: alerts.length > 0 ? alerts[0] : null
	};
}