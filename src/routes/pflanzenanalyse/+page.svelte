<script>
	let { data } = $props();

	let analysis = data.analysis;

	function showValue(value, unit = '') {
		if (value === null || value === undefined) {
			return 'Keine Daten';
		}

		return `${Number(value).toFixed(1)} ${unit}`;
	}
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
				class="rounded-full px-4 py-3 font-semibold text-green-950"
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
				class="rounded-full bg-green-900 px-5 py-3 font-semibold text-white"
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

		<p class="text-sm font-semibold text-green-800">
			// PFLANZENANALYSE
		</p>

		<h1 class="mt-3 text-5xl font-semibold text-green-950">
			Entwicklung deiner Pflanze
		</h1>

		<p class="mt-4 text-green-700">
			Die Kameraaufnahmen werden ausgewertet und wichtige Pflanzenwerte angezeigt.
		</p>


		<div class="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">

			<!-- Bild -->
			<div class="rounded-2xl bg-green-900 p-6 lg:col-span-2">

				<div
					class="flex min-h-[330px] items-center justify-center rounded-xl bg-green-800"
				>
					<div class="text-center">

						<p class="text-sm font-semibold text-green-200">
							Letztes Pflanzenbild
						</p>

						{#if analysis}
							<p class="mt-2 text-white">
								{analysis.file_name}
							</p>
						{:else}
							<p class="mt-2 text-green-200">
								Noch kein Bild vorhanden
							</p>
						{/if}

					</div>
				</div>


				<div class="mt-4 flex items-center justify-between text-sm text-green-100">

					<p>
						Letzte Aufnahme
					</p>

					<p>
						{analysis?.captured_at
							? new Date(analysis.captured_at).toLocaleString('de-DE')
							: 'Keine Daten'}
					</p>

				</div>

			</div>


			<!-- Analyse -->
			<div class="rounded-2xl border border-green-200 p-6">

				<h2 class="text-2xl font-semibold text-green-950">
					Aktuelle Analyse
				</h2>

				<div class="mt-5 space-y-5">

					<div>
						<p class="text-sm text-green-700">
							Pflanzenfläche
						</p>

						<p class="mt-1 text-3xl font-semibold text-green-950">
							{showValue(analysis?.leaf_area_cm2, 'cm²')}
						</p>
					</div>


					<div class="border-t border-green-100 pt-5">

						<p class="text-sm text-green-700">
							Abdeckung
						</p>

						<p class="mt-1 text-3xl font-semibold text-green-950">
							{showValue(analysis?.canopy_cover_pct, '%')}
						</p>

					</div>


					<div class="border-t border-green-100 pt-5">

						<p class="text-sm text-green-700">
							Gesundheit
						</p>

						<p class="mt-1 text-3xl font-semibold text-green-950">
							{analysis?.health_score === null || analysis?.health_score === undefined
								? 'Keine Daten'
								: `${Number(analysis.health_score).toFixed(1)} / 100`}
						</p>

						{#if analysis?.health_category}
							<p class="mt-1 text-sm text-green-700">
								{analysis.health_category}
							</p>
						{/if}

					</div>


					<div class="border-t border-green-100 pt-5">

						<p class="text-sm text-green-700">
							Vergilbung
						</p>

						<p class="mt-1 text-3xl font-semibold text-green-950">
							{showValue(analysis?.yellow_fraction_pct, '%')}
						</p>

					</div>

				</div>

			</div>

		</div>


		<div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">

			<div class="rounded-2xl bg-lime-100 p-6">

				<p class="text-sm text-green-700">
					Grünheitsindex
				</p>

				<p class="mt-2 text-4xl font-semibold text-green-950">
					{showValue(analysis?.greenness_index)}
				</p>

			</div>


			<div class="rounded-2xl bg-lime-100 p-6">

				<p class="text-sm text-green-700">
					Gesundheitstrend
				</p>

				<p class="mt-2 text-4xl font-semibold text-green-950">
					{analysis?.health_trend_24h === null ||
					analysis?.health_trend_24h === undefined
						? 'Keine Daten'
						: `${Number(analysis.health_trend_24h).toFixed(1)} Punkte`}
				</p>

			</div>


			<div class="rounded-2xl bg-lime-100 p-6">

				<p class="text-sm text-green-700">
					Letzte Analyse
				</p>

				<p class="mt-2 text-xl font-semibold text-green-950">
					{analysis?.computed_at
						? new Date(analysis.computed_at).toLocaleString('de-DE')
						: 'Keine Daten'}
				</p>

			</div>

		</div>


		{#if analysis?.health_warnings}

			<div class="mt-4 rounded-2xl border border-yellow-200 bg-yellow-50 p-6">

				<p class="text-sm font-semibold text-yellow-900">
					Hinweis
				</p>

				<p class="mt-2 text-yellow-900">
					{analysis.health_warnings}
				</p>

			</div>

		{/if}

	</main>

</div>