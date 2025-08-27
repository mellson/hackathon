<script lang="ts">
	import { formatRole } from '$lib/utils/format';
	import { parseToolResult } from '$lib/utils/parse-tool-result';
	import { Chat } from '@ai-sdk/svelte';
	import { DefaultChatTransport, isToolOrDynamicToolUIPart } from 'ai';
	import { tick } from 'svelte';
	import TerminalIcon from './icons/TerminalIcon.svelte';
	import Subject from './Subject.svelte';

	const chat = new Chat({
		transport: new DefaultChatTransport({ api: '/api/chat' })
	});

	let messagesContainer: HTMLUListElement;
	let isLoading = $derived(chat.status !== 'ready');

	// Auto-scroll pattern - runs after DOM updates
	$effect(() => {
		if (!messagesContainer) return; // not yet mounted

		// Reference messages and their content so effect re-runs on changes
		const _ignoredButRequiredInEffect = chat.messages
			.flatMap((msg) => msg.parts)
			.filter((part) => part.type === 'text')
			.map((part) => part.text)
			.join('');

		// Check if we should auto-scroll (user is near bottom)
		const shouldScroll =
			messagesContainer.offsetHeight + messagesContainer.scrollTop >
			messagesContainer.scrollHeight - 50;

		if (shouldScroll) {
			// Use tick to ensure DOM is fully updated, then scroll
			tick().then(() => {
				messagesContainer.scrollTo({
					top: messagesContainer.scrollHeight,
					behavior: 'smooth'
				});
			});
		}
	});

	// Handle initial message setup
	$effect(() => {
		if (chat.messages.length === 0) {
			chat.sendMessage({ text: 'Kan du fortælle mig lidt mere om hackathon dagen?' });
		}
	});
</script>

<div class="grid h-full grid-rows-[1fr_auto] gap-2 overflow-y-auto">
	<ul
		bind:this={messagesContainer}
		class="flex h-full flex-col gap-1 overflow-y-auto pr-2 text-white"
	>
		{#each chat.messages as message, messageIndex (messageIndex)}
			<li class="flex flex-col" class:text-gray-400={message.role === 'user'}>
				<span class="text-xs font-thin opacity-50">{formatRole(message.role)}</span>
				{#each message.parts as part}
					{#if part.type === 'text'}
						<span>{@html part.text}</span>
					{/if}
				{/each}

				{#if message.parts.some((part) => isToolOrDynamicToolUIPart(part))}
					{@const subject = parseToolResult(message.parts)}
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
		onsubmit={(e) => {
			e.preventDefault();
			const formData = new FormData(e.target as HTMLFormElement);
			const text = formData.get('message') as string;
			if (text.trim()) {
				chat.sendMessage({ text });
				(e.target as HTMLFormElement).reset();
			}
		}}
		class="grid w-full grid-cols-[1fr_auto] items-center gap-2 rounded-md bg-teal-700 p-1 text-white"
	>
		<input
			name="message"
			placeholder="Chat med strømbot..."
			class="border-none bg-transparent px-4 py-2 text-lg placeholder:text-teal-300 focus:ring-0"
		/>

		<TerminalIcon
			classes={`text-teal-300 transition-opacity duration-500 ${isLoading ? 'opacity-100' : 'opacity-0'}`}
			isHovered={isLoading}
		/>
	</form>
</div>
