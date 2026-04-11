<script lang='ts'>
    import type { PieArcDatum } from 'd3';
    import { ChartContainer } from '$lib/components/ui/chart-container';
    import { arc, easeQuadOut, interpolate, pie, select } from 'd3';
    import { onMount } from 'svelte';

    interface TradeData {
        trade: string;
        percentage: number;
        color: string;
    }

    const data: TradeData[] = [
        { trade: 'Masonry', percentage: 35, color: '#3B82F6' },
        { trade: 'Carpentry', percentage: 25, color: '#4ADE80' },
        { trade: 'IT & Software', percentage: 20, color: '#F97316' },
        { trade: 'Automotive', percentage: 15, color: '#A855F7' },
        { trade: 'Culinary Arts', percentage: 5, color: '#67E8F9' },
    ];

    let chartContainerRef: ReturnType<typeof ChartContainer>;
    let chartElement: HTMLDivElement;
    let mounted = $state(false);

    const chartSize = 220;
    const radius = chartSize / 2;
    const innerRadius = radius * 0.6;
    const height = 240;

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
        tooltip.style.display = 'block';
    }

    function hideTooltip(tooltip: HTMLDivElement) {
        tooltip.style.display = 'none';
    }

    function createChart() {
        if (!chartElement || !mounted)
            return;

        select(chartElement).selectAll('*').remove();

        const tooltip = chartContainerRef?.getTooltipElement();

        const svg = select(chartElement)
            .append('svg')
            .attr('width', chartSize)
            .attr('height', chartSize)
            .attr('viewBox', `0 0 ${chartSize} ${chartSize}`);

        const g = svg
            .append('g')
            .attr('transform', `translate(${chartSize / 2},${chartSize / 2})`);

        type ChartData = (typeof data)[0];
        type PieArcData = PieArcDatum<ChartData>;

        const pieGenerator = pie<ChartData>()
            .value((d: ChartData) => d.percentage)
            .sort(null)
            .startAngle(-Math.PI / 2)
            .endAngle(Math.PI * 1.5);

        const arcGenerator = arc<PieArcData>()
            .innerRadius(innerRadius)
            .outerRadius(radius)
            .cornerRadius(3)
            .padAngle(0.015);

        // Draw arcs with animation
        const arcs = g
            .selectAll<SVGPathElement, PieArcData>('path')
            .data(pieGenerator(data))
            .enter()
            .append('path')
            .attr('fill', (d: PieArcData) => d.data.color)
            .attr('d', arcGenerator)
            .style('cursor', 'pointer');

        // Animate in
        arcs.each(function (this: SVGPathElement, d: PieArcData) {
            const path = select(this);
            const startAngle = d.startAngle;
            path.attr(
                'd',
                arcGenerator({ ...d, endAngle: startAngle } as PieArcData),
            );
        });

        arcs.transition()
            .duration(800)
            .delay((_: PieArcData, i: number) => i * 100)
            .attrTween('d', function (d: PieArcData) {
                const angleInterpolate = interpolate(d.startAngle, d.endAngle);
                return (t: number) =>
                    arcGenerator({
                        ...d,
                        endAngle: angleInterpolate(t),
                    } as PieArcData) || '';
            });

        // Add center text
        const centerText = g
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('y', -8);

        centerText
            .append('tspan')
            .attr('font-size', '28px')
            .attr('font-weight', 'bold')
            .attr('fill', '#171A1F')
            .text('100');

        centerText
            .append('tspan')
            .attr('font-size', '14px')
            .attr('font-weight', 'normal')
            .attr('fill', '#171A1F')
            .text('%');

        g.append('text')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('y', 18)
            .attr('font-size', '12px')
            .attr('fill', '#9CA3AF')
            .text('Total');

        // Hover effects
        arcs.on(
            'pointerenter',
            function (
                this: SVGPathElement,
                event: PointerEvent,
                d: PieArcData,
            ) {
                select(this)
                    .transition()
                    .duration(200)
                    .ease(easeQuadOut)
                    .attr('opacity', 0.75);

                if (!tooltip)
                    return;

                showTooltip(
                    tooltip,
                    chartElement,
                    event,
                    `${d.data.trade}: ${d.data.percentage}%`,
                );
            },
        )
            .on(
                'pointermove',
                function (
                    this: SVGPathElement,
                    event: PointerEvent,
                    d: PieArcData,
                ) {
                    if (!tooltip)
                        return;

                    showTooltip(
                        tooltip,
                        chartElement,
                        event,
                        `${d.data.trade}: ${d.data.percentage}%`,
                    );
                },
            )
            .on('pointerleave', function (this: SVGPathElement) {
                select(this)
                    .transition()
                    .duration(200)
                    .ease(easeQuadOut)
                    .attr('opacity', 1);

                if (!tooltip)
                    return;
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

    // Legend items with percentages
    const legendItems = data.map(item => ({
        label: item.trade,
        color: item.color,
        value: `${item.percentage}%`,
    }));
</script>

<ChartContainer
    bind:this={chartContainerRef}
    title='Enrollment by Trade Area'
    description='Top 5 popular disciplines'
    {height}
    cardClass='h-full rounded-2xl border border-[#DEE1E6] shadow-none'
    headerClass='p-5'
    contentClass='p-5 pt-0'
>
    <div class='flex flex-col items-center'>
        <!-- Donut Chart -->
        <div
            class='shrink-0'
            bind:this={chartElement}
            style='width: {chartSize}px; height: {chartSize}px;'
        ></div>
    </div>

    {#snippet legend()}
        <div class='grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 mt-4'>
            {#each legendItems as item (item.label)}
                <div class='flex items-center justify-between gap-2'>
                    <div class='flex items-center gap-2'>
                        <span
                            class='w-2.5 h-2.5 rounded-full'
                            style='background-color: {item.color}'
                        ></span>
                        <span class='text-xs text-gray-600'>{item.label}</span>
                    </div>
                    <span class='text-xs font-medium text-gray-900'
                    >{item.value}</span
                    >
                </div>
            {/each}
        </div>
    {/snippet}
</ChartContainer>
