import React from 'react';
import { Stats } from '../types';
import { formatToPersianNumbers } from '../utils/dateUtils';

interface StatsCardsProps {
  stats: Stats | null;
  filteredCount: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats, filteredCount }) => {
  const totalReports = stats?.totalReports || 0;
  const totalHours = stats?.totalHours || 0;
  const approvedCount = stats?.statusCount?.['APPROVED'] || 0;
  const inReviewCount = (stats?.statusCount?.['SUBMITTED'] || 0) + (stats?.statusCount?.['REVIEWING'] || 0);

  // Percentages for Bento progress bars
  const approvedPercent = totalReports > 0 ? Math.min(100, Math.round((approvedCount / totalReports) * 100)) : 0;
  const inReviewPercent = totalReports > 0 ? Math.min(100, Math.round((inReviewCount / totalReports) * 100)) : 0;
  const totalReportsPercent = totalReports > 0 ? 80 : 0;
  const hoursPercent = totalHours > 0 ? Math.min(100, Math.round((totalHours / 40) * 100)) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6" id="stats-overview">
      {/* 1. Total Reports */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500 font-medium">کل گزارش‌ها</p>
          <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold">مجموع</span>
        </div>
        <p className="text-3xl font-bold text-slate-900 mt-2">
          {formatToPersianNumbers(totalReports)}
        </p>
        <div className="mt-4 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 transition-all duration-500"
            style={{ width: `${totalReportsPercent}%` }}
          />
        </div>
      </div>

      {/* 2. In Review */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500 font-medium">در حال بررسی</p>
          <span className="text-[11px] px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-bold">جاری</span>
        </div>
        <p className="text-3xl font-bold text-slate-900 mt-2">
          {formatToPersianNumbers(inReviewCount)}
        </p>
        <div className="mt-4 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-400 transition-all duration-500"
            style={{ width: `${inReviewPercent || 15}%` }}
          />
        </div>
      </div>

      {/* 3. Approved / Finalized */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500 font-medium">نهایی و تایید شده</p>
          <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">تکمیل</span>
        </div>
        <p className="text-3xl font-bold text-slate-900 mt-2">
          {formatToPersianNumbers(approvedCount)}
        </p>
        <div className="mt-4 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${approvedPercent || 10}%` }}
          />
        </div>
      </div>

      {/* 4. Total Hours Spent */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500 font-medium">مجموع ساعات کاری</p>
          <span className="text-[11px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold">زمان</span>
        </div>
        <div className="flex items-baseline gap-1.5 mt-2">
          <span className="text-3xl font-bold text-slate-900">
            {formatToPersianNumbers(totalHours)}
          </span>
          <span className="text-xs text-slate-400">ساعت</span>
        </div>
        <div className="mt-4 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${hoursPercent || 25}%` }}
          />
        </div>
      </div>
    </div>
  );
};
