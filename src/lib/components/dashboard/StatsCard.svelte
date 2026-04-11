<script lang='ts'>
    import type { Component } from 'svelte';
    import { Card } from '$lib/components/ui/card';
    import TrendingDownIcon from '@lucide/svelte/icons/trending-down';
    import TrendingUpIcon from '@lucide/svelte/icons/trending-up';

    interface Props {
        title: string;
        value: string | number;
        change?: string;
        changeType?: 'positive' | 'negative' | 'neutral' | 'targeted';
        icon: Component;
        iconBgColor?: string;
    }

    const {
        title,
        value,
        change,
        changeType = 'neutral',
        icon: Icon,
        iconBgColor = 'bg-blue-50',
    }: Props = $props();

    const changeColors = {
        positive: 'text-green-600',
        negative: 'text-red-600',
        neutral: 'text-blue-600',
        targeted: 'text-green-600',
    };

    const iconColors: Record<string, string> = {
        'bg-blue-50': 'text-blue-600',
        'bg-green-50': 'text-green-600',
        'bg-amber-50': 'text-amber-600',
        'bg-purple-50': 'text-purple-600',
        'bg-red-50': 'text-red-600',
        'bg-cyan-50': 'text-cyan-600',
        'bg-primary/10': 'text-blue-800',
    };
</script>

<Card class='p-5 bg-white border border-gray-100 shadow-sm rounded-xl'>
    <div class='flex items-start justify-between'>
        <div
            class='flex h-12 w-12 items-center justify-center rounded-xl {iconBgColor}'
        >
            <Icon
                class="h-5 w-5 {iconColors[iconBgColor] || 'text-blue-600'}"
            />
        </div>
        {#if change}
            <div class='flex items-center gap-0.5 {changeColors[changeType]}'>
                {#if changeType === 'positive' || changeType === 'targeted'}
                    <TrendingUpIcon class='h-4 w-4' />
                {:else if changeType === 'negative'}
                    <TrendingDownIcon class='h-4 w-4' />
                {/if}
                <span class='text-sm font-medium'>{change}</span>
            </div>
        {/if}
    </div>
    <div class='mt-4'>
        <p class='text-sm text-gray-500 leading-tight'>{title}</p>
        <p class='mt-1 text-[30px] font-bold text-gray-900 leading-tight'>
            {value}
        </p>
    </div>
</Card>
