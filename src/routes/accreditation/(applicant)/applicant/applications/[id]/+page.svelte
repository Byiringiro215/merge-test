<script lang='ts'>
    import { page } from '$app/stores';
    import PageContainer from '$lib/components/accreditation/layout/PageContainer.svelte';
    import { ArrowLeft, Blocks, Briefcase, FileCheck, FileText, Hexagon, Users } from '@lucide/svelte';

    const appId = $derived($page.params.id);

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
            { name: 'Computers', quantity: 20 },
            { name: 'Projectors', quantity: 2 },
        ],
        mouDocs: [{ name: 'MOU_Signed.pdf', size: '2.1 MB' }],
        curriculumDocs: [{ name: 'Curriculum_2026.pdf', size: '5.4 MB' }],
        staff: [
            { position: 'Instructor', qualification: 'Master\'s Degree', status: 'Full-Time', quantity: 2 },
            { position: 'Teaching Assistant', qualification: 'Bachelor\'s Degree', status: 'Full-Time', quantity: 3 },
        ],
    });
</script>

<PageContainer
    title='Application Details'
    description='Review the details of your submitted accreditation application.'
>
    <div class='mb-6'>
        <a href='/accreditation/applicant/applications' class='flex w-fit items-center gap-2 text-[13px] font-medium text-slate-500 hover:text-[#0A77FF] transition-colors'>
            <ArrowLeft size={16} /> Back to Applications
        </a>
    </div>

    <div class='grid grid-cols-1 lg:grid-cols-3 gap-6 text-left'>
        <div class='lg:col-span-2 flex flex-col gap-6'>
            <div class='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
                <h3 class='text-[16px] font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4'>Application Information</h3>

                <div class='space-y-6'>
                    <div class='flex gap-4'>
                        <div class='flex items-center justify-center rounded-full bg-blue-50 h-10 w-10 shrink-0'>
                            <Blocks size={20} class='text-[#0A77FF]' />
                        </div>
                        <div>
                            <p class='text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1'>Trade</p>
                            <p class='text-[14px] font-medium text-slate-900'>{mockApp.trade}</p>
                            <p class='text-[12px] text-slate-500 mt-0.5'>Category: {mockApp.category} • Board: {mockApp.board}</p>
                        </div>
                    </div>

                    <div class='flex gap-4'>
                        <div class='flex items-center justify-center rounded-full bg-purple-50 h-10 w-10 shrink-0'>
                            <Hexagon size={20} class='text-purple-500' />
                        </div>
                        <div>
                            <p class='text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2'>Competencies</p>
                            <div class='flex flex-wrap gap-2'>
                                {#each mockApp.competencies as comp (comp)}
                                    <span class='px-3 py-1 bg-purple-100 text-purple-700 text-[12px] font-medium rounded-full'>{comp}</span>
                                {/each}
                            </div>
                        </div>
                    </div>

                    <div class='flex gap-4'>
                        <div class='flex items-center justify-center rounded-full bg-amber-50 h-10 w-10 shrink-0'>
                            <Briefcase size={20} class='text-amber-500' />
                        </div>
                        <div>
                            <p class='text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2'>Equipment</p>
                            <ul class='space-y-2'>
                                {#each mockApp.equipments as eq (eq.name)}
                                    <li class='flex items-center justify-between bg-slate-50 px-4 py-2 rounded-lg text-[13px]'>
                                        <span class='font-medium text-slate-700'>{eq.name}</span>
                                        <span class='text-slate-500'>Qty: {eq.quantity}</span>
                                    </li>
                                {/each}
                            </ul>
                        </div>
                    </div>

                    <div class='flex gap-4'>
                        <div class='flex items-center justify-center rounded-full bg-emerald-50 h-10 w-10 shrink-0'>
                            <Users size={20} class='text-emerald-500' />
                        </div>
                        <div class='w-full'>
                            <p class='text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2'>Staff Allocation</p>
                            <div class='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                                {#each mockApp.staff as s (s.position)}
                                    <div class='bg-white border border-slate-100 p-3 rounded-xl shadow-sm'>
                                        <p class='text-[13px] font-bold text-slate-800'>{s.position}</p>
                                        <p class='text-[12px] text-slate-500 mt-1'>{s.qualification}</p>
                                        <div class='mt-2 flex items-center justify-between text-[11px] font-medium text-slate-400 uppercase tracking-wider'>
                                            <span>{s.status}</span>
                                            <span>Count: {s.quantity}</span>
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
                <h3 class='text-[16px] font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4'>Documents</h3>
                <div class='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                    <div>
                        <p class='text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-3'>MOU Documents</p>
                        <ul class='space-y-2'>
                            {#each mockApp.mouDocs as doc (doc.name)}
                                <li class='flex items-center justify-between border border-slate-100 rounded-lg p-3'>
                                    <div class='flex items-center gap-2'>
                                        <FileCheck size={16} class='text-[#0A77FF]' />
                                        <span class='text-[13px] font-medium text-slate-700'>{doc.name}</span>
                                    </div>
                                    <span class='text-[11px] text-slate-400'>{doc.size}</span>
                                </li>
                            {/each}
                        </ul>
                    </div>
                    {#if mockApp.curriculumDocs.length > 0}
                        <div>
                            <p class='text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-3'>Curriculum Documents</p>
                            <ul class='space-y-2'>
                                {#each mockApp.curriculumDocs as doc (doc.name)}
                                    <li class='flex items-center justify-between border border-slate-100 rounded-lg p-3'>
                                        <div class='flex items-center gap-2'>
                                            <FileText size={16} class='text-purple-500' />
                                            <span class='text-[13px] font-medium text-slate-700'>{doc.name}</span>
                                        </div>
                                        <span class='text-[11px] text-slate-400'>{doc.size}</span>
                                    </li>
                                {/each}
                            </ul>
                        </div>
                    {/if}
                </div>
            </div>
        </div>

        <div class='flex flex-col gap-6'>
            <div class='bg-white border border-slate-200 p-6 rounded-2xl shadow-sm'>
                <h3 class='text-[14px] font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3'>Status Overview</h3>
                <div class='space-y-4'>
                    <div class='flex flex-col gap-1'>
                        <p class='text-[11px] font-bold text-slate-400 uppercase tracking-widest'>Application ID</p>
                        <p class='text-[14px] font-semibold text-slate-900'>APP-{mockApp.id}</p>
                    </div>
                    <div class='flex flex-col gap-1'>
                        <p class='text-[11px] font-bold text-slate-400 uppercase tracking-widest'>Status</p>
                        <span class='w-fit text-[12px] font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-700'>{mockApp.status}</span>
                    </div>
                    <div class='flex flex-col gap-1'>
                        <p class='text-[11px] font-bold text-slate-400 uppercase tracking-widest'>Current Stage</p>
                        <p class='text-[14px] font-medium text-slate-800'>{mockApp.stage}</p>
                    </div>
                    <div class='flex flex-col gap-1'>
                        <p class='text-[11px] font-bold text-slate-400 uppercase tracking-widest'>Submitted On</p>
                        <p class='text-[14px] font-medium text-slate-800'>{mockApp.submittedOn}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</PageContainer>
