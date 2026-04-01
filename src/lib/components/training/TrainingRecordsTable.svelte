<script lang='ts'>
    import type { ColumnDef } from '@tanstack/table-core';
    import type { TrainingRecord } from './types.js';
    import DataTable from '$lib/components/data-table/data-table.svelte';
    import { Button } from '$lib/components/ui/button';
    import { Card } from '$lib/components/ui/card';
    import { renderSnippet } from '$lib/components/ui/data-table/index.js';
    import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
    import { Input } from '$lib/components/ui/input';
    import { Pagination } from '$lib/components/ui/pagination';
    import { Edit, Eye, Search, Trash } from '@lucide/svelte';
    import EllipsisIcon from '@lucide/svelte/icons/ellipsis';
    import SlidersHorizontalIcon from '@lucide/svelte/icons/sliders-horizontal';
    import { createRawSnippet } from 'svelte';

    const defaultData: TrainingRecord[] = [
        {
            refId: 'TRD-2023-001',
            tradeDiscipline: 'Advanced Masonry',
            institution: 'Kigali IPRC',
            cohort: 'Coh-A1',
            startDate: '2023-09-01',
            participants: 120,
            status: 'Ongoing',
        },
        {
            refId: 'TRD-2023-002',
            tradeDiscipline: 'Software Engineering',
            institution: 'Akilah Institute',
            cohort: 'Coh-B2',
            startDate: '2023-08-15',
            participants: 85,
            status: 'Ongoing',
        },
        {
            refId: 'TRD-2023-003',
            tradeDiscipline: 'Automotive Mechanics',
            institution: 'Nyanza TSS',
            cohort: 'Coh-A1',
            startDate: '2023-01-10',
            participants: 60,
            status: 'Completed',
        },
        {
            refId: 'TRD-2023-004',
            tradeDiscipline: 'Culinary Arts Basics',
            institution: 'Musanze Hospitality',
            cohort: 'Coh-C1',
            startDate: '2023-11-01',
            participants: 45,
            status: 'Planned',
        },
        {
            refId: 'TRD-2023-005',
            tradeDiscipline: 'Carpentry & Joinery',
            institution: 'Rubavu TVET',
            cohort: 'Coh-A2',
            startDate: '2023-05-20',
            participants: 110,
            status: 'Completed',
        },
        {
            refId: 'TRD-2023-006',
            tradeDiscipline: 'Network Administration',
            institution: 'Kigali IPRC',
            cohort: 'Coh-N1',
            startDate: '2023-10-05',
            participants: 75,
            status: 'Ongoing',
        },
        {
            refId: 'TRD-2023-007',
            tradeDiscipline: 'Welding Technology',
            institution: 'Gicumbi TSS',
            cohort: 'Coh-W1',
            startDate: '2023-02-15',
            participants: 50,
            status: 'Completed',
        },
    ];

    interface Props {
        data?: TrainingRecord[];
        currentPage?: number;
        totalPages?: number;
        totalItems?: number;
        pageSize?: number;
        onPageChange?: (page: number) => void;
    }

    const {
        data = defaultData,
        currentPage = 1,
        totalPages = 3,
        totalItems = 248,
        pageSize = 7,
        onPageChange,
    }: Props = $props();

    let searchQuery = $state('');

    const filteredData = $derived(
        searchQuery
            ? data.filter(
                item =>
                    item.tradeDiscipline
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                        || item.institution
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                        || item.refId.toLowerCase().includes(searchQuery.toLowerCase()),
            )
            : data,
    );

    const statusStyles: Record<string, { bg: string; text: string }> = {
        Ongoing: { bg: 'bg-blue-50', text: 'text-blue-700' },
        Completed: { bg: 'bg-green-50', text: 'text-green-700' },
        Planned: { bg: 'bg-amber-50', text: 'text-amber-700' },
    };

    const columns: ColumnDef<TrainingRecord>[] = [
        {
            id: 'refId',
            accessorKey: 'refId',
            header: 'REF ID',
            cell: ({ row }) => {
                const snippet = createRawSnippet(() => ({
                    render: () =>
                        `<span class="text-gray-600">${row.original.refId}</span>`,
                }));
                return renderSnippet(snippet);
            },
        },
        {
            accessorKey: 'tradeDiscipline',
            header: 'TRADE DISCIPLINE',
            cell: ({ row }) => {
                const snippet = createRawSnippet(() => ({
                    render: () =>
                        `<span class="font-medium text-gray-900">${row.original.tradeDiscipline}</span>`,
                }));
                return renderSnippet(snippet);
            },
        },
        {
            accessorKey: 'institution',
            header: 'INSTITUTION',
            cell: ({ row }) => {
                const snippet = createRawSnippet(() => ({
                    render: () => `
                        <div class="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>
                            <span class="text-gray-900">${row.original.institution}</span>
                        </div>
                    `,
                }));
                return renderSnippet(snippet);
            },
        },
        {
            accessorKey: 'cohort',
            header: 'COHORT',
            cell: ({ row }) => row.original.cohort,
        },
        {
            accessorKey: 'startDate',
            header: 'START DATE',
            cell: ({ row }) => row.original.startDate,
        },
        {
            accessorKey: 'participants',
            header: 'PARTICIPANTS',
            cell: ({ row }) => row.original.participants,
        },
        {
            accessorKey: 'status',
            header: 'STATUS',
            cell: ({ row }) => {
                const style
                    = statusStyles[row.original.status] || statusStyles.Ongoing;
                const snippet = createRawSnippet(() => ({
                    render: () =>
                        `<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${style.bg} ${style.text}">${row.original.status}</span>`,
                }));
                return renderSnippet(snippet);
            },
        },
        {
            id: 'actions',
            header: 'ACTIONS',
            cell: ({ row }) => renderSnippet(rowAction, { record: row.original }),
        },
    ];

    function handlePageChange(page: number) {
        if (onPageChange) {
            onPageChange(page);
        }
    }

    const startItem = $derived((currentPage - 1) * pageSize + 1);
    const endItem = $derived(Math.min(currentPage * pageSize, totalItems));
</script>

{#snippet rowAction()}
    <DropdownMenu.Root>
        <DropdownMenu.Trigger>
            {#snippet child({ props })}
                <Button
                    {...props}
                    variant='ghost'
                    size='icon'
                    class='relative size-8 p-0'
                >
                    <span class='sr-only'>Open menu</span>
                    <EllipsisIcon />
                </Button>
            {/snippet}
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
            <DropdownMenu.Group>
                <DropdownMenu.Label>Actions</DropdownMenu.Label>
                <DropdownMenu.Item>
                    <Eye class='mr-2 h-4 w-4' />
                    View details
                </DropdownMenu.Item>
            </DropdownMenu.Group>
            <DropdownMenu.Item>
                <Edit class='mr-2 h-4 w-4' />
                Edit details
            </DropdownMenu.Item>
            <DropdownMenu.Item class='text-red-600 group cursor-pointer'>
                <Trash class='mr-2 h-4 w-4 text-red-600 group-hover:text-black!' />
                Delete
            </DropdownMenu.Item>
        </DropdownMenu.Content>
    </DropdownMenu.Root>
{/snippet}

<Card class='p-5 bg-white border border-gray-100 shadow-sm rounded-xl'>
    <!-- Header -->
    <div
        class='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4'
    >
        <div>
            <h3 class='text-lg font-semibold text-gray-900'>
                Detailed Training Records
            </h3>
            <p class='text-sm text-gray-500 mt-0.5'>
                Manage and track specific trade cohorts across institutions.
            </p>
        </div>
        <div class='flex items-center gap-3'>
            <div class='relative w-full sm:w-56'>
                <Search
                    class='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400'
                />
                <Input
                    type='text'
                    placeholder='Search records...'
                    bind:value={searchQuery}
                    class='pl-9 bg-white rounded-lg placeholder:font-normal text-sm'
                />
            </div>
            <Button variant='outline' class='gap-2'>
                <SlidersHorizontalIcon class='h-4 w-4' />
                Columns
            </Button>
        </div>
    </div>

    <!-- Table -->
    <div class='rounded-lg border border-gray-200 bg-white overflow-hidden'>
        <DataTable {columns} data={filteredData} />
    </div>

    <!-- Pagination -->
    <div class='flex items-center justify-between mt-4 pt-2'>
        <p class='text-sm text-gray-500'>
            Showing <span class='font-medium'>{startItem}</span> to
            <span class='font-medium'>{endItem}</span> of
            <span class='font-medium'>{totalItems}</span> records
        </p>
        <Pagination {currentPage} {totalPages} onPageChange={handlePageChange} />
    </div>
</Card>
