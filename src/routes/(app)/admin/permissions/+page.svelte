<script lang='ts'>
    import type { PermissionRes as Permission } from '$lib/datamodel/admin';
    import type { ColumnDef } from '@tanstack/table-core';
    import { goto } from '$app/navigation';
    import { page } from '$app/state';
    import { ConfirmDialog } from '$lib/components/admin';
    import PermissionFormSheet from '$lib/components/admin/PermissionFormSheet.svelte';
    import DataTable from '$lib/components/data-table/data-table.svelte';
    import LoadingBar from '$lib/components/loading-bar/loading-bar.svelte';
    import { Badge } from '$lib/components/ui/badge';
    import { Button } from '$lib/components/ui/button';
    import { renderSnippet } from '$lib/components/ui/data-table/index.js';
    import { Input } from '$lib/components/ui/input';
    import { Plus, Search, Trash2 } from '@lucide/svelte';
    import { createRawSnippet, untrack } from 'svelte';
    import { deletePermission, fetchAllPermissions } from './permission.remote';

    const searchParams = $derived(page.url.searchParams);
    const resourceParam = $derived(searchParams.get('resource') ?? '');

    const queryArgs = $derived(resourceParam ? { resource: resourceParam } : {});
    const permissionsQuery = $derived(fetchAllPermissions(queryArgs));
    const permissions = $derived(permissionsQuery.current ?? []);

    // loading state
    let isInitialLoad = $state(true);
    $effect(() => {
        if (!permissionsQuery.loading) {
            isInitialLoad = false;
        }
    });

    const showLoading = $derived(!isInitialLoad && permissionsQuery.loading);

    let searchInput = $state(untrack(() => searchParams.get('resource') ?? ''));
    let searchDebounce: ReturnType<typeof setTimeout> | undefined;

    // Sheet state
    let formSheetOpen = $state(false);

    // Delete dialog state
    let deleteDialogOpen = $state(false);
    let deletingPermission = $state<Permission | null>(null);
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

    const handleSearchInput = () => {
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(() => {
            updateSearchParamUrl({ resource: searchInput.trim() || null });
        }, 300);
    };

    const refetchPermissions = async () => {
        await permissionsQuery.refresh();
    };

    const openDeleteDialog = (permission: Permission) => {
        deletingPermission = permission;
        deleteError = '';
        deleteDialogOpen = true;
    };

    const handleDelete = async () => {
        if (!deletingPermission)
            return;
        isDeleting = true;
        deleteError = '';
        try {
            await deletePermission({ id: deletingPermission.id });
            await refetchPermissions();
            deleteDialogOpen = false;
            deletingPermission = null;
        }
        catch (err) {
            deleteError
                = err instanceof Error ? err.message : 'Failed to delete permission';
        }
        finally {
            isDeleting = false;
        }
    };

    const columns: ColumnDef<Permission>[] = [
        {
            accessorKey: 'resource',
            header: 'Resource',
            cell: ({ row }) => {
                const snippet = createRawSnippet(() => ({
                    render: () =>
                        `<span class="font-medium font-mono text-sm">${row.original.resource}</span>`,
                }));
                return renderSnippet(snippet);
            },
        },
        {
            accessorKey: 'action',
            header: 'Action',
            cell: ({ row }) => {
                const snippet = createRawSnippet(() => ({
                    render: () =>
                        `<span class="font-mono text-sm">${row.original.action}</span>`,
                }));
                return renderSnippet(snippet);
            },
        },
        {
            accessorKey: 'effect',
            header: 'Effect',
            cell: ({ row }) =>
                renderSnippet(effectCell, { effect: row.original.effect }),
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
                renderSnippet(actionsCell, { permission: row.original }),
        },
    ];
</script>

{#snippet effectCell({ effect }: { effect: 'ALLOW' | 'DENY' })}
    {#if effect === 'ALLOW'}
        <Badge
            class='bg-green-100 text-green-800 hover:bg-green-100'
            variant='outline'
        >
            Allow
        </Badge>
    {:else}
        <Badge variant='destructive'>Deny</Badge>
    {/if}
{/snippet}

{#snippet actionsCell({ permission }: { permission: Permission })}
    <div class='text-right'>
        <Button
            variant='ghost'
            size='icon'
            class='text-destructive hover:text-destructive cursor-pointer'
            onclick={() => openDeleteDialog(permission)}
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
                Permissions Management
            </h1>
            <p class='mt-1 text-sm text-gray-500'>
                Define resource-action permission rules
            </p>
        </div>
        <div
            class='flex flex-col gap-3 sm:flex-row justify-end items-end sm:items-center sm:justify-between pb-5'
        >
            <div class='relative w-full sm:max-w-xs'>
                <Search
                    class='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400'
                />
                <Input
                    type='text'
                    placeholder='Search by resource...'
                    bind:value={searchInput}
                    oninput={handleSearchInput}
                    class='pl-10 rounded'
                />
            </div>
            <Button class='rounded' onclick={() => (formSheetOpen = true)}>
                <Plus class='mr-2 h-4 w-4' />
                Create Permission
            </Button>
        </div>

        <DataTable {columns} data={permissions} />
    </div>
</div>

<PermissionFormSheet
    open={formSheetOpen}
    onOpenChange={v => (formSheetOpen = v)}
    onSuccess={refetchPermissions}
/>

<ConfirmDialog
    open={deleteDialogOpen}
    message='This will permanently delete this permission. Any roles or users using it will lose this access rule.'
    isLoading={isDeleting}
    error={deleteError}
    onOpenChange={v => (deleteDialogOpen = v)}
    onConfirm={handleDelete}
/>
