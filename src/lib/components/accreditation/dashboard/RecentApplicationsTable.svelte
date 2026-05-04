<script lang='ts'>
    import type { Application } from '$lib/accreditation/utils/application-utils';
    import { goto } from '$app/navigation';
    import { mockApplications } from '$lib/accreditation/utils/application-utils';
    import DataTable from '$lib/components/accreditation/ui/DataTable.svelte';
    import StatusBadge from '$lib/components/accreditation/ui/StatusBadge.svelte';
    import { Eye, ListFilter, Trash2, X } from '@lucide/svelte';

    const { role } = $props<{ role: string }>();

    let search = $state('');
    let activeFilters = $state<string[]>(['All time', 'US, AU, +4']);

    const removeFilter = (filter: string) => {
        activeFilters = activeFilters.filter(f => f !== filter);
    };

    const filteredData = $derived(mockApplications.filter((item: Application) => {
        const matchesSearch
            = item.applicant.name.toLowerCase().includes(search.toLowerCase())
                || item.applicant.email.toLowerCase().includes(search.toLowerCase())
                || item.institution.name.toLowerCase().includes(search.toLowerCase());

        const hasLocationFilter = activeFilters.includes('US, AU, +4');
        const matchesLocation = !hasLocationFilter || (item.location && ['US', 'AU'].includes(item.location));

        return matchesSearch && matchesLocation;
    }));
</script>

{#snippet applicantCell(item: Application)}
    <div class='flex items-start gap-3'>
        <div class='flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600'>
            {item.applicant.avatar}
        </div>
        <div class='flex flex-col'>
            <span class='text-sm text-[#101828]'>{item.applicant.name}</span>
            <span class='text-[11px] text-[#475467]'>{item.applicant.email}</span>
        </div>
    </div>
{/snippet}

{#snippet institutionCell(item: Application)}
    <div class='flex items-start gap-3'>
        <div class='flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-[10px] font-bold text-orange-600'>
            {item.institution.logo}
        </div>
        <div class='flex flex-col'>
            <span class='text-sm text-[#101828]'>{item.institution.name}</span>
            <span class='text-[11px] text-[#475467]'>{item.institution.website}</span>
        </div>
    </div>
{/snippet}

{#snippet tradeCell(item: Application)}
    <div class='flex flex-col'>
        <span class='text-sm font-medium text-slate-600'>{item.trade.name}</span>
        <span class='text-[11px] uppercase tracking-wider text-[#475467]'>{item.trade.category}</span>
    </div>
{/snippet}

{#snippet statusCell(item: Application)}
    <StatusBadge status={item.status} />
{/snippet}

{#snippet stageCell(item: Application)}
    <span class='text-sm font-medium text-slate-500'>{item.stage}</span>
{/snippet}

{#snippet submittedOnCell(item: Application)}
    <div class='flex flex-col'>
        <span class='text-sm font-medium text-slate-600'>{item.submittedOn.split(' ')[0]}</span>
        <span class='text-[11px] text-[#475467]'>{item.submittedOn.split(' ').slice(1).join(' ')}</span>
    </div>
{/snippet}

{#snippet actionsCell()}
    <div class='flex items-start gap-4'>
        <Eye class='h-4 w-4 cursor-pointer text-slate-400 transition-colors hover:text-[#2069C1]' />
        <Trash2 class='h-4 w-4 cursor-pointer text-slate-400 transition-colors hover:text-red-500' />
    </div>
{/snippet}

{#snippet filtersSnippet()}
    <div class='flex items-center gap-2'>
        {#each activeFilters as filter}
            <div class='flex items-center gap-2 rounded-sm border border-slate-100 bg-white px-3 py-3 text-xs text-[#344054]'>
                <span>{filter}</span>
                <X
                    class='h-3 w-3 cursor-pointer text-slate-400 transition-colors hover:text-slate-600'
                    onclick={() => removeFilter(filter)}
                />
            </div>
        {/each}
        <button class='flex cursor-pointer items-center gap-2 rounded-sm border border-slate-100 bg-white px-3 py-3 text-xs text-[#344054] transition-colors hover:bg-slate-100'>
            <ListFilter class='h-4 w-4 text-slate-500' />
            <span>More filters</span>
        </button>
    </div>
{/snippet}

<div class='mt-8 animate-slide-up'>
    <DataTable
        data={filteredData}
        columns={[
            { header: 'Applicant', accessor: applicantCell, sortable: true },
            { header: 'Institution', accessor: institutionCell, sortable: true },
            { header: 'Trade', accessor: tradeCell },
            { header: 'Status', accessor: statusCell },
            { header: 'Evaluation Stage', accessor: stageCell },
            { header: 'Submitted On', accessor: submittedOnCell },
            { header: 'Actions', accessor: actionsCell },
        ]}
        title='Recent Applications'
        description='Manage applications by different institutions right here'
        searchValue={search}
        onSearchChange={val => search = val}
        showPagination={true}
        currentPage={1}
        totalPages={10}
        onRowClick={item => goto(`/accreditation/applications/${item.id}?role=${role}`)}
        filters={filtersSnippet}
    />
</div>
