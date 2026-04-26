<script lang='ts'>
    import type { User } from '$lib/datamodel/admin';
    import FormField from '$lib/components/form-field/form-field.svelte';
    import { Button } from '$lib/components/ui/button';
    import * as Dialog from '$lib/components/ui/dialog';
    import { groupMemberPickerSchema } from '$lib/types/form-schemas';
    import * as s from '@bajustone/fetcher/schema';
    import { LoaderCircle } from '@lucide/svelte';
    import {
        addGroupMember,
        searchUsersForGroup,
    } from '../../../routes/(app)/admin/groups/group.remote';

    interface Props {
        open: boolean;
        groupId: number | null;
        existingMemberIds: number[];
        onOpenChange: (open: boolean) => void;
        onSuccess?: () => void;
    }

    const {
        open,
        groupId,
        existingMemberIds,
        onOpenChange,
        onSuccess,
    }: Props = $props();

    let values = $state({ userId: '' });
    let errors = $state<Record<string, string>>({});
    let isSubmitting = $state(false);
    let errorMessage = $state('');

    const usersQuery = $derived(searchUsersForGroup({ limit: 100 }));
    const allUsers = $derived<User[]>(
        (usersQuery.current?.users ?? []) as User[],
    );

    const availableUsers = $derived(
        allUsers.filter(u => !existingMemberIds.includes(u.id)),
    );

    const userOptions = $derived(
        availableUsers.map(u => ({
            label: `${u.name} (${u.email})`,
            value: String(u.id),
        })),
    );

    $effect(() => {
        if (!open) {
            values = { userId: '' };
            errors = {};
            errorMessage = '';
        }
    });

    async function handleSubmit() {
        errorMessage = '';
        errors = {};

        if (!groupId)
            return;

        const result = s.parseForm(groupMemberPickerSchema, values);
        if (!result.ok) {
            errors = result.errors;
            return;
        }

        isSubmitting = true;
        try {
            await addGroupMember({
                id: groupId,
                userId: Number(result.value.userId),
            });
            onOpenChange(false);
            onSuccess?.();
        }
        catch (err) {
            errorMessage
                = err instanceof Error
                    ? err.message
                    : 'Failed to add member';
        }
        finally {
            isSubmitting = false;
        }
    }
</script>

<Dialog.Root {open} onOpenChange={(v: boolean) => onOpenChange(v)}>
    <Dialog.Content class='sm:max-w-md'>
        <Dialog.Header>
            <Dialog.Title>Add member</Dialog.Title>
            <Dialog.Description>
                Pick a user to add to this group.
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
                name='userId'
                label='User'
                searchSelectInput={true}
                options={userOptions}
                value={values.userId}
                onSelect={option => (values.userId = String(option.value))}
                placeholder='Search users...'
                error={errors.userId}
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
