<script lang='ts'>
    const { visible, className = '' }: { visible: boolean; className?: string } = $props();
</script>

<div
    class="
        pointer-events-none relative top-0 z-50 h-1 w-full overflow-hidden opacity-0
        transition-opacity duration-300 ease-in-out
        {className}
        horizontal-bar-container
        {visible ? 'pointer-events-auto opacity-100' : ''}
    "
>
    <div class='infinity-loading-bar'></div>
</div>

<style>
    @keyframes indeterminate_first {
        0% {
            left: -100%;
            width: 100%;
        }
        100% {
            left: 100%;
            width: 10%;
        }
    }

    @keyframes indeterminate_second {
        0% {
            left: -150%;
            width: 100%;
        }
        100% {
            left: 100%;
            width: 10%;
        }
    }
    .infinity-loading-bar {
        position: relative;
        width: 100%;
        height: 100%;
        --loader-primary-color: #1a237e;
    }

    .infinity-loading-bar::before {
        content: '';
        position: absolute;
        height: 100%;
        background-color: var(--loader-primary-color);
        animation: indeterminate_first 1.5s infinite ease-out;
    }

    .infinity-loading-bar::after {
        content: '';
        position: absolute;
        height: 100%;
        background-color: var(--loader-primary-color);
        animation: indeterminate_second 1.5s infinite ease-in;
    }

    @media screen and (max-width: 800px) {
        .horizontal-bar-container {
            position: fixed;
            right: 0;
        }
    }
</style>
