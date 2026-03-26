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
	import type { EnrollmentByTradeData } from "./types.js";
	import { TRADE_COLORS } from "./types.js";

	interface Props {
		data?: EnrollmentByTradeData[];
	}

	const defaultData: EnrollmentByTradeData[] = [
		{ trade: "Software", enrollment: 480, color: TRADE_COLORS.Software },
		{ trade: "Mechanics", enrollment: 380, color: TRADE_COLORS.Mechanics },
		{
			trade: "Automobile",
			enrollment: 320,
			color: TRADE_COLORS.Automobile,
		},
		{ trade: "Tourism", enrollment: 520, color: TRADE_COLORS.Tourism },
		{
			trade: "Electrical",
			enrollment: 420,
			color: TRADE_COLORS.Electrical,
		},
		{
			trade: "Road Construction",
			enrollment: 280,
			color: TRADE_COLORS["Road Construction"],
		},
	];

	let { data = defaultData }: Props = $props();

	let chartContainerRef: ReturnType<typeof ChartContainer>;

	function createChart(
		container: HTMLDivElement,
		width: number,
		height: number,
	) {
		if (!container || width === 0 || height === 0) return;

		select(container).selectAll("*").remove();

		// Responsive margins and padding
		const isMobile = width < 400;
		const isSmall = width < 600;
		const margin = {
			top: 10,
			right: isMobile ? 10 : 20,
			left: isMobile ? 30 : 40,
			bottom: isMobile ? 60 : 50,
		};
		const innerWidth = width - margin.left - margin.right;
		const innerHeight = height - margin.top - margin.bottom;

		const svg = select(container)
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
					Software: "Soft.",
					Mechanics: "Mech.",
					Automobile: "Auto.",
					Tourism: "Tour.",
					Electrical: "Elec.",
					"Road Construction": "Road C.",
				};
				return abbrevMap[trade] || trade;
			}
			return trade === "Road Construction" ? "Road Const." : trade;
		};

		// Scales - increase padding on smaller screens
		const padding = isMobile ? 0.5 : isSmall ? 0.4 : 0.3;
		const xScale = scaleBand()
			.domain(data.map((d) => getLabel(d.trade)))
			.range([0, innerWidth])
			.padding(padding);

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
				select(this)
					.transition()
					.duration(200)
					.ease(easeQuadOut)
					.attr("opacity", 0.8);

				chartContainerRef?.showTooltip(
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
					chartContainerRef?.showTooltip(
						event,
						`${d.trade}: ${d.enrollment.toLocaleString()} students`,
					);
				},
			)
			.on("mouseleave", function (this: SVGPathElement) {
				select(this)
					.transition()
					.duration(200)
					.ease(easeQuadOut)
					.attr("opacity", 1);

				chartContainerRef?.hideTooltip();
			});

		// X Axis
		const xAxis = g
			.append("g")
			.attr("transform", `translate(0,${innerHeight})`)
			.call(axisBottom(xScale).tickSize(0));

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
			axisLeft(yScale)
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
</script>

<ChartContainer
	bind:this={chartContainerRef}
	title="Enrollment by Trade"
	description="Aggregate student count per technical specialization."
	bare
	fillHeight
	onResize={createChart}
/>
