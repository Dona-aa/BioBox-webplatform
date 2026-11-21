<script>
	import AppHeader from '$lib/components/AppHeader.svelte';

	let { data, form } = $props();

	function formatDate(date) {
		return new Date(date).toLocaleDateString('de-DE');
	}
</script>

<div class="min-h-screen bg-[#E7ECE8] px-9 py-6">
	<div class="mx-auto max-w-[1400px]">
		<AppHeader active="benutzer" />

		<main class="mt-12">
			<div class="flex items-end justify-between">
				<div>
					<p class="text-xs font-semibold uppercase tracking-[0.16em] text-[#55705F]">
						Benutzerverwaltung
					</p>

					<h1 class="mt-3 text-4xl font-semibold tracking-tight text-[#173D2B]">
						Benutzer verwalten
					</h1>

					<p class="mt-3 max-w-2xl text-sm leading-6 text-[#607267]">
						Verwalte Benutzerkonten und lege fest, welche Personen Zugriff
						auf administrative Funktionen der BioBox haben.
					</p>
				</div>

				<div class="rounded-xl border border-[#CFD9D1] bg-[#F4F6F3] px-4 py-3">
					<p class="text-xs text-[#6C7E72]">
						Registrierte Benutzer
					</p>

					<p class="mt-1 text-xl font-semibold text-[#173D2B]">
						{data.users.length}
					</p>
				</div>
			</div>

			{#if form?.success}
				<div class="mt-6 rounded-xl border border-[#BFCDBF] bg-[#DDE9D9] px-5 py-4 text-sm font-medium text-[#244E33]">
					Benutzerrolle wurde geändert.
				</div>
			{/if}

			{#if form?.error}
				<div class="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-900">
					{form.error}
				</div>
			{/if}

			<div class="mt-8 overflow-hidden rounded-2xl border border-[#CBD6CE] bg-[#F4F6F3]">
				<table class="w-full min-w-[900px] text-left">
					<thead>
						<tr class="border-b border-[#CBD6CE] bg-[#234B35]">
							<th class="px-6 py-4 text-xs font-semibold uppercase tracking-[0.08em] text-[#E9F0EA]">
								Benutzer
							</th>

							<th class="px-6 py-4 text-xs font-semibold uppercase tracking-[0.08em] text-[#E9F0EA]">
								E-Mail
							</th>

							<th class="px-6 py-4 text-xs font-semibold uppercase tracking-[0.08em] text-[#E9F0EA]">
								Registriert
							</th>

							<th class="px-6 py-4 text-xs font-semibold uppercase tracking-[0.08em] text-[#E9F0EA]">
								Rolle
							</th>

							<th class="px-6 py-4 text-xs font-semibold uppercase tracking-[0.08em] text-[#E9F0EA]">
								Aktion
							</th>
						</tr>
					</thead>

					<tbody>
						{#each data.users as user}
							<tr class="border-b border-[#DCE3DD] last:border-b-0 hover:bg-[#EEF2EE]">
								<td class="px-6 py-5">
									<div class="flex items-center gap-3">
										<div class="flex h-10 w-10 items-center justify-center rounded-full bg-[#DCE7D8] text-sm font-semibold text-[#234B35]">
											{user.username.slice(0, 2).toUpperCase()}
										</div>

										<div>
											<p class="font-semibold text-[#173D2B]">
												{user.username}
											</p>

											{#if user.id === data.user?.id}
												<p class="mt-0.5 text-xs text-[#6B7C70]">
													Dein Konto
												</p>
											{/if}
										</div>
									</div>
								</td>

								<td class="px-6 py-5 text-sm text-[#52675A]">
									{user.email}
								</td>

								<td class="px-6 py-5 text-sm text-[#52675A]">
									{formatDate(user.created_at)}
								</td>

								<td class="px-6 py-5">
									<span
										class={user.role === 'admin'
											? 'inline-flex rounded-full bg-[#234B35] px-3 py-1.5 text-xs font-semibold text-white'
											: 'inline-flex rounded-full bg-[#E1E8E1] px-3 py-1.5 text-xs font-semibold text-[#40584A]'}
									>
										{user.role === 'admin' ? 'Admin' : 'Viewer'}
									</span>
								</td>

								<td class="px-6 py-5">
									{#if user.id === data.user?.id}
										<span class="text-sm text-[#7A8B80]">
											Eigenes Konto
										</span>
									{:else}
										<form
											method="POST"
											action="?/changeRole"
											class="flex items-center gap-2"
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
													class="w-28 appearance-none rounded-lg border border-[#C8D2CA] bg-white py-2 pl-3 pr-8 text-sm font-medium text-[#284333] outline-none focus:border-[#73947B]"
												>
													<option value="viewer">
														Viewer
													</option>

													<option value="admin">
														Admin
													</option>
												</select>

												<span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#607267]">
													▼
												</span>
											</div>

											<button
												type="submit"
												class="rounded-lg border border-[#31573F] bg-[#31573F] px-3 py-2 text-xs font-semibold text-white hover:bg-[#284A35]"
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
</div>