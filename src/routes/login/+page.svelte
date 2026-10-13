<script>
	let { form } = $props();
</script>

<div class="grid min-h-screen lg:grid-cols-2">

	<div class="flex min-h-screen flex-col">

		<div class="flex-1 bg-green-900 p-12 text-white">
			<a href="/" class="text-2xl font-bold">
				BioBox
			</a>
		</div>

		<div class="flex-1 bg-green-100 p-12">
			<div class="mt-10">
				<p class="text-sm font-semibold text-lime-500">
					// WILLKOMMEN
				</p>

				<h1 class="mt-4 text-5xl font-semibold leading-tight text-white">
					Schön, dass du da<br />
					bist.
				</h1>
			</div>
		</div>

	</div>

	<div class="flex min-h-screen items-center bg-white p-12">

		<div class="w-full max-w-xl">

			<h2 class="text-4xl font-semibold text-green-950">
				Anmelden
			</h2>

			<form method="POST" class="mt-6">

				<label
					for="email"
					class="text-sm font-semibold text-green-950"
				>
					E-Mail
				</label>

				<input
					id="email"
					name="email"
					type="email"
					placeholder="name@beispiel.at"
					class="mt-2 w-full rounded-xl border border-green-200 bg-lime-50 px-4 py-4 outline-none focus:border-green-700"
				/>

				<label
					for="password"
					class="mt-5 block text-sm font-semibold text-green-950"
				>
					Passwort
				</label>

				<input
					id="password"
					name="password"
					type="password"
					placeholder="••••••••"
					class="mt-2 w-full rounded-xl border border-green-200 bg-lime-50 px-4 py-4 outline-none focus:border-green-700"
				/>

				<button
					type="submit"
					class="mt-5 w-full rounded-full bg-green-900 px-6 py-4 text-left font-semibold text-white hover:bg-green-800"
				>
					Anmelden →
				</button>

			</form>

			{#if form?.error}
				<p class="mt-4 text-sm font-semibold text-red-700">
					{form.error}
				</p>
			{/if}

			{#if form?.success}
				<p class="mt-4 text-sm font-semibold text-green-700">
					Anmeldung erfolgreich.
				</p>
			{/if}

			<p class="mt-5 text-sm text-green-800">
				Noch kein Konto?
				<a href="/register" class="font-semibold underline">
					Registrieren
				</a>
			</p>

		</div>

	</div>

</div>