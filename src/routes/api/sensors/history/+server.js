import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db.js';

export async function GET() {
	const [rows] = await db.execute(
		`SELECT measured_at, air_temp_c, air_humidity_pct,
		        soil_moisture_pct, soil_temp_c, light_lux
		 FROM sensor_measurements
		 WHERE device_id = ?
		 ORDER BY measured_at DESC
		 LIMIT 20`,
		[1]
	);

	const sensorHistory = rows.map((row) => ({
		measuredAt: new Date(row.measured_at).toISOString(),
		temperature: Number(row.air_temp_c),
		humidity: Number(row.air_humidity_pct),
		soilMoisture: Number(row.soil_moisture_pct),
		soilTemperature: Number(row.soil_temp_c),
		light: Number(row.light_lux)
	}));

	return json(sensorHistory.reverse());
}