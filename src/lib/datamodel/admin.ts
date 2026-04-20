import type { Schema } from '$lib/api/paths';
import type { permissionSchema } from '$lib/types/zod-schemas-api';
import type { z } from 'zod/v4';

export type User = Schema<'User'>;
export type Role = Schema<'Role'>;
export type Group = Schema<'Group'>;
export type Permission = Schema<'Permission'>;
export type PermissionRes = z.infer<typeof permissionSchema>;
export type Session = Schema<'SessionInfo'>;
export type PermissionInput = Schema<'PermissionInput'>;
