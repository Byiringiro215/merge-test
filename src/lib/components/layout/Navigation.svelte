<script lang="ts">
	import {
		LayoutGrid,
		Users,
		GraduationCap,
		Building2,
		BookOpen,
		Search,
		Bell,
		Settings,
		Menu,
		X,
	} from "@lucide/svelte";
	import { page } from "$app/state";
	import { slide } from "svelte/transition";
	import { cubicOut } from "svelte/easing";
	import { resolve } from "$app/paths";

	const navItems = [
		{ label: "General", href: "/dashboard", icon: LayoutGrid },
		{ label: "Students", href: "/students", icon: Users },
		{ label: "Teachers", href: "/teachers", icon: GraduationCap },
		{ label: "Schools", href: "/schools", icon: Building2 },
		{ label: "Curricula", href: "/curricula", icon: BookOpen },
	] as const;

	let searchQuery = $state("");
	let mobileMenuOpen = $state(false);

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === "Escape" && mobileMenuOpen) {
			closeMobileMenu();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<nav class="sticky top-0 z-10 w-full border-b border-gray-200 bg-white">
	<div class="flex h-16 items-center justify-between px-6 lg:px-8">
		<!-- Logo -->
		<a href={resolve("/")} class="flex items-center">
			<div class="h-12 w-12 flex items-center">
				<img
					src="/rtb-logo.png"
					alt="RTB Rwanda Logo"
					class="w-full object-cover"
				/>
			</div>
			<span class="text-lg leading-4 font-semibold mt-1 text-primary"
				>RTB Rwanda</span
			>
		</a>

		<!-- Navigation Links - Hidden on mobile -->
		<div class="hidden items-center gap-1 md:flex">
			{#each navItems as item, i (i)}
				{@const isActive = page.url.pathname === item.href}
				<a
					href={resolve(item.href)}
					class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-normal leading-6 transition-colors {isActive
						? 'bg-blue-50 text-primary'
						: 'text-[#565D6D] hover:bg-gray-100 hover:text-gray-900'}"
				>
					<item.icon class="h-4 w-4" />
					{item.label}
				</a>
			{/each}
		</div>

		<!-- Right Section -->
		<div class="flex items-center gap-3">
			<!-- Search Bar - Hidden on mobile -->
			<div class="relative hidden lg:block">
				<Search
					class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
				/>
				<input
					type="text"
					placeholder="Search data..."
					bind:value={searchQuery}
					class="h-9 w-64 rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm placeholder-gray-400 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
				/>
			</div>

			<!-- Icon Buttons -->
			<button
				type="button"
				class="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
				aria-label="Notifications"
			>
				<Bell class="h-5 w-5" />
				<span
					class="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500"
				></span>
			</button>

			<button
				type="button"
				class="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
				aria-label="Settings"
			>
				<Settings class="h-5 w-5" />
			</button>

			<!-- User Avatar -->
			<button
				type="button"
				class="h-9 w-9 overflow-hidden rounded-full bg-linear-to-br from-blue-500 to-blue-600"
			>
				<span
					class="flex h-full w-full items-center justify-center text-sm font-medium text-white"
					>JD</span
				>
			</button>

			<!-- Mobile Menu Button -->
			<button
				type="button"
				onclick={toggleMobileMenu}
				class="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 md:hidden"
				aria-label="Menu"
			>
				{#if mobileMenuOpen}
					<X class="h-5 w-5" />
				{:else}
					<Menu class="h-5 w-5" />
				{/if}
			</button>
		</div>
	</div>

	<!-- Mobile Navigation Menu -->
	{#if mobileMenuOpen}
		<div
			transition:slide={{ duration: 300, easing: cubicOut }}
			class="absolute inset-x-0 top-full z-60 border-t border-gray-200 bg-white md:hidden overflow-hidden shadow-lg"
		>
			<!-- Mobile Search -->
			<div class="px-4 py-3">
				<div class="relative">
					<Search
						class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
					/>
					<input
						type="text"
						placeholder="Search data..."
						bind:value={searchQuery}
						class="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
					/>
				</div>
			</div>

			<!-- Mobile Nav Links -->
			<div class="space-y-1 px-4 pb-4">
				{#each navItems as item, i (i)}
					{@const isActive = page.url.pathname === item.href}
					<a
						href={resolve(item.href)}
						onclick={closeMobileMenu}
						class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors {isActive
							? 'bg-blue-50 text-primary'
							: 'text-[#565D6D] hover:bg-gray-100 hover:text-gray-900'}"
					>
						<item.icon class="h-5 w-5" />
						{item.label}
					</a>
				{/each}
			</div>
		</div>
	{/if}
</nav>
