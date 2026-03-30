<script lang="ts">
	import type { Component } from "svelte";
	import { Card } from "$lib/components/ui/card";

	interface Props {
		title: string;
		value: string | number;
		change?: string;
		changeType?: "positive" | "negative" | "neutral" | "targeted";
		icon: Component;
	}

	let {
		title,
		value,
		change,
		changeType = "neutral",
		icon: Icon,
	}: Props = $props();

	const changeColors = {
		positive: "text-green-600",
		negative: "text-red-600",
		neutral: "text-blue-600",
		targeted: "text-green-600",
	};

	const changeBgColors = {
		positive: "bg-green-50",
		negative: "bg-red-50",
		neutral: "bg-blue-50",
		targeted: "bg-green-50",
	};
</script>

<Card class="p-5">
	<div class="flex items-start justify-between">
		<div
			class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"
		>
			<Icon class="h-5 w-5 text-blue-800 font-bold" />
		</div>
		{#if change}
			<span
				class="rounded-full px-2 py-0.5 text-xs font-medium {changeColors[
					changeType
				]} {changeBgColors[changeType]}"
			>
				{change}
			</span>
		{/if}
	</div>
	<div class="mt-4">
		<p class="text-2xl font-bold text-gray-900">{value}</p>
		<p class="mt-1 text-sm text-gray-500">{title}</p>
	</div>
</Card>
