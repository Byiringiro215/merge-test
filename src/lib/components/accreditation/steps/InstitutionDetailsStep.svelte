<script lang='ts'>
    import { BadgeCheck, Building, CreditCard, Mail, Package, Phone, Search } from '@lucide/svelte';
    import FormInput from '../form-fields/FormInput.svelte';
    import FormPhone from '../form-fields/FormPhone.svelte';

    interface Props {
        providerType: string;
        formData: Record<string, string>;
        setFormData: (data: Record<string, string>) => void;
        onLookup: (status: 'new' | 'existing' | 'not-found') => void;
    }

    const { providerType, formData, setFormData, onLookup }: Props = $props();

    const idFieldLabel = $derived(providerType === 'School' ? 'SDMS Code' : 'TIN Number');
    const idFieldPlaceholder = $derived(providerType === 'School'
        ? 'Enter 16-digit SDMS code'
        : 'Enter 16-digit TIN number');

    let idValue = $state('');
    let ownerId = $state('');
    let lookupEmail = $state('');

    $effect.pre(() => {
        idValue = formData[idFieldLabel] ?? '';
        ownerId = formData.representativeId ?? '';
        lookupEmail = formData.lookupEmail ?? '';
    });

    $effect(() => {
        if (idValue && ownerId && lookupEmail) {
            triggerLookup();
        }
    });

    let lookupState = $state<'idle' | 'checking' | 'found-new' | 'found-existing' | 'not-found'>('idle');
    let lookupTimer: ReturnType<typeof setTimeout> | null = null;

    const showForm = $derived(lookupState === 'found-new');

    function triggerLookup() {
        lookupState = 'idle';
        if (lookupTimer)
            clearTimeout(lookupTimer);

        const digits = idValue.replace(/\D/g, '');
        const ownerDigits = ownerId.replace(/\D/g, '');

        const canVerify = providerType === 'School'
            ? digits.length === 16
            : (digits.length === 16 && ownerDigits.length >= 16 && lookupEmail.includes('@'));

        if (canVerify) {
            lookupState = 'checking';
            lookupTimer = setTimeout(() => {
                if (digits === '1111111111111111') {
                    lookupState = 'found-existing';
                    onLookup('existing');
                }
                else if (digits === '2222222222222222' && (providerType === 'School' || (ownerDigits === '22222222222222222' && lookupEmail.includes('@')))) {
                    lookupState = 'found-new';
                    onLookup('new');
                }
                else {
                    lookupState = 'not-found';
                    onLookup('not-found');
                }
            }, 1200);
        }
        else {
            onLookup('not-found');
        }
    }

    function updateField(field: string, val: string) {
        if (field === 'tin') {
            idValue = val;
            setFormData({ ...formData, [idFieldLabel]: val });
        }
        else if (field === 'ownerId') {
            ownerId = val;
            setFormData({ ...formData, representativeId: val });
        }
        else if (field === 'email') {
            lookupEmail = val;
            setFormData({ ...formData, lookupEmail: val });
        }
        triggerLookup();
    }
</script>

<div class='flex flex-col gap-5'>
    <!-- Combined lookup fields -->
    <div class='space-y-4'>
        <div class='flex flex-col gap-1.5'>
            <label for='id-lookup' class='text-[13px] font-medium text-slate-700'>
                {idFieldLabel} <span class='text-red-500'>*</span>
            </label>
            <div class='relative'>
                <span class='pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400'>
                    <Search class='h-4 w-4' />
                </span>
                <input
                    id='id-lookup'
                    type='text'
                    value={idValue}
                    oninput={e => updateField('tin', e.currentTarget.value)}
                    placeholder={idFieldPlaceholder}
                    maxlength={20}
                    class={`w-full rounded-sm border py-2.5 pl-9 pr-10 text-sm text-slate-700 outline-none transition-colors bg-white ${
                        lookupState === 'found-new' || lookupState === 'found-existing'
                            ? 'border-emerald-400 focus:ring-emerald-400/20'
                            : lookupState === 'not-found'
                            ? 'border-red-400 focus:ring-red-400/20'
                            : 'border-slate-200 focus:border-[#336cb2] focus:ring-[#336cb2]/20'
                    }`}
                />
            </div>
        </div>

        {#if providerType !== 'School'}
            <div class='flex flex-col gap-1.5'>
                <label for='owner-id' class='text-[13px] font-medium text-slate-700'>
                    Owner National ID <span class='text-red-500'>*</span>
                </label>
                <div class='relative'>
                    <span class='pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400'>
                        <CreditCard class='h-4 w-4' />
                    </span>
                    <input
                        id='owner-id'
                        type='text'
                        value={ownerId}
                        oninput={e => updateField('ownerId', e.currentTarget.value)}
                        placeholder='Enter 17-digit owner ID'
                        maxlength={20}
                        class='w-full rounded-sm border border-slate-200 py-2.5 pl-9 pr-10 text-sm text-slate-700 outline-none focus:border-[#336cb2] focus:ring-[#336cb2]/20'
                    />
                </div>
            </div>

            <div class='flex flex-col gap-1.5'>
                <label for='lookup-email' class='text-[13px] font-medium text-slate-700'>
                    Owner Email Address <span class='text-red-500'>*</span>
                </label>
                <div class='relative'>
                    <span class='pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400'>
                        <Mail class='h-4 w-4' />
                    </span>
                    <input
                        id='lookup-email'
                        type='email'
                        value={lookupEmail}
                        oninput={e => updateField('email', e.currentTarget.value)}
                        placeholder='owner@example.com'
                        class='w-full rounded-sm border border-slate-200 py-2.5 pl-9 pr-10 text-sm text-slate-700 outline-none focus:border-[#336cb2] focus:ring-[#336cb2]/20'
                    />
                </div>
            </div>
        {/if}

        <!-- Status messages -->
        {#if lookupState === 'checking'}
            <p class='text-[11.5px] text-slate-400'>Verifying all credentials…</p>
        {:else if lookupState === 'found-new'}
            <p class='text-[11.5px] text-emerald-600 font-medium'>✓ All credentials verified. Please complete the institution profile below.</p>
        {:else if lookupState === 'found-existing'}
            <div class='flex items-start gap-2 rounded-sm border border-amber-200 bg-amber-50 px-3 py-2.5 mt-1'>
                <BadgeCheck class='h-4 w-4 text-amber-500 mt-0.5 shrink-0' />
                <div>
                    <p class='text-[12px] font-semibold text-amber-700'>Already accredited in TDMP</p>
                    <p class='text-[11.5px] text-amber-600 mt-0.5'>This institution is already registered. Click below to go to your dashboard.</p>
                </div>
            </div>
        {:else if lookupState === 'not-found'}
            <p class='text-[11.5px] text-red-500 font-medium'>✗ Verification failed. Please ensure TIN, Owner ID, and Email are correct.</p>
        {:else}
            <p class='text-[11.5px] text-slate-400'>Provide TIN, Owner ID, and Email to verify and continue.</p>
        {/if}
    </div>

    <!-- Form — only for new institutions -->
    {#if showForm}
        <div class='grid gap-x-4 gap-y-4 md:grid-cols-2'>
            <FormInput
                label='Name of Institution'
                value={formData['Name of Institution'] ?? ''}
                onChange={v => setFormData({ ...formData, 'Name of Institution': v })}
                placeholder='e.g. Sina Gerard Rwanda'
                required
                icon={Building}
                class='md:col-span-2'
            />
            <FormInput
                label='P.O Box'
                value={formData['P.O Box'] ?? ''}
                onChange={v => setFormData({ ...formData, 'P.O Box': v })}
                placeholder='e.g. P.O. Box 1234, Kigali'
                icon={Package}
                class='md:col-span-2'
            />
            <FormInput
                label='Email'
                value={formData.Email ?? ''}
                onChange={v => setFormData({ ...formData, Email: v })}
                placeholder='e.g: company@example.com'
                type='email'
                required
                icon={Mail}
                class='md:col-span-2'
            />
            <FormPhone
                label='Phone Number'
                value={formData['Phone Number'] ?? ''}
                onChange={v => setFormData({ ...formData, 'Phone Number': v })}
                required
                icon={Phone}
                class='md:col-span-2'
            />
        </div>
    {/if}
</div>
