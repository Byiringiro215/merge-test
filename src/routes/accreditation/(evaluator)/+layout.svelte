<script lang='ts'>
    import PortalShell from '$lib/components/accreditation/layout/PortalShell.svelte';

    const { children } = $props();
</script>

<PortalShell role='evaluator'>
    {@render children()}
</PortalShell>
