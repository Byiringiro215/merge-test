import { command, getRequestEvent, query } from '$app/server';
import { serverApi as api } from '$lib/api';
import { getAuthCookies } from '$lib/auth/cookies';
import {
    createServiceAccountBodySchema,
    deleteServiceAccountSchema,
    fetchServiceAccountsQuerySchema,
    updateServiceAccountCommandSchema,
} from '$lib/types/form-schemas';
import * as fetcher from '@bajustone/fetcher';
import { error } from '@sveltejs/kit';

function authHeader() {
    const event = getRequestEvent();
    const { accessToken } = getAuthCookies(event.cookies);
    return { Authorization: `Bearer ${accessToken}` };
}

export const fetchAllServiceAccounts = query(fetchServiceAccountsQuerySchema, async (args) => {
    const result = await api.get('/iam/service-accounts', {
        query: {
            ...(args.limit !== undefined && { limit: args.limit }),
            ...(args.offset !== undefined && { offset: args.offset }),
        },
        headers: authHeader(),
    }).result();

    if (!result.ok) {
        return { serviceAccounts: [], total: 0 };
    }

    return result.data;
});

export const createServiceAccount = command(createServiceAccountBodySchema, async (body) => {
    const result = await api.post('/iam/service-accounts', {
        body,
        headers: authHeader(),
    }).result();

    if (!result.ok) {
        error(400, fetcher.extractErrorMessage(result.error) || 'Failed to create service account');
    }

    return result.data;
});

export const updateServiceAccount = command(updateServiceAccountCommandSchema, async ({ id, ...body }) => {
    const result = await api.patch('/iam/service-accounts/{id}', {
        params: { id },
        body,
        headers: authHeader(),
    }).result();

    if (!result.ok) {
        error(400, fetcher.extractErrorMessage(result.error) || 'Failed to update service account');
    }

    return result.data;
});

export const deleteServiceAccount = command(deleteServiceAccountSchema, async ({ id }) => {
    const result = await api.delete('/iam/service-accounts/{id}', {
        params: { id },
        headers: authHeader(),
    }).result();

    if (!result.ok) {
        error(400, fetcher.extractErrorMessage(result.error) || 'Failed to delete service account');
    }

    return result.data;
});
