<script>
  import * as m from '$lib/paraglide/messages.js';
  import { getLocale, setLocale } from '$lib/paraglide/runtime.js';
</script>

<div
  class="relative inline-flex h-10 shrink-0 items-center gap-1.5 rounded-sm
         px-1.5 text-[#B5C6BA] transition-colors hover:text-white
         focus-within:outline-2 focus-within:outline-offset-2
         focus-within:outline-[#A9C4B0]"
>
  <!-- Globe -->
  <svg
    xmlns="http://www.w3.org/2000/svg"
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

  <span class="text-xs font-semibold uppercase tracking-wide" aria-hidden="true">
    {getLocale()}
  </span>

  <!-- The native select covers the icon and code, so both are clickable. -->
  <select
    aria-label={m.language()}
    title={m.language()}
    value={getLocale()}
    onchange={(event) => setLocale(event.currentTarget.value)}
    class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
  >
    <option value="de" lang="de">Deutsch</option>
    <option value="en" lang="en">English</option>
    <option value="sq" lang="sq">Shqip</option>
  </select>
</div>