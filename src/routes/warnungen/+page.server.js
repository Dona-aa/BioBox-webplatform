import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db.js';
import { getLocale } from '$lib/paraglide/runtime.js';

export async function load() {
	const language = getLocale();

	const [alerts] = await db.execute(`
		SELECT
			id,
			alert_type,
			severity,
			message,
			message_de,
			message_en,
			message_sq,
			acknowledged_by,
			acknowledged_at,
			is_resolved,
			created_at,
			resolved_at
		FROM alerts
		ORDER BY created_at DESC
	`);

	for (const alert of alerts) {
		alert.message = alert['message_' + language] ?? alert.message;
	}

	return {
		alerts
	};
}

export const actions = {
	acknowledge: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(303, '/login');
		}

		const formData = await request.formData();
		const alertId = Number(formData.get('alertId'));

		if (!Number.isInteger(alertId) || alertId <= 0) {
			return fail(400);
		}

		await db.execute(
			`UPDATE alerts
			 SET acknowledged_by = ?,
			     acknowledged_at = NOW()
			 WHERE id = ?
			 AND is_resolved = FALSE`,
			[locals.user.id, alertId]
		);

		return {
			success: true
		};
	}
};