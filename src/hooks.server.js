import { sequence } from '@sveltejs/kit/hooks';
import { getTextDirection } from '$lib/paraglide/runtime.js';
import { paraglideMiddleware } from '$lib/paraglide/server.js';
import { error, redirect } from '@sveltejs/kit';
import { createHash } from 'node:crypto';
import { db } from '$lib/server/db.js';

function matchesRoute(path, route) {
	return path === route || path.startsWith(route + '/');
}

async function originalHandle({ event, resolve }) {
	const path = event.url.pathname;

	const protectedPages = [
		'/dashboard',
		'/live-daten',
		'/verlauf',
		'/steuerung',
		'/pflanzenanalyse',
		'/warnungen',
		'/benutzer'
	];

	const protectedApi = [
		'/api/v1/actuators/command'
	];

	const needsLogin =
		protectedPages.some((page) => matchesRoute(path, page)) ||
		protectedApi.some((api) => matchesRoute(path, api));

	event.locals.user = null;

	if (!needsLogin) {
		return resolve(event);
	}

	const token = event.cookies.get('session');

	if (!token) {
		if (path.startsWith('/api/')) {
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

		if (path.startsWith('/api/')) {
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

	const adminOnlyRoutes = [
		'/steuerung',
		'/benutzer',
		'/api/v1/actuators/command'
	];

	const adminOnlyRoute = adminOnlyRoutes.some(
		(route) => matchesRoute(path, route)
	);

	if (adminOnlyRoute && event.locals.user.role !== 'admin') {
		if (path.startsWith('/api/')) {
			throw error(403, 'Keine Berechtigung.');
		}

		throw redirect(303, '/dashboard');
	}

	return resolve(event);
}

const handleParaglide = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		return resolve(
			{ ...event, request },
			{
				transformPageChunk: ({ html }) =>
					html
						.replace('%paraglide.lang%', locale)
						.replace('%paraglide.dir%', getTextDirection(locale))
			}
		);
	});

export const handle = sequence(handleParaglide, originalHandle);