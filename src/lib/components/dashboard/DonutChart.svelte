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

	const data = [
		{ label: "Pass Rate", value: 86.7, color: "#10b981" },
		{ label: "Failure", value: 13.3, color: "#ef4444" },
	];

	let chartWrapper: HTMLDivElement;
	let chartContainer: HTMLDivElement;
	let tooltipEl: HTMLDivElement;
	let mounted = $state(false);
	let tooltipText = $state("");
	let tooltipOpacity = $state("0");
	let tooltipLeft = $state("0px");
	let tooltipTop = $state("0px");

	const chartSize = 190;
	const radius = chartSize / 2;
	const innerRadius = radius * 0.6;

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
			.value((d: ChartData) => d.value)
			.sort(null)
			.startAngle(-Math.PI / 2)
			.endAngle(Math.PI * 1.5);

		const arc = d3
			.arc<PieArcData>()
			.innerRadius(innerRadius)
			.outerRadius(radius)
			.cornerRadius(6)
			.padAngle(0.03);

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
			.delay((_: PieArcData, i: number) => i * 200)
			.attrTween("d", function (d: PieArcData) {
				const interpolate = d3.interpolate(d.startAngle, d.endAngle);
				return (t: number) => arc({ ...d, endAngle: interpolate(t) } as PieArcData) || "";
			});

		// Hover effects - smooth opacity transition with slight scale
		arcs.on("mouseenter", function (this: SVGPathElement, event: MouseEvent, d: PieArcData) {
			d3.select(this)
				.transition()
				.duration(200)
				.ease(d3.easeQuadOut)
				.attr("opacity", 0.85)
				.attr("transform", "scale(1.02)");

			showTooltip(event, `${d.data.label}: ${d.data.value}%`);
		})
			.on("mousemove", function (this: SVGPathElement, event: MouseEvent, d: PieArcData) {
				showTooltip(event, `${d.data.label}: ${d.data.value}%`);
			})
			.on("mouseleave", function (this: SVGPathElement) {
				d3.select(this)
					.transition()
					.duration(200)
					.ease(d3.easeQuadOut)
					.attr("opacity", 1)
					.attr("transform", "scale(1)");

				hideTooltip();
			});

		// Center text
		g.append("text")
			.attr("text-anchor", "middle")
			.attr("dy", "-0.1em")
			.attr("font-size", "22px")
			.attr("font-weight", "bold")
			.attr("fill", "#10b981")
			.text("86.7%")
			.attr("opacity", 0)
			.transition()
			.delay(600)
			.duration(400)
			.attr("opacity", 1);

		g.append("text")
			.attr("text-anchor", "middle")
			.attr("dy", "1.4em")
			.attr("font-size", "11px")
			.attr("fill", "#64748b")
			.text("Pass Rate")
			.attr("opacity", 0)
			.transition()
			.delay(700)
			.duration(400)
			.attr("opacity", 1);
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
		<CardTitle class="text-base">Global Success Distribution</CardTitle>
		<CardDescription
			>Comparing passed vs. failed outcomes across all High Schools.</CardDescription
		>
	</CardHeader>
	<CardContent class="flex flex-col mt-10 items-center">
		<div
			bind:this={chartWrapper}
			class="relative flex w-full items-center justify-center"
			style="height: {chartSize}px;"
		>
			<div
				bind:this={chartContainer}
				style="width: {chartSize}px; height: {chartSize}px; "
			></div>
			<div
				bind:this={tooltipEl}
				class="pointer-events-none absolute z-10 rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity"
				style="opacity: {tooltipOpacity}; left: {tooltipLeft}; top: {tooltipTop};"
			>
				{tooltipText}
			</div>
		</div>

		<div class="mt-10 grid w-full grid-cols-2 gap-4">
			{#each data as item, i (i)}
				<div
					class="flex flex-col items-center rounded-lg border border-gray-100 p-3 transition-colors bg-gray-50"
				>
					<span class="text-2xl font-bold" style="color: {item.color}"
						>{item.value}%</span
					>
					<span class="text-xs uppercase tracking-wide text-gray-500"
						>{item.label === "Pass Rate"
							? "PASS RATE"
							: "FAILURE"}</span
					>
				</div>
			{/each}
		</div>
	</CardContent>
</Card>
