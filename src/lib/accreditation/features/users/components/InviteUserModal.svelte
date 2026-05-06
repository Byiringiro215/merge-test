<script lang='ts'>
    import FormInput from '$lib/components/accreditation/ui/FormInput.svelte';
    import FormSelect from '$lib/components/accreditation/ui/FormSelect.svelte';
    import { Mail, UserPlus, X } from '@lucide/svelte';

    const {
        isOpen,
        onClose,
        onInvite,
        defaultRole,
        variant = 'full',
        title,
        description,
    } = $props<{
        isOpen: boolean;
        onClose: () => void;
        onInvite: (userData: any) => void;
        defaultRole?: string;
        variant?: 'full' | 'simple';
        title?: string;
        description?: string;
    }>();

    let formData = $state({
        firstName: '',
        lastName: '',
        email: '',
        role: '',
    });

    $effect(() => {
        formData.role = defaultRole || '';
    });

    function handleSubmit(e: Event) {
        e.preventDefault();
        onInvite(formData);
        onClose();
        formData = { firstName: '', lastName: '', email: '', role: defaultRole || '' };
    }

    const roleOptions = [
        { label: 'Supervisor', value: 'Supervisor' },
        { label: 'Curriculum evaluator', value: 'Curriculum evaluator' },
        { label: 'Evaluator', value: 'Evaluator' },
    ];

    const defaultTitle = 'Invite User';
    const defaultDescription = $derived(
        variant === 'full'
            ? 'Invited users will receive access to manage applications and perform evaluations.'
            : 'Invited users will receive access to evaluate applications and perform site visits.',
    );
</script>

{#if isOpen}
    <div class='fixed inset-0 z-100 flex items-center justify-center bg-slate-900/80 p-4 font-sans transition-opacity'>
        <div class='duration-200 animate-in fade-in zoom-in w-full max-w-lg overflow-hidden rounded-sm bg-white'>
            <!-- Header -->
            <div class='flex items-start justify-between border-b border-slate-100 p-6'>
                <div class='flex items-start gap-4'>
                    <div class='mt-2 flex h-10 w-13 shrink-0 items-center justify-center rounded-sm border border-slate-100'>
                        <UserPlus class='h-5 w-5 text-[#2069C1]' />
                    </div>
                    <div>
                        <h3 class='text-lg font-medium text-[#323539]'>{title || defaultTitle}</h3>
                        <p class='text-sm text-[#858C95]'>
                            {description || defaultDescription}
                        </p>
                    </div>
                </div>
                <button
                    onclick={onClose}
                    class='mt-2 h-10 cursor-pointer rounded-sm p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600'
                >
                    <X class='h-5 w-5' />
                </button>
            </div>

            <!-- Form -->
            <form onsubmit={handleSubmit} class='space-y-6 p-6'>
                {#if variant === 'full'}
                    <div class='grid grid-cols-2 gap-4'>
                        <FormInput
                            label='First Name'
                            bind:value={formData.firstName}
                            placeholder='First name'
                            required
                        />
                        <FormInput
                            label='Last Name'
                            bind:value={formData.lastName}
                            placeholder='Last name'
                            required
                        />
                    </div>

                    <FormInput
                        label='Email'
                        bind:value={formData.email}
                        placeholder='Enter his/her email'
                        type='email'
                        required
                        icon={Mail}
                    />

                    <FormSelect
                        label='Role'
                        bind:value={formData.role}
                        options={roleOptions}
                        placeholder='Select a role'
                        required
                    />
                {:else}
                    <div class='space-y-4'>
                        <div class='space-y-2'>
                            <label for='email' class='text-sm font-medium text-slate-700'>Email</label>
                            <div class='relative'>
                                <input
                                    id='email'
                                    placeholder='Enter his/her email'
                                    required
                                    class='mt-2 w-full rounded-sm border border-slate-200 bg-white py-3 pl-4 pr-12 text-sm transition-all focus:border-[#2069C1] focus:outline-none focus:ring-2 focus:ring-[#2069C1]/10'
                                    type='email'
                                    bind:value={formData.email}
                                />
                                <Mail class='absolute right-4 top-1/2 mt-1 h-4 w-4 -translate-y-1/2 text-slate-400' />
                            </div>
                        </div>

                        <FormSelect
                            label='Role'
                            bind:value={formData.role}
                            options={roleOptions}
                            placeholder='Select a role'
                            required
                        />
                    </div>
                {/if}

                <p class='text-xs italic text-slate-400'>He/she will receive an invitation email</p>

                <div class='flex items-center gap-3 pt-2'>
                    <button
                        type='button'
                        onclick={onClose}
                        class='flex-1 cursor-pointer rounded-sm border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50'
                    >
                        Exit
                    </button>
                    <button
                        type='submit'
                        class='active:scale-[0.98] flex-1 cursor-pointer rounded-sm bg-[#2069C1] py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#0966ff]'
                    >
                        Invite
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}
