<script lang='ts'>
    import DashboardEmptyState from '$lib/components/accreditation/dashboard/DashboardEmptyState.svelte';
    import StatsGrid from '$lib/components/accreditation/dashboard/StatsGrid.svelte';
    import PageContainer from '$lib/components/accreditation/layout/PageContainer.svelte';
    import PrimaryButton from '$lib/components/accreditation/ui/PrimaryButton.svelte';
    import { AlertTriangle, CheckCircle2, Clock, FileText } from '@lucide/svelte';

    const stats = [
        {
            label: 'Applications',
            value: '2',
            icon: FileText,
            iconColor: '#0A77FF',
        },
        {
            label: 'Pending',
            value: '6',
            icon: Clock,
            iconColor: '#FF8D28',
        },
        {
            label: 'Approved',
            value: '6',
            icon: CheckCircle2,
            iconColor: '#34C759',
        },
        {
            label: 'Rejected',
            value: '12',
            icon: AlertTriangle,
            iconColor: '#FF383C',
        },
    ];

    const hasApplications = false;
</script>

{#snippet action()}
    <PrimaryButton
        label='New Application'
        href='/accreditation/applicant/applications'
        iconPosition='right'
    />
{/snippet}

<PageContainer
    title='Welcome, John'
    description='View & manage active elders and requests'
    {action}
>
    <div class='space-y-6'>
        <StatsGrid items={stats} />

        {#if hasApplications}
            <!-- DashboardFilledState would go here -->
            <div class='p-8 text-center border-2 border-dashed rounded-lg text-slate-400'>
                Dashboard Content (Applications List)
            </div>
        {:else}
            <DashboardEmptyState />
        {/if}
    </div>
</PageContainer>
