<script lang='ts'>
    import SharedApplicationsList from '$lib/accreditation/features/evaluations/components/SharedApplicationsList.svelte';
    import PageContainer from '$lib/components/accreditation/layout/PageContainer.svelte';
    import EvaluationsSubNav from '$lib/components/accreditation/navigation/EvaluationsSubNav.svelte';
</script>

<PageContainer
    title='Accreditation Evaluations'
    description='View and manage active evaluations and requests'
>
    <EvaluationsSubNav role='merged' />
    <SharedApplicationsList role='merged' />
</PageContainer>
