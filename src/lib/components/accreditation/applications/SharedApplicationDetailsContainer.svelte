<script lang='ts'>
    import SharedEvaluationContainer from '$lib/accreditation/features/evaluations/components/SharedEvaluationContainer.svelte';
    import { mockApplications } from '$lib/accreditation/utils/application-utils';
    import PageContainer from '$lib/components/accreditation/layout/PageContainer.svelte';
    import ApplicantApplicationDetailsView from './ApplicantApplicationDetailsView.svelte';

    const { id, role } = $props<{ id: string; role: string }>();

    const application = $derived(mockApplications.find(app => app.id === id) || mockApplications[0]);
</script>

<PageContainer
    {role}
    title='{application.institution.name} {application.trade.name} Accreditation Application'
    description='Review and manage the details of this accreditation application.'
    noPadding={true}
    noScroll={true}
>
    {#if role === 'applicant'}
        <div class='px-6 py-6'>
            <ApplicantApplicationDetailsView />
        </div>
    {:else}
        <SharedEvaluationContainer {id} {role} />
    {/if}
</PageContainer>
