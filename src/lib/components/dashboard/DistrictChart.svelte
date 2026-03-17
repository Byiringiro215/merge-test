<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import { scaleBand, scaleLinear, select, easeQuadOut, axisLeft } from "d3";
	import { onMount } from "svelte";

	interface DistrictData {
		district: string;
		successRate: number;
		activeSchools: number;
	}

	const data: DistrictData[] = [
		{ district: "Kicukiro", successRate: 25, activeSchools: 8 },
		{ district: "Gasabo", successRate: 35, activeSchools: 12 },
		{ district: "Nyamagabe", successRate: 55, activeSchools: 6 },
		{ district: "Rubavu", successRate: 100, activeSchools: 10 },
		{ district: "Ngororero", successRate: 85, activeSchools: 15 },
	];

	let chartContainer: HTMLDivElement;
	let tooltipEl: HTMLDivElement;
	let width = $state(0);
	let tooltipText = $state("");
	let tooltipX = $state(0);
	let tooltipY = $state(0);
	let tooltipVisible = $state(false);
	const height = 300;

	function createChart() {
		if (!chartContainer || width === 0) return;

		select(chartContainer).selectAll("*").remove();

		const margin = { top: 10, right: 30, left: 80, bottom: 20 };
		const innerWidth = width - margin.left - margin.right;
		const innerHeight = height - margin.top - margin.bottom;

		const svg = select(chartContainer)
			.append("svg")
			.attr("width", width)
			.attr("height", height);

		const g = svg
			.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`)
			.attr("class", "chart-group");

		// Scales
		const yScale = scaleBand()
			.domain(data.map((d) => d.district))
			.range([0, innerHeight])
			.padding(0.4);

		const xScale = scaleLinear().domain([0, 100]).range([0, innerWidth]);

		const barHeight = yScale.bandwidth() / 2 - 2;

		// Draw success rate bars (orange) with animation
		const successBars = g
			.selectAll<SVGRectElement, DistrictData>(".bar-success")
			.data(data)
			.enter()
			.append("rect")
			.attr("class", "bar-success")
			.attr("x", 0)
			.attr("y", (d: DistrictData) => yScale(d.district) || 0)
			.attr("width", 0)
			.attr("height", barHeight)
			.attr("fill", "#EB8B47")
			.attr("rx", 3)
			.style("cursor", "pointer");

		successBars
			.transition()
			.duration(800)
			.delay((_: DistrictData, i: number) => i * 100)
			.attr("width", (d: DistrictData) => xScale(d.successRate));

		// Success bar hover with smooth animation
		successBars
			.on(
				"mouseenter",
				function (
					this: SVGRectElement,
					event: MouseEvent,
					d: DistrictData,
				) {
					select(this)
						.transition()
						.duration(200)
						.ease(easeQuadOut)
						.attr("fill", "#f97316")
						.attr("opacity", 0.9);

					showTooltip(
						event,
						`${d.district} Success Rate: ${d.successRate}%`,
					);
				},
			)
			.on(
				"mousemove",
				function (
					this: SVGRectElement,
					event: MouseEvent,
					d: DistrictData,
				) {
					showTooltip(
						event,
						`${d.district} Success Rate: ${d.successRate}%`,
					);
				},
			)
			.on("mouseleave", function (this: SVGRectElement) {
				select(this)
					.transition()
					.duration(200)
					.ease(easeQuadOut)
					.attr("fill", "#EB8B47")
					.attr("opacity", 1);

				hideTooltip();
			});

		// Draw active schools bars (blue) with animation
		const schoolBars = g
			.selectAll<SVGRectElement, DistrictData>(".bar-schools")
			.data(data)
			.enter()
			.append("rect")
			.attr("class", "bar-schools")
			.attr("x", 0)
			.attr(
				"y",
				(d: DistrictData) => (yScale(d.district) || 0) + barHeight + 4,
			)
			.attr("width", 0)
			.attr("height", barHeight)
			.attr("fill", "#205FAD")
			.attr("rx", 3)
			.style("cursor", "pointer");

		schoolBars
			.transition()
			.duration(800)
			.delay((_: DistrictData, i: number) => i * 100 + 50)
			.attr("width", (d: DistrictData) => xScale(d.activeSchools * 5));

		// School bar hover with smooth animation
		schoolBars
			.on(
				"mouseenter",
				function (
					this: SVGRectElement,
					event: MouseEvent,
					d: DistrictData,
				) {
					select(this)
						.transition()
						.duration(200)
						.ease(easeQuadOut)
						.attr("fill", "#205FAD")
						.attr("opacity", 0.9);

					showTooltip(
						event,
						`${d.district} Active Schools: ${d.activeSchools}`,
					);
				},
			)
			.on(
				"mousemove",
				function (
					this: SVGRectElement,
					event: MouseEvent,
					d: DistrictData,
				) {
					showTooltip(
						event,
						`${d.district} Active Schools: ${d.activeSchools}`,
					);
				},
			)
			.on("mouseleave", function (this: SVGRectElement) {
				select(this)
					.transition()
					.duration(200)
					.ease(easeQuadOut)
					.attr("fill", "#205FAD")
					.attr("opacity", 1);

				hideTooltip();
			});

		// Y Axis (district names)
		const yAxis = g.append("g").call(axisLeft(yScale).tickSize(0));

		yAxis.select(".domain").remove();
		yAxis
			.selectAll("text")
			.attr("fill", "#475569")
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

<Card class="py-6">
	<CardHeader>
		<CardTitle
			class="text-[18px] font-semibold leading-7 text-primary-black -tracking-[0.45px]"
			>District Contributions</CardTitle
		>
		<CardDescription
			>High School count and performance levels by district.</CardDescription
		>
	</CardHeader>
	<CardContent>
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
		<div class="mt-4 flex items-center justify-center gap-6">
			<div class="flex items-center gap-2">
				<div class="h-3 w-3 rounded-full bg-orange-400"></div>
				<span class="text-sm text-gray-600">District Success Rate</span>
			</div>
			<div class="flex items-center gap-2">
				<div class="h-3 w-3 rounded-full bg-blue-400"></div>
				<span class="text-sm text-gray-600">Active High Schools</span>
			</div>
		</div>
	</CardContent>
</Card>
