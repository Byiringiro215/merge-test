<script lang='ts'>
    import PageContainer from '$lib/components/accreditation/layout/PageContainer.svelte';
    import { FileText } from '@lucide/svelte';
</script>

<PageContainer
    title='Migration in Progress'
    description='This page is currently being migrated from the Next.js implementation.'
>
    <div class='flex flex-col items-center justify-center py-20 text-center'>
        <div class='mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-400'>
            <FileText size={32} />
        </div>
        <h3 class='mb-2 text-lg font-semibold text-slate-900'>Coming Soon</h3>
        <p class='max-w-sm text-slate-500'>
            We are working hard to bring this feature to the Svelte version of RTB Accreditation.
        </p>
    </div>
</PageContainer>
