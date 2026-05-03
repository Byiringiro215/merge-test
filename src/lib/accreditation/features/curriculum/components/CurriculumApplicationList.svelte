<script lang='ts'>
    import { goto } from '$app/navigation';
    import { mockApplications } from '$lib/accreditation/utils/application-utils';
    import StatsGrid from '$lib/components/accreditation/dashboard/StatsGrid.svelte';
    import Badge from '$lib/components/accreditation/ui/Badge.svelte';
    import DataTable from '$lib/components/accreditation/ui/DataTable.svelte';
    import {
        CheckCheck,
        ClipboardClock,
        FileSearch,
        ShieldAlert,
    } from '@lucide/svelte';

    interface CurriculumApplication {
        id: string;
        institution: {
            name: string;
        };
        trade: {
            name: string;
            category: string;
        };
        stage: string;
        status: string;
        submittedOn: string;
        curriculumStatus: string;
        standardsArea: string;
    }

    let search = $state('');

    const applications: CurriculumApplication[] = mockApplications
        .filter(app => app.status === 'Pending' || app.stage === 'Rejected')
        .map((app, index) => ({
            ...app,
            curriculumStatus:
                index % 3 === 0 ? 'Needs evidence' : index % 3 === 1 ? 'Ready to review' : 'Criteria mismatch',
            standardsArea:
                index % 2 === 0 ? 'Learning outcomes + assessments' : 'Module structure + supporting files',
        })) as CurriculumApplication[];

    const filteredApplications = $derived(
        applications.filter((item) => {
            const query = search.toLowerCase();
            return (
                item.institution.name.toLowerCase().includes(query)
                || item.trade.name.toLowerCase().includes(query)
                || item.curriculumStatus.toLowerCase().includes(query)
            );
        }),
    );

    const stats = $derived([
        { label: 'Assigned reviews', value: filteredApplications.length, icon: ClipboardClock, iconColor: '#FF8D28' },
        { label: 'Ready for approval', value: 2, icon: CheckCheck, iconColor: '#34C759' },
        { label: 'Evidence gaps', value: 3, icon: FileSearch, iconColor: '#0A77FF' },
        { label: 'Standards issues', value: 1, icon: ShieldAlert, iconColor: '#FF383C' },
    ]);
</script>

{#snippet institutionCell(item: CurriculumApplication)}
    <div class='flex flex-col text-left'>
        <span class='text-[13px] font-medium text-slate-900'>{item.institution.name}</span>
        <span class='text-[11px] text-slate-500'>{item.trade.name}</span>
    </div>
{/snippet}

{#snippet programAreaCell(item: CurriculumApplication)}
    <div class='flex flex-col text-left'>
        <span class='text-[13px] font-medium text-slate-900'>{item.trade.category}</span>
        <span class='text-[11px] text-slate-500'>{item.stage}</span>
    </div>
{/snippet}

{#snippet curriculumStatusCell(item: CurriculumApplication)}
    <div class='text-left'>
        <Badge
            class={item.curriculumStatus === 'Ready to review'
                ? 'border-0 bg-emerald-50 normal-case tracking-normal text-emerald-700'
                : item.curriculumStatus === 'Needs evidence'
                ? 'border-0 bg-amber-50 normal-case tracking-normal text-amber-700'
                : 'border-0 bg-rose-50 normal-case tracking-normal text-rose-700'}
        >
            {item.curriculumStatus}
        </Badge>
    </div>
{/snippet}

{#snippet reviewFocusCell(item: CurriculumApplication)}
    <span class='text-left text-[13px] font-medium text-slate-600'>{item.standardsArea}</span>
{/snippet}

{#snippet submittedCell(item: CurriculumApplication)}
    <span class='text-left text-[13px] font-medium text-slate-600'>{item.submittedOn}</span>
{/snippet}

{#snippet actionCell(item: CurriculumApplication)}
    <button
        onclick={(e) => {
            e.stopPropagation();
            goto(`/accreditation/curriculum-evaluator/applications/${item.id}`);
        }}
        class='cursor-pointer whitespace-nowrap rounded-sm bg-[#0A77FF] px-3 py-2 text-[13px] font-medium text-white transition-all hover:opacity-90'
    >
        Review Curriculum
    </button>
{/snippet}

<div class='mt-8 space-y-6 text-left'>
    <StatsGrid items={stats} />

    <DataTable
        data={filteredApplications}
        columns={[
            { header: 'Institution', accessor: institutionCell, sortable: true },
            { header: 'Program area', accessor: programAreaCell },
            { header: 'Curriculum status', accessor: curriculumStatusCell },
            { header: 'Review focus', accessor: reviewFocusCell },
            { header: 'Submitted', accessor: submittedCell },
            { header: 'Action', accessor: actionCell },
        ]}
        title='Curriculum Review Queue'
        description='Review completeness, outcome alignment, and assessment evidence before accreditation decisions move ahead.'
        searchValue={search}
        onSearchChange={val => search = val}
        showPagination={true}
        currentPage={1}
        totalPages={1}
        onRowClick={item => goto(`/accreditation/curriculum-evaluator/applications/${item.id}`)}
    />
</div>
