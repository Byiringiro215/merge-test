import { form } from '$app/server';
import { serverApi as api } from '$lib/api';
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

    return {
        accessToken: body.accessToken,
        refreshToken: body.refreshToken,
        user: body.user,
    };
});
