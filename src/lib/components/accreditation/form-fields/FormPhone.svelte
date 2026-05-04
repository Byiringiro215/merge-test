<script lang='ts'>
    import type { Component } from 'svelte';
    import { cn } from '$lib/components/accreditation/utils/cn';
    import ChevronDown from '@lucide/svelte/icons/chevron-down';

    interface Props {
        label: string;
        value: string;
        onChange: (v: string) => void;
        required?: boolean;
        icon?: Component;
        class?: string;
    }

    const {
        label,
        value,
        onChange,
        required = false,
        icon: Icon,
        class: className = '',
    }: Props = $props();
</script>

<div class={cn('flex flex-col space-y-2.5', className)}>
    <span class='text-xs font-medium text-slate-700'>
        {label}
        {#if required}<span class='text-red-500'>*</span>{/if}
    </span>
    <div class='relative flex rounded-sm border border-slate-200 bg-white transition focus-within:border-[#2069C1] focus-within:ring-1 focus-within:ring-[#2069C1]/20'>
        <div class='flex items-center justify-center border-r border-slate-200 px-3 text-sm text-slate-600 gap-1 cursor-pointer hover:bg-slate-50 transition-colors rounded-l-sm'>
            +250 <ChevronDown class='h-3.5 w-3.5 text-slate-400 ml-0.5' />
        </div>
        <input
            {value}
            oninput={e => onChange(e.currentTarget.value)}
            placeholder='XXX-XXX-XXX'
            class='flex-1 w-full bg-transparent px-3 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400'
        />
        {#if Icon}
            <div class='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none'>
                <Icon class='h-4 w-4 text-slate-400' />
            </div>
        {/if}
    </div>
</div>
