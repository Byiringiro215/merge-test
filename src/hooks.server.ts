import type { Handle } from '@sveltejs/kit';
import { serverApi } from '$lib/api';
import { clearAuthCookies, getAuthCookies, setAuthCookies } from '$lib/auth/cookies';

export const handle: Handle = async ({ event, resolve }) => {
    let { accessToken, refreshToken } = getAuthCookies(event.cookies);

    if (!accessToken && refreshToken) {
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

    event.locals.accessToken = accessToken;

    return resolve(event);
};
