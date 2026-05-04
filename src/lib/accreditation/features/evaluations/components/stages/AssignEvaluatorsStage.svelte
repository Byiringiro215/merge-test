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

    const isProceedDisabled = $derived(
        !assignedInitialPrincipal || !assignedInitialSecondary1 || !assignedInitialSecondary2,
    );
</script>

<div
    class='mx-auto flex h-full w-full max-w-5xl flex-col items-stretch gap-12 px-6 py-12 md:grid md:grid-cols-2'
>
    <!-- Header -->
    <div
        class='order-1 flex flex-col items-center pt-5 text-center sm:flex-row sm:items-start sm:text-left md:col-start-1 md:row-start-1'
    >
        <div class='mb-6 flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border border-slate-100 sm:mb-0 sm:mr-6'>
            <Users class='h-6 w-6 text-slate-400' strokeWidth={1.5} />
        </div>
        <div class='flex flex-col'>
            <h2 class='mb-1 text-xl text-slate-900'>Assign Evaluators</h2>
            <p class='mb-6 text-sm text-slate-500'>
                Assign evaluators to the application. You can optionally review the documents before
                scheduling.
            </p>
        </div>
    </div>

    <!-- Evaluator Cards -->
    <div class='order-2 w-full md:col-start-2 md:row-span-2 md:row-start-1'>
        <div class='mb-10 w-full space-y-4'>
            <h4 class='text-sm text-slate-700'>Assign Evaluating Team</h4>

            <!-- Principal Evaluator -->
            <button
                class={cn(
                    'group w-full cursor-pointer rounded-sm border p-4 text-left transition-colors',
                    assignedInitialPrincipal
                        ? 'border-[#2069C1] bg-blue-50/10'
                        : 'border-slate-200 bg-slate-50/50 hover:border-[#2069C1]/50',
                )}
                onclick={() => setPendingEvaluatorRole('Initial Principal')}
            >
                <div class='flex w-full items-center gap-3'>
                    <div
                        class='flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white'
                    >
                        {#if assignedInitialPrincipalStatus === 'accepted'}
                            <CheckCircle2 class='h-4 w-4 text-emerald-500' />
                        {:else if assignedInitialPrincipalStatus === 'pending'}
                            <Clock class='h-4 w-4 text-amber-500' />
                        {:else}
                            <UserPlus class='h-4 w-4 text-[#2069C1]' />
                        {/if}
                    </div>
                    <div class='flex-1 text-left'>
                        <h4 class='text-sm text-slate-900'>
                            {assignedInitialPrincipal || 'Principal Evaluator'}
                        </h4>
                        <p class='text-[11px] leading-tight text-slate-400'>Lead evaluator & decision maker</p>
                    </div>
                </div>
                {#if assignedInitialPrincipalStatus === 'accepted'}
                    <div class='mt-3 border-t border-slate-100 pt-3'>
                        <div class='mb-1 flex items-center justify-between'>
                            <span class='text-[10px] font-medium text-slate-400'>Review Response</span>
                            <span class='text-[10px] font-bold tracking-wider text-emerald-600 uppercase'
                            >Accept</span
                            >
                        </div>
                        <p class='text-[11px] text-slate-500 italic'>"Documents look correct and complete."</p>
                    </div>
                {/if}
            </button>

            <!-- Secondary Evaluator 1 -->
            <button
                class={cn(
                    'group w-full cursor-pointer rounded-sm border border-dashed p-4 text-left transition-colors',
                    assignedInitialSecondary1
                        ? 'border-[#2069C1] border-solid bg-blue-50/10'
                        : 'border-slate-200 hover:bg-slate-50',
                )}
                onclick={() => setPendingEvaluatorRole('Initial Secondary 1')}
            >
                <div class='flex w-full items-center gap-3'>
                    <div
                        class='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100'
                    >
                        {#if assignedInitialSecondary1Status === 'accepted'}
                            <CheckCircle2 class='h-4 w-4 text-emerald-500' />
                        {:else if assignedInitialSecondary1Status === 'pending'}
                            <Clock class='h-4 w-4 text-amber-500' />
                        {:else}
                            <UserPlus class='h-4 w-4 text-slate-400' />
                        {/if}
                    </div>
                    <div class='flex-1 text-left'>
                        <h4 class='text-sm text-slate-900'>
                            {assignedInitialSecondary1 || 'Secondary Evaluator 1'}
                        </h4>
                        <p class='text-[11px] leading-tight text-slate-400'>Assistant & commenter</p>
                    </div>
                </div>
                {#if assignedInitialSecondary1Status === 'accepted'}
                    <div class='mt-3 border-t border-slate-100 pt-3'>
                        <div class='mb-1 flex items-center justify-between'>
                            <span class='text-[10px] font-medium text-slate-400'>Review Response</span>
                            <span class='text-[10px] font-bold tracking-wider text-emerald-600 uppercase'
                            >Accept</span
                            >
                        </div>
                        <p class='text-[11px] text-slate-500 italic'>"No issues found in the trade modules."</p>
                    </div>
                {/if}
            </button>

            <!-- Secondary Evaluator 2 -->
            <button
                class={cn(
                    'group w-full cursor-pointer rounded-sm border border-dashed p-4 text-left transition-colors',
                    assignedInitialSecondary2
                        ? 'border-[#2069C1] border-solid bg-blue-50/10'
                        : 'border-slate-200 hover:bg-slate-50',
                )}
                onclick={() => setPendingEvaluatorRole('Initial Secondary 2')}
            >
                <div class='flex w-full items-center gap-3'>
                    <div
                        class='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100'
                    >
                        {#if assignedInitialSecondary2Status === 'accepted'}
                            <CheckCircle2 class='h-4 w-4 text-emerald-500' />
                        {:else if assignedInitialSecondary2Status === 'pending'}
                            <Clock class='h-4 w-4 text-amber-500' />
                        {:else}
                            <UserPlus class='h-4 w-4 text-slate-400' />
                        {/if}
                    </div>
                    <div class='flex-1 text-left'>
                        <h4 class='text-sm text-slate-900'>
                            {assignedInitialSecondary2 || 'Secondary Evaluator 2'}
                        </h4>
                        <p class='text-[11px] leading-tight text-slate-400'>Assistant & commenter</p>
                    </div>
                </div>
                {#if assignedInitialSecondary2Status === 'accepted'}
                    <div class='mt-3 border-t border-slate-100 pt-3'>
                        <div class='mb-1 flex items-center justify-between'>
                            <span class='text-[10px] font-medium text-slate-400'>Review Response</span>
                            <span class='text-[10px] font-bold tracking-wider text-blue-600 uppercase'
                            >Comment</span
                            >
                        </div>
                        <p class='text-[11px] text-slate-500 italic'>"Curriculum needs minor clarification."</p>
                    </div>
                {/if}
            </button>
        </div>
    </div>

    <!-- Action Buttons -->
    <div
        class='order-3 flex w-full flex-col gap-3 pb-10 md:col-start-1 md:row-start-2 md:mt-auto'
    >
        <div class='w-full' title={isProceedDisabled ? 'Assign all evaluators before proceeding' : ''}>
            <button
                onclick={() => setActiveMajorStep(1)}
                disabled={isProceedDisabled}
                class='bg-[#2069C1] w-full cursor-pointer rounded-sm py-3 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50'
            >
                Proceed to Scheduling
            </button>
        </div>
        <button
            onclick={() => {
                setShowInitialReview(true);
                setIsEvaluating(false);
            }}
            class='w-full cursor-pointer rounded-sm border border-slate-200 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50'
        >
            View Initial Review (Optional)
        </button>
    </div>
</div>
