<script>
	import { onMount } from 'svelte';

	let { data } = $props();

	let sensorData = $state(data.sensorData);
	let connectionStatus = $state('Verbunden');

	async function updateSensorData() {
		try {
			const response = await fetch('/api/v1/telemetry');

			if (!response.ok) {
				throw new Error('Telemetriedaten konnten nicht geladen werden');
			}

			const telemetry = await response.json();

			if (telemetry.message === 'Keine Sensordaten vorhanden') {
				sensorData = {
				measuredAt: null,
				temperature: null,
				humidity: null,
				soilMoisture: null,
				soilTemperature: null,
				light: null,
				dli: null,
    			sensorHealth: null
			};

			connectionStatus = 'Verbunden';
			return;
		}

			sensorData = {
				measuredAt: telemetry.measured_at,
				temperature: telemetry.air_temp_c,
				humidity: telemetry.air_humidity_pct,
				soilMoisture: telemetry.soil_moisture_pct,
				soilTemperature: telemetry.soil_temp_c,
				light: telemetry.light_lux,
				dli: telemetry.dli_est_mol,
				sensorHealth: telemetry.sensor_health
			};

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

<p>
  Messzeit:
  {sensorData.measuredAt === null
    ? 'Keine Daten'
    : sensorData.measuredAt}
</p>

<p>
	Temperatur:
	{sensorData.temperature === null
		? 'Keine Daten'
		: `${sensorData.temperature} °C`}
</p>

<p>
	Luftfeuchtigkeit:
	{sensorData.humidity === null
		? 'Keine Daten'
		: `${sensorData.humidity} %`}
</p>

<p>
	Bodenfeuchtigkeit:
	{sensorData.soilMoisture === null
		? 'Keine Daten'
		: `${sensorData.soilMoisture} %`}
</p>

<p>
	Bodentemperatur:
	{sensorData.soilTemperature === null
		? 'Keine Daten'
		: `${sensorData.soilTemperature} °C`}
</p>

<p>
	Licht:
	{sensorData.light === null
		? 'Keine Daten'
		: `${sensorData.light} lux`}
</p>

<p>
	DLI:
	{sensorData.dli === null
		? 'Keine Daten'
		: `${sensorData.dli} mol/m²/Tag`}
</p>