<script lang='ts'>
    import { cn } from '$lib/accreditation/utils/cn';
    import PageContainer from '$lib/components/accreditation/layout/PageContainer.svelte';
    import { Bell, Save, Shield, Upload, User } from '@lucide/svelte';

    let activeTab = $state('personal');
    const userName = 'Jean-Claude Murama';
    const userEmail = 'jc.murama@polytechnic.ac.rw';

    const defaultUserName = userName;
    const defaultUserEmail = userEmail;
</script>

<PageContainer
    title='Institution Profile'
    description="Manage your institution's profile and account settings."
>
    <div class='flex flex-col md:flex-row gap-8 w-full h-full min-h-0 max-w-6xl'>
        <!-- Sidebar Navigation -->
        <div class='w-full md:w-64 shrink-0 space-y-1'>
            <button
                onclick={() => activeTab = 'personal'}
                class={cn(
                    'w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-sm transition-colors',
                    activeTab === 'personal' ? 'bg-[#F9FAFB] text-[#0A77FF]' : 'text-[#353E49] hover:bg-slate-50',
                )}
            >
                <User class='h-4 w-4' />
                <span>Personal Information</span>
            </button>
            <button
                onclick={() => activeTab = 'security'}
                class={cn(
                    'w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-sm transition-colors',
                    activeTab === 'security' ? 'bg-[#F9FAFB] text-[#0A77FF]' : 'text-[#353E49] hover:bg-slate-50',
                )}
            >
                <Shield class='h-4 w-4' />
                <span>Security & Password</span>
            </button>
            <button
                onclick={() => activeTab = 'notifications'}
                class={cn(
                    'w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-sm transition-colors',
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
                    <div class='pb-4 border-b border-slate-100 flex items-center gap-6'>
                        <div class='h-20 w-20 rounded-sm bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center relative group'>
                            <User class='h-8 w-8 text-slate-400' />
                            <div class='absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer'>
                                <Upload class='h-4 w-4 text-white mb-1' />
                                <span class='text-[10px] font-medium text-white'>Upload</span>
                            </div>
                        </div>
                        <div>
                            <h3 class='text-sm font-medium text-slate-900'>Profile Picture</h3>
                            <p class='text-xs text-slate-500 mt-1 max-w-sm'>
                                Upload a high-resolution image to represent your account. Recommended size: 256x256px.
                            </p>
                        </div>
                    </div>

                    <div class='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div class='space-y-1.5'>
                            <label for='profile-name' class='text-xs text-[#344054] font-medium'>Full Name</label>
                            <input
                                id='profile-name'
                                type='text'
                                value={defaultUserName}
                                class='w-full h-10 px-3 text-sm text-[#101828] border border-[#D0D5DD] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#0A77FF] focus:border-[#0A77FF] transition-all bg-white'
                            />
                        </div>
                        <div class='space-y-1.5'>
                            <label for='profile-email' class='text-xs text-[#344054] font-medium'>Email Address</label>
                            <input
                                id='profile-email'
                                type='email'
                                value={defaultUserEmail}
                                class='w-full h-10 px-3 text-sm text-[#101828] border border-[#D0D5DD] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#0A77FF] focus:border-[#0A77FF] transition-all bg-slate-50'
                                readonly
                            />
                        </div>
                        <div class='space-y-1.5'>
                            <label for='profile-role' class='text-xs text-[#344054] font-medium'>Job Title / Role</label>
                            <input
                                id='profile-role'
                                type='text'
                                value='Applicant'
                                class='w-full h-10 px-3 text-sm text-[#101828] border border-[#D0D5DD] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#0A77FF] focus:border-[#0A77FF] transition-all bg-slate-50'
                                readonly
                            />
                        </div>
                        <div class='space-y-1.5'>
                            <label for='profile-phone' class='text-xs text-[#344054] font-medium'>Phone Number</label>
                            <input
                                id='profile-phone'
                                type='tel'
                                placeholder='+250 123 456 789'
                                class='w-full h-10 px-3 text-sm text-[#101828] border border-[#D0D5DD] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#0A77FF] focus:border-[#0A77FF] transition-all bg-white'
                            />
                        </div>
                    </div>

                    <div class='pt-6 flex justify-end'>
                        <button class='flex items-center gap-2 bg-[#0A77FF] hover:bg-blue-600 active:bg-blue-700 text-white px-5 py-2.5 rounded-sm text-sm font-medium transition-colors shadow-sm'>
                            <Save class='h-4 w-4' />
                            Save Changes
                        </button>
                    </div>
                </div>
            {:else if activeTab === 'security'}
                <div class='space-y-6'>
                    <div class='space-y-5 max-w-md'>
                        <div class='space-y-1.5'>
                            <label for='current-password' class='text-xs text-[#344054] font-medium'>Current Password</label>
                            <input
                                id='current-password'
                                type='password'
                                class='w-full h-10 px-3 text-sm text-[#101828] border border-[#D0D5DD] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#0A77FF] focus:border-[#0A77FF] transition-all bg-white'
                            />
                        </div>
                        <div class='space-y-1.5'>
                            <label for='new-password' class='text-xs text-[#344054] font-medium'>New Password</label>
                            <input
                                id='new-password'
                                type='password'
                                class='w-full h-10 px-3 text-sm text-[#101828] border border-[#D0D5DD] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#0A77FF] focus:border-[#0A77FF] transition-all bg-white'
                            />
                        </div>
                        <div class='space-y-1.5'>
                            <label for='confirm-password' class='text-xs text-[#344054] font-medium'>Confirm New Password</label>
                            <input
                                id='confirm-password'
                                type='password'
                                class='w-full h-10 px-3 text-sm text-[#101828] border border-[#D0D5DD] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#0A77FF] focus:border-[#0A77FF] transition-all bg-white'
                            />
                        </div>
                    </div>
                    <div class='pt-6 flex justify-start'>
                        <button class='flex items-center gap-2 bg-[#353E49] hover:bg-slate-800 text-white px-5 py-2.5 rounded-sm text-sm font-medium transition-colors'>
                            Update Security
                        </button>
                    </div>
                </div>
            {:else if activeTab === 'notifications'}
                <div class='space-y-6'>
                    <h3 class='text-sm font-medium text-slate-900 border-b border-slate-100 pb-4'>Email Preferences</h3>
                    <div class='space-y-4 max-w-xl'>
                        <label class='flex items-start gap-3 cursor-pointer'>
                            <input type='checkbox' class='mt-0.5 rounded-sm border-slate-300 text-[#0A77FF] focus:ring-[#0A77FF] bg-white h-4 w-4' checked />
                            <div>
                                <h4 class='text-sm font-medium text-slate-900'>Application Updates</h4>
                                <p class='text-xs text-slate-500 mt-0.5'>Receive an email whenever an institution submits or updates an application.</p>
                            </div>
                        </label>

                        <label class='flex items-start gap-3 cursor-pointer'>
                            <input type='checkbox' class='mt-0.5 rounded-sm border-slate-300 text-[#0A77FF] focus:ring-[#0A77FF] bg-white h-4 w-4' checked />
                            <div>
                                <h4 class='text-sm font-medium text-slate-900'>System Alerts</h4>
                                <p class='text-xs text-slate-500 mt-0.5'>Receive immediate notifications regarding maintenance and security events.</p>
                            </div>
                        </label>

                        <label class='flex items-start gap-3 cursor-pointer'>
                            <input type='checkbox' class='mt-0.5 rounded-sm border-slate-300 text-[#0A77FF] focus:ring-[#0A77FF] bg-white h-4 w-4' />
                            <div>
                                <h4 class='text-sm font-medium text-slate-900'>Weekly Summaries</h4>
                                <p class='text-xs text-slate-500 mt-0.5'>Receive a consolidated weekly digest of system activity and pending tasks.</p>
                            </div>
                        </label>
                    </div>
                </div>
            {/if}
        </div>
    </div>
</PageContainer>
