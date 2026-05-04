<script lang='ts'>
    import { mockApplications } from '$lib/accreditation/utils/application-utils';
    import { cn } from '$lib/accreditation/utils/cn';
    import { Building2, Check, Files, UngroupIcon, Users } from '@lucide/svelte';
    import AddEvaluatorModal from './AddEvaluatorModal.svelte';
    import AssignEvaluatorsStage from './stages/AssignEvaluatorsStage.svelte';
    import DecisionMakingStage from './stages/DecisionMakingStage.svelte';
    import EvaluationReviewStage from './stages/EvaluationReviewStage.svelte';
    import PerformDueDiligenceStage from './stages/PerformDueDiligenceStage.svelte';
    import ScheduleDueDiligenceStage from './stages/ScheduleDueDiligenceStage.svelte';

    const { id, role } = $props<{
        id: string;
        role: 'super-admin' | 'evaluator' | 'supervisor';
    }>();

    $effect(() => {
        console.warn('SharedEvaluationContainer rendering for ID:', id, 'Role:', role);
    });

    let activeInternalStep = $state(0);
    let completedSteps = $state<number[]>([]);
    let activeTab = $state('General');
    let isEvaluating = $state(false);
    let activeMajorStep = $state(0);
    let evaluationNote = $state('');

    // Date range
    let dateFrom = $state('2024-01-06');
    let dateTo = $state('2024-01-13');

    // Evaluator assignments - Initial Review
    let assignedInitialPrincipal = $state<string | null>('evaluator1@mis.gov.rw');
    let assignedInitialSecondary1 = $state<string | null>('evaluator2@mis.gov.rw');
    let assignedInitialSecondary2 = $state<string | null>(null);
    let assignedInitialPrincipalStatus = $state<'pending' | 'accepted' | null>('accepted');
    let assignedInitialSecondary1Status = $state<'pending' | 'accepted' | null>('pending');
    let assignedInitialSecondary2Status = $state<'pending' | 'accepted' | null>(null);

    // Evaluator assignments - Scheduled Due Diligence
    let assignedScheduledPrincipal = $state<string | null>(null);
    let assignedScheduledSecondary1 = $state<string | null>(null);
    let assignedScheduledSecondary2 = $state<string | null>(null);

    let showInitialReview = $state(false);

    $effect(() => {
        showInitialReview = role !== 'super-admin';
    });
    let pendingEvaluatorRole = $state<string | null>(null);

    const equipmentList = [
        { id: 1, name: 'Server', quantity: 2 },
        { id: 2, name: 'Server', quantity: 2 },
        { id: 3, name: 'Server', quantity: 2 },
    ];

    const documentList = [
        { id: 1, name: 'Evaluation Criteria One', size: '200 KB' },
        { id: 2, name: 'Evaluation Criteria One', size: '200 KB' },
        { id: 3, name: 'Evaluation Criteria One', size: '200 KB' },
        { id: 4, name: 'Evaluation Criteria One', size: '200 KB' },
    ];

    const staffAllocationList = [
        { id: 1, position: 'Position', qualification: 'Qualification', count: 2, status: 'Rejected' },
        { id: 2, position: 'Position', qualification: 'Qualification', count: 2, status: 'Pending' },
        { id: 3, position: 'Position', qualification: 'Qualification', count: 2, status: 'Rejected' },
        { id: 4, position: 'Position', qualification: 'Qualification', count: 2, status: 'Approved' },
        { id: 5, position: 'Position', qualification: 'Qualification', count: 2, status: 'Pending' },
    ];

    const dueDiligenceEquipment = [
        {
            id: 1,
            name: 'Server',
            quantity: '2 Pieces',
            found: true,
            image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc48?w=100&h=80&fit=crop',
        },
        {
            id: 2,
            name: 'Server',
            quantity: '2 Pieces',
            found: true,
            image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc48?w=100&h=80&fit=crop',
        },
    ];

    const application = mockApplications.find((app: { id: any }) => app.id === id) || mockApplications[0];

    const steps = [
        { label: 'Initial Review', sub: 'Documents Review' },
        { label: 'Schedule Due Diligence', sub: 'Website and location' },
        { label: 'Perform Due Diligence', sub: 'Start collaborating' },
        { label: 'Final Review', sub: 'Start collaborating' },
        { label: 'Decision Making', sub: 'Automatic sharing' },
    ];

    const sidebarSteps = [
        {
            label: 'Institution Details',
            sub: 'Select the trade(s) you are applying for',
            icon: Building2,
        },
        {
            label: 'Trade & Competency',
            sub: 'Select the trade(s) you are applying for',
            icon: UngroupIcon,
        },
        {
            label: 'Equipment and Facilities',
            sub: 'List available equipment and upload proof',
            icon: Building2,
        },
        { label: 'Curriculum Documents', sub: 'Upload curriculum and training materials', icon: Files },
        {
            label: 'Staff Allocation',
            sub: 'Indicate staff availability for the selected trade',
            icon: Users,
        },
    ];

    const tabs = ['General', 'Address', 'Personnel', 'About'];

    function handleNext() {
        if (activeInternalStep === 0) {
            if (!isEvaluating) {
                isEvaluating = true;
                activeTab = tabs[0];
            }
            else {
                const currentIndex = tabs.indexOf(activeTab);
                if (currentIndex < tabs.length - 1) {
                    activeTab = tabs[currentIndex + 1];
                }
                else {
                    completedSteps = [...new Set([...completedSteps, 0])];
                    activeInternalStep = 1;
                }
            }
        }
        else if (activeInternalStep === 1) {
            completedSteps = [...new Set([...completedSteps, 1])];
            activeInternalStep = 2;
        }
        else if (activeInternalStep === 2) {
            completedSteps = [...new Set([...completedSteps, 2])];
            activeInternalStep = 3;
        }
        else if (activeInternalStep === 3) {
            completedSteps = [...new Set([...completedSteps, 3])];
            activeInternalStep = 4;
        }
        else if (activeInternalStep === 4) {
            completedSteps = [...new Set([...completedSteps, 4])];
            if (activeMajorStep === 0) {
                activeMajorStep = 1;
                activeInternalStep = 0;
            }
            else if (activeMajorStep === 3) {
                activeMajorStep = 4;
            }
        }
    }

    const showSidebar = $derived(
        (activeMajorStep === 0 && showInitialReview) || activeMajorStep === 3,
    );
    const progressPercentage = $derived((activeMajorStep / (steps.length - 1)) * 100);
</script>

<div class='flex h-full flex-col overflow-hidden bg-white'>
    <div class='flex min-h-0 flex-1 overflow-hidden'>
        <div class='mx-6 flex min-h-0 flex-1 flex-col'>
            <!-- Horizontal Stepper -->
            <div class='sticky top-0 z-40 bg-white'>
                <div class='relative mt-4 mb-10 px-1 pt-1 overflow-visible'>
                    <!-- Background Line -->
                    <div class='absolute top-[13px] left-[16px] right-[16px] h-px bg-slate-100 z-0'></div>
                    <!-- Progress Line -->
                    <div
                        class='absolute top-[13px] left-[16px] h-[1.5px] bg-primary z-0 transition-all duration-300'
                        style='width: calc({progressPercentage}% - {(activeMajorStep / (steps.length - 1)) * 32}px)'
                    ></div>

                    <div class='flex items-start justify-between w-full relative z-10'>
                        {#each steps as step, idx}
                            {@const isActive = idx === activeMajorStep}
                            {@const isCompleted = idx < activeMajorStep}
                            <div class={cn(
                                'flex flex-col relative',
                                idx === 0 ? 'items-start' : idx === steps.length - 1 ? 'items-end' : 'items-center flex-1',
                            )}>
                                <div class={cn(
                                    'h-6 w-6 rounded-full border flex items-center justify-center mb-3 transition-all duration-300 shrink-0 relative z-10',
                                    isActive
                                        ? 'border-primary bg-primary shadow-[0_0_0_4px_rgba(9,119,255,0.15)]'
                                        : isCompleted
                                        ? 'border-primary bg-primary'
                                        : 'border-slate-200 bg-white',
                                )}>
                                    {#if isCompleted}
                                        <Check class='h-3.5 w-3.5 text-white' strokeWidth={3} />
                                    {:else if isActive}
                                        <div class='h-1.5 w-1.5 rounded-full bg-white'></div>
                                    {:else}
                                        <div class='h-1.5 w-1.5 rounded-full bg-slate-200'></div>
                                    {/if}
                                </div>
                                <div class={cn(
                                    'flex flex-row items-baseline justify-between w-full gap-1.5 md:flex-col md:items-start md:gap-0',
                                    !isActive && 'hidden md:flex',
                                    idx === steps.length - 1 ? 'items-end text-right' : 'items-start text-left',
                                )}>
                                    <span class={cn(
                                        'text-[11px] mb-0.5 whitespace-nowrap',
                                        idx <= activeMajorStep ? 'text-slate-900' : 'text-slate-400',
                                    )}>
                                        {step.label}
                                    </span>
                                    <span class='text-[10px] text-slate-400 whitespace-nowrap'>
                                        {step.sub}
                                    </span>
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>

            <div class='flex min-h-0 flex-1 overflow-hidden'>
                <!-- Sidebar -->
                {#if showSidebar}
                    <div class='flex h-full w-[300px] shrink-0 flex-col overflow-y-auto bg-[#F9FAFB] p-8'>
                        <div class='mb-10'>
                            <h2 class='mt-3 mb-9 text-sm text-slate-800'>Application Details</h2>
                            <button
                                onclick={() => {
                                    if (activeMajorStep === 0 && role === 'super-admin') {
                                        showInitialReview = false;
                                        isEvaluating = false;
                                    }
                                    else {
                                        window.history.back();
                                    }
                                }}
                                class='text-primary flex cursor-pointer items-center gap-2 text-[12px] transition-opacity hover:opacity-80'
                            >
                                ← Exit
                            </button>
                        </div>
                        <div class='relative flex flex-col gap-6'>
                            {#each sidebarSteps as step, idx (idx)}
                                {@const isCompleted = completedSteps.includes(idx)}
                                {@const isActive = idx === activeInternalStep}
                                <button
                                    class={cn(
                                        'group relative flex cursor-pointer gap-4 text-left',
                                        isActive || isCompleted ? 'opacity-100' : 'opacity-40 hover:opacity-100',
                                    )}
                                    onclick={() => (activeInternalStep = idx)}
                                >
                                    <div
                                        class={cn(
                                            'relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border transition-all',
                                            isActive
                                                ? 'border-slate-100'
                                                : isCompleted
                                                ? 'border-green-500 text-green-500'
                                                : 'border-slate-100',
                                        )}
                                    >
                                        <step.icon
                                            strokeWidth={isCompleted ? 1 : 1.2}
                                            class={cn('h-5 w-5', isCompleted ? 'text-green-500' : 'text-slate-400')}
                                        />
                                    </div>
                                    <div class='flex flex-col justify-center pt-0.5'>
                                        <span
                                            class={cn(
                                                'mb-1 text-[12px] transition-colors',
                                                isActive ? 'text-slate-900' : isCompleted ? '' : 'text-slate-500',
                                            )}
                                        >
                                            {step.label}
                                        </span>
                                        <span class='pr-2 text-[10px] leading-tight text-slate-400'>{step.sub}</span>
                                    </div>
                                </button>
                            {/each}
                        </div>
                    </div>
                {/if}

                <!-- Main Content -->
                <div
                    class={cn(
                        'min-h-0 flex-1 overflow-y-auto bg-white',
                        showSidebar && 'flex flex-col items-center',
                    )}
                >
                    {#if activeMajorStep === 0 && !showInitialReview && role === 'super-admin'}
                        <AssignEvaluatorsStage
                            {assignedInitialPrincipal}
                            {assignedInitialSecondary1}
                            {assignedInitialSecondary2}
                            {assignedInitialPrincipalStatus}
                            {assignedInitialSecondary1Status}
                            {assignedInitialSecondary2Status}
                            setPendingEvaluatorRole={r => (pendingEvaluatorRole = r)}
                            setActiveMajorStep={s => (activeMajorStep = s)}
                            setShowInitialReview={v => (showInitialReview = v)}
                            setIsEvaluating={v => (isEvaluating = v)}
                        />
                    {:else if activeMajorStep === 0 || activeMajorStep === 3}
                        <EvaluationReviewStage
                            {activeInternalStep}
                            setActiveInternalStep={s => (activeInternalStep = s)}
                            {activeTab}
                            setActiveTab={t => (activeTab = t)}
                            {isEvaluating}
                            setIsEvaluating={v => (isEvaluating = v)}
                            {staffAllocationList}
                            {documentList}
                            {equipmentList}
                            {completedSteps}
                            setCompletedSteps={(fn: (steps: number[]) => number[]) =>
                            (completedSteps = fn(completedSteps))}
                            {activeMajorStep}
                            setActiveMajorStep={s => (activeMajorStep = s)}
                            {handleNext}
                        />
                    {:else if activeMajorStep === 1}
                        <ScheduleDueDiligenceStage
                            {role}
                            {dateFrom}
                            {dateTo}
                            setDateFrom={d => (dateFrom = d)}
                            setDateTo={d => (dateTo = d)}
                            {assignedScheduledPrincipal}
                            {assignedScheduledSecondary1}
                            {assignedScheduledSecondary2}
                            setPendingEvaluatorRole={r => (pendingEvaluatorRole = r)}
                            setActiveMajorStep={s => (activeMajorStep = s)}
                            setShowInitialReview={v => (showInitialReview = v)}
                        />
                    {:else if activeMajorStep === 2}
                        <PerformDueDiligenceStage
                            {role}
                            {evaluationNote}
                            setEvaluationNote={n => (evaluationNote = n)}
                            {dueDiligenceEquipment}
                            setActiveMajorStep={s => (activeMajorStep = s)}
                            setActiveInternalStep={s => (activeInternalStep = s)}
                            setActiveTab={t => (activeTab = t)}
                            setIsEvaluating={v => (isEvaluating = v)}
                        />
                    {:else if activeMajorStep === 4}
                        <DecisionMakingStage
                            {role}
                            {application}
                            assignedPrincipal={assignedInitialPrincipal}
                            setActiveMajorStep={s => (activeMajorStep = s)}
                        />
                    {/if}
                </div>
            </div>
        </div>
    </div>

    <!-- Add Evaluator Modal -->
    {#if pendingEvaluatorRole}
        <AddEvaluatorModal
            title='Invite {pendingEvaluatorRole}'
            onClose={() => (pendingEvaluatorRole = null)}
            onInvite={(email) => {
                if (pendingEvaluatorRole === 'Initial Principal') {
                    assignedInitialPrincipal = email;
                    assignedInitialPrincipalStatus = 'accepted';
                }
                else if (pendingEvaluatorRole === 'Initial Secondary 1') {
                    assignedInitialSecondary1 = email;
                    assignedInitialSecondary1Status = 'accepted';
                }
                else if (pendingEvaluatorRole === 'Initial Secondary 2') {
                    assignedInitialSecondary2 = email;
                    assignedInitialSecondary2Status = 'accepted';
                }
                else if (pendingEvaluatorRole === 'Scheduled Principal') {
                    assignedScheduledPrincipal = email;
                }
                else if (pendingEvaluatorRole === 'Scheduled Secondary 1') {
                    assignedScheduledSecondary1 = email;
                }
                else if (pendingEvaluatorRole === 'Scheduled Secondary 2') {
                    assignedScheduledSecondary2 = email;
                }
                pendingEvaluatorRole = null;
            }}
        />
    {/if}
</div>
