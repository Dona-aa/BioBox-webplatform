<script>
	import { onMount } from 'svelte';
	import AppHeader from '$lib/components/AppHeader.svelte';

	let { data } = $props();

	let sensorData = $state(data.sensorData);
	let currentTime = $state(Date.now());

	function formatDate(date) {
		if (!date) {
			return 'Keine Messung';
		}

		return new Date(date).toLocaleString('de-DE');
	}

	function dataIsFresh() {
		if (!sensorData.measuredAt) {
			return false;
		}

		const measuredTime = new Date(sensorData.measuredAt).getTime();
		const difference = currentTime - measuredTime;

		return difference <= 2 * 60 * 1000;
	}

	async function updateSensorData() {
		const response = await fetch('/api/v1/telemetry');

		if (!response.ok) {
			return;
		}

		const telemetry = await response.json();

		if (telemetry.message === 'Keine Sensordaten vorhanden') {
			sensorData = {
				temperature: null,
				humidity: null,
				soilMoisture: null,
				soilTemperature: null,
				light: null,
				measuredAt: null
			};

			return;
		}

		sensorData = {
			temperature: telemetry.air_temp_c,
			humidity: telemetry.air_humidity_pct,
			soilMoisture: telemetry.soil_moisture_pct,
			soilTemperature: telemetry.soil_temp_c,
			light: telemetry.light_lux,
			measuredAt: telemetry.measured_at
		};
	}

	onMount(() => {
		const interval = setInterval(() => {
			currentTime = Date.now();
			updateSensorData();
		}, 5000);

		return () => clearInterval(interval);
	});
</script>

<div class="min-h-screen bg-white px-9 py-6">

	<AppHeader active="live-daten" />

	<main class="mt-10">

		<div class="flex items-end justify-between">

			<div>
				<p class="text-sm font-semibold text-green-800">
					// LIVE-DATEN
				</p>

				<h1 class="mt-3 text-5xl font-semibold text-green-950">
					Messwerte in Echtzeit
				</h1>
			</div>

			{#if dataIsFresh()}

				<div
					class="inline-flex w-fit items-center gap-2 rounded-full bg-lime-100 px-4 py-2 text-sm font-semibold leading-none text-green-950"
				>
					<span class="h-3 w-3 rounded-full bg-lime-400"></span>

					<span>
						Live · Verbindung hergestellt
					</span>
				</div>

			{:else}

				<div
					class="inline-flex w-fit items-center gap-2 rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold leading-none text-yellow-900"
				>
					<span class="h-3 w-3 rounded-full bg-yellow-400"></span>

					<span>
						Daten nicht aktuell
					</span>
				</div>

			{/if}

		</div>


		<div class="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">

			<!-- Temperatur -->
			<div class="rounded-2xl bg-green-900 p-6 text-white">

				<p class="text-sm">
					Temperatur
				</p>

				<p class="mt-2 text-5xl font-semibold">
					{sensorData.temperature === null
						? 'Keine Daten'
						: `${sensorData.temperature} °C`}
				</p>

				<p class="mt-3 text-sm text-green-100">
					Letzte Messung: {formatDate(sensorData.measuredAt)}
				</p>

			</div>


			<!-- Luftfeuchtigkeit -->
			<div class="rounded-2xl bg-lime-100 p-6">

				<p class="text-sm text-green-800">
					Luftfeuchtigkeit
				</p>

				<p class="mt-2 text-5xl font-semibold text-green-950">
					{sensorData.humidity === null
						? 'Keine Daten'
						: `${sensorData.humidity} %`}
				</p>

				<p class="mt-3 text-sm text-green-700">
					Letzte Messung: {formatDate(sensorData.measuredAt)}
				</p>

			</div>


			<!-- Bodenfeuchtigkeit -->
			<div class="rounded-2xl bg-lime-100 p-6">

				<p class="text-sm text-green-800">
					Bodenfeuchtigkeit
				</p>

				<p class="mt-2 text-5xl font-semibold text-green-950">
					{sensorData.soilMoisture === null
						? 'Keine Daten'
						: `${sensorData.soilMoisture} %`}
				</p>

				<p class="mt-3 text-sm text-green-700">
					Letzte Messung: {formatDate(sensorData.measuredAt)}
				</p>

			</div>


			<!-- Bodentemperatur -->
			<div class="rounded-2xl bg-lime-100 p-6">

				<p class="text-sm text-green-800">
					Bodentemperatur
				</p>

				<p class="mt-2 text-5xl font-semibold text-green-950">
					{sensorData.soilTemperature === null
						? 'Keine Daten'
						: `${sensorData.soilTemperature} °C`}
				</p>

				<p class="mt-3 text-sm text-green-700">
					Letzte Messung: {formatDate(sensorData.measuredAt)}
				</p>

			</div>


			<!-- Licht -->
			<div class="rounded-2xl bg-lime-100 p-6">

				<p class="text-sm text-green-800">
					Licht
				</p>

				<p class="mt-2 text-5xl font-semibold text-green-950">
					{sensorData.light === null
						? 'Keine Daten'
						: `${sensorData.light} lx`}
				</p>

				<p class="mt-3 text-sm text-green-700">
					Letzte Messung: {formatDate(sensorData.measuredAt)}
				</p>

			</div>


			<!-- Hinweis -->
			<div class="rounded-2xl border border-green-200 p-6">

				<p class="text-sm text-green-800">
					Hinweis
				</p>

				<p class="mt-2 text-lg text-green-950">
					Neue Messwerte werden automatisch alle 5 Sekunden geladen.
				</p>

			</div>

		</div>

	</main>

</div>