import type { paths } from './paths';
import { PUBLIC_API_URL } from '$env/static/public';
import { getAccessToken, setAccessToken } from '$lib/auth/index.svelte';
import { bearerWithRefresh, createFetch } from '@bajustone/fetcher';
import { routes } from 'virtual:fetcher';

export const api = createFetch<paths>({
    baseUrl: `${PUBLIC_API_URL}/v1`,
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
    baseUrl: `${PUBLIC_API_URL}/v1`,
    routes,
});
