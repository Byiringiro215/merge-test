<script lang='ts'>
    import { AlertTriangle, CheckCheck, ClipboardClock, NotepadText } from '@lucide/svelte';
    import { getMockStatsByRole } from '$lib/accreditation/utils/application-utils';
    import ApplicationsByTradeChart from './ApplicationsByTradeChart.svelte';
    import DashboardEmptyState from './DashboardEmptyState.svelte';
    import MostRequestedModules from './MostRequestedModules.svelte';
    import RecentApplicationsTable from './RecentApplicationsTable.svelte';
    import StackedAnalyticsChart from './StackedAnalyticsChart.svelte';
    import StatsGrid from './StatsGrid.svelte';

    const { role, userName } = $props<{ role: string; userName?: string }>();

    // Icon mapping for stats
    const iconMap: Record<string, any> = {
        NotepadText,
        ClipboardClock,
        CheckCheck,
        AlertTriangle,
    };

    // Dynamic stats based on role
    const stats = $derived(getMockStatsByRole(role).map(s => ({
        ...s,
        icon: iconMap[s.icon] || NotepadText
    })));

    const chartData = {
        '12 Months': [
            { label: 'Jan', rejected: 6, approved: 5, pending: 4 },
            { label: 'Feb', rejected: 8, approved: 6, pending: 5 },
            { label: 'Mar', rejected: 4, approved: 4, pending: 3 },
            { label: 'Apr', rejected: 6, approved: 6, pending: 6 },
            { label: 'May', rejected: 4, approved: 4, pending: 3 },
            { label: 'Jun', rejected: 7, approved: 6, pending: 5 },
            { label: 'Jul', rejected: 6, approved: 5, pending: 6 },
            { label: 'Aug', rejected: 6, approved: 6, pending: 6 },
            { label: 'Sep', rejected: 6, approved: 5, pending: 6 },
            { label: 'Oct', rejected: 6, approved: 6, pending: 5 },
            { label: 'Nov', rejected: 7, approved: 5, pending: 5 },
            { label: 'Dec', rejected: 7, approved: 7, pending: 5 },
        ],
        '30 Days': Array.from({ length: 30 }, (_, i) => ({
            label: `${i + 1}`,
            rejected: Math.floor(Math.random() * 5) + 2,
            approved: Math.floor(Math.random() * 6) + 3,
            pending: Math.floor(Math.random() * 4) + 2,
        })),
        '7 Days': [
            { label: 'Mon', rejected: 2, approved: 2, pending: 1 },
            { label: 'Tue', rejected: 3, approved: 1, pending: 3 },
            { label: 'Wed', rejected: 2, approved: 4, pending: 2 },
            { label: 'Thu', rejected: 4, approved: 2, pending: 2 },
            { label: 'Fri', rejected: 5, approved: 3, pending: 1 },
            { label: 'Sat', rejected: 1, approved: 1, pending: 1 },
            { label: 'Sun', rejected: 1, approved: 0, pending: 1 },
        ],
        '24 Hours': Array.from({ length: 24 }, (_, i) => ({
            label: `${String(i).padStart(2, '0')}h`,
            rejected: Math.floor(Math.random() * 3) + 1,
            approved: Math.floor(Math.random() * 4) + 1,
            pending: Math.floor(Math.random() * 2) + 1,
        })),
    };
</script>

<div class='space-y-6'>
    <div class='mb-4'>
        <h2 class='text-2xl font-bold text-slate-900'>Welcome back, {userName || 'User'}!</h2>
        <p class='text-sm text-slate-500'>Here's what's happening with your accreditation requests today.</p>
    </div>

    <StatsGrid items={stats} />

    {#if role === 'applicant' || role === 'merged'}
        <DashboardEmptyState />
    {/if}

    {#if role === 'merged' || role === 'super-admin' || role === 'supervisor' || role === 'evaluator'}
        <StackedAnalyticsChart data={chartData} />
    {/if}

    {#if role === 'merged' || role === 'super-admin' || role === 'supervisor'}
        <div class='mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2'>
            <ApplicationsByTradeChart />
            <MostRequestedModules />
        </div>
    {/if}

    {#if role !== 'applicant'}
        <RecentApplicationsTable {role} />
    {/if}
</div>
