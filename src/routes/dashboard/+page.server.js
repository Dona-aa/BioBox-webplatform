import { redirect } from '@sveltejs/kit';
import { createHash } from 'node:crypto';
import { db } from '$lib/server/db.js';

export async function load({ fetch, cookies }) {

	// Read the session token from the browser.
	const sessionToken = cookies.get('session');

	// No session cookie = not logged in.
	if (!sessionToken) {
		throw redirect(303, '/login');
	}

	// Create the same hash that we stored in MySQL.
	const tokenHash = createHash('sha256')
		.update(sessionToken)
		.digest('hex');

	// Check whether the session exists and is still valid.
	const [sessions] = await db.execute(
		`SELECT sessions.token_hash
		 FROM sessions
		 WHERE sessions.token_hash = ?
		 AND sessions.expires_at > NOW()
		 LIMIT 1`,
		[tokenHash]
	);

	// Invalid or expired session.
	if (sessions.length === 0) {
		cookies.delete('session', {
			path: '/'
		});

		throw redirect(303, '/login');
	}

	// Load the newest telemetry data.
	const telemetryResponse = await fetch('/api/v1/telemetry');
	const telemetry = await telemetryResponse.json();

	// Load the newest component/status data.
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