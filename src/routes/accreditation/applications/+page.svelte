<script lang='ts'>
    import { page } from '$app/state';
    import { getSimulationState } from '$lib/accreditation/context/simulation.svelte';
    import SharedApplicationsContainer from '$lib/components/accreditation/applications/SharedApplicationsContainer.svelte';
    import RoleGuard from '$lib/components/accreditation/layout/RoleGuard.svelte';

    const simulation = getSimulationState();
    const role = $derived(page.url.searchParams.get('role') || simulation?.role || 'merged');
</script>

<RoleGuard allowedRoles={['applicant', 'curriculum-evaluator', 'super-admin']}>
    <SharedApplicationsContainer {role} />
</RoleGuard>
