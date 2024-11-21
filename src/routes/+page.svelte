<script lang="ts">
	import Chat from '$lib/components/Chat.svelte';
	import Subject from '$lib/components/Subject.svelte';
	import { subjects } from '$lib/shared-data.svelte';

	let { data } = $props();
	subjects.push(...data.subjects);
</script>

<div class="grid h-full grid-cols-2 grid-rows-[auto_1fr] gap-4">
	<p class="text-white">
		Hackathon 2025, 17. januar. Chat med Strømbot her for at få svar på spørgsmål
	</p>
	<p class="text-white">Se og stem på emner herunder, og opret dine egne</p>
	<Chat />

	<div class="flex flex-col gap-2">
		{#each subjects as subject}
			<Subject {subject} />
		{/each}
	</div>
</div>
