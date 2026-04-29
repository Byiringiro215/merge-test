import type { paths, Schema } from '$lib/api/paths';
import type { permissionSchema } from '$lib/types/api-schemas';
import type { Infer } from '@bajustone/fetcher/schema';

export type User = Schema<'User'>;
export type Role = Schema<'Role'>;
export type Group = Schema<'Group'>;
export type Permission = Schema<'Permission'>;
export type PermissionRes = Infer<typeof permissionSchema>;
export type Session = Schema<'SessionInfo'>;
export type PermissionInput = Schema<'PermissionInput'>;
export type ServiceAccount = Schema<'ServiceAccount'>;

// API keys are not a named OpenAPI component — derive from the response shape.
export type ApiKey = NonNullable<
    paths['/admin/service-accounts/{id}/api-keys']['get']['responses'][200]['content']['application/json']['keys'][number]
>;
