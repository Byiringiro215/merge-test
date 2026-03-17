<script lang="ts">
	import { select, pie, arc, interpolate } from "d3";
	import type { PieArcDatum } from "d3";
	import { onMount } from "svelte";
	import type { DistrictDistributionData } from "./types.js";
	import { DISTRICT_COLORS } from "./types.js";

	interface Props {
		data?: DistrictDistributionData[];
	}

	const defaultData: DistrictDistributionData[] = [
		{
			district: "Kicukiro",
			value: 4494,
			percentage: 35,
			color: DISTRICT_COLORS.Kicukiro,
		},
		{
			district: "Nyamagabe",
			value: 1926,
			percentage: 15,
			color: DISTRICT_COLORS.Nyamagabe,
		},
		{
			district: "Rubavu",
			value: 2568,
			percentage: 20,
			color: DISTRICT_COLORS.Rubavu,
		},
		{
			district: "Ngororero",
			value: 1284,
			percentage: 10,
			color: DISTRICT_COLORS.Ngororero,
		},
		{
			district: "Gasabo",
			value: 2568,
			percentage: 20,
			color: DISTRICT_COLORS.Gasabo,
		},
	];

	let { data = defaultData }: Props = $props();

	let chartContainer: HTMLDivElement;
	let containerWidth = $state(0);
	let containerHeight = $state(0);
	let tooltipText = $state("");
	let tooltipX = $state(0);
	let tooltipY = $state(0);
	let tooltipVisible = $state(false);

	function createChart() {
		if (!chartContainer || containerWidth === 0 || containerHeight === 0)
			return;

		select(chartContainer).selectAll("*").remove();

		// Limit the max size of the donut chart
		const maxRadius = 100;
		const chartSize = Math.min(containerWidth, containerHeight);
		const radius = Math.min(chartSize / 2, maxRadius);
		const innerRadius = radius * 0.78;

		const svg = select(chartContainer)
			.append("svg")
			.attr("width", containerWidth)
			.attr("height", containerHeight);

		const g = svg
			.append("g")
			.attr(
				"transform",
				`translate(${containerWidth / 2},${containerHeight / 2})`,
			);

		// Create pie generator
		const pieGenerator = pie<DistrictDistributionData>()
			.value((d) => d.value)
			.sort(null)
			.padAngle(0.05);

		// Create arc generator
		const arcGenerator = arc<PieArcDatum<DistrictDistributionData>>()
			.innerRadius(innerRadius)
			.outerRadius(radius);

		// Create hover arc (slightly larger)
		const hoverArc = arc<PieArcDatum<DistrictDistributionData>>()
			.innerRadius(innerRadius)
			.outerRadius(radius + 8); // 8px larger on hover

		// Draw arcs
		const arcs = g
			.selectAll<
				SVGPathElement,
				PieArcDatum<DistrictDistributionData>
			>(".arc")
			.data(pieGenerator(data))
			.enter()
			.append("path")
			.attr("class", "arc")
			.attr("fill", (d) => d.data.color)
			.style("cursor", "pointer")
			.attr("d", arcGenerator);

		// Animate arcs
		arcs.transition()
			.duration(800)
			.attrTween("d", function (d) {
				const angleInterpolate = interpolate(
					{ startAngle: 0, endAngle: 0 },
					d,
				);
				return function (t) {
					return arcGenerator(angleInterpolate(t)) || "";
				};
			});

		// Hover effects
		arcs.on(
			"mouseenter",
			function (
				this: SVGPathElement,
				event: MouseEvent,
				d: PieArcDatum<DistrictDistributionData>,
			) {
				select(this)
					.transition()
					.duration(200)
					.attr("d", hoverArc as unknown as string);

				showTooltip(
					event,
					`${d.data.district}: ${d.data.value.toLocaleString()} (${d.data.percentage}%)`,
				);
			},
		)
			.on(
				"mousemove",
				function (
					this: SVGPathElement,
					event: MouseEvent,
					d: PieArcDatum<DistrictDistributionData>,
				) {
					showTooltip(
						event,
						`${d.data.district}: ${d.data.value.toLocaleString()} (${d.data.percentage}%)`,
					);
				},
			)
			.on("mouseleave", function (this: SVGPathElement) {
				select(this)
					.transition()
					.duration(200)
					.attr("d", arcGenerator as unknown as string);

				hideTooltip();
			});
	}

	function showTooltip(event: MouseEvent, text: string) {
		tooltipText = text;
		tooltipX = event.offsetX + 10;
		tooltipY = event.offsetY - 30;
		tooltipVisible = true;
	}

	function hideTooltip() {
		tooltipVisible = false;
	}

	onMount(() => {
		const resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				containerWidth = entry.contentRect.width;
				containerHeight = entry.contentRect.height;
				createChart();
			}
		});

		if (chartContainer) {
			resizeObserver.observe(chartContainer);
		}

		return () => resizeObserver.disconnect();
	});

	$effect(() => {
		if (containerWidth > 0 && containerHeight > 0) {
			createChart();
		}
	});
</script>

<div class="flex flex-col h-full">
	<!-- Header with color squares -->
	<div class="flex items-start justify-between mb-4">
		<div>
			<h3 class="text-lg font-semibold text-primary-black">
				District Distribution
			</h3>
			<p class="text-sm text-gray-500 mt-1">
				Enrollment spread across key high school districts.
			</p>
		</div>
	</div>

	<!-- Chart container - takes remaining space -->
	<div class="relative flex-1 min-h-0">
		<div bind:this={chartContainer} class="w-full h-full"></div>

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
	<!-- Small color squares legend -->
	<div class="flex items-center justify-center gap-4">
		{#each data as item, i (i)}
			<div
				class="h-1.5 w-1.5"
				style="background-color: {item.color}"
			></div>
		{/each}
	</div>
	<!-- Legend - 2 columns -->
	<div class="grid grid-cols-3 gap-x-6 gap-y-2 mt-4 pt-2">
		{#each data as item, i (i)}
			<div class="flex items-center gap-2">
				<div
					class="h-1.5 w-1.5 rounded-full shrink-0"
					style="background-color: {item.color}"
				></div>
				<span
					class="text-xs font-normal leading-4 sm:leading-3 text-gray-600"
					>{item.district} ({item.percentage}%)</span
				>
			</div>
		{/each}
	</div>
</div>
