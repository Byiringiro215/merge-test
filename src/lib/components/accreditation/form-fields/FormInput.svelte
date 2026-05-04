<script lang='ts'>
    import type { Component } from 'svelte';
    import { cn } from '$lib/components/accreditation/utils/cn';

    interface Props {
        label: string;
        value: string;
        onChange: (v: string) => void;
        placeholder?: string;
        type?: string;
        required?: boolean;
        icon?: Component;
        class?: string;
    }

    const {
        label,
        value,
        onChange,
        placeholder = '',
        type = 'text',
        required = false,
        icon: Icon,
        class: className = '',
    }: Props = $props();
</script>

<div class={cn('flex flex-col space-y-2.5', className)}>
    <span class='text-xs font-medium text-slate-700'>
        {label}{#if required}<span class='text-red-500'> *</span>{/if}
    </span>
    <div class='relative'>
        <input
            {type}
            {value}
            {placeholder}
            oninput={e => onChange(e.currentTarget.value)}
            class='w-full rounded-sm border border-slate-200 px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-[#2069C1] focus:ring-1 focus:ring-[#2069C1]/20 placeholder:text-slate-400'
        />
        {#if Icon}
            <Icon class='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none' />
        {/if}
    </div>
</div>
