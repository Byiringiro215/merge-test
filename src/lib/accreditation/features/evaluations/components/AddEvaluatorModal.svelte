<script lang='ts'>
    import { Mail, UserPlus, X } from '@lucide/svelte';

    const { onClose, onInvite, title = 'Add Evaluator' } = $props<{
        onClose: () => void;
        onInvite: (email: string) => void;
        title?: string;
    }>();

    let email = $state('');

    function handleSubmit(e: Event) {
        e.preventDefault();
        if (email) {
            onInvite(email);
            email = '';
        }
    }
</script>

<div class='fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 p-4 transition-opacity'>
    <div class='w-full max-w-lg bg-white rounded-sm overflow-hidden'>
        <div class='flex items-start justify-between p-6 border-b border-slate-100'>
            <div class='flex items-start gap-4'>
                <div class='h-10 w-10 mt-2 rounded-sm border border-slate-100 flex items-center justify-center shrink-0'>
                    <UserPlus class='h-5 w-5 text-[#0A77FF]' strokeWidth={1.5} />
                </div>
                <div>
                    <h3 class='text-lg text-[#323539]'>{title}</h3>
                    <p class='text-sm text-[#858C95]'>
                        Invited evaluators will receive access to evaluate applications and perform site visits.
                    </p>
                </div>
            </div>
            <button
                onclick={onClose}
                class='p-2 cursor-pointer h-10 mt-2 hover:bg-slate-100 rounded-sm transition-colors text-slate-400 hover:text-slate-600'
            >
                <X class='h-5 w-5' />
            </button>
        </div>

        <form onsubmit={handleSubmit} class='p-6 space-y-6'>
            <div class='space-y-2'>
                <label for='evaluator-email' class='text-sm text-slate-700'>Email</label>
                <div class='relative'>
                    <input
                        id='evaluator-email'
                        type='email'
                        placeholder='Enter your email'
                        required
                        bind:value={email}
                        class='w-full pl-4 pr-12 py-3 bg-white border mt-2 border-slate-200 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#0A77FF]/10 focus:border-[#0A77FF] transition-all'
                    />
                    <Mail class='absolute right-4 top-1/2 mt-1 -translate-y-1/2 h-4 w-4 text-slate-400' />
                </div>
                <p class='text-xs text-slate-400 italic'>He/she will receive an invitation email</p>
            </div>

            <div class='flex items-center gap-3'>
                <button
                    type='button'
                    onclick={onClose}
                    class='flex-1 py-2.5 text-sm cursor-pointer text-slate-700 bg-white border border-slate-200 rounded-sm hover:bg-slate-50 transition-colors'
                >
                    Exit
                </button>
                <button
                    type='submit'
                    class='flex-1 py-2.5 text-sm cursor-pointer text-white bg-[#0A77FF] rounded-sm hover:bg-[#0966ff] transition-colors shadow-sm'
                >
                    Invite
                </button>
            </div>
        </form>
    </div>
</div>
