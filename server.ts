import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();
const app = express();
const PORT = 3000;

app.use(express.json());

// Seed initial reports if DB is empty
async function seedDefaultReportsIfEmpty() {
  try {
    const count = await prisma.report.count();
    if (count === 0) {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const twoDaysAgo = new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0];

      await prisma.report.createMany({
        data: [
          {
            title: "گزارش روزانه توسعه ماژول احراز هویت",
            author: "علی رضایی",
            category: "فنی",
            priority: "HIGH",
            status: "APPROVED",
            reportDate: today,
            hoursSpent: 6.5,
            summary: "پیاده‌سازی توکن JWT و تست ورود دومرحله‌ای برای کاربران ادمین.",
            content: "امروز فرایند بازنویسی میان‌افزار احراز هویت با موفقیت انجام شد. آزمون‌های واحد و یکپارچگی نوشته شد و تست نفوذ اولیه با موفقیت پاس شد. مستندات API نیز در Postman به‌روزرسانی گردید.",
            blockers: "تاخیر در پاسخ‌دهی سرور پیامک جهت ارسال کد تایید که با کش محلی موقتا حل شد.",
            nextSteps: "یکپارچه‌سازی با فرانت‌اند و تست بارگذاری همزمان.",
            tags: "احراز هویت, امنیت, JWT, بک‌اند"
          },
          {
            title: "جلسه هماهنگی اسپرینت هفتگی تیم طراحی محصول",
            author: "مریم حسینی",
            category: "جلسه",
            priority: "MEDIUM",
            status: "SUBMITTED",
            reportDate: today,
            hoursSpent: 3.0,
            summary: "بررسی وایرفریم‌های بخش گزارش‌گیری و دریافت بازخورد از مدیر محصول.",
            content: "در این جلسه ساختار فرم‌های ورودی و پالت رنگی رابط کاربری مینیمال مورد تایید قرار گرفت. تصمیم گرفته شد که جدول داده‌ها قابلیت جستجو و فیلتر پیشرفته داشته باشد.",
            blockers: "عدم تایید نهایی آیکون‌های سفارشی توسط تیم مارکتینگ.",
            nextSteps: "نهایی‌سازی پروتوتایپ فیگما و آماده‌سازی خروجی دیزاین برای تیم فرانت‌اند.",
            tags: "طراحی, UI/UX, اسپرینت, فیگما"
          },
          {
            title: "گزارش پیشرفت فاز اول زیرساخت پایگاه داده SQLite",
            author: "سارا محمدی",
            category: "پروژه",
            priority: "HIGH",
            status: "APPROVED",
            reportDate: yesterday,
            hoursSpent: 7.0,
            summary: "پیکربندی Prisma ORM با SQLite و تعریف مدل‌های استاندارد گزارش‌ها.",
            content: "جداول پایگاه داده طراحی و ایندکس‌گذاری مناسب برای فیلدهای تاریخ و دسته‌بندی تعریف شد. کوئری‌های فیلترگذاری و تجمیع داده‌ها تست و بهینه‌سازی شدند.",
            blockers: null,
            nextSteps: "پیاده‌سازی بک‌آپ‌گیری خودکار روزانه از فایل دیتابیس.",
            tags: "دیتابیس, SQLite, Prisma, بهینه‌سازی"
          },
          {
            title: "بررسی هفتگی مالی و هزینه‌های ابری سرورها",
            author: "امیرحسین کریمی",
            category: "مالی",
            priority: "LOW",
            status: "REVIEWING",
            reportDate: twoDaysAgo,
            hoursSpent: 4.0,
            summary: "محاسبه هزینه‌های ماهانه کانتینرها و کاهش ۱۰ درصدی هزینه‌های اضافه.",
            content: "منابع اضافی در سرورهای تست خاموش شد و گزارش تخمینی هزینه سه ماهه آینده برای مدیریت مالی تهیه شد.",
            blockers: "عدم دسترسی به پنل دقیق تفکیک هزینه بخش لاگ‌ها.",
            nextSteps: "تنظیم هشدار سقف هزینه (Budget Alerts) در داشبورد ابری.",
            tags: "مالی, سرور, ابر, بودجه"
          }
        ]
      });
      console.log("Seeded default reports successfully.");
    }
  } catch (error) {
    console.error("Error seeding initial reports:", error);
  }
}

// 1. GET all reports with filters & search
app.get("/api/reports", async (req, res) => {
  try {
    const { search, category, priority, status, startDate, endDate, sortBy = "id", sortOrder = "desc" } = req.query;

    const whereClause: any = {};

    if (category && category !== "ALL") {
      whereClause.category = String(category);
    }
    if (priority && priority !== "ALL") {
      whereClause.priority = String(priority);
    }
    if (status && status !== "ALL") {
      whereClause.status = String(status);
    }
    if (startDate || endDate) {
      whereClause.reportDate = {};
      if (startDate) whereClause.reportDate.gte = String(startDate);
      if (endDate) whereClause.reportDate.lte = String(endDate);
    }
    if (search) {
      const searchTerm = String(search).trim();
      whereClause.OR = [
        { title: { contains: searchTerm } },
        { author: { contains: searchTerm } },
        { summary: { contains: searchTerm } },
        { content: { contains: searchTerm } },
        { tags: { contains: searchTerm } }
      ];
    }

    const orderBy: any = {};
    if (sortBy === "reportDate" || sortBy === "hoursSpent" || sortBy === "createdAt" || sortBy === "priority") {
      orderBy[String(sortBy)] = sortOrder === "asc" ? "asc" : "desc";
    } else {
      orderBy.id = sortOrder === "asc" ? "asc" : "desc";
    }

    const reports = await prisma.report.findMany({
      where: whereClause,
      orderBy: orderBy
    });

    res.json({ success: true, reports });
  } catch (error: any) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. GET report by ID
app.get("/api/reports/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: "شناسه گزارش نامعتبر است" });
    }

    const report = await prisma.report.findUnique({
      where: { id }
    });

    if (!report) {
      return res.status(404).json({ success: false, error: "گزارش مورد نظر یافت نشد" });
    }

    res.json({ success: true, report });
  } catch (error: any) {
    console.error("Error fetching report:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. POST create new report
app.post("/api/reports", async (req, res) => {
  try {
    const {
      title,
      author = "کاربر سیستم",
      category = "روزانه",
      priority = "MEDIUM",
      status = "SUBMITTED",
      reportDate,
      hoursSpent = 0,
      summary = "",
      content = "",
      blockers = "",
      nextSteps = "",
      tags = ""
    } = req.body;

    if (!title || !reportDate) {
      return res.status(400).json({ success: false, error: "عنوان و تاریخ گزارش الزامی هستند" });
    }

    const newReport = await prisma.report.create({
      data: {
        title,
        author: author || "کاربر سیستم",
        category,
        priority,
        status,
        reportDate,
        hoursSpent: Number(hoursSpent) || 0,
        summary: summary || title,
        content: content || summary || title,
        blockers: blockers || null,
        nextSteps: nextSteps || null,
        tags: tags || ""
      }
    });

    res.status(201).json({ success: true, report: newReport });
  } catch (error: any) {
    console.error("Error creating report:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. PUT update existing report
app.put("/api/reports/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: "شناسه گزارش نامعتبر است" });
    }

    const {
      title,
      author,
      category,
      priority,
      status,
      reportDate,
      hoursSpent,
      summary,
      content,
      blockers,
      nextSteps,
      tags
    } = req.body;

    const updated = await prisma.report.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(author !== undefined && { author }),
        ...(category !== undefined && { category }),
        ...(priority !== undefined && { priority }),
        ...(status !== undefined && { status }),
        ...(reportDate !== undefined && { reportDate }),
        ...(hoursSpent !== undefined && { hoursSpent: Number(hoursSpent) }),
        ...(summary !== undefined && { summary }),
        ...(content !== undefined && { content }),
        ...(blockers !== undefined && { blockers }),
        ...(nextSteps !== undefined && { nextSteps }),
        ...(tags !== undefined && { tags })
      }
    });

    res.json({ success: true, report: updated });
  } catch (error: any) {
    console.error("Error updating report:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. DELETE report
app.delete("/api/reports/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: "شناسه گزارش نامعتبر است" });
    }

    await prisma.report.delete({
      where: { id }
    });

    res.json({ success: true, message: "گزارش با موفقیت حذف شد" });
  } catch (error: any) {
    console.error("Error deleting report:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 6. GET system stats for dashboard
app.get("/api/stats", async (req, res) => {
  try {
    const totalReports = await prisma.report.count();
    const reports = await prisma.report.findMany();

    let totalHours = 0;
    const categoryCount: Record<string, number> = {};
    const priorityCount: Record<string, number> = {};
    const statusCount: Record<string, number> = {};

    reports.forEach((r) => {
      totalHours += r.hoursSpent;
      categoryCount[r.category] = (categoryCount[r.category] || 0) + 1;
      priorityCount[r.priority] = (priorityCount[r.priority] || 0) + 1;
      statusCount[r.status] = (statusCount[r.status] || 0) + 1;
    });

    res.json({
      success: true,
      stats: {
        totalReports,
        totalHours: Math.round(totalHours * 10) / 10,
        categoryCount,
        priorityCount,
        statusCount
      }
    });
  } catch (error: any) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 7. Seed / Reset sample data
app.post("/api/seed", async (req, res) => {
  try {
    await prisma.report.deleteMany();
    await seedDefaultReportsIfEmpty();
    const reports = await prisma.report.findMany({ orderBy: { id: "desc" } });
    res.json({ success: true, reports });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

async function startServer() {
  await seedDefaultReportsIfEmpty();

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
