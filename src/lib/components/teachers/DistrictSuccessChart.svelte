<script lang="ts">
	import {
		Card,
		CardHeader,
		CardTitle,
		CardDescription,
		CardContent,
	} from "$lib/components/ui/card";
	import type { DistrictSuccess } from "./types.js";

	interface Props {
		data?: DistrictSuccess[];
	}

	const defaultData: DistrictSuccess[] = [
		{ district: "Kicukiro", successRate: 92 },
		{ district: "Gasabo", successRate: 89 },
		{ district: "Rubavu", successRate: 85 },
		{ district: "Nyamagabe", successRate: 82 },
		{ district: "Ngororero", successRate: 78 },
	];

	let { data = defaultData }: Props = $props();

	// Find max value for scaling
	const maxValue = $derived(Math.max(...data.map(d => d.successRate)));

	// Tooltip state
	let tooltipVisible = $state(false);
	let tooltipText = $state("");
	let tooltipX = $state(0);
	let tooltipY = $state(0);

	function showTooltip(event: MouseEvent, district: string, successRate: number) {
		const target = event.currentTarget as HTMLElement;
		const rect = target.getBoundingClientRect();
		const parentRect = target.closest('.chart-container')?.getBoundingClientRect();

		if (parentRect) {
			tooltipX = rect.left - parentRect.left + rect.width / 2;
			tooltipY = rect.top - parentRect.top - 10;
		}

		tooltipText = `${district}: ${successRate}% success rate`;
		tooltipVisible = true;
	}

	function hideTooltip() {
		tooltipVisible = false;
	}
</script>

<Card class="h-full">
	<CardHeader class="px-4 pb-2 pt-4 lg:px-6 lg:pt-5">
		<CardTitle class="text-lg font-semibold">Avg. Success by District</CardTitle>
		<CardDescription>High School performance comparison</CardDescription>
	</CardHeader>
	<CardContent class="px-4 pb-4 pt-2 lg:px-6 lg:pb-5">
		<div class="chart-container relative flex flex-col gap-4">
			<!-- Tooltip -->
			<div
				class="pointer-events-none absolute z-20 rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg transition-opacity duration-150"
				style="opacity: {tooltipVisible ? 1 : 0}; left: {tooltipX}px; top: {tooltipY}px; transform: translate(-50%, -100%);"
			>
				{tooltipText}
				<div class="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
			</div>

			{#each data as item}
				<div class="flex items-center gap-3">
					<span class="w-20 text-sm text-gray-600 text-right shrink-0">
						{item.district}
					</span>
					<div class="flex-1 h-6 bg-gray-100 rounded overflow-hidden">
						<div
							class="h-full bg-[#205fad] rounded transition-all duration-500 cursor-pointer hover:bg-[#1a4d8c]"
							style="width: {(item.successRate / 100) * 100}%;"
							onmouseenter={(e) => showTooltip(e, item.district, item.successRate)}
							onmouseleave={hideTooltip}
							role="img"
							aria-label="{item.district}: {item.successRate}% success rate"
						></div>
					</div>
				</div>
			{/each}
		</div>
	</CardContent>
</Card>
