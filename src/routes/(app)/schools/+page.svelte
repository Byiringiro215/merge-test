<script lang='ts'>
    import type {
        DistributionData,
        EnrollmentData,
    } from '$lib/components/schools/types.js';
    import StatsCard from '$lib/components/dashboard/StatsCard.svelte';
    import LoadingBar from '$lib/components/loading-bar/loading-bar.svelte';
    import EnrollmentTrendChart from '$lib/components/schools/EnrollmentTrendChart.svelte';
    import SchoolsDistributionChart from '$lib/components/schools/SchoolsDistributionChart.svelte';
    import SchoolsRegistryTable from '$lib/components/schools/SchoolsRegistryTable.svelte';
    import { Button } from '$lib/components/ui/button';
    import { Card, CardContent } from '$lib/components/ui/card';
    import BarChart3Icon from '@lucide/svelte/icons/bar-chart-3';
    import BookOpenIcon from '@lucide/svelte/icons/book-open';
    import Building2Icon from '@lucide/svelte/icons/building-2';
    import CircleCheckIcon from '@lucide/svelte/icons/circle-check';
    import CircleCheckBigIcon from '@lucide/svelte/icons/circle-check-big';
    import TrendingUpIcon from '@lucide/svelte/icons/trending-up';
    import { fetchSchools, fetchSchoolStats } from './page.remote';

    const schoolsQuery = $derived(fetchSchools({ page: 1, limit: 100 }));
    const statsQuery = $derived(fetchSchoolStats());

    let isInitialLoad = $state(true);
    $effect(() => {
        if (!schoolsQuery.loading && !statsQuery.loading) {
            isInitialLoad = false;
        }
    });
    const showLoading = $derived(
        !isInitialLoad && (schoolsQuery.loading || statsQuery.loading),
    );

    const schools = $derived(schoolsQuery.current?.schools ?? []);
    const stats = $derived(
        statsQuery.current ?? { totalSchools: 0, totalStudents: 0, activeSchools: 0 },
    );

    function fmt(n: number): string {
        if (n >= 1000)
            return `${(n / 1000).toFixed(1)}k`;
        return n.toLocaleString();
    }

    const statsCards = $derived([
        {
            title: 'Total Schools',
            value: fmt(stats.totalSchools),
            icon: Building2Icon,
        },
        {
            title: 'Active Schools',
            value: fmt(stats.activeSchools),
            icon: CircleCheckIcon,
        },
        // TODO: no API source for success rate yet — placeholder.
        {
            title: 'Avg. Success Rate',
            value: '—',
            icon: TrendingUpIcon,
        },
        {
            title: 'Enrolled Students',
            value: fmt(stats.totalStudents),
            icon: BookOpenIcon,
        },
    ]);

    // Distribution / enrollment charts have no direct API counterpart; derive
    // from the loaded school list as a best-effort breakdown by district.
    const distributionData = $derived<DistributionData[]>(
        Object.entries(
            schools.reduce<Record<string, { active: number; inactive: number }>>(
                (acc, school) => {
                    const key = school.district || '—';
                    acc[key] ??= { active: 0, inactive: 0 };
                    if (school.status === 'Active')
                        acc[key].active += 1;
                    else acc[key].inactive += 1;
                    return acc;
                },
                {},
            ),
        )
            .sort((a, b) => (b[1].active + b[1].inactive) - (a[1].active + a[1].inactive))
            .slice(0, 5)
            .map(([district, v]) => ({ district: district as DistributionData['district'], ...v })),
    );

    // The /schools list does not return per-school student count, so the
    // EnrollmentTrendChart is left empty until the backend exposes it.
    const enrollmentData: EnrollmentData[] = [];
</script>

<LoadingBar visible={showLoading} />

<div
    class='w-full max-w-375 px-3 py-4 sm:px-4 bg-white sm:py-6 mb-20 lg:mx-auto lg:px-6'
>
    <!-- Header Section -->
    <div
        class='mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between'
    >
        <div>
            <h1 class='text-xl font-inter font-bold text-gray-900 sm:text-3xl'>
                Schools Analytics
            </h1>
            <p class='mt-0.5 text-xs text-primary-gray sm:mt-1 sm:text-sm'>
                Performance monitoring for High Schools across prioritized
                districts.
            </p>
        </div>
        <div class='flex items-center gap-2 sm:gap-3'>
            <Button
                variant='outline'
                size='sm'
                class='gap-1.5 text-xs sm:gap-2 sm:text-sm px-3 py-5'
            >
                <BarChart3Icon class='h-4 w-4 shrink-0' />
                <span class='font-normal'>Regional Compare</span>
            </Button>
            <Button
                size='sm'
                class='gap-1.5 bg-primary text-xs hover:bg-blue-700 sm:gap-2 sm:text-sm px-3 py-5'
            >
                <CircleCheckBigIcon class='h-4 w-4 shrink-0' />
                <span>Audit Status</span>
            </Button>
        </div>
    </div>

    <!-- Stats Cards - 4 cards -->
    <div
        class='mb-4 grid grid-cols-2 gap-3 overflow-hidden sm:mb-7 sm:gap-4 lg:grid-cols-4 lg:gap-6'
    >
        {#each statsCards as card, index (index)}
            <StatsCard
                title={card.title}
                value={card.value}
                icon={card.icon}
            />
        {/each}
    </div>

    <!-- Charts Section - 2 charts side by side -->
    <div
        class='mb-4 grid grid-cols-1 gap-4 overflow-hidden sm:mb-7 sm:gap-6 lg:grid-cols-2'
    >
        <Card class='p-4 lg:p-6 border-none! shadow-none!'>
            <CardContent class='p-0 '>
                <SchoolsDistributionChart data={distributionData} />
            </CardContent>
        </Card>
        <Card class='p-4 lg:p-6 border-none! shadow-none!'>
            <CardContent class='p-0'>
                <EnrollmentTrendChart data={enrollmentData} />
            </CardContent>
        </Card>
    </div>

    <!-- Schools Registry Table -->
    <div class='min-w-0 overflow-hidden'>
        <SchoolsRegistryTable {schools} />
    </div>
</div>
