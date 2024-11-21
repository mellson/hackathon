<script lang="ts">
	import type { SelectSubject } from '$lib/server/db/schema';

	export let subject: SelectSubject & { likes: number };
</script>

<div class="max-h-64 rounded-md bg-teal-100 p-4 hover:bg-teal-200 hover:shadow-lg">
	<div class="flex items-center justify-between text-2xl">
		<p class="font-bold">{subject.name}</p>
		<p class="">{subject.emoji}</p>
	</div>
	<p>{subject.description}</p>
	<p>{subject.likes}</p>
</div>
