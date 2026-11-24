import { sequence } from '@sveltejs/kit/hooks';
import { getTextDirection } from '$lib/paraglide/runtime.js';
import { paraglideMiddleware } from '$lib/paraglide/server.js';
import { error, redirect } from '@sveltejs/kit';
import { validateSession } from '$lib/server/auth.js';

function matchesRoute(path, route) {
	return path === route || path.startsWith(route + '/');
}

async function handleAuth({ event, resolve }) {
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

	const adminOnlyRoutes = [
		'/steuerung',
		'/benutzer',
		'/api/v1/actuators/command'
	];

	const needsLogin =
		protectedPages.some((page) => matchesRoute(path, page)) ||
		protectedApi.some((api) => matchesRoute(path, api));

	// Session überprüfen
	const token = event.cookies.get('session');

	event.locals.user = await validateSession(token);

	// Ungültiges Session-Cookie entfernen
	if (token && !event.locals.user) {
		event.cookies.delete('session', {
			path: '/'
		});
	}

	// Geschützte Seiten
	if (needsLogin && !event.locals.user) {
		if (path.startsWith('/api/')) {
			throw error(401, 'Nicht angemeldet.');
		}

		throw redirect(303, '/login');
	}

	// Administratorrechte überprüfen
	const adminOnlyRoute = adminOnlyRoutes.some(
		(route) => matchesRoute(path, route)
	);

	if (adminOnlyRoute && event.locals.user?.role !== 'admin') {
		if (path.startsWith('/api/')) {
			throw error(403, 'Keine Berechtigung.');
		}

		throw redirect(303, '/dashboard');
	}

	return resolve(event);
}

// Internationalisierung
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

export const handle = sequence(handleParaglide, handleAuth);