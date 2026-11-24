<script>
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import AppHeader from '$lib/components/AppHeader.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime.js';

	let { data } = $props();

	const measurements = [
		{
			key: 'temperature',
			label: m.history_air_temperature(),
			unit: '°C',
			color: '#487C69'
		},
		{
			key: 'humidity',
			label: m.history_humidity(),
			unit: '%',
			color: '#648A9B'
		},
		{
			key: 'soilMoisture',
			label: m.history_soil_moisture(),
			unit: '%',
			color: '#A17F60'
		},
		{
			key: 'soilTemperature',
			label: m.history_soil_temperature(),
			unit: '°C',
			color: '#587F71'
		},
		{
			key: 'light',
			label: m.history_light(),
			unit: 'lux',
			color: '#857B9D'
		}
	];

	const periods = [
		{ key: '24h', label: m.history_24_hours() },
		{ key: '7d', label: m.history_7_days() },
		{ key: '30d', label: m.history_30_days() }
	];

	let selectedMetric = $derived(
		measurements.find((item) => item.key === data.metric) ??
			measurements[0]
	);

	let selectedPeriod = $derived(data.period ?? '24h');

	let selectedPeriodLabel = $derived(
		periods.find((p) => p.key === selectedPeriod)?.label ?? selectedPeriod
	);

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

	function linkFor(metric, period) {
		return `/verlauf?metric=${metric}&period=${period}`;
	}

	function formatDate(value) {
		if (!value) return '–';

		const date = new Date(value);

		if (!Number.isFinite(date.getTime())) return '–';

		return date.toLocaleString(currentLocale(), {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	// Unterstützt bereits berechnete SVG-Koordinaten aus dem Backend.
	function getChartPoints(points) {
		if (typeof points === 'string') return points;

		if (!Array.isArray(points)) return '';

		return points
			.map((point) => {
				if (Array.isArray(point)) {
					return `${point[0]},${point[1]}`;
				}

				if (
					point &&
					Number.isFinite(Number(point.x)) &&
					Number.isFinite(Number(point.y))
				) {
					return `${point.x},${point.y}`;
				}

				return '';
			})
			.filter(Boolean)
			.join(' ');
	}

	let chartLine = $derived(getChartPoints(data.chartPoints));

	let statistics = $derived({
		current: data.current,
		min: data.min,
		max: data.max,
		average: data.average
	});

	let hasChart = $derived(chartLine.length > 0);

	onMount(() => {
		const interval = setInterval(() => invalidateAll(), 5000);
		return () => clearInterval(interval);
	});
</script>

<svelte:head>
	<title>{m.history_title()} · BioBox</title>
</svelte:head>

<div class="min-h-screen bg-[#E5EAE6] px-6 py-6 font-sans text-[#25332B] sm:px-9">
	<AppHeader active="verlauf" />

	<main class="mx-auto max-w-[1400px] pb-16 pt-9">

		<!-- HEADER -->
		<div class="mb-8 flex flex-wrap items-center justify-between gap-5">
			<div>
				<p class="text-[12px] text-[#77847B]">
					{m.history_analytics()}
				</p>

				<h1 class="mt-2 text-[27px] font-semibold tracking-tight">
					{m.history_title()}
				</h1>

				<p class="mt-1 text-[13px] text-[#77847B]">
					{m.history_intro()}
				</p>
			</div>

			<div class="flex items-center gap-3 rounded-lg border border-[#CED8D0] bg-[#F1F4F0] px-4 py-3">
				<span class="h-2 w-2 rounded-full bg-[#487C69]"></span>

				<div>
					<p class="text-[12px] font-medium text-[#405B49]">
						{m.history_historical_data()}
					</p>

					<p class="mt-0.5 text-[11px] text-[#829087]">
						{m.history_auto_refresh()}
					</p>
				</div>
			</div>
		</div>

		<!-- FILTER -->
		<section class="rounded-xl border border-[#CED8D0] bg-[#F1F4F0] p-5 sm:p-6">

			<div class="flex flex-wrap items-start justify-between gap-5">

				<div>
					<h2 class="text-[14px] font-semibold">
						{m.history_filters()}
					</h2>

					<p class="mt-1 text-[12px] text-[#87928A]">
						{m.history_filter_hint()}
					</p>
				</div>

				<span class="rounded-md bg-[#E4EBE6] px-3 py-2 text-[11px] font-medium text-[#607267]">
					{selectedMetric.label}
				</span>

			</div>

			<div class="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_auto]">

				<!-- SENSOR FILTER -->
				<div>
					<p class="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#859188]">
						{m.history_measurement()}
					</p>

					<div class="flex flex-wrap gap-2">
						{#each measurements as measurement}
							<a
								href={linkFor(measurement.key, selectedPeriod)}
								aria-current={data.metric === measurement.key ? 'page' : undefined}
								class={data.metric === measurement.key
									? 'inline-flex items-center gap-2 rounded-md bg-[#1C2B23] px-4 py-2.5 text-[12px] font-medium text-white'
									: 'inline-flex items-center gap-2 rounded-md border border-[#D2DCD4] bg-[#EAF0EB] px-4 py-2.5 text-[12px] font-medium text-[#65766A] transition-colors hover:border-[#A6B9AA] hover:bg-[#E0E9E2]'}
							>
								<span
									class="h-2 w-2 rounded-full"
									style={`background-color: ${
										data.metric === measurement.key
											? '#A9C4B0'
											: measurement.color
									}`}
								></span>

								{measurement.label}
							</a>
						{/each}
					</div>
				</div>

				<!-- PERIOD FILTER -->
				<div>
					<p class="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#859188]">
						{m.history_period()}
					</p>

					<div class="inline-flex flex-wrap gap-1 rounded-lg border border-[#D2DCD4] bg-[#E5EBE6] p-1">
						{#each periods as period}
							<a
								href={linkFor(selectedMetric.key, period.key)}
								aria-current={selectedPeriod === period.key ? 'page' : undefined}
								class={selectedPeriod === period.key
									? 'rounded-md bg-[#F7F9F6] px-4 py-2 text-[12px] font-semibold text-[#25332B] shadow-sm'
									: 'rounded-md px-4 py-2 text-[12px] font-medium text-[#7B8980] transition-colors hover:text-[#25332B]'}
							>
								{period.label}
							</a>
						{/each}
					</div>
				</div>

			</div>
		</section>

		<!-- STATISTICS -->
		<div class="mt-5 grid grid-cols-2 gap-4 xl:grid-cols-4">

			{#each [
				{ title: m.history_latest_value(), value: statistics.current },
				{ title: m.history_average(), value: statistics.average },
				{ title: m.history_minimum(), value: statistics.min },
				{ title: m.history_maximum(), value: statistics.max }
			] as statistic}

				<div class="rounded-xl border border-[#CED8D0] bg-[#F1F4F0] p-5 sm:p-6">

					<div class="flex items-center justify-between gap-3">
						<p class="text-[12px] font-medium text-[#75847A]">
							{statistic.title}
						</p>

						<span
							class="h-2 w-2 rounded-full"
							style={`background-color: ${selectedMetric.color}`}
						></span>
					</div>

					<p class="mt-5 break-words text-[clamp(1.4rem,2.5vw,2rem)] font-semibold tracking-tight tabular-nums">
						{formatValue(statistic.value, selectedMetric.unit)}
					</p>

					<p class="mt-4 border-t border-[#DCE3DD] pt-3 text-[11px] text-[#87928A]">
						{selectedMetric.label}
					</p>

				</div>

			{/each}
		</div>

		<!-- MAIN CHART -->
		<section class="mt-5 overflow-hidden rounded-xl border border-[#CED8D0] bg-[#F1F4F0]">

			<div class="flex flex-wrap items-start justify-between gap-5 border-b border-[#DCE3DD] px-6 py-6 sm:px-8">

				<div>
					<div class="flex items-center gap-2.5">

						<span
							class="h-2.5 w-2.5 rounded-full"
							style={`background-color: ${selectedMetric.color}`}
						></span>

						<h2 class="text-[16px] font-semibold">
							{m.history_chart_title({ sensor: selectedMetric.label })}
						</h2>
					</div>

					<p class="mt-2 text-[12px] text-[#87928A]">
						{selectedPeriodLabel}
						· {m.history_database_readings()}
					</p>
				</div>

				<div class="text-left sm:text-right">
					<p class="text-[11px] text-[#87928A]">
						{m.history_latest_value()}
					</p>

					<p class="mt-1 text-[24px] font-semibold tracking-tight tabular-nums">
						{formatValue(statistics.current, selectedMetric.unit)}
					</p>
				</div>

			</div>

			<div class="px-5 pb-6 pt-8 sm:px-8">

				{#if hasChart}

					<div class="relative">

						<svg
							viewBox="0 0 720 280"
							preserveAspectRatio="none"
							class="h-[260px] w-full sm:h-[360px]"
							role="img"
							aria-label={m.history_chart_label({ sensor: selectedMetric.label })}
						>
							<defs>
								<linearGradient id="history-area" x1="0" y1="0" x2="0" y2="1">
									<stop
										offset="0%"
										stop-color={selectedMetric.color}
										stop-opacity="0.18"
									/>

									<stop
										offset="100%"
										stop-color={selectedMetric.color}
										stop-opacity="0.01"
									/>
								</linearGradient>
							</defs>

							<!-- GRID -->
							{#each [0, 1, 2, 3, 4] as i}
								<line
									x1="0"
									y1={20 + i * 60}
									x2="720"
									y2={20 + i * 60}
									stroke="#DCE3DD"
									stroke-width="1"
								/>
							{/each}

							<!-- VERLAUFSKURVE -->
							<polyline
								points={chartLine}
								fill="none"
								stroke={selectedMetric.color}
								stroke-width="3"
								stroke-linecap="round"
								stroke-linejoin="round"
								vector-effect="non-scaling-stroke"
							/>
						</svg>
					</div>

					<div class="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#DCE3DD] pt-4">

						<div class="flex items-center gap-2">
							<span
								class="h-2.5 w-2.5 rounded-full"
								style={`background-color: ${selectedMetric.color}`}
							></span>

							<span class="text-[11px] text-[#77877C]">
								{selectedMetric.label} ({selectedMetric.unit})
							</span>
						</div>

						<span class="text-[11px] text-[#87928A]">
							{selectedPeriodLabel}
						</span>

					</div>

				{:else}

					<div class="flex min-h-[320px] flex-col items-center justify-center rounded-lg border border-dashed border-[#D1DBD3] bg-[#E9EEEA] px-6 text-center">

						<div class="flex h-12 w-12 items-center justify-center rounded-full bg-[#DEE7E0]">

							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="#72877A"
								stroke-width="1.5"
								class="h-6 w-6"
								aria-hidden="true"
							>
								<path d="M3 3v18h18" />
								<path d="m6 15 5-5 4 3 5-7" />
							</svg>

						</div>

						<h3 class="mt-4 text-[14px] font-semibold">
							{m.history_no_data()}
						</h3>

						<p class="mt-2 max-w-sm text-[12px] leading-6 text-[#87928A]">
							{m.history_no_data_hint()}
						</p>

					</div>

				{/if}

			</div>
		</section>

		<!-- BOTTOM INFORMATION -->
		<div class="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">

			<section class="rounded-xl border border-[#CED8D0] bg-[#F1F4F0] p-6 lg:col-span-2">

				<h2 class="text-[14px] font-semibold">
					{m.history_about()}
				</h2>

				<p class="mt-3 max-w-2xl text-[12px] leading-6 text-[#77847B]">
					{m.history_about_description()}
				</p>

				<div class="mt-5 flex flex-wrap gap-3">

					<div class="rounded-md border border-[#D5DED7] px-3 py-2">
						<p class="text-[10px] text-[#87928A]">
							{m.history_sensor()}
						</p>

						<p class="mt-1 text-[12px] font-semibold">
							{selectedMetric.label}
						</p>
					</div>

					<div class="rounded-md border border-[#D5DED7] px-3 py-2">
						<p class="text-[10px] text-[#87928A]">
							{m.history_period()}
						</p>

						<p class="mt-1 text-[12px] font-semibold">
							{selectedPeriodLabel}
						</p>
					</div>

					<div class="rounded-md border border-[#D5DED7] px-3 py-2">
						<p class="text-[10px] text-[#87928A]">
							{m.history_unit()}
						</p>

						<p class="mt-1 text-[12px] font-semibold">
							{selectedMetric.unit}
						</p>
					</div>

				</div>
			</section>

			<section class="flex flex-col justify-between rounded-xl border border-[#CED8D0] bg-[#F1F4F0] p-6">

				<div>
					<h2 class="text-[14px] font-semibold">
						{m.history_live_monitoring()}
					</h2>

					<p class="mt-3 text-[12px] leading-6 text-[#77847B]">
						{m.history_live_description()}
					</p>
				</div>

				<a
					href="/live-daten"
					class="mt-7 inline-flex w-fit items-center gap-2 rounded-md bg-[#1C2B23] px-4 py-3 text-[12px] font-medium text-[#E8EBE9] transition-colors hover:bg-[#304437]"
				>
					{m.history_open_live()} →
				</a>

			</section>
		</div>

	</main>
</div>