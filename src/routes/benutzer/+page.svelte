<script>
	import AppHeader from '$lib/components/AppHeader.svelte';

	let { data, form } = $props();

	function formatDate(date) {
		return new Date(date).toLocaleDateString('de-DE');
	}
</script>

<div class="min-h-screen bg-white px-9 py-6">
	<AppHeader active="benutzer" />

	<main class="mt-10">
		<p class="text-sm font-semibold text-green-800">
			// BENUTZERVERWALTUNG
		</p>

		<h1 class="mt-3 text-5xl font-semibold text-green-950">
			Benutzer verwalten
		</h1>

		<p class="mt-4 text-green-700">
			Hier können Benutzerrollen verwaltet werden.
		</p>

		{#if form?.success}
			<div class="mt-6 rounded-xl bg-lime-100 px-5 py-4 text-green-900">
				Benutzerrolle wurde geändert.
			</div>
		{/if}

		{#if form?.unchanged}
			<div class="mt-6 rounded-xl bg-green-50 px-5 py-4 text-green-800">
				Keine Änderung nötig.
			</div>
		{/if}

		{#if form?.error}
			<div class="mt-6 rounded-xl bg-red-100 px-5 py-4 text-red-900">
				{form.error}
			</div>
		{/if}

		<div class="mt-6 overflow-x-auto rounded-2xl border border-green-200">
			<table class="w-full min-w-[850px] text-left">
				<thead class="bg-green-900 text-white">
					<tr>
						<th class="px-6 py-4 font-semibold">
							Benutzer
						</th>

						<th class="px-6 py-4 font-semibold">
							E-Mail
						</th>

						<th class="px-6 py-4 font-semibold">
							Registriert
						</th>

						<th class="px-6 py-4 font-semibold">
							Rolle
						</th>

						<th class="px-6 py-4 font-semibold">
							Aktion
						</th>
					</tr>
				</thead>

				<tbody>
					{#each data.users as user}
						<tr class="border-b border-green-100 last:border-b-0">
							<td class="px-6 py-5">
								<div class="flex items-center gap-3">
									<div class="flex h-10 w-10 items-center justify-center rounded-full bg-lime-200 font-semibold text-green-950">
										{user.username.slice(0, 2).toUpperCase()}
									</div>

									<div>
										<p class="font-semibold text-green-950">
											{user.username}
										</p>

										{#if user.id === data.user?.id}
											<p class="text-sm text-green-700">
												Du
											</p>
										{/if}
									</div>
								</div>
							</td>

							<td class="px-6 py-5 text-green-800">
								{user.email}
							</td>

							<td class="px-6 py-5 text-green-800">
								{formatDate(user.created_at)}
							</td>

							<td class="px-6 py-5">
								<span
									class={user.role === 'admin'
										? 'rounded-full bg-green-900 px-4 py-2 text-sm font-semibold text-white'
										: 'rounded-full bg-lime-100 px-4 py-2 text-sm font-semibold text-green-900'}
								>
									{user.role === 'admin' ? 'Admin' : 'Viewer'}
								</span>
							</td>

							<td class="px-6 py-5">
								{#if user.id === data.user?.id}
									<span class="text-sm text-green-700">
										Eigenes Konto
									</span>
								{:else}
									<form
										method="POST"
										action="?/changeRole"
										class="flex items-center gap-3"
									>
										<input
											type="hidden"
											name="userId"
											value={user.id}
										/>

										<div class="relative">
											<select
												name="role"
												value={user.role}
												class="w-32 appearance-none rounded-xl border border-green-200 bg-white py-2 pl-4 pr-10 text-green-950"
											>
												<option value="viewer">
													Viewer
												</option>

												<option value="admin">
													Admin
												</option>
											</select>

											<span class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-green-700">
												▼
											</span>
										</div>

										<button
											type="submit"
											class="rounded-full bg-lime-300 px-4 py-2 font-semibold text-green-950 hover:bg-lime-400"
										>
											Speichern
										</button>
									</form>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</main>
</div>