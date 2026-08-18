import React from 'react';
import { X, Calendar, Clock, User, Tag, Edit3, Trash2, Printer, CheckCircle, AlertTriangle, ArrowRight, Share2, Copy, Check } from 'lucide-react';
import { Report, Status, Priority } from '../types';
import { formatToPersianDate, formatToPersianNumbers } from '../utils/dateUtils';

interface ReportDetailModalProps {
  report: Report | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (report: Report) => void;
  onDelete: (id: number) => void;
  onStatusChange: (report: Report, newStatus: Status) => void;
}

const priorityBadges: Record<Priority, { label: string; bg: string; text: string }> = {
  URGENT: { label: 'فوری', bg: 'bg-rose-100 text-rose-800 border-rose-200', text: 'text-rose-700' },
  HIGH: { label: 'بالا', bg: 'bg-orange-100 text-orange-800 border-orange-200', text: 'text-orange-700' },
  MEDIUM: { label: 'متوسط', bg: 'bg-blue-100 text-blue-800 border-blue-200', text: 'text-blue-700' },
  LOW: { label: 'پایین', bg: 'bg-slate-100 text-slate-700 border-slate-200', text: 'text-slate-600' }
};

const statusBadges: Record<Status, { label: string; bg: string; text: string }> = {
  APPROVED: { label: 'تایید شده', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300', text: 'text-emerald-700' },
  SUBMITTED: { label: 'ثبت شده', bg: 'bg-indigo-100 text-indigo-800 border-indigo-300', text: 'text-indigo-700' },
  REVIEWING: { label: 'در حال بررسی', bg: 'bg-amber-100 text-amber-800 border-amber-300', text: 'text-amber-700' },
  DRAFT: { label: 'پیش‌نویس', bg: 'bg-slate-200 text-slate-800 border-slate-300', text: 'text-slate-700' },
  ARCHIVED: { label: 'بایگانی', bg: 'bg-zinc-200 text-zinc-700 border-zinc-300', text: 'text-zinc-600' }
};

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  report,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onStatusChange
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !report) return null;

  const priorityInfo = priorityBadges[report.priority] || priorityBadges.MEDIUM;
  const statusInfo = statusBadges[report.status] || statusBadges.SUBMITTED;

  const tagList = report.tags
    ? report.tags.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  const handleCopyText = () => {
    const textToCopy = `📋 ${report.title}
تاریخ: ${formatToPersianDate(report.reportDate)} (${report.reportDate})
نویسنده: ${report.author}
دسته‌بندی: ${report.category} | اولویت: ${priorityInfo.label} | ساعت صرف شده: ${report.hoursSpent}

خلاصه:
${report.summary || '-'}

شرح کامل:
${report.content}

${report.blockers ? `موانع و چالش‌ها:\n${report.blockers}\n` : ''}
${report.nextSteps ? `اقدامات بعدی:\n${report.nextSteps}\n` : ''}
`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 print:max-w-none print:shadow-none print:border-none">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 print:hidden">
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2.5 py-1 rounded-md font-semibold border ${priorityInfo.bg}`}>
              اولویت: {priorityInfo.label}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-md font-semibold bg-slate-200 text-slate-800">
              دسته: {report.category}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyText}
              title="کپی متن گزارش"
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors inline-flex items-center gap-1 text-xs"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'کپی شد' : 'کپی'}</span>
            </button>
            <button
              onClick={handlePrint}
              title="چاپ یا ذخیره PDF"
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Title & Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <h1 className="text-xl font-bold text-slate-900 leading-snug">
              {report.title}
            </h1>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-3 py-1 rounded-full font-bold border ${statusInfo.bg}`}>
                {statusInfo.label}
              </span>
            </div>
          </div>

          {/* Meta Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">نویسنده:</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-500" />
                {report.author}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">تاریخ ثبت:</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                {formatToPersianDate(report.reportDate)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">ساعت کار صرف‌شده:</span>
              <span className="font-semibold text-indigo-600 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {formatToPersianNumbers(report.hoursSpent)} ساعت
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">شناسه در دیتابیس:</span>
              <span className="font-mono font-medium text-slate-600">
                #{report.id}
              </span>
            </div>
          </div>

          {/* Summary Box */}
          {report.summary && (
            <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-xl">
              <h4 className="text-xs font-bold text-indigo-900 mb-1">خلاصه کلیدی:</h4>
              <p className="text-sm text-indigo-950 leading-relaxed font-medium">
                {report.summary}
              </p>
            </div>
          )}

          {/* Full Content */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 mb-2">شرح کامل اقدامات و گزارش:</h4>
            <div className="p-4 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
              {report.content}
            </div>
          </div>

          {/* Blockers & Next Steps */}
          {(report.blockers || report.nextSteps) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {report.blockers && (
                <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-xl">
                  <h4 className="text-xs font-bold text-rose-800 flex items-center gap-1 mb-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    موانع و چالش‌ها
                  </h4>
                  <p className="text-xs sm:text-sm text-rose-950 leading-relaxed whitespace-pre-wrap">
                    {report.blockers}
                  </p>
                </div>
              )}
              {report.nextSteps && (
                <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                  <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-1 mb-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    برنامه و اقدامات بعدی
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed whitespace-pre-wrap">
                    {report.nextSteps}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          {tagList.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-500 mb-2">برچسب‌ها:</h4>
              <div className="flex flex-wrap gap-1.5">
                {tagList.map((tag, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    <Tag className="w-3 h-3 text-slate-400" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between print:hidden">
          {/* Status Quick Changer */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span>تغییر وضعیت:</span>
            {(['SUBMITTED', 'APPROVED', 'REVIEWING', 'DRAFT'] as Status[]).map((st) => (
              <button
                key={st}
                onClick={() => onStatusChange(report, st)}
                disabled={report.status === st}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  report.status === st
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {statusBadges[st]?.label || st}
              </button>
            ))}
          </div>

          {/* Edit & Delete Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(report);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Edit3 className="w-4 h-4 text-slate-600" />
              <span>ویرایش</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onDelete(report.id);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>حذف</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
