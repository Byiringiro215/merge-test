<script lang='ts'>
    import { getSimulationState } from '$lib/accreditation/context/simulation.svelte';
    import ScheduleContent from '$lib/accreditation/features/evaluations/components/ScheduleContent.svelte';
    import PageContainer from '$lib/components/accreditation/layout/PageContainer.svelte';
    import RoleGuard from '$lib/components/accreditation/layout/RoleGuard.svelte';
    import EvaluationsSubNav from '$lib/components/accreditation/navigation/EvaluationsSubNav.svelte';
    import DateRangePicker from '$lib/components/accreditation/ui/DateRangePicker.svelte';
    import { Calendar } from '@lucide/svelte';

    const simulation = getSimulationState();
    const activeRole = $derived(simulation?.role || 'merged');

    let showPicker = $state(false);
    let dateRange = $state({
        start: new Date(2024, 0, 6),
        end: new Date(2024, 0, 13),
    });

    function formatDate(date: Date) {
        return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    }
</script>

<RoleGuard allowedRoles={['evaluator', 'supervisor', 'super-admin']}>
    <PageContainer
        role={activeRole}
        title='Accreditation Evaluations'
        description='View and manage due diligence schedule'
    >
        <EvaluationsSubNav role={activeRole}>
            <button
                type='button'
                onclick={() => showPicker = !showPicker}
                class='group relative flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-sm px-6 py-3 text-primary transition-colors duration-200'
            >
                <div class='absolute inset-0 z-0 rounded-sm bg-[#F9FAFB]'></div>
                <Calendar class='relative z-10 h-4 w-4 text-primary' strokeWidth={1} />
                <span class='relative z-10 text-sm font-medium text-primary'>
                    {formatDate(dateRange.start)} - {formatDate(dateRange.end)}
                </span>
            </button>

            {#if showPicker}
                <DateRangePicker
                    onApply={(range) => {
                        dateRange = range;
                        showPicker = false;
                    }}
                    onCancel={() => showPicker = false}
                />
            {/if}
        </EvaluationsSubNav>
        <ScheduleContent role={activeRole} />
    </PageContainer>
</RoleGuard>
