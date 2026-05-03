<script lang='ts'>
    import { setSimulationState } from '$lib/accreditation/context/simulation.svelte';
    import PortalShell from '$lib/components/accreditation/layout/PortalShell.svelte';

    const { children } = $props();
    setSimulationState();

    // For now, we'll default to 'merged' to show all features
    // since the user wants a merged dashboard regardless of role.
    const role = 'merged' as any;
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
