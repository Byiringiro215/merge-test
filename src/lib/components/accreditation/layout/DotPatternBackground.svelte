<script lang='ts'>
    const { children } = $props();
</script>

<div class='relative'>
    <div
        class='absolute inset-x-0 top-0 -z-10 h-[60vh]'
        style='background-image: radial-gradient(circle, #cbd5e1 1px, transparent 1px); background-size: 24px 24px; mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%); -webkit-mask-image: radial-gradient(ellipse 80% 70% at 50% 0%, black 40%, transparent 100%);'
    ></div>
    {#if children}
        {@render children()}
    {/if}
</div>
