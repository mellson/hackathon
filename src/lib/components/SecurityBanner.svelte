<script lang="ts">
	import { onMount } from 'svelte';

	const STORAGE_KEY = 'security-banner-seen-v1';

	let isClient = false;
	let shouldShow = false;

	onMount(() => {
		isClient = true;

		try {
			const storedValue = localStorage.getItem(STORAGE_KEY);
			const hasSeenBanner = storedValue === 'true';

			console.info('[SecurityBanner] localStorage lookup', {
				key: STORAGE_KEY,
				storedValue,
				hasSeenBanner
			});

			shouldShow = !hasSeenBanner;
		} catch (error) {
			console.error('[SecurityBanner] Failed to read from localStorage', error);
			shouldShow = true;
		}
	});

	function acknowledge() {
		try {
			localStorage.setItem(STORAGE_KEY, 'true');
			console.info('[SecurityBanner] Banner acknowledged and stored', { key: STORAGE_KEY });
		} catch (error) {
			console.error('[SecurityBanner] Failed to store acknowledgement', error);
			// Still hide the banner to avoid blocking the UI
		}

		shouldShow = false;
	}
</script>

{#if isClient && shouldShow}
	<div class="pointer-events-none fixed right-0 bottom-4 left-0 z-50 flex justify-center px-4">
		<div
			class="pointer-events-auto flex max-w-3xl flex-col gap-3 rounded-xl border border-white/10 bg-slate-900/95 p-4 text-sm text-white shadow-2xl shadow-black/40 backdrop-blur"
		>
			<div>
				<div class="text-base font-semibold text-teal-200">⚠️ Sikkerhedsmeddelelse ⚠️</div>
				<p class="text-white/80">
					Del ikke systemnavne, interne servere, software, konfigurationer eller fortrolige
					dokumenter når du snakker med Strømbot eller opretter emner.
				</p>
			</div>
			<div class="flex flex-wrap items-center gap-3">
				<button
					type="button"
					class="rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-teal-400"
					on:click={acknowledge}
				>
					Acceptér og fortsæt
				</button>
			</div>
		</div>
	</div>
{/if}
