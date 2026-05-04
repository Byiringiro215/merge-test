<script lang='ts'>
    import { cn } from '$lib/components/accreditation/utils/cn';
    import ChevronDown from '@lucide/svelte/icons/chevron-down';

    interface SelectOption {
        label: string;
        value: string;
    }

    interface Props {
        label: string;
        value: string;
        onChange: (v: string) => void;
        options: SelectOption[];
        placeholder?: string;
        required?: boolean;
        class?: string;
    }

    const {
        label,
        value,
        onChange,
        options,
        placeholder = 'Select ...',
        required = false,
        class: className = '',
    }: Props = $props();
</script>

<div class={cn('flex flex-col space-y-2.5', className)}>
    <span class='text-xs font-medium text-slate-700'>
        {label}
        {#if required}<span class='text-red-500'>*</span>{/if}
    </span>
    <div class='relative'>
        <select
            {value}
            onchange={e => onChange(e.currentTarget.value)}
            class={cn(
                'w-full appearance-none rounded-sm border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-[#2069C1] focus:ring-1 focus:ring-[#2069C1]/20',
                !value ? 'text-slate-400' : 'text-slate-600',
            )}
        >
            <option value='' disabled>{placeholder}</option>
            {#each options as opt (opt.value)}
                <option value={opt.value}>{opt.label}</option>
            {/each}
        </select>
        <ChevronDown class='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none' />
    </div>
</div>
