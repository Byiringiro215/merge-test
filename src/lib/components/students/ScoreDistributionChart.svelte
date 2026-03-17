<script lang="ts">
	import { onMount } from "svelte";
	import {
		select,
		scaleBand,
		scaleLinear,
		easeQuadOut,
		axisBottom,
		axisLeft,
	} from "d3";
	import {
		Card,
		CardHeader,
		CardTitle,
		CardDescription,
		CardContent,
	} from "$lib/components/ui/card";
	import type { ScoreDistribution } from "./types.js";

	const defaultData: ScoreDistribution[] = [
		{ range: "0-20", count: 450 },
		{ range: "21-40", count: 1200 },
		{ range: "41-60", count: 3000 },
		{ range: "61-80", count: 4800 },
		{ range: "81-100", count: 2900 },
	];

	interface Props {
		data?: ScoreDistribution[];
	}

	let { data = defaultData }: Props = $props();

	let chartContainer: HTMLDivElement;
	let tooltipEl: HTMLDivElement;
	let width = $state(0);
	let tooltipText = $state("");
	let tooltipX = $state(0);
	let tooltipY = $state(0);
	let tooltipVisible = $state(false);
	const height = 400;

	function createChart() {
		if (!chartContainer || width === 0) return;

		select(chartContainer).selectAll("*").remove();

		const margin = { top: 10, right: 20, left: 40, bottom: 30 };
		const innerWidth = width - margin.left - margin.right;
		const innerHeight = height - margin.top - margin.bottom;

		const svg = select(chartContainer)
			.append("svg")
			.attr("width", width)
			.attr("height", height);

		const g = svg
			.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

		// Scales
		const xScale = scaleBand()
			.domain(data.map((d) => d.range))
			.range([0, innerWidth])
			.padding(0.4);

		const yMax = 4800;
		const yTickValues = [0, 1200, 2400, 3600, 4800];

		const yScale = scaleLinear().domain([0, yMax]).range([innerHeight, 0]);

		// Grid lines
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

		// Draw bars with animation - rounded top corners only
		const barWidth = xScale.bandwidth();
		const cornerRadius = 6;

		const bars = g
			.selectAll<SVGPathElement, ScoreDistribution>(".bar")
			.data(data)
			.enter()
			.append("path")
			.attr("class", "bar")
			.attr("fill", "#205fad")
			.style("cursor", "pointer")
			.attr("d", (d: ScoreDistribution) => {
				const x = xScale(d.range) || 0;
				return `M${x},${innerHeight} L${x},${innerHeight} L${x + barWidth},${innerHeight} L${x + barWidth},${innerHeight} Z`;
			});

		bars.transition()
			.duration(800)
			.delay((_: ScoreDistribution, i: number) => i * 100)
			.attr("d", (d: ScoreDistribution) => {
				const x = xScale(d.range) || 0;
				const y = yScale(d.count);
				const h = innerHeight - y;
				const r = Math.min(cornerRadius, h / 2, barWidth / 2);
				// Path with rounded top corners only
				return `M${x},${innerHeight}
						L${x},${y + r}
						Q${x},${y} ${x + r},${y}
						L${x + barWidth - r},${y}
						Q${x + barWidth},${y} ${x + barWidth},${y + r}
						L${x + barWidth},${innerHeight} Z`;
			});

		// Bar hover effects
		bars.on(
			"mouseenter",
			function (
				this: SVGPathElement,
				event: MouseEvent,
				d: ScoreDistribution,
			) {
				select(this)
					.transition()
					.duration(200)
					.ease(easeQuadOut)
					.attr("fill", "#1a4d8c")
					.attr("opacity", 0.9);

				showTooltip(
					event,
					`${d.range}: ${d.count.toLocaleString()} students`,
				);
			},
		)
			.on(
				"mousemove",
				function (
					this: SVGPathElement,
					event: MouseEvent,
					d: ScoreDistribution,
				) {
					showTooltip(
						event,
						`${d.range}: ${d.count.toLocaleString()} students`,
					);
				},
			)
			.on("mouseleave", function (this: SVGPathElement) {
				select(this)
					.transition()
					.duration(200)
					.ease(easeQuadOut)
					.attr("fill", "#205fad")
					.attr("opacity", 1);

				hideTooltip();
			});

		// X Axis
		const xAxis = g
			.append("g")
			.attr("transform", `translate(0,${innerHeight})`)
			.call(axisBottom(xScale).tickSize(0));

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
				.tickFormat((d) => d.toLocaleString())
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

<Card class="h-full">
	<CardHeader class="px-4 pb-2 pt-4 lg:px-6 lg:pt-5">
		<CardTitle class="text-lg font-semibold">Score Distribution</CardTitle>
		<CardDescription
			>Frequency of students across academic score ranges</CardDescription
		>
	</CardHeader>
	<CardContent class="px-4 pb-4 pt-0 lg:px-6 lg:pb-5">
		<div class="relative">
			<div
				bind:this={chartContainer}
				class="w-full"
				style="height: {height}px;"
			></div>
			<div
				bind:this={tooltipEl}
				class="pointer-events-none absolute rounded bg-gray-900 px-2 py-1 text-xs text-white transition-opacity"
				style="opacity: {tooltipVisible
					? 1
					: 0}; left: {tooltipX}px; top: {tooltipY}px;"
			>
				{tooltipText}
			</div>
		</div>
	</CardContent>
</Card>
