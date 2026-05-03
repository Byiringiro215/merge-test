<script lang='ts'>
    import SharedProfileContainer from '$lib/accreditation/features/profile/components/SharedProfileContainer.svelte';
    import PageContainer from '$lib/components/accreditation/layout/PageContainer.svelte';
</script>

<PageContainer
    title='Profile Settings'
    description='Manage your account information and preferences.'
>
    <SharedProfileContainer role='curriculum-evaluator' userName='Curriculum Evaluator' />
</PageContainer>
