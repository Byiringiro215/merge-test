<script lang="ts">
	import { Select as SelectPrimitive } from "bits-ui";
	import { cn } from "$lib/utils";
	import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";

	type Props = SelectPrimitive.TriggerProps;

	let { class: className, children, ...restProps }: Props = $props();
</script>

<SelectPrimitive.Trigger
	class={cn(
		"flex h-10 w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
		className,
	)}
	{...restProps}
>
	{@render children?.()}
	<ChevronDownIcon class="h-4 w-4 opacity-50 shrink-0 ml-2" />
</SelectPrimitive.Trigger>
