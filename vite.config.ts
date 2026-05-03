import { fetcherPlugin } from '@bajustone/fetcher/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [
        tailwindcss(),
        fetcherPlugin({
            spec: './src/lib/api/openapi.json',
            url: process.env.OPENAPI_SPEC_URL,
        }),
        sveltekit(),
    ],
    ssr: {
        noExternal: ['lucide-svelte'],
    },
    test: {
        environment: 'node',
        include: ['src/**/*.{test,spec}.{js,ts}'],
        passWithNoTests: true,
    },
});
