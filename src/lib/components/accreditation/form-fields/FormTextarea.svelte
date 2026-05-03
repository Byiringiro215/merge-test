<script lang='ts'>
    import { cn } from '$lib/components/accreditation/utils/cn';

    interface Props {
        label: string;
        value: string;
        onChange: (v: string) => void;
        maxLength?: number;
        rows?: number;
        placeholder?: string;
        class?: string;
    }

    const {
        label,
        value,
        onChange,
        maxLength = 275,
        rows = 4,
        placeholder = '',
        class: className = '',
    }: Props = $props();

    const currentLen = $derived(value.length);
    const remaining = $derived(maxLength - currentLen);
</script>

<div class={cn('flex flex-col space-y-3', className)}>
    <span class='text-[14px] text-slate-700'>{label}</span>
    <textarea
        {rows}
        maxlength={maxLength}
        {value}
        {placeholder}
        oninput={e => onChange(e.currentTarget.value)}
        class='w-full resize-none rounded-md border border-slate-200 p-4 text-[13.5px] text-slate-600 outline-none transition focus:border-[#336cb2] focus:ring-1 focus:ring-[#336cb2]/20 placeholder:text-slate-500/70'
    ></textarea>
    <div class='flex justify-between items-center pr-1'>
        <span
            class={cn(
                'text-[12.5px] transition-colors',
                remaining === 0
                    ? 'text-red-500 font-medium'
                    : remaining <= 30
                    ? 'text-orange-500'
                    : 'text-slate-400',
            )}
        >
            {remaining} character{remaining === 1 ? '' : 's'} left
        </span>
        {#if currentLen > 0}
            <span class='text-[12px] font-medium text-slate-300'>
                {currentLen} / {maxLength}
            </span>
        {/if}
    </div>
</div>
