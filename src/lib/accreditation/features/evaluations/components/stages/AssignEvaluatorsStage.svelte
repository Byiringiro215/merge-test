<script lang='ts'>
    import { cn } from '$lib/accreditation/utils/cn';
    import { CheckCircle2, Clock, UserPlus, Users } from '@lucide/svelte';

    const {
        assignedInitialPrincipal,
        assignedInitialSecondary1,
        assignedInitialSecondary2,
        assignedInitialPrincipalStatus,
        assignedInitialSecondary1Status,
        assignedInitialSecondary2Status,
        setPendingEvaluatorRole,
        setActiveMajorStep,
        setShowInitialReview,
        setIsEvaluating,
    } = $props<{
        assignedInitialPrincipal: string | null;
        assignedInitialSecondary1: string | null;
        assignedInitialSecondary2: string | null;
        assignedInitialPrincipalStatus: 'pending' | 'accepted' | null;
        assignedInitialSecondary1Status: 'pending' | 'accepted' | null;
        assignedInitialSecondary2Status: 'pending' | 'accepted' | null;
        setPendingEvaluatorRole: (role: string) => void;
        setActiveMajorStep: (step: number) => void;
        setShowInitialReview: (show: boolean) => void;
        setIsEvaluating: (evaluating: boolean) => void;
    }>();

    const isProceedDisabled = $derived(!assignedInitialPrincipal || !assignedInitialSecondary1 || !assignedInitialSecondary2);
</script>

<div class='max-w-5xl mx-auto py-12 px-6 w-full flex flex-col md:grid md:grid-cols-2 gap-12 items-stretch h-full'>
    <!-- Header -->
    <div class='order-1 md:col-start-1 md:row-start-1 flex flex-col items-center md:items-start text-center md:text-left pt-5'>
        <div class='h-12 w-12 rounded-sm border border-slate-100 flex items-center justify-center mb-6'>
            <Users class='h-6 w-6 text-slate-400' strokeWidth={1.5} />
        </div>
        <h2 class='text-xl text-slate-900 mb-1'>Assign Evaluators</h2>
        <p class='text-sm text-slate-500 mb-6'>
            Assign evaluators to the application. You can optionally review the documents before scheduling.
        </p>
    </div>

    <!-- Evaluator Cards -->
    <div class='order-2 md:col-start-2 md:row-start-1 md:row-span-2 w-full'>
        <div class='w-full space-y-4 mb-10'>
            <h4 class='text-sm text-slate-700'>Assign Evaluating Team</h4>

            <!-- Principal Evaluator -->
            <button
                class={cn(
                    'border rounded-sm p-4 w-full transition-colors cursor-pointer group text-left',
                    assignedInitialPrincipal ? 'border-[var(--primary)] bg-blue-50/10' : 'border-slate-200 bg-slate-50/50 hover:border-[#0A77FF]/50',
                )}
                onclick={() => setPendingEvaluatorRole('Initial Principal')}
            >
                <div class='flex items-center gap-3 w-full'>
                    <div class='h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0'>
                        {#if assignedInitialPrincipalStatus === 'accepted'}
                            <CheckCircle2 class='h-4 w-4 text-emerald-500' />
                        {:else if assignedInitialPrincipalStatus === 'pending'}
                            <Clock class='h-4 w-4 text-amber-500' />
                        {:else}
                            <UserPlus class='h-4 w-4 text-[#0A77FF]' />
                        {/if}
                    </div>
                    <div class='text-left flex-1'>
                        <h4 class='text-sm text-slate-900'>{assignedInitialPrincipal || 'Principal Evaluator'}</h4>
                        <p class='text-[11px] text-slate-400 leading-tight'>Lead evaluator & decision maker</p>
                    </div>
                </div>
                {#if assignedInitialPrincipalStatus === 'accepted'}
                    <div class='mt-3 pt-3 border-t border-slate-100'>
                        <div class='flex items-center justify-between mb-1'>
                            <span class='text-[10px] text-slate-400 font-medium'>Review Response</span>
                            <span class='text-[10px] text-emerald-600 font-bold uppercase tracking-wider'>Accept</span>
                        </div>
                        <p class='text-[11px] text-slate-500 italic'>"Documents look correct and complete."</p>
                    </div>
                {/if}
            </button>

            <!-- Secondary Evaluator 1 -->
            <button
                class={cn(
                    'border border-dashed rounded-sm p-4 w-full transition-colors cursor-pointer group text-left',
                    assignedInitialSecondary1 ? 'border-solid border-[var(--primary)] bg-blue-50/10' : 'border-slate-200 hover:bg-slate-50',
                )}
                onclick={() => setPendingEvaluatorRole('Initial Secondary 1')}
            >
                <div class='flex items-center gap-3 w-full'>
                    <div class='h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0'>
                        {#if assignedInitialSecondary1Status === 'accepted'}
                            <CheckCircle2 class='h-4 w-4 text-emerald-500' />
                        {:else if assignedInitialSecondary1Status === 'pending'}
                            <Clock class='h-4 w-4 text-amber-500' />
                        {:else}
                            <UserPlus class='h-4 w-4 text-slate-400' />
                        {/if}
                    </div>
                    <div class='text-left flex-1'>
                        <h4 class='text-[13px] text-slate-900'>{assignedInitialSecondary1 || 'Secondary Evaluator 1'}</h4>
                        <p class='text-[11px] text-slate-400 leading-tight'>Assistant & commenter</p>
                    </div>
                </div>
                {#if assignedInitialSecondary1Status === 'accepted'}
                    <div class='mt-3 pt-3 border-t border-slate-100'>
                        <div class='flex items-center justify-between mb-1'>
                            <span class='text-[10px] text-slate-400 font-medium'>Review Response</span>
                            <span class='text-[10px] text-emerald-600 font-bold uppercase tracking-wider'>Accept</span>
                        </div>
                        <p class='text-[11px] text-slate-500 italic'>"No issues found in the trade modules."</p>
                    </div>
                {/if}
            </button>

            <!-- Secondary Evaluator 2 -->
            <button
                class={cn(
                    'border border-dashed rounded-sm p-4 w-full transition-colors cursor-pointer group text-left',
                    assignedInitialSecondary2 ? 'border-solid border-[var(--primary)] bg-blue-50/10' : 'border-slate-200 hover:bg-slate-50',
                )}
                onclick={() => setPendingEvaluatorRole('Initial Secondary 2')}
            >
                <div class='flex items-center gap-3 w-full'>
                    <div class='h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0'>
                        {#if assignedInitialSecondary2Status === 'accepted'}
                            <CheckCircle2 class='h-4 w-4 text-emerald-500' />
                        {:else if assignedInitialSecondary2Status === 'pending'}
                            <Clock class='h-4 w-4 text-amber-500' />
                        {:else}
                            <UserPlus class='h-4 w-4 text-slate-400' />
                        {/if}
                    </div>
                    <div class='text-left flex-1'>
                        <h4 class='text-[13px] text-slate-900'>{assignedInitialSecondary2 || 'Secondary Evaluator 2'}</h4>
                        <p class='text-[11px] text-slate-400 leading-tight'>Assistant & commenter</p>
                    </div>
                </div>
                {#if assignedInitialSecondary2Status === 'accepted'}
                    <div class='mt-3 pt-3 border-t border-slate-100'>
                        <div class='flex items-center justify-between mb-1'>
                            <span class='text-[10px] text-slate-400 font-medium'>Review Response</span>
                            <span class='text-[10px] text-blue-600 font-bold uppercase tracking-wider'>Comment</span>
                        </div>
                        <p class='text-[11px] text-slate-500 italic'>"Curriculum needs minor clarification."</p>
                    </div>
                {/if}
            </button>
        </div>
    </div>

    <!-- Action Buttons -->
    <div class='order-3 md:col-start-1 md:row-start-2 flex flex-col gap-3 w-full max-w-sm md:mt-auto pb-10'>
        <div class='w-full' title={isProceedDisabled ? 'Assign all evaluators before proceeding' : ''}>
            <button
                onclick={() => setActiveMajorStep(1)}
                disabled={isProceedDisabled}
                class='w-full py-3 bg-[var(--primary)] text-white rounded-sm text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm'
            >
                Proceed to Scheduling
            </button>
        </div>
        <button
            onclick={() => {
                setShowInitialReview(true);
                setIsEvaluating(false);
            }}
            class='w-full py-3 border border-slate-200 rounded-sm text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer'
        >
            View Initial Review (Optional)
        </button>
    </div>
</div>
