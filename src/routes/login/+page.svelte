<script>
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale, setLocale } from '$lib/paraglide/runtime.js';

	let { form } = $props();
	let showPassword = $state(false);

	function validateEmail(event) {
		const input = event.currentTarget;

		input.setCustomValidity('');

		if (input.validity.valueMissing) {
			input.setCustomValidity(m.validation_email_required());
		} else if (input.validity.typeMismatch) {
			input.setCustomValidity(m.validation_email_invalid());
		}
	}

	function validatePassword(event) {
		const input = event.currentTarget;

		input.setCustomValidity('');

		if (input.validity.valueMissing) {
			input.setCustomValidity(m.validation_password_required());
		}
	}
</script>

<svelte:head>
	<title>{m.home_login()} · BioBox</title>
</svelte:head>

<div class="flex min-h-screen bg-[#E8EDE9] font-sans text-[#25332B]">

	<!-- Left side: BioBox introduction -->
	<section class="relative hidden min-h-screen w-[47%] flex-col overflow-hidden bg-[#1C2B23] lg:flex">

		<div class="relative z-10 flex items-center justify-between px-12 pt-11 xl:px-16">

			<a href="/" class="text-[25px] font-semibold tracking-[-0.04em] text-[#F2F5F0]">
				BioBox<span class="text-[#A9C4B0]">.</span>
			</a>

			<span class="text-[11px] font-medium uppercase tracking-[0.14em] text-[#A9C4B0]">
				{m.login_system()}
			</span>

		</div>

		<div class="relative z-10 flex flex-1 flex-col justify-center px-12 py-20 xl:px-16">

			<div class="mb-10 flex items-center gap-3">

				<span class="h-px w-9 bg-[#A9C4B0]"></span>

				<p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A9C4B0]">
					{m.login_monitoring()}
				</p>

			</div>

			<h1 class="max-w-[540px] text-[clamp(2.8rem,4vw,4.5rem)] font-semibold leading-[1.12] tracking-[-0.055em] text-[#F2F5F0]">
				{m.login_headline_first()}<br />
				{m.login_headline_second()}
			</h1>

			<p class="mt-8 max-w-[400px] text-[15px] leading-7 text-[#B1C2B5]">
				{m.login_intro()}
			</p>

			<div class="mt-14 max-w-[420px] space-y-5">

				<div class="flex items-center gap-4 border-t border-[#405548] pt-5">

					<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#486151] bg-[#293E31]">

						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.6"
							class="h-5 w-5 text-[#A9C4B0]"
							aria-hidden="true"
						>
							<path d="M3 3v18h18" />
							<path d="m6 15 5-5 4 3 5-7" />
						</svg>

					</div>

					<div>

						<p class="text-[13px] font-semibold text-[#EAF0EA]">
							{m.login_sensors()}
						</p>

						<p class="mt-1 text-[12px] text-[#9FB5A5]">
							{m.login_sensors_detail()}
						</p>

					</div>

				</div>

				<div class="flex items-center gap-4 border-t border-[#405548] pt-5">

					<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#486151] bg-[#293E31]">

						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.6"
							class="h-5 w-5 text-[#A9C4B0]"
							aria-hidden="true"
						>
							<rect x="3" y="3" width="18" height="18" rx="2" />
							<circle cx="8.5" cy="8.5" r="1.5" />
							<path d="m3 17 5-5 4 4 3-3 6 6" />
						</svg>

					</div>

					<div>

						<p class="text-[13px] font-semibold text-[#EAF0EA]">
							{m.login_images()}
						</p>

						<p class="mt-1 text-[12px] text-[#9FB5A5]">
							{m.login_images_detail()}
						</p>

					</div>

				</div>

				<div class="flex items-center gap-4 border-t border-[#405548] pt-5">

					<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#486151] bg-[#293E31]">

						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.6"
							class="h-5 w-5 text-[#A9C4B0]"
							aria-hidden="true"
						>
							<rect x="4" y="4" width="16" height="16" rx="3" />
							<path d="M9 12h6M12 9v6" />
						</svg>

					</div>

					<div>

						<p class="text-[13px] font-semibold text-[#EAF0EA]">
							{m.login_controls()}
						</p>

						<p class="mt-1 text-[12px] text-[#9FB5A5]">
							{m.login_controls_detail()}
						</p>

					</div>

				</div>

			</div>

		</div>

		<div class="relative z-10 flex items-center justify-between border-t border-[#405548] px-12 py-7 xl:px-16">

			<p class="text-[11px] text-[#90A998]">
				BioBox · {m.login_monitoring()}
			</p>

			<p class="text-[11px] text-[#90A998]">
				{m.login_technology()}
			</p>

		</div>

	</section>

	<!-- Right side: login form -->
	<section class="flex min-h-screen min-w-0 flex-1 flex-col bg-[#F1F4F0]">

		<div class="flex items-center justify-between px-6 pt-7 sm:px-12 lg:justify-end lg:px-16 lg:pt-11">

			<a href="/" class="text-[24px] font-semibold tracking-tight text-[#1C2B23] lg:hidden">
				BioBox<span class="text-[#487C69]">.</span>
			</a>

			<div class="flex items-center gap-1">

				<a href="/" class="text-[12px] font-medium text-[#728077] transition-colors hover:text-[#25332B]">
					← {m.login_back()}
				</a>

				<!-- Language switcher -->
				<label class="relative inline-flex h-10 shrink-0 items-center gap-1.5 rounded-sm px-2 text-[#405046] hover:text-[#1C2B23] focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-[#487C69]">

					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						class="h-[18px] w-[18px]"
						aria-hidden="true"
					>
						<circle cx="12" cy="12" r="9" />
						<ellipse cx="12" cy="12" rx="4" ry="9" />
						<path d="M3 12h18" />
					</svg>

					<span aria-hidden="true" class="text-xs font-semibold uppercase">
						{getLocale()}
					</span>

					<select
						aria-label={m.language()}
						title={m.language()}
						value={getLocale()}
						onchange={(event) => setLocale(event.currentTarget.value)}
						class="absolute inset-0 h-full w-full cursor-pointer bg-[#1C2B23] text-white opacity-0 [color-scheme:dark] [&>option]:bg-[#1C2B23] [&>option]:text-white"
					>
						<option value="de" lang="de">Deutsch</option>
						<option value="en" lang="en">English</option>
						<option value="sq" lang="sq">Shqip</option>
					</select>

				</label>

			</div>

		</div>

		<div class="flex flex-1 items-center justify-center px-6 py-16 sm:px-12 lg:px-14 xl:px-20">

			<div class="w-full max-w-[430px]">

				<div class="mb-10">

					<p class="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#487C69]">
						{m.login_welcome()}
					</p>

					<h2 class="mt-4 text-[clamp(2.2rem,3vw,3rem)] font-semibold tracking-[-0.045em] text-[#25332B]">
						{m.home_login()}
					</h2>

					<p class="mt-3 text-[14px] leading-6 text-[#7B8980]">
						{m.login_form_intro()}
					</p>

				</div>

				{#if form?.error}

					<div role="alert" class="mb-6 rounded-lg border border-[#DAB9B4] bg-[#F3E8E6] px-4 py-3.5">

						<div class="flex items-start gap-3">

							<span aria-hidden="true" class="mt-0.5 text-[#AD625C]">!</span>

							<p class="text-[12px] leading-5 text-[#945E56]">
								{form.error}
							</p>

						</div>

					</div>

				{/if}

				<form method="POST" class="space-y-6">

					<div>

						<label for="email" class="block text-[12px] font-semibold text-[#405046]">
							{m.login_email()}
						</label>

						<input
							id="email"
							name="email"
							type="email"
							autocomplete="email"
							required
							oninvalid={validateEmail}
							oninput={validateEmail}
							placeholder={m.login_email_example()}
							class="mt-2.5 w-full rounded-lg border border-[#CED9D0] bg-[#F8FAF7] px-4 py-3.5 text-[14px] text-[#25332B] outline-none transition-colors placeholder:text-[#A1ADA4] focus:border-[#487C69] focus:ring-2 focus:ring-[#487C69]/10"
						/>

					</div>

					<div>

						<label for="password" class="block text-[12px] font-semibold text-[#405046]">
							{m.login_password()}
						</label>

						<div class="relative mt-2.5">

							<input
								id="password"
								name="password"
								type={showPassword ? 'text' : 'password'}
								autocomplete="current-password"
								required
								oninvalid={validatePassword}
								oninput={validatePassword}
								placeholder={m.login_password_hint()}
								class="w-full rounded-lg border border-[#CED9D0] bg-[#F8FAF7] px-4 py-3.5 pr-20 text-[14px] text-[#25332B] outline-none transition-colors placeholder:text-[#A1ADA4] focus:border-[#487C69] focus:ring-2 focus:ring-[#487C69]/10"
							/>

							<button
								type="button"
								onclick={() => (showPassword = !showPassword)}
								aria-label={showPassword ? m.login_hide_password() : m.login_show_password()}
								class="absolute inset-y-0 right-4 flex items-center text-[12px] font-medium text-[#6E8173] hover:text-[#25332B]"
							>
								{showPassword ? m.login_hide() : m.login_show()}
							</button>

						</div>

					</div>

					<button
						type="submit"
						class="flex w-full items-center justify-between rounded-lg bg-[#1C2B23] px-5 py-4 text-[13px] font-semibold text-[#F1F4F0] transition-colors hover:bg-[#304437]"
					>

						<span>{m.home_login()}</span>

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

				<div class="mt-8 border-t border-[#DCE4DD] pt-7">

					<p class="text-center text-[13px] text-[#7B8980]">

						{m.login_no_account()}

						<a href="/register" class="ml-1 font-semibold text-[#416B50] transition-colors hover:text-[#25332B]">
							{m.home_register()} →
						</a>

					</p>

				</div>

				<div class="mt-10 flex items-start gap-3 rounded-lg bg-[#E6ECE7] px-4 py-4">

					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.6"
						class="mt-0.5 h-5 w-5 shrink-0 text-[#718D79]"
						aria-hidden="true"
					>
						<rect x="5" y="10" width="14" height="11" rx="2" />
						<path d="M8 10V7a4 4 0 0 1 8 0v3" />
					</svg>

					<p class="text-[11px] leading-5 text-[#829087]">
						{m.login_security()}
					</p>

				</div>

			</div>

		</div>

		<div class="border-t border-[#E0E7E1] px-6 py-6 text-center sm:px-12">

			<p class="text-[11px] text-[#9AA79E]">
				© BioBox · {m.login_monitoring()}
			</p>

		</div>

	</section>

</div>