<script lang='ts'>
    import { getSimulationState } from '$lib/accreditation/context/simulation.svelte';
    import NotificationsContent from '$lib/accreditation/features/notifications/components/NotificationsContent.svelte';
    import PageContainer from '$lib/components/accreditation/layout/PageContainer.svelte';

    const simulation = getSimulationState();
    const role = $derived(simulation?.role || 'merged');
</script>

<PageContainer
    title='Notifications'
    description='Manage and view all system alerts and updates.'
>
    <NotificationsContent {role} />
</PageContainer>
