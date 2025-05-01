<script lang="ts">
	import { formatRole } from '$lib/utils/format';
	import { parseToolResult } from '$lib/utils/parse-tool-result';
	import { Chat } from '@ai-sdk/svelte';
	import { tick } from 'svelte';
	import TerminalIcon from './icons/TerminalIcon.svelte';
	import Subject from './Subject.svelte';

	const chat = new Chat({ api: '/api/chat' });

	let messagesContainer: HTMLUListElement;
	let isLoading = $derived(chat.status !== 'ready');

	async function updateChat() {
		await tick(); // Wait for DOM update
		if (!isLoading) {
			if (chat.messages.length === 0) {
				chat.input = 'Kan du fortælle mig lidt mere om hackathon dagen?';
				chat.handleSubmit();
			} else {
				console.log('Scrolling to bottom');
				messagesContainer?.scrollTo({
					top: messagesContainer.scrollHeight,
					behavior: 'smooth'
				});
			}
		}
	}

	$effect(() => {
		updateChat();
	});
</script>

<div class="grid h-full grid-rows-[1fr_auto] gap-2 overflow-y-auto">
	<ul
		bind:this={messagesContainer}
		class="flex h-full flex-col gap-1 overflow-y-auto pr-2 text-white"
	>
		{#each chat.messages as message}<!-- Add else block for when there are parts -->
			<li class="flex flex-col" class:text-gray-400={message.role === 'user'}>
				<span class="text-xs font-thin opacity-50">{formatRole(message.role)}</span>
				{#each message.parts as part}
					{#if part.type === 'text'}
						<span>{@html part.text}</span>
					{/if}
				{/each}

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
		onsubmit={chat.handleSubmit}
		class="grid w-full grid-cols-[1fr_auto] items-center gap-2 rounded-md bg-teal-700 p-1 text-white"
	>
		<input
			bind:value={chat.input}
			placeholder="Chat med strømbot..."
			class="border-none bg-transparent px-4 py-2 text-lg placeholder:text-teal-300 focus:ring-0"
		/>

		<TerminalIcon
			classes={`text-teal-300 transition-opacity duration-500 ${isLoading ? 'opacity-100' : 'opacity-0'}`}
			isHovered={isLoading}
		/>
	</form>
</div>
