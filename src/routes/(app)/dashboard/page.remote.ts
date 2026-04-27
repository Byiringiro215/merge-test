import { getRequestEvent, query } from '$app/server';
import { serverApi as api } from '$lib/api';
import { getAuthCookies } from '$lib/auth/cookies';
import * as s from '@bajustone/fetcher/schema';

function authHeader() {
    const { accessToken } = getAuthCookies(getRequestEvent().cookies);
    return { Authorization: `Bearer ${accessToken}` };
}

const overviewFiltersSchema = s.object({
    provinceId: s.optional(s.string()),
    districtId: s.optional(s.string()),
});

// Backend returns `meta.page.limit` as a string but the OpenAPI spec declares
// integer; bypass strict response validation until that's fixed upstream.
const looseSchema = s.unknown();

export const fetchOverviewByProvince = query(
    overviewFiltersSchema,
    async ({ provinceId, districtId }) => {
        const result = await api.get('/reports/overview', {
            query: {
                groupBy: 'province',
                ...(provinceId && { provinceId }),
                ...(districtId && { districtId }),
                limit: '50',
            },
            headers: authHeader(),
            responseSchema: looseSchema,
        }).result();

        if (!result.ok) {
            console.error('[dashboard] /reports/overview failed', JSON.stringify(result.error, null, 2));
            return { rows: [] as OverviewRow[], lastMaterialisedAt: null as string | null };
        }
        const body = result.data as {
            data: OverviewRow[];
            meta?: { lastMaterialisedAt?: string | null };
        };
        return {
            rows: body.data,
            lastMaterialisedAt: body.meta?.lastMaterialisedAt ?? null,
        };
    },
);

export interface OverviewRow {
    locationId: number;
    locationName: string;
    locationCode: string | null;
    parents: {
        provinceId: number | null;
        districtId: number | null;
        sectorId: number | null;
        cellId: number | null;
    };
    total: number;
    totals: { schools: number; students: number; teachers: number };
}

export const fetchProvinces = query(async () => {
    const result = await api.get('/locations/provinces', {
        headers: authHeader(),
    }).result();
    if (!result.ok) {
        console.error('[dashboard] /locations/provinces failed', JSON.stringify(result.error, null, 2));
        return [];
    }
    return result.data.data;
});

export const fetchDistricts = query(
    s.object({ provinceId: s.optional(s.string()) }),
    async ({ provinceId }) => {
        const result = await api.get('/locations/districts', {
            query: {
                ...(provinceId && { provinceId }),
                limit: '100',
            },
            headers: authHeader(),
            responseSchema: looseSchema,
        }).result();
        if (!result.ok) {
            console.error('[dashboard] /locations/districts failed', JSON.stringify(result.error, null, 2));
            return [];
        }
        const body = result.data as { data: { id: number; name: string; code: string | null; provinceId: number }[] };
        return body.data;
    },
);
