<script lang="ts">
	import { cn } from "$lib/utils";
	import type { HTMLAttributes } from "svelte/elements";

	interface LegendItem {
		label: string;
		color: string;
	}

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Array of legend items to display */
		items: LegendItem[];
		/** Size of the color indicator: 'sm' | 'md' | 'lg' */
		size?: "sm" | "md" | "lg";
		/** Shape of the color indicator: 'circle' | 'square' */
		shape?: "circle" | "square";
		/** Layout direction */
		direction?: "horizontal" | "vertical";
	}

	let {
		items,
		size = "sm",
		shape = "circle",
		direction = "horizontal",
		class: className,
		...restProps
	}: Props = $props();

	const sizeClasses = {
		sm: "h-2.5 w-2.5",
		md: "h-3 w-3",
		lg: "h-4 w-4",
	};

	const shapeClasses = {
		circle: "rounded-full",
		square: "rounded-sm",
	};
</script>

<div
	class={cn(
		"flex items-center gap-x-6 gap-y-2",
		direction === "horizontal" ? "flex-wrap justify-center" : "flex-col items-start",
		className
	)}
	{...restProps}
>
	{#each items as item (item.label)}
		<div class="flex items-center gap-1.5">
			<div
				class={cn(sizeClasses[size], shapeClasses[shape])}
				style="background-color: {item.color}"
			></div>
			<span class="text-xs text-gray-600">{item.label}</span>
		</div>
	{/each}
</div>
