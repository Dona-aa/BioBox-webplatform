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
		typeof data.device_id !== 'number' ||
		typeof data.measured_at !== 'string' ||
		typeof data.air_temp_c !== 'number' ||
		typeof data.air_humidity_pct !== 'number' ||
		typeof data.soil_moisture_pct !== 'number' ||
		typeof data.soil_temp_c !== 'number' ||
		typeof data.light_lux !== 'number'
	) {
		return json(
			{ message: 'Ungültige Sensordaten' },
			{ status: 400 }
		);
	}

	if (
		data.air_humidity_pct < 0 ||
		data.air_humidity_pct > 100 ||
		data.soil_moisture_pct < 0 ||
		data.soil_moisture_pct > 100 ||
		data.light_lux < 0
	) {
		return json(
			{ message: 'Sensordaten außerhalb des gültigen Bereichs' },
			{ status: 400 }
		);
	}

	const measuredAt = new Date(data.measured_at);

	if (Number.isNaN(measuredAt.getTime())) {
		return json(
			{ message: 'Ungültiger Messzeitpunkt' },
			{ status: 400 }
		);
	}

	try {
		await db.execute(
			`INSERT INTO sensor_measurements
				(device_id, measured_at, air_temp_c, air_humidity_pct,
				soil_moisture_pct, soil_temp_c, light_lux)
			 VALUES (?, ?, ?, ?, ?, ?, ?)`,
			[
				data.device_id,
				measuredAt,
				data.air_temp_c,
				data.air_humidity_pct,
				data.soil_moisture_pct,
				data.soil_temp_c,
				data.light_lux
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

		if (error.code === 'ER_NO_REFERENCED_ROW_2') {
			return json(
				{ message: 'Gerät nicht gefunden' },
				{ status: 400 }
			);
		}

		console.error('Fehler beim Speichern der Sensordaten:', error);

		return json(
			{ message: 'Sensordaten konnten nicht gespeichert werden' },
			{ status: 500 }
		);
	}
}