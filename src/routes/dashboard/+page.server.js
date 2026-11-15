import { db } from '$lib/server/db.js';

export async function load({ fetch }) {
	// Aktuelle Sensordaten
	const telemetryResponse = await fetch('/api/v1/telemetry');
	const telemetry = await telemetryResponse.json();

	// Aktueller Komponentenstatus
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

	if (
		telemetryResponse.ok &&
		telemetry.message !== 'Keine Sensordaten vorhanden'
	) {
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

	// Aktuelle Warnung
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

	// Prüfen, ob historische Daten aus den letzten 24 Stunden existieren
	const [periodRows] = await db.execute(`
		SELECT
			MAX(measured_at) AS latest_measurement,
			CASE
				WHEN MAX(measured_at) >= DATE_SUB(UTC_TIMESTAMP(), INTERVAL 24 HOUR)
				THEN 1
				ELSE 0
			END AS has_recent_data
		FROM sensor_measurements
	`);

	const latestMeasurement = periodRows[0].latest_measurement;
	const hasRecentData = Number(periodRows[0].has_recent_data) === 1;

	let history = [];
	let chartEnd = Date.now();

	if (latestMeasurement) {
		if (hasRecentData) {
			// Normale Anzeige: letzte 24 Stunden
			const [rows] = await db.execute(`
				SELECT
					measured_at,
					air_temp_c,
					air_humidity_pct,
					soil_moisture_pct,
					light_lux
				FROM sensor_measurements
				WHERE measured_at >= DATE_SUB(UTC_TIMESTAMP(), INTERVAL 24 HOUR)
				  AND measured_at <= UTC_TIMESTAMP()
				ORDER BY measured_at ASC
			`);

			history = rows;
		} else {
			// Entwicklungsmodus: letzte 24 Stunden vor der neuesten Messung
			const [rows] = await db.execute(`
				SELECT
					measured_at,
					air_temp_c,
					air_humidity_pct,
					soil_moisture_pct,
					light_lux
				FROM sensor_measurements
				WHERE measured_at >= DATE_SUB(
					(SELECT MAX(measured_at) FROM sensor_measurements),
					INTERVAL 24 HOUR
				)
				AND measured_at <= (
					SELECT MAX(measured_at) FROM sensor_measurements
				)
				ORDER BY measured_at ASC
			`);

			history = rows;

			chartEnd = new Date(latestMeasurement).getTime();
		}
	}

	// Daten für die Diagramme vorbereiten
	const chartHistory = history.map((row) => ({
		time: new Date(row.measured_at).getTime(),

		temperature:
			row.air_temp_c == null ? null : Number(row.air_temp_c),

		humidity:
			row.air_humidity_pct == null ? null : Number(row.air_humidity_pct),

		soilMoisture:
			row.soil_moisture_pct == null ? null : Number(row.soil_moisture_pct),

		light:
			row.light_lux == null ? null : Number(row.light_lux)
	}));

	return {
		sensorData,
		statusData: status,
		latestAlert: alerts.length > 0 ? alerts[0] : null,

		chartHistory,
		chartEnd,
		hasRecentData
	};
}