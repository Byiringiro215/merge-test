<script lang='ts'>
    import { CheckCheck, CheckCircle2, Mail, User, UserPlus, X } from '@lucide/svelte';

    const {
        role,
        application,
        assignedPrincipal,
        setActiveMajorStep,
    } = $props<{
        role: 'super-admin' | 'evaluator' | 'supervisor';
        application: any;
        assignedPrincipal: string | null;
        setActiveMajorStep: (step: number) => void;
    }>();

    let showInviteModal = $state(false);
    let invitationStatus = $state<'idle' | 'pending' | 'sent'>('idle');
    let supervisorEmail = $state('');

    function handleInviteSupervisor() {
        if (!supervisorEmail)
            return;
        invitationStatus = 'pending';
        setTimeout(() => {
            invitationStatus = 'sent';
            showInviteModal = false;
            supervisorEmail = '';
        }, 1000);
    }
</script>

<div class='w-full py-8 px-0 flex flex-col items-start relative'>
    {#if role === 'supervisor'}
        <!-- Supervisor View -->
        <div class='w-full max-w-2xl mx-auto space-y-6'>
            <div class='text-center mb-8'>
                <div class='h-16 w-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-4'>
                    <CheckCircle2 class='h-8 w-8 text-blue-500' />
                </div>
                <h2 class='text-xl font-semibold text-slate-900 mb-2'>Evaluation Complete</h2>
                <p class='text-sm text-slate-500'>Review the evaluation results and grant certificate access</p>
            </div>

            <div class='bg-slate-50 border border-slate-200 rounded-lg p-6 space-y-4'>
                <div class='flex items-center justify-between'>
                    <span class='text-sm text-slate-700'>Application Status</span>
                    <div class='flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full'>
                        <CheckCheck class='h-4 w-4 text-blue-600' />
                        <span class='text-sm text-blue-600'>Approved</span>
                    </div>
                </div>
                <div class='grid grid-cols-2 gap-4 pt-2'>
                    <div>
                        <span class='text-xs text-slate-500'>Institution</span>
                        <p class='text-sm text-slate-900'>{application.institution.name}</p>
                    </div>
                    <div>
                        <span class='text-xs text-slate-500'>Trade</span>
                        <p class='text-sm text-slate-900'>{application.trade.name}</p>
                    </div>
                    <div>
                        <span class='text-xs text-slate-500'>Evaluation Date</span>
                        <p class='text-sm text-slate-900'>{new Date().toLocaleDateString()}</p>
                    </div>
                    <div>
                        <span class='text-xs text-slate-500'>Principal Evaluator</span>
                        <p class='text-sm text-slate-900'>{assignedPrincipal || 'Not Assigned'}</p>
                    </div>
                </div>
            </div>

            <div class='bg-white border border-slate-200 rounded-lg p-6 space-y-4'>
                <h3 class='text-sm font-semibold text-slate-900'>Certificate Access Control</h3>
                <p class='text-sm text-slate-600'>Grant the applicant access to download their accreditation certificate.</p>
                <div class='flex items-center gap-4 pt-4'>
                    <button
                        onclick={() => console.warn('Certificate access granted successfully!')}
                        class='flex-1 py-3 bg-blue-600 text-white rounded-sm text-sm hover:bg-blue-700 transition-colors cursor-pointer flex items-center justify-center gap-2'
                    >
                        <CheckCircle2 class='h-4 w-4' />
                        Grant Certificate Access
                    </button>
                </div>
            </div>

            <div class='flex items-center gap-4'>
                <button
                    onclick={() => window.history.back()}
                    class='flex-1 py-3 border border-slate-200 rounded-sm text-sm text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer'
                >
                    Back to Applications
                </button>
            </div>
        </div>
    {:else}
        <!-- Super-Admin / Evaluator View -->
        <div class='w-full flex gap-12 text-left flex-col lg:flex-row px-6'>
            <!-- Left Column -->
            <div class='w-full lg:w-[450px] shrink-0 flex flex-col gap-6'>
                <span class='text-sm text-slate-500'>Evaluation Decision</span>

                <button
                    onclick={() => showInviteModal = true}
                    class='border border-dashed rounded-sm p-4 w-full transition-colors cursor-pointer group border-slate-200 hover:bg-slate-50 text-left'
                >
                    <div class='flex items-center gap-3 w-full'>
                        <div class='h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors shrink-0'>
                            <UserPlus class='h-4 w-4 text-slate-400' />
                        </div>
                        <div class='text-left flex-1'>
                            <div class='flex items-center gap-2'>
                                <h4 class='text-[13px] text-slate-900'>Supervisor</h4>
                                {#if invitationStatus === 'sent'}
                                    <span class='text-[10px] px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-full'>Invited</span>
                                {:else if invitationStatus === 'pending'}
                                    <span class='text-[10px] px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded-full'>Sending...</span>
                                {/if}
                            </div>
                            <p class='text-[11px] text-slate-400 leading-tight'>Final reviewer & decision maker</p>
                        </div>
                    </div>
                </button>

                <div class='flex items-center gap-4 w-full mt-2'>
                    <button onclick={() => setActiveMajorStep(3)} class='flex-1 py-2.5 border border-slate-200 rounded-sm text-sm text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer'>Cancel</button>
                    <button
                        onclick={() => console.warn('Confirm decision')}
                        disabled={invitationStatus !== 'sent'}
                        class='flex-1 py-2.5 bg-[#0A77FF] text-white rounded-sm text-sm hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        Confirm
                    </button>
                </div>
            </div>

            <!-- Right Column -->
            <div class='flex-1 flex flex-col gap-6'>
                <div class='flex items-center gap-3'>
                    <div class='h-10 w-10 shrink-0 bg-slate-50 rounded-full flex items-center justify-center border border-slate-200'>
                        <User class='h-4 w-4 text-slate-400' strokeWidth={2} />
                    </div>
                    <div class='flex flex-col'>
                        <span class='text-[11px] text-slate-500 leading-tight'>Submitted by</span>
                        <span class='text-[13px] text-slate-900 leading-tight'>John Smith</span>
                    </div>
                </div>
                <div class='grid grid-cols-2 gap-4 mt-2'>
                    <div class='flex items-center gap-3'>
                        <div class='h-10 w-10 shrink-0 bg-transparent rounded-full flex items-center justify-center overflow-hidden border border-slate-100'>
                            <img src='https://ui-avatars.com/api/?name={application.institution.name}&background=FF8A65&color=fff&rounded=true' alt='logo' class='h-full w-full object-cover' />
                        </div>
                        <div class='flex flex-col'>
                            <span class='text-[13px] text-slate-900 leading-tight'>{application.institution.name}</span>
                            <span class='text-[11px] text-slate-500'>{application.institution.email || application.institution.website || ''}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>

<!-- Invite Supervisor Modal -->
{#if showInviteModal}
    <div class='fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 p-4 transition-opacity'>
        <div class='w-full max-w-lg bg-white rounded-sm overflow-hidden'>
            <div class='flex items-start justify-between p-6 border-b border-slate-100'>
                <div class='flex items-start gap-4'>
                    <div class='h-10 w-10 mt-2 rounded-sm border border-slate-100 flex items-center justify-center shrink-0'>
                        <UserPlus class='h-5 w-5 text-[#0A77FF]' strokeWidth={1.5} />
                    </div>
                    <div>
                        <h3 class='text-lg text-[#323539]'>Invite Supervisor</h3>
                        <p class='text-sm text-[#858C95]'>Invited supervisors will receive access to review evaluation results and grant certificates.</p>
                    </div>
                </div>
                <button onclick={() => showInviteModal = false} class='p-2 cursor-pointer h-10 mt-2 hover:bg-slate-100 rounded-sm transition-colors text-slate-400 hover:text-slate-600'>
                    <X class='h-5 w-5' />
                </button>
            </div>
            <div class='p-6 space-y-6'>
                <div class='space-y-2'>
                    <label for='supervisor-email' class='text-sm text-slate-700 font-medium'>Email</label>
                    <div class='relative'>
                        <input
                            id='supervisor-email'
                            type='email'
                            placeholder='Enter his/her email'
                            bind:value={supervisorEmail}
                            class='w-full pl-4 pr-12 py-3 bg-white border mt-2 border-slate-200 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#0A77FF]/10 focus:border-[#0A77FF] transition-all'
                        />
                        <Mail class='absolute right-4 top-1/2 mt-1 -translate-y-1/2 h-4 w-4 text-slate-400' />
                    </div>
                </div>
                <p class='text-xs text-slate-400 italic'>He/she will receive an invitation email</p>
                <div class='flex items-center gap-3 pt-2'>
                    <button onclick={() => showInviteModal = false} class='flex-1 py-2.5 text-sm cursor-pointer text-slate-700 bg-white border border-slate-200 rounded-sm hover:bg-slate-50 transition-colors'>Exit</button>
                    <button onclick={handleInviteSupervisor} disabled={!supervisorEmail} class='flex-1 py-2.5 text-sm cursor-pointer text-white bg-[#0A77FF] rounded-sm hover:bg-[#0966ff] transition-colors shadow-sm disabled:opacity-50'>Invite</button>
                </div>
            </div>
        </div>
    </div>
{/if}
