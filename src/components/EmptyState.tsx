import React from 'react';
import { FilePlus, RefreshCcw } from 'lucide-react';

interface EmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
  onOpenCreate: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  hasFilters,
  onClearFilters,
  onOpenCreate
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-2xs my-6">
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
        <FilePlus className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-slate-800 mb-1">
        {hasFilters ? 'گزارشی با فیلترهای انتخابی یافت نشد' : 'هنوز هیچ گزارشی ثبت نشده است'}
      </h3>
      <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
        {hasFilters
          ? 'می‌توانید فیلترهای جستجو را پاک کنید یا گزارش جدیدی با این مشخصات اضافه کنید.'
          : 'برای شروع، روی دکمه «ثبت اولین گزارش» کلیک کنید تا اولین گزارش در پایگاه داده SQLite ذخیره شود.'}
      </p>
      <div className="flex items-center justify-center gap-3">
        {hasFilters && (
          <button
            onClick={onClearFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <RefreshCcw className="w-4 h-4" />
            <span>پاکسازی فیلترها</span>
          </button>
        )}
        <button
          onClick={onOpenCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
        >
          <FilePlus className="w-4 h-4" />
          <span>ثبت گزارش جدید</span>
        </button>
      </div>
    </div>
  );
};
