<script lang='ts'>
    import type { DevelopmentTrendPoint } from './types.js';
    import { ChartContainer } from '$lib/components/ui/chart-container';
    import ChartLegend from '$lib/components/ui/chart-container/chart-legend.svelte';
    import { curveMonotoneX, line, max, scaleLinear, scalePoint, select } from 'd3';

    const data: DevelopmentTrendPoint[] = [
        { month: 'Jan', developed: 20, reviewed: 15 },
        { month: 'Feb', developed: 35, reviewed: 25 },
        { month: 'Mar', developed: 45, reviewed: 60 },
        { month: 'Apr', developed: 65, reviewed: 55 },
        { month: 'May', developed: 85, reviewed: 70 },
        { month: 'Jun', developed: 100, reviewed: 90 },
        { month: 'Jul', developed: 115, reviewed: 120 },
    ];

    const legendItems = [
        { label: 'Developed', color: '#3B82F6' },
        { label: 'Reviewed', color: '#4ADE80' },
    ];

    let chartContainerRef: ReturnType<typeof ChartContainer>;
    const height = 280;

    function showTooltip(
        tooltip: HTMLDivElement,
        container: HTMLDivElement,
        event: PointerEvent,
        content: string,
    ) {
        const rect = container.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        tooltip.innerHTML = content;
        tooltip.style.left = `${x + 12}px`;
        tooltip.style.top = `${y - 12}px`;
        tooltip.style.display = 'block';
    }

    function hideTooltip(tooltip: HTMLDivElement) {
        tooltip.style.display = 'none';
    }

    function createChart(container: HTMLDivElement, width: number) {
        if (!container || width === 0)
            return;

        select(container).selectAll('*').remove();

        const tooltip = chartContainerRef?.getTooltipElement();

        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;

        const svg = select(container)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        const g = svg
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Scales
        const x = scalePoint<string>()
            .domain(data.map(d => d.month))
            .range([0, chartWidth])
            .padding(0.1);

        const y = scaleLinear()
            .domain([0, max(data, d => Math.max(d.developed, d.reviewed)) ?? 0])
            .nice()
            .range([chartHeight, 0]);

        // Grid lines
        const yTicks = y.ticks(5);
        yTicks.forEach((tick) => {
            g.append('line')
                .attr('x1', 0)
                .attr('x2', chartWidth)
                .attr('y1', y(tick))
                .attr('y2', y(tick))
                .attr('stroke', '#E5E7EB')
                .attr('stroke-dasharray', '3,3');
        });

        // Y-axis labels
        yTicks.forEach((tick) => {
            g.append('text')
                .attr('x', -10)
                .attr('y', y(tick))
                .attr('dy', '0.32em')
                .attr('text-anchor', 'end')
                .attr('fill', '#9CA3AF')
                .attr('font-size', '11px')
                .text(tick);
        });

        // X-axis labels
        data.forEach((d) => {
            g.append('text')
                .attr('x', x(d.month) ?? 0)
                .attr('y', chartHeight + 20)
                .attr('text-anchor', 'middle')
                .attr('fill', '#9CA3AF')
                .attr('font-size', '11px')
                .text(d.month);
        });

        // Line generator
        const lineGenerator = line<DevelopmentTrendPoint>()
            .x(d => x(d.month) ?? 0)
            .y(d => y(d.developed))
            .curve(curveMonotoneX);

        const lineGenerator2 = line<DevelopmentTrendPoint>()
            .x(d => x(d.month) ?? 0)
            .y(d => y(d.reviewed))
            .curve(curveMonotoneX);

        // Draw developed line
        g.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', '#3B82F6')
            .attr('stroke-width', 2.5)
            .attr('d', lineGenerator);

        // Draw reviewed line
        g.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', '#4ADE80')
            .attr('stroke-width', 2.5)
            .attr('d', lineGenerator2);

        // Add dots for developed
        g.selectAll('.dot-developed')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'dot-developed')
            .attr('cx', d => x(d.month) ?? 0)
            .attr('cy', d => y(d.developed))
            .attr('r', 4)
            .attr('fill', '#3B82F6')
            .style('cursor', 'pointer')
            .on('pointerenter', function (event: PointerEvent, d: DevelopmentTrendPoint) {
                select(this).attr('r', 6);
                if (!tooltip)
                    return;
                const content = `
                    <div class="font-semibold text-sm">${d.month}</div>
                    <div class="text-xs text-gray-600">Developed: ${d.developed}</div>
                `;
                showTooltip(tooltip, container, event, content);
            })
            .on('pointerleave', function () {
                select(this).attr('r', 4);
                if (!tooltip)
                    return;
                hideTooltip(tooltip);
            });

        // Add dots for reviewed
        g.selectAll('.dot-reviewed')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'dot-reviewed')
            .attr('cx', d => x(d.month) ?? 0)
            .attr('cy', d => y(d.reviewed))
            .attr('r', 4)
            .attr('fill', '#4ADE80')
            .style('cursor', 'pointer')
            .on('pointerenter', function (event: PointerEvent, d: DevelopmentTrendPoint) {
                select(this).attr('r', 6);
                if (!tooltip)
                    return;
                const content = `
                    <div class="font-semibold text-sm">${d.month}</div>
                    <div class="text-xs text-gray-600">Reviewed: ${d.reviewed}</div>
                `;
                showTooltip(tooltip, container, event, content);
            })
            .on('pointerleave', function () {
                select(this).attr('r', 4);
                if (!tooltip)
                    return;
                hideTooltip(tooltip);
            });
    }
</script>

<ChartContainer
    bind:this={chartContainerRef}
    title='Development Progress'
    description='Cumulative curricula metrics'
    {height}
    cardClass='h-full'
    headerClass='p-4 lg:p-5'
    contentClass='px-4 lg:px-5 pb-4'
    onResize={createChart}
>
    {#snippet action()}
        <ChartLegend items={legendItems} shape='circle' size='sm' />
    {/snippet}
</ChartContainer>
