<script lang="ts">
	import Chat from '$lib/components/Chat.svelte';
	import Subject from '$lib/components/Subject.svelte';
	import { subjects } from '$lib/shared-data.svelte';

	let { data } = $props();
	if (subjects.length === 0) {
		subjects.push(...data.subjects);
	}
</script>

<div class="grid h-full grid-cols-2 grid-rows-[auto_1fr] gap-4">
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
</div>
