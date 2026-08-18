import React from 'react';
import { Search, Filter, X, ArrowUpDown } from 'lucide-react';

interface ReportFilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedPriority: string;
  onPriorityChange: (p: string) => void;
  selectedStatus: string;
  onStatusChange: (s: string) => void;
  sortBy: string;
  onSortByChange: (s: string) => void;
  sortOrder: 'asc' | 'desc';
  onToggleSortOrder: () => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  categories: string[];
}

export const ReportFilterBar: React.FC<ReportFilterBarProps> = ({
  search,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedPriority,
  onPriorityChange,
  selectedStatus,
  onStatusChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onToggleSortOrder,
  onClearFilters,
  hasActiveFilters,
  categories
}) => {
  return (
    <div className="space-y-3 mb-4" id="filters-container">
      {/* Top search and controls row */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
        {/* Search input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="search-reports-input"
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="جستجو در عنوان، شرح، نویسنده یا برچسب‌ها..."
            className="w-full pl-9 pr-10 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800 placeholder-slate-400 shadow-2xs"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Priority, Status & Sorting */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Status */}
          <select
            id="filter-status-select"
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-2xs"
          >
            <option value="ALL">همه وضعیت‌ها</option>
            <option value="SUBMITTED">ثبت شده</option>
            <option value="APPROVED">نهایی شده</option>
            <option value="REVIEWING">در حال بررسی</option>
            <option value="DRAFT">پیش‌نویس</option>
          </select>

          {/* Priority */}
          <select
            id="filter-priority-select"
            value={selectedPriority}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-2xs"
          >
            <option value="ALL">همه اولویت‌ها</option>
            <option value="URGENT">فوری</option>
            <option value="HIGH">بالا</option>
            <option value="MEDIUM">متوسط</option>
            <option value="LOW">پایین</option>
          </select>

          {/* Sort */}
          <div className="flex items-center border border-slate-200 rounded-xl bg-white overflow-hidden shadow-2xs">
            <select
              id="sort-by-select"
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              className="px-2.5 py-2 text-xs sm:text-sm bg-transparent border-0 text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="id">جدیدترین</option>
              <option value="reportDate">تاریخ</option>
              <option value="hoursSpent">ساعت کاری</option>
            </select>
            <button
              onClick={onToggleSortOrder}
              title={sortOrder === 'desc' ? 'نزولی به صعودی' : 'صعودی به نزولی'}
              className="p-2 text-slate-600 hover:bg-slate-100 transition-colors border-r border-slate-200"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors shadow-2xs"
            >
              <X className="w-3.5 h-3.5" />
              <span>پاکسازی</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-thin">
        <span className="text-slate-400 pl-1 flex items-center gap-1 shrink-0 font-medium">
          <Filter className="w-3.5 h-3.5" />
          دسته‌بندی:
        </span>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-all shrink-0 ${
                isSelected
                  ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200 shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat === 'ALL' ? 'همه' : cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};
