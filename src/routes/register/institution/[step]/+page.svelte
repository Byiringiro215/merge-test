<script lang='ts'>
    import type { OnboardingStepKey } from '$lib/components/accreditation/constants';
    import { goto } from '$app/navigation';
    import { page } from '$app/state';
    import { onboardingSteps } from '$lib/components/accreditation/constants';
    import OnboardingForm from '$lib/components/accreditation/OnboardingForm.svelte';
    import OnboardingShell from '$lib/components/accreditation/OnboardingShell.svelte';

    const step = $derived(page.params.step);
    const isValidStep = $derived(onboardingSteps.some(s => s.key === step));

    $effect(() => {
        if (step && !isValidStep) {
            goto('/register/institution/institution-details');
        }
    });
</script>

{#if isValidStep}
    <OnboardingShell currentStep={step!}>
        <OnboardingForm step={step as OnboardingStepKey} />
    </OnboardingShell>
{/if}
