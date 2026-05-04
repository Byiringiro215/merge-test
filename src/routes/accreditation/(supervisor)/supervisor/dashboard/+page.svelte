<script lang='ts'>
    import SharedDashboardContainer from '$lib/components/accreditation/dashboard/SharedDashboardContainer.svelte';
    import PageContainer from '$lib/components/accreditation/layout/PageContainer.svelte';
</script>

<PageContainer
    title='Welcome, Supervisor'
    description='View & manage active applications and requests'
>
    <SharedDashboardContainer role='supervisor' userName='Supervisor' />
</PageContainer>
