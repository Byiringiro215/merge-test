<script lang='ts'>
    import type { Permission } from '$lib/datamodel/admin';
    import type { ColumnDef } from '@tanstack/table-core';
    import { api } from '$lib/api';
    import { ConfirmDialog } from '$lib/components/admin';
    import PermissionFormSheet from '$lib/components/admin/PermissionFormSheet.svelte';
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
    import { Input } from '$lib/components/ui/input';
    import { permissionListResponseSchema } from '$lib/types/zod-schemas-api';
    import { LoaderCircle, Plus, Search, Trash2 } from '@lucide/svelte';
    import { createRawSnippet, onMount } from 'svelte';

    let permissions = $state<Permission[]>([]);
    let isLoading = $state(false);
    let searchQuery = $state('');

    // Sheet state
    let formSheetOpen = $state(false);

    // Delete dialog state
    let deleteDialogOpen = $state(false);
    let deletingPermission = $state<Permission | null>(null);
    let isDeleting = $state(false);

    const filteredPermissions = $derived(
        searchQuery
            ? permissions.filter(
                p =>
                    p.resource
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                        || p.action
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()),
            )
            : permissions,
    );

    const fetchPermissions = async () => {
        isLoading = true;
        try {
            const result = await api.get('/iam/permissions', {
                responseSchema: permissionListResponseSchema,
            }).result();
            if (result.ok) {
                permissions = result.data as typeof permissions;
            }
        }
        finally {
            isLoading = false;
        }
    };

    const openDeleteDialog = (permission: Permission) => {
        deletingPermission = permission;
        deleteDialogOpen = true;
    };

    const handleDelete = async () => {
        if (!deletingPermission)
            return;
        isDeleting = true;
        try {
            await api.delete('/iam/permissions/{id}', {
                params: { id: deletingPermission.id },
            }).result();
            deleteDialogOpen = false;
            deletingPermission = null;
            await fetchPermissions();
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

    onMount(() => {
        fetchPermissions();
    });
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

<AppLayout containerClass='lg:pl-10 px-6'>
    <div
        class='mb-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'
    >
        <div>
            <h1 class='text-[24px] font-bold text-gray-900 leading-tight'>
                Permissions Management
            </h1>
            <p class='mt-1 text-sm text-gray-500'>
                Define resource-action permission rules
            </p>
        </div>
        <Button onclick={() => (formSheetOpen = true)}>
            <Plus class='mr-2 h-4 w-4' />
            Create Permission
        </Button>
    </div>

    <Card class='py-10'>
        <CardHeader>
            <div class='flex items-center justify-between'>
                <div>
                    <CardTitle>Permissions ({permissions.length})</CardTitle>
                    <CardDescription>
                        All permission rules in the system.
                    </CardDescription>
                </div>
                <div class='relative w-64'>
                    <Search
                        class='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400'
                    />
                    <Input
                        type='text'
                        placeholder='Search permissions...'
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
                <DataTable {columns} data={filteredPermissions} />
            {/if}
        </CardContent>
    </Card>
</AppLayout>

<PermissionFormSheet
    open={formSheetOpen}
    onOpenChange={v => (formSheetOpen = v)}
    onSuccess={fetchPermissions}
/>

<ConfirmDialog
    open={deleteDialogOpen}
    message='This will permanently delete this permission. Any roles or users using it will lose this access rule.'
    isLoading={isDeleting}
    onOpenChange={v => (deleteDialogOpen = v)}
    onConfirm={handleDelete}
/>
