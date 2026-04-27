import type { StudentSummary } from '$lib/datamodel/student';
import { getRequestEvent, query } from '$app/server';
import { serverApi as api } from '$lib/api';
import { getAuthCookies } from '$lib/auth/cookies';
import * as s from '@bajustone/fetcher/schema';

function authHeader() {
    const { accessToken } = getAuthCookies(getRequestEvent().cookies);
    return { Authorization: `Bearer ${accessToken}` };
}

const looseSchema = s.unknown();

const listStudentsArgsSchema = s.object({
    page: s.optional(s.number()),
    limit: s.optional(s.number()),
    schoolCode: s.optional(s.string()),
    gender: s.optional(s.string()),
    status: s.optional(s.string()),
    classGroup: s.optional(s.string()),
});

interface CanonicalStudent {
    id: number;
    studentNumber: string;
    names: string;
    gender: string | null;
    schoolCode: string | null;
    schoolName: string | null;
    classGroup: string | null;
    status: string | null;
}

function canonicalToStudentSummary(t: CanonicalStudent): StudentSummary {
    return {
        studentNumber: t.studentNumber,
        names: t.names,
        gender: t.gender,
        schoolCode: t.schoolCode ?? '',
        schoolName: t.schoolName ?? '',
        classGroup: t.classGroup,
        status: t.status,
    };
}

export const fetchStudents = query(
    listStudentsArgsSchema,
    async ({ page = 1, limit = 20, schoolCode, gender, status, classGroup }) => {
        const result = await api.get('/students', {
            query: {
                page: String(page),
                limit: String(limit),
                ...(schoolCode && { schoolCode }),
                ...(gender && { gender }),
                ...(status && { status }),
                ...(classGroup && { classGroup }),
            },
            headers: authHeader(),
            responseSchema: looseSchema,
        }).result();

        if (!result.ok) {
            console.error('[students] /students failed', JSON.stringify(result.error, null, 2));
            return { students: [] as StudentSummary[], total: 0 };
        }

        const body = result.data as {
            data: CanonicalStudent[];
            meta?: { page?: { total?: number } };
        };
        const students = body.data.map(canonicalToStudentSummary);
        return { students, total: body.meta?.page?.total ?? students.length };
    },
);

export const fetchStudentStats = query(async () => {
    const [overviewRes, studentsRes] = await Promise.all([
        api.get('/reports/overview', {
            query: { groupBy: 'province', limit: '50' },
            headers: authHeader(),
            responseSchema: looseSchema,
        }).result(),
        api.get('/reports/students', {
            query: { groupBy: 'province', limit: '50' },
            headers: authHeader(),
            responseSchema: looseSchema,
        }).result(),
    ]);

    let totalStudents = 0;
    let totalSchools = 0;
    const byStatus: Record<string, number> = {};

    if (overviewRes.ok) {
        const body = overviewRes.data as {
            data: { totals: { students: number; schools: number } }[];
        };
        for (const row of body.data) {
            totalStudents += row.totals.students;
            totalSchools += row.totals.schools;
        }
    }
    else {
        console.error('[students] /reports/overview failed', JSON.stringify(overviewRes.error, null, 2));
    }

    if (studentsRes.ok) {
        const body = studentsRes.data as {
            data: { breakdown?: { byStatus?: Record<string, number> } }[];
        };
        for (const row of body.data) {
            for (const [k, v] of Object.entries(row.breakdown?.byStatus ?? {})) {
                byStatus[k] = (byStatus[k] ?? 0) + v;
            }
        }
    }

    return { totalStudents, totalSchools, byStatus };
});
