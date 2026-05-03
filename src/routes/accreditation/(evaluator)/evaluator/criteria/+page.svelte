<script lang='ts'>
    import CriteriaContent from '$lib/accreditation/features/evaluations/components/CriteriaContent.svelte';
    import PageContainer from '$lib/components/accreditation/layout/PageContainer.svelte';
    import EvaluationsSubNav from '$lib/components/accreditation/navigation/EvaluationsSubNav.svelte';
</script>

<PageContainer
    role='evaluator'
    title='Accreditation Evaluations'
    description='Review and manage evaluation criteria files'
>
    <EvaluationsSubNav role='evaluator' />
    <CriteriaContent role='evaluator' />
</PageContainer>
