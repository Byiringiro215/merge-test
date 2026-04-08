<script lang="ts">
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";
	import { page } from "$app/state";
	import { getAuthState, tryRestoreSession } from "$lib/auth/index.svelte";
	import Navigation from "$lib/components/layout/Navigation.svelte";
	import Footer from "$lib/components/layout/Footer.svelte";
	import { LoaderCircle } from "@lucide/svelte";

	let { children } = $props();

	const auth = getAuthState();

	$effect(() => {
		tryRestoreSession();
	});

	$effect(() => {
		if (!auth.isLoading && !auth.isAuthenticated) {
			goto(resolve(`/signin?redirect=${encodeURIComponent(page.url.pathname)}`));
		}
	});
</script>

{#if auth.isLoading}
	<div class="flex min-h-screen items-center justify-center bg-white">
		<LoaderCircle class="h-8 w-8 animate-spin text-primary" />
	</div>
{:else if auth.isAuthenticated}
	<div class="flex min-h-screen flex-col bg-white">
		<Navigation />
		<main class="flex-1">
			{@render children()}
		</main>
		<Footer />
	</div>
{/if}
