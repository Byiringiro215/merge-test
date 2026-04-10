<script lang='ts'>
    import ActivityFeed from '$lib/components/dashboard/ActivityFeed.svelte';
    import DistrictChart from '$lib/components/dashboard/DistrictChart.svelte';
    import DonutChart from '$lib/components/dashboard/DonutChart.svelte';
    import PerformanceChart from '$lib/components/dashboard/PerformanceChart.svelte';
    import RecordsTable from '$lib/components/dashboard/RecordsTable.svelte';
    import StatsCard from '$lib/components/dashboard/StatsCard.svelte';
    import { Button } from '$lib/components/ui/button';
    import {
        BookOpen,
        Building2,
        CheckCircle,
        Clock,
        IdCard,
        TrendingUp,
        Users,
    } from '@lucide/svelte';

    const statsCards = [
        {
            title: 'Total Students',
            value: '4,280',
            change: '+12.5%',
            changeType: 'positive' as const,
            icon: Users,
        },
        {
            title: 'Total Teachers',
            value: '342',
            change: '+4.2%',
            changeType: 'positive' as const,
            icon: IdCard,
        },
        {
            title: 'High Schools',
            value: '51',
            change: 'Stable',
            changeType: 'positive' as const,
            icon: Building2,
        },
        {
            title: 'Avg Score',
            value: '76.4%',
            change: '+3.1%',
            changeType: 'positive' as const,
            icon: TrendingUp,
        },
        {
            title: 'Success Rate',
            value: '86.5%',
            change: '+5.0%',
            changeType: 'positive' as const,
            icon: CheckCircle,
        },
        {
            title: 'Trades',
            value: '6',
            change: 'Targeted',
            changeType: 'targeted' as const,
            icon: BookOpen,
        },
    ];
</script>

<div class='mx-auto max-w-375 px-4 py-6 sm:px-6'>
    <!-- Header Section -->
    <div
        class='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'
    >
        <div>
            <h1 class='text-xl font-inter font-bold text-gray-900 sm:text-3xl'>
                General Overview
            </h1>
            <p class='mt-0.5 text-xs text-primary-gray sm:mt-1 sm:text-sm'>
                Real-time performance metrics for High Schools across Rwanda's
                key districts.
            </p>
        </div>
        <div class='flex items-center gap-3'>
            <button
                class='inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50'
            >
                <Clock class='h-4 w-4' />
                Last 30 Days
            </button>
            <Button class='bg-primary hover:bg-blue-700'>
                Generate System Report
            </Button>
        </div>
    </div>

    <!-- Stats Cards -->
    <div
        class='mb-7 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
    >
        {#each statsCards as card, index (index)}
            <StatsCard
                title={card.title}
                value={card.value}
                change={card.change}
                changeType={card.changeType}
                icon={card.icon}
            />
        {/each}
    </div>

    <!-- Charts Section -->
    <div class='mb-7 grid grid-cols-1 gap-6 lg:grid-cols-3'>
        <div class='lg:col-span-2'>
            <PerformanceChart />
        </div>
        <div>
            <DonutChart />
        </div>
    </div>

    <!-- District Chart & Activity Feed -->
    <div class='mb-7 grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <DistrictChart />
        <ActivityFeed />
    </div>

    <!-- Records Table -->
    <RecordsTable />
</div>
