import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db.js';

export async function POST({ params }) {
	const alertId = Number(params.id);

	if (!alertId) {
		return json(
			{ error: 'Ungültige Warnungs-ID.' },
			{ status: 400 }
		);
	}

	const [alerts] = await db.execute(
		`SELECT id, is_resolved
		 FROM alerts
		 WHERE id = ?
		 LIMIT 1`,
		[alertId]
	);

	if (alerts.length === 0) {
		return json(
			{ error: 'Warnung wurde nicht gefunden.' },
			{ status: 404 }
		);
	}

	if (alerts[0].is_resolved) {
		return json({
			message: 'Warnung ist bereits erledigt.',
			alert_id: alertId
		});
	}

	await db.execute(
		`UPDATE alerts
		 SET
			is_resolved = TRUE,
			resolved_at = NOW()
		 WHERE id = ?`,
		[alertId]
	);

	return json({
		message: 'Warnung wurde als erledigt markiert.',
		alert_id: alertId
	});
}