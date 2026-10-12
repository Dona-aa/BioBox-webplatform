<script>
	import { onMount } from 'svelte';

	let { data } = $props();

	let sensorData = $state(data.sensorData);
	let statusData = $state(data.statusData);
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

<div class="min-h-screen bg-white">
	<div class="min-h-screen px-9 py-6">

		<header class="flex items-center justify-between">
			<a href="/" class="text-2xl font-bold text-green-900">
				BioBox
			</a>

			<nav class="flex items-center gap-4">
				<a
					href="/dashboard"
					class="rounded-full bg-green-900 px-6 py-3 font-semibold text-white"
				>
					Übersicht
				</a>

				<a href="/verlauf" class="px-4 py-3 text-green-950">
					Verlauf
				</a>

				<a href="/geraete" class="px-4 py-3 text-green-950">
					Geräte
				</a>

				<a href="/benutzer" class="px-4 py-3 text-green-950">
					Benutzer
				</a>
			</nav>

			<div
				class="flex h-11 w-11 items-center justify-center rounded-full bg-lime-300 font-semibold text-green-900"
			>
				EP
			</div>
		</header>

		<main class="mt-10">

			<p class="text-sm font-semibold text-green-700">
				// ÜBERSICHT
			</p>

			<h1 class="mt-3 text-5xl font-semibold text-green-950">
				Guten Morgen.
			</h1>

			<div class="mt-6 rounded-xl bg-yellow-100 px-5 py-4 text-yellow-900">
				▲ Bodenfeuchte ist niedrig. Bald gießen empfohlen.
			</div>

			<div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

				<div class="rounded-2xl bg-lime-100 p-6">
					<p class="text-sm text-green-700">
						Temperatur
					</p>

					<p class="mt-2 text-5xl font-semibold text-green-950">
						{sensorData.temperature === null
							? 'Keine Daten'
							: `${sensorData.temperature} °C`}
					</p>
				</div>

				<div class="rounded-2xl bg-lime-100 p-6">
					<p class="text-sm text-green-700">
						Luftfeuchtigkeit
					</p>

					<p class="mt-2 text-5xl font-semibold text-green-950">
						{sensorData.humidity === null
							? 'Keine Daten'
							: `${sensorData.humidity} %`}
					</p>
				</div>

				<div class="rounded-2xl bg-green-900 p-6 text-white">
					<p class="text-sm text-green-100">
						Bodenfeuchte
					</p>

					<p class="mt-2 text-5xl font-semibold">
						{sensorData.soilMoisture === null
							? 'Keine Daten'
							: `${sensorData.soilMoisture} %`}
					</p>
				</div>

				<div class="rounded-2xl bg-lime-100 p-6">
					<p class="text-sm text-green-700">
						Licht
					</p>

					<p class="mt-2 text-5xl font-semibold text-green-950">
						{sensorData.light === null
							? 'Keine Daten'
							: `${sensorData.light} lux`}
					</p>
				</div>

			</div>

			<div class="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">

				<div class="min-h-[300px] rounded-2xl bg-green-900 lg:col-span-2">
				</div>

				<div class="rounded-2xl border border-green-200 p-6">

					<h2 class="text-2xl font-semibold text-green-950">
						Komponenten
					</h2>

					<div class="mt-5 divide-y divide-green-100">

						<div class="flex items-center justify-between py-4">
							<p class="text-green-950">
								Belüftung
							</p>

							<p class="text-green-700">
								{statusData.fan_duty_pct > 0
									? 'Aktiv'
									: 'Inaktiv'}
							</p>
						</div>

						<div class="flex items-center justify-between py-4">
							<p class="text-green-950">
								Bewässerung
							</p>

							<p class="text-green-700">
								{statusData.pump_water_ms > 0
									? 'Aktiv'
									: 'Inaktiv'}
							</p>
						</div>

						<div class="flex items-center justify-between py-4">
							<p class="text-green-950">
								Beleuchtung
							</p>

							<p class="text-green-700">
								{statusData.led_duty_pct > 0
									? 'Aktiv'
									: 'Inaktiv'}
							</p>
						</div>

						<div class="flex items-center justify-between py-4">
							<p class="text-green-950">
								Betriebsmodus
							</p>

							<p class="text-green-700">
								{statusData.mode}
							</p>
						</div>

					</div>
				</div>

			</div>

		</main>

	</div>
</div>