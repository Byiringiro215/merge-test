<script lang='ts'>
    import type { FacultySuccessData } from './types.js';
    import { ChartContainer } from '$lib/components/ui/chart-container';
    import {
        axisBottom,
        axisLeft,
        curveMonotoneX,
        easeQuadOut,
        line,
        scaleBand,
        scaleLinear,
        select,
    } from 'd3';

    interface Props {
        data?: FacultySuccessData[];
    }

    const defaultData: FacultySuccessData[] = [
        {
            faculty: 'Information Technology',
            abbreviation: 'IT',
            currentRate: 88,
            nationalTarget: 85,
        },
        {
            faculty: 'Tourism & Hospitality',
            abbreviation: 'Tourism',
            currentRate: 82,
            nationalTarget: 85,
        },
        {
            faculty: 'Mechanical Engineering',
            abbreviation: 'Mecha',
            currentRate: 65,
            nationalTarget: 85,
        },
        {
            faculty: 'Civil Engineering',
            abbreviation: 'Civil',
            currentRate: 92,
            nationalTarget: 85,
        },
        {
            faculty: 'Agriculture',
            abbreviation: 'Agri',
            currentRate: 78,
            nationalTarget: 85,
        },
    ];

    const { data = defaultData }: Props = $props();

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

        tooltip.textContent = content;
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

        const margin = { top: 20, right: 20, left: 40, bottom: 50 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const svg = select(container)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        const g = svg
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Scales
        const xScale = scaleBand()
            .domain(data.map(d => d.abbreviation))
            .range([0, innerWidth])
            .padding(0.57);

        const yScale = scaleLinear().domain([0, 100]).range([innerHeight, 0]);

        // Y-axis grid lines
        const yTickValues = [0, 25, 50, 75, 100];
        g.append('g')
            .attr('class', 'grid')
            .selectAll('line')
            .data(yTickValues)
            .enter()
            .append('line')
            .attr('x1', 0)
            .attr('x2', innerWidth)
            .attr('y1', (d: number) => yScale(d))
            .attr('y2', (d: number) => yScale(d))
            .attr('stroke', '#e5e7eb')
            .attr('stroke-dasharray', '4,4');

        // Draw bars with rounded top corners - animate from bottom
        const barWidth = xScale.bandwidth();
        const cornerRadius = 6;

        const bars = g
            .selectAll<SVGPathElement, FacultySuccessData>('.bar')
            .data(data)
            .enter()
            .append('path')
            .attr('class', 'bar')
            .attr('fill', '#3B82F6')
            .style('cursor', 'pointer')
            .attr('d', (d: FacultySuccessData) => {
                const x = xScale(d.abbreviation) || 0;
                return `M${x},${innerHeight} L${x},${innerHeight} L${x + barWidth},${innerHeight} L${x + barWidth},${innerHeight} Z`;
            });

        // Animate bars growing from bottom
        bars.transition()
            .duration(800)
            .delay((_: FacultySuccessData, i: number) => i * 100)
            .attr('d', (d: FacultySuccessData) => {
                const x = xScale(d.abbreviation) || 0;
                const y = yScale(d.currentRate);
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
            'pointerenter',
            function (event: PointerEvent, d: FacultySuccessData) {
                select(this)
                    .transition()
                    .duration(200)
                    .ease(easeQuadOut)
                    .attr('fill', '#2563eb')
                    .attr('opacity', 0.9);

                if (!tooltip)
                    return;
                showTooltip(
                    tooltip,
                    container,
                    event,
                    `${d.faculty}: ${d.currentRate}% success rate`,
                );
            },
        )
            .on(
                'pointermove',
                (event: PointerEvent, d: FacultySuccessData) => {
                    if (!tooltip)
                        return;
                    showTooltip(
                        tooltip,
                        container,
                        event,
                        `${d.faculty}: ${d.currentRate}% success rate`,
                    );
                },
            )
            .on('pointerleave', function () {
                select(this)
                    .transition()
                    .duration(200)
                    .ease(easeQuadOut)
                    .attr('fill', '#3B82F6')
                    .attr('opacity', 1);

                if (!tooltip)
                    return;
                hideTooltip(tooltip);
            });

        // Draw target line
        const lineGenerator = line<FacultySuccessData>()
            .x(d => (xScale(d.abbreviation) || 0) + barWidth / 2)
            .y(d => yScale(d.nationalTarget))
            .curve(curveMonotoneX);

        const linePath = g
            .append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', '#9CA3AF')
            .attr('stroke-width', 2)
            .attr('d', lineGenerator);

        // Animate line
        const totalLength = linePath.node()?.getTotalLength() || 0;
        linePath
            .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
            .attr('stroke-dashoffset', totalLength)
            .transition()
            .duration(1000)
            .delay(600)
            .attr('stroke-dashoffset', 0);

        // Draw circle markers on line
        const dots = g
            .selectAll<SVGCircleElement, FacultySuccessData>('.target-dot')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'target-dot')
            .attr('cx', d => (xScale(d.abbreviation) || 0) + barWidth / 2)
            .attr('cy', d => yScale(d.nationalTarget))
            .attr('r', 0)
            .attr('fill', 'white')
            .attr('stroke', '#9CA3AF')
            .attr('stroke-width', 2)
            .style('cursor', 'pointer');

        // Animate dots
        dots.transition()
            .duration(400)
            .delay((_: FacultySuccessData, i: number) => 800 + i * 80)
            .attr('r', 5);

        // Dot hover effects
        dots.on(
            'pointerenter',
            function (event: PointerEvent, d: FacultySuccessData) {
                select(this)
                    .transition()
                    .duration(150)
                    .attr('r', 7)
                    .attr('fill', '#9CA3AF');

                if (!tooltip)
                    return;
                showTooltip(
                    tooltip,
                    container,
                    event,
                    `${d.faculty}: ${d.nationalTarget}% national target`,
                );
            },
        )
            .on(
                'pointermove',
                (event: PointerEvent, d: FacultySuccessData) => {
                    if (!tooltip)
                        return;
                    showTooltip(
                        tooltip,
                        container,
                        event,
                        `${d.faculty}: ${d.nationalTarget}% national target`,
                    );
                },
            )
            .on('pointerleave', function () {
                select(this)
                    .transition()
                    .duration(150)
                    .attr('r', 5)
                    .attr('fill', 'white');

                if (!tooltip)
                    return;
                hideTooltip(tooltip);
            });

        // X Axis
        const xAxis = g
            .append('g')
            .attr('transform', `translate(0,${innerHeight})`)
            .call(axisBottom(xScale).tickSize(0));

        xAxis.select('.domain').remove();
        xAxis
            .selectAll('text')
            .attr('fill', '#171A1F')
            .attr('font-size', '12px')
            .attr('dy', '1em');

        // Y Axis
        const yAxis = g.append('g').call(
            axisLeft(yScale)
                .tickValues(yTickValues)
                .tickFormat(d => d.toString())
                .tickSize(0),
        );

        yAxis.select('.domain').remove();
        yAxis
            .selectAll('text')
            .attr('fill', '#171A1F')
            .attr('font-size', '12px')
            .attr('dx', '-0.5em');
    }
</script>

<ChartContainer
    bind:this={chartContainerRef}
    title='Faculty Success Rates'
    description='Comparison of current student success rates vs national targets per faculty.'
    {height}
    onResize={createChart}
    cardClass='border-0'
>
    {#snippet legend()}
        <div class='flex items-center gap-2'>
            <div class='h-3 w-3 rounded-sm bg-[#3B82F6]'></div>
            <span class='text-sm text-gray-600'>Current Rate</span>
        </div>
        <div class='flex items-center gap-2'>
            <div class='flex items-center'>
                <div class='h-0.5 w-4 bg-gray-400'></div>
                <div
                    class='h-2.5 w-2.5 rounded-full bg-white border-2 border-gray-400 -ml-1'
                ></div>
            </div>
            <span class='text-sm text-gray-600'>National Target</span>
        </div>
    {/snippet}
</ChartContainer>
