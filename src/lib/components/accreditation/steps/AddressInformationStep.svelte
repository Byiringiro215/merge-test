<script lang='ts'>
    import { MapPin } from '@lucide/svelte';
    import FormInput from '../form-fields/FormInput.svelte';
    import FormSelect from '../form-fields/FormSelect.svelte';

    interface Props {
        formData: Record<string, string>;
        setFormData: (data: Record<string, string>) => void;
    }

    const { formData, setFormData }: Props = $props();

    const locationFields = [
        { label: 'Province', req: true, fullWidth: false },
        { label: 'District', req: true, fullWidth: false },
        { label: 'Sector', req: true, fullWidth: false },
        { label: 'Cell', req: true, fullWidth: false },
        { label: 'Village', req: true, fullWidth: true },
    ];

    const locationOptions = [
        { label: 'Kigali City', value: 'Kigali City' },
        { label: 'Gasabo', value: 'Gasabo' },
        { label: 'Kicukiro', value: 'Kicukiro' },
        { label: 'Nyarugenge', value: 'Nyarugenge' },
        { label: 'Western Province', value: 'Western Province' },
    ];
</script>

<div class='grid gap-x-4 gap-y-4 md:grid-cols-2'>
    {#each locationFields as field (field.label)}
        <FormSelect
            label={field.label}
            value={formData[field.label] ?? ''}
            onChange={v => setFormData({ ...formData, [field.label]: v })}
            placeholder={`Select ${field.label.toLowerCase()}`}
            required={field.req}
            options={locationOptions}
            class={field.fullWidth ? 'md:col-span-2' : ''}
        />
    {/each}
    <FormInput
        label='Address Line'
        value={formData['Address Line'] ?? ''}
        onChange={v => setFormData({ ...formData, 'Address Line': v })}
        placeholder='e.g. KN 3 Rd, Nyarugenge, Kigali'
        icon={MapPin}
        class='md:col-span-2 pt-1'
    />
</div>
