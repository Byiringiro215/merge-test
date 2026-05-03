<script lang='ts'>
    import { ChevronDown } from '@lucide/svelte';

    let {
        label,
        value = $bindable(),
        options,
        placeholder = 'Select ...',
        required = false,
        class: className = '',
    }: {
        label: string;
        value: string;
        options: { label: string; value: string }[];
        placeholder?: string;
        required?: boolean;
        class?: string;
    } = $props();
</script>

<label class='flex flex-col space-y-2.5 {className}'>
    <span class='text-xs font-medium text-slate-700'>
        {label} {#if required}<span class='text-red-500'>*</span>{/if}
    </span>
    <div class='relative'>
        <select
            bind:value
            class='w-full appearance-none rounded-sm border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 {!value ? 'text-slate-400' : 'text-slate-600'}'
        >
            <option value='' disabled selected>
                {placeholder}
            </option>
            {#each options as opt}
                <option value={opt.value}>
                    {opt.label}
                </option>
            {/each}
        </select>
        <ChevronDown class='pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
    </div>
</label>
