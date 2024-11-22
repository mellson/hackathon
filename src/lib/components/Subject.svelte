<script lang="ts">
	import { getBrowserId } from '$lib/device-utils';
	import type { InsertSubject } from '$lib/server/db/schema';
	import { subjects } from '$lib/shared-data.svelte';
	import NumberFlow, { type Format } from '@number-flow/svelte';
	import clsx from 'clsx/lite';
	import { Heart } from 'lucide-svelte';

	let {
		subject,
		editable = false,
		resetAfterCreate = false
	}: {
		subject: {
			name: string;
			description: string;
			emoji: string;
			id?: number;
			likes?: number;
			deviceIds?: string[];
		};
		editable?: boolean;
		resetAfterCreate?: boolean;
	} = $props();

	let internalSubject = $state(subject);
	let canBeEdited = $state(editable);
	let numberOfLikes = $state(subject.likes ?? 0);
	let liked = $state(subject.deviceIds?.includes(getBrowserId() ?? '') ?? false);
	let isLoading = $state(false);
	let isCreatingSubject = $state(false);

	const format: Format = {
		notation: 'compact',
		compactDisplay: 'short',
		roundingMode: 'trunc'
	};

	async function createSubject(subject: InsertSubject) {
		isCreatingSubject = true;
		canBeEdited = false;
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
			if (resetAfterCreate) {
				canBeEdited = true;
				internalSubject = {
					name: '',
					description: '',
					emoji: ''
				};
			}
		}
	}

	async function onlike() {
		const browserId = getBrowserId();
		if (!browserId || !internalSubject.id || isLoading) return;

		liked = true;
		numberOfLikes++;
		isLoading = true;
		try {
			const response = await fetch(`/api/subjects/${internalSubject.id}/like`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ browserId })
			});

			if (!response.ok) throw new Error('Failed to like subject');

			await response.json();
		} catch (error) {
			console.error('Error liking subject:', error);
		} finally {
			isLoading = false;
		}
	}
</script>

<div
	class="rounded-md bg-teal-100 p-4 text-black hover:bg-teal-200 hover:shadow-lg"
	class:bg-yellow-100={canBeEdited}
	class:hover:bg-yellow-200={canBeEdited}
>
	<div class="grid grid-cols-[1fr_auto]">
		<input
			bind:value={internalSubject.name}
			placeholder="Navn..."
			class="w-full border-none bg-transparent p-0 text-lg font-bold"
			class:focus:ring-0={!canBeEdited}
			readonly={!canBeEdited}
		/>
		<p class="text-xl">{internalSubject.emoji}</p>
	</div>
	<textarea
		bind:value={internalSubject.description}
		placeholder="Beskrivelse..."
		class="autosizer w-full border-none bg-transparent p-0 text-sm"
		class:focus:ring-0={!canBeEdited}
		class:resize-none={!canBeEdited}
		readonly={!canBeEdited}
		rows="3"
	></textarea>
	{#if internalSubject.likes !== undefined}
		<button
			class="group float-end flex items-center gap-1.5 pr-1.5 transition-[color] hover:text-pink-500"
			class:text-pink-500={liked}
			onclick={onlike}
		>
			<div
				class="relative before:absolute before:-inset-2.5 before:rounded-full before:transition-[background-color] before:group-hover:bg-pink-500/10"
			>
				<Heart
					absoluteStrokeWidth
					class={clsx(
						liked && 'fill-current',
						'~size-4/5 group-active:spring-duration-[25] spring-bounce-[65] spring-duration-300 transition-transform group-active:scale-[80%]'
					)}
				/>
			</div>
			<NumberFlow willChange continuous value={numberOfLikes} {format} />
		</button>
	{/if}
	{#if canBeEdited}
		<button
			class="float-end rounded bg-orange-400 px-2 py-1 text-xs hover:bg-orange-600 hover:shadow-lg"
			class:opacity-50={isCreatingSubject}
			onclick={() => createSubject(internalSubject)}
			disabled={isCreatingSubject}
		>
			{isCreatingSubject ? 'Opretter...' : 'Opret emne'}
		</button>
	{/if}
</div>

<style>
	.autosizer {
		field-sizing: content;
	}
</style>
