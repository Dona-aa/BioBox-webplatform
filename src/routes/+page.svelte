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

<section id="funktionen" class="bg-green-900 px-10 py-16 text-white">
    <div class="mx-auto grid max-w-7xl gap-12 lg:grid-cols-3">

        <div>
            <p class="text-sm font-semibold text-lime-300">
                // FUNKTIONEN
            </p>

            <h2 class="mt-4 text-4xl font-semibold">
                Das kann die<br />
                BioBox-Plattform
            </h2>
        </div>

        <div class="min-h-[260px] rounded-xl bg-green-100">
        </div>

        <div class="flex flex-col gap-6">

            <div class="flex gap-4">
                <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime-300 text-green-950">
                    1
                </div>

                <div>
                    <h3 class="font-semibold">Live-Werte</h3>
                    <p class="text-sm text-green-100">
                        Neue Messwerte erscheinen automatisch.
                    </p>
                </div>
            </div>

            <div class="flex gap-4">
                <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime-300 text-green-950">
                    2
                </div>

                <div>
                    <h3 class="font-semibold">Verlauf</h3>
                    <p class="text-sm text-green-100">
                        Diagramme zeigen Veränderungen über Zeit.
                    </p>
                </div>
            </div>

            <div class="flex gap-4">
                <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime-300 text-green-950">
                    3
                </div>

                <div>
                    <h3 class="font-semibold">Statusanzeigen</h3>
                    <p class="text-sm text-green-100">
                        Aktiv, inaktiv oder Warnung auf einen Blick.
                    </p>
                </div>
            </div>

            <div class="flex gap-4">
                <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime-300 text-green-950">
                    4
                </div>

                <div>
                    <h3 class="font-semibold">Eigenes Konto</h3>
                    <p class="text-sm text-green-100">
                        Anmelden, Rollen und Zugriffsrechte.
                    </p>
                </div>
            </div>

        </div>

    </div>
</section>

<section class="px-10 py-20">
    <div class="mx-auto max-w-7xl">

        <p class="text-center text-sm font-semibold text-green-700">
            // SO FUNKTIONIERT'S
        </p>

        <h2 class="mt-4 text-center text-4xl font-semibold text-green-950">
            Von der Messung zur Anzeige
        </h2>

        <div class="mt-12">

            <div class="flex items-center justify-between border-t border-green-200 py-6">
                <div class="flex gap-5">
                    <span class="font-semibold text-green-950">01</span>
                    <p class="font-semibold text-green-950">
                        Sensoren messen
                    </p>
                </div>

                <p class="text-green-700">
                    Die BioBox erfasst Werte in ihrer Umgebung.
                </p>
            </div>

            <div class="flex items-center justify-between border-t border-green-200 py-6">
                <div class="flex gap-5">
                    <span class="font-semibold text-green-950">02</span>
                    <p class="font-semibold text-green-950">
                        Daten werden gespeichert
                    </p>
                </div>

                <p class="text-green-700">
                    Das Backend speichert alles in der Datenbank.
                </p>
            </div>

            <div class="flex items-center justify-between border-y border-green-200 py-6">
                <div class="flex gap-5">
                    <span class="font-semibold text-green-950">03</span>
                    <p class="font-semibold text-green-950">
                        Du siehst es live
                    </p>
                </div>

                <p class="text-green-700">
                    Die Plattform aktualisiert sich von selbst.
                </p>
            </div>

        </div>

    </div>
</section>

<section class="px-10 pb-20">
    <div class="mx-auto max-w-7xl rounded-2xl bg-lime-100 px-8 py-14 text-center">
        <h2 class="text-4xl font-semibold text-green-950">
            Bereit für deine BioBox?
        </h2>

        <a
            href="/register"
            class="mt-8 inline-block rounded-full bg-green-900 px-6 py-3 font-semibold text-white hover:bg-green-800"
        >
            Konto erstellen →
        </a>
    </div>
</section>

<footer class="border-t border-green-100 px-10 py-8">
    <div class="mx-auto flex max-w-7xl items-center justify-between">
        <p class="font-semibold text-green-950">
            BioBox
        </p>

        <p class="text-sm text-green-700">
            © 2026 BioBox
        </p>
    </div>
</footer>