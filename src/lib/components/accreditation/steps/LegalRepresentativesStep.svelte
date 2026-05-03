<script lang='ts'>
    import type { LegalRep } from '../types_internal';
    import { CheckCircle2, Loader, Mail, Pencil, Phone, Search, Trash2, User, UserPlus, XCircle } from '@lucide/svelte';
    import FormInput from '../form-fields/FormInput.svelte';
    import FormPhone from '../form-fields/FormPhone.svelte';
    import FormSelect from '../form-fields/FormSelect.svelte';

    interface Props {
        legalReps: LegalRep[];
        setLegalReps: (reps: LegalRep[]) => void;
    }

    const { legalReps, setLegalReps }: Props = $props();

    let nationalId = $state('');
    let lookupState = $state<'idle' | 'checking' | 'found' | 'not-found'>('idle');
    let lookupTimer: ReturnType<typeof setTimeout> | null = null;
    let editingIdx = $state<number | null>(null);
    let newRep = $state<LegalRep>({
        firstName: '',
        lastName: '',
        position: '',
        gender: 'Male',
        email: '',
        phone: '',
    });

    const digitCount = $derived(nationalId.replace(/\D/g, '').length);
    const showForm = $derived(lookupState === 'found' || editingIdx !== null);

    const canAdd = $derived(!!newRep.firstName && !!newRep.lastName && !!newRep.position && !!newRep.email);
    const isEditing = $derived(editingIdx !== null);

    function handleIdInput(val: string) {
        nationalId = val;
        lookupState = 'idle';
        if (lookupTimer)
            clearTimeout(lookupTimer);
        const digits = val.replace(/\D/g, '');
        if (digits.length === 16) {
            lookupState = 'checking';
            lookupTimer = setTimeout(() => {
                // 16 threes -> valid/found
                lookupState = digits === '3333333333333333' ? 'found' : 'not-found';
            }, 800);
        }
    }

    function handleAdd() {
        if (!canAdd)
            return;
        if (isEditing) {
            const updated = [...legalReps];
            updated[editingIdx!] = { ...newRep };
            setLegalReps(updated);
            editingIdx = null;
        }
        else {
            setLegalReps([...legalReps, { ...newRep }]);
        }
        newRep = { firstName: '', lastName: '', position: '', gender: 'Male', email: '', phone: '' };
        if (lookupState === 'found') {
            nationalId = '';
            lookupState = 'idle';
        }
    }

    function handleEdit(idx: number) {
        newRep = { ...legalReps[idx] };
        editingIdx = idx;
        nationalId = '';
    }

    function handleCancelEdit() {
        newRep = { firstName: '', lastName: '', position: '', gender: 'Male', email: '', phone: '' };
        editingIdx = null;
    }

    function handleRemove(idx: number) {
        if (editingIdx === idx)
            handleCancelEdit();
        setLegalReps(legalReps.filter((_, i) => i !== idx));
    }
</script>

<div class='space-y-5'>
    <!-- National ID Search -->
    <div class='flex flex-col gap-1.5'>
        <label for='national-id' class='text-[13px] font-medium text-slate-700'>
            National ID <span class='text-red-500'>*</span>
        </label>
        <div class='relative'>
            <span class='pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400'>
                <Search class='h-4 w-4' />
            </span>
            <input
                id='national-id'
                type='text'
                value={nationalId}
                oninput={e => handleIdInput(e.currentTarget.value)}
                placeholder='Enter 16-digit national ID'
                maxlength={20}
                class={`w-full rounded-md border py-2.5 pl-9 pr-10 text-sm text-slate-700 outline-none placeholder:text-slate-400 transition-colors bg-white ${
                    lookupState === 'found'
                        ? 'border-emerald-400 focus:ring-2 focus:ring-emerald-400/20'
                        : lookupState === 'not-found'
                        ? 'border-red-400 focus:ring-2 focus:ring-red-400/20'
                        : 'border-slate-200 focus:border-[#336cb2] focus:ring-2 focus:ring-[#336cb2]/20'
                }`}
            />
            <span class='absolute inset-y-0 right-3 flex items-center'>
                {#if lookupState === 'checking'}
                    <Loader class='h-4 w-4 text-slate-400 animate-spin' />
                {:else if lookupState === 'found'}
                    <CheckCircle2 class='h-4 w-4 text-emerald-500' />
                {:else if lookupState === 'not-found'}
                    <XCircle class='h-4 w-4 text-red-500' />
                {:else}
                    <span class='text-[11px] font-medium text-slate-400 tabular-nums'>{digitCount}/16</span>
                {/if}
            </span>
        </div>
        {#if lookupState === 'checking'}
            <p class='text-[11.5px] text-slate-400'>Searching for record…</p>
        {:else if lookupState === 'found'}
            <p class='text-[11.5px] text-emerald-600 font-medium'>✓ Record found. Fill in the details below.</p>
        {:else if lookupState === 'not-found'}
            <p class='text-[11.5px] text-red-500 font-medium'>✗ No record found for this ID. Please check and try again.</p>
        {:else}
            <p class='text-[11.5px] text-slate-400'>Enter 16 digits to look up representative details</p>
        {/if}
    </div>

    {#if showForm}
        <div class='rounded-xl border border-slate-200 bg-slate-50/40 p-4 space-y-3'>
            <div class='flex items-center justify-between'>
                <p class='text-[12px] font-semibold text-slate-500 uppercase tracking-wide'>
                    {isEditing ? 'Edit Representative' : 'Representative Details'}
                </p>
                {#if isEditing}
                    <button
                        type='button'
                        onclick={handleCancelEdit}
                        class='text-[12px] font-medium text-slate-500 hover:text-slate-700 transition cursor-pointer'
                    >
                        Cancel
                    </button>
                {/if}
            </div>

            <div class='grid gap-x-4 gap-y-3 md:grid-cols-2'>
                <FormInput
                    label='First Name'
                    value={newRep.firstName}
                    onChange={v => (newRep = { ...newRep, firstName: v })}
                    placeholder='e.g. John'
                    required
                    icon={User}
                />
                <FormInput
                    label='Last Name'
                    value={newRep.lastName}
                    onChange={v => (newRep = { ...newRep, lastName: v })}
                    placeholder='e.g. Doe'
                    required
                    icon={User}
                />
                <FormSelect
                    label='Position in Institution'
                    value={newRep.position}
                    onChange={v => (newRep = { ...newRep, position: v })}
                    required
                    options={[
                        { label: 'Director General', value: 'Director General' },
                        { label: 'Principal', value: 'Principal' },
                        { label: 'Legal Advisor', value: 'Legal Advisor' },
                        { label: 'Manager', value: 'Manager' },
                    ]}
                />
                <FormSelect
                    label='Gender'
                    value={newRep.gender}
                    onChange={v => (newRep = { ...newRep, gender: v })}
                    required
                    options={[
                        { label: 'Male', value: 'Male' },
                        { label: 'Female', value: 'Female' },
                    ]}
                />
                <FormInput
                    label='Email'
                    value={newRep.email}
                    onChange={v => (newRep = { ...newRep, email: v })}
                    placeholder='e.g: rep@example.com'
                    type='email'
                    required
                    icon={Mail}
                    class='md:col-span-2'
                />
                <FormPhone
                    label='Phone Number'
                    value={newRep.phone}
                    onChange={v => (newRep = { ...newRep, phone: v })}
                    icon={Phone}
                    class='md:col-span-2'
                />
            </div>

            <button
                type='button'
                onclick={handleAdd}
                disabled={!canAdd}
                class='mt-1 flex items-center gap-2 rounded-md bg-[#336cb2] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2a5a96] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer'
            >
                <UserPlus class='h-4 w-4' />
                {isEditing ? 'Update Representative' : 'Add Representative'}
            </button>
        </div>
    {/if}

    <!-- Live list of added reps -->
    {#if legalReps.length > 0}
        <div class='space-y-2.5'>
            <p class='text-[12px] font-semibold text-slate-500 uppercase tracking-wide'>
                Added ({legalReps.length})
            </p>
            {#each legalReps as rep, idx (idx)}
                <div
                    class={`flex items-start gap-3 rounded-xl border bg-white p-4 shadow-sm transition-colors ${editingIdx === idx ? 'border-[#336cb2]/50 ring-1 ring-[#336cb2]/30' : 'border-slate-200'}`}
                >
                    <!-- Avatar -->
                    <div class='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#336cb2]/10 text-[14px] font-semibold text-[#336cb2] uppercase'>
                        {rep.firstName?.[0] ?? '?'}{rep.lastName?.[0] ?? '?'}
                    </div>

                    <!-- Details -->
                    <div class='flex-1 min-w-0 space-y-0.5'>
                        <p class='text-[13.5px] font-semibold text-slate-800 leading-tight'>
                            {rep.firstName} {rep.lastName}
                        </p>
                        <p class='text-[12px] text-slate-500'>{rep.position} · {rep.gender}</p>
                        <p class='text-[12px] text-slate-500'>{rep.email}</p>
                        {#if rep.phone}
                            <p class='text-[12px] text-slate-400'>+250 {rep.phone}</p>
                        {/if}
                    </div>

                    <!-- Actions -->
                    <div class='flex items-center gap-2 mt-0.5 shrink-0'>
                        <button
                            type='button'
                            onclick={() => handleEdit(idx)}
                            class='text-slate-400 hover:text-[#336cb2] transition-colors cursor-pointer'
                            title='Edit'
                        >
                            <Pencil class='h-4 w-4' />
                        </button>
                        <button
                            type='button'
                            onclick={() => handleRemove(idx)}
                            class='text-slate-300 hover:text-red-500 transition-colors cursor-pointer'
                            title='Remove'
                        >
                            <Trash2 class='h-4 w-4' />
                        </button>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>
