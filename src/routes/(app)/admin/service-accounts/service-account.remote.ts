import { command, getRequestEvent, query } from '$app/server';
import { serverApi as api } from '$lib/api';
import { getAuthCookies } from '$lib/auth/cookies';
import { permissionListResponseSchema } from '$lib/types/api-schemas';
import {
    bindPermissionToServiceAccountBodySchema,
    bindRoleToServiceAccountSchema,
    createServiceAccountBodySchema,
    deleteServiceAccountSchema,
    fetchServiceAccountApiKeysSchema,
    fetchServiceAccountPermissionsSchema,
    fetchServiceAccountsQuerySchema,
    mintServiceAccountApiKeyCommandSchema,
    revokeServiceAccountApiKeySchema,
    unbindPermissionFromServiceAccountBodySchema,
    updateServiceAccountCommandSchema,
} from '$lib/types/form-schemas';
import * as fetcher from '@bajustone/fetcher';
import * as s from '@bajustone/fetcher/schema';
import { error } from '@sveltejs/kit';

function authHeader() {
    const event = getRequestEvent();
    const { accessToken } = getAuthCookies(event.cookies);
    return { Authorization: `Bearer ${accessToken}` };
}

// handle error
function failBackend(err: fetcher.FetcherError, fallback: string): never {
    if (err.kind === 'http') {
        const body = err.body as { message?: string; code?: string } | undefined;
        const message = body?.message || fetcher.extractErrorMessage(err) || fallback;
        error(err.status as Parameters<typeof error>[0], message);
    }
    error(500, fetcher.extractErrorMessage(err) || fallback);
}

// fetch all service accounts;
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

// create new service account ;
export const createServiceAccount = command(createServiceAccountBodySchema, async (body) => {
    const result = await api.post('/iam/service-accounts', {
        body,
        headers: authHeader(),
    }).result();

    if (!result.ok) {
        failBackend(result.error, 'Failed to create service account');
    }

    return result.data;
});

// edit service account details;
export const updateServiceAccount = command(updateServiceAccountCommandSchema, async ({ id, ...body }) => {
    const result = await api.patch('/iam/service-accounts/{id}', {
        params: { id },
        body,
        headers: authHeader(),
    }).result();

    if (!result.ok) {
        failBackend(result.error, 'Failed to update service account');
    }

    return result.data;
});

// delete service account details;
export const deleteServiceAccount = command(deleteServiceAccountSchema, async ({ id }) => {
    const result = await api.delete('/iam/service-accounts/{id}', {
        params: { id },
        headers: authHeader(),
    }).result();

    if (!result.ok) {
        failBackend(result.error, 'Failed to delete service account');
    }

    return result.data;
});

// fetch service account details;
export const fetchServiceAccountById = query(s.number(), async (id) => {
    const result = await api.get('/iam/service-accounts/{id}', {
        params: { id },
        headers: authHeader(),
    }).result();

    if (!result.ok) {
        failBackend(result.error, 'Service account not found');
    }

    return result.data;
});
// get all  permissions associated to the service account
export const fetchServiceAccountPermissions = query(
    fetchServiceAccountPermissionsSchema,
    async ({ id }) => {
        const result = await api.get('/iam/service-accounts/{id}/permissions', {
            params: { id },
            headers: authHeader(),
            responseSchema: permissionListResponseSchema,
        }).result();

        if (!result.ok) {
            return [];
        }

        return result.data;
    },
);
// Bind Permission to service account
export const bindPermissionToServiceAccount = command(
    bindPermissionToServiceAccountBodySchema,
    async (body) => {
        const result = await api.post('/iam/permissions/bind/service-account', {
            body,
            headers: authHeader(),
        }).result();

        if (!result.ok) {
            failBackend(result.error, 'Failed to bind permission');
        }

        return result.data;
    },
);
// UnBind Permission to service account
export const unbindPermissionFromServiceAccount = command(
    unbindPermissionFromServiceAccountBodySchema,
    async (body) => {
        const result = await api.delete('/iam/permissions/bind/service-account', {
            body,
            headers: authHeader(),
        }).result();

        if (!result.ok) {
            failBackend(result.error, 'Failed to unbind permission');
        }

        return result.data;
    },
);

export const fetchServiceAccountApiKeys = query(
    fetchServiceAccountApiKeysSchema,
    async ({ id }) => {
        const result = await api.get('/admin/service-accounts/{id}/api-keys', {
            params: { id },
            headers: authHeader(),
        }).result();

        if (!result.ok) {
            return { keys: [] };
        }

        return result.data;
    },
);

// Returns the raw key in `key` — caller MUST surface it once and never refetch.
export const mintServiceAccountApiKey = command(
    mintServiceAccountApiKeyCommandSchema,
    async ({ id, ...body }) => {
        const result = await api.post('/admin/service-accounts/{id}/api-keys', {
            params: { id },
            body,
            headers: authHeader(),
        }).result();

        if (!result.ok) {
            failBackend(result.error, 'Failed to mint API key');
        }

        return result.data;
    },
);

export const revokeServiceAccountApiKey = command(
    revokeServiceAccountApiKeySchema,
    async ({ id, keyId }) => {
        const result = await api.delete(
            '/admin/service-accounts/{id}/api-keys/{keyId}',
            {
                params: { id, keyId },
                headers: authHeader(),
            },
        ).result();

        if (!result.ok) {
            failBackend(result.error, 'Failed to revoke API key');
        }

        return result.data;
    },
);

// Assign the given role to a specific service account.
export const bindRoleToServiceAccount = command(
    bindRoleToServiceAccountSchema,
    async ({ id, ...body }) => {
        const result = await api.post('/iam/roles/{id}/bind/service-account', {
            params: { id },
            body,
            headers: authHeader(),
        }).result();

        if (!result.ok) {
            failBackend(result.error, 'Failed to bind role to service account');
        }

        return result.data;
    },
);
