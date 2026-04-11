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
        { month: 'Jan', enrolled: 4200, completed: 3800 },
        { month: 'Feb', enrolled: 4600, completed: 4100 },
        { month: 'Mar', enrolled: 5100, completed: 4500 },
        { month: 'Apr', enrolled: 5400, completed: 4900 },
        { month: 'May', enrolled: 5800, completed: 5200 },
        { month: 'Jun', enrolled: 6200, completed: 5600 },
        { month: 'Jul', enrolled: 6800, completed: 6100 },
        { month: 'Aug', enrolled: 7200, completed: 6500 },
        { month: 'Sep', enrolled: 7800, completed: 7000 },
        { month: 'Oct', enrolled: 8200, completed: 7400 },
        { month: 'Nov', enrolled: 8800, completed: 7900 },
        { month: 'Dec', enrolled: 9400, completed: 8500 },
    ];

    const legendItems = [
        { label: 'Enrolled', color: '#3B82F6' },
        { label: 'Completed', color: '#4ADE80' },
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

        // Calculate responsive margins
        const isVerySmall = width < 350;
        const isSmall = width < 500;
        const margin = {
            top: 20,
            right: isSmall ? 10 : 20,
            bottom: isSmall ? 50 : 40,
            left: isSmall ? 35 : 55,
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
        const gradientId1 = `trainingEnrolledGradient-${Math.random().toString(36).substring(2, 11)}`;
        const gradientId2 = `trainingCompletedGradient-${Math.random().toString(36).substring(2, 11)}`;

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
                .attr('x', -8)
                .attr('y', y(tick))
                .attr('dy', '0.32em')
                .attr('text-anchor', 'end')
                .attr('fill', '#9CA3AF')
                .attr('font-size', isVerySmall ? '9px' : isSmall ? '10px' : '12px')
                .text(isVerySmall ? `${tick / 1000}k` : tick.toLocaleString());
        });

        // X-axis labels - rotate on small screens to fit all months
        data.forEach((d) => {
            const xPos = x(d.month) ?? 0;
            const label = g
                .append('text')
                .attr('x', xPos)
                .attr('y', chartHeight + 20)
                .attr('fill', '#9CA3AF')
                .attr('font-size', isVerySmall ? '9px' : isSmall ? '10px' : '12px')
                .text(d.month);

            if (isSmall) {
                // Rotate labels on small screens
                label
                    .attr('text-anchor', 'end')
                    .attr('transform', `rotate(-45, ${xPos}, ${chartHeight + 20})`);
            }
            else {
                label.attr('text-anchor', 'middle');
            }
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
    title='Training Velocity Trends'
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
