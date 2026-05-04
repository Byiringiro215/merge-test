<script lang='ts'>
    import { getSimulationState } from '$lib/accreditation/context/simulation.svelte';
    import CriteriaContent from '$lib/accreditation/features/evaluations/components/CriteriaContent.svelte';
    import PageContainer from '$lib/components/accreditation/layout/PageContainer.svelte';
    import EvaluationsSubNav from '$lib/components/accreditation/navigation/EvaluationsSubNav.svelte';

    const simulation = getSimulationState();
    const activeRole = $derived(simulation?.role || 'merged');
</script>

<PageContainer
    role={activeRole}
    title='Accreditation Evaluations'
    description='Review and manage evaluation criteria files'
>
    <EvaluationsSubNav role={activeRole} />
    <CriteriaContent role={activeRole} />
</PageContainer>
