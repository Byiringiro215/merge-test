<script lang='ts'>
    import { page } from '$app/stores';
    import SharedEvaluationContainer from '$lib/accreditation/features/evaluations/components/SharedEvaluationContainer.svelte';
    import { mockApplications } from '$lib/accreditation/utils/application-utils';
    import PageContainer from '$lib/components/accreditation/layout/PageContainer.svelte';

    const id = $derived($page.params.id || '');
    const application = $derived(mockApplications.find(app => app.id === id) || mockApplications[0]);
</script>

<PageContainer
    title='{application.institution.name} {application.trade.name} Accreditation Application'
    description='Create and manage your accreditation applications for the selected trades.'
    noPadding={true}
    noScroll={true}
>
    <SharedEvaluationContainer {id} role='super-admin' />
</PageContainer>
