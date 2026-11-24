import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { db } from '$lib/server/db.js';
import { createSession } from '$lib/server/auth.js';
import * as m from '$lib/paraglide/messages.js';

export async function load({ locals }) {
	if (locals.user) {
		throw redirect(303, '/dashboard');
	}
}

export const actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();

		const email = formData.get('email');
		const password = formData.get('password');

		if (!email || !password) {
			return fail(400, {
				error: m.login_missing()
			});
		}

		const [users] = await db.execute(
			`SELECT id, username, email, password_hash, role
			 FROM users
			 WHERE email = ?
			 LIMIT 1`,
			[email]
		);

		if (users.length === 0) {
			return fail(400, {
				error: m.login_invalid()
			});
		}

		const user = users[0];

		const passwordCorrect = await bcrypt.compare(
			password,
			user.password_hash
		);

		if (!passwordCorrect) {
			return fail(400, {
				error: m.login_invalid()
			});
		}

		await createSession(user.id, cookies);

		throw redirect(303, '/dashboard');
	}
};