import { randomBytes, createHash } from 'node:crypto';
import { dev } from '$app/environment';
import { db } from '$lib/server/db.js';

// Session-Token hashen
function hashToken(token) {
	return createHash('sha256').update(token).digest('hex');
}

// Neue Session erstellen
export async function createSession(userId, cookies) {
	const token = randomBytes(32).toString('hex');
	const tokenHash = hashToken(token);

	const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

	await db.execute(
		`INSERT INTO sessions (token_hash, user_id, expires_at)
		 VALUES (?, ?, ?)`,
		[tokenHash, userId, expiresAt]
	);

	cookies.set('session', token, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: !dev,
		maxAge: 60 * 60 * 24 * 7
	});
}

// Session überprüfen
export async function validateSession(token) {
	if (!token) {
		return null;
	}

	const tokenHash = hashToken(token);

	const [sessions] = await db.execute(
		`SELECT
			users.id,
			users.username,
			users.email,
			users.role
		FROM sessions
		JOIN users ON users.id = sessions.user_id
		WHERE sessions.token_hash = ?
		AND sessions.expires_at > NOW()
		LIMIT 1`,
		[tokenHash]
	);

	if (sessions.length === 0) {
		return null;
	}

	return sessions[0];
}

// Session löschen
export async function deleteSession(cookies) {
	const token = cookies.get('session');

	if (token) {
		const tokenHash = hashToken(token);

		await db.execute(
			'DELETE FROM sessions WHERE token_hash = ?',
			[tokenHash]
		);
	}

	cookies.delete('session', {
		path: '/'
	});
}