<script>
	import AppHeader from '$lib/components/AppHeader.svelte';

	let { data } = $props();

	let selectedFilter = $state('all');

	function filteredAlerts() {
		if (selectedFilter === 'active') {
			return data.alerts.filter((alert) => !alert.is_resolved);
		}

		if (selectedFilter === 'resolved') {
			return data.alerts.filter((alert) => alert.is_resolved);
		}

		return data.alerts;
	}

	function formatDate(date) {
		return new Date(date).toLocaleString('de-DE');
	}
</script>

<div class="min-h-screen bg-white px-9 py-6">

	<AppHeader active="warnungen" />

	<main class="mt-10">

		<div class="flex items-end justify-between">

			<div>

				<p class="text-sm font-semibold text-green-800">
					// WARNUNGEN
				</p>

				<h1 class="mt-3 text-5xl font-semibold text-green-950">
					Meldungen der BioBox
				</h1>

			</div>


			<div class="flex gap-2">

				<button
					onclick={() => selectedFilter = 'all'}
					class={selectedFilter === 'all'
						? 'rounded-full bg-green-900 px-5 py-3 font-semibold text-white'
						: 'rounded-full bg-lime-100 px-5 py-3 font-semibold text-green-900'}
				>
					Alle
				</button>

				<button
					onclick={() => selectedFilter = 'active'}
					class={selectedFilter === 'active'
						? 'rounded-full bg-green-900 px-5 py-3 font-semibold text-white'
						: 'rounded-full bg-lime-100 px-5 py-3 font-semibold text-green-900'}
				>
					Aktiv
				</button>

				<button
					onclick={() => selectedFilter = 'resolved'}
					class={selectedFilter === 'resolved'
						? 'rounded-full bg-green-900 px-5 py-3 font-semibold text-white'
						: 'rounded-full bg-lime-100 px-5 py-3 font-semibold text-green-900'}
				>
					Erledigt
				</button>

			</div>

		</div>


		<div class="mt-6 rounded-2xl border border-green-200 px-6">

			{#if filteredAlerts().length === 0}

				<div class="py-10 text-center text-green-700">
					Keine Warnungen vorhanden.
				</div>

			{:else}

				{#each filteredAlerts() as alert}

					<div class="flex items-center justify-between border-b border-green-100 py-5 last:border-b-0">

						<div class="flex items-center gap-4">

							<div
								class={alert.severity === 'critical'
									? 'flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-800'
									: alert.severity === 'warning'
										? 'flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 text-yellow-800'
										: 'flex h-10 w-10 items-center justify-center rounded-full bg-lime-100 text-green-800'}
							>
								▲
							</div>


							<div>

								<p class="font-semibold text-green-950">
									{alert.message}
								</p>

								<p class="mt-1 text-sm text-green-700">
									{alert.alert_type} · {formatDate(alert.created_at)}
								</p>

							</div>

						</div>


						<div class="flex items-center gap-4">

							{#if alert.is_resolved}

								<p class="font-semibold text-green-800">
									Erledigt
								</p>

							{:else if alert.acknowledged_at}

								<p class="font-semibold text-green-800">
									Bestätigt
								</p>

							{:else}

								<p class="font-semibold text-green-950">
									Aktiv
								</p>

								<form method="POST" action="?/acknowledge">

									<input
										type="hidden"
										name="alertId"
										value={alert.id}
									/>

									<button
										type="submit"
										class="rounded-full bg-lime-300 px-5 py-3 font-semibold text-green-950"
									>
										Bestätigen
									</button>

								</form>

							{/if}

						</div>

					</div>

				{/each}

			{/if}

		</div>

	</main>

</div>