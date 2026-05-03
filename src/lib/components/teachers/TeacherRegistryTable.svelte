<script lang='ts'>
    import type { StaffSummary } from '$lib/datamodel/staff';
    import type { ColumnDef } from '@tanstack/table-core';
    import { goto } from '$app/navigation';

    import DataTable from '$lib/components/data-table/data-table.svelte';
    import { Button } from '$lib/components/ui/button/index.js';
    import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle,
    } from '$lib/components/ui/card';
    import { renderSnippet } from '$lib/components/ui/data-table/index.js';
    import { Input } from '$lib/components/ui/input';
    import Pagination from '$lib/components/ui/pagination/pagination.svelte';
    import { Eye, Search } from '@lucide/svelte';
    import { createRawSnippet } from 'svelte';

    interface Props {
        staff: StaffSummary[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize: number;
        isLoading?: boolean;
        onPageChange: (page: number) => void;
    }

    const {
        staff,
        currentPage,
        totalPages,
        totalItems,
        pageSize,
        isLoading = false,
        onPageChange,
    }: Props = $props();

    let searchQuery = $state('');

    // Client-side filtering for search
    const filteredStaff = $derived(
        searchQuery
            ? staff.filter(
                s =>
                    s.names
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                        || s.schoolName
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                        || (s.position ?? '')
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()),
            )
            : staff,
    );

    function handlePageChange(page: number) {
        onPageChange(page);
    }

    function getInitials(name: string): string {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }

    function getGenderColor(gender: string | null): string {
        switch (gender?.toUpperCase()) {
            case 'MALE':
                return 'bg-sky-500';
            case 'FEMALE':
                return 'bg-pink-500';
            default:
                return 'bg-gray-500';
        }
    }

    const columns: ColumnDef<StaffSummary>[] = [
        {
            id: 'profile',
            accessorKey: 'names',
            header: 'Staff Member',
            cell: ({ row }) => {
                const member = row.original;
                const initials = getInitials(member.names);
                const avatarColor = getGenderColor(member.gender);
                const snippet = createRawSnippet(() => ({
                    render: () => `
            <div class="flex items-center gap-3">
              <div class="h-9 w-9 rounded-full ${avatarColor} flex items-center justify-center text-white font-medium text-sm shrink-0">
                ${initials}
              </div>
              <div>
                <div class="font-medium text-sm text-gray-900">${member.names}</div>
                <div class="text-xs text-gray-500 font-mono">${member.staffNumber}</div>
              </div>
            </div>
          `,
                }));
                return renderSnippet(snippet);
            },
        },
        {
            accessorKey: 'position',
            header: 'Position',
            cell: ({ row }) => {
                const position = row.original.position ?? '-';
                const snippet = createRawSnippet(() => ({
                    render: () =>
                        `<span class="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">${position}</span>`,
                }));
                return renderSnippet(snippet);
            },
        },
        {
            accessorKey: 'schoolName',
            header: 'School',
            cell: ({ row }) => {
                const snippet = createRawSnippet(() => ({
                    render: () => `
            <div class="flex items-center gap-1.5">
              <svg class="h-4 w-4 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span class="text-sm text-gray-700">${row.original.schoolName}</span>
            </div>
          `,
                }));
                return renderSnippet(snippet);
            },
        },
        {
            accessorKey: 'schoolCode',
            header: 'School Code',
            cell: ({ row }) => {
                const snippet = createRawSnippet(() => ({
                    render: () =>
                        `<span class="font-mono text-xs text-gray-600">${row.original.schoolCode}</span>`,
                }));
                return renderSnippet(snippet);
            },
        },
        {
            accessorKey: 'gender',
            header: 'Gender',
            cell: ({ row }) => {
                const gender = row.original.gender ?? '-';
                const isMale = gender.toUpperCase() === 'MALE';
                const bgColor = isMale ? 'bg-sky-100' : 'bg-pink-100';
                const textColor = isMale ? 'text-sky-700' : 'text-pink-700';
                const snippet = createRawSnippet(() => ({
                    render: () =>
                        `<span class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${bgColor} ${textColor}">${gender}</span>`,
                }));
                return renderSnippet(snippet);
            },
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) =>
                renderSnippet(rowAction, { member: row.original }),
        },
    ];
</script>

{#snippet rowAction({ member }: { member: StaffSummary })}
    <Button
        variant='ghost'
        size='icon'
        class='shrink-0 cursor-pointer'
        onclick={() => goto(`/teachers/${member.staffNumber}`)}
    >
        <Eye class='h-4 w-4' />
    </Button>
{/snippet}

<Card class='border-none!'>
    <CardHeader class='p-4 lg:p-6'>
        <div
            class='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'
        >
            <div>
                <CardTitle class='text-lg font-semibold'
                >Staff Registry</CardTitle
                >
                <CardDescription>
                    Detailed records for staff members across monitored schools
                </CardDescription>
            </div>
            <div class='relative w-full sm:w-72'>
                <Search
                    class='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400'
                />
                <Input
                    type='text'
                    placeholder='Search name, school or position...'
                    bind:value={searchQuery}
                    class='pl-9'
                />
            </div>
        </div>
    </CardHeader>
    <CardContent class='p-0'>
        <div class='overflow-x-auto'>
            {#if isLoading}
                <div class='flex items-center justify-center py-12'>
                    <div
                        class='h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary'
                    ></div>
                </div>
            {:else}
                <DataTable {columns} data={filteredStaff} />
            {/if}
        </div>
        <!-- Pagination -->
        <div class='border-t pt-3 px-4 lg:px-6 pb-3'>
            <Pagination
                {currentPage}
                {totalPages}
                onPageChange={handlePageChange}
                {totalItems}
                {pageSize}
            />
        </div>
    </CardContent>
</Card>
