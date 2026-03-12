<script lang="ts">
	import * as d3 from "d3";
	import { onMount } from "svelte";
	import type { EnrollmentByTradeData } from "./types.js";
	import { TRADE_COLORS } from "./types.js";

	interface Props {
		data?: EnrollmentByTradeData[];
	}

	const defaultData: EnrollmentByTradeData[] = [
		{ trade: "Software", enrollment: 480, color: TRADE_COLORS.Software },
		{ trade: "Mechanics", enrollment: 380, color: TRADE_COLORS.Mechanics },
		{ trade: "Automobile", enrollment: 320, color: TRADE_COLORS.Automobile },
		{ trade: "Tourism", enrollment: 520, color: TRADE_COLORS.Tourism },
		{ trade: "Electrical", enrollment: 420, color: TRADE_COLORS.Electrical },
		{ trade: "Road Construction", enrollment: 280, color: TRADE_COLORS["Road Construction"] },
	];

	let { data = defaultData }: Props = $props();

	let chartContainer: HTMLDivElement;
	let width = $state(0);
	let height = $state(0);
	let tooltipText = $state("");
	let tooltipX = $state(0);
	let tooltipY = $state(0);
	let tooltipVisible = $state(false);

	function createChart() {
		if (!chartContainer || width === 0 || height === 0) return;

		d3.select(chartContainer).selectAll("*").remove();

		// Responsive margins and padding
		const isMobile = width < 400;
		const isSmall = width < 600;
		const margin = {
			top: 10,
			right: isMobile ? 10 : 20,
			left: isMobile ? 30 : 40,
			bottom: isMobile ? 60 : 50
		};
		const innerWidth = width - margin.left - margin.right;
		const innerHeight = height - margin.top - margin.bottom;

		const svg = d3
			.select(chartContainer)
			.append("svg")
			.attr("width", width)
			.attr("height", height);

		const g = svg
			.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

		const yMax = 600;
		const yTickValues = [0, 150, 300, 450, 600];

		// Use abbreviated labels on mobile
		const getLabel = (trade: string) => {
			if (isMobile) {
				const abbrevMap: Record<string, string> = {
					"Software": "Soft.",
					"Mechanics": "Mech.",
					"Automobile": "Auto.",
					"Tourism": "Tour.",
					"Electrical": "Elec.",
					"Road Construction": "Road C."
				};
				return abbrevMap[trade] || trade;
			}
			return trade === "Road Construction" ? "Road Const." : trade;
		};

		// Scales - increase padding on smaller screens
		const padding = isMobile ? 0.5 : isSmall ? 0.4 : 0.3;
		const xScale = d3
			.scaleBand()
			.domain(data.map((d) => getLabel(d.trade)))
			.range([0, innerWidth])
			.padding(padding);

		const yScale = d3.scaleLinear().domain([0, yMax]).range([innerHeight, 0]);

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
		// Limit bar width on small screens
		const maxBarWidth = isMobile ? 35 : 60;
		const barWidth = Math.min(xScale.bandwidth(), maxBarWidth);
		const barOffset = (xScale.bandwidth() - barWidth) / 2;
		const cornerRadius = isMobile ? 3 : 4;

		const bars = g
			.selectAll<SVGPathElement, EnrollmentByTradeData>(".bar")
			.data(data)
			.enter()
			.append("path")
			.attr("class", "bar")
			.attr("fill", (d: EnrollmentByTradeData) => d.color)
			.style("cursor", "pointer")
			.attr("d", (d: EnrollmentByTradeData) => {
				const label = getLabel(d.trade);
				const x = (xScale(label) || 0) + barOffset;
				return `M${x},${innerHeight} L${x},${innerHeight} L${x + barWidth},${innerHeight} L${x + barWidth},${innerHeight} Z`;
			});

		bars.transition()
			.duration(800)
			.delay((_: EnrollmentByTradeData, i: number) => i * 100)
			.attr("d", (d: EnrollmentByTradeData) => {
				const label = getLabel(d.trade);
				const x = (xScale(label) || 0) + barOffset;
				const y = yScale(d.enrollment);
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
				d: EnrollmentByTradeData,
			) {
				d3.select(this)
					.transition()
					.duration(200)
					.ease(d3.easeQuadOut)
					.attr("opacity", 0.8);

				showTooltip(
					event,
					`${d.trade}: ${d.enrollment.toLocaleString()} students`,
				);
			},
		)
			.on(
				"mousemove",
				function (
					this: SVGPathElement,
					event: MouseEvent,
					d: EnrollmentByTradeData,
				) {
					showTooltip(
						event,
						`${d.trade}: ${d.enrollment.toLocaleString()} students`,
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

		// X Axis
		const xAxis = g
			.append("g")
			.attr("transform", `translate(0,${innerHeight})`)
			.call(d3.axisBottom(xScale).tickSize(0));

		xAxis.select(".domain").remove();

		// Style x-axis labels - rotate on mobile for better readability
		if (isMobile) {
			xAxis
				.selectAll("text")
				.attr("fill", "#565D6D")
				.attr("font-size", "10px")
				.attr("text-anchor", "end")
				.attr("dx", "-0.5em")
				.attr("dy", "0.5em")
				.attr("transform", "rotate(-35)");
		} else {
			xAxis
				.selectAll("text")
				.attr("fill", "#565D6D")
				.attr("font-size", isSmall ? "10px" : "12px")
				.attr("dy", "1.5em");
		}

		// Y Axis
		const yAxis = g.append("g").call(
			d3
				.axisLeft(yScale)
				.tickValues(yTickValues)
				.tickFormat((d) => d.toString())
				.tickSize(0),
		);

		yAxis.select(".domain").remove();
		yAxis
			.selectAll("text")
			.attr("fill", "#565D6D")
			.attr("font-size", isMobile ? "10px" : "12px")
			.attr("dx", "-0.5em");
	}

	function showTooltip(event: MouseEvent, text: string) {
		tooltipText = text;
		tooltipX = event.offsetX + 10;
		tooltipY = event.offsetY - 30;
		tooltipVisible = true;
	}

	function hideTooltip() {
		tooltipVisible = false;
	}

	onMount(() => {
		const resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				width = entry.contentRect.width;
				height = entry.contentRect.height;
				createChart();
			}
		});

		if (chartContainer) {
			resizeObserver.observe(chartContainer);
		}

		return () => resizeObserver.disconnect();
	});

	$effect(() => {
		if (width > 0 && height > 0) {
			createChart();
		}
	});
</script>

<div class="flex flex-col h-full">
	<div class="mb-4">
		<h3 class="text-lg font-semibold text-primary-black">Enrollment by Trade</h3>
		<p class="text-sm text-gray-500 mt-1">Aggregate student count per technical specialization.</p>
	</div>

	<div class="relative flex-1">
		<div
			bind:this={chartContainer}
			class="w-full h-full"
		></div>

		<!-- Tooltip -->
		<div
			class="pointer-events-none absolute z-20 rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg transition-opacity duration-150"
			style="opacity: {tooltipVisible
				? 1
				: 0}; left: {tooltipX}px; top: {tooltipY}px; transform: translate(0, -100%);"
		>
			{tooltipText}
			<div
				class="absolute left-2 top-full border-4 border-transparent border-t-gray-900"
			></div>
		</div>
	</div>
</div>
