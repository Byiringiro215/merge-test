<script lang='ts'>
    import type { Permission, ServiceAccount } from '$lib/datamodel/admin';
    import type { ColumnDef } from '@tanstack/table-core';
    import { page } from '$app/state';
    import { ConfirmDialog } from '$lib/components/admin';
    import DataTable from '$lib/components/data-table/data-table.svelte';
    import FormField from '$lib/components/form-field/form-field.svelte';
    import LoadingBar from '$lib/components/loading-bar/loading-bar.svelte';
    import { Badge } from '$lib/components/ui/badge';
    import { Button } from '$lib/components/ui/button';
    import { renderSnippet } from '$lib/components/ui/data-table/index.js';
    import * as Dialog from '$lib/components/ui/dialog';
    import { permissionPickerSchema } from '$lib/types/form-schemas';
    import * as s from '@bajustone/fetcher/schema';
    import { LoaderCircle, Plus, Trash2 } from '@lucide/svelte';
    import { createRawSnippet } from 'svelte';
    import { fetchAllPermissions } from '../../../roles/role.remote';
    import {
        bindPermissionToServiceAccount,
        fetchServiceAccountById,
        fetchServiceAccountPermissions,
        unbindPermissionFromServiceAccount,
    } from '../../service-account.remote';

    const serviceAccountId = $derived(Number(page.params.id));

    const serviceAccountQuery = $derived(fetchServiceAccountById(serviceAccountId));
    const serviceAccount = $derived<ServiceAccount | undefined>(
        serviceAccountQuery.current,
    );

    const permissionsQuery = $derived(
        fetchServiceAccountPermissions({ id: serviceAccountId }),
    );
    const permissions = $derived<Permission[]>(
        (permissionsQuery.current ?? []) as Permission[],
    );

    let isInitialLoad = $state(true);
    $effect(() => {
        if (!permissionsQuery.loading && !serviceAccountQuery.loading) {
            isInitialLoad = false;
        }
    });
    const showLoading = $derived(
        !isInitialLoad && (permissionsQuery.loading || serviceAccountQuery.loading),
    );

    // Add-permission dialog state
    let addDialogOpen = $state(false);
    const allPermissionsQuery = $derived(addDialogOpen ? fetchAllPermissions() : null);
    const allPermissions = $derived<Permission[]>(
        (allPermissionsQuery?.current ?? []) as Permission[],
    );

    // Hide permissions already bound to this SA so the user can't pick a duplicate.
    const assignedPermissionIds = $derived(new Set(permissions.map(p => p.id)));
    const allPermissionOptions = $derived(
        allPermissions
            .filter(p => !assignedPermissionIds.has(p.id))
            .map(p => ({
                label: `${p.resource}:${p.action} (${p.effect})`,
                value: String(p.id),
            })),
    );

    let addValues = $state({ permissionId: '' });
    let addErrors = $state<Record<string, string>>({});
    let isAdding = $state(false);
    let addError = $state('');

    $effect(() => {
        if (!addDialogOpen) {
            addValues = { permissionId: '' };
            addErrors = {};
            addError = '';
        }
    });

    const handleAssignPermToServiceAccount = async () => {
        addError = '';
        addErrors = {};

        const parsed = s.parseForm(permissionPickerSchema, addValues);
        if (!parsed.ok) {
            addErrors = parsed.errors;
            return;
        }

        const selected = allPermissions.find(
            p => String(p.id) === parsed.value.permissionId,
        );
        if (!selected) {
            addError = 'Selected permission not found';
            return;
        }

        isAdding = true;
        try {
            await bindPermissionToServiceAccount({
                serviceAccountId,
                permission: {
                    resource: selected.resource,
                    action: selected.action,
                    effect: selected.effect,
                    ...(Array.isArray(selected.conditions) && selected.conditions.length > 0
                        ? { conditions: selected.conditions }
                        : {}),
                },
            });
            addDialogOpen = false;
            await permissionsQuery.refresh();
        }
        catch (err) {
            addError
                = err instanceof Error ? err.message : 'Failed to bind permission';
        }
        finally {
            isAdding = false;
        }
    };

    // Unbind dialog state
    let unbindDialogOpen = $state(false);
    let unbindingPermission = $state<Permission | null>(null);
    let isUnbinding = $state(false);
    let unbindError = $state('');

    const openUnbindDialog = (permission: Permission) => {
        unbindingPermission = permission;
        unbindError = '';
        unbindDialogOpen = true;
    };

    const handleUnassignPermToServiceAccount = async () => {
        if (!unbindingPermission)
            return;
        isUnbinding = true;
        unbindError = '';
        try {
            await unbindPermissionFromServiceAccount({
                serviceAccountId,
                permissionId: unbindingPermission.id,
            });
            await permissionsQuery.refresh();
            unbindDialogOpen = false;
            unbindingPermission = null;
        }
        catch (err) {
            unbindError
                = err instanceof Error ? err.message : 'Failed to unbind permission';
        }
        finally {
            isUnbinding = false;
        }
    };

    const columns: ColumnDef<Permission>[] = [
        {
            accessorKey: 'resource',
            header: 'Resource',
            cell: ({ row }) => {
                const snippet = createRawSnippet(() => ({
                    render: () =>
                        `<span class="font-mono text-sm text-gray-900">${row.original.resource}</span>`,
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
                        `<span class="text-sm text-gray-700">${row.original.action}</span>`,
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
                        `<span class="text-sm text-muted-foreground line-clamp-1">${desc}</span>`,
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

{#snippet effectCell({ effect }: { effect: string })}
    {#if effect === 'ALLOW'}
        <Badge class='border-green-200 text-white'>
            ALLOW
        </Badge>
    {:else}
        <Badge variant='secondary' class='border-red-200 text-red-700'>
            DENY
        </Badge>
    {/if}
{/snippet}

{#snippet actionsCell({ permission }: { permission: Permission })}
    <div class='text-right'>
        <Button
            variant='ghost'
            size='icon'
            class='text-destructive hover:text-destructive cursor-pointer'
            title='Unbind permission'
            onclick={() => openUnbindDialog(permission)}
        >
            <Trash2 class='h-4 w-4' />
        </Button>
    </div>
{/snippet}

<LoadingBar visible={showLoading} />
<div class='sm:px-6 lg:px-10 pt-16 bg-[#FAFAFA]'>
    <div class='border px-5 py-6 lg:py-8 lg:px-7'>

        <div class='mb-10'>
            <h1 class='text-[24px] font-bold text-gray-900 leading-tight'>
                Permissions: {serviceAccount?.displayName ?? serviceAccount?.name ?? '...'}
            </h1>
            <p class='mt-1 text-sm text-gray-500'>
                Effective permissions for this service account — combined from role
                bindings and direct grants. Unbind removes a directly-bound permission.
            </p>
        </div>

        <div
            class='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-5'
        >
            <h2 class='text-sm font-medium text-gray-700'>
                {permissions.length} permission{permissions.length === 1 ? '' : 's'}
            </h2>
            <Button class='gap-2 rounded' onclick={() => (addDialogOpen = true)}>
                <Plus class='h-3 w-3' />
                Add permission
            </Button>
        </div>

        <DataTable {columns} data={permissions} />
    </div>
</div>

<Dialog.Root open={addDialogOpen} onOpenChange={(v: boolean) => (addDialogOpen = v)}>
    <Dialog.Content class='sm:max-w-xl'>
        <Dialog.Header>
            <Dialog.Title>Add permission</Dialog.Title>
            <Dialog.Description>
                Bind an existing permission directly to this service account.
            </Dialog.Description>
        </Dialog.Header>

        <form
            class='flex flex-col gap-4'
            onsubmit={(e) => {
                e.preventDefault();
                handleAssignPermToServiceAccount();
            }}
        >
            {#if addError}
                <div
                    class='rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700'
                >
                    {addError}
                </div>
            {/if}

            <FormField
                name='permissionId'
                label='Permission'
                searchSelectInput={true}
                options={allPermissionOptions}
                value={addValues.permissionId}
                onSelect={option => (addValues.permissionId = String(option.value))}
                placeholder='Search permissions...'
                error={addErrors.permissionId}
                disabled={isAdding}
                labelClass='mb-5!'
            />

            <Dialog.Footer class='mt-2'>
                <Button
                    type='button'
                    variant='outline'
                    disabled={isAdding}
                    onclick={() => (addDialogOpen = false)}
                >
                    Cancel
                </Button>
                <Button type='submit' disabled={isAdding}>
                    {#if isAdding}
                        <LoaderCircle class='mr-2 h-4 w-4 animate-spin' />
                    {/if}
                    Add
                </Button>
            </Dialog.Footer>
        </form>
    </Dialog.Content>
</Dialog.Root>

<ConfirmDialog
    open={unbindDialogOpen}
    title='Unbind permission'
    message='This removes the direct binding. Permissions inherited via roles are unaffected.'
    confirmLabel='Unbind'
    isLoading={isUnbinding}
    error={unbindError}
    onOpenChange={v => (unbindDialogOpen = v)}
    onConfirm={handleUnassignPermToServiceAccount}
/>
