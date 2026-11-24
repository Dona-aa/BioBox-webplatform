import { fail } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { db } from '$lib/server/db.js';
import * as m from '$lib/paraglide/messages.js';

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const username = String(formData.get('username') ?? '').trim();
		const email = String(formData.get('email') ?? '').trim().toLowerCase();
		const password = String(formData.get('password') ?? '');

		if (!username || !email || !password) {
			return fail(400, { error: m.register_missing() });
		}

		if (username.length < 3) {
			return fail(400, { error: m.register_username_short() });
		}

		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return fail(400, { error: m.register_email_invalid() });
		}

		if (password.length < 8) {
			return fail(400, { error: m.register_password_short() });
		}

		const [users] = await db.execute(
			'SELECT id FROM users WHERE username = ? OR email = ? LIMIT 1',
			[username, email]
		);

		if (users.length > 0) {
			return fail(400, { error: m.register_account_taken() });
		}

		const passwordHash = await bcrypt.hash(password, 10);

		await db.execute(
			'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
			[username, email, passwordHash]
		);

		return { success: true };
	}
};