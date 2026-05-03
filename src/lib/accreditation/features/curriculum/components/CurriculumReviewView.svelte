<script lang='ts'>
    import { goto } from '$app/navigation';
    import { mockApplications } from '$lib/accreditation/utils/application-utils';
    import { cn } from '$lib/accreditation/utils/cn';
    import DocumentViewerModal from '$lib/components/accreditation/ui/DocumentViewerModal.svelte';
    import {
        ArrowLeft,
        CheckCircle,
        Clock,
        MessageSquare,
        RotateCcw,
    } from '@lucide/svelte';

    const { id } = $props<{ id: string }>();

    const application = $derived(
        mockApplications.find(app => app.id === id) || mockApplications[0],
    );

    let status = $state<'approve' | 'defer' | 'revert' | null>(null);
    let comment = $state('');
    let selectedDocument = $state<{ name: string; size: string } | null>(null);

    const documents = [
        {
            id: '1',
            name: 'Trade Course Outline.pdf',
            size: '2.4 MB',
            type: 'PDF',
            note: 'Maps modules to competency levels',
        },
        {
            id: '2',
            name: 'Syllabus_2026_Final.pdf',
            size: '1.8 MB',
            type: 'PDF',
            note: 'Shows weekly delivery and outcomes',
        },
        {
            id: '3',
            name: 'Practical_Workshop_Manual.pdf',
            size: '5.6 MB',
            type: 'PDF',
            note: 'Supports hands-on learning evidence',
        },
        {
            id: '4',
            name: 'Assessment_Guidelines.pdf',
            size: '1.2 MB',
            type: 'PDF',
            note: 'Defines grading and verification criteria',
        },
    ];

    const reviewAreas = [
        {
            title: 'Learning Outcomes Alignment',
            status: 'Needs verification',
            description:
                'Confirm that module outcomes align with accreditation criteria and the required competency level.',
        },
        {
            title: 'Assessment Evidence',
            status: 'Partially evidenced',
            description:
                'Check whether practical and theory assessments adequately measure the stated outcomes.',
        },
        {
            title: 'Module Structure',
            status: 'Ready to review',
            description: 'Verify sequencing, contact hours, and balance between theory and practice.',
        },
        {
            title: 'Supporting Documents',
            status: 'Needs clarification',
            description:
                'Ensure manuals, syllabi, and curriculum guides are complete, current, and mutually consistent.',
        },
    ];

    function getStatusClasses(s: string) {
        if (s === 'Ready to review') {
            return 'bg-emerald-50 text-emerald-700';
        }
        if (s === 'Partially evidenced') {
            return 'bg-amber-50 text-amber-700';
        }
        return 'bg-rose-50 text-rose-700';
    }
</script>

<div class='flex w-full max-w-5xl flex-col gap-6 text-left lg:max-w-6xl xl:max-w-7xl'>
    <button
        onclick={() => goto('/accreditation/curriculum-evaluator/applications')}
        class='group flex w-fit items-center gap-2 text-[13px] font-medium text-slate-500 transition-colors hover:text-slate-800'
    >
        <ArrowLeft class='h-4 w-4 transition-transform group-hover:-translate-x-1' />
        Back to Applications
    </button>

    <div class='grid grid-cols-1 gap-8 pb-12 lg:grid-cols-3'>
        <!-- Left: Main Content -->
        <div class='space-y-6 lg:col-span-2'>
            <!-- Header Card -->
            <div class='rounded-md border border-slate-200 bg-white p-6'>
                <div class='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
                    <div class='space-y-2'>
                        <h3 class='text-md text-[#101828]'>{application.institution.name}</h3>
                        <p class='text-[13px] text-[#64748B]'>
                            Review the curriculum package for {application.trade.name} and confirm whether the submitted materials support accreditation requirements.
                        </p>
                    </div>
                    <div class='flex flex-wrap gap-2'>
                        <span class='rounded-sm bg-slate-100 px-2.5 py-1 text-[12px] text-slate-700'>{application.trade.name}</span>
                        <span class='rounded-sm bg-blue-50 px-2.5 py-1 text-[12px] text-blue-700'>{application.stage}</span>
                    </div>
                </div>
            </div>

            <!-- Curriculum Materials -->
            <div class='rounded-md border border-slate-200 bg-white p-6'>
                <div class='mb-6'>
                    <h3 class='text-md text-[#101828]'>Curriculum Materials</h3>
                    <p class='text-[13px] text-[#64748B]'>Review the submitted package before making a curriculum decision.</p>
                </div>

                <div class='space-y-4'>
                    {#each documents as doc}
                        <div class='space-y-2'>
                            <button
                                onclick={() => (selectedDocument = doc)}
                                class='flex w-full cursor-pointer items-center gap-4 rounded-sm border border-slate-200 bg-white p-4 text-left transition-transform hover:-translate-y-0.5'
                            >
                                <div class='relative flex h-10 w-8 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-slate-50 shadow-sm'>
                                    <div class='absolute bottom-1 left-1 right-1 flex items-center justify-center rounded-[3px] bg-red-500 px-1 py-0.5'>
                                        <span class='text-[8px] font-bold tracking-widest text-white'>{doc.type}</span>
                                    </div>
                                </div>
                                <div class='flex-1'>
                                    <p class='text-[13px] font-medium text-slate-800'>{doc.name}</p>
                                    <p class='text-[11px] text-slate-500'>{doc.size}</p>
                                </div>
                                <div class='flex h-5 w-5 items-center justify-center rounded-md bg-[#0A77FF]'>
                                    <svg class='h-3.5 w-3.5 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='3'>
                                        <path stroke-linecap='round' stroke-linejoin='round' d='M5 13l4 4L19 7' />
                                    </svg>
                                </div>
                            </button>
                            <div class='flex items-center justify-between gap-3 pl-1'>
                                <p class='text-[11px] font-medium text-slate-500'>{doc.note}</p>
                                <button
                                    onclick={() => (selectedDocument = doc)}
                                    class='cursor-pointer text-[13px] font-medium text-[#0A77FF] transition-colors hover:text-[#085fca]'
                                >
                                    View document
                                </button>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>

            <!-- Review Checklist -->
            <div class='rounded-md border border-slate-200 bg-white p-6'>
                <h3 class='text-md text-[#101828]'>Curriculum Review Checklist</h3>
                <p class='mb-4 text-[13px] text-[#64748B]'>
                    Follow the same review rhythm used elsewhere in the portal, but keep the content focused on curriculum evidence.
                </p>

                <div class='space-y-3'>
                    {#each reviewAreas as area}
                        <div class='rounded-sm border border-slate-100 bg-white p-4 transition-colors hover:bg-slate-50/70'>
                            <div class='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
                                <div class='space-y-1'>
                                    <p class='text-[13px] font-medium text-slate-900'>{area.title}</p>
                                    <p class='text-[13px] leading-relaxed text-slate-500'>{area.description}</p>
                                </div>
                                <span class={cn('shrink-0 rounded-sm px-2.5 py-1 text-[12px]', getStatusClasses(area.status))}>
                                    {area.status}
                                </span>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>

            <!-- Reviewer Guidance -->
            <div class='rounded-md border border-slate-200 bg-white p-6'>
                <h3 class='text-md text-[#101828]'>Reviewer Guidance</h3>
                <p class='mb-4 text-[13px] text-[#64748B]'>Reference notes for this curriculum review.</p>
                <p class='whitespace-pre-line text-[13px] leading-relaxed text-slate-600'>
                    Start by confirming that the submitted curriculum package is complete and internally consistent.
                    Then verify whether the learning outcomes, module structure, and assessment tools clearly support the required accreditation standards for {application.trade.name}.

                    Use the supporting documents to identify missing evidence, inconsistent descriptions, or unclear competency mapping. If anything is incomplete, return the package with precise corrective remarks.
                </p>
            </div>
        </div>

        <!-- Right: Decision Sidebar -->
        <div class='h-fit space-y-6 lg:sticky lg:top-6'>
            <!-- Decision Panel -->
            <div class='rounded-md border border-slate-200 bg-white p-6 shadow-none'>
                <h3 class='text-md text-[#101828]'>Evaluation Decision</h3>
                <p class='mb-6 text-[13px] text-[#64748B]'>Use the existing decision flow and keep remarks explicit.</p>

                <div class='mb-8 flex flex-col gap-3'>
                    <button
                        onclick={() => (status = 'approve')}
                        class={cn(
                            'flex cursor-pointer items-center gap-3 rounded-sm border p-4 text-left transition-all',
                            status === 'approve'
                                ? 'border-emerald-500 bg-emerald-50 font-bold text-emerald-700'
                                : 'border-slate-100 font-medium text-slate-600 hover:bg-slate-50',
                        )}
                    >
                        <CheckCircle class={cn('h-5 w-5', status === 'approve' ? 'text-emerald-500' : 'text-slate-400')} />
                        <span class='text-[13px]'>Approve Curriculum</span>
                    </button>

                    <button
                        onclick={() => (status = 'revert')}
                        class={cn(
                            'flex cursor-pointer items-center gap-3 rounded-sm border p-4 text-left transition-all',
                            status === 'revert'
                                ? 'border-orange-500 bg-orange-50 font-bold text-orange-700'
                                : 'border-slate-100 font-medium text-slate-600 hover:bg-slate-50',
                        )}
                    >
                        <RotateCcw class={cn('h-5 w-5', status === 'revert' ? 'text-orange-500' : 'text-slate-400')} />
                        <span class='text-[13px]'>Revert for Correction</span>
                    </button>

                    <button
                        onclick={() => (status = 'defer')}
                        class={cn(
                            'flex cursor-pointer items-center gap-3 rounded-sm border p-4 text-left transition-all',
                            status === 'defer'
                                ? 'border-amber-500 bg-amber-50 font-bold text-amber-700'
                                : 'border-slate-100 font-medium text-slate-600 hover:bg-slate-50',
                        )}
                    >
                        <Clock class={cn('h-5 w-5', status === 'defer' ? 'text-amber-500' : 'text-slate-400')} />
                        <span class='text-[13px]'>Defer Application</span>
                    </button>
                </div>

                {#if status === 'revert' || status === 'defer'}
                    <div class='mb-8'>
                        <label for='evaluator-remarks' class='mb-2 block text-[13px] font-medium text-slate-500'>Evaluator remarks (required)</label>
                        <div class='relative'>
                            <MessageSquare class='absolute left-4 top-4 h-4 w-4 text-slate-400' />
                            <textarea
                                id='evaluator-remarks'
                                bind:value={comment}
                                placeholder={status === 'revert' ? 'Explain what needs correction...' : 'Explain grounds for deferral...'}
                                class='min-h-[120px] w-full resize-none rounded-sm border border-slate-200 bg-slate-50 p-4 pl-12 text-[13px] transition-all focus:border-[#0A77FF] focus:outline-none'
                            ></textarea>
                        </div>
                    </div>
                {/if}

                <button
                    onclick={() => {
                        if (status) {
                            goto('/accreditation/curriculum-evaluator/applications');
                        }
                    }}
                    disabled={!status || (status === 'revert' && !comment)}
                    class={cn(
                        'w-full rounded-sm py-3 text-[13px] font-medium transition-all',
                        !status || (status === 'revert' && !comment)
                            ? 'cursor-not-allowed bg-blue-300 text-white'
                            : 'cursor-pointer bg-[#0A77FF] text-white hover:bg-[#0864d6]',
                    )}
                >
                    {status === 'approve' ? 'Confirm Accept' : status === 'revert' ? 'Confirm Revert' : status === 'defer' ? 'Confirm Defer' : 'Select Decision'}
                </button>
            </div>

            <!-- Application Info -->
            <div class='rounded-md border border-slate-200 bg-white p-6 text-slate-900'>
                <h3 class='text-md text-[#101828]'>Application Info</h3>
                <p class='mb-4 text-[13px] text-[#64748B]'>Summary details for the selected curriculum package.</p>
                <div class='space-y-4'>
                    <div>
                        <p class='mb-1 text-[11px] text-slate-500'>Institution</p>
                        <p class='text-[13px] font-medium text-slate-900'>{application.institution.name}</p>
                    </div>
                    <div>
                        <p class='mb-1 text-[11px] text-slate-500'>Trade Program</p>
                        <p class='text-[13px] font-medium text-slate-900'>{application.trade.name} ({application.trade.category})</p>
                    </div>
                    <div>
                        <p class='mb-1 text-[11px] text-slate-500'>Review Scope</p>
                        <p class='text-[13px] font-medium text-slate-900'>Curriculum structure, outcomes, and assessment evidence</p>
                    </div>
                    <div>
                        <p class='mb-1 text-[11px] text-slate-500'>Applicant</p>
                        <p class='text-[13px] font-medium text-slate-900'>{application.applicant.name}</p>
                    </div>
                    <div class='rounded-sm border border-slate-100 bg-slate-50 p-4'>
                        <p class='mb-2 text-[13px] font-medium text-slate-900'>Checklist</p>
                        <ul class='space-y-2 text-[13px] text-slate-500'>
                            <li>Confirm documents are complete</li>
                            <li>Check outcome-to-module alignment</li>
                            <li>Validate assessment support</li>
                            <li>Record decision with clear remarks</li>
                        </ul>
                    </div>
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
