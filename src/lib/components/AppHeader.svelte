<script>
	import { page } from '$app/state';

	let { active } = $props();

	let profileOpen = $state(false);

	let user = $derived(page.data.user);

	function navClass(pageName) {
		if (active === pageName) {
			return 'rounded-full bg-green-900 px-5 py-3 font-semibold text-white';
		}

		return 'rounded-full px-4 py-3 font-semibold text-green-950';
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
</script>

<header class="flex items-center justify-between">

	<a href="/" class="text-2xl font-bold text-green-900">
		BioBox
	</a>

	<nav class="flex items-center gap-2">

		<a
			href="/dashboard"
			class={navClass('dashboard')}
		>
			Dashboard
		</a>

		<a
			href="/live-daten"
			class={navClass('live-daten')}
		>
			Live-Daten
		</a>

		<a
			href="/verlauf"
			class={navClass('verlauf')}
		>
			Verlauf
		</a>

		<a
			href="/steuerung"
			class={navClass('steuerung')}
		>
			Steuerung
		</a>

		<a
			href="/pflanzenanalyse"
			class={navClass('pflanzenanalyse')}
		>
			Pflanzenanalyse
		</a>

		<a
			href="/warnungen"
			class={navClass('warnungen')}
		>
			Warnungen
		</a>

	</nav>

	<div class="relative">

		<button
			type="button"
			onclick={() => profileOpen = !profileOpen}
			class="flex h-11 w-11 items-center justify-center rounded-full bg-lime-300 font-semibold text-green-900"
		>
			{getInitials(user?.username)}
		</button>

		{#if profileOpen}

			<div
				class="absolute right-0 z-20 mt-3 w-64 rounded-2xl border border-green-200 bg-white p-2 shadow-lg"
			>

				<div class="px-4 py-3">

					<p class="font-semibold text-green-950">
						{user?.username}
					</p>

					<p class="mt-1 text-sm text-green-700">
						{user?.email}
					</p>

				</div>

				<div class="border-t border-green-100 pt-2">

					<form method="POST" action="/logout">

						<button
							type="submit"
							class="w-full rounded-xl px-4 py-3 text-left font-semibold text-green-900 hover:bg-lime-100"
						>
							Konto wechseln
						</button>

					</form>

					<form method="POST" action="/logout">

						<button
							type="submit"
							class="w-full rounded-xl px-4 py-3 text-left font-semibold text-green-900 hover:bg-lime-100"
						>
							Abmelden
						</button>

					</form>

				</div>

			</div>

		{/if}

	</div>

</header>