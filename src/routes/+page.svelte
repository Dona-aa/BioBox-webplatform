<script>
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale, setLocale } from '$lib/paraglide/runtime.js';
</script>

<svelte:head>
	<title>{m.home_title()}</title>
	<meta name="description" content={m.home_description()} />
</svelte:head>

<div class="min-h-screen bg-[#E8EBE9] font-sans text-[#26312B] antialiased">
	<!-- HEADER -->
	<header class="sticky top-0 z-50 border-b border-white/10 bg-[#1C2B23]/95 backdrop-blur-xl">
		<div class="mx-auto flex h-[78px] max-w-[1400px] items-center justify-between px-6 md:justify-start md:[&>nav]:mx-auto lg:px-12">
			<a href="/" class="flex items-center gap-3">
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

			<nav
				class="hidden items-center gap-10 text-[13px] font-medium md:flex"
				aria-label={m.home_navigation()}
			>
				<a href="/" class="border-b border-[#A1BFA9] pb-2 text-white">
					{m.home_start()}
				</a>

				<a href="#funktionen" class="pb-2 text-[#ACBDB1] transition-colors duration-200 hover:text-white">
					{m.home_features()}
				</a>

				<a href="/dashboard" class="pb-2 text-[#ACBDB1] transition-colors duration-200 hover:text-white">
					{m.home_dashboard()}
				</a>

				<a href="#ueber-uns" class="pb-2 text-[#ACBDB1] transition-colors duration-200 hover:text-white">
					{m.home_about()}
				</a>
			</nav>

			<div class="hidden items-center gap-6 md:flex">
				<a
					href="/login"
					class="text-[13px] font-medium text-[#D3DDD5] transition-colors duration-200 hover:text-white"
				>
					{m.home_login()}
				</a>

				<a
					href="/register"
					class="border border-[#A9C4B0] bg-[#A9C4B0] px-5 py-2.5 text-[13px] font-semibold text-[#1C2B23] transition-colors duration-200 hover:bg-[#C4D8C9]"
				>
					{m.home_register()}
				</a>
			</div>

			<!-- Language selector -->
			<label
				class="relative ml-auto inline-flex h-11 min-w-12 shrink-0 items-center justify-center gap-1.5 rounded-sm px-2 text-[#C3D1C7] hover:text-white focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-[#A9C4B0] md:ml-1"
			>
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

			<!-- Mobile menu -->
			<details class="relative md:hidden">
				<summary
					class="flex h-10 w-10 cursor-pointer list-none items-center justify-center border border-white/25 text-white [&::-webkit-details-marker]:hidden"
					aria-label={m.home_menu()}
				>
					<svg
						viewBox="0 0 24 24"
						class="h-5 w-5"
						fill="none"
						stroke="currentColor"
						stroke-width="1.8"
						stroke-linecap="round"
						aria-hidden="true"
					>
						<path d="M4 7h16M4 12h16M4 17h16" />
					</svg>
				</summary>

				<div class="absolute right-0 mt-3 w-64 border border-white/15 bg-[#1C2B23] p-2 shadow-xl">
					<a href="/" class="block px-3 py-3 text-sm text-white hover:bg-white/10">
						{m.home_start()}
					</a>
					<a href="#funktionen" class="block px-3 py-3 text-sm text-white hover:bg-white/10">
						{m.home_features()}
					</a>
					<a href="/dashboard" class="block px-3 py-3 text-sm text-white hover:bg-white/10">
						{m.home_dashboard()}
					</a>
					<a href="#ueber-uns" class="block px-3 py-3 text-sm text-white hover:bg-white/10">
						{m.home_about()}
					</a>

					<div class="my-2 border-t border-white/15"></div>

					<a href="/login" class="block px-3 py-3 text-sm text-white hover:bg-white/10">
						{m.home_login()}
					</a>
					<a
						href="/register"
						class="mt-1 block bg-[#A9C4B0] px-3 py-3 text-center text-sm font-semibold text-[#1C2B23]"
					>
						{m.home_register()}
					</a>
				</div>
			</details>
		</div>
	</header>

	<main>
		<!-- HERO -->
		<section
			class="relative flex min-h-[700px] items-center overflow-hidden bg-[#1C2B23] bg-[linear-gradient(90deg,rgba(17,31,23,0.96)_0%,rgba(17,31,23,0.88)_35%,rgba(17,31,23,0.33)_72%,rgba(17,31,23,0.06)_100%),url('https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=2000&q=85')] bg-cover bg-center lg:min-h-[790px]"
		>
			<div class="relative mx-auto w-full max-w-[1400px] px-6 py-24 lg:px-12">
				<div class="max-w-[750px]">
					<p class="inline-flex items-center gap-3 border-l-2 border-[#A9C4B0] py-1 pl-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D1E0D5]">
						<span class="h-2 w-2 rounded-full bg-[#A9C4B0]"></span>
						{m.home_live_tag()}
					</p>

					<h1 class="mt-10 font-serif text-[clamp(3.2rem,6.2vw,6.8rem)] font-normal leading-[1.04] tracking-[-0.055em] text-white">
						{m.home_hero()}
					</h1>

					<p class="mt-8 max-w-[510px] text-[17px] leading-[1.85] text-[#CEDBD1]">
						{m.home_intro()}
					</p>

					<div class="mt-11 flex flex-wrap items-center gap-4">
						<a
							href="/dashboard"
							class="group inline-flex min-h-[56px] items-center justify-between gap-10 border border-[#A9C4B0] bg-[#A9C4B0] px-7 py-4 text-[14px] font-semibold text-[#1C2B23] transition-colors duration-200 hover:bg-[#C4D8C9]"
						>
							<span>{m.home_open_dashboard()}</span>
							<svg
								viewBox="0 0 24 24"
								class="h-[18px] w-[18px] transition-transform duration-200 group-hover:translate-x-1"
								fill="none"
								stroke="currentColor"
								stroke-width="1.8"
								stroke-linecap="round"
								stroke-linejoin="round"
								aria-hidden="true"
							>
								<path d="M5 12h14" />
								<path d="m13 6 6 6-6 6" />
							</svg>
						</a>

						<a
							href="#so-funktionierts"
							class="inline-flex min-h-[56px] items-center justify-center border border-white/40 bg-white/5 px-7 py-4 text-[14px] font-medium text-white transition-colors duration-200 hover:bg-white/10"
						>
							{m.home_how()}
						</a>
					</div>
				</div>
			</div>
		</section>

		<!-- KENNZAHLEN -->
		<section class="border-t border-white/10 bg-[#1C2B23]">
			<div class="mx-auto grid max-w-[1400px] grid-cols-2 gap-y-10 px-6 py-12 lg:grid-cols-4 lg:px-12 lg:py-14">
				<div class="lg:border-r lg:border-white/15 lg:pr-10">
					<p class="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#A9BBAE]">
						{m.home_readings()}
					</p>
					<p class="mt-3 font-serif text-[34px] text-white">{m.home_live()}</p>
				</div>

				<div class="lg:border-r lg:border-white/15 lg:px-10">
					<p class="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#A9BBAE]">
						{m.home_history()}
					</p>
					<p class="mt-3 font-serif text-[34px] text-white">{m.home_day()}</p>
				</div>

				<div class="lg:border-r lg:border-white/15 lg:px-10">
					<p class="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#A9BBAE]">
						{m.home_sensors()}
					</p>
					<p class="mt-3 font-serif text-[34px] text-white">4</p>
				</div>

				<div class="lg:pl-10">
					<p class="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#A9BBAE]">
						{m.home_access()}
					</p>
					<p class="mt-3 font-serif text-[34px] text-white">{m.home_sign_in_required()}</p>
				</div>
			</div>
		</section>

		<!-- FUNKTIONEN -->
		<section id="funktionen" class="scroll-mt-20 bg-[#E8EBE9]">
			<div class="mx-auto max-w-[1400px] px-6 py-20 lg:px-12 lg:py-24">
				<div class="mb-12 flex flex-col justify-between gap-5 border-b border-[#BBC6BF] pb-10 lg:flex-row lg:items-end">
					<div>
						<p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#486B57]">
							{m.home_platform_label()}
						</p>
						<h2 class="mt-5 max-w-[700px] font-serif text-[clamp(2.8rem,4vw,4.6rem)] font-normal leading-[1.1] tracking-[-0.05em] text-[#25312A]">
							{m.home_overview()}
						</h2>
					</div>

					<p class="max-w-[390px] text-[15px] leading-7 text-[#66716A]">
						{m.home_features_intro()}
					</p>
				</div>

				<div class="mx-auto max-w-[1050px]">
					<div class="grid gap-4 border-b border-[#BBC6BF] py-7 sm:grid-cols-[55px_1fr] sm:gap-8">
						<span class="pt-1 text-[12px] font-semibold text-[#53705E]">01</span>
						<div>
							<h3 class="text-[22px] font-semibold tracking-tight text-[#26312B]">
								{m.home_live_readings()}
							</h3>
							<p class="mt-3 max-w-[680px] text-[15px] leading-7 text-[#66716A]">
								{m.home_live_detail()}
							</p>
						</div>
					</div>

					<div class="grid gap-4 border-b border-[#BBC6BF] py-7 sm:grid-cols-[55px_1fr] sm:gap-8">
						<span class="pt-1 text-[12px] font-semibold text-[#53705E]">02</span>
						<div>
							<h3 class="text-[22px] font-semibold tracking-tight text-[#26312B]">
								{m.home_charts()}
							</h3>
							<p class="mt-3 max-w-[680px] text-[15px] leading-7 text-[#66716A]">
								{m.home_charts_detail()}
							</p>
						</div>
					</div>

					<div class="grid gap-4 border-b border-[#BBC6BF] py-7 sm:grid-cols-[55px_1fr] sm:gap-8">
						<span class="pt-1 text-[12px] font-semibold text-[#53705E]">03</span>
						<div>
							<h3 class="text-[22px] font-semibold tracking-tight text-[#26312B]">
								{m.home_status()}
							</h3>
							<p class="mt-3 max-w-[680px] text-[15px] leading-7 text-[#66716A]">
								{m.home_status_detail()}
							</p>
						</div>
					</div>

					<div class="grid gap-4 border-b border-[#BBC6BF] py-7 sm:grid-cols-[55px_1fr] sm:gap-8">
						<span class="pt-1 text-[12px] font-semibold text-[#53705E]">04</span>
						<div>
							<h3 class="text-[22px] font-semibold tracking-tight text-[#26312B]">
								{m.home_secure()}
							</h3>
							<p class="mt-3 max-w-[680px] text-[15px] leading-7 text-[#66716A]">
								{m.home_secure_detail()}
							</p>
						</div>
					</div>
				</div>

				<div class="mt-10 flex justify-end">
					<a
						href="/dashboard"
						class="group inline-flex items-center gap-5 border-b border-[#385C46] pb-2 text-[14px] font-semibold text-[#385C46] transition-colors duration-200 hover:text-[#1C2B23]"
					>
						{m.home_discover()}
						<svg
							viewBox="0 0 24 24"
							class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
							fill="none"
							stroke="currentColor"
							stroke-width="1.8"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
						>
							<path d="M5 12h14" />
							<path d="m13 6 6 6-6 6" />
						</svg>
					</a>
				</div>
			</div>
		</section>

		<!-- TECHNOLOGIE -->
		<section id="so-funktionierts" class="scroll-mt-20 bg-[#26312B] text-white">
			<div class="mx-auto max-w-[1400px] px-6 py-24 lg:px-12 lg:py-32">
				<div class="max-w-[850px]">
					<p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A4BBAA]">
						{m.home_technology()}
					</p>
					<h2 class="mt-7 font-serif text-[clamp(2.9rem,4.5vw,5.3rem)] font-normal leading-[1.1] tracking-[-0.05em] text-white">
						{m.home_tech_title()}
					</h2>
					<p class="mt-7 max-w-[600px] text-[16px] leading-8 text-[#AEBEB3]">
						{m.home_tech_intro()}
					</p>
				</div>

				<div class="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
					<div class="border-t border-white/25 pt-7">
						<p class="font-serif text-[48px] font-normal leading-none text-[#91B09A]">01</p>
						<h3 class="mt-8 text-[22px] font-semibold tracking-tight text-white">
							{m.home_measure()}
						</h3>
						<p class="mt-4 max-w-[340px] text-[15px] leading-7 text-[#AEBEB3]">
							{m.home_measure_detail()}
						</p>
					</div>

					<div class="border-t border-white/25 pt-7">
						<p class="font-serif text-[48px] font-normal leading-none text-[#91B09A]">02</p>
						<h3 class="mt-8 text-[22px] font-semibold tracking-tight text-white">
							{m.home_process()}
						</h3>
						<p class="mt-4 max-w-[340px] text-[15px] leading-7 text-[#AEBEB3]">
							{m.home_process_detail()}
						</p>
					</div>

					<div class="border-t border-white/25 pt-7">
						<p class="font-serif text-[48px] font-normal leading-none text-[#91B09A]">03</p>
						<h3 class="mt-8 text-[22px] font-semibold tracking-tight text-white">
							{m.home_visualize()}
						</h3>
						<p class="mt-4 max-w-[340px] text-[15px] leading-7 text-[#AEBEB3]">
							{m.home_visualize_detail()}
						</p>
					</div>
				</div>
			</div>
		</section>

		<!-- ÜBER UNS -->
		<section id="ueber-uns" class="scroll-mt-20 bg-[#D5DDDA]">
			<div class="mx-auto max-w-[1400px] px-6 py-24 lg:px-12 lg:py-32">
				<div class="grid gap-12 lg:grid-cols-12 lg:gap-20">
					<div class="lg:col-span-5">
						<p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#4A6A56]">
							{m.home_about_label()}
						</p>
						<h2 class="mt-7 font-serif text-[clamp(2.9rem,4.5vw,5.3rem)] font-normal leading-[1.1] tracking-[-0.05em] text-[#25312B]">
							{m.home_about_title()}
						</h2>
					</div>

					<div class="lg:col-span-7 lg:pt-12">
						<p class="max-w-[670px] text-[19px] leading-[1.8] text-[#46564C]">
							{m.home_about_intro()}
						</p>
						<p class="mt-7 max-w-[670px] text-[15px] leading-8 text-[#65746B]">
							{m.home_about_project()}
						</p>

						<div class="mt-14 grid gap-8 border-t border-[#AEBDB3] pt-8 sm:grid-cols-2">
							<div>
								<h3 class="text-[17px] font-semibold text-[#26312B]">
									{m.home_hardware()}
								</h3>
								<p class="mt-3 text-[14px] leading-7 text-[#66746B]">
									{m.home_hardware_detail()}
								</p>
							</div>

							<div>
								<h3 class="text-[17px] font-semibold text-[#26312B]">
									{m.home_software()}
								</h3>
								<p class="mt-3 text-[14px] leading-7 text-[#66746B]">
									{m.home_software_detail()}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- FAQ -->
		<section class="bg-[#E8EBE9]">
			<div class="mx-auto grid max-w-[1400px] gap-14 px-6 py-24 lg:grid-cols-12 lg:px-12 lg:py-32">
				<div class="lg:col-span-4">
					<p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#4A6A56]">
						{m.home_faq()}
					</p>
					<h2 class="mt-7 font-serif text-[clamp(2.9rem,4.2vw,5rem)] font-normal leading-tight tracking-[-0.05em] text-[#26312B]">
						{m.home_faq_title()}
					</h2>
					<p class="mt-6 max-w-[350px] text-[16px] leading-8 text-[#66746B]">
						{m.home_faq_intro()}
					</p>
				</div>

				<div class="divide-y divide-[#BBC6BF] border-y border-[#BBC6BF] lg:col-span-8">
					<details class="group py-7">
						<summary class="flex cursor-pointer list-none items-center justify-between gap-6 text-[16px] font-semibold text-[#26312B] [&::-webkit-details-marker]:hidden">
							{m.home_refresh_q()}
							<svg viewBox="0 0 24 24" class="h-5 w-5 shrink-0 text-[#4A6A56] transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
								<path d="m6 9 6 6 6-6" />
							</svg>
						</summary>
						<p class="mt-5 max-w-2xl text-[15px] leading-7 text-[#66746B]">
							{m.home_refresh_a()}
						</p>
					</details>

					<details class="group py-7">
						<summary class="flex cursor-pointer list-none items-center justify-between gap-6 text-[16px] font-semibold text-[#26312B] [&::-webkit-details-marker]:hidden">
							{m.home_values_q()}
							<svg viewBox="0 0 24 24" class="h-5 w-5 shrink-0 text-[#4A6A56] transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
								<path d="m6 9 6 6 6-6" />
							</svg>
						</summary>
						<p class="mt-5 max-w-2xl text-[15px] leading-7 text-[#66746B]">
							{m.home_values_a()}
						</p>
					</details>

					<details class="group py-7">
						<summary class="flex cursor-pointer list-none items-center justify-between gap-6 text-[16px] font-semibold text-[#26312B] [&::-webkit-details-marker]:hidden">
							{m.home_status_q()}
							<svg viewBox="0 0 24 24" class="h-5 w-5 shrink-0 text-[#4A6A56] transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
								<path d="m6 9 6 6 6-6" />
							</svg>
						</summary>
						<p class="mt-5 max-w-2xl text-[15px] leading-7 text-[#66746B]">
							{m.home_status_a()}
						</p>
					</details>

					<details class="group py-7">
						<summary class="flex cursor-pointer list-none items-center justify-between gap-6 text-[16px] font-semibold text-[#26312B] [&::-webkit-details-marker]:hidden">
							{m.home_privacy_q()}
							<svg viewBox="0 0 24 24" class="h-5 w-5 shrink-0 text-[#4A6A56] transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
								<path d="m6 9 6 6 6-6" />
							</svg>
						</summary>
						<p class="mt-5 max-w-2xl text-[15px] leading-7 text-[#66746B]">
							{m.home_privacy_a()}
						</p>
					</details>
				</div>
			</div>
		</section>

		<!-- CALL TO ACTION -->
		<section class="bg-[#1C2B23]">
			<div class="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-10 px-6 py-24 md:flex-row md:items-center lg:px-12 lg:py-28">
				<div>
					<p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A9C4B0]">
						BIOBOX
					</p>
					<h2 class="mt-6 font-serif text-[clamp(2.9rem,4.2vw,5rem)] font-normal leading-tight tracking-[-0.05em] text-white">
						{m.home_cta()}
					</h2>
					<p class="mt-6 max-w-lg text-[16px] leading-8 text-[#B5C6BA]">
						{m.home_cta_detail()}
					</p>
				</div>

				<div class="flex flex-wrap gap-4">
					<a
						href="/register"
						class="group inline-flex items-center justify-between gap-8 border border-[#A9C4B0] bg-[#A9C4B0] px-7 py-4 text-[14px] font-semibold text-[#1C2B23] transition-colors duration-200 hover:bg-[#C4D8C9]"
					>
						{m.home_register()}
						<svg
							viewBox="0 0 24 24"
							class="h-[18px] w-[18px] transition-transform duration-200 group-hover:translate-x-1"
							fill="none"
							stroke="currentColor"
							stroke-width="1.8"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
						>
							<path d="M5 12h14" />
							<path d="m13 6 6 6-6 6" />
						</svg>
					</a>

					<a
						href="/login"
						class="inline-flex items-center justify-center border border-white/30 px-7 py-4 text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-white/10"
					>
						{m.home_login()}
					</a>
				</div>
			</div>
		</section>
	</main>

	<!-- FOOTER -->
	<footer class="border-t border-white/10 bg-[#1C2B23]">
		<div class="mx-auto grid max-w-[1400px] gap-12 px-6 py-16 sm:grid-cols-2 lg:grid-cols-12 lg:px-12">
			<div class="lg:col-span-6">
				<p class="text-[25px] font-semibold tracking-[-0.055em] text-white">BioBox</p>
				<p class="mt-5 max-w-sm text-[15px] leading-7 text-[#A9BBAE]">
					{m.home_footer_detail()}
				</p>
			</div>

			<div class="lg:col-span-3">
				<p class="text-[13px] font-semibold text-white">{m.home_platform()}</p>
				<div class="mt-6 flex flex-col gap-4 text-[13px] text-[#A9BBAE]">
					<a href="/dashboard" class="transition-colors duration-200 hover:text-white">
						{m.home_dashboard()}
					</a>
					<a href="#funktionen" class="transition-colors duration-200 hover:text-white">
						{m.home_features()}
					</a>
					<a href="#ueber-uns" class="transition-colors duration-200 hover:text-white">
						{m.home_about()}
					</a>
				</div>
			</div>

			<div class="lg:col-span-3">
				<p class="text-[13px] font-semibold text-white">{m.home_account()}</p>
				<div class="mt-6 flex flex-col gap-4 text-[13px] text-[#A9BBAE]">
					<a href="/login" class="transition-colors duration-200 hover:text-white">
						{m.home_login()}
					</a>
					<a href="/register" class="transition-colors duration-200 hover:text-white">
						{m.home_register()}
					</a>
					<a href="/impressum" class="transition-colors duration-200 hover:text-white">
						{m.home_legal()}
					</a>
					<a href="/datenschutz" class="transition-colors duration-200 hover:text-white">
						{m.home_privacy()}
					</a>
				</div>
			</div>
		</div>

		<div class="border-t border-white/10">
			<div class="mx-auto flex max-w-[1400px] flex-col gap-2 px-6 py-7 text-[12px] text-[#899D8D] sm:flex-row sm:justify-between lg:px-12">
				<p>© 2026 BioBox</p>
				<p>{m.home_diploma()}</p>
			</div>
		</div>
	</footer>
</div>