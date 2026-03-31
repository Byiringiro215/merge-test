<script lang="ts">
	import { Select as SelectPrimitive } from "bits-ui";
	import type { Snippet } from "svelte";

	interface Props {
		type?: "single" | "multiple";
		value?: string | string[];
		onValueChange?: (value: string | undefined) => void;
		children?: Snippet;
	}

	let {
		value = $bindable(),
		onValueChange,
		type = "single",
		children,
	}: Props = $props();
</script>

{#if type === "single"}
	<SelectPrimitive.Root
		type="single"
		bind:value={value as string}
		onValueChange={onValueChange as (value: string | undefined) => void}
	>
		{@render children?.()}
	</SelectPrimitive.Root>
{:else}
	<SelectPrimitive.Root
		type="multiple"
		bind:value={value as string[]}
		onValueChange={onValueChange as (value: string[] | undefined) => void}
	>
		{@render children?.()}
	</SelectPrimitive.Root>
{/if}
