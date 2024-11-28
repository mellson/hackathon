<script lang="ts">
	import { formatRole } from '$lib/utils/format';
	import { parseToolResult } from '$lib/utils/parse-tool-result';
	import { useChat } from '@ai-sdk/svelte';
	import { afterUpdate } from 'svelte';
	import TerminalIcon from './icons/TerminalIcon.svelte';
	import Subject from './Subject.svelte';

	const { input, handleSubmit, messages, isLoading } = useChat();

	let messagesContainer: HTMLUListElement;

	afterUpdate(() => {
		if ($messages.length === 0) {
			input.set('Kan du fortælle mig lidt mere om hackathon dagen?');
			handleSubmit();
		}
		if ($messages.length > 0) {
			messagesContainer?.scrollTo({
				top: messagesContainer.scrollHeight,
				behavior: 'smooth'
			});
		}
	});
</script>

<div class="grid h-full grid-rows-[1fr_auto] gap-2 overflow-y-auto">
	<ul
		bind:this={messagesContainer}
		class="flex h-full flex-col gap-1 overflow-y-auto pr-2 text-white"
	>
		{#each $messages as message}
			<li class="flex flex-col" class:text-gray-400={message.role === 'user'}>
				<span class="text-xs font-thin opacity-50">{formatRole(message.role)}</span>
				<span>{@html message.content}</span>
				{#if message.toolInvocations}
					{@const subject = parseToolResult(message.toolInvocations)}
					{#if subject}
						<div class="flex flex-col gap-2 pt-2">
							<Subject {subject} editable={true} />
							<p class="text-xs">Du kan redigere emnet inden du opretter</p>
						</div>
					{/if}
				{/if}
			</li>
		{/each}
	</ul>
	<form
		onsubmit={handleSubmit}
		class="grid w-full grid-cols-[1fr_auto] items-center gap-2 rounded-md bg-teal-700 p-1 text-white"
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
