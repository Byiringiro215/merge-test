<script lang='ts'>
    interface Props {
        active: boolean;
        emailVerified?: boolean;
    }

    const { active, emailVerified = true }: Props = $props();

    const status = $derived(
        !active ? 'disabled' : !emailVerified ? 'pending' : 'active',
    );

    const styles = {
        active: 'border-green-200 text-green-700',
        disabled: 'border-red-200 text-red-600',
        pending: 'border-yellow-200 text-yellow-600',
    } as const;

    const dots = {
        active: 'bg-green-500',
        disabled: 'bg-red-500',
        pending: 'bg-yellow-500',
    } as const;

    const labels = {
        active: 'Active',
        disabled: 'Disabled',
        pending: 'Pending',
    } as const;
</script>

<span
    class='inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium {styles[status]}'
>
    <span class='h-1.5 w-1.5 rounded-full {dots[status]}'></span>
    {labels[status]}
</span>
