<script>
	import { onMount } from 'svelte';

	let { data } = $props();

	let sensorData = $state(data.sensorData);
	let sensorHistory = $state(data.sensorHistory);

	onMount(() => {
		const interval = setInterval(async () => {
			const sensorResponse = await fetch('/api/sensors');
			sensorData = await sensorResponse.json();

			const historyResponse = await fetch('/api/sensors/history');
			sensorHistory = await historyResponse.json();
		}, 5000);

		return () => clearInterval(interval);
	});
</script>

<h1>BioBox</h1>

<p>Messzeit: {sensorData.measuredAt}</p>
<p>Temperatur: {sensorData.temperature} °C</p>
<p>Luftfeuchtigkeit: {sensorData.humidity} %</p>
<p>Bodenfeuchtigkeit: {sensorData.soilMoisture} %</p>
<p>Bodentemperatur: {sensorData.soilTemperature} °C</p>
<p>Licht: {sensorData.light} lux</p>

<p>Gespeicherte Messungen: {sensorHistory.length}</p>