<script lang='ts'>
    import type {
        FacultyEnrollment,
        ScoreDistribution,
    } from '$lib/components/students/types.js';
    import type { StudentFiltersState } from '$lib/datamodel/student';
    import StatsCard from '$lib/components/dashboard/StatsCard.svelte';
    import Guard from '$lib/components/Guard.svelte';
    import LoadingBar from '$lib/components/loading-bar/loading-bar.svelte';
    import FacultyEnrollmentChart from '$lib/components/students/FacultyEnrollmentChart.svelte';
    import ScoreDistributionChart from '$lib/components/students/ScoreDistributionChart.svelte';
    import StudentFilters from '$lib/components/students/StudentFilters.svelte';
    import StudentRegistryTable from '$lib/components/students/StudentRegistryTable.svelte';
    import { FACULTY_COLORS } from '$lib/components/students/types.js';
    import { Button } from '$lib/components/ui/button';
    import * as Sidebar from '$lib/components/ui/sidebar';
    import Building2Icon from '@lucide/svelte/icons/building-2';
    import CircleCheckIcon from '@lucide/svelte/icons/circle-check';
    import CircleXIcon from '@lucide/svelte/icons/circle-x';
    import FileTextIcon from '@lucide/svelte/icons/file-text';
    import TrendingUpIcon from '@lucide/svelte/icons/trending-up';
    import UserPlusIcon from '@lucide/svelte/icons/user-plus';
    import UsersIcon from '@lucide/svelte/icons/users';
    import { fetchStudents, fetchStudentStats } from './page.remote';

    // Sidebar filter state
    let filters = $state<StudentFiltersState>({
        schoolCode: '',
        classGroup: '',
        gender: '',
        status: '',
    });

    function handleFiltersChange(newFilters: StudentFiltersState) {
        filters = newFilters;
        currentPage = 1; // Reset to first page when filters change
    }

    function fmt(n: number): string {
        return n.toLocaleString();
    }

    let currentPage = $state(1);
    const pageSize = 20;

    const studentsQuery = $derived(
        fetchStudents({
            page: currentPage,
            limit: pageSize,
            ...(filters.gender && { gender: filters.gender }),
            ...(filters.schoolCode && { schoolCode: filters.schoolCode }),
            ...(filters.status && { status: filters.status }),
            ...(filters.classGroup && { classGroup: filters.classGroup }),
        }),
    );
    const studentStatsQuery = $derived(fetchStudentStats());

    const stats = $derived(
        studentStatsQuery.current
            ?? { totalStudents: 0, totalSchools: 0, byStatus: {} as Record<string, number> },
    );

    function statusCount(stats: { byStatus: Record<string, number> }, ...needles: string[]): number {
        let total = 0;
        for (const [k, v] of Object.entries(stats.byStatus)) {
            if (needles.some(n => k.toLowerCase().includes(n)))
                total += v;
        }
        return total;
    }

    const succeeded = $derived(statusCount(stats, 'success', 'pass', 'graduat'));
    const failed = $derived(statusCount(stats, 'fail', 'drop'));

    const statsCards = $derived([
        {
            title: 'Total Students',
            value: fmt(stats.totalStudents),
            icon: UsersIcon,
        },
        {
            title: 'Succeeded',
            value: succeeded ? fmt(succeeded) : '—',
            icon: CircleCheckIcon,
        },
        {
            title: 'Failed',
            value: failed ? fmt(failed) : '—',
            icon: CircleXIcon,
        },
        // TODO: no API source for avg score yet — placeholder.
        {
            title: 'Avg Score',
            value: '—',
            icon: TrendingUpIcon,
        },
        {
            title: 'High Schools',
            value: fmt(stats.totalSchools),
            icon: Building2Icon,
        },
    ]);

    // Score distribution data
    const scoreDistributionData: ScoreDistribution[] = [
        { range: '0-20', count: 450 },
        { range: '21-40', count: 1100 },
        { range: '41-60', count: 2500 },
        { range: '61-80', count: 4200 },
        { range: '81-100', count: 2800 },
    ];

    // Faculty enrollment data
    const facultyEnrollmentData: FacultyEnrollment[] = [
        {
            faculty: 'Software development',
            count: 3200,
            color: FACULTY_COLORS['Software development'],
        },
        {
            faculty: 'Mechanics',
            count: 2100,
            color: FACULTY_COLORS.Mechanics,
        },
        {
            faculty: 'Automobile',
            count: 1800,
            color: FACULTY_COLORS.Automobile,
        },
        {
            faculty: 'Tourism',
            count: 2400,
            color: FACULTY_COLORS.Tourism,
        },
        {
            faculty: 'Electrical engineering',
            count: 1950,
            color: FACULTY_COLORS['Electrical engineering'],
        },
        {
            faculty: 'Road construction',
            count: 1000,
            color: FACULTY_COLORS['Road construction'],
        },
    ];

    const students = $derived(studentsQuery.current?.students ?? []);
    const totalStudents = $derived(studentsQuery.current?.total ?? 0);
    const totalPages = $derived(
        Math.max(1, Math.ceil(totalStudents / pageSize)),
    );
    const isLoading = $derived(studentsQuery.loading);

    let isInitialLoad = $state(true);
    $effect(() => {
        if (!studentsQuery.loading && !studentStatsQuery.loading) {
            isInitialLoad = false;
        }
    });
    const showLoading = $derived(
        !isInitialLoad && (studentsQuery.loading || studentStatsQuery.loading),
    );

    const handlePageChange = (page: number) => {
        currentPage = page;
    };
</script>

<LoadingBar visible={showLoading} />

<div class='w-full max-w-[100vw] overflow-x-hidden'>
    <Sidebar.Provider>
        <Sidebar.Root
            side='left'
            class='border-r border-r-gray-200 bg-[#fafafb]! mt-16 h-[calc(100vh-4rem-3.5rem)]'
        >
            <StudentFilters
                {filters}
                onFiltersChange={handleFiltersChange}
            />
        </Sidebar.Root>

        <Sidebar.Inset class='overflow-x-hidden bg-[#f1f7fe]'>
            <div
                class='w-full max-w-7xl px-3 py-4 sm:px-4 sm:py-6 mb-20 lg:mx-auto lg:px-6'
            >
                <!-- Header Section -->
                <div
                    class='mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between'
                >
                    <div
                        class='flex items-center gap-2 sm:gap-3'
                    >
                        <Sidebar.Trigger
                            class='md:hidden'
                        />
                        <div>
                            <h1
                                class='text-xl font-inter font-bold text-gray-900 sm:text-3xl'
                            >
                                Students
                                Analytics
                            </h1>
                            <p
                                class='mt-0.5 text-xs text-primary-gray sm:mt-1 sm:text-sm'
                            >
                                Deep dive into
                                academic
                                performance and
                                faculty trends.
                            </p>
                        </div>
                    </div>
                    <div
                        class='flex items-center gap-2 sm:gap-3'
                    >
                        <Button
                            variant='outline'
                            size='sm'
                            class='gap-1.5 text-xs sm:gap-2 sm:text-sm px-1 py-5'
                        >
                            <FileTextIcon
                                class='h-4 w-4 shrink-0'
                            />
                            <span
                                class='hidden sm:inline font-normal'
                            >Generate Report</span
                            >
                            <span class='sm:hidden'
                            >Report</span
                            >
                        </Button>
                        <Guard
                            resource='students'
                            action='write'
                        >
                            <Button
                                size='sm'
                                class='gap-1.5 bg-primary text-xs hover:bg-blue-700 sm:gap-2 sm:text-sm'
                            >
                                <UserPlusIcon
                                    class='h-4 w-4 shrink-0'
                                />
                                <span
                                    class='hidden sm:inline'
                                >Add
                                    Student</span
                                >
                                <span
                                    class='sm:hidden'
                                >Add</span
                                >
                            </Button>
                        </Guard>
                    </div>
                </div>

                <!-- Stats Cards -->
                <div
                    class='mb-4 grid grid-cols-2 gap-3 overflow-hidden sm:mb-7 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5 lg:gap-6'
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
                    class='mb-4 grid grid-cols-1 gap-4 overflow-hidden sm:mb-7 sm:gap-6 lg:grid-cols-3'
                >
                    <div class='min-w-0 lg:col-span-2'>
                        <ScoreDistributionChart
                            data={scoreDistributionData}
                        />
                    </div>
                    <div class='min-w-0'>
                        <FacultyEnrollmentChart
                            data={facultyEnrollmentData}
                        />
                    </div>
                </div>

                <!-- Student Registry Table -->
                <div class='min-w-0 overflow-hidden'>
                    <StudentRegistryTable
                        {students}
                        {currentPage}
                        {totalPages}
                        {isLoading}
                        totalItems={totalStudents}
                        {pageSize}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </Sidebar.Inset>
    </Sidebar.Provider>
</div>
