<script lang='ts'>
    import { Card } from '$lib/components/ui/card';
    import ServerIcon from '@lucide/svelte/icons/server';
    import TrendingUpIcon from '@lucide/svelte/icons/trending-up';

    interface Props {
        value: number;
        change: string;
        activeCount: number;
        inactiveCount: number;
    }

    const { value, change, activeCount, inactiveCount }: Props = $props();
</script>

<Card class='p-5 bg-white border border-gray-100 shadow-sm rounded-lg h-full'>
    <div class='flex items-start justify-between mb-2'>
        <span class='text-sm font-medium text-gray-500'>Local Servers Deployments</span>
        <div class='flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100'>
            <ServerIcon class='h-5 w-5 text-gray-500' />
        </div>
    </div>

    <div class='flex items-baseline gap-2 mb-6'>
        <span class='text-[32px] font-bold text-gray-900'>{value}</span>
        <div class='flex items-center gap-1 text-green-600'>
            <TrendingUpIcon class='h-4 w-4' />
            <span class='text-sm font-medium'>{change}</span>
        </div>
    </div>

    <!-- Active/Inactive Boxes -->
    <div class='flex gap-3 '>
        <div class='flex-1 rounded-lg border border-gray-200 p-3 text-center'>
            <div class='text-2xl font-bold text-green-600'>{activeCount}</div>
            <div class='text-xs text-gray-500 uppercase tracking-wide'>Active</div>
        </div>
        <div class='flex-1 rounded-lg border border-gray-200 p-3 text-center'>
            <div class='text-2xl font-bold text-red-500'>{inactiveCount}</div>
            <div class='text-xs text-gray-500 uppercase tracking-wide'>Inactive</div>
        </div>
    </div>
</Card>
