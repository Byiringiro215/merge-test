<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import {
		select,
		stack,
		stackOrderNone,
		stackOffsetNone,
		scaleBand,
		scaleLinear,
		easeQuadOut,
		axisBottom,
		axisLeft,
	} from "d3";
	import type { SeriesPoint } from "d3";
	import { onMount } from "svelte";
	import type { TeacherProvinceAssistance } from "./types.js";
	import { PROVINCE_COLORS, PROVINCES } from "./types.js";

	interface Props {
		data?: TeacherProvinceAssistance[];
	}

	const defaultData: TeacherProvinceAssistance[] = [
		{
			teacherName: "Uwimana A.",
			provinces: { Kigali: 50, North: 30, South: 20, East: 25, West: 20 },
		},
		{
			teacherName: "Mukiza P.",
			provinces: { Kigali: 40, North: 25, South: 25, East: 20, West: 15 },
		},
		{
			teacherName: "Ndahimana J.",
			provinces: { Kigali: 25, North: 30, South: 35, East: 55, West: 55 },
		},
		{
			teacherName: "Gasana M.",
			provinces: { Kigali: 30, North: 35, South: 30, East: 40, West: 30 },
		},
		{
			teacherName: "Habimana E.",
			provinces: { Kigali: 35, North: 55, South: 35, East: 25, West: 25 },
		},
	];

	let { data = defaultData }: Props = $props();

	let chartContainer: HTMLDivElement;
	let width = $state(0);
	let tooltipText = $state("");
	let tooltipX = $state(0);
	let tooltipY = $state(0);
	let tooltipVisible = $state(false);
	const height = 320;

	interface StackedDataItem {
		teacher: string;
		Kigali: number;
		North: number;
		South: number;
		East: number;
		West: number;
	}

	function createChart() {
		if (!chartContainer || width === 0) return;

		select(chartContainer).selectAll("*").remove();

		const margin = { top: 10, right: 30, left: 35, bottom: 60 };
		const innerWidth = width - margin.left - margin.right;
		const innerHeight = height - margin.top - margin.bottom;

		const svg = select(chartContainer)
			.append("svg")
			.attr("width", width)
			.attr("height", height);

		const g = svg
			.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

		// Transform data for d3.stack()
		const stackData: StackedDataItem[] = data.map((d) => ({
			teacher: d.teacherName,
			...d.provinces,
		}));

		// Create stack generator
		const stackGenerator = stack<StackedDataItem>()
			.keys(PROVINCES)
			.order(stackOrderNone)
			.offset(stackOffsetNone);

		const stackedSeries = stackGenerator(stackData);

		// Fixed Y scale to 220
		const yMax = 220;

		// Scales
		const xScale = scaleBand()
			.domain(data.map((d) => d.teacherName))
			.range([0, innerWidth])
			.padding(0.37);

		const yScale = scaleLinear().domain([0, yMax]).range([innerHeight, 0]);

		// Y-axis grid lines (excluding 0)
		const yTickValues = [0, 55, 110, 165, 220];
		g.append("g")
			.attr("class", "grid")
			.selectAll("line")
			.data(yTickValues.filter((d) => d > 0))
			.enter()
			.append("line")
			.attr("x1", 0)
			.attr("x2", innerWidth)
			.attr("y1", (d: number) => yScale(d))
			.attr("y2", (d: number) => yScale(d))
			.attr("stroke", "#e5e7eb")
			.attr("stroke-width", 1);

		// Draw stacked bars for each province layer
		const barWidth = xScale.bandwidth();
		const cornerRadius = 6;

		PROVINCES.forEach((province, layerIndex) => {
			const layer = stackedSeries[layerIndex];
			const isTopLayer = layerIndex === PROVINCES.length - 1;

			if (isTopLayer) {
				// Top layer with rounded corners - animate from bottom
				const bars = g
					.selectAll<SVGPathElement, SeriesPoint<StackedDataItem>>(
						`.bar-${province}`,
					)
					.data(layer)
					.enter()
					.append("path")
					.attr("class", `bar-${province}`)
					.attr("fill", PROVINCE_COLORS[province])
					.style("cursor", "pointer")
					.attr("d", (d) => {
						const x = xScale(d.data.teacher) || 0;
						const y0 = yScale(d[0]);
						// Start at bottom (zero height)
						return `M${x},${y0} L${x},${y0} L${x + barWidth},${y0} L${x + barWidth},${y0} Z`;
					});

				bars.transition()
					.duration(800)
					.delay(
						(_: SeriesPoint<StackedDataItem>, i: number) => i * 100,
					)
					.attr("d", (d) => {
						const x = xScale(d.data.teacher) || 0;
						const y0 = yScale(d[0]);
						const y1 = yScale(d[1]);
						const h = y0 - y1;
						if (h <= 0)
							return `M${x},${y0} L${x},${y0} L${x + barWidth},${y0} L${x + barWidth},${y0} Z`;
						const r = Math.min(cornerRadius, h / 2, barWidth / 2);
						return `M${x},${y0}
								L${x},${y1 + r}
								Q${x},${y1} ${x + r},${y1}
								L${x + barWidth - r},${y1}
								Q${x + barWidth},${y1} ${x + barWidth},${y1 + r}
								L${x + barWidth},${y0} Z`;
					});

				// Hover effects
				bars.on("mouseenter", function (event: MouseEvent, d) {
					select(this)
						.transition()
						.duration(200)
						.ease(easeQuadOut)
						.attr("opacity", 0.8);
					const value = d[1] - d[0];
					showTooltip(
						event,
						`${d.data.teacher} - ${province}: ${value} students`,
					);
				})
					.on("mousemove", function (event: MouseEvent, d) {
						const value = d[1] - d[0];
						showTooltip(
							event,
							`${d.data.teacher} - ${province}: ${value} students`,
						);
					})
					.on("mouseleave", function () {
						select(this)
							.transition()
							.duration(200)
							.ease(easeQuadOut)
							.attr("opacity", 1);
						hideTooltip();
					});
			} else {
				// Other layers - animate from bottom (height grows)
				const bars = g
					.selectAll<SVGRectElement, SeriesPoint<StackedDataItem>>(
						`.bar-${province}`,
					)
					.data(layer)
					.enter()
					.append("rect")
					.attr("class", `bar-${province}`)
					.attr("x", (d) => xScale(d.data.teacher) || 0)
					.attr("y", (d) => yScale(d[0])) // Start at bottom of this segment
					.attr("width", barWidth)
					.attr("height", 0) // Start with zero height
					.attr("fill", PROVINCE_COLORS[province])
					.style("cursor", "pointer");

				bars.transition()
					.duration(800)
					.delay(
						(_: SeriesPoint<StackedDataItem>, i: number) => i * 100,
					)
					.attr("y", (d) => yScale(d[1]))
					.attr("height", (d) => yScale(d[0]) - yScale(d[1]));

				// Hover effects
				bars.on("mouseenter", function (event: MouseEvent, d) {
					select(this)
						.transition()
						.duration(200)
						.ease(easeQuadOut)
						.attr("opacity", 0.8);
					const value = d[1] - d[0];
					showTooltip(
						event,
						`${d.data.teacher} - ${province}: ${value} students`,
					);
				})
					.on("mousemove", function (event: MouseEvent, d) {
						const value = d[1] - d[0];
						showTooltip(
							event,
							`${d.data.teacher} - ${province}: ${value} students`,
						);
					})
					.on("mouseleave", function () {
						select(this)
							.transition()
							.duration(200)
							.ease(easeQuadOut)
							.attr("opacity", 1);
						hideTooltip();
					});
			}
		});

		// X Axis
		const xAxis = g
			.append("g")
			.attr("transform", `translate(0,${innerHeight})`)
			.call(axisBottom(xScale).tickSize(0));

		xAxis.select(".domain").remove();
		xAxis
			.selectAll("text")
			.attr("fill", "#565D6D")
			.attr("font-size", "12px")
			.attr("dy", "1.5em");

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
			.attr("fill", "#565D6D")
			.attr("font-size", "11px")
			.attr("dx", "-0.3em")
			.attr("text-anchor", "end");
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

<Card class="h-full border-0 shadow-none bg-transparent">
	<CardHeader class="px-0 pb-3 pt-0">
		<CardTitle class="text-base font-bold text-gray-900"
			>Student Assistance by Province</CardTitle
		>
		<CardDescription class="text-sm text-gray-500">
			Number of students assisted per teacher broken down by their
			originating district.
		</CardDescription>
	</CardHeader>
	<CardContent class="px-0 pb-0 pt-0">
		<div class="relative">
			<div
				bind:this={chartContainer}
				class="w-full"
				style="height: {height}px;"
			></div>
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
		<!-- Legend -->
		<div
			class="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-2"
		>
			{#each PROVINCES as province, i (i)}
				<div class="flex items-center gap-1.5">
					<div
						class="h-2.5 w-2.5 rounded-full"
						style="background-color: {PROVINCE_COLORS[province]}"
					></div>
					<span class="text-xs text-gray-600">{province}</span>
				</div>
			{/each}
		</div>
	</CardContent>
</Card>
