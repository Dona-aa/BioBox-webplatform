import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db.js';

export async function GET() {
	try {
		const [rows] = await db.execute(
			`SELECT measured_at, air_temp_c, air_humidity_pct,
			        soil_moisture_pct, soil_temp_c, light_lux
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
			temperature: Number(row.air_temp_c),
			humidity: Number(row.air_humidity_pct),
			soilMoisture: Number(row.soil_moisture_pct),
			soilTemperature: Number(row.soil_temp_c),
			light: Number(row.light_lux)
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

	if (
		typeof data.temperature !== 'number' ||
		typeof data.humidity !== 'number' ||
		typeof data.soilMoisture !== 'number' ||
		typeof data.soilTemperature !== 'number' ||
		typeof data.light !== 'number'
	) {
		return json(
			{ message: 'Ungültige Sensordaten' },
			{ status: 400 }
		);
	}

	if (
		data.humidity < 0 ||
		data.humidity > 100 ||
		data.soilMoisture < 0 ||
		data.soilMoisture > 100 ||
		data.light < 0
	) {
		return json(
			{ message: 'Sensordaten außerhalb des gültigen Bereichs' },
			{ status: 400 }
		);
	}

	const measuredAt = new Date();

	try {
		await db.execute(
			`INSERT INTO sensor_measurements
				(device_id, measured_at, air_temp_c, air_humidity_pct,
				soil_moisture_pct, soil_temp_c, light_lux)
			 VALUES (?, ?, ?, ?, ?, ?, ?)`,
			[
				1,
				measuredAt,
				data.temperature,
				data.humidity,
				data.soilMoisture,
				data.soilTemperature,
				data.light
			]
		);

		return json(
			{
				message: 'Sensordaten wurden gespeichert',
				sensorData: {
					measuredAt: measuredAt.toISOString(),
					temperature: data.temperature,
					humidity: data.humidity,
					soilMoisture: data.soilMoisture,
					soilTemperature: data.soilTemperature,
					light: data.light
				}
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error('Fehler beim Speichern der Sensordaten:', error);

		return json(
			{ message: 'Sensordaten konnten nicht gespeichert werden' },
			{ status: 500 }
		);
	}
}