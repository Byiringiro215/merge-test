<script lang='ts'>
    import CurriculumApplicationList from '$lib/accreditation/features/curriculum/components/CurriculumApplicationList.svelte';
    import PageContainer from '$lib/components/accreditation/layout/PageContainer.svelte';
</script>

<PageContainer
    role='curriculum-evaluator'
    title='Accreditation Applications'
    description='Review applications with unknown or unverified curriculum documents.'
>
    <CurriculumApplicationList />
</PageContainer>
