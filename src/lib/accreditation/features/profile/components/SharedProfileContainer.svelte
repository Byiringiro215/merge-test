<script lang='ts'>
    import { cn } from '$lib/accreditation/utils/cn';
    import FormInput from '$lib/components/accreditation/ui/FormInput.svelte';
    import { Bell, Save, Shield, Upload, User } from '@lucide/svelte';

    const {
        role,
        userName = 'User',
        userEmail = 'user@accreditation.gov.rw',
    }: {
        role: string;
        userName?: string;
        userEmail?: string;
    } = $props();

    let activeTab = $state('personal');

    const formData = $state({
        name: '',
        email: '',
        phone: '',
    });

    // Sync state with props reactively
    $effect(() => {
        formData.name = userName;
        formData.email = userEmail;
    });

    const jobTitle = $derived.by(() => {
        switch (role) {
            case 'super-admin':
                return 'Super Administrator';
            case 'supervisor':
                return 'Supervisor';
            case 'evaluator':
                return 'Evaluator';
            case 'curriculum-evaluator':
                return 'Curriculum Evaluator';
            default:
                return 'Applicant';
        }
    });
</script>

<div class='flex h-full min-h-0 flex-col gap-8 w-full md:flex-row'>
    <!-- Sidebar Navigation -->
    <div class='w-full shrink-0 space-y-1 md:w-64'>
        <button
            onclick={() => activeTab = 'personal'}
            class={cn(
                'w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-sm transition-colors cursor-pointer',
                activeTab === 'personal' ? 'bg-[#F9FAFB] text-[#0A77FF]' : 'text-[#353E49] hover:bg-slate-50',
            )}
        >
            <User class='h-4 w-4' />
            <span>Personal Information</span>
        </button>
        <button
            onclick={() => activeTab = 'security'}
            class={cn(
                'w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-sm transition-colors cursor-pointer',
                activeTab === 'security' ? 'bg-[#F9FAFB] text-[#0A77FF]' : 'text-[#353E49] hover:bg-slate-50',
            )}
        >
            <Shield class='h-4 w-4' />
            <span>Security & Password</span>
        </button>
        <button
            onclick={() => activeTab = 'notifications'}
            class={cn(
                'w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-sm transition-colors cursor-pointer',
                activeTab === 'notifications' ? 'bg-[#F9FAFB] text-[#0A77FF]' : 'text-[#353E49] hover:bg-slate-50',
            )}
        >
            <Bell class='h-4 w-4' />
            <span>Notification Preferences</span>
        </button>
    </div>

    <!-- Main Content Area -->
    <div class='flex-1 min-w-0 pb-10'>
        {#if activeTab === 'personal'}
            <div class='space-y-6'>
                <div class='flex items-center gap-6 border-b border-slate-100 pb-4'>
                    <div class='group relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-sm border border-slate-200 bg-slate-100'>
                        <User class='h-8 w-8 text-slate-400' />
                        <div class='absolute inset-0 flex cursor-pointer flex-col items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100'>
                            <Upload class='mb-1 h-4 w-4 text-white' />
                            <span class='text-[10px] font-medium text-white'>Upload</span>
                        </div>
                    </div>
                    <div>
                        <h3 class='text-sm font-medium text-slate-900'>Profile Picture</h3>
                        <p class='mt-1 max-w-sm text-xs text-slate-500'>
                            Upload a high-resolution image to represent your account. Recommended size: 256x256px.
                        </p>
                    </div>
                </div>

                <div class='grid grid-cols-1 gap-6 text-left md:grid-cols-2'>
                    <FormInput
                        label='Full Name'
                        bind:value={formData.name}
                        placeholder='Enter your full name'
                    />
                    <div class='space-y-1.5'>
                        <label for='email-address' class='text-xs font-medium text-[#344054]'>Email Address</label>
                        <input
                            id='email-address'
                            type='email'
                            value={formData.email}
                            class='h-10 w-full rounded-sm border border-[#D0D5DD] bg-slate-50 px-3 text-sm text-[#101828] transition-all focus:border-[#0A77FF] focus:ring-1 focus:ring-[#0A77FF] focus:outline-none'
                            readonly
                        />
                    </div>
                    <div class='space-y-1.5'>
                        <label for='job-title' class='text-xs font-medium text-[#344054]'>Job Title / Role</label>
                        <input
                            id='job-title'
                            type='text'
                            value={jobTitle}
                            class='h-10 w-full rounded-sm border border-[#D0D5DD] bg-slate-50 px-3 text-sm text-[#101828] transition-all focus:border-[#0A77FF] focus:ring-1 focus:ring-[#0A77FF] focus:outline-none'
                            readonly
                        />
                    </div>
                    <FormInput
                        label='Phone Number'
                        bind:value={formData.phone}
                        placeholder='+250 123 456 789'
                        type='tel'
                    />
                </div>

                <div class='flex justify-end pt-6'>
                    <button class='flex cursor-pointer items-center gap-2 rounded-sm bg-[#0A77FF] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-600 active:bg-blue-700'>
                        <Save class='h-4 w-4' />
                        Save Changes
                    </button>
                </div>
            </div>
        {:else if activeTab === 'security'}
            <div class='space-y-6 text-left'>
                <div class='max-w-md space-y-5'>
                    <div class='space-y-1.5'>
                        <label for='current-password' class='text-xs font-medium text-[#344054]'>Current Password</label>
                        <input
                            id='current-password'
                            type='password'
                            class='h-10 w-full rounded-sm border border-[#D0D5DD] bg-white px-3 text-sm text-[#101828] transition-all focus:border-[#0A77FF] focus:ring-1 focus:ring-[#0A77FF] focus:outline-none'
                        />
                    </div>
                    <div class='space-y-1.5'>
                        <label for='new-password' class='text-xs font-medium text-[#344054]'>New Password</label>
                        <input
                            id='new-password'
                            type='password'
                            class='h-10 w-full rounded-sm border border-[#D0D5DD] bg-white px-3 text-sm text-[#101828] transition-all focus:border-[#0A77FF] focus:ring-1 focus:ring-[#0A77FF] focus:outline-none'
                        />
                    </div>
                    <div class='space-y-1.5'>
                        <label for='confirm-password' class='text-xs font-medium text-[#344054]'>Confirm New Password</label>
                        <input
                            id='confirm-password'
                            type='password'
                            class='h-10 w-full rounded-sm border border-[#D0D5DD] bg-white px-3 text-sm text-[#101828] transition-all focus:border-[#0A77FF] focus:ring-1 focus:ring-[#0A77FF] focus:outline-none'
                        />
                    </div>
                </div>
                <div class='flex justify-start pt-6'>
                    <button class='flex cursor-pointer items-center gap-2 rounded-sm bg-[#353E49] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800'>
                        Update Security
                    </button>
                </div>
            </div>
        {:else if activeTab === 'notifications'}
            <div class='space-y-6 text-left'>
                <h3 class='border-b border-slate-100 pb-4 text-sm font-medium text-slate-900'>Email Preferences</h3>
                <div class='max-w-xl space-y-4'>
                    <label class='flex cursor-pointer items-start gap-3'>
                        <input type='checkbox' class='mt-0.5 h-4 w-4 rounded-sm border-slate-300 bg-white text-[#0A77FF] focus:ring-[#0A77FF]' checked />
                        <div>
                            <h4 class='text-sm font-medium text-slate-900'>Application Updates</h4>
                            <p class='mt-0.5 text-xs text-slate-500'>Receive an email whenever an institution submits or updates an application.</p>
                        </div>
                    </label>

                    <label class='flex cursor-pointer items-start gap-3'>
                        <input type='checkbox' class='mt-0.5 h-4 w-4 rounded-sm border-slate-300 bg-white text-[#0A77FF] focus:ring-[#0A77FF]' checked />
                        <div>
                            <h4 class='text-sm font-medium text-slate-900'>System Alerts</h4>
                            <p class='mt-0.5 text-xs text-slate-500'>Receive immediate notifications regarding maintenance and security events.</p>
                        </div>
                    </label>

                    <label class='flex cursor-pointer items-start gap-3'>
                        <input type='checkbox' class='mt-0.5 h-4 w-4 rounded-sm border-slate-300 bg-white text-[#0A77FF] focus:ring-[#0A77FF]' />
                        <div>
                            <h4 class='text-sm font-medium text-slate-900'>Weekly Summaries</h4>
                            <p class='mt-0.5 text-xs text-slate-500'>Receive a consolidated weekly digest of system activity and pending tasks.</p>
                        </div>
                    </label>
                </div>
            </div>
        {/if}
    </div>
</div>
