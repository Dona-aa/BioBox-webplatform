import { error, redirect } from '@sveltejs/kit';
import { createHash } from 'node:crypto';
import { db } from '$lib/server/db.js';

export async function handle({ event, resolve }) {
	const protectedPages = [
		'/dashboard',
		'/live-daten',
		'/verlauf',
		'/steuerung',
		'/pflanzenanalyse',
		'/warnungen'
	];

	const protectedApi = [
		'/api/v1/actuators/command'
	];

	const needsLogin =
		protectedPages.some((page) =>
			event.url.pathname.startsWith(page)
		) ||
		protectedApi.some((api) =>
			event.url.pathname.startsWith(api)
		);

	event.locals.user = null;

	if (!needsLogin) {
		return resolve(event);
	}

	const token = event.cookies.get('session');

	if (!token) {
		if (event.url.pathname.startsWith('/api/')) {
			throw error(401, 'Nicht angemeldet.');
		}

		throw redirect(303, '/login');
	}

	const tokenHash = createHash('sha256')
		.update(token)
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
		event.cookies.delete('session', {
			path: '/'
		});

		if (event.url.pathname.startsWith('/api/')) {
			throw error(401, 'Sitzung ist ungültig.');
		}

		throw redirect(303, '/login');
	}

	event.locals.user = {
		id: sessions[0].id,
		username: sessions[0].username,
		email: sessions[0].email,
		role: sessions[0].role
	};

	const controlRoute =
		event.url.pathname.startsWith('/steuerung') ||
		event.url.pathname.startsWith('/api/v1/actuators/command');

	if (
		controlRoute &&
		!['operator', 'admin'].includes(event.locals.user.role)
	) {
		if (event.url.pathname.startsWith('/api/')) {
			throw error(403, 'Keine Berechtigung.');
		}

		throw redirect(303, '/dashboard');
	}

	return resolve(event);
}