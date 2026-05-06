<script lang='ts'>
    import { getSimulationState } from '$lib/accreditation/context/simulation.svelte';
    import SharedProfileContainer from '$lib/accreditation/features/profile/components/SharedProfileContainer.svelte';
    import { getAuthState } from '$lib/auth/index.svelte';
    import PageContainer from '$lib/components/accreditation/layout/PageContainer.svelte';

    const simulation = getSimulationState();
    const auth = getAuthState();
    const role = $derived(simulation?.role || 'merged');
    const user = $derived(auth.user || { name: 'User', email: 'user@example.com' });
</script>

<PageContainer
    title='Profile Settings'
    description='Manage your account information and preferences.'
>
    <SharedProfileContainer {role} userName={user.name} userEmail={user.email} />
</PageContainer>
