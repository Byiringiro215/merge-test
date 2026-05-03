<script lang='ts'>
    import {
        formatDate,
        getDaysInfo,
        mockCompletedApplications,
        mockGrantedCertificates,
    } from '$lib/accreditation/utils/certificate-utils';
    import { cn } from '$lib/accreditation/utils/cn';
    import StatsGrid from '$lib/components/accreditation/dashboard/StatsGrid.svelte';
    import DataTable from '$lib/components/accreditation/ui/DataTable.svelte';
    import StatusBadge from '$lib/components/accreditation/ui/StatusBadge.svelte';
    import {
        Activity,
        AlertTriangle,
        Award,
        CheckCircle2,
        Clock,
        FileCheck,
        X,
        XCircle,
        Zap,
    } from '@lucide/svelte';
    import GrantAccessModal from './GrantAccessModal.svelte';
    import RevokeAccessModal from './RevokeAccessModal.svelte';

    interface Application {
        id: string;
        applicant: {
            name: string;
            email: string;
            avatar: string;
        };
        institution: {
            name: string;
            logo: string;
            website: string;
        };
        trade: {
            name: string;
            category: string;
        };
        completedOn: string;
        evaluator: string;
        certificateAccess: 'Granted' | 'Pending';
    }

    interface Certificate {
        id: string;
        applicant: {
            name: string;
            email?: string;
            avatar?: string;
        };
        institution: {
            name: string;
            logo?: string;
            website?: string;
        };
        trade: {
            name: string;
            category?: string;
        };
        grantedOn: string;
        evaluator: string;
    }

    const TABS = [
        { key: 'access', label: 'Access Management' },
        { key: 'tracking', label: 'Certificate Tracking' },
    ];

    let activeTab = $state('access');
    let search = $state('');
    let trackingSearch = $state('');
    let applicationsData = $state<Application[]>(mockCompletedApplications as Application[]);
    let certificatesData = $state<Certificate[]>(mockGrantedCertificates as Certificate[]);
    let grantModalOpen = $state(false);
    let revokeModalOpen = $state(false);
    let selectedApplication = $state<Application | null>(null);
    let dismissedExpired = $state(false);
    let dismissedExpiring = $state(false);

    const handleGrantAccess = (item: Application) => {
        selectedApplication = item;
        grantModalOpen = true;
    };

    const handleRevokeAccess = (item: Application) => {
        selectedApplication = item;
        revokeModalOpen = true;
    };

    const confirmGrantAccess = () => {
        if (selectedApplication) {
            applicationsData = applicationsData.map(app =>
                app.id === selectedApplication!.id ? { ...app, certificateAccess: 'Granted' } : app,
            );
            certificatesData = [
                ...certificatesData,
                {
                    id: Math.random().toString(),
                    applicant: selectedApplication.applicant,
                    institution: selectedApplication.institution,
                    trade: selectedApplication.trade,
                    grantedOn: new Date().toISOString().split('T')[0],
                    evaluator: selectedApplication.evaluator,
                },
            ];
            grantModalOpen = false;
        }
    };

    const confirmRevokeAccess = () => {
        if (selectedApplication) {
            applicationsData = applicationsData.map(app =>
                app.id === selectedApplication!.id ? { ...app, certificateAccess: 'Pending' } : app,
            );
            certificatesData = certificatesData.filter(
                cert =>
                    !(
                        cert.applicant.name === selectedApplication!.applicant.name
                        && cert.trade.name === selectedApplication!.trade.name
                    ),
            );
            revokeModalOpen = false;
        }
    };

    const expiringCertificates = $derived(
        certificatesData.filter((cert) => {
            const info = getDaysInfo(cert.grantedOn);
            return !info.isExpired && info.remainingDays <= 30;
        }),
    );

    const expiredCertificates = $derived(
        certificatesData.filter(cert => getDaysInfo(cert.grantedOn).isExpired),
    );

    const accessStats = [
        { label: 'Completed Evaluations', value: '18', icon: CheckCircle2, iconColor: '#34C759' },
        { label: 'Certificates Granted', value: '12', icon: Award, iconColor: '#0A77FF' },
        { label: 'Pending Access', value: '6', icon: Clock, iconColor: '#FF8D28' },
        { label: 'Total Approved', value: '18', icon: FileCheck, iconColor: '#6155F5' },
    ];

    const trackingStats = [
        { label: 'Active Certificates', value: '9', icon: Activity, iconColor: '#0A77FF' },
        { label: 'Expiring Soon', value: '3', icon: AlertTriangle, iconColor: '#FF8D28' },
        { label: 'Expired', value: '2', icon: Clock, iconColor: '#FF383C' },
        { label: 'Total Issued', value: '12', icon: Award, iconColor: '#34C759' },
    ];

    const filteredData = $derived(
        applicationsData.filter(
            item =>
                item.institution.name.toLowerCase().includes(search.toLowerCase())
                    || item.applicant.name.toLowerCase().includes(search.toLowerCase())
                    || item.trade.name.toLowerCase().includes(search.toLowerCase()),
        ),
    );

    const filteredTracking = $derived(
        certificatesData.filter(
            item =>
                item.institution.name.toLowerCase().includes(trackingSearch.toLowerCase())
                    || item.applicant.name.toLowerCase().includes(trackingSearch.toLowerCase())
                    || item.trade.name.toLowerCase().includes(trackingSearch.toLowerCase()),
        ),
    );
</script>

{#snippet applicantCell(item: Application | Certificate)}
    <div class='flex items-start gap-3 text-left'>
        <div class='flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600'>
            {item.applicant.avatar || 'U'}
        </div>
        <div class='flex flex-col'>
            <span class='text-[13px] font-medium text-[#101828]'>{item.applicant.name}</span>
            <span class='text-[11px] text-[#475467]'>{item.applicant.email || ''}</span>
        </div>
    </div>
{/snippet}

{#snippet institutionCell(item: Application)}
    <div class='flex items-start gap-3 text-left'>
        <div class='flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-[10px] font-bold text-orange-600'>
            {item.institution.logo}
        </div>
        <div class='flex flex-col'>
            <span class='text-[13px] font-medium text-[#101828]'>{item.institution.name}</span>
            <span class='text-[11px] text-[#475467]'>{item.institution.website}</span>
        </div>
    </div>
{/snippet}

{#snippet tradeCell(item: Application)}
    <div class='flex flex-col text-left'>
        <span class='text-[13px] font-medium text-slate-600'>{item.trade.name}</span>
        <span class='text-[11px] uppercase tracking-wider text-[#475467]'>{item.trade.category}</span>
    </div>
{/snippet}

{#snippet completedOnCell(item: Application)}
    <span class='text-left text-[13px] font-medium text-slate-600'>{item.completedOn}</span>
{/snippet}

{#snippet evaluatorCell(item: Application | Certificate)}
    <span class='text-left text-[13px] text-slate-500'>{item.evaluator}</span>
{/snippet}

{#snippet accessCell(item: Application)}
    <div class='flex items-center gap-2 text-left'>
        {#if item.certificateAccess === 'Granted'}
            <CheckCircle2 class='h-4 w-4 text-blue-500' />
            <span class='text-[13px] font-medium text-blue-600'>Granted</span>
        {:else}
            <Clock class='h-4 w-4 text-orange-500' />
            <span class='text-[13px] font-medium text-orange-600'>Pending</span>
        {/if}
    </div>
{/snippet}

{#snippet accessActionCell(item: Application)}
    <div class='flex items-center gap-2 text-left'>
        {#if item.certificateAccess === 'Pending'}
            <button
                onclick={(e) => {
                    e.stopPropagation();
                    handleGrantAccess(item);
                }}
                class='cursor-pointer whitespace-nowrap rounded-sm bg-blue-600 px-3 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-blue-700'
            >
                Grant Access
            </button>
        {:else}
            <button
                onclick={(e) => {
                    e.stopPropagation();
                    handleRevokeAccess(item);
                }}
                class='cursor-pointer whitespace-nowrap rounded-sm border border-red-300 bg-white px-3 py-1.5 text-[12px] font-medium text-red-600 transition-colors hover:bg-red-50'
            >
                Revoke Access
            </button>
        {/if}
    </div>
{/snippet}

{#snippet trackingInstitutionCell(item: Certificate)}
    <div class='flex flex-col text-left'>
        <span class='text-[13px] font-medium text-[#101828]'>{item.institution.name}</span>
        <span class='text-[11px] text-[#475467]'>{item.trade.name}</span>
    </div>
{/snippet}

{#snippet grantedOnCell(item: Certificate)}
    {@const info = getDaysInfo(item.grantedOn)}
    <span class='text-left text-[13px] text-slate-600'>{formatDate(info.granted)}</span>
{/snippet}

{#snippet expiresOnCell(item: Certificate)}
    {@const info = getDaysInfo(item.grantedOn)}
    <span class={cn('text-left text-[13px] font-medium', info.isExpired ? 'text-red-600' : info.isExpiringSoon ? 'text-orange-600' : 'text-slate-600')}>
        {formatDate(info.expiry)}
    </span>
{/snippet}

{#snippet timeRemainingCell(item: Certificate)}
    {@const info = getDaysInfo(item.grantedOn)}
    <div class='flex items-center gap-1.5 text-left'>
        {#if info.isExpired}
            <div class='h-2 w-2 shrink-0 rounded-full bg-red-500'></div>
            <span class='text-[12px] font-medium text-red-600'>Expired</span>
        {:else}
            <div class={cn('h-2 w-2 shrink-0 rounded-full', info.isExpiringSoon ? 'bg-orange-500' : 'bg-blue-500')}></div>
            <span class={cn('text-[12px] font-medium', info.isExpiringSoon ? 'text-orange-600' : 'text-blue-600')}>
                {info.remainingDays}d left
            </span>
        {/if}
    </div>
{/snippet}

{#snippet progressCell(item: Certificate)}
    {@const info = getDaysInfo(item.grantedOn)}
    <div class='w-32 space-y-1 text-left'>
        <div class='h-1.5 w-full overflow-hidden rounded-full bg-slate-100'>
            <div
                class={cn('h-full rounded-full transition-all', info.isExpired ? 'bg-red-500' : info.isExpiringSoon ? 'bg-orange-500' : 'bg-blue-500')}
                style='width: {info.progressPct}%'
            ></div>
        </div>
        <span class='text-[10px] text-slate-400'>{info.progressPct}% elapsed</span>
    </div>
{/snippet}

{#snippet trackingStatusCell(item: Certificate)}
    {@const info = getDaysInfo(item.grantedOn)}
    <div class='text-left'>
        <StatusBadge status={info.isExpired ? 'Expired' : info.isExpiringSoon ? 'Expiring Soon' : 'Active'} />
        {#if info.isExpired}
            <span class='mt-1 block text-[10px] font-medium text-red-600'>Auto-revoked</span>
        {/if}
    </div>
{/snippet}

<!-- Tabs -->
<div class='mb-6 flex w-full items-center justify-between gap-2'>
    {#each TABS as tab}
        {@const isActive = activeTab === tab.key}
        <button
            onclick={() => activeTab = tab.key}
            class={cn(
                'relative flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm px-4 py-3 transition-colors duration-200 whitespace-nowrap',
                isActive ? 'text-primary' : 'text-[#353E49] hover:bg-slate-50 hover:text-primary',
            )}
        >
            {#if isActive}
                <div class='absolute inset-0 z-0 rounded-sm bg-[#F9FAFB]'></div>
            {/if}
            <span class={cn(
                'relative z-10 text-sm font-medium transition-colors duration-200',
                isActive ? 'text-primary' : 'text-[#353E49]',
            )}>
                {tab.label}
            </span>
        </button>
    {/each}
</div>

{#if activeTab === 'access'}
    <div class='space-y-6'>
        <StatsGrid items={accessStats} />
        <DataTable
            data={filteredData}
            columns={[
                { header: 'Applicant', accessor: applicantCell, sortable: true },
                { header: 'Institution', accessor: institutionCell, sortable: true },
                { header: 'Trade', accessor: tradeCell },
                { header: 'Completed On', accessor: completedOnCell },
                { header: 'Evaluator', accessor: evaluatorCell },
                { header: 'Certificate Access', accessor: accessCell },
                { header: 'Action', accessor: accessActionCell },
            ]}
            title='Completed Evaluations'
            description='Applications that have completed the evaluation process and are ready for certificate access'
            searchValue={search}
            onSearchChange={val => search = val}
            showPagination={true}
            currentPage={1}
            totalPages={5}
        />
    </div>
{:else if activeTab === 'tracking'}
    <div class='space-y-6'>
        {#if expiredCertificates.length > 0 || expiringCertificates.length > 0}
            <div class='space-y-3'>
                {#if expiredCertificates.length > 0 && !dismissedExpired}
                    <div class='relative overflow-hidden rounded-lg border border-red-200 bg-gradient-to-r from-red-50 to-red-50/50 px-5 py-4 shadow-sm'>
                        <div class='absolute inset-y-0 left-0 w-1 bg-red-500'></div>
                        <div class='flex items-start gap-4 pl-2'>
                            <div class='mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg bg-red-100'>
                                <XCircle class='h-5 w-5 text-red-600' />
                            </div>
                            <div class='flex-1 min-w-0'>
                                <div class='flex items-center justify-between gap-2'>
                                    <p class='text-[14px] font-bold text-red-900'>
                                        {expiredCertificates.length} Certificate{expiredCertificates.length > 1 ? 's' : ''} Expired
                                    </p>
                                    <span class='inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-[11px] font-semibold text-red-700'>
                                        Auto-revoked
                                    </span>
                                </div>
                                <p class='mt-1 text-[12px] text-red-700'>
                                    Access has been automatically revoked for these certificates.
                                </p>
                                <ul class='mt-2.5 space-y-1.5'>
                                    {#each expiredCertificates as cert}
                                        {@const info = getDaysInfo(cert.grantedOn)}
                                        <li class='flex items-center gap-2 text-[12px] text-red-600'>
                                            <div class='h-1.5 w-1.5 rounded-full bg-red-400'></div>
                                            <span class='font-medium'>{cert.applicant.name}</span>
                                            <span class='text-red-500'>—</span>
                                            <span>{cert.trade.name}</span>
                                            <span class='ml-auto text-[11px] font-semibold text-red-700'>
                                                {Math.abs(info.remainingDays)}d ago
                                            </span>
                                        </li>
                                    {/each}
                                </ul>
                            </div>
                            <button
                                onclick={() => dismissedExpired = true}
                                class='mt-0.5 flex h-8 w-8 items-center justify-center rounded-md text-red-600 transition-colors hover:bg-red-100'
                                aria-label='Dismiss expired certificates notification'
                            >
                                <X class='h-4 w-4' />
                            </button>
                        </div>
                    </div>
                {/if}
                {#if expiringCertificates.length > 0 && !dismissedExpiring}
                    <div class='relative overflow-hidden rounded-lg border border-amber-200 bg-gradient-to-r from-amber-50 to-amber-50/50 px-5 py-4 shadow-sm'>
                        <div class='absolute inset-y-0 left-0 w-1 bg-amber-500'></div>
                        <div class='flex items-start gap-4 pl-2'>
                            <div class='mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100'>
                                <AlertTriangle class='h-5 w-5 text-amber-600' />
                            </div>
                            <div class='flex-1 min-w-0'>
                                <div class='flex items-center justify-between gap-2'>
                                    <p class='text-[14px] font-bold text-amber-900'>
                                        {expiringCertificates.length} Certificate{expiringCertificates.length > 1 ? 's' : ''} Expiring Soon
                                    </p>
                                    <span class='inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700'>
                                        Action needed
                                    </span>
                                </div>
                                <p class='mt-1 text-[12px] text-amber-700'>
                                    Applicants have been notified. Renew or revoke before expiration.
                                </p>
                                <ul class='mt-2.5 space-y-1.5'>
                                    {#each expiringCertificates as cert}
                                        {@const info = getDaysInfo(cert.grantedOn)}
                                        <li class='flex items-center gap-2 text-[12px] text-amber-600'>
                                            <div class='h-1.5 w-1.5 rounded-full bg-amber-400'></div>
                                            <span class='font-medium'>{cert.applicant.name}</span>
                                            <span class='text-amber-500'>—</span>
                                            <span>{cert.trade.name}</span>
                                            <span class='ml-auto flex items-center gap-1 text-[11px] font-semibold text-amber-700'>
                                                <Zap class='h-3 w-3' />
                                                {info.remainingDays}d left
                                            </span>
                                        </li>
                                    {/each}
                                </ul>
                            </div>
                            <button
                                onclick={() => dismissedExpiring = true}
                                class='mt-0.5 flex h-8 w-8 items-center justify-center rounded-md text-amber-600 transition-colors hover:bg-amber-100'
                                aria-label='Dismiss expiring certificates notification'
                            >
                                <X class='h-4 w-4' />
                            </button>
                        </div>
                    </div>
                {/if}
            </div>
        {/if}
        <StatsGrid items={trackingStats} />
        <DataTable
            data={filteredTracking}
            columns={[
                { header: 'Applicant', accessor: applicantCell, sortable: true },
                { header: 'Institution / Trade', accessor: trackingInstitutionCell },
                { header: 'Granted On', accessor: grantedOnCell },
                { header: 'Expires On', accessor: expiresOnCell },
                { header: 'Time Remaining', accessor: timeRemainingCell },
                { header: 'Validity Progress', accessor: progressCell },
                { header: 'Status', accessor: trackingStatusCell },
            ]}
            title='Certificate Tracking'
            description='Track all granted certificates, their validity period and expiry status'
            searchValue={trackingSearch}
            onSearchChange={val => trackingSearch = val}
            showPagination={true}
            currentPage={1}
            totalPages={3}
        />
    </div>
{/if}

<GrantAccessModal
    isOpen={grantModalOpen}
    onClose={() => grantModalOpen = false}
    onConfirm={confirmGrantAccess}
    applicantName={selectedApplication?.applicant?.name || ''}
    tradeName={selectedApplication?.trade?.name || ''}
/>
<RevokeAccessModal
    isOpen={revokeModalOpen}
    onClose={() => revokeModalOpen = false}
    onConfirm={confirmRevokeAccess}
    applicantName={selectedApplication?.applicant?.name || ''}
    tradeName={selectedApplication?.trade?.name || ''}
/>
