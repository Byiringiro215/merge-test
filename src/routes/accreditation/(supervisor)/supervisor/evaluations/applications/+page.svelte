<script lang='ts'>
    import SharedApplicationsList from '$lib/accreditation/features/evaluations/components/SharedApplicationsList.svelte';
    import PageContainer from '$lib/components/accreditation/layout/PageContainer.svelte';
    import EvaluationsSubNav from '$lib/components/accreditation/navigation/EvaluationsSubNav.svelte';
</script>

<PageContainer
    role='supervisor'
    title='Accreditation Evalutions'
    description='View and monitor active applications and requests'
>
    <EvaluationsSubNav role='supervisor' />
    <SharedApplicationsList
        role='supervisor'
    />
</PageContainer>
