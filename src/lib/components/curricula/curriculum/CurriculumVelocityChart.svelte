<script lang='ts'>
    import { ChartContainer } from '$lib/components/ui/chart-container';
    import ChartLegend from '$lib/components/ui/chart-container/chart-legend.svelte';
    import {
        area,
        curveMonotoneX,
        line,
        scaleLinear,
        scalePoint,
        select,
    } from 'd3';

    interface VelocityDataPoint {
        month: string;
        enrolled: number;
        completed: number;
    }

    const data: VelocityDataPoint[] = [
        { month: 'Jan', enrolled: 4800, completed: 4500 },
        { month: 'Feb', enrolled: 5200, completed: 4800 },
        { month: 'Mar', enrolled: 5600, completed: 5200 },
        { month: 'Apr', enrolled: 6000, completed: 5500 },
        { month: 'May', enrolled: 6400, completed: 5800 },
        { month: 'Jun', enrolled: 6800, completed: 6200 },
        { month: 'Jul', enrolled: 7200, completed: 6600 },
        { month: 'Aug', enrolled: 7400, completed: 7000 },
        { month: 'Sep', enrolled: 7600, completed: 7200 },
        { month: 'Oct', enrolled: 8000, completed: 7500 },
        { month: 'Nov', enrolled: 8600, completed: 7800 },
        { month: 'Dec', enrolled: 9200, completed: 8200 },
    ];

    const legendItems = [
        { label: 'Enrolled', color: '#3B82F6' },
        { label: 'Completed', color: '#4ADE80' },
    ];

    let chartContainerRef: ReturnType<typeof ChartContainer>;
    const height = 420;

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

        // Calculate responsive margins
        const isSmall = width < 400;
        const margin = {
            top: 20,
            right: isSmall ? 10 : 20,
            bottom: 40,
            left: isSmall ? 40 : 55,
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

        // Define gradient for enrolled area - use unique IDs
        const defs = svg.append('defs');
        const gradientId1 = `enrolledGradient-${Math.random().toString(36).substr(2, 9)}`;
        const gradientId2 = `completedGradient-${Math.random().toString(36).substr(2, 9)}`;

        const enrolledGradient = defs
            .append('linearGradient')
            .attr('id', gradientId1)
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '0%')
            .attr('y2', '100%');
        enrolledGradient
            .append('stop')
            .attr('offset', '0%')
            .attr('stop-color', '#3B82F6')
            .attr('stop-opacity', 0.3);
        enrolledGradient
            .append('stop')
            .attr('offset', '100%')
            .attr('stop-color', '#3B82F6')
            .attr('stop-opacity', 0.05);

        const completedGradient = defs
            .append('linearGradient')
            .attr('id', gradientId2)
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '0%')
            .attr('y2', '100%');
        completedGradient
            .append('stop')
            .attr('offset', '0%')
            .attr('stop-color', '#4ADE80')
            .attr('stop-opacity', 0.25);
        completedGradient
            .append('stop')
            .attr('offset', '100%')
            .attr('stop-color', '#4ADE80')
            .attr('stop-opacity', 0.02);

        const g = svg
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Scales
        const x = scalePoint<string>()
            .domain(data.map(d => d.month))
            .range([0, chartWidth])
            .padding(0.1);

        const y = scaleLinear().domain([0, 10000]).range([chartHeight, 0]);

        // Grid lines
        const yTicks = [0, 2500, 5000, 7500, 10000];
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
                .attr('x', -12)
                .attr('y', y(tick))
                .attr('dy', '0.32em')
                .attr('text-anchor', 'end')
                .attr('fill', '#9CA3AF')
                .attr('font-size', isSmall ? '10px' : '12px')
                .text(tick.toLocaleString());
        });

        // X-axis labels - show fewer on small screens
        const labelsToShow = isSmall
            ? data.filter((_, i) => i % 2 === 0)
            : data;
        labelsToShow.forEach((d) => {
            g.append('text')
                .attr('x', x(d.month) ?? 0)
                .attr('y', chartHeight + 25)
                .attr('text-anchor', 'middle')
                .attr('fill', '#9CA3AF')
                .attr('font-size', isSmall ? '10px' : '12px')
                .text(d.month);
        });

        // Area generators
        const areaEnrolled = area<VelocityDataPoint>()
            .x(d => x(d.month) ?? 0)
            .y0(chartHeight)
            .y1(d => y(d.enrolled))
            .curve(curveMonotoneX);

        const areaCompleted = area<VelocityDataPoint>()
            .x(d => x(d.month) ?? 0)
            .y0(chartHeight)
            .y1(d => y(d.completed))
            .curve(curveMonotoneX);

        // Draw area fills (enrolled first as it's larger)
        g.append('path')
            .datum(data)
            .attr('fill', `url(#${gradientId1})`)
            .attr('d', areaEnrolled);

        g.append('path')
            .datum(data)
            .attr('fill', `url(#${gradientId2})`)
            .attr('d', areaCompleted);

        // Line generators
        const lineEnrolled = line<VelocityDataPoint>()
            .x(d => x(d.month) ?? 0)
            .y(d => y(d.enrolled))
            .curve(curveMonotoneX);

        const lineCompleted = line<VelocityDataPoint>()
            .x(d => x(d.month) ?? 0)
            .y(d => y(d.completed))
            .curve(curveMonotoneX);

        // Draw lines
        g.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', '#3B82F6')
            .attr('stroke-width', 2.5)
            .attr('d', lineEnrolled);

        g.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', '#4ADE80')
            .attr('stroke-width', 2.5)
            .attr('d', lineCompleted);

        // Invisible overlay for tooltips
        g.append('rect')
            .attr('width', chartWidth)
            .attr('height', chartHeight)
            .attr('fill', 'transparent')
            .style('cursor', 'crosshair')
            .on('pointermove', function (event: PointerEvent) {
                if (!tooltip)
                    return;

                const [mouseX] = [event.offsetX - margin.left];
                const xDomain = data.map(d => d.month);
                const xPositions = xDomain.map(m => x(m) ?? 0);

                // Find closest data point
                let closestIndex = 0;
                let minDist = Infinity;
                xPositions.forEach((pos, i) => {
                    const dist = Math.abs(pos - mouseX);
                    if (dist < minDist) {
                        minDist = dist;
                        closestIndex = i;
                    }
                });

                const d = data[closestIndex];
                const content = `
                    <div class="font-semibold text-sm">${d.month}</div>
                    <div class="text-xs text-blue-600">Enrolled: ${d.enrolled.toLocaleString()}</div>
                    <div class="text-xs text-green-600">Completed: ${d.completed.toLocaleString()}</div>
                `;
                showTooltip(tooltip, container, event, content);
            })
            .on('pointerleave', function () {
                if (!tooltip)
                    return;
                hideTooltip(tooltip);
            });
    }
</script>

<ChartContainer
    bind:this={chartContainerRef}
    title='Curriculum Velocity Trends'
    description='Enrollments vs Completions over the last 12 months'
    {height}
    cardClass='h-full rounded-2xl border border-[#DEE1E6] shadow-none'
    headerClass='p-5'
    contentClass='px-5 pb-5'
    onResize={createChart}
>
    {#snippet action()}
        <ChartLegend items={legendItems} shape='circle' size='sm' />
    {/snippet}
</ChartContainer>
