<script lang="ts">
	import type { Snippet } from "svelte";
	import { checkPermission } from "$lib/auth/index.svelte";

	let {
		resource,
		action,
		children,
		loading,
		denied,
	}: {
		resource: string;
		action: string;
		children: Snippet;
		loading?: Snippet;
		denied?: Snippet;
	} = $props();

	let state = $state<"loading" | "allowed" | "denied">("loading");

	$effect(() => {
		state = "loading";
		checkPermission(resource, action).then((allowed) => {
			state = allowed ? "allowed" : "denied";
		});
	});
</script>

{#if state === "loading"}
	{@render loading?.()}
{:else if state === "denied"}
	{@render denied?.()}
{:else}
	{@render children()}
{/if}
