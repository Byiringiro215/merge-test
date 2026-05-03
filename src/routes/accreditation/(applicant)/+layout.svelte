<script lang='ts'>
    import PortalShell from '$lib/components/accreditation/layout/PortalShell.svelte';

    const { children } = $props();
</script>

<PortalShell role='applicant'>
    {@render children()}
</PortalShell>

<style>
    /* Force rounded-sm on all interactive elements within the applicant portal,
       but leave profile images / avatars (rounded-full) untouched */
    :global(.applicant-portal button:not([class*='rounded-full'])),
    :global(.applicant-portal input:not([class*='rounded-full'])),
    :global(.applicant-portal select:not([class*='rounded-full'])),
    :global(.applicant-portal textarea:not([class*='rounded-full'])),
    :global(.applicant-portal a[class*='rounded']:not([class*='rounded-full'])) {
        border-radius: 4px !important;
    }
</style>
