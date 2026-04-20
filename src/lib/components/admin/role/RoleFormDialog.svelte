<script lang='ts'>
    import type { PermissionRes, Role } from '$lib/datamodel/admin';
    import FormField from '$lib/components/form-field/form-field.svelte';
    import { Badge } from '$lib/components/ui/badge';
    import { Button } from '$lib/components/ui/button';
    import { roleRequestSchema } from '$lib/types/zod-schemas-api';
    import { X } from '@lucide/svelte';
    import { defaults, superForm } from 'sveltekit-superforms';
    import { zod4 } from 'sveltekit-superforms/adapters';
    import { createRole, fetchAllPermissions, fetchRoleById, updateRole } from '../../../../routes/(app)/admin/roles/role.remote';
    import FormSheet from '../FormSheet.svelte';

    interface Props {
        open: boolean;
        role: Role | null;
        onOpenChange: (open: boolean) => void;
        onSuccess: () => void;
    }

    const { open, role, onOpenChange, onSuccess }: Props = $props();

    // Superforms setup (SPA mode)
    const form = superForm(defaults(zod4(roleRequestSchema)), {
        SPA: true,
        validators: zod4(roleRequestSchema),
    });

    const { form: formData, validateForm } = form;

    let isSubmitting = $state(false);
    let errorMessage = $state('');
    let originalPermissionIds = $state<Set<number>>(new Set());

    const isEditing = $derived(role !== null);

    const permissionsQuery = $derived(fetchAllPermissions());
    const availablePermissions = $derived(
        (permissionsQuery.current ?? []) as unknown as PermissionRes[],
    );

    const permissionOptions = $derived(
        availablePermissions
            .filter(p => !$formData.permissions.some(s => s.id === p.id))
            .map(p => ({
                label: `${p.resource}:${p.action} (${p.effect})`,
                value: String(p.id),
            })),
    );

    const addPermission = (permissionId: string) => {
        // Add a permission (looked up by id in the latest server result) to the form state.
        const id = Number(permissionId);

        const permission = availablePermissions.find(p => p.id === id);
        if (!permission)
            return;

        if ($formData.permissions.some(p => p.id === id))
            return;

        $formData.permissions = [...$formData.permissions, permission];
    };

    $effect(() => {
        if (!open)
            return;

        errorMessage = '';

        if (role) {
            // Pre-populate name/description from the row data for instant feedback,
            // then async-fetch the full role detail for its permissions.
            $formData.name = role.name;
            $formData.description = role.description ?? '';
            $formData.permissions = [];
            originalPermissionIds = new Set();

            void (async () => {
                const detail = await fetchRoleById(role.id);
                const loaded = (detail.permissions ?? []) as PermissionRes[];
                $formData.permissions = loaded;
                originalPermissionIds = new Set(loaded.map(p => p.id));
            })();
        }
        else {
            $formData.name = '';
            $formData.description = '';
            $formData.permissions = [];
            originalPermissionIds = new Set();
        }
    });

    const removePermission = (permissionId: number) => {
        $formData.permissions = $formData.permissions.filter(
            p => p.id !== permissionId,
        );
    };

    const handleSubmit = async () => {
        errorMessage = '';

        const validated = await validateForm({ update: true });
        if (!validated.valid) {
            return;
        }

        const data = validated.data;
        const permissions = (data.permissions ?? []) as PermissionRes[];

        isSubmitting = true;
        try {
            if (role) {
                const addedPermissions = permissions.filter(
                    p => !originalPermissionIds.has(p.id),
                );

                await updateRole({
                    id: role.id,
                    name: data.name,
                    description: data.description,
                    addedPermissions: addedPermissions as never,
                });
            }
            else {
                await createRole({
                    name: data.name,
                    description: data.description,
                    permissions: permissions as never,
                });
            }

            onSuccess();
            onOpenChange(false);
        }
        catch (err) {
            errorMessage
                = err instanceof Error ? err.message : 'Failed to save role';
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
            containerClass=""
            placeholder='Optional description'
            textareaInput={true}
            disabled={isSubmitting}
        />

        <div class='space-y-2'>
            <FormField
                formStore={form}
                name='permissions'
                label='Permissions'
                searchSelectInput={true}
                options={permissionOptions}
                placeholder='Search and select permissions...'
                onSelect={option => addPermission(String(option.value))}
            />

            {#if $formData.permissions.length > 0}
                <div class='space-y-2 max-h-48 overflow-y-auto'>
                    {#each $formData.permissions as permission, i(i)}
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
