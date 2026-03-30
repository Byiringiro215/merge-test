import { z } from "zod/v4";

// Pagination meta schema
export const paginationMeta = z.object({
  source: z.string(),
  strategy: z.string(),
  syncedAt: z.string().nullable(),
  page: z
    .object({ current: z.number(), limit: z.number(), total: z.number() })
    .optional(),
});

// Helper to create paginated response schemas
export const createPaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) => {
  return z.object({
    data: z.array(itemSchema),
    meta: paginationMeta,
  });
};

// Health check
export const healthResponse = z
  .object({ status: z.string(), timestamp: z.string() });

// Sync responses
export const syncTriggerResponse = z
  .object({
    data: z.object({ message: z.string() }),
    meta: z.object({ source: z.string() }),
  });

export const syncStatusData = z.object({
  id: z.number(),
  source: z.string(),
  entity: z.string(),
  status: z.string(),
  recordsFetched: z.number().nullable(),
  recordsUpserted: z.number().nullable(),
  errorMessage: z.string().nullable(),
  startedAt: z.string(),
  completedAt: z.string().nullable(),
  durationMs: z.number().nullable(),
});

export const syncStatusResponse = z.object({
  data: syncStatusData.nullable(),
  meta: paginationMeta,
});

// Location
export const location = z.object({
  villageName: z.string().nullable(),
  cellName: z.string().nullable(),
  sectorName: z.string().nullable(),
  districtName: z.string().nullable(),
  provinceName: z.string().nullable(),
});

// School schemas
export const schoolSummary = z.object({
  schoolCode: z.string(),
  regionCode: z.string().nullable(),
  schoolName: z.string(),
  location: location,
  isActive: z.string().nullable(),
  schoolStatus: z.string().nullable(),
  academicYear: z.string().nullable(),
});

export const classGroup = z.object({
  classGroupId: z.string(),
  classGroupName: z.string().nullable(),
});

export const grade = z.object({
  gradeCode: z.string(),
  gradeName: z.string().nullable(),
  classGroups: z.array(classGroup),
});

export const combination = z.object({
  combinationCode: z.string(),
  combinationName: z.string().nullable(),
  description: z.string().nullable(),
  grades: z.array(grade),
});

export const level = z.object({
  levelId: z.string(),
  levelName: z.string().nullable(),
  description: z.string().nullable(),
  combinations: z.array(combination),
});

export const school = z.object({
  schoolCode: z.string(),
  regionCode: z.string().nullable(),
  schoolName: z.string(),
  location: location,
  isActive: z.string().nullable(),
  establishmentDate: z.string().nullable(),
  deactivatedDate: z.string().nullable(),
  gpsLong: z.number().nullable(),
  gpsLat: z.number().nullable(),
  academicYear: z.string().nullable(),
  schoolCategory: z.string().nullable(),
  schoolStatus: z.string().nullable(),
  currentAcademicYear: z.string().nullable(),
  levels: z.array(level),
});

export const schoolDetailResponse = z.object({
  data: school,
  meta: paginationMeta,
});

// Error response
export const errorResponse = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    statusCode: z.number(),
  }),
});

// Student schemas
export const studentSummary = z.object({
  studentNumber: z.string(),
  names: z.string(),
  gender: z.string().nullable(),
  schoolCode: z.string(),
  schoolName: z.string(),
  classGroup: z.string().nullable(),
  status: z.string().nullable(),
});

export const student = z.object({
  studentNumber: z.string(),
  names: z.string(),
  gender: z.string().nullable(),
  dateOfBirth: z.string().nullable(),
  schoolCode: z.string(),
  schoolName: z.string(),
  levelName: z.string().nullable(),
  combinationName: z.string().nullable(),
  gradeName: z.string().nullable(),
  classGroup: z.string().nullable(),
  combinationUID: z.string().nullable(),
  studyLevel: z.string().nullable(),
  classGrade: z.string().nullable(),
  parentGuardianNationalId: z.string().nullable(),
  parentGuardianName: z.string().nullable(),
  address: z.string().nullable(),
  emergencyContactPerson: z.string().nullable(),
  emergencyContactNumber: z.string().nullable(),
  status: z.string().nullable(),
  registrationDate: z.string().nullable(),
  inactiveReason: z.string().nullable(),
  currentAcademicYear: z.string().nullable(),
  divisionType: z.string().nullable(),
  weightedPercent: z.number().nullable(),
});

export const studentDetailResponse = z.object({
  data: student,
  meta: paginationMeta,
});

// Staff schemas
export const staffSummary = z.object({
  staffNumber: z.string(),
  names: z.string(),
  position: z.string().nullable(),
  schoolCode: z.string(),
  schoolName: z.string(),
  gender: z.string().nullable(),
});

export const staffSpeciality = z.object({
  levelId: z.string().nullable(),
  level: z.string().nullable(),
  gradeCode: z.string().nullable(),
  gradeName: z.string().nullable(),
  combinationCode: z.string().nullable(),
  combination: z.string().nullable(),
  subjectCode: z.string().nullable(),
  subject: z.string().nullable(),
  classGroup: z.string().nullable(),
});

export const staff = z.object({
  staffNumber: z.string(),
  names: z.string(),
  position: z.string().nullable(),
  schoolCode: z.string(),
  schoolName: z.string(),
  gender: z.string().nullable(),
  officialDocumentId: z.string().nullable(),
  mobilePhoneNumber: z.string().nullable(),
  employmentStatus: z.string().nullable(),
  employmentStartDate: z.string().nullable(),
  companyEmail: z.string().nullable(),
  employmentEndDate: z.string().nullable(),
  currentAcademicYear: z.string().nullable(),
  specialities: z.array(staffSpeciality),
});

export const staffDetailResponse = z.object({
  data: staff,
  meta: paginationMeta,
});

export type Meta = z.infer<typeof paginationMeta>;