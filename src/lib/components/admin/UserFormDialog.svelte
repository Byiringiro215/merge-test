<script lang='ts'>
    import type { User } from '$lib/datamodel/admin';
    import FormField from '$lib/components/form-field/form-field.svelte';
    import { Checkbox } from '$lib/components/ui/checkbox';
    import { Label } from '$lib/components/ui/label';
    import {
        createUserBodySchema,
        updateUserCommandSchema,
    } from '$lib/types/form-schemas';
    import * as s from '@bajustone/fetcher/schema';
    import { createUser, updateUser } from '../../../routes/(app)/admin/page.remote';
    import FormSheet from './FormSheet.svelte';

    interface Props {
        open: boolean;
        user: User | null;
        onOpenChange: (open: boolean) => void;
        onSuccess: () => void;
    }

    const { open, user, onOpenChange, onSuccess }: Props = $props();

    const emptyValues = {
        name: '',
        email: '',
        isActive: true,
        password: '',
    };

    let values = $state({ ...emptyValues });
    let errors = $state<Record<string, string>>({});
    let isSubmitting = $state(false);
    let errorMessage = $state('');

    const isEditing = $derived(user !== null);

    $effect(() => {
        if (open) {
            values = user
                ? { name: user.name, email: user.email, isActive: user.isActive, password: '' }
                : { ...emptyValues };
            errors = {};
            errorMessage = '';
        }
    });

    async function handleSubmit() {
        errorMessage = '';
        errors = {};

        // Mirrors each command's server-side schema. On edit, omit `password`
        // when left blank ("keep existing"); on create, send whatever was typed.
        const base = {
            name: values.name,
            email: values.email,
            isActive: values.isActive,
            ...(values.password ? { password: values.password } : {}),
        };

        isSubmitting = true;
        try {
            if (user) {
                const result = s.parseForm(updateUserCommandSchema, { id: user.id, ...base });
                if (!result.ok) {
                    errors = result.errors;
                    return;
                }
                await updateUser(result.value);
            }
            else {
                const result = s.parseForm(createUserBodySchema, base);
                if (!result.ok) {
                    errors = result.errors;
                    return;
                }
                await createUser(result.value);
            }

            onOpenChange(false);
            onSuccess();
        }
        catch (err) {
            errorMessage
                = err instanceof Error
                    ? err.message
                    : isEditing ? 'Failed to update user' : 'Failed to create user';
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
            name='name'
            label='Name'
            placeholder='Full name'
            value={values.name}
            onInput={v => (values.name = v)}
            error={errors.name}
            disabled={isSubmitting}
        />

        <FormField
            name='email'
            label='Email'
            type='email'
            placeholder='user@example.com'
            value={values.email}
            onInput={v => (values.email = v)}
            error={errors.email}
            disabled={isSubmitting}
        />

        <FormField
            name='password'
            label={isEditing ? 'Password (leave blank to keep)' : 'Password(Optional)'}
            type='password'
            placeholder='Enter password'
            value={values.password}
            onInput={v => (values.password = v)}
            error={errors.password}
            disabled={isSubmitting}
        />

        <div class='flex items-center gap-2'>
            <Checkbox
                id='user-active'
                checked={values.isActive}
                onCheckedChange={(v) => {
                    if (typeof v === 'boolean')
                        values.isActive = v;
                }}
                disabled={isSubmitting}
            />
            <Label for='user-active' class='text-sm font-medium text-gray-700'>
                Active
            </Label>
        </div>
    </div>
</FormSheet>
