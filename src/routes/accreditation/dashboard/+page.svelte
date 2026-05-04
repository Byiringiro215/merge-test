<script lang='ts'>
    import { getSimulationState } from '$lib/accreditation/context/simulation.svelte';
    import { getAuthState } from '$lib/auth/index.svelte';
    import SharedDashboardContainer from '$lib/components/accreditation/dashboard/SharedDashboardContainer.svelte';
    import PageContainer from '$lib/components/accreditation/layout/PageContainer.svelte';
    import PrimaryButton from '$lib/components/accreditation/ui/PrimaryButton.svelte';

    const simulation = getSimulationState();
    const auth = getAuthState();
    const activeRole = $derived(simulation?.role || 'merged');
    const userName = $derived(auth.user?.name || 'User');
</script>

{#snippet action()}
    <PrimaryButton
        label='New Application'
        href='/accreditation/applicant/applications?new=true'
        iconPosition='right'
    />
{/snippet}

<PageContainer
    title='Accreditation Dashboard'
    description='Overview of all accreditation activities'
    {action}
>
    <SharedDashboardContainer role={activeRole} {userName} />
</PageContainer>
