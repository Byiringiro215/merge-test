<script lang='ts'>

    const currentYear = new Date().getFullYear();
</script>

<footer class='border-t border-gray-200 bg-white'>
    <div
        class='flex flex-col items-center justify-between gap-4 px-6 py-4 sm:flex-row lg:px-8'
    >
        <!-- Left Section -->
        <div class='flex items-center gap-2 text-xs text-gray-600'>
            <span>&copy; {currentYear} RTB Rwanda, Dashboard</span>
            <span class='hidden sm:inline'>•</span>
            <span class='flex items-center gap-1.5'>
                <span class='hidden sm:inline'>System Status:</span>
                <span
                    class='inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs'
                >
                    Operational
                </span>
            </span>
        </div>

        <!-- Right Section -->
        <div class='flex items-center gap-6 text-xs'>
            <a
                href='/privacy'
                class='text-gray-500 transition-colors hover:text-gray-700'
            >Privacy Policy</a
            >
            <a
                href='/terms'
                class='text-gray-500 transition-colors hover:text-gray-700'
            >Terms</a
            >
        </div>
    </div>
</footer>
