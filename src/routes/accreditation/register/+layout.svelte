<script lang='ts'>
    import { page } from '$app/state';
    import {
        ArrowLeft,
        User,
    } from '@lucide/svelte';

    interface Step {
        id: number;
        title: string;
        description: string;
        icon: any;
        path: string;
    }

    const steps: Step[] = [
        {
            id: 1,
            title: 'Identity Verification',
            description: 'Verify your identity.',
            icon: User,
            path: '/accreditation/register/user',
        },
    ];

    const { children } = $props();

    const currentPath = $derived(page.url.pathname);
    const activeStep = $derived(steps.find(s => s.path === currentPath) || steps[0]);
</script>

<style>
    :global(.no-scrollbar::-webkit-scrollbar) {
        display: none !important;
    }
    :global(.no-scrollbar) {
        -ms-overflow-style: none !important;
        scrollbar-width: none !important;
    }
</style>

<main class='flex min-h-screen bg-white'>
    <!-- Left Sidebar: Progress Stepper -->
    <aside
        class='fixed bottom-0 left-0 top-0 z-20 hidden w-[340px] overflow-y-auto border-r border-slate-200 bg-[#EDF1F5] pb-4 pl-8 pr-8 pt-8 lg:flex lg:flex-col lg:justify-between'
    >
        <div class='space-y-10'>
            <div class='space-y-6'>
                <div class='flex items-center gap-3'>
                    <img
                        src='/rtb-logo.png'
                        alt='RTB Logo'
                        class='h-9 w-auto object-contain mix-blend-multiply'
                    />
                    <div class='flex flex-col'>
                        <span class='text-[15px] font-medium leading-tight text-slate-700'>RTB</span>

                    </div>
                </div>
                <a
                    href='/signin'
                    class='inline-flex items-center gap-1.5 text-xs font-medium text-[#205FAD] transition-colors duration-300 hover:text-blue-700'
                >
                    <ArrowLeft size={14} class='h-3.5 w-3.5' /> Go back
                </a>
            </div>

            <div class='space-y-1'>
                {#each steps as step, i (step.id)}
                    {@const isActive = activeStep.id === step.id}
                    {@const Icon = step.icon}
                    <div class='flex items-center gap-3'>
                        <div class='flex flex-col items-center'>
                            <span
                                class='flex h-9 w-9 items-center justify-center rounded-md border transition-all duration-300 {isActive
                                    ? 'border-slate-200 bg-white text-slate-800'
                                    : 'border-transparent text-slate-400'}'
                            >
                                <Icon
                                    class='h-4 w-4 stroke-[1.5]'
                                    aria-hidden='true'
                                />
                            </span>
                            {#if i < steps.length - 1}
                                <span class='my-1.5 h-6 w-px border-dotted border-l-[1.5px] border-slate-200'></span>
                            {/if}
                        </div>
                        <div class='pt-2'>
                            <p class='text-sm font-medium transition-colors {isActive ? 'text-slate-800' : 'text-slate-400'}'>
                                {step.title}
                            </p>
                            <p class='mt-0.5 max-w-[190px] text-xs leading-relaxed transition-colors {isActive ? 'text-slate-500' : 'text-slate-300'}'>
                                {step.description}
                            </p>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
        <div class='mt-12 text-xs font-medium text-slate-400'>
            © RTB 2026
        </div>
    </aside>

    <!-- Right Side: Content Area -->
    <section class='no-scrollbar relative flex min-h-screen flex-1 flex-col bg-white lg:ml-[340px]'>
        <!-- Radial Dot Pattern Background -->
        <div
            class='absolute inset-x-0 top-0 -z-10 h-[60vh]'
            style='background-image: radial-gradient(circle, rgb(203, 213, 225) 1px, transparent 1px); background-size: 24px 24px; mask-image: radial-gradient(80% 70% at 50% 0%, black 40%, transparent 100%);'
        ></div>

        <div class='no-scrollbar relative flex flex-1 items-center justify-center overflow-y-auto px-4 py-12'>
            <div class='z-10 w-full max-w-[420px] bg-transparent'>
                {@render children()}
            </div>
        </div>
    </section>
</main>
