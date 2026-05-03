<script lang='ts'>
    import type { Component } from 'svelte';
    import { Card } from '$lib/components/ui/card';
    import TrendingUpIcon from '@lucide/svelte/icons/trending-up';
    import WifiIcon from '@lucide/svelte/icons/wifi';

    interface ConnectionBreakdown {
        type: string;
        count: number;
        percentage: number;
        color: string;
        icon: Component;
    }

    interface Props {
        value: number;
        change: string;
        breakdowns: ConnectionBreakdown[];
    }

    const { value, change, breakdowns }: Props = $props();
</script>

<Card class='p-5 bg-white border border-gray-100 shadow-sm rounded-lg h-full'>
    <div class='flex items-start justify-between mb-2'>
        <span class='text-sm font-medium text-gray-500'>Connected Schools</span>
        <div
            class='flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50'
        >
            <WifiIcon class='h-5 w-5 text-blue-500' />
        </div>
    </div>

    <div class='flex items-baseline gap-2 mb-4'>
        <span class='text-[32px] font-bold text-gray-900'>{value}</span>
        <div class='flex items-center gap-1 text-green-600'>
            <TrendingUpIcon class='h-4 w-4' />
            <span class='text-sm font-medium'>{change}</span>
        </div>
    </div>

    <!-- Connection Breakdowns -->
    <div class='space-y-3'>
        {#each breakdowns as item (item.type)}
            <div class='flex items-center justify-between'>
                <div class='flex items-center gap-2'>
                    <item.icon class='h-3 w-3 text-gray-500' />
                    <span class='text-sm text-gray-600'>{item.type}</span>
                </div>
                <span class='text-sm font-medium text-gray-900'>
                    {item.count} ({item.percentage}%)
                </span>
            </div>
            <div class='h-1.5 bg-gray-100 rounded-full overflow-hidden'>
                <div
                    class='h-full rounded-full transition-all duration-500'
                    style='width: {item.percentage}%; background-color: {item.color}'
                ></div>
            </div>
        {/each}
    </div>
</Card>
