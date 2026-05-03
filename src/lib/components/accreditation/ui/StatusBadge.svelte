<script lang='ts'>
    import { cn } from '$lib/accreditation/utils/cn';
    import { CheckCheck, Clock, TriangleAlert, X } from '@lucide/svelte';

    export type StatusType
        = 'Pending'
            | 'Approved'
            | 'Rejected'
            | 'Active'
            | 'Deactivated'
            | 'Completed'
            | 'Cancelled'
            | 'Expired'
            | 'Expiring Soon';

    const { status }: { status: StatusType } = $props();

    const configs = {
        'Pending': {
            label: 'Pending',
            text: 'text-[#3538CD]',
            border: 'border-[#C7D7FE]',
            dot: 'bg-[#6155F5]',
            icon: Clock,
        },
        'Active': {
            label: 'Active',
            text: 'text-[#027A48]',
            border: 'border-[#ABEFC6]',
            dot: 'bg-[#34C759]',
            icon: CheckCheck,
        },
        'Approved': {
            label: 'Approved',
            text: 'text-[#027A48]',
            border: 'border-[#ABEFC6]',
            dot: 'bg-[#12B76A]',
            icon: CheckCheck,
        },
        'Deactivated': {
            label: 'Deactivated',
            text: 'text-[#B42318]',
            border: 'border-[#FECDCA]',
            dot: 'bg-[#F04438]',
            icon: X,
        },
        'Rejected': {
            label: 'Rejected',
            text: 'text-[#B42318]',
            border: 'border-[#FECDCA]',
            dot: 'bg-[#F04438]',
            icon: X,
        },
        'Completed': {
            label: 'Completed',
            text: 'text-[#027A48]',
            border: 'border-[#ABEFC6]',
            dot: 'bg-[#12B76A]',
            icon: CheckCheck,
        },
        'Cancelled': {
            label: 'Cancelled',
            text: 'text-[#667085]',
            border: 'border-[#EAECF0]',
            dot: 'bg-[#667085]',
            icon: X,
        },
        'Expired': {
            label: 'Expired',
            text: 'text-[#B42318]',
            border: 'border-[#FECDCA]',
            dot: 'bg-[#F04438]',
            icon: X,
        },
        'Expiring Soon': {
            label: 'Expiring Soon',
            text: 'text-[#B54708]',
            border: 'border-[#FEDF89]',
            dot: 'bg-[#F79009]',
            icon: TriangleAlert,
        },
    };

    const config = $derived(configs[status] || configs.Pending);
</script>

<div
    class={cn(
        'inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-[11px] font-bold leading-none uppercase tracking-wide',
        config.text,
        config.border,
        'bg-white',
    )}
>
    <config.icon size={12} strokeWidth={2.5} />
    {config.label}
</div>
