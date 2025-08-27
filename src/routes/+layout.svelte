<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<title>Hackathon emner</title>
</svelte:head>

<main class="container mx-auto h-screen max-w-6xl p-4">
	{@render children()}
</main>
