<script lang="ts">
	import { onMount } from "svelte";
	import { select, pie, arc, easeQuadOut, interpolate } from "d3";
	import type { PieArcDatum } from "d3";
	import { ChartContainer } from "$lib/components/ui/chart-container";
	import { cn } from "$lib/utils";

	const data = [
		{ label: "Pass Rate", value: 86.7, color: "#67E491" },
		{ label: "Failure", value: 15.3, color: "#DD3C57" },
	];

	let chartContainerRef: ReturnType<typeof ChartContainer>;
	let chartElement: HTMLDivElement;
	let mounted = $state(false);

	const chartSize = 200;
	const radius = chartSize / 2 - 20;
	const innerRadius = radius * 0.64;

	function createChart() {
		if (!chartElement || !mounted) return;

		select(chartElement).selectAll("*").remove();

		const svg = select(chartElement)
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
			path.attr(
				"d",
				arcGenerator({ ...d, endAngle: startAngle } as PieArcData),
			);
		});

		arcs.transition()
			.duration(800)
			.delay((_: PieArcData, i: number) => i * 200)
			.attrTween("d", function (d: PieArcData) {
				const angleInterpolate = interpolate(d.startAngle, d.endAngle);
				return (t: number) =>
					arcGenerator({
						...d,
						endAngle: angleInterpolate(t),
					} as PieArcData) || "";
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

				chartContainerRef?.showTooltip(
					event,
					`${d.data.label}: ${d.data.value}%`,
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
					chartContainerRef?.showTooltip(
						event,
						`${d.data.label}: ${d.data.value}%`,
					);
				},
			)
			.on("mouseleave", function (this: SVGPathElement) {
				select(this)
					.transition()
					.duration(200)
					.ease(easeQuadOut)
					.attr("opacity", 1)
					.attr("transform", "scale(1)");

				chartContainerRef?.hideTooltip();
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

<ChartContainer
	bind:this={chartContainerRef}
	title="Global Success Distribution"
	description="Comparing passed vs. failed outcomes across all High Schools."
	cardClass="h-130"
	headerClass="p-4 lg:p-6"
	contentClass="flex flex-col items-center"
>
	{#snippet children()}
		<div class="w-full flex items-center justify-center h-75!">
			<div
				class="relative flex w-full items-center justify-center"
				style="height: {chartSize}px;"
			>
				<div
					bind:this={chartElement}
					style="width: {chartSize}px; height: {chartSize}px;"
				></div>
			</div>
		</div>
	{/snippet}

	{#snippet legend()}
		<div class="grid w-full grid-cols-2 gap-4">
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
						>{item.label === "Pass Rate" ? "PASS RATE" : "FAILURE"}</span
					>
				</div>
			{/each}
		</div>
	{/snippet}
</ChartContainer>
