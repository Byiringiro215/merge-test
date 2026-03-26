<script lang="ts">
	import { ChartContainer } from "$lib/components/ui/chart-container";
	import ChartLegend from "$lib/components/ui/chart-container/chart-legend.svelte";
	import BarChart3Icon from "@lucide/svelte/icons/bar-chart-3";
	import { select, scaleBand, scaleLinear, axisBottom, axisLeft } from "d3";
	import type { DistributionData } from "./types.js";
	import { CHART_COLORS } from "./types.js";

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

	let chartContainerRef: ReturnType<typeof ChartContainer>;
	const height = 280;

	function createChart(container: HTMLDivElement, width: number) {
		if (!container || width === 0) return;

		select(container).selectAll("*").remove();

		const margin = { top: 20, right: 20, left: 35, bottom: 40 };
		const innerWidth = width - margin.left - margin.right;
		const innerHeight = height - margin.top - margin.bottom;

		const svg = select(container)
			.append("svg")
			.attr("width", width)
			.attr("height", height);

		const g = svg
			.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

		// Calculate max value for Y scale
		const maxValue = Math.max(...data.map((d) => d.active + d.inactive));
		const yMax = Math.ceil(maxValue / 4) * 4 + 4;

		// Scales
		const xScale = scaleBand()
			.domain(data.map((d) => d.district))
			.range([0, innerWidth])
			.padding(0.35);

		const yScale = scaleLinear().domain([0, yMax]).range([innerHeight, 0]);

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
			.attr(
				"height",
				(d: DistributionData) => innerHeight - yScale(d.active),
			);

		// Draw inactive bars (top - red/pink) with only top rounded corners
		const barWidth = xScale.bandwidth();
		const cornerRadius = 4;

		const inactiveBars = g
			.selectAll<SVGPathElement, DistributionData>(".bar-inactive")
			.data(data)
			.enter()
			.append("path")
			.attr("class", "bar-inactive")
			.attr("fill", CHART_COLORS.inactive)
			.style("cursor", "pointer")
			.attr("d", (d: DistributionData) => {
				const x = xScale(d.district) || 0;
				return `M${x},${innerHeight} L${x},${innerHeight} L${x + barWidth},${innerHeight} L${x + barWidth},${innerHeight} Z`;
			});

		inactiveBars
			.transition()
			.duration(800)
			.delay((_: DistributionData, i: number) => i * 100 + 200)
			.attr("d", (d: DistributionData) => {
				const x = xScale(d.district) || 0;
				const y = yScale(d.active + d.inactive);
				const h = yScale(d.active) - yScale(d.active + d.inactive);
				const bottomY = y + h;
				const r = Math.min(cornerRadius, h / 2, barWidth / 2);
				return `M${x},${bottomY}
						L${x},${y + r}
						Q${x},${y} ${x + r},${y}
						L${x + barWidth - r},${y}
						Q${x + barWidth},${y} ${x + barWidth},${y + r}
						L${x + barWidth},${bottomY} Z`;
			});

		// Hover effects for active bars
		activeBars
			.on(
				"mouseenter",
				function (
					this: SVGRectElement,
					event: MouseEvent,
					d: DistributionData,
				) {
					select(this)
						.transition()
						.duration(200)
						.attr("fill", CHART_COLORS.activeHover);
					chartContainerRef?.showTooltip(
						event,
						`${d.district}: ${d.active} Active Schools`,
					);
				},
			)
			.on(
				"mousemove",
				function (
					this: SVGRectElement,
					event: MouseEvent,
					d: DistributionData,
				) {
					chartContainerRef?.showTooltip(
						event,
						`${d.district}: ${d.active} Active Schools`,
					);
				},
			)
			.on("mouseleave", function (this: SVGRectElement) {
				select(this)
					.transition()
					.duration(200)
					.attr("fill", CHART_COLORS.active);
				chartContainerRef?.hideTooltip();
			});

		// Hover effects for inactive bars
		inactiveBars
			.on(
				"mouseenter",
				function (
					this: SVGPathElement,
					event: MouseEvent,
					d: DistributionData,
				) {
					select(this)
						.transition()
						.duration(200)
						.attr("fill", CHART_COLORS.inactiveHover);
					chartContainerRef?.showTooltip(
						event,
						`${d.district}: ${d.inactive} Inactive Schools`,
					);
				},
			)
			.on(
				"mousemove",
				function (
					this: SVGPathElement,
					event: MouseEvent,
					d: DistributionData,
				) {
					chartContainerRef?.showTooltip(
						event,
						`${d.district}: ${d.inactive} Inactive Schools`,
					);
				},
			)
			.on("mouseleave", function (this: SVGPathElement) {
				select(this)
					.transition()
					.duration(200)
					.attr("fill", CHART_COLORS.inactive);
				chartContainerRef?.hideTooltip();
			});

		// X Axis
		const xAxis = g
			.append("g")
			.attr("transform", `translate(0,${innerHeight})`)
			.call(axisBottom(xScale).tickSize(0));

		xAxis.select(".domain").remove();
		xAxis
			.selectAll("text")
			.attr("fill", "#171A1F")
			.attr("font-size", "12px")
			.attr("dy", "1em");

		// Y Axis
		const yAxis = g.append("g").call(
			axisLeft(yScale)
				.tickValues(yTickValues)
				.tickFormat((d) => d.toString())
				.tickSize(0),
		);

		yAxis.select(".domain").remove();
		yAxis
			.selectAll("text")
			.attr("fill", "#171A1F")
			.attr("font-size", "12px")
			.attr("dx", "-0.5em");
	}

	const legendItems = [
		{ label: "Active Schools", color: CHART_COLORS.active },
		{ label: "Inactive Schools", color: CHART_COLORS.inactive },
	];
</script>

<div class="flex flex-col h-full">
	<div class="flex items-center gap-2 mb-4">
		<BarChart3Icon class="h-5 w-5 text-primary" />
		<h3 class="text-base font-semibold text-gray-900">
			Schools Distribution by District
		</h3>
	</div>

	<ChartContainer
		bind:this={chartContainerRef}
		{height}
		bare
		onResize={createChart}
	>
		{#snippet legend()}
			<ChartLegend items={legendItems} shape="circle" size="md" />
		{/snippet}
	</ChartContainer>
</div>
