import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db.js';

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

	const [rows] = await db.execute(`
		SELECT mode, estop_active, heartbeat_ok
		FROM actuator_states
		ORDER BY reported_at DESC
		LIMIT 1
	`);

	if (rows.length === 0) {
		return json(
			{ error: 'Kein Systemstatus vorhanden.' },
			{ status: 409 }
		);
	}

	const status = rows[0];

	// Keine Befehle bei aktivem Not-Aus
	if (status.estop_active) {
		return json(
			{ error: 'Not-Aus ist aktiv.' },
			{ status: 409 }
		);
	}

	// Keine Befehle im Sicherheitsmodus
	if (status.mode === 'SAFE_MODE') {
		return json(
			{ error: 'Sicherheitsmodus ist aktiv.' },
			{ status: 409 }
		);
	}

	// Kommunikation mit dem Gerät prüfen
	if (!status.heartbeat_ok) {
		return json(
			{ error: 'Keine stabile Geräteverbindung.' },
			{ status: 409 }
		);
	}

	// Befehle nur im regulären Betrieb erlauben
	if (!['AUTO', 'MANUAL'].includes(status.mode)) {
		return json(
			{ error: 'System ist noch nicht betriebsbereit.' },
			{ status: 409 }
		);
	}

	// Komponenten nur im manuellen Modus steuern
	if (command.component !== 'mode' && status.mode !== 'MANUAL') {
		return json(
			{ error: 'Manueller Modus ist erforderlich.' },
			{ status: 409 }
		);
	}

	return json({
		message: 'Befehl empfangen',
		component: command.component,
		action: command.action
	});
}