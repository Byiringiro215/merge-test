<script lang='ts'>
    import type { ColumnDef } from '@tanstack/table-core';
    import type { HardwareAssetRecord } from './types.js';
    import DataTable from '$lib/components/data-table/data-table.svelte';
    import { Button } from '$lib/components/ui/button';
    import { Card } from '$lib/components/ui/card';
    import { renderSnippet } from '$lib/components/ui/data-table/index.js';
    import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
    import { Input } from '$lib/components/ui/input';
    import { Pagination } from '$lib/components/ui/pagination';
    import { Edit, Eye, Search, Trash } from '@lucide/svelte';
    import DownloadIcon from '@lucide/svelte/icons/download';
    import EllipsisIcon from '@lucide/svelte/icons/ellipsis';
    import { createRawSnippet } from 'svelte';

    const defaultData: HardwareAssetRecord[] = [
        {
            id: 'SCH-001',
            schoolName: 'GS Remera Catholique',
            province: 'Kigali',
            district: 'Gasabo',
            connection: 'Fiber',
            serverStatus: 'Active',
            totalDevices: 245,
            status: 'Healthy',
        },
        {
            id: 'SCH-002',
            schoolName: 'Lycee de Kigali',
            province: 'Kigali',
            district: 'Nyarugenge',
            connection: 'Fiber',
            serverStatus: 'Active',
            totalDevices: 412,
            status: 'Healthy',
        },
        {
            id: 'SCH-003',
            schoolName: 'GS Gicumbi',
            province: 'Northern',
            district: 'Gicumbi',
            connection: 'Fixed Wireless',
            serverStatus: 'Inactive',
            totalDevices: 120,
            status: 'Warning',
        },
        {
            id: 'SCH-004',
            schoolName: 'College St Andre',
            province: 'Kigali',
            district: 'Nyarugenge',
            connection: 'Fiber',
            serverStatus: 'Active',
            totalDevices: 350,
            status: 'Healthy',
        },
        {
            id: 'SCH-005',
            schoolName: 'GS Nyanza',
            province: 'Southern',
            district: 'Nyanza',
            connection: 'Cellular',
            serverStatus: 'Active',
            totalDevices: 85,
            status: 'Needs Attention',
        },
        {
            id: 'SCH-006',
            schoolName: 'TTC Rwamagana',
            province: 'Eastern',
            district: 'Rwamagana',
            connection: 'Fiber',
            serverStatus: 'Active',
            totalDevices: 180,
            status: 'Healthy',
        },
        {
            id: 'SCH-007',
            schoolName: 'GS Karongi',
            province: 'Western',
            district: 'Karongi',
            connection: 'Satellite',
            serverStatus: 'Inactive',
            totalDevices: 45,
            status: 'Critical',
        },
    ];

    interface Props {
        data?: HardwareAssetRecord[];
        currentPage?: number;
        totalPages?: number;
        totalItems?: number;
        pageSize?: number;
        onPageChange?: (page: number) => void;
        onExport?: () => void;
    }

    const {
        data = defaultData,
        currentPage = 1,
        totalPages = 3,
        totalItems = 452,
        pageSize = 7,
        onPageChange,
        onExport,
    }: Props = $props();

    let searchQuery = $state('');

    const filteredData = $derived(
        searchQuery
            ? data.filter(
                item =>
                    item.schoolName
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                        || item.province
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                        || item.district
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()),
            )
            : data,
    );

    const connectionStyles: Record<string, { bg: string; text: string }> = {
        'Fiber': { bg: 'bg-blue-500', text: 'text-white' },
        'Cellular': { bg: 'bg-gray-100', text: 'text-gray-700' },
        'Fixed Wireless': { bg: 'bg-gray-100', text: 'text-gray-700' },
        'Satellite': { bg: 'bg-gray-100', text: 'text-gray-700' },
    };

    const serverStyles: Record<string, { bg: string; text: string }> = {
        Active: { bg: 'bg-green-50', text: 'text-green-700' },
        Inactive: { bg: 'bg-red-50', text: 'text-red-600' },
    };

    const statusStyles: Record<string, { dot: string; text: string }> = {
        'Healthy': { dot: 'bg-green-500', text: 'text-green-600' },
        'Warning': { dot: 'bg-amber-500', text: 'text-amber-600' },
        'Needs Attention': { dot: 'bg-red-500', text: 'text-red-600' },
        'Critical': { dot: 'bg-red-500', text: 'text-red-600' },
    };

    const columns: ColumnDef<HardwareAssetRecord>[] = [
        {
            id: 'schoolName',
            accessorKey: 'schoolName',
            header: 'SCHOOL NAME & ID',
            cell: ({ row }) => {
                const snippet = createRawSnippet(() => ({
                    render: () => `
                        <div class="flex flex-col">
                            <span class="font-medium text-gray-900">${row.original.schoolName}</span>
                            <span class="text-xs text-gray-500">${row.original.id}</span>
                        </div>
                    `,
                }));
                return renderSnippet(snippet);
            },
        },
        {
            accessorKey: 'location',
            header: 'LOCATION',
            cell: ({ row }) => {
                const snippet = createRawSnippet(() => ({
                    render: () => `
                        <div class="flex flex-col">
                            <span class="text-gray-900">${row.original.province}</span>
                            <span class="text-xs text-gray-500">${row.original.district}</span>
                        </div>
                    `,
                }));
                return renderSnippet(snippet);
            },
        },
        {
            accessorKey: 'connection',
            header: 'CONNECTION',
            cell: ({ row }) => {
                const style
                    = connectionStyles[row.original.connection] || connectionStyles.Fiber;
                const snippet = createRawSnippet(() => ({
                    render: () =>
                        `<span class="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ${style.bg} ${style.text}">${row.original.connection}</span>`,
                }));
                return renderSnippet(snippet);
            },
        },
        {
            accessorKey: 'serverStatus',
            header: 'SERVERS',
            cell: ({ row }) => {
                const style
                    = serverStyles[row.original.serverStatus] || serverStyles.Active;
                const snippet = createRawSnippet(() => ({
                    render: () =>
                        `<span class="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ${style.bg} ${style.text}">${row.original.serverStatus}</span>`,
                }));
                return renderSnippet(snippet);
            },
        },
        {
            accessorKey: 'totalDevices',
            header: 'TOTAL DEVICES',
            cell: ({ row }) => row.original.totalDevices,
        },
        {
            accessorKey: 'status',
            header: 'STATUS',
            cell: ({ row }) => {
                const style = statusStyles[row.original.status] || statusStyles.Healthy;
                const snippet = createRawSnippet(() => ({
                    render: () => `
                        <div class="flex items-center gap-2">
                            <span class="w-2 h-2 rounded-full ${style.dot}"></span>
                            <span class="text-sm ${style.text}">${row.original.status}</span>
                        </div>
                    `,
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

<Card class='p-5 bg-white border border-gray-100 shadow-sm rounded-lg'>
    <!-- Header -->
    <div
        class='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4'
    >
        <div>
            <h3 class='text-lg font-semibold text-gray-900'>
                Hardware & Network Assets
            </h3>
            <p class='text-sm text-gray-500 mt-0.5'>
                Detailed inventory and connection status by school.
            </p>
        </div>
        <div class='flex items-center gap-3'>
            <div class='relative w-full sm:w-56'>
                <Search
                    class='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400'
                />
                <Input
                    type='text'
                    placeholder='Search schools...'
                    bind:value={searchQuery}
                    class='pl-9 bg-white rounded-lg placeholder:font-normal text-sm'
                />
            </div>
            <Button variant='outline' class='gap-2' onclick={onExport}>
                <DownloadIcon class='h-4 w-4' />
                Export
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
        <Pagination {currentPage} {totalPages} onPageChange={handlePageChange} />
    </div>
</Card>
