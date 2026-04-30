import type { Handle } from '@sveltejs/kit';
import { serverApi } from '$lib/api';
import { clearAuthCookies, getAuthCookies, setAuthCookies } from '$lib/auth/cookies';

export const handle: Handle = async ({ event, resolve }) => {
    let { accessToken, refreshToken } = getAuthCookies(event.cookies);

    if (!accessToken && refreshToken) {
        try {
            const result = await serverApi.post('/auth/refresh', {
                body: { refreshToken },
            }).result();

            if (result.ok) {
                accessToken = result.data.accessToken;
                setAuthCookies(event.cookies, {
                    accessToken: result.data.accessToken,
                    refreshToken: result.data.refreshToken,
                });
            }
            else {
                clearAuthCookies(event.cookies);
            }
        }
        catch (err) {
            // Don't let a backend hiccup take down every protected page with a 502.
            // Drop the (now unverifiable) cookies and let the route fall through to /signin.
            console.error('[hooks.server] /auth/refresh failed:', err);
            clearAuthCookies(event.cookies);
        }
    }

    event.locals.accessToken = accessToken;

    return resolve(event);
};
