<script lang='ts'>
    import { mockCriteriaAttachments } from '$lib/accreditation/utils/criteria-utils';
    import DataTable from '$lib/components/accreditation/ui/DataTable.svelte';
    import FileIcon from '$lib/components/accreditation/ui/FileIcon.svelte';
    import FileListItem from '$lib/components/accreditation/ui/FileListItem.svelte';
    import FileUpload from '$lib/components/accreditation/ui/FileUpload.svelte';

    const { role = 'super-admin' } = $props<{ role?: string }>();

    interface CriteriaAttachment {
        id: string;
        name: string;
        size: string;
        type: string;
        dateUploaded: string;
        lastUpdated: string;
        uploadedBy: {
            name: string;
            email: string;
            avatar: string;
        };
    }

    const files = $state([
        { id: '1', name: 'Tech design requirements.pdf', size: '200 KB', progress: 100, type: 'PDF' },
        { id: '2', name: 'Dashboard prototype.mp4', size: '16 MB', progress: 70, type: 'MP4' },
        { id: '3', name: 'Dashboard prototype FINAL.fig', size: '4.2 MB', progress: 70, type: 'FIG' },
    ]);

    let search = $state('');
    const isReadOnly = $derived(role === 'supervisor' || role === 'evaluator');

    function handleFileSelect(_selectedFiles: FileList | null) {
    // File selection handler — integration pending
    }
</script>

{#snippet fileNameCell(item: CriteriaAttachment)}
    <div class='flex items-center gap-3 text-left'>
        <FileIcon type={item.type} class='h-10 w-8 shrink-0' />
        <div class='flex flex-col'>
            <span class='text-[13px] font-medium text-[#101828]'>{item.name}</span>
            <span class='text-[11px] text-[#475467]'>{item.size}</span>
        </div>
    </div>
{/snippet}

{#snippet fileSizeCell(item: CriteriaAttachment)}
    <span class='text-left text-[13px] text-[#475467]'>{item.size}</span>
{/snippet}

{#snippet dateUploadedCell(item: CriteriaAttachment)}
    <span class='text-left text-[13px] text-[#475467]'>{item.dateUploaded}</span>
{/snippet}

{#snippet lastUpdatedCell(item: CriteriaAttachment)}
    <span class='text-left text-[13px] text-[#475467]'>{item.lastUpdated}</span>
{/snippet}

{#snippet uploadedByCell(item: CriteriaAttachment)}
    <div class='flex items-center gap-2 text-left'>
        <div class='h-8 w-8 shrink-0 overflow-hidden rounded-full bg-slate-100'>
            <img src={item.uploadedBy.avatar} alt='avatar' class='h-full w-full object-cover' />
        </div>
        <div class='flex flex-col'>
            <span class='text-[13px] font-medium text-[#101828]'>{item.uploadedBy.name}</span>
            <span class='text-[11px] text-[#475467]'>{item.uploadedBy.email}</span>
        </div>
    </div>
{/snippet}

{#snippet actionCell()}
    <div class='flex items-center gap-4 text-left'>
        <button class='cursor-pointer text-[13px] font-medium text-[#475467] transition-colors hover:text-[#101828]'>Delete</button>
        <button class='cursor-pointer text-[13px] font-medium text-[#0A77FF] transition-colors hover:text-[#0966ff]'>Edit</button>
    </div>
{/snippet}

<div class='space-y-6'>
    {#if !isReadOnly}
        <FileUpload onFileSelect={handleFileSelect} />

        <div class='space-y-4'>
            {#each files as file}
                <FileListItem
                    name={file.name}
                    size={file.size}
                    progress={file.progress}
                    type={file.type}
                />
            {/each}
        </div>
    {/if}

    <div class='pt-4'>
        <DataTable
            title='Evaluation Criteria Attachments'
            description={isReadOnly ? 'View evaluation criteria files' : 'Files and assets that have been attached to this project.'}
            data={mockCriteriaAttachments}
            columns={[
                { header: 'File name', accessor: fileNameCell, sortable: true },
                { header: 'File size', accessor: fileSizeCell },
                { header: 'Date uploaded', accessor: dateUploadedCell },
                { header: 'Last updated', accessor: lastUpdatedCell },
                { header: 'Uploaded by', accessor: uploadedByCell },
                ...(isReadOnly ? [] : [{ header: 'Action', accessor: actionCell }]),
            ]}
            searchValue={search}
            onSearchChange={val => (search = val)}
            showPagination={true}
        />
    </div>
</div>
