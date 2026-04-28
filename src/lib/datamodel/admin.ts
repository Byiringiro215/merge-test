import type { Schema } from '$lib/api/paths';
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
