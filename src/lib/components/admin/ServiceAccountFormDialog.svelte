<script lang='ts'>
    import type { ServiceAccount } from '$lib/datamodel/admin';
    import FormField from '$lib/components/form-field/form-field.svelte';
    import { Checkbox } from '$lib/components/ui/checkbox';
    import { Label } from '$lib/components/ui/label';
    import {
        createServiceAccountBodySchema,
        updateServiceAccountCommandSchema,
    } from '$lib/types/form-schemas';
    import * as s from '@bajustone/fetcher/schema';
    import {
        createServiceAccount,
        updateServiceAccount,
    } from '../../../routes/(app)/admin/service-accounts/service-account.remote';
    import FormSheet from './FormSheet.svelte';

    interface Props {
        open: boolean;
        serviceAccount: ServiceAccount | null;
        onOpenChange: (open: boolean) => void;
        onSuccess: () => void;
    }

    const { open, serviceAccount, onOpenChange, onSuccess }: Props = $props();

    const emptyValues = {
        name: '',
        displayName: '',
        description: '',
        isActive: true,
    };

    let values = $state({ ...emptyValues });
    let errors = $state<Record<string, string>>({});
    let isSubmitting = $state(false);
    let errorMessage = $state('');

    const isEditing = $derived(serviceAccount !== null);
    // set default data on edit
    $effect(() => {
        if (open) {
            values = serviceAccount
                ? {
                    name: serviceAccount.name,
                    displayName: serviceAccount.displayName ?? '',
                    description: serviceAccount.description ?? '',
                    isActive: serviceAccount.isActive,
                }
                : { ...emptyValues };
            errors = {};
            errorMessage = '';
        }
    });
    // create and edit  service account
    const handleSubmit = async () => {
        errorMessage = '';
        errors = {};
        isSubmitting = true;

        try {
            if (serviceAccount) {
                const body = {
                    id: serviceAccount.id,
                    displayName: values.displayName ? values.displayName : null,
                    description: values.description ? values.description : null,
                    isActive: values.isActive,
                };
                const parsed = s.parseForm(updateServiceAccountCommandSchema, body);
                if (!parsed.ok) {
                    errors = parsed.errors;
                    return;
                }
                await updateServiceAccount(parsed.value);
            }
            else {
                const body = {
                    name: values.name,
                    ...(values.displayName ? { displayName: values.displayName } : {}),
                    ...(values.description ? { description: values.description } : {}),
                };
                const parsed = s.parseForm(createServiceAccountBodySchema, body);
                if (!parsed.ok) {
                    errors = parsed.errors;
                    return;
                }
                await createServiceAccount(parsed.value);
            }

            onOpenChange(false);
            onSuccess();
        }
        catch (err) {
            errorMessage
                = err instanceof Error
                    ? err.message
                    : isEditing
                    ? 'Failed to update service account'
                    : 'Failed to create service account';
        }
        finally {
            isSubmitting = false;
        }
    };
</script>

<FormSheet
    {open}
    {onOpenChange}
    title={isEditing ? 'Edit Service Account' : 'Create Service Account'}
    description={isEditing
        ? 'Update display name, description, or active status. The name is immutable.'
        : 'Create a non-human IAM principal used to authenticate other systems via API keys.'}
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
            label={isEditing ? 'Name (immutable)' : 'Name'}
            placeholder='e.g. my-system-integration'
            value={values.name}
            onInput={v => (values.name = v)}
            error={errors.name}
            disabled={isSubmitting || isEditing}
        />

        <FormField
            name='displayName'
            label='Display Name'
            placeholder='Human-readable label'
            value={values.displayName}
            onInput={v => (values.displayName = v)}
            error={errors.displayName}
            disabled={isSubmitting}
            labelClass='mt-5!'
        />

        <FormField
            name='description'
            label='Description'
            textareaInput
            labelClass='mb-4'
            placeholder='What this service account is used for'
            value={values.description}
            onInput={v => (values.description = v)}
            error={errors.description}
            disabled={isSubmitting}
        />

        {#if isEditing}
            <div class='flex items-center gap-2'>
                <Checkbox
                    id='service-account-active'
                    checked={values.isActive}
                    onCheckedChange={(v) => {
                        if (typeof v === 'boolean')
                            values.isActive = v;
                    }}
                    disabled={isSubmitting}
                />
                <Label
                    for='service-account-active'
                    class='text-sm font-medium text-gray-700'
                >
                    Active
                </Label>
            </div>
        {/if}
    </div>
</FormSheet>
