<script>
	import { onMount } from 'svelte';

	let { data } = $props();

	let sensorData = $state(data.sensorData);

	async function updateSensorData() {
		const response = await fetch('/api/v1/telemetry');

		if (!response.ok) {
			return;
		}

		const telemetry = await response.json();

		if (telemetry.message === 'Keine Sensordaten vorhanden') {
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
		const interval = setInterval(updateSensorData, 5000);

		return () => clearInterval(interval);
	});
</script>

<div class="min-h-screen bg-white px-9 py-6">

	<header class="flex items-center justify-between">

		<a href="/" class="text-2xl font-bold text-green-900">
			BioBox
		</a>

		<nav class="flex items-center gap-2">

			<a
				href="/dashboard"
				class="rounded-full px-4 py-3 font-semibold text-green-950"
			>
				Dashboard
			</a>

			<a
				href="/live-daten"
				class="rounded-full bg-green-900 px-5 py-3 font-semibold text-white"
			>
				Live-Daten
			</a>

			<a
				href="/verlauf"
				class="rounded-full px-4 py-3 font-semibold text-green-950"
			>
				Verlauf
			</a>

			<a
				href="/steuerung"
				class="rounded-full px-4 py-3 font-semibold text-green-950"
			>
				Steuerung
			</a>

			<a
				href="/pflanzenanalyse"
				class="rounded-full px-4 py-3 font-semibold text-green-950"
			>
				Pflanzenanalyse
			</a>

			<a
				href="/warnungen"
				class="rounded-full px-4 py-3 font-semibold text-green-950"
			>
				Warnungen
			</a>

		</nav>

		<div
			class="flex h-11 w-11 items-center justify-center rounded-full bg-lime-300 font-semibold text-green-900"
		>
			EP
		</div>

	</header>

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

			<div
				class="inline-flex w-fit items-center gap-2 rounded-full bg-lime-100 px-4 py-2 text-sm font-semibold leading-none text-green-950"
			>
				<span class="h-3 w-3 rounded-full bg-lime-400"></span>

				<span>
					Live · Verbindung hergestellt
				</span>
			</div>

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

				<p class="mt-3 text-sm font-semibold text-lime-300">
					Vorher 23,4 · vor 2 Sekunden
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
					Zuletzt aktualisiert: vor 2 Sekunden
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
					Zuletzt aktualisiert: vor 2 Sekunden
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
					Zuletzt aktualisiert: vor 2 Sekunden
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
					Zuletzt aktualisiert: vor 2 Sekunden
				</p>

			</div>

			<!-- Hinweis -->
			<div class="rounded-2xl border border-green-200 p-6">

				<p class="text-sm text-green-800">
					Hinweis
				</p>

				<p class="mt-2 text-lg text-green-950">
					Neue Werte erscheinen automatisch.
					<br />
					Die Seite muss nicht neu geladen werden.
				</p>

			</div>

		</div>

		<p class="mt-5 text-sm text-green-700">
			Beispieldaten für das Mockup
		</p>

	</main>

</div>