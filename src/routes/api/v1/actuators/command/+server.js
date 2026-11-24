import { json } from '@sveltejs/kit';

export async function POST({ request, locals }) {
	if (!locals.user) {
		return json(
			{ error: 'Nicht angemeldet.' },
			{ status: 401 }
		);
	}

	if (locals.user.role !== 'admin') {
		return json(
			{ error: 'Keine Berechtigung.' },
			{ status: 403 }
		);
	}

	let command;

	try {
		command = await request.json();
	} catch {
		return json(
			{ error: 'Ungültige Anfrage.' },
			{ status: 400 }
		);
	}

	if (!command || !command.component || !command.action) {
		return json(
			{ error: 'Komponente und Aktion fehlen.' },
			{ status: 400 }
		);
	}

	const allowedComponents = ['water', 'light', 'fan', 'mode'];

	if (!allowedComponents.includes(command.component)) {
		return json(
			{ error: 'Unbekannte Komponente.' },
			{ status: 400 }
		);
	}

	if (command.component === 'mode') {
		if (!['auto', 'manual'].includes(command.action)) {
			return json(
				{ error: 'Ungültiger Betriebsmodus.' },
				{ status: 400 }
			);
		}
	} else {
		if (!['on', 'off'].includes(command.action)) {
			return json(
				{ error: 'Ungültige Aktion.' },
				{ status: 400 }
			);
		}
	}

	return json({
		message: 'Befehl empfangen',
		component: command.component,
		action: command.action
	});
}