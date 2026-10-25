import { redirect } from '@sveltejs/kit';
import { createHash } from 'node:crypto';
import { db } from '$lib/server/db.js';

const protectedRoutes = [
	'/dashboard',
	'/live-daten',
	'/verlauf',
	'/steuerung',
	'/pflanzenanalyse',
	'/warnungen'
];

export async function handle({ event, resolve }) {
	const isProtected = protectedRoutes.some(
		(route) =>
			event.url.pathname === route ||
			event.url.pathname.startsWith(`${route}/`)
	);

	if (!isProtected) {
		return resolve(event);
	}

	const sessionToken = event.cookies.get('session');

	if (!sessionToken) {
		throw redirect(303, '/login');
	}

	const tokenHash = createHash('sha256')
		.update(sessionToken)
		.digest('hex');

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
		event.cookies.delete('session', { path: '/' });
		throw redirect(303, '/login');
	}

	event.locals.user = {
		id: sessions[0].id,
		username: sessions[0].username,
		email: sessions[0].email,
		role: sessions[0].role
	};

	return resolve(event);
}