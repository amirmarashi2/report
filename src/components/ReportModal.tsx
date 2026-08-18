import React, { useState, useEffect } from 'react';
import { X, Save, Clock, Tag, Calendar, User, AlignLeft, AlertCircle, FileText, Check } from 'lucide-react';
import { Report, ReportFormData, Priority, Status, Category } from '../types';
import { getTodayDateString } from '../utils/dateUtils';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: ReportFormData, reportId?: number) => Promise<void>;
  editingReport: Report | null;
  isSubmitting: boolean;
}

const defaultCategories: Category[] = ['روزانه', 'پروژه', 'فنی', 'جلسه', 'مالی', 'هفتگی', 'سایر'];
const priorities: { key: Priority; label: string }[] = [
  { key: 'LOW', label: 'پایین' },
  { key: 'MEDIUM', label: 'متوسط' },
  { key: 'HIGH', label: 'بالا' },
  { key: 'URGENT', label: 'فوری' }
];

const statuses: { key: Status; label: string }[] = [
  { key: 'SUBMITTED', label: 'ثبت شده' },
  { key: 'APPROVED', label: 'تایید شده' },
  { key: 'REVIEWING', label: 'در حال بررسی' },
  { key: 'DRAFT', label: 'پیش‌نویس' }
];

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingReport,
  isSubmitting
}) => {
  const [formData, setFormData] = useState<ReportFormData>({
    title: '',
    author: 'کاربر سیستم',
    category: 'روزانه',
    priority: 'MEDIUM',
    status: 'SUBMITTED',
    reportDate: getTodayDateString(),
    hoursSpent: 4,
    summary: '',
    content: '',
    blockers: '',
    nextSteps: '',
    tags: ''
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingReport) {
      setFormData({
        title: editingReport.title,
        author: editingReport.author || 'کاربر سیستم',
        category: editingReport.category || 'روزانه',
        priority: editingReport.priority || 'MEDIUM',
        status: editingReport.status || 'SUBMITTED',
        reportDate: editingReport.reportDate || getTodayDateString(),
        hoursSpent: editingReport.hoursSpent || 0,
        summary: editingReport.summary || '',
        content: editingReport.content || '',
        blockers: editingReport.blockers || '',
        nextSteps: editingReport.nextSteps || '',
        tags: editingReport.tags || ''
      });
    } else {
      setFormData({
        title: '',
        author: 'کاربر سیستم',
        category: 'روزانه',
        priority: 'MEDIUM',
        status: 'SUBMITTED',
        reportDate: getTodayDateString(),
        hoursSpent: 4,
        summary: '',
        content: '',
        blockers: '',
        nextSteps: '',
        tags: ''
      });
    }
    setError(null);
  }, [editingReport, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('لطفاً عنوان گزارش را وارد نمایید.');
      return;
    }
    if (!formData.reportDate) {
      setError('لطفاً تاریخ گزارش را انتخاب کنید.');
      return;
    }

    try {
      setError(null);
      await onSubmit(formData, editingReport ? editingReport.id : undefined);
      onClose();
    } catch (err: any) {
      setError(err.message || 'خطا در ذخیره گزارش در پایگاه داده SQLite');
    }
  };

  const handleTagAdd = (sampleTag: string) => {
    const currentTags = formData.tags ? formData.tags.split(',').map(t => t.trim()) : [];
    if (!currentTags.includes(sampleTag)) {
      currentTags.push(sampleTag);
      setFormData({ ...formData, tags: currentTags.join(', ') });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {editingReport ? 'ویرایش گزارش کاری' : 'ثبت گزارش جدید'}
              </h2>
              <p className="text-xs text-slate-500">ذخیره‌سازی مستقیم در پایگاه داده SQLite از طریق Prisma</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              عنوان گزارش <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="مثال: گزارش روزانه پیاده‌سازی ماژول پرداخت و تست سرور"
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
            />
          </div>

          {/* Category, Date & Author Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">دسته‌بندی</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
              >
                {defaultCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">تاریخ</label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.reportDate}
                  onChange={(e) => setFormData({ ...formData, reportDate: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
                />
              </div>
            </div>

            {/* Author */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">گزارش‌دهنده</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="نام شما یا مسئول"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
              />
            </div>
          </div>

          {/* Priority, Status & Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Priority */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">اولویت</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
              >
                {priorities.map((p) => (
                  <option key={p.key} value={p.key}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">وضعیت</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Status })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
              >
                {statuses.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Hours spent */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ساعت کاری صرف شده: <span className="text-indigo-600 font-bold">{formData.hoursSpent}</span>
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="24"
                value={formData.hoursSpent}
                onChange={(e) => setFormData({ ...formData, hoursSpent: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
              />
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">خلاصه کلیدی گزارش</label>
            <input
              type="text"
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="یک یا دو جمله خلاصه از مهم‌ترین دستاورد..."
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              شرح کامل اقدامات و گزارش <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="شرح جزئیات کارهای انجام شده، تصمیمات اتخاذ شده و خروجی‌های به‌دست آمده..."
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 leading-relaxed"
            />
          </div>

          {/* Blockers & Next Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">موانع و چالش‌ها (اختیاری)</label>
              <textarea
                rows={2}
                value={formData.blockers}
                onChange={(e) => setFormData({ ...formData, blockers: e.target.value })}
                placeholder="مواردی که مانع پیشرفت شدند یا نیاز به پیگیری دارند..."
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">برنامه و اقدامات بعدی (اختیاری)</label>
              <textarea
                rows={2}
                value={formData.nextSteps}
                onChange={(e) => setFormData({ ...formData, nextSteps: e.target.value })}
                placeholder="کارهای برنامه‌ریزی شده برای فردا یا مرحله بعد..."
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">برچسب‌ها (با کاما جدا کنید)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="مثال: توسعه, باگ, فرانت‌اند, تست"
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 mb-2"
            />
            {/* Quick suggested tags */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-slate-400">پیشنهادی:</span>
              {['توسعه', 'جلسه', 'باگ', 'داکیومنت', 'امنیت', 'فرانت‌اند', 'بک‌اند', 'تست'].map((tg) => (
                <button
                  type="button"
                  key={tg}
                  onClick={() => handleTagAdd(tg)}
                  className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  +{tg}
                </button>
              ))}
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            انصراف
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-xs transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'در حال ذخیره‌سازی...' : (editingReport ? 'بروزرسانی گزارش' : 'ثبت و ذخیره')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
