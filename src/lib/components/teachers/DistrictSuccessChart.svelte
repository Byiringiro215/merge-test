<script lang="ts">
	import { onMount } from "svelte";
	import * as d3 from "d3";
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

	let chartContainer: HTMLDivElement;
	let width = $state(0);
	let tooltipText = $state("");
	let tooltipX = $state(0);
	let tooltipY = $state(0);
	let tooltipVisible = $state(false);
	const height = 270;

	function createChart() {
		if (!chartContainer || width === 0) return;

		d3.select(chartContainer).selectAll("*").remove();

		const margin = { top: 10, right: 20, left: 85, bottom: 10 };
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

		// Scales
		const yScale = d3
			.scaleBand()
			.domain(data.map((d) => d.district))
			.range([0, innerHeight])
			.padding(0.45);

		const xScale = d3.scaleLinear().domain([0, 100]).range([0, innerWidth]);

		// Draw background bars (gray track)
		g.selectAll<SVGRectElement, DistrictSuccess>(".bar-bg")
			.data(data)
			.enter()
			.append("rect")
			.attr("class", "bar-bg")
			.attr("x", 0)
			.attr("y", (d: DistrictSuccess) => yScale(d.district) || 0)
			.attr("width", innerWidth)
			.attr("height", yScale.bandwidth())
			.attr("fill", "#f3f4f6")
			.attr("rx", 4);

		// Draw success rate bars (blue) with animation
		const bars = g
			.selectAll<SVGRectElement, DistrictSuccess>(".bar-success")
			.data(data)
			.enter()
			.append("rect")
			.attr("class", "bar-success")
			.attr("x", 0)
			.attr("y", (d: DistrictSuccess) => yScale(d.district) || 0)
			.attr("width", 0)
			.attr("height", yScale.bandwidth())
			.attr("fill", "#205fad")
			.attr("rx", 4)
			.style("cursor", "pointer");

		bars.transition()
			.duration(800)
			.delay((_: DistrictSuccess, i: number) => i * 100)
			.attr("width", (d: DistrictSuccess) => xScale(d.successRate));

		// Bar hover effects
		bars.on(
			"mouseenter",
			function (
				this: SVGRectElement,
				event: MouseEvent,
				d: DistrictSuccess,
			) {
				d3.select(this)
					.transition()
					.duration(200)
					.ease(d3.easeQuadOut)
					.attr("fill", "#1a4d8c");

				showTooltip(
					event,
					`${d.district}: ${d.successRate}% success rate`,
				);
			},
		)
			.on(
				"mousemove",
				function (
					this: SVGRectElement,
					event: MouseEvent,
					d: DistrictSuccess,
				) {
					showTooltip(
						event,
						`${d.district}: ${d.successRate}% success rate`,
					);
				},
			)
			.on("mouseleave", function (this: SVGRectElement) {
				d3.select(this)
					.transition()
					.duration(200)
					.ease(d3.easeQuadOut)
					.attr("fill", "#205fad");

				hideTooltip();
			});

		// Y Axis (district names)
		const yAxis = g.append("g").call(d3.axisLeft(yScale).tickSize(0));

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
		<CardTitle class="text-lg font-semibold"
			>Avg. Success by District</CardTitle
		>
		<CardDescription>High School performance comparison</CardDescription>
	</CardHeader>
	<CardContent class="px-4 pb-4 pt-2 lg:px-6 lg:pb-6">
		<div class="relative">
			<div
				bind:this={chartContainer}
				class="w-full"
				style="height: {height}px;"
			></div>
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
	</CardContent>
</Card>
