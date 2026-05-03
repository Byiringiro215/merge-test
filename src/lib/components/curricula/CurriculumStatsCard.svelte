<script lang='ts'>
    import type { Component } from 'svelte';
    import type { StatBreakdown } from './types.js';
    import { Card } from '$lib/components/ui/card';

    interface Props {
        title: string;
        value: string;
        icon: Component;
        iconBgColor?: string;
        iconColor?: string;
        breakdowns: StatBreakdown[];
    }

    const {
        title,
        value,
        icon: Icon,
        iconBgColor = 'bg-blue-50',
        iconColor = 'text-blue-500',
        breakdowns,
    }: Props = $props();
</script>

<Card class=' rounded-lg shadow-none border-[#DEE1E6] h-[215px]'>
    <!-- Header -->
    <div class='p-6'>
        <div class='flex items-start justify-between'>
            <span class='text-sm font-medium text-gray-600'>{title}</span>
            <div class={`p-2 rounded-lg ${iconBgColor}`}>
                <Icon class={`h-5 w-5 ${iconColor}`} />
            </div>
        </div>

        <!-- Main Value -->
        <div class='text-4xl font-bold text-gray-900 mb-2.75'>{value}</div>
    </div>

    <!-- Breakdowns -->
    <div
        class='flex items-center justify-between border-t h-18.25 border-gray-100'
    >
        {#each breakdowns as breakdown, i (i)}
            <div
                class='text-center flex-1 border h-full border-b-0 border-[#DEE1E6]'
            >
                <div
                    class='text-xs font-normal text-gray-400 uppercase tracking-wide'
                >
                    {breakdown.label}
                </div>
                <div class='text-lg font-semibold text-gray-900'>
                    {breakdown.value}
                </div>
                {#if breakdown.subStats && breakdown.subStats.length > 0}
                    <div class='flex items-center justify-center gap-2 mt-1'>
                        {#each breakdown.subStats as subStat (subStat.label)}
                            <span class='text-[10px] text-gray-400'>
                                <span class='text-primary'>{subStat.label}</span
                                >: {subStat.value}
                            </span>
                        {/each}
                    </div>
                {/if}
            </div>
        {/each}
    </div>
</Card>
