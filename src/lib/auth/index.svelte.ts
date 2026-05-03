import type { Schema } from '$lib/api/paths';
import { goto, invalidateAll } from '$app/navigation';

import { api } from '$lib/api';

// -- Types --------------------------------------------------------------------

export type AuthUser = Schema<'User'>;
export type Permission = Schema<'Permission'>;
export type Resource = Permission['resource'];
export type Action = Permission['action'];

// -- State --------------------------------------------------------------------

let accessToken: string | null = $state(null);
let user: AuthUser | null = $state(null);
let isLoading: boolean = $state(true);
const isAuthenticated: boolean = $derived(accessToken !== null);

let permissions: Permission[] = $state([]);
let permissionsLoaded: boolean = $state(false);
const checkCache = new Map<string, boolean>();

// -- Permissions --------------------------------------------------------------

async function fetchPermissions(): Promise<void> {
  if (!user)
return;
  const result = await api
    .get('/iam/users/{id}/permissions', {
      params: { id: user.id },
    })
    .result();
  if (result.ok) {
    permissions = result.data;
    permissionsLoaded = true;
    checkCache.clear();
  }
}

function evaluateLocal(resource: Resource, action: Action): boolean {
  const matching = permissions.filter(
    p => p.resource === resource && p.action === action,
  );
  if (matching.length === 0)
return false;
  if (matching.some(p => p.effect === 'DENY'))
return false;
  return matching.some(p => p.effect === 'ALLOW');
}

export async function checkPermission(
  resource: Resource,
  action: Action,
): Promise<boolean> {
  if (permissionsLoaded) {
    return evaluateLocal(resource, action);
  }
  const key = `${resource}:${action}`;
  if (checkCache.has(key))
return checkCache.get(key)!;
  if (!user)
return false;
  const result = await api
    .post('/iam/check', {
      body: { userId: user.id, resource, action },
    })
    .result();
  const allowed = result.ok ? result.data.allowed : false;
  checkCache.set(key, allowed);
  return allowed;
}

export function hasPermission(resource: Resource, action: Action): boolean {
  if (!permissionsLoaded)
return false;
  return evaluateLocal(resource, action);
}

// -- Public API ---------------------------------------------------------------

export function getAuthState() {
  return {
    get user() {
      return user;
    },
    get isAuthenticated() {
      return isAuthenticated;
    },
    get isLoading() {
      return isLoading;
    },
    get permissionsLoaded() {
      return permissionsLoaded;
    },
  };
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string) {
  accessToken = token;
}

export function initialize(data: { user: AuthUser | null; accessToken: string | null }) {
  accessToken = data.accessToken;
  user = data.user;
  isLoading = false;

  if (user && !permissionsLoaded) {
    fetchPermissions();
  }
}

export async function logout() {
  await fetch('/api/auth/logout', { method: 'POST' });

  accessToken = null;
  user = null;
  permissions = [];
  permissionsLoaded = false;
  checkCache.clear();

  await invalidateAll();
  goto('/signin');
}

export async function refreshAccessToken(): Promise<boolean> {
  const res = await fetch('/api/auth/refresh', { method: 'POST' });

  if (!res.ok) {
    await logout();
    return false;
  }

  const data = await res.json();
  accessToken = data.accessToken;
  return true;
}
