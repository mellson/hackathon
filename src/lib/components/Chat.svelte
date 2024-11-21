<script lang="ts">
	import type { InsertSubject } from '$lib/server/db/schema';
	import { subjects } from '$lib/shared-data.svelte';
	import { formatRole } from '$lib/utils/format';
	import { parseToolResult } from '$lib/utils/parse-tool-result';
	import { useChat } from '@ai-sdk/svelte';
	import TerminalIcon from './icons/TerminalIcon.svelte';
	import Subject from './Subject.svelte';

	const { input, handleSubmit, messages, isLoading } = useChat();
	let isCreatingSubject = false;

	async function createSubject(subject: InsertSubject) {
		isCreatingSubject = true;
		try {
			const response = await fetch('/api/subjects', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(subject)
			});

			if (!response.ok) throw new Error('Failed to create subject');
			const created = await response.json();
			subjects.unshift({ ...created, likes: 0 });
		} catch (error) {
			console.error('Error creating subject:', error);
			// You might want to show an error message to the user here
		} finally {
			isCreatingSubject = false;
		}
	}
</script>

<div class="grid h-full grid-rows-[1fr_auto] gap-2 overflow-y-auto p-4">
	<ul class="flex h-full flex-col gap-1 overflow-y-auto pr-2 text-white">
		{#each $messages as message}
			<li class="flex flex-col" class:text-gray-400={message.role === 'user'}>
				<span class="text-xs font-thin opacity-50">{formatRole(message.role)}</span>
				<span>{@html message.content}</span>
				{#if message.toolInvocations}
					{@const subject = parseToolResult(message.toolInvocations)}
					{#if subject}
						<div class="flex flex-col gap-2 pt-2">
							<Subject {subject} editable={true} />
							<div class="flex items-center justify-between">
								<p class="text-xs">Du kan redigere emnet inden du opretter</p>
								<button
									class="rounded bg-blue-400 px-2 py-1 text-xs hover:bg-blue-600 hover:shadow-lg"
									onclick={() => createSubject(subject)}
									class:opacity-50={isCreatingSubject}
									disabled={isCreatingSubject}
								>
									Opret emnet!
								</button>
							</div>
						</div>
					{/if}
				{/if}
			</li>
		{/each}
	</ul>
	<form
		onsubmit={handleSubmit}
		class="grid w-full grid-cols-[1fr_auto] items-center gap-2 rounded-md bg-teal-700 p-2 text-white"
	>
		<input
			bind:value={$input}
			autofocus
			placeholder="Chat med strømbot..."
			class="border-none bg-transparent text-lg placeholder:text-teal-300 focus:ring-0"
		/>

		<TerminalIcon
			classes={`text-teal-300 transition-opacity duration-500 ${$isLoading ? 'opacity-100' : 'opacity-0'}`}
			isHovered={$isLoading}
		/>
	</form>
</div>
