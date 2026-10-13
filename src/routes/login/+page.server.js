import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { randomBytes, createHash } from 'node:crypto';
import { db } from '$lib/server/db.js';

export const actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();

		const email = formData.get('email');
		const password = formData.get('password');

		if (!email || !password) {
			return fail(400, {
				error: 'Bitte E-Mail und Passwort eingeben.'
			});
		}

		const [users] = await db.execute(
			'SELECT id, username, email, password_hash, role FROM users WHERE email = ? LIMIT 1',
			[email]
		);

		if (users.length === 0) {
			return fail(400, {
				error: 'E-Mail oder Passwort ist falsch.'
			});
		}

		const user = users[0];

		const passwordCorrect = await bcrypt.compare(
			password,
			user.password_hash
		);

		if (!passwordCorrect) {
			return fail(400, {
				error: 'E-Mail oder Passwort ist falsch.'
			});
		}

		// Create a random session token.
		const sessionToken = randomBytes(32).toString('hex');

		// Store only the hash in the database.
		const tokenHash = createHash('sha256')
			.update(sessionToken)
			.digest('hex');

		// Session is valid for 7 days.
		const expiresAt = new Date(
			Date.now() + 7 * 24 * 60 * 60 * 1000
		);

		await db.execute(
			'INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)',
			[tokenHash, user.id, expiresAt]
		);

		// Store the real token in the browser cookie.
		cookies.set('session', sessionToken, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: false,
			maxAge: 60 * 60 * 24 * 7
		});

		throw redirect(303, '/dashboard');
	}
};