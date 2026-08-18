import React from 'react';
import { Database, Server, Layout, Sparkles, CheckCircle2, Code2 } from 'lucide-react';

export const BentoBlueprintCard: React.FC = () => {
  const steps = [
    {
      num: 1,
      title: 'مدلسازی در Prisma با SQLite',
      desc: 'ذخیره‌سازی سریع، سبک و بدون نیاز به نصب سرور مجزا'
    },
    {
      num: 2,
      title: 'سرویس‌دهی API با Express.js',
      desc: 'عملیات کامل CRUD، فیلترهای چندگانه و تحلیل آمار'
    },
    {
      num: 3,
      title: 'طراحی ماژولار Bento Grid با Tailwind',
      desc: 'رابط کاربری تمیز و فوق‌العاده سریع با تایپوگرافی فارسی'
    },
    {
      num: 4,
      title: 'مدیریت وضعیت و خروجی داده‌ها',
      desc: 'پشتیبانی از دانلود مستقیم اکسل و پرینت گزارش‌ها'
    }
  ];

  return (
    <div className="bg-indigo-950 text-white p-6 rounded-2xl border border-indigo-900 shadow-sm relative overflow-hidden flex flex-col justify-between" id="bento-blueprint-card">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-400/30">
              <Code2 className="w-4 h-4 text-indigo-300" />
            </div>
            <h3 className="font-bold text-base text-white">نقشه معماری سیستم</h3>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/20">
            Active Stack
          </span>
        </div>

        <ul className="space-y-3.5 text-xs text-indigo-100">
          {steps.map((step) => (
            <li key={step.num} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center text-[10px] font-bold text-indigo-200 shrink-0 mt-0.5">
                {step.num}
              </div>
              <div>
                <p className="font-bold text-white leading-tight">{step.title}</p>
                <p className="text-[11px] text-indigo-200/70 mt-0.5 leading-normal">{step.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative z-10 pt-5 mt-5 border-t border-indigo-800/60 flex items-center justify-between text-xs text-indigo-200">
        <span className="text-[11px]">پایگاه داده آماده دریافت گزارش</span>
        <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          آنلاین
        </span>
      </div>

      {/* Decorative gradient blur spot as in Bento Grid design */}
      <div className="absolute -bottom-6 -right-6 w-36 h-36 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute -top-6 -left-6 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>
    </div>
  );
};
