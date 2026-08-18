import React from 'react';
import { Plus, Download, RefreshCw, Menu, User, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenCreate: () => void;
  onRefresh: () => void;
  onResetDemo: () => void;
  onExportCSV: () => void;
  onToggleMobileMenu: () => void;
  isLoading: boolean;
  totalCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCreate,
  onRefresh,
  onResetDemo,
  onExportCSV,
  onToggleMobileMenu,
  isLoading,
  totalCount
}) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30" id="app-header">
      {/* Right Side / Title & Mobile Hamburger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg lg:hidden"
          title="منوی اصلی"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base sm:text-lg font-semibold text-slate-800">پیشخوان مدیریت گزارش‌ها</h1>
        </div>
      </div>

      {/* Left Side Actions & Profile */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* CSV Export */}
        <button
          id="export-csv-btn"
          onClick={onExportCSV}
          title="خروجی اکسل و CSV"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4 text-slate-600" />
          <span>خروجی اکسل</span>
        </button>

        {/* Reset Demo Data */}
        <button
          id="reset-demo-btn"
          onClick={onResetDemo}
          title="بازنشانی داده‌های اولیه"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <RefreshCw className={`w-4 h-4 text-slate-600 ${isLoading ? 'animate-spin' : ''}`} />
          <span>داده‌های دمو</span>
        </button>

        {/* Create Report Button in Bento Style */}
        <button
          id="create-report-btn"
          onClick={onOpenCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-sm shadow-indigo-200 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>گزارش جدید</span>
        </button>

        {/* User Profile Avatar as in Bento Design */}
        <div className="w-9 h-9 rounded-full bg-indigo-100 border-2 border-white shadow-xs overflow-hidden flex items-center justify-center text-indigo-700 font-bold text-xs shrink-0 cursor-pointer" title="حساب کاربری فعال">
          <span>ار</span>
        </div>
      </div>
    </header>
  );
};
