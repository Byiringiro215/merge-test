<script lang='ts'>
    import type { Group } from '$lib/datamodel/admin';
    import type { ColumnDef } from '@tanstack/table-core';
    import { api } from '$lib/api';
    import { ConfirmDialog } from '$lib/components/admin';
    import GroupFormDialog from '$lib/components/admin/GroupFormDialog.svelte';
    import GroupMembersDialog from '$lib/components/admin/GroupMembersDialog.svelte';
    import DataTable from '$lib/components/data-table/data-table.svelte';
    import AppLayout from '$lib/components/layout/AppLayout.svelte';

    import { Button } from '$lib/components/ui/button';
    import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle,
    } from '$lib/components/ui/card';
    import { renderSnippet } from '$lib/components/ui/data-table/index.js';
    import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
    import { Input } from '$lib/components/ui/input';
    import { groupListResponseSchema } from '$lib/types/api-schemas';
    import {
        Edit,
        LoaderCircle,
        MoreHorizontal,
        Plus,
        Search,
        Trash2,
        Users,
    } from '@lucide/svelte';
    import { createRawSnippet, onMount } from 'svelte';

    let groups = $state<Group[]>([]);
    let totalGroups = $state(0);
    let isLoading = $state(false);
    let searchQuery = $state('');

    // Dialog states
    let openGroupForm = $state(false);
    let editingGroup = $state<Group | null>(null);
    let openMemberDialog = $state(false);
    let membersGroup = $state<Group | null>(null);

    // Delete dialog state
    let deleteDialogOpen = $state(false);
    let deletingGroup = $state<Group | null>(null);
    let isDeleting = $state(false);

    const filteredGroups = $derived(
        searchQuery
            ? groups.filter(
                g =>
                    g.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                        || (g.description ?? '')
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()),
            )
            : groups,
    );

    const fetchGroups = async () => {
        isLoading = true;
        try {
            const result = await api.get('/iam/groups', {
                responseSchema: groupListResponseSchema,
            }).result();
            if (result.ok) {
                groups = result.data.groups;
                totalGroups = result.data.total;
            }
        }
        finally {
            isLoading = false;
        }
    };

    const handleOpenGroupDialog = (group?: Group) => {
        editingGroup = null;
        openGroupForm = true;
        if (group) {
            editingGroup = group;
        }
    };

    const openMembersDialog = (group: Group) => {
        membersGroup = group;
        openMemberDialog = true;
    };

    const openDeleteDialog = (group: Group) => {
        deletingGroup = group;
        deleteDialogOpen = true;
    };

    const handleDelete = async () => {
        if (!deletingGroup)
            return;
        isDeleting = true;
        try {
            await api.delete('/iam/groups/{id}', {
                params: { id: deletingGroup.id },
            }).result();
            deleteDialogOpen = false;
            deletingGroup = null;
            await fetchGroups();
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

    onMount(() => {
        fetchGroups();
    });
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
                <DropdownMenu.Item onclick={() => openMembersDialog(group)}>
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

<AppLayout containerClass='lg:pl-10 px-6'>
    <div
        class='mb-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'
    >
        <div>
            <h1 class='text-[24px] font-bold text-gray-900 leading-tight'>
                Groups Management
            </h1>
            <p class='mt-1 text-sm text-gray-500'>
                Organize users into groups for access control
            </p>
        </div>
        <Button onclick={() => handleOpenGroupDialog()}>
            <Plus class='mr-2 h-4 w-4' />
            Create Group
        </Button>
    </div>

    <Card class='py-10'>
        <CardHeader>
            <div class='flex items-center justify-between'>
                <div>
                    <CardTitle>Groups ({totalGroups})</CardTitle>
                    <CardDescription>
                        All user groups in the system.
                    </CardDescription>
                </div>
                <div class='relative w-64'>
                    <Search
                        class='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400'
                    />
                    <Input
                        type='text'
                        placeholder='Search groups...'
                        bind:value={searchQuery}
                        class='pl-10'
                    />
                </div>
            </div>
        </CardHeader>
        <CardContent class='py-5'>
            {#if isLoading}
                <div class='flex items-center justify-center py-12'>
                    <LoaderCircle class='h-8 w-8 animate-spin text-primary' />
                </div>
            {:else}
                <DataTable {columns} data={filteredGroups} />
            {/if}
        </CardContent>
    </Card>
</AppLayout>

<GroupFormDialog
    open={openGroupForm}
    group={editingGroup}
    onOpenChange={v => (openGroupForm = v)}
    onSuccess={fetchGroups}
/>

<GroupMembersDialog
    open={openMemberDialog}
    group={membersGroup}
    onOpenChange={v => (openMemberDialog = v)}
/>

<ConfirmDialog
    open={deleteDialogOpen}
    title='Delete Group'
    message='This will permanently delete this group and remove all member associations. This action cannot be undone.'
    isLoading={isDeleting}
    onOpenChange={v => (deleteDialogOpen = v)}
    onConfirm={handleDelete}
/>
