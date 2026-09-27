export async function load({ fetch }) {
	const sensorResponse = await fetch('/api/sensors');
	const sensorData = await sensorResponse.json();

	const historyResponse = await fetch('/api/sensors/history');
	const sensorHistory = await historyResponse.json();

	return {
		sensorData,
		sensorHistory
	};
}