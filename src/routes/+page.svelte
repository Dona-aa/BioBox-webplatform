<header class="mx-auto flex max-w-7xl items-center justify-between px-10 py-7">
    <a href="/" class="text-3xl font-bold text-green-900">
        BioBox
    </a>

    <nav class="flex items-center gap-10">
        <a href="/" class="text-green-950 hover:text-green-700">
            Start
        </a>

        <a href="#funktionen" class="text-green-950 hover:text-green-700">
            Funktionen
        </a>

        <a href="/dashboard" class="text-green-950 hover:text-green-700">
            Dashboard
        </a>

        <a href="#ueber-uns" class="text-green-950 hover:text-green-700">
            Über uns
        </a>
    </nav>

    <a
        href="/login"
        class="rounded-full border border-green-900 px-6 py-3 text-green-900 hover:bg-green-50"
    >
        Anmelden
    </a>
</header>

<main class="mx-auto max-w-7xl px-10 py-16">
    <section class="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">

        <div>
            <p class="inline-block rounded-lg bg-lime-100 px-3 py-2 text-sm text-green-900">
                Deine BioBox, live
            </p>

            <h1 class="mt-6 text-6xl font-semibold leading-tight text-green-950">
                Alles über deine<br />
                BioBox. Auf einen<br />
                Blick.
            </h1>

            <p class="mt-6 max-w-xl text-lg leading-8 text-green-800">
                Sieh Temperatur, Feuchtigkeit und Zustand deiner BioBox
                in Echtzeit, ganz ohne Seite neu zu laden.
            </p>

            <a
                href="/dashboard"
                class="mt-8 inline-block rounded-full bg-green-900 px-6 py-3 font-semibold text-white hover:bg-green-800"
            >
                Jetzt starten →
            </a>

			<div class="mt-10 grid max-w-lg grid-cols-3 gap-3">
				<div class="rounded-xl bg-lime-100 p-4">
					<p class="text-3xl font-semibold text-green-950">Live</p>
					<p class="mt-1 text-sm text-green-800">Messwerte</p>
				</div>

				<div class="rounded-xl bg-lime-100 p-4">
					<p class="text-3xl font-semibold text-green-950">24 Std.</p>
					<p class="mt-1 text-sm text-green-800">Verlauf</p>
				</div>

				<div class="rounded-xl bg-lime-100 p-4">
					<p class="text-3xl font-semibold text-green-950">4</p>
					<p class="mt-1 text-sm text-green-800">Sensoren</p>
				</div>
			</div>

        </div>

        <div class="relative min-h-[420px] overflow-hidden rounded-2xl bg-green-100">

			<div class="absolute bottom-0 left-0 h-40 w-full rounded-t-[50%] bg-green-700"></div>

			<div class="absolute bottom-16 left-0 h-40 w-full rounded-t-[50%] bg-green-500"></div>

			<div class="absolute bottom-32 left-0 h-40 w-full rounded-t-[50%] bg-green-300"></div>

			<div class="absolute right-12 top-10 h-24 w-24 rounded-full bg-lime-50"></div>

			<div class="absolute bottom-5 right-5 rounded-xl bg-white p-4 shadow-sm">
				<p class="text-sm text-green-700">Temperatur</p>
				<p class="text-2xl font-semibold text-green-950">22,4 °C</p>
				<p class="text-sm text-green-700">Im Zielbereich</p>
			</div>

		</div>

    </section>
</main>