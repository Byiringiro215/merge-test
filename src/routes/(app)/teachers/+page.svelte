<script lang='ts'>
    import type {
        FacultySuccessData,
        TeacherProvinceAssistance,
    } from '$lib/components/teachers/types.js';
    import type { StaffFiltersState } from '$lib/datamodel/staff';
    import StatsCard from '$lib/components/dashboard/StatsCard.svelte';
    import LoadingBar from '$lib/components/loading-bar/loading-bar.svelte';
    import FacultySuccessRatesChart from '$lib/components/teachers/FacultySuccessRatesChart.svelte';
    import StudentAssistanceByProvinceChart from '$lib/components/teachers/StudentAssistanceByProvinceChart.svelte';
    import TeacherFilters from '$lib/components/teachers/TeacherFilters.svelte';
    import TeacherRegistryTable from '$lib/components/teachers/TeacherRegistryTable.svelte';
    import { Button } from '$lib/components/ui/button';
    import * as Sidebar from '$lib/components/ui/sidebar';
    import BookOpenIcon from '@lucide/svelte/icons/book-open';
    import FileTextIcon from '@lucide/svelte/icons/file-text';
    import HeartIcon from '@lucide/svelte/icons/heart';
    import SparklesIcon from '@lucide/svelte/icons/sparkles';
    import TargetIcon from '@lucide/svelte/icons/target';
    import UsersIcon from '@lucide/svelte/icons/users';
    import { fetchTeachers, fetchTeacherStats } from './page.remote';

    // Sidebar filter state (maps to backend query parameters)
    let filters = $state<StaffFiltersState>({
        schoolCode: '',
        position: '',
        gender: '',
    });

    function handleFiltersChange(newFilters: StaffFiltersState) {
        filters = newFilters;
        currentPage = 1;
    }

    let currentPage = $state(1);
    const pageSize = 20;

    const teachersQuery = $derived(
        fetchTeachers({
            page: currentPage,
            limit: pageSize,
            ...(filters.schoolCode && { schoolCode: filters.schoolCode }),
            ...(filters.gender && { gender: filters.gender }),
            ...(filters.position && { positionName: filters.position }),
        }),
    );
    const statsQuery = $derived(fetchTeacherStats());

    const staff = $derived(teachersQuery.current?.staff ?? []);
    const totalStaff = $derived(teachersQuery.current?.total ?? 0);
    const totalPages = $derived(Math.max(1, Math.ceil(totalStaff / pageSize)));

    let isInitialLoad = $state(true);
    $effect(() => {
        if (!teachersQuery.loading && !statsQuery.loading) {
            isInitialLoad = false;
        }
    });
    const showLoading = $derived(
        !isInitialLoad && (teachersQuery.loading || statsQuery.loading),
    );
    const isLoading = $derived(teachersQuery.loading);

    const handlePageChange = (page: number) => {
        currentPage = page;
    };

    function fmt(n: number): string {
        return n.toLocaleString();
    }

    const stats = $derived(
        statsQuery.current ?? { totalTeachers: 0, totalStudents: 0, byGender: {} as Record<string, number> },
    );

    const statsCards = $derived([
        {
            title: 'Total Teachers',
            value: fmt(stats.totalTeachers),
            icon: UsersIcon,
        },
        // TODO: no API source for these — placeholder until backend exposes them.
        {
            title: 'Avg. Courses / Teacher',
            value: '—',
            icon: BookOpenIcon,
        },
        {
            title: 'Total Students Assisted',
            value: fmt(stats.totalStudents),
            icon: HeartIcon,
        },
        {
            title: 'Overall Success Rate',
            value: '—',
            icon: TargetIcon,
        },
    ]);

    // Student Assistance by Province data
    const assistanceData: TeacherProvinceAssistance[] = [
        {
            teacherName: 'Uwimana A.',
            provinces: { Kigali: 50, North: 30, South: 20, East: 25, West: 20 },
        },
        {
            teacherName: 'Mukiza P.',
            provinces: { Kigali: 40, North: 25, South: 25, East: 20, West: 15 },
        },
        {
            teacherName: 'Ndahimana J.',
            provinces: { Kigali: 25, North: 30, South: 35, East: 55, West: 55 },
        },
        {
            teacherName: 'Gasana M.',
            provinces: { Kigali: 30, North: 35, South: 30, East: 40, West: 30 },
        },
        {
            teacherName: 'Habimana E.',
            provinces: { Kigali: 35, North: 55, South: 35, East: 25, West: 25 },
        },
    ];

    // Faculty Success Rates data
    const facultySuccessData: FacultySuccessData[] = [
        {
            faculty: 'Information Technology',
            abbreviation: 'IT',
            currentRate: 88,
            nationalTarget: 85,
        },
        {
            faculty: 'Tourism & Hospitality',
            abbreviation: 'Tourism',
            currentRate: 82,
            nationalTarget: 85,
        },
        {
            faculty: 'Mechanical Engineering',
            abbreviation: 'Mecha',
            currentRate: 65,
            nationalTarget: 85,
        },
        {
            faculty: 'Civil Engineering',
            abbreviation: 'Civil',
            currentRate: 92,
            nationalTarget: 85,
        },
        {
            faculty: 'Agriculture',
            abbreviation: 'Agri',
            currentRate: 78,
            nationalTarget: 85,
        },
    ];

</script>

<LoadingBar visible={showLoading} />

<div class='w-full max-w-[100vw] overflow-x-hidden'>
    <Sidebar.Provider>
        <Sidebar.Root
            side='left'
            class='border-r border-r-gray-200 bg-[#fafafb]! mt-16 h-[calc(100vh-4rem-3.5rem)]'
        >
            <TeacherFilters {filters} onFiltersChange={handleFiltersChange} />
        </Sidebar.Root>

        <Sidebar.Inset class='overflow-x-hidden bg-[#fdfdfe]!'>
            <div
                class='w-full max-w-7xl px-3 py-4 sm:px-4 sm:py-6 mb-20 lg:mx-auto lg:px-6'
            >
                <!-- Header Section -->
                <div
                    class='mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between'
                >
                    <div class='flex items-center gap-2 sm:gap-3'>
                        <Sidebar.Trigger class='md:hidden' />
                        <div>
                            <h1
                                class='text-xl font-inter font-bold text-gray-900 sm:text-3xl'
                            >
                                Teachers Analytics
                            </h1>
                            <p
                                class='mt-0.5 text-xs text-primary-gray sm:mt-1 sm:text-sm'
                            >
                                Monitoring faculty performance across Rwandan
                                High Schools
                            </p>
                        </div>
                    </div>
                    <div class='flex items-center gap-2 sm:gap-3'>
                        <Button
                            variant='outline'
                            size='sm'
                            class='gap-1.5 text-xs sm:gap-2 sm:text-sm px-3 py-5'
                        >
                            <FileTextIcon class='h-4 w-4 shrink-0' />
                            <span class='font-normal'>Report</span>
                        </Button>
                        <Button
                            size='sm'
                            class='gap-1.5 bg-primary text-xs hover:bg-blue-700 sm:gap-2 sm:text-sm px-3 py-5'
                        >
                            <SparklesIcon class='h-4 w-4 shrink-0' />
                            <span>Verify List</span>
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

                <!-- Charts Section -->
                <div
                    class='mb-4 rounded-lg border-gray-200 bg-white p-4 sm:mb-7 sm:p-6 overflow-hidden'
                >
                    <div class='grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-0'>
                        <div
                            class='min-w-0 lg:pr-6 lg:border-r lg:border-gray-200'
                        >
                            <StudentAssistanceByProvinceChart
                                data={assistanceData}
                            />
                        </div>
                        <div class='min-w-0 lg:pl-6'>
                            <FacultySuccessRatesChart
                                data={facultySuccessData}
                            />
                        </div>
                    </div>
                </div>

                <!-- Teacher Registry Table -->
                <div class='min-w-0 overflow-hidden'>
                    <TeacherRegistryTable
                        {staff}
                        {currentPage}
                        {totalPages}
                        totalItems={totalStaff}
                        {pageSize}
                        {isLoading}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </Sidebar.Inset>
    </Sidebar.Provider>
</div>
