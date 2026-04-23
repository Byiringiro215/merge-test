// Workaround for a fetcher vite-plugin bug: the emitted `fetcher-env.d.ts`
// declares `virtual:fetcher`'s `routes` as `PathsToRoutes<paths>`, but the
// `import type { paths } from './paths'` inside the ambient `declare module`
// block doesn't resolve reliably — TypeScript treats the `paths` symbol as
// opaque in that context, so every slot on `routes[path][method]` collapses
// to `Schema<never>`.
//
// Here in a regular module file, relative imports work, and
// `PathsToRoutes<paths>` resolves correctly. We re-cast the raw value.
//
// TODO: delete this file once fetcher emits a working types declaration
// (dynamic-import `import('./paths').paths` or a non-ambient module form).

import type { paths } from '$lib/api/paths';
import type { PathsToRoutes } from '@bajustone/fetcher';
import {
    routes as rawRoutes,
    validators,
} from 'virtual:fetcher';

export const routes = rawRoutes as PathsToRoutes<paths>;
export { validators };
