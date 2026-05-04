<script lang='ts'>
    import { FilePlus } from '@lucide/svelte';
    import PrimaryButton from '../ui/PrimaryButton.svelte';
</script>

<div class='-mt-6 flex flex-col items-center justify-center px-4 py-8 pt-0'>
    <!-- Concentric Circles Graphic -->
    <div
        class='relative mb-4 flex h-[160px] w-full max-w-[500px] items-center justify-center'
        style='mask-image: radial-gradient(circle, black 30%, transparent 80%); -webkit-mask-image: radial-gradient(circle, black 30%, transparent 80%);'
    >
        <!-- Outer Circles -->
        <div class='absolute h-[220px] w-[220px] rounded-full border border-slate-100/50'></div>
        <div class='absolute h-[165px] w-[165px] rounded-full border border-slate-100/60'></div>
        <div class='absolute h-[110px] w-[110px] rounded-full border border-slate-100/70'></div>
        <div class='absolute h-[55px] w-[55px] rounded-full border border-[#F2F4F7]'></div>

        <!-- Icon Container -->
        <div class='absolute bottom-0 z-10 flex h-14 w-14 items-center justify-center rounded-sm bg-white ring-1 ring-slate-200/60 transition-transform shadow-[0_8px_16px_-4px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] hover:scale-105'>
            <FilePlus class='h-6 w-6 text-slate-400' strokeWidth={1.5} />
        </div>
    </div>

    <!-- Text Content -->
    <div class='mx-auto mb-8 max-w-[440px] text-center'>
        <h3 class='mb-2 text-[17px] font-semibold text-slate-900'>
            No Applications Yet!
        </h3>
        <p class='text-sm leading-relaxed text-slate-500'>
            You haven't started any applications. Explore opportunities and
            begin your first application to track your progress here.
        </p>
    </div>

    <!-- Action Button -->
    <PrimaryButton
        label='Start Application'
        href='/accreditation/applicant/applications?new=true'
        class='px-8'
    />
</div>
