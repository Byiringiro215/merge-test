<script lang='ts'>
    import { getSimulationState } from '$lib/accreditation/context/simulation.svelte';
    import SharedApplicationsList from '$lib/accreditation/features/evaluations/components/SharedApplicationsList.svelte';
    import PageContainer from '$lib/components/accreditation/layout/PageContainer.svelte';
    import RoleGuard from '$lib/components/accreditation/layout/RoleGuard.svelte';
    import EvaluationsSubNav from '$lib/components/accreditation/navigation/EvaluationsSubNav.svelte';

    const simulation = getSimulationState();
    const role = $derived(simulation?.role || 'merged');
</script>

<RoleGuard allowedRoles={['evaluator', 'supervisor', 'super-admin']}>
    <PageContainer
        title='Accreditation Evaluations'
        description='View and manage active evaluations and requests'
    >
        <EvaluationsSubNav {role} />
        <SharedApplicationsList {role} />
    </PageContainer>
</RoleGuard>
