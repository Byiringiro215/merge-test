import { form, getRequestEvent } from '$app/server';
import { serverApi as api } from '$lib/api';
import { setAuthCookies } from '$lib/auth/cookies';
import { extractErrorMessage } from '@bajustone/fetcher';
import { error } from '@sveltejs/kit';

export const loginForm = form('unchecked', async ({ identifier, _password }: { identifier: string; _password: string }) => {
    const result = await api.post('/auth/login', {
        body: { identifier, password: _password },
    }).result();

    if (!result.ok) {
        error(400, extractErrorMessage(result.error));
    }

    const body = result.data;

    if (body.status !== 'success') {
        const message
            = body.status === 'pending'
                ? 'Account pending verification.'
                : 'Impersonation login is not supported yet.';
        error(400, message);
    }

    const event = getRequestEvent();
    setAuthCookies(event.cookies, {
        accessToken: body.accessToken,
        refreshToken: body.refreshToken,
    });

    return { user: body.user };
});
