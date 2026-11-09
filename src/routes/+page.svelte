<svelte:head>
	<title>BioBox – Intelligente Pflanzenüberwachung</title>
	<meta
		name="description"
		content="Überwache Temperatur, Feuchtigkeit und den Zustand deiner BioBox in Echtzeit."
	/>
</svelte:head>

<div class="min-h-screen bg-[#E8EBE9] font-sans text-[#26312B] antialiased">

	<!-- HEADER -->
	<header class="sticky top-0 z-50 border-b border-white/10 bg-[#1C2B23]/95 backdrop-blur-xl">
		<div class="mx-auto flex h-[78px] max-w-[1400px] items-center justify-between px-6 lg:px-12">

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

			<nav class="hidden items-center gap-10 text-[13px] font-medium md:flex" aria-label="Hauptnavigation">
				<a href="/" class="border-b border-[#A1BFA9] pb-2 text-white">
					Start
				</a>

				<a href="#funktionen" class="pb-2 text-[#ACBDB1] transition-colors duration-200 hover:text-white">
					Funktionen
				</a>

				<a href="/dashboard" class="pb-2 text-[#ACBDB1] transition-colors duration-200 hover:text-white">
					Dashboard
				</a>

				<a href="#ueber-uns" class="pb-2 text-[#ACBDB1] transition-colors duration-200 hover:text-white">
					Über uns
				</a>
			</nav>

			<div class="hidden items-center gap-6 md:flex">
				<a href="/login" class="text-[13px] font-medium text-[#D3DDD5] transition-colors duration-200 hover:text-white">
					Anmelden
				</a>

				<a
					href="/register"
					class="border border-[#A9C4B0] bg-[#A9C4B0] px-5 py-2.5 text-[13px] font-semibold text-[#1C2B23] transition-colors duration-200 hover:bg-[#C4D8C9]"
				>
					Konto erstellen
				</a>
			</div>

			<details class="relative md:hidden">
				<summary
					class="flex h-10 w-10 cursor-pointer list-none items-center justify-center border border-white/25 text-white [&::-webkit-details-marker]:hidden"
					aria-label="Menü öffnen"
				>
					<svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
						<path d="M4 7h16M4 12h16M4 17h16" />
					</svg>
				</summary>

				<div class="absolute right-0 mt-3 w-64 border border-white/15 bg-[#1C2B23] p-2 shadow-xl">
					<a href="/" class="block px-3 py-3 text-sm text-white hover:bg-white/10">Start</a>
					<a href="#funktionen" class="block px-3 py-3 text-sm text-white hover:bg-white/10">Funktionen</a>
					<a href="/dashboard" class="block px-3 py-3 text-sm text-white hover:bg-white/10">Dashboard</a>
					<a href="#ueber-uns" class="block px-3 py-3 text-sm text-white hover:bg-white/10">Über uns</a>

					<div class="my-2 border-t border-white/15"></div>

					<a href="/login" class="block px-3 py-3 text-sm text-white hover:bg-white/10">Anmelden</a>
					<a href="/register" class="mt-1 block bg-[#A9C4B0] px-3 py-3 text-center text-sm font-semibold text-[#1C2B23]">
						Konto erstellen
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
						Deine BioBox, live
					</p>

					<h1 class="mt-10 font-serif text-[clamp(3.2rem,6.2vw,6.8rem)] font-normal leading-[1.04] tracking-[-0.055em] text-white">
						Alles über deine BioBox. Auf einen Blick.
					</h1>

					<p class="mt-8 max-w-[510px] text-[17px] leading-[1.85] text-[#CEDBD1]">
						Sieh Temperatur, Feuchtigkeit und Zustand deiner BioBox in Echtzeit, ganz ohne die Seite neu zu laden.
					</p>

					<div class="mt-11 flex flex-wrap items-center gap-4">

						<a
							href="/dashboard"
							class="group inline-flex min-h-[56px] items-center justify-between gap-10 border border-[#A9C4B0] bg-[#A9C4B0] px-7 py-4 text-[14px] font-semibold text-[#1C2B23] transition-colors duration-200 hover:bg-[#C4D8C9]"
						>
							<span>Dashboard öffnen</span>

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
							So funktioniert's
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
						Messwerte
					</p>
					<p class="mt-3 font-serif text-[34px] text-white">
						Live
					</p>
				</div>

				<div class="lg:border-r lg:border-white/15 lg:px-10">
					<p class="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#A9BBAE]">
						Verlauf
					</p>
					<p class="mt-3 font-serif text-[34px] text-white">
						24 Stunden
					</p>
				</div>

				<div class="lg:border-r lg:border-white/15 lg:px-10">
					<p class="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#A9BBAE]">
						Sensoren
					</p>
					<p class="mt-3 font-serif text-[34px] text-white">
						4
					</p>
				</div>

				<div class="lg:pl-10">
					<p class="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#A9BBAE]">
						Zugriff
					</p>
					<p class="mt-3 font-serif text-[34px] text-white">
						Mit Anmeldung
					</p>
				</div>

			</div>
		</section>

		<!-- FUNKTIONEN -->
		<section id="funktionen" class="scroll-mt-20 bg-[#E8EBE9]">
			<div class="mx-auto max-w-[1400px] px-6 py-20 lg:px-12 lg:py-24">

				<div class="mb-12 flex flex-col justify-between gap-5 border-b border-[#BBC6BF] pb-10 lg:flex-row lg:items-end">
					<div>
						<p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#486B57]">
							DIE PLATTFORM
						</p>

						<h2 class="mt-5 max-w-[700px] font-serif text-[clamp(2.8rem,4vw,4.6rem)] font-normal leading-[1.1] tracking-[-0.05em] text-[#25312A]">
							Alles im Blick.
						</h2>
					</div>

					<p class="max-w-[390px] text-[15px] leading-7 text-[#66716A]">
						Die wichtigsten Funktionen der BioBox-Plattform, übersichtlich an einem Ort.
					</p>
				</div>

				<!-- FEATURES IN ONE COLUMN -->
				<div class="mx-auto max-w-[1050px]">

					<!-- LIVE -->
					<div class="grid gap-4 border-b border-[#BBC6BF] py-7 sm:grid-cols-[55px_1fr] sm:gap-8">
						<span class="pt-1 text-[12px] font-semibold text-[#53705E]">
							01
						</span>

						<div>
							<h3 class="text-[22px] font-semibold tracking-tight text-[#26312B]">
								Live-Messwerte
							</h3>

							<p class="mt-3 max-w-[680px] text-[15px] leading-7 text-[#66716A]">
								Temperatur, Luftfeuchtigkeit, Bodenfeuchte und Licht werden automatisch aktualisiert.
							</p>
						</div>
					</div>

					<!-- VERLAUF -->
					<div class="grid gap-4 border-b border-[#BBC6BF] py-7 sm:grid-cols-[55px_1fr] sm:gap-8">
						<span class="pt-1 text-[12px] font-semibold text-[#53705E]">
							02
						</span>

						<div>
							<h3 class="text-[22px] font-semibold tracking-tight text-[#26312B]">
								Datenvisualisierung
							</h3>

							<p class="mt-3 max-w-[680px] text-[15px] leading-7 text-[#66716A]">
								Diagramme machen Veränderungen und Entwicklungen über längere Zeiträume sichtbar.
							</p>
						</div>
					</div>

					<!-- STATUS -->
					<div class="grid gap-4 border-b border-[#BBC6BF] py-7 sm:grid-cols-[55px_1fr] sm:gap-8">
						<span class="pt-1 text-[12px] font-semibold text-[#53705E]">
							03
						</span>

						<div>
							<h3 class="text-[22px] font-semibold tracking-tight text-[#26312B]">
								Systemstatus & Warnungen
							</h3>

							<p class="mt-3 max-w-[680px] text-[15px] leading-7 text-[#66716A]">
								Der Zustand deiner BioBox und wichtige Veränderungen werden übersichtlich dargestellt.
							</p>
						</div>
					</div>

					<!-- KONTO -->
					<div class="grid gap-4 border-b border-[#BBC6BF] py-7 sm:grid-cols-[55px_1fr] sm:gap-8">
						<span class="pt-1 text-[12px] font-semibold text-[#53705E]">
							04
						</span>

						<div>
							<h3 class="text-[22px] font-semibold tracking-tight text-[#26312B]">
								Sicherer Zugriff
							</h3>

							<p class="mt-3 max-w-[680px] text-[15px] leading-7 text-[#66716A]">
								Benutzerkonten und Zugriffsrechte ermöglichen eine kontrollierte Nutzung der Plattform.
							</p>
						</div>
					</div>

				</div>

				<div class="mt-10 flex justify-end">
					<a
						href="/dashboard"
						class="group inline-flex items-center gap-5 border-b border-[#385C46] pb-2 text-[14px] font-semibold text-[#385C46] transition-colors duration-200 hover:text-[#1C2B23]"
					>
						Plattform entdecken

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

				<!-- FULL WIDTH HEADING -->
				<div class="max-w-[850px]">
					<p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A4BBAA]">
						TECHNOLOGIE
					</p>

					<h2 class="mt-7 font-serif text-[clamp(2.9rem,4.5vw,5.3rem)] font-normal leading-[1.1] tracking-[-0.05em] text-white">
						Von der Pflanze bis auf deinen Bildschirm.
					</h2>

					<p class="mt-7 max-w-[600px] text-[16px] leading-8 text-[#AEBEB3]">
						Ein System, das Sensorik, Datenverarbeitung und Webplattform miteinander verbindet.
					</p>
				</div>

				<!-- THREE STEPS SIDE BY SIDE -->
				<div class="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">

					<!-- STEP 1 -->
					<div class="border-t border-white/25 pt-7">
						<p class="font-serif text-[48px] font-normal leading-none text-[#91B09A]">
							01
						</p>

						<h3 class="mt-8 text-[22px] font-semibold tracking-tight text-white">
							Messen
						</h3>

						<p class="mt-4 max-w-[340px] text-[15px] leading-7 text-[#AEBEB3]">
							Die Sensoren erfassen laufend die wichtigsten Umgebungsbedingungen innerhalb der BioBox.
						</p>
					</div>

					<!-- STEP 2 -->
					<div class="border-t border-white/25 pt-7">
						<p class="font-serif text-[48px] font-normal leading-none text-[#91B09A]">
							02
						</p>

						<h3 class="mt-8 text-[22px] font-semibold tracking-tight text-white">
							Verarbeiten
						</h3>

						<p class="mt-4 max-w-[340px] text-[15px] leading-7 text-[#AEBEB3]">
							Die Messwerte werden an das Backend übertragen und in der Datenbank gespeichert.
						</p>
					</div>

					<!-- STEP 3 -->
					<div class="border-t border-white/25 pt-7">
						<p class="font-serif text-[48px] font-normal leading-none text-[#91B09A]">
							03
						</p>

						<h3 class="mt-8 text-[22px] font-semibold tracking-tight text-white">
							Visualisieren
						</h3>

						<p class="mt-4 max-w-[340px] text-[15px] leading-7 text-[#AEBEB3]">
							Die Webplattform stellt aktuelle Werte, historische Entwicklungen und Systemzustände übersichtlich dar.
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
							ÜBER BIOBOX
						</p>

						<h2 class="mt-7 font-serif text-[clamp(2.9rem,4.5vw,5.3rem)] font-normal leading-[1.1] tracking-[-0.05em] text-[#25312B]">
							Technologie trifft Pflanzenwelt.
						</h2>

					</div>

					<div class="lg:col-span-7 lg:pt-12">

						<p class="max-w-[670px] text-[19px] leading-[1.8] text-[#46564C]">
							BioBox verbindet intelligente Sensorik, automatisierte Steuerung und moderne Webtechnologie, um das Wachstum von Pflanzen nachvollziehbar und kontrollierbar zu machen.
						</p>

						<p class="mt-7 max-w-[670px] text-[15px] leading-8 text-[#65746B]">
							Das Projekt wird im Rahmen einer Diplomarbeit entwickelt. Hardware, Datenbank und Webplattform arbeiten dabei als zusammenhängendes System.
						</p>

						<div class="mt-14 grid gap-8 border-t border-[#AEBDB3] pt-8 sm:grid-cols-2">

							<div>
								<h3 class="text-[17px] font-semibold text-[#26312B]">
									Hardware & Sensorik
								</h3>

								<p class="mt-3 text-[14px] leading-7 text-[#66746B]">
									Erfassung und Übertragung relevanter Messwerte.
								</p>
							</div>

							<div>
								<h3 class="text-[17px] font-semibold text-[#26312B]">
									Software & Daten
								</h3>

								<p class="mt-3 text-[14px] leading-7 text-[#66746B]">
									Verarbeitung, Speicherung und Visualisierung der Informationen.
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
						FAQ
					</p>

					<h2 class="mt-7 font-serif text-[clamp(2.9rem,4.2vw,5rem)] font-normal leading-tight tracking-[-0.05em] text-[#26312B]">
						Gut zu wissen.
					</h2>

					<p class="mt-6 max-w-[350px] text-[16px] leading-8 text-[#66746B]">
						Antworten auf die wichtigsten Fragen rund um BioBox.
					</p>

				</div>

				<div class="divide-y divide-[#BBC6BF] border-y border-[#BBC6BF] lg:col-span-8">

					<details class="group py-7">
						<summary class="flex cursor-pointer list-none items-center justify-between gap-6 text-[16px] font-semibold text-[#26312B] [&::-webkit-details-marker]:hidden">
							Muss ich die Seite neu laden, um neue Werte zu sehen?

							<svg viewBox="0 0 24 24" class="h-5 w-5 shrink-0 text-[#4A6A56] transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
								<path d="m6 9 6 6 6-6" />
							</svg>
						</summary>

						<p class="mt-5 max-w-2xl text-[15px] leading-7 text-[#66746B]">
							Nein. Neue Messwerte erscheinen automatisch im Dashboard, sobald sie gespeichert wurden.
						</p>
					</details>

					<details class="group py-7">
						<summary class="flex cursor-pointer list-none items-center justify-between gap-6 text-[16px] font-semibold text-[#26312B] [&::-webkit-details-marker]:hidden">
							Welche Werte zeigt die Plattform an?

							<svg viewBox="0 0 24 24" class="h-5 w-5 shrink-0 text-[#4A6A56] transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
								<path d="m6 9 6 6 6-6" />
							</svg>
						</summary>

						<p class="mt-5 max-w-2xl text-[15px] leading-7 text-[#66746B]">
							Temperatur, Luftfeuchtigkeit, Bodenfeuchtigkeit und Licht sowie historische Messwerte.
						</p>
					</details>

					<details class="group py-7">
						<summary class="flex cursor-pointer list-none items-center justify-between gap-6 text-[16px] font-semibold text-[#26312B] [&::-webkit-details-marker]:hidden">
							Was bedeuten die Statusanzeigen?

							<svg viewBox="0 0 24 24" class="h-5 w-5 shrink-0 text-[#4A6A56] transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
								<path d="m6 9 6 6 6-6" />
							</svg>
						</summary>

						<p class="mt-5 max-w-2xl text-[15px] leading-7 text-[#66746B]">
							Sie zeigen, ob Komponenten aktiv, inaktiv oder auffällig sind.
						</p>
					</details>

					<details class="group py-7">
						<summary class="flex cursor-pointer list-none items-center justify-between gap-6 text-[16px] font-semibold text-[#26312B] [&::-webkit-details-marker]:hidden">
							Wer kann meine Daten sehen?

							<svg viewBox="0 0 24 24" class="h-5 w-5 shrink-0 text-[#4A6A56] transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
								<path d="m6 9 6 6 6-6" />
							</svg>
						</summary>

						<p class="mt-5 max-w-2xl text-[15px] leading-7 text-[#66746B]">
							Angemeldete Personen mit den entsprechenden Zugriffsrechten.
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
						Behalte deine Pflanzen im Blick.
					</h2>

					<p class="mt-6 max-w-lg text-[16px] leading-8 text-[#B5C6BA]">
						Melde dich an und entdecke die Möglichkeiten der BioBox-Plattform.
					</p>

				</div>

				<div class="flex flex-wrap gap-4">

					<a
						href="/register"
						class="group inline-flex items-center justify-between gap-8 border border-[#A9C4B0] bg-[#A9C4B0] px-7 py-4 text-[14px] font-semibold text-[#1C2B23] transition-colors duration-200 hover:bg-[#C4D8C9]"
					>
						Konto erstellen

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
						Anmelden
					</a>

				</div>

			</div>

		</section>

	</main>

	<!-- FOOTER -->
	<footer class="border-t border-white/10 bg-[#1C2B23]">

		<div class="mx-auto grid max-w-[1400px] gap-12 px-6 py-16 sm:grid-cols-2 lg:grid-cols-12 lg:px-12">

			<div class="lg:col-span-6">
				<p class="text-[25px] font-semibold tracking-[-0.055em] text-white">
					BioBox
				</p>

				<p class="mt-5 max-w-sm text-[15px] leading-7 text-[#A9BBAE]">
					Intelligente Pflanzenüberwachung durch vernetzte Sensorik und moderne Webtechnologie.
				</p>
			</div>

			<div class="lg:col-span-3">
				<p class="text-[13px] font-semibold text-white">
					Plattform
				</p>

				<div class="mt-6 flex flex-col gap-4 text-[13px] text-[#A9BBAE]">
					<a href="/dashboard" class="transition-colors duration-200 hover:text-white">Dashboard</a>
					<a href="#funktionen" class="transition-colors duration-200 hover:text-white">Funktionen</a>
					<a href="#ueber-uns" class="transition-colors duration-200 hover:text-white">Über uns</a>
				</div>
			</div>

			<div class="lg:col-span-3">
				<p class="text-[13px] font-semibold text-white">
					Konto
				</p>

				<div class="mt-6 flex flex-col gap-4 text-[13px] text-[#A9BBAE]">
					<a href="/login" class="transition-colors duration-200 hover:text-white">Anmelden</a>
					<a href="/register" class="transition-colors duration-200 hover:text-white">Konto erstellen</a>
					<a href="/impressum" class="transition-colors duration-200 hover:text-white">Impressum</a>
					<a href="/datenschutz" class="transition-colors duration-200 hover:text-white">Datenschutz</a>
				</div>
			</div>

		</div>

		<div class="border-t border-white/10">
			<div class="mx-auto flex max-w-[1400px] flex-col gap-2 px-6 py-7 text-[12px] text-[#899D8D] sm:flex-row sm:justify-between lg:px-12">
				<p>© 2026 BioBox</p>
				<p>Ein Diplomarbeitsprojekt</p>
			</div>
		</div>

	</footer>

</div>