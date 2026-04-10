import type { paths } from './paths';
import { PUBLIC_API_URL } from '$env/static/public';
import { getAccessToken, refreshAccessToken } from '$lib/auth/index.svelte';
import { bearerWithRefresh, createFetch } from '@bajustone/fetcher';
import { routes } from 'virtual:fetcher';

export const api = createFetch<paths>({
    baseUrl: `${PUBLIC_API_URL}/v1`,
    routes,
    middleware: [
        bearerWithRefresh<paths>({
            getToken: getAccessToken,
            refresh: async () => {
                const ok = await refreshAccessToken();
                if (!ok)
                    throw new Error('token refresh failed');
                const token = getAccessToken();
                if (!token)
                    throw new Error('token refresh produced no token');
                return token;
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
