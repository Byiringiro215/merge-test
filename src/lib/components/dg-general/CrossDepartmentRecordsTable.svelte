<script lang='ts'>
    import type { ColumnDef } from '@tanstack/table-core';
    import type { RegionData } from './types.js';
    import DataTable from '$lib/components/data-table/data-table.svelte';
    import { Button } from '$lib/components/ui/button';
    import { Card } from '$lib/components/ui/card';
    import { renderSnippet } from '$lib/components/ui/data-table/index.js';
    import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
    import { Input } from '$lib/components/ui/input';
    import {
        ArrowUpDown,
        BarChart3,
        Edit,
        Eye,
        Search,
        Trash,
    } from '@lucide/svelte';
    import EllipsisIcon from '@lucide/svelte/icons/ellipsis';
    import { createRawSnippet } from 'svelte';

    const defaultData: RegionData[] = [
        {
            region: 'Kigali City',
            totalSchools: 85,
            students: 45000,
            teachingStaff: 3200,
            curriculumProgs: 112,
            infraSpiu: '12/4',
            status: 'Active',
        },
        {
            region: 'Southern Province',
            totalSchools: 112,
            students: 32000,
            teachingStaff: 2800,
            curriculumProgs: 98,
            infraSpiu: '25/3',
            status: 'Active',
        },
        {
            region: 'Western Province',
            totalSchools: 95,
            students: 28500,
            teachingStaff: 2450,
            curriculumProgs: 85,
            infraSpiu: '18/2',
            status: 'Warning',
        },
        {
            region: 'Northern Province',
            totalSchools: 78,
            students: 22000,
            teachingStaff: 2100,
            curriculumProgs: 76,
            infraSpiu: '15/5',
            status: 'Active',
        },
        {
            region: 'Eastern Province',
            totalSchools: 82,
            students: 17780,
            teachingStaff: 1900,
            curriculumProgs: 70,
            infraSpiu: '19/1',
            status: 'Active',
        },
    ];

    interface Props {
        data?: RegionData[];
        currentPage?: number;
        totalPages?: number;
        totalItems?: number;
        pageSize?: number;
        onPageChange?: (page: number) => void;
    }

    const {
        data = defaultData,
        currentPage = 1,
        totalPages = 6,
        totalItems = 30,
        pageSize = 5,
        onPageChange,
    }: Props = $props();

    let searchQuery = $state('');

    const filteredData = $derived(
        searchQuery
            ? data.filter(r =>
                r.region.toLowerCase().includes(searchQuery.toLowerCase()),
            )
            : data,
    );

    const columns: ColumnDef<RegionData>[] = [
        {
            id: 'region',
            accessorKey: 'region',
            header: 'REGION / ENTITY',
            cell: ({ row }) => {
                const snippet = createRawSnippet(() => ({
                    render: () =>
                        `<span class="font-medium text-gray-900">${row.original.region}</span>`,
                }));
                return renderSnippet(snippet);
            },
        },
        {
            accessorKey: 'totalSchools',
            header: 'TOTAL SCHOOLS',
            cell: ({ row }) => {
                const snippet = createRawSnippet(() => ({
                    render: () =>
                        `<div class="flex items-center gap-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>
                            <span>${row.original.totalSchools}</span>
                        </div>`,
                }));
                return renderSnippet(snippet);
            },
        },
        {
            accessorKey: 'students',
            header: 'STUDENTS',
            cell: ({ row }) =>
                row.original.students.toLocaleString(),
        },
        {
            accessorKey: 'teachingStaff',
            header: 'TEACHING STAFF',
            cell: ({ row }) =>
                row.original.teachingStaff.toLocaleString(),
        },
        {
            accessorKey: 'curriculumProgs',
            header: 'CURRICULUM PROGS',
            cell: ({ row }) => row.original.curriculumProgs,
        },
        {
            accessorKey: 'infraSpiu',
            header: 'INFRA / SPIU',
            cell: ({ row }) => row.original.infraSpiu,
        },
        {
            accessorKey: 'status',
            header: 'STATUS',
            cell: ({ row }) => {
                const statusStyles: Record<string, { bg: string; text: string }> = {
                    Active: { bg: 'bg-gray-100', text: 'text-gray-700' },
                    Warning: { bg: 'bg-amber-50', text: 'text-amber-700' },
                    Inactive: { bg: 'bg-red-50', text: 'text-red-700' },
                };
                const style = statusStyles[row.original.status] || statusStyles.Active;

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
    <div class='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4'>
        <div class='flex items-center gap-3'>
            <div class='flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50'>
                <BarChart3 class='h-5 w-5 text-primary' />
            </div>
            <div>
                <h3 class='text-lg font-bold text-gray-900'>Cross-Department Records</h3>
                <p class='text-sm text-gray-500'>Aggregated data by region</p>
            </div>
        </div>
        <div class='flex items-center gap-3'>
            <div class='relative w-full sm:w-64'>
                <Search class='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
                <Input
                    type='text'
                    placeholder='Search records...'
                    bind:value={searchQuery}
                    class='pl-9 bg-white rounded-lg placeholder:font-normal text-sm'
                />
            </div>
            <Button variant='outline' size='sm' class='gap-2'>
                <ArrowUpDown class='h-4 w-4' />
                Sort
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
            Showing <span class='font-medium'>{startItem}</span> to <span class='font-medium'>{endItem}</span> of <span class='font-medium'>{totalItems}</span> results
        </p>
        <div class='flex items-center gap-2'>
            <Button
                variant='outline'
                size='sm'
                disabled={currentPage <= 1}
                onclick={() => handlePageChange(currentPage - 1)}
            >
                Previous
            </Button>
            {#each Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1) as page (page)}
                <Button
                    variant={currentPage === page ? 'default' : 'outline'}
                    size='sm'
                    class='w-9'
                    onclick={() => handlePageChange(page)}
                >
                    {page}
                </Button>
            {/each}
            <Button
                variant='outline'
                size='sm'
                disabled={currentPage >= totalPages}
                onclick={() => handlePageChange(currentPage + 1)}
            >
                Next
            </Button>
        </div>
    </div>
</Card>
