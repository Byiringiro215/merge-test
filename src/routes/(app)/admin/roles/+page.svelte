<script lang='ts'>
    import type { Role } from '$lib/datamodel/admin';
    import type { ColumnDef } from '@tanstack/table-core';
    import { goto } from '$app/navigation';
    import { page } from '$app/state';
    import { ConfirmDialog } from '$lib/components/admin';
    import AddPermissionDialog from '$lib/components/admin/role/AddPermissionRoleDialog.svelte';
    import RoleBindingSheet from '$lib/components/admin/role/RoleBindingSheet.svelte';
    import RoleFormDialog from '$lib/components/admin/role/RoleFormDialog.svelte';
    import DataTable from '$lib/components/data-table/data-table.svelte';
    import LoadingBar from '$lib/components/loading-bar/loading-bar.svelte';
    import { Badge } from '$lib/components/ui/badge';
    import { Button } from '$lib/components/ui/button';
    import { renderSnippet } from '$lib/components/ui/data-table/index.js';
    import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
    import { Input } from '$lib/components/ui/input';
    import {
        MoreHorizontal,
        Pencil,
        Plus,
        Search,
        Shield,
        Trash2,
        Users,
    } from '@lucide/svelte';
    import { createRawSnippet, untrack } from 'svelte';
    import { deleteRole, fetchAllRoles } from './role.remote';

    const searchParams = $derived(page.url.searchParams);
    const searchParam = $derived(searchParams.get('search') ?? '');

    const rolesQuery = $derived(fetchAllRoles());
    const roles = $derived(rolesQuery.current ?? []);

    // loading state
    let isInitialLoad = $state(true);
    $effect(() => {
        if (!rolesQuery.loading) {
            isInitialLoad = false;
        }
    });

    const showLoading = $derived(!isInitialLoad && rolesQuery.loading);

    const filteredRoles = $derived(
        searchParam
            ? roles.filter(
                (r: Role) =>
                    r.name
                        .toLowerCase()
                        .includes(searchParam.toLowerCase())
                        || (r.description ?? '')
                            .toLowerCase()
                            .includes(searchParam.toLowerCase()),
            )
            : roles,
    );

    let searchInput = $state(untrack(() => searchParams.get('search') ?? ''));
    let searchDebounce: ReturnType<typeof setTimeout> | undefined;

    // Sheet states
    let openRoleDialog = $state(false);
    let editingRole = $state<Role | null>(null);
    let bindingSheetOpen = $state(false);
    let bindingRole = $state<Role | null>(null);
    let addPermissionDialogOpen = $state(false);
    let addPermissionRole = $state<Role | null>(null);

    // Delete dialog state
    let deleteDialogOpen = $state(false);
    let deletingRole = $state<Role | null>(null);
    let isDeleting = $state(false);
    let deleteError = $state('');

    function updateUrl(updates: Record<string, string | null>) {
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
            updateUrl({ search: searchInput.trim() || null });
        }, 300);
    }

    const refetchRoles = async () => {
        await rolesQuery.refresh();
    };

    const handleOpenRole = (role?: Role) => {
        editingRole = role ?? null;
        openRoleDialog = true;
    };

    const openBindingSheet = (role: Role) => {
        bindingRole = role;
        bindingSheetOpen = true;
    };

    const openAddPermissionDialog = (role: Role) => {
        addPermissionRole = role;
        addPermissionDialogOpen = true;
    };

    const openDeleteDialog = (role: Role) => {
        deletingRole = role;
        deleteError = '';
        deleteDialogOpen = true;
    };

    const handleDelete = async () => {
        if (!deletingRole)
            return;
        isDeleting = true;
        deleteError = '';
        try {
            await deleteRole({ id: deletingRole.id });
            await refetchRoles();
            deleteDialogOpen = false;
            deletingRole = null;
        }
        catch (err) {
            deleteError
                = err instanceof Error ? err.message : 'Failed to delete role';
        }
        finally {
            isDeleting = false;
        }
    };

    const columns: ColumnDef<Role>[] = [
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
                const desc = row.original.description ?? '\u2014';
                const snippet = createRawSnippet(() => ({
                    render: () =>
                        `<span class="text-sm text-muted-foreground">${desc}</span>`,
                }));
                return renderSnippet(snippet);
            },
        },
        {
            accessorKey: 'isSystem',
            header: 'Type',
            cell: ({ row }) =>
                renderSnippet(typeCell, {
                    isSystem: row.original.isSystem ?? false,
                }),
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) =>
                renderSnippet(actionsCell, { role: row.original }),
        },
    ];
</script>

{#snippet typeCell({ isSystem }: { isSystem: boolean })}
    {#if isSystem}
        <Badge variant='secondary'>System</Badge>
    {:else}
        <Badge variant='outline'>Custom</Badge>
    {/if}
{/snippet}

{#snippet actionsCell({ role }: { role: Role })}
    <div class='text-right'>
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                {#snippet child({ props })}
                    <Button
                        {...props}
                        variant='ghost'
                        size='icon'
                        class='h-8 w-8 cursor-pointer'
                    >
                        <MoreHorizontal class='h-4 w-4' />
                    </Button>
                {/snippet}
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align='end' class='w-48'>
                <DropdownMenu.Item
                    onclick={() => handleOpenRole(role)}
                    disabled={role.isSystem}
                >
                    <Pencil class='mr-2 h-4 w-4' />
                    Edit
                </DropdownMenu.Item>
                <DropdownMenu.Item onclick={() => openBindingSheet(role)}>
                    <Users class='mr-2 h-4 w-4' />
                    Manage assignments
                </DropdownMenu.Item>
                <DropdownMenu.Item
                    onclick={() => openAddPermissionDialog(role)}
                >
                    <Shield class='mr-2 h-4 w-4' />
                    Add permission
                </DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item
                    class='text-destructive'
                    onclick={() => openDeleteDialog(role)}
                    disabled={role.isSystem}
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
                Roles Management
            </h1>
            <p class='mt-1 text-sm text-gray-500'>
                Manage roles, assign them to users or groups, and control role permissions.
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
                    placeholder='Search roles...'
                    bind:value={searchInput}
                    oninput={handleSearchInput}
                    class='pl-10 rounded'
                />
            </div>

            <Button class='gap-2 rounded' onclick={() => handleOpenRole()}>
                <Plus class='h-4 w-4' />
                Create Role
            </Button>
        </div>

        <DataTable {columns} data={filteredRoles} />
    </div>
</div>

<RoleFormDialog
    open={openRoleDialog}
    role={editingRole}
    onOpenChange={(v: boolean) => (openRoleDialog = v)}
    onSuccess={refetchRoles}
/>

<RoleBindingSheet
    open={bindingSheetOpen}
    role={bindingRole}
    onOpenChange={(v: boolean) => (bindingSheetOpen = v)}
/>

<AddPermissionDialog
    open={addPermissionDialogOpen}
    role={addPermissionRole}
    onOpenChange={(v: boolean) => (addPermissionDialogOpen = v)}
    onSuccess={refetchRoles}
/>

<ConfirmDialog
    open={deleteDialogOpen}
    message='This will permanently delete this role and remove all its bindings. This action cannot be undone.'
    isLoading={isDeleting}
    error={deleteError}
    onOpenChange={(v: boolean) => (deleteDialogOpen = v)}
    onConfirm={handleDelete}
/>
