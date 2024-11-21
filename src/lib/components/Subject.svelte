<script lang="ts">
	import type { SelectSubject } from '$lib/server/db/schema';

	let {
		subject,
		editable = false
	}: { subject: Omit<SelectSubject, 'id'> & { likes?: number }; editable?: boolean } = $props();
</script>

<div
	class="overflow-hidden rounded-md bg-teal-100 p-4 text-black hover:bg-teal-200 hover:shadow-lg"
>
	<div class="flex items-center justify-between">
		<input
			bind:value={subject.name}
			class="w-full border-none bg-transparent p-0 text-lg font-bold"
			class:focus:ring-0={!editable}
			readonly={!editable}
		/>
		<input
			bind:value={subject.emoji}
			class="w-12 border-none bg-transparent p-0 text-right text-xl"
			class:focus:ring-0={!editable}
			readonly={!editable}
		/>
	</div>
	<textarea
		bind:value={subject.description}
		class="autosizer w-full border-none bg-transparent p-0 text-sm"
		class:focus:ring-0={!editable}
		class:resize-none={!editable}
		readonly={!editable}
		rows="3"
	></textarea>
	{#if subject.likes !== undefined}
		<p>{subject.likes}</p>
	{/if}
</div>

<style>
	.autosizer {
		field-sizing: content;
	}
</style>
