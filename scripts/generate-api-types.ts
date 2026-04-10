import { fetcherPlugin } from '@bajustone/fetcher/vite';

const plugin = fetcherPlugin({ spec: './src/lib/api/openapi.json' });
await plugin.buildStart();
