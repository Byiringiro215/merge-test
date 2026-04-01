<script lang='ts'>
    import type { Component } from 'svelte';
    import { Card } from '$lib/components/ui/card';
    import TrendingDownIcon from '@lucide/svelte/icons/trending-down';
    import TrendingUpIcon from '@lucide/svelte/icons/trending-up';

    interface Breakdown {
        label: string;
        value: string | number;
    }

    interface Props {
        title: string;
        value: string | number;
        icon: Component;
        iconBgColor?: string;
        iconColor?: string;
        change?: string;
        changeType?: 'positive' | 'negative' | 'neutral';
        changeDescription?: string;
        description?: string;
        breakdowns?: Breakdown[];
    }

    const {
        title,
        value,
        icon: Icon,
        iconBgColor = 'bg-blue-50',
        iconColor = 'text-blue-500',
        change,
        changeType = 'neutral',
        changeDescription,
        description,
        breakdowns,
    }: Props = $props();

    const changeColors = {
        positive: 'text-green-600',
        negative: 'text-red-600',
        neutral: 'text-gray-500',
    };
</script>

<Card class='p-4 bg-white border border-gray-100 shadow-sm rounded-xl h-full'>
    <div class='flex flex-col h-full'>
        <!-- Title and Icon -->
        <div class='flex items-start justify-between mb-1'>
            <span class='text-sm font-medium text-gray-500'>{title}</span>
            <div class='flex h-8 w-8 items-center justify-center rounded-lg {iconBgColor}'>
                <Icon class='h-4 w-4 {iconColor}' />
            </div>
        </div>

        <!-- Main Value -->
        <div class='text-[28px] font-bold text-gray-900 leading-tight'>
            {value}
        </div>

        <!-- Change Indicator or Description -->
        {#if change}
            <div class='flex items-center gap-1 mt-1'>
                {#if changeType === 'positive'}
                    <TrendingUpIcon class='h-3.5 w-3.5 text-green-600' />
                {:else if changeType === 'negative'}
                    <TrendingDownIcon class='h-3.5 w-3.5 text-red-600' />
                {/if}
                <span class='text-xs font-medium {changeColors[changeType]}'>{change}</span>
                {#if changeDescription}
                    <span class='text-xs text-gray-400'>{changeDescription}</span>
                {/if}
            </div>
        {:else if description}
            <p class='text-xs text-gray-400 mt-1'>{description}</p>
        {/if}

        <!-- Breakdowns -->
        {#if breakdowns && breakdowns.length > 0}
            <div class='flex items-center gap-3 mt-auto pt-3 border-t border-gray-100'>
                {#each breakdowns as breakdown (breakdown.label)}
                    <div class='text-center flex-1'>
                        <div class='text-[10px] font-medium text-gray-400 uppercase'>
                            {breakdown.label}
                        </div>
                        <div class='text-sm font-semibold text-gray-900'>
                            {breakdown.value}
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</Card>
