<script lang='ts'>
    import EvaluatorsContent from '$lib/accreditation/features/evaluations/components/EvaluatorsContent.svelte';
    import PageContainer from '$lib/components/accreditation/layout/PageContainer.svelte';
    import EvaluationsSubNav from '$lib/components/accreditation/navigation/EvaluationsSubNav.svelte';
</script>

<PageContainer
    role='supervisor'
    title='Accreditation Evalutions'
    description='View and monitor active applications and requests'
>
    <EvaluationsSubNav role='supervisor' />
    <EvaluatorsContent role='supervisor' />
</PageContainer>
