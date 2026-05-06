<script lang='ts'>
    import type { StatusType } from '$lib/components/accreditation/ui/StatusBadge.svelte';

    import { mockEvaluators } from '$lib/accreditation/utils/evaluator-utils';
    import StatsGrid from '$lib/components/accreditation/dashboard/StatsGrid.svelte';
    import DataTable from '$lib/components/accreditation/ui/DataTable.svelte';
    import StatusBadge from '$lib/components/accreditation/ui/StatusBadge.svelte';
    import {
        CheckCheck,
        ClipboardClock,
        Pencil,
        Trash2,
        TriangleAlert,
        User,
        Users,
    } from '@lucide/svelte';

    const { role = 'super-admin' } = $props<{ role?: string }>();

    interface Evaluator {
        id: string;
        name: string;
        email: string;
        status: StatusType;
        dateAdded: string;
        lastActive: string;
    }

    let search = $state('');
    const isReadOnly = $derived(role === 'supervisor');

    const stats = [
        { label: 'Total Evaluators', value: '48', icon: Users, iconColor: '#2069C1' },
        { label: 'Active', value: '32', icon: User, iconColor: '#34C759' },
        { label: 'Available', value: '12', icon: CheckCheck, iconColor: '#CB30E0' },
        { label: 'Pending', value: '4', icon: ClipboardClock, iconColor: '#6155F5' },
        { label: 'Deactivated', value: '2', icon: TriangleAlert, iconColor: '#FF383C' },
    ];

    const filteredData = $derived(
        (mockEvaluators.filter(
            item =>
                item.name.toLowerCase().includes(search.toLowerCase())
                    || item.email.toLowerCase().includes(search.toLowerCase()),
        ) as Evaluator[]),
    );
</script>

{#snippet nameCell(item: Evaluator)}
    <div class='flex items-center gap-3 text-left'>
        <div class='flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-100'>
            <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.name}`}
                alt={item.name}
                class='h-full w-full object-cover'
            />
        </div>
        <div class='flex flex-col'>
            <span class='text-sm font-medium text-[#101828]'>{item.name}</span>
            <span class='text-xs text-[#475467]'>{item.email}</span>
        </div>
    </div>
{/snippet}

{#snippet statusCell(item: Evaluator)}
    <div class='text-left'>
        <StatusBadge status={item.status} />
    </div>
{/snippet}

{#snippet dateAddedCell(item: Evaluator)}
    <span class='text-left text-sm text-[#475467]'>{item.dateAdded}</span>
{/snippet}

{#snippet lastActiveCell(item: Evaluator)}
    <span class='text-left text-sm text-[#475467]'>{item.lastActive}</span>
{/snippet}

{#snippet actionsCell()}
    <div class='flex items-center justify-start gap-3'>
        <Trash2 class='h-4 w-4 cursor-pointer text-[#475467] transition-colors hover:text-red-500' />
        <Pencil class='h-4 w-4 cursor-pointer text-[#475467] transition-colors hover:text-[#2069C1]' />
    </div>
{/snippet}

<div class='space-y-6'>
    <StatsGrid items={stats} gridCols={5} />
    <DataTable
        data={filteredData}
        columns={[
            { header: 'Name', accessor: nameCell, sortable: true },
            { header: 'Status', accessor: statusCell },
            { header: 'Date added', accessor: dateAddedCell },
            { header: 'Last active', accessor: lastActiveCell },
            ...(isReadOnly ? [] : [{ header: 'Actions', accessor: actionsCell }]),
        ]}
        title='All Evaluators'
        description={isReadOnly ? 'View evaluators information' : 'Manage applications by different institutions right here'}
        searchValue={search}
        onSearchChange={val => (search = val)}
        showPagination={true}
        currentPage={1}
        totalPages={10}
    />
</div>
