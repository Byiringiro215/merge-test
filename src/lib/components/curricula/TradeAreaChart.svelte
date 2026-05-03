<script lang='ts'>
    import type { TradeAreaData } from './types.js';
    import { ChartContainer } from '$lib/components/ui/chart-container';
    import { max, scaleBand, scaleLinear, select } from 'd3';

    const data: TradeAreaData[] = [
        { trade: 'ICT', count: 85 },
        { trade: 'Hospitality', count: 72 },
        { trade: 'Construction', count: 68 },
        { trade: 'Agriculture', count: 55 },
        { trade: 'Manufacturing', count: 48 },
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

        const margin = { top: 10, right: 20, bottom: 10, left: 90 };
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
        const y = scaleBand<string>()
            .domain(data.map(d => d.trade))
            .range([0, chartHeight])
            .padding(0.4);

        const x = scaleLinear()
            .domain([0, max(data, d => d.count) ?? 0])
            .range([0, chartWidth]);

        // Y-axis labels
        data.forEach((d) => {
            g.append('text')
                .attr('x', -10)
                .attr('y', (y(d.trade) ?? 0) + y.bandwidth() / 2)
                .attr('dy', '0.32em')
                .attr('text-anchor', 'end')
                .attr('fill', '#6B7280')
                .attr('font-size', '12px')
                .text(d.trade);
        });

        // Bars
        g.selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', 0)
            .attr('y', d => y(d.trade) ?? 0)
            .attr('width', d => x(d.count))
            .attr('height', y.bandwidth())
            .attr('fill', '#3B82F6')
            .attr('rx', 4)
            .style('cursor', 'pointer')
            .on('pointerenter', function (event: PointerEvent, d: TradeAreaData) {
                select(this).attr('fill', '#1A4B8A');
                if (!tooltip)
                    return;
                const content = `
                    <div class="font-semibold text-sm">${d.trade}</div>
                    <div class="text-xs text-gray-600">Curricula: ${d.count}</div>
                `;
                showTooltip(tooltip, container, event, content);
            })
            .on('pointermove', function (event: PointerEvent, d: TradeAreaData) {
                if (!tooltip)
                    return;
                const content = `
                    <div class="font-semibold text-sm">${d.trade}</div>
                    <div class="text-xs text-gray-600">Curricula: ${d.count}</div>
                `;
                showTooltip(tooltip, container, event, content);
            })
            .on('pointerleave', function () {
                select(this).attr('fill', '#3B82F6');
                if (!tooltip)
                    return;
                hideTooltip(tooltip);
            });
    }
</script>

<ChartContainer
    bind:this={chartContainerRef}
    title='Curricula by Trade Area'
    description='Volume distribution across top sectors'
    {height}
    cardClass='h-full'
    headerClass='p-4 lg:p-5'
    contentClass='px-4 lg:px-5 pb-4'
    onResize={createChart}
/>
