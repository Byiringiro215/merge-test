<script lang='ts'>
    import ScheduleContent from '$lib/accreditation/features/evaluations/components/ScheduleContent.svelte';
    import PageContainer from '$lib/components/accreditation/layout/PageContainer.svelte';
    import EvaluationsSubNav from '$lib/components/accreditation/navigation/EvaluationsSubNav.svelte';
    import { Calendar } from '@lucide/svelte';
</script>

<PageContainer
    role='evaluator'
    title='Accreditation Evaluations'
    description='View and manage due diligence schedule'
>
    <EvaluationsSubNav role='evaluator'>
        <div class='flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-sm bg-white text-sm text-slate-600 cursor-pointer hover:bg-slate-50 transition-colors'>
            <Calendar class='h-4 w-4' />
            <span>Jan 06, 2024 - Jan 13, 2024</span>
        </div>
    </EvaluationsSubNav>
    <ScheduleContent role='evaluator' />
</PageContainer>
