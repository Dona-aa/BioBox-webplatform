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
		`SELECT token_hash
		 FROM sessions
		 WHERE token_hash = ?
		 AND expires_at > NOW()
		 LIMIT 1`,
		[tokenHash]
	);

	if (sessions.length === 0) {
		event.cookies.delete('session', { path: '/' });
		throw redirect(303, '/login');
	}

	return resolve(event);
}