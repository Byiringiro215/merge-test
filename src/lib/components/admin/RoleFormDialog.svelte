<script lang='ts'>
    import type { Schema } from '$lib/api/paths';
    import type { Permission, Role } from '$lib/datamodel/admin';
    import { api } from '$lib/api';
    import FormField from '$lib/components/form-field/form-field.svelte';
    import { Badge } from '$lib/components/ui/badge';
    import { Button } from '$lib/components/ui/button';
    import {
        permissionListResponseSchema,
        roleSchema,
    } from '$lib/types/zod-schemas-api';
    import { extractErrorMessage } from '@bajustone/fetcher';
    import { X } from '@lucide/svelte';
    import { defaults, superForm } from 'sveltekit-superforms';
    import { zod } from 'sveltekit-superforms/adapters';
    import { z } from 'zod/v3';
    import FormSheet from './FormSheet.svelte';

    const roleFormSchema = z.object({
        name: z.string().min(1, 'Role name is required'),
        description: z.string().optional().default(''),
        selectedPermission: z.string().optional().default(''),
    });

    interface Props {
        open: boolean;
        role: Role | null;
        onOpenChange: (open: boolean) => void;
        onSuccess: () => void;
    }

    const { open, role, onOpenChange, onSuccess }: Props = $props();

    // Superforms setup (SPA mode)
    const form = superForm(defaults(zod(roleFormSchema)), {
        SPA: true,
        validators: zod(roleFormSchema),
    });

    const { form: formData, validateForm } = form;

    // Permission state
    let availablePermissions = $state<Permission[]>([]);
    let selectedPermissions = $state<Permission[]>([]);
    let isSubmitting = $state(false);
    let errorMessage = $state('');

    const isEditing = $derived(role !== null);

    const permissionOptions = $derived(
        availablePermissions
            .filter(p => !selectedPermissions.some(s => s.id === p.id))
            .map(p => ({
                label: `${p.resource}:${p.action} (${p.effect})`,
                value: String(p.id),
            })),
    );

    // Watch for permission selection from the searchSelectInput
    $effect(() => {
        const selectedId = $formData.selectedPermission;
        if (selectedId) {
            const permission = availablePermissions.find(
                p => String(p.id) === selectedId,
            );
            if (
                permission
                && !selectedPermissions.some(s => s.id === permission.id)
            ) {
                selectedPermissions = [...selectedPermissions, permission];
            }
            $formData.selectedPermission = '';
        }
    });

    const fetchPermissions = async () => {
        try {
            const result = await api.get('/iam/permissions', {
                responseSchema: permissionListResponseSchema,
            }).result();
            if (result.ok) {
                availablePermissions = result.data as typeof availablePermissions;
            }
        }
        catch {
        // silently fail - permissions list will be empty
        }
    };

    $effect(() => {
        if (open) {
            fetchPermissions();
            if (role) {
                $formData.name = role.name;
                $formData.description = role.description ?? '';
            }
            else {
                $formData.name = '';
                $formData.description = '';
            }
            selectedPermissions = [];
            $formData.selectedPermission = '';
            errorMessage = '';
        }
    });

    const removePermission = (permissionId: number) => {
        selectedPermissions = selectedPermissions.filter(
            p => p.id !== permissionId,
        );
    };

    const handleSubmit = async () => {
        errorMessage = '';

        const result = await validateForm({ update: true });
        if (!result.valid)
            return;

        if (!isEditing && selectedPermissions.length === 0) {
            errorMessage = 'Select at least one permission for the role';
            return;
        }

        isSubmitting = true;
        try {
            const permissionInputs = selectedPermissions.map(p => ({
                resource: p.resource,
                action: p.action,
                effect: p.effect,
                ...(p.conditions?.length ? { conditions: p.conditions } : {}),
            })) as Schema<'PermissionInput'>[];

            if (isEditing && role) {
                const result = await api.put('/iam/roles/{id}', {
                    params: { id: role.id },
                    body: {
                        name: $formData.name,
                        description: $formData.description || undefined,
                    },
                    responseSchema: roleSchema,
                }).result();
                if (!result.ok) {
                    errorMessage
                        = extractErrorMessage(result.error) || 'Failed to update role';
                    return;
                }
            }
            else {
                const result = await api.post('/iam/roles', {
                    body: {
                        name: $formData.name,
                        permissions: permissionInputs,
                        description: $formData.description || undefined,
                    },
                    responseSchema: roleSchema,
                }).result();
                if (!result.ok) {
                    errorMessage
                        = extractErrorMessage(result.error) || 'Failed to create role';
                    return;
                }
            }

            onOpenChange(false);
            onSuccess();
        }
        finally {
            isSubmitting = false;
        }
    };
</script>

<FormSheet
    {open}
    {onOpenChange}
    title={isEditing ? 'Edit Role' : 'Create Role'}
    description={isEditing
        ? 'Update role details.'
        : 'Create a new role with permissions for access control.'}
    {isSubmitting}
    submitLabel={isEditing ? 'Update' : 'Create'}
    onSubmit={handleSubmit}
>
    {#if errorMessage}
        <div
            class='rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700'
        >
            {errorMessage}
        </div>
    {/if}

    <div class='space-y-4'>
        <FormField
            formStore={form}
            name='name'
            label='Name'
            placeholder='Role name'
            disabled={isSubmitting}
        />

        <FormField
            formStore={form}
            name='description'
            label='Description'
            placeholder='Optional description'
            disabled={isSubmitting}
        />

        <div class='space-y-2'>
            <FormField
                formStore={form}
                name='selectedPermission'
                label='Permissions'
                searchSelectInput={true}
                options={permissionOptions}
                placeholder='Search and select permissions...'
                disabled={isSubmitting}
            />

            {#if selectedPermissions.length > 0}
                <div class='space-y-2 max-h-48 overflow-y-auto'>
                    {#each selectedPermissions as permission (permission.id)}
                        <div
                            class='flex items-start justify-between gap-2 rounded-md border p-2.5'
                        >
                            <div class='flex-1 min-w-0'>
                                <div class='flex items-center gap-1.5 flex-wrap'>
                                    <span class='text-sm font-medium font-mono'>
                                        {permission.resource}:{permission.action}
                                    </span>
                                    {#if permission.effect === 'ALLOW'}
                                        <Badge
                                            class='bg-green-100 text-green-800 hover:bg-green-100 text-xs'
                                            variant='outline'
                                        >
                                            Allow
                                        </Badge>
                                    {:else}
                                        <Badge
                                            variant='destructive'
                                            class='text-xs'>Deny</Badge
                                        >
                                    {/if}
                                </div>
                                {#if permission.description}
                                    <p
                                        class='text-xs text-muted-foreground mt-1'
                                    >
                                        {permission.description}
                                    </p>
                                {/if}
                            </div>
                            <Button
                                type='button'
                                variant='ghost'
                                size='icon'
                                class='h-6 w-6 shrink-0 cursor-pointer'
                                onclick={() =>
                                    removePermission(permission.id)}
                                disabled={isSubmitting}
                            >
                                <X class='h-3.5 w-3.5' />
                            </Button>
                        </div>
                    {/each}
                </div>
            {:else if !isEditing}
                <p class='text-xs text-muted-foreground'>
                    Select at least one permission for this role.
                </p>
            {/if}
        </div>
    </div>
</FormSheet>
