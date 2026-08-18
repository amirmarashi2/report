import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { StatsCards } from './components/StatsCards';
import { BentoBlueprintCard } from './components/BentoBlueprintCard';
import { ReportFilterBar } from './components/ReportFilterBar';
import { ReportCard } from './components/ReportCard';
import { ReportModal } from './components/ReportModal';
import { ReportDetailModal } from './components/ReportDetailModal';
import { EmptyState } from './components/EmptyState';
import { Report, Stats, Status, Priority, CreateReportInput } from './types';
import { Loader2, Check, AlertCircle, FileText } from 'lucide-react';

const CATEGORIES = ['ALL', 'روزانه', 'پروژه', 'فنی', 'جلسه', 'مالی', 'هفتگی', 'سایر'];

export default function App() {
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Sidebar & Navigation
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Filters & Sorting state
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [detailReport, setDetailReport] = useState<Report | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Sync sidebar tab with filters
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'all') {
      setSelectedStatus('ALL');
      setSelectedPriority('ALL');
    } else if (tab === 'approved') {
      setSelectedStatus('APPROVED');
      setSelectedPriority('ALL');
    } else if (tab === 'urgent') {
      setSelectedPriority('HIGH'); // or urgent
      setSelectedStatus('ALL');
    } else if (tab === 'archive') {
      setSelectedStatus('DRAFT');
      setSelectedPriority('ALL');
    }
  };

  // Fetch Reports from API
  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedCategory && selectedCategory !== 'ALL') params.append('category', selectedCategory);
      if (selectedPriority && selectedPriority !== 'ALL') params.append('priority', selectedPriority);
      if (selectedStatus && selectedStatus !== 'ALL') params.append('status', selectedStatus);
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const res = await fetch(`/api/reports?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch reports');
      const data = await res.json();
      setReports(data.reports || []);
    } catch (err: any) {
      console.error(err);
      showToast('خطا در دریافت لیست گزارش‌ها از سرور', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Stats from API
  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Debounced search and filter effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchReports();
    }, 200);
    return () => clearTimeout(timer);
  }, [search, selectedCategory, selectedPriority, selectedStatus, sortBy, sortOrder]);

  // Initial load
  useEffect(() => {
    fetchStats();
  }, []);

  // Save (Create or Update)
  const handleSaveReport = async (formData: CreateReportInput) => {
    try {
      setIsSubmitting(true);
      const isEditing = Boolean(editingReport);
      const url = isEditing ? `/api/reports/${editingReport!.id}` : '/api/reports';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save report');
      }

      showToast(isEditing ? 'گزارش با موفقیت ویرایش شد.' : 'گزارش جدید با موفقیت ثبت شد.');
      setIsModalOpen(false);
      setEditingReport(null);
      await fetchReports();
      await fetchStats();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'خطا در ثبت گزارش', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Report
  const handleDeleteReport = async (id: number) => {
    if (!window.confirm('آیا از حذف این گزارش مطمئن هستید؟ این عملیات غیرقابل بازگشت است.')) {
      return;
    }

    try {
      const res = await fetch(`/api/reports/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete report');
      showToast('گزارش با موفقیت حذف شد.');
      if (detailReport && detailReport.id === id) {
        setIsDetailOpen(false);
        setDetailReport(null);
      }
      await fetchReports();
      await fetchStats();
    } catch (err: any) {
      showToast('خطا در حذف گزارش', 'error');
    }
  };

  // Status Toggle
  const handleStatusToggle = async (report: Report, newStatus: Status) => {
    try {
      const res = await fetch(`/api/reports/${report.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...report, status: newStatus })
      });
      if (!res.ok) throw new Error('Failed to update status');
      showToast(`وضعیت به "${newStatus}" تغییر یافت.`);
      await fetchReports();
      await fetchStats();
      if (detailReport && detailReport.id === report.id) {
        setDetailReport({ ...detailReport, status: newStatus });
      }
    } catch (err: any) {
      showToast('خطا در تغییر وضعیت گزارش', 'error');
    }
  };

  // Reset / Seed Demo Data
  const handleResetDemo = async () => {
    if (!window.confirm('آیا مایلید داده‌های نمونه پیش‌فرض در دیتابیس بارگذاری شوند؟')) return;
    try {
      setIsLoading(true);
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast('داده‌های نمونه با موفقیت در دیتابیس ایجاد شدند.');
        await fetchReports();
        await fetchStats();
      }
    } catch (err: any) {
      showToast('خطا در بازنشانی داده‌های اولیه', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (reports.length === 0) {
      showToast('هیچ گزارشی برای خروجی وجود ندارد.', 'error');
      return;
    }

    const headers = ['شناسه', 'عنوان', 'نویسنده', 'دسته‌بندی', 'اولویت', 'وضعیت', 'تاریخ', 'ساعت_کاری', 'خلاصه', 'برچسب‌ها'];
    const rows = reports.map(r => [
      r.id,
      `"${r.title.replace(/"/g, '""')}"`,
      `"${r.author.replace(/"/g, '""')}"`,
      `"${r.category}"`,
      `"${r.priority}"`,
      `"${r.status}"`,
      `"${r.reportDate}"`,
      r.hoursSpent,
      `"${(r.summary || '').replace(/"/g, '""')}"`,
      `"${(r.tags || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `reports_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('فایل اکسل/CSV با موفقیت دانلود شد.');
  };

  // Clear filters
  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategory('ALL');
    setSelectedPriority('ALL');
    setSelectedStatus('ALL');
    setSortBy('id');
    setSortOrder('desc');
    setActiveTab('all');
  };

  const hasActiveFilters =
    search !== '' ||
    selectedCategory !== 'ALL' ||
    selectedPriority !== 'ALL' ||
    selectedStatus !== 'ALL' ||
    sortBy !== 'id';

  const approvedCount = stats?.statusCount?.['APPROVED'] || 0;
  const urgentCount = (stats?.priorityCount?.['HIGH'] || 0) + (stats?.priorityCount?.['URGENT'] || 0);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-row font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 left-5 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-lg text-xs sm:text-sm font-medium border ${
              toastMessage.type === 'success'
                ? 'bg-slate-900 text-white border-slate-800'
                : 'bg-rose-600 text-white border-rose-700'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-200" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Bento Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        totalReports={stats?.totalReports || 0}
        approvedCount={approvedCount}
        urgentCount={urgentCount}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Bento Top Header */}
        <Navbar
          onOpenCreate={() => {
            setEditingReport(null);
            setIsModalOpen(true);
          }}
          onRefresh={fetchReports}
          onResetDemo={handleResetDemo}
          onExportCSV={handleExportCSV}
          onToggleMobileMenu={() => setIsMobileSidebarOpen(prev => !prev)}
          isLoading={isLoading}
          totalCount={reports.length}
        />

        {/* Bento Grid Body */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          {/* Row 1: Bento Metric Cards */}
          <StatsCards stats={stats} filteredCount={reports.length} />

          {/* Row 2: Bento Split Layout (8-col Reports & 4-col Architecture Blueprint) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Reports Bento Container (col-span-8) */}
            <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col min-w-0" id="bento-reports-panel">
              {/* Header inside Bento Panel */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-800 text-base">گزارش‌های کاری</h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                    {reports.length} مورد
                  </span>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    پاکسازی فیلترها
                  </button>
                )}
              </div>

              {/* Filter and Search Bar */}
              <ReportFilterBar
                search={search}
                onSearchChange={setSearch}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                selectedPriority={selectedPriority}
                onPriorityChange={setSelectedPriority}
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
                sortBy={sortBy}
                onSortByChange={setSortBy}
                sortOrder={sortOrder}
                onToggleSortOrder={() => setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'))}
                onClearFilters={handleClearFilters}
                hasActiveFilters={hasActiveFilters}
                categories={CATEGORIES}
              />

              {/* Reports Grid / Content */}
              {isLoading && reports.length === 0 ? (
                <div className="py-16 text-center flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">در حال واکشی اطلاعات از SQLite...</p>
                </div>
              ) : reports.length === 0 ? (
                <EmptyState
                  hasFilters={hasActiveFilters}
                  onClearFilters={handleClearFilters}
                  onOpenCreate={() => {
                    setEditingReport(null);
                    setIsModalOpen(true);
                  }}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3" id="reports-list">
                  {reports.map((report) => (
                    <ReportCard
                      key={report.id}
                      report={report}
                      onView={(rep) => {
                        setDetailReport(rep);
                        setIsDetailOpen(true);
                      }}
                      onEdit={(rep) => {
                        setEditingReport(rep);
                        setIsModalOpen(true);
                      }}
                      onDelete={handleDeleteReport}
                      onStatusToggle={handleStatusToggle}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Blueprint Architecture Card (col-span-4) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <BentoBlueprintCard />

              {/* Quick Actions Bento Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">اقدامات سریع</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setEditingReport(null);
                      setIsModalOpen(true);
                    }}
                    className="p-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold flex flex-col items-center gap-1.5 transition-colors"
                  >
                    <span className="text-base">📝</span>
                    <span>ثبت گزارش جدید</span>
                  </button>
                  <button
                    onClick={handleExportCSV}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex flex-col items-center gap-1.5 transition-colors border border-slate-100"
                  >
                    <span className="text-base">📊</span>
                    <span>خروجی اکسل</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Create & Edit Modal */}
      <ReportModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingReport(null);
        }}
        onSubmit={handleSaveReport}
        editingReport={editingReport}
        isSubmitting={isSubmitting}
      />

      {/* Full Detail & Preview Modal */}
      <ReportDetailModal
        report={detailReport}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setDetailReport(null);
        }}
        onEdit={(rep) => {
          setIsDetailOpen(false);
          setEditingReport(rep);
          setIsModalOpen(true);
        }}
        onDelete={handleDeleteReport}
        onStatusChange={handleStatusToggle}
      />
    </div>
  );
}
