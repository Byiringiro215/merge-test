<script lang='ts'>
    import { goto } from '$app/navigation';
    import { page } from '$app/state';
    import { cn } from '$lib/accreditation/utils/cn';
    import StatsGrid from '$lib/components/accreditation/dashboard/StatsGrid.svelte';
    import PageContainer from '$lib/components/accreditation/layout/PageContainer.svelte';
    import {
        AlertTriangle,
        ArrowLeft,
        Blocks,
        Briefcase,
        Check,
        CheckCheck,
        CheckCircle2,
        ChevronDown,
        ChevronRight,
        ChevronUp,
        Clock,
        FileCheck,
        FileText,
        FolderPlus,
        Hexagon,
        Minus,
        Pencil,
        Plus,
        Search,
        Trash2,
        UploadCloud,
        UserPlus,
        Users,
        X,
    } from '@lucide/svelte';

    const stepsList = [
        { id: 1, title: 'Trade Selection', subtitle: 'Select the trade you are applying for', icon: Blocks },
        { id: 2, title: 'Competencies', subtitle: 'Select competencies for the selected trade', icon: Hexagon },
        { id: 3, title: 'Equipment & Facilities', subtitle: 'List available equipment and upload proof', icon: Briefcase },
        { id: 4, title: 'MOU Documents', subtitle: 'Upload Memorandum of Understanding', icon: FileCheck },
        { id: 5, title: 'Curriculum Documents', subtitle: 'Upload curriculum and training materials', icon: FileText },
        { id: 6, title: 'Staff Allocation', subtitle: 'Indicate staff availability for the trade', icon: Users },
    ];

    // RTB/RTNB = predefined curriculum; OTHER = applicant must supply curriculum
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

    const competenciesList = $state([
        { id: '1', name: 'JavaScript' },
        { id: '2', name: 'Fundamentals Of Programming Using C' },
        { id: '3', name: 'Masonry' },
        { id: '4', name: 'Data Structures & Algorithms' },
        { id: '5', name: 'Software Engineering & Embedded Systems' },
        { id: '6', name: 'Carpentry Basics' },
        { id: '7', name: 'Advanced Wiring' },
    ]);

    // ── State ──────────────────────────────────────────────────────────────────
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

    // Custom competencies (for 'other' trade)
    let customCompetencyName = $state('');
    let customCompetencyHours = $state('');
    let customCompetencies = $state<{ id: string; name: string; hours: string }[]>([]);

    // Step 3 – Equipment
    let equipmentName = $state('');
    let equipmentQuantity = $state(1);
    let equipmentProof = $state<string | null>(null);
    let equipmentProofName = $state<string | null>(null);
    let equipments = $state<{ id: string; name: string; quantity: number; proof: string | null }[]>([]);

    // Step 4 – MOU Documents
    let mouDocs = $state<{ id: string; name: string; size: string; extension: string; progress: number }[]>([]);

    // Step 5 – Curriculum Documents (conditional)
    let curriculumDocs = $state<{ id: string; name: string; size: string; extension: string; progress: number }[]>([]);

    // Step 6 – Staff Allocation
    let staffQualification = $state('');
    let staffPosition = $state('');
    let staffNumber = $state(1);
    let staffStatus = $state('');
    let allocations = $state<{ id: string; qualification: string; position: string; quantity: number; status: string }[]>([]);

    let expandedReviewSection = $state<number | null>(null);

    // ── Derived ────────────────────────────────────────────────────────────────
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

    // ── Existing applications list ──────────────────────────────────────────────
    const existingApplications = [
        { id: '1', trade: 'JavaScript', category: 'SPE', status: 'Pending', stage: 'Initial Review', submittedOn: '19/12/2025' },
        { id: '2', trade: 'Masonry', category: 'CON', status: 'Pending', stage: 'Due Diligence Scheduled', submittedOn: '15/12/2025' },
        { id: '3', trade: 'Electrical Installation', category: 'TEC', status: 'Approved', stage: 'Decision Making', submittedOn: '01/12/2025' },
    ];

    const statusColors: Record<string, string> = {
        Pending: 'bg-amber-50 text-amber-700',
        Approved: 'bg-emerald-50 text-emerald-700',
        Rejected: 'bg-red-50 text-red-700',
    };

    const stats = $derived([
        {
            label: 'Total Applications',
            value: existingApplications.length.toString(),
            icon: FileText,
            iconColor: '#2069C1',
        },
        {
            label: 'Pending',
            value: existingApplications.filter(a => a.status === 'Pending').length.toString(),
            icon: Clock,
            iconColor: '#FF8D28',
        },
        {
            label: 'Approved',
            value: existingApplications.filter(a => a.status === 'Approved').length.toString(),
            icon: CheckCircle2,
            iconColor: '#34C759',
        },
        {
            label: 'Rejected',
            value: existingApplications.filter(a => a.status === 'Rejected').length.toString(),
            icon: AlertTriangle,
            iconColor: '#FF383C',
        },
    ]);

    // ── Helpers ────────────────────────────────────────────────────────────────
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

    // ── Navigation ─────────────────────────────────────────────────────────────
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
    function handleCurriculumContinue() {
        currentStep = 6;
    }
    function handleStaffContinue() {
        currentStep = 7;
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

    // ── File upload helpers ────────────────────────────────────────────────────
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

    function handleAddStaff() {
        if (staffQualification && staffPosition && staffStatus) {
            allocations.push({ id: Math.random().toString(), qualification: staffQualification, position: staffPosition, quantity: staffNumber, status: staffStatus });
            staffQualification = '';
            staffPosition = '';
            staffStatus = '';
            staffNumber = 1;
        }
    }
    function removeAllocation(id: string) {
        allocations = allocations.filter(a => a.id !== id);
    }

    // Shared file icon bg
    function iconBg(ext: string) {
        return ext === 'PDF' ? 'bg-red-500' : ext === 'MP4' ? 'bg-blue-500' : ext === 'FIG' ? 'bg-purple-500' : (ext === 'DOCX' || ext === 'DOC') ? 'bg-blue-400' : 'bg-slate-500';
    }
</script>

<PageContainer
    title='Apply For Short Course'
    description='Create and manage your accreditation applications for the selected trades.'
>
    {#snippet action()}
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
    {/snippet}

    {#if !showWizard}
        <!-- ── List View ─────────────────────────────────────────────────────── -->
        <div class='flex flex-col gap-6'>
            <StatsGrid items={stats} />

            <div class='overflow-hidden rounded-sm border border-slate-100 bg-white'>
                <div class='border-b border-slate-100 p-6'>
                    <h3 class='text-[15px] font-semibold text-slate-800'>My Applications</h3>
                    <p class='mt-0.5 text-sm text-slate-500'>Track the progress of your accreditation applications</p>
                </div>
                <div class='overflow-x-auto'>
                    <table class='w-full'>
                        <thead>
                            <tr class='border-b border-slate-100 bg-slate-50/50'>
                                <th class='px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400'>Trade</th>
                                <th class='px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400'>Category</th>
                                <th class='px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400'>Stage</th>
                                <th class='px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400'>Status</th>
                                <th class='px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400'>Submitted</th>
                            </tr>
                        </thead>
                        <tbody class='divide-y divide-slate-100'>
                            {#each existingApplications as app}
                                <tr class='cursor-pointer transition-colors hover:bg-slate-50/30' onclick={() => goto(`/accreditation/applicant/applications/${app.id}`)}>
                                    <td class='px-6 py-4'><span class='text-sm font-semibold text-slate-800'>{app.trade}</span></td>
                                    <td class='px-6 py-4'><span class='rounded-sm bg-slate-100 px-2 py-0.5 text-[12px] font-bold uppercase tracking-wider text-slate-500'>{app.category}</span></td>
                                    <td class='px-6 py-4'><span class='text-sm text-slate-600'>{app.stage}</span></td>
                                    <td class='px-6 py-4'><span class={`text-[12px] font-medium px-2.5 py-1 rounded-full ${statusColors[app.status] || 'bg-slate-100 text-slate-600'}`}>{app.status}</span></td>
                                    <td class='px-6 py-4'><span class='text-sm text-slate-500'>{app.submittedOn}</span></td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </div>

            <p class='text-center text-sm text-slate-400'>
                Click <span class='font-medium text-[#2069C1]'>New Application</span> to start a new accreditation application.
            </p>
        </div>
    {:else}
        <!-- ── Wizard ────────────────────────────────────────────────────────────── -->
        <div class='flex min-h-[700px] flex-1 overflow-hidden rounded-sm border border-slate-100 bg-white'>
            <!-- Sidebar -->
            <div class='w-[300px] shrink-0 border-r border-slate-100 bg-[#FAFAFA] p-8'>
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
                            <div class={cn('relative z-10 flex gap-4', isSkipped ? 'opacity-40' : '')}>
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

            <!-- Wizard Content -->
            <div class='flex flex-1 flex-col overflow-y-auto bg-white py-14 px-8 md:px-[60px] lg:px-[100px]'>
                <div class='mx-auto flex w-full max-w-[600px] flex-col'>
                    <!-- ── STEP 1: TRADE SELECTION ───────────────────────────────────── -->
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

                        <!-- ── STEP 2: COMPETENCIES ──────────────────────────────────────── -->
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
                            <!-- ── Custom trade: name + hours input form ── -->
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
                                        <p class='mb-1 text-[12px] font-medium text-slate-500'>{customCompetencies.length} competenc{customCompetencies.length === 1 ? 'y' : 'ies'} added</p>
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
                            <!-- ── Predefined trade: multi-select list ── -->
                            <div class='mt-2'>
                                <div class='mb-3 flex items-center justify-between'>
                                    <p class='text-[12px] text-slate-500'>{filteredCompetencies.length} competencies available</p>
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

                        <!-- ── STEP 3: EQUIPMENT & FACILITIES ───────────────────────────── -->
                    {:else if currentStep === 3}
                        <div class='flex flex-col items-center text-center'>
                            <div class='mb-5 flex h-14 w-14 items-center justify-center rounded-sm bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] ring-1 ring-slate-200'>
                                <Briefcase size={24} class='text-slate-500' strokeWidth={1.5} />
                            </div>
                            <h2 class='text-[17px] font-semibold text-slate-900'>Equipment and Facilities</h2>
                            <p class='mt-1.5 text-sm text-slate-500'>List the available equipment and upload supporting proof.</p>
                        </div>

                        <!-- Breadcrumb -->
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
                                        {selectedCompetencyNames.length === 1 ? selectedCompetencyNames[0] : `${selectedCompetencyNames.length} competencies`}
                                    </span>
                                    <div class='flex h-[16px] w-[16px] items-center justify-center rounded-full bg-emerald-500'>
                                        <Check size={10} class='text-white' strokeWidth={3} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class='mt-2 text-left'>
                            <div class='mb-5 rounded-sm border border-slate-200 bg-white p-6 shadow-sm'>
                                <div class='mb-5'>
                                    <label class='mb-2 block text-sm font-medium text-slate-700' for='equipment-name'>
                                        Equipment Name <span class='text-red-500'>*</span>
                                    </label>
                                    <input id='equipment-name' type='text' placeholder='Select ...' bind:value={equipmentName}
                                           class='w-full rounded-sm border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#2069C1] focus:outline-none focus:ring-1 focus:ring-[#2069C1]' />
                                </div>

                                <div class='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                                    <div>
                                        <label for='equipment-quantity' class='mb-2 block text-sm font-medium text-slate-700'>
                                            Quantity <span class='text-red-500'>*</span>
                                        </label>
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
                                        <p class='mt-1.5 text-[10px] font-medium uppercase text-slate-400'>*.png, jpeg, jpg</p>
                                    </div>
                                </div>
                            </div>

                            <button onclick={handleAddEquipment}
                                    class='mb-8 flex items-center justify-center gap-2 rounded-sm bg-[#2069C1] px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-600'>
                                Add Equipment
                                <FolderPlus size={16} />
                            </button>

                            <div class='mb-8 flex w-full gap-3'>
                                <button onclick={() => backFrom(3)} class='flex flex-1 items-center justify-center rounded-sm border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50'>Back</button>
                                <button onclick={handleEquipmentContinue} class='flex flex-1 items-center justify-center rounded-sm bg-[#2069C1] py-3 text-sm font-semibold text-white hover:bg-[#0864d6]'>Continue</button>
                            </div>

                            {#if equipments.length > 0}
                                <div class='flex flex-col gap-3'>
                                    {#each equipments as eq}
                                        <div class='relative flex items-center gap-4 rounded-sm border border-slate-200 bg-white p-3'>
                                            <div class='h-14 w-20 shrink-0 overflow-hidden rounded-sm bg-slate-100'>
                                                {#if eq.proof}<img src={eq.proof} alt='proof' class='h-full w-full object-cover' />
                                                {:else}<div class='flex h-full w-full items-center justify-center text-xs text-slate-400'>No Image</div>{/if}
                                            </div>
                                            <div class='flex-1'>
                                                <p class='text-sm font-medium text-slate-800'>{eq.name}</p>
                                                <p class='mt-0.5 text-[11px] text-slate-500'>Quantity: {eq.quantity}</p>
                                            </div>
                                            <button onclick={() => removeEquipment(eq.id)} class='absolute right-3 top-3 text-slate-400 hover:text-slate-600'><X size={16} /></button>
                                            <div class='absolute bottom-3 right-3 flex gap-2'>
                                                <button class='text-[#2069C1]'><Pencil size={16} /></button>
                                                <button onclick={() => removeEquipment(eq.id)} class='text-red-400'><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                    {/each}
                                </div>
                            {/if}
                        </div>

                        <!-- ── STEP 4: MOU DOCUMENTS ─────────────────────────────────────── -->
                    {:else if currentStep === 4}
                        <div class='flex flex-col items-center text-center'>
                            <div class='mb-5 flex h-14 w-14 items-center justify-center rounded-sm bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] ring-1 ring-slate-200'>
                                <FileCheck size={24} class='text-slate-500' strokeWidth={1.5} />
                            </div>
                            <h2 class='text-[17px] font-semibold text-slate-900'>MOU Documents</h2>
                            <p class='mt-1.5 text-sm text-slate-500'>
                                Upload the signed Memorandum of Understanding for this application.<br />
                                <span class='text-[12px] text-slate-400'>This document is specific to each application and must be freshly signed.</span>
                            </p>
                        </div>

                        <div class='mt-8 mb-6 w-full text-left'>
                            <label class='flex cursor-pointer flex-col items-center justify-center rounded-sm border border-dashed border-slate-300 bg-white py-10 hover:bg-slate-50'>
                                <div class='mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm'>
                                    <UploadCloud size={20} class='text-slate-500' strokeWidth={1.5} />
                                </div>
                                <p class='text-sm text-slate-500'><span class='font-medium text-[#2069C1]'>Click to upload</span> or drag and drop</p>
                                <p class='mt-1 text-[11px] text-slate-400'>PDF, DOCX (max. 50MB)</p>
                                <input type='file' multiple class='hidden' onchange={e => uploadDocs(e, 'mou')} />
                            </label>
                        </div>

                        {#if mouDocs.length > 0}
                            <div class='mb-8 flex w-full flex-col gap-3'>
                                {#each mouDocs as doc}
                                    {@const isDone = doc.progress === 100}
                                    <div class='relative flex flex-col justify-center rounded-sm border border-slate-200 bg-white p-4'>
                                        <div class='flex items-start justify-between'>
                                            <div class='flex items-center gap-4'>
                                                <div class='relative mt-0.5 flex h-10 w-8 items-center justify-center rounded-sm border border-slate-200 bg-slate-50 shadow-sm'>
                                                    <div class={cn('absolute bottom-1 left-1.5 right-1.5 flex items-center justify-center rounded-sm px-1 py-0.5', iconBg(doc.extension))}>
                                                        <span class='text-[8px] font-bold tracking-widest text-white'>{doc.extension}</span>
                                                    </div>
                                                </div>
                                                <div class='flex flex-col pt-0.5'>
                                                    <p class='text-sm font-medium text-slate-800'>{doc.name}</p>
                                                    <p class='text-[11px] text-slate-500'>{doc.size}</p>
                                                </div>
                                            </div>
                                            <div class='pt-0.5'>
                                                {#if isDone}
                                                    <div class='flex h-[22px] w-[22px] items-center justify-center rounded-sm bg-[#2069C1]'>
                                                        <Check size={14} class='text-white' strokeWidth={3} />
                                                    </div>
                                                {:else}
                                                    <button onclick={() => removeDoc(doc.id, 'mou')} class='text-slate-400 hover:text-red-500'><Trash2 size={20} /></button>
                                                {/if}
                                            </div>
                                        </div>
                                        <div class='mt-4 flex items-center gap-3'>
                                            <div class='h-2 flex-1 overflow-hidden rounded-full bg-slate-100'>
                                                <div class='h-full bg-[#2069C1] transition-all duration-300' style='width: {doc.progress}%'></div>
                                            </div>
                                            <span class='w-8 text-right text-[12px] font-medium text-slate-500'>{doc.progress}%</span>
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        {/if}

                        <div class='mb-8 flex w-full gap-3'>
                            <button onclick={() => backFrom(4)} class='flex flex-1 items-center justify-center rounded-sm border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50'>Back</button>
                            <button onclick={handleMouContinue}
                                    disabled={mouDocs.length === 0 || mouDocs.some(d => d.progress < 100)}
                                    class={cn('flex flex-1 items-center justify-center rounded-sm py-3 text-sm font-semibold text-white transition-colors', (mouDocs.length > 0 && mouDocs.every(d => d.progress === 100)) ? 'bg-[#2069C1] hover:bg-[#0864d6]' : 'bg-blue-300 cursor-not-allowed')}>
                                Continue
                            </button>
                        </div>

                        <!-- ── STEP 5: CURRICULUM DOCUMENTS (conditional) ────────────────── -->
                    {:else if currentStep === 5}
                        <div class='flex flex-col items-center text-center'>
                            <div class='mb-5 flex h-14 w-14 items-center justify-center rounded-sm bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] ring-1 ring-slate-200'>
                                <FileText size={24} class='text-slate-500' strokeWidth={1.5} />
                            </div>
                            <h2 class='text-[17px] font-semibold text-slate-900'>Curriculum Documents</h2>
                            <p class='mt-1.5 text-sm text-slate-500'>
                                Upload curriculum and related training documents.<br />
                                <span class='text-[12px] font-medium text-[#2069C1]'>Required — this trade is not registered under RTB or RTNB.</span>
                            </p>
                        </div>

                        <div class='mt-8 mb-6 w-full text-left'>
                            <label class='flex cursor-pointer flex-col items-center justify-center rounded-sm border border-dashed border-slate-300 bg-white py-10 hover:bg-slate-50'>
                                <div class='mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm'>
                                    <UploadCloud size={20} class='text-slate-500' strokeWidth={1.5} />
                                </div>
                                <p class='text-sm text-slate-500'><span class='font-medium text-[#2069C1]'>Click to upload</span> or drag and drop</p>
                                <p class='mt-1 text-[11px] text-slate-400'>PDF, DOCX, MP4 or FIG (max. 100MB)</p>
                                <input type='file' multiple class='hidden' onchange={e => uploadDocs(e, 'curriculum')} />
                            </label>
                        </div>

                        {#if curriculumDocs.length > 0}
                            <div class='mb-8 flex w-full flex-col gap-3'>
                                {#each curriculumDocs as doc}
                                    {@const isDone = doc.progress === 100}
                                    <div class='relative flex flex-col justify-center rounded-sm border border-slate-200 bg-white p-4'>
                                        <div class='flex items-start justify-between'>
                                            <div class='flex items-center gap-4'>
                                                <div class='relative mt-0.5 flex h-10 w-8 items-center justify-center rounded-sm border border-slate-200 bg-slate-50 shadow-sm'>
                                                    <div class={cn('absolute bottom-1 left-1.5 right-1.5 flex items-center justify-center rounded-sm px-1 py-0.5', iconBg(doc.extension))}>
                                                        <span class='text-[8px] font-bold tracking-widest text-white'>{doc.extension}</span>
                                                    </div>
                                                </div>
                                                <div class='flex flex-col pt-0.5'>
                                                    <p class='text-sm font-medium text-slate-800'>{doc.name}</p>
                                                    <p class='text-[11px] text-slate-500'>{doc.size}</p>
                                                </div>
                                            </div>
                                            <div class='pt-0.5'>
                                                {#if isDone}
                                                    <div class='flex h-[22px] w-[22px] items-center justify-center rounded-sm bg-[#2069C1]'>
                                                        <Check size={14} class='text-white' strokeWidth={3} />
                                                    </div>
                                                {:else}
                                                    <button onclick={() => removeDoc(doc.id, 'curriculum')} class='text-slate-400 hover:text-red-500'><Trash2 size={20} /></button>
                                                {/if}
                                            </div>
                                        </div>
                                        <div class='mt-4 flex items-center gap-3'>
                                            <div class='h-2 flex-1 overflow-hidden rounded-full bg-slate-100'>
                                                <div class='h-full bg-[#2069C1] transition-all duration-300' style='width: {doc.progress}%'></div>
                                            </div>
                                            <span class='w-8 text-right text-[12px] font-medium text-slate-500'>{doc.progress}%</span>
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        {/if}

                        <div class='mb-8 flex w-full gap-3'>
                            <button onclick={() => backFrom(5)} class='flex flex-1 items-center justify-center rounded-sm border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50'>Back</button>
                            <button onclick={handleCurriculumContinue}
                                    disabled={curriculumDocs.length === 0 || curriculumDocs.some(d => d.progress < 100)}
                                    class={cn('flex flex-1 items-center justify-center rounded-sm py-3 text-sm font-semibold text-white transition-colors', (curriculumDocs.length > 0 && curriculumDocs.every(d => d.progress === 100)) ? 'bg-[#2069C1] hover:bg-[#0864d6]' : 'bg-blue-300 cursor-not-allowed')}>
                                Continue
                            </button>
                        </div>

                        <!-- ── STEP 6: STAFF ALLOCATION ──────────────────────────────────── -->
                    {:else if currentStep === 6}
                        <div class='flex flex-col items-center text-center'>
                            <div class='mb-5 flex h-14 w-14 items-center justify-center rounded-sm bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] ring-1 ring-slate-200'>
                                <Users size={24} class='text-slate-500' strokeWidth={1.5} />
                            </div>
                            <h2 class='text-[17px] font-semibold text-slate-900'>Staff Allocation</h2>
                            <p class='mt-1.5 text-sm text-slate-500'>Indicate staff availability by qualification and position.</p>
                        </div>

                        <div class='mt-2 text-left'>
                            <div class='mb-5 rounded-sm border border-slate-200 bg-white p-6 shadow-sm'>
                                <div class='mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2'>
                                    <div>
                                        <label class='mb-2 block text-sm font-medium text-slate-700' for='qualification'>Qualification <span class='text-red-500'>*</span></label>
                                        <div class='relative'>
                                            <select id='qualification' class='w-full appearance-none rounded-sm border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-[#2069C1] focus:outline-none focus:ring-1 focus:ring-[#2069C1]' bind:value={staffQualification}>
                                                <option value='' disabled>Select ..</option>
                                                <option value="Bachelor's Degree">Bachelor's Degree</option>
                                                <option value="Master's Degree">Master's Degree</option>
                                                <option value='PhD'>PhD</option>
                                                <option value='Diploma'>Diploma</option>
                                            </select>
                                            <ChevronDown size={16} class='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400' strokeWidth={1.5} />
                                        </div>
                                    </div>
                                    <div>
                                        <label class='mb-2 block text-sm font-medium text-slate-700' for='position'>Position <span class='text-red-500'>*</span></label>
                                        <div class='relative'>
                                            <select id='position' class='w-full appearance-none rounded-sm border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-[#2069C1] focus:outline-none focus:ring-1 focus:ring-[#2069C1]' bind:value={staffPosition}>
                                                <option value='' disabled>Select ..</option>
                                                <option value='Instructor'>Instructor</option>
                                                <option value='Teaching Assistant'>Teaching Assistant</option>
                                                <option value='Lab Technician'>Lab Technician</option>
                                            </select>
                                            <ChevronDown size={16} class='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400' strokeWidth={1.5} />
                                        </div>
                                    </div>
                                </div>

                                <div class='grid grid-cols-1 gap-5 sm:grid-cols-2'>
                                    <div>
                                        <label for='staff-quantity' class='mb-2 block text-sm font-medium text-slate-700'>Quantity <span class='text-red-500'>*</span></label>
                                        <div class='flex items-center justify-between rounded-sm border border-slate-200 bg-white px-3 py-2'>
                                            <span id='staff-quantity' class='ml-1 w-8 text-sm font-medium'>{staffNumber}</span>
                                            <div class='flex items-center gap-1'>
                                                <button onclick={() => staffNumber += 1} class='rounded-sm p-1 hover:bg-slate-100'><Plus size={16} class='text-slate-600' /></button>
                                                <button onclick={() => staffNumber = Math.max(1, staffNumber - 1)} class='rounded-sm p-1 hover:bg-slate-100'><Minus size={16} class='text-slate-600' /></button>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label class='mb-2 block text-sm font-medium text-slate-700' for='status'>Availability Status <span class='text-red-500'>*</span></label>
                                        <div class='relative'>
                                            <select id='status' class='w-full appearance-none rounded-sm border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-[#2069C1] focus:outline-none focus:ring-1 focus:ring-[#2069C1]' bind:value={staffStatus}>
                                                <option value='' disabled>Select ..</option>
                                                <option value='Full-Time'>Full-Time</option>
                                                <option value='Part-Time'>Part-Time</option>
                                                <option value='Contract'>Contract</option>
                                            </select>
                                            <ChevronDown size={16} class='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400' strokeWidth={1.5} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button onclick={handleAddStaff}
                                    class='mb-8 flex w-fit items-center justify-center gap-2 rounded-sm bg-[#2069C1] px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-600'>
                                Add Staff <UserPlus size={16} />
                            </button>

                            {#if allocations.length > 0}
                                <div class='mb-8 flex w-full flex-col gap-3'>
                                    {#each allocations as alloc}
                                        <div class='flex flex-col rounded-sm border border-slate-200 bg-white p-4'>
                                            <div class='flex items-start justify-between'>
                                                <div>
                                                    <p class='text-sm font-semibold text-slate-800'>{alloc.position}</p>
                                                    <p class='text-[12px] text-slate-500'>{alloc.qualification} • {alloc.status}</p>
                                                </div>
                                                <button onclick={() => removeAllocation(alloc.id)} class='text-red-400 hover:text-red-600'><Trash2 size={16} /></button>
                                            </div>
                                            <p class='mt-2 text-[11px] font-medium uppercase tracking-wide text-slate-400'>Quantity: {alloc.quantity}</p>
                                        </div>
                                    {/each}
                                </div>
                            {/if}

                            <div class='mb-8 flex w-full gap-3'>
                                <button onclick={() => backFrom(6)} class='flex flex-1 items-center justify-center rounded-sm border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-slate-50'>Back</button>
                                <button onclick={handleStaffContinue} class='flex flex-1 items-center justify-center rounded-sm bg-[#2069C1] py-3 text-sm font-semibold text-white hover:bg-[#0864d6]'>Continue</button>
                            </div>
                        </div>

                        <!-- ── STEP 7: APPLICATION REVIEW ────────────────────────────────── -->
                    {:else if currentStep === 7}
                        <div class='flex flex-col items-center text-center'>
                            <div class='mb-5 flex h-14 w-14 items-center justify-center rounded-sm bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] ring-1 ring-slate-200'>
                                <CheckCheck size={24} class='text-slate-500' strokeWidth={1.5} />
                            </div>
                            <h2 class='text-[17px] font-semibold text-slate-900'>Application Review</h2>
                            <p class='mt-1.5 text-sm text-slate-500'>Review all information before submitting your application for evaluation.</p>
                        </div>

                        <div class='mt-6 mb-8 flex w-full gap-3'>
                            <button onclick={() => backFrom(7)} class='flex flex-1 items-center justify-center rounded-sm border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50'>Back</button>
                            <button class='flex flex-1 items-center justify-center rounded-sm bg-[#2069C1] py-3 text-sm font-semibold text-white hover:bg-[#0864d6]'>Submit Application</button>
                        </div>

                        <div class='flex flex-col gap-3'>
                            {#each [
                                { id: 1, title: 'Trade Selection Completed', desc: 'View the selected trade for this application' },
                                { id: 2, title: 'Competencies Selected', desc: `${selectedCompetencies.length} competenc${selectedCompetencies.length === 1 ? 'y' : 'ies'} selected` },
                                { id: 3, title: 'Equipment and Facilities Added', desc: 'List of equipment with proof of ownership' },
                                { id: 4, title: 'MOU Documents Uploaded', desc: `${mouDocs.length} document${mouDocs.length !== 1 ? 's' : ''} uploaded` },
                                ...(curriculumRequired ? [{ id: 5, title: 'Curriculum Documents Uploaded', desc: `${curriculumDocs.length} document${curriculumDocs.length !== 1 ? 's' : ''} uploaded` }] : []),
                                { id: 6, title: 'Staff Allocation', desc: 'Allocated instructors and staff members' },
                            ] as section}
                                {@const isExpanded = expandedReviewSection === section.id}
                                <div class='overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm'>
                                    <button onclick={() => expandedReviewSection = isExpanded ? null : section.id}
                                            class='flex w-full items-center justify-between p-4'>
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

                                    {#if isExpanded}
                                        <div class='border-t border-slate-100 bg-slate-50/50 p-6'>
                                            {#if section.id === 1}
                                                <p class='mb-2 text-[12px] font-semibold uppercase tracking-wider text-slate-500'>Selected Trade</p>
                                                <p class='text-[14px] font-medium text-slate-800'>{selectedTradeName}</p>
                                                <span class={cn('mt-1.5 inline-block text-[11px] px-2 py-0.5 rounded-sm font-medium', boardClass(selectedTradeData?.board ?? ''))}>{boardLabel(selectedTradeData?.board ?? '')}</span>
                                            {:else if section.id === 2}
                                                <p class='mb-3 text-[12px] font-semibold uppercase tracking-wider text-slate-500'>Selected Competencies</p>
                                                <ul class='space-y-1.5'>
                                                    {#each selectedCompetencyNames as name}
                                                        <li class='flex items-center gap-2 text-sm text-slate-800'>
                                                            <Check size={14} class='shrink-0 text-emerald-500' strokeWidth={3} />
                                                            {name}
                                                        </li>
                                                    {/each}
                                                </ul>
                                            {:else if section.id === 3}
                                                <p class='mb-3 text-[12px] font-semibold uppercase tracking-wider text-slate-500'>Equipment</p>
                                                {#if equipments.length === 0}
                                                    <p class='text-sm italic text-slate-400'>No equipment added.</p>
                                                {:else}
                                                    <ul class='space-y-3'>
                                                        {#each equipments as eq}
                                                            <li class='flex items-center gap-3'>
                                                                <div class='h-10 w-14 shrink-0 overflow-hidden rounded-sm bg-slate-200'>
                                                                    {#if eq.proof}<img src={eq.proof} alt='' class='h-full w-full object-cover' />{/if}
                                                                </div>
                                                                <div>
                                                                    <p class='text-sm font-medium text-slate-700'>{eq.name}</p>
                                                                    <p class='text-[12px] text-slate-500'>Qty: {eq.quantity}</p>
                                                                </div>
                                                            </li>
                                                        {/each}
                                                    </ul>
                                                {/if}
                                            {:else if section.id === 4}
                                                <p class='mb-3 text-[12px] font-semibold uppercase tracking-wider text-slate-500'>MOU Documents</p>
                                                {#if mouDocs.length === 0}
                                                    <p class='text-sm italic text-slate-400'>No MOU documents uploaded.</p>
                                                {:else}
                                                    <ul class='space-y-2'>
                                                        {#each mouDocs as doc}
                                                            <li class='flex items-center justify-between rounded-sm border border-slate-100 bg-white p-2.5 text-sm'>
                                                                <span class='font-medium text-slate-700'>{doc.name}</span>
                                                                <span class='text-[11px] text-slate-400'>{doc.size}</span>
                                                            </li>
                                                        {/each}
                                                    </ul>
                                                {/if}
                                            {:else if section.id === 5}
                                                <p class='mb-3 text-[12px] font-semibold uppercase tracking-wider text-slate-500'>Curriculum Documents</p>
                                                {#if curriculumDocs.length === 0}
                                                    <p class='text-sm italic text-slate-400'>No curriculum documents uploaded.</p>
                                                {:else}
                                                    <ul class='space-y-2'>
                                                        {#each curriculumDocs as doc}
                                                            <li class='flex items-center justify-between rounded-sm border border-slate-100 bg-white p-2.5 text-sm'>
                                                                <span class='font-medium text-slate-700'>{doc.name}</span>
                                                                <span class='text-[11px] text-slate-400'>{doc.size}</span>
                                                            </li>
                                                        {/each}
                                                    </ul>
                                                {/if}
                                            {:else if section.id === 6}
                                                <p class='mb-3 text-[12px] font-semibold uppercase tracking-wider text-slate-500'>Staff Allocations</p>
                                                {#if allocations.length === 0}
                                                    <p class='text-sm italic text-slate-400'>No staff members allocated.</p>
                                                {:else}
                                                    <div class='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                                                        {#each allocations as alloc}
                                                            <div class='rounded-sm border border-slate-100 bg-white p-3'>
                                                                <p class='text-sm font-semibold text-slate-800'>{alloc.position}</p>
                                                                <p class='mt-0.5 text-[12px] text-slate-500'>{alloc.qualification}</p>
                                                                <p class='mt-2 w-fit rounded-sm bg-slate-50 px-1.5 py-0.5 text-[11px] uppercase tracking-wider text-slate-400'>{alloc.status} • Qty: {alloc.quantity}</p>
                                                            </div>
                                                        {/each}
                                                    </div>
                                                {/if}
                                            {/if}
                                        </div>
                                    {/if}
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
    .overflow-y-auto::-webkit-scrollbar {
        width: 6px;
    }
    .overflow-y-auto::-webkit-scrollbar-track {
        background: transparent;
    }
    .overflow-y-auto::-webkit-scrollbar-thumb {
        background: #e2e8f0;
        border-radius: 10px;
    }
    .overflow-y-auto::-webkit-scrollbar-thumb:hover {
        background: #cbd5e1;
    }
</style>
