<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import { cn } from "$lib/utils";
	import { onMount } from "svelte";
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";

	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Chart title displayed in the header */
		title?: string;
		/** Chart description displayed below the title */
		description?: string;
		/** Fixed height for the chart area in pixels */
		height?: number;
		/** Whether the chart should fill available height (flex-1) */
		fillHeight?: boolean;
		/** Custom class for the card wrapper */
		cardClass?: string;
		/** Custom class for the header */
		headerClass?: string;
		/** Custom class for the content area */
		contentClass?: string;
		/** Custom class for the chart container */
		chartClass?: string;
		/** Hide the card wrapper and show just the chart */
		bare?: boolean;
		/** Callback when container resizes - receives (container, width, height) */
		onResize?: (
			container: HTMLDivElement,
			width: number,
			height: number,
		) => void;
		/** Slot for header actions (e.g., filters, buttons) */
		action?: Snippet;
		/** Slot for the legend */
		legend?: Snippet;
		/** Default slot for additional chart content */
		children?: Snippet;
	}

	let {
		title,
		description,
		height,
		fillHeight = false,
		cardClass,
		headerClass,
		contentClass,
		chartClass,
		bare = false,
		onResize,
		action,
		legend,
		children,
		class: className,
		...restProps
	}: Props = $props();

	// Reactive dimensions
	let containerWidth = $state(0);
	let containerHeight = $state(0);
	let chartContainer = $state<HTMLDivElement>();

	// Tooltip state (exposed for charts to use)
	let tooltipText = $state("");
	let tooltipX = $state(0);
	let tooltipY = $state(0);
	let tooltipVisible = $state(false);

	export function showTooltip(event: MouseEvent, text: string) {
		tooltipText = text;
		tooltipX = event.offsetX + 10;
		tooltipY = event.offsetY - 30;
		tooltipVisible = true;
	}

	export function hideTooltip() {
		tooltipVisible = false;
	}

	export function getTooltipState() {
		return {
			text: tooltipText,
			x: tooltipX,
			y: tooltipY,
			visible: tooltipVisible,
		};
	}

	export function getContainer() {
		return chartContainer;
	}

	export function getDimensions() {
		return { width: containerWidth, height: containerHeight };
	}

	onMount(() => {
		const resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				containerWidth = entry.contentRect.width;
				containerHeight = entry.contentRect.height;
				if (chartContainer && onResize) {
					onResize(chartContainer, containerWidth, containerHeight);
				}
			}
		});

		if (chartContainer) {
			resizeObserver.observe(chartContainer);
		}

		return () => resizeObserver.disconnect();
	});

	// Also call onResize when dependencies change via effect
	$effect(() => {
		if (chartContainer && containerWidth > 0 && onResize) {
			onResize(chartContainer, containerWidth, containerHeight);
		}
	});
</script>

{#if bare}
	<!-- just the chart without card wrapper -->
	<div
		class={cn("flex flex-col", fillHeight && "h-full", className)}
		{...restProps}
	>
		{#if title || description}
			<div class="mb-4">
				{#if title}
					<h3 class="text-lg font-semibold text-primary-black">
						{title}
					</h3>
				{/if}
				{#if description}
					<p class="text-sm text-gray-500 mt-1">{description}</p>
				{/if}
			</div>
		{/if}

		<div class={cn("relative", fillHeight ? "flex-1" : "", chartClass)}>
			<div
				bind:this={chartContainer}
				class="w-full"
				style={height
					? `height: ${height}px;`
					: fillHeight
						? "height: 100%;"
						: ""}
			>
				{@render children?.()}
			</div>

			<!-- Tooltip -->
			<div
				class="pointer-events-none absolute z-20 rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg transition-opacity duration-150"
				style="opacity: {tooltipVisible
					? 1
					: 0}; left: {tooltipX}px; top: {tooltipY}px; transform: translate(0, -100%);"
			>
				{tooltipText}
				<div
					class="absolute left-2 top-full border-4 border-transparent border-t-gray-900"
				></div>
			</div>
		</div>

		{#if legend}
			<div class="mt-4">
				{@render legend()}
			</div>
		{/if}
	</div>
{:else}
	<!-- wrapped in card component -->
	<Card class={cn("h-full shadow-none bg-transparent", cardClass)}>
		{#if title || description || action}
			<CardHeader class={cn("px-0 pb-3 pt-0", headerClass)}>
				<div class="flex items-start justify-between gap-4">
					<div class="flex-1">
						{#if title}
							<CardTitle class="text-base font-bold text-gray-900"
								>{title}</CardTitle
							>
						{/if}
						{#if description}
							<CardDescription class="text-sm text-gray-500"
								>{description}</CardDescription
							>
						{/if}
					</div>
					{#if action}
						<div class="shrink-0">
							{@render action()}
						</div>
					{/if}
				</div>
			</CardHeader>
		{/if}

		<CardContent class={cn("px-0 pb-0 pt-0", contentClass)}>
			<div class={cn("relative", fillHeight ? "flex-1" : "", chartClass)}>
				<div
					bind:this={chartContainer}
					class="w-full"
					style={height
						? `height: ${height}px;`
						: fillHeight
							? "height: 100%;"
							: ""}
				>
					{@render children?.()}
				</div>

				<!-- Tooltip -->
				<div
					class="pointer-events-none absolute z-20 rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg transition-opacity duration-150"
					style="opacity: {tooltipVisible
						? 1
						: 0}; left: {tooltipX}px; top: {tooltipY}px; transform: translate(0, -100%);"
				>
					{tooltipText}
					<div
						class="absolute left-2 top-full border-4 border-transparent border-t-gray-900"
					></div>
				</div>
			</div>

			{#if legend}
				<div
					class="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-4"
				>
					{@render legend()}
				</div>
			{/if}
		</CardContent>
	</Card>
{/if}
