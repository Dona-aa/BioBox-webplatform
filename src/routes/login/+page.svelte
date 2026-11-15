<script>
	let { form } = $props();

	let showPassword = $state(false);
</script>

<div class="flex min-h-screen bg-[#E8EDE9] font-sans text-[#25332B]">

	<!-- LEFT: BRANDING -->
	<section class="relative hidden min-h-screen w-[47%] flex-col overflow-hidden bg-[#1C2B23] lg:flex">

		<!-- BRAND -->
		<div class="relative z-10 flex items-center justify-between px-12 pt-11 xl:px-16">

			<a
				href="/"
				class="text-[25px] font-semibold tracking-[-0.04em] text-[#F2F5F0]"
			>
				BioBox<span class="text-[#A9C4B0]">.</span>
			</a>

			<span class="text-[11px] font-medium tracking-[0.14em] text-[#A9C4B0]">
				SMART GROWING SYSTEM
			</span>

		</div>

		<!-- MAIN BRANDING CONTENT -->
		<div class="relative z-10 flex flex-1 flex-col justify-center px-12 py-20 xl:px-16">

			<div class="mb-10 flex items-center gap-3">

				<span class="h-px w-9 bg-[#A9C4B0]"></span>

				<p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A9C4B0]">
					Intelligent Plant Monitoring
				</p>

			</div>

			<h1 class="max-w-[540px] text-[clamp(2.8rem,4vw,4.5rem)] font-semibold leading-[1.12] tracking-[-0.055em] text-[#F2F5F0]">
				Alles im Blick.<br />
				Alles unter<br />
				Kontrolle<span class="text-[#A9C4B0]">.</span>
			</h1>

			<p class="mt-8 max-w-[400px] text-[15px] leading-7 text-[#B1C2B5]">
				Überwache deine Pflanzenumgebung, analysiere das Wachstum
				und steuere deine BioBox über eine zentrale Plattform.
			</p>

			<!-- FEATURE LIST -->
			<div class="mt-14 max-w-[420px] space-y-5">

				<div class="flex items-center gap-4 border-t border-[#405548] pt-5">

					<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#486151] bg-[#293E31]">

						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="#A9C4B0"
							stroke-width="1.6"
							class="h-5 w-5"
							aria-hidden="true"
						>
							<path d="M3 3v18h18" />
							<path d="m6 15 5-5 4 3 5-7" />
						</svg>

					</div>

					<div>
						<p class="text-[13px] font-semibold text-[#EAF0EA]">
							Sensordaten in Echtzeit
						</p>

						<p class="mt-1 text-[12px] text-[#9FB5A5]">
							Alle wichtigen Umgebungswerte auf einen Blick.
						</p>
					</div>

				</div>

				<div class="flex items-center gap-4 border-t border-[#405548] pt-5">

					<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#486151] bg-[#293E31]">

						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="#A9C4B0"
							stroke-width="1.6"
							class="h-5 w-5"
							aria-hidden="true"
						>
							<rect x="3" y="3" width="18" height="18" rx="2" />
							<circle cx="8.5" cy="8.5" r="1.5" />
							<path d="m3 17 5-5 4 4 3-3 6 6" />
						</svg>

					</div>

					<div>
						<p class="text-[13px] font-semibold text-[#EAF0EA]">
							Bildbasierte Pflanzenanalyse
						</p>

						<p class="mt-1 text-[12px] text-[#9FB5A5]">
							Wachstum und Gesundheit automatisch auswerten.
						</p>
					</div>

				</div>

				<div class="flex items-center gap-4 border-t border-[#405548] pt-5">

					<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#486151] bg-[#293E31]">

						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="#A9C4B0"
							stroke-width="1.6"
							class="h-5 w-5"
							aria-hidden="true"
						>
							<rect x="4" y="4" width="16" height="16" rx="3" />
							<path d="M9 12h6M12 9v6" />
						</svg>

					</div>

					<div>
						<p class="text-[13px] font-semibold text-[#EAF0EA]">
							Intelligente Systemsteuerung
						</p>

						<p class="mt-1 text-[12px] text-[#9FB5A5]">
							Die BioBox zentral überwachen und verwalten.
						</p>
					</div>

				</div>

			</div>

		</div>

		<!-- BOTTOM -->
		<div class="relative z-10 flex items-center justify-between border-t border-[#405548] px-12 py-7 xl:px-16">

			<p class="text-[11px] text-[#90A998]">
				BioBox · Smart Plant Monitoring
			</p>

			<p class="text-[11px] text-[#90A998]">
				IoT & Computer Vision
			</p>

		</div>

	</section>

	<!-- RIGHT: LOGIN -->
	<section class="flex min-h-screen min-w-0 flex-1 flex-col bg-[#F1F4F0]">

		<!-- MOBILE BRAND -->
		<div class="flex items-center justify-between px-6 pt-7 sm:px-12 lg:justify-end lg:px-16 lg:pt-11">

			<a
				href="/"
				class="text-[24px] font-semibold tracking-tight text-[#1C2B23] lg:hidden"
			>
				BioBox<span class="text-[#487C69]">.</span>
			</a>

			<a
				href="/"
				class="text-[12px] font-medium text-[#728077] transition-colors hover:text-[#25332B]"
			>
				← Zur Startseite
			</a>

		</div>

		<!-- LOGIN FORM -->
		<div class="flex flex-1 items-center justify-center px-6 py-16 sm:px-12 lg:px-14 xl:px-20">

			<div class="w-full max-w-[430px]">

				<div class="mb-10">

					<p class="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#487C69]">
						Willkommen zurück
					</p>

					<h2 class="mt-4 text-[clamp(2.2rem,3vw,3rem)] font-semibold tracking-[-0.045em] text-[#25332B]">
						Anmelden
					</h2>

					<p class="mt-3 text-[14px] leading-6 text-[#7B8980]">
						Melde dich an, um deine BioBox zu verwalten.
					</p>

				</div>

				<!-- ERROR MESSAGE -->
				{#if form?.error}
					<div
						role="alert"
						class="mb-6 rounded-lg border border-[#DAB9B4] bg-[#F3E8E6] px-4 py-3.5"
					>
						<div class="flex items-start gap-3">

							<span class="mt-0.5 text-[#AD625C]">!</span>

							<p class="text-[12px] leading-5 text-[#945E56]">
								{form.error}
							</p>

						</div>
					</div>
				{/if}

				<!-- LOGIN FORM -->
				<form method="POST" class="space-y-6">

					<!-- EMAIL -->
					<div>
						<label
							for="email"
							class="block text-[12px] font-semibold text-[#405046]"
						>
							E-Mail-Adresse
						</label>

						<input
							id="email"
							name="email"
							type="email"
							autocomplete="email"
							required
							placeholder="name@beispiel.at"
							class="mt-2.5 w-full rounded-lg border border-[#CED9D0] bg-[#F8FAF7] px-4 py-3.5 text-[14px] text-[#25332B] outline-none transition-colors placeholder:text-[#A1ADA4] focus:border-[#487C69] focus:ring-2 focus:ring-[#487C69]/10"
						/>
					</div>

					<!-- PASSWORD -->
					<div>
						<label
							for="password"
							class="block text-[12px] font-semibold text-[#405046]"
						>
							Passwort
						</label>

						<div class="relative mt-2.5">

							<input
								id="password"
								name="password"
								type={showPassword ? 'text' : 'password'}
								autocomplete="current-password"
								required
								placeholder="Passwort eingeben"
								class="w-full rounded-lg border border-[#CED9D0] bg-[#F8FAF7] px-4 py-3.5 pr-20 text-[14px] text-[#25332B] outline-none transition-colors placeholder:text-[#A1ADA4] focus:border-[#487C69] focus:ring-2 focus:ring-[#487C69]/10"
							/>

							<button
								type="button"
								onclick={() => (showPassword = !showPassword)}
								aria-label={showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'}
								class="absolute inset-y-0 right-4 flex items-center text-[12px] font-medium text-[#6E8173] hover:text-[#25332B]"
							>
								{showPassword ? 'Verbergen' : 'Anzeigen'}
							</button>

						</div>
					</div>

					<!-- SUBMIT -->
					<button
						type="submit"
						class="flex w-full items-center justify-between rounded-lg bg-[#1C2B23] px-5 py-4 text-[13px] font-semibold text-[#F1F4F0] transition-colors hover:bg-[#304437]"
					>
						<span>Anmelden</span>

						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.8"
							class="h-4 w-4"
							aria-hidden="true"
						>
							<path d="M5 12h14m-6-6 6 6-6 6" />
						</svg>
					</button>

				</form>

				<!-- REGISTER -->
				<div class="mt-8 border-t border-[#DCE4DD] pt-7">

					<p class="text-center text-[13px] text-[#7B8980]">
						Noch kein Konto?

						<a
							href="/register"
							class="ml-1 font-semibold text-[#416B50] transition-colors hover:text-[#25332B]"
						>
							Konto erstellen →
						</a>
					</p>

				</div>

				<!-- SECURITY NOTE -->
				<div class="mt-10 flex items-start gap-3 rounded-lg bg-[#E6ECE7] px-4 py-4">

					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="#718D79"
						stroke-width="1.6"
						class="mt-0.5 h-5 w-5 shrink-0"
						aria-hidden="true"
					>
						<rect x="5" y="10" width="14" height="11" rx="2" />
						<path d="M8 10V7a4 4 0 0 1 8 0v3" />
					</svg>

					<p class="text-[11px] leading-5 text-[#829087]">
						Dein Zugang ist durch ein persönliches Benutzerkonto geschützt.
					</p>

				</div>

			</div>

		</div>

		<!-- FOOTER -->
		<div class="border-t border-[#E0E7E1] px-6 py-6 text-center sm:px-12">

			<p class="text-[11px] text-[#9AA79E]">
				© BioBox · Intelligent Plant Monitoring
			</p>

		</div>

	</section>

</div>