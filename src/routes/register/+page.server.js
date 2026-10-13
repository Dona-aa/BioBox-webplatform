import { fail } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { db } from '$lib/server/db.js';

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const username = formData.get('username');
		const email = formData.get('email');
		const password = formData.get('password');

		if (!username || !email || !password) {
			return fail(400, {
				error: 'Bitte alle Felder ausfüllen.'
			});
		}

		const [users] = await db.execute(
			'SELECT id FROM users WHERE username = ? OR email = ? LIMIT 1',
			[username, email]
		);

		if (users.length > 0) {
			return fail(400, {
				error: 'Benutzername oder E-Mail ist bereits vergeben.'
			});
		}

		const passwordHash = await bcrypt.hash(password, 10);

		await db.execute(
			'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
			[username, email, passwordHash]
		);

		return {
			success: true
		};
	}
};