<script lang='ts'>
    import type { DigitalTechFiltersState } from '$lib/components/digital-tech';
    import {
        ConnectedSchoolsCard,
        ConnectivityGrowthChart,
        DigitalTechFiltersContent,

        DistributedDevicesCard,
        HardwareAssetsTable,
        LocalServersCard,
        NetworkHealthCard,
        RegionalConnectionChart,
    } from '$lib/components/digital-tech';
    import { AppLayout } from '$lib/components/layout';
    import { Button } from '$lib/components/ui/button';
    import { Card } from '$lib/components/ui/card';
    import { RadioTower, SatelliteDish, Wifi } from '@lucide/svelte';
    import CheckCircleIcon from '@lucide/svelte/icons/check-circle';
    import FilterIcon from '@lucide/svelte/icons/filter';

    let appLayout: ReturnType<typeof AppLayout>;

    let filters = $state<DigitalTechFiltersState>({
        dateRange: '',
        province: 'all',
        district: '',
        connection: 'all',
    });

    function handleFiltersChange(newFilters: DigitalTechFiltersState) {
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
            connection: 'all',
        };
    }

    // Pagination state
    let currentPage = $state(1);
    const totalPages = 3;
    const totalItems = 452;

    function handlePageChange(page: number) {
        currentPage = page;
    }

    // Connected Schools data
    const connectionBreakdowns = [
        {
            type: 'Fiber Optic',
            count: 255,
            percentage: 56,
            color: '#3B82F6',
            icon: RadioTower,
        },
        {
            type: 'Cellular Data',
            count: 110,
            percentage: 24,
            color: '#F97316',
            icon: Wifi,
        },
        {
            type: 'Satellite & Wireless',
            count: 87,
            percentage: 20,
            color: '#8B5CF6',
            icon: SatelliteDish,
        },
    ];

    // Device breakdowns
    const deviceBreakdowns = [
        { type: 'Desktop Computers', count: 8450, color: '#3B82F6' },
        { type: 'Laptops & Tablets', count: 5750, color: '#A855F7' },
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
                Devices & Infrastructure
            </h1>
            <p class='mt-1 text-sm text-gray-500'>
                Overview of school connectivity, hardware distribution, and
                network health.
            </p>
        </div>
        <div class='flex items-center gap-3'>
            <Card
                class='px-4 py-2 rounded-lg bg-white border border-gray-200 flex items-center gap-2'
            >
                <CheckCircleIcon class='h-4 w-4 text-green-500' />
                <span class='text-sm text-gray-600'>
                    Network Status: <span class='font-medium text-green-600'
                    >Optimal</span
                    >
                </span>
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
    <div class='mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4'>
        <ConnectedSchoolsCard
            value={452}
            change='12%'
            breakdowns={connectionBreakdowns}
        />
        <LocalServersCard
            value={184}
            change='5%'
            activeCount={168}
            inactiveCount={16}
        />
        <DistributedDevicesCard
            value='14.2k'
            change='18%'
            breakdowns={deviceBreakdowns}
        />
        <NetworkHealthCard
            uptime={92}
            activeDevices={13064}
            inactiveDevices={1136}
        />
    </div>

    <!-- Charts Section -->
    <div class='mb-5 grid grid-cols-1 gap-5 lg:grid-cols-2'>
        <ConnectivityGrowthChart />
        <RegionalConnectionChart />
    </div>

    <!-- Hardware Assets Table -->
    <div class='mb-6'>
        <HardwareAssetsTable
            {currentPage}
            {totalPages}
            {totalItems}
            onPageChange={handlePageChange}
            onExport={handleExport}
        />
    </div>

    <!-- Right Sidebar Content -->
    {#snippet rightSidebarContent()}
        <DigitalTechFiltersContent
            {filters}
            onFiltersChange={handleFiltersChange}
            onExport={handleExport}
        />
    {/snippet}
</AppLayout>
