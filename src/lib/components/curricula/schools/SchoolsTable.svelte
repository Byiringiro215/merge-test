<script lang='ts'>
    import type { ColumnDef } from '@tanstack/table-core';
    import type { SchoolRecord } from './types.js';
    import DataTable from '$lib/components/data-table/data-table.svelte';
    import { Card } from '$lib/components/ui/card';
    import { renderSnippet } from '$lib/components/ui/data-table/index.js';
    import { Input } from '$lib/components/ui/input';
    import { Pagination } from '$lib/components/ui/pagination';
    import { Search } from '@lucide/svelte';
    import { createRawSnippet } from 'svelte';

    const defaultData: SchoolRecord[] = [
        {
            id: 'SCH-0001',
            name: 'IPRC Kigali',
            district: 'Kicukiro',
            province: 'Kigali City',
            type: 'Public',
            teachers: 45,
            students: 1250,
        },
        {
            id: 'SCH-0002',
            name: 'IPRC Tumba',
            district: 'Rulindo',
            province: 'Northern',
            type: 'Public',
            teachers: 38,
            students: 980,
        },
        {
            id: 'SCH-0003',
            name: 'Saint Andre College',
            district: 'Nyarugenge',
            province: 'Kigali City',
            type: 'Private',
            teachers: 22,
            students: 450,
        },
        {
            id: 'SCH-0004',
            name: 'G.S. Officiel de Butare',
            district: 'Huye',
            province: 'Southern',
            type: 'Public',
            teachers: 55,
            students: 1800,
        },
        {
            id: 'SCH-0005',
            name: 'Kigali Christian School',
            district: 'Gasabo',
            province: 'Kigali City',
            type: 'Private',
            teachers: 18,
            students: 320,
        },
        {
            id: 'SCH-0006',
            name: 'IPRC Musanze',
            district: 'Musanze',
            province: 'Northern',
            type: 'Public',
            teachers: 40,
            students: 1100,
        },
        {
            id: 'SCH-0007',
            name: 'Ecole d\'Art de Nyundo',
            district: 'Rubavu',
            province: 'Western',
            type: 'Public',
            teachers: 25,
            students: 600,
        },
        {
            id: 'SCH-0008',
            name: 'E.S. Kayonza',
            district: 'Kayonza',
            province: 'Eastern',
            type: 'Public',
            teachers: 30,
            students: 850,
        },
        {
            id: 'SCH-0009',
            name: 'Cornerstone Academy',
            district: 'Rwamagana',
            province: 'Eastern',
            type: 'Private',
            teachers: 15,
            students: 250,
        },
        {
            id: 'SCH-0010',
            name: 'Nyanza TVET School',
            district: 'Nyanza',
            province: 'Southern',
            type: 'Public',
            teachers: 28,
            students: 720,
        },
    ];

    interface Props {
        data?: SchoolRecord[];
        currentPage?: number;
        totalPages?: number;
        totalItems?: number;
        onPageChange?: (page: number) => void;
    }

    const {
        data = defaultData,
        currentPage = 1,
        totalPages = 3,
        totalItems = 10,
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
                        || item.district
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                        || item.id
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()),
            )
            : data,
    );

    function getTypeStyles(type: SchoolRecord['type']): {
        bg: string;
        text: string;
    } {
        switch (type) {
            case 'Public':
                return { bg: 'bg-[#205FAD]', text: 'text-white' };
            case 'Private':
                return { bg: 'bg-[#F3F4F6]', text: 'text-gray-700' };
            case 'Government Aided':
                return { bg: 'bg-green-100', text: 'text-green-700' };
            default:
                return { bg: 'bg-gray-100', text: 'text-gray-700' };
        }
    }

    const columns: ColumnDef<SchoolRecord>[] = [
        {
            id: 'name',
            accessorKey: 'name',
            header: 'Institution Name',
            cell: ({ row }) => {
                const snippet = createRawSnippet(() => ({
                    render: () => `
                        <div class="flex flex-col">
                            <span class="font-medium text-gray-900">${row.original.name}</span>
                            <span class="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>
                                ID: ${row.original.id}
                            </span>
                        </div>
                    `,
                }));
                return renderSnippet(snippet);
            },
        },
        {
            accessorKey: 'location',
            header: 'Location',
            cell: ({ row }) => {
                const snippet = createRawSnippet(() => ({
                    render: () => `
                        <div class="flex flex-col">
                            <span class="text-gray-900">${row.original.district}</span>
                            <span class="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
                                ${row.original.province}
                            </span>
                        </div>
                    `,
                }));
                return renderSnippet(snippet);
            },
        },
        {
            accessorKey: 'type',
            header: 'Type',
            cell: ({ row }) => {
                const style = getTypeStyles(row.original.type);
                const snippet = createRawSnippet(() => ({
                    render: () =>
                        `<span class="inline-flex items-center rounded-full px-3 py-0.75 text-xs font-medium ${style.bg} ${style.text}">${row.original.type}</span>`,
                }));
                return renderSnippet(snippet);
            },
        },
        {
            accessorKey: 'teachers',
            header: 'Teachers',
            cell: ({ row }) => {
                const snippet = createRawSnippet(() => ({
                    render: () => `
                        <div class="flex items-center gap-2 text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                            <span>${row.original.teachers}</span>
                        </div>
                    `,
                }));
                return renderSnippet(snippet);
            },
        },
        {
            accessorKey: 'students',
            header: 'Students',
            cell: ({ row }) => {
                const snippet = createRawSnippet(() => ({
                    render: () => `
                        <div class="flex items-center gap-2 text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><path d="M18 21a8 8 0 0 0-16 0"/><circle cx="10" cy="8" r="5"/><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"/></svg>
                            <span>${row.original.students.toLocaleString()}</span>
                        </div>
                    `,
                }));
                return renderSnippet(snippet);
            },
        },
    ];

    function handlePageChange(page: number) {
        if (onPageChange) {
            onPageChange(page);
        }
    }
</script>

<Card class='p-5 bg-white border border-gray-100 shadow-sm rounded-xl'>
    <!-- Search and Results Count -->
    <div
        class='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4'
    >
        <div class='relative w-full sm:w-80'>
            <Search
                class='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400'
            />
            <Input
                type='text'
                placeholder='Search schools by name or district...'
                bind:value={searchQuery}
                class='pl-9 bg-white rounded-lg placeholder:font-normal text-sm'
            />
        </div>
        <p class='text-sm text-gray-500'>
            Showing <span class='font-semibold text-gray-900'
            >{filteredData.length}</span
            >
            of <span class='font-semibold text-gray-900'>{totalItems}</span> results
        </p>
    </div>

    <!-- Table -->
    <div class='rounded-lg border border-gray-200 bg-white overflow-hidden'>
        <DataTable {columns} data={filteredData} />
    </div>

    <!-- Pagination -->
    <div class='flex items-center justify-between mt-4 pt-2'>
        <p class='text-sm text-gray-500'>
            Page <span class='font-medium'>{currentPage}</span> of
            <span class='font-medium'>{totalPages}</span>
        </p>
        <Pagination
            {currentPage}
            {totalPages}
            onPageChange={handlePageChange}
        />
    </div>
</Card>
