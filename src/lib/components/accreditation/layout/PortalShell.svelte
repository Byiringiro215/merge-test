<script lang='ts'>
    import type { UserRole } from '$lib/accreditation/types/auth';
    import { setPageHeader } from '$lib/accreditation/context/page-header.svelte';
    import { cn } from '$lib/accreditation/utils/cn';
    import SidebarNav from '../navigation/SidebarNav.svelte';
    import Topbar from '../navigation/Topbar.svelte';

    const { role, children }: { role: UserRole; children: any } = $props();
    const pageHeader = setPageHeader();

    let isMobileMenuOpen = $state(false);

    function toggleMobileMenu() {
        isMobileMenuOpen = !isMobileMenuOpen;
    }
</script>

<div class={cn(
    'h-screen overflow-hidden bg-white text-slate-900 transition-all duration-300',
    role === 'applicant' ? 'applicant-portal' : '',
    pageHeader.hideSidebar ? 'flex flex-col' : 'md:grid md:grid-cols-[250px_1fr]',
)}>
    <!-- Sidebar -->
    {#if !pageHeader.hideSidebar}
        <aside class='no-scrollbar hidden h-full overflow-y-auto border-r border-slate-200 bg-white px-4 pt-6 md:block'>
            <SidebarNav {role} />
        </aside>
    {/if}

    <!-- Mobile Sidebar Overlay -->
    {#if isMobileMenuOpen && !pageHeader.hideSidebar}
        <div
            class='fixed inset-0 z-50 bg-slate-900/50 md:hidden'
            onclick={toggleMobileMenu}
            onkeydown={e => e.key === 'Escape' && toggleMobileMenu()}
            role='button'
            tabindex='0'
            aria-label='Close menu'
        >
            <div
                class='h-full w-[250px] overflow-y-auto bg-white p-4 pt-6'
                onclick={e => e.stopPropagation()}
                onkeydown={e => e.stopPropagation()}
                role='dialog'
                tabindex='-1'
            >
                <SidebarNav {role} onCloseMobile={toggleMobileMenu} />
            </div>
        </div>
    {/if}

    <!-- Main Content Area -->
    <div class='flex h-full flex-col overflow-hidden'>
        <Topbar {role} onOpenMobile={toggleMobileMenu} />
        <main class={cn(
            'no-scrollbar flex-1',
            pageHeader.noScroll ? 'overflow-hidden' : 'overflow-y-auto',
            pageHeader.hideSidebar ? 'p-0' : (pageHeader.noPadding ? 'p-0' : 'px-6 pb-6'),
        )}>
            {@render children()}
        </main>
    </div>
</div>
