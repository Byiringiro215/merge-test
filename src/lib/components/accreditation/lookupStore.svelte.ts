// Simple shared state for institution lookup status
// Used by both OnboardingForm and OnboardingShell
let status = $state<'idle' | 'new' | 'existing'>('idle');

export const institutionLookupStore = {
    get value() { return status; },
    set(v: 'idle' | 'new' | 'existing') { status = v; },
};
