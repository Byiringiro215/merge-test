<script lang='ts'>
    let {
        label,
        value = $bindable(),
        placeholder,
        type = 'text',
        required = false,
        icon: Icon,
        class: className = '',
    }: {
        label: string;
        value: string;
        placeholder?: string;
        type?: string;
        required?: boolean;
        icon?: any;
        class?: string;
    } = $props();
</script>

<label class='flex flex-col space-y-2.5 {className}'>
    <span class='text-xs font-medium text-slate-700'>
        {label} {#if required}<span class='text-red-500'>*</span>{/if}
    </span>
    <div class='relative'>
        <input
            {type}
            bind:value
            class='w-full rounded-sm border border-slate-200 px-3 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20'
            {placeholder}
        />
        {#if Icon}
            <Icon class='pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
        {/if}
    </div>
</label>
