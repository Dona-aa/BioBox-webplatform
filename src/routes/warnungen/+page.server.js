import { fail, redirect } from '@sveltejs/kit';
import { createHash } from 'node:crypto';
import { db } from '$lib/server/db.js';

export async function load() {
	const [alerts] = await db.execute(`
		SELECT
			id,
			alert_type,
			severity,
			message,
			acknowledged_by,
			acknowledged_at,
			is_resolved,
			created_at,
			resolved_at
		FROM alerts
		ORDER BY created_at DESC
	`);

	return {
		alerts
	};
}

export const actions = {
	acknowledge: async ({ request, cookies }) => {
		const sessionToken = cookies.get('session');

		if (!sessionToken) {
			throw redirect(303, '/login');
		}

		const tokenHash = createHash('sha256')
			.update(sessionToken)
			.digest('hex');

		const [sessions] = await db.execute(
			`SELECT user_id
			 FROM sessions
			 WHERE token_hash = ?
			 AND expires_at > NOW()
			 LIMIT 1`,
			[tokenHash]
		);

		if (sessions.length === 0) {
			throw redirect(303, '/login');
		}

		const formData = await request.formData();
		const alertId = formData.get('alertId');

		if (!alertId) {
			return fail(400);
		}

		await db.execute(
			`UPDATE alerts
			 SET acknowledged_by = ?,
			     acknowledged_at = NOW()
			 WHERE id = ?
			 AND is_resolved = FALSE`,
			[sessions[0].user_id, alertId]
		);

		return {
			success: true
		};
	}
};