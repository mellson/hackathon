<svelte:head>
	<title>Hack dit login</title>
</svelte:head>

<form method="POST" class="flex h-screen items-center justify-center gap-4">
	<input
		autofocus
		type="password"
		name="password"
		placeholder="Hemmelig kode"
		class="rounded-md border border-gray-300 p-2"
	/>
	<button type="submit" class="rounded-md bg-teal-500 px-4 py-2 text-white">Luk mig ind</button>
</form>
