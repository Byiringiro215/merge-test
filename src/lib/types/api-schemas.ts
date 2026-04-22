import type { FSchema, Infer } from '@bajustone/fetcher/schema';
import { array, nullable, number, object, optional, string } from '@bajustone/fetcher/schema';

export const paginationMeta = object({
    source: string(),
    strategy: string(),
    syncedAt: nullable(string()),
    page: optional(
        object({ current: number(), limit: number(), total: number() }),
    ),
});

export function createPaginatedResponseSchema<T extends FSchema<unknown>>(itemSchema: T) {
    return object({
        data: array(itemSchema),
        meta: paginationMeta,
    });
}

export const healthResponse = object({
    status: string(),
    timestamp: string(),
});

export const syncTriggerResponse = object({
    data: object({ message: string() }),
    meta: object({ source: string() }),
});

export const syncStatusData = object({
    id: number(),
    source: string(),
    entity: string(),
    status: string(),
    recordsFetched: nullable(number()),
    recordsUpserted: nullable(number()),
    errorMessage: nullable(string()),
    startedAt: string(),
    completedAt: nullable(string()),
    durationMs: nullable(number()),
});

export const syncStatusResponse = object({
    data: nullable(syncStatusData),
    meta: paginationMeta,
});

export const location = object({
    villageName: nullable(string()),
    cellName: nullable(string()),
    sectorName: nullable(string()),
    districtName: nullable(string()),
    provinceName: nullable(string()),
});

export const schoolSummary = object({
    schoolCode: string(),
    regionCode: nullable(string()),
    schoolName: string(),
    location,
    isActive: nullable(string()),
    schoolStatus: nullable(string()),
    academicYear: nullable(string()),
});

export const classGroup = object({
    classGroupId: string(),
    classGroupName: nullable(string()),
});

export const grade = object({
    gradeCode: string(),
    gradeName: nullable(string()),
    classGroups: array(classGroup),
});

export const combination = object({
    combinationCode: string(),
    combinationName: nullable(string()),
    description: nullable(string()),
    grades: array(grade),
});

export const level = object({
    levelId: string(),
    levelName: nullable(string()),
    description: nullable(string()),
    combinations: array(combination),
});

export const school = object({
    schoolCode: string(),
    regionCode: nullable(string()),
    schoolName: string(),
    location,
    isActive: nullable(string()),
    establishmentDate: nullable(string()),
    deactivatedDate: nullable(string()),
    gpsLong: nullable(number()),
    gpsLat: nullable(number()),
    academicYear: nullable(string()),
    schoolCategory: nullable(string()),
    schoolStatus: nullable(string()),
    currentAcademicYear: nullable(string()),
    levels: array(level),
});

export const schoolDetailResponse = object({
    data: school,
    meta: paginationMeta,
});

export const errorResponse = object({
    error: object({
        code: string(),
        message: string(),
        statusCode: number(),
    }),
});

export const studentSummary = object({
    studentNumber: string(),
    names: string(),
    gender: nullable(string()),
    schoolCode: string(),
    schoolName: string(),
    classGroup: nullable(string()),
    status: nullable(string()),
});

export const student = object({
    studentNumber: string(),
    names: string(),
    gender: nullable(string()),
    dateOfBirth: nullable(string()),
    schoolCode: string(),
    schoolName: string(),
    levelName: nullable(string()),
    combinationName: nullable(string()),
    gradeName: nullable(string()),
    classGroup: nullable(string()),
    combinationUID: nullable(string()),
    studyLevel: nullable(string()),
    classGrade: nullable(string()),
    parentGuardianNationalId: nullable(string()),
    parentGuardianName: nullable(string()),
    address: nullable(string()),
    emergencyContactPerson: nullable(string()),
    emergencyContactNumber: nullable(string()),
    status: nullable(string()),
    registrationDate: nullable(string()),
    inactiveReason: nullable(string()),
    currentAcademicYear: nullable(string()),
    divisionType: nullable(string()),
    weightedPercent: nullable(number()),
});

export const studentDetailResponse = object({
    data: student,
    meta: paginationMeta,
});

export const staffSummary = object({
    staffNumber: string(),
    names: string(),
    position: nullable(string()),
    schoolCode: string(),
    schoolName: string(),
    gender: nullable(string()),
});

export const staffSpeciality = object({
    levelId: nullable(string()),
    level: nullable(string()),
    gradeCode: nullable(string()),
    gradeName: nullable(string()),
    combinationCode: nullable(string()),
    combination: nullable(string()),
    subjectCode: nullable(string()),
    subject: nullable(string()),
    classGroup: nullable(string()),
});

export const staff = object({
    staffNumber: string(),
    names: string(),
    position: nullable(string()),
    schoolCode: string(),
    schoolName: string(),
    gender: nullable(string()),
    officialDocumentId: nullable(string()),
    mobilePhoneNumber: nullable(string()),
    employmentStatus: nullable(string()),
    employmentStartDate: nullable(string()),
    companyEmail: nullable(string()),
    employmentEndDate: nullable(string()),
    currentAcademicYear: nullable(string()),
    specialities: array(staffSpeciality),
});

export const staffDetailResponse = object({
    data: staff,
    meta: paginationMeta,
});

export type Meta = Infer<typeof paginationMeta>;
