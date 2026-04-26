import { getRequestEvent, query } from '$app/server';
import { serverApi as api } from '$lib/api';
import { getAuthCookies } from '$lib/auth/cookies';
import * as s from '@bajustone/fetcher/schema';

function authHeader() {
    const { accessToken } = getAuthCookies(getRequestEvent().cookies);
    return { Authorization: `Bearer ${accessToken}` };
}

const looseSchema = s.unknown();

export const fetchTrainingStats = query(async () => {
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
    let totalTeachers = 0;
    const byCategory: Record<string, number> = {};

    if (overviewRes.ok) {
        const body = overviewRes.data as {
            data: { totals: { schools: number; students: number; teachers: number } }[];
        };
        for (const row of body.data) {
            totalSchools += row.totals.schools;
            totalStudents += row.totals.students;
            totalTeachers += row.totals.teachers;
        }
    }
    else {
        console.error('[training] /reports/overview failed', JSON.stringify(overviewRes.error, null, 2));
    }

    if (schoolsRes.ok) {
        const body = schoolsRes.data as {
            data: { breakdown?: { byCategory?: Record<string, number> } }[];
        };
        for (const row of body.data) {
            for (const [k, v] of Object.entries(row.breakdown?.byCategory ?? {})) {
                byCategory[k] = (byCategory[k] ?? 0) + v;
            }
        }
    }
    else {
        console.error('[training] /reports/schools failed', JSON.stringify(schoolsRes.error, null, 2));
    }

    return { totalSchools, totalStudents, totalTeachers, byCategory };
});
