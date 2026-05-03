<script lang='ts'>
    import type { DGFiltersState, RegionData } from '$lib/components/dg-general/types.js';
    import StatsCard from '$lib/components/dashboard/StatsCard.svelte';
    import CrossDepartmentRecordsTable from '$lib/components/dg-general/CrossDepartmentRecordsTable.svelte';
    import CrossDepartmentTrendsChart from '$lib/components/dg-general/CrossDepartmentTrendsChart.svelte';
    import DGFiltersContent from '$lib/components/dg-general/DGFiltersContent.svelte';
    import RwandaRegionalMap from '$lib/components/dg-general/RwandaRegionalMap.svelte';
    import { PROVINCE_COLORS } from '$lib/components/dg-general/types.js';
    import { AppLayout } from '$lib/components/layout';
    import LoadingBar from '$lib/components/loading-bar/loading-bar.svelte';
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
    import {
        fetchDistricts,
        fetchOverviewByProvince,
        fetchProvinces,
    } from './page.remote';

    let appLayout: ReturnType<typeof AppLayout>;

    let filters = $state<DGFiltersState>({
        dateRange: '',
        province: '',
        district: '',
        schoolType: '',
        trade: '',
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
            trade: '',
        };
    }

    // Reactive queries
    const provincesQuery = $derived(fetchProvinces());
    const provinces = $derived(provincesQuery.current ?? []);

    const districtsQuery = $derived(
        fetchDistricts(
            filters.province && filters.province !== 'all'
                ? { provinceId: filters.province }
                : {},
        ),
    );
    const districts = $derived(districtsQuery.current ?? []);

    const overviewQuery = $derived(
        fetchOverviewByProvince({
            ...(filters.province && filters.province !== 'all'
                ? { provinceId: filters.province }
                : {}),
            ...(filters.district && filters.district !== 'all'
                ? { districtId: filters.district }
                : {}),
        }),
    );

    let isInitialLoad = $state(true);
    $effect(() => {
        if (!overviewQuery.loading) {
            isInitialLoad = false;
        }
    });
    const showLoading = $derived(!isInitialLoad && overviewQuery.loading);

    const overviewRows = $derived(overviewQuery.current?.rows ?? []);
    const lastMaterialisedAt = $derived(
        overviewQuery.current?.lastMaterialisedAt ?? null,
    );

    const totals = $derived(
        overviewRows.reduce(
            (acc, r) => ({
                schools: acc.schools + r.totals.schools,
                students: acc.students + r.totals.students,
                teachers: acc.teachers + r.totals.teachers,
            }),
            { schools: 0, students: 0, teachers: 0 },
        ),
    );

    function fmt(n: number): string {
        return n.toLocaleString();
    }

    const dataSyncedLabel = $derived(
        lastMaterialisedAt
            ? new Date(lastMaterialisedAt).toLocaleString()
            : 'Never',
    );

    // Filter dropdown options sourced from API.
    const provinceOptions = $derived([
        { value: 'all', label: 'All Provinces' },
        ...provinces.map(p => ({ value: String(p.id), label: p.name })),
    ]);
    const districtOptions = $derived([
        { value: 'all', label: 'All Districts' },
        ...districts.map(d => ({ value: String(d.id), label: d.name })),
    ]);

    const statsCards = $derived([
        {
            title: 'Total Schools',
            value: fmt(totals.schools),
            icon: Building2,
            iconBgColor: 'bg-blue-50',
        },
        {
            title: 'Total Teachers',
            value: fmt(totals.teachers),
            icon: Users,
            iconBgColor: 'bg-green-50',
        },
        {
            title: 'Total Students',
            value: fmt(totals.students),
            icon: GraduationCap,
            iconBgColor: 'bg-amber-50',
        },
        // TODO: backend has no endpoint for these three; placeholder values.
        {
            title: 'Training Programs',
            value: '—',
            icon: BookOpen,
            iconBgColor: 'bg-purple-50',
        },
        {
            title: 'Infra Projects',
            value: '—',
            icon: HardHat,
            iconBgColor: 'bg-red-50',
        },
        {
            title: 'SPIU Projects',
            value: '—',
            icon: Briefcase,
            iconBgColor: 'bg-cyan-50',
        },
    ]);

    const PROVINCE_SUFFIX_RE = /\s*Province$/i;
    const CITY_SUFFIX_RE = /\s*City$/i;

    function shortenLocationName(name: string): string {
        return name.replace(PROVINCE_SUFFIX_RE, '').replace(CITY_SUFFIX_RE, '');
    }

    function provinceColor(name: string): string {
        const slug = name.toLowerCase();
        if (slug.includes('kigali'))
            return PROVINCE_COLORS.kigali;
        if (slug.includes('south'))
            return PROVINCE_COLORS.southern;
        if (slug.includes('west'))
            return PROVINCE_COLORS.western;
        if (slug.includes('north'))
            return PROVINCE_COLORS.northern;
        if (slug.includes('east'))
            return PROVINCE_COLORS.eastern;
        return '#94A3B8';
    }

    const mapRegions = $derived(
        overviewRows.map(r => ({
            name: r.locationName,
            shortName: shortenLocationName(r.locationName),
            students: r.totals.students,
            color: provinceColor(r.locationName),
        })),
    );

    const tableData = $derived<RegionData[]>(
        overviewRows.map(r => ({
            region: r.locationName,
            totalSchools: r.totals.schools,
            students: r.totals.students,
            teachingStaff: r.totals.teachers,
            // TODO: no API for these — placeholders until backend exists.
            curriculumProgs: 0,
            infraSpiu: '—',
            status: 'Active',
        })),
    );
</script>

<LoadingBar visible={showLoading} />

<!-- <Guard resource='auth:' action='create'>
    <button>Test</button>

</Guard> -->
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
                    Data synced: <span>{dataSyncedLabel}</span>
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
                icon={card.icon}
                iconBgColor={card.iconBgColor}
            />
        {/each}
    </div>

    <!-- Charts Section - Map and Trends -->
    <div class='mb-5 grid grid-cols-1 gap-5 lg:grid-cols-12'>
        <div class='lg:col-span-4'>
            <RwandaRegionalMap regions={mapRegions} />
        </div>
        <div class='lg:col-span-8 h-105'>
            <CrossDepartmentTrendsChart />
        </div>
    </div>

    <!-- Records Table -->
    <div class='mb-6'>
        <CrossDepartmentRecordsTable
            data={tableData}
            totalItems={tableData.length}
            totalPages={1}
            currentPage={1}
            pageSize={tableData.length || 1}
        />
    </div>

    <!-- Right Sidebar Content -->
    {#snippet rightSidebarContent()}
        <DGFiltersContent
            {filters}
            onFiltersChange={handleFiltersChange}
            onExport={handleExport}
            {provinceOptions}
            {districtOptions}
        />
    {/snippet}
</AppLayout>
