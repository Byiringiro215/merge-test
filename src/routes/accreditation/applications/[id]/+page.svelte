<script lang='ts'>
    import { page } from '$app/state';
    import { getSimulationState } from '$lib/accreditation/context/simulation.svelte';
    import SharedApplicationDetailsContainer from '$lib/components/accreditation/applications/SharedApplicationDetailsContainer.svelte';

    const simulation = getSimulationState();
    const id = $derived(page.params.id || '');
    const role = $derived(page.url.searchParams.get('role') || simulation?.role || 'merged');
</script>

<SharedApplicationDetailsContainer {id} {role} />
