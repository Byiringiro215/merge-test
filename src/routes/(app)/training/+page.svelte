<script lang='ts'>
    import type { TrainingFiltersState } from '$lib/components/training';
    import { AppLayout } from '$lib/components/layout';
    import {
        EnrollmentByTradeChart,
        TrainingFiltersContent,

        TrainingRecordsTable,
        TrainingVelocityChart,
    } from '$lib/components/training';
    import { Button } from '$lib/components/ui/button';
    import { Card } from '$lib/components/ui/card';
    import {
        Activity,
        Award,
        Building2,
        Factory,
        GraduationCap,
        Users,
    } from '@lucide/svelte';
    import CalendarIcon from '@lucide/svelte/icons/calendar';
    import FilterIcon from '@lucide/svelte/icons/filter';
    import TrendingDownIcon from '@lucide/svelte/icons/trending-down';
    import TrendingUpIcon from '@lucide/svelte/icons/trending-up';

    let appLayout: ReturnType<typeof AppLayout>;

    let filters = $state<TrainingFiltersState>({
        dateRange: 'this_year',
        province: 'all',
        district: '',
        schoolType: 'all',
        tradeArea: '',
    });

    function handleFiltersChange(newFilters: TrainingFiltersState) {
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
            tradeArea: '',
        };
    }

    // Pagination state
    let currentPage = $state(1);
    const totalPages = 3;
    const totalItems = 248;

    function handlePageChange(page: number) {
        currentPage = page;
    }

    // Stats data matching Figma design
    const statsCards = [
        {
            title: 'Total Students',
            value: '85,240',
            change: '+4.5%',
            changeType: 'positive' as const,
            changeDescription: 'from last year',
            icon: Users,
            iconBgColor: 'bg-blue-50',
        },
        {
            title: 'Active Teachers',
            value: '4,150',
            change: '+2.1%',
            changeType: 'positive' as const,
            changeDescription: 'from last year',
            icon: GraduationCap,
            iconBgColor: 'bg-green-50',
        },
        {
            title: 'Ongoing Trainings',
            value: '1,248',
            description: 'Across 45 distinct trade areas',
            icon: Activity,
            iconBgColor: 'bg-purple-50',
        },
        {
            title: 'Production Units',
            value: '87',
            change: '-1',
            changeType: 'negative' as const,
            changeDescription: 'closed for maintenance',
            icon: Factory,
            iconBgColor: 'bg-amber-50',
        },
        {
            title: 'Special Academics',
            value: '32',
            description: 'Centers of Excellence active',
            icon: Award,
            iconBgColor: 'bg-cyan-50',
        },
    ];

    // School breakdown for first card
    const schoolBreakdowns = [
        { label: 'PUBLIC', value: 142 },
        { label: 'PRIVATE', value: 198 },
        { label: 'GOV', value: 44 },
    ];

    const iconColors: Record<string, string> = {
        'bg-blue-50': 'text-blue-600',
        'bg-green-50': 'text-green-600',
        'bg-amber-50': 'text-amber-600',
        'bg-purple-50': 'text-purple-600',
        'bg-cyan-50': 'text-cyan-600',
    };

    const changeColors: Record<string, string> = {
        positive: 'text-green-600',
        negative: 'text-red-600',
    };
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
                Training management overview
            </h1>
            <p class='mt-1 text-sm text-gray-500'>
                Monitor training activities, enrollment statistics, and facility metrics.
            </p>
        </div>
        <div class='flex items-center gap-3'>
            <Card
                class='px-4 py-2 rounded-lg bg-white border border-gray-200 flex items-center gap-2'
            >
                <CalendarIcon class='h-4 w-4 text-gray-400' />
                <span class='text-sm text-gray-600'>Oct 2023 - Present</span>
            </Card>
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

    <!-- Stats Cards -->
    <div class='mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'>
        <!-- First Card: Total Schools with breakdown -->
        <Card class='p-4 bg-white border border-gray-100 shadow-sm rounded-xl'>
            <div class='flex items-start justify-between mb-2'>
                <span class='text-sm font-medium text-gray-500'>Total Schools</span>
                <div class='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50'>
                    <Building2 class='h-4 w-4 text-blue-600' />
                </div>
            </div>
            <div class='text-[28px] font-bold text-gray-900 leading-tight mb-3'>
                384
            </div>
            <div class='flex items-center justify-between pt-3 border-t border-gray-100'>
                {#each schoolBreakdowns as item (item.label)}
                    <div class='text-center'>
                        <div class='text-[10px] font-medium text-gray-400 uppercase'>
                            {item.label}
                        </div>
                        <div class='text-sm font-semibold text-gray-900'>{item.value}</div>
                    </div>
                {/each}
            </div>
        </Card>

        <!-- Other Stats Cards -->
        {#each statsCards as stat (stat.title)}
            <Card class='p-4 bg-white border border-gray-100 shadow-sm rounded-xl'>
                <div class='flex items-start justify-between mb-2'>
                    <span class='text-sm font-medium text-gray-500'>{stat.title}</span>
                    <div class='flex h-8 w-8 items-center justify-center rounded-lg {stat.iconBgColor}'>
                        <stat.icon class="h-4 w-4 {iconColors[stat.iconBgColor] || 'text-blue-600'}" />
                    </div>
                </div>
                <div class='text-[28px] font-bold text-gray-900 leading-tight'>
                    {stat.value}
                </div>
                {#if stat.change}
                    <div class='flex items-center gap-1 mt-1'>
                        {#if stat.changeType === 'positive'}
                            <TrendingUpIcon class='h-3.5 w-3.5 text-green-600' />
                        {:else if stat.changeType === 'negative'}
                            <TrendingDownIcon class='h-3.5 w-3.5 text-red-600' />
                        {/if}
                        <span class='text-xs font-medium {changeColors[stat.changeType]}'>{stat.change}</span>
                        {#if stat.changeDescription}
                            <span class='text-xs text-gray-400'>{stat.changeDescription}</span>
                        {/if}
                    </div>
                {:else if stat.description}
                    <p class='text-xs text-gray-400 mt-1'>{stat.description}</p>
                {/if}
            </Card>
        {/each}
    </div>

    <!-- Charts Section -->
    <div class='mb-5 grid grid-cols-1 gap-5 lg:grid-cols-2'>
        <TrainingVelocityChart />
        <EnrollmentByTradeChart />
    </div>

    <!-- Training Records Table -->
    <div class='mb-6'>
        <TrainingRecordsTable
            {currentPage}
            {totalPages}
            {totalItems}
            onPageChange={handlePageChange}
        />
    </div>

    <!-- Right Sidebar Content -->
    {#snippet rightSidebarContent()}
        <TrainingFiltersContent
            {filters}
            onFiltersChange={handleFiltersChange}
            onExport={handleExport}
        />
    {/snippet}
</AppLayout>
