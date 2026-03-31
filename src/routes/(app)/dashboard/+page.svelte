<script lang='ts'>
    import type { DGFiltersState } from '$lib/components/dg-general/types.js';
    import StatsCard from '$lib/components/dashboard/StatsCard.svelte';
    import CrossDepartmentRecordsTable from '$lib/components/dg-general/CrossDepartmentRecordsTable.svelte';
    import CrossDepartmentTrendsChart from '$lib/components/dg-general/CrossDepartmentTrendsChart.svelte';
    import DGFiltersContent from '$lib/components/dg-general/DGFiltersContent.svelte';
    import RwandaRegionalMap from '$lib/components/dg-general/RwandaRegionalMap.svelte';
    import { AppLayout } from '$lib/components/layout';
    import { Button } from '$lib/components/ui/button';
    import { Card } from '$lib/components/ui/card';
    import {
        BookOpen,
        Briefcase,
        Building2,
        GraduationCap,
        HardHat,
        Users,
    } from '@lucide/svelte';
    import FilterIcon from '@lucide/svelte/icons/filter';

    let appLayout: ReturnType<typeof AppLayout>;

    let filters = $state<DGFiltersState>({
        dateRange: '',
        province: '',
        district: '',
        schoolType: '',
        faculty: '',
    });

    function handleFiltersChange(newFilters: DGFiltersState) {
        filters = newFilters;
    }

    function handleExport() {
    // TODO: implement export
    }

    function resetFilters() {
        filters = {
            dateRange: '',
            province: '',
            district: '',
            schoolType: '',
            faculty: '',
        };
    }

    const statsCards = [
        {
            title: 'Total Schools',
            value: '452',
            change: '+12%',
            changeType: 'positive' as const,
            icon: Building2,
            iconBgColor: 'bg-blue-50',
        },
        {
            title: 'Total Teachers',
            value: '12,450',
            change: '+5.2%',
            changeType: 'positive' as const,
            icon: Users,
            iconBgColor: 'bg-green-50',
        },
        {
            title: 'Total Students',
            value: '145,280',
            change: '+8.1%',
            changeType: 'positive' as const,
            icon: GraduationCap,
            iconBgColor: 'bg-amber-50',
        },
        {
            title: 'Training Programs',
            value: '124',
            change: '+2.4%',
            changeType: 'positive' as const,
            icon: BookOpen,
            iconBgColor: 'bg-purple-50',
        },
        {
            title: 'Infra Projects',
            value: '89',
            change: '-1.5%',
            changeType: 'negative' as const,
            icon: HardHat,
            iconBgColor: 'bg-red-50',
        },
        {
            title: 'SPIU Projects',
            value: '15',
            change: '0%',
            changeType: 'neutral' as const,
            icon: Briefcase,
            iconBgColor: 'bg-cyan-50',
        },
    ];
</script>

<AppLayout
    bind:this={appLayout}
    isRightSidebar={true}
    sidebarWidth={288}
    sidebarTitle='Filters'
    onReset={resetFilters}
>
    <!-- Header Section -->
    <div
        class='mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'
    >
        <div>
            <h1 class='text-[24px] font-bold text-gray-900 leading-tight'>
                Director General Overview
            </h1>
            <p class='mt-1 text-sm text-gray-500'>
                High-level insights and aggregates across all departments.
            </p>
        </div>
        <div class='flex items-center gap-3'>
            <Card
                class='px-4 py-1.5 rounded-[6px] bg-[#FAFAFB] border border-gray-100 '
            >
                <span class='text-sm leading-5 text-[#565D6D] font-normal'>
                    Data synced: <span>Just now</span>
                </span>
            </Card>
            <!-- Mobile filter trigger -->
            <Button
                variant='outline'
                class='lg:hidden gap-2 rounded-[6px]'
                onclick={() => appLayout?.openSheet()}
            >
                <FilterIcon class='h-4 w-4' />
                Filters
            </Button>
        </div>
    </div>

    <!-- Stats Cards -->
    <div class='mb-5 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6'>
        {#each statsCards as card, index (index)}
            <StatsCard
                title={card.title}
                value={card.value}
                change={card.change}
                changeType={card.changeType}
                icon={card.icon}
                iconBgColor={card.iconBgColor}
            />
        {/each}
    </div>

    <!-- Charts Section - Map and Trends -->
    <div class='mb-5 grid grid-cols-1 gap-5 lg:grid-cols-12'>
        <div class='lg:col-span-4'>
            <RwandaRegionalMap />
        </div>
        <div class='lg:col-span-8 h-105'>
            <CrossDepartmentTrendsChart />
        </div>
    </div>

    <!-- Records Table -->
    <div class='mb-6'>
        <CrossDepartmentRecordsTable />
    </div>

    <!-- Right Sidebar Content -->
    {#snippet rightSidebarContent()}
        <DGFiltersContent
            {filters}
            onFiltersChange={handleFiltersChange}
            onExport={handleExport}
        />
    {/snippet}
</AppLayout>
