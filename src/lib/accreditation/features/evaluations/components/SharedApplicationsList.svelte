<script lang='ts'>
    import type { StatusType } from '$lib/components/accreditation/ui/StatusBadge.svelte';

    import { goto } from '$app/navigation';
    import { mockApplications } from '$lib/accreditation/utils/application-utils';
    import StatsGrid from '$lib/components/accreditation/dashboard/StatsGrid.svelte';
    import DataTable from '$lib/components/accreditation/ui/DataTable.svelte';
    import StatusBadge from '$lib/components/accreditation/ui/StatusBadge.svelte';
    import {
        AlertTriangle,
        CheckCheck,
        ClipboardClock,
        Eye,
        NotepadText,
        Trash2,
    } from '@lucide/svelte';

    const { role } = $props<{ role: string }>();

    interface Application {
        id: string;
        applicant: {
            name: string;
            email: string;
            avatar: string;
        };
        institution: {
            name: string;
            logo: string;
            website: string;
        };
        trade: {
            name: string;
            category: string;
        };
        status: StatusType;
        stage: string;
        submittedOn: string;
    }

    let search = $state('');
    const isReadOnly = $derived(role === 'supervisor');

    const stats = [
        { label: 'Applications', value: 24, icon: NotepadText, iconColor: '#0A77FF' },
        { label: 'Pending', value: 8, icon: ClipboardClock, iconColor: '#FF8D28' },
        { label: 'Evaluated', value: 5, icon: CheckCheck, iconColor: '#34C759' },
        { label: 'Rejected', value: 11, icon: AlertTriangle, iconColor: '#FF383C' },
    ];

    const filteredData = $derived(
        (mockApplications.filter(
            item =>
                item.applicant.name.toLowerCase().includes(search.toLowerCase())
                    || item.applicant.email.toLowerCase().includes(search.toLowerCase())
                    || item.institution.name.toLowerCase().includes(search.toLowerCase()),
        ) as Application[]),
    );

    const columns = $derived([
        ...(role !== 'applicant'
            ? [
                { header: 'Applicant', accessor: applicantCell, sortable: true },
                { header: 'Institution', accessor: institutionCell, sortable: true },
            ]
            : []),
        { header: 'Trade', accessor: tradeCell },
        { header: 'Status', accessor: statusCell },
        { header: 'Evaluation Stage', accessor: stageCell },
        { header: 'Submitted On', accessor: submittedOnCell },
        { header: 'Actions', accessor: actionsCell },
    ]);
</script>

{#snippet applicantCell(item: Application)}
    <div class='flex items-start gap-3 text-left'>
        <div class='flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600'>
            {item.applicant.avatar}
        </div>
        <div class='flex flex-col'>
            <span class='text-[13px] text-[#101828]'>{item.applicant.name}</span>
            <span class='text-[11px] text-[#475467]'>{item.applicant.email}</span>
        </div>
    </div>
{/snippet}

{#snippet institutionCell(item: Application)}
    <div class='flex items-start gap-3 text-left'>
        <div class='flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-[10px] font-bold text-orange-600'>
            {item.institution.logo}
        </div>
        <div class='flex flex-col'>
            <span class='text-[13px] text-[#101828]'>{item.institution.name}</span>
            <span class='text-[11px] text-[#475467]'>{item.institution.website}</span>
        </div>
    </div>
{/snippet}

{#snippet tradeCell(item: Application)}
    <div class='flex flex-col text-left'>
        <span class='text-[13px] font-medium text-slate-600'>{item.trade.name}</span>
        <span class='text-[11px] uppercase tracking-wider text-[#475467]'>{item.trade.category}</span>
    </div>
{/snippet}

{#snippet statusCell(item: Application)}
    <div class='text-left'>
        <StatusBadge status={item.status} />
    </div>
{/snippet}

{#snippet stageCell(item: Application)}
    <span class='text-left text-[13px] font-medium text-slate-500'>{item.stage}</span>
{/snippet}

{#snippet submittedOnCell(item: Application)}
    <div class='flex flex-col text-left'>
        <span class='text-[13px] font-medium text-slate-600'>{item.submittedOn.split(' ')[0]}</span>
        <span class='text-[11px] text-[#475467]'>{item.submittedOn.split(' ').slice(1).join(' ')}</span>
    </div>
{/snippet}

{#snippet actionsCell()}
    <div class='flex items-start gap-4'>
        <Eye class='h-4 w-4 cursor-pointer text-slate-400 transition-colors hover:text-[#0A77FF]' />
        <Trash2 class='h-4 w-4 cursor-pointer text-slate-400 transition-colors hover:text-red-500' />
    </div>
{/snippet}

<div class='space-y-6'>
    <StatsGrid items={stats} />
    <DataTable
        data={filteredData}
        {columns}
        title={role === 'supervisor'
            ? 'Evaluation Oversight'
            : role === 'evaluator'
            ? 'My Assigned Evaluations'
            : role === 'applicant'
            ? 'My Applications'
            : 'All Applications'}
        description={role === 'supervisor'
            ? 'Monitor and oversee the progress of all active evaluations.'
            : role === 'evaluator'
            ? 'Review and complete your assigned accreditation evaluations.'
            : role === 'applicant'
            ? 'Track and manage your submitted accreditation applications.'
            : 'Manage applications by different institutions right here'}
        searchValue={search}
        onSearchChange={val => (search = val)}
        showPagination={true}
        currentPage={1}
        totalPages={10}
        onRowClick={isReadOnly ? undefined : item => goto(`/accreditation/applications/${item.id}?role=${role}`)}
    />
</div>
