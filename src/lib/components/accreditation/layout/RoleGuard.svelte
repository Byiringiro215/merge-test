<script lang='ts'>
    import type { SimulatedRole } from '$lib/accreditation/context/simulation.svelte';
    import { getSimulationState } from '$lib/accreditation/context/simulation.svelte';
    import { Lock } from '@lucide/svelte';

    const { allowedRoles, children } = $props<{
        allowedRoles: SimulatedRole[];
        children: any;
    }>();

    const simulation = getSimulationState();
    const activeRole = $derived(simulation?.role || 'merged');
    const isAuthorized = $derived(allowedRoles.includes(activeRole as SimulatedRole) || activeRole === 'merged');
</script>

{#if isAuthorized}
    {@render children()}
{:else}
    <div class='flex flex-col items-center justify-center py-20 text-center'>
        <div class='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600'>
            <Lock class='h-8 w-8' />
        </div>
        <h2 class='text-xl font-bold text-slate-900'>Access Denied</h2>
        <p class='mt-2 max-w-sm text-slate-500'>
            You do not have the required permissions to view this page. This feature is restricted to specific roles.
        </p>
        <button
            onclick={() => history.back()}
            class='mt-8 rounded-sm bg-[#2069C1] px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0864d6]'
        >
            Go Back
        </button>
    </div>
{/if}
