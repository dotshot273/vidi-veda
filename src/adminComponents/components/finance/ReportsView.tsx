import React from "react";
import { useCRM } from "../../context/CRMContext";
import { formatCurrency } from "../../utils/dateUtils";
import {
  TrendingUp,
  Award,
  MapPin,
  BookOpen,
  GraduationCap,
  DollarSign,
  Users,
  CheckCircle2,
} from "lucide-react";

export const ReportsView: React.FC = () => {
  const { leads, demos, payments, commissions, teachers, tuitions } = useCRM();

  // 1. Lead Conversion Rate
  const totalLeadsCount = leads.length;
  const confirmedCount = leads.filter(
    (l) => l.status === "Confirmed" || l.status === "Registration Pending" || l.status === "Tuition Started"
  ).length;
  const conversionRate = totalLeadsCount > 0 ? ((confirmedCount / totalLeadsCount) * 100).toFixed(1) : "0";

  // 2. Financial Totals
  const totalRegCollected = payments.reduce((sum, p) => sum + p.amountPaid, 0);
  const totalCommCollected = commissions.reduce((sum, c) => sum + c.amountPaid, 0);
  const netAgencyRevenue = totalRegCollected + totalCommCollected;

  const totalRegPending = payments.filter((p) => p.status !== "Paid").reduce((sum, p) => sum + p.balance, 0);
  const totalCommPending = commissions.filter((c) => c.status !== "Paid").reduce((sum, c) => sum + c.balance, 0);
  const totalPendingDues = totalRegPending + totalCommPending;

  // 3. Subject Demand Breakdown
  const subjectCounts: Record<string, number> = {};
  leads.forEach((l) => {
    const s = l.subjectRequired || "Other";
    subjectCounts[s] = (subjectCounts[s] || 0) + 1;
  });
  const sortedSubjects = Object.entries(subjectCounts).sort((a, b) => b[1] - a[1]);

  // 4. Area Demand Breakdown
  const areaCounts: Record<string, number> = {};
  leads.forEach((l) => {
    const a = l.location || "Other";
    areaCounts[a] = (areaCounts[a] || 0) + 1;
  });
  const sortedAreas = Object.entries(areaCounts).sort((a, b) => b[1] - a[1]);

  // 5. Class Demand Breakdown
  const classCounts: Record<string, number> = {};
  leads.forEach((l) => {
    const c = l.studentClass || "Other";
    classCounts[c] = (classCounts[c] || 0) + 1;
  });
  const sortedClasses = Object.entries(classCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
        <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Executive Business Reports & Analytics
        </h2>
        <p className="text-xs text-slate-500">
          Conversion rates, revenue realization, subject demand, and teacher performance metrics.
        </p>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-slate-500 font-medium block">Lead Conversion Rate</span>
          <span className="text-2xl font-black text-blue-600 font-mono mt-1 block">
            {conversionRate}%
          </span>
          <span className="text-[11px] text-slate-500">
            {confirmedCount} of {totalLeadsCount} leads confirmed
          </span>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-slate-500 font-medium block">Net Revenue Realized</span>
          <span className="text-2xl font-black text-emerald-600 font-mono mt-1 block">
            {formatCurrency(netAgencyRevenue)}
          </span>
          <span className="text-[11px] text-emerald-700">Bank & Cash Inflows</span>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-slate-500 font-medium block">Pending Agency Dues</span>
          <span className="text-2xl font-black text-rose-600 font-mono mt-1 block">
            {formatCurrency(totalPendingDues)}
          </span>
          <span className="text-[11px] text-rose-700">Receivables pipeline</span>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-slate-500 font-medium block">Active Tutoring Hours</span>
          <span className="text-2xl font-black text-purple-600 font-mono mt-1 block">
            {tuitions.length} Batches
          </span>
          <span className="text-[11px] text-purple-700">Currently receiving service</span>
        </div>
      </div>

      {/* 3 Breakdown Grids: Subject, Location, Class Demand */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {/* Subject Demand */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-blue-600" />
            Top In-Demand Subjects
          </h3>

          <div className="space-y-2">
            {sortedSubjects.map(([subject, count], idx) => {
              const pct = ((count / totalLeadsCount) * 100).toFixed(0);
              return (
                <div key={subject} className="space-y-1">
                  <div className="flex justify-between text-slate-700">
                    <span className="font-semibold">{subject}</span>
                    <span className="font-mono text-slate-500">
                      {count} enquiries ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Location / Area Demand */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-rose-600" />
            Highest Demand Localities
          </h3>

          <div className="space-y-2">
            {sortedAreas.map(([area, count]) => {
              const pct = ((count / totalLeadsCount) * 100).toFixed(0);
              return (
                <div key={area} className="space-y-1">
                  <div className="flex justify-between text-slate-700">
                    <span className="font-semibold">{area}</span>
                    <span className="font-mono text-slate-500">
                      {count} requests ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-rose-500 h-full rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Grade / Class Demand */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
            <GraduationCap className="w-4 h-4 text-purple-600" />
            Class / Grade Distribution
          </h3>

          <div className="space-y-2">
            {sortedClasses.map(([grade, count]) => {
              const pct = ((count / totalLeadsCount) * 100).toFixed(0);
              return (
                <div key={grade} className="space-y-1">
                  <div className="flex justify-between text-slate-700">
                    <span className="font-semibold">{grade}</span>
                    <span className="font-mono text-slate-500">
                      {count} students ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-600 h-full rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Teacher Performance Ledger */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 sm:p-5 space-y-3">
        <h3 className="font-bold text-slate-900 flex items-center gap-2 text-xs uppercase tracking-wider">
          <Award className="w-4 h-4 text-amber-500" />
          Tutor Performance & Agency Commission Realization
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Tutor Name</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Demos Done</th>
                <th className="py-2.5 px-3">Active Tuitions</th>
                <th className="py-2.5 px-3">Commission Paid</th>
                <th className="py-2.5 px-3">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teachers.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80">
                  <td className="py-2.5 px-3 font-bold text-slate-900">
                    {t.name}
                    <span className="block text-[10px] text-slate-400 font-normal">
                      {t.qualification}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">{t.status}</td>
                  <td className="py-2.5 px-3 font-mono font-semibold text-slate-800">
                    {t.totalDemosDone}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-semibold text-slate-800">
                    {t.totalActiveTuitions}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">
                    ₹{t.totalCommissionPaid}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-amber-600">★ {t.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
