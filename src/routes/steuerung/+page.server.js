export async function load({ fetch }) {
	try {
		const response = await fetch('/api/v1/status');

		if (!response.ok) {
			throw new Error('Systemstatus konnte nicht geladen werden.');
		}

		const status = await response.json();

		return {
			status
		};
	} catch (error) {
		console.error('Fehler beim Laden des Systemstatus:', error);

		return {
			status: {
				mode: null,
				pump_water_ms: null,
				led_duty_pct: null,
				fan_duty_pct: null
			}
		};
	}
}