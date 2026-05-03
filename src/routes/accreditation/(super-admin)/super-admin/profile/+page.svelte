<script lang='ts'>
    import SharedProfileContainer from '$lib/accreditation/features/profile/components/SharedProfileContainer.svelte';
    import PageContainer from '$lib/components/accreditation/layout/PageContainer.svelte';
</script>

<PageContainer
    title='Profile Settings'
    description='Manage your account information and preferences.'
>
    <SharedProfileContainer role='super-admin' userName='John Doe' userEmail='john.doe@accreditation.gov.rw' />
</PageContainer>
