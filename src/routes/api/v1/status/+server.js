import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db.js';

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

	const allowedModes = [
		'BOOT',
		'SELFTEST',
		'AUTO',
		'MANUAL',
		'SAFE_MODE'
	];

	// Check structure and data types
	if (
		typeof data.device_id !== 'string' ||
		data.device_id.length === 0 ||
		data.device_id.length > 64 ||

		typeof data.reported_at !== 'string' ||

		!allowedModes.includes(data.mode) ||

		typeof data.estop_active !== 'boolean' ||

		typeof data.led_duty_pct !== 'number' ||
		typeof data.heater_duty_pct !== 'number' ||
		typeof data.fan_duty_pct !== 'number' ||

		(data.fan_rpm !== null &&
			!Number.isInteger(data.fan_rpm)) ||

		(data.plate_temp_c !== null &&
			typeof data.plate_temp_c !== 'number') ||

		(data.fin_temp_c !== null &&
			typeof data.fin_temp_c !== 'number') ||

		!Number.isInteger(data.pump_water_ms) ||
		!Number.isInteger(data.pump_nutrient_ms) ||

		typeof data.heartbeat_ok !== 'boolean' ||

		!Array.isArray(data.faults) ||

		typeof data.firmware_version !== 'string' ||
		data.firmware_version.length === 0
	) {
		return json(
			{ message: 'Ungültige Statusdaten' },
			{ status: 422 }
		);
	}

	// Check ranges
	if (
		data.led_duty_pct < 0 ||
		data.led_duty_pct > 100 ||

		data.heater_duty_pct < 0 ||
		data.heater_duty_pct > 100 ||

		data.fan_duty_pct < 0 ||
		data.fan_duty_pct > 100 ||

		(data.fan_rpm !== null && data.fan_rpm < 0) ||

		data.pump_water_ms < 0 ||
		data.pump_nutrient_ms < 0
	) {
		return json(
			{ message: 'Statusdaten außerhalb des gültigen Bereichs' },
			{ status: 422 }
		);
	}

	const reportedAt = new Date(data.reported_at);

	if (Number.isNaN(reportedAt.getTime())) {
		return json(
			{ message: 'Ungültiger Zeitstempel' },
			{ status: 422 }
		);
	}

	try {
		// Convert "biobox-01" to internal database ID
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
			`INSERT INTO actuator_states
				(
					device_id,
					reported_at,
					mode,
					estop_active,
					led_duty_pct,
					heater_duty_pct,
					fan_duty_pct,
					fan_rpm,
					plate_temp_c,
					fin_temp_c,
					pump_water_ms,
					pump_nutrient_ms,
					heartbeat_ok,
					faults,
					firmware_version
				)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				deviceId,
				reportedAt,
				data.mode,
				data.estop_active,
				data.led_duty_pct,
				data.heater_duty_pct,
				data.fan_duty_pct,
				data.fan_rpm,
				data.plate_temp_c,
				data.fin_temp_c,
				data.pump_water_ms,
				data.pump_nutrient_ms,
				data.heartbeat_ok,
				JSON.stringify(data.faults),
				data.firmware_version
			]
		);

		return json(
			{ message: 'Statusdaten wurden gespeichert' },
			{ status: 201 }
		);
	} catch (error) {
		if (error.code === 'ER_DUP_ENTRY') {
			return json({
				message: 'Statusdaten wurden bereits gespeichert'
			});
		}

		console.error('Fehler beim Speichern der Statusdaten:', error);

		return json(
			{ message: 'Statusdaten konnten nicht gespeichert werden' },
			{ status: 500 }
		);
	}
}