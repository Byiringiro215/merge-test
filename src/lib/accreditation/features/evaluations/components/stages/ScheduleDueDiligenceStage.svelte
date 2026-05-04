<script lang='ts'>
    import { cn } from '$lib/accreditation/utils/cn';
    import { CheckCircle2, UserPlus } from '@lucide/svelte';

    const {
        role,
        dateFrom,
        dateTo,
        setDateFrom,
        setDateTo,
        assignedScheduledPrincipal,
        assignedScheduledSecondary1,
        assignedScheduledSecondary2,
        setPendingEvaluatorRole,
        setActiveMajorStep,
        setShowInitialReview,
    } = $props<{
        role: 'super-admin' | 'evaluator' | 'supervisor';
        dateFrom: string;
        dateTo: string;
        setDateFrom: (d: string) => void;
        setDateTo: (d: string) => void;
        assignedScheduledPrincipal: string | null;
        assignedScheduledSecondary1: string | null;
        assignedScheduledSecondary2: string | null;
        setPendingEvaluatorRole: (role: string) => void;
        setActiveMajorStep: (step: number) => void;
        setShowInitialReview: (show: boolean) => void;
    }>();

    const isProceedDisabled = $derived(
        role === 'super-admin'
            && (!assignedScheduledPrincipal || !assignedScheduledSecondary1 || !assignedScheduledSecondary2),
    );
</script>

<div class='flex w-full flex-col items-start px-0 py-8'>
    <div class='flex w-full flex-col gap-12 px-6 text-left lg:flex-row'>
        <!-- Left: Location -->
        <div class='max-w-lg flex-1'>
            <div class='mb-6'>
                <h2 class='text-sm font-semibold text-slate-900'>Institution Location</h2>
                <p class='text-sm text-slate-500'>Consider the location while scheduling the Due Diligence</p>
            </div>

            <div class='mt-10 grid grid-cols-1 gap-6'>
                <div class='grid grid-cols-2 gap-4'>
                    <div class='space-y-1.5'>
                        <label for='province' class='text-sm text-slate-700'>Province</label>
                        <input id='province' readonly value='Western' class='w-full cursor-default rounded-sm border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700' />
                    </div>
                    <div class='space-y-1.5'>
                        <label for='district' class='text-sm text-slate-700'>District</label>
                        <input id='district' readonly value='Nyabihu' class='w-full cursor-default rounded-sm border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700' />
                    </div>
                </div>
                <div class='grid grid-cols-2 gap-4'>
                    <div class='space-y-1.5'>
                        <label for='sector' class='text-sm text-slate-700'>Sector</label>
                        <input id='sector' readonly value='Mukamira' class='w-full cursor-default rounded-sm border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700' />
                    </div>
                    <div class='space-y-1.5'>
                        <label for='cell' class='text-sm text-slate-700'>Cell</label>
                        <input id='cell' readonly value='Mukamira' class='w-full cursor-default rounded-sm border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700' />
                    </div>
                </div>
                <div class='grid grid-cols-2 gap-4'>
                    <div class='space-y-1.5'>
                        <label for='village' class='text-sm text-slate-700'>Village</label>
                        <input id='village' readonly value='Mukamira' class='w-full cursor-default rounded-sm border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700' />
                    </div>
                    <div class='space-y-1.5'>
                        <label for='city' class='text-sm text-slate-700'>City</label>
                        <input id='city' readonly value='Mukamira' class='w-full cursor-default rounded-sm border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700' />
                    </div>
                </div>
                <div class='space-y-1.5'>
                    <label for='address-line' class='text-sm text-slate-700'>Address Line</label>
                    <input id='address-line' readonly value='Mukamira Road' class='w-full cursor-default rounded-sm border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700' />
                </div>
            </div>
        </div>

        <!-- Right: Date & Evaluators -->
        <div class='flex flex-1 flex-col gap-4'>
            <div class='space-y-3'>
                <span class='text-sm text-slate-700'>Date Range</span>
                <div class='flex gap-3'>
                    <div class='flex-1 space-y-1'>
                        <label for='date-from' class='text-[11px] text-slate-500'>From</label>
                        <input
                            id='date-from'
                            type='date'
                            value={dateFrom}
                            readonly={role === 'evaluator'}
                            oninput={e => role !== 'evaluator' && setDateFrom(e.currentTarget.value)}
                            class='w-full rounded-sm border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition-all focus:border-[#2069C1] focus:outline-none read-only:cursor-default read-only:bg-slate-50'
                        />
                    </div>
                    <div class='flex-1 space-y-1'>
                        <label for='date-to' class='text-[11px] text-slate-500'>To</label>
                        <input
                            id='date-to'
                            type='date'
                            value={dateTo}
                            readonly={role === 'evaluator'}
                            oninput={e => role !== 'evaluator' && setDateTo(e.currentTarget.value)}
                            class='w-full rounded-sm border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition-all focus:border-[#2069C1] focus:outline-none read-only:cursor-default read-only:bg-slate-50'
                        />
                    </div>
                </div>
            </div>

            {#if role === 'super-admin'}
                <div class='mt-4 space-y-3'>
                    <h4 class='text-sm text-slate-700'>Assign Evaluating Team</h4>

                    <button
                        class={cn(
                            'border rounded-sm p-3 w-full transition-colors cursor-pointer group text-left',
                            assignedScheduledPrincipal ? 'border-[#2069C1] bg-blue-50/10' : 'border-slate-200 bg-slate-50/50 hover:border-[#2069C1]/50',
                        )}
                        onclick={() => setPendingEvaluatorRole('Scheduled Principal')}
                    >
                        <div class='flex w-full items-center gap-3'>
                            <div class='flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white'>
                                {#if assignedScheduledPrincipal}
                                    <CheckCircle2 class='h-4 w-4 text-emerald-500' />
                                {:else}
                                    <UserPlus class='h-4 w-4 text-[#2069C1]' />
                                {/if}
                            </div>
                            <div class='flex-1 text-left'>
                                <h4 class='text-sm text-slate-900'>{assignedScheduledPrincipal || 'Principal Evaluator'}</h4>
                                <p class='text-[11px] leading-tight text-slate-400'>Lead evaluator & decision maker</p>
                            </div>
                        </div>
                    </button>

                    <button
                        class={cn(
                            'border border-dashed rounded-sm p-4 w-full transition-colors cursor-pointer group text-left',
                            assignedScheduledSecondary1 ? 'border-solid border-[#2069C1] bg-blue-50/10' : 'border-slate-200 hover:bg-slate-50',
                        )}
                        onclick={() => setPendingEvaluatorRole('Scheduled Secondary 1')}
                    >
                        <div class='flex w-full items-center gap-3'>
                            <div class='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100'>
                                {#if assignedScheduledSecondary1}
                                    <CheckCircle2 class='h-4 w-4 text-emerald-500' />
                                {:else}
                                    <UserPlus class='h-4 w-4 text-slate-400' />
                                {/if}
                            </div>
                            <div class='flex-1 text-left'>
                                <h4 class='text-sm text-slate-900'>{assignedScheduledSecondary1 || 'Secondary Evaluator 1'}</h4>
                                <p class='text-[11px] leading-tight text-slate-400'>Assistant & commenter</p>
                            </div>
                        </div>
                    </button>

                    <button
                        class={cn(
                            'border border-dashed rounded-sm p-4 w-full transition-colors cursor-pointer group text-left',
                            assignedScheduledSecondary2 ? 'border-solid border-[#2069C1] bg-blue-50/10' : 'border-slate-200 hover:bg-slate-50',
                        )}
                        onclick={() => setPendingEvaluatorRole('Scheduled Secondary 2')}
                    >
                        <div class='flex w-full items-center gap-3'>
                            <div class='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100'>
                                {#if assignedScheduledSecondary2}
                                    <CheckCircle2 class='h-4 w-4 text-emerald-500' />
                                {:else}
                                    <UserPlus class='h-4 w-4 text-slate-400' />
                                {/if}
                            </div>
                            <div class='flex-1 text-left'>
                                <h4 class='text-sm text-slate-900'>{assignedScheduledSecondary2 || 'Secondary Evaluator 2'}</h4>
                                <p class='text-[11px] leading-tight text-slate-400'>Assistant & commenter</p>
                            </div>
                        </div>
                    </button>
                </div>
            {/if}

            <div class='mt-auto flex items-center gap-4 pt-6'>
                <button
                    onclick={() => {
                        setActiveMajorStep(0);
                        if (role === 'super-admin')
                            setShowInitialReview(false);
                    }}
                    class='flex-1 cursor-pointer rounded-sm border border-slate-200 px-4 py-3 text-sm text-slate-600 transition-colors hover:bg-slate-50'
                >
                    Back
                </button>
                <button
                    onclick={() => setActiveMajorStep(2)}
                    disabled={isProceedDisabled}
                    class={cn(
                        'flex-2 py-3 px-4 bg-[#2069C1] text-white rounded-sm text-sm transition-all cursor-pointer shadow-sm',
                        isProceedDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90',
                    )}
                >
                    {role === 'evaluator' ? 'Proceed to Due Diligence' : 'Schedule Due Diligence'}
                </button>
            </div>
        </div>
    </div>
</div>
