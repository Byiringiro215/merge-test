<script lang='ts'>
    import { goto } from '$app/navigation';
    import {
        ArrowRight,
        BookOpen,
        Building2,
        CheckCircle2,
        CreditCard,
        Eye,
        EyeOff,
        GraduationCap,
        Hash,
        Info,
        LoaderCircle,
        Lock,
        Mail,
        Phone,
        Search,
        UserCheck,
    } from '@lucide/svelte';
    import { fade, fly, slide } from 'svelte/transition';

    type ViewState = 'input' | 'searching' | 'registered' | 'confirm_email' | 'notifying' | 'create_password';
    type UserRole = 'student' | 'school_staff' | 'employer';

    let view = $state<ViewState>('input');
    let role = $state<UserRole | null>(null);
    let nationalId = $state('');
    let sdmsCode = $state('');
    let tinNumber = $state('');
    let errorMessage = $state('');

    // Form inputs for new user
    let email = $state('');
    let phone = $state('');
    let password = $state('');
    let confirmPassword = $state('');
    let showPassword = $state(false);

    const mockSdmsUsers = [
        {
            id: '1199012345678901',
            firstName: 'Jean',
            lastName: 'Ntaganda',
            email: 'j.ntaganda@sdms.gov.rw',
            status: 'unregistered',
        },
        {
            id: '1',
            firstName: 'Test',
            lastName: 'Staff',
            email: 't.staff@sdms.gov.rw',
            status: 'unregistered',
        },
        {
            id: '2',
            firstName: 'Marie',
            lastName: 'Uwase',
            email: 'm.uwase@sdms.gov.rw',
            status: 'registered',
        },
        {
            id: '3',
            firstName: 'Jean',
            lastName: 'Bosco',
            email: 'j.bosco@company.com',
            status: 'unregistered',
        },
    ];

    const mockInstitutions = [
        { tin: '1', name: 'RTB Training Center' },
        { tin: '2', name: 'Alpha Tech Solutions' },
        { tin: '3', name: 'Rwanda Polytechnic' },
    ];

    let fetchedUser = $state<typeof mockSdmsUsers[0] | null>(null);

    async function handleVerify() {
        errorMessage = '';

        if (role === 'student') {
            if (!sdmsCode || !password || !confirmPassword) {
                errorMessage = 'Please enter SDMS Code, Password and Confirm Password.';
                return;
            }
            if (password !== confirmPassword) {
                errorMessage = 'Passwords do not match.';
                return;
            }
        }
        else if (role === 'school_staff') {
            if (!nationalId) {
                errorMessage = 'Please enter your National ID Number.';
                return;
            }
        }
        else if (role === 'employer') {
            if (!nationalId || !tinNumber || !email || !phone) {
                errorMessage = 'Please enter your National ID, Company TIN, Email, and Phone.';
                return;
            }
        }

        view = 'searching';

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1200));

        if (role === 'student') {
            goto('/signin');
            return;
        }

        const user = mockSdmsUsers.find(u => u.id === nationalId);

        if (user) {
            fetchedUser = user;
            if (user.status === 'registered') {
                view = 'registered';
                return;
            }

            // Both School Staff and Employer should verify their SDMS email if they exist in SDMS
            if (role === 'school_staff' || role === 'employer') {
                // If it's an employer, we still need to check the TIN
                if (role === 'employer') {
                    const inst = mockInstitutions.find(i => i.tin === tinNumber);
                    if (!inst) {
                        view = 'input';
                        errorMessage = 'Company TIN not found in our records.';
                        return;
                    }
                }

                email = user.email;
                view = 'confirm_email';
            }
            else {
                // For other roles, proceed toNotify
                view = 'notifying';
                await new Promise(resolve => setTimeout(resolve, 1500));
                view = 'create_password';
            }
        }
        else {
            // User not in SDMS
            if (role === 'employer') {
                const inst = mockInstitutions.find(i => i.tin === tinNumber);
                if (!inst) {
                    view = 'input';
                    errorMessage = 'No record found for this National ID or Company TIN.';
                    return;
                }
                // Employer exists as an organization but user is not in SDMS yet
                // Use the email/phone they provided in the input
                view = 'notifying';
                await new Promise(resolve => setTimeout(resolve, 2000));
                view = 'create_password';
            }
            else {
                view = 'input';
                errorMessage = 'No record found for this National ID. Please ensure it is correct.';
            }
        }
    }

    async function handleSendVerification() {
        errorMessage = '';
        view = 'notifying';

        // Simulate sending email
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulate clicking link in email (automatic transition for demo)
        view = 'create_password';
    }

    function handleCreatePassword() {
        if (password.length < 6) {
            errorMessage = 'Password must be at least 6 characters.';
            return;
        }
        if (password !== confirmPassword) {
            errorMessage = 'Passwords do not match.';
            return;
        }

        // Simulate final registration success
        goto('/signin');
    }

    function reset() {
        view = 'input';
        role = null;
        nationalId = '';
        sdmsCode = '';
        tinNumber = '';
        email = '';
        phone = '';
        password = '';
        confirmPassword = '';
        fetchedUser = null;
        errorMessage = '';
    }
</script>

<div class='font-inter'>
    {#if view === 'input' || view === 'searching'}
        <div in:fly={{ y: 20, duration: 400 }} out:fade={{ duration: 200 }} class='space-y-8'>
            {#if !role}
                <!-- Role Selection Step -->
                <div class='space-y-6 text-center'>
                    <div>
                        <h1 class='text-2xl font-semibold text-slate-900'>Select Your Role</h1>
                        <p class='mt-2 text-sm text-slate-500'>
                            Choose the role that best describes your affiliation with RTB.
                        </p>
                    </div>

                    <div class='grid grid-cols-1 gap-3 pt-4'>
                        {#each [
                            { id: 'student', label: 'Student', icon: GraduationCap, desc: 'For students enrolled in SDMS.' },
                            { id: 'school_staff', label: 'School Staff', icon: BookOpen, desc: 'For educators and school staff within the SDMS.' },
                            { id: 'employer', label: 'Employee/Employer', icon: Building2, desc: 'For staff and representatives of partner institutions.' },
                        ] as r}
                            <button
                                onclick={() => role = r.id as UserRole}
                                class='group flex cursor-pointer items-center gap-4 rounded-lg border border-slate-200 p-4 text-left transition-all duration-300 hover:border-[#205FAD] hover:bg-blue-50/30'
                            >
                                <div class='flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-colors duration-300 group-hover:bg-[#205FAD] group-hover:text-white'>
                                    <r.icon size={20} />
                                </div>
                                <div class='flex-1'>
                                    <p class='text-sm font-bold text-slate-900'>{r.label}</p>
                                    <p class='text-xs text-slate-500'>{r.desc}</p>
                                </div>
                                <ArrowRight size={16} class='text-slate-300 transition-colors group-hover:text-[#205FAD]' />
                            </button>
                        {/each}
                    </div>
                </div>
            {:else}
                <!-- Role Selector (Header) -->
                <div class='flex items-center gap-2'>
                    <button
                        onclick={() => role = null}
                        class='flex h-10 cursor-pointer items-center justify-center rounded-lg bg-primary px-4 text-[10px] font-bold uppercase tracking-wider text-white transition-all hover:bg-primary/90'
                    >
                        Back
                    </button>
                    <div class='flex flex-1 rounded-lg bg-slate-100 p-1'>
                        {#each [
                            { id: 'student', label: 'Student' },
                            { id: 'school_staff', label: 'School Staff' },
                            { id: 'employer', label: 'Employee/er' },
                        ] as r}
                            <button
                                onclick={() => {
                                    role = r.id as UserRole;
                                    errorMessage = '';
                                }}
                                class='flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-300 {role === r.id ? 'bg-white text-primary' : 'text-slate-500 hover:text-slate-700'}'
                            >
                                {r.label}
                            </button>
                        {/each}
                    </div>
                </div>

                <!-- Step Header -->
                <div class='space-y-3 text-center'>
                    <div>
                        <h1 class='text-2xl font-semibold text-slate-900'>Identity Verification</h1>
                        <p class='mt-2 text-sm text-slate-500'>
                            {#if role === 'student'}
                                Enter your SDMS credentials to create your student account.
                            {:else if role === 'school_staff'}
                                Verify your identity as school staff to proceed with registration.
                            {:else}
                                Verify your company affiliation to create your employer account.
                            {/if}
                        </p>
                    </div>
                </div>

                <!-- Form Content -->
                <div class='space-y-4'>
                    {#if role === 'student'}
                        <label class='flex flex-col space-y-2.5'>
                            <span class='text-xs font-medium text-slate-700'>SDMS Code <span class='text-red-500'>*</span></span>
                            <div class='relative'>
                                <input
                                    bind:value={sdmsCode}
                                    class='w-full rounded-lg border border-slate-200 px-3 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20'
                                    placeholder='Enter SDMS Code'
                                    type='text'
                                />
                                <Hash class='absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' size={16} />
                            </div>
                        </label>
                        <label class='flex flex-col space-y-2.5'>
                            <span class='text-xs font-medium text-slate-700'>Password <span class='text-red-500'>*</span></span>
                            <div class='relative'>
                                <input
                                    bind:value={password}
                                    class='w-full rounded-lg border border-slate-200 px-3 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20'
                                    placeholder='••••••••'
                                    type='password'
                                />
                                <Lock class='absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' size={16} />
                            </div>
                        </label>
                        <label class='flex flex-col space-y-2.5'>
                            <span class='text-xs font-medium text-slate-700'>Confirm Password <span class='text-red-500'>*</span></span>
                            <div class='relative'>
                                <input
                                    bind:value={confirmPassword}
                                    class='w-full rounded-lg border border-slate-200 px-3 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20'
                                    placeholder='••••••••'
                                    type='password'
                                />
                                <Lock class='absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' size={16} />
                            </div>
                        </label>
                    {:else}
                        <label class='flex flex-col space-y-2.5'>
                            <span class='text-xs font-medium text-slate-700'>National ID Number <span class='text-red-500'>*</span></span>
                            <div class='relative'>
                                <input
                                    bind:value={nationalId}
                                    class='w-full rounded-lg border border-slate-200 px-3 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20'
                                    placeholder='e.g. 1 1990 8 0123456 0 01'
                                    type='text'
                                />
                                <CreditCard class='pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' size={16} />
                            </div>
                        </label>

                        {#if role === 'employer'}
                            <div class='space-y-4'>
                                <label class='flex flex-col space-y-2.5'>
                                    <span class='text-xs font-medium text-slate-700'>Company TIN Number <span class='text-red-500'>*</span></span>
                                    <div class='relative'>
                                        <input
                                            bind:value={tinNumber}
                                            class='w-full rounded-lg border border-slate-200 px-3 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20'
                                            placeholder='Enter TIN Number'
                                            type='text'
                                        />
                                        <Building2 class='absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' size={16} />
                                    </div>
                                </label>

                                <label class='flex flex-col space-y-2.5'>
                                    <span class='text-xs font-medium text-slate-700'>Email Address <span class='text-red-500'>*</span></span>
                                    <div class='relative'>
                                        <input
                                            bind:value={email}
                                            type='email'
                                            class='w-full rounded-lg border border-slate-200 px-3 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20'
                                            placeholder='e.g. name@example.com'
                                        />
                                        <Mail class='absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' size={16} />
                                    </div>
                                </label>

                                <label class='flex flex-col space-y-2.5'>
                                    <span class='text-xs font-medium text-slate-700'>Phone Number <span class='text-red-500'>*</span></span>
                                    <div class='relative'>
                                        <input
                                            bind:value={phone}
                                            type='tel'
                                            class='w-full rounded-lg border border-slate-200 px-3 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20'
                                            placeholder='07X XXX XXXX'
                                        />
                                        <Phone class='absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' size={16} />
                                    </div>
                                </label>
                            </div>
                        {/if}
                    {/if}

                    {#if errorMessage}
                        <div in:slide class='flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 p-3 text-xs font-medium text-red-600'>
                            <div class='flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-100'>
                                <Info size={12} class='text-red-600' />
                            </div>
                            {errorMessage}
                        </div>
                    {/if}

                    <div class='flex items-center gap-4 pt-4'>
                        <button
                            onclick={handleVerify}
                            disabled={view === 'searching'}
                            type='button'
                            class='flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#205FAD] px-4 py-2 font-inter text-sm font-medium whitespace-nowrap text-white outline-none transition-colors duration-300 focus-visible:ring-[3px] focus-visible:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-70 hover:bg-[#1A4B8A]'
                        >
                            {#if view === 'searching'}
                                <LoaderCircle class='h-4 w-4 animate-spin' />
                                {role === 'student' ? 'Creating Account...' : 'Verifying...'}
                            {:else}
                                {#if role === 'student'}
                                    <UserCheck size={16} />
                                    Create Account
                                {:else}
                                    <Search size={16} />
                                    Verify Identity
                                {/if}
                            {/if}
                        </button>
                    </div>
                </div>
            {/if}
        </div>
    {:else if view === 'registered'}
        <div in:fly={{ y: 20, duration: 400 }} class='space-y-8 text-center'>
            <div class='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-primary'>
                <UserCheck size={32} />
            </div>
            <div class='space-y-2'>
                <h2 class='text-xl font-bold text-slate-900'>Account Already Exists</h2>
                <p class='px-4 text-sm leading-relaxed text-slate-500'>
                    The National ID <span class='font-semibold text-slate-700'>{nationalId}</span> is already registered in our system.
                    We have sent a verification email to <span class='font-semibold text-primary'>{fetchedUser?.email || 'the associated account'}</span>.
                </p>
            </div>

            <div class='flex gap-3 rounded-lg border border-blue-100 bg-blue-50/50 p-4 text-left'>
                <Info class='mt-0.5 shrink-0 text-primary' size={18} />
                <p class='text-xs leading-relaxed text-blue-800'>
                    Please check your email and use your existing credentials to log in and continue with your accreditation.
                </p>
            </div>

            <div class='space-y-3 pt-2'>
                <button
                    onclick={() => goto('/signin')}
                    class='flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#205FAD] px-4 py-2 font-inter text-sm font-medium whitespace-nowrap text-white outline-none transition-colors duration-300 focus-visible:ring-[3px] focus-visible:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-70 hover:bg-[#1A4B8A]'
                >
                    Go to Login
                </button>
                <button
                    onclick={reset}
                    class='cursor-pointer text-xs font-medium text-slate-400 transition-colors duration-300 hover:text-slate-600'
                >
                    Use a different ID
                </button>
            </div>
        </div>
    {:else if view === 'confirm_email' && fetchedUser}
        <div in:fly={{ y: 20, duration: 400 }} class='space-y-6 text-center'>
            <div class='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-primary'>
                <Mail size={32} />
            </div>
            <div class='space-y-2'>
                <h2 class='text-xl font-bold text-slate-900'>Verify Your Email</h2>
                <p class='px-4 text-sm leading-relaxed text-slate-500'>
                    We found your record for <span class='font-semibold text-slate-900'>{fetchedUser.firstName} {fetchedUser.lastName}</span> in SDMS.
                </p>
                <p class='px-4 text-sm leading-relaxed text-slate-500'>
                    A verification link will be sent to:
                    <br />
                    <span class='mt-2 inline-block font-semibold text-[#205FAD]'>{email.replace(/(.{3}).*(@.*)/, '$1***$2')}</span>
                </p>
            </div>

            <div class='flex gap-3 rounded-lg border border-amber-100 bg-amber-50 p-4 text-left'>
                <Info class='mt-0.5 shrink-0 text-amber-600' size={18} />
                <p class='text-[11px] leading-relaxed text-amber-800'>
                    Do you want to send the verification link to this email? You will need to click the link in the email to activate your account.
                </p>
            </div>

            <div class='flex flex-col gap-3 pt-4'>
                <button
                    onclick={handleSendVerification}
                    class='flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#205FAD] px-4 py-2 font-inter text-sm font-medium whitespace-nowrap text-white outline-none transition-colors duration-300 hover:bg-[#1A4B8A]'
                >
                    Yes, Send Verification Link
                </button>
                <button
                    onclick={reset}
                    class='cursor-pointer text-xs font-medium text-slate-400 transition-colors duration-300 hover:text-slate-600'
                >
                    No, this is not my email
                </button>
            </div>
        </div>
    {:else if view === 'notifying'}
        <div in:fly={{ y: 20, duration: 400 }} class='space-y-8 py-8 text-center'>
            <div class='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600'>
                <CheckCircle2 size={32} class='animate-bounce' />
            </div>
            <div class='space-y-3'>
                <h2 class='text-xl font-bold text-slate-900'>Verification Link Sent</h2>
                <p class='px-4 text-sm leading-relaxed text-slate-500'>
                    A verification link has been sent to your registered email: <span class='font-semibold text-slate-700'>{email}</span>.
                </p>
                <div class='flex items-center justify-center gap-2 pt-2 text-xs font-medium text-primary'>
                    <LoaderCircle class='h-3 w-3 animate-spin' />
                    Setting up your account...
                </div>
            </div>
        </div>
    {:else if view === 'create_password'}
        <div in:fly={{ y: 20, duration: 400 }} class='space-y-6'>
            <div class='space-y-1.5'>
                <h2 class='text-xl font-bold text-slate-900'>Create Password</h2>
                <p class='text-sm text-slate-500'>
                    Secure your account with a strong password.
                </p>
            </div>

            <div class='space-y-4'>
                <label class='flex flex-col space-y-2'>
                    <span class='text-xs font-medium text-slate-700'>Password <span class='text-red-500'>*</span></span>
                    <div class='relative'>
                        <input
                            bind:value={password}
                            type={showPassword ? 'text' : 'password'}
                            class='w-full rounded-lg border border-slate-200 px-3 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20'
                            placeholder='••••••••'
                        />
                        <button
                            type='button'
                            onclick={() => showPassword = !showPassword}
                            class='absolute right-10 top-1/2 cursor-pointer -translate-y-1/2 text-slate-400 transition-colors duration-300 hover:text-slate-600'
                        >
                            {#if showPassword}
                                <EyeOff size={16} />
                            {:else}
                                <Eye size={16} />
                            {/if}
                        </button>
                        <Lock class='absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' size={16} />
                    </div>
                </label>

                <label class='flex flex-col space-y-2'>
                    <span class='text-xs font-medium text-slate-700'>Confirm Password <span class='text-red-500'>*</span></span>
                    <div class='relative'>
                        <input
                            bind:value={confirmPassword}
                            type={showPassword ? 'text' : 'password'}
                            class='w-full rounded-lg border border-slate-200 px-3 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20'
                            placeholder='••••••••'
                            onkeydown={e => e.key === 'Enter' && handleCreatePassword()}
                        />
                        <Lock class='absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' size={16} />
                    </div>
                </label>
            </div>

            {#if errorMessage}
                <p transition:fade class='text-xs font-medium text-red-500'>{errorMessage}</p>
            {/if}

            <div class='flex flex-col gap-3 pt-2'>
                <button
                    onclick={handleCreatePassword}
                    class='flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#205FAD] px-4 py-2 font-inter text-sm font-medium whitespace-nowrap text-white outline-none transition-colors duration-300 focus-visible:ring-[3px] focus-visible:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-70 hover:bg-[#1A4B8A]'
                >
                    Create Account & Login
                    <ArrowRight size={16} />
                </button>
                <button
                    onclick={() => view = 'confirm_email'}
                    class='cursor-pointer text-xs font-medium text-slate-400 transition-colors duration-300 hover:text-slate-600'
                >
                    Back to Contact Details
                </button>
            </div>
        </div>
    {/if}
</div>
