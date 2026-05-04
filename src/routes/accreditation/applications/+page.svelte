<script lang='ts'>
    import { getSimulationState } from '$lib/accreditation/context/simulation.svelte';
    import SharedApplicationsContainer from '$lib/components/accreditation/applications/SharedApplicationsContainer.svelte';

    const simulation = getSimulationState();
    const role = $derived(simulation?.role || 'merged');
</script>

<SharedApplicationsContainer {role} />
