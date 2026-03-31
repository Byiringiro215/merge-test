<script lang='ts'>
    import type { CurriculumFiltersState } from '$lib/components/curricula/types.js';
    import {
        CurriculumDirectoryTable,
        CurriculumFiltersContent,
        CurriculumSmallStatsCard,
    } from '$lib/components/curricula';
    import {
        CurriculumVelocityChart,
        TradesDistributionChart,
    } from '$lib/components/curricula/curriculum';
    import { AppLayout } from '$lib/components/layout';
    import { Button } from '$lib/components/ui/button';
    import { BookOpen, FileText, Layers } from '@lucide/svelte';
    import DownloadIcon from '@lucide/svelte/icons/download';
    import FilterIcon from '@lucide/svelte/icons/filter';

    let appLayout: ReturnType<typeof AppLayout>;

    let filters = $state<CurriculumFiltersState>({
        dateRange: 'this_year',
        province: 'all',
        district: '',
        schoolType: 'all',
        trade: 'all',
    });

    function handleFiltersChange(newFilters: CurriculumFiltersState) {
        filters = newFilters;
    }

    function handleExport() {
    // TODO: implement export
    }

    function resetFilters() {
        filters = {
            dateRange: 'this_year',
            province: 'all',
            district: '',
            schoolType: 'all',
            trade: 'all',
        };
    }

    // Row 1 stats (3 cards)
    const statsRow1 = [
        {
            title: 'All',
            value: '1500',
            icon: FileText,
            iconBgColor: 'bg-blue-50',
            iconColor: 'text-blue-500',
        },
        {
            title: 'Trades',
            value: '92',
            icon: Layers,
            iconBgColor: 'bg-blue-50',
            iconColor: 'text-blue-500',
        },
        {
            title: 'Deployed E-Courses',
            value: '45',
            icon: BookOpen,
            iconBgColor: 'bg-purple-50',
            iconColor: 'text-purple-500',
            change: 'Expanding rapidly',
            changeType: 'positive' as const,
        },
        {
            title: 'VTC',
            value: '300',
            icon: FileText,
            iconBgColor: 'bg-blue-50',
            iconColor: 'text-blue-500',
        },
        {
            title: 'TSS',
            value: '1200',
            icon: FileText,
            iconBgColor: 'bg-blue-50',
            iconColor: 'text-blue-500',
            change: '+12 this quarter',
            changeType: 'positive' as const,
        },
    ];
</script>

<AppLayout
    bind:this={appLayout}
    isRightSidebar={true}
    sidebarWidth={288}
    sidebarTitle='Filters'
    onReset={resetFilters}
    containerClass='lg:pl-10 px-6'
>
    <!-- Header Section -->
    <div
        class='mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'
    >
        <div>
            <h1 class='text-[24px] font-bold text-gray-900 leading-tight'>
                Curriculum & Programs Overview
            </h1>
            <p class='mt-1 text-sm text-gray-500'>
                Monitor educational content distribution, institutional metrics,
                and development progress.
            </p>
        </div>
        <div class='flex items-center gap-3'>
            <Button
                variant='outline'
                class='gap-2 rounded-lg border-gray-200'
                onclick={handleExport}
            >
                <DownloadIcon class='h-4 w-4' />
                Export Report
            </Button>
            <!-- Mobile filter trigger -->
            <Button
                variant='outline'
                class='lg:hidden gap-2 rounded-lg'
                onclick={() => appLayout?.openSheet()}
            >
                <FilterIcon class='h-4 w-4' />
                Filters
            </Button>
        </div>
    </div>

    <!-- Stats Cards  -->
    <div class='mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
        {#each statsRow1 as stat (stat.title)}
            <CurriculumSmallStatsCard
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                iconBgColor={stat.iconBgColor}
                iconColor={stat.iconColor}
                change={stat.change}
                changeType={stat.changeType}
            />
        {/each}
    </div>

    <!-- Charts Section -->
    <div class='mb-5 grid grid-cols-1 gap-5 lg:grid-cols-3'>
        <div class='lg:col-span-2'>
            <CurriculumVelocityChart />
        </div>
        <div class='lg:col-span-1'>
            <TradesDistributionChart />
        </div>
    </div>

    <!-- Curriculum Directory Table -->
    <div class='mb-6'>
        <CurriculumDirectoryTable />
    </div>

    <!-- Right Sidebar Content -->
    {#snippet rightSidebarContent()}
        <CurriculumFiltersContent
            {filters}
            onFiltersChange={handleFiltersChange}
            onExport={handleExport}
        />
    {/snippet}
</AppLayout>
