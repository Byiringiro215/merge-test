<script lang='ts'>
    import { ChartContainer } from '$lib/components/ui/chart-container';
    import ChartLegend from '$lib/components/ui/chart-container/chart-legend.svelte';
    import {
        curveMonotoneX,
        easeBackOut,
        easeCubicOut,
        easeElasticOut,
        line,
        scaleBand,
        scaleLinear,
        select,
    } from 'd3';

    interface GrowthDataPoint {
        month: string;
        connectedSchools: number;
        activeDevices: number;
    }

    const data: GrowthDataPoint[] = [
        { month: 'Jan', connectedSchools: 280, activeDevices: 8500 },
        { month: 'Feb', connectedSchools: 310, activeDevices: 9200 },
        { month: 'Mar', connectedSchools: 340, activeDevices: 10100 },
        { month: 'Apr', connectedSchools: 370, activeDevices: 11000 },
        { month: 'May', connectedSchools: 410, activeDevices: 12500 },
        { month: 'Jun', connectedSchools: 450, activeDevices: 14000 },
        { month: 'Jul', connectedSchools: 490, activeDevices: 15500 },
    ];

    const legendItems = [
        { label: 'Connected Schools (Left Axis)', color: '#3B82F6' },
        { label: 'Active Devices (Right Axis)', color: '#93C5FD' },
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

        const isSmall = width < 500;
        const margin = {
            top: 20,
            right: isSmall ? 35 : 60,
            bottom: isSmall ? 50 : 40,
            left: isSmall ? 35 : 50,
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
            .domain(data.map(d => d.month))
            .range([0, chartWidth])
            .padding(0.4);

        const yLeft = scaleLinear().domain([0, 600]).range([chartHeight, 0]);
        const yRight = scaleLinear().domain([0, 16000]).range([chartHeight, 0]);

        // Grid lines
        const yLeftTicks = [0, 150, 300, 450, 600];
        yLeftTicks.forEach((tick) => {
            g.append('line')
                .attr('x1', 0)
                .attr('x2', chartWidth)
                .attr('y1', yLeft(tick))
                .attr('y2', yLeft(tick))
                .attr('stroke', '#E5E7EB')
                .attr('stroke-dasharray', '4,4');
        });

        // Y-axis labels (left)
        yLeftTicks.forEach((tick) => {
            g.append('text')
                .attr('x', -10)
                .attr('y', yLeft(tick))
                .attr('dy', '0.32em')
                .attr('text-anchor', 'end')
                .attr('fill', '#9CA3AF')
                .attr('font-size', isSmall ? '10px' : '12px')
                .text(tick);
        });

        // Y-axis labels (right)
        const yRightTicks = [0, 4000, 8000, 12000, 16000];
        yRightTicks.forEach((tick) => {
            g.append('text')
                .attr('x', chartWidth + 10)
                .attr('y', yRight(tick))
                .attr('dy', '0.32em')
                .attr('text-anchor', 'start')
                .attr('fill', '#9CA3AF')
                .attr('font-size', isSmall ? '10px' : '12px')
                .text(tick.toLocaleString());
        });

        // X-axis labels - rotate on small screens
        data.forEach((d) => {
            const xPos = (x(d.month) ?? 0) + x.bandwidth() / 2;
            const label = g
                .append('text')
                .attr('x', xPos)
                .attr('y', chartHeight + 20)
                .attr('fill', '#9CA3AF')
                .attr('font-size', isSmall ? '10px' : '12px')
                .text(d.month);

            if (isSmall) {
                label
                    .attr('text-anchor', 'end')
                    .attr('transform', `rotate(-45, ${xPos}, ${chartHeight + 20})`);
            }
            else {
                label.attr('text-anchor', 'middle');
            }
        });

        // Helper function to create path with rounded top corners
        const barWidth = x.bandwidth();
        const cornerRadius = 4;

        function roundedTopBar(xPos: number, yTop: number, w: number, h: number) {
            if (h <= 0)
                return '';
            const r = Math.min(cornerRadius, h / 2, w / 2);
            const yBottom = yTop + h;
            return `M${xPos},${yBottom}
                L${xPos},${yTop + r}
                Q${xPos},${yTop} ${xPos + r},${yTop}
                L${xPos + w - r},${yTop}
                Q${xPos + w},${yTop} ${xPos + w},${yTop + r}
                L${xPos + w},${yBottom} Z`;
        }

        // Draw bars with animation (path for rounded top corners only)
        const bars = g
            .selectAll<SVGPathElement, GrowthDataPoint>('.bar')
            .data(data)
            .enter()
            .append('path')
            .attr('class', 'bar')
            .attr('fill', '#3B82F6')
            .style('cursor', 'pointer')
            .attr('d', (d) => {
                const xPos = x(d.month) ?? 0;
                return `M${xPos},${chartHeight} L${xPos},${chartHeight} L${xPos + barWidth},${chartHeight} L${xPos + barWidth},${chartHeight} Z`;
            });

        // Animate bars growing from bottom
        bars
            .transition()
            .duration(800)
            .delay((_, i) => i * 80)
            .ease(easeBackOut.overshoot(0.3))
            .attr('d', (d) => {
                const xPos = x(d.month) ?? 0;
                const yTop = yLeft(d.connectedSchools);
                const h = chartHeight - yTop;
                return roundedTopBar(xPos, yTop, barWidth, h);
            });

        // Hover interactions
        bars
            .on('pointerenter', function (event: PointerEvent, d: GrowthDataPoint) {
                const xPos = x(d.month) ?? 0;
                const yTop = yLeft(d.connectedSchools);
                const h = chartHeight - yTop;

                select(this)
                    .transition()
                    .duration(150)
                    .ease(easeCubicOut)
                    .attr('fill', '#1A4B8A')
                    .attr('d', roundedTopBar(xPos - 2, yTop, barWidth + 4, h));

                if (!tooltip)
                    return;
                const content = `
                    <div class="font-semibold text-sm">${d.month}</div>
                    <div class="text-xs text-blue-600">Schools: ${d.connectedSchools}</div>
                    <div class="text-xs text-blue-400">Devices: ${d.activeDevices.toLocaleString()}</div>
                `;
                showTooltip(tooltip, container, event, content);
            })
            .on('pointerleave', function (_, d: GrowthDataPoint) {
                const xPos = x(d.month) ?? 0;
                const yTop = yLeft(d.connectedSchools);
                const h = chartHeight - yTop;

                select(this)
                    .transition()
                    .duration(200)
                    .ease(easeCubicOut)
                    .attr('fill', '#3B82F6')
                    .attr('d', roundedTopBar(xPos, yTop, barWidth, h));

                if (!tooltip)
                    return;
                hideTooltip(tooltip);
            });

        // Draw line for active devices with animation
        const linePath = line<GrowthDataPoint>()
            .x(d => (x(d.month) ?? 0) + x.bandwidth() / 2)
            .y(d => yRight(d.activeDevices))
            .curve(curveMonotoneX);

        const path = g
            .append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', '#93C5FD')
            .attr('stroke-width', 3)
            .attr('d', linePath);

        // Animate line drawing
        const pathLength = path.node()?.getTotalLength() ?? 0;
        path
            .attr('stroke-dasharray', pathLength)
            .attr('stroke-dashoffset', pathLength)
            .transition()
            .duration(1200)
            .delay(400)
            .ease(easeCubicOut)
            .attr('stroke-dashoffset', 0);

        // Draw dots on line with animation
        const dots = g
            .selectAll('.dot')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'dot')
            .attr('cx', d => (x(d.month) ?? 0) + x.bandwidth() / 2)
            .attr('cy', d => yRight(d.activeDevices))
            .attr('r', 0)
            .attr('fill', '#3B82F6')
            .attr('stroke', 'white')
            .attr('stroke-width', 2)
            .style('cursor', 'pointer');

        // Animate dots appearing
        dots
            .transition()
            .duration(400)
            .delay((_, i) => 600 + i * 100)
            .ease(easeElasticOut.amplitude(1).period(0.5))
            .attr('r', 5);

        // Dot hover interactions
        dots
            .on('pointerenter', function (event: PointerEvent, d: GrowthDataPoint) {
                select(this)
                    .transition()
                    .duration(150)
                    .ease(easeCubicOut)
                    .attr('r', 8)
                    .attr('fill', '#1D4ED8');

                if (!tooltip)
                    return;
                const content = `
                    <div class="font-semibold text-sm">${d.month}</div>
                    <div class="text-xs text-blue-600">Schools: ${d.connectedSchools}</div>
                    <div class="text-xs text-blue-400">Devices: ${d.activeDevices.toLocaleString()}</div>
                `;
                showTooltip(tooltip, container, event, content);
            })
            .on('pointerleave', function () {
                select(this)
                    .transition()
                    .duration(200)
                    .ease(easeCubicOut)
                    .attr('r', 5)
                    .attr('fill', '#3B82F6');

                if (!tooltip)
                    return;
                hideTooltip(tooltip);
            });
    }
</script>

<ChartContainer
    bind:this={chartContainerRef}
    title='Connectivity & Device Growth'
    description='Tracking school onboarding and device distribution over time.'
    {height}
    cardClass='h-full rounded-2xl border border-[#DEE1E6] shadow-none'
    headerClass='p-5'
    contentClass='px-5 pb-5'
    onResize={createChart}
>
    {#snippet legend()}
        <ChartLegend items={legendItems} shape='circle' size='sm' />
    {/snippet}
</ChartContainer>
