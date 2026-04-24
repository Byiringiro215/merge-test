<script lang='ts'>
    import type { Group } from '$lib/datamodel/admin';
    import type { ColumnDef } from '@tanstack/table-core';
    import { goto } from '$app/navigation';
    import { page } from '$app/state';
    import { ConfirmDialog } from '$lib/components/admin';
    import GroupFormDialog from '$lib/components/admin/GroupFormDialog.svelte';
    import DataTable from '$lib/components/data-table/data-table.svelte';
    import LoadingBar from '$lib/components/loading-bar/loading-bar.svelte';

    import { Button } from '$lib/components/ui/button';
    import { renderSnippet } from '$lib/components/ui/data-table/index.js';
    import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
    import { Input } from '$lib/components/ui/input';
    import { Pagination } from '$lib/components/ui/pagination';
    import {
        Edit,
        MoreHorizontal,
        Plus,
        Search,
        Trash2,
        Users,
    } from '@lucide/svelte';
    import { createRawSnippet, untrack } from 'svelte';
    import { deleteGroup, fetchAllGroups } from './group.remote';

    const PAGE_SIZE = 10;

    const searchParams = $derived(page.url.searchParams);
    const currentPage = $derived(Math.max(1, Number(searchParams.get('page') ?? '1') || 1));
    const searchParam = $derived(searchParams.get('search') ?? '');

    const queryArgs = $derived({
        limit: PAGE_SIZE,
        offset: (currentPage - 1) * PAGE_SIZE,
    });

    const groupsQuery = $derived(fetchAllGroups(queryArgs));
    const groups = $derived(groupsQuery.current?.groups ?? []);
    const totalGroups = $derived(groupsQuery.current?.total ?? 0);
    const totalPages = $derived(Math.max(1, Math.ceil(totalGroups / PAGE_SIZE)));

    // loading state
    let isInitialLoad = $state(true);
    $effect(() => {
        if (!groupsQuery.loading) {
            isInitialLoad = false;
        }
    });

    const showLoading = $derived(!isInitialLoad && groupsQuery.loading);

    // client side group search server side to be implemented
    const filteredGroups = $derived(
        searchParam
            ? groups.filter(
                (g: Group) =>
                    g.name
                        .toLowerCase()
                        .includes(searchParam.toLowerCase())
                        || (g.description ?? '')
                            .toLowerCase()
                            .includes(searchParam.toLowerCase()),
            )
            : groups,
    );

    let searchInput = $state(untrack(() => searchParams.get('search') ?? ''));
    let searchDebounce: ReturnType<typeof setTimeout> | undefined;

    // Dialog states
    let openGroupForm = $state(false);
    let editingGroup = $state<Group | null>(null);

    // Delete dialog state
    let deleteDialogOpen = $state(false);
    let deletingGroup = $state<Group | null>(null);
    let isDeleting = $state(false);
    let deleteError = $state('');

    function updateSearchParamUrl(updates: Record<string, string | null>) {
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
    }

    function handleSearchInput() {
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(() => {
            updateSearchParamUrl({ search: searchInput.trim() || null });
        }, 300);
    }

    function handlePageChange(next: number) {
        updateSearchParamUrl({ page: next === 1 ? null : String(next) });
    }

    const refetchGroups = async () => {
        await groupsQuery.refresh();
    };

    const handleOpenGroupDialog = (group?: Group) => {
        editingGroup = group ?? null;
        openGroupForm = true;
    };

    const openDeleteDialog = (group: Group) => {
        deletingGroup = group;
        deleteError = '';
        deleteDialogOpen = true;
    };

    const handleDelete = async () => {
        if (!deletingGroup)
            return;
        isDeleting = true;
        deleteError = '';
        try {
            await deleteGroup({ id: deletingGroup.id });
            await refetchGroups();
            deleteDialogOpen = false;
            deletingGroup = null;
        }
        catch (err) {
            deleteError
                = err instanceof Error ? err.message : 'Failed to delete group';
        }
        finally {
            isDeleting = false;
        }
    };

    const columns: ColumnDef<Group>[] = [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => {
                const snippet = createRawSnippet(() => ({
                    render: () =>
                        `<span class="font-medium text-sm">${row.original.name}</span>`,
                }));
                return renderSnippet(snippet);
            },
        },
        {
            accessorKey: 'description',
            header: 'Description',
            cell: ({ row }) => {
                const desc = row.original.description ?? '—';
                const snippet = createRawSnippet(() => ({
                    render: () =>
                        `<span class="text-sm text-muted-foreground">${desc}</span>`,
                }));
                return renderSnippet(snippet);
            },
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) =>
                renderSnippet(actionsCell, { group: row.original }),
        },
    ];
</script>

{#snippet actionsCell({ group }: { group: Group })}
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
            <DropdownMenu.Content align='end'>
                <DropdownMenu.Item onclick={() => goto(`/admin/groups/${group.id}`)}>
                    <Users class='mr-2 h-4 w-4' />
                    Manage Members
                </DropdownMenu.Item>
                <DropdownMenu.Item onclick={() => handleOpenGroupDialog(group)}>
                    <Edit class='mr-2 h-4 w-4' />
                    Edit
                </DropdownMenu.Item>
                <DropdownMenu.Item
                    class='text-destructive'
                    onclick={() => openDeleteDialog(group)}
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

    <div class='border px-5 py-6 lg:py-8 lg:px-7'>
        <div class='mb-10'>
            <h1 class='text-[24px] font-bold text-gray-900 leading-tight'>
                Groups Management
            </h1>
            <p class='mt-1 text-sm text-gray-500'>
                Create and manage groups, and add or remove members.
            </p>
        </div>

        <div
            class='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-5'
        >
            <div class='relative w-full sm:max-w-xs'>
                <Search
                    class='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400'
                />
                <Input
                    type='text'
                    placeholder='Search groups...'
                    bind:value={searchInput}
                    oninput={handleSearchInput}
                    class='pl-10 rounded'
                />
            </div>
            <Button class='gap-2 rounded' onclick={() => handleOpenGroupDialog()}>
                <Plus class='h-3 w-3' />
                Create Group
            </Button>
        </div>

        <DataTable {columns} data={filteredGroups} />

        <div class='py-4'>
            <Pagination
                {currentPage}
                {totalPages}
                totalItems={totalGroups}
                pageSize={PAGE_SIZE}
                onPageChange={handlePageChange}
            />
        </div>
    </div>
</div>

<GroupFormDialog
    open={openGroupForm}
    group={editingGroup}
    onOpenChange={v => (openGroupForm = v)}
    onSuccess={refetchGroups}
/>

<ConfirmDialog
    open={deleteDialogOpen}
    title='Delete Group'
    message='This will permanently delete this group and remove all member associations. This action cannot be undone.'
    isLoading={isDeleting}
    error={deleteError}
    onOpenChange={v => (deleteDialogOpen = v)}
    onConfirm={handleDelete}
/>
