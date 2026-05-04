<script lang='ts'>
    import { page } from '$app/state';
    import {
        ArrowLeft,
        Blocks,
        Briefcase,
        Check,
        CheckCheck,
        CheckCircle2,
        ChevronDown,
        ChevronUp,
        FileCheck,
        FileText,
        Hexagon,
        Users,
    } from '@lucide/svelte';

    const appId = $derived(page.params.id);

    const mockApp = $derived({
        id: appId,
        trade: 'Software Engineering & Embedded Systems',
        board: 'OTHER',
        category: 'TEC',
        status: 'Pending',
        stage: 'Due Diligence Scheduled',
        submittedOn: '19/12/2025',
        competencies: ['JavaScript', 'Data Structures & Algorithms'],
        equipments: [
            { name: 'Computers', quantity: 20, proof: null },
            { name: 'Projectors', quantity: 2, proof: null },
        ],
        mouDocs: [{ name: 'MOU_Signed.pdf', size: '2.1 MB', extension: 'PDF' }],
        curriculumDocs: [{ name: 'Curriculum_2026.pdf', size: '5.4 MB', extension: 'PDF' }],
        staff: [
            { position: 'Instructor', qualification: 'Master\'s Degree', status: 'Full-Time', quantity: 2 },
            { position: 'Teaching Assistant', qualification: 'Bachelor\'s Degree', status: 'Full-Time', quantity: 3 },
        ],
    });

    const curriculumRequired = $derived(mockApp.board === 'OTHER');

    const stepsList = $derived([
        { id: 1, title: 'Trade Selection', subtitle: 'Selected trade for this application', icon: Blocks },
        { id: 2, title: 'Competencies', subtitle: 'Competencies selected for the trade', icon: Hexagon },
        { id: 3, title: 'Equipment & Facilities', subtitle: 'Equipment list with proof', icon: Briefcase },
        { id: 4, title: 'MOU Documents', subtitle: 'Memorandum of Understanding', icon: FileCheck },
        ...(curriculumRequired ? [{ id: 5, title: 'Curriculum Documents', subtitle: 'Curriculum and training materials', icon: FileText }] : []),
        { id: curriculumRequired ? 6 : 5, title: 'Staff Allocation', subtitle: 'Staff availability for the trade', icon: Users },
        { id: curriculumRequired ? 7 : 6, title: 'Summary', subtitle: 'Full application overview', icon: CheckCheck },
    ]);

    const totalSteps = $derived(stepsList.length);

    let currentStep = $state(1);

    function next() {
        if (currentStep < totalSteps)
            currentStep += 1;
    }
    function back() {
        if (currentStep > 1)
            currentStep -= 1;
    }

    const statusColors: Record<string, string> = {
        Pending: 'bg-amber-50 text-amber-700',
        Approved: 'bg-emerald-50 text-emerald-700',
        Rejected: 'bg-red-50 text-red-700',
    };

    function iconBg(ext: string) {
        return ext === 'PDF' ? 'bg-red-500' : ext === 'DOCX' || ext === 'DOC' ? 'bg-blue-400' : 'bg-slate-500';
    }

    let expandedSection = $state<number | null>(null);
</script>

<div class='flex flex-col gap-6'>
    <!-- Back link -->
    <div class='mb-2'>
        <button
            onclick={() => history.back()}
            class='flex w-fit items-center gap-2 text-[13px] font-medium text-slate-500 transition-colors hover:text-[#0A77FF]'
        >
            <ArrowLeft size={16} />
            Back to Applications
        </button>
    </div>

    <!-- Status badge row -->
    <div class='mb-4 flex flex-wrap items-center gap-3'>
        <span class='text-[13px] font-semibold text-slate-500'>APP-{mockApp.id}</span>
        <span class='h-1 w-1 rounded-full bg-slate-300'></span>
        <span class={`text-[12px] font-medium px-2.5 py-1 rounded-full ${statusColors[mockApp.status] ?? 'bg-slate-100 text-slate-600'}`}>
            {mockApp.status}
        </span>
        <span class='h-1 w-1 rounded-full bg-slate-300'></span>
        <span class='text-[13px] text-slate-500'>{mockApp.stage}</span>
        <span class='h-1 w-1 rounded-full bg-slate-300'></span>
        <span class='text-[13px] text-slate-400'>Submitted {mockApp.submittedOn}</span>
    </div>

    <!-- Wizard shell (same layout as the application form) -->
    <div class='flex min-h-[680px] flex-1 overflow-hidden rounded-sm border border-slate-100 bg-white'>
        <!-- Sidebar -->
        <div class='w-[300px] shrink-0 border-r border-slate-100 bg-[#FAFAFA] p-8'>
            <h2 class='mb-10 text-[15px] font-semibold text-slate-700'>Short Course Application</h2>
            <p class='mb-12 text-[13px] font-medium text-slate-400 italic'>Read-only view</p>

            <div class='relative'>
                <div class='absolute bottom-[20px] left-[23px] top-[20px] border-l border-slate-200'></div>
                <div class='flex flex-col gap-10'>
                    {#each stepsList as step}
                        {@const isActive = currentStep === step.id}
                        {@const isCompleted = currentStep > step.id}
                        <div class='relative z-10 flex gap-4'>
                            <div class={`flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-sm transition-colors ${
                                isActive
                                    ? 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] ring-1 ring-slate-200 text-[#0A77FF]'
                                    : isCompleted
                                    ? 'bg-[#0A77FF] text-white'
                                    : 'bg-white ring-1 ring-slate-100 text-slate-400'
                            }`}>
                                {#if isCompleted}
                                    <Check size={20} strokeWidth={3} />
                                {:else}
                                    <step.icon size={22} strokeWidth={1.5} />
                                {/if}
                            </div>
                            <div class='flex flex-col justify-center pt-0.5'>
                                <p class={`text-[13px] transition-colors ${isActive ? 'font-semibold text-slate-900' : 'font-medium text-slate-400'}`}>
                                    {step.title}
                                </p>
                                <p class={`mt-0.5 text-[11px] leading-[1.6] text-slate-400 ${isActive ? '' : 'opacity-60'}`}>
                                    {step.subtitle}
                                </p>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </div>

        <!-- Step content -->
        <div class='flex flex-1 flex-col overflow-y-auto bg-white px-8 py-14 md:px-[60px] lg:px-[100px]'>
            <div class='mx-auto flex w-full max-w-[600px] flex-col'>

                <!-- ── STEP 1: TRADE ──────────────────────────────────────────────── -->
                {#if currentStep === 1}
                    <div class='flex flex-col items-center text-center'>
                        <div class='mb-5 flex h-14 w-14 items-center justify-center rounded-sm bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] ring-1 ring-slate-200'>
                            <Blocks size={24} class='text-slate-500' strokeWidth={1.5} />
                        </div>
                        <h2 class='text-[17px] font-semibold text-slate-900'>Trade Selection</h2>
                        <p class='mt-1.5 text-[13px] text-slate-500'>The trade this application was submitted for.</p>
                    </div>

                    <div class='mt-10 mb-10 rounded-sm border border-[#0A77FF] bg-blue-50/20 p-5'>
                        <div class='flex items-center gap-3'>
                            <Blocks size={18} class='text-[#0A77FF]' strokeWidth={2} />
                            <div>
                                <p class='text-[14px] font-semibold text-slate-900'>{mockApp.trade}</p>
                                <p class='mt-0.5 text-[12px] text-slate-500'>Category: {mockApp.category} · Board: {mockApp.board}</p>
                            </div>
                            <div class='ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500'>
                                <Check size={14} class='text-white' strokeWidth={3} />
                            </div>
                        </div>
                    </div>

                    <div class='flex w-full gap-3'>
                        <button
                            onclick={() => history.back()}
                            class='flex flex-1 items-center justify-center rounded-sm border border-slate-200 py-3 text-[13px] font-semibold text-slate-700 transition-colors hover:bg-slate-50'
                        >Back</button>
                        <button
                            onclick={next}
                            class='flex flex-1 items-center justify-center rounded-sm bg-[#0A77FF] py-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#0864d6]'
                        >Continue</button>
                    </div>

                    <!-- ── STEP 2: COMPETENCIES ───────────────────────────────────────── -->
                {:else if currentStep === 2}
                    <div class='flex flex-col items-center text-center'>
                        <div class='mb-5 flex h-14 w-14 items-center justify-center rounded-sm bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] ring-1 ring-slate-200'>
                            <Hexagon size={24} class='text-slate-500' strokeWidth={1.5} />
                        </div>
                        <h2 class='text-[17px] font-semibold text-slate-900'>Competencies</h2>
                        <p class='mt-1.5 text-[13px] text-slate-500'>Competencies selected for the chosen trade.</p>
                    </div>

                    <div class='mt-8 mb-10 grid grid-cols-1 gap-3 sm:grid-cols-2'>
                        {#each mockApp.competencies as comp (comp)}
                            <div class='flex items-center justify-between rounded-sm border border-[#0A77FF] bg-blue-50/30 p-3.5'>
                                <div class='flex items-center gap-3'>
                                    <Hexagon size={15} class='text-[#0A77FF]' strokeWidth={2} />
                                    <span class='text-[12px] font-medium text-slate-600'>{comp}</span>
                                </div>
                                <div class='flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-[#0A77FF] bg-[#0A77FF]'>
                                    <Check size={10} class='text-white' strokeWidth={3} />
                                </div>
                            </div>
                        {/each}
                    </div>

                    <div class='flex w-full gap-3'>
                        <button onclick={back} class='flex flex-1 items-center justify-center rounded-sm border border-slate-200 py-3 text-[13px] font-semibold text-slate-700 transition-colors hover:bg-slate-50'>Back</button>
                        <button onclick={next} class='flex flex-1 items-center justify-center rounded-sm bg-[#0A77FF] py-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#0864d6]'>Continue</button>
                    </div>

                    <!-- ── STEP 3: EQUIPMENT ──────────────────────────────────────────── -->
                {:else if currentStep === 3}
                    <div class='flex flex-col items-center text-center'>
                        <div class='mb-5 flex h-14 w-14 items-center justify-center rounded-sm bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] ring-1 ring-slate-200'>
                            <Briefcase size={24} class='text-slate-500' strokeWidth={1.5} />
                        </div>
                        <h2 class='text-[17px] font-semibold text-slate-900'>Equipment & Facilities</h2>
                        <p class='mt-1.5 text-[13px] text-slate-500'>Equipment listed with supporting proof.</p>
                    </div>

                    <div class='mt-8 mb-10 flex flex-col gap-3'>
                        {#each mockApp.equipments as eq (eq.name)}
                            <div class='flex items-center gap-4 rounded-sm border border-slate-200 bg-white p-4'>
                                <div class='h-14 w-20 shrink-0 overflow-hidden rounded-sm bg-slate-100 flex items-center justify-center text-xs text-slate-400'>
                                    No Image
                                </div>
                                <div class='flex-1'>
                                    <p class='text-[13px] font-semibold text-slate-800'>{eq.name}</p>
                                    <p class='mt-0.5 text-[11px] text-slate-500'>Quantity: {eq.quantity}</p>
                                </div>
                            </div>
                        {/each}
                    </div>

                    <div class='flex w-full gap-3'>
                        <button onclick={back} class='flex flex-1 items-center justify-center rounded-sm border border-slate-200 py-3 text-[13px] font-semibold text-slate-700 transition-colors hover:bg-slate-50'>Back</button>
                        <button onclick={next} class='flex flex-1 items-center justify-center rounded-sm bg-[#0A77FF] py-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#0864d6]'>Continue</button>
                    </div>

                    <!-- ── STEP 4: MOU DOCUMENTS ──────────────────────────────────────── -->
                {:else if currentStep === 4}
                    <div class='flex flex-col items-center text-center'>
                        <div class='mb-5 flex h-14 w-14 items-center justify-center rounded-sm bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] ring-1 ring-slate-200'>
                            <FileCheck size={24} class='text-slate-500' strokeWidth={1.5} />
                        </div>
                        <h2 class='text-[17px] font-semibold text-slate-900'>MOU Documents</h2>
                        <p class='mt-1.5 text-[13px] text-slate-500'>Memorandum of Understanding uploaded for this application.</p>
                    </div>

                    <div class='mt-8 mb-10 flex flex-col gap-3'>
                        {#each mockApp.mouDocs as doc (doc.name)}
                            <div class='flex items-center gap-4 rounded-sm border border-slate-200 bg-white p-4'>
                                <div class={`flex h-10 w-8 shrink-0 items-center justify-center rounded-sm text-white text-[10px] font-bold ${iconBg(doc.extension)}`}>
                                    {doc.extension}
                                </div>
                                <div class='flex flex-1 items-center justify-between'>
                                    <p class='text-[13px] font-medium text-slate-800'>{doc.name}</p>
                                    <span class='text-[11px] text-slate-400'>{doc.size}</span>
                                </div>
                                <div class='flex h-6 w-6 items-center justify-center rounded-sm bg-[#0A77FF]'>
                                    <Check size={14} class='text-white' strokeWidth={3} />
                                </div>
                            </div>
                        {/each}
                    </div>

                    <div class='flex w-full gap-3'>
                        <button onclick={back} class='flex flex-1 items-center justify-center rounded-sm border border-slate-200 py-3 text-[13px] font-semibold text-slate-700 transition-colors hover:bg-slate-50'>Back</button>
                        <button onclick={next} class='flex flex-1 items-center justify-center rounded-sm bg-[#0A77FF] py-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#0864d6]'>Continue</button>
                    </div>

                    <!-- ── STEP 5: CURRICULUM DOCUMENTS (if board === OTHER) ───────────── -->
                {:else if currentStep === 5 && curriculumRequired}
                    <div class='flex flex-col items-center text-center'>
                        <div class='mb-5 flex h-14 w-14 items-center justify-center rounded-sm bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] ring-1 ring-slate-200'>
                            <FileText size={24} class='text-slate-500' strokeWidth={1.5} />
                        </div>
                        <h2 class='text-[17px] font-semibold text-slate-900'>Curriculum Documents</h2>
                        <p class='mt-1.5 text-[13px] text-slate-500'>Curriculum and training materials uploaded.</p>
                    </div>

                    <div class='mt-8 mb-10 flex flex-col gap-3'>
                        {#each mockApp.curriculumDocs as doc (doc.name)}
                            <div class='flex items-center gap-4 rounded-sm border border-slate-200 bg-white p-4'>
                                <div class={`flex h-10 w-8 shrink-0 items-center justify-center rounded-sm text-white text-[10px] font-bold ${iconBg(doc.extension)}`}>
                                    {doc.extension}
                                </div>
                                <div class='flex flex-1 items-center justify-between'>
                                    <p class='text-[13px] font-medium text-slate-800'>{doc.name}</p>
                                    <span class='text-[11px] text-slate-400'>{doc.size}</span>
                                </div>
                                <div class='flex h-6 w-6 items-center justify-center rounded-sm bg-[#0A77FF]'>
                                    <Check size={14} class='text-white' strokeWidth={3} />
                                </div>
                            </div>
                        {/each}
                    </div>

                    <div class='flex w-full gap-3'>
                        <button onclick={back} class='flex flex-1 items-center justify-center rounded-sm border border-slate-200 py-3 text-[13px] font-semibold text-slate-700 transition-colors hover:bg-slate-50'>Back</button>
                        <button onclick={next} class='flex flex-1 items-center justify-center rounded-sm bg-[#0A77FF] py-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#0864d6]'>Continue</button>
                    </div>

                    <!-- ── STEP: STAFF ALLOCATION ─────────────────────────────────────── -->
                {:else if currentStep === (curriculumRequired ? 6 : 5)}
                    <div class='flex flex-col items-center text-center'>
                        <div class='mb-5 flex h-14 w-14 items-center justify-center rounded-sm bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] ring-1 ring-slate-200'>
                            <Users size={24} class='text-slate-500' strokeWidth={1.5} />
                        </div>
                        <h2 class='text-[17px] font-semibold text-slate-900'>Staff Allocation</h2>
                        <p class='mt-1.5 text-[13px] text-slate-500'>Staff allocated for this application.</p>
                    </div>

                    <div class='mt-8 mb-10 grid grid-cols-1 gap-3 sm:grid-cols-2'>
                        {#each mockApp.staff as s (s.position)}
                            <div class='flex flex-col rounded-sm border border-slate-200 bg-white p-4'>
                                <p class='text-[13px] font-semibold text-slate-800'>{s.position}</p>
                                <p class='mt-0.5 text-[12px] text-slate-500'>{s.qualification} · {s.status}</p>
                                <p class='mt-2 w-fit rounded-sm bg-slate-50 px-1.5 py-0.5 text-[11px] uppercase tracking-wider text-slate-400'>
                                    Count: {s.quantity}
                                </p>
                            </div>
                        {/each}
                    </div>

                    <div class='flex w-full gap-3'>
                        <button onclick={back} class='flex flex-1 items-center justify-center rounded-sm border border-slate-200 py-3 text-[13px] font-semibold text-slate-700 transition-colors hover:bg-slate-50'>Back</button>
                        <button onclick={next} class='flex flex-1 items-center justify-center rounded-sm bg-[#0A77FF] py-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#0864d6]'>Continue</button>
                    </div>

                    <!-- ── STEP: SUMMARY ──────────────────────────────────────────────── -->
                {:else if currentStep === totalSteps}
                    <div class='flex flex-col items-center text-center'>
                        <div class='mb-5 flex h-14 w-14 items-center justify-center rounded-sm bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] ring-1 ring-slate-200'>
                            <CheckCheck size={24} class='text-slate-500' strokeWidth={1.5} />
                        </div>
                        <h2 class='text-[17px] font-semibold text-slate-900'>Application Summary</h2>
                        <p class='mt-1.5 text-[13px] text-slate-500'>Full overview of your submitted application.</p>
                    </div>

                    <div class='mt-6 mb-8 flex flex-col gap-3'>
                        {#each [
                            { id: 1, title: 'Trade Selection', desc: mockApp.trade },
                            { id: 2, title: 'Competencies Selected', desc: `${mockApp.competencies.length} competenc${mockApp.competencies.length === 1 ? 'y' : 'ies'} selected` },
                            { id: 3, title: 'Equipment & Facilities', desc: `${mockApp.equipments.length} item${mockApp.equipments.length !== 1 ? 's' : ''} listed` },
                            { id: 4, title: 'MOU Documents', desc: `${mockApp.mouDocs.length} document${mockApp.mouDocs.length !== 1 ? 's' : ''} uploaded` },
                            ...(curriculumRequired ? [{ id: 5, title: 'Curriculum Documents', desc: `${mockApp.curriculumDocs.length} document${mockApp.curriculumDocs.length !== 1 ? 's' : ''} uploaded` }] : []),
                            { id: 9, title: 'Staff Allocation', desc: `${mockApp.staff.length} staff member${mockApp.staff.length !== 1 ? 's' : ''} allocated` },
                        ] as section (section.id)}
                            {@const isExpanded = expandedSection === section.id}
                            <div class='overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm'>
                                <button
                                    onclick={() => expandedSection = isExpanded ? null : section.id}
                                    class='flex w-full items-center justify-between p-4'
                                >
                                    <div class='flex gap-4'>
                                        <div class='flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-100'>
                                            <CheckCircle2 size={20} class='text-emerald-500' strokeWidth={1.5} />
                                        </div>
                                        <div class='flex flex-col items-start px-2'>
                                            <p class='text-[14px] font-semibold text-slate-700'>{section.title}</p>
                                            <p class='mt-0.5 line-clamp-1 text-left text-[12px] text-slate-400'>{section.desc}</p>
                                        </div>
                                    </div>
                                    <div class='pl-4'>
                                        {#if isExpanded}<ChevronUp size={20} class='text-slate-400' strokeWidth={1.5} />
                                        {:else}<ChevronDown size={20} class='text-slate-400' strokeWidth={1.5} />{/if}
                                    </div>
                                </button>
                            </div>
                        {/each}
                    </div>

                    <div class='flex w-full gap-3'>
                        <button onclick={back} class='flex flex-1 items-center justify-center rounded-sm border border-slate-200 py-3 text-[13px] font-semibold text-slate-700 transition-colors hover:bg-slate-50'>Back</button>
                        <button
                            onclick={() => history.back()}
                            class='flex flex-1 items-center justify-center rounded-sm bg-[#0A77FF] py-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#0864d6]'
                        >Done</button>
                    </div>
                {/if}

            </div>
        </div>
    </div>
</div>

<style>
    .overflow-y-auto::-webkit-scrollbar { width: 6px; }
    .overflow-y-auto::-webkit-scrollbar-track { background: transparent; }
    .overflow-y-auto::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
    .overflow-y-auto::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
</style>
