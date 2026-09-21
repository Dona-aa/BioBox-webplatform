import { json } from '@sveltejs/kit';

let latestSensorData = {
	measuredAt: new Date().toISOString(),
	temperature: 23.5,
	humidity: 60,
	soilMoisture: 45,
	light: 850
};

export function GET() {
	return json(latestSensorData);
}

export async function POST({ request }) {
	const data = await request.json();

	if (
		typeof data.temperature !== 'number' ||
		typeof data.humidity !== 'number' ||
		typeof data.soilMoisture !== 'number' ||
		typeof data.light !== 'number'
	) {
		return json(
			{ message: 'Ungültige Sensordaten' },
			{ status: 400 }
		);
	}
	if (
		data.humidity < 0 ||
		data.humidity > 100 ||
		data.soilMoisture < 0 ||
		data.soilMoisture > 100 ||
		data.light < 0
	) {
		return json(
			{ message: 'Sensordaten außerhalb des gültigen Bereichs' },
			{ status: 400 }
		);
}
	latestSensorData = {
		measuredAt: new Date().toISOString(),
		temperature: data.temperature,
		humidity: data.humidity,
		soilMoisture: data.soilMoisture,
		light: data.light
	};

	return json({
		message: 'Sensordaten wurden empfangen',
		sensorData: latestSensorData
	});
}