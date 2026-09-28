import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db.js';

function formatStatus(row) {
	return {
		device_id: row.device_code,
		reported_at: new Date(row.reported_at).toISOString(),
		mode: row.mode,
		estop_active: Boolean(row.estop_active),
		led_duty_pct: Number(row.led_duty_pct),
		heater_duty_pct: Number(row.heater_duty_pct),
		fan_duty_pct: Number(row.fan_duty_pct),

		fan_rpm:
			row.fan_rpm === null
				? null
				: Number(row.fan_rpm),

		plate_temp_c:
			row.plate_temp_c === null
				? null
				: Number(row.plate_temp_c),

		fin_temp_c:
			row.fin_temp_c === null
				? null
				: Number(row.fin_temp_c),

		pump_water_ms: Number(row.pump_water_ms),
		pump_nutrient_ms: Number(row.pump_nutrient_ms),
		heartbeat_ok: Boolean(row.heartbeat_ok),
		faults: row.faults,
		firmware_version: row.firmware_version
	};
}

export async function GET({ url }) {
	try {
		const from = url.searchParams.get('from');
		const to = url.searchParams.get('to');

		// No range -> newest actuator state
		if (!from && !to) {
			const [rows] = await db.execute(
				`SELECT
					d.device_code,
					a.reported_at,
					a.mode,
					a.estop_active,
					a.led_duty_pct,
					a.heater_duty_pct,
					a.fan_duty_pct,
					a.fan_rpm,
					a.plate_temp_c,
					a.fin_temp_c,
					a.pump_water_ms,
					a.pump_nutrient_ms,
					a.heartbeat_ok,
					a.faults,
					a.firmware_version
				 FROM actuator_states a
				 JOIN devices d ON d.id = a.device_id
				 ORDER BY a.reported_at DESC
				 LIMIT 1`
			);

			if (rows.length === 0) {
				return json(
					{ message: 'Keine Statusdaten vorhanden' },
					{ status: 404 }
				);
			}

			return json(formatStatus(rows[0]));
		}

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

		// Last known state before the requested interval
		const [beforeRows] = await db.execute(
			`SELECT
				d.device_code,
				a.reported_at,
				a.mode,
				a.estop_active,
				a.led_duty_pct,
				a.heater_duty_pct,
				a.fan_duty_pct,
				a.fan_rpm,
				a.plate_temp_c,
				a.fin_temp_c,
				a.pump_water_ms,
				a.pump_nutrient_ms,
				a.heartbeat_ok,
				a.faults,
				a.firmware_version
			 FROM actuator_states a
			 JOIN devices d ON d.id = a.device_id
			 WHERE a.reported_at < ?
			 ORDER BY a.reported_at DESC
			 LIMIT 1`,
			[fromDate]
		);

		// All state changes inside the interval
		const [rangeRows] = await db.execute(
			`SELECT
				d.device_code,
				a.reported_at,
				a.mode,
				a.estop_active,
				a.led_duty_pct,
				a.heater_duty_pct,
				a.fan_duty_pct,
				a.fan_rpm,
				a.plate_temp_c,
				a.fin_temp_c,
				a.pump_water_ms,
				a.pump_nutrient_ms,
				a.heartbeat_ok,
				a.faults,
				a.firmware_version
			 FROM actuator_states a
			 JOIN devices d ON d.id = a.device_id
			 WHERE a.reported_at BETWEEN ? AND ?
			 ORDER BY a.reported_at ASC`,
			[fromDate, toDate]
		);

		return json({
			state_before_from:
				beforeRows.length === 0
					? null
					: formatStatus(beforeRows[0]),

			states: rangeRows.map(formatStatus)
		});
	} catch (error) {
		console.error('Fehler beim Laden der Statusdaten:', error);

		return json(
			{ message: 'Statusdaten konnten nicht geladen werden' },
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