<script lang='ts'>
    import { Card } from '$lib/components/ui/card';
    import MonitorIcon from '@lucide/svelte/icons/monitor';
    import TrendingUpIcon from '@lucide/svelte/icons/trending-up';

    interface DeviceBreakdown {
        type: string;
        count: number;
        color: string;
    }

    interface Props {
        value: string;
        change: string;
        breakdowns: DeviceBreakdown[];
    }

    const { value, change, breakdowns }: Props = $props();
</script>

<Card class='p-5 bg-white border border-gray-100 shadow-sm rounded-xl h-full'>
    <div class='flex items-start justify-between mb-2'>
        <span class='text-sm font-medium text-gray-500'>Total Distributed Devices</span>
        <div class='flex h-10 w-10 items-center justify-center rounded-xl bg-green-50'>
            <MonitorIcon class='h-5 w-5 text-green-500' />
        </div>
    </div>

    <div class='flex items-baseline gap-2 mb-6'>
        <span class='text-[32px] font-bold text-gray-900'>{value}</span>
        <div class='flex items-center gap-1 text-green-600'>
            <TrendingUpIcon class='h-4 w-4' />
            <span class='text-sm font-medium'>{change}</span>
        </div>
    </div>

    <!-- Device Breakdowns -->
    <div class='space-y-3'>
        {#each breakdowns as item (item.type)}
            <div class='flex items-center justify-between'>
                <div class='flex items-center gap-2'>
                    <span
                        class='w-2.5 h-2.5 rounded-full'
                        style='background-color: {item.color}'
                    ></span>
                    <span class='text-sm text-gray-600'>{item.type}</span>
                </div>
                <span class='text-sm font-medium text-gray-900'>
                    {item.count.toLocaleString()}
                </span>
            </div>
        {/each}
    </div>
</Card>
