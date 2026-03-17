<script lang="ts">
	import { onMount } from "svelte";
	import { select, pie, arc, easeQuadOut, interpolate } from "d3";
	import type { PieArcDatum } from "d3";
	import {
		Card,
		CardHeader,
		CardTitle,
		CardDescription,
		CardContent,
	} from "$lib/components/ui/card";
	import { cn } from "$lib/utils";

	const data = [
		{ label: "Pass Rate", value: 86.7, color: "#67E491" },
		{ label: "Failure", value: 15.3, color: "#DD3C57" },
	];

	let chartWrapper: HTMLDivElement;
	let chartContainer: HTMLDivElement;
	let tooltipEl: HTMLDivElement;
	let mounted = $state(false);
	let tooltipText = $state("");
	let tooltipOpacity = $state("0");
	let tooltipLeft = $state("0px");
	let tooltipTop = $state("0px");

	const chartSize = 200;
	const radius = chartSize / 2 - 20;
	const innerRadius = radius * 0.64;

	function createChart() {
		if (!chartContainer || !mounted) return;

		select(chartContainer).selectAll("*").remove();

		const svg = select(chartContainer)
			.append("svg")
			.attr("width", chartSize)
			.attr("height", chartSize)
			.attr("viewBox", `0 0 ${chartSize} ${chartSize}`);

		const g = svg
			.append("g")
			.attr("transform", `translate(${chartSize / 2},${chartSize / 2})`);

		type ChartData = (typeof data)[0];
		type PieArcData = PieArcDatum<ChartData>;

		const pieGenerator = pie<ChartData>()
			.value((d: ChartData) => d.value)
			.sort(null)
			.startAngle(-Math.PI / 2)
			.endAngle(Math.PI * 1.5);

		const arcGenerator = arc<PieArcData>()
			.innerRadius(innerRadius)
			.outerRadius(radius)
			.cornerRadius(0)
			.padAngle(0.07);

		// Draw arcs with animation
		const arcs = g
			.selectAll<SVGPathElement, PieArcData>("path")
			.data(pieGenerator(data))
			.enter()
			.append("path")
			.attr("fill", (d: PieArcData) => d.data.color)
			.attr("d", arcGenerator)
			.style("cursor", "pointer");

		// Animate in
		arcs.each(function (this: SVGPathElement, d: PieArcData) {
			const path = select(this);
			const startAngle = d.startAngle;
			path.attr("d", arcGenerator({ ...d, endAngle: startAngle } as PieArcData));
		});

		arcs.transition()
			.duration(800)
			.delay((_: PieArcData, i: number) => i * 200)
			.attrTween("d", function (d: PieArcData) {
				const angleInterpolate = interpolate(d.startAngle, d.endAngle);
				return (t: number) =>
					arcGenerator({ ...d, endAngle: angleInterpolate(t) } as PieArcData) || "";
			});

		// Hover effects - smooth opacity transition with slight scale
		arcs.on(
			"mouseenter",
			function (this: SVGPathElement, event: MouseEvent, d: PieArcData) {
				select(this)
					.transition()
					.duration(200)
					.ease(easeQuadOut)
					.attr("opacity", 0.85)
					.attr("transform", "scale(1.02)");

				showTooltip(event, `${d.data.label}: ${d.data.value}%`);
			},
		)
			.on(
				"mousemove",
				function (
					this: SVGPathElement,
					event: MouseEvent,
					d: PieArcData,
				) {
					showTooltip(event, `${d.data.label}: ${d.data.value}%`);
				},
			)
			.on("mouseleave", function (this: SVGPathElement) {
				select(this)
					.transition()
					.duration(200)
					.ease(easeQuadOut)
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

<Card class="h-130">
	<CardHeader class="p-4 lg:p-6">
		<CardTitle
			class="text-[18px] font-semibold leading-7 text-primary-black -tracking-[0.45px]"
			>Global Success Distribution</CardTitle
		>
		<CardDescription class="text-[#565D6D] max-w-100"
			>Comparing passed vs. failed outcomes across all High Schools.</CardDescription
		>
	</CardHeader>
	<CardContent class="flex flex-col items-center ">
		<div class="w-full flex items-center justify-center h-75!">
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
		</div>

		<div class=" grid w-full grid-cols-2 gap-4">
			{#each data as item, i (i)}
				<div
					class="flex flex-col items-center rounded-lg border border-gray-100 p-3 transition-colors bg-gray-50"
				>
					<span
						class={cn(
							"text-2xl font-inter font-bold",
							item.label === "Pass Rate"
								? "text-[#16A34A]"
								: "text-[#DD3C57]",
						)}>{item.value}%</span
					>
					<span
						class="text-xs uppercase tracking-[0.6px] font-normal text-[#565D6D]"
						>{item.label === "Pass Rate"
							? "PASS RATE"
							: "FAILURE"}</span
					>
				</div>
			{/each}
		</div>
	</CardContent>
</Card>
