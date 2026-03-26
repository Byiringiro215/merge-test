<script lang="ts">
	import { ChartContainer } from "$lib/components/ui/chart-container";
	import ChartLegend from "$lib/components/ui/chart-container/chart-legend.svelte";
	import { scaleBand, scaleLinear, select, easeQuadOut, axisLeft } from "d3";

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

	let chartContainerRef: ReturnType<typeof ChartContainer>;
	const height = 300;

	function createChart(container: HTMLDivElement, width: number) {
		if (!container || width === 0) return;

		select(container).selectAll("*").remove();

		const margin = { top: 10, right: 30, left: 80, bottom: 20 };
		const innerWidth = width - margin.left - margin.right;
		const innerHeight = height - margin.top - margin.bottom;

		const svg = select(container)
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

					chartContainerRef?.showTooltip(
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
					chartContainerRef?.showTooltip(
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

				chartContainerRef?.hideTooltip();
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

					chartContainerRef?.showTooltip(
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
					chartContainerRef?.showTooltip(
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

				chartContainerRef?.hideTooltip();
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

	const legendItems = [
		{ label: "District Success Rate", color: "#EB8B47" },
		{ label: "Active High Schools", color: "#205FAD" },
	];
</script>

<ChartContainer
	bind:this={chartContainerRef}
	title="District Contributions"
	description="High School count and performance levels by district."
	{height}
	cardClass="py-6"
	headerClass="px-6 pb-3"
	contentClass="px-6"
	onResize={createChart}
>
	{#snippet legend()}
		<ChartLegend items={legendItems} shape="circle" size="md" />
	{/snippet}
</ChartContainer>
