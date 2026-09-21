export async function load({ fetch }) {
	const response = await fetch('/api/sensors');
	const sensorData = await response.json();

	return {
		sensorData
	};
}