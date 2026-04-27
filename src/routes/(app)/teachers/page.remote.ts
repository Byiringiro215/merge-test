import type { StaffSummary } from '$lib/datamodel/staff';
import { getRequestEvent, query } from '$app/server';
import { serverApi as api } from '$lib/api';
import { getAuthCookies } from '$lib/auth/cookies';
import * as s from '@bajustone/fetcher/schema';

function authHeader() {
    const { accessToken } = getAuthCookies(getRequestEvent().cookies);
    return { Authorization: `Bearer ${accessToken}` };
}

const looseSchema = s.unknown();

const listTeachersArgsSchema = s.object({
    page: s.optional(s.number()),
    limit: s.optional(s.number()),
    schoolCode: s.optional(s.string()),
    gender: s.optional(s.string()),
    positionName: s.optional(s.string()),
});

interface CanonicalTeacher {
    id: number;
    sdmsStaffNumber: string | null;
    tmisStaffId: string | null;
    names: string | null;
    firstName: string | null;
    lastName: string | null;
    gender: string | null;
    positionName: string | null;
    schoolCode: string | null;
    schoolName: string | null;
}

function canonicalToStaffSummary(t: CanonicalTeacher): StaffSummary {
    const fallback = [t.firstName, t.lastName].filter(Boolean).join(' ');
    const names = t.names ?? (fallback || '—');
    return {
        staffNumber: t.sdmsStaffNumber ?? t.tmisStaffId ?? String(t.id),
        names,
        position: t.positionName,
        schoolCode: t.schoolCode ?? '',
        schoolName: t.schoolName ?? '',
        gender: t.gender,
    };
}

export const fetchTeachers = query(
    listTeachersArgsSchema,
    async ({ page = 1, limit = 20, schoolCode, gender, positionName }) => {
        const result = await api.get('/teachers', {
            query: {
                page: String(page),
                limit: String(limit),
                ...(schoolCode && { schoolCode }),
                ...(gender && { gender }),
                ...(positionName && { positionName }),
            },
            headers: authHeader(),
            responseSchema: looseSchema,
        }).result();

        if (!result.ok) {
            console.error('[teachers] /teachers failed', JSON.stringify(result.error, null, 2));
            return { staff: [] as StaffSummary[], total: 0 };
        }

        const body = result.data as {
            data: CanonicalTeacher[];
            meta?: { page?: { total?: number } };
        };
        const staff = body.data.map(canonicalToStaffSummary);
        return { staff, total: body.meta?.page?.total ?? staff.length };
    },
);

export const fetchTeacherStats = query(async () => {
    const [overviewRes, teachersRes] = await Promise.all([
        api.get('/reports/overview', {
            query: { groupBy: 'province', limit: '50' },
            headers: authHeader(),
            responseSchema: looseSchema,
        }).result(),
        api.get('/reports/teachers', {
            query: { groupBy: 'province', limit: '50' },
            headers: authHeader(),
            responseSchema: looseSchema,
        }).result(),
    ]);

    let totalTeachers = 0;
    let totalStudents = 0;
    const byGender: Record<string, number> = {};

    if (overviewRes.ok) {
        const body = overviewRes.data as {
            data: { totals: { teachers: number; students: number } }[];
        };
        for (const row of body.data) {
            totalTeachers += row.totals.teachers;
            totalStudents += row.totals.students;
        }
    }
    else {
        console.error('[teachers] /reports/overview failed', JSON.stringify(overviewRes.error, null, 2));
    }

    if (teachersRes.ok) {
        const body = teachersRes.data as {
            data: { breakdown?: { byGender?: Record<string, number> } }[];
        };
        for (const row of body.data) {
            const g = row.breakdown?.byGender ?? {};
            for (const [k, v] of Object.entries(g)) {
                byGender[k] = (byGender[k] ?? 0) + v;
            }
        }
    }

    return { totalTeachers, totalStudents, byGender };
});
