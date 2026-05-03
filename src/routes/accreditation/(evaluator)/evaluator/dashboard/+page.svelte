<script lang='ts'>
    import SharedDashboardContainer from '$lib/components/accreditation/dashboard/SharedDashboardContainer.svelte';
    import PageContainer from '$lib/components/accreditation/layout/PageContainer.svelte';
</script>

<PageContainer
    title='Welcome, Evaluator'
    description='Manage and review assigned accreditation applications'
>
    <SharedDashboardContainer role='evaluator' userName='Evaluator' />
</PageContainer>
