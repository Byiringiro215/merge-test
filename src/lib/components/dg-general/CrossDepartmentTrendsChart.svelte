<script lang="ts">
	import { ChartContainer } from "$lib/components/ui/chart-container";
	import * as Select from "$lib/components/ui/select";
	import {
		select,
		scalePoint,
		scaleLinear,
		area,
		curveMonotoneX,
		line,
		axisBottom,
		axisLeft,
	} from "d3";
	import type { NumberValue } from "d3";

	interface DataPoint {
		month: string;
		value: number;
	}

	const data: DataPoint[] = [
		{ month: "Jan", value: 380 },
		{ month: "Feb", value: 420 },
		{ month: "Mar", value: 400 },
		{ month: "Apr", value: 450 },
		{ month: "May", value: 460 },
		{ month: "Jun", value: 480 },
		{ month: "Jul", value: 470 },
		{ month: "Aug", value: 490 },
		{ month: "Sep", value: 485 },
	];

	let chartContainerRef: ReturnType<typeof ChartContainer>;
	const height = 320;

	let selectedMetric = $state("students");
	let selectedPeriod = $state("2024");

	const metricOptions = [
		{ value: "students", label: "Total Students" },
		{ value: "teachers", label: "Total Teachers" },
		{ value: "schools", label: "Total Schools" },
	];

	const periodOptions = [
		{ value: "2024", label: "2024" },
		{ value: "2023", label: "2023" },
		{ value: "2022", label: "2022" },
	];

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

		const margin = { top: 20, right: 20, left: 45, bottom: 40 };
		const innerWidth = width - margin.left - margin.right;
		const innerHeight = height - margin.top - margin.bottom;

		const svg = select(container)
			.append("svg")
			.attr("width", width)
			.attr("height", height);

		// Create gradient for area fill
		const defs = svg.append("defs");
		const gradient = defs
			.append("linearGradient")
			.attr("id", "trendAreaGradient")
			.attr("x1", "0%")
			.attr("y1", "0%")
			.attr("x2", "0%")
			.attr("y2", "100%");

		gradient
			.append("stop")
			.attr("offset", "0%")
			.attr("stop-color", "#3B82F6")
			.attr("stop-opacity", 0.3);

		gradient
			.append("stop")
			.attr("offset", "100%")
			.attr("stop-color", "#3B82F6")
			.attr("stop-opacity", 0.05);

		const g = svg
			.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

		// Scales
		const xScale = scalePoint()
			.domain(data.map((d) => d.month))
			.range([0, innerWidth])
			.padding(0.1);

		const yScale = scaleLinear().domain([0, 600]).range([innerHeight, 0]);

		// Grid lines
		g.append("g")
			.attr("class", "grid")
			.selectAll("line")
			.data([0, 150, 300, 450, 600])
			.enter()
			.append("line")
			.attr("x1", 0)
			.attr("x2", innerWidth)
			.attr("y1", (d: number) => yScale(d))
			.attr("y2", (d: number) => yScale(d))
			.attr("stroke", "#e2e8f0")
			.attr("stroke-dasharray", "4,4")
			.attr("stroke-width", 1);

		// Draw area
		const areaGenerator = area<DataPoint>()
			.x((d) => xScale(d.month) || 0)
			.y0(innerHeight)
			.y1((d) => yScale(d.value))
			.curve(curveMonotoneX);

		const areaPath = g
			.append("path")
			.datum(data)
			.attr("fill", "url(#trendAreaGradient)")
			.attr("d", areaGenerator)
			.attr("opacity", 0);

		// Animate area fade in
		areaPath.transition().duration(800).attr("opacity", 1);

		// Draw line
		const lineGenerator = line<DataPoint>()
			.x((d) => xScale(d.month) || 0)
			.y((d) => yScale(d.value))
			.curve(curveMonotoneX);

		const linePath = g
			.append("path")
			.datum(data)
			.attr("fill", "none")
			.attr("stroke", "#3B82F6")
			.attr("stroke-width", 2.5)
			.attr("d", lineGenerator);

		// Animate line
		const totalLength = linePath.node()?.getTotalLength() || 0;
		linePath
			.attr("stroke-dasharray", `${totalLength} ${totalLength}`)
			.attr("stroke-dashoffset", totalLength)
			.transition()
			.duration(1200)
			.delay(400)
			.attr("stroke-dashoffset", 0);

		// Draw dots
		const dots = g
			.selectAll<SVGCircleElement, DataPoint>(".dot")
			.data(data)
			.enter()
			.append("circle")
			.attr("class", "dot")
			.attr("cx", (d: DataPoint) => xScale(d.month) || 0)
			.attr("cy", (d: DataPoint) => yScale(d.value))
			.attr("r", 0)
			.attr("fill", "#3B82F6")
			.attr("stroke", "white")
			.attr("stroke-width", 2)
			.style("cursor", "pointer");

		// Animate dots
		dots.transition()
			.duration(400)
			.delay((_: DataPoint, i: number) => 800 + i * 100)
			.attr("r", 5);

		// Dot hover effects
		dots.on(
			"pointerenter",
			function (
				this: SVGCircleElement,
				event: PointerEvent,
				d: DataPoint,
			) {
				select(this).transition().duration(200).attr("r", 8);

				if (!tooltip) return;
				showTooltip(
					tooltip,
					container,
					event,
					`${d.month}: ${d.value}`,
				);
			},
		)
			.on(
				"pointermove",
				function (
					this: SVGCircleElement,
					event: PointerEvent,
					d: DataPoint,
				) {
					if (!tooltip) return;
					showTooltip(
						tooltip,
						container,
						event,
						`${d.month}: ${d.value}`,
					);
				},
			)
			.on("pointerleave", function (this: SVGCircleElement) {
				select(this).transition().duration(200).attr("r", 5);

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
			.attr("fill", "#64748b")
			.attr("font-size", "12px")
			.attr("dy", "1em");

		// Y Axis
		const yAxis = g.append("g").call(
			axisLeft(yScale)
				.tickValues([0, 150, 300, 450, 600])
				.tickSize(0)
				.tickFormat((d: NumberValue) => `${d}`),
		);

		yAxis.select(".domain").remove();
		yAxis
			.selectAll("text")
			.attr("fill", "#64748b")
			.attr("font-size", "12px")
			.attr("dx", "-0.5em");
	}
</script>

<ChartContainer
	bind:this={chartContainerRef}
	title="Cross-Department Trends"
	description="Temporal analysis of key metrics"
	{height}
	cardClass="h-full"
	headerClass="p-4 lg:p-5"
	contentClass="px-0 lg:px-4"
	onResize={createChart}
>
	{#snippet action()}
		<div class="flex gap-2">
			<Select.Root
				type="single"
				value={selectedMetric}
				onValueChange={(v) => v && (selectedMetric = v)}
			>
				<Select.Trigger class="w-35 h-9 text-xs">
					<span class="flex-1 text-left truncate">
						{metricOptions.find((o) => o.value === selectedMetric)
							?.label || "Select metric"}
					</span>
				</Select.Trigger>
				<Select.Content>
					{#each metricOptions as option (option.value)}
						<Select.Item
							value={option.value}
							label={option.label}
						/>
					{/each}
				</Select.Content>
			</Select.Root>

			<Select.Root
				type="single"
				value={selectedPeriod}
				onValueChange={(v) => v && (selectedPeriod = v)}
			>
				<Select.Trigger class="w-full h-9 text-xs">
					<span class="flex-1 text-left truncate">
						{periodOptions.find((o) => o.value === selectedPeriod)
							?.label || "Year"}
					</span>
				</Select.Trigger>
				<Select.Content>
					{#each periodOptions as option (option.value)}
						<Select.Item
							value={option.value}
							label={option.label}
						/>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
	{/snippet}
</ChartContainer>
