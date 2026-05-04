<script lang='ts'>
    import { page } from '$app/state';
    import SharedApplicationsContainer from '$lib/components/accreditation/applications/SharedApplicationsContainer.svelte';

    // In a real app, this would come from a session/auth store
    // For now, we allow overriding via query param for testing, or default based on the path
    const role = $derived(page.url.searchParams.get('role') || 'super-admin');
</script>

<SharedApplicationsContainer {role} />
