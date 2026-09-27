<script>
	import { onMount } from 'svelte';

	let { data } = $props();

	let sensorData = $state(data.sensorData);
	let sensorHistory = $state(data.sensorHistory);
	let connectionStatus = $state('Verbunden');

	async function updateSensorData() {
		try {
			const sensorResponse = await fetch('/api/sensors');

			if (!sensorResponse.ok) {
				throw new Error('Sensordaten konnten nicht geladen werden');
			}

			const historyResponse = await fetch('/api/sensors/history');

			if (!historyResponse.ok) {
				throw new Error('Sensorhistorie konnte nicht geladen werden');
			}

			sensorData = await sensorResponse.json();
			sensorHistory = await historyResponse.json();

			connectionStatus = 'Verbunden';
		} catch (error) {
			console.error(error);
			connectionStatus = 'Verbindungsproblem';
		}
	}

	onMount(() => {
		const interval = setInterval(updateSensorData, 5000);

		return () => clearInterval(interval);
	});
</script>

<h1>BioBox</h1>

<p>Verbindung: {connectionStatus}</p>

<p>Messzeit: {sensorData.measuredAt}</p>
<p>Temperatur: {sensorData.temperature} °C</p>
<p>Luftfeuchtigkeit: {sensorData.humidity} %</p>
<p>Bodenfeuchtigkeit: {sensorData.soilMoisture} %</p>
<p>Bodentemperatur: {sensorData.soilTemperature} °C</p>
<p>Licht: {sensorData.light} lux</p>

<p>Gespeicherte Messungen: {sensorHistory.length}</p>