<script>
	import Chat from '$lib/components/Chat.svelte';
	import Subject from '$lib/components/Subject.svelte';

	export let data;
</script>

<div class="grid h-full grid-cols-2 grid-rows-[auto_1fr] gap-4">
	<p>Info om Hackathon</p>
	<p>Det bliver godt</p>
	<Chat />

	<div class="grid grid-cols-2">
		{#each data.subjects as subject}
			<Subject {subject} />
		{/each}
	</div>
</div>
