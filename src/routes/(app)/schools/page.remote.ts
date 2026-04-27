import type { School } from '$lib/components/schools/types.js';
import { getRequestEvent, query } from '$app/server';
import { serverApi as api } from '$lib/api';
import { getAuthCookies } from '$lib/auth/cookies';
import * as s from '@bajustone/fetcher/schema';

function authHeader() {
    const { accessToken } = getAuthCookies(getRequestEvent().cookies);
    return { Authorization: `Bearer ${accessToken}` };
}

// Backend currently returns `meta.page.limit` as a string while the OpenAPI
// schema declares integer; bypass strict response validation in the meantime.
const looseSchema = s.unknown();

const listSchoolsArgsSchema = s.object({
    page: s.optional(s.number()),
    limit: s.optional(s.number()),
});

interface CanonicalSchool {
    id: number;
    schoolCode: string;
    schoolName: string;
    schoolCategory: string | null;
    schoolStatus: string | null;
    isActive: string | null;
    location: { districtName: string | null };
}

export const fetchSchools = query(
    listSchoolsArgsSchema,
    async ({ page = 1, limit = 25 }) => {
        const result = await api.get('/schools', {
            query: { page: String(page), limit: String(limit) },
            headers: authHeader(),
            responseSchema: looseSchema,
        }).result();

        if (!result.ok) {
            console.error('[schools] /schools failed', JSON.stringify(result.error, null, 2));
            return { schools: [] as School[], total: 0 };
        }

        const body = result.data as {
            data: CanonicalSchool[];
            meta?: { page?: { total?: number } };
        };

        const schools: School[] = body.data.map(row => ({
            id: row.id,
            name: row.schoolName,
            // District type is a literal union; cast so unrecognised districts still render.
            district: (row.location.districtName ?? '—') as School['district'],
            status: (row.isActive === 'Yes' || row.schoolStatus === 'Active' ? 'Active' : 'Inactive') as School['status'],
            // The canonical /schools endpoint doesn't expose faculty count or success rate.
            faculties: 0,
            students: 0,
            successRate: 0,
        }));

        return { schools, total: body.meta?.page?.total ?? schools.length };
    },
);

export const fetchSchoolStats = query(async () => {
    const [overviewRes, schoolsRes] = await Promise.all([
        api.get('/reports/overview', {
            query: { groupBy: 'province', limit: '50' },
            headers: authHeader(),
            responseSchema: looseSchema,
        }).result(),
        api.get('/reports/schools', {
            query: { groupBy: 'province', limit: '50' },
            headers: authHeader(),
            responseSchema: looseSchema,
        }).result(),
    ]);

    let totalSchools = 0;
    let totalStudents = 0;
    let activeSchools = 0;

    if (overviewRes.ok) {
        const body = overviewRes.data as {
            data: { totals: { schools: number; students: number } }[];
        };
        for (const row of body.data) {
            totalSchools += row.totals.schools;
            totalStudents += row.totals.students;
        }
    }
    else {
        console.error('[schools] /reports/overview failed', JSON.stringify(overviewRes.error, null, 2));
    }

    if (schoolsRes.ok) {
        const body = schoolsRes.data as {
            data: { breakdown?: { byStatus?: Record<string, number> } }[];
        };
        for (const row of body.data) {
            const status = row.breakdown?.byStatus ?? {};
            for (const [k, v] of Object.entries(status)) {
                if (k.toLowerCase().includes('active'))
                    activeSchools += v;
            }
        }
    }
    else {
        console.error('[schools] /reports/schools failed', JSON.stringify(schoolsRes.error, null, 2));
    }

    return { totalSchools, totalStudents, activeSchools };
});
