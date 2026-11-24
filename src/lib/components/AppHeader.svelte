<script>
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages.js';
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';

	let { active } = $props();

	let profileOpen = $state(false);
	let profileMenu;

	let user = $derived(page.data.user);

	function navClass(pageName) {
		if (active === pageName) {
			return 'border-b-2 border-[#A9C4B0] px-2 py-3 text-sm font-semibold text-white';
		}

		return 'border-b-2 border-transparent px-2 py-3 text-sm font-medium text-[#B5C6BA] transition-colors hover:text-white';
	}

	function getInitials(username) {
		if (!username) {
			return 'U';
		}

		const parts = username.trim().split(' ');

		if (parts.length >= 2) {
			return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
		}

		return username.slice(0, 2).toUpperCase();
	}

	onMount(() => {
		function handleClickOutside(event) {
			if (
				profileOpen &&
				profileMenu &&
				!profileMenu.contains(event.target)
			) {
				profileOpen = false;
			}
		}

		document.addEventListener('click', handleClickOutside);

		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<header class="relative z-40 -mx-6 -mt-6 border-b border-white/10 bg-[#1C2B23] px-6 sm:-mx-9 sm:px-9">

	<div class="mx-auto flex min-h-[78px] max-w-[1400px] flex-wrap items-center justify-between gap-4 py-4 lg:flex-nowrap lg:py-0">

		<!-- LOGO -->
		<a href="/" class="flex shrink-0 items-center gap-3">

			<span class="flex h-9 w-9 items-center justify-center border border-white/25 text-[#AEC9B5]">

				<svg
					viewBox="0 0 24 24"
					class="h-5 w-5"
					fill="none"
					stroke="currentColor"
					stroke-width="1.7"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<path d="M21 8.5 12 3 3 8.5v7L12 21l9-5.5v-7Z" />
					<path d="M3 8.5 12 14l9-5.5M12 14v7" />
				</svg>

			</span>

			<span class="text-[23px] font-semibold tracking-[-0.055em] text-white">
				BioBox
			</span>

		</a>

		<!-- NAVIGATION -->
		<nav
			class="order-3 flex w-full items-center gap-5 overflow-x-auto whitespace-nowrap border-t border-white/10 pt-2 lg:order-2 lg:w-auto lg:gap-4 lg:overflow-visible lg:border-0 lg:pt-0"
			aria-label={m.header_navigation()}
		>

			<a href="/dashboard" class={navClass('dashboard')}>
				{m.header_dashboard()}
			</a>

			<a href="/live-daten" class={navClass('live-daten')}>
				{m.header_live_data()}
			</a>

			<a href="/verlauf" class={navClass('verlauf')}>
				{m.header_history()}
			</a>

			<a href="/steuerung" class={navClass('steuerung')}>
				{m.header_control()}
			</a>

			<a href="/pflanzenanalyse" class={navClass('pflanzenanalyse')}>
				{m.header_plant_analysis()}
			</a>

			<a href="/warnungen" class={navClass('warnungen')}>
				{m.header_alerts()}
			</a>

		</nav>

		<div class="order-2 flex shrink-0 items-center gap-4 lg:order-3">

			<!-- LANGUAGE SWITCHER -->
			<LanguageSwitcher />

			<!-- PROFILE -->
			<div class="relative shrink-0" bind:this={profileMenu}>

				<button
					type="button"
					onclick={() => profileOpen = !profileOpen}
					aria-label={m.header_profile()}
					aria-expanded={profileOpen}
					class="flex h-10 w-10 items-center justify-center rounded-full border border-[#A9C4B0]/50 bg-[#A9C4B0] text-sm font-semibold text-[#1C2B23] transition-colors hover:bg-[#C4D8C9]"
				>
					{getInitials(user?.username)}
				</button>

				{#if profileOpen}

					<div class="absolute right-0 z-50 mt-3 w-64 border border-[#C7D1CA] bg-[#F0F2F0] p-2 shadow-xl">

						<div class="px-4 py-4">

							<p class="font-semibold text-[#26312B]">
								{user?.username}
							</p>

							<p class="mt-1 break-all text-sm text-[#66746B]">
								{user?.email}
							</p>

							<p class="mt-2 text-xs font-medium uppercase tracking-[0.1em] text-[#7B8A80]">
								{user?.role === 'admin'
									? m.header_admin()
									: m.header_viewer()}
							</p>

						</div>

						<div class="border-t border-[#C7D1CA] pt-2">

							{#if user?.role === 'admin'}

								<a
									href="/benutzer"
									onclick={() => profileOpen = false}
									class="block w-full px-4 py-3 text-left text-sm font-medium text-[#26312B] transition-colors hover:bg-[#E0E7E2]"
								>
									{m.header_user_management()}
								</a>

							{/if}

							<form method="POST" action="/logout">

								<input
									type="hidden"
									name="redirectTo"
									value="login"
								/>

								<button
									type="submit"
									class="w-full px-4 py-3 text-left text-sm font-medium text-[#26312B] transition-colors hover:bg-[#E0E7E2]"
								>
									{m.header_switch_account()}
								</button>

							</form>

							<form method="POST" action="/logout">

								<input
									type="hidden"
									name="redirectTo"
									value="home"
								/>

								<button
									type="submit"
									class="w-full px-4 py-3 text-left text-sm font-medium text-[#26312B] transition-colors hover:bg-[#E0E7E2]"
								>
									{m.header_logout()}
								</button>

							</form>

						</div>

					</div>

				{/if}

			</div>

		</div>

	</div>

</header>