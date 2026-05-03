<script lang='ts'>
    const { type, class: className } = $props<{ type: 'PDF' | 'MP4' | 'FIG' | 'IMG' | string; class?: string }>();

    const TYPE_CONFIGS: Record<string, { color: string }> = {
        PDF: { color: '#E1412E' },
        MP4: { color: '#1560DA' },
        FIG: { color: '#845ADF' },
        IMG: { color: '#16A34A' },
    };

    const config = $derived(TYPE_CONFIGS[type] || { color: '#667085' });
</script>

<div class={className || 'relative h-10 w-8 shrink-0'}>
    <svg viewBox='0 0 32 40' fill='none' xmlns='http://www.w3.org/2000/svg' class='h-full w-full'>
        <path
            d='M0 4C0 1.79086 1.79086 0 4 0H22L32 10V36C32 38.2091 30.2091 40 28 40H4C1.79086 40 0 38.2091 0 36V4Z'
            fill={config.color}
        />
        <path
            d='M22 0L32 10H26C23.7909 10 22 8.20914 22 6V0Z'
            fill='white'
            fill-opacity='0.3'
        />
        <text
            x='16'
            y='30'
            fill='white'
            font-size='7'
            font-weight='900'
            text-anchor='middle'
            class='select-none'
            style='font-family: Inter, sans-serif'
        >
            {type}
        </text>
    </svg>
</div>
