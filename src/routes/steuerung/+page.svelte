<script>
	import { onMount } from 'svelte';
	import AppHeader from '$lib/components/AppHeader.svelte';

	let { data } = $props();

	let status = $state(data.status);

	let waterActive = $state(status.pump_water_ms > 0);
	let lightActive = $state(status.led_duty_pct > 0);
	let fanActive = $state(status.fan_duty_pct > 0);

	let commandMessage = $state('');

	async function updateStatus() {
		const response = await fetch('/api/v1/status');

		if (!response.ok) {
			return;
		}

		status = await response.json();

		waterActive = status.pump_water_ms > 0;
		lightActive = status.led_duty_pct > 0;
		fanActive = status.fan_duty_pct > 0;
	}

	async function sendCommand(component, action) {
		const response = await fetch('/api/v1/actuators/command', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				component,
				action
			})
		});

		if (response.ok) {
			commandMessage = 'Befehl wurde gesendet.';
		}
	}

	onMount(() => {
		const interval = setInterval(updateStatus, 5000);

		return () => clearInterval(interval);
	});
</script>

<div class="min-h-screen bg-white px-9 py-6">

	<AppHeader active="steuerung" />

	<main class="mt-10">

		<div class="flex items-end justify-between">

			<div>

				<p class="text-sm font-semibold text-green-800">
					// STEUERUNG
				</p>

				<h1 class="mt-3 text-5xl font-semibold text-green-950">
					Komponenten steuern
				</h1>

				<p class="mt-4 max-w-xl text-green-700">
					Im Automatikmodus entscheidet die BioBox anhand der Messwerte.
					Im manuellen Modus schaltest du selbst.
				</p>

				{#if commandMessage}
					<p class="mt-3 text-sm font-semibold text-green-700">
						{commandMessage}
					</p>
				{/if}

			</div>


			<div class="flex items-center gap-2">

				<p class="mr-1 text-sm text-green-700">
					Betriebsmodus
				</p>

				<button
					onclick={() => sendCommand('mode', 'auto')}
					class={status.mode === 'AUTO'
						? 'rounded-full bg-green-900 px-5 py-3 font-semibold text-white'
						: 'rounded-full bg-lime-100 px-5 py-3 font-semibold text-green-900'}
				>
					Automatisch
				</button>

				<button
					onclick={() => sendCommand('mode', 'manual')}
					class={status.mode === 'MANUAL'
						? 'rounded-full bg-green-900 px-5 py-3 font-semibold text-white'
						: 'rounded-full bg-lime-100 px-5 py-3 font-semibold text-green-900'}
				>
					Manuell
				</button>

			</div>

		</div>


		<div class="mt-6 space-y-4">

			<!-- Bewässerung -->
			<div
				class="flex items-center justify-between rounded-2xl border border-green-200 px-6 py-5"
			>

				<div class="flex items-center gap-4">

					<div
						class={waterActive
							? 'flex h-9 w-9 items-center justify-center rounded-full bg-lime-300 text-green-900'
							: 'flex h-9 w-9 items-center justify-center rounded-full bg-lime-100 text-green-900'}
					>
						{waterActive ? '•' : '○'}
					</div>

					<div>
						<h2 class="text-2xl font-semibold text-green-950">
							Bewässerung
						</h2>

						<p class="text-sm text-green-700">
							Status: {waterActive ? 'Aktiv' : 'Inaktiv'}
						</p>
					</div>

				</div>


				<div class="flex gap-2">

					<button
						onclick={() => sendCommand('water', 'on')}
						class={waterActive
							? 'rounded-full bg-green-900 px-5 py-3 font-semibold text-white'
							: 'rounded-full bg-lime-100 px-5 py-3 font-semibold text-green-900'}
					>
						Ein
					</button>

					<button
						onclick={() => sendCommand('water', 'off')}
						class={!waterActive
							? 'rounded-full bg-green-900 px-5 py-3 font-semibold text-white'
							: 'rounded-full bg-lime-100 px-5 py-3 font-semibold text-green-900'}
					>
						Aus
					</button>

				</div>

			</div>


			<!-- Beleuchtung -->
			<div
				class="flex items-center justify-between rounded-2xl border border-green-200 px-6 py-5"
			>

				<div class="flex items-center gap-4">

					<div
						class={lightActive
							? 'flex h-9 w-9 items-center justify-center rounded-full bg-lime-300 text-green-900'
							: 'flex h-9 w-9 items-center justify-center rounded-full bg-lime-100 text-green-900'}
					>
						{lightActive ? '•' : '○'}
					</div>

					<div>
						<h2 class="text-2xl font-semibold text-green-950">
							Beleuchtung
						</h2>

						<p class="text-sm text-green-700">
							Status: {lightActive ? 'Aktiv' : 'Inaktiv'}
						</p>
					</div>

				</div>


				<div class="flex gap-2">

					<button
						onclick={() => sendCommand('light', 'on')}
						class={lightActive
							? 'rounded-full bg-green-900 px-5 py-3 font-semibold text-white'
							: 'rounded-full bg-lime-100 px-5 py-3 font-semibold text-green-900'}
					>
						Ein
					</button>

					<button
						onclick={() => sendCommand('light', 'off')}
						class={!lightActive
							? 'rounded-full bg-green-900 px-5 py-3 font-semibold text-white'
							: 'rounded-full bg-lime-100 px-5 py-3 font-semibold text-green-900'}
					>
						Aus
					</button>

				</div>

			</div>


			<!-- Lüftung -->
			<div
				class="flex items-center justify-between rounded-2xl border border-green-200 px-6 py-5"
			>

				<div class="flex items-center gap-4">

					<div
						class={fanActive
							? 'flex h-9 w-9 items-center justify-center rounded-full bg-lime-300 text-green-900'
							: 'flex h-9 w-9 items-center justify-center rounded-full bg-lime-100 text-green-900'}
					>
						{fanActive ? '•' : '○'}
					</div>

					<div>
						<h2 class="text-2xl font-semibold text-green-950">
							Lüftung
						</h2>

						<p class="text-sm text-green-700">
							Status: {fanActive ? 'Aktiv' : 'Inaktiv'}
						</p>
					</div>

				</div>


				<div class="flex gap-2">

					<button
						onclick={() => sendCommand('fan', 'on')}
						class={fanActive
							? 'rounded-full bg-green-900 px-5 py-3 font-semibold text-white'
							: 'rounded-full bg-lime-100 px-5 py-3 font-semibold text-green-900'}
					>
						Ein
					</button>

					<button
						onclick={() => sendCommand('fan', 'off')}
						class={!fanActive
							? 'rounded-full bg-green-900 px-5 py-3 font-semibold text-white'
							: 'rounded-full bg-lime-100 px-5 py-3 font-semibold text-green-900'}
					>
						Aus
					</button>

				</div>

			</div>

		</div>

	</main>

</div>