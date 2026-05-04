<script lang='ts'>
    import EvaluatorsContent from '$lib/accreditation/features/evaluations/components/EvaluatorsContent.svelte';
    import PageContainer from '$lib/components/accreditation/layout/PageContainer.svelte';
    import EvaluationsSubNav from '$lib/components/accreditation/navigation/EvaluationsSubNav.svelte';
</script>

<PageContainer
    role='super-admin'
    title='Manage Accreditation Evalutions'
    description='View & manage active applications and requests'
>
    <EvaluationsSubNav role='super-admin' />
    <EvaluatorsContent role='super-admin' />
</PageContainer>
