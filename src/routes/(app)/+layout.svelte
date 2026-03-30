<script lang="ts">
	import Navigation from "$lib/components/layout/Navigation.svelte";
	import Footer from "$lib/components/layout/Footer.svelte";

	let { children } = $props();
</script>

<div class="flex min-h-screen flex-col bg-white">
	<Navigation />
	<main class="flex-1">
		{@render children()}
	</main>
	<Footer />
</div>
