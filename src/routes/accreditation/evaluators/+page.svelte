<script lang='ts'>
    import { getSimulationState } from '$lib/accreditation/context/simulation.svelte';
    import EvaluatorsContent from '$lib/accreditation/features/evaluations/components/EvaluatorsContent.svelte';
    import PageContainer from '$lib/components/accreditation/layout/PageContainer.svelte';
    import RoleGuard from '$lib/components/accreditation/layout/RoleGuard.svelte';
    import EvaluationsSubNav from '$lib/components/accreditation/navigation/EvaluationsSubNav.svelte';

    const simulation = getSimulationState();
    const activeRole = $derived(simulation?.role || 'merged');
</script>

<RoleGuard allowedRoles={['supervisor', 'super-admin']}>
    <PageContainer
        role={activeRole}
        title='Manage Accreditation Evaluations'
        description='View & manage active applications and requests'
    >
        <EvaluationsSubNav role={activeRole} />
        <EvaluatorsContent role={activeRole} />
    </PageContainer>
</RoleGuard>
