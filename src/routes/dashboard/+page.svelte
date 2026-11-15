<script>
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import AppHeader from '$lib/components/AppHeader.svelte';

	let { data } = $props();

	onMount(() => {
		const interval = setInterval(() => invalidateAll(), 5000);
		return () => clearInterval(interval);
	});

	const colors = {
		temperature: '#487C69',
		humidity: '#648A9B',
		soil: '#A17F60',
		light: '#857B9D'
	};

	function formatValue(value, unit = '') {
		if (value == null || !Number.isFinite(Number(value))) {
			return 'Keine Daten';
		}

		const number = Number(value).toLocaleString('de-DE', {
			maximumFractionDigits: 1
		});

		return unit ? `${number} ${unit}` : number;
	}

	function formatDate(value) {
		if (value == null) return '–';

		const date = new Date(value);

		if (!Number.isFinite(date.getTime())) return '–';

		return date.toLocaleDateString('de-DE');
	}

	function formatDateTime(value) {
		if (value == null) return 'Keine Messung vorhanden';

		const date = new Date(value);

		if (!Number.isFinite(date.getTime())) {
			return 'Keine Messung vorhanden';
		}

		return date.toLocaleString('de-DE');
	}

	function formatShortTime(value) {
		const date = new Date(value);

		if (!Number.isFinite(date.getTime())) return '–';

		return date.toLocaleString('de-DE', {
			day: '2-digit',
			month: '2-digit',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function percent(value) {
		if (value == null || !Number.isFinite(Number(value))) return 0;

		return Math.max(0, Math.min(100, Number(value)));
	}

	// Historische Sensordaten
	function getMeasurements(history, key) {
		return (history ?? [])
			.filter(
				(row) =>
					Number.isFinite(Number(row.time)) &&
					row[key] != null &&
					Number.isFinite(Number(row[key]))
			)
			.map((row) => ({
				time: Number(row.time),
				value: Number(row[key])
			}))
			.sort((a, b) => a.time - b.time);
	}

	// Temperatur-Flächendiagramm
	function makeAreaChart(rows) {
		if (rows.length === 0) return null;

		const values = rows.map((row) => row.value);

		const minimum = Math.min(...values);
		const maximum = Math.max(...values);

		const padding = Math.max((maximum - minimum) * 0.15, 1);

		const lower = minimum - padding;
		const upper = maximum + padding;

		const firstTime = rows[0].time;
		const lastTime = rows[rows.length - 1].time;

		const timeRange = lastTime - firstTime || 1;

		const points = rows.map((row) => ({
			x:
				rows.length === 1
					? 350
					: 55 + ((row.time - firstTime) / timeRange) * 625,

			y: 205 - ((row.value - lower) / (upper - lower)) * 175,

			value: row.value,
			time: row.time
		}));

		const line = points.map((point) => `${point.x},${point.y}`).join(' ');

		const area = `${points[0].x},205 ${line} ${
			points[points.length - 1].x
		},205`;

		return {
			points,
			line,
			area,
			minimum,
			maximum
		};
	}

	// Temperatur-Histogramm
	function makeHistogram(rows) {
		if (rows.length === 0) return [];

		const values = rows.map((row) => row.value);

		const min = Math.min(...values);
		const max = Math.max(...values);

		const count = 5;
		const width = max === min ? 1 : (max - min) / count;

		const bins = Array.from({ length: count }, (_, index) => ({
			start: min + index * width,
			end: min + (index + 1) * width,
			count: 0
		}));

		for (const value of values) {
			const index =
				max === min
					? 2
					: Math.min(count - 1, Math.floor((value - min) / width));

			bins[index].count++;
		}

		return bins;
	}

	function average(rows) {
		if (rows.length === 0) return null;

		const sum = rows.reduce((total, row) => total + row.value, 0);

		return sum / rows.length;
	}

	let temperatureRows = $derived(
		getMeasurements(data.chartHistory, 'temperature')
	);

	let humidityRows = $derived(
		getMeasurements(data.chartHistory, 'humidity')
	);

	let soilRows = $derived(
		getMeasurements(data.chartHistory, 'soilMoisture')
	);

	let lightRows = $derived(
		getMeasurements(data.chartHistory, 'light')
	);

	let temperatureChart = $derived(makeAreaChart(temperatureRows));

	let histogram = $derived(makeHistogram(temperatureRows));

	let histogramMax = $derived(
		Math.max(1, ...histogram.map((bin) => bin.count))
	);

	let averageTemperature = $derived(average(temperatureRows));

	// Letzte fünf Lichtmessungen für eine übersichtliche Darstellung
	let recentLightRows = $derived(lightRows.slice(-5));

	let maximumLight = $derived(
		Math.max(1, ...recentLightRows.map((row) => row.value))
	);

	let fanActive = $derived(data.statusData.fan_duty_pct > 0);
	let pumpActive = $derived(data.statusData.pump_water_ms > 0);
	let ledActive = $derived(data.statusData.led_duty_pct > 0);

	let activeCount = $derived(
		Number(fanActive) + Number(pumpActive) + Number(ledActive)
	);

	let inactiveCount = $derived(3 - activeCount);

	let periodStart = $derived(
		data.chartEnd - 24 * 60 * 60 * 1000
	);
</script>

<!-- KREISDIAGRAMM -->
{#snippet gauge(value, label, color)}
	<div class="flex flex-col items-center">
		<div class="relative aspect-square w-full max-w-[150px]">

			<svg
				viewBox="0 0 120 120"
				class="h-full w-full -rotate-90"
				role="img"
				aria-label={`${label}: ${formatValue(value, '%')}`}
			>
				<circle
					cx="60"
					cy="60"
					r="48"
					fill="none"
					stroke="#DCE3DF"
					stroke-width="10"
				/>

				<circle
					cx="60"
					cy="60"
					r="48"
					fill="none"
					stroke={color}
					stroke-width="10"
					stroke-linecap="round"
					stroke-dasharray={`${percent(value) * 3.016} 301.6`}
				/>
			</svg>

			<div class="absolute inset-0 flex items-center justify-center">
				<span class="text-[22px] font-semibold tabular-nums">
					{value == null ? '–' : `${formatValue(value)}%`}
				</span>
			</div>

		</div>

		<p class="mt-3 text-center text-[12px] font-medium">
			{label}
		</p>
	</div>
{/snippet}

<div class="min-h-screen bg-[#E5EAE6] px-6 py-6 font-sans text-[#25332B] sm:px-9">

	<AppHeader active="dashboard" />

	<main class="mx-auto max-w-[1400px] pb-16 pt-9">

		<!-- SEITENKOPF -->
		<div class="mb-7 flex flex-wrap items-center justify-between gap-5">

			<div>
				<p class="text-[12px] text-[#77847B]">
					BioBox / Analytics
				</p>

				<h1 class="mt-2 text-[27px] font-semibold tracking-tight">
					Systemübersicht
				</h1>

				<p class="mt-1 text-[13px] text-[#77847B]">
					Messwerte, Verteilungen und Systemzustand
				</p>
			</div>

			<div class="flex items-center gap-3 rounded-lg border border-[#CED8D0] bg-[#F1F4F0] px-4 py-3">
				<span class="h-2 w-2 rounded-full bg-[#487C69]"></span>

				<span class="text-[12px] text-[#566A5D]">
					Aktualisierung alle 5 Sekunden
				</span>
			</div>

		</div>

		<!-- HISTORISCHE DATEN -->
		{#if !data.hasRecentData && data.chartHistory.length > 0}

			<div class="mb-6 rounded-lg border border-[#CED8D0] bg-[#DBE5DD] px-5 py-4">

				<p class="text-[13px] font-semibold">
					Historische Messdaten
				</p>

				<p class="mt-1 text-[12px] text-[#68796D]">
					Die Diagramme zeigen den letzten verfügbaren Zeitraum:
					{formatDate(periodStart)} – {formatDate(data.chartEnd)}
				</p>

			</div>

		{/if}

		<!-- WARNUNGEN -->
		{#if data.latestAlert}

			<div
				class={data.latestAlert.severity === 'critical'
					? 'mb-6 rounded-lg border border-red-300 bg-red-50 px-5 py-4'
					: data.latestAlert.severity === 'warning'
						? 'mb-6 rounded-lg border border-amber-300 bg-amber-50 px-5 py-4'
						: 'mb-6 rounded-lg border border-[#BDD4C3] bg-[#DFEAE1] px-5 py-4'}
			>
				<p class="text-[13px] font-semibold">
					Systemmeldung
				</p>

				<p class="mt-1 text-[13px]">
					{data.latestAlert.message}
				</p>
			</div>

		{/if}

		<!-- AKTUELLE MESSWERTE -->
		<div class="mb-4 flex items-center justify-between gap-4">

			<h2 class="text-[15px] font-semibold">
				Aktuelle Messwerte
			</h2>

			<a
				href="/live-daten"
				class="text-[12px] font-medium text-[#416B50] hover:text-[#25332B]"
			>
				Alle Messwerte →
			</a>

		</div>

		<!-- KPI-KARTEN -->
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

			<!-- LUFTTEMPERATUR -->
			<div class="rounded-xl border border-[#CED8D0] bg-[#F1F4F0] p-6">

				<div class="flex items-center justify-between gap-3">
					<p class="text-[13px] font-medium text-[#68786E]">
						Lufttemperatur
					</p>

					<span class="h-2 w-2 rounded-full bg-[#487C69]"></span>
				</div>

				<p class="mt-7 break-words text-[38px] font-semibold tracking-tight tabular-nums">
					{formatValue(data.sensorData.temperature, '°C')}
				</p>

				<div class="mt-7 flex items-center justify-between border-t border-[#DCE3DD] pt-4">

					<span class="text-[12px] text-[#829087]">
						Aktueller Messwert
					</span>

					<span class="text-[11px] font-medium text-[#487C69]">
						°C
					</span>

				</div>

			</div>

			<!-- LUFTFEUCHTIGKEIT -->
			<div class="rounded-xl border border-[#CED8D0] bg-[#F1F4F0] p-6">

				<div class="flex items-center justify-between gap-3">
					<p class="text-[13px] font-medium text-[#68786E]">
						Luftfeuchtigkeit
					</p>

					<span class="h-2 w-2 rounded-full bg-[#648A9B]"></span>
				</div>

				<p class="mt-7 break-words text-[38px] font-semibold tracking-tight tabular-nums">
					{formatValue(data.sensorData.humidity, '%')}
				</p>

				<div class="mt-7 flex items-center justify-between border-t border-[#DCE3DD] pt-4">

					<span class="text-[12px] text-[#829087]">
						Relative Luftfeuchte
					</span>

					<span class="text-[11px] font-medium text-[#648A9B]">
						RH
					</span>

				</div>

			</div>

			<!-- BODENFEUCHTE -->
			<div class="rounded-xl border border-[#CED8D0] bg-[#F1F4F0] p-6">

				<div class="flex items-center justify-between gap-3">
					<p class="text-[13px] font-medium text-[#68786E]">
						Bodenfeuchte
					</p>

					<span class="h-2 w-2 rounded-full bg-[#A17F60]"></span>
				</div>

				<p class="mt-7 break-words text-[38px] font-semibold tracking-tight tabular-nums">
					{formatValue(data.sensorData.soilMoisture, '%')}
				</p>

				<div class="mt-7 flex items-center justify-between border-t border-[#DCE3DD] pt-4">

					<span class="text-[12px] text-[#829087]">
						Substratfeuchtigkeit
					</span>

					<span class="text-[11px] font-medium text-[#A17F60]">
						%
					</span>

				</div>

			</div>

			<!-- LICHTSTÄRKE -->
			<div class="rounded-xl border border-[#CED8D0] bg-[#F1F4F0] p-6">

				<div class="flex items-center justify-between gap-3">
					<p class="text-[13px] font-medium text-[#68786E]">
						Lichtstärke
					</p>

					<span class="h-2 w-2 rounded-full bg-[#857B9D]"></span>
				</div>

				<p class="mt-7 break-words text-[38px] font-semibold tracking-tight tabular-nums">
					{formatValue(data.sensorData.light, 'lux')}
				</p>

				<div class="mt-7 flex items-center justify-between border-t border-[#DCE3DD] pt-4">

					<span class="text-[12px] text-[#829087]">
						Beleuchtungsstärke
					</span>

					<span class="text-[11px] font-medium text-[#857B9D]">
						LUX
					</span>

				</div>

			</div>

		</div>

		<!-- DATENANALYSE -->
		<div class="mb-4 mt-9 flex flex-wrap items-center justify-between gap-3">

			<h2 class="text-[15px] font-semibold">
				Datenanalyse
			</h2>

			<p class="text-[12px] text-[#87928A]">
				{formatDate(periodStart)} – {formatDate(data.chartEnd)}
			</p>

		</div>

		<div class="grid grid-cols-1 gap-4 xl:grid-cols-3">

			<!-- TEMPERATUR-FLÄCHENDIAGRAMM -->
			<section class="min-w-0 rounded-xl border border-[#CED8D0] bg-[#F1F4F0] p-6 xl:col-span-2">

				<div class="flex flex-wrap items-start justify-between gap-4">

					<div>
						<h3 class="text-[15px] font-semibold">
							Temperaturentwicklung
						</h3>

						<p class="mt-1 text-[12px] text-[#87928A]">
							Temperatur im historischen Zeitverlauf
						</p>
					</div>

					<a
						href="/verlauf?metric=temperature&period=24h"
						class="rounded-md border border-[#C7D2C9] px-3 py-2 text-[12px] font-medium text-[#416B50] hover:bg-[#E2E9E3]"
					>
						Verlauf öffnen →
					</a>

				</div>

				{#if temperatureChart}

					<div class="mt-7">

						<svg
							viewBox="0 0 720 240"
							preserveAspectRatio="xMidYMid meet"
							class="h-[290px] w-full"
							role="img"
							aria-label="Temperatur-Flächendiagramm"
						>
							<defs>
								<linearGradient
									id="temperature-area"
									x1="0"
									y1="0"
									x2="0"
									y2="1"
								>
									<stop
										offset="0%"
										stop-color="#487C69"
										stop-opacity="0.28"
									/>

									<stop
										offset="100%"
										stop-color="#487C69"
										stop-opacity="0.02"
									/>
								</linearGradient>
							</defs>

							<!-- RASTER -->
							{#each [0, 1, 2, 3, 4] as i}
								<line
									x1="55"
									y1={30 + i * 43.75}
									x2="680"
									y2={30 + i * 43.75}
									stroke="#DCE3DD"
									stroke-width="1"
								/>
							{/each}

							<!-- FLÄCHE -->
							<polygon
								points={temperatureChart.area}
								fill="url(#temperature-area)"
							/>

							<!-- TEMPERATURKURVE -->
							<polyline
								points={temperatureChart.line}
								fill="none"
								stroke="#487C69"
								stroke-width="3"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>

							<!-- MESSPUNKTE -->
							{#each temperatureChart.points as point}
								<circle
									cx={point.x}
									cy={point.y}
									r="4"
									fill="#487C69"
								>
									<title>
										{formatValue(point.value, '°C')} ·
										{formatDateTime(point.time)}
									</title>
								</circle>
							{/each}

						</svg>

					</div>

					<div class="mt-3 flex justify-between border-t border-[#DCE3DD] pt-3 text-[11px] text-[#87928A]">
						<span>{formatDate(periodStart)}</span>
						<span>{formatDate(data.chartEnd)}</span>
					</div>

					<div class="mt-5 flex flex-wrap gap-6 text-[12px]">

						<div>
							<p class="text-[#87928A]">Minimum</p>

							<p class="mt-1 font-semibold">
								{formatValue(temperatureChart.minimum, '°C')}
							</p>
						</div>

						<div>
							<p class="text-[#87928A]">Maximum</p>

							<p class="mt-1 font-semibold">
								{formatValue(temperatureChart.maximum, '°C')}
							</p>
						</div>

						<div>
							<p class="text-[#87928A]">Messpunkte</p>

							<p class="mt-1 font-semibold">
								{temperatureRows.length}
							</p>
						</div>

					</div>

				{:else}

					<div class="mt-7 flex h-[290px] items-center justify-center rounded-lg bg-[#E5EBE6] text-[12px] text-[#87928A]">
						Keine Temperaturdaten vorhanden
					</div>

				{/if}

			</section>

			<!-- ZWEI KREISDIAGRAMME -->
			<section class="rounded-xl border border-[#CED8D0] bg-[#F1F4F0] p-6">

				<h3 class="text-[15px] font-semibold">
					Feuchtigkeitsübersicht
				</h3>

				<p class="mt-1 text-[12px] text-[#87928A]">
					Aktuelle Feuchtigkeitswerte
				</p>

				<div class="mt-10 grid grid-cols-2 gap-4">

					{@render gauge(
						data.sensorData.humidity,
						'Luftfeuchtigkeit',
						colors.humidity
					)}

					{@render gauge(
						data.sensorData.soilMoisture,
						'Bodenfeuchte',
						colors.soil
					)}

				</div>

				<div class="mt-10 border-t border-[#DCE3DD] pt-5">
					<p class="text-[12px] text-[#87928A]">
						Die Kreise zeigen die aktuellen Prozentwerte.
					</p>
				</div>

			</section>

		</div>

		<!-- NEU: KOMPAKTE ANALYSEDIAGRAMME -->
		<div class="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">

			<!-- TEMPERATURVERTEILUNG -->
			<section class="min-w-0 rounded-xl border border-[#CED8D0] bg-[#F1F4F0] p-6">

				<div class="flex flex-wrap items-start justify-between gap-4">

					<div>
						<h3 class="text-[15px] font-semibold">
							Temperaturverteilung
						</h3>

						<p class="mt-1 text-[12px] text-[#87928A]">
							Häufigkeit der gemessenen Temperaturen
						</p>
					</div>

					<span class="rounded-md bg-[#E4EBE6] px-3 py-1.5 text-[11px] font-medium text-[#607267]">
						{temperatureRows.length} Messungen
					</span>

				</div>

				{#if histogram.length > 0}

					<!-- STATISTIK -->
					<div class="mt-6 grid grid-cols-3 gap-4 border-b border-[#DCE3DD] pb-5">

						<div>
							<p class="text-[11px] text-[#87928A]">
								Durchschnitt
							</p>

							<p class="mt-1 text-[20px] font-semibold tabular-nums">
								{formatValue(averageTemperature, '°C')}
							</p>
						</div>

						<div>
							<p class="text-[11px] text-[#87928A]">
								Minimum
							</p>

							<p class="mt-1 text-[20px] font-semibold tabular-nums">
								{formatValue(temperatureChart.minimum, '°C')}
							</p>
						</div>

						<div>
							<p class="text-[11px] text-[#87928A]">
								Maximum
							</p>

							<p class="mt-1 text-[20px] font-semibold tabular-nums">
								{formatValue(temperatureChart.maximum, '°C')}
							</p>
						</div>

					</div>

					<!-- HISTOGRAMM -->
					<div class="mt-6">

						<svg
							viewBox="0 0 600 205"
							preserveAspectRatio="xMidYMid meet"
							class="h-[210px] w-full"
							role="img"
							aria-label="Histogramm der Temperaturverteilung"
						>

							<!-- GITTERLINIEN -->
							{#each [0, 1, 2, 3, 4] as step}
								{@const y = 165 - step * 35}

								<line
									x1="45"
									y1={y}
									x2="580"
									y2={y}
									stroke="#DAE2DC"
									stroke-width="1"
								/>

								<text
									x="32"
									y={y + 4}
									text-anchor="end"
									font-size="11"
									fill="#87928A"
								>
									{Number(((step / 4) * histogramMax).toFixed(1)).toLocaleString('de-DE')}
								</text>
							{/each}

							<!-- SÄULEN -->
							{#each histogram as bin, index}
								{@const barHeight = (bin.count / histogramMax) * 140}
								{@const x = 49 + index * 106}

								<rect
									x={x}
									y={165 - barHeight}
									width="98"
									height={barHeight}
									fill="#648A9B"
									rx="2"
								>
									<title>
										{formatValue(bin.start, '°C')} –
										{formatValue(bin.end, '°C')}:
										{bin.count} Messungen
									</title>
								</rect>

								{#if bin.count > 0}
									<text
										x={x + 49}
										y={155 - barHeight}
										text-anchor="middle"
										font-size="12"
										font-weight="600"
										fill="#526B78"
									>
										{bin.count}
									</text>
								{/if}
							{/each}

						</svg>

						<div class="grid grid-cols-5 gap-1 border-t border-[#CCD8CF] pt-3 text-center">

							{#each histogram as bin}
								<p class="text-[10px] text-[#87928A]">
									{formatValue(bin.start)}–
									{formatValue(bin.end)}
								</p>
							{/each}

						</div>

					</div>

					<div class="mt-5 flex items-center justify-between border-t border-[#DCE3DD] pt-4 text-[11px] text-[#87928A]">
						<span>Temperaturbereiche (°C)</span>
						<span>Häufigkeit der Messungen</span>
					</div>

				{:else}

					<div class="mt-7 flex h-[250px] items-center justify-center rounded-lg bg-[#E5EBE6] text-[12px] text-[#87928A]">
						Keine Temperaturmessungen vorhanden
					</div>

				{/if}

			</section>

			<!-- LICHTINTENSITÄT: HORIZONTALES BALKENDIAGRAMM -->
			<section class="min-w-0 rounded-xl border border-[#CED8D0] bg-[#F1F4F0] p-6">

				<div class="flex flex-wrap items-start justify-between gap-4">

					<div>
						<h3 class="text-[15px] font-semibold">
							Lichtintensität
						</h3>

						<p class="mt-1 text-[12px] text-[#87928A]">
							Vergleich der letzten Lichtmessungen
						</p>
					</div>

					<span class="rounded-md bg-[#E4EBE6] px-3 py-1.5 text-[11px] font-medium text-[#607267]">
						lux
					</span>

				</div>

				{#if recentLightRows.length > 0}

					<div class="mt-7 space-y-5">

						{#each recentLightRows as row}

							<div class="grid grid-cols-[80px_minmax(0,1fr)_65px] items-center gap-3 sm:grid-cols-[95px_minmax(0,1fr)_75px]">

								<!-- ZEITPUNKT -->
								<span class="text-[11px] tabular-nums text-[#7F8E83]">
									{formatShortTime(row.time)}
								</span>

								<!-- BALKEN -->
								<div
									class="h-5 overflow-hidden rounded-sm bg-[#E2E8E3]"
									title={`${formatValue(row.value, 'lux')} · ${formatDateTime(row.time)}`}
								>
									<div
										class="h-full bg-[#857B9D] transition-all duration-300"
										style={`width: ${Math.max(0, (row.value / maximumLight) * 100)}%`}
									></div>
								</div>

								<!-- WERT -->
								<span class="text-right text-[12px] font-semibold tabular-nums text-[#46534A]">
									{formatValue(row.value)}
								</span>

							</div>

						{/each}

					</div>

					<!-- SKALA -->
					<div class="mt-6 grid grid-cols-[80px_minmax(0,1fr)_65px] gap-3 sm:grid-cols-[95px_minmax(0,1fr)_75px]">

						<div></div>

						<div class="flex justify-between border-t border-[#C8D3CB] pt-3 text-[10px] text-[#87928A]">
							<span>0</span>
							<span>{formatValue(maximumLight / 2)}</span>
							<span>{formatValue(maximumLight)}</span>
						</div>

						<div></div>

					</div>

					<!-- ZUSAMMENFASSUNG -->
					<div class="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#DCE3DD] pt-5">

						<div>
							<p class="text-[11px] text-[#87928A]">
								Letzter Messwert
							</p>

							<p class="mt-1 text-[22px] font-semibold tabular-nums">
								{formatValue(recentLightRows[recentLightRows.length - 1].value, 'lux')}
							</p>
						</div>

						<div class="text-right">
							<p class="text-[11px] text-[#87928A]">
								Durchschnitt
							</p>

							<p class="mt-1 text-[22px] font-semibold tabular-nums">
								{formatValue(average(recentLightRows), 'lux')}
							</p>
						</div>

					</div>

				{:else}

					<div class="mt-7 flex h-[250px] items-center justify-center rounded-lg bg-[#E5EBE6] text-[12px] text-[#87928A]">
						Keine Lichtmessungen vorhanden
					</div>

				{/if}

			</section>

		</div>

		<!-- SYSTEMINFORMATIONEN -->
		<div class="mb-4 mt-9">

			<h2 class="text-[15px] font-semibold">
				Systeminformationen
			</h2>

		</div>

		<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">

			<!-- KOMPONENTEN-DOUGHNUT -->
			<section class="rounded-xl border border-[#CED8D0] bg-[#F1F4F0] p-6">

				<h3 class="text-[15px] font-semibold">
					Komponentenstatus
				</h3>

				<p class="mt-1 text-[12px] text-[#87928A]">
					Verteilung aktiver und inaktiver Komponenten
				</p>

				<div class="mt-7 flex flex-col items-center gap-7 sm:flex-row">

					<div class="relative h-[180px] w-[180px] shrink-0">

						<svg
							viewBox="0 0 120 120"
							class="h-full w-full -rotate-90"
							role="img"
							aria-label={`${activeCount} aktive und ${inactiveCount} inaktive Komponenten`}
						>
							<circle
								cx="60"
								cy="60"
								r="45"
								fill="none"
								stroke="#C9D3CC"
								stroke-width="15"
							/>

							<circle
								cx="60"
								cy="60"
								r="45"
								fill="none"
								stroke="#487C69"
								stroke-width="15"
								stroke-dasharray={`${(activeCount / 3) * 282.74} 282.74`}
							/>
						</svg>

						<div class="absolute inset-0 flex flex-col items-center justify-center">

							<span class="text-[30px] font-semibold tabular-nums">
								{activeCount}/3
							</span>

							<span class="text-[11px] text-[#87928A]">
								Aktiv
							</span>

						</div>

					</div>

					<div class="w-full space-y-4">

						<div class="flex items-center justify-between gap-4">

							<span class="flex items-center gap-2 text-[13px]">
								<span class="h-2.5 w-2.5 rounded-full bg-[#487C69]"></span>
								Aktiv
							</span>

							<span class="text-[13px] font-semibold">
								{activeCount}
							</span>

						</div>

						<div class="flex items-center justify-between gap-4">

							<span class="flex items-center gap-2 text-[13px]">
								<span class="h-2.5 w-2.5 rounded-full bg-[#C9D3CC]"></span>
								Inaktiv
							</span>

							<span class="text-[13px] font-semibold">
								{inactiveCount}
							</span>

						</div>

						<div class="border-t border-[#DCE3DD] pt-4 text-[12px] text-[#68796D]">

							Betriebsmodus:

							<span class="font-semibold">
								{data.statusData.mode ?? 'Unbekannt'}
							</span>

						</div>

					</div>

				</div>

				<div class="mt-7 grid grid-cols-3 gap-3 border-t border-[#DCE3DD] pt-5 text-center">

					<div>
						<p class="text-[12px] font-medium">
							Belüftung
						</p>

						<p class="mt-1 text-[11px] text-[#87928A]">
							{fanActive ? 'Aktiv' : 'Inaktiv'}
						</p>
					</div>

					<div>
						<p class="text-[12px] font-medium">
							Bewässerung
						</p>

						<p class="mt-1 text-[11px] text-[#87928A]">
							{pumpActive ? 'Aktiv' : 'Inaktiv'}
						</p>
					</div>

					<div>
						<p class="text-[12px] font-medium">
							Beleuchtung
						</p>

						<p class="mt-1 text-[11px] text-[#87928A]">
							{ledActive ? 'Aktiv' : 'Inaktiv'}
						</p>
					</div>

				</div>

			</section>

			<!-- WEITERE SENSORDATEN -->
			<section class="rounded-xl border border-[#CED8D0] bg-[#F1F4F0] p-6">

				<h3 class="text-[15px] font-semibold">
					Weitere Sensordaten
				</h3>

				<p class="mt-1 text-[12px] text-[#87928A]">
					Zusätzliche aktuelle Messwerte
				</p>

				<div class="mt-7 space-y-6">

					<!-- BODENTEMPERATUR -->
					<div class="flex items-center justify-between gap-4 border-b border-[#DCE3DD] pb-5">

						<div>
							<p class="text-[13px] font-medium">
								Bodentemperatur
							</p>

							<p class="mt-1 text-[11px] text-[#87928A]">
								Temperatur im Substrat
							</p>
						</div>

						<p class="text-right text-[24px] font-semibold tabular-nums">
							{formatValue(data.sensorData.soilTemperature, '°C')}
						</p>

					</div>

					<!-- DLI -->
					<div class="flex items-center justify-between gap-4 border-b border-[#DCE3DD] pb-5">

						<div>
							<p class="text-[13px] font-medium">
								Daily Light Integral
							</p>

							<p class="mt-1 text-[11px] text-[#87928A]">
								Lichtmenge pro Tag
							</p>
						</div>

						<div class="text-right">

							<p class="text-[24px] font-semibold tabular-nums">
								{formatValue(data.sensorData.dli)}
							</p>

							<p class="text-[10px] text-[#87928A]">
								mol/m²/Tag
							</p>

						</div>

					</div>

					<!-- LETZTE MESSUNG -->
					<div>
						<p class="text-[12px] text-[#87928A]">
							Letzte Messung
						</p>

						<p class="mt-2 text-[14px] font-semibold">
							{formatDateTime(data.sensorData.measuredAt)}
						</p>
					</div>

				</div>

			</section>

		</div>

		<!-- SYSTEMSTATUS -->
		{#if !data.latestAlert}

			<div class="mt-6 flex items-center gap-2">

				<span class="h-2 w-2 rounded-full bg-[#487C69]"></span>

				<p class="text-[12px] text-[#87928A]">
					Keine aktiven Warnungen
				</p>

			</div>

		{/if}

	</main>

</div>