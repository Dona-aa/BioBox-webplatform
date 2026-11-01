import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db.js';

export async function POST({ request }) {
	const data = await request.json();

	const {
		device_id,
		alert_type,
		severity,
		message
	} = data;

	if (!device_id) {
		return json(
			{ error: 'device_id fehlt.' },
			{ status: 400 }
		);
	}

	if (!alert_type) {
		return json(
			{ error: 'alert_type fehlt.' },
			{ status: 400 }
		);
	}

	if (!message) {
		return json(
			{ error: 'message fehlt.' },
			{ status: 400 }
		);
	}

	const allowedSeverities = [
		'info',
		'warning',
		'critical'
	];

	if (
		severity &&
		!allowedSeverities.includes(severity)
	) {
		return json(
			{ error: 'Ungültiger severity-Wert.' },
			{ status: 400 }
		);
	}

	const [devices] = await db.execute(
		`SELECT id
		 FROM devices
		 WHERE device_code = ?
		 LIMIT 1`,
		[device_id]
	);

	if (devices.length === 0) {
		return json(
			{ error: 'Gerät wurde nicht gefunden.' },
			{ status: 404 }
		);
	}

	const [result] = await db.execute(
		`INSERT INTO alerts (
			device_id,
			alert_type,
			severity,
			message
		)
		VALUES (?, ?, ?, ?)`,
		[
			devices[0].id,
			alert_type,
			severity ?? 'warning',
			message
		]
	);

	return json(
		{
			message: 'Warnung wurde gespeichert.',
			alert_id: result.insertId
		},
		{ status: 201 }
	);
}