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
	import type { District, Faculty } from "./types.js";
	import { DISTRICTS, FACULTIES } from "./types.js";

	interface HeatmapData {
		faculty: Faculty;
		district: District;
		value: number; // 0-100
	}

	interface Props {
		data?: HeatmapData[];
	}

	// Generate default heatmap data matching the design
	const defaultData: HeatmapData[] = [
		// Software development row
		{ faculty: "Software development", district: "Kicukiro", value: 50 },
		{ faculty: "Software development", district: "Nyamagabe", value: 55 },
		{ faculty: "Software development", district: "Rubavu", value: 60 },
		{ faculty: "Software development", district: "Ngororero", value: 45 },
		{ faculty: "Software development", district: "Gasabo", value: 90 },
		// Mechanics row
		{ faculty: "Mechanics", district: "Kicukiro", value: 55 },
		{ faculty: "Mechanics", district: "Nyamagabe", value: 60 },
		{ faculty: "Mechanics", district: "Rubavu", value: 70 },
		{ faculty: "Mechanics", district: "Ngororero", value: 50 },
		{ faculty: "Mechanics", district: "Gasabo", value: 65 },
		// Automobile row
		{ faculty: "Automobile", district: "Kicukiro", value: 50 },
		{ faculty: "Automobile", district: "Nyamagabe", value: 55 },
		{ faculty: "Automobile", district: "Rubavu", value: 45 },
		{ faculty: "Automobile", district: "Ngororero", value: 25 },
		{ faculty: "Automobile", district: "Gasabo", value: 60 },
		// Tourism row
		{ faculty: "Tourism", district: "Kicukiro", value: 75 },
		{ faculty: "Tourism", district: "Nyamagabe", value: 65 },
		{ faculty: "Tourism", district: "Rubavu", value: 30 },
		{ faculty: "Tourism", district: "Ngororero", value: 85 },
		{ faculty: "Tourism", district: "Gasabo", value: 55 },
		// Electrical engineering row
		{ faculty: "Electrical engineering", district: "Kicukiro", value: 60 },
		{ faculty: "Electrical engineering", district: "Nyamagabe", value: 70 },
		{ faculty: "Electrical engineering", district: "Rubavu", value: 45 },
		{ faculty: "Electrical engineering", district: "Ngororero", value: 50 },
		{ faculty: "Electrical engineering", district: "Gasabo", value: 55 },
		// Road construction row
		{ faculty: "Road construction", district: "Kicukiro", value: 40 },
		{ faculty: "Road construction", district: "Nyamagabe", value: 75 },
		{ faculty: "Road construction", district: "Rubavu", value: 70 },
		{ faculty: "Road construction", district: "Ngororero", value: 55 },
		{ faculty: "Road construction", district: "Gasabo", value: 70 },
	];

	let { data = defaultData }: Props = $props();

	let chartContainer: HTMLDivElement;
	let width = $state(0);
	let tooltipText = $state("");
	let tooltipX = $state(0);
	let tooltipY = $state(0);
	let tooltipVisible = $state(false);
	const height = 280;

	function getColorForValue(value: number): string {
		// Smoother gradient matching the design - light to dark blue
		if (value <= 30) return "#c7d9f0"; // very light blue
		if (value <= 45) return "#a3c4e8"; // light blue
		if (value <= 55) return "#7babd9"; // medium light blue
		if (value <= 65) return "#5a92c9"; // medium blue
		if (value <= 75) return "#3d7bb8"; // medium dark blue
		if (value <= 85) return "#2563eb"; // dark blue
		return "#1d4ed8"; // very dark blue
	}

	function createChart() {
		if (!chartContainer || width === 0) return;

		d3.select(chartContainer).selectAll("*").remove();

		const margin = { top: 30, right: 10, left: 140, bottom: 10 };
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
		const xScale = d3
			.scaleBand()
			.domain(DISTRICTS)
			.range([0, innerWidth])
			.padding(0.1);

		const yScale = d3
			.scaleBand()
			.domain(FACULTIES)
			.range([0, innerHeight])
			.padding(0.1);

		// Draw cells with animation
		const cells = g
			.selectAll<SVGRectElement, HeatmapData>(".cell")
			.data(data)
			.enter()
			.append("rect")
			.attr("class", "cell")
			.attr("x", (d: HeatmapData) => xScale(d.district) || 0)
			.attr("y", (d: HeatmapData) => yScale(d.faculty) || 0)
			.attr("width", xScale.bandwidth())
			.attr("height", yScale.bandwidth())
			.attr("fill", "#e5e7eb")
			.attr("rx", 4)
			.style("cursor", "pointer");

		// Animate color
		cells
			.transition()
			.duration(600)
			.delay((_: HeatmapData, i: number) => i * 20)
			.attr("fill", (d: HeatmapData) => getColorForValue(d.value));

		// Cell hover effects
		cells
			.on(
				"mouseenter",
				function (
					this: SVGRectElement,
					event: MouseEvent,
					d: HeatmapData,
				) {
					d3.select(this)
						.transition()
						.duration(150)
						.ease(d3.easeQuadOut)
						.attr("transform", function () {
							const x = xScale(d.district) || 0;
							const y = yScale(d.faculty) || 0;
							const cellWidth = xScale.bandwidth();
							const cellHeight = yScale.bandwidth();
							const centerX = x + cellWidth / 2;
							const centerY = y + cellHeight / 2;
							return `translate(${-centerX * 0.03}, ${-centerY * 0.03}) scale(1.03)`;
						})
						.style("filter", "drop-shadow(0 4px 6px rgba(0,0,0,0.1))");

					showTooltip(event, `${d.faculty} - ${d.district}: ${d.value}%`);
				},
			)
			.on(
				"mousemove",
				function (
					this: SVGRectElement,
					event: MouseEvent,
					d: HeatmapData,
				) {
					showTooltip(event, `${d.faculty} - ${d.district}: ${d.value}%`);
				},
			)
			.on("mouseleave", function (this: SVGRectElement) {
				d3.select(this)
					.transition()
					.duration(150)
					.ease(d3.easeQuadOut)
					.attr("transform", "translate(0,0) scale(1)")
					.style("filter", "none");

				hideTooltip();
			});

		// X Axis (district names - top)
		g.append("g")
			.attr("transform", `translate(0, -8)`)
			.selectAll("text")
			.data(DISTRICTS)
			.enter()
			.append("text")
			.attr("x", (d: District) => (xScale(d) || 0) + xScale.bandwidth() / 2)
			.attr("y", 0)
			.attr("text-anchor", "middle")
			.attr("fill", "#6b7280")
			.attr("font-size", "10px")
			.attr("font-weight", "500")
			.text((d: District) => d.toUpperCase());

		// Y Axis (faculty names - left)
		g.append("g")
			.attr("transform", `translate(-8, 0)`)
			.selectAll("text")
			.data(FACULTIES)
			.enter()
			.append("text")
			.attr("x", 0)
			.attr("y", (d: Faculty) => (yScale(d) || 0) + yScale.bandwidth() / 2)
			.attr("text-anchor", "end")
			.attr("dominant-baseline", "middle")
			.attr("fill", "#6b7280")
			.attr("font-size", "10px")
			.attr("font-weight", "500")
			.text((d: Faculty) => d.toUpperCase());
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
		<div class="flex items-start justify-between">
			<div>
				<CardTitle class="text-lg font-semibold"
					>Student Assistance Heatmap</CardTitle
				>
				<CardDescription>
					Intensity of teacher-led extra support sessions by faculty &
					district
				</CardDescription>
			</div>
			<!-- Legend -->
			<div class="flex items-center gap-2 text-xs text-gray-500">
				<span>Low</span>
				<div class="flex items-center gap-0.5">
					<div class="h-3 w-3 rounded-full bg-[#c7d9f0]"></div>
					<div class="h-3 w-3 rounded-full bg-[#5a92c9]"></div>
					<div class="h-3 w-3 rounded-full bg-[#1d4ed8]"></div>
				</div>
				<span>High</span>
			</div>
		</div>
	</CardHeader>
	<CardContent class="px-4 pb-4 pt-2 lg:px-6 lg:pb-5">
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
	</CardContent>
</Card>
