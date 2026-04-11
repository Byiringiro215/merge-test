<script lang='ts'>
    import { ChartContainer } from '$lib/components/ui/chart-container';
    import { arc, pie, select } from 'd3';

    interface DemographicDataItem {
        label: string;
        value: number;
        percentage: number;
        color: string;
    }

    const data: DemographicDataItem[] = [
        {
            label: 'Male Enrolled',
            value: 68475,
            percentage: 55,
            color: '#3B82F6',
        },
        {
            label: 'Female Enrolled',
            value: 56025,
            percentage: 45,
            color: '#4ADE80',
        },
    ];

    const total = '124.5k';

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

        // Reserve space for legend at bottom
        const legendHeight = 30;
        const chartAreaHeight = height - legendHeight - 60;
        const size = Math.min(width, chartAreaHeight);
        const radius = size / 2;
        const innerRadius = radius * 0.55;

        const svg = select(container)
            .append('svg')
            .attr('width', width)
            .attr('height', height - 60);

        const g = svg
            .append('g')
            .attr(
                'transform',
                `translate(${width / 2},${chartAreaHeight / 2})`,
            );

        // Pie generator
        const pieGenerator = pie<DemographicDataItem>()
            .value(d => d.value)
            .sort(null);

        // Arc generator
        const arcGenerator = arc<d3.PieArcDatum<DemographicDataItem>>()
            .innerRadius(innerRadius)
            .outerRadius(radius)
            .cornerRadius(4)
            .padAngle(0.02);

        // Draw arcs
        const arcs = g
            .selectAll('.arc')
            .data(pieGenerator(data))
            .enter()
            .append('path')
            .attr('class', 'arc')
            .attr('d', arcGenerator)
            .attr('fill', d => d.data.color)
            .style('cursor', 'pointer')
            .style('transition', 'opacity 0.2s ease');

        // Hover effects
        arcs.on('pointerenter', function (event: PointerEvent, d) {
            select(this).style('opacity', 0.8);
            if (!tooltip)
                return;
            const content = `
                    <div class="font-semibold text-sm">${d.data.label}</div>
                    <div class="text-xs text-gray-600">${d.data.value.toLocaleString()} (${d.data.percentage}%)</div>
                `;
            showTooltip(tooltip, container, event, content);
        })
            .on('pointermove', function (event: PointerEvent, d) {
                if (!tooltip)
                    return;
                const content = `
                    <div class="font-semibold text-sm">${d.data.label}</div>
                    <div class="text-xs text-gray-600">${d.data.value.toLocaleString()} (${d.data.percentage}%)</div>
                `;
                showTooltip(tooltip, container, event, content);
            })
            .on('pointerleave', function () {
                select(this).style('opacity', 1);
                if (!tooltip)
                    return;
                hideTooltip(tooltip);
            });

        // Center text
        g.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '-0.2em')
            .attr('fill', '#1F2937')
            .attr('font-size', '24px')
            .attr('font-weight', 'bold')
            .text(total);

        g.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '1.2em')
            .attr('fill', '#6B7280')
            .attr('font-size', '12px')
            .text('Total');

        // Legend at bottom
        const legendGroup = svg
            .append('g')
            .attr(
                'transform',
                `translate(${width / 2}, ${chartAreaHeight + 20})`,
            );

        const legendSpacing = 150;
        const startX = -((data.length - 1) * legendSpacing) / 2;

        data.forEach((d, i) => {
            const itemGroup = legendGroup
                .append('g')
                .attr(
                    'transform',
                    `translate(${startX + i * legendSpacing}, 0)`,
                );

            // Color dot
            itemGroup
                .append('circle')
                .attr('cx', -40)
                .attr('cy', 0)
                .attr('r', 5)
                .attr('fill', d.color);

            // Label text
            itemGroup
                .append('text')
                .attr('x', -30)
                .attr('y', 0)
                .attr('dy', '0.35em')
                .attr('fill', '#4B5563')
                .attr('font-size', '12px')
                .text(`${d.label}`);

            // Percentage text
            itemGroup
                .append('text')
                .attr('x', -30)
                .attr('y', 16)
                .attr('fill', '#9CA3AF')
                .attr('font-size', '11px')
                .text(`(${d.percentage}%)`);
        });
    }
</script>

<ChartContainer
    bind:this={chartContainerRef}
    title='Demographic Distribution'
    description='Student enrollment by sex'
    {height}
    cardClass='h-full'
    headerClass='p-4 lg:p-5'
    contentClass='px-4 lg:px-5 pb-4'
    onResize={createChart}
/>
