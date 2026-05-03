import { getContext, setContext } from 'svelte';

export type SimulatedRole = 'applicant' | 'evaluator' | 'curriculum-evaluator' | 'super-admin' | 'supervisor' | 'merged';

class SimulationState {
    role = $state<SimulatedRole>('merged');

    setRole(newRole: SimulatedRole) {
        this.role = newRole;
    }
}

const SIMULATION_KEY = Symbol('simulation');

export function setSimulationState() {
    return setContext(SIMULATION_KEY, new SimulationState());
}

export function getSimulationState() {
    return getContext<SimulationState>(SIMULATION_KEY);
}
