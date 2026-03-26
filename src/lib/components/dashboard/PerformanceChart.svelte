<script lang="ts">
	import { ChartContainer } from "$lib/components/ui/chart-container";
	import ChartLegend from "$lib/components/ui/chart-container/chart-legend.svelte";
	import {
		select,
		scalePoint,
		scaleLinear,
		area,
		curveMonotoneX,
		line,
		easeElasticOut,
		easeQuadOut,
		axisBottom,
		axisLeft,
		axisRight,
	} from "d3";
	import type { NumberValue } from "d3";

	interface DataPoint {
		month: string;
		students: number;
		avgScore: number;
	}

	// Data adjusted so area (students) appears below the line (score)
	const data: DataPoint[] = [
		{ month: "Jan", students: 450, avgScore: 68 },
		{ month: "Feb", students: 520, avgScore: 71 },
		{ month: "Mar", students: 980, avgScore: 99 },
		{ month: "Apr", students: 650, avgScore: 75 },
		{ month: "May", students: 800, avgScore: 82 },
		{ month: "Jun", students: 780, avgScore: 85 },
	];

	let chartContainerRef: ReturnType<typeof ChartContainer>;
	const height = 300;

	function createChart(container: HTMLDivElement, width: number) {
		if (!container || width === 0) return;

		select(container).selectAll("*").remove();

		const margin = { top: 20, right: 50, left: 40, bottom: 50 };
		const innerWidth = width - margin.left - margin.right;
		const innerHeight = height - margin.top - margin.bottom;

		const svg = select(container)
			.append("svg")
			.attr("width", width)
			.attr("height", height);

		// Create gradient for area fill (very light mint green, matching design)
		const defs = svg.append("defs");
		const gradient = defs
			.append("linearGradient")
			.attr("id", "areaGradient")
			.attr("x1", "0%")
			.attr("y1", "0%")
			.attr("x2", "0%")
			.attr("y2", "100%");

		gradient
			.append("stop")
			.attr("offset", "0%")
			.attr("stop-color", "#bbf7d0")
			.attr("stop-opacity", 0.7);

		gradient
			.append("stop")
			.attr("offset", "100%")
			.attr("stop-color", "#ecfdf5")
			.attr("stop-opacity", 0.2);

		const g = svg
			.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

		// Scales - X scale with padding to extend area to edges
		const xScale = scalePoint()
			.domain(data.map((d) => d.month))
			.range([0, innerWidth])
			.padding(0);

		const yScaleStudents = scaleLinear()
			.domain([0, 1000])
			.range([innerHeight, 0]);

		const yScaleScore = scaleLinear()
			.domain([0, 100])
			.range([innerHeight, 0]);

		// Grid lines (dashed, matching score scale: 0, 25, 50, 75, 100)
		g.append("g")
			.attr("class", "grid")
			.selectAll("line")
			.data([0, 25, 50, 75, 100])
			.enter()
			.append("line")
			.attr("x1", 0)
			.attr("x2", innerWidth)
			.attr("y1", (d: number) => yScaleScore(d))
			.attr("y2", (d: number) => yScaleScore(d))
			.attr("stroke", "#e2e8f0")
			.attr("stroke-dasharray", "4,4")
			.attr("stroke-width", 1);

		// Draw area for students (mint green gradient)
		const areaGenerator = area<DataPoint>()
			.x((d) => xScale(d.month) || 0)
			.y0(innerHeight)
			.y1((d) => yScaleStudents(d.students))
			.curve(curveMonotoneX);

		const areaPath = g
			.append("path")
			.datum(data)
			.attr("fill", "url(#areaGradient)")
			.attr("d", areaGenerator)
			.attr("opacity", 0)
			.style("cursor", "pointer")
			.style("transition", "opacity 0.15s ease");

		// Animate area fade in
		areaPath.transition().duration(800).attr("opacity", 1);

		// Area hover effect
		areaPath
			.on("mouseenter", function () {
				select(this).attr("opacity", 0.85);
			})
			.on("mouseleave", function () {
				select(this).attr("opacity", 1);
			});

		// Draw line for avg score (blue)
		const lineGenerator = line<DataPoint>()
			.x((d) => xScale(d.month) || 0)
			.y((d) => yScaleScore(d.avgScore))
			.curve(curveMonotoneX);

		const linePath = g
			.append("path")
			.datum(data)
			.attr("fill", "none")
			.attr("stroke", "#3b82f6")
			.attr("stroke-width", 2.5)
			.attr("d", lineGenerator)
			.style("transition", "stroke-width 0.15s ease");

		// Animate line
		const totalLength = linePath.node()?.getTotalLength() || 0;
		linePath
			.attr("stroke-dasharray", `${totalLength} ${totalLength}`)
			.attr("stroke-dashoffset", totalLength)
			.transition()
			.duration(1200)
			.delay(400)
			.attr("stroke-dashoffset", 0);

		// Line hover effect
		linePath
			.on("mouseenter", function () {
				select(this).attr("stroke-width", 3.5);
			})
			.on("mouseleave", function () {
				select(this).attr("stroke-width", 2.5);
			});

		// Draw interactive dots for score line
		const dots = g
			.selectAll<SVGCircleElement, DataPoint>(".dot")
			.data(data)
			.enter()
			.append("circle")
			.attr("class", "dot")
			.attr("cx", (d: DataPoint) => xScale(d.month) || 0)
			.attr("cy", (d: DataPoint) => yScaleScore(d.avgScore))
			.attr("r", 0)
			.attr("fill", "#3b82f6")
			.attr("stroke", "white")
			.attr("stroke-width", 2)
			.style("cursor", "pointer");

		// Animate dots
		dots.transition()
			.duration(400)
			.delay((_: DataPoint, i: number) => 800 + i * 100)
			.attr("r", 6);

		// Dot hover effects with smooth animation
		dots.on(
			"mouseenter",
			function (this: SVGCircleElement, event: MouseEvent, d: DataPoint) {
				select(this)
					.transition()
					.duration(200)
					.ease(easeElasticOut.amplitude(1).period(0.5))
					.attr("r", 9)
					.attr("fill", "#2563eb");

				chartContainerRef?.showTooltip(
					event,
					`${d.month}: ${d.avgScore}% avg score, ${d.students} students`,
				);
			},
		).on("mouseleave", function (this: SVGCircleElement) {
			select(this)
				.transition()
				.duration(200)
				.ease(easeQuadOut)
				.attr("r", 6)
				.attr("fill", "#3b82f6");

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
			.attr("fill", "#64748b")
			.attr("font-size", "12px")
			.attr("dy", "1em");

		// Left Y Axis (Score %)
		const yAxisLeft = g.append("g").call(
			axisLeft(yScaleScore)
				.tickValues([0, 25, 50, 75, 100])
				.tickSize(0)
				.tickFormat((d: NumberValue) => `${d}`),
		);

		yAxisLeft.select(".domain").remove();
		yAxisLeft
			.selectAll("text")
			.attr("fill", "#64748b")
			.attr("font-size", "12px")
			.attr("dx", "-0.5em");

		// Right Y Axis (Students)
		const yAxisRight = g
			.append("g")
			.attr("transform", `translate(${innerWidth},0)`)
			.call(
				axisRight(yScaleStudents)
					.tickValues([0, 250, 500, 750, 1000])
					.tickSize(0),
			);

		yAxisRight.select(".domain").remove();
		yAxisRight
			.selectAll("text")
			.attr("fill", "#64748b")
			.attr("font-size", "12px")
			.attr("dx", "0.5em");
	}

	const legendItems = [
		{ label: "Total Students", color: "#86efac" },
		{ label: "Avg Score (%)", color: "#3b82f6" },
	];
</script>

<ChartContainer
	bind:this={chartContainerRef}
	title="Overall Performance & Enrollment"
	description="Visualizing student growth and average grades across all faculties."
	{height}
	cardClass="h-130 "
	headerClass="p-4 lg:p-6"
	contentClass="px-0 lg:px-6"
	onResize={createChart}
>
	{#snippet legend()}
		<ChartLegend items={legendItems} shape="square" size="md" />
	{/snippet}
</ChartContainer>
