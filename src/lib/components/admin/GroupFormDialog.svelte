<script lang='ts'>
    import type { Group } from '$lib/datamodel/admin';
    import { api } from '$lib/api';
    import { Input } from '$lib/components/ui/input';
    import { groupSchema } from '$lib/types/api-schemas';
    import { extractErrorMessage } from '@bajustone/fetcher';
    import FormSheet from './FormSheet.svelte';

    interface Props {
        open: boolean;
        group: Group | null;
        onOpenChange: (open: boolean) => void;
        onSuccess: () => void;
    }

    const { open, group, onOpenChange, onSuccess }: Props = $props();

    let name = $state('');
    let description = $state('');
    let isSubmitting = $state(false);
    let errorMessage = $state('');

    const isEditing = $derived(group !== null);

    $effect(() => {
        if (open) {
            if (group) {
                name = group.name;
                description = group.description ?? '';
            }
            else {
                name = '';
                description = '';
            }
            errorMessage = '';
        }
    });

    async function handleSubmit() {
        errorMessage = '';
        isSubmitting = true;

        try {
            const body = {
                name,
                description: description || undefined,
            };

            if (isEditing && group) {
                const result = await api.put('/iam/groups/{id}', {
                    params: { id: group.id },
                    body,
                    responseSchema: groupSchema,
                }).result();
                if (!result.ok) {
                    errorMessage
                        = extractErrorMessage(result.error) || 'Failed to update group';
                    return;
                }
            }
            else {
                const result = await api.post('/iam/groups', {
                    body,
                    responseSchema: groupSchema,
                }).result();
                if (!result.ok) {
                    errorMessage
                        = extractErrorMessage(result.error) || 'Failed to create group';
                    return;
                }
            }

            onOpenChange(false);
            onSuccess();
        }
        finally {
            isSubmitting = false;
        }
    }
</script>

<FormSheet
    {open}
    {onOpenChange}
    title={isEditing ? 'Edit Group' : 'Create Group'}
    description={isEditing
        ? 'Update group details.'
        : 'Create a new user group.'}
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
        <div>
            <label
                for='group-name'
                class='mb-1.5 block text-sm font-medium text-gray-700'
            >
                Name
            </label>
            <Input
                id='group-name'
                type='text'
                placeholder='Group name'
                bind:value={name}
                disabled={isSubmitting}
            />
        </div>

        <div>
            <label
                for='group-description'
                class='mb-1.5 block text-sm font-medium text-gray-700'
            >
                Description
            </label>
            <Input
                id='group-description'
                type='text'
                placeholder='Optional description'
                bind:value={description}
                disabled={isSubmitting}
            />
        </div>
    </div>
</FormSheet>
