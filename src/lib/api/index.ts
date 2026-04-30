import type { paths } from './paths';
import { env } from '$env/dynamic/public';
import { getAccessToken, setAccessToken } from '$lib/auth/index.svelte';
import { bearerWithRefresh, createFetch } from '@bajustone/fetcher';
import { routes } from 'virtual:fetcher';

// Read at runtime (not build time) so a single image works in any environment.
// Fail loud at module load if it's missing — better than silent 502s on every protected page.
if (!env.PUBLIC_API_URL) {
    throw new Error(
        'PUBLIC_API_URL is not set. Set it in the container environment (docker-compose `environment:` block) before starting the app.',
    );
}

const baseUrl = `${env.PUBLIC_API_URL}/v1`;

export const api = createFetch<paths>({
    baseUrl,
    routes,
    middleware: [
        bearerWithRefresh<paths>({
            getToken: getAccessToken,
            refresh: async () => {
                const res = await fetch('/api/auth/refresh', { method: 'POST' });
                if (!res.ok)
                    throw new Error('token refresh failed');
                const { accessToken } = await res.json();
                setAccessToken(accessToken);
                return accessToken;
            },
            exclude: ['/auth/login', '/auth/logout', '/auth/refresh'],
        }),
    ],
});

/** API client without auth middleware — safe for server-side use (remote functions). */
export const serverApi = createFetch<paths>({
    baseUrl,
    routes,
});
