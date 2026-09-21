import { json } from '@sveltejs/kit';

export function GET() {
	return json({
		temperature: 23.5,
		humidity: 60,
		soilMoisture: 45,
		light: 850
	});
}