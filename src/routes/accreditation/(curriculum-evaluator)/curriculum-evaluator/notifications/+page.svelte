<script lang='ts'>
    import NotificationsContent from '$lib/accreditation/features/notifications/components/NotificationsContent.svelte';
    import PageContainer from '$lib/components/accreditation/layout/PageContainer.svelte';
</script>

<PageContainer
    title='Notifications'
    description='Manage and view your alerts and updates.'
>
    <NotificationsContent role='curriculum-evaluator' />
</PageContainer>
