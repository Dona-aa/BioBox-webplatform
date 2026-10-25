import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	const command = await request.json();

	if (!command.component || !command.action) {
		return json(
			{ error: 'Komponente und Aktion fehlen.' },
			{ status: 400 }
		);
	}

	const allowedComponents = ['water', 'light', 'fan'];
	const allowedActions = ['on', 'off'];

	if (!allowedComponents.includes(command.component)) {
		return json(
			{ error: 'Unbekannte Komponente.' },
			{ status: 400 }
		);
	}

	if (!allowedActions.includes(command.action)) {
		return json(
			{ error: 'Unbekannte Aktion.' },
			{ status: 400 }
		);
	}

	return json({
		message: 'Befehl empfangen',
		component: command.component,
		action: command.action
	});
}