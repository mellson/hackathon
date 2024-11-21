<script lang="ts">
	import { formatRole } from '$lib/utils/format';
	import { useChat } from '@ai-sdk/svelte';
	import TerminalIcon from './icons/TerminalIcon.svelte';

	const { input, handleSubmit, messages, isLoading } = useChat();
	console.log(isLoading);
</script>

<div class="grid h-full grid-rows-[1fr_auto] p-4">
	<ul class="flex flex-col gap-1 text-white">
		{#each $messages as message}
			<li class="flex flex-col" class:text-gray-400={message.role === 'user'}>
				<span class="text-xs font-thin opacity-50">{formatRole(message.role)}</span>
				<span>{@html message.content}</span>
			</li>
		{/each}
	</ul>
	<form
		on:submit={handleSubmit}
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

		<button type="submit" hidden disabled={$isLoading}>Send</button>
	</form>
</div>
