<script lang='ts'>
    import { ChartContainer } from '$lib/components/ui/chart-container';
    import ChartLegend from '$lib/components/ui/chart-container/chart-legend.svelte';
    import { scaleBand, scaleLinear, select } from 'd3';

    interface RegionalData {
        region: string;
        Fiber: number;
        Cellular: number;
        Wireless: number;
        Satellite: number;
    }

    const data: RegionalData[] = [
        {
            region: 'Kigali',
            Fiber: 80,
            Cellular: 35,
            Wireless: 20,
            Satellite: 10,
        },
        {
            region: 'Northern',
            Fiber: 50,
            Cellular: 60,
            Wireless: 30,
            Satellite: 15,
        },
        {
            region: 'Southern',
            Fiber: 45,
            Cellular: 70,
            Wireless: 40,
            Satellite: 20,
        },
        {
            region: 'Eastern',
            Fiber: 55,
            Cellular: 65,
            Wireless: 50,
            Satellite: 25,
        },
        {
            region: 'Western',
            Fiber: 40,
            Cellular: 55,
            Wireless: 45,
            Satellite: 30,
        },
    ];

    const colors = {
        Fiber: '#3B82F6',
        Cellular: '#A855F7',
        Wireless: '#F97316',
        Satellite: '#D1D5DB',
    };

    const hoverColors = {
        Fiber: '#2563EB',
        Cellular: '#9333EA',
        Wireless: '#EA580C',
        Satellite: '#9CA3AF',
    };

    const legendItems = [
        { label: 'Fiber', color: colors.Fiber },
        { label: 'Cellular', color: colors.Cellular },
        { label: 'Wireless', color: colors.Wireless },
        { label: 'Satellite', color: colors.Satellite },
    ];

    let chartContainerRef: ReturnType<typeof ChartContainer>;
    const height = 320;

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

        const isSmall = width < 400;
        const margin = {
            top: 20,
            right: 20,
            bottom: 40,
            left: isSmall ? 35 : 45,
        };
        const chartWidth = width - margin.left - margin.right;
        const svgHeight = 320;
        const chartHeight = svgHeight - margin.top - margin.bottom;

        const svg = select(container)
            .append('svg')
            .attr('width', '100%')
            .attr('height', svgHeight)
            .attr('viewBox', `0 0 ${width} ${svgHeight}`)
            .attr('preserveAspectRatio', 'xMidYMid meet');

        const g = svg
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Scales
        const x = scaleBand<string>()
            .domain(data.map(d => d.region))
            .range([0, chartWidth])
            .padding(0.3);

        const maxTotal = Math.max(
            ...data.map(d => d.Fiber + d.Cellular + d.Wireless + d.Satellite),
        );
        const y = scaleLinear()
            .domain([0, Math.ceil(maxTotal / 50) * 50])
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
                .attr('stroke-dasharray', '4,4');
        });

        // Y-axis labels
        yTicks.forEach((tick) => {
            g.append('text')
                .attr('x', -10)
                .attr('y', y(tick))
                .attr('dy', '0.32em')
                .attr('text-anchor', 'end')
                .attr('fill', '#9CA3AF')
                .attr('font-size', isSmall ? '10px' : '12px')
                .text(tick);
        });

        // X-axis labels
        data.forEach((d) => {
            g.append('text')
                .attr('x', (x(d.region) ?? 0) + x.bandwidth() / 2)
                .attr('y', chartHeight + 25)
                .attr('text-anchor', 'middle')
                .attr('fill', '#9CA3AF')
                .attr('font-size', isSmall ? '10px' : '12px')
                .text(d.region);
        });

        const barWidth = x.bandwidth();
        const cornerRadius = 4;

        // Layer 1: Fiber (bottom) - rect with no rounding
        const fiberBars = g
            .selectAll<SVGRectElement, RegionalData>('.bar-fiber')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar-fiber')
            .attr('x', d => x(d.region) ?? 0)
            .attr('y', chartHeight)
            .attr('width', barWidth)
            .attr('height', 0)
            .attr('fill', colors.Fiber)
            .style('cursor', 'pointer');

        fiberBars
            .transition()
            .duration(800)
            .delay((_, i) => i * 100)
            .attr('y', d => y(d.Fiber))
            .attr('height', d => chartHeight - y(d.Fiber));

        // Layer 2: Cellular - rect with no rounding
        const cellularBars = g
            .selectAll<SVGRectElement, RegionalData>('.bar-cellular')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar-cellular')
            .attr('x', d => x(d.region) ?? 0)
            .attr('y', d => y(d.Fiber))
            .attr('width', barWidth)
            .attr('height', 0)
            .attr('fill', colors.Cellular)
            .style('cursor', 'pointer');

        cellularBars
            .transition()
            .duration(800)
            .delay((_, i) => i * 100 + 150)
            .attr('y', d => y(d.Fiber + d.Cellular))
            .attr('height', d => y(d.Fiber) - y(d.Fiber + d.Cellular));

        // Layer 3: Wireless - rect with no rounding
        const wirelessBars = g
            .selectAll<SVGRectElement, RegionalData>('.bar-wireless')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar-wireless')
            .attr('x', d => x(d.region) ?? 0)
            .attr('y', d => y(d.Fiber + d.Cellular))
            .attr('width', barWidth)
            .attr('height', 0)
            .attr('fill', colors.Wireless)
            .style('cursor', 'pointer');

        wirelessBars
            .transition()
            .duration(800)
            .delay((_, i) => i * 100 + 300)
            .attr('y', d => y(d.Fiber + d.Cellular + d.Wireless))
            .attr('height', d =>
                y(d.Fiber + d.Cellular) - y(d.Fiber + d.Cellular + d.Wireless));

        // Layer 4: Satellite (top) - path with rounded top corners
        const satelliteBars = g
            .selectAll<SVGPathElement, RegionalData>('.bar-satellite')
            .data(data)
            .enter()
            .append('path')
            .attr('class', 'bar-satellite')
            .attr('fill', colors.Satellite)
            .style('cursor', 'pointer')
            .attr('d', (d) => {
                const xPos = x(d.region) ?? 0;
                const baseY = y(d.Fiber + d.Cellular + d.Wireless);
                return `M${xPos},${baseY} L${xPos},${baseY} L${xPos + barWidth},${baseY} L${xPos + barWidth},${baseY} Z`;
            });

        satelliteBars
            .transition()
            .duration(800)
            .delay((_, i) => i * 100 + 450)
            .attr('d', (d) => {
                const xPos = x(d.region) ?? 0;
                const total = d.Fiber + d.Cellular + d.Wireless + d.Satellite;
                const yTop = y(total);
                const yBottom = y(d.Fiber + d.Cellular + d.Wireless);
                const h = yBottom - yTop;
                const r = Math.min(cornerRadius, h / 2, barWidth / 2);

                if (h <= 0)
                    return '';

                return `M${xPos},${yBottom}
                    L${xPos},${yTop + r}
                    Q${xPos},${yTop} ${xPos + r},${yTop}
                    L${xPos + barWidth - r},${yTop}
                    Q${xPos + barWidth},${yTop} ${xPos + barWidth},${yTop + r}
                    L${xPos + barWidth},${yBottom} Z`;
            });

        // Hover effects helper
        function addHoverEffects(
            bars: d3.Selection<SVGRectElement | SVGPathElement, RegionalData, SVGGElement, unknown>,
            key: keyof typeof colors,
            _isPath = false,
        ) {
            bars
                .on('pointerenter', function (event: PointerEvent, d: RegionalData) {
                    select(this)
                        .transition()
                        .duration(200)
                        .attr('fill', hoverColors[key]);

                    if (!tooltip)
                        return;
                    const total = d.Fiber + d.Cellular + d.Wireless + d.Satellite;
                    const value = d[key];
                    const percentage = ((value / total) * 100).toFixed(1);
                    const content = `
                        <div class="font-semibold text-sm">${d.region}</div>
                        <div class="text-xs" style="color: ${colors[key]}">${key}: ${value} (${percentage}%)</div>
                        <div class="text-xs text-gray-500">Total: ${total}</div>
                    `;
                    showTooltip(tooltip, container, event, content);
                })
                .on('pointermove', function (event: PointerEvent, d: RegionalData) {
                    if (!tooltip)
                        return;
                    const total = d.Fiber + d.Cellular + d.Wireless + d.Satellite;
                    const value = d[key];
                    const percentage = ((value / total) * 100).toFixed(1);
                    const content = `
                        <div class="font-semibold text-sm">${d.region}</div>
                        <div class="text-xs" style="color: ${colors[key]}">${key}: ${value} (${percentage}%)</div>
                        <div class="text-xs text-gray-500">Total: ${total}</div>
                    `;
                    showTooltip(tooltip, container, event, content);
                })
                .on('pointerleave', function () {
                    select(this)
                        .transition()
                        .duration(200)
                        .attr('fill', colors[key]);

                    if (!tooltip)
                        return;
                    hideTooltip(tooltip);
                });
        }

        // Add hover effects to all layers
        addHoverEffects(fiberBars as any, 'Fiber');
        addHoverEffects(cellularBars as any, 'Cellular');
        addHoverEffects(wirelessBars as any, 'Wireless');
        addHoverEffects(satelliteBars as any, 'Satellite', true);
    }
</script>

<ChartContainer
    bind:this={chartContainerRef}
    title='Regional Connection Breakdown'
    description='Distribution of connection types across provinces.'
    {height}
    cardClass='h-full rounded-2xl border border-[#DEE1E6] shadow-none'
    headerClass='p-5'
    contentClass='px-5 pb-5'
    onResize={createChart}
>
    {#snippet legend()}
        <ChartLegend items={legendItems} shape='square' size='sm' />
    {/snippet}
</ChartContainer>
