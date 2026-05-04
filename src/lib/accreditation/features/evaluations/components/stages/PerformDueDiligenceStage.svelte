<script lang='ts'>
    import { cn } from '$lib/accreditation/utils/cn';
    import { Check, Eye, PlusSquare, Search, User, UserPlus } from '@lucide/svelte';

    const {
        role,
        evaluationNote,
        setEvaluationNote,
        dueDiligenceEquipment,
        setActiveMajorStep,
        setActiveInternalStep,
        setActiveTab,
        setIsEvaluating,
    } = $props<{
        role: 'super-admin' | 'evaluator' | 'supervisor';
        evaluationNote: string;
        setEvaluationNote: (note: string) => void;
        dueDiligenceEquipment: { id: number; name: string; quantity: string; found: boolean; image: string }[];
        setActiveMajorStep: (step: number) => void;
        setActiveInternalStep: (step: number) => void;
        setActiveTab: (tab: string) => void;
        setIsEvaluating: (evaluating: boolean) => void;
    }>();
</script>

<div class='w-full py-8 px-0 flex flex-col items-start'>
    <div class='w-full flex gap-12 text-left flex-col lg:flex-row px-6'>
        <!-- Left: Notes/Consensus -->
        <div class='w-full lg:w-[450px] shrink-0 flex flex-col gap-4'>
            {#if role === 'super-admin'}
                <div class='space-y-4'>
                    <h4 class='text-sm text-slate-700'>Due Diligence Consensus</h4>

                    <div class='border border-slate-200 rounded-sm p-4 flex w-full flex-col gap-3 bg-white'>
                        <div class='flex items-start gap-3 w-full'>
                            <div class='h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-200'>
                                <User class='h-5 w-5 text-slate-400' />
                            </div>
                            <div class='flex-1'>
                                <div class='flex items-center justify-between'>
                                    <h4 class='text-[13px] font-bold text-slate-900'>Principal Evaluator</h4>
                                    <span class='text-[10px] font-bold uppercase tracking-widest text-green-500 bg-green-50 px-2 py-0.5 rounded-sm border border-green-100'>Accept</span>
                                </div>
                                <p class='text-[12px] text-slate-600 mt-1'>Infrastructure meets all minimum requirements. Validated the networking lab.</p>
                            </div>
                        </div>
                    </div>

                    <div class='border border-slate-100 rounded-sm p-4 flex w-full flex-col gap-3 bg-slate-50/50'>
                        <div class='flex items-start gap-3 w-full'>
                            <div class='h-8 w-8 rounded-full bg-white flex items-center justify-center shrink-0 border border-slate-200'>
                                <User class='h-4 w-4 text-slate-400' />
                            </div>
                            <div class='flex-1'>
                                <div class='flex items-center justify-between'>
                                    <h4 class='text-[12px] font-bold text-slate-700'>Secondary Evaluator 1</h4>
                                    <span class='text-[10px] font-bold uppercase tracking-widest text-green-500 bg-green-50 px-2 py-0.5 rounded-sm border border-green-100'>Accept</span>
                                </div>
                                <p class='text-[11px] text-slate-500 mt-1'>Confirmed all PC models match invoices.</p>
                            </div>
                        </div>
                    </div>

                    <div class='border border-slate-100 rounded-sm p-4 flex w-full flex-col gap-3 bg-slate-50/50'>
                        <div class='flex items-start gap-3 w-full'>
                            <div class='h-8 w-8 rounded-full bg-white flex items-center justify-center shrink-0 border border-slate-200'>
                                <User class='h-4 w-4 text-slate-400' />
                            </div>
                            <div class='flex-1'>
                                <div class='flex items-center justify-between'>
                                    <h4 class='text-[12px] font-bold text-slate-700'>Secondary Evaluator 2</h4>
                                    <span class='text-[10px] font-bold uppercase tracking-widest text-blue-500 bg-blue-50 px-2 py-0.5 rounded-sm border border-blue-100'>Comment</span>
                                </div>
                                <p class='text-[11px] text-slate-500 mt-1'>Building ventilation needs slight improvement.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class='border border-dashed border-slate-200 rounded-sm p-4 flex w-full items-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer group'>
                    <div class='h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors'>
                        <UserPlus class='h-5 w-5 text-slate-400' />
                    </div>
                    <div class='text-left'>
                        <h4 class='text-sm text-slate-900'>Assign Evaluator</h4>
                        <p class='text-[11px] text-slate-400'>Click to select evaluator</p>
                    </div>
                </div>
            {:else}
                <div class='space-y-4'>
                    <h4 class='text-sm text-slate-700'>Additional Evaluation Note?</h4>
                    <div class='relative'>
                        <textarea
                            placeholder='Text...'
                            value={evaluationNote}
                            oninput={e => setEvaluationNote(e.currentTarget.value)}
                            class='w-full border border-slate-200 rounded-sm p-4 min-h-[140px] text-sm focus:outline-none focus:ring-1 focus:ring-[#0A77FF] transition-all resize-none'
                        ></textarea>
                        <div class='absolute bottom-4 right-4 text-[11px] text-slate-400'>{275 - evaluationNote.length} characters left</div>
                    </div>
                    <button class='flex items-center gap-2 px-8 py-3 bg-[#0A77FF] text-white rounded-sm text-sm hover:opacity-90 transition-all cursor-pointer'>
                        Add Note
                        <PlusSquare class='h-4 w-4 text-white/70' strokeWidth={1.5} />
                    </button>
                </div>
            {/if}

            <div class='flex items-center gap-4 w-full mt-4'>
                <button
                    onclick={() => setActiveMajorStep(1)}
                    class='flex-1 py-3 px-4 border border-slate-200 rounded-sm text-sm text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer'
                >
                    Back
                </button>
                <button
                    onclick={() => {
                        setActiveMajorStep(3);
                        setActiveInternalStep(0);
                        setActiveTab('General');
                        setIsEvaluating(false);
                    }}
                    class='flex-[2] py-3 px-4 bg-[#0A77FF] text-white rounded-sm text-sm hover:opacity-90 transition-opacity cursor-pointer'
                >
                    Complete Due Diligence
                </button>
            </div>
        </div>

        <!-- Right: Equipment Verification -->
        <div class='flex-1 flex flex-col gap-6'>
            <div class='flex items-center justify-between'>
                <span class='text-sm text-slate-500'>{dueDiligenceEquipment.length} equipment</span>
            </div>
            <div class='relative max-w-xl'>
                <Search class='absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300' />
                <input placeholder='Search' class='w-full pl-11 pr-4 py-3 rounded-sm border border-slate-200 text-sm focus:outline-none focus:border-[#0A77FF]' />
            </div>

            <div class='flex flex-col gap-3 max-h-[600px] overflow-y-auto max-w-xl'>
                {#each dueDiligenceEquipment as item}
                    <div class='border border-slate-100 rounded-sm p-4 bg-white flex items-center gap-4 group hover:border-slate-200 transition-colors'>
                        <div class='h-20 w-32 rounded-sm overflow-hidden bg-slate-100 shrink-0 relative'>
                            <img src={item.image} alt={item.name} class='w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform' />
                        </div>
                        <div class='flex-1'>
                            <div class='flex items-center justify-between mb-1'>
                                <h4 class='text-sm text-slate-900'>{item.name}</h4>
                                <div class='flex items-center gap-1.5 px-2 py-1 rounded-sm text-[10px] text-slate-500 transition-colors'>
                                    Found at Site
                                    <div class={cn('h-4 w-4 rounded-sm border border-slate-200 flex items-center justify-center transition-all', item.found ? 'bg-green-500 border-green-500' : 'bg-white')}>
                                        {#if item.found}
                                            <Check class='h-3 w-3 text-white' strokeWidth={3} />
                                        {/if}
                                    </div>
                                </div>
                            </div>
                            <p class='text-[11px] text-slate-400'>Quantity: {item.quantity}</p>
                            <div class='flex justify-end mt-2'>
                                <button class='h-7 w-7 rounded-sm border border-slate-100 flex items-center justify-center hover:bg-slate-50 text-blue-500 transition-colors cursor-pointer'>
                                    <Eye class='h-3.5 w-3.5' />
                                </button>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>
