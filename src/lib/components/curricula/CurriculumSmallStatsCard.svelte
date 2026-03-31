<script lang='ts'>
    import type { Component } from 'svelte';
    import { Card } from '$lib/components/ui/card';
    import TrendingUpIcon from '@lucide/svelte/icons/trending-up';

    interface SubLabel {
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
        subLabels?: SubLabel[];
    }

    const {
        title,
        value,
        icon: Icon,
        iconBgColor = 'bg-gray-100',
        iconColor = 'text-gray-600',
        change,
        changeType = 'positive',
        subLabels,
    }: Props = $props();

    const changeColorClass = {
        positive: 'text-green-500',
        negative: 'text-red-500',
        neutral: 'text-gray-500',
    };
</script>

<Card class='p-5  shadow-none! border border-[#DEE1E6]'>
    <div class='flex items-start gap-4'>
        <!-- Icon -->
        <div class={`p-3 rounded-xl ${iconBgColor}`}>
            <Icon class={`h-5 w-5 ${iconColor}`} />
        </div>

        <!-- Content -->
        <div class='flex-1'>
            <div class='flex items-center gap-2 mb-1'>
                <span class='text-sm font-medium text-gray-600'>{title}</span>
                {#if subLabels && subLabels.length > 0}
                    <div class='flex items-center gap-2'>
                        {#each subLabels as subLabel (subLabel.label)}
                            <span
                                class='text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-primary'
                            >
                                {subLabel.label}: {subLabel.value}
                            </span>
                        {/each}
                    </div>
                {/if}
            </div>

            <div class='flex items-baseline gap-2'>
                <span class='text-2xl font-bold text-gray-900'>{value}</span>
                {#if change}
                    <span
                        class='flex items-center gap-1 text-sm {changeColorClass[
                            changeType
                        ]}'
                    >
                        <TrendingUpIcon class='h-3.5 w-3.5' />
                        {change}
                    </span>
                {/if}
            </div>
        </div>
    </div>
</Card>
