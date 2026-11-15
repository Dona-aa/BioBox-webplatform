<script>
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import AppHeader from '$lib/components/AppHeader.svelte';

	let { data } = $props();

	let selectedFilter = $state('all');

	// Warnungen aus der Datenbank
	let alerts = $derived(data.alerts ?? []);

	// Anzahl der Warnungen
	let totalCount = $derived(alerts.length);

	let activeCount = $derived(
		alerts.filter((alert) => !alert.is_resolved).length
	);

	let criticalCount = $derived(
		alerts.filter(
			(alert) =>
				!alert.is_resolved && alert.severity === 'critical'
		).length
	);

	let resolvedCount = $derived(
		alerts.filter((alert) => alert.is_resolved).length
	);

	let acknowledgedCount = $derived(
		alerts.filter(
			(alert) =>
				!alert.is_resolved && alert.acknowledged_at
		).length
	);

	// Filter
	const filters = [
		{
			key: 'all',
			label: 'Alle'
		},
		{
			key: 'active',
			label: 'Aktiv'
		},
		{
			key: 'resolved',
			label: 'Erledigt'
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

	function filterCount(key) {
		if (key === 'active') return activeCount;
		if (key === 'resolved') return resolvedCount;
		return totalCount;
	}

	// Datum formatieren
	function formatDate(value) {
		if (!value) return '–';

		const date = new Date(value);

		if (!Number.isFinite(date.getTime())) return '–';

		return date.toLocaleString('de-DE', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	// Schweregrad
	function severityLabel(severity) {
		if (severity === 'critical') return 'Kritisch';
		if (severity === 'warning') return 'Warnung';

		return 'Information';
	}

	function severityColor(severity) {
		if (severity === 'critical') return '#AD625C';
		if (severity === 'warning') return '#B38C52';

		return '#648A9B';
	}

	function severityBackground(severity) {
		if (severity === 'critical') return '#F1E2E0';
		if (severity === 'warning') return '#F0E8DA';

		return '#E0EAF0';
	}

	// Automatische Aktualisierung
	onMount(() => {
		const interval = setInterval(() => {
			invalidateAll();
		}, 5000);

		return () => clearInterval(interval);
	});
</script>

<div
	class="min-h-screen bg-[#E5EAE6] px-6 py-6 font-sans text-[#25332B] sm:px-9"
>
	<AppHeader active="warnungen" />

	<main class="mx-auto max-w-[1400px] pb-16 pt-9">

		<!-- HEADER -->
		<div
			class="mb-8 flex flex-wrap items-center justify-between gap-5"
		>
			<div>
				<p class="text-[12px] text-[#77847B]">
					BioBox / Systemüberwachung
				</p>

				<h1
					class="mt-2 text-[27px] font-semibold tracking-tight"
				>
					Warnungen
				</h1>

				<p class="mt-1 text-[13px] text-[#77847B]">
					Systemmeldungen überwachen und bearbeiten
				</p>
			</div>

			<div
				class="flex items-center gap-3 rounded-lg border border-[#CED8D0] bg-[#F1F4F0] px-4 py-3"
			>
				<span
					class="h-2 w-2 rounded-full bg-[#487C69]"
				></span>

				<div>
					<p
						class="text-[12px] font-medium text-[#405B49]"
					>
						Automatische Aktualisierung
					</p>

					<p class="mt-0.5 text-[11px] text-[#829087]">
						Alle 5 Sekunden
					</p>
				</div>
			</div>
		</div>

		<!-- ÜBERSICHT -->
		<div class="grid grid-cols-2 gap-4 xl:grid-cols-4">

			<!-- ALLE -->
			<div
				class="rounded-xl border border-[#CED8D0] bg-[#F1F4F0] p-5 sm:p-6"
			>
				<div class="flex items-center justify-between gap-3">
					<p
						class="text-[12px] font-medium text-[#75847A]"
					>
						Alle Meldungen
					</p>

					<span
						class="h-2.5 w-2.5 rounded-full bg-[#83928A]"
					></span>
				</div>

				<p
					class="mt-5 text-[36px] font-semibold tracking-tight tabular-nums"
				>
					{totalCount}
				</p>

				<p
					class="mt-4 border-t border-[#DCE3DD] pt-3 text-[11px] text-[#87928A]"
				>
					Gesamte Historie
				</p>
			</div>

			<!-- AKTIV -->
			<div
				class="rounded-xl border border-[#CED8D0] bg-[#F1F4F0] p-5 sm:p-6"
			>
				<div class="flex items-center justify-between gap-3">
					<p
						class="text-[12px] font-medium text-[#75847A]"
					>
						Aktive Meldungen
					</p>

					<span
						class="h-2.5 w-2.5 rounded-full bg-[#B38C52]"
					></span>
				</div>

				<p
					class="mt-5 text-[36px] font-semibold tracking-tight tabular-nums"
				>
					{activeCount}
				</p>

				<p
					class="mt-4 border-t border-[#DCE3DD] pt-3 text-[11px] text-[#87928A]"
				>
					Noch nicht erledigt
				</p>
			</div>

			<!-- KRITISCH -->
			<div
				class="rounded-xl border border-[#CED8D0] bg-[#F1F4F0] p-5 sm:p-6"
			>
				<div class="flex items-center justify-between gap-3">
					<p
						class="text-[12px] font-medium text-[#75847A]"
					>
						Kritische Meldungen
					</p>

					<span
						class="h-2.5 w-2.5 rounded-full bg-[#AD625C]"
					></span>
				</div>

				<p
					class="mt-5 text-[36px] font-semibold tracking-tight tabular-nums"
				>
					{criticalCount}
				</p>

				<p
					class="mt-4 border-t border-[#DCE3DD] pt-3 text-[11px] text-[#87928A]"
				>
					Aktuell kritisch
				</p>
			</div>

			<!-- ERLEDIGT -->
			<div
				class="rounded-xl border border-[#CED8D0] bg-[#F1F4F0] p-5 sm:p-6"
			>
				<div class="flex items-center justify-between gap-3">
					<p
						class="text-[12px] font-medium text-[#75847A]"
					>
						Erledigte Meldungen
					</p>

					<span
						class="h-2.5 w-2.5 rounded-full bg-[#487C69]"
					></span>
				</div>

				<p
					class="mt-5 text-[36px] font-semibold tracking-tight tabular-nums"
				>
					{resolvedCount}
				</p>

				<p
					class="mt-4 border-t border-[#DCE3DD] pt-3 text-[11px] text-[#87928A]"
				>
					Abgeschlossen
				</p>
			</div>

		</div>

		<!-- STATUSÜBERSICHT -->
		<section
			class="mt-5 rounded-xl border border-[#CED8D0] bg-[#F1F4F0] p-6"
		>
			<div class="flex flex-wrap items-start justify-between gap-5">

				<div>
					<h2 class="text-[15px] font-semibold">
						Aktueller Systemstatus
					</h2>

					<p class="mt-1 text-[12px] text-[#87928A]">
						Übersicht der offenen Systemmeldungen
					</p>
				</div>

				<span
					class={activeCount === 0
						? 'rounded-md bg-[#DFEAE1] px-3 py-2 text-[11px] font-semibold text-[#487C69]'
						: 'rounded-md bg-[#F0E8DA] px-3 py-2 text-[11px] font-semibold text-[#927044]'}
				>
					{activeCount === 0
						? 'Keine offenen Meldungen'
						: `${activeCount} offene Meldungen`}
				</span>

			</div>

			<div
				class="mt-6 grid grid-cols-1 gap-6 border-t border-[#DCE3DD] pt-5 sm:grid-cols-3"
			>
				<div>
					<p class="text-[11px] text-[#87928A]">
						Unbestätigte Meldungen
					</p>

					<p class="mt-2 text-[22px] font-semibold tabular-nums">
						{activeCount - acknowledgedCount}
					</p>
				</div>

				<div>
					<p class="text-[11px] text-[#87928A]">
						Bestätigte Meldungen
					</p>

					<p class="mt-2 text-[22px] font-semibold tabular-nums">
						{acknowledgedCount}
					</p>
				</div>

				<div>
					<p class="text-[11px] text-[#87928A]">
						Kritische Meldungen
					</p>

					<p class="mt-2 text-[22px] font-semibold tabular-nums">
						{criticalCount}
					</p>
				</div>
			</div>
		</section>

		<!-- MELDUNGSLISTE HEADER -->
		<div
			class="mb-4 mt-9 flex flex-wrap items-center justify-between gap-5"
		>
			<div>
				<h2 class="text-[16px] font-semibold">
					Systemmeldungen
				</h2>

				<p class="mt-1 text-[12px] text-[#829087]">
					Alle erfassten Warnungen und Ereignisse
				</p>
			</div>

			<!-- FILTER -->
			<div
				class="flex flex-wrap gap-1 rounded-lg border border-[#CED8D0] bg-[#F1F4F0] p-1"
			>
				{#each filters as filter}
					<button
						type="button"
						onclick={() => (selectedFilter = filter.key)}
						aria-pressed={selectedFilter === filter.key}
						class={selectedFilter === filter.key
							? 'rounded-md bg-[#1C2B23] px-4 py-2.5 text-[12px] font-semibold text-white'
							: 'rounded-md px-4 py-2.5 text-[12px] font-medium text-[#718176] transition-colors hover:bg-[#E2E9E3]'}
					>
						{filter.label}

						<span
							class={selectedFilter === filter.key
								? 'ml-1.5 text-[11px] text-[#B5CAB9]'
								: 'ml-1.5 text-[11px] text-[#96A39A]'}
						>
							{filterCount(filter.key)}
						</span>
					</button>
				{/each}
			</div>
		</div>

		<!-- MELDUNGSLISTE -->
		<section
			class="overflow-hidden rounded-xl border border-[#CED8D0] bg-[#F1F4F0]"
		>

			<!-- LISTENKOPF -->
			<div
				class="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCE3DD] px-6 py-4"
			>
				<p class="text-[12px] font-semibold text-[#52665A]">
					{selectedFilter === 'all'
						? 'Alle Meldungen'
						: selectedFilter === 'active'
							? 'Aktive Meldungen'
							: 'Erledigte Meldungen'}
				</p>

				<span class="text-[11px] text-[#87928A]">
					{filteredAlerts.length} Einträge
				</span>
			</div>

			{#if filteredAlerts.length === 0}

				<!-- EMPTY STATE -->
				<div
					class="flex min-h-[280px] flex-col items-center justify-center px-6 py-12 text-center"
				>
					<div
						class="flex h-14 w-14 items-center justify-center rounded-full bg-[#E2EAE4]"
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="#718D79"
							stroke-width="1.5"
							class="h-7 w-7"
							aria-hidden="true"
						>
							<path d="M12 3 3 7v5c0 5 4 8 9 9 5-1 9-4 9-9V7l-9-4Z" />
							<path d="m8 12 3 3 5-6" />
						</svg>
					</div>

					<h3 class="mt-5 text-[14px] font-semibold">
						{selectedFilter === 'active'
							? 'Keine aktiven Meldungen'
							: selectedFilter === 'resolved'
								? 'Keine erledigten Meldungen'
								: 'Keine Systemmeldungen vorhanden'}
					</h3>

					<p
						class="mt-2 max-w-sm text-[12px] leading-6 text-[#87928A]"
					>
						{selectedFilter === 'active'
							? 'Aktuell sind keine offenen Warnungen vorhanden.'
							: selectedFilter === 'resolved'
								? 'Es wurden noch keine Meldungen als erledigt markiert.'
								: 'Sobald die BioBox eine Warnung erzeugt, wird sie hier angezeigt.'}
					</p>
				</div>

			{:else}

				<div class="divide-y divide-[#DCE3DD]">

					{#each filteredAlerts as alert (alert.id)}

						<div class="px-5 py-5 sm:px-6">

							<div
								class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"
							>

								<!-- MELDUNG -->
								<div class="flex min-w-0 items-start gap-4">

									<!-- SEVERITY ICON -->
									<div
										class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
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

									<!-- CONTENT -->
									<div class="min-w-0">

										<div class="flex flex-wrap items-center gap-2.5">

											<span
												class="rounded-md px-2.5 py-1 text-[10px] font-semibold"
												style={`background-color: ${
													severityBackground(alert.severity)
												}; color: ${severityColor(alert.severity)};`}
											>
												{severityLabel(alert.severity)}
											</span>

											<span
												class="text-[11px] text-[#9AA59C]"
											>
												{alert.alert_type}
											</span>

										</div>

										<p
											class="mt-3 break-words text-[13px] font-semibold leading-6 text-[#25332B]"
										>
											{alert.message}
										</p>

										<div
											class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[#87928A]"
										>
											<span>
												Erstellt: {formatDate(alert.created_at)}
											</span>

											{#if alert.acknowledged_at}
												<span>
													Bestätigt: {formatDate(alert.acknowledged_at)}
												</span>
											{/if}

											{#if alert.is_resolved && alert.resolved_at}
												<span>
													Erledigt: {formatDate(alert.resolved_at)}
												</span>
											{/if}
										</div>

									</div>

								</div>

								<!-- STATUS & ACTION -->
								<div
									class="flex shrink-0 flex-wrap items-center gap-3 pl-[60px] lg:pl-0"
								>

									{#if alert.is_resolved}

										<span
											class="inline-flex items-center gap-2 rounded-md bg-[#DFEAE1] px-3 py-2 text-[11px] font-semibold text-[#487C69]"
										>
											<span
												class="h-1.5 w-1.5 rounded-full bg-[#487C69]"
											></span>

											Erledigt
										</span>

									{:else if alert.acknowledged_at}

										<span
											class="inline-flex items-center gap-2 rounded-md bg-[#E5EAE6] px-3 py-2 text-[11px] font-semibold text-[#68796D]"
										>
											<span
												class="h-1.5 w-1.5 rounded-full bg-[#829087]"
											></span>

											Bestätigt
										</span>

									{:else}

										<span
											class="inline-flex items-center gap-2 rounded-md bg-[#F0E8DA] px-3 py-2 text-[11px] font-semibold text-[#927044]"
										>
											<span
												class="h-1.5 w-1.5 rounded-full bg-[#B38C52]"
											></span>

											Aktiv
										</span>

										<!-- ORIGINAL DATABASE ACTION -->
										<form
											method="POST"
											action="?/acknowledge"
										>
											<input
												type="hidden"
												name="alertId"
												value={alert.id}
											/>

											<button
												type="submit"
												class="rounded-md bg-[#1C2B23] px-4 py-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-[#304437]"
											>
												Bestätigen
											</button>
										</form>

									{/if}

								</div>

							</div>

						</div>

					{/each}

				</div>

			{/if}

		</section>

		<!-- FOOTER -->
		<div
			class="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#CAD5CC] pt-5"
		>
			<p class="text-[12px] text-[#77847B]">
				Die Systemmeldungen werden alle 5 Sekunden aktualisiert.
			</p>

			<p class="text-[12px] text-[#77847B]">
				Bestätigte Warnungen bleiben offen, bis sie als erledigt
				markiert werden.
			</p>
		</div>

	</main>
</div>