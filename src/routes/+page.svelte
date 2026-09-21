<script>
	let { data } = $props();
</script>

<h1>BioBox</h1>

<p>Temperatur: {data.sensorData.temperature} °C</p>
<p>Luftfeuchtigkeit: {data.sensorData.humidity} %</p>
<p>Bodenfeuchtigkeit: {data.sensorData.soilMoisture} %</p>
<p>Licht: {data.sensorData.light} lux</p>