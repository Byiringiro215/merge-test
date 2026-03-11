<script lang="ts">
	import { onMount } from "svelte";
	import * as d3 from "d3";
	import BarChart3Icon from "@lucide/svelte/icons/bar-chart-3";
	import type { DistributionData } from "./types.js";
	import { DISTRICTS, CHART_COLORS } from "./types.js";

	interface Props {
		data?: DistributionData[];
	}

	const defaultData: DistributionData[] = [
		{ district: "Kicukiro", active: 10, inactive: 4 },
		{ district: "Nyamagabe", active: 8, inactive: 3 },
		{ district: "Rubavu", active: 11, inactive: 2 },
		{ district: "Ngororero", active: 9, inactive: 3 },
		{ district: "Gasabo", active: 14, inactive: 2 },
	];

	let { data = defaultData }: Props = $props();

	let chartContainer: HTMLDivElement;
	let width = $state(0);
	let tooltipText = $state("");
	let tooltipX = $state(0);
	let tooltipY = $state(0);
	let tooltipVisible = $state(false);
	const height = 280;

	function createChart() {
		if (!chartContainer || width === 0) return;

		d3.select(chartContainer).selectAll("*").remove();

		const margin = { top: 20, right: 20, left: 35, bottom: 40 };
		const innerWidth = width - margin.left - margin.right;
		const innerHeight = height - margin.top - margin.bottom;

		const svg = d3
			.select(chartContainer)
			.append("svg")
			.attr("width", width)
			.attr("height", height);

		const g = svg
			.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

		// Calculate max value for Y scale
		const maxValue = Math.max(...data.map((d) => d.active + d.inactive));
		const yMax = Math.ceil(maxValue / 4) * 4 + 4; // Round up to nearest 4

		// Scales
		const xScale = d3
			.scaleBand()
			.domain(data.map((d) => d.district))
			.range([0, innerWidth])
			.padding(0.35);

		const yScale = d3.scaleLinear().domain([0, yMax]).range([innerHeight, 0]);

		// Y-axis grid lines
		const yTickValues = [0, 4, 8, 12, 16];
		g.append("g")
			.attr("class", "grid")
			.selectAll("line")
			.data(yTickValues)
			.enter()
			.append("line")
			.attr("x1", 0)
			.attr("x2", innerWidth)
			.attr("y1", (d: number) => yScale(d))
			.attr("y2", (d: number) => yScale(d))
			.attr("stroke", "#e5e7eb")
			.attr("stroke-dasharray", "4,4");

		// Draw active bars (bottom - blue)
		const activeBars = g
			.selectAll<SVGRectElement, DistributionData>(".bar-active")
			.data(data)
			.enter()
			.append("rect")
			.attr("class", "bar-active")
			.attr("x", (d: DistributionData) => xScale(d.district) || 0)
			.attr("y", innerHeight)
			.attr("width", xScale.bandwidth())
			.attr("height", 0)
			.attr("fill", CHART_COLORS.active)
			.attr("rx", 0)
			.style("cursor", "pointer");

		activeBars
			.transition()
			.duration(800)
			.delay((_: DistributionData, i: number) => i * 100)
			.attr("y", (d: DistributionData) => yScale(d.active))
			.attr("height", (d: DistributionData) => innerHeight - yScale(d.active));

		// Draw inactive bars (top - red/pink)
		const inactiveBars = g
			.selectAll<SVGRectElement, DistributionData>(".bar-inactive")
			.data(data)
			.enter()
			.append("rect")
			.attr("class", "bar-inactive")
			.attr("x", (d: DistributionData) => xScale(d.district) || 0)
			.attr("y", innerHeight)
			.attr("width", xScale.bandwidth())
			.attr("height", 0)
			.attr("fill", CHART_COLORS.inactive)
			.attr("rx", 4)
			.style("cursor", "pointer");

		inactiveBars
			.transition()
			.duration(800)
			.delay((_: DistributionData, i: number) => i * 100 + 200)
			.attr(
				"y",
				(d: DistributionData) => yScale(d.active + d.inactive),
			)
			.attr(
				"height",
				(d: DistributionData) => yScale(d.active) - yScale(d.active + d.inactive),
			);

		// Hover effects for active bars
		activeBars
			.on(
				"mouseenter",
				function (
					this: SVGRectElement,
					event: MouseEvent,
					d: DistributionData,
				) {
					d3.select(this)
						.transition()
						.duration(200)
						.attr("fill", CHART_COLORS.activeHover);
					showTooltip(event, `${d.district}: ${d.active} Active Schools`);
				},
			)
			.on(
				"mousemove",
				function (
					this: SVGRectElement,
					event: MouseEvent,
					d: DistributionData,
				) {
					showTooltip(event, `${d.district}: ${d.active} Active Schools`);
				},
			)
			.on("mouseleave", function (this: SVGRectElement) {
				d3.select(this)
					.transition()
					.duration(200)
					.attr("fill", CHART_COLORS.active);
				hideTooltip();
			});

		// Hover effects for inactive bars
		inactiveBars
			.on(
				"mouseenter",
				function (
					this: SVGRectElement,
					event: MouseEvent,
					d: DistributionData,
				) {
					d3.select(this)
						.transition()
						.duration(200)
						.attr("fill", CHART_COLORS.inactiveHover);
					showTooltip(event, `${d.district}: ${d.inactive} Inactive Schools`);
				},
			)
			.on(
				"mousemove",
				function (
					this: SVGRectElement,
					event: MouseEvent,
					d: DistributionData,
				) {
					showTooltip(event, `${d.district}: ${d.inactive} Inactive Schools`);
				},
			)
			.on("mouseleave", function (this: SVGRectElement) {
				d3.select(this)
					.transition()
					.duration(200)
					.attr("fill", CHART_COLORS.inactive);
				hideTooltip();
			});

		// X Axis
		const xAxis = g
			.append("g")
			.attr("transform", `translate(0,${innerHeight})`)
			.call(d3.axisBottom(xScale).tickSize(0));

		xAxis.select(".domain").remove();
		xAxis
			.selectAll("text")
			.attr("fill", "#6b7280")
			.attr("font-size", "12px")
			.attr("dy", "1em");

		// Y Axis
		const yAxis = g.append("g").call(
			d3
				.axisLeft(yScale)
				.tickValues(yTickValues)
				.tickFormat((d) => d.toString())
				.tickSize(0),
		);

		yAxis.select(".domain").remove();
		yAxis
			.selectAll("text")
			.attr("fill", "#6b7280")
			.attr("font-size", "12px")
			.attr("dx", "-0.5em");
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
				width = entry.contentRect.width;
				createChart();
			}
		});

		if (chartContainer) {
			resizeObserver.observe(chartContainer);
		}

		return () => resizeObserver.disconnect();
	});

	$effect(() => {
		if (width > 0) {
			createChart();
		}
	});
</script>

<div class="flex flex-col h-full">
	<div class="flex items-center gap-2 mb-4">
		<BarChart3Icon class="h-5 w-5 text-primary" />
		<h3 class="text-base font-semibold text-gray-900">Schools Distribution by District</h3>
	</div>

	<div class="relative flex-1">
		<div
			bind:this={chartContainer}
			class="w-full"
			style="height: {height}px;"
		></div>

		<!-- Tooltip -->
		<div
			class="pointer-events-none absolute z-20 rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg transition-opacity duration-150"
			style="opacity: {tooltipVisible ? 1 : 0}; left: {tooltipX}px; top: {tooltipY}px; transform: translate(0, -100%);"
		>
			{tooltipText}
			<div class="absolute left-2 top-full border-4 border-transparent border-t-gray-900"></div>
		</div>
	</div>

	<!-- Legend -->
	<div class="flex items-center justify-center gap-6 mt-4">
		<div class="flex items-center gap-2">
			<div class="h-3 w-3 rounded-full" style="background-color: {CHART_COLORS.active}"></div>
			<span class="text-sm text-gray-600">Active Schools</span>
		</div>
		<div class="flex items-center gap-2">
			<div class="h-3 w-3 rounded-full" style="background-color: {CHART_COLORS.inactive}"></div>
			<span class="text-sm text-gray-600">Inactive Schools</span>
		</div>
	</div>
</div>
