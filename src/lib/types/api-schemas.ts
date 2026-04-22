import type { FSchema, Infer } from '@bajustone/fetcher/schema';
import * as s from '@bajustone/fetcher/schema';

export const paginationMeta = s.object({
    source: s.string(),
    strategy: s.string(),
    syncedAt: s.nullable(s.string()),
    page: s.optional(
        s.object({ current: s.number(), limit: s.number(), total: s.number() }),
    ),
});

export function createPaginatedResponseSchema<T extends FSchema<unknown>>(itemSchema: T) {
    return s.object({
        data: s.array(itemSchema),
        meta: paginationMeta,
    });
}

export const healthResponse = s.object({
    status: s.string(),
    timestamp: s.string(),
});

export const syncTriggerResponse = s.object({
    data: s.object({ message: s.string() }),
    meta: s.object({ source: s.string() }),
});

export const syncStatusData = s.object({
    id: s.number(),
    source: s.string(),
    entity: s.string(),
    status: s.string(),
    recordsFetched: s.nullable(s.number()),
    recordsUpserted: s.nullable(s.number()),
    errorMessage: s.nullable(s.string()),
    startedAt: s.string(),
    completedAt: s.nullable(s.string()),
    durationMs: s.nullable(s.number()),
});

export const syncStatusResponse = s.object({
    data: s.nullable(syncStatusData),
    meta: paginationMeta,
});

export const location = s.object({
    villageName: s.nullable(s.string()),
    cellName: s.nullable(s.string()),
    sectorName: s.nullable(s.string()),
    districtName: s.nullable(s.string()),
    provinceName: s.nullable(s.string()),
});

export const schoolSummary = s.object({
    schoolCode: s.string(),
    regionCode: s.nullable(s.string()),
    schoolName: s.string(),
    location,
    isActive: s.nullable(s.string()),
    schoolStatus: s.nullable(s.string()),
    academicYear: s.nullable(s.string()),
});

export const classGroup = s.object({
    classGroupId: s.string(),
    classGroupName: s.nullable(s.string()),
});

export const grade = s.object({
    gradeCode: s.string(),
    gradeName: s.nullable(s.string()),
    classGroups: s.array(classGroup),
});

export const combination = s.object({
    combinationCode: s.string(),
    combinationName: s.nullable(s.string()),
    description: s.nullable(s.string()),
    grades: s.array(grade),
});

export const level = s.object({
    levelId: s.string(),
    levelName: s.nullable(s.string()),
    description: s.nullable(s.string()),
    combinations: s.array(combination),
});

export const school = s.object({
    schoolCode: s.string(),
    regionCode: s.nullable(s.string()),
    schoolName: s.string(),
    location,
    isActive: s.nullable(s.string()),
    establishmentDate: s.nullable(s.string()),
    deactivatedDate: s.nullable(s.string()),
    gpsLong: s.nullable(s.number()),
    gpsLat: s.nullable(s.number()),
    academicYear: s.nullable(s.string()),
    schoolCategory: s.nullable(s.string()),
    schoolStatus: s.nullable(s.string()),
    currentAcademicYear: s.nullable(s.string()),
    levels: s.array(level),
});

export const schoolDetailResponse = s.object({
    data: school,
    meta: paginationMeta,
});

export const errorResponse = s.object({
    error: s.object({
        code: s.string(),
        message: s.string(),
        statusCode: s.number(),
    }),
});

export const studentSummary = s.object({
    studentNumber: s.string(),
    names: s.string(),
    gender: s.nullable(s.string()),
    schoolCode: s.string(),
    schoolName: s.string(),
    classGroup: s.nullable(s.string()),
    status: s.nullable(s.string()),
});

export const student = s.object({
    studentNumber: s.string(),
    names: s.string(),
    gender: s.nullable(s.string()),
    dateOfBirth: s.nullable(s.string()),
    schoolCode: s.string(),
    schoolName: s.string(),
    levelName: s.nullable(s.string()),
    combinationName: s.nullable(s.string()),
    gradeName: s.nullable(s.string()),
    classGroup: s.nullable(s.string()),
    combinationUID: s.nullable(s.string()),
    studyLevel: s.nullable(s.string()),
    classGrade: s.nullable(s.string()),
    parentGuardianNationalId: s.nullable(s.string()),
    parentGuardianName: s.nullable(s.string()),
    address: s.nullable(s.string()),
    emergencyContactPerson: s.nullable(s.string()),
    emergencyContactNumber: s.nullable(s.string()),
    status: s.nullable(s.string()),
    registrationDate: s.nullable(s.string()),
    inactiveReason: s.nullable(s.string()),
    currentAcademicYear: s.nullable(s.string()),
    divisionType: s.nullable(s.string()),
    weightedPercent: s.nullable(s.number()),
});

export const studentDetailResponse = s.object({
    data: student,
    meta: paginationMeta,
});

export const staffSummary = s.object({
    staffNumber: s.string(),
    names: s.string(),
    position: s.nullable(s.string()),
    schoolCode: s.string(),
    schoolName: s.string(),
    gender: s.nullable(s.string()),
});

export const staffSpeciality = s.object({
    levelId: s.nullable(s.string()),
    level: s.nullable(s.string()),
    gradeCode: s.nullable(s.string()),
    gradeName: s.nullable(s.string()),
    combinationCode: s.nullable(s.string()),
    combination: s.nullable(s.string()),
    subjectCode: s.nullable(s.string()),
    subject: s.nullable(s.string()),
    classGroup: s.nullable(s.string()),
});

export const staff = s.object({
    staffNumber: s.string(),
    names: s.string(),
    position: s.nullable(s.string()),
    schoolCode: s.string(),
    schoolName: s.string(),
    gender: s.nullable(s.string()),
    officialDocumentId: s.nullable(s.string()),
    mobilePhoneNumber: s.nullable(s.string()),
    employmentStatus: s.nullable(s.string()),
    employmentStartDate: s.nullable(s.string()),
    companyEmail: s.nullable(s.string()),
    employmentEndDate: s.nullable(s.string()),
    currentAcademicYear: s.nullable(s.string()),
    specialities: s.array(staffSpeciality),
});

export const staffDetailResponse = s.object({
    data: staff,
    meta: paginationMeta,
});

export type Meta = Infer<typeof paginationMeta>;

// -- Admin / IAM schemas ------------------------------------------------------

export const userSchema = s.object({
    id: s.number(),
    email: s.email(),
    name: s.string({ minLength: 1 }),
    isActive: s.boolean(),
    emailVerified: s.optional(s.boolean()),
    createdAt: s.string(),
    updatedAt: s.string(),
});

export const roleSchema = s.object({
    id: s.number(),
    name: s.string(),
    description: s.optional(s.nullable(s.string())),
    isSystem: s.optional(s.boolean()),
});

export const permissionConditionSchema = s.object({
    field: s.optional(s.string()),
    operator: s.optional(s.enum_(['eq', 'neq', 'in', 'startsWith'] as const)),
    value: s.string(),
});

export const permissionSchema = s.object({
    id: s.number(),
    resource: s.string(),
    action: s.string(),
    effect: s.enum_(['ALLOW', 'DENY'] as const),
    conditions: s.optional(s.nullable(s.array(permissionConditionSchema))),
    description: s.optional(s.nullable(s.string())),
});

export const roleRequestSchema = s.object({
    name: s.string({ minLength: 1 }),
    permissions: s.refined(
        s.array(permissionSchema),
        v => v.length >= 1,
        'At least one permission is required',
    ),
    description: s.optional(s.string()),
});

export const groupSchema = s.object({
    id: s.number(),
    name: s.string(),
    description: s.optional(s.nullable(s.string())),
});

export const sessionSchema = s.object({
    id: s.number(),
    ipAddress: s.optional(s.nullable(s.string())),
    userAgent: s.optional(s.nullable(s.string())),
    deviceName: s.optional(s.nullable(s.string())),
    createdAt: s.string(),
    lastActiveAt: s.optional(s.nullable(s.string())),
});

// Admin list response wrappers
export const userListResponseSchema = s.object({
    users: s.array(userSchema),
    total: s.number(),
});
export const groupListResponseSchema = s.object({
    groups: s.array(groupSchema),
    total: s.number(),
});
export const roleListResponseSchema = s.array(roleSchema);
export const permissionListResponseSchema = s.array(permissionSchema);
export const sessionListResponseSchema = s.array(sessionSchema);

// Role with its full permission list
export const rolePermissionResponseSchema = s.object({
    id: s.number(),
    name: s.string(),
    permissions: s.array(permissionSchema),
    description: s.optional(s.nullable(s.string())),
    isSystem: s.optional(s.boolean()),
});
