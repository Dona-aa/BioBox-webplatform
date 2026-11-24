<script>
	import { onMount } from 'svelte';
	import AppHeader from '$lib/components/AppHeader.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime.js';

	let { data } = $props();

	let sensorData = $state(data.sensorData);
	let currentTime = $state(Date.now());
	let updating = $state(false);
	let connectionError = $state(false);
	let refreshMessage = $state('');

	const sensors = [
		{
			key: 'temperature',
			name: m.live_air_temperature(),
			unit: '°C',
			color: '#487C69'
		},
		{
			key: 'humidity',
			name: m.live_humidity(),
			unit: '%',
			color: '#648A9B'
		},
		{
			key: 'soilMoisture',
			name: m.live_soil_moisture(),
			unit: '%',
			color: '#A17F60'
		},
		{
			key: 'soilTemperature',
			name: m.live_soil_temperature(),
			unit: '°C',
			color: '#487C69'
		},
		{
			key: 'light',
			name: m.live_light(),
			unit: 'lux',
			color: '#857B9D'
		}
	];

	function currentLocale() {
		if (getLocale() === 'en') return 'en-US';
		if (getLocale() === 'sq') return 'sq-AL';
		return 'de-DE';
	}

	function formatValue(value, unit = '') {
		if (value == null || !Number.isFinite(Number(value))) {
			return '–';
		}

		const number = Number(value).toLocaleString(currentLocale(), {
			maximumFractionDigits: 1
		});

		return unit ? `${number} ${unit}` : number;
	}

	function formatDate(value) {
		if (!value) return m.live_no_measurement();

		const date = new Date(value);

		if (Number.isNaN(date.getTime())) {
			return m.live_no_measurement();
		}

		return date.toLocaleString(currentLocale());
	}

	function dataIsFresh() {
		if (!sensorData.measuredAt) return false;

		const timestamp = new Date(sensorData.measuredAt).getTime();

		if (!Number.isFinite(timestamp)) return false;

		const difference = currentTime - timestamp;

		return difference >= 0 && difference <= 120000;
	}

	function percentage(value) {
		if (value == null || !Number.isFinite(Number(value))) return 0;

		return Math.max(0, Math.min(100, Number(value)));
	}

	async function updateSensorData(manual = false) {
		if (updating) return;

		updating = true;

		if (manual) {
			refreshMessage = '';
		}

		try {
			const response = await fetch(`/api/v1/telemetry?t=${Date.now()}`, {
				method: 'GET',
				cache: 'no-store'
			});

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}`);
			}

			const telemetry = await response.json();

			connectionError = false;

			if (telemetry.message === 'Keine Sensordaten vorhanden') {
				sensorData = {
					temperature: null,
					humidity: null,
					soilMoisture: null,
					soilTemperature: null,
					light: null,
					measuredAt: null
				};

				if (manual) {
					refreshMessage = m.live_no_sensor_data();
				}
			} else {
				const previousMeasurement = sensorData.measuredAt;

				sensorData = {
					temperature: telemetry.air_temp_c,
					humidity: telemetry.air_humidity_pct,
					soilMoisture: telemetry.soil_moisture_pct,
					soilTemperature: telemetry.soil_temp_c,
					light: telemetry.light_lux,
					measuredAt: telemetry.measured_at
				};

				if (manual) {
					if (previousMeasurement !== telemetry.measured_at) {
						refreshMessage = m.live_new_readings();
					} else {
						refreshMessage = m.live_no_new_readings();
					}
				}
			}
		} catch (error) {
			connectionError = true;

			if (manual) {
				refreshMessage = m.live_refresh_failed();
			}

			console.error('Fehler beim Aktualisieren der Sensordaten:', error);
		} finally {
			currentTime = Date.now();
			updating = false;
		}
	}

	onMount(() => {
		updateSensorData();

		const interval = setInterval(() => {
			currentTime = Date.now();
			updateSensorData();
		}, 5000);

		return () => clearInterval(interval);
	});
</script>

<div class="min-h-screen bg-[#E5EAE6] px-6 py-6 font-sans text-[#25332B] sm:px-9">
	<AppHeader active="live-daten" />

	<main class="mx-auto max-w-[1400px] pb-16 pt-9">

		<!-- HEADER -->
		<div class="mb-8 flex flex-wrap items-center justify-between gap-5">
			<div>
				<p class="text-[12px] text-[#77847B]">
					{m.live_monitoring()}
				</p>

				<h1 class="mt-2 text-[27px] font-semibold tracking-tight">
					{m.live_title()}
				</h1>

				<p class="mt-1 text-[13px] text-[#77847B]">
					{m.live_intro()}
				</p>
			</div>

			<div class="flex flex-col items-start gap-2 sm:items-end">
				<button
					type="button"
					onclick={() => updateSensorData(true)}
					disabled={updating}
					class="rounded-lg bg-[#1C2B23] px-5 py-3 text-[12px] font-medium text-[#E8EBE9] transition-colors hover:bg-[#304437] disabled:cursor-not-allowed disabled:opacity-60"
				>
					{updating ? m.live_updating() : `${m.live_refresh()} →`}
				</button>

				{#if refreshMessage}
					<p
						class="max-w-xs text-right text-[11px] text-[#68796D]"
						role="status"
					>
						{refreshMessage}
					</p>
				{/if}
			</div>
		</div>

		<!-- STATUSLEISTE -->
		<div class="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-[#CED8D0] bg-[#F1F4F0] px-5 py-4">
			<div class="flex items-center gap-3">
				<span
					class={connectionError
						? 'h-2.5 w-2.5 rounded-full bg-[#B76B62]'
						: dataIsFresh()
							? 'h-2.5 w-2.5 rounded-full bg-[#487C69]'
							: 'h-2.5 w-2.5 rounded-full bg-[#A6A29B]'}
				></span>

				<div>
					<p class="text-[13px] font-semibold">
						{#if connectionError}
							{m.live_connection_error()}
						{:else if dataIsFresh()}
							{m.live_fresh_data()}
						{:else}
							{m.live_no_fresh_data()}
						{/if}
					</p>

					<p class="mt-0.5 text-[11px] text-[#87928A]">
						{m.live_last_measurement()}: {formatDate(sensorData.measuredAt)}
					</p>
				</div>
			</div>

			<p class="text-[12px] text-[#77847B]">
				{m.live_auto_refresh()}
			</p>
		</div>

		<!-- HAUPTBEREICH -->
		<div class="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">

			<!-- LINKS: HAUPTMESSUNG -->
			<section class="overflow-hidden rounded-xl border border-[#C6D2C8] bg-[#F1F4F0]">

				<div class="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCE3DD] px-7 py-5">
					<div>
						<h2 class="text-[15px] font-semibold">
							{m.live_air_temperature()}
						</h2>

						<p class="mt-1 text-[12px] text-[#87928A]">
							{m.live_current_temperature()}
						</p>
					</div>

					<span class="rounded-md bg-[#E0EAE2] px-3 py-1.5 text-[11px] font-medium text-[#487C69]">
						{m.live_temperature()}
					</span>
				</div>

				<div class="px-7 pb-8 pt-10">

					<div class="flex flex-wrap items-end gap-4">
						<p class="break-words text-[clamp(3rem,6vw,5.5rem)] font-semibold leading-none tracking-[-0.06em] tabular-nums text-[#25332B]">
							{formatValue(sensorData.temperature)}
						</p>

						{#if sensorData.temperature != null}
							<span class="pb-1 text-[25px] text-[#718375]">
								°C
							</span>
						{/if}
					</div>

					<div class="mt-10 border-t border-[#DCE3DD] pt-6">

						<div class="mb-4 flex items-center justify-between">
							<h3 class="text-[12px] font-semibold text-[#52695A]">
								{m.live_temperature_measurement()}
							</h3>

							<span class="text-[11px] text-[#87928A]">
								{m.live_air_temperature()}
							</span>
						</div>

						<div class="flex h-4 overflow-hidden rounded-full bg-[#DFE7E0]">
							<div
								class="h-full rounded-full bg-[#487C69] transition-all duration-500"
								style={`width: ${
									sensorData.temperature == null
										? 0
										: percentage((Number(sensorData.temperature) / 50) * 100)
								}%`}
							></div>
						</div>

						<div class="mt-3 flex justify-between text-[11px] text-[#87928A]">
							<span>0 °C</span>
							<span>25 °C</span>
							<span>50 °C</span>
						</div>

						<p class="mt-5 text-[11px] leading-5 text-[#87928A]">
							{m.live_temperature_scale()}
						</p>

					</div>
				</div>
			</section>

			<!-- RECHTS: SENSORLISTE -->
			<section class="overflow-hidden rounded-xl border border-[#C6D2C8] bg-[#F1F4F0]">

				<div class="border-b border-[#DCE3DD] px-6 py-5">
					<h2 class="text-[15px] font-semibold">
						{m.live_other_sensors()}
					</h2>

					<p class="mt-1 text-[12px] text-[#87928A]">
						{m.live_latest_readings()}
					</p>
				</div>

				<div class="divide-y divide-[#DCE3DD] px-6">

					{#each sensors.slice(1) as sensor}

						<div class="flex flex-wrap items-center justify-between gap-4 py-5">

							<div class="flex items-center gap-3">
								<span
									class="h-2.5 w-2.5 shrink-0 rounded-full"
									style={`background-color: ${sensor.color}`}
								></span>

								<p class="text-[13px] font-medium">
									{sensor.name}
								</p>
							</div>

							<p class="text-right text-[23px] font-semibold tracking-tight tabular-nums">
								{formatValue(sensorData[sensor.key], sensor.unit)}
							</p>

						</div>

					{/each}

				</div>

				<div class="border-t border-[#DCE3DD] px-6 py-5">
					<a
						href="/verlauf"
						class="inline-flex items-center gap-2 text-[12px] font-semibold text-[#416B50] hover:text-[#25332B]"
					>
						{m.live_view_history()} →
					</a>
				</div>
			</section>

		</div>

		<!-- FEUCHTIGKEIT -->
		<section class="mt-6">

			<div class="mb-4 flex flex-wrap items-center justify-between gap-4">
				<h2 class="text-[15px] font-semibold">
					{m.live_moisture_monitoring()}
				</h2>

				<span class="text-[12px] text-[#87928A]">
					{m.live_current_percentages()}
				</span>
			</div>

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">

				<!-- LUFTFEUCHTIGKEIT -->
				<div class="rounded-xl border border-[#CED8D0] bg-[#F1F4F0] p-6">

					<div class="flex items-center justify-between gap-3">
						<h3 class="text-[13px] font-semibold">
							{m.live_humidity()}
						</h3>

						<span class="text-[12px] font-semibold tabular-nums">
							{formatValue(sensorData.humidity, '%')}
						</span>
					</div>

					<div class="mt-6 h-3 overflow-hidden rounded-full bg-[#E0E7E3]">
						<div
							class="h-full rounded-full bg-[#648A9B] transition-all duration-500"
							style={`width: ${percentage(sensorData.humidity)}%`}
						></div>
					</div>

					<div class="mt-3 flex justify-between text-[11px] text-[#87928A]">
						<span>0 %</span>
						<span>50 %</span>
						<span>100 %</span>
					</div>

				</div>

				<!-- BODENFEUCHTE -->
				<div class="rounded-xl border border-[#CED8D0] bg-[#F1F4F0] p-6">

					<div class="flex items-center justify-between gap-3">
						<h3 class="text-[13px] font-semibold">
							{m.live_soil_moisture()}
						</h3>

						<span class="text-[12px] font-semibold tabular-nums">
							{formatValue(sensorData.soilMoisture, '%')}
						</span>
					</div>

					<div class="mt-6 h-3 overflow-hidden rounded-full bg-[#E0E7E3]">
						<div
							class="h-full rounded-full bg-[#A17F60] transition-all duration-500"
							style={`width: ${percentage(sensorData.soilMoisture)}%`}
						></div>
					</div>

					<div class="mt-3 flex justify-between text-[11px] text-[#87928A]">
						<span>0 %</span>
						<span>50 %</span>
						<span>100 %</span>
					</div>

				</div>

			</div>

		</section>

		<!-- FOOTER -->
		<div class="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-[#CAD5CC] pt-5">

			<p class="text-[12px] text-[#77847B]">
				{m.live_last_measurement()}: {formatDate(sensorData.measuredAt)}
			</p>

			<a
				href="/dashboard"
				class="text-[12px] font-semibold text-[#416B50] hover:text-[#25332B]"
			>
				{m.live_back_dashboard()} →
			</a>

		</div>

	</main>
</div>