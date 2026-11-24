import { fail, redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { randomBytes, createHash } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { db } from '$lib/server/db.js';
import * as m from '$lib/paraglide/messages.js';

export const actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		if (!email || !password) {
			return fail(400, { error: m.login_missing() });
		}

		const [users] = await db.execute(
			'SELECT id, username, email, password_hash, role FROM users WHERE email = ? LIMIT 1',
			[email]
		);

		if (users.length === 0) {
			return fail(400, { error: m.login_invalid() });
		}

		const user = users[0];
		const passwordCorrect = await bcrypt.compare(password, user.password_hash);

		if (!passwordCorrect) {
			return fail(400, { error: m.login_invalid() });
		}

		// In der Datenbank wird nur der Hash des Session-Tokens gespeichert.
		const sessionToken = randomBytes(32).toString('hex');
		const tokenHash = createHash('sha256').update(sessionToken).digest('hex');

		const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

		await db.execute(
			'INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)',
			[tokenHash, user.id, expiresAt]
		);

		cookies.set('session', sessionToken, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: !dev,
			maxAge: 60 * 60 * 24 * 7
		});

		throw redirect(303, '/dashboard');
	}
};