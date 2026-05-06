<script lang='ts'>
    import { cn } from '$lib/accreditation/utils/cn';
    import { AlertTriangle, Award, BellRing, Check, CircleCheck, Clock, Info, MailWarning, ShieldCheck, Trash2 } from '@lucide/svelte';

    const { role }: { role: string } = $props();

    const certNotifications = [
        {
            id: 10,
            type: 'cert-expiring',
            title: 'Certificate Expiring Soon — Industrial Mechanic',
            message: 'Your Level 4 Accreditation certificate for Industrial Mechanic expires in 18 days (20 May 2026). Please contact your supervisor to renew access before it expires.',
            time: 'Just now',
            read: false,
            icon: Clock,
            color: 'text-amber-500',
            bg: 'bg-amber-50',
        },
        {
            id: 11,
            type: 'cert-expiring',
            title: 'Certificate Expiring Soon — Masonry',
            message: 'Your Compliance Certificate for Masonry expires in 8 days (10 Apr 2026). Immediate action required — contact your supervisor for renewal.',
            time: '1 hour ago',
            read: false,
            icon: AlertTriangle,
            color: 'text-red-500',
            bg: 'bg-red-50',
        },
    ];

    const supervisorCertNotifications = [
        {
            id: 20,
            type: 'cert-expiring',
            title: 'Certificate Expiring — Action Required',
            message: '2 applicant certificates expire within 30 days. Eric Nkurunziza (Plumbing) certificate expired. Grace Uwimana (Welding) certificate expires in 69 days. Review Certificate Tracking.',
            time: 'Just now',
            read: false,
            icon: Award,
            color: 'text-amber-500',
            bg: 'bg-amber-50',
        },
        {
            id: 21,
            type: 'cert-expired',
            title: 'Certificate Auto-Revoked — Plumbing',
            message: 'Eric Nkurunziza\'s Plumbing certificate has expired and access has been automatically revoked. A notification has been sent to the applicant.',
            time: '2 hours ago',
            read: false,
            icon: AlertTriangle,
            color: 'text-red-500',
            bg: 'bg-red-50',
        },
    ];

    const baseNotifications = [
        {
            id: 1,
            type: 'alert',
            title: 'System Maintenance Scheduled',
            message: 'The platform will be undergoing scheduled maintenance this Sunday 00:00 GMT.',
            time: '2 hours ago',
            read: false,
            icon: AlertTriangle,
            color: 'text-red-500',
            bg: 'bg-red-50',
        },
        {
            id: 2,
            type: 'application',
            title: 'New Application Submitted',
            message: 'Rwanda Polytechnic submitted a new application for the Trade & Competency module.',
            time: '5 hours ago',
            read: false,
            icon: BellRing,
            color: 'text-blue-500',
            bg: 'bg-blue-50',
        },
        {
            id: 3,
            type: 'security',
            title: 'Security Audit Required',
            message: 'A mandatory account access review is required for all active super-administrators.',
            time: '1 day ago',
            read: true,
            icon: ShieldCheck,
            color: 'text-emerald-500',
            bg: 'bg-emerald-50',
        },
        {
            id: 4,
            type: 'system',
            title: 'Password Change Detected',
            message: 'Your primary master account password was successfully updated.',
            time: '2 days ago',
            read: true,
            icon: CircleCheck,
            color: 'text-emerald-500',
            bg: 'bg-emerald-50',
        },
        {
            id: 5,
            type: 'message',
            title: 'Unread Helpdesk Ticket',
            message: 'An institution requested clarification regarding their evaluation criteria grading.',
            time: '3 days ago',
            read: true,
            icon: MailWarning,
            color: 'text-orange-500',
            bg: 'bg-orange-50',
        },
    ];

    const mockNotifications = $derived(
        role === 'applicant'
            ? [...certNotifications, ...baseNotifications]
            : role === 'supervisor'
            ? [...supervisorCertNotifications, ...baseNotifications]
            : baseNotifications,
    );

    let activeTab = $state('all');

    const filtered = $derived(activeTab === 'unread'
        ? mockNotifications.filter(n => !n.read)
        : mockNotifications);

    const unreadCount = $derived(mockNotifications.filter(n => !n.read).length);
</script>

<div class='flex flex-col md:flex-row gap-6 w-full max-w-6xl'>
    <!-- Left Sidebar Filter -->
    <div class='w-full md:w-64 shrink-0 space-y-1'>
        <button
            onclick={() => activeTab = 'all'}
            class={cn(
                'w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-sm transition-colors cursor-pointer',
                activeTab === 'all' ? 'bg-[#F9FAFB] text-[#2069C1]' : 'text-[#353E49] hover:bg-slate-50',
            )}
        >
            <span>All Notifications</span>
            <span class='bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs'>{mockNotifications.length}</span>
        </button>
        <button
            onclick={() => activeTab = 'unread'}
            class={cn(
                'w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-sm transition-colors cursor-pointer',
                activeTab === 'unread' ? 'bg-[#F9FAFB] text-[#2069C1]' : 'text-[#353E49] hover:bg-slate-50',
            )}
        >
            <span>Unread</span>
            <span class='bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold'>{unreadCount}</span>
        </button>
        <div class='pt-4 mt-4 border-t border-slate-100'>
            <button class='w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-900 rounded-sm transition-colors hover:bg-slate-50 cursor-pointer'>
                <Check class='h-4 w-4' />
                Mark all as read
            </button>
        </div>
    </div>

    <!-- Main Feed -->
    <div class='flex-1 space-y-3'>
        {#each filtered as notification}
            <div
                class={cn(
                    'group relative flex items-start gap-4 p-4 border rounded-sm transition-all duration-200',
                    !notification.read ? 'bg-white border-blue-100 shadow-sm' : 'bg-slate-50/50 border-slate-100',
                )}
            >
                {#if !notification.read}
                    <div class='absolute top-0 bottom-0 left-0 w-1 bg-blue-500 rounded-l-sm'></div>
                {/if}

                <div class={cn('shrink-0 p-2.5 rounded-sm', notification.bg)}>
                    <notification.icon class={cn('h-5 w-5', notification.color)} strokeWidth={1.5} />
                </div>

                <div class='flex-1 pr-10'>
                    <div class='flex items-start justify-between gap-4 mb-1'>
                        <h4 class={cn('text-sm ', !notification.read ? 'text-slate-900 font-semibold' : 'text-slate-700 font-medium')}>
                            {notification.title}
                        </h4>
                        <span class='shrink-0 text-xs text-slate-400 font-medium whitespace-nowrap'>
                            {notification.time}
                        </span>
                    </div>
                    <p class='text-sm text-slate-500 leading-relaxed max-w-3xl'>
                        {notification.message}
                    </p>
                </div>

                <!-- Action -->
                <button class='absolute right-4 top-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-sm opacity-0 group-hover:opacity-100 transition-all cursor-pointer'>
                    <Trash2 class='h-4 w-4' />
                </button>
            </div>
        {/each}

        {#if filtered.length === 0}
            <div class='flex flex-col items-center justify-center p-12 text-center border border-dashed border-slate-200 rounded-sm bg-slate-50'>
                <Info class='h-8 w-8 text-slate-400 mb-3' />
                <h3 class='text-sm font-medium text-slate-900'>You're all caught up!</h3>
                <p class='text-sm text-slate-500 mt-1'>No notifications found in this view.</p>
            </div>
        {/if}
    </div>
</div>
