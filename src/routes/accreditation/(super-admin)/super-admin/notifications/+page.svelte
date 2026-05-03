<script lang='ts'>
    import NotificationsContent from '$lib/accreditation/features/notifications/components/NotificationsContent.svelte';
    import PageContainer from '$lib/components/accreditation/layout/PageContainer.svelte';
</script>

<PageContainer
    title='Notifications'
    description='Manage and view all system alerts and updates.'
>
    <NotificationsContent role='super-admin' />
</PageContainer>
