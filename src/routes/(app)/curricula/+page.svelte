<script lang='ts'>
    import type { CurriculumFiltersState } from '$lib/components/curricula/types.js';
    import {
        CurriculumDirectoryTable,
        CurriculumFiltersContent,
        CurriculumSmallStatsCard,
        CurriculumStatsCard,
        DemographicChart,
        DevelopmentProgressChart,
        TradeAreaChart,
    } from '$lib/components/curricula';
    import { AppLayout } from '$lib/components/layout';
    import { Button } from '$lib/components/ui/button';
    import {
        BookOpen,
        Building2,
        FileText,
        GraduationCap,
        Layers,
        Users,
    } from '@lucide/svelte';
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

    // Main stats with breakdowns
    const mainStats = [
        {
            title: 'Total Curricula',
            value: '452',
            icon: BookOpen,
            iconBgColor: 'bg-blue-50',
            iconColor: 'text-blue-500',
            breakdowns: [
                {
                    label: 'PUBLIC',
                    value: 145,
                    subStats: [
                        { label: 'TSS', value: 100 },
                        { label: 'VTC', value: 45 },
                    ],
                },
                {
                    label: 'PRIVATE',
                    value: 210,
                    subStats: [
                        { label: 'TSS', value: 10 },
                        { label: 'VTC', value: 200 },
                    ],
                },
                {
                    label: 'GOV',
                    value: 97,
                    subStats: [
                        { label: 'TSS', value: 30 },
                        { label: 'VTC', value: 67 },
                    ],
                },
            ],
        },
        {
            title: 'Enrolled Students',
            value: '124.5k',
            icon: Users,
            iconBgColor: 'bg-green-50',
            iconColor: 'text-green-500',
            breakdowns: [
                { label: 'PUBLIC', value: '42.1k' },
                { label: 'PRIVATE', value: '58.4k' },
                { label: 'GOV', value: '24.0k' },
            ],
        },
        {
            title: 'Active Teachers',
            value: '8,240',
            icon: GraduationCap,
            iconBgColor: 'bg-amber-50',
            iconColor: 'text-amber-500',
            breakdowns: [
                { label: 'PUBLIC', value: '2,850' },
                { label: 'PRIVATE', value: '3,910' },
                { label: 'GOV', value: '1,480' },
            ],
        },
    ];

    // Small stats
    const smallStats = [
        {
            title: 'Assisted schools',
            value: '1500',
            icon: Building2,
            iconBgColor: 'bg-gray-100',
            iconColor: 'text-gray-600',
            change: '+12 this quarter',
            changeType: 'positive' as const,
        },
        {
            title: 'Trades',
            value: '92',
            icon: Layers,
            iconBgColor: 'bg-blue-50',
            iconColor: 'text-blue-500',
            change: '+5 this month',
            changeType: 'positive' as const,
            subLabels: [
                { label: 'TSS', value: 20 },
                { label: 'VTC', value: 72 },
            ],
        },
        {
            title: 'Deployed E-Courses',
            value: '45',
            icon: FileText,
            iconBgColor: 'bg-purple-50',
            iconColor: 'text-purple-500',
            change: 'Expanding rapidly',
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
        class='mb-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'
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

    <!-- Main Stats Cards -->
    <div class='mb-5 grid grid-cols-1 gap-6 md:grid-cols-3'>
        {#each mainStats as stat (stat.title)}
            <CurriculumStatsCard
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                iconBgColor={stat.iconBgColor}
                iconColor={stat.iconColor}
                breakdowns={stat.breakdowns}
            />
        {/each}
    </div>

    <!-- Small Stats Cards -->
    <div class='mb-5 grid grid-cols-1 gap-6 md:grid-cols-3'>
        {#each smallStats as stat (stat.title)}
            <CurriculumSmallStatsCard
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                iconBgColor={stat.iconBgColor}
                iconColor={stat.iconColor}
                change={stat.change}
                changeType={stat.changeType}
                subLabels={stat.subLabels}
            />
        {/each}
    </div>

    <!-- Charts Section -->
    <div class='mb-5 grid grid-cols-1 gap-5 lg:grid-cols-3'>
        <div class='lg:col-span-1'>
            <DevelopmentProgressChart />
        </div>
        <div class='lg:col-span-1'>
            <TradeAreaChart />
        </div>
        <div class='lg:col-span-1'>
            <DemographicChart />
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
