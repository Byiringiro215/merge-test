<script lang='ts'>
    import SharedApplicationsList from '$lib/accreditation/features/evaluations/components/SharedApplicationsList.svelte';
    import PageContainer from '$lib/components/accreditation/layout/PageContainer.svelte';
    import EvaluationsSubNav from '$lib/components/accreditation/navigation/EvaluationsSubNav.svelte';
</script>

<PageContainer
    role='evaluator'
    title='Manage Accreditation Evaluations'
    description='View & manage active evaluations and requests'
>
    <EvaluationsSubNav role='evaluator' />
    <SharedApplicationsList
        role='evaluator'
    />
</PageContainer>
