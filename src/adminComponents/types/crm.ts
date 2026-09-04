export type LeadSource =
  | "WhatsApp"
  | "Google"
  | "Facebook"
  | "Instagram"
  | "Referral"
  | "Existing Parent"
  | "Walk-in"
  | "Other";

export type LeadStatus =
  | "New Lead"
  | "Contacted"
  | "Teacher Searching"
  | "Teacher Shortlisted"
  | "Demo Scheduled"
  | "Demo Running"
  | "Demo Completed"
  | "Parent Decision Pending"
  | "Confirmed"
  | "Registration Pending"
  | "Tuition Started"
  | "Not Interested"
  | "Cancelled";

export type TeacherStatus = "Available" | "Demo" | "Active Tuition" | "Inactive" | "Shortlisted";

export type DemoDayStatus = "Pending" | "Completed" | "Cancelled" | "Rescheduled";

export type ParentFeedback =
  | "Very Satisfied"
  | "Satisfied"
  | "Average"
  | "Not Satisfied"
  | "Needs Discussion";

export type TeacherFeedback =
  | "Good"
  | "Average"
  | "Difficult"
  | "Student Needs Support"
  | "Other";

export type FinalResult =
  | "Confirmed"
  | "Decision Pending"
  | "Not Interested"
  | "Wants Another Teacher"
  | "Wants More Discussion";

export type FollowUpType =
  | "New Lead"
  | "Demo Follow-up"
  | "Demo Confirmation"
  | "Registration Fee"
  | "Teacher Commission"
  | "Parent Decision Follow-up"
  | "Other";

export interface Lead {
  id: string;
  enquiryDate: string;
  parentName: string;
  parentContact: string;
  studentName: string;
  studentClass: string;
  school: string;
  location: string;
  subjectRequired: string;
  preferredTiming: string;
  preferredDays: string;
  teacherPreference: string;
  expectedMonthlyFee: number;
  leadSource: LeadSource;
  status: LeadStatus;
  assignedTeacherId?: string;
  assignedTeacherName?: string;
  demoId?: string;
  tuitionId?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Teacher {
  id: string;
  name: string;
  contact: string;
  contactNumber?: string;
  email?: string;
  gender?: "Male" | "Female" | "Other";
  qualification: string;
  graduation?: string;
  postGraduation?: string;
  board?: string;
  teachingExperienceYears?: number;
  classes?: string[];
  classesTaught?: string[];
  subjects: string[];
  areasCovered: string[];
  preferredTimings?: string;
  preferredTiming?: string;
  experience?: string;
  expectedNegotiatedFee?: number;
  expectedFee?: number;
  availability?: string;
  demoReadiness?: "Ready" | "Needs Notice";
  status: TeacherStatus;
  activeStudentsCount?: number;
  totalCommissionsPaid?: number;
  rating?: number;
  remarks?: string;
  notes?: string;
}

export interface Demo {
  id: string;
  leadId: string;
  parentName: string;
  studentName: string;
  teacherId: string;
  teacherName: string;
  startDate: string;
  endDate: string;
  timing: string;
  day1Status: DemoDayStatus;
  day2Status: DemoDayStatus;
  day3Status: DemoDayStatus;
  parentFeedback?: ParentFeedback;
  teacherFeedback?: TeacherFeedback;
  finalResult?: FinalResult;
  followUpDate?: string;
  remarks?: string;
}

export interface ActiveTuition {
  id: string;
  leadId: string;
  studentName: string;
  parentName: string;
  parentContact: string;
  studentClass: string;
  school: string;
  subject: string;
  location: string;
  teacherId: string;
  teacherName: string;
  teacherContact: string;
  tuitionStartDate: string;
  monthlyTuitionFee: number;
  firstMonthFee: number;
  teacherCommission: number;
  registrationStatus: string;
  teacherCommissionStatus: string;
  tuitionStatus: string;
  nextFollowUp?: string;
  remarks?: string;
}

export interface TuitionPayment {
  id: string;
  leadId: string;
  tuitionId?: string;
  parentName: string;
  studentName: string;
  amountDue: number;
  amountPaid: number;
  balance: number;
  dueDate: string;
  paymentDate?: string;
  paymentMethod?: string;
  transactionRef?: string;
  status: string;
  remindersSentCount: number;
  lastReminderDate?: string;
  remarks?: string;
}

export interface TeacherCommission {
  id: string;
  teacherId: string;
  teacherName: string;
  studentName: string;
  tuitionId: string;
  leadId: string;
  firstMonthFee: number;
  commissionPercentage: number;
  commissionAmount: number;
  amountPaid: number;
  balance: number;
  dueDate: string;
  paymentDate?: string;
  paymentMethod?: string;
  transactionId?: string;
  status: string;
  remindersSentCount: number;
  lastReminderDate?: string;
  remarks?: string;
}

export interface FollowUp {
  id: string;
  dateCreated: string;
  dueDate: string;
  leadId?: string;
  tuitionId?: string;
  studentName?: string;
  parentName: string;
  contactNumber: string;
  teacherName?: string;
  assignedTeacherName?: string;
  followUpType: FollowUpType;
  priority?: "High" | "Medium" | "Low";
  status: "Pending" | "Completed";
  lastContactDate?: string;
  nextAction: string;
  remarks?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  entityType: string;
  entityId: string;
  user: string;
  action: string;
  oldValue?: string;
  newValue?: string;
  note?: string;
}
