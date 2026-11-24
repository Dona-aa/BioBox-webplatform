import { redirect, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db.js';
import * as m from '$lib/paraglide/messages.js';

export async function load({ locals }) {
	if (locals.user?.role !== 'admin') {
		throw redirect(303, '/dashboard');
	}

	const [users] = await db.execute(`
		SELECT
			id,
			username,
			email,
			role,
			created_at
		FROM users
		ORDER BY created_at DESC
	`);

	return {
		users
	};
}

export const actions = {
	changeRole: async ({ request, locals }) => {
		if (locals.user?.role !== 'admin') {
			return fail(403, {
				error: m.admin_error_permission()
			});
		}

		const formData = await request.formData();

		const userId = Number(formData.get('userId'));
		const role = formData.get('role');

		if (!Number.isInteger(userId) || userId <= 0) {
			return fail(400, {
				error: m.admin_error_missing_user()
			});
		}

		// Administratoren dürfen ihre eigene Rolle nicht ändern.
		if (userId === Number(locals.user.id)) {
			return fail(403, {
				error: m.admin_error_own_role()
			});
		}

		if (!['viewer', 'admin'].includes(role)) {
			return fail(400, {
				error: m.admin_error_invalid_role()
			});
		}

		const [users] = await db.execute(
			`SELECT role
			 FROM users
			 WHERE id = ?
			 LIMIT 1`,
			[userId]
		);

		if (users.length === 0) {
			return fail(404, {
				error: m.admin_error_user_not_found()
			});
		}

		// Wenn die Rolle schon gleich ist, passiert nichts.
		if (users[0].role === role) {
			return {};
		}

		await db.execute(
			`UPDATE users
			 SET role = ?
			 WHERE id = ?`,
			[role, userId]
		);

		return {
			success: true
		};
	}
};