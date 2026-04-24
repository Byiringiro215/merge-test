import { command, getRequestEvent, query } from '$app/server';
import { serverApi as api } from '$lib/api';
import { getAuthCookies } from '$lib/auth/cookies';
import { permissionListResponseSchema } from '$lib/types/api-schemas';
import {
    createPermissionBodySchema,
    deletePermissionSchema,
    fetchPermissionsQuerySchema,
} from '$lib/types/form-schemas';
import * as fetcher from '@bajustone/fetcher';
import { error } from '@sveltejs/kit';

function authHeader() {
    const event = getRequestEvent();
    const { accessToken } = getAuthCookies(event.cookies);
    return { Authorization: `Bearer ${accessToken}` };
}

export const fetchAllPermissions = query(fetchPermissionsQuerySchema, async (args) => {
    const result = await api.get('/iam/permissions', {
        query: {
            ...(args.resource && { resource: args.resource }),
        },
        headers: authHeader(),
        responseSchema: permissionListResponseSchema,
    }).result();

    if (!result.ok) {
        return [];
    }

    return result.data;
});

export const createPermission = command(createPermissionBodySchema, async (body) => {
    const result = await api.post('/iam/permissions', {
        body,
        headers: authHeader(),
    }).result();

    if (!result.ok) {
        error(400, fetcher.extractErrorMessage(result.error) || 'Failed to create permission');
    }

    return result.data;
});

export const deletePermission = command(deletePermissionSchema, async ({ id }) => {
    const result = await api.delete('/iam/permissions/{id}', {
        params: { id },
        headers: authHeader(),
    }).result();

    if (!result.ok) {
        error(400, fetcher.extractErrorMessage(result.error) || 'Failed to delete permission');
    }

    return result.data;
});
