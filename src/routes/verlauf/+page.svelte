<script>
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';

	let { data } = $props();

	onMount(() => {
		const interval = setInterval(() => {
			invalidateAll();
		}, 5000);

		return () => clearInterval(interval);
	});
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
				class="rounded-full bg-green-900 px-5 py-3 font-semibold text-white"
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
				class="rounded-full px-4 py-3 font-semibold text-green-950"
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
			// VERLAUF
		</p>

		<h1 class="mt-3 text-5xl font-semibold text-green-950">
			Historische Werte
		</h1>


		<div class="mt-5 flex items-center justify-between">

			<!-- Messwert auswählen -->
			<div class="flex gap-2">

				<a
					href={`/verlauf?metric=temperature&period=${data.period}`}
					class={data.metric === 'temperature'
						? 'rounded-full bg-green-900 px-5 py-3 font-semibold text-white'
						: 'rounded-full bg-lime-100 px-5 py-3 font-semibold text-green-900'}
				>
					Temperatur
				</a>

				<a
					href={`/verlauf?metric=humidity&period=${data.period}`}
					class={data.metric === 'humidity'
						? 'rounded-full bg-green-900 px-5 py-3 font-semibold text-white'
						: 'rounded-full bg-lime-100 px-5 py-3 font-semibold text-green-900'}
				>
					Luftfeuchtigkeit
				</a>

				<a
					href={`/verlauf?metric=soilMoisture&period=${data.period}`}
					class={data.metric === 'soilMoisture'
						? 'rounded-full bg-green-900 px-5 py-3 font-semibold text-white'
						: 'rounded-full bg-lime-100 px-5 py-3 font-semibold text-green-900'}
				>
					Bodenfeuchtigkeit
				</a>

				<a
					href={`/verlauf?metric=soilTemperature&period=${data.period}`}
					class={data.metric === 'soilTemperature'
						? 'rounded-full bg-green-900 px-5 py-3 font-semibold text-white'
						: 'rounded-full bg-lime-100 px-5 py-3 font-semibold text-green-900'}
				>
					Bodentemperatur
				</a>

				<a
					href={`/verlauf?metric=light&period=${data.period}`}
					class={data.metric === 'light'
						? 'rounded-full bg-green-900 px-5 py-3 font-semibold text-white'
						: 'rounded-full bg-lime-100 px-5 py-3 font-semibold text-green-900'}
				>
					Licht
				</a>

			</div>


			<!-- Zeitraum auswählen -->
			<div class="flex gap-2">

				<a
					href={`/verlauf?metric=${data.metric}&period=24h`}
					class={data.period === '24h'
						? 'rounded-full bg-lime-300 px-5 py-3 font-semibold text-green-950'
						: 'rounded-full bg-lime-100 px-5 py-3 font-semibold text-green-900'}
				>
					24 Std.
				</a>

				<a
					href={`/verlauf?metric=${data.metric}&period=7d`}
					class={data.period === '7d'
						? 'rounded-full bg-lime-300 px-5 py-3 font-semibold text-green-950'
						: 'rounded-full bg-lime-100 px-5 py-3 font-semibold text-green-900'}
				>
					7 Tage
				</a>

				<a
					href={`/verlauf?metric=${data.metric}&period=30d`}
					class={data.period === '30d'
						? 'rounded-full bg-lime-300 px-5 py-3 font-semibold text-green-950'
						: 'rounded-full bg-lime-100 px-5 py-3 font-semibold text-green-900'}
				>
					30 Tage
				</a>

			</div>

		</div>


		<!-- Diagramm -->
		<div class="mt-4 rounded-2xl bg-green-900 p-6 text-white">

			<h2 class="text-2xl font-semibold">
				{data.label} · {data.periodLabel}
			</h2>

			<div class="mt-8 h-64 w-full">

				<svg
					viewBox="0 0 1000 260"
					preserveAspectRatio="none"
					class="h-full w-full"
				>
					{#if data.chartPoints}

						<polygon
							points={`0,260 ${data.chartPoints} 1000,260`}
							fill="#356642"
						/>

						<polyline
							points={data.chartPoints}
							fill="none"
							stroke="#c5e85c"
							stroke-width="5"
						/>

					{/if}
				</svg>

			</div>


			{#if data.period === '24h'}

				<div class="mt-3 flex justify-between text-sm font-semibold">
					<span>00:00</span>
					<span>06:00</span>
					<span>12:00</span>
					<span>18:00</span>
					<span>jetzt</span>
				</div>

			{:else if data.period === '7d'}

				<div class="mt-3 flex justify-between text-sm font-semibold">
					<span>vor 7 Tagen</span>
					<span>vor 5 Tagen</span>
					<span>vor 3 Tagen</span>
					<span>gestern</span>
					<span>jetzt</span>
				</div>

			{:else}

				<div class="mt-3 flex justify-between text-sm font-semibold">
					<span>vor 30 Tagen</span>
					<span>vor 3 Wochen</span>
					<span>vor 2 Wochen</span>
					<span>vor 1 Woche</span>
					<span>jetzt</span>
				</div>

			{/if}

		</div>


		<!-- Statistiken -->
		<div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

			<div class="rounded-2xl bg-lime-100 p-6">

				<p class="text-sm text-green-700">
					Aktuell
				</p>

				<p class="mt-2 text-4xl font-semibold text-green-950">
					{data.current === null
						? 'Keine Daten'
						: `${data.current.toFixed(1)} ${data.unit}`}
				</p>

			</div>


			<div class="rounded-2xl bg-lime-100 p-6">

				<p class="text-sm text-green-700">
					Minimum
				</p>

				<p class="mt-2 text-4xl font-semibold text-green-950">
					{data.minimum === null
						? 'Keine Daten'
						: `${data.minimum.toFixed(1)} ${data.unit}`}
				</p>

			</div>


			<div class="rounded-2xl bg-lime-100 p-6">

				<p class="text-sm text-green-700">
					Maximum
				</p>

				<p class="mt-2 text-4xl font-semibold text-green-950">
					{data.maximum === null
						? 'Keine Daten'
						: `${data.maximum.toFixed(1)} ${data.unit}`}
				</p>

			</div>


			<div class="rounded-2xl bg-lime-100 p-6">

				<p class="text-sm text-green-700">
					Durchschnitt
				</p>

				<p class="mt-2 text-4xl font-semibold text-green-950">
					{data.average === null
						? 'Keine Daten'
						: `${data.average.toFixed(1)} ${data.unit}`}
				</p>

			</div>

		</div>

	</main>

</div>