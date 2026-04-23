import type { LoginInput } from '$lib/types/form-schemas';
import { form, getRequestEvent } from '$app/server';
import { serverApi as api } from '$lib/api';
import { setAuthCookies } from '$lib/auth/cookies';
import { loginSchema } from '$lib/types/form-schemas';
import * as fetcher from '@bajustone/fetcher';
import { invalid } from '@sveltejs/kit';

// SvelteKit's `form()` requires a StandardSchemaV1 whose input type is
// assignable to its internal `RemoteFormInput` (FormData-shaped). The fetcher
// schema builder declares `input: unknown`, which is structurally the same
// but TypeScript flags as incompatible in the invariant input position.
// The cast is type-only — runtime validation is unchanged.
const loginSchemaForForm = loginSchema as unknown as fetcher.StandardSchemaV1<LoginInput, LoginInput>;

export const loginForm = form(loginSchemaForForm, async ({ identifier, _password }) => {
    const result = await api.post('/auth/login', {
        body: { identifier, password: _password },
    }).result();

    if (!result.ok) {
        invalid(fetcher.extractErrorMessage(result.error) || 'Sign in failed. Please try again.');
    }

    const body = result.data;

    if (body.status !== 'success') {
        const message
            = body.status === 'pending'
                ? 'Account pending verification.'
                : 'Impersonation login is not supported yet.';
        invalid(message);
    }

    const event = getRequestEvent();
    setAuthCookies(event.cookies, {
        accessToken: body.accessToken,
        refreshToken: body.refreshToken,
    });

    return { user: body.user };
});
