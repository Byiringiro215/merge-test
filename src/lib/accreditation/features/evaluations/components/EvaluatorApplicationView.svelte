<script lang='ts'>
    import { goto } from '$app/navigation';
    import { mockApplications } from '$lib/accreditation/utils/application-utils';
    import { cn } from '$lib/accreditation/utils/cn';
    import DocumentViewerModal from '$lib/components/accreditation/ui/DocumentViewerModal.svelte';
    import {
        ArrowLeft,
        BookOpen,
        Building2,
        Check,
        CheckCircle,
        ChevronDown,
        Clock,
        Database,
        Eye,
        Globe,
        Mail,
        Map,
        MapPin,
        MessageSquare,
        Navigation,
        Phone,
        RotateCcw,
        Search,
        Users,
    } from '@lucide/svelte';

    const { id } = $props<{ id: string }>();

    const application = $derived(
        mockApplications.find(app => app.id === id) || mockApplications[0],
    );

    let activeTab = $state<'initial-review' | 'due-diligence'>('initial-review');
    let selectedDocument = $state<{ name: string; size: string } | null>(null);

    // Decision state for each step
    let initialReviewDecision = $state<'approve' | 'revert' | 'defer' | null>(null);
    let initialReviewComment = $state('');

    let dueDiligenceDecision = $state<'approve' | 'revert' | 'defer' | null>(null);
    let dueDiligenceComment = $state('');

    let showAllDocuments = $state(false);
    let showAllEquipment = $state(false);
    let showAllStaff = $state(false);

    const documents = [
        { id: '1', name: 'Trade Course Outline.pdf', size: '2.4 MB', type: 'PDF', note: 'Maps modules to competency levels' },
        { id: '2', name: 'Syllabus_2026_Final.pdf', size: '1.8 MB', type: 'PDF', note: 'Shows weekly delivery and outcomes' },
        { id: '3', name: 'Practical_Workshop_Manual.pdf', size: '5.6 MB', type: 'PDF', note: 'Supports hands-on learning evidence' },
        { id: '4', name: 'Safety_Protocol.pdf', size: '1.2 MB', type: 'PDF', note: 'Workshop safety guidelines' },
        { id: '5', name: 'Assessment_Rubric.pdf', size: '0.8 MB', type: 'PDF', note: 'Grading criteria for modules' },
    ];

    const dueDiligenceEquipment = [
        { id: 1, name: 'Server', quantity: '2 Pieces', found: true, image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc48?w=100&h=80&fit=crop' },
        { id: 2, name: 'Standard Router', quantity: '4 Pieces', found: true, image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=100&h=80&fit=crop' },
    ];

    function handleDecision() {
        // In a real app, this would save the decision
        goto('/accreditation/evaluator/applications');
    }

    const currentDecision = $derived(activeTab === 'initial-review' ? initialReviewDecision : dueDiligenceDecision);
    const currentComment = $derived(activeTab === 'initial-review' ? initialReviewComment : dueDiligenceComment);

    function setDecision(v: 'approve' | 'revert' | 'defer' | null) {
        if (activeTab === 'initial-review') {
            initialReviewDecision = v;
        }
        else {
            dueDiligenceDecision = v;
        }
    }
</script>

<div class='flex w-full flex-col bg-white h-full overflow-hidden'>
    <!-- Header with Back Button and Tabs -->
    <div class='border-b border-slate-200 bg-white px-8 py-4'>
        <div class='mb-6 flex items-center justify-between'>
            <button
                onclick={() => goto('/accreditation/evaluator/applications')}
                class='group flex items-center gap-2 text-[13px] font-medium text-slate-500 transition-colors hover:text-slate-800'
            >
                <ArrowLeft class='h-4 w-4 transition-transform group-hover:-translate-x-1' />
                Back to Applications
            </button>
            <div class='flex gap-2'>
                <span class='rounded-sm bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 uppercase tracking-wider'>{application.trade.name}</span>
                <span class='rounded-sm bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 uppercase tracking-wider'>EVALUATOR REVIEW</span>
            </div>
        </div>

        <div class='flex gap-8'>
            <button
                onclick={() => (activeTab = 'initial-review')}
                class={cn(
                    'relative pb-3 text-sm font-medium transition-all cursor-pointer',
                    activeTab === 'initial-review' ? 'text-[#0A77FF]' : 'text-slate-400 hover:text-slate-600',
                )}
            >
                1. Initial Review
                {#if activeTab === 'initial-review'}
                    <div class='absolute bottom-0 left-0 right-0 h-0.5 bg-[#0A77FF]'></div>
                {/if}
            </button>
            <button
                onclick={() => (activeTab = 'due-diligence')}
                class={cn(
                    'relative pb-3 text-sm font-medium transition-all cursor-pointer',
                    activeTab === 'due-diligence' ? 'text-[#0A77FF]' : 'text-slate-400 hover:text-slate-600',
                )}
            >
                2. Perform Due Diligence
                {#if activeTab === 'due-diligence'}
                    <div class='absolute bottom-0 left-0 right-0 h-0.5 bg-[#0A77FF]'></div>
                {/if}
            </button>
        </div>
    </div>

    <!-- Content Area with independent scrolling -->
    <div class='flex-1 overflow-hidden bg-[#F9FAFB]'>
        <div class='flex h-full w-full gap-8 p-8 lg:flex-row flex-col'>
            <!-- Main Content (Left) -->
            <div class='flex-1 overflow-y-auto space-y-6 no-scrollbar pr-2'>
                <!-- Application Details Card (Moved from Sidebar) -->
                <div class='rounded-md border border-slate-200 bg-white p-6'>
                    <div class='flex flex-wrap items-center justify-between gap-6'>
                        <div class='flex items-start gap-3'>
                            <div class='mt-0.5 rounded-full bg-blue-50 p-1.5'>
                                <Building2 class='h-4 w-4 text-blue-600' />
                            </div>
                            <div>
                                <p class='text-[11px] text-slate-400 uppercase tracking-wide'>Institution</p>
                                <p class='text-[14px] font-semibold text-slate-900'>{application.institution.name}</p>
                            </div>
                        </div>
                        <div class='flex items-start gap-3'>
                            <div class='mt-0.5 rounded-full bg-slate-50 p-1.5'>
                                <Database class='h-4 w-4 text-slate-600' />
                            </div>
                            <div>
                                <p class='text-[11px] text-slate-400 uppercase tracking-wide'>Trade Program</p>
                                <p class='text-[14px] font-semibold text-slate-900'>{application.trade.name}</p>
                            </div>
                        </div>
                        <div class='flex items-start gap-3'>
                            <div class='mt-0.5 rounded-full bg-slate-50 p-1.5'>
                                <BookOpen class='h-4 w-4 text-slate-600' />
                            </div>
                            <div>
                                <p class='text-[11px] text-slate-400 uppercase tracking-wide'>Current Stage</p>
                                <p class='text-[14px] font-semibold text-slate-900'>{application.stage}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {#if activeTab === 'initial-review'}
                    <!-- 1. Institution Profile -->
                    <div class='rounded-md border border-slate-200 bg-white p-6'>
                        <h3 class='text-md font-semibold text-[#101828] mb-6'>1. Institution Profile</h3>

                        <div class='grid grid-cols-1 gap-8'>
                            <!-- General -->
                            <div class='space-y-4'>
                                <h4 class='text-sm font-medium text-slate-700 border-b border-slate-100 pb-2'>General Information</h4>
                                <div class='grid grid-cols-2 gap-4'>
                                    <div class='space-y-1'>
                                        <span class='text-[11px] text-slate-500 uppercase tracking-wide block mb-1'>Name of Institution</span>
                                        <div class='flex items-center gap-2 rounded-sm border border-slate-100 bg-slate-50/50 px-3 py-2 text-[13px] text-slate-700'>
                                            <Building2 class='h-3.5 w-3.5 text-slate-400' />
                                            {application.institution.name}
                                        </div>
                                    </div>
                                    <div class='space-y-1'>
                                        <span class='text-[11px] text-slate-500 uppercase tracking-wide block mb-1'>Institution Type</span>
                                        <div class='flex items-center gap-2 rounded-sm border border-slate-100 bg-slate-50/50 px-3 py-2 text-[13px] text-slate-700'>
                                            <ChevronDown class='h-3.5 w-3.5 text-slate-400' />
                                            Private Vocational Center
                                        </div>
                                    </div>
                                    <div class='space-y-1'>
                                        <span class='text-[11px] text-slate-500 uppercase tracking-wide block mb-1'>Email Address</span>
                                        <div class='flex items-center gap-2 rounded-sm border border-slate-100 bg-slate-50/50 px-3 py-2 text-[13px] text-slate-700'>
                                            <Mail class='h-3.5 w-3.5 text-slate-400' />
                                            janesmith@example.com
                                        </div>
                                    </div>
                                    <div class='space-y-1'>
                                        <span class='text-[11px] text-slate-500 uppercase tracking-wide block mb-1'>Phone Number</span>
                                        <div class='flex items-center gap-2 rounded-sm border border-slate-100 bg-slate-50/50 px-3 py-2 text-[13px] text-slate-700'>
                                            <Phone class='h-3.5 w-3.5 text-slate-400' />
                                            +250 791-234-567
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Address -->
                            <div class='space-y-4 pt-4'>
                                <h4 class='text-sm font-medium text-slate-700 border-b border-slate-100 pb-2'>Physical Address</h4>
                                <div class='grid grid-cols-2 gap-4'>
                                    <div class='space-y-1'>
                                        <span class='text-[11px] text-slate-500 uppercase tracking-wide block mb-1'>Province</span>
                                        <div class='flex items-center gap-2 rounded-sm border border-slate-100 bg-slate-50/50 px-3 py-2 text-[13px] text-slate-700'>
                                            <MapPin class='h-3.5 w-3.5 text-slate-400' />
                                            Western
                                        </div>
                                    </div>
                                    <div class='space-y-1'>
                                        <span class='text-[11px] text-slate-500 uppercase tracking-wide block mb-1'>District</span>
                                        <div class='flex items-center gap-2 rounded-sm border border-slate-100 bg-slate-50/50 px-3 py-2 text-[13px] text-slate-700'>
                                            <Map class='h-3.5 w-3.5 text-slate-400' />
                                            Nyabihu
                                        </div>
                                    </div>
                                    <div class='space-y-1'>
                                        <span class='text-[11px] text-slate-500 uppercase tracking-wide block mb-1'>Sector</span>
                                        <div class='flex items-center gap-2 rounded-sm border border-slate-100 bg-slate-50/50 px-3 py-2 text-[13px] text-slate-700'>
                                            <Globe class='h-3.5 w-3.5 text-slate-400' />
                                            Mukamira
                                        </div>
                                    </div>
                                    <div class='space-y-1'>
                                        <span class='text-[11px] text-slate-500 uppercase tracking-wide block mb-1'>Address Line</span>
                                        <div class='flex items-center gap-2 rounded-sm border border-slate-100 bg-slate-50/50 px-3 py-2 text-[13px] text-slate-700'>
                                            <Navigation class='h-3.5 w-3.5 text-slate-400' />
                                            Mukamira Road, Plot 12
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 2. Trade & Module -->
                    <div class='rounded-md border border-slate-200 bg-white p-6'>
                        <h3 class='text-md font-semibold text-[#101828] mb-6'>2. Trade & Module</h3>
                        <div class='space-y-4'>
                            <div class='flex items-center justify-between rounded-sm border border-slate-100 bg-slate-50/50 p-4'>
                                <div class='flex items-center gap-3'>
                                    <div class='flex h-9 w-9 items-center justify-center rounded-full bg-blue-100'>
                                        <Database class='h-5 w-5 text-blue-600' />
                                    </div>
                                    <div>
                                        <p class='text-[13px] font-medium text-slate-900'>{application.trade.name}</p>
                                        <p class='text-[11px] text-slate-500'>Level 3-5 Competency Based</p>
                                    </div>
                                </div>
                                <span class='rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-medium text-blue-700'>CORE TRADE</span>
                            </div>

                            <div class='space-y-2'>
                                <h4 class='text-[12px] font-semibold text-slate-700 uppercase tracking-wider'>Associated Modules</h4>
                                <div class='grid grid-cols-1 gap-2'>
                                    {#each ['Introduction to Programming', 'Database Systems', 'Web Development', 'System Analysis'] as module}
                                        <div class='flex items-center justify-between rounded-sm border border-slate-100 px-4 py-3 text-[13px] text-slate-600'>
                                            <span>{module}</span>
                                            <CheckCircle class='h-4 w-4 text-emerald-500' />
                                        </div>
                                    {/each}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 3. Equipment & Facilities -->
                    <div class='rounded-md border border-slate-200 bg-white p-6'>
                        <div class='mb-6'>
                            <h3 class='text-md font-semibold text-[#101828]'>3. Equipment & Facilities</h3>
                            <p class='text-[13px] text-[#64748B]'>Equipment available at the institution site.</p>
                        </div>
                        <div class='space-y-3'>
                            {#each (showAllEquipment ? dueDiligenceEquipment : dueDiligenceEquipment.slice(0, 3)) as item}
                                <div class='flex items-center gap-4 rounded-sm border border-slate-100 bg-white p-3'>
                                    <div class='h-14 w-20 shrink-0 overflow-hidden rounded-sm bg-slate-100'>
                                        <img src={item.image} alt={item.name} class='h-full w-full object-cover' />
                                    </div>
                                    <div class='flex-1 min-w-0'>
                                        <h4 class='truncate text-[13px] font-medium text-slate-900'>{item.name}</h4>
                                        <p class='text-[11px] text-slate-500'>Quantity: {item.quantity}</p>
                                    </div>
                                    <button class='flex h-7 w-7 items-center justify-center rounded-sm border border-slate-100 text-slate-400 hover:text-[#0A77FF] hover:bg-white cursor-pointer transition-colors'>
                                        <Eye class='h-3.5 w-3.5' />
                                    </button>
                                </div>
                            {/each}
                        </div>
                        {#if dueDiligenceEquipment.length > 3}
                            <button
                                onclick={() => (showAllEquipment = !showAllEquipment)}
                                class='mt-4 w-full py-2 text-[12px] font-medium text-[#0A77FF] hover:bg-blue-50/50 rounded-sm transition-colors cursor-pointer'
                            >
                                {showAllEquipment ? 'See Less' : `See More (${dueDiligenceEquipment.length - 3} more)`}
                            </button>
                        {/if}
                    </div>

                    <!-- 4. Curriculum Documents -->
                    <div class='rounded-md border border-slate-200 bg-white p-6'>
                        <div class='mb-6'>
                            <h3 class='text-md font-semibold text-[#101828]'>4. Curriculum Documents</h3>
                            <p class='text-[13px] text-[#64748B]'>Submitted accreditation documents.</p>
                        </div>

                        <div class='space-y-4'>
                            {#each (showAllDocuments ? documents : documents.slice(0, 3)) as doc}
                                <div class='group relative flex items-center gap-4 rounded-sm border border-slate-200 bg-white p-4 transition-all hover:border-[#0A77FF]/30'>
                                    <div class='relative flex h-10 w-8 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-slate-50'>
                                        <div class='absolute bottom-1 left-1 right-1 flex items-center justify-center rounded-[3px] bg-red-500 px-1 py-0.5'>
                                            <span class='text-[8px] font-bold tracking-widest text-white'>PDF</span>
                                        </div>
                                    </div>
                                    <div class='flex-1'>
                                        <p class='text-[13px] font-medium text-slate-800'>{doc.name}</p>
                                        <p class='text-[11px] text-slate-500'>{doc.size} · {doc.note}</p>
                                    </div>
                                    <button
                                        onclick={() => (selectedDocument = doc)}
                                        class='cursor-pointer text-[12px] font-medium text-[#0A77FF] hover:underline'
                                    >
                                        View
                                    </button>
                                </div>
                            {/each}
                        </div>
                        {#if documents.length > 3}
                            <button
                                onclick={() => (showAllDocuments = !showAllDocuments)}
                                class='mt-4 w-full py-2 text-[12px] font-medium text-[#0A77FF] hover:bg-blue-50/50 rounded-sm transition-colors cursor-pointer'
                            >
                                {showAllDocuments ? 'See Less' : `See More (${documents.length - 3} more)`}
                            </button>
                        {/if}
                    </div>

                    <!-- 5. Staff Allocation -->
                    <div class='rounded-md border border-slate-200 bg-white p-6'>
                        <h3 class='text-md font-semibold text-[#101828] mb-6'>5. Staff Allocation</h3>
                        <div class='overflow-hidden rounded-sm border border-slate-100 bg-white'>
                            <table class='w-full text-left'>
                                <thead>
                                    <tr class='border-b border-slate-100 bg-slate-50/50'>
                                        <th class='py-4 pl-6 text-[11px] font-medium text-slate-500 uppercase'>Name</th>
                                        <th class='py-4 text-[11px] font-medium text-slate-500 uppercase'>Position</th>
                                        <th class='py-4 pr-6 text-[11px] font-medium text-slate-500 uppercase text-right'>Contact</th>
                                    </tr>
                                </thead>
                                <tbody class='divide-y divide-slate-100'>
                                    {#each (showAllStaff
                                        ? [
                                            { name: 'Natali Craig', position: 'Deputy Director', email: 'natali.craig@ex.com', phone: '+250 780 000' },
                                            { name: 'Drew Cano', position: 'Technical Lead', email: 'drew.cano@ex.com', phone: '+250 710 000' },
                                            { name: 'Jane Doe', position: 'Instructor', email: 'jane.doe@ex.com', phone: '+250 720 000' },
                                            { name: 'John Smith', position: 'Admin', email: 'john.smith@ex.com', phone: '+250 730 000' },
                                        ]
                                        : [
                                            { name: 'Natali Craig', position: 'Deputy Director', email: 'natali.craig@ex.com', phone: '+250 780 000' },
                                            { name: 'Drew Cano', position: 'Technical Lead', email: 'drew.cano@ex.com', phone: '+250 710 000' },
                                            { name: 'Jane Doe', position: 'Instructor', email: 'jane.doe@ex.com', phone: '+250 720 000' },
                                        ]) as person}
                                        <tr class='transition-colors hover:bg-slate-50/30'>
                                            <td class='py-4 pl-6'>
                                                <div class='flex items-center gap-3'>
                                                    <div class='flex h-8 w-8 items-center justify-center rounded-full bg-slate-100'>
                                                        <Users class='h-4 w-4 text-slate-400' />
                                                    </div>
                                                    <span class='text-[13px] font-medium text-slate-900'>{person.name}</span>
                                                </div>
                                            </td>
                                            <td class='py-4'><span class='text-[13px] text-slate-500'>{person.position}</span></td>
                                            <td class='py-4 pr-6 text-right'>
                                                <div class='flex flex-col text-[12px] text-slate-500'>
                                                    <span>{person.email}</span>
                                                    <span>{person.phone}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    {/each}
                                </tbody>
                            </table>
                        </div>
                        <button
                            onclick={() => (showAllStaff = !showAllStaff)}
                            class='mt-4 w-full py-2 text-[12px] font-medium text-[#0A77FF] hover:bg-blue-50/50 rounded-sm transition-colors cursor-pointer'
                        >
                            {showAllStaff ? 'See Less' : 'See More (1 more)'}
                        </button>
                    </div>
                {:else}
                    <!-- Perform Due Diligence Content -->
                    <div class='rounded-md border border-slate-200 bg-white p-6'>
                        <div class='mb-6'>
                            <h3 class='text-md font-semibold text-[#101828]'>Institution Location</h3>
                            <p class='text-[13px] text-[#64748B]'>Physical address details for site visit coordination.</p>
                        </div>

                        <div class='grid grid-cols-2 gap-4'>
                            <div class='space-y-1'>
                                <span class='text-[11px] text-slate-500 uppercase tracking-wide block mb-1'>Province</span>
                                <div class='flex items-center gap-2 rounded-sm border border-slate-100 bg-slate-50/50 px-3 py-2 text-[13px] text-slate-700'>
                                    <MapPin class='h-3.5 w-3.5 text-slate-400' />
                                    Western
                                </div>
                            </div>
                            <div class='space-y-1'>
                                <span class='text-[11px] text-slate-500 uppercase tracking-wide block mb-1'>District</span>
                                <div class='flex items-center gap-2 rounded-sm border border-slate-100 bg-slate-50/50 px-3 py-2 text-[13px] text-slate-700'>
                                    <Map class='h-3.5 w-3.5 text-slate-400' />
                                    Nyabihu
                                </div>
                            </div>
                            <div class='space-y-1'>
                                <span class='text-[11px] text-slate-500 uppercase tracking-wide block mb-1'>Sector</span>
                                <div class='flex items-center gap-2 rounded-sm border border-slate-100 bg-slate-50/50 px-3 py-2 text-[13px] text-slate-700'>
                                    <Globe class='h-3.5 w-3.5 text-slate-400' />
                                    Mukamira
                                </div>
                            </div>
                            <div class='space-y-1'>
                                <span class='text-[11px] text-slate-500 uppercase tracking-wide block mb-1'>Address Line</span>
                                <div class='flex items-center gap-2 rounded-sm border border-slate-100 bg-slate-50/50 px-3 py-2 text-[13px] text-slate-700'>
                                    <Navigation class='h-3.5 w-3.5 text-slate-400' />
                                    Mukamira Road, Plot 12
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class='rounded-md border border-slate-200 bg-white p-6'>
                        <div class='mb-6 flex items-center justify-between'>
                            <div>
                                <h3 class='text-md font-semibold text-[#101828]'>Equipment Verification</h3>
                                <p class='text-[13px] text-[#64748B]'>Verify availability of equipment at the institution site.</p>
                            </div>
                            <div class='relative'>
                                <Search class='absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400' />
                                <input placeholder='Search equipment...' class='h-9 w-48 rounded-sm border border-slate-200 pl-9 pr-3 text-[12px] focus:outline-none focus:border-[#0A77FF]' />
                            </div>
                        </div>

                        <div class='space-y-3'>
                            {#each dueDiligenceEquipment as item}
                                <div class='flex items-center gap-4 rounded-sm border border-slate-100 bg-white p-3 transition-colors hover:bg-slate-50/50'>
                                    <div class='h-14 w-20 shrink-0 overflow-hidden rounded-sm bg-slate-100'>
                                        <img src={item.image} alt={item.name} class='h-full w-full object-cover' />
                                    </div>
                                    <div class='flex-1 min-w-0'>
                                        <h4 class='truncate text-[13px] font-medium text-slate-900'>{item.name}</h4>
                                        <p class='text-[11px] text-slate-500'>Quantity: {item.quantity}</p>
                                    </div>
                                    <div class='flex items-center gap-3 shrink-0'>
                                        <div class='flex items-center gap-1.5'>
                                            <span class='text-[10px] text-slate-400'>Found</span>
                                            <div class={cn('h-4 w-4 rounded-sm border border-slate-200 flex items-center justify-center', item.found ? 'bg-green-500 border-green-500' : 'bg-white')}>
                                                {#if item.found}
                                                    <Check class='h-3 w-3 text-white' strokeWidth={3} />
                                                {/if}
                                            </div>
                                        </div>
                                        <button class='flex h-7 w-7 items-center justify-center rounded-sm border border-slate-100 text-slate-400 hover:text-[#0A77FF] hover:bg-white cursor-pointer transition-colors'>
                                            <Eye class='h-3.5 w-3.5' />
                                        </button>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>
                {/if}
            </div>

            <!-- Right: Decision Sidebar -->
            <div class='w-full lg:w-[400px] shrink-0 overflow-y-auto space-y-6 no-scrollbar pl-2'>
                <div class='rounded-md border border-slate-200 bg-white p-6'>
                    <h3 class='text-md font-semibold text-[#101828]'>Evaluation Decision</h3>
                    <p class='mb-6 text-[13px] text-[#64748B]'>Make a decision for the {activeTab === 'initial-review' ? 'Initial Review' : 'Due Diligence'} stage.</p>

                    <div class='mb-6 space-y-3'>

                        <button
                            onclick={() => setDecision('approve')}
                            class={cn(
                                'flex w-full cursor-pointer items-center gap-3 rounded-sm border p-4 text-left transition-all',
                                currentDecision === 'approve'
                                    ? 'border-emerald-500 bg-emerald-50 font-bold text-emerald-700'
                                    : 'border-slate-100 font-medium text-slate-600 hover:bg-slate-50',
                            )}
                        >
                            <CheckCircle class={cn('h-5 w-5', currentDecision === 'approve' ? 'text-emerald-500' : 'text-slate-400')} />
                            <span class='text-[13px]'>Approve Stage</span>
                        </button>

                        <button
                            onclick={() => setDecision('revert')}
                            class={cn(
                                'flex w-full cursor-pointer items-center gap-3 rounded-sm border p-4 text-left transition-all',
                                currentDecision === 'revert'
                                    ? 'border-orange-500 bg-orange-50 font-bold text-orange-700'
                                    : 'border-slate-100 font-medium text-slate-600 hover:bg-slate-50',
                            )}
                        >
                            <RotateCcw class={cn('h-5 w-5', currentDecision === 'revert' ? 'text-orange-500' : 'text-slate-400')} />
                            <span class='text-[13px]'>Revert for Correction</span>
                        </button>

                        <button
                            onclick={() => setDecision('defer')}
                            class={cn(
                                'flex w-full cursor-pointer items-center gap-3 rounded-sm border p-4 text-left transition-all',
                                currentDecision === 'defer'
                                    ? 'border-amber-500 bg-amber-50 font-bold text-amber-700'
                                    : 'border-slate-100 font-medium text-slate-600 hover:bg-slate-50',
                            )}
                        >
                            <Clock class={cn('h-5 w-5', currentDecision === 'defer' ? 'text-amber-500' : 'text-slate-400')} />
                            <span class='text-[13px]'>Defer Application</span>
                        </button>
                    </div>

                    {#if currentDecision === 'revert' || currentDecision === 'defer'}
                        <div class='mb-6'>
                            <label for='remarks' class='mb-2 block text-[12px] font-medium text-slate-500 uppercase tracking-wide'>Remarks (Required)</label>
                            <div class='relative'>
                                <MessageSquare class='absolute left-3 top-3 h-4 w-4 text-slate-300' />
                                {#if activeTab === 'initial-review'}
                                    <textarea
                                        id='remarks'
                                        bind:value={initialReviewComment}
                                        placeholder='Explain your decision...'
                                        class='min-h-[120px] w-full resize-none rounded-sm border border-slate-200 bg-slate-50/50 p-3 pl-10 text-[13px] focus:outline-none focus:border-[#0A77FF] transition-all'
                                    ></textarea>
                                {:else}
                                    <textarea
                                        id='remarks'
                                        bind:value={dueDiligenceComment}
                                        placeholder='Explain your decision...'
                                        class='min-h-[120px] w-full resize-none rounded-sm border border-slate-200 bg-slate-50/50 p-3 pl-10 text-[13px] focus:outline-none focus:border-[#0A77FF] transition-all'
                                    ></textarea>
                                {/if}
                            </div>
                        </div>
                    {/if}

                    <button
                        onclick={handleDecision}
                        disabled={!currentDecision || (currentDecision === 'revert' && !currentComment)}
                        class={cn(
                            'w-full rounded-sm py-3 text-[13px] font-medium transition-all',
                            (!currentDecision || (currentDecision === 'revert' && !currentComment))
                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                : 'bg-[#0A77FF] text-white hover:bg-[#0864d6] cursor-pointer',
                        )}
                    >
                        Confirm Decision
                    </button>
                </div>

            </div>
        </div>
    </div>
</div>

{#if selectedDocument}
    <DocumentViewerModal
        documentName={selectedDocument.name}
        documentSize={selectedDocument.size}
        onClose={() => (selectedDocument = null)}
    />
{/if}
