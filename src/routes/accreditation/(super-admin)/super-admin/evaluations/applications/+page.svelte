<script lang='ts'>
    import SharedApplicationsList from '$lib/accreditation/features/evaluations/components/SharedApplicationsList.svelte';
    import PageContainer from '$lib/components/accreditation/layout/PageContainer.svelte';
    import EvaluationsSubNav from '$lib/components/accreditation/navigation/EvaluationsSubNav.svelte';
</script>

<PageContainer
    role='super-admin'
    title='Manage Accreditation Evalutions'
    description='View & manage active applications and requests'
>
    <EvaluationsSubNav role='super-admin' />
    <SharedApplicationsList
        role='super-admin'
    />
</PageContainer>
