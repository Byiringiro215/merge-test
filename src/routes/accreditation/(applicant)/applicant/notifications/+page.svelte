<script lang='ts'>
    import NotificationsContent from '$lib/accreditation/features/notifications/components/NotificationsContent.svelte';
    import PageContainer from '$lib/components/accreditation/layout/PageContainer.svelte';
</script>

<PageContainer
    title='Notifications'
    description='Stay updated with the latest activity on your applications and certificates.'
>
    <NotificationsContent role='applicant' />
</PageContainer>
