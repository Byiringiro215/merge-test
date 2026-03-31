<script lang='ts'>
    import type { SchoolsFiltersState } from '$lib/components/curricula/schools';
    import {
        SchoolsFiltersContent,
        SchoolsTable,

    } from '$lib/components/curricula/schools';
    import { AppLayout } from '$lib/components/layout';
    import { Button } from '$lib/components/ui/button';
    import Building2Icon from '@lucide/svelte/icons/building-2';
    import DownloadIcon from '@lucide/svelte/icons/download';
    import FilterIcon from '@lucide/svelte/icons/filter';

    let appLayout: ReturnType<typeof AppLayout>;

    let filters = $state<SchoolsFiltersState>({
        institutionTypes: ['public', 'private'],
        provinces: [],
        district: '',
    });

    function handleFiltersChange(newFilters: SchoolsFiltersState) {
        filters = newFilters;
    }

    function handleApplyFilters() {
    // TODO: implement filters
    }

    function handleExport() {
    // TODO: implement export
    }

    function resetFilters() {
        filters = {
            institutionTypes: [],
            provinces: [],
            district: '',
        };
    }

    // Pagination state
    let currentPage = $state(1);
    const totalPages = 3;
    const totalItems = 10;

    function handlePageChange(page: number) {
        currentPage = page;
    }
</script>

<AppLayout
    bind:this={appLayout}
    isRightSidebar={true}
    sidebarWidth={288}
    sidebarTitle='Filters'
    onReset={resetFilters}
    containerClass='lg:pl-10 px-6'
>
    <!-- Breadcrumb -->
    <div class='flex items-center justify-between gap-2 mb-4'>
        <div class='flex items-center gap-2'>
            <div
                class='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50'
            >
                <Building2Icon class='h-4 w-4 text-secondary' />
            </div>
            <span class='text-sm font-normal text-gray-500'>Schools</span>
        </div>
        <!-- Mobile filter trigger -->
        <Button
            variant='outline'
            class='lg:hidden gap-2 rounded-[6px] '
            onclick={() => appLayout?.openSheet()}
        >
            <FilterIcon class='h-4 w-4' />
            Filters
        </Button>
    </div>

    <!-- Header Section -->
    <div class='mb-8 flex gap-4 justify-between'>
        <div>
            <div class='flex items-center gap-3'>
                <h1
                    class='text-[30px] font-bold text-[#171A1F] font-inter leading-tight'
                >
                    Schools
                </h1>
                <span
                    class='inline-flex items-center rounded-full w-20.5 bg-[#F3F4F6] px-3 py-1 text-xs font-semibold text-[#1E2128]'
                >
                    10 Total
                </span>
            </div>
            <p class='mt-2 text-sm text-gray-500'>
                Detailed registry of all educational institutions currently.
            </p>
        </div>

        <Button
            class='gap-2 rounded-[6px] px-6! py-5!  font-normal text-sm bg-primary'
            onclick={handleExport}
        >
            <DownloadIcon class='h-4 w-4' />
            Export CSV
        </Button>
    </div>

    <!-- Schools Table -->
    <div class='mb-6'>
        <SchoolsTable
            {currentPage}
            {totalPages}
            {totalItems}
            onPageChange={handlePageChange}
        />
    </div>

    <!-- Right Sidebar Content -->
    {#snippet rightSidebarContent()}
        <SchoolsFiltersContent
            {filters}
            onFiltersChange={handleFiltersChange}
            onApplyFilters={handleApplyFilters}
        />
    {/snippet}
</AppLayout>
