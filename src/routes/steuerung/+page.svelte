<script>
	import { onMount } from 'svelte';
	import AppHeader from '$lib/components/AppHeader.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime.js';

	let { data } = $props();

	let status = $state(data.status ?? {});

	let commandMessage = $state('');
	let commandError = $state(false);
	let sending = $state(false);
	let updating = $state(false);
	let connectionError = $state(false);
	let lastUpdate = $state(null);

	let isManual = $derived(status.mode === 'MANUAL');
	let isAuto = $derived(status.mode === 'AUTO');

	let waterActive = $derived(Number(status.pump_water_ms) > 0);
	let lightActive = $derived(Number(status.led_duty_pct) > 0);
	let fanActive = $derived(Number(status.fan_duty_pct) > 0);

	let activeCount = $derived(
		Number(waterActive) +
		Number(lightActive) +
		Number(fanActive)
	);

	const components = [
		{
			id: 'water',
			name: m.control_water(),
			description: m.control_water_description(),
			color: '#648A9B',
			number: '01'
		},
		{
			id: 'light',
			name: m.control_light(),
			description: m.control_light_description(),
			color: '#A18B60',
			number: '02'
		},
		{
			id: 'fan',
			name: m.control_fan(),
			description: m.control_fan_description(),
			color: '#487C69',
			number: '03'
		}
	];

	function currentLocale() {
		if (getLocale() === 'en') return 'en-US';
		if (getLocale() === 'sq') return 'sq-AL';
		return 'de-DE';
	}

	function componentIsActive(id) {
		if (id === 'water') return waterActive;
		if (id === 'light') return lightActive;
		if (id === 'fan') return fanActive;

		return false;
	}

	function componentValue(id) {
		if (id === 'water') {
			return `${Number(status.pump_water_ms) || 0} ms`;
		}

		if (id === 'light') {
			return `${Number(status.led_duty_pct) || 0} %`;
		}

		if (id === 'fan') {
			return `${Number(status.fan_duty_pct) || 0} %`;
		}

		return '–';
	}

	function formatTime(value) {
		if (!value) return m.control_not_updated();

		return new Date(value).toLocaleTimeString(currentLocale(), {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		});
	}

	// Aktuellen Komponentenstatus vom Backend laden
	async function updateStatus() {
		if (updating || sending) return;

		updating = true;

		try {
			const response = await fetch(
				`/api/v1/status?t=${Date.now()}`,
				{ cache: 'no-store' }
			);

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}`);
			}

			const result = await response.json();

			status = result;
			lastUpdate = Date.now();
			connectionError = false;
		} catch (error) {
			connectionError = true;
			console.error('Status konnte nicht geladen werden:', error);
		} finally {
			updating = false;
		}
	}

	// Bestehende API-Befehle verwenden
	async function sendCommand(component, action) {
		if (sending) return;

		// Komponenten dürfen nur manuell geschaltet werden
		if (component !== 'mode' && !isManual) {
			commandMessage = m.control_switch_manual_first();
			commandError = true;
			return;
		}

		sending = true;
		commandMessage = '';
		commandError = false;

		try {
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

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}`);
			}

			commandMessage = m.control_command_success();
			commandError = false;

		} catch (error) {
			commandMessage = m.control_command_failed();
			commandError = true;

			console.error('Fehler beim Senden des Befehls:', error);
		} finally {
			sending = false;
			await updateStatus();
		}
	}

	onMount(() => {
		updateStatus();

		const interval = setInterval(updateStatus, 5000);

		return () => clearInterval(interval);
	});
</script>

<div class="min-h-screen bg-[#E5EAE6] px-6 py-6 font-sans text-[#25332B] sm:px-9">

	<AppHeader active="steuerung" />

	<main class="mx-auto max-w-[1400px] pb-16 pt-9">

		<!-- HEADER -->
		<div class="mb-8 flex flex-wrap items-center justify-between gap-5">

			<div>
				<p class="text-[12px] text-[#77847B]">
					{m.control_breadcrumb()}
				</p>

				<h1 class="mt-2 text-[27px] font-semibold tracking-tight">
					{m.control_title()}
				</h1>

				<p class="mt-1 text-[13px] text-[#77847B]">
					{m.control_intro()}
				</p>
			</div>

			<div class="flex items-center gap-3 rounded-lg border border-[#CED8D0] bg-[#F1F4F0] px-4 py-3">

				<span
					class={connectionError
						? 'h-2 w-2 rounded-full bg-[#B86C61]'
						: 'h-2 w-2 rounded-full bg-[#487C69]'}
				></span>

				<div>
					<p class="text-[12px] font-medium text-[#405B49]">
						{connectionError
							? m.control_status_unavailable()
							: m.control_status_active()}
					</p>

					<p class="mt-0.5 text-[11px] text-[#829087]">
						{m.control_refresh_interval()}
					</p>
				</div>

			</div>

		</div>

		<!-- COMMAND FEEDBACK -->
		{#if commandMessage}
			<div
				role="status"
				class={commandError
					? 'mb-5 rounded-lg border border-[#D8B4AF] bg-[#F0E3E1] px-5 py-4 text-[13px] text-[#945E56]'
					: 'mb-5 rounded-lg border border-[#B9D1BE] bg-[#DFEAE1] px-5 py-4 text-[13px] text-[#416B50]'}
			>
				{commandMessage}
			</div>
		{/if}

		<!-- BETRIEBSMODUS -->
		<section class="overflow-hidden rounded-xl border border-[#CED8D0] bg-[#F1F4F0]">

			<div class="flex flex-wrap items-start justify-between gap-4 border-b border-[#DCE3DD] px-6 py-5 sm:px-7">

				<div>
					<h2 class="text-[16px] font-semibold">
						{m.control_mode()}
					</h2>

					<p class="mt-1.5 text-[12px] text-[#829087]">
						{m.control_mode_description()}
					</p>
				</div>

				<div class="flex items-center gap-2 rounded-md bg-[#E4EBE6] px-3 py-2">

					<span
						class="h-2 w-2 rounded-full bg-[#487C69]"
					></span>

					<span class="text-[11px] font-semibold text-[#4B6653]">
						{isAuto
							? m.control_auto_mode()
							: isManual
								? m.control_manual_mode()
								: m.control_unknown_mode()}
					</span>

				</div>

			</div>

			<div class="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 sm:p-7">

				<!-- AUTOMATISCH -->
				<div
					class={isAuto
						? 'rounded-lg border-2 border-[#487C69] bg-[#E6EEE8] p-5'
						: 'rounded-lg border border-[#D5DED7] bg-[#EDF1ED] p-5'}
				>
					<div class="flex items-start justify-between gap-4">

						<div>
							<p class="text-[15px] font-semibold">
								{m.control_automatic()}
							</p>

							<p class="mt-2 max-w-sm text-[12px] leading-6 text-[#75847A]">
								{m.control_automatic_description()}
							</p>
						</div>

						<span
							class={isAuto
								? 'flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#487C69] text-[13px] text-white'
								: 'h-6 w-6 shrink-0 rounded-full border border-[#C3D0C6] bg-[#F1F4F0]'}
						>
							{isAuto ? '✓' : ''}
						</span>

					</div>

					<button
						type="button"
						onclick={() => sendCommand('mode', 'auto')}
						disabled={sending || isAuto}
						class={isAuto
							? 'mt-7 w-full cursor-default rounded-md bg-[#D6E4D9] px-4 py-3 text-[12px] font-semibold text-[#487C69]'
							: 'mt-7 w-full rounded-md bg-[#1C2B23] px-4 py-3 text-[12px] font-semibold text-white transition-colors hover:bg-[#304437] disabled:cursor-not-allowed disabled:opacity-50'}
					>
						{isAuto
							? m.control_current_mode()
							: m.control_activate_auto()}
					</button>

				</div>

				<!-- MANUELL -->
				<div
					class={isManual
						? 'rounded-lg border-2 border-[#487C69] bg-[#E6EEE8] p-5'
						: 'rounded-lg border border-[#D5DED7] bg-[#EDF1ED] p-5'}
				>
					<div class="flex items-start justify-between gap-4">

						<div>
							<p class="text-[15px] font-semibold">
								{m.control_manual()}
							</p>

							<p class="mt-2 max-w-sm text-[12px] leading-6 text-[#75847A]">
								{m.control_manual_description()}
							</p>
						</div>

						<span
							class={isManual
								? 'flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#487C69] text-[13px] text-white'
								: 'h-6 w-6 shrink-0 rounded-full border border-[#C3D0C6] bg-[#F1F4F0]'}
						>
							{isManual ? '✓' : ''}
						</span>

					</div>

					<button
						type="button"
						onclick={() => sendCommand('mode', 'manual')}
						disabled={sending || isManual}
						class={isManual
							? 'mt-7 w-full cursor-default rounded-md bg-[#D6E4D9] px-4 py-3 text-[12px] font-semibold text-[#487C69]'
							: 'mt-7 w-full rounded-md bg-[#1C2B23] px-4 py-3 text-[12px] font-semibold text-white transition-colors hover:bg-[#304437] disabled:cursor-not-allowed disabled:opacity-50'}
					>
						{isManual
							? m.control_current_mode()
							: m.control_activate_manual()}
					</button>

				</div>

			</div>

		</section>

		<!-- KOMPONENTEN HEADER -->
		<div class="mb-4 mt-9 flex flex-wrap items-center justify-between gap-4">

			<div>
				<h2 class="text-[16px] font-semibold">
					{m.control_components()}
				</h2>

				<p class="mt-1 text-[12px] text-[#829087]">
					{m.control_components_description()}
				</p>
			</div>

			<div class="rounded-md border border-[#CED8D0] bg-[#F1F4F0] px-4 py-2.5">

				<span class="text-[12px] text-[#75847A]">
					{m.control_active_components()}
				</span>

				<span class="ml-3 text-[14px] font-semibold tabular-nums">
					{activeCount} / 3
				</span>

			</div>

		</div>

		<!-- COMPONENTS -->
		<div class="grid grid-cols-1 gap-4 lg:grid-cols-3">

			{#each components as component}

				{@const active = componentIsActive(component.id)}

				<section class="flex min-w-0 flex-col rounded-xl border border-[#CED8D0] bg-[#F1F4F0] p-6">

					<div class="flex items-start justify-between gap-4">

						<div class="flex items-center gap-3">

							<div
								class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
								style={`background-color: ${component.color}18`}
							>
								<span
									class="h-3 w-3 rounded-full"
									style={`background-color: ${component.color}`}
								></span>
							</div>

							<div>
								<h3 class="text-[15px] font-semibold">
									{component.name}
								</h3>

								<p class="mt-1 text-[11px] text-[#87928A]">
									{m.control_component_number({ number: component.number })}
								</p>
							</div>

						</div>

						<span
							class={active
								? 'rounded-md bg-[#DCEAE0] px-3 py-1.5 text-[11px] font-semibold text-[#487C69]'
								: 'rounded-md bg-[#E4E9E5] px-3 py-1.5 text-[11px] font-semibold text-[#7C8980]'}
						>
							{active ? m.control_active() : m.control_inactive()}
						</span>

					</div>

					<p class="mt-5 min-h-[40px] text-[12px] leading-5 text-[#75847A]">
						{component.description}
					</p>

					<!-- STATUS -->
					<div class="mt-6 rounded-lg border border-[#DAE2DC] bg-[#E9EEEA] p-4">

						<div class="flex items-center justify-between gap-3">

							<p class="text-[11px] font-medium text-[#829087]">
								{m.control_current_status()}
							</p>

							<span
								class={active
									? 'h-2 w-2 rounded-full bg-[#487C69]'
									: 'h-2 w-2 rounded-full bg-[#A5B0A7]'}
							></span>

						</div>

						<p class="mt-2 text-[24px] font-semibold tracking-tight tabular-nums">
							{active
								? m.control_switched_on()
								: m.control_switched_off()}
						</p>

						<p class="mt-2 text-[11px] text-[#87928A]">
							{componentValue(component.id)}
						</p>

					</div>

					<!-- CONTROLS -->
					<div class="mt-auto pt-6">

						<p class="mb-3 text-[11px] font-medium text-[#829087]">
							{m.control_manual_control()}
						</p>

						<div class="grid grid-cols-2 gap-2">

							<button
								type="button"
								onclick={() => sendCommand(component.id, 'on')}
								disabled={!isManual || sending || active}
								class={active
									? 'rounded-md bg-[#487C69] px-4 py-3 text-[12px] font-semibold text-white disabled:cursor-not-allowed'
									: 'rounded-md border border-[#C9D5CC] bg-[#E7EDE8] px-4 py-3 text-[12px] font-semibold text-[#52695A] transition-colors hover:bg-[#DCE7DF] disabled:cursor-not-allowed disabled:opacity-50'}
							>
								{m.control_on()}
							</button>

							<button
								type="button"
								onclick={() => sendCommand(component.id, 'off')}
								disabled={!isManual || sending || !active}
								class={!active
									? 'rounded-md bg-[#1C2B23] px-4 py-3 text-[12px] font-semibold text-white disabled:cursor-not-allowed'
									: 'rounded-md border border-[#C9D5CC] bg-[#E7EDE8] px-4 py-3 text-[12px] font-semibold text-[#52695A] transition-colors hover:bg-[#DCE7DF] disabled:cursor-not-allowed disabled:opacity-50'}
							>
								{m.control_off()}
							</button>

						</div>

						{#if !isManual}
							<p class="mt-3 text-[11px] leading-5 text-[#87928A]">
								{m.control_manual_only()}
							</p>
						{:else}
							<p class="mt-3 text-[11px] leading-5 text-[#87928A]">
								{m.control_api_hint()}
							</p>
						{/if}

					</div>

				</section>

			{/each}

		</div>

		<!-- STATUS FOOTER -->
		<div class="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-[#CAD5CC] pt-5">

			<div class="flex items-center gap-3">

				<span
					class={connectionError
						? 'h-2 w-2 rounded-full bg-[#B86C61]'
						: 'h-2 w-2 rounded-full bg-[#487C69]'}
				></span>

				<p class="text-[12px] text-[#77847B]">
					{connectionError
						? m.control_status_failed()
						: m.control_last_update({ time: formatTime(lastUpdate) })}
				</p>

			</div>

			<button
				type="button"
				onclick={updateStatus}
				disabled={updating || sending}
				class="text-[12px] font-semibold text-[#416B50] transition-colors hover:text-[#25332B] disabled:cursor-not-allowed disabled:opacity-50"
			>
				{updating
					? m.control_updating()
					: `${m.control_refresh()} →`}
			</button>

		</div>

	</main>

</div>