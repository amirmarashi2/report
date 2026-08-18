import React from 'react';
import { Calendar, Clock, User, Eye, Edit3, Trash2, Tag, CheckCircle2, Clock3, AlertCircle } from 'lucide-react';
import { Report, Priority, Status } from '../types';
import { formatToPersianDate, formatToPersianNumbers } from '../utils/dateUtils';

interface ReportCardProps {
  report: Report;
  onView: (report: Report) => void;
  onEdit: (report: Report) => void;
  onDelete: (id: number) => void;
  onStatusToggle: (report: Report, newStatus: Status) => void;
}

const priorityBadges: Record<Priority, { label: string; bg: string; text: string }> = {
  URGENT: { label: 'فوری', bg: 'bg-rose-100 text-rose-700', text: 'text-rose-700' },
  HIGH: { label: 'بالا', bg: 'bg-orange-100 text-orange-700', text: 'text-orange-700' },
  MEDIUM: { label: 'متوسط', bg: 'bg-blue-100 text-blue-700', text: 'text-blue-700' },
  LOW: { label: 'پایین', bg: 'bg-slate-100 text-slate-600', text: 'text-slate-600' }
};

const statusBadges: Record<Status, { label: string; bg: string; text: string }> = {
  APPROVED: { label: 'نهایی شده', bg: 'bg-emerald-100 text-emerald-700', text: 'text-emerald-700' },
  SUBMITTED: { label: 'ثبت شده', bg: 'bg-indigo-100 text-indigo-700', text: 'text-indigo-700' },
  REVIEWING: { label: 'در حال بررسی', bg: 'bg-amber-100 text-amber-700', text: 'text-amber-700' },
  DRAFT: { label: 'پیش‌نویس', bg: 'bg-slate-100 text-slate-700', text: 'text-slate-700' },
  ARCHIVED: { label: 'بایگانی', bg: 'bg-zinc-100 text-zinc-600', text: 'text-zinc-600' }
};

const categoryEmojis: Record<string, string> = {
  'روزانه': '📝',
  'پروژه': '📊',
  'فنی': '⚙️',
  'جلسه': '👥',
  'مالی': '💳',
  'هفتگی': '📅',
  'سایر': '📄'
};

export const ReportCard: React.FC<ReportCardProps> = ({
  report,
  onView,
  onEdit,
  onDelete,
  onStatusToggle
}) => {
  const priorityInfo = priorityBadges[report.priority] || priorityBadges.MEDIUM;
  const statusInfo = statusBadges[report.status] || statusBadges.SUBMITTED;
  const emoji = categoryEmojis[report.category] || '📄';

  const tagList = report.tags
    ? report.tags.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <div
      id={`report-card-${report.id}`}
      className="p-4 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 transition-all group flex flex-col justify-between gap-3 shadow-2xs hover:shadow-xs"
    >
      <div>
        {/* Top bar with category & status */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-slate-200 text-lg shadow-2xs shrink-0">
              {emoji}
            </div>
            <div>
              <h4
                onClick={() => onView(report)}
                className="text-sm font-bold text-slate-900 cursor-pointer hover:text-indigo-600 transition-colors line-clamp-1"
              >
                {report.title}
              </h4>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                <span>توسط {report.author}</span>
                <span>•</span>
                <span>{formatToPersianDate(report.reportDate)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className={`px-2 py-1 text-[10px] font-bold rounded ${statusInfo.bg}`}>
              {statusInfo.label}
            </span>
          </div>
        </div>

        {/* Summary */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed px-1 my-2">
          {report.summary || report.content}
        </p>

        {/* Tags */}
        {tagList.length > 0 && (
          <div className="flex flex-wrap gap-1 px-1">
            {tagList.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600 font-medium"
              >
                <Tag className="w-2.5 h-2.5 text-slate-400" />
                {tag}
              </span>
            ))}
            {tagList.length > 3 && (
              <span className="text-[10px] text-slate-400 self-center">
                +{formatToPersianNumbers(tagList.length - 3)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer info & actions */}
      <div className="pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${priorityInfo.bg}`}>
            {priorityInfo.label}
          </span>
          {report.hoursSpent > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
              <Clock className="w-3 h-3 text-amber-500" />
              <span>{formatToPersianNumbers(report.hoursSpent)} س</span>
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onView(report)}
            title="مشاهده جزئیات"
            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onEdit(report)}
            title="ویرایش گزارش"
            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(report.id)}
            title="حذف گزارش"
            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
