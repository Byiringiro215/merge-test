<script lang='ts'>
    import type { User } from '$lib/datamodel/admin';
    import type { ColumnDef } from '@tanstack/table-core';
    import { page } from '$app/state';
    import { ConfirmDialog } from '$lib/components/admin';
    import AddGroupMemberDialog from '$lib/components/admin/AddGroupMemberDialog.svelte';
    import DataTable from '$lib/components/data-table/data-table.svelte';
    import LoadingBar from '$lib/components/loading-bar/loading-bar.svelte';
    import { Button } from '$lib/components/ui/button';
    import { renderSnippet } from '$lib/components/ui/data-table/index.js';
    import { Plus, Trash2 } from '@lucide/svelte';
    import { createRawSnippet } from 'svelte';
    import {
        fetchGroupWithMembers,
        removeGroupMember,
    } from '../group.remote';

    const groupId = $derived(Number(page.params.id));

    const groupQuery = $derived(fetchGroupWithMembers(groupId));
    const group = $derived(groupQuery.current);
    const members = $derived<User[]>((group?.users ?? []) as User[]);
    const existingMemberIds = $derived(members.map(m => m.id));

    // loading state
    let isInitialLoad = $state(true);
    $effect(() => {
        if (!groupQuery.loading) {
            isInitialLoad = false;
        }
    });

    const showLoading = $derived(!isInitialLoad && groupQuery.loading);

    // Add dialog
    let addDialogOpen = $state(false);

    // Remove dialog
    let removeDialogOpen = $state(false);
    let removingMember = $state<User | null>(null);
    let isRemoving = $state(false);
    let removeError = $state('');

    const refetchGroup = async () => {
        await groupQuery.refresh();
    };

    const openRemoveDialog = (member: User) => {
        removingMember = member;
        removeError = '';
        removeDialogOpen = true;
    };

    const handleRemove = async () => {
        if (!removingMember)
            return;
        isRemoving = true;
        removeError = '';
        try {
            await removeGroupMember({
                id: groupId,
                userId: removingMember.id,
            });
            await refetchGroup();
            removeDialogOpen = false;
            removingMember = null;
        }
        catch (err) {
            removeError
                = err instanceof Error ? err.message : 'Failed to remove member';
        }
        finally {
            isRemoving = false;
        }
    };

    const columns: ColumnDef<User>[] = [
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
            accessorKey: 'email',
            header: 'Email',
            cell: ({ row }) => {
                const snippet = createRawSnippet(() => ({
                    render: () =>
                        `<span class="text-sm text-muted-foreground">${row.original.email}</span>`,
                }));
                return renderSnippet(snippet);
            },
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) =>
                renderSnippet(actionsCell, { member: row.original }),
        },
    ];
</script>

{#snippet actionsCell({ member }: { member: User })}
    <div class='text-right'>
        <Button
            variant='ghost'
            size='icon'
            class='text-destructive hover:text-destructive cursor-pointer'
            onclick={() => openRemoveDialog(member)}
        >
            <Trash2 class='h-4 w-4' />
        </Button>
    </div>
{/snippet}

<LoadingBar visible={showLoading} />
<div class='sm:px-6 lg:px-10 pt-16   bg-[#FAFAFA] '>

    <div class='border px-5 py-6 lg:py-8 lg:px-7'>
        <div class='mb-10'>
            <h1 class='text-[24px] font-bold text-gray-900 leading-tight'>
                {group?.name ?? 'Group'}
            </h1>
            <p class='mt-1 text-sm text-gray-500'>
                {group?.description ?? 'Manage members of this group.'}
            </p>
        </div>

        <div
            class='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-5'
        >
            <h2 class='text-sm font-medium text-gray-700'>
                Members ({members.length})
            </h2>
            <Button
                class='gap-2 rounded'
                onclick={() => (addDialogOpen = true)}
            >
                <Plus class='h-4 w-4' />
                Add Member
            </Button>
        </div>

        <DataTable {columns} data={members} />
    </div>
</div>

<AddGroupMemberDialog
    open={addDialogOpen}
    groupId={groupId}
    {existingMemberIds}
    onOpenChange={v => (addDialogOpen = v)}
    onSuccess={refetchGroup}
/>

<ConfirmDialog
    open={removeDialogOpen}
    title='Remove member'
    message='This will remove the selected user from this group.'
    confirmLabel='Remove'
    isLoading={isRemoving}
    error={removeError}
    onOpenChange={v => (removeDialogOpen = v)}
    onConfirm={handleRemove}
/>
