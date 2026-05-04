<script lang='ts'>
    import { cn } from '$lib/accreditation/utils/cn';
    import PageContainer from '$lib/components/accreditation/layout/PageContainer.svelte';
    import PrimaryButton from '$lib/components/accreditation/ui/PrimaryButton.svelte';
    import {
        AlertCircle,
        Bell,
        Check,
        ChevronDown,
        Clock,
        FileText,
        Folder,
        HelpCircle,
        MessageSquare,
        XCircle,
    } from '@lucide/svelte';

    // Mock Data
    const mockApplications = [
        {
            id: '1',
            trade: { name: 'JavaScript', category: 'SPE' },
            status: 'Pending',
            stage: 'Initial Review',
            submittedOn: '19/12/2025 2:00 PM',
        },
        {
            id: '2',
            trade: { name: 'JavaScript', category: 'SPE' },
            status: 'Pending',
            stage: 'Due Diligence Scheduled',
            submittedOn: '19/12/2025 2:00 PM',
        },
    ];

    const mockCertifications = [
        { id: '1', application: 'Industrial Mechanic', certificate: 'Level 4 Accreditation', expiryDate: '20 May 2026' },
        { id: '2', application: 'Software Development', certificate: 'Module A Certification', expiryDate: '15 Dec 2026' },
        { id: '3', application: 'Masonry', certificate: 'Compliance Certificate', expiryDate: '10 Apr 2026' },
    ];

    function getCertDaysRemaining(expiryDate: string): number {
        const [day, mon, year] = expiryDate.split(' ');
        const months: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
        const expiry = new Date(Number.parseInt(year), months[mon], Number.parseInt(day));
        const today = new Date('2026-05-02');
        return Math.round((expiry.getTime() - today.getTime()) / 86400000);
    }

    const expiringCerts = mockCertifications.filter((c) => {
        const d = getCertDaysRemaining(c.expiryDate);
        return d > 0 && d <= 30;
    });
    const expiredCerts = mockCertifications.filter(c => getCertDaysRemaining(c.expiryDate) <= 0);

    const mockFeedback = [
        {
            id: '1',
            date: '12 Apr 2026, 10:30 AM',
            type: 'action_required',
            author: 'Evaluator Team',
            message: 'Please upload the revised CV for your lead instructor position. The document provided was blurred.',
            icon: AlertCircle,
            iconColor: 'text-amber-500',
            bgColor: 'bg-amber-50',
        },
        {
            id: '2',
            date: '10 Apr 2026, 02:15 PM',
            type: 'update',
            author: 'System',
            message: 'Initial Review completed successfully. Your application has proceeded to Due Diligence scheduling.',
            icon: Check,
            iconColor: 'text-emerald-500',
            bgColor: 'bg-emerald-50',
        },
        {
            id: '3',
            date: '08 Apr 2026, 09:00 AM',
            type: 'comment',
            author: 'Evaluator Team',
            message: 'We have received your application and will begin the initial document verification shortly.',
            icon: MessageSquare,
            iconColor: 'text-blue-500',
            bgColor: 'bg-blue-50',
        },
    ];

    let activeTab = $state('Applications');
    let selectedAppId = $state(mockApplications[1].id);
    const application = mockApplications[1];
    const currentStep = 1;

    const steps = [
        { label: 'Initial Review', sub: 'Documents Review' },
        { label: 'Schedule Due Diligence', sub: 'Website and location' },
        { label: 'Perform Due Diligence', sub: 'Start collaborating' },
        { label: 'Final Review', sub: 'Start collaborating' },
        { label: 'Decision Making', sub: 'Outcome shared' },
    ];

    const tabs = [
        { id: 'Applications', label: 'Applications', icon: FileText },
        { id: 'Certificates', label: 'Certificates', icon: Folder },
    ];

    const progressWidth = $derived(`${(currentStep / (steps.length - 1)) * 100}%`);
    const lineGap = 32;
</script>

<PageContainer
    title='Manage Accreditation Evaluations'
    description='View & manage active applications and requests'
>
    <div class='flex w-full flex-col gap-6 max-w-5xl lg:max-w-6xl xl:max-w-7xl'>
        <!-- Tabs Navigation -->
        <div class='mb-8 flex w-full gap-4'>
            {#each tabs as tab}
                {@const isActive = activeTab === tab.id}
                <button
                    onclick={() => activeTab = tab.id}
                    class={cn(
                        'flex-1 flex items-center justify-center gap-3 px-8 py-5 text-[15px] font-medium transition-all rounded-sm cursor-pointer',
                        isActive
                            ? 'text-[#2069C1] bg-[#F4F7FF]'
                            : 'text-slate-500 hover:text-[#2069C1] hover:bg-[#F4F7FF]',
                    )}
                >
                    <tab.icon class={cn('h-5 w-5', isActive ? 'text-[#2069C1]' : 'text-slate-400')} />
                    {tab.label}
                </button>
            {/each}
        </div>

        {#if activeTab === 'Applications'}
            <!-- Application Selector -->
            <div class='flex flex-col justify-between gap-4 rounded-sm border border-slate-200 bg-white p-6 text-left sm:flex-row sm:items-center'>
                <div>
                    <h2 class='mb-1 text-sm font-bold uppercase tracking-widest text-slate-800'>Selected Application</h2>
                    <div class='flex items-center gap-3'>
                        <span class='text-[16px] font-medium text-slate-900'>{application.trade.name}</span>
                        <span class='rounded-sm bg-slate-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-600'>{application.trade.category}</span>
                    </div>
                </div>
                <div class='relative min-w-[200px]'>
                    <select
                        bind:value={selectedAppId}
                        class='w-full appearance-none rounded-sm border border-slate-200 bg-slate-50 py-2.5 pl-4 pr-10 text-sm font-medium text-slate-700 transition-all focus:border-[#2069C1] focus:outline-none'
                    >
                        {#each mockApplications as app}
                            <option value={app.id}>{app.trade.name} - {app.trade.category}</option>
                        {/each}
                    </select>
                    <ChevronDown class='pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
                </div>
            </div>

            <div class='mt-6 grid grid-cols-1 gap-6 text-left lg:grid-cols-3'>
                <!-- Left Column: Timeline & Progress -->
                <div class='flex flex-col gap-6 lg:col-span-2'>
                    <!-- Progress Card -->
                    <div class='rounded-sm border border-slate-200 bg-white p-8'>
                        <h3 class='mb-2 text-[16px] font-bold text-slate-800'>Evaluation Progress</h3>
                        <p class='mb-8 text-sm text-slate-500'>Track the status of your accreditation application through the evaluation stages.</p>

                        <!-- Horizontal Stepper -->
                        <div class='no-scrollbar w-full overflow-x-auto pb-4'>
                            <div class='relative my-6 min-w-[750px] px-1 pt-2 overflow-visible'>
                                <!-- Background Line -->
                                <div class='absolute top-[13px] left-[16px] right-[16px] h-px bg-slate-200 z-0'></div>
                                <!-- Progress Line -->
                                <div
                                    class='absolute top-[13px] left-[16px] h-[1.5px] bg-[#2069C1] z-0 transition-all duration-300'
                                    style='width: calc({progressWidth} - {(currentStep / (steps.length - 1)) * lineGap}px)'
                                ></div>

                                <div class='flex items-start justify-between w-full relative z-10'>
                                    {#each steps as step, idx}
                                        {@const isActive = idx === currentStep}
                                        {@const isCompleted = idx < currentStep}
                                        <div class={cn(
                                            'flex flex-col relative',
                                            idx === 0 ? 'items-start' : idx === steps.length - 1 ? 'items-end' : 'items-center flex-1',
                                        )}>
                                            <div class={cn(
                                                'h-6 w-6 rounded-full border flex items-center justify-center mb-3 transition-all duration-300 shrink-0 relative z-10',
                                                isActive
                                                    ? 'border-[#2069C1] bg-[#2069C1]'
                                                    : isCompleted ? 'border-[#2069C1] bg-[#2069C1]' : 'border-slate-200 bg-white',
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
                                                    'text-[12px] font-bold mb-0.5 whitespace-nowrap',
                                                    idx <= currentStep ? 'text-slate-900' : 'text-slate-400',
                                                )}>
                                                    {step.label}
                                                </span>
                                                <span class='whitespace-nowrap text-[10px] font-medium text-slate-400'>{step.sub}</span>
                                            </div>
                                        </div>
                                    {/each}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Feedback Timeline -->
                    <div class='rounded-sm border border-slate-200 bg-white p-8'>
                        <h3 class='mb-6 border-b border-slate-100 pb-4 text-[16px] font-bold text-slate-800'>Recent Feedback & Activity</h3>

                        <div class='relative'>
                            <!-- Vertical line connecting timeline items -->
                            <div class='absolute bottom-4 left-[19px] top-4 w-px bg-slate-100'></div>

                            <div class='relative flex flex-col gap-8'>
                                {#each mockFeedback as feedback}
                                    <div class='flex gap-4'>
                                        <div class={cn('relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-white ring-4 ring-white', feedback.bgColor)}>
                                            <feedback.icon class={cn('h-4 w-4', feedback.iconColor)} />
                                        </div>
                                        <div class='flex flex-col pb-4 pt-2'>
                                            <div class='mb-1 flex items-center gap-2'>
                                                <span class='text-sm font-bold text-slate-800'>{feedback.author}</span>
                                                <span class='text-[11px] font-medium text-slate-400'>• {feedback.date}</span>
                                            </div>
                                            <p class='mt-2 rounded-sm border border-slate-100 bg-slate-50/50 p-4 text-sm font-medium leading-relaxed text-slate-600'>
                                                {feedback.message}
                                            </p>

                                            {#if feedback.type === 'action_required'}
                                                <div class='mt-3'>
                                                    <PrimaryButton label='Upload Document' icon={FileText} class='shadow-none px-4 py-2' />
                                                </div>
                                            {/if}
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Column: Status Summary -->
                <div class='flex flex-col gap-6'>
                    <div class='rounded-sm border border-slate-200 bg-white p-6'>
                        <h3 class='mb-4 border-b border-slate-100 pb-3 text-[14px] font-bold text-slate-800'>Current Status</h3>

                        <div class='flex flex-col gap-4'>
                            <div class='flex items-start gap-3'>
                                <div class='mt-0.5'><Clock class='h-4 w-4 text-[#2069C1]' /></div>
                                <div>
                                    <p class='mb-0.5 text-[11px] font-bold uppercase tracking-widest text-slate-400'>Stage</p>
                                    <p class='text-sm font-bold text-slate-800'>{application.stage}</p>
                                </div>
                            </div>

                            <div class='flex items-start gap-3'>
                                <div class='mt-0.5'><Check class='h-4 w-4 text-emerald-500' /></div>
                                <div>
                                    <p class='mb-0.5 text-[11px] font-bold uppercase tracking-widest text-slate-400'>Application ID</p>
                                    <p class='text-sm font-bold text-slate-800'>APP-2026-04-{application.id.padStart(3, '0')}</p>
                                </div>
                            </div>

                            <div class='flex items-start gap-3'>
                                <div class='mt-0.5'><FileText class='h-4 w-4 text-slate-400' /></div>
                                <div>
                                    <p class='mb-0.5 text-[11px] font-bold uppercase tracking-widest text-slate-400'>Submitted On</p>
                                    <p class='text-sm font-bold text-slate-800'>{application.submittedOn}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class='rounded-sm border border-[#2069C1]/10 bg-[#2069C1]/5 p-6'>
                        <div class='mb-2 flex items-center gap-2 text-[#2069C1]'>
                            <HelpCircle class='h-5 w-5' />
                            <h3 class='text-[14px] font-bold'>Need Help?</h3>
                        </div>
                        <p class='mb-4 text-[12px] font-medium leading-relaxed text-slate-600'>
                            If you have any questions regarding the evaluation process or need to appeal a decision, please contact our support team.
                        </p>
                        <button class='cursor-pointer text-[12px] font-bold text-[#2069C1] hover:underline'>Contact Support &rarr;</button>
                    </div>
                </div>
            </div>
        {:else if activeTab === 'Certificates'}
            {#if expiredCerts.length > 0 || expiringCerts.length > 0}
                <div class='mt-6 space-y-2'>
                    {#if expiredCerts.length > 0}
                        <div class='flex items-start gap-3 rounded-sm border border-red-200 bg-red-50 px-5 py-4'>
                            <XCircle class='mt-0.5 h-5 w-5 shrink-0 text-red-600' />
                            <div>
                                <p class='text-sm font-bold text-red-800'>Certificate Expired — Access Auto-Revoked</p>
                                <ul class='mt-1 space-y-0.5'>
                                    {#each expiredCerts as cert}
                                        <li class='text-[12px] text-red-700'>{cert.application} — {cert.certificate} (expired {cert.expiryDate})</li>
                                    {/each}
                                </ul>
                            </div>
                        </div>
                    {/if}
                    {#if expiringCerts.length > 0}
                        <div class='flex items-start gap-3 rounded-sm border border-amber-200 bg-amber-50 px-5 py-4'>
                            <Bell class='mt-0.5 h-5 w-5 shrink-0 text-amber-600' />
                            <div>
                                <p class='text-sm font-bold text-amber-800'>Certificate Expiring Soon — Action Required</p>
                                <ul class='mt-1 space-y-0.5'>
                                    {#each expiringCerts as cert}
                                        {@const d = getCertDaysRemaining(cert.expiryDate)}
                                        <li class='text-[12px] text-amber-700'>{cert.application} — {cert.certificate} ({d} day{d !== 1 ? 's' : ''} remaining)</li>
                                    {/each}
                                </ul>
                                <p class='mt-2 text-[11px] text-amber-600'>Contact your supervisor to renew access before the certificate expires.</p>
                            </div>
                        </div>
                    {/if}
                </div>
            {/if}
            <div class='mt-6 overflow-hidden rounded-sm border border-slate-200 bg-white text-left'>
                <div class='border-b border-slate-100 p-8'>
                    <h3 class='mb-1 text-[16px] font-bold text-slate-800'>Certificates</h3>
                    <p class='text-sm text-slate-500'>View and manage certificates for your allowed applications.</p>
                </div>

                <div class='overflow-x-auto'>
                    <table class='w-full'>
                        <thead>
                            <tr class='border-b border-slate-100 bg-slate-50/50'>
                                <th class='px-8 py-5 text-left text-[12px] font-bold uppercase tracking-wider text-slate-400'>Application</th>
                                <th class='px-8 py-5 text-left text-[12px] font-bold uppercase tracking-wider text-slate-400'>Certificate</th>
                                <th class='px-8 py-5 text-left text-[12px] font-bold uppercase tracking-wider text-slate-400'>Expiration Date</th>
                                <th class='px-8 py-5 text-right text-[12px] font-bold uppercase tracking-wider text-slate-400'>Actions</th>
                            </tr>
                        </thead>
                        <tbody class='divide-y divide-slate-100'>
                            {#each mockCertifications as cert}
                                <tr class='group transition-colors hover:bg-slate-50/30'>
                                    <td class='px-8 py-5'>
                                        <div class='flex items-center gap-3'>
                                            <div class='flex h-9 w-9 items-center justify-center rounded-sm bg-blue-50'>
                                                <FileText class='h-4 w-4 text-[#2069C1]' />
                                            </div>
                                            <span class='text-[14px] font-bold text-slate-800'>{cert.application}</span>
                                        </div>
                                    </td>
                                    <td class='px-8 py-5'>
                                        <span class='text-sm font-medium text-slate-600'>{cert.certificate}</span>
                                    </td>
                                    <td class='px-8 py-5'>
                                        <div class='flex items-center gap-2'>
                                            <Clock class='h-3.5 w-3.5 text-slate-400' />
                                            <span class='text-sm font-medium text-slate-600'>{cert.expiryDate}</span>
                                        </div>
                                    </td>
                                    <td class='px-8 py-5 text-right'>
                                        <button class='cursor-pointer text-sm font-bold text-[#2069C1] hover:underline'>Download</button>
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
                {#if mockCertifications.length === 0}
                    <div class='p-20 text-center'>
                        <Folder class='mx-auto mb-4 h-12 w-12 text-slate-200' />
                        <p class='font-medium text-slate-500'>No certifications found.</p>
                    </div>
                {/if}
            </div>
        {/if}
    </div>
</PageContainer>
