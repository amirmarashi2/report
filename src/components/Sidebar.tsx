import React from 'react';
import { LayoutDashboard, FileText, Archive, AlertCircle, Database, CheckCircle2, Clock, Layers } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  totalReports: number;
  approvedCount: number;
  urgentCount: number;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  totalReports,
  approvedCount,
  urgentCount,
  isMobileOpen,
  onCloseMobile
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed lg:static top-0 bottom-0 right-0 z-40 w-64 bg-white border-l border-slate-200 flex flex-col p-6 space-y-6 transition-transform duration-200 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-xs shadow-indigo-200">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-slate-800 block">گزارش‌ساز</span>
            <span className="text-[11px] text-slate-400 block font-normal">سامانه ثبت و تحلیل کاری</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5" id="sidebar-nav">
          <button
            onClick={() => {
              onTabChange('all');
              onCloseMobile();
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              activeTab === 'all'
                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-4 h-4" />
              <span>پیشخوان و همه گزارش‌ها</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              activeTab === 'all' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-600'
            }`}>
              {totalReports}
            </span>
          </button>

          <button
            onClick={() => {
              onTabChange('approved');
              onCloseMobile();
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              activeTab === 'approved'
                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>گزارش‌های تایید شده</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium">
              {approvedCount}
            </span>
          </button>

          <button
            onClick={() => {
              onTabChange('urgent');
              onCloseMobile();
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              activeTab === 'urgent'
                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              <span>اولویت بالا و فوری</span>
            </div>
            {urgentCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-medium">
                {urgentCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              onTabChange('archive');
              onCloseMobile();
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              activeTab === 'archive'
                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <Archive className="w-4 h-4 text-slate-500" />
              <span>آرشیو گزارش‌ها</span>
            </div>
          </button>
        </nav>

        {/* Database & System Info in Bento style */}
        <div className="mt-auto p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">موتور ذخیره‌سازی</p>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-600" />
            <p className="text-xs text-slate-800 font-bold">SQLite + Prisma ORM</p>
          </div>
          <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/80">نسخه سیستم: v1.0.4 - Bento</p>
        </div>
      </aside>
    </>
  );
};
