<script>
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import AppHeader from '$lib/components/AppHeader.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime.js';

	let { data } = $props();

	let analysis = $derived(data.analysis);

	function currentLocale() {
		if (getLocale() === 'en') return 'en-US';
		if (getLocale() === 'sq') return 'sq-AL';
		return 'de-DE';
	}

	function showValue(value, unit = '') {
		if (
			value === null ||
			value === undefined ||
			!Number.isFinite(Number(value))
		) {
			return m.plant_no_data();
		}

		const number = Number(value).toLocaleString(currentLocale(), {
			minimumFractionDigits: 1,
			maximumFractionDigits: 1
		});

		return unit ? `${number} ${unit}` : number;
	}

	function formatDate(value) {
		if (!value) return m.plant_no_data();

		const date = new Date(value);

		if (!Number.isFinite(date.getTime())) return m.plant_no_data();

		return date.toLocaleString(currentLocale(), {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function percentage(value) {
		if (value == null || !Number.isFinite(Number(value))) return 0;

		return Math.max(0, Math.min(100, Number(value)));
	}

	function imageCanBeDisplayed(path) {
		return typeof path === 'string' && path.startsWith('/uploads/');
	}

	function hasValue(value) {
		return value !== null &&
			value !== undefined &&
			Number.isFinite(Number(value));
	}

	function healthColor(score) {
		if (!hasValue(score)) return '#A3ADA5';

		const value = Number(score);

		if (value >= 75) return '#487C69';
		if (value >= 50) return '#B18B52';

		return '#B56F63';
	}

	onMount(() => {
		const interval = setInterval(() => {
			invalidateAll();
		}, 5000);

		return () => clearInterval(interval);
	});
</script>

<svelte:head>
	<title>{m.plant_title()} · BioBox</title>
</svelte:head>

<!-- CIRCULAR INDICATOR -->
{#snippet circleIndicator(value, label, description, color)}
	<div class="flex items-center gap-4">

		<div class="relative h-[96px] w-[96px] shrink-0">

			<svg
				viewBox="0 0 120 120"
				class="h-full w-full -rotate-90"
				role="img"
				aria-label={`${label}: ${showValue(value, '%')}`}
			>
				<circle
					cx="60"
					cy="60"
					r="48"
					fill="none"
					stroke="#DEE5DF"
					stroke-width="11"
				/>

				<circle
					cx="60"
					cy="60"
					r="48"
					fill="none"
					stroke={color}
					stroke-width="11"
					stroke-linecap="round"
					stroke-dasharray={`${percentage(value) * 3.016} 301.6`}
				/>
			</svg>

			<div class="absolute inset-0 flex items-center justify-center">

				<p class="text-[18px] font-semibold tabular-nums">
					{hasValue(value) ? `${showValue(value)}%` : '–'}
				</p>

			</div>

		</div>

		<div class="min-w-0">

			<p class="text-[13px] font-semibold">
				{label}
			</p>

			<p class="mt-1 text-[11px] leading-5 text-[#87928A]">
				{description}
			</p>

		</div>

	</div>
{/snippet}

<div class="min-h-screen bg-[#E5EAE6] px-6 py-6 font-sans text-[#25332B] sm:px-9">

	<AppHeader active="pflanzenanalyse" />

	<main class="mx-auto max-w-[1400px] pb-16 pt-9">

		<!-- HEADER -->
		<div class="mb-8 flex flex-wrap items-center justify-between gap-5">

			<div>
				<p class="text-[12px] text-[#77847B]">
					{m.plant_breadcrumb()}
				</p>

				<h1 class="mt-2 text-[27px] font-semibold tracking-tight">
					{m.plant_title()}
				</h1>

				<p class="mt-1 text-[13px] text-[#77847B]">
					{m.plant_intro()}
				</p>
			</div>

			<div class="flex items-center gap-3 rounded-lg border border-[#CED8D0] bg-[#F1F4F0] px-4 py-3">

				<span class="h-2 w-2 rounded-full bg-[#487C69]"></span>

				<div>
					<p class="text-[12px] font-medium text-[#405B49]">
						{m.plant_auto_refresh()}
					</p>

					<p class="mt-0.5 text-[11px] text-[#829087]">
						{m.plant_refresh_interval()}
					</p>
				</div>

			</div>

		</div>

		<!-- MAIN AREA -->
		<div class="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">

			<!-- PLANT IMAGE -->
			<section class="min-w-0 overflow-hidden rounded-xl border border-[#CED8D0] bg-[#F1F4F0]">

				<div class="flex flex-wrap items-start justify-between gap-4 border-b border-[#DCE3DD] px-6 py-5">

					<div>
						<h2 class="text-[15px] font-semibold">
							{m.plant_current_image()}
						</h2>

						<p class="mt-1 text-[12px] text-[#87928A]">
							{m.plant_latest_image()}
						</p>
					</div>

					<span class="rounded-md bg-[#E2EAE4] px-3 py-2 text-[11px] font-medium text-[#5D7664]">
						{m.plant_camera_image()}
					</span>

				</div>

				<div class="p-5 sm:p-6">

					<div class="flex min-h-[360px] items-center justify-center overflow-hidden rounded-lg bg-[#DCE5DE] sm:min-h-[450px]">

						{#if imageCanBeDisplayed(analysis?.file_path)}

							<img
								src={analysis.file_path}
								alt={m.plant_image_alt()}
								class="max-h-[520px] w-full object-contain"
							/>

						{:else}

							<div class="px-6 py-14 text-center">

								<div class="mx-auto flex h-16 w-16 items-center justify-center rounded-xl border border-[#C4D3C8] bg-[#EAF0EB]">

									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="#718D79"
										stroke-width="1.5"
										class="h-8 w-8"
										aria-hidden="true"
									>
										<rect x="3" y="3" width="18" height="18" rx="2" />
										<circle cx="8.5" cy="8.5" r="1.5" />
										<path d="m3 17 5-5 4 4 3-3 6 6" />
									</svg>

								</div>

								<p class="mt-5 text-[14px] font-semibold text-[#526C59]">
									{m.plant_no_image()}
								</p>

								<p class="mx-auto mt-2 max-w-xs text-[12px] leading-6 text-[#829087]">
									{m.plant_no_image_hint()}
								</p>

							</div>

						{/if}

					</div>

					<div class="mt-5 flex flex-wrap items-center justify-between gap-3">

						<div>
							<p class="text-[11px] text-[#87928A]">
								{m.plant_capture_time()}
							</p>

							<p class="mt-1 text-[13px] font-semibold">
								{formatDate(analysis?.captured_at)}
							</p>
						</div>

						{#if analysis?.file_name}
							<div class="min-w-0 text-left sm:text-right">
								<p class="text-[11px] text-[#87928A]">
									{m.plant_image_file()}
								</p>

								<p class="mt-1 max-w-[250px] break-all text-[12px] font-medium text-[#68796D]">
									{analysis.file_name}
								</p>
							</div>
						{/if}

					</div>

				</div>

			</section>

			<!-- HEALTH SCORE -->
			<section class="flex min-w-0 flex-col rounded-xl border border-[#CED8D0] bg-[#F1F4F0] p-6 sm:p-7">

				<div class="flex items-start justify-between gap-4">

					<div>
						<h2 class="text-[15px] font-semibold">
							{m.plant_health()}
						</h2>

						<p class="mt-1 text-[12px] text-[#87928A]">
							{m.plant_health_result()}
						</p>
					</div>

					<span
						class="h-2.5 w-2.5 rounded-full"
						style={`background-color: ${healthColor(analysis?.health_score)}`}
					></span>

				</div>

				<!-- HEALTH CIRCLE -->
				<div class="flex flex-1 flex-col items-center justify-center py-10">

					<div class="relative h-[210px] w-[210px]">

						<svg
							viewBox="0 0 120 120"
							class="h-full w-full -rotate-90"
							role="img"
							aria-label={m.plant_health_score({
								score: showValue(analysis?.health_score)
							})}
						>
							<circle
								cx="60"
								cy="60"
								r="48"
								fill="none"
								stroke="#DEE5DF"
								stroke-width="9"
							/>

							<circle
								cx="60"
								cy="60"
								r="48"
								fill="none"
								stroke={healthColor(analysis?.health_score)}
								stroke-width="9"
								stroke-linecap="round"
								stroke-dasharray={`${percentage(analysis?.health_score) * 3.016} 301.6`}
							/>
						</svg>

						<div class="absolute inset-0 flex flex-col items-center justify-center">

							<p class="text-[46px] font-semibold leading-none tracking-tight tabular-nums">
								{hasValue(analysis?.health_score)
									? showValue(analysis.health_score)
									: '–'}
							</p>

							<p class="mt-2 text-[12px] text-[#87928A]">
								{m.plant_out_of_100()}
							</p>

						</div>

					</div>

					{#if analysis?.health_category}
						<p
							class="mt-5 rounded-md px-4 py-2 text-[12px] font-semibold"
							style={`color: ${healthColor(analysis?.health_score)}; background-color: #E5EBE6;`}
						>
							{analysis.health_category}
						</p>
					{:else}
						<p class="mt-5 text-[12px] text-[#87928A]">
							{m.plant_no_health_rating()}
						</p>
					{/if}

				</div>

				<!-- HEALTH TREND -->
				<div class="border-t border-[#DCE3DD] pt-5">

					<div class="flex flex-wrap items-center justify-between gap-3">

						<div>
							<p class="text-[11px] text-[#87928A]">
								{m.plant_health_trend()}
							</p>

							<p class="mt-2 text-[23px] font-semibold tabular-nums">
								{hasValue(analysis?.health_trend_24h)
									? `${Number(analysis.health_trend_24h) > 0 ? '+' : ''}${showValue(analysis.health_trend_24h)} ${m.plant_points()}`
									: m.plant_no_data()}
							</p>
						</div>

						{#if hasValue(analysis?.health_trend_24h)}

							<span
								class={Number(analysis.health_trend_24h) > 0
									? 'rounded-md bg-[#DFEAE1] px-3 py-2 text-[12px] font-semibold text-[#487C69]'
									: Number(analysis.health_trend_24h) < 0
										? 'rounded-md bg-[#F0E3E1] px-3 py-2 text-[12px] font-semibold text-[#A5685E]'
										: 'rounded-md bg-[#E6EAE6] px-3 py-2 text-[12px] font-semibold text-[#78867C]'}
							>
								{Number(analysis.health_trend_24h) > 0
									? `↗ ${m.plant_improvement()}`
									: Number(analysis.health_trend_24h) < 0
										? `↘ ${m.plant_decline()}`
										: `→ ${m.plant_unchanged()}`}
							</span>

						{/if}

					</div>

				</div>

			</section>

		</div>

		<!-- MEASUREMENTS -->
		<div class="mb-4 mt-9 flex flex-wrap items-center justify-between gap-4">

			<div>
				<h2 class="text-[16px] font-semibold">
					{m.plant_image_analysis()}
				</h2>

				<p class="mt-1 text-[12px] text-[#829087]">
					{m.plant_analysis_description()}
				</p>
			</div>

			<span class="text-[12px] text-[#87928A]">
				{m.plant_computer_vision()}
			</span>

		</div>

		<div class="grid grid-cols-1 gap-4 lg:grid-cols-3">

			<!-- LEAF AREA -->
			<section class="rounded-xl border border-[#CED8D0] bg-[#F1F4F0] p-6">

				<div class="flex items-center justify-between gap-3">

					<h3 class="text-[13px] font-semibold">
						{m.plant_leaf_area()}
					</h3>

					<span class="h-2 w-2 rounded-full bg-[#487C69]"></span>

				</div>

				<p class="mt-6 break-words text-[32px] font-semibold tracking-tight tabular-nums">
					{showValue(analysis?.leaf_area_cm2, 'cm²')}
				</p>

				<p class="mt-5 border-t border-[#DCE3DD] pt-4 text-[12px] leading-5 text-[#829087]">
					{m.plant_leaf_area_description()}
				</p>

			</section>

			<!-- GREENNESS -->
			<section class="rounded-xl border border-[#CED8D0] bg-[#F1F4F0] p-6">

				<div class="flex items-center justify-between gap-3">

					<h3 class="text-[13px] font-semibold">
						{m.plant_greenness()}
					</h3>

					<span class="h-2 w-2 rounded-full bg-[#648A9B]"></span>

				</div>

				<p class="mt-6 break-words text-[32px] font-semibold tracking-tight tabular-nums">
					{showValue(analysis?.greenness_index)}
				</p>

				<p class="mt-5 border-t border-[#DCE3DD] pt-4 text-[12px] leading-5 text-[#829087]">
					{m.plant_greenness_description()}
				</p>

			</section>

			<!-- ANALYSIS TIME -->
			<section class="rounded-xl border border-[#CED8D0] bg-[#F1F4F0] p-6">

				<div class="flex items-center justify-between gap-3">

					<h3 class="text-[13px] font-semibold">
						{m.plant_last_analysis()}
					</h3>

					<span class="h-2 w-2 rounded-full bg-[#A18B60]"></span>

				</div>

				<p class="mt-6 break-words text-[20px] font-semibold tracking-tight">
					{formatDate(analysis?.computed_at)}
				</p>

				<p class="mt-5 border-t border-[#DCE3DD] pt-4 text-[12px] leading-5 text-[#829087]">
					{m.plant_last_analysis_description()}
				</p>

			</section>

		</div>

		<!-- COVERAGE & YELLOWING -->
		<div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">

			<section class="rounded-xl border border-[#CED8D0] bg-[#F1F4F0] p-6">

				{@render circleIndicator(
					analysis?.canopy_cover_pct,
					m.plant_coverage(),
					m.plant_coverage_description(),
					'#487C69'
				)}

			</section>

			<section class="rounded-xl border border-[#CED8D0] bg-[#F1F4F0] p-6">

				{@render circleIndicator(
					analysis?.yellow_fraction_pct,
					m.plant_yellowing(),
					m.plant_yellowing_description(),
					'#B18B52'
				)}

			</section>

		</div>

		<!-- WARNINGS -->
		{#if analysis?.health_warnings}

			<section class="mt-5 rounded-xl border border-[#D8C5A8] bg-[#EFE8DC] p-6">

				<div class="flex items-start gap-4">

					<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E5D8BF]">

						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="#98794D"
							stroke-width="1.7"
							class="h-5 w-5"
							aria-hidden="true"
						>
							<path d="m12 3 10 18H2L12 3Z" />
							<path d="M12 9v5" />
							<path d="M12 18h.01" />
						</svg>

					</div>

					<div>
						<h2 class="text-[14px] font-semibold text-[#775D39]">
							{m.plant_health_warnings()}
						</h2>

						<p class="mt-2 whitespace-pre-line text-[13px] leading-6 text-[#856D4A]">
							{analysis.health_warnings}
						</p>
					</div>

				</div>

			</section>

		{/if}

	</main>

</div>