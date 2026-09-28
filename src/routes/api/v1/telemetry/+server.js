import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db.js';

export async function GET() {
	try {
		const [rows] = await db.execute(
			`SELECT measured_at, air_temp_c, air_humidity_pct,
			        soil_moisture_pct, soil_temp_c, light_lux,
			        dli_est_mol, sensor_health
			 FROM sensor_measurements
			 WHERE device_id = ?
			 ORDER BY measured_at DESC
			 LIMIT 1`,
			[1]
		);

		if (rows.length === 0) {
			return json(
				{ message: 'Keine Sensordaten vorhanden' },
				{ status: 404 }
			);
		}

		const row = rows[0];

		return json({
	measuredAt: new Date(row.measured_at).toISOString(),

	temperature:
		row.air_temp_c === null
			? null
			: Number(row.air_temp_c),

	humidity:
		row.air_humidity_pct === null
			? null
			: Number(row.air_humidity_pct),

	soilMoisture:
		row.soil_moisture_pct === null
			? null
			: Number(row.soil_moisture_pct),

	soilTemperature:
		row.soil_temp_c === null
			? null
			: Number(row.soil_temp_c),

	light:
		row.light_lux === null
			? null
			: Number(row.light_lux),

	dli:
		row.dli_est_mol === null
			? null
			: Number(row.dli_est_mol),

	sensorHealth: row.sensor_health
});
	} catch (error) {
		console.error('Fehler beim Laden der Sensordaten:', error);

		return json(
			{ message: 'Sensordaten konnten nicht geladen werden' },
			{ status: 500 }
		);
	}
}

export async function POST({ request }) {
	let data;

	try {
		data = await request.json();
	} catch {
		return json(
			{ message: 'Ungültiges JSON' },
			{ status: 400 }
		);
	}

	// Check the structure and data types of the telemetry
if (
	typeof data.device_id !== 'string' ||
	data.device_id.length === 0 ||
	data.device_id.length > 64 ||
	typeof data.measured_at !== 'string' ||

	(data.air_temp_c !== null &&
		typeof data.air_temp_c !== 'number') ||

	(data.air_humidity_pct !== null &&
		typeof data.air_humidity_pct !== 'number') ||

	(data.soil_moisture_pct !== null &&
		typeof data.soil_moisture_pct !== 'number') ||

	(data.soil_temp_c !== null &&
		typeof data.soil_temp_c !== 'number') ||

	(data.light_lux !== null &&
		typeof data.light_lux !== 'number') ||

	(data.dli_est_mol !== null &&
		typeof data.dli_est_mol !== 'number') ||

	typeof data.sensor_health !== 'object' ||
	data.sensor_health === null ||
	Array.isArray(data.sensor_health)
) {
	return json(
		{ message: 'Ungültige Sensordaten' },
		{ status: 422 }
	);
}

	// Check Grid's defined measurement ranges
	if (
	(data.air_temp_c !== null &&
		(data.air_temp_c < -10 || data.air_temp_c > 60)) ||

	(data.air_humidity_pct !== null &&
		(data.air_humidity_pct < 0 || data.air_humidity_pct > 100)) ||

	(data.soil_moisture_pct !== null &&
		(data.soil_moisture_pct < 0 || data.soil_moisture_pct > 100)) ||

	(data.soil_temp_c !== null &&
		(data.soil_temp_c < -10 || data.soil_temp_c > 60)) ||

	(data.light_lux !== null &&
		(data.light_lux < 0 || data.light_lux > 200000)) ||

	(data.dli_est_mol !== null &&
		(data.dli_est_mol < 0 || data.dli_est_mol > 80))
) {
	return json(
		{ message: 'Sensordaten außerhalb des gültigen Bereichs' },
		{ status: 422 }
	);
}

	const allowedSensorStates = [
		'ok',
		'stale',
		'fault',
		'uncalibrated'
	];

	if (
		!allowedSensorStates.includes(data.sensor_health.bme280) ||
		!allowedSensorStates.includes(data.sensor_health.ds18b20) ||
		!allowedSensorStates.includes(data.sensor_health.veml7700) ||
		!allowedSensorStates.includes(data.sensor_health.soil) ||
		!Number.isInteger(data.sensor_health.i2c_recoveries) ||
		data.sensor_health.i2c_recoveries < 0 ||
		!Number.isInteger(data.sensor_health.buffer_dropped) ||
		data.sensor_health.buffer_dropped < 0 ||
		!Number.isInteger(data.sensor_health.uptime_s) ||
		data.sensor_health.uptime_s < 0
	) {
		return json(
			{ message: 'Ungültiger Sensorstatus' },
			{ status: 422 }
		);
	}

	const measuredAt = new Date(data.measured_at);

	if (Number.isNaN(measuredAt.getTime())) {
		return json(
			{ message: 'Ungültiger Messzeitpunkt' },
			{ status: 422 }
		);
	}

	try {
		const [devices] = await db.execute(
			`SELECT id
			 FROM devices
			 WHERE device_code = ?
			 LIMIT 1`,
			[data.device_id]
		);

		if (devices.length === 0) {
			return json(
				{ message: 'Gerät nicht gefunden' },
				{ status: 400 }
			);
		}

		const deviceId = devices[0].id;

		await db.execute(
			`INSERT INTO sensor_measurements
				(device_id, measured_at, air_temp_c, air_humidity_pct,
				soil_moisture_pct, soil_temp_c, light_lux,
				dli_est_mol, sensor_health)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				deviceId,
				measuredAt,
				data.air_temp_c,
				data.air_humidity_pct,
				data.soil_moisture_pct,
				data.soil_temp_c,
				data.light_lux,
				data.dli_est_mol,
				JSON.stringify(data.sensor_health)
			]
		);

		return json(
			{ message: 'Sensordaten wurden gespeichert' },
			{ status: 201 }
		);
	} catch (error) {
		if (error.code === 'ER_DUP_ENTRY') {
			return json({
				message: 'Sensordaten wurden bereits gespeichert'
			});
		}

		console.error('Fehler beim Speichern der Sensordaten:', error);

		return json(
			{ message: 'Sensordaten konnten nicht gespeichert werden' },
			{ status: 500 }
		);
	}
}