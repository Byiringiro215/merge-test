<script lang='ts'>
    import type { Permission, Role } from '$lib/datamodel/admin';
    import FormField from '$lib/components/form-field/form-field.svelte';
    import { Button } from '$lib/components/ui/button';
    import * as Dialog from '$lib/components/ui/dialog';
    import * as s from '@bajustone/fetcher/schema';
    import { LoaderCircle } from '@lucide/svelte';
    import { defaults, superForm } from 'sveltekit-superforms';
    import { standard } from 'sveltekit-superforms/adapters';
    import {
        addPermissionToRole,
        fetchAllPermissions,
    } from '../../../../routes/(app)/admin/roles/role.remote';

    interface Props {
        open: boolean;
        role: Role | null;
        onOpenChange: (open: boolean) => void;
        onSuccess?: () => void;
    }

    const { open, role, onOpenChange, onSuccess }: Props = $props();

    const permissionFormSchema = s.object({
        permissionId: s.refined(
            s.string(),
            v => v.length >= 1,
            'Please select a permission',
        ),
    });

    const permissionFormDefaults = { permissionId: '' };
    const permissionFormAdapter = standard(permissionFormSchema, {
        defaults: permissionFormDefaults,
    });

    const form = superForm(
        defaults(permissionFormDefaults, permissionFormAdapter),
        { SPA: true, validators: permissionFormAdapter },
    );

    const { form: formData, validateForm, reset } = form;

    const permissionsQuery = $derived(fetchAllPermissions());
    const permissions = $derived<Permission[]>(
        (permissionsQuery.current ?? []) as Permission[],
    );

    const permissionOptions = $derived(
        permissions.map(p => ({
            label: `${p.resource}:${p.action} (${p.effect})`,
            value: String(p.id),
        })),
    );

    let isSubmitting = $state(false);
    let errorMessage = $state('');

    $effect(() => {
        if (!open) {
            reset({ data: { permissionId: '' } });
            errorMessage = '';
        }
    });

    async function handleSubmit() {
        errorMessage = '';
        if (!role)
            return;

        const validation = await validateForm({ update: true });
        if (!validation.valid)
            return;

        const selectedPermission = permissions.find(
            p => String(p.id) === $formData.permissionId,
        );
        if (!selectedPermission) {
            errorMessage = 'Selected permission not found';
            return;
        }

        isSubmitting = true;
        try {
            await addPermissionToRole({
                id: role.id,
                permission: {
                    resource: selectedPermission.resource,
                    action: selectedPermission.action,
                    effect: selectedPermission.effect,
                    conditions: selectedPermission.conditions,
                } as never,
            });
            onOpenChange(false);
            onSuccess?.();
        }
        catch (err) {
            errorMessage
                = err instanceof Error
                    ? err.message
                    : 'Failed to add permission';
        }
        finally {
            isSubmitting = false;
        }
    }
</script>

<Dialog.Root {open} onOpenChange={(v: boolean) => onOpenChange(v)}>
    <Dialog.Content class='sm:max-w-md'>
        <Dialog.Header>
            <Dialog.Title>Add permission: <span class='font-bold capitalize'>{role?.name ?? ''}</span>
            </Dialog.Title>
            <Dialog.Description>
                Pick an existing permission to add to this role.
            </Dialog.Description>
        </Dialog.Header>

        <form
            class='flex flex-col gap-4'
            onsubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}
        >
            {#if errorMessage}
                <div
                    class='rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700'
                >
                    {errorMessage}
                </div>
            {/if}

            <FormField
                formStore={form}
                name='permissionId'
                label='Permission'
                searchSelectInput={true}
                options={permissionOptions}
                placeholder='Search permissions...'
                disabled={isSubmitting}
            />

            <Dialog.Footer class='mt-2'>
                <Button
                    type='button'
                    variant='outline'
                    disabled={isSubmitting}
                    onclick={() => onOpenChange(false)}
                >
                    Cancel
                </Button>
                <Button type='submit' disabled={isSubmitting}>
                    {#if isSubmitting}
                        <LoaderCircle class='mr-2 h-4 w-4 animate-spin' />
                    {/if}
                    Add
                </Button>
            </Dialog.Footer>
        </form>
    </Dialog.Content>
</Dialog.Root>
