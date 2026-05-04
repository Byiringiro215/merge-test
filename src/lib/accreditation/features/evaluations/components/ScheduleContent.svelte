<script lang='ts'>
    import type { StatusType } from '$lib/components/accreditation/ui/StatusBadge.svelte';
    import { mockSchedule } from '$lib/accreditation/utils/schedule-utils';
    import StatsGrid from '$lib/components/accreditation/dashboard/StatsGrid.svelte';
    import DataTable from '$lib/components/accreditation/ui/DataTable.svelte';
    import StatusBadge from '$lib/components/accreditation/ui/StatusBadge.svelte';
    import {
        AlertCircle,
        CalendarRange,
        CheckCheck,
        ClipboardClock,
        Eye,
        NotepadText,
        Trash2,
        XCircle,
    } from '@lucide/svelte';

    const { role = 'super-admin' } = $props<{ role?: string }>();

    interface ScheduleItem {
        id: string;
        institution: {
            name: string;
            logo: string;
            phone: string;
        };
        evaluator: {
            name: string;
            email: string;
            avatar: string;
        };
        trade: string;
        spe: string;
        visitDate: string;
        visitTime: string;
        status: StatusType;
        location: string;
    }

    let search = $state('');
    const isReadOnly = $derived(role === 'supervisor');

    const stats = [
        { label: 'Total scheduled visits', value: '24', icon: NotepadText, iconColor: '#0A77FF' },
        { label: 'Today\'s visit', value: '3', icon: ClipboardClock, iconColor: '#FF8D28' },
        { label: 'Completed visits', value: '18', icon: CheckCheck, iconColor: '#34C759' },
        { label: 'Overdue visits', value: '2', icon: AlertCircle, iconColor: '#6155F5' },
        { label: 'Cancelled visits', value: '1', icon: XCircle, iconColor: '#FF383C' },
    ];

    const filteredData = $derived(
        (mockSchedule.filter(
            item =>
                item.institution.name.toLowerCase().includes(search.toLowerCase())
                    || item.evaluator.name.toLowerCase().includes(search.toLowerCase())
                    || item.trade.toLowerCase().includes(search.toLowerCase()),
        ) as ScheduleItem[]),
    );
</script>

{#snippet institutionCell(item: ScheduleItem)}
    <div class='flex items-center gap-3 text-left'>
        <div class='flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-orange-100'>
            <img src={item.institution.logo} alt='logo' class='h-full w-full object-cover' />
        </div>
        <div class='flex flex-col'>
            <span class='text-sm font-medium text-[#101828]'>{item.institution.name}</span>
            <span class='text-xs text-[#475467]'>{item.institution.phone}</span>
        </div>
    </div>
{/snippet}

{#snippet evaluatorCell(item: ScheduleItem)}
    <div class='flex items-center gap-3 text-left'>
        <div class='flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-slate-100'>
            <img src={item.evaluator.avatar} alt='avatar' class='h-full w-full object-cover' />
        </div>
        <div class='flex flex-col'>
            <span class='text-sm font-medium text-[#101828]'>{item.evaluator.name}</span>
            <span class='text-xs text-[#475467]'>{item.evaluator.email}</span>
        </div>
    </div>
{/snippet}

{#snippet tradeCell(item: ScheduleItem)}
    <div class='flex flex-col text-left'>
        <span class='text-sm font-medium text-[#101828]'>{item.trade}</span>
        <span class='text-xs text-[#475467]'>{item.spe}</span>
    </div>
{/snippet}

{#snippet visitDateCell(item: ScheduleItem)}
    <div class='flex flex-col text-left'>
        <span class='text-sm font-medium text-[#101828]'>{item.visitDate}</span>
        <span class='text-xs text-[#475467]'>{item.visitTime}</span>
    </div>
{/snippet}

{#snippet statusCell(item: ScheduleItem)}
    <div class='text-left'>
        <StatusBadge status={item.status} />
    </div>
{/snippet}

{#snippet locationCell(item: ScheduleItem)}
    <div class='min-w-[220px] whitespace-normal text-left text-xs leading-relaxed text-[#475467]'>
        {item.location}
    </div>
{/snippet}

{#snippet actionsCell()}
    <div class='flex items-center justify-start gap-3'>
        <CalendarRange class='h-4 w-4 cursor-pointer text-[#475467] transition-colors hover:text-[#0A77FF]' />
        <Eye class='h-4 w-4 cursor-pointer text-[#475467] transition-colors hover:text-[#0A77FF]' />
        <Trash2 class='h-4 w-4 cursor-pointer text-[#475467] transition-colors hover:text-red-500' />
    </div>
{/snippet}

<div class='space-y-6'>
    <StatsGrid items={stats} gridCols={5} />
    <DataTable
        data={filteredData}
        columns={[
            { header: 'Institution', accessor: institutionCell, sortable: true },
            { header: 'Assigned Evaluator', accessor: evaluatorCell, sortable: true },
            { header: 'Trade', accessor: tradeCell },
            { header: 'Visit Date', accessor: visitDateCell },
            { header: 'Visit Status', accessor: statusCell },
            { header: 'Location', accessor: locationCell },
            ...(isReadOnly ? [] : [{ header: 'Actions', accessor: actionsCell }]),
        ]}
        title='Due Diligence Schedule'
        description={isReadOnly ? 'View scheduled visits' : 'Manage institutions schedule visits right here'}
        searchValue={search}
        onSearchChange={val => search = val}
        showPagination={true}
        currentPage={1}
        totalPages={10}
    />
</div>
