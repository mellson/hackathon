<svelte:head>
	<title>Hack dit login</title>
</svelte:head>

<div class="flex h-screen flex-col items-center justify-center gap-2">
	<div class="text-center text-2xl text-white">Velkommen til Energinet hackathon 2025</div>
	<p class="text-center text-gray-400">Indtast din hemmelige kode for at logge ind.</p>
	<form method="POST" class="mx-16 w-full rounded-md bg-teal-700 p-2 text-white">
		<input
			autofocus
			type="password"
			name="password"
			placeholder="Indtast din hemmelige kode"
			class="w-full border-none bg-transparent text-lg placeholder:text-teal-300 focus:ring-0"
		/>
	</form>
	<p class="text-center text-xs text-gray-400">ps. Siden her fungerer kun i Chrome og Edge.</p>
</div>
