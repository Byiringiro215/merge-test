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
	import type { ScoreDistribution } from "./types.js";

	const defaultData: ScoreDistribution[] = [
		{ range: "0-20", count: 450 },
		{ range: "21-40", count: 1200 },
		{ range: "41-60", count: 3000 },
		{ range: "61-80", count: 4800 },
		{ range: "81-100", count: 2900 },
	];

	interface Props {
		data?: ScoreDistribution[];
	}

	let { data = defaultData }: Props = $props();

	let chartContainerRef: ReturnType<typeof ChartContainer>;
	const height = 400;

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

	function createChart(container: HTMLDivElement, width: number) {
		if (!container || width === 0) return;

		select(container).selectAll("*").remove();

		const tooltip = chartContainerRef?.getTooltipElement();

		const margin = { top: 10, right: 20, left: 40, bottom: 30 };
		const innerWidth = width - margin.left - margin.right;
		const innerHeight = height - margin.top - margin.bottom;

		const svg = select(container)
			.append("svg")
			.attr("width", width)
			.attr("height", height);

		const g = svg
			.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

		// Scales
		const xScale = scaleBand()
			.domain(data.map((d) => d.range))
			.range([0, innerWidth])
			.padding(0.4);

		const yMax = 4800;
		const yTickValues = [0, 1200, 2400, 3600, 4800];

		const yScale = scaleLinear().domain([0, yMax]).range([innerHeight, 0]);

		// Grid lines
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

		// Draw bars with animation - rounded top corners only
		const barWidth = xScale.bandwidth();
		const cornerRadius = 6;

		const bars = g
			.selectAll<SVGPathElement, ScoreDistribution>(".bar")
			.data(data)
			.enter()
			.append("path")
			.attr("class", "bar")
			.attr("fill", "#205fad")
			.style("cursor", "pointer")
			.attr("d", (d: ScoreDistribution) => {
				const x = xScale(d.range) || 0;
				return `M${x},${innerHeight} L${x},${innerHeight} L${x + barWidth},${innerHeight} L${x + barWidth},${innerHeight} Z`;
			});

		bars.transition()
			.duration(800)
			.delay((_: ScoreDistribution, i: number) => i * 100)
			.attr("d", (d: ScoreDistribution) => {
				const x = xScale(d.range) || 0;
				const y = yScale(d.count);
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
			"pointerenter",
			function (
				this: SVGPathElement,
				event: PointerEvent,
				d: ScoreDistribution,
			) {
				select(this)
					.transition()
					.duration(200)
					.ease(easeQuadOut)
					.attr("fill", "#1a4d8c")
					.attr("opacity", 0.9);

				if (!tooltip) return;
				showTooltip(
					tooltip,
					container,
					event,
					`${d.range}: ${d.count.toLocaleString()} students`,
				);
			},
		)
			.on(
				"pointermove",
				function (
					this: SVGPathElement,
					event: PointerEvent,
					d: ScoreDistribution,
				) {
					if (!tooltip) return;
					showTooltip(
						tooltip,
						container,
						event,
						`${d.range}: ${d.count.toLocaleString()} students`,
					);
				},
			)
			.on("pointerleave", function (this: SVGPathElement) {
				select(this)
					.transition()
					.duration(200)
					.ease(easeQuadOut)
					.attr("fill", "#205fad")
					.attr("opacity", 1);

				if (!tooltip) return;
				hideTooltip(tooltip);
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

<ChartContainer
	bind:this={chartContainerRef}
	title="Score Distribution"
	description="Frequency of students across academic score ranges"
	{height}
	cardClass="h-full"
	headerClass="px-4 pb-2 pt-4 lg:px-6 lg:pt-5"
	contentClass="px-4 pb-4 pt-0 lg:px-6 lg:pb-5"
	onResize={createChart}
/>
