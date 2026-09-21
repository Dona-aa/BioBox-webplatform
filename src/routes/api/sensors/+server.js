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