export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type Status = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REVIEWING' | 'ARCHIVED';
export type Category = 'روزانه' | 'پروژه' | 'فنی' | 'جلسه' | 'مالی' | 'هفتگی' | 'سایر';

export interface Report {
  id: number;
  title: string;
  author: string;
  category: string;
  priority: Priority;
  status: Status;
  reportDate: string;
  hoursSpent: number;
  summary: string;
  content: string;
  blockers?: string | null;
  nextSteps?: string | null;
  tags: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportFormData {
  title: string;
  author: string;
  category: string;
  priority: Priority;
  status: Status;
  reportDate: string;
  hoursSpent: number;
  summary: string;
  content: string;
  blockers: string;
  nextSteps: string;
  tags: string;
}

export type CreateReportInput = ReportFormData;

export interface Stats {
  totalReports: number;
  totalHours: number;
  categoryCount: Record<string, number>;
  priorityCount: Record<string, number>;
  statusCount: Record<string, number>;
}
