<script lang='ts' module>
    import type { LegalRep } from './types_internal';

    // Module-level globals persist state across SvelteKit route navigations
    let globalFormData: Record<string, string> = {};
    let globalLegalReps: LegalRep[] = [];
    let globalAboutText: Record<string, string> = {};
    let globalProviderType: string = '';
</script>

<script lang='ts'>
    import { untrack } from 'svelte';
    import type { OnboardingStepKey } from './constants';
    import { goto } from '$app/navigation';
    import { onboardingSteps } from './constants';
    import { institutionLookupStore } from './lookupStore.svelte';
    import AboutInstitutionStep from './steps/AboutInstitutionStep.svelte';
    import AddressInformationStep from './steps/AddressInformationStep.svelte';
    import InstitutionDetailsStep from './steps/InstitutionDetailsStep.svelte';
    import InstitutionTypeStep from './steps/InstitutionTypeStep.svelte';
    import LegalRepresentativesStep from './steps/LegalRepresentativesStep.svelte';
    import ReviewStep from './steps/ReviewStep.svelte';

    interface Props {
        step: OnboardingStepKey;
    }

    const { step }: Props = $props();

    // Form state initialised from module-level globals
    let formData = $state<Record<string, string>>({ ...globalFormData });
    let legalReps = $state<LegalRep[]>([...globalLegalReps]);
    let aboutText = $state<Record<string, string>>({ ...globalAboutText });
    let providerType = $state<string>(globalProviderType);

    // Default values for combined lookup as requested
    $effect(() => {
        if (providerType && providerType !== 'School') {
            untrack(() => {
                if (!formData.representativeId)
                    formData.representativeId = '22222222222222222';
                if (!formData.lookupEmail)
                    formData.lookupEmail = 'owner@example.com';
            });
        }
    });

    // Sync state back to module-level globals so data persists when component unmounts
    $effect(() => {
        globalFormData = formData;
    });
    $effect(() => {
        globalLegalReps = [...legalReps];
    });
    $effect(() => {
        globalAboutText = { ...aboutText };
    });
    $effect(() => {
        globalProviderType = providerType;
    });

    const config = $derived(onboardingSteps.find(s => s.key === step));
    const currentStepIndex = $derived(onboardingSteps.findIndex(s => s.key === step));
    const nextStep = $derived(onboardingSteps[currentStepIndex + 1]);
    const previousStep = $derived(onboardingSteps[currentStepIndex - 1]);
    const isLastStep = $derived(!nextStep);

    const showSecondaryBtn = $derived(!!previousStep);

    const isStepComplete = $derived(
        step === 'institution-type'
            ? !!providerType
            : step === 'institution-details'
            ? institutionLookupStore.value === 'existing'
                || (institutionLookupStore.value === 'new'
                    && !!formData['Name of Institution']
                    && !!formData.Email
                    && !!formData['Phone Number'])
            : step === 'address-information'
            ? ['Province', 'District', 'Sector', 'Cell', 'Village'].every(f => !!formData[f])
            : step === 'about-the-institution'
            ? (config?.fields ?? []).every(f => !!aboutText[f])
            : step === 'legal-representatives'
            ? legalReps.length > 0
            : true,
    );

    const secondaryBtnLabel = 'Back';

    const primaryBtnLabel = $derived(
        step === 'institution-type'
            ? 'Continue'
            : step === 'institution-details' && institutionLookupStore.value === 'existing'
            ? 'Continue to Dashboard'
            : isLastStep
            ? 'Confirm & Save Institution'
            : 'Save & Continue',
    );

    function handlePrimaryAction() {
        if (step === 'institution-details' && institutionLookupStore.value === 'existing') {
            goto('/dashboard');
        }
        else if (isLastStep) {
            goto('/dashboard');
        }
        else {
            goto(`/register/institution/${nextStep.key}`);
        }
    }

    function handleSecondaryAction() {
        if (previousStep) {
            goto(`/register/institution/${previousStep.key}`);
        }
    }
</script>

{#if config}
    <div class='space-y-8'>
        <!-- Step header -->
        <div class='space-y-3 text-center'>
            <div class='mx-auto flex h-14 w-14 items-center justify-center rounded-sm border border-slate-200 text-[#2069C1] font-semibold text-lg'>
                {currentStepIndex + 1}
            </div>
            <div>
                <h1 class='text-2xl font-semibold text-slate-900'>{config.title}</h1>
                <p class='mt-2 text-sm text-slate-500'>{config.description}</p>
            </div>
        </div>

        <!-- Step content -->
        <div class='pt-2'>
            {#if step === 'institution-type'}
                <InstitutionTypeStep
                    selected={providerType}
                    onSelect={v => (providerType = v)}
                />
            {:else if step === 'institution-details'}
                <InstitutionDetailsStep
                    {providerType}
                    {formData}
                    setFormData={d => (formData = d)}
                    onLookup={(s) => { institutionLookupStore.set(s === 'new' ? 'new' : s === 'existing' ? 'existing' : 'idle'); }}
                />
            {:else if step === 'address-information'}
                <AddressInformationStep
                    {formData}
                    setFormData={d => (formData = d)}
                />
            {:else if step === 'legal-representatives'}
                <LegalRepresentativesStep
                    {legalReps}
                    setLegalReps={r => (legalReps = r)}
                />
            {:else if step === 'about-the-institution'}
                <AboutInstitutionStep
                    fields={config.fields}
                    {aboutText}
                    setAboutText={t => (aboutText = t)}
                />
            {:else if step === 'review-application'}
                <ReviewStep
                    {providerType}
                    {formData}
                    {legalReps}
                    {aboutText}
                />
            {/if}
        </div>

        <!-- Navigation buttons -->
        <div class='flex flex-col-reverse sm:flex-row items-center gap-4 pt-4'>
            {#if showSecondaryBtn}
                <button
                    type='button'
                    onclick={handleSecondaryAction}
                    class='flex w-full sm:w-1/3 items-center justify-center rounded-sm border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 cursor-pointer'
                >
                    {secondaryBtnLabel}
                </button>
            {/if}
            <button
                type='button'
                onclick={handlePrimaryAction}
                disabled={!isStepComplete}
                class={`flex ${showSecondaryBtn ? 'w-full sm:w-2/3' : 'w-full'} items-center justify-center rounded-sm bg-[#2069C1] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1a56a0] focus:ring-4 focus:ring-[#2069C1]/20 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#2069C1]`}
            >
                {primaryBtnLabel}
            </button>
        </div>

    </div>
{/if}
