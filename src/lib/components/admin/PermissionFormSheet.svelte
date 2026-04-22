<script lang='ts'>
    import type { Schema } from '$lib/api/paths';
    import { api } from '$lib/api';
    import { Input } from '$lib/components/ui/input';
    import { permissionSchema } from '$lib/types/api-schemas';
    import { extractErrorMessage } from '@bajustone/fetcher';
    import FormSheet from './FormSheet.svelte';

    interface Props {
        open: boolean;
        onOpenChange: (open: boolean) => void;
        onSuccess: () => void;
    }

    const { open, onOpenChange, onSuccess }: Props = $props();

    let resource = $state('');
    let action = $state('');
    let permEffect = $state<'ALLOW' | 'DENY'>('ALLOW');
    let description = $state('');
    let isSubmitting = $state(false);
    let errorMessage = $state('');

    $effect(() => {
        if (open) {
            resource = '';
            action = '';
            permEffect = 'ALLOW';
            description = '';
            errorMessage = '';
        }
    });

    async function handleSubmit() {
        errorMessage = '';
        isSubmitting = true;

        try {
            const body = {
                resource,
                action,
                effect: permEffect,
                ...(description ? { description } : {}),
            } as Schema<'PermissionInput'>;

            const result = await api.post('/iam/permissions', {
                body,
                responseSchema: permissionSchema,
            }).result();
            if (!result.ok) {
                errorMessage
                    = extractErrorMessage(result.error) || 'Failed to create permission';
                return;
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
    title='Create Permission'
    description='Define a new permission rule.'
    {isSubmitting}
    submitLabel='Create'
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
                for='perm-resource'
                class='mb-1.5 block text-sm font-medium text-gray-700'
            >
                Resource
            </label>
            <Input
                id='perm-resource'
                type='text'
                placeholder='e.g. users, reports, schools'
                bind:value={resource}
                disabled={isSubmitting}
            />
        </div>

        <div>
            <label
                for='perm-action'
                class='mb-1.5 block text-sm font-medium text-gray-700'
            >
                Action
            </label>
            <Input
                id='perm-action'
                type='text'
                placeholder='e.g. read, write, delete'
                bind:value={action}
                disabled={isSubmitting}
            />
        </div>

        <div>
            <label
                for='perm-effect'
                class='mb-1.5 block text-sm font-medium text-gray-700'
            >
                Effect
            </label>
            <select
                id='perm-effect'
                bind:value={permEffect}
                disabled={isSubmitting}
                class='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
            >
                <option value='ALLOW'>Allow</option>
                <option value='DENY'>Deny</option>
            </select>
        </div>

        <div>
            <label
                for='perm-description'
                class='mb-1.5 block text-sm font-medium text-gray-700'
            >
                Description
            </label>
            <Input
                id='perm-description'
                type='text'
                placeholder='Optional description'
                bind:value={description}
                disabled={isSubmitting}
            />
        </div>
    </div>
</FormSheet>
