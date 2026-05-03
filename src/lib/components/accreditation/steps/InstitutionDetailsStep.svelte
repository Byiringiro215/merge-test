<script lang='ts'>
    import { BadgeCheck, Building, CheckCircle2, Loader, Mail, Package, Phone, Search, XCircle } from '@lucide/svelte';
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
    $effect.pre(() => {
        idValue = formData[idFieldLabel] ?? '';
    });
    let lookupState = $state<'idle' | 'checking' | 'found-new' | 'found-existing' | 'not-found'>('idle');
    let lookupTimer: ReturnType<typeof setTimeout> | null = null;

    const digitCount = $derived(idValue.replace(/\D/g, '').length);
    const showForm = $derived(lookupState === 'found-new');

    function handleIdInput(val: string) {
        idValue = val;
        setFormData({ ...formData, [idFieldLabel]: val });
        lookupState = 'idle';
        if (lookupTimer)
            clearTimeout(lookupTimer);

        const digits = val.replace(/\D/g, '');
        if (digits.length === 16) {
            lookupState = 'checking';
            lookupTimer = setTimeout(() => {
                if (digits === '1111111111111111') {
                    // 16 ones -> found in both RRA and TDMP
                    lookupState = 'found-existing';
                    onLookup('existing');
                }
                else if (digits === '2222222222222222') {
                    // 16 twos -> found in RRA/SDMS only, not in TDMP
                    lookupState = 'found-new';
                    onLookup('new');
                }
                else {
                    // Any other 16 digits -> not found
                    lookupState = 'not-found';
                    onLookup('not-found');
                }
            }, 900);
        }
        else {
            onLookup('not-found');
        }
    }
</script>

<div class='flex flex-col gap-5'>
    <!-- ID lookup field -->
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
                oninput={e => handleIdInput(e.currentTarget.value)}
                placeholder={idFieldPlaceholder}
                maxlength={20}
                class={`w-full rounded-md border py-2.5 pl-9 pr-10 text-sm text-slate-700 outline-none placeholder:text-slate-400 transition-colors bg-white ${
                    lookupState === 'found-new' || lookupState === 'found-existing'
                        ? 'border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400/20'
                        : lookupState === 'not-found'
                        ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-400/20'
                        : 'border-slate-200 focus:border-[#336cb2] focus:ring-2 focus:ring-[#336cb2]/20'
                }`}
            />
            <span class='absolute inset-y-0 right-3 flex items-center'>
                {#if lookupState === 'checking'}
                    <Loader class='h-4 w-4 text-slate-400 animate-spin' />
                {:else if lookupState === 'found-new' || lookupState === 'found-existing'}
                    <CheckCircle2 class='h-4 w-4 text-emerald-500' />
                {:else if lookupState === 'not-found'}
                    <XCircle class='h-4 w-4 text-red-500' />
                {:else}
                    <span class='text-[11px] font-medium text-slate-400 tabular-nums'>{digitCount}/16</span>
                {/if}
            </span>
        </div>

        <!-- Status messages -->
        {#if lookupState === 'checking'}
            <p class='text-[11.5px] text-slate-400'>Checking records…</p>
        {:else if lookupState === 'found-new'}
            <p class='text-[11.5px] text-emerald-600 font-medium'>✓ Found in RRA/SDMS. Fill in institution details below to continue accreditation.</p>
        {:else if lookupState === 'found-existing'}
            <div class='flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 mt-1'>
                <BadgeCheck class='h-4 w-4 text-amber-500 mt-0.5 shrink-0' />
                <div>
                    <p class='text-[12px] font-semibold text-amber-700'>Already accredited in TDMP</p>
                    <p class='text-[11.5px] text-amber-600 mt-0.5'>This institution is already registered in both RRA/SDMS and TDMP. Click below to go to your dashboard.</p>
                </div>
            </div>
        {:else if lookupState === 'not-found'}
            <p class='text-[11.5px] text-red-500 font-medium'>✗ No record found. Please verify your {idFieldLabel} and try again.</p>
        {:else}
            <p class='text-[11.5px] text-slate-400'>Enter 16 digits to verify your institution</p>
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
