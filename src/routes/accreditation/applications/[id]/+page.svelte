<script lang='ts'>
    import { page } from '$app/state';
    import SharedApplicationDetailsContainer from '$lib/components/accreditation/applications/SharedApplicationDetailsContainer.svelte';

    const id = $derived(page.params.id || '');
    const role = $derived(page.url.searchParams.get('role') || 'super-admin');
</script>

<SharedApplicationDetailsContainer {id} {role} />