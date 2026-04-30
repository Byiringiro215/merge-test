<script lang='ts'>
    import type { Role, ServiceAccount } from '$lib/datamodel/admin';
    import FormField from '$lib/components/form-field/form-field.svelte';
    import { Button } from '$lib/components/ui/button';
    import * as Dialog from '$lib/components/ui/dialog';
    import { LoaderCircle } from '@lucide/svelte';
    import {
        fetchAllRoles,
        unbindRole,
    } from '../../../routes/(app)/admin/roles/role.remote';
    import { bindRoleToServiceAccount } from '../../../routes/(app)/admin/service-accounts/service-account.remote';

    interface Props {
        open: boolean;
        serviceAccount: ServiceAccount | null;
        onOpenChange: (open: boolean) => void;
    }

    const { open, serviceAccount, onOpenChange }: Props = $props();

    let roleId = $state('');
    let filterTerm = $state('');
    let filterDebounce: ReturnType<typeof setTimeout> | undefined;

    let isWorking = $state(false);
    let errorMessage = $state('');
    let successMessage = $state('');

    const rolesQuery = $derived(fetchAllRoles());
    const roleOptions = $derived(
        (rolesQuery.current ?? [])
            .filter((r: Role) =>
                filterTerm
                    ? r.name.toLowerCase().includes(filterTerm.toLowerCase())
                    : true,
            )
            .map((r: Role) => ({ label: r.name, value: r.id })),
    );

    function debouncedSearch(term: string) {
        clearTimeout(filterDebounce);
        filterDebounce = setTimeout(() => {
            filterTerm = term;
        }, 300);
    }

    $effect(() => {
        if (!open) {
            roleId = '';
            filterTerm = '';
            errorMessage = '';
            successMessage = '';
        }
    });

    async function handleAction(action: 'assign' | 'unassign') {
        if (!serviceAccount)
            return;

        const numericRoleId = Number(roleId);
        if (!numericRoleId) {
            errorMessage = 'Please select a role first';
            successMessage = '';
            return;
        }

        errorMessage = '';
        successMessage = '';
        isWorking = true;
        try {
            if (action === 'assign') {
                await bindRoleToServiceAccount({
                    id: numericRoleId,
                    serviceAccountId: serviceAccount.id,
                });
                successMessage = 'Role assigned to service account.';
            }
            else {
                await unbindRole({
                    id: numericRoleId,
                    subjectType: 'SERVICE_ACCOUNT',
                    subjectId: serviceAccount.id,
                });
                successMessage = 'Role unassigned from service account.';
            }
        }
        catch (err) {
            errorMessage
                = err instanceof Error
                    ? err.message
                    : `Failed to ${action} role`;
        }
        finally {
            isWorking = false;
        }
    }
</script>

<Dialog.Root {open} onOpenChange={(v: boolean) => onOpenChange(v)}>
    <Dialog.Content class='sm:max-w-xl max-h-[85vh] flex flex-col overflow-y-auto'>
        <Dialog.Header>
            <Dialog.Title>
                Role Assignments:
                <span class='font-bold'>{serviceAccount?.displayName ?? serviceAccount?.name ?? ''}</span>
            </Dialog.Title>
            <Dialog.Description>
                Assign or unassign roles for this service account.
            </Dialog.Description>
        </Dialog.Header>

        <section class='flex flex-col gap-3'>
            {#if errorMessage}
                <div
                    class='rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700'
                >
                    {errorMessage}
                </div>
            {/if}
            {#if successMessage}
                <div
                    class='rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-xs text-green-700'
                >
                    {successMessage}
                </div>
            {/if}

            <FormField
                name='roleId'
                label='Select role'
                searchSelectInput={true}
                options={roleOptions}
                value={roleId}
                onSelect={option => (roleId = String(option.value))}
                onSearch={debouncedSearch}
                placeholder='Search roles by name...'
                disabled={isWorking}
                labelClass='mb-4!'
            />

            <div class='flex items-center gap-2'>
                <Button
                    size='sm'
                    class='flex-1'
                    disabled={isWorking}
                    onclick={() => handleAction('assign')}
                >
                    {#if isWorking}
                        <LoaderCircle class='mr-2 h-4 w-4 animate-spin' />
                    {/if}
                    Assign
                </Button>
                <Button
                    size='sm'
                    variant='outline'
                    class='flex-1'
                    disabled={isWorking}
                    onclick={() => handleAction('unassign')}
                >
                    Unassign
                </Button>
            </div>
        </section>
    </Dialog.Content>
</Dialog.Root>
