import { fail } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { db } from '$lib/server/db.js';

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const username = String(formData.get('username') ?? '').trim();
		const email = String(formData.get('email') ?? '').trim().toLowerCase();
		const password = String(formData.get('password') ?? '');

		// Alle Felder müssen ausgefüllt sein
		if (!username || !email || !password) {
			return fail(400, {
				error: 'Bitte alle Felder ausfüllen.'
			});
		}

		// Benutzername prüfen
		if (username.length < 3) {
			return fail(400, {
				error: 'Der Benutzername muss mindestens 3 Zeichen lang sein.'
			});
		}

		// E-Mail-Adresse prüfen
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return fail(400, {
				error: 'Bitte eine gültige E-Mail-Adresse eingeben.'
			});
		}

		// Passwort prüfen
		if (password.length < 8) {
			return fail(400, {
				error: 'Das Passwort muss mindestens 8 Zeichen lang sein.'
			});
		}

		// Prüfen, ob Benutzername oder E-Mail bereits existieren
		const [users] = await db.execute(
			'SELECT id FROM users WHERE username = ? OR email = ? LIMIT 1',
			[username, email]
		);

		if (users.length > 0) {
			return fail(400, {
				error: 'Benutzername oder E-Mail ist bereits vergeben.'
			});
		}

		// Passwort sicher hashen
		const passwordHash = await bcrypt.hash(password, 10);

		// Benutzerkonto speichern
		await db.execute(
			'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
			[username, email, passwordHash]
		);

		return {
			success: true
		};
	}
};