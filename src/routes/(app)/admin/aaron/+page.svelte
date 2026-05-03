<script lang='ts'>
    import type { User } from '$lib/datamodel/admin';
    import type { ColumnDef } from '@tanstack/table-core';
    import { goto } from '$app/navigation';
    import { page } from '$app/state';
    import { ConfirmDialog, StatusBadge } from '$lib/components/admin';
    import UserFormDialog from '$lib/components/admin/UserFormDialog.svelte';
    import DataTable from '$lib/components/data-table/data-table.svelte';
    import LoadingBar from '$lib/components/loading-bar/loading-bar.svelte';
    import { Button } from '$lib/components/ui/button';
    import { Checkbox } from '$lib/components/ui/checkbox';
    import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/index.js';
    import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
    import { Input } from '$lib/components/ui/input';
    import { Pagination } from '$lib/components/ui/pagination';
    import {
        ArrowDownAZ,
        ArrowUpAZ,
        Check,
        Edit,
        Filter,
        Key,
        MoreHorizontal,
        Plus,
        Search,
        Trash2,
    } from '@lucide/svelte';
    import { createRawSnippet, untrack } from 'svelte';
    import { deleteUser, fetchAllUsers } from './page.remote';

    const PAGE_SIZE = 10;
    const SORT_FIELDS = [
        { value: 'id', label: 'Default' },
        { value: 'name', label: 'Name' },
        { value: 'email', label: 'Email' },
        { value: 'createdAt', label: 'Joined date' },
    ] as const;

    const searchParams = $derived(page.url.searchParams);
    const currentPage = $derived(Math.max(1, Number(searchParams.get('page') ?? '1') || 1));
    const searchParam = $derived(searchParams.get('search') ?? '');
    const sortBy = $derived(searchParams.get('sortBy') ?? 'id');
    const sortDirection = $derived<'asc' | 'desc'>(
        searchParams.get('sortDirection') === 'asc' ? 'asc' : 'desc',
    );

    const queryArgs = $derived({
        limit: PAGE_SIZE,
        offset: (currentPage - 1) * PAGE_SIZE,
        ...(searchParam ? { search: searchParam } : {}),
        sortBy,
        sortDirection,
    });

    const usersQuery = $derived(fetchAllUsers(queryArgs));
    const users = $derived(usersQuery.current?.users ?? []);
    const totalUsers = $derived(usersQuery.current?.total ?? 0);
    const totalPages = $derived(Math.max(1, Math.ceil(totalUsers / PAGE_SIZE)));
    // loading state
    let isInitialLoad = $state(true);
    $effect(() => {
        if (!usersQuery.loading) {
            isInitialLoad = false;
        }
    });

    const showLoading = $derived(!isInitialLoad && usersQuery.loading);

    let searchInput = $state(untrack(() => searchParams.get('search') ?? ''));
    let searchDebounce: ReturnType<typeof setTimeout> | undefined;

    // Create/Edit dialog states
    let formDialogOpen = $state(false);
    let editingUser = $state<User | null>(null);

    // Delete dialog state
    let deleteDialogOpen = $state(false);
    let deletingUser = $state<User | null>(null);
    let isDeleting = $state(false);
    let deleteError = $state('');

    const updateSearchParamUrl = (updates: Record<string, string | null>) => {
        const url = new URL(page.url);
        for (const [key, value] of Object.entries(updates)) {
            if (value === null || value === '') {
                url.searchParams.delete(key);
            }
            else {
                url.searchParams.set(key, value);
            }
        }
        goto(`${url.pathname}${url.search}`, {
            replaceState: true,
            keepFocus: true,
            noScroll: true,
        });
    };

    function handleSearchInput() {
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(() => {
            updateSearchParamUrl({ search: searchInput.trim() || null, page: null });
        }, 300);
    }

    function handlePageChange(next: number) {
        updateSearchParamUrl({ page: next === 1 ? null : String(next) });
    }

    function handleSortFieldChange(field: string) {
        updateSearchParamUrl({ sortBy: field === 'id' ? null : field, page: null });
    }

    function handleSortDirectionChange(direction: 'asc' | 'desc') {
        updateSearchParamUrl({ sortDirection: direction === 'desc' ? null : direction, page: null });
    }

    const refetchUsers = async () => {
        await usersQuery.refresh();
    };

    const openUserDialog = (user?: User) => {
        editingUser = user ?? null;
        formDialogOpen = true;
    };

    const openDeleteDialog = (user: User) => {
        deletingUser = user;
        deleteError = '';
        deleteDialogOpen = true;
    };

    const handleDelete = async () => {
        if (!deletingUser)
            return;
        isDeleting = true;
        deleteError = '';
        try {
            await deleteUser({ id: deletingUser.id });
            await refetchUsers();
            deleteDialogOpen = false;
            deletingUser = null;
        }
        catch (err) {
            deleteError
                = err instanceof Error ? err.message : 'Failed to delete user';
        }
        finally {
            isDeleting = false;
        }
    };

    function getInitials(name: string): string {
        return name
            .split(' ')
            .map((n: string) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }

    function getAvatarColor(name: string): string {
        const colors = [
            'bg-gray-800',
            'bg-gray-500',
            'bg-red-500',
            'bg-blue-500',
            'bg-green-600',
            'bg-purple-500',
            'bg-orange-500',
            'bg-teal-500',
        ];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    }

    function formatDate(dateStr: string): string {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    }

    const columns: ColumnDef<User>[] = [
        {
            id: 'select',
            header: ({ table }) =>
                renderComponent(Checkbox, {
                    'checked': table.getIsAllPageRowsSelected(),
                    'indeterminate':
                        table.getIsSomePageRowsSelected()
                            && !table.getIsAllPageRowsSelected(),
                    'onCheckedChange': (value: boolean) => table.toggleAllPageRowsSelected(!!value),
                    'aria-label': 'Select all',
                }),
            cell: ({ row }) =>
                renderComponent(Checkbox, {
                    'checked': row.getIsSelected(),
                    'onCheckedChange': (value: boolean) => row.toggleSelected(!!value),
                    'aria-label': 'Select row',
                }),
            enableSorting: false,
            enableHiding: false,
            meta: { width: '40px' },
        },
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) =>
                renderSnippet(nameCell, { user: row.original }),
        },
        {
            accessorKey: 'email',
            header: 'Email',
            cell: ({ row }) => {
                const snippet = createRawSnippet(() => ({
                    render: () =>
                        `<span class="text-sm text-gray-600">${row.original.email}</span>`,
                }));
                return renderSnippet(snippet);
            },
        },
        {
            accessorKey: 'isActive',
            header: 'Status',
            cell: ({ row }) =>
                renderSnippet(statusCell, {
                    active: row.original.isActive,
                    emailVerified: row.original.emailVerified,
                }),
        },
        {
            accessorKey: 'createdAt',
            header: 'Joined',
            cell: ({ row }) => {
                const date = row.original.createdAt
                    ? formatDate(row.original.createdAt)
                    : '\u2014';
                const snippet = createRawSnippet(() => ({
                    render: () =>
                        `<span class="text-sm text-gray-500">${date}</span>`,
                }));
                return renderSnippet(snippet);
            },
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) =>
                renderSnippet(actionsCell, { user: row.original }),
        },
    ];
</script>

{#snippet nameCell({ user }: { user: User })}
    <div class='flex items-center gap-3'>
        <div
            class={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium text-white ${getAvatarColor(user.name)}`}
        >
            {getInitials(user.name)}
        </div>
        <span class='text-sm font-medium text-gray-900'>{user.name}</span>
    </div>
{/snippet}

{#snippet statusCell({ active, emailVerified }: { active: boolean; emailVerified?: boolean })}
    <StatusBadge {active} {emailVerified} />
{/snippet}

{#snippet actionsCell({ user }: { user: User })}
    <div class='text-right'>
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                {#snippet child({ props })}
                    <Button
                        {...props}
                        variant='ghost'
                        size='icon'
                        class='cursor-pointer'
                    >
                        <MoreHorizontal class='h-4 w-4' />
                    </Button>
                {/snippet}
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align='end' class='w-48'>
                <DropdownMenu.Item onclick={() => openUserDialog(user)}>
                    <Edit class='mr-2 h-4 w-4' />
                    Edit
                </DropdownMenu.Item>
                <DropdownMenu.Item
                    onclick={() => goto(`/admin/users/${user.id}/api-keys`)}
                >
                    <Key class='mr-2 h-4 w-4' />
                    API keys
                </DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item
                    class='text-destructive'
                    onclick={() => openDeleteDialog(user)}
                >
                    <Trash2 class='mr-2 h-4 w-4' />
                    Delete
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    </div>
{/snippet}

<LoadingBar visible={showLoading} />
<div class='sm:px-6 lg:px-10 pt-16   bg-[#FAFAFA] '>

    <div class='border px-5 py-6 lg:py-8  lg:px-7'>
        <div class='mb-10'>
            <h1 class='text-[24px] font-bold text-gray-900 leading-tight'>
                Users Management
            </h1>
            <p class='mt-1 text-sm text-gray-500'>
                Manage system users. View, create, update, and remove user accounts.
            </p>
        </div>
        <!-- Toolbar: Search + Filter + Create User -->
        <div
            class='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-5'
        >
            <div class='relative w-full sm:max-w-xs'>
                <Search
                    class='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400'
                />
                <Input
                    type='text'
                    placeholder='Search by email...'
                    bind:value={searchInput}
                    oninput={handleSearchInput}
                    class='pl-10 rounded'
                />
            </div>

            <div class='flex  justify-end items-center gap-3'>
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                        {#snippet child({ props })}
                            <Button {...props} variant='outline' class='gap-2 rounded'>
                                <Filter class='h-4 w-4' />
                                Filter
                            </Button>
                        {/snippet}
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content align='end' class='w-56'>
                        <DropdownMenu.Label>Sort direction</DropdownMenu.Label>
                        <DropdownMenu.Item onclick={() => handleSortDirectionChange('asc')}>
                            <ArrowUpAZ class='mr-2 h-4 w-4' />
                            Ascending
                            {#if sortDirection === 'asc'}
                                <Check class='ml-auto h-4 w-4' />
                            {/if}
                        </DropdownMenu.Item>
                        <DropdownMenu.Item onclick={() => handleSortDirectionChange('desc')}>
                            <ArrowDownAZ class='mr-2 h-4 w-4' />
                            Descending
                            {#if sortDirection === 'desc'}
                                <Check class='ml-auto h-4 w-4' />
                            {/if}
                        </DropdownMenu.Item>
                        <DropdownMenu.Separator />
                        <DropdownMenu.Label>Sort by</DropdownMenu.Label>
                        {#each SORT_FIELDS as field (field.value)}
                            <DropdownMenu.Item onclick={() => handleSortFieldChange(field.value)}>
                                {field.label}
                                {#if sortBy === field.value}
                                    <Check class='ml-auto h-4 w-4' />
                                {/if}
                            </DropdownMenu.Item>
                        {/each}
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
                <Button class='gap-2 text-xs rounded' onclick={() => openUserDialog()}>
                    <Plus class='h-3 w-3' />
                    Create User
                </Button>
            </div>
        </div>

        <DataTable {columns} data={users} />

        <div class='py-4'>
            <Pagination
                {currentPage}
                {totalPages}
                totalItems={totalUsers}
                pageSize={PAGE_SIZE}
                onPageChange={handlePageChange}
            />
        </div>
    </div>
</div>

<UserFormDialog
    open={formDialogOpen}
    user={editingUser}
    onOpenChange={(v: boolean) => (formDialogOpen = v)}
    onSuccess={refetchUsers}
/>

<ConfirmDialog
    open={deleteDialogOpen}
    message='This will permanently delete the user and all their associated data. This action cannot be undone.'
    isLoading={isDeleting}
    error={deleteError}
    onOpenChange={(v: boolean) => (deleteDialogOpen = v)}
    onConfirm={handleDelete}
/>
