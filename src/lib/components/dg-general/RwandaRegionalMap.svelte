<script lang='ts'>
    import { ChartContainer } from '$lib/components/ui/chart-container';
    import { max, scaleBand, scaleLinear, select } from 'd3';

    interface RegionData {
        name: string;
        shortName: string;
        students: number;
        color: string;
    }

    const regionData: RegionData[] = [
        { name: 'Eastern Province', shortName: 'Eastern', students: 42500, color: '#86EFAC' },
        { name: 'Western Province', shortName: 'Western', students: 38200, color: '#CBD5E1' },
        { name: 'Southern Province', shortName: 'Southern', students: 35800, color: '#A1887F' },
        { name: 'Northern Province', shortName: 'Northern', students: 28400, color: '#C4B5FD' },
        { name: 'Kigali City', shortName: 'Kigali', students: 24600, color: '#EF4444' },
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

        const margin = { top: 20, right: 20, bottom: 40, left: 50 };
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
        const x = scaleBand<string>()
            .domain(regionData.map(d => d.shortName))
            .range([0, chartWidth])
            .padding(0.3);

        const y = scaleLinear()
            .domain([0, max(regionData, d => d.students) ?? 0])
            .nice()
            .range([chartHeight, 0]);

        // Grid lines
        const gridGroup = g.append('g').attr('class', 'grid');
        y.ticks(5).forEach((tick) => {
            gridGroup
                .append('line')
                .attr('x1', 0)
                .attr('x2', chartWidth)
                .attr('y1', y(tick))
                .attr('y2', y(tick))
                .attr('stroke', '#E5E7EB')
                .attr('stroke-dasharray', '3,3');
        });

        // Y-axis
        const yAxis = g.append('g').attr('class', 'y-axis');

        const yTicks = y.ticks(5);
        yTicks.forEach((tick) => {
            yAxis
                .append('text')
                .attr('x', -10)
                .attr('y', y(tick))
                .attr('dy', '0.32em')
                .attr('text-anchor', 'end')
                .attr('fill', '#6B7280')
                .attr('font-size', '11px')
                .text(tick >= 1000 ? `${tick / 1000}k` : tick);
        });

        // Bars
        const bars = g
            .selectAll<SVGRectElement, RegionData>('.bar')
            .data(regionData)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.shortName) ?? 0)
            .attr('y', d => y(d.students))
            .attr('width', x.bandwidth())
            .attr('height', d => chartHeight - y(d.students))
            .attr('fill', d => d.color)
            .attr('rx', 4)
            .attr('ry', 4)
            .style('cursor', 'pointer')
            .style('transition', 'opacity 0.2s ease');

        // Hover effects
        bars
            .on('pointerenter', function (event: PointerEvent, d: RegionData) {
                select(this).style('opacity', 0.8);

                if (!tooltip)
                    return;
                const content = `
                    <div class="font-semibold text-sm">${d.name}</div>
                    <div class="text-xs text-gray-600 mt-1">Students: ${d.students.toLocaleString()}</div>
                `;
                showTooltip(tooltip, container, event, content);
            })
            .on('pointermove', function (event: PointerEvent, d: RegionData) {
                if (!tooltip)
                    return;
                const content = `
                    <div class="font-semibold text-sm">${d.name}</div>
                    <div class="text-xs text-gray-600 mt-1">Students: ${d.students.toLocaleString()}</div>
                `;
                showTooltip(tooltip, container, event, content);
            })
            .on('pointerleave', function () {
                select(this).style('opacity', 1);

                if (!tooltip)
                    return;
                hideTooltip(tooltip);
            });

        // X-axis labels
        g.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${chartHeight})`)
            .selectAll('text')
            .data(regionData)
            .enter()
            .append('text')
            .attr('x', d => (x(d.shortName) ?? 0) + x.bandwidth() / 2)
            .attr('y', 20)
            .attr('text-anchor', 'middle')
            .attr('fill', '#6B7280')
            .attr('font-size', '11px')
            .text(d => d.shortName);
    }
</script>

<ChartContainer
    bind:this={chartContainerRef}
    title='Regional Distribution'
    description='Rwanda provinces overview'
    {height}
    cardClass='h-full'
    headerClass='p-4 lg:p-5'
    contentClass='px-4 lg:px-6 pb-4'
    onResize={createChart}
/>
