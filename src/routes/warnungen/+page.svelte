<script>
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import AppHeader from '$lib/components/AppHeader.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime.js';

	let { data } = $props();

	let selectedFilter = $state('all');

	let alerts = $derived(data.alerts ?? []);

	let totalCount = $derived(alerts.length);

	let activeCount = $derived(
		alerts.filter((alert) => !alert.is_resolved).length
	);

	let criticalCount = $derived(
		alerts.filter(
			(alert) => !alert.is_resolved && alert.severity === 'critical'
		).length
	);

	let resolvedCount = $derived(
		alerts.filter((alert) => alert.is_resolved).length
	);

	const filters = [
		{
			key: 'all',
			label: m.alerts_all()
		},
		{
			key: 'active',
			label: m.alerts_active()
		},
		{
			key: 'resolved',
			label: m.alerts_resolved()
		}
	];

	let filteredAlerts = $derived(
		alerts.filter((alert) => {
			if (selectedFilter === 'active') {
				return !alert.is_resolved;
			}

			if (selectedFilter === 'resolved') {
				return Boolean(alert.is_resolved);
			}

			return true;
		})
	);

	function currentLocale() {
		if (getLocale() === 'en') return 'en-US';
		if (getLocale() === 'sq') return 'sq-AL';
		return 'de-DE';
	}

	function filterCount(key) {
		if (key === 'active') return activeCount;
		if (key === 'resolved') return resolvedCount;

		return totalCount;
	}

	function formatDate(value) {
		if (!value) return '–';

		const date = new Date(value);

		if (!Number.isFinite(date.getTime())) {
			return '–';
		}

		return date.toLocaleString(currentLocale(), {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function alertTypeLabel(type) {
		if (type === 'soil_moisture_low') {
			return m.alert_type_soil_moisture_low();
		}

		return m.alert_type_unknown();
	}

	function severityLabel(severity) {
		if (severity === 'critical') return m.alerts_critical();
		if (severity === 'warning') return m.alerts_warning();

		return m.alerts_information();
	}

	function severityColor(severity) {
		if (severity === 'critical') return '#A45B56';
		if (severity === 'warning') return '#9A753D';

		return '#567A88';
	}

	function severityBackground(severity) {
		if (severity === 'critical') return '#EFE0DE';
		if (severity === 'warning') return '#EEE6D9';

		return '#DFE9ED';
	}

	onMount(() => {
		const interval = setInterval(() => {
			invalidateAll();
		}, 5000);

		return () => clearInterval(interval);
	});
</script>

<svelte:head>
	<title>{m.alerts_title()} · BioBox</title>
</svelte:head>

<div class="min-h-screen bg-[#E5EAE6] px-9 py-6 font-sans text-[#25332B]">

	<AppHeader active="warnungen" />

	<main class="mx-auto max-w-[1400px] pb-16 pt-10">

		<!-- PAGE HEADER -->
		<div class="flex items-end justify-between gap-8">

			<div>
				<p class="text-[12px] font-medium text-[#748178]">
					{m.alerts_breadcrumb()}
				</p>

				<h1 class="mt-2 text-[30px] font-semibold tracking-[-0.03em] text-[#1D2F25]">
					{m.alerts_title()}
				</h1>

				<p class="mt-2 text-[13px] text-[#748178]">
					{m.alerts_intro()}
				</p>
			</div>

			<div class="flex items-center gap-3 border-l border-[#C6D1C9] pl-5">
				<span class="h-2 w-2 rounded-full bg-[#4F806A]"></span>

				<div>
					<p class="text-[12px] font-medium text-[#405B49]">
						{m.alerts_live_refresh()}
					</p>

					<p class="mt-0.5 text-[11px] text-[#829087]">
						{m.alerts_refresh_interval()}
					</p>
				</div>
			</div>

		</div>

		<!-- SUMMARY -->
		<section class="mt-8 overflow-hidden rounded-xl border border-[#CBD5CD] bg-[#F2F4F1]">

			<div class="grid grid-cols-4 divide-x divide-[#D7DFD8]">

				<div class="px-6 py-5">
					<p class="text-[11px] font-medium text-[#7A877E]">
						{m.alerts_total()}
					</p>

					<div class="mt-3 flex items-center gap-3">
						<p class="text-[28px] font-semibold tracking-tight tabular-nums">
							{totalCount}
						</p>

						<span class="h-2 w-2 rounded-full bg-[#87948C]"></span>
					</div>
				</div>

				<div class="px-6 py-5">
					<p class="text-[11px] font-medium text-[#7A877E]">
						{m.alerts_active()}
					</p>

					<div class="mt-3 flex items-center gap-3">
						<p class="text-[28px] font-semibold tracking-tight tabular-nums">
							{activeCount}
						</p>

						<span class="h-2 w-2 rounded-full bg-[#B38C52]"></span>
					</div>
				</div>

				<div class="px-6 py-5">
					<p class="text-[11px] font-medium text-[#7A877E]">
						{m.alerts_critical()}
					</p>

					<div class="mt-3 flex items-center gap-3">
						<p class="text-[28px] font-semibold tracking-tight tabular-nums">
							{criticalCount}
						</p>

						<span class="h-2 w-2 rounded-full bg-[#AD625C]"></span>
					</div>
				</div>

				<div class="px-6 py-5">
					<p class="text-[11px] font-medium text-[#7A877E]">
						{m.alerts_resolved()}
					</p>

					<div class="mt-3 flex items-center gap-3">
						<p class="text-[28px] font-semibold tracking-tight tabular-nums">
							{resolvedCount}
						</p>

						<span class="h-2 w-2 rounded-full bg-[#4F806A]"></span>
					</div>
				</div>

			</div>

		</section>

		<!-- LIST HEADER -->
		<div class="mt-10 flex items-center justify-between gap-6">

			<div>
				<h2 class="text-[16px] font-semibold text-[#25332B]">
					{m.alerts_system_messages()}
				</h2>

				<p class="mt-1 text-[12px] text-[#829087]">
					{m.alerts_system_description()}
				</p>
			</div>

			<div class="flex gap-1 rounded-lg border border-[#CBD5CD] bg-[#F2F4F1] p-1">

				{#each filters as filter}

					<button
						type="button"
						onclick={() => (selectedFilter = filter.key)}
						aria-pressed={selectedFilter === filter.key}
						class={selectedFilter === filter.key
							? 'rounded-md bg-[#1C2B23] px-4 py-2 text-[12px] font-semibold text-white'
							: 'rounded-md px-4 py-2 text-[12px] font-medium text-[#6F7E74] transition-colors hover:bg-[#E4E9E5]'}
					>
						{filter.label}

						<span
							class={selectedFilter === filter.key
								? 'ml-1.5 text-[10px] text-[#B8CABC]'
								: 'ml-1.5 text-[10px] text-[#98A49C]'}
						>
							{filterCount(filter.key)}
						</span>
					</button>

				{/each}

			</div>

		</div>

		<!-- LIST -->
		<section class="mt-4 overflow-hidden rounded-xl border border-[#CBD5CD] bg-[#F2F4F1]">

			<div class="flex items-center justify-between border-b border-[#D7DFD8] px-6 py-4">

				<p class="text-[12px] font-semibold text-[#52665A]">
					{selectedFilter === 'all'
						? m.alerts_all_messages()
						: selectedFilter === 'active'
							? m.alerts_active_messages()
							: m.alerts_resolved_messages()}
				</p>

				<p class="text-[11px] text-[#87928A]">
					{m.alerts_entries({ count: filteredAlerts.length })}
				</p>

			</div>

			{#if filteredAlerts.length === 0}

				<div class="flex min-h-[280px] flex-col items-center justify-center px-6 py-12 text-center">

					<div class="flex h-12 w-12 items-center justify-center rounded-full bg-[#E1E8E2]">

						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="#6E8876"
							stroke-width="1.5"
							class="h-6 w-6"
							aria-hidden="true"
						>
							<path d="M12 3 3 7v5c0 5 4 8 9 9 5-1 9-4 9-9V7l-9-4Z" />
							<path d="m8 12 3 3 5-6" />
						</svg>

					</div>

					<h3 class="mt-4 text-[14px] font-semibold">
						{selectedFilter === 'active'
							? m.alerts_no_active()
							: selectedFilter === 'resolved'
								? m.alerts_no_resolved()
								: m.alerts_no_messages()}
					</h3>

					<p class="mt-2 max-w-sm text-[12px] leading-6 text-[#87928A]">
						{selectedFilter === 'active'
							? m.alerts_no_active_description()
							: selectedFilter === 'resolved'
								? m.alerts_no_resolved_description()
								: m.alerts_no_messages_description()}
					</p>

				</div>

			{:else}

				<div class="divide-y divide-[#D7DFD8]">

					{#each filteredAlerts as alert (alert.id)}

						<article class="px-6 py-5 transition-colors hover:bg-[#EDF1ED]">

							<div class="flex items-center justify-between gap-8">

								<div class="flex min-w-0 items-start gap-4">

									<div
										class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
										style={`background-color: ${
											alert.is_resolved
												? '#E3E9E4'
												: severityBackground(alert.severity)
										}`}
									>

										{#if alert.is_resolved}

											<svg
												viewBox="0 0 24 24"
												fill="none"
												stroke="#72877A"
												stroke-width="1.8"
												class="h-5 w-5"
												aria-hidden="true"
											>
												<circle cx="12" cy="12" r="9" />
												<path d="m8 12 3 3 5-6" />
											</svg>

										{:else}

											<svg
												viewBox="0 0 24 24"
												fill="none"
												stroke={severityColor(alert.severity)}
												stroke-width="1.8"
												class="h-5 w-5"
												aria-hidden="true"
											>
												<path d="m12 3 10 18H2L12 3Z" />
												<path d="M12 9v5" />
												<path d="M12 18h.01" />
											</svg>

										{/if}

									</div>

									<div class="min-w-0">

										<div class="flex items-center gap-2">

											<span
												class="rounded-md px-2.5 py-1 text-[10px] font-semibold"
												style={`background-color: ${
													severityBackground(alert.severity)
												}; color: ${severityColor(alert.severity)};`}
											>
												{severityLabel(alert.severity)}
											</span>

											<span class="text-[10px] uppercase tracking-[0.08em] text-[#9AA59C]">
												{alertTypeLabel(alert.alert_type)}
											</span>

										</div>

										<p class="mt-3 text-[13px] font-semibold leading-6 text-[#25332B]">
											{alert.message}
										</p>

										<div class="mt-2 flex items-center gap-4 text-[11px] text-[#87928A]">

											<span>
												{formatDate(alert.created_at)}
											</span>

											{#if alert.acknowledged_at}
												<span>
													{m.alerts_acknowledged_at({
														date: formatDate(alert.acknowledged_at)
													})}
												</span>
											{/if}

											{#if alert.is_resolved && alert.resolved_at}
												<span>
													{m.alerts_resolved_at({
														date: formatDate(alert.resolved_at)
													})}
												</span>
											{/if}

										</div>

									</div>

								</div>

								<div class="flex shrink-0 items-center gap-3">

									{#if alert.is_resolved}

										<span class="inline-flex items-center gap-2 rounded-md bg-[#DFEAE1] px-3 py-2 text-[11px] font-semibold text-[#487C69]">
											<span class="h-1.5 w-1.5 rounded-full bg-[#487C69]"></span>
											{m.alerts_resolved()}
										</span>

									{:else if alert.acknowledged_at}

										<span class="inline-flex items-center gap-2 rounded-md bg-[#E5EAE6] px-3 py-2 text-[11px] font-semibold text-[#68796D]">
											<span class="h-1.5 w-1.5 rounded-full bg-[#829087]"></span>
											{m.alerts_acknowledged()}
										</span>

									{:else}

										<span class="inline-flex items-center gap-2 rounded-md bg-[#EEE6D9] px-3 py-2 text-[11px] font-semibold text-[#927044]">
											<span class="h-1.5 w-1.5 rounded-full bg-[#B38C52]"></span>
											{m.alerts_active()}
										</span>

										<form method="POST" action="?/acknowledge">

											<input
												type="hidden"
												name="alertId"
												value={alert.id}
											/>

											<button
												type="submit"
												class="rounded-md bg-[#1C2B23] px-4 py-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-[#304437]"
											>
												{m.alerts_acknowledge()}
											</button>

										</form>

									{/if}

								</div>

							</div>

						</article>

					{/each}

				</div>

			{/if}

		</section>

		<div class="mt-5 flex items-center justify-between border-t border-[#CAD5CC] pt-5">

			<p class="text-[11px] text-[#7C8980]">
				{m.alerts_auto_refresh()}
			</p>

			<p class="text-[11px] text-[#7C8980]">
				{m.alerts_footer_hint()}
			</p>

		</div>

	</main>

</div>