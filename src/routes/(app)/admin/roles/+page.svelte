<script lang='ts'>
    import type { Role } from '$lib/datamodel/admin';
    import type { ColumnDef } from '@tanstack/table-core';
    import { api } from '$lib/api';
    import { ConfirmDialog } from '$lib/components/admin';
    import RoleBindingSheet from '$lib/components/admin/RoleBindingSheet.svelte';
    import RoleFormDialog from '$lib/components/admin/RoleFormDialog.svelte';
    import DataTable from '$lib/components/data-table/data-table.svelte';
    import AppLayout from '$lib/components/layout/AppLayout.svelte';
    import { Badge } from '$lib/components/ui/badge';
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
    import { roleListResponseSchema } from '$lib/types/zod-schemas-api';
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

    let roles = $state<Role[]>([]);
    let isLoading = $state(false);
    let searchQuery = $state('');

    // Sheet states
    let openRoleDialog = $state(false);
    let editingRole = $state<Role | null>(null);
    let bindingSheetOpen = $state(false);
    let bindingRole = $state<Role | null>(null);

    // Delete dialog state
    let deleteDialogOpen = $state(false);
    let deletingRole = $state<Role | null>(null);
    let isDeleting = $state(false);

    const filteredRoles = $derived(
        searchQuery
            ? roles.filter(
                r =>
                    r.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                        || (r.description ?? '')
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()),
            )
            : roles,
    );

    const fetchRoles = async () => {
        isLoading = true;
        try {
            const result = await api.get('/iam/roles', {
                responseSchema: roleListResponseSchema,
            }).result();
            if (result.ok) {
                roles = result.data;
            }
        }
        finally {
            isLoading = false;
        }
    };

    const handleOpenRole = (role?: Role) => {
        editingRole = null;
        openRoleDialog = true;
        if (role) {
            editingRole = role;
        }
    };

    const openBindingSheet = (role: Role) => {
        bindingRole = role;
        bindingSheetOpen = true;
    };

    const openDeleteDialog = (role: Role) => {
        deletingRole = role;
        deleteDialogOpen = true;
    };

    const handleDelete = async () => {
        if (!deletingRole)
            return;
        isDeleting = true;
        try {
            await api.delete('/iam/roles/{id}', {
                params: { id: deletingRole.id },
            }).result();
            deleteDialogOpen = false;
            deletingRole = null;
            await fetchRoles();
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
                const desc = row.original.description ?? '—';
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
            header: '',
            cell: ({ row }) =>
                renderSnippet(actionsCell, { role: row.original }),
        },
    ];

    onMount(() => {
        fetchRoles();
    });
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
                        class='cursor-pointer'
                    >
                        <MoreHorizontal class='h-4 w-4' />
                    </Button>
                {/snippet}
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align='end'>
                <DropdownMenu.Item
                    onclick={() => handleOpenRole(role)}
                    disabled={role.isSystem}
                >
                    <Edit class='mr-2 h-4 w-4' />
                    Edit
                </DropdownMenu.Item>
                <DropdownMenu.Item onclick={() => openBindingSheet(role)}>
                    <Users class='mr-2 h-4 w-4' />
                    Manage Bindings
                </DropdownMenu.Item>
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

<AppLayout containerClass='lg:pl-10 px-6'>
    <div
        class='mb-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'
    >
        <div>
            <h1 class='text-[24px] font-bold text-gray-900 leading-tight'>
                Roles Management
            </h1>
            <p class='mt-1 text-sm text-gray-500'>
                Define and manage access roles
            </p>
        </div>
        <Button onclick={() => handleOpenRole()}>
            <Plus class='mr-2 h-4 w-4' />
            Create Role
        </Button>
    </div>

    <Card class='py-10'>
        <CardHeader>
            <div class='flex items-center justify-between'>
                <div>
                    <CardTitle>Roles ({roles.length})</CardTitle>
                    <CardDescription>
                        All roles available in the system.
                    </CardDescription>
                </div>
                <div class='relative w-64'>
                    <Search
                        class='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400'
                    />
                    <Input
                        type='text'
                        placeholder='Search roles...'
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
                <DataTable {columns} data={filteredRoles} />
            {/if}
        </CardContent>
    </Card>
</AppLayout>

<RoleFormDialog
    open={openRoleDialog}
    role={editingRole}
    onOpenChange={v => (openRoleDialog = v)}
    onSuccess={fetchRoles}
/>

<RoleBindingSheet
    open={bindingSheetOpen}
    role={bindingRole}
    onOpenChange={v => (bindingSheetOpen = v)}
/>

<ConfirmDialog
    open={deleteDialogOpen}
    message='This will permanently delete this role and remove all its bindings. This action cannot be undone.'
    isLoading={isDeleting}
    onOpenChange={v => (deleteDialogOpen = v)}
    onConfirm={handleDelete}
/>
