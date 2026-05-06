<script lang='ts'>
    import { setSimulationState } from '$lib/accreditation/context/simulation.svelte';
    import PortalShell from '$lib/components/accreditation/layout/PortalShell.svelte';

    const { children } = $props();
    const simulation = setSimulationState();

    const role = $derived(simulation.role || 'merged');
</script>

<PortalShell {role}>
    {@render children()}
</PortalShell>

<style>
    /* Force rounded-sm on all interactive elements within the portal */
    :global(button:not([class*='rounded-full'])),
    :global(input:not([class*='rounded-full'])),
    :global(select:not([class*='rounded-full'])),
    :global(textarea:not([class*='rounded-full'])),
    :global(a[class*='rounded']:not([class*='rounded-full'])) {
        border-radius: 4px !important;
    }
</style>
