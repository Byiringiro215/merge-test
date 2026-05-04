<script lang='ts'>
    import { CheckCircle2 } from '@lucide/svelte';

    const { isOpen, onClose, onConfirm, applicantName = '', tradeName = '' } = $props<{
        isOpen: boolean;
        onClose: () => void;
        onConfirm: () => void;
        applicantName: string;
        tradeName: string;
    }>();
</script>

{#if isOpen}
    <div class='fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50'>
        <div class='fade-in zoom-in w-full max-w-md animate-in rounded-lg bg-white shadow-xl duration-200'>
            <div class='space-y-4 p-6'>
                <div class='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50'>
                    <CheckCircle2 class='h-6 w-6 text-blue-600' />
                </div>

                <div class='space-y-2 text-center'>
                    <h3 class='text-lg font-semibold text-slate-900'>Grant Certificate Access</h3>
                    <p class='text-sm text-slate-600'>
                        Are you sure you want to grant certificate access to <span class='font-medium text-slate-900'>{applicantName}</span> for <span class='font-medium text-slate-900'>{tradeName}</span>?
                    </p>
                    <p class='text-xs text-slate-500'>
                        The applicant will be able to download their accreditation certificate.
                    </p>
                </div>

                <div class='flex items-center gap-3 pt-4'>
                    <button
                        onclick={onClose}
                        class='flex-1 cursor-pointer rounded-sm border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50'
                    >
                        Cancel
                    </button>
                    <button
                        onclick={() => {
                            onConfirm();
                            onClose();
                        }}
                        class='flex-1 cursor-pointer rounded-sm bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700'
                    >
                        Grant Access
                    </button>
                </div>
            </div>
        </div>
    </div>
{/if}
