<script lang='ts'>
    import PageContainer from '$lib/components/accreditation/layout/PageContainer.svelte';
</script>

<PageContainer
    role='super-admin'
    title='Evaluator management'
    description='This route belongs exclusively to super admins for creating, editing, and reviewing evaluator records.'
>
    <div class='grid gap-6 xl:grid-cols-[0.9fr_1.1fr]'>
        <div class='rounded-md border border-dashed border-slate-200 p-12 text-center bg-white'>
            <h3 class='text-sm font-medium text-slate-900'>Evaluator editor</h3>
            <p class='text-sm text-slate-500 mt-1'>Use the evaluator-management feature module for forms, mutations, and evaluator-specific UI.</p>
        </div>
        <div class='rounded-md border border-dashed border-slate-200 p-12 text-center bg-white'>
            <h3 class='text-sm font-medium text-slate-900'>Evaluator roster</h3>
            <p class='text-sm text-slate-500 mt-1'>Reserve for list management, active state, specialization, and assignment load indicators.</p>
        </div>
    </div>
</PageContainer>
