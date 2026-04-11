<script lang='ts'>
    import { Card } from '$lib/components/ui/card';
    import ActivityIcon from '@lucide/svelte/icons/activity';

    interface Props {
        uptime: number;
        activeDevices: number;
        inactiveDevices: number;
    }

    const { uptime, activeDevices, inactiveDevices }: Props = $props();

    const total = $derived(activeDevices + inactiveDevices);
    const activePercentage = $derived(
        total > 0 ? (activeDevices / total) * 100 : 0,
    );
</script>

<Card class='p-5 bg-white border border-gray-100 shadow-sm rounded-xl h-full'>
    <div class='flex items-start justify-between mb-2'>
        <span class='text-sm font-medium text-gray-500'>Network Device Health</span>
        <div class='flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100'>
            <ActivityIcon class='h-5 w-5 text-gray-500' />
        </div>
    </div>

    <div class='flex items-baseline gap-2 mb-6'>
        <span class='text-[32px] font-bold text-gray-900'>{uptime}%</span>
        <span class='text-sm text-gray-500'>uptime</span>
    </div>

    <!-- Device Status -->
    <div class='space-y-4'>
        <!-- Active Devices -->
        <div>
            <div class='flex items-center justify-between mb-1'>
                <span class='text-sm text-gray-600'>Active Devices</span>
                <span class='text-sm font-medium text-green-600'>
                    {activeDevices.toLocaleString()}
                </span>
            </div>
            <div class='h-2 bg-gray-100 rounded-full overflow-hidden'>
                <div
                    class='h-full bg-green-500 rounded-full transition-all duration-500'
                    style='width: {activePercentage}%'
                ></div>
            </div>
        </div>

        <!-- Inactive/Maintenance -->
        <div>
            <div class='flex items-center justify-between mb-1'>
                <span class='text-sm text-gray-600'>Inactive/Maintenance</span>
                <span class='text-sm font-medium text-red-600'>
                    {inactiveDevices.toLocaleString()}
                </span>
            </div>
            <div class='h-2 bg-gray-100 rounded-full overflow-hidden'>
                <div
                    class='h-full bg-red-500 rounded-full transition-all duration-500'
                    style='width: {100 - activePercentage}%'
                ></div>
            </div>
        </div>
    </div>
</Card>
