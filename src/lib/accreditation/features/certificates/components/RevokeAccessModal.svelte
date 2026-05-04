<script lang='ts'>
    import { AlertTriangle } from '@lucide/svelte';

    const { isOpen, onClose, onConfirm, applicantName = '', tradeName = '' } = $props<{
        isOpen: boolean;
        onClose: () => void;
        onConfirm: (reason: string) => void;
        applicantName: string;
        tradeName: string;
    }>();

    let reason = $state('');

    function handleClose() {
        reason = '';
        onClose();
    }

    function handleConfirm() {
        if (!reason.trim())
            return;
        onConfirm(reason.trim());
        reason = '';
        onClose();
    }
</script>

{#if isOpen}
    <div class='fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50'>
        <div class='w-full max-w-md rounded-lg bg-white shadow-xl'>
            <div class='space-y-4 p-6'>
                <div class='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50'>
                    <AlertTriangle class='h-6 w-6 text-red-600' />
                </div>

                <div class='space-y-1 text-center'>
                    <h3 class='text-lg font-semibold text-slate-900'>Revoke Certificate Access</h3>
                    <p class='text-sm text-slate-600'>
                        Revoking access for <span class='font-medium text-slate-900'>{applicantName}</span>
                        — <span class='font-medium text-slate-900'>{tradeName}</span>
                    </p>
                </div>

                <div class='space-y-1.5'>
                    <label for='revocation-reason' class='text-[13px] font-medium text-slate-700'>
                        Reason for Revocation <span class='text-red-500'>*</span>
                    </label>
                    <textarea
                        id='revocation-reason'
                        bind:value={reason}
                        placeholder='Explain the reason for revoking certificate access...'
                        class='min-h-[100px] w-full resize-none rounded-sm border border-slate-200 p-3 text-[13px] transition-all focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-500/20'
                    ></textarea>
                    <p class='text-[11px] text-slate-400'>This reason will be recorded and shared with the applicant.</p>
                </div>

                <p class='text-center text-xs font-medium text-red-600'>
                    This action will prevent the applicant from downloading their certificate.
                </p>

                <div class='flex items-center gap-3'>
                    <button
                        onclick={handleClose}
                        class='flex-1 cursor-pointer rounded-sm border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50'
                    >
                        Cancel
                    </button>
                    <button
                        onclick={handleConfirm}
                        disabled={!reason.trim()}
                        class='flex-1 cursor-pointer rounded-sm bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 hover:bg-red-700'
                    >
                        Revoke Access
                    </button>
                </div>
            </div>
        </div>
    </div>
{/if}
