import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db.js';

export async function GET({ url }) {
	try {
		const from = url.searchParams.get('from');
		const to = url.searchParams.get('to');

		// Range query
		if (from || to) {
			if (!from || !to) {
				return json(
					{ message: 'from und to müssen gemeinsam angegeben werden' },
					{ status: 422 }
				);
			}

			const fromDate = new Date(from);
			const toDate = new Date(to);

			if (
				Number.isNaN(fromDate.getTime()) ||
				Number.isNaN(toDate.getTime()) ||
				fromDate > toDate
			) {
				return json(
					{ message: 'Ungültiger Zeitraum' },
					{ status: 422 }
				);
			}

			const [rows] = await db.execute(
				`SELECT
					d.device_code,
					sm.measured_at,
					sm.air_temp_c,
					sm.air_humidity_pct,
					sm.soil_moisture_pct,
					sm.soil_temp_c,
					sm.light_lux,
					sm.dli_est_mol,
					sm.sensor_health
				 FROM sensor_measurements sm
				 JOIN devices d ON d.id = sm.device_id
				 WHERE sm.measured_at BETWEEN ? AND ?
				 ORDER BY sm.measured_at ASC`,
				[fromDate, toDate]
			);

			return json(
				rows.map((row) => ({
					device_id: row.device_code,
					measured_at: new Date(row.measured_at).toISOString(),

					air_temp_c:
						row.air_temp_c === null
							? null
							: Number(row.air_temp_c),

					air_humidity_pct:
						row.air_humidity_pct === null
							? null
							: Number(row.air_humidity_pct),

					soil_moisture_pct:
						row.soil_moisture_pct === null
							? null
							: Number(row.soil_moisture_pct),

					soil_temp_c:
						row.soil_temp_c === null
							? null
							: Number(row.soil_temp_c),

					light_lux:
						row.light_lux === null
							? null
							: Number(row.light_lux),

					dli_est_mol:
						row.dli_est_mol === null
							? null
							: Number(row.dli_est_mol),

					sensor_health: row.sensor_health
				}))
			);
		}

		// No from/to -> return newest measurement
		const [rows] = await db.execute(
			`SELECT
				d.device_code,
				sm.measured_at,
				sm.air_temp_c,
				sm.air_humidity_pct,
				sm.soil_moisture_pct,
				sm.soil_temp_c,
				sm.light_lux,
				sm.dli_est_mol,
				sm.sensor_health
			 FROM sensor_measurements sm
			 JOIN devices d ON d.id = sm.device_id
			 ORDER BY sm.measured_at DESC
			 LIMIT 1`
		);

		if (rows.length === 0) {
			return json(
				{ message: 'Keine Sensordaten vorhanden' },
				{ status: 404 }
			);
		}

		const row = rows[0];

		return json({
			device_id: row.device_code,
			measured_at: new Date(row.measured_at).toISOString(),

			air_temp_c:
				row.air_temp_c === null
					? null
					: Number(row.air_temp_c),

			air_humidity_pct:
				row.air_humidity_pct === null
					? null
					: Number(row.air_humidity_pct),

			soil_moisture_pct:
				row.soil_moisture_pct === null
					? null
					: Number(row.soil_moisture_pct),

			soil_temp_c:
				row.soil_temp_c === null
					? null
					: Number(row.soil_temp_c),

			light_lux:
				row.light_lux === null
					? null
					: Number(row.light_lux),

			dli_est_mol:
				row.dli_est_mol === null
					? null
					: Number(row.dli_est_mol),

			sensor_health: row.sensor_health
		});
	} catch (error) {
		console.error('Fehler beim Laden der Telemetriedaten:', error);

		return json(
			{ message: 'Telemetriedaten konnten nicht geladen werden' },
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