<script>
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import AppHeader from '$lib/components/AppHeader.svelte';

	let { data } = $props();

	onMount(() => {
		const interval = setInterval(() => {
			invalidateAll();
		}, 5000);

		return () => clearInterval(interval);
	});
</script>

<div class="min-h-screen bg-white px-9 py-6">

	<AppHeader active="dashboard" />

	<main class="mt-10">

		<p class="text-sm font-semibold text-green-700">
			// ÜBERSICHT
		</p>

		<h1 class="mt-3 text-5xl font-semibold text-green-950">
			Guten Morgen.
		</h1>

		{#if data.latestAlert}
			<div
				class={data.latestAlert.severity === 'critical'
					? 'mt-6 rounded-xl bg-red-100 px-5 py-4 text-red-900'
					: data.latestAlert.severity === 'warning'
						? 'mt-6 rounded-xl bg-yellow-100 px-5 py-4 text-yellow-900'
						: 'mt-6 rounded-xl bg-lime-100 px-5 py-4 text-green-900'}
			>
				▲ {data.latestAlert.message}
			</div>
		{:else}
			<div class="mt-6 rounded-xl bg-lime-100 px-5 py-4 text-green-900">
				Keine aktiven Warnungen.
			</div>
		{/if}


		<div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

			<div class="rounded-2xl bg-lime-100 p-6">

				<p class="text-sm text-green-700">
					Temperatur
				</p>

				<p class="mt-2 text-5xl font-semibold text-green-950">
					{data.sensorData.temperature === null
						? 'Keine Daten'
						: `${data.sensorData.temperature} °C`}
				</p>

			</div>


			<div class="rounded-2xl bg-lime-100 p-6">

				<p class="text-sm text-green-700">
					Luftfeuchtigkeit
				</p>

				<p class="mt-2 text-5xl font-semibold text-green-950">
					{data.sensorData.humidity === null
						? 'Keine Daten'
						: `${data.sensorData.humidity} %`}
				</p>

			</div>


			<div class="rounded-2xl bg-green-900 p-6 text-white">

				<p class="text-sm text-green-100">
					Bodenfeuchte
				</p>

				<p class="mt-2 text-5xl font-semibold">
					{data.sensorData.soilMoisture === null
						? 'Keine Daten'
						: `${data.sensorData.soilMoisture} %`}
				</p>

			</div>


			<div class="rounded-2xl bg-lime-100 p-6">

				<p class="text-sm text-green-700">
					Licht
				</p>

				<p class="mt-2 text-5xl font-semibold text-green-950">
					{data.sensorData.light === null
						? 'Keine Daten'
						: `${data.sensorData.light} lux`}
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
							{data.statusData.fan_duty_pct > 0
								? 'Aktiv'
								: 'Inaktiv'}
						</p>

					</div>


					<div class="flex items-center justify-between py-4">

						<p class="text-green-950">
							Bewässerung
						</p>

						<p class="text-green-700">
							{data.statusData.pump_water_ms > 0
								? 'Aktiv'
								: 'Inaktiv'}
						</p>

					</div>


					<div class="flex items-center justify-between py-4">

						<p class="text-green-950">
							Beleuchtung
						</p>

						<p class="text-green-700">
							{data.statusData.led_duty_pct > 0
								? 'Aktiv'
								: 'Inaktiv'}
						</p>

					</div>


					<div class="flex items-center justify-between py-4">

						<p class="text-green-950">
							Betriebsmodus
						</p>

						<p class="text-green-700">
							{data.statusData.mode}
						</p>

					</div>

				</div>

			</div>

		</div>

	</main>

</div>