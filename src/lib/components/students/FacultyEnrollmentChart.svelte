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
	import type { FacultyEnrollment } from "./types.js";
	import { FACULTY_COLORS } from "./types.js";

	interface Props {
		data?: FacultyEnrollment[];
	}

	const defaultData: FacultyEnrollment[] = [
		{
			faculty: "Software development",
			count: 3200,
			color: FACULTY_COLORS["Software development"],
		},
		{
			faculty: "Mechanics",
			count: 2100,
			color: FACULTY_COLORS["Mechanics"],
		},
		{
			faculty: "Automobile",
			count: 1800,
			color: FACULTY_COLORS["Automobile"],
		},
		{ faculty: "Tourism", count: 2400, color: FACULTY_COLORS["Tourism"] },
		{
			faculty: "Electrical engineering",
			count: 1950,
			color: FACULTY_COLORS["Electrical engineering"],
		},
		{
			faculty: "Road construction",
			count: 1000,
			color: FACULTY_COLORS["Road construction"],
		},
	];

	let { data = defaultData }: Props = $props();

	let chartWrapper: HTMLDivElement;
	let chartContainer: HTMLDivElement;
	let tooltipEl: HTMLDivElement;
	let mounted = $state(false);
	let tooltipText = $state("");
	let tooltipOpacity = $state("0");
	let tooltipLeft = $state("0px");
	let tooltipTop = $state("0px");

	const chartSize = 200;
	const radius = chartSize / 2;
	const innerRadius = radius * 0.55;

	function createChart() {
		if (!chartContainer || !mounted) return;

		d3.select(chartContainer).selectAll("*").remove();

		const svg = d3
			.select(chartContainer)
			.append("svg")
			.attr("width", chartSize)
			.attr("height", chartSize)
			.attr("viewBox", `0 0 ${chartSize} ${chartSize}`);

		const g = svg
			.append("g")
			.attr("transform", `translate(${chartSize / 2},${chartSize / 2})`);

		type ChartData = (typeof data)[0];
		type PieArcData = d3.PieArcDatum<ChartData>;

		const pie = d3
			.pie<ChartData>()
			.value((d: ChartData) => d.count)
			.sort(null)
			.startAngle(-Math.PI / 2)
			.endAngle(Math.PI * 1.5);

		const arc = d3
			.arc<PieArcData>()
			.innerRadius(innerRadius)
			.outerRadius(radius)
			.cornerRadius(4)
			.padAngle(0.02);

		// Draw arcs with animation
		const arcs = g
			.selectAll<SVGPathElement, PieArcData>("path")
			.data(pie(data))
			.enter()
			.append("path")
			.attr("fill", (d: PieArcData) => d.data.color)
			.attr("d", arc)
			.style("cursor", "pointer");

		// Animate in
		arcs.each(function (this: SVGPathElement, d: PieArcData) {
			const path = d3.select(this);
			const startAngle = d.startAngle;
			path.attr("d", arc({ ...d, endAngle: startAngle } as PieArcData));
		});

		arcs.transition()
			.duration(800)
			.delay((_: PieArcData, i: number) => i * 100)
			.attrTween("d", function (d: PieArcData) {
				const interpolate = d3.interpolate(d.startAngle, d.endAngle);
				return (t: number) =>
					arc({ ...d, endAngle: interpolate(t) } as PieArcData) || "";
			});

		// Hover effects - using opacity only to avoid overflow issues
		arcs.on(
			"mouseenter",
			function (this: SVGPathElement, event: MouseEvent, d: PieArcData) {
				d3.select(this)
					.transition()
					.duration(200)
					.ease(d3.easeQuadOut)
					.attr("opacity", 0.75);

				const total = data.reduce((sum, item) => sum + item.count, 0);
				const percent = ((d.data.count / total) * 100).toFixed(1);
				showTooltip(
					event,
					`${d.data.faculty}: ${d.data.count.toLocaleString()} (${percent}%)`,
				);
			},
		)
			.on(
				"mousemove",
				function (
					this: SVGPathElement,
					event: MouseEvent,
					d: PieArcData,
				) {
					const total = data.reduce(
						(sum, item) => sum + item.count,
						0,
					);
					const percent = ((d.data.count / total) * 100).toFixed(1);
					showTooltip(
						event,
						`${d.data.faculty}: ${d.data.count.toLocaleString()} (${percent}%)`,
					);
				},
			)
			.on("mouseleave", function (this: SVGPathElement) {
				d3.select(this)
					.transition()
					.duration(200)
					.ease(d3.easeQuadOut)
					.attr("opacity", 1);

				hideTooltip();
			});
	}

	function showTooltip(event: MouseEvent, text: string) {
		if (!chartWrapper) return;
		const rect = chartWrapper.getBoundingClientRect();
		tooltipText = text;
		tooltipOpacity = "1";
		tooltipLeft = `${event.clientX - rect.left + 10}px`;
		tooltipTop = `${event.clientY - rect.top - 30}px`;
	}

	function hideTooltip() {
		tooltipOpacity = "0";
	}

	onMount(() => {
		mounted = true;
		createChart();
	});

	$effect(() => {
		if (mounted) {
			createChart();
		}
	});
</script>

<Card class="h-full">
	<CardHeader class="p-4 lg:p-6">
		<CardTitle class="text-lg font-semibold">Faculty Enrollment</CardTitle>
		<CardDescription
			>Breakdown by specialized vocational tracks</CardDescription
		>
	</CardHeader>
	<CardContent class="p-4 pt-0 lg:p-6 lg:pt-0">
		<div
			bind:this={chartWrapper}
			class="relative flex flex-col items-center"
		>
			<!-- Donut Chart -->
			<div
				class="shrink-0"
				bind:this={chartContainer}
				style="width: {chartSize}px; height: {chartSize}px;"
			></div>

			<!-- Legend - vertical list below donut -->
			<div class="mt-4 flex flex-col gap-2">
				{#each data as item, i (i)}
					<div class="flex items-center gap-2">
						<div
							class="h-3 w-3 shrink-0 rounded-full"
							style="background-color: {item.color}"
						></div>
						<span class="text-sm font-light leading-0 text-gray-600"
							>{item.faculty}</span
						>
					</div>
				{/each}
			</div>

			<!-- Tooltip -->
			<div
				bind:this={tooltipEl}
				class="pointer-events-none absolute z-10 rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity"
				style="opacity: {tooltipOpacity}; left: {tooltipLeft}; top: {tooltipTop};"
			>
				{tooltipText}
			</div>
		</div>
	</CardContent>
</Card>
