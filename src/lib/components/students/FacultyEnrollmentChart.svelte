<script lang="ts">
	import { onMount } from "svelte";
	import { select, pie, arc, easeQuadOut, interpolate } from "d3";
	import type { PieArcDatum } from "d3";
	import { ChartContainer } from "$lib/components/ui/chart-container";
	import ChartLegend from "$lib/components/ui/chart-container/chart-legend.svelte";
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

	let chartContainerRef: ReturnType<typeof ChartContainer>;
	let chartElement: HTMLDivElement;
	let mounted = $state(false);

	const chartSize = 200;
	const radius = chartSize / 2;
	const innerRadius = radius * 0.55;

	function showTooltip(
		tooltip: HTMLDivElement,
		container: HTMLDivElement,
		event: PointerEvent,
		content: string,
	) {
		const rect = container.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;

		tooltip.textContent = content;
		tooltip.style.left = `${x + 12}px`;
		tooltip.style.top = `${y - 12}px`;
		tooltip.style.display = "block";
	}

	function hideTooltip(tooltip: HTMLDivElement) {
		tooltip.style.display = "none";
	}

	function createChart() {
		if (!chartElement || !mounted) return;

		select(chartElement).selectAll("*").remove();

		const tooltip = chartContainerRef?.getTooltipElement();

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
			.value((d: ChartData) => d.count)
			.sort(null)
			.startAngle(-Math.PI / 2)
			.endAngle(Math.PI * 1.5);

		const arcGenerator = arc<PieArcData>()
			.innerRadius(innerRadius)
			.outerRadius(radius)
			.cornerRadius(4)
			.padAngle(0.02);

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
			.delay((_: PieArcData, i: number) => i * 100)
			.attrTween("d", function (d: PieArcData) {
				const angleInterpolate = interpolate(d.startAngle, d.endAngle);
				return (t: number) =>
					arcGenerator({
						...d,
						endAngle: angleInterpolate(t),
					} as PieArcData) || "";
			});

		// Hover effects
		arcs.on(
			"pointerenter",
			function (this: SVGPathElement, event: PointerEvent, d: PieArcData) {
				select(this)
					.transition()
					.duration(200)
					.ease(easeQuadOut)
					.attr("opacity", 0.75);

				if (!tooltip) return;

				const total = data.reduce((sum, item) => sum + item.count, 0);
				const percent = ((d.data.count / total) * 100).toFixed(1);
				showTooltip(
					tooltip,
					chartElement,
					event,
					`${d.data.faculty}: ${d.data.count.toLocaleString()} (${percent}%)`,
				);
			},
		)
			.on(
				"pointermove",
				function (
					this: SVGPathElement,
					event: PointerEvent,
					d: PieArcData,
				) {
					if (!tooltip) return;

					const total = data.reduce(
						(sum, item) => sum + item.count,
						0,
					);
					const percent = ((d.data.count / total) * 100).toFixed(1);
					showTooltip(
						tooltip,
						chartElement,
						event,
						`${d.data.faculty}: ${d.data.count.toLocaleString()} (${percent}%)`,
					);
				},
			)
			.on("pointerleave", function (this: SVGPathElement) {
				select(this)
					.transition()
					.duration(200)
					.ease(easeQuadOut)
					.attr("opacity", 1);

				if (!tooltip) return;
				hideTooltip(tooltip);
			});
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

	// Legend items for ChartLegend component
	const legendItems = data.map((item) => ({
		label: item.faculty,
		color: item.color,
	}));
</script>

<ChartContainer
	bind:this={chartContainerRef}
	title="Faculty Enrollment"
	description="Breakdown by specialized vocational tracks"
	cardClass="h-full"
	headerClass="p-4 lg:p-6"
	contentClass="p-4 pt-0 lg:p-6 lg:pt-0"
>
	{#snippet children()}
		<div class="flex flex-col items-center">
			<!-- Donut Chart -->
			<div
				class="shrink-0"
				bind:this={chartElement}
				style="width: {chartSize}px; height: {chartSize}px;"
			></div>
		</div>
	{/snippet}

	{#snippet legend()}
		<ChartLegend
			items={legendItems}
			direction="vertical"
			shape="circle"
			size="md"
		/>
	{/snippet}
</ChartContainer>
