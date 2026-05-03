<script lang='ts'>
    import { page } from '$app/stores';
    import CurriculumReviewView from '$lib/accreditation/features/curriculum/components/CurriculumReviewView.svelte';
    import { mockApplications } from '$lib/accreditation/utils/application-utils';
    import PageContainer from '$lib/components/accreditation/layout/PageContainer.svelte';

    const id = $derived($page.params.id || '');
    const application = $derived(
        mockApplications.find(app => app.id === id) || mockApplications[0],
    );
</script>

<PageContainer
    title='{application.institution.name} {application.trade.name} Accreditation Application'
    description='Create and manage your accreditation applications for the selected trades.'
>
    <CurriculumReviewView {id} />
</PageContainer>
