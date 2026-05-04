<script lang='ts'>
    import type { Snippet } from 'svelte';
    import { ArrowLeft, Building, CheckCircle, ClipboardList, LayoutGrid, MapPin, User } from '@lucide/svelte';
    import { onboardingSteps } from './constants';
    import { institutionLookupStore } from './lookupStore.svelte';

    const stepIcons = [LayoutGrid, Building, MapPin, ClipboardList, User, CheckCircle];
    const ALWAYS_VISIBLE = 2;

    interface Props {
        currentStep: string;
        children: Snippet;
    }

    const { currentStep, children }: Props = $props();

    const currentStepIndex = $derived(onboardingSteps.findIndex(s => s.key === currentStep));
    const stepsUnlocked = $derived(institutionLookupStore.value === 'new');
</script>

<main class='flex min-h-screen bg-white'>
    <!-- Sidebar -->
    <aside class='fixed top-0 left-0 bottom-0 w-[340px] flex-col justify-between border-r border-slate-200 bg-[#f8fafc] px-8 pt-8 pb-4 z-10 overflow-y-auto no-scrollbar hidden lg:flex'>
        <div class='space-y-10'>
            <div class='space-y-6'>
                <div class='flex items-center gap-3'>
                    <img
                        src='/rtb-logo.png'
                        alt='RTB Logo'
                        class='h-9 w-auto object-contain'
                    />
                    <div class='flex flex-col'>
                        <span class='text-[15px] font-medium text-slate-700 leading-tight'>RTB</span>
                        <span class='text-[15px] text-slate-600 leading-tight'>Accreditation</span>
                    </div>
                </div>

                <a
                    href='/signin'
                    class='inline-flex items-center gap-1.5 text-xs font-medium text-[#336cb2] transition-colors hover:text-[#2a5a96]'
                >
                    <ArrowLeft class='h-3.5 w-3.5' /> Go back
                </a>
            </div>

            <div class='space-y-1'>
                {#each onboardingSteps as step, index (step.key)}
                    {@const isActive = step.key === currentStep}
                    {@const isComplete = currentStepIndex > index}
                    {@const isLocked = index >= ALWAYS_VISIBLE && !stepsUnlocked}
                    {@const Icon = stepIcons[index] ?? Building}
                    {#if !isLocked}
                        <div class='flex gap-3'>
                            <div class='flex flex-col items-center'>
                                <span
                                    class={`flex h-9 w-9 items-center justify-center rounded-sm border transition-colors ${
                                        isActive
                                            ? 'border-slate-200 bg-white text-slate-800'
                                            : isComplete
                                            ? 'border-transparent text-slate-400'
                                            : 'border-transparent text-slate-300'
                                    }`}
                                >
                                    <Icon class='h-4 w-4 stroke-[1.5]' />
                                </span>
                                {#if index < onboardingSteps.length - 1 && !isLocked}
                                    <span class='my-1.5 h-6 w-px border-l-[1.5px] border-dotted border-slate-200'></span>
                                {/if}
                            </div>
                            <div class='pt-2'>
                                <p class={`text-sm font-medium ${isActive ? 'text-slate-800' : 'text-slate-400'}`}>
                                    {step.title}
                                </p>
                                <p class={`mt-0.5 text-xs leading-relaxed max-w-[190px] ${isActive ? 'text-slate-500' : 'text-slate-300'}`}>
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    {/if}
                {/each}
            </div>
        </div>

        <div class='mt-12 text-xs text-slate-400 font-medium'>
            © RTB {new Date().getFullYear()}
        </div>
    </aside>

    <!-- Main content -->
    <section class='relative w-full h-full min-h-screen bg-white z-0 lg:ml-[340px]'>
        <!-- Dot pattern background -->
        <div
            class='fixed inset-x-0 lg:left-[340px] top-0 h-[260px] pointer-events-none'
            style='background-image: radial-gradient(circle, #cbd5e1 1px, transparent 1px); background-size: 24px 24px; -webkit-mask-image: radial-gradient(ellipse 100% 100% at center, black 20%, transparent 70%); mask-image: radial-gradient(ellipse 100% 100% at center, black 20%, transparent 70%);'
        >
        </div>
        <div class='flex min-h-screen items-center justify-center px-4 py-8 relative'>
            <div class='z-10 w-full max-w-[420px] pt-2'>
                {@render children()}
            </div>
        </div>
    </section>
</main>
