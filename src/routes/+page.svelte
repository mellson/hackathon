<script lang="ts">
	import Chat from '$lib/components/Chat.svelte';
	import Subject from '$lib/components/Subject.svelte';
	import { subjects } from '$lib/shared-data.svelte';
	import { GithubIcon } from 'lucide-svelte';

	let { data } = $props();
	// Always update subjects with the latest data from the server
	subjects.length = 0; // Clear the array
	subjects.push(...data.subjects);
</script>

<div class="grid h-full grid-cols-2 grid-rows-[1fr_auto_auto] gap-4">
	<Chat />

	<div class="grid h-full grid-rows-[1fr_auto] gap-4 overflow-hidden">
		<div class="flex flex-col gap-2 overflow-y-auto">
			{#each subjects as subject (subject.id)}
				<Subject {subject} />
			{/each}
		</div>
		<Subject
			subject={{
				description: '',
				emoji: '',
				name: ''
			}}
			editable
			resetAfterCreate
		/>
	</div>
	<div
		class="col-span-2 flex items-center justify-end gap-2 text-xs font-thin text-white transition-all hover:text-teal-400"
	>
		<GithubIcon color="white" size={16} />
		<a href="https://github.com/mellson/hackathon" target="_blank"
			>https://github.com/mellson/hackathon</a
		>
	</div>
</div>
