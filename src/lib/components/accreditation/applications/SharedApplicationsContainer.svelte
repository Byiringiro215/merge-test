<script lang='ts'>
    import { page } from '$app/state';
    import SharedApplicationsList from '$lib/accreditation/features/evaluations/components/SharedApplicationsList.svelte';
    import { cn } from '$lib/accreditation/utils/cn';
    import PageContainer from '$lib/components/accreditation/layout/PageContainer.svelte';
    import EvaluationsSubNav from '$lib/components/accreditation/navigation/EvaluationsSubNav.svelte';
    import {
        ArrowLeft,
        Blocks,
        Briefcase,
        Check,
        CheckCheck,
        CheckCircle2,
        ChevronDown,
        ChevronRight,
        FileCheck,
        FileText,
        FolderPlus,
        Hexagon,
        Minus,
        Plus,
        Search,
        Trash2,
        UploadCloud,
        UserPlus,
        Users,
        X,
    } from '@lucide/svelte';

    const { role } = $props<{ role: string }>();

    const titles: Record<string, string> = {
        'super-admin': 'Manage Accreditation Evaluations',
        'supervisor': 'Supervise Accreditation Evaluations',
        'evaluator': 'My Evaluations',
        'curriculum-evaluator': 'Curriculum Evaluations',
        'applicant': 'My Accreditation Applications',
    };

    const descriptions: Record<string, string> = {
        'super-admin': 'View & manage active applications and requests',
        'supervisor': 'Monitor and oversee evaluation progress',
        'evaluator': 'Conduct evaluations and submit reports',
        'curriculum-evaluator': 'Review and evaluate submitted curricula',
        'applicant': 'Create and manage your accreditation applications',
    };

    // Wizard Logic
    const stepsList = [
        { id: 1, title: 'Trade Selection', subtitle: 'Select the trade you are applying for', icon: Blocks },
        { id: 2, title: 'Competencies', subtitle: 'Select competencies for the selected trade', icon: Hexagon },
        { id: 3, title: 'Equipment & Facilities', subtitle: 'List available equipment and upload proof', icon: Briefcase },
        { id: 4, title: 'MOU Documents', subtitle: 'Upload Memorandum of Understanding', icon: FileCheck },
        { id: 5, title: 'Curriculum Documents', subtitle: 'Upload curriculum and training materials', icon: FileText },
        { id: 6, title: 'Staff Allocation', subtitle: 'Indicate staff availability for the trade', icon: Users },
        { id: 7, title: 'Application Review', subtitle: 'Review and submit your application', icon: CheckCheck },
    ];

    const trades = [
        { id: '1', name: 'Masonry', board: 'RTB' },
        { id: '2', name: 'Plumbing', board: 'RTB' },
        { id: '3', name: 'Electrical Installation', board: 'RTB' },
        { id: '4', name: 'Software Engineering & Embedded Systems', board: 'RTB' },
        { id: '5', name: 'Carpentry', board: 'RTB' },
        { id: '6', name: 'Welding', board: 'RTB' },
        { id: '7', name: 'HVAC', board: 'RTB' },
        { id: '8', name: 'Accounting & Finance', board: 'RTNB' },
        { id: '9', name: 'Business Management', board: 'RTNB' },
        { id: 'other', name: 'Other (Custom Trade)', board: 'OTHER' },
    ];

    const competenciesList = [
        { id: '1', name: 'JavaScript' },
        { id: '2', name: 'Fundamentals Of Programming Using C' },
        { id: '3', name: 'Masonry' },
        { id: '4', name: 'Data Structures & Algorithms' },
        { id: '5', name: 'Software Engineering & Embedded Systems' },
        { id: '6', name: 'Carpentry Basics' },
        { id: '7', name: 'Advanced Wiring' },
        { id: '8', name: 'Advanced Welding' },
    ];

    let currentStep = $state(1);
    let showWizard = $state(false);

    $effect(() => {
        if (page.url.searchParams.get('new') === 'true') {
            showWizard = true;
        }
    });

    let selectedTrade = $state<string | null>(null);
    let selectedCompetencies = $state<string[]>([]);
    let tradeSearch = $state('');
    let competencySearch = $state('');
    let customTradeName = $state('');

    let customCompetencyName = $state('');
    let customCompetencyHours = $state('');
    let customCompetencies = $state<{ id: string; name: string; hours: string }[]>([]);

    let equipmentName = $state('');
    let equipmentQuantity = $state(1);
    let equipmentProof = $state<string | null>(null);
    let equipmentProofName = $state<string | null>(null);
    let equipments = $state<{ id: string; name: string; quantity: number; proof: string | null }[]>([]);

    let mouDocs = $state<{ id: string; name: string; size: string; extension: string; progress: number }[]>([]);
    let curriculumDocs = $state<{ id: string; name: string; size: string; extension: string; progress: number }[]>([]);

    let staffQualification = $state('');
    let staffPosition = $state('');
    let staffCount = $state(0);
    let staffAvailability = $state('');
    let staffList = $state<{ id: string; qualification: string; position: string; count: number; availability: string }[]>([]);

    const selectedTradeData = $derived(trades.find(t => t.id === selectedTrade));
    const curriculumRequired = $derived(selectedTradeData?.board === 'OTHER');
    const selectedTradeName = $derived(
        selectedTrade === 'other' ? (customTradeName || 'Custom Trade') : (selectedTradeData?.name ?? 'Unknown'),
    );
    const selectedCompetencyNames = $derived(
        competenciesList.filter(c => selectedCompetencies.includes(c.id)).map(c => c.name),
    );

    const filteredTrades = $derived(trades.filter(t => t.id === 'other' || t.name.toLowerCase().includes(tradeSearch.toLowerCase())));
    const filteredCompetencies = $derived(competenciesList.filter(c => c.name.toLowerCase().includes(competencySearch.toLowerCase())));

    function boardLabel(board: string) {
        return board === 'RTB' ? 'RTB' : board === 'RTNB' ? 'RTNB' : 'Curriculum req.';
    }
    function boardClass(board: string) {
        return board === 'RTB'
            ? 'bg-blue-50 text-blue-700'
            : board === 'RTNB'
            ? 'bg-purple-50 text-purple-700'
            : 'bg-amber-50 text-amber-700';
    }

    function toggleCompetency(id: string) {
        if (selectedCompetencies.includes(id)) {
            selectedCompetencies = selectedCompetencies.filter(c => c !== id);
        }
        else {
            selectedCompetencies = [...selectedCompetencies, id];
        }
    }

    function handleTradeContinue() {
        if (selectedTrade) {
            if (selectedTrade === 'other' && !customTradeName.trim())
                return;
            currentStep = 2;
        }
    }
    function handleCompetencyContinue() {
        if (selectedTrade === 'other') {
            if (customCompetencies.length > 0)
                currentStep = 3;
        }
        else {
            if (selectedCompetencies.length > 0)
                currentStep = 3;
        }
    }

    function handleAddCustomCompetency() {
        if (customCompetencyName.trim() && String(customCompetencyHours).trim()) {
            customCompetencies = [
                ...customCompetencies,
                { id: `cc-${Math.random()}`, name: customCompetencyName.trim(), hours: String(customCompetencyHours).trim() },
            ];
            customCompetencyName = '';
            customCompetencyHours = '';
        }
    }
    function removeCustomCompetency(id: string) {
        customCompetencies = customCompetencies.filter(c => c.id !== id);
    }
    function handleEquipmentContinue() {
        currentStep = 4;
    }
    function handleMouContinue() {
        currentStep = curriculumRequired ? 5 : 6;
    }

    function backFrom(step: number) {
        if (step === 2)
            currentStep = 1;
        else if (step === 3)
            currentStep = 2;
        else if (step === 4)
            currentStep = 3;
        else if (step === 5)
            currentStep = 4;
        else if (step === 6)
            currentStep = curriculumRequired ? 5 : 4;
        else if (step === 7)
            currentStep = 6;
    }

    function handleCurriculumContinue() {
        currentStep = 6;
    }

    function handleAddStaff() {
        if (staffQualification && staffPosition && staffCount > 0 && staffAvailability) {
            staffList = [
                ...staffList,
                {
                    id: Math.random().toString(),
                    qualification: staffQualification,
                    position: staffPosition,
                    count: staffCount,
                    availability: staffAvailability,
                },
            ];
            staffQualification = '';
            staffPosition = '';
            staffCount = 0;
            staffAvailability = '';
        }
    }

    function removeStaff(id: string) {
        staffList = staffList.filter(s => s.id !== id);
    }

    function handleStaffContinue() {
        currentStep = 7;
    }

    function handleSubmitApplication() {
        showWizard = false;
    // Logic for actual submission would go here
    }

    function handleProofUpload(e: Event) {
        const input = e.target as HTMLInputElement;
        if (input.files?.[0]) {
            equipmentProofName = input.files[0].name;
            equipmentProof = URL.createObjectURL(input.files[0]);
            input.value = '';
        }
    }

    function handleAddEquipment() {
        if (equipmentName.trim() && equipmentQuantity > 0) {
            equipments.push({ id: Math.random().toString(), name: equipmentName, quantity: equipmentQuantity, proof: equipmentProof });
            equipmentName = '';
            equipmentQuantity = 1;
            equipmentProof = null;
            equipmentProofName = null;
        }
    }

    function removeEquipment(id: string) {
        equipments = equipments.filter(e => e.id !== id);
    }

    function uploadDocs(e: Event, target: 'mou' | 'curriculum') {
        const input = e.target as HTMLInputElement;
        if (!input.files?.length)
            return;
        const newFiles = Array.from(input.files).map(file => ({
            id: Math.random().toString(),
            name: file.name,
            size: file.size > 1048576 ? `${(file.size / 1048576).toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`,
            extension: file.name.split('.').pop()?.toUpperCase() || 'FILE',
            progress: 0,
        }));
        if (target === 'mou')
            mouDocs = [...mouDocs, ...newFiles];
        else curriculumDocs = [...curriculumDocs, ...newFiles];

        newFiles.forEach((file) => {
            let p = 0;
            const iv = setInterval(() => {
                p += Math.floor(Math.random() * 20) + 10;
                if (p >= 100) {
                    p = 100;
                    clearInterval(iv);
                }
                const arr = target === 'mou' ? mouDocs : curriculumDocs;
                const idx = arr.findIndex(d => d.id === file.id);
                if (idx !== -1) {
                    if (target === 'mou')
                        mouDocs[idx].progress = p;
                    else curriculumDocs[idx].progress = p;
                }
            }, 400);
        });
        input.value = '';
    }

    function removeDoc(id: string, target: 'mou' | 'curriculum') {
        if (target === 'mou')
            mouDocs = mouDocs.filter(d => d.id !== id);
        else curriculumDocs = curriculumDocs.filter(d => d.id !== id);
    }

    function iconBg(ext: string) {
        return ext === 'PDF' ? 'bg-red-500' : (ext === 'DOCX' || ext === 'DOC') ? 'bg-blue-400' : 'bg-slate-500';
    }

    // Auto-scroll sidebar to active step
    $effect(() => {
        if (showWizard && currentStep) {
            const stepElement = document.getElementById(`step-${currentStep}`);
            const sidebarElement = document.getElementById('wizard-sidebar');
            if (stepElement && sidebarElement) {
                const sidebarRect = sidebarElement.getBoundingClientRect();
                const stepRect = stepElement.getBoundingClientRect();

                // If step is not fully visible in sidebar, scroll to it
                if (stepRect.top < sidebarRect.top || stepRect.bottom > sidebarRect.bottom) {
                    stepElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        }
    });
</script>

<PageContainer
    {role}
    title={showWizard ? 'New Accreditation Application' : (titles[role] || 'Accreditation Applications')}
    description={showWizard ? 'Follow the steps to submit your accreditation application.' : (descriptions[role] || 'Manage accreditation applications')}
    noScroll={showWizard}
>
    {#if !showWizard}
        {#if role === 'super-admin' || role === 'supervisor' || role === 'evaluator' || role === 'merged'}
            <EvaluationsSubNav {role} />
        {/if}

        {#if role === 'applicant'}
            <div class='mb-6 flex justify-end'>
                <button
                    onclick={() => {
                        showWizard = true;
                        currentStep = 1;
                    }}
                    class='flex h-[38px] items-center justify-center gap-1.5 rounded-sm bg-[#2069C1] px-4 text-sm font-medium text-white transition-colors hover:bg-blue-600'
                >
                    New Application
                    <Plus size={14} strokeWidth={2.5} />
                </button>
            </div>
        {/if}

        <SharedApplicationsList {role} />
    {:else}
        <!-- Wizard implementation -->
        <div class='flex h-[calc(100vh-180px)] flex-1 overflow-hidden rounded-sm border border-slate-100 bg-white'>
            <!-- Sidebar -->
            <div
                id='wizard-sidebar'
                class='w-[300px] shrink-0 overflow-hidden border-r border-slate-100 bg-[#FAFAFA] p-8'
                onwheel={e => e.preventDefault()}
            >
                <h2 class='mb-10 text-[15px] font-semibold text-slate-700'>Short Course Application</h2>
                <button class='mb-12 flex items-center gap-2 text-sm font-medium text-[#2069C1] hover:underline' onclick={() => showWizard = false}>
                    <ArrowLeft size={16} strokeWidth={2} />
                    Quit
                </button>

                <div class='relative'>
                    <div class='absolute bottom-[20px] left-[23px] top-[20px] border-l border-slate-200'></div>
                    <div class='flex flex-col gap-10'>
                        {#each stepsList as step}
                            {@const isSkipped = step.id === 5 && !curriculumRequired}
                            {@const isActive = !isSkipped && currentStep === step.id}
                            {@const isCompleted = !isSkipped && currentStep > step.id}
                            <div id='step-{step.id}' class={cn('relative z-10 flex gap-4', isSkipped ? 'opacity-40' : '')}>
                                <div class={cn(
                                    'flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-sm transition-colors',
                                    isActive
                                        ? 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] ring-1 ring-slate-200 text-[#2069C1]'
                                        : isCompleted
                                        ? 'bg-[#2069C1] text-white'
                                        : 'bg-white ring-1 ring-slate-100 text-slate-400',
                                )}>
                                    {#if isCompleted}
                                        <Check size={20} strokeWidth={3} />
                                    {:else}
                                        <step.icon size={22} strokeWidth={1.5} />
                                    {/if}
                                </div>
                                <div class='flex flex-col justify-center pt-0.5'>
                                    <div class='flex items-center gap-1.5'>
                                        <p class={cn('text-sm transition-colors', isActive ? 'font-semibold text-slate-900' : 'font-medium text-slate-400')}>
                                            {step.title}
                                        </p>
                                        {#if isSkipped}
                                            <span class='rounded-sm bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-400'>N/A</span>
                                        {/if}
                                    </div>
                                    <p class={cn('mt-0.5 text-[11px] leading-[1.6] text-slate-400', isActive ? '' : 'opacity-60')}>
                                        {step.subtitle}
                                    </p>
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>

            <!-- Content -->
            <div class='flex flex-1 flex-col overflow-y-auto bg-white py-14 px-8 md:px-[60px] lg:px-[100px] no-scrollbar'>
                <div class='mx-auto flex w-full max-w-[600px] flex-col'>
                    {#if currentStep === 1}
                        <div class='flex flex-col items-center text-center'>
                            <div class='mb-5 flex h-14 w-14 items-center justify-center rounded-sm bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] ring-1 ring-slate-200'>
                                <Blocks size={24} class='text-slate-500' strokeWidth={1.5} />
                            </div>
                            <h2 class='text-[17px] font-semibold text-slate-900'>Trade Selection</h2>
                            <p class='mt-1.5 text-sm text-slate-500'>Select the trade you are applying for accreditation in.</p>
                        </div>

                        <div class='mt-10'>
                            <div class='mb-3 flex items-center justify-between'>
                                <p class='text-[12px] text-slate-500'>{filteredTrades.length} trades available</p>
                                <div class='flex items-center gap-3 text-[11px]'>
                                    <span class='flex items-center gap-1'><span class='inline-block h-2 w-2 rounded-full bg-blue-400'></span>RTB</span>
                                    <span class='flex items-center gap-1'><span class='inline-block h-2 w-2 rounded-full bg-purple-400'></span>RTNB</span>
                                    <span class='flex items-center gap-1'><span class='inline-block h-2 w-2 rounded-full bg-amber-400'></span>Curriculum req.</span>
                                </div>
                            </div>

                            <div class='relative mb-6'>
                                <Search size={16} class='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400' />
                                <input type='text' placeholder='Search' bind:value={tradeSearch}
                                       class='w-full rounded-sm border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#2069C1] focus:outline-none focus:ring-1 focus:ring-[#2069C1]' />
                            </div>

                            <div class='mb-10 grid grid-cols-1 gap-3 sm:grid-cols-2'>
                                {#each filteredTrades as trade}
                                    {@const isSelected = selectedTrade === trade.id}
                                    <div class='flex flex-col gap-2'>
                                        <button onclick={() => selectedTrade = trade.id}
                                                class={cn('flex items-center justify-between rounded-sm border p-3.5 transition-colors text-left', isSelected ? 'border-[#2069C1] bg-blue-50/30' : 'border-slate-200 hover:border-[#2069C1]')}>
                                            <div class='flex min-w-0 flex-1 items-center gap-2'>
                                                <Blocks size={14} class='shrink-0 text-[#2069C1]' strokeWidth={2} />
                                                <span class='truncate text-[12px] font-medium text-slate-600'>{trade.name}</span>
                                            </div>
                                            <div class='ml-2 flex shrink-0 items-center gap-1.5'>
                                                <span class={cn('text-[10px] px-1.5 py-0.5 rounded-sm font-medium', boardClass(trade.board))}>
                                                    {boardLabel(trade.board)}
                                                </span>
                                                <div class={cn('flex h-4 w-4 items-center justify-center rounded-full border transition-colors', isSelected ? 'border-[#2069C1] bg-[#2069C1]' : 'border-slate-300 bg-white')}>
                                                    {#if isSelected}<div class='h-1.5 w-1.5 rounded-full bg-white'></div>{/if}
                                                </div>
                                            </div>
                                        </button>
                                        {#if isSelected && trade.id === 'other'}
                                            <div class='px-1 pb-1'>
                                                <input type='text' placeholder='Enter custom trade name' bind:value={customTradeName}
                                                       class='w-full rounded-sm border border-slate-200 py-2.5 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#2069C1] focus:outline-none focus:ring-1 focus:ring-[#2069C1]' />
                                            </div>
                                        {/if}
                                    </div>
                                {/each}
                            </div>

                            <div class='flex w-full gap-3'>
                                <button class='flex flex-1 items-center justify-center rounded-sm border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50'
                                        onclick={() => showWizard = false}>Back</button>
                                <button onclick={handleTradeContinue} disabled={!selectedTrade || (selectedTrade === 'other' && !customTradeName.trim())}
                                        class={cn('flex flex-1 items-center justify-center rounded-sm py-3 text-sm font-semibold text-white transition-colors', selectedTrade && (selectedTrade !== 'other' || customTradeName.trim()) ? 'bg-[#2069C1] hover:bg-[#0864d6]' : 'bg-blue-300 cursor-not-allowed')}>
                                    Continue
                                </button>
                            </div>
                        </div>
                    {:else if currentStep === 2}
                        <div class='flex flex-col items-center text-center'>
                            <div class='mb-5 flex h-14 w-14 items-center justify-center rounded-sm bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] ring-1 ring-slate-200'>
                                <Hexagon size={24} class='text-slate-500' strokeWidth={1.5} />
                            </div>
                            <h2 class='text-[17px] font-semibold text-slate-900'>Competencies</h2>
                            <p class='mt-1.5 text-sm text-slate-500'>
                                {#if selectedTrade === 'other'}
                                    Add the competencies for your custom trade, including the hours for each.
                                {:else}
                                    Select one or more competencies for the chosen trade.
                                {/if}
                            </p>
                        </div>

                        <div class='mt-8 flex flex-col items-center'>
                            <div class='mb-8 flex min-w-[140px] w-fit items-center justify-between gap-6 rounded-sm border border-[#2069C1] bg-white px-3.5 py-2'>
                                <div class='flex items-center gap-2'>
                                    <Blocks size={16} class='text-[#2069C1]' strokeWidth={2} />
                                    <span class='text-[12px] font-medium text-slate-600'>{selectedTradeName}</span>
                                </div>
                                <div class='flex h-[18px] w-[18px] items-center justify-center rounded-full bg-emerald-500'>
                                    <Check size={12} class='text-white' strokeWidth={3} />
                                </div>
                            </div>
                        </div>

                        {#if selectedTrade === 'other'}
                            <div class='mt-2'>
                                <div class='mb-5 rounded-sm border border-slate-200 bg-white p-5'>
                                    <p class='mb-4 text-sm font-semibold text-slate-700'>Add Competency</p>
                                    <div class='mb-4'>
                                        <label for='custom-comp-name' class='mb-1.5 block text-[12px] font-medium text-slate-600'>
                                            Competency Name <span class='text-red-500'>*</span>
                                        </label>
                                        <input
                                            id='custom-comp-name'
                                            type='text'
                                            placeholder='e.g. Advanced Welding'
                                            bind:value={customCompetencyName}
                                            class='w-full rounded-sm border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#2069C1] focus:outline-none focus:ring-1 focus:ring-[#2069C1]'
                                        />
                                    </div>
                                    <div class='mb-4'>
                                        <label for='custom-comp-hours' class='mb-1.5 block text-[12px] font-medium text-slate-600'>
                                            Hours <span class='text-red-500'>*</span>
                                        </label>
                                        <input
                                            id='custom-comp-hours'
                                            type='number'
                                            min='1'
                                            placeholder='e.g. 40'
                                            bind:value={customCompetencyHours}
                                            class='w-full rounded-sm border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#2069C1] focus:outline-none focus:ring-1 focus:ring-[#2069C1]'
                                        />
                                    </div>
                                    <button
                                        onclick={handleAddCustomCompetency}
                                        disabled={!customCompetencyName.trim() || !String(customCompetencyHours).trim()}
                                        class={cn(
                                            'flex w-full items-center justify-center gap-2 rounded-sm py-2.5 text-sm font-semibold text-white transition-colors',
                                            customCompetencyName.trim() && String(customCompetencyHours).trim()
                                                ? 'bg-[#2069C1] hover:bg-[#0864d6]'
                                                : 'cursor-not-allowed bg-blue-300',
                                        )}
                                    >
                                        <Plus size={15} strokeWidth={2.5} />
                                        Add Competency
                                    </button>
                                </div>

                                {#if customCompetencies.length > 0}
                                    <div class='mb-6 flex flex-col gap-2'>
                                        <p class='mb-1 text-[12px] font-medium text-slate-500'>{customCompetencies.length} added</p>
                                        {#each customCompetencies as cc}
                                            <div class='flex items-center justify-between rounded-sm border border-slate-200 bg-white px-4 py-3'>
                                                <div class='flex items-center gap-3'>
                                                    <div class='flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-blue-50'>
                                                        <Hexagon size={15} class='text-[#2069C1]' strokeWidth={2} />
                                                    </div>
                                                    <div>
                                                        <p class='text-sm font-medium text-slate-800'>{cc.name}</p>
                                                        <p class='text-[11px] text-slate-400'>{cc.hours} hrs</p>
                                                    </div>
                                                </div>
                                                <button onclick={() => removeCustomCompetency(cc.id)} class='text-slate-300 transition-colors hover:text-red-500'>
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        {/each}
                                    </div>
                                {/if}

                                <div class='flex w-full gap-3'>
                                    <button onclick={() => backFrom(2)}
                                            class='flex flex-1 items-center justify-center rounded-sm border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50'>Back</button>
                                    <button
                                        onclick={handleCompetencyContinue}
                                        disabled={customCompetencies.length === 0}
                                        class={cn(
                                            'flex flex-1 items-center justify-center rounded-sm py-3 text-sm font-semibold text-white transition-colors',
                                            customCompetencies.length > 0 ? 'bg-[#2069C1] hover:bg-[#0864d6]' : 'bg-blue-300 cursor-not-allowed',
                                        )}
                                    >
                                        Continue
                                    </button>
                                </div>
                            </div>
                        {:else}
                            <div class='mt-2'>
                                <div class='mb-3 flex items-center justify-between'>
                                    <p class='text-[12px] text-slate-500'>{filteredCompetencies.length} available</p>
                                    {#if selectedCompetencies.length > 0}
                                        <span class='text-[12px] font-medium text-[#2069C1]'>{selectedCompetencies.length} selected</span>
                                    {/if}
                                </div>

                                <div class='relative mb-6'>
                                    <Search size={16} class='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400' />
                                    <input type='text' placeholder='Search' bind:value={competencySearch}
                                           class='w-full rounded-sm border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#2069C1] focus:outline-none focus:ring-1 focus:ring-[#2069C1]' />
                                </div>

                                <div class='mb-10 grid grid-cols-1 gap-3 sm:grid-cols-2'>
                                    {#each filteredCompetencies as comp}
                                        {@const isSelected = selectedCompetencies.includes(comp.id)}
                                        <button onclick={() => toggleCompetency(comp.id)}
                                                class={cn('flex items-center justify-between rounded-sm border p-3.5 transition-colors text-left', isSelected ? 'border-[#2069C1] bg-blue-50/30' : 'border-slate-200 hover:border-[#2069C1]')}>
                                            <div class='flex items-center gap-3'>
                                                <Hexagon size={15} class='text-[#2069C1]' strokeWidth={2} />
                                                <span class='line-clamp-1 text-[12px] font-medium text-slate-600'>{comp.name}</span>
                                            </div>
                                            <div class={cn('flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition-colors', isSelected ? 'border-[#2069C1] bg-[#2069C1]' : 'border-slate-300 bg-white')}>
                                                {#if isSelected}<Check size={10} class='text-white' strokeWidth={3} />{/if}
                                            </div>
                                        </button>
                                    {/each}
                                </div>

                                <div class='flex w-full gap-3'>
                                    <button onclick={() => backFrom(2)}
                                            class='flex flex-1 items-center justify-center rounded-sm border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50'>Back</button>
                                    <button onclick={handleCompetencyContinue} disabled={selectedCompetencies.length === 0}
                                            class={cn('flex flex-1 items-center justify-center rounded-sm py-3 text-sm font-semibold text-white transition-colors', selectedCompetencies.length > 0 ? 'bg-[#2069C1] hover:bg-[#0864d6]' : 'bg-blue-300 cursor-not-allowed')}>
                                        Continue
                                    </button>
                                </div>
                            </div>
                        {/if}
                    {:else if currentStep === 3}
                        <!-- Equipment Step -->
                        <div class='flex flex-col items-center text-center'>
                            <div class='mb-5 flex h-14 w-14 items-center justify-center rounded-sm bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] ring-1 ring-slate-200'>
                                <Briefcase size={24} class='text-slate-500' strokeWidth={1.5} />
                            </div>
                            <h2 class='text-[17px] font-semibold text-slate-900'>Equipment and Facilities</h2>
                            <p class='mt-1.5 text-sm text-slate-500'>List the available equipment and upload supporting proof.</p>
                        </div>

                        <div class='mt-8 flex flex-col items-center'>
                            <div class='mb-8 flex flex-wrap items-center justify-center gap-3'>
                                <div class='flex items-center gap-2 rounded-sm border border-[#2069C1] bg-white px-3.5 py-2'>
                                    <Blocks size={14} class='text-[#2069C1]' strokeWidth={2} />
                                    <span class='text-[12px] font-medium text-slate-600'>{selectedTradeName}</span>
                                    <div class='flex h-[16px] w-[16px] items-center justify-center rounded-full bg-emerald-500'>
                                        <Check size={10} class='text-white' strokeWidth={3} />
                                    </div>
                                </div>
                                <ChevronRight size={16} class='text-slate-300' strokeWidth={1.5} />
                                <div class='flex items-center gap-2 rounded-sm border border-[#2069C1] bg-white px-3.5 py-2'>
                                    <Hexagon size={14} class='text-[#2069C1]' strokeWidth={2} />
                                    <span class='text-[12px] font-medium text-slate-600'>
                                        {selectedCompetencyNames.length === 1 ? selectedCompetencyNames[0] : `${selectedCompetencyNames.length} comps`}
                                    </span>
                                    <div class='flex h-[16px] w-[16px] items-center justify-center rounded-full bg-emerald-500'>
                                        <Check size={10} class='text-white' strokeWidth={3} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class='mt-2 text-left'>
                            <div class='mb-5 rounded-sm border border-slate-200 bg-white p-6'>
                                <div class='mb-5'>
                                    <label class='mb-2 block text-sm font-medium text-slate-700' for='equipment-name'>
                                        Equipment Name <span class='text-red-500'>*</span>
                                    </label>
                                    <input id='equipment-name' type='text' placeholder='Select ...' bind:value={equipmentName}
                                           class='w-full rounded-sm border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-[#2069C1] focus:outline-none focus:ring-1 focus:ring-[#2069C1]' />
                                </div>

                                <div class='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                                    <div>
                                        <span class='mb-2 block text-sm font-medium text-slate-700'>Quantity <span class='text-red-500'>*</span></span>
                                        <div class='flex items-center justify-between rounded-sm border border-slate-200 bg-white px-3 py-2'>
                                            <div class='flex items-center gap-2'>
                                                <Briefcase size={14} class='text-slate-400' />
                                                <span id='equipment-quantity' class='w-8 text-sm font-medium'>{equipmentQuantity}</span>
                                            </div>
                                            <div class='flex items-center gap-1'>
                                                <button onclick={() => equipmentQuantity += 1} class='rounded-sm p-1 hover:bg-slate-100'><Plus size={16} class='text-slate-600' /></button>
                                                <button onclick={() => equipmentQuantity = Math.max(1, equipmentQuantity - 1)} class='rounded-sm p-1 hover:bg-slate-100'><Minus size={16} class='text-slate-600' /></button>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label for='equipment-proof' class='mb-2 block text-sm font-medium text-slate-700'>Proof <span class='text-red-500'>*</span></label>
                                        <div class='flex items-center overflow-hidden rounded-sm border border-slate-200 bg-white'>
                                            <div class='flex-1 truncate border-r border-slate-200 px-3 py-2 text-sm text-slate-400'>
                                                {equipmentProofName ?? 'Select ...'}
                                            </div>
                                            <label class='flex cursor-pointer items-center gap-2 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100'>
                                                <UploadCloud size={16} class='text-slate-500' />
                                                Upload
                                                <input id='equipment-proof' type='file' accept='image/*' class='hidden' onchange={handleProofUpload} />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button onclick={handleAddEquipment}
                                    class='mb-8 flex items-center justify-center gap-2 rounded-sm bg-[#2069C1] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0864d6] transition-colors'>
                                Add Equipment
                                <FolderPlus size={16} />
                            </button>

                            <div class='mb-8 flex w-full gap-3'>
                                <button onclick={() => backFrom(3)} class='flex flex-1 items-center justify-center rounded-sm border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors'>Back</button>
                                <button onclick={handleEquipmentContinue} class='flex flex-1 items-center justify-center rounded-sm bg-[#2069C1] py-3 text-sm font-semibold text-white hover:bg-[#0864d6] transition-colors'>Continue</button>
                            </div>

                            {#if equipments.length > 0}
                                <div class='flex flex-col gap-3'>
                                    {#each equipments as eq}
                                        <div class='relative flex items-center gap-4 rounded-sm border border-slate-200 bg-white p-3'>
                                            <div class='h-14 w-20 shrink-0 overflow-hidden rounded-sm bg-slate-100'>
                                                {#if eq.proof}<img src={eq.proof} alt='proof' class='h-full w-full object-cover' />
                                                {:else}<div class='flex h-full w-full items-center justify-center text-xs text-slate-400'>No Img</div>{/if}
                                            </div>
                                            <div class='flex-1'>
                                                <p class='text-sm font-medium text-slate-800'>{eq.name}</p>
                                                <p class='mt-0.5 text-[11px] text-slate-500'>Qty: {eq.quantity}</p>
                                            </div>
                                            <button onclick={() => removeEquipment(eq.id)} class='absolute right-3 top-3 text-slate-400 hover:text-slate-600'><X size={16} /></button>
                                        </div>
                                    {/each}
                                </div>
                            {/if}
                        </div>
                    {:else if currentStep === 4}
                        <!-- MOU Step -->
                        <div class='flex flex-col items-center text-center'>
                            <div class='mb-5 flex h-14 w-14 items-center justify-center rounded-sm bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] ring-1 ring-slate-200'>
                                <FileCheck size={24} class='text-slate-500' strokeWidth={1.5} />
                            </div>
                            <h2 class='text-[17px] font-semibold text-slate-900'>MOU Documents</h2>
                            <p class='mt-1.5 text-sm text-slate-500'>Upload the signed Memorandum of Understanding.</p>
                        </div>

                        <div class='mt-8 mb-6 w-full text-left'>
                            <label class='flex cursor-pointer flex-col items-center justify-center rounded-sm border border-dashed border-slate-300 bg-white py-10 hover:bg-slate-50 transition-colors'>
                                <div class='mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm'>
                                    <UploadCloud size={20} class='text-slate-500' strokeWidth={1.5} />
                                </div>
                                <p class='text-sm text-slate-500'><span class='font-medium text-[#2069C1]'>Click to upload</span></p>
                                <input type='file' multiple class='hidden' onchange={e => uploadDocs(e, 'mou')} />
                            </label>
                        </div>

                        {#if mouDocs.length > 0}
                            <div class='mb-8 flex w-full flex-col gap-3'>
                                {#each mouDocs as doc}
                                    <div class='relative flex flex-col justify-center rounded-sm border border-slate-200 bg-white p-4'>
                                        <div class='flex items-start justify-between'>
                                            <div class='flex items-center gap-4'>
                                                <div class='relative h-10 w-8 bg-slate-50 border border-slate-200'>
                                                    <div class={cn('absolute inset-x-1 bottom-1 flex items-center justify-center rounded-sm py-0.5', iconBg(doc.extension))}>
                                                        <span class='text-[7px] font-bold text-white'>{doc.extension}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p class='text-sm font-medium'>{doc.name}</p>
                                                    <p class='text-[11px] text-slate-500'>{doc.size}</p>
                                                </div>
                                            </div>
                                            {#if doc.progress < 100}
                                                <button onclick={() => removeDoc(doc.id, 'mou')}><Trash2 size={18} class='text-slate-300 hover:text-red-500' /></button>
                                            {:else}
                                                <CheckCircle2 size={18} class='text-emerald-500' />
                                            {/if}
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        {/if}

                        <div class='flex w-full gap-3'>
                            <button onclick={() => backFrom(4)} class='flex flex-1 items-center justify-center rounded-sm border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors'>Back</button>
                            <button onclick={handleMouContinue} disabled={mouDocs.length === 0}
                                    class={cn('flex flex-1 items-center justify-center rounded-sm py-3 text-sm font-semibold text-white transition-colors', mouDocs.length > 0 ? 'bg-[#2069C1] hover:bg-[#0864d6]' : 'bg-blue-300 cursor-not-allowed')}>Continue</button>
                        </div>
                    {:else if currentStep === 5}
                        <!-- Curriculum Step -->
                        <div class='flex flex-col items-center text-center'>
                            <div class='mb-5 flex h-14 w-14 items-center justify-center rounded-sm bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] ring-1 ring-slate-200'>
                                <FileText size={24} class='text-slate-500' strokeWidth={1.5} />
                            </div>
                            <h2 class='text-[17px] font-semibold text-slate-900'>Curriculum Documents</h2>
                            <p class='mt-1.5 text-sm text-slate-500'>Upload the curriculum and training materials.</p>
                        </div>

                        <div class='mt-8 mb-6 w-full text-left'>
                            <label class='flex cursor-pointer flex-col items-center justify-center rounded-sm border border-dashed border-slate-300 bg-white py-10 hover:bg-slate-50 transition-colors'>
                                <div class='mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm'>
                                    <UploadCloud size={20} class='text-slate-500' strokeWidth={1.5} />
                                </div>
                                <p class='text-sm text-slate-500'><span class='font-medium text-[#2069C1]'>Click to upload</span></p>
                                <input type='file' multiple class='hidden' onchange={e => uploadDocs(e, 'curriculum')} />
                            </label>
                        </div>

                        {#if curriculumDocs.length > 0}
                            <div class='mb-8 flex w-full flex-col gap-3'>
                                {#each curriculumDocs as doc}
                                    <div class='relative flex flex-col justify-center rounded-sm border border-slate-200 bg-white p-4'>
                                        <div class='flex items-start justify-between'>
                                            <div class='flex items-center gap-4'>
                                                <div class='relative h-10 w-8 bg-slate-50 border border-slate-200'>
                                                    <div class={cn('absolute inset-x-1 bottom-1 flex items-center justify-center rounded-sm py-0.5', iconBg(doc.extension))}>
                                                        <span class='text-[7px] font-bold text-white'>{doc.extension}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p class='text-sm font-medium'>{doc.name}</p>
                                                    <p class='text-[11px] text-slate-500'>{doc.size}</p>
                                                </div>
                                            </div>
                                            {#if doc.progress < 100}
                                                <button onclick={() => removeDoc(doc.id, 'curriculum')}><Trash2 size={18} class='text-slate-300 hover:text-red-500' /></button>
                                            {:else}
                                                <CheckCircle2 size={18} class='text-emerald-500' />
                                            {/if}
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        {/if}

                        <div class='flex w-full gap-3'>
                            <button onclick={() => backFrom(5)} class='flex flex-1 items-center justify-center rounded-sm border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors'>Back</button>
                            <button onclick={handleCurriculumContinue} disabled={curriculumDocs.length === 0}
                                    class={cn('flex flex-1 items-center justify-center rounded-sm py-3 text-sm font-semibold text-white transition-colors', curriculumDocs.length > 0 ? 'bg-[#2069C1] hover:bg-[#0864d6]' : 'bg-blue-300 cursor-not-allowed')}>Continue</button>
                        </div>

                    {:else if currentStep === 6}
                        <!-- Staff Allocation Step -->
                        <div class='flex flex-col items-center text-center'>
                            <div class='mb-5 flex h-14 w-14 items-center justify-center rounded-sm bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] ring-1 ring-slate-200'>
                                <Users size={24} class='text-slate-400' strokeWidth={1.5} />
                            </div>
                            <h2 class='text-[20px] font-semibold text-slate-900'>Staff Allocation</h2>
                            <p class='mt-2 text-sm text-slate-500 font-medium opacity-80'>Indicate staff availability by qualification and position.</p>
                        </div>

                        <!-- Progress indicators -->
                        <div class='mt-10 mb-8 flex items-center justify-center gap-4'>
                            <div class='flex items-center gap-2 rounded-sm border border-[#2069C1] bg-white px-4 py-2.5 min-w-[140px]'>
                                <Blocks size={16} class='text-[#2069C1]' />
                                <span class='text-[13px] font-medium text-slate-600'>{selectedTradeName}</span>
                                <div class='ml-auto flex h-[18px] w-[18px] items-center justify-center rounded-full bg-emerald-500'>
                                    <Check size={12} class='text-white' strokeWidth={3} />
                                </div>
                            </div>
                            <ChevronRight size={18} class='text-slate-300' />
                            <div class='flex items-center gap-2 rounded-sm border border-[#2069C1] bg-white px-4 py-2.5 min-w-[140px]'>
                                <Hexagon size={16} class='text-[#2069C1]' />
                                <span class='text-[13px] font-medium text-slate-600 line-clamp-1'>
                                    {selectedCompetencyNames.length > 0 ? selectedCompetencyNames[0] : 'Competencies'}
                                </span>
                                <div class='ml-auto flex h-[18px] w-[18px] items-center justify-center rounded-full bg-emerald-500'>
                                    <Check size={12} class='text-white' strokeWidth={3} />
                                </div>
                            </div>
                        </div>

                        <!-- Form Container -->
                        <div class='mb-8 rounded-[20px] border border-slate-100 bg-white p-8'>
                            <div class='grid grid-cols-1 gap-6 md:grid-cols-2'>
                                <!-- Qualification -->
                                <div class='space-y-2'>
                                    <label for='staff-qualification' class='text-[13px] font-semibold text-slate-700 flex items-center gap-1'>
                                        Qualification <span class='text-red-500'>*</span>
                                    </label>
                                    <div class='relative'>
                                        <select
                                            id='staff-qualification'
                                            bind:value={staffQualification}
                                            class='w-full appearance-none rounded-sm border border-slate-200 bg-slate-50/30 px-4 py-3 text-[14px] text-slate-500 focus:border-[#2069C1] focus:outline-none transition-colors'
                                        >
                                            <option value='' disabled selected>Select ...</option>
                                            <option value='Degree'>Bachelor's Degree</option>
                                            <option value='Masters'>Master's Degree</option>
                                            <option value='PhD'>PhD</option>
                                            <option value='Certification'>Professional Certification</option>
                                        </select>
                                        <ChevronDown size={18} class='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none' />
                                    </div>
                                </div>

                                <!-- Position -->
                                <div class='space-y-2'>
                                    <label for='staff-position' class='text-[13px] font-semibold text-slate-700 flex items-center gap-1'>
                                        Position <span class='text-red-500'>*</span>
                                    </label>
                                    <div class='relative'>
                                        <select
                                            id='staff-position'
                                            bind:value={staffPosition}
                                            class='w-full appearance-none rounded-sm border border-slate-200 bg-slate-50/30 px-4 py-3 text-[14px] text-slate-500 focus:border-[#2069C1] focus:outline-none transition-colors'
                                        >
                                            <option value='' disabled selected>Select ...</option>
                                            <option value='Instructor'>Lead Instructor</option>
                                            <option value='Assistant'>Teaching Assistant</option>
                                            <option value='Technician'>Lab Technician</option>
                                            <option value='Supervisor'>Workshop Supervisor</option>
                                        </select>
                                        <ChevronDown size={18} class='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none' />
                                    </div>
                                </div>

                                <!-- Number -->
                                <div class='space-y-2'>
                                    <span class='text-[13px] font-semibold text-slate-700 flex items-center gap-1'>
                                        Number <span class='text-red-500'>*</span>
                                    </span>
                                    <div class='flex items-center overflow-hidden rounded-sm border border-slate-200'>
                                        <div class='flex-1 px-4 py-3 text-[14px] text-slate-500 bg-white'>
                                            {staffCount}
                                        </div>
                                        <div class='flex border-l border-slate-200'>
                                            <button
                                                onclick={() => staffCount++}
                                                class='flex h-[44px] w-[44px] items-center justify-center bg-white hover:bg-slate-50 transition-colors border-r border-slate-200'
                                            >
                                                <Plus size={18} class='text-slate-500' />
                                            </button>
                                            <button
                                                onclick={() => staffCount = Math.max(0, staffCount - 1)}
                                                class='flex h-[44px] w-[44px] items-center justify-center bg-white hover:bg-slate-50 transition-colors'
                                            >
                                                <Minus size={18} class='text-slate-500' />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <!-- Availability Status -->
                                <div class='space-y-2'>
                                    <label for='staff-availability' class='text-[13px] font-semibold text-slate-700 flex items-center gap-1'>
                                        Availability Status <span class='text-red-500'>*</span>
                                    </label>
                                    <div class='relative'>
                                        <select
                                            id='staff-availability'
                                            bind:value={staffAvailability}
                                            class='w-full appearance-none rounded-sm border border-slate-200 bg-slate-50/30 px-4 py-3 text-[14px] text-slate-500 focus:border-[#2069C1] focus:outline-none transition-colors'
                                        >
                                            <option value='' disabled selected>Select ...</option>
                                            <option value='Full-Time'>Full-Time</option>
                                            <option value='Part-Time'>Part-Time</option>
                                            <option value='Contract'>Contract</option>
                                        </select>
                                        <ChevronDown size={18} class='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none' />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Add Staff Button -->
                        <div class='mb-10'>
                            <button
                                onclick={handleAddStaff}
                                disabled={!staffQualification || !staffPosition || staffCount === 0 || !staffAvailability}
                                class={cn(
                                    'flex h-[38px] items-center gap-2 rounded-sm px-4 text-sm font-medium transition-all',
                                    staffQualification && staffPosition && staffCount > 0 && staffAvailability
                                        ? 'bg-[#2069C1] text-white hover:bg-[#0864d6]'
                                        : 'bg-blue-300 text-white cursor-not-allowed',
                                )}
                            >
                                Add Staff
                                <UserPlus size={16} />
                            </button>
                        </div>

                        <!-- Staff List Summary (if any) -->
                        {#if staffList.length > 0}
                            <div class='mb-8 space-y-3'>
                                {#each staffList as staff}
                                    <div class='flex items-center justify-between rounded-sm border border-slate-100 bg-white p-4'>
                                        <div class='flex items-center gap-4'>
                                            <div class='flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-[#2069C1]'>
                                                <Users size={18} />
                                            </div>
                                            <div>
                                                <p class='text-[14px] font-bold text-slate-800'>{staff.position} - {staff.qualification}</p>
                                                <p class='text-[12px] text-slate-500'>{staff.count} member{staff.count !== 1 ? 's' : ''} · {staff.availability}</p>
                                            </div>
                                        </div>
                                        <button onclick={() => removeStaff(staff.id)} class='text-slate-300 hover:text-red-500 transition-colors'>
                                            <X size={18} />
                                        </button>
                                    </div>
                                {/each}
                            </div>
                        {/if}

                        <!-- Wizard Footer -->
                        <div class='mt-auto flex w-full gap-3'>
                            <button
                                onclick={() => backFrom(6)}
                                class='flex flex-1 items-center justify-center rounded-sm border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors'
                            >
                                Back
                            </button>
                            <button
                                onclick={handleStaffContinue}
                                disabled={staffList.length === 0}
                                class={cn(
                                    'flex flex-1 items-center justify-center rounded-sm py-3 text-sm font-semibold text-white transition-colors',
                                    staffList.length > 0 ? 'bg-[#2069C1] hover:bg-[#0864d6]' : 'bg-blue-300 cursor-not-allowed',
                                )}
                            >
                                Continue
                            </button>
                        </div>
                    {:else if currentStep === 7}
                        <!-- Application Review Step -->
                        <div class='flex flex-col items-center text-center'>
                            <div class='mb-5 flex h-14 w-14 items-center justify-center rounded-sm bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] ring-1 ring-slate-200'>
                                <CheckCheck size={24} class='text-slate-400' strokeWidth={1.5} />
                            </div>
                            <h2 class='text-[20px] font-semibold text-slate-900'>Application Review</h2>
                            <p class='mt-2 text-sm text-slate-500 font-medium opacity-80 max-w-[450px]'>
                                Review all information provided before submitting your application for evaluation.
                            </p>
                        </div>

                        <!-- Action Buttons -->
                        <div class='mt-10 mb-10 flex w-full gap-3'>
                            <button
                                onclick={() => backFrom(7)}
                                class='flex flex-1 items-center justify-center rounded-sm border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors'
                            >
                                Back
                            </button>
                            <button
                                onclick={handleSubmitApplication}
                                class='flex flex-1 items-center justify-center rounded-sm bg-[#2069C1] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0864d6]'
                            >
                                Submit Application
                            </button>
                        </div>

                        <!-- Review Sections -->
                        <div class='space-y-4'>
                            {#each [
                                { title: 'Trade Selection Completed', subtitle: 'Select the trade you are applying for' },
                                { title: 'Competencies Selected', subtitle: 'Select competencies for the selected trade' },
                                { title: 'Equipment and Facilities Added with Proofs', subtitle: 'List available equipment and upload proof' },
                                { title: 'Curriculum Documents', subtitle: 'Upload curriculum and training materials' },
                                { title: 'Staff Allocation', subtitle: 'Indicate staff availability for the trade' },
                            ] as section}
                                <div class='group overflow-hidden rounded-sm border border-slate-200 bg-white transition-all hover:border-slate-300'>
                                    <button class='flex w-full items-center justify-between p-5 text-left'>
                                        <div class='flex items-center gap-4'>
                                            <div class='flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-emerald-500'>
                                                <Check size={20} strokeWidth={3} />
                                            </div>
                                            <div>
                                                <h4 class='text-[15px] font-semibold text-slate-700'>{section.title}</h4>
                                                <p class='mt-0.5 text-[12px] text-slate-400'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum dolor.</p>
                                            </div>
                                        </div>
                                        <ChevronDown size={18} class='text-slate-400' />
                                    </button>
                                </div>
                            {/each}
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    {/if}
</PageContainer>

<style>
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
