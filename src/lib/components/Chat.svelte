<script lang="ts">
	import { formatRole } from '$lib/utils/format';
	import { parseToolResult } from '$lib/utils/parse-tool-result';
	import { Chat } from '@ai-sdk/svelte';
	import { DefaultChatTransport, isToolOrDynamicToolUIPart } from 'ai';
	import { tick } from 'svelte';
	import { fade } from 'svelte/transition';
	import TerminalIcon from './icons/TerminalIcon.svelte';
	import Subject from './Subject.svelte';

	const chat = new Chat({
		transport: new DefaultChatTransport({ api: '/api/chat' })
	});

	let messagesContainer: HTMLUListElement;
	let inputElement: HTMLInputElement;
	let isLoading = $derived(chat.status !== 'ready');
	let showReloadButton = $state(false);
	let loadingStartTime = $state(0);

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

	// Handle initial message setup after hydration
	$effect(() => {
		if (typeof window !== 'undefined' && chat.messages.length === 0) {
			chat.sendMessage({ text: 'Kan du fortælle mig lidt mere om hackathon dagen?' });
		}
	});

	// Auto-focus input field after mount and when not loading
	$effect(() => {
		if (typeof window !== 'undefined' && inputElement && !isLoading) {
			inputElement.focus();
		}
	});

	// Track loading state and show reload button if stuck
	$effect(() => {
		if (isLoading && chat.messages.length < 2) {
			if (loadingStartTime === 0) {
				loadingStartTime = Date.now();
			}

			const timer = setTimeout(() => {
				if (isLoading) {
					showReloadButton = true;
				}
			}, 5000);

			return () => clearTimeout(timer);
		} else {
			loadingStartTime = 0;
			showReloadButton = false;
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

		<!-- AI Thinking/Loading Indicator -->
		{#if isLoading}
			<li class="flex flex-col" transition:fade>
				<div class="flex items-center gap-2 py-2">
					<div
						class="flex h-8 w-8 animate-pulse items-center justify-center rounded-full bg-teal-600"
					>
						<svg class="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
							<circle
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
								class="opacity-25"
							></circle>
							<path
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								class="opacity-75"
							></path>
						</svg>
					</div>
					<div class="flex items-center gap-2">
						<div class="font-medium text-teal-200">Strømbot tænker</div>
						<div class="flex items-center gap-1">
							<div
								class="h-2 w-2 animate-bounce rounded-full bg-teal-400 [animation-delay:0ms]"
							></div>
							<div
								class="h-2 w-2 animate-bounce rounded-full bg-teal-400 [animation-delay:150ms]"
							></div>
							<div
								class="h-2 w-2 animate-bounce rounded-full bg-teal-400 [animation-delay:300ms]"
							></div>
						</div>
					</div>
				</div>
			</li>
		{/if}

		<!-- Reload Button for Stuck Loading -->
		{#if showReloadButton}
			<li class="flex flex-col items-center py-4" transition:fade>
				<div class="text-center">
					<p class="mb-2 text-sm text-red-300">Noget gik galt...</p>
					<button
						onclick={() => window.location.reload()}
						class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
					>
						Genindlæs siden
					</button>
				</div>
			</li>
		{/if}
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
			bind:this={inputElement}
			name="message"
			placeholder="Chat med strømbot..."
			disabled={isLoading}
			class="border-none bg-transparent px-4 py-2 text-lg placeholder:text-teal-300 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
		/>

		<TerminalIcon
			classes={`text-teal-300 transition-opacity duration-500 ${isLoading ? 'opacity-100' : 'opacity-0'}`}
			isHovered={isLoading}
		/>
	</form>
</div>
