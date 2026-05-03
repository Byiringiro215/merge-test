<script lang='ts'>
    import type { ColumnDef } from '@tanstack/table-core';
    import type { CurriculumRecord } from './types.js';
    import DataTable from '$lib/components/data-table/data-table.svelte';
    import { Button } from '$lib/components/ui/button';
    import { Card } from '$lib/components/ui/card';
    import { renderSnippet } from '$lib/components/ui/data-table/index.js';
    import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
    import { Input } from '$lib/components/ui/input';
    import { Pagination } from '$lib/components/ui/pagination';
    import { Edit, Eye, Search, Trash } from '@lucide/svelte';
    import EllipsisIcon from '@lucide/svelte/icons/ellipsis';
    import FilterIcon from '@lucide/svelte/icons/filter';
    import { createRawSnippet } from 'svelte';

    const mockData: CurriculumRecord[] = [
        {
            idCode: 'CUR-2023-001',
            name: 'Software Engineering L4',
            tradeArea: 'ICT',
            level: 'Level 4',
            status: 'Active',
            lastUpdated: '2023-10-15',
        },
        {
            idCode: 'CUR-2023-002',
            name: 'Culinary Arts L3',
            tradeArea: 'Hospitality',
            level: 'Level 3',
            status: 'Under Review',
            lastUpdated: '2023-10-20',
        },
        {
            idCode: 'CUR-2023-003',
            name: 'Masonry & Concrete L2',
            tradeArea: 'Construction',
            level: 'Level 2',
            status: 'Draft',
            lastUpdated: '2023-10-22',
        },
        {
            idCode: 'CUR-2023-004',
            name: 'Crop Production L5',
            tradeArea: 'Agriculture',
            level: 'Level 5',
            status: 'Active',
            lastUpdated: '2023-09-10',
        },
        {
            idCode: 'CUR-2023-005',
            name: 'Networking Basics L3',
            tradeArea: 'ICT',
            level: 'Level 3',
            status: 'Archived',
            lastUpdated: '2023-05-14',
        },
        {
            idCode: 'CUR-2023-006',
            name: 'Welding Fabrication L4',
            tradeArea: 'Manufacturing',
            level: 'Level 4',
            status: 'Active',
            lastUpdated: '2023-10-01',
        },
    ];

    interface Props {
        data?: CurriculumRecord[];
        currentPage?: number;
        totalPages?: number;
        totalItems?: number;
        pageSize?: number;
        onPageChange?: (page: number) => void;
    }

    const {
        data = mockData,
        currentPage = 1,
        totalPages = 31,
        totalItems = 184,
        pageSize = 6,
        onPageChange,
    }: Props = $props();

    let searchQuery = $state('');

    const filteredData = $derived(
        searchQuery
            ? data.filter(
                item =>
                    item.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                        || item.idCode
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                        || item.tradeArea
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()),
            )
            : data,
    );

    function getStatusStyles(
        status: CurriculumRecord['status'],
    ): { bg: string; text: string } {
        switch (status) {
            case 'Active':
                return { bg: 'bg-green-50', text: 'text-green-700' };
            case 'Under Review':
                return { bg: 'bg-amber-50', text: 'text-amber-700' };
            case 'Draft':
                return { bg: 'bg-gray-50', text: 'text-gray-700' };
            case 'Archived':
                return { bg: 'bg-gray-100', text: 'text-gray-500' };
            default:
                return { bg: 'bg-gray-50', text: 'text-gray-700' };
        }
    }

    const columns: ColumnDef<CurriculumRecord>[] = [
        {
            id: 'idCode',
            accessorKey: 'idCode',
            header: 'ID Code',
            cell: ({ row }) => {
                const snippet = createRawSnippet(() => ({
                    render: () =>
                        `<span class="text-gray-600">${row.original.idCode}</span>`,
                }));
                return renderSnippet(snippet);
            },
        },
        {
            accessorKey: 'name',
            header: 'Curriculum Name',
            cell: ({ row }) => {
                const snippet = createRawSnippet(() => ({
                    render: () =>
                        `<span class="font-medium text-gray-900">${row.original.name}</span>`,
                }));
                return renderSnippet(snippet);
            },
        },
        {
            accessorKey: 'tradeArea',
            header: 'Trade Area',
            cell: ({ row }) => row.original.tradeArea,
        },
        {
            accessorKey: 'level',
            header: 'Level',
            cell: ({ row }) => row.original.level,
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const style = getStatusStyles(row.original.status);
                const snippet = createRawSnippet(() => ({
                    render: () =>
                        `<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${style.bg} ${style.text}">${row.original.status}</span>`,
                }));
                return renderSnippet(snippet);
            },
        },
        {
            accessorKey: 'lastUpdated',
            header: 'Last Updated',
            cell: ({ row }) => row.original.lastUpdated,
        },
        {
            id: 'actions',
            header: 'Actions',
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

<Card class='p-5 bg-white border border-gray-100 shadow-sm rounded-lg'>
    <!-- Header -->
    <div
        class='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4'
    >
        <div>
            <h3 class='text-lg font-semibold text-gray-900'>
                Curriculum Directory
            </h3>
            <p class='text-sm text-gray-500 mt-0.5'>
                Comprehensive list of all curriculum programs and their current
                status.
            </p>
        </div>
        <div class='flex items-center gap-3'>
            <div class='relative w-full sm:w-56'>
                <Search
                    class='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400'
                />
                <Input
                    type='text'
                    placeholder='Search curricula...'
                    bind:value={searchQuery}
                    class='pl-9 bg-white rounded-lg placeholder:font-normal text-sm'
                />
            </div>
            <Button variant='outline' size='icon' class='h-9 w-9'>
                <FilterIcon class='h-4 w-4' />
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
            <span class='font-medium'>{totalItems}</span> entries
        </p>
        <Pagination
            {currentPage}
            {totalPages}
            onPageChange={handlePageChange}
        />
    </div>
</Card>
