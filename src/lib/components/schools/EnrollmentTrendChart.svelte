<script lang="ts">
	import { ChartContainer } from "$lib/components/ui/chart-container";
	import {
		select,
		scaleBand,
		scaleLinear,
		easeQuadOut,
		axisBottom,
		axisLeft,
	} from "d3";
	import TrendingUpIcon from "@lucide/svelte/icons/trending-up";
	import type { EnrollmentData } from "./types.js";
	import { CHART_COLORS } from "./types.js";

	interface Props {
		data?: EnrollmentData[];
	}

	const defaultData: EnrollmentData[] = [
		{ district: "Kicukiro", students: 4200 },
		{ district: "Nyamagabe", students: 3100 },
		{ district: "Rubavu", students: 2800 },
		{ district: "Ngororero", students: 2200 },
		{ district: "Gasabo", students: 5100 },
	];

	let { data = defaultData }: Props = $props();

	let chartContainerRef: ReturnType<typeof ChartContainer>;
	const height = 280;

	function createChart(container: HTMLDivElement, width: number) {
		if (!container || width === 0) return;

		select(container).selectAll("*").remove();

		const margin = { top: 20, right: 20, left: 45, bottom: 40 };
		const innerWidth = width - margin.left - margin.right;
		const innerHeight = height - margin.top - margin.bottom;

		const svg = select(container)
			.append("svg")
			.attr("width", width)
			.attr("height", height);

		const g = svg
			.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

		const yMax = 6000;
		const yTickValues = [0, 1500, 3000, 4500, 6000];

		// Scales
		const xScale = scaleBand()
			.domain(data.map((d) => d.district))
			.range([0, innerWidth])
			.padding(0.4);

		const yScale = scaleLinear().domain([0, yMax]).range([innerHeight, 0]);

		// Y-axis grid lines
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

		// Draw bars with rounded top corners
		const barWidth = xScale.bandwidth();
		const cornerRadius = 6;

		const bars = g
			.selectAll<SVGPathElement, EnrollmentData>(".bar")
			.data(data)
			.enter()
			.append("path")
			.attr("class", "bar")
			.attr("fill", CHART_COLORS.enrollment)
			.style("cursor", "pointer")
			.attr("d", (d: EnrollmentData) => {
				const x = xScale(d.district) || 0;
				return `M${x},${innerHeight} L${x},${innerHeight} L${x + barWidth},${innerHeight} L${x + barWidth},${innerHeight} Z`;
			});

		bars.transition()
			.duration(800)
			.delay((_: EnrollmentData, i: number) => i * 100)
			.attr("d", (d: EnrollmentData) => {
				const x = xScale(d.district) || 0;
				const y = yScale(d.students);
				const h = innerHeight - y;
				const r = Math.min(cornerRadius, h / 2, barWidth / 2);
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
				d: EnrollmentData,
			) {
				select(this)
					.transition()
					.duration(200)
					.ease(easeQuadOut)
					.attr("fill", CHART_COLORS.enrollmentHover)
					.attr("opacity", 0.9);

				chartContainerRef?.showTooltip(
					event,
					`${d.district}: ${d.students.toLocaleString()} students`,
				);
			},
		)
			.on(
				"mousemove",
				function (
					this: SVGPathElement,
					event: MouseEvent,
					d: EnrollmentData,
				) {
					chartContainerRef?.showTooltip(
						event,
						`${d.district}: ${d.students.toLocaleString()} students`,
					);
				},
			)
			.on("mouseleave", function (this: SVGPathElement) {
				select(this)
					.transition()
					.duration(200)
					.ease(easeQuadOut)
					.attr("fill", CHART_COLORS.enrollment)
					.attr("opacity", 1);

				chartContainerRef?.hideTooltip();
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
			axisLeft(yScale)
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
</script>

<div class="flex flex-col h-full">
	<div class="flex items-center gap-2 mb-4">
		<TrendingUpIcon class="h-5 w-5 text-primary" />
		<h3 class="text-base font-semibold text-gray-900">
			Student Enrollment Trend per District
		</h3>
	</div>

	<ChartContainer
		bind:this={chartContainerRef}
		{height}
		bare
		onResize={createChart}
	/>
</div>
