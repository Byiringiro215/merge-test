<script lang='ts'>
    import PortalShell from '$lib/components/accreditation/layout/PortalShell.svelte';

    const { children } = $props();
</script>

<PortalShell role='curriculum-evaluator'>
    {@render children()}
</PortalShell>
