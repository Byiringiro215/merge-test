<script lang='ts'>
    import type { User } from '$lib/datamodel/admin';
    import FormField from '$lib/components/form-field/form-field.svelte';
    import { Checkbox } from '$lib/components/ui/checkbox';
    import { Label } from '$lib/components/ui/label';
    import { userSchema } from '$lib/types/zod-schemas-api';
    import { defaults, superForm } from 'sveltekit-superforms';
    import { zod4 } from 'sveltekit-superforms/adapters';
    import { z } from 'zod/v4';
    import {
        createUser,
        updateUser,
    } from '../../../routes/(app)/admin/page.remote';
    import FormSheet from './FormSheet.svelte';

    const userFormSchema = userSchema
        .pick({ name: true, email: true, isActive: true })
        .extend({
            password: z.string().optional().default(''),
        });

    interface Props {
        open: boolean;
        user: User | null;
        onOpenChange: (open: boolean) => void;
        onSuccess: () => void;
    }

    const { open, user, onOpenChange, onSuccess }: Props = $props();

    const form = superForm(
        defaults(
            { name: '', email: '', isActive: true, password: '' },
            zod4(userFormSchema),
        ),
        {
            SPA: true,
            validators: zod4(userFormSchema),
        },
    );

    const { form: formData, validateForm, reset } = form;

    let isSubmitting = $state(false);
    let errorMessage = $state('');

    const isEditing = $derived(user !== null);

    $effect(() => {
        if (open) {
            if (user) {
                reset({
                    data: {
                        name: user.name,
                        email: user.email,
                        isActive: user.isActive,
                        password: '',
                    },
                });
            }
            else {
                reset({
                    data: {
                        name: '',
                        email: '',
                        isActive: true,
                        password: '',
                    },
                });
            }
            errorMessage = '';
        }
        else {
            reset({
                data: { name: '', email: '', isActive: true, password: '' },
            });
            errorMessage = '';
        }
    });

    async function handleSubmit() {
        errorMessage = '';

        const result = await validateForm({ update: true });
        if (!result.valid)
            return;

        isSubmitting = true;
        try {
            if (isEditing && user) {
                await updateUser({
                    id: user.id,
                    name: $formData.name,
                    email: $formData.email,
                    isActive: $formData.isActive,
                    ...($formData.password
                        ? { password: $formData.password }
                        : {}),
                });
            }
            else {
                await createUser({
                    name: $formData.name,
                    email: $formData.email,
                    isActive: $formData.isActive,
                    ...($formData.password
                        ? { password: $formData.password }
                        : {}),
                });
            }

            onOpenChange(false);
            onSuccess();
        }
        catch (err) {
            const fallback = isEditing
                ? 'Failed to update user'
                : 'Failed to create user';
            errorMessage = err instanceof Error ? err.message : fallback;
        }
        finally {
            isSubmitting = false;
        }
    }
</script>

<FormSheet
    {open}
    {onOpenChange}
    title={isEditing ? 'Edit User' : 'Create User'}
    description={isEditing
        ? 'Update user details.'
        : 'Add a new user to the system.'}
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
            placeholder='Full name'
            disabled={isSubmitting}
        />

        <FormField
            formStore={form}
            name='email'
            label='Email'
            type='email'
            placeholder='user@example.com'
            disabled={isSubmitting}
        />

        <FormField
            formStore={form}
            name='password'
            label={isEditing ? 'Password (leave blank to keep)' : 'Password(Optional)'}
            type='password'
            placeholder='Enter password'
            disabled={isSubmitting}
        />

        <div class='flex items-center gap-2'>
            <Checkbox
                id='user-active'
                checked={$formData.isActive}
                onCheckedChange={(v) => {
                    if (typeof v === 'boolean')
                        $formData.isActive = v;
                }}
                disabled={isSubmitting}
            />
            <Label for='user-active' class='text-sm font-medium text-gray-700'>
                Active
            </Label>
        </div>
    </div>
</FormSheet>
