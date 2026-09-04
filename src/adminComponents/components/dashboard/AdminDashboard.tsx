import React, { useState } from "react";
import { useCRM } from "../../context/CRMContext";
import {
  formatCurrency,
  isToday,
  isOverdue,
  formatDisplayDate,
  getTodayString,
} from "../../utils/dateUtils";
import { Badge } from "../common/Badge";
import {
  Users,
  DollarSign,
  Calendar,
  AlertCircle,
  TrendingUp,
  Clock,
  ArrowRight,
  Phone,
  MessageCircle,
  Plus,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { Lead, TuitionPayment, TeacherCommission, FollowUp, Demo } from "../../types/crm";

interface AdminDashboardProps {
  onOpenNewLead: () => void;
  onOpenScheduleDemo: () => void;
  onNavigateToTab: (tabId: string) => void;
  onSelectLeadProfile: (lead: Lead) => void;
  onOpenWhatsApp: (phone: string, name: string, context?: any) => void;
  onRecordPayment: (payment: TuitionPayment) => void;
  onRecordCommission: (commission: TeacherCommission) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onOpenNewLead,
  onOpenScheduleDemo,
  onNavigateToTab,
  onSelectLeadProfile,
  onOpenWhatsApp,
  onRecordPayment,
  onRecordCommission,
}) => {
  const { leads, demos, payments, commissions, tuitions, followUps } = useCRM();

  const today = getTodayString();

  // Metrics calculations
  const newLeadsToday = leads.filter((l) => isToday(l.enquiryDate) || isToday(l.createdAt));
  const activeLeads = leads.filter((l) => l.status !== "Not Interested" && l.status !== "Cancelled");
  const waitingForTeacher = leads.filter((l) => l.status === "New Lead" || l.status === "Teacher Searching");
  const demosScheduled = demos.filter((d) => d.day1Status === "Pending");
  const demosRunning = demos.filter(
    (d) =>
      (d.day1Status === "Completed" || d.day2Status === "Completed") &&
      d.day3Status !== "Completed"
  );
  const demosCompleted = demos.filter((d) => d.day3Status === "Completed");
  const parentsWaitingDecision = leads.filter((l) => l.status === "Parent Decision Pending");
  const confirmedTuitions = leads.filter(
    (l) => l.status === "Confirmed" || l.status === "Registration Pending" || l.status === "Tuition Started"
  );
  const lostLeads = leads.filter((l) => l.status === "Not Interested" || l.status === "Cancelled");

  // Money calculations
  const regPendingAmount = payments
    .filter((p) => p.status !== "Paid" && p.status !== "Cancelled")
    .reduce((sum, p) => sum + p.balance, 0);

  const regCollectedAmount = payments.reduce((sum, p) => sum + p.amountPaid, 0);

  const commPendingAmount = commissions
    .filter((c) => c.status !== "Paid" && c.status !== "Cancelled")
    .reduce((sum, c) => sum + c.balance, 0);

  const commCollectedAmount = commissions.reduce((sum, c) => sum + c.amountPaid, 0);

  const totalOutstanding = regPendingAmount + commPendingAmount;
  const totalCollected = regCollectedAmount + commCollectedAmount;

  // Today's actions calculations
  const followUpsDueToday = followUps.filter((f) => f.status === "Pending" && (isToday(f.dueDate) || isOverdue(f.dueDate)));
  const demosToday = demos.filter((d) => d.startDate <= today && d.endDate >= today);
  const demosEndingToday = demos.filter((d) => isToday(d.endDate));
  const regPaymentsPending = payments.filter((p) => p.balance > 0);
  const commPaymentsPending = commissions.filter((c) => c.balance > 0);

  // Urgent items
  const overdueReg = payments.filter((p) => p.balance > 0 && isOverdue(p.dueDate));
  const overdueComm = commissions.filter((c) => c.balance > 0 && isOverdue(c.dueDate));
  const overdueFollowUps = followUps.filter((f) => f.status === "Pending" && isOverdue(f.dueDate));

  return (
    <div className="space-y-6">
      {/* Top Stats Row - Professional Polish 4-Card Executive Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Leads */}
        <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-colors">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">Active Leads</p>
          <div className="flex items-end justify-between mt-2">
            <span className="text-2xl font-bold text-slate-900 font-mono">{activeLeads.length}</span>
            <span className="text-blue-600 text-xs font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
              {newLeadsToday.length} New Today
            </span>
          </div>
        </div>

        {/* Live Demos */}
        <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-colors">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">Live Demos</p>
          <div className="flex items-end justify-between mt-2">
            <span className="text-2xl font-bold text-slate-900 font-mono">
              {demosScheduled.length + demosRunning.length}
            </span>
            <span className="text-amber-600 text-xs font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
              {demosEndingToday.length} Ending Today
            </span>
          </div>
        </div>

        {/* Pending Registration */}
        <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-colors">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">Pending Registration</p>
          <div className="flex items-end justify-between mt-2">
            <span className="text-2xl font-bold text-slate-900 font-mono">
              {formatCurrency(regPendingAmount)}
            </span>
            <span className="text-rose-600 text-xs font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
              {regPaymentsPending.length} Parents Due
            </span>
          </div>
        </div>

        {/* Unpaid Commission */}
        <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-colors">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">Unpaid Commission</p>
          <div className="flex items-end justify-between mt-2">
            <span className="text-2xl font-bold text-slate-900 font-mono">
              {formatCurrency(commPendingAmount)}
            </span>
            <span className="text-emerald-600 text-xs font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              {formatCurrency(commCollectedAmount)} Collected
            </span>
          </div>
        </div>
      </section>

      {/* Main Layout Grid - 8 Cols Left (Actions & Queues), 4 Cols Right (Pipeline & Analytics) */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column (col-span-12 lg:col-span-8) */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Quick Action Operations Bar */}
          <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Quick Action Desk
                </h3>
              </div>
              <span className="text-xs text-slate-500">
                Live Date: <span className="font-semibold text-slate-700">{formatDisplayDate(today)}</span>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={onOpenNewLead}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold rounded-md shadow-xs transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ New Lead Call</span>
              </button>

              <button
                type="button"
                onClick={onOpenScheduleDemo}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs font-semibold rounded-md shadow-xs transition-all"
              >
                <Calendar className="w-4 h-4 text-blue-400" />
                <span>Schedule Demo</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateToTab("pipeline")}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 border border-slate-300 text-xs font-medium rounded-md transition-all"
              >
                <UserCheck className="w-4 h-4 text-purple-600" />
                <span>Match Tutor</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateToTab("money")}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 active:scale-95 text-emerald-800 border border-emerald-200 text-xs font-medium rounded-md transition-all"
              >
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>Record Dues</span>
              </button>
            </div>
          </div>

          {/* Urgent Actions & Live Reminders Table */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 flex flex-col overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Urgent Actions & Live Reminders</h3>
                <p className="text-xs text-slate-500">Requires immediate attention from tuition coordinator</p>
              </div>
              <span className="text-xs bg-rose-50 text-rose-700 font-semibold px-2.5 py-1 rounded-full border border-rose-200">
                {overdueReg.length + overdueComm.length + overdueFollowUps.length} Critical
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase font-semibold tracking-wider">
                  <tr>
                    <th className="px-5 py-3">Lead / Parent / Teacher</th>
                    <th className="px-5 py-3">Issue / Type</th>
                    <th className="px-5 py-3">Outstanding</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {/* Overdue Registration Fees */}
                  {overdueReg.slice(0, 3).map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-slate-900">{p.studentName}</div>
                        <div className="text-slate-500 text-[11px]">Parent: {p.parentName}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded font-medium text-[11px]">
                          🔴 Overdue Reg. Fee
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono font-bold text-rose-700">
                        ₹{p.balance}
                      </td>
                      <td className="px-5 py-3.5 text-right space-x-1.5">
                        <button
                          type="button"
                          onClick={() => onRecordPayment(p)}
                          className="text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 px-2.5 py-1 rounded border border-slate-300 font-medium"
                        >
                          Collect
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            onOpenWhatsApp(
                              leads.find((l) => l.id === p.leadId)?.parentContact || "",
                              p.parentName,
                              { studentName: p.studentName, balance: p.balance, paymentId: p.id },
                              "registration"
                            )
                          }
                          className="text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-2.5 py-1 rounded border border-emerald-200 font-medium inline-flex items-center gap-1"
                        >
                          <MessageCircle className="w-3 h-3" /> Remind
                        </button>
                      </td>
                    </tr>
                  ))}

                  {/* Overdue Teacher Commission */}
                  {overdueComm.slice(0, 3).map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-slate-900">{c.teacherName}</div>
                        <div className="text-slate-500 text-[11px]">Student: {c.studentName}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-medium text-[11px]">
                          🟡 50% Comm Overdue
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono font-bold text-amber-800">
                        ₹{c.balance}
                      </td>
                      <td className="px-5 py-3.5 text-right space-x-1.5">
                        <button
                          type="button"
                          onClick={() => onRecordCommission(c)}
                          className="text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 px-2.5 py-1 rounded border border-slate-300 font-medium"
                        >
                          Collect
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            onOpenWhatsApp(
                              "",
                              c.teacherName,
                              {
                                studentName: c.studentName,
                                balance: c.balance,
                                commissionId: c.id,
                                dueDate: c.dueDate,
                              },
                              "commission"
                            )
                          }
                          className="text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-2.5 py-1 rounded border border-emerald-200 font-medium inline-flex items-center gap-1"
                        >
                          <MessageCircle className="w-3 h-3" /> WhatsApp
                        </button>
                      </td>
                    </tr>
                  ))}

                  {/* Overdue Follow-ups */}
                  {overdueFollowUps.slice(0, 2).map((f) => (
                    <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-slate-900">{f.parentName}</div>
                        <div className="text-slate-500 text-[11px]">{f.contactNumber}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1 text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded font-medium text-[11px]">
                          🔵 Follow-up: {f.followUpType}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 text-[11px]">
                        {f.nextAction}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <a
                          href={`tel:${f.contactNumber.replace(/\D/g, "")}`}
                          className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded shadow-xs font-semibold inline-flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" /> Call
                        </a>
                      </td>
                    </tr>
                  ))}

                  {overdueReg.length === 0 && overdueComm.length === 0 && overdueFollowUps.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-slate-500">
                        <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1.5" />
                        <p className="font-semibold text-slate-700">All clear! No overdue items pending.</p>
                        <p className="text-xs text-slate-400">All registration fees and commissions are up to date.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Center - 4-Column Flow Cards */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Prioritized Queue Overview</h3>
                <p className="text-xs text-slate-500">
                  🔴 Urgent • 🟡 Due Today • 🔵 In Pipeline • 🟢 Active Tuitions
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Due Today */}
              <div className="p-4 rounded-lg bg-amber-50/40 border border-amber-200/80 space-y-2.5">
                <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                  <span className="font-bold text-amber-900 flex items-center gap-1.5 uppercase text-[11px] tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    🟡 Due Today ({followUpsDueToday.length + demosToday.length})
                  </span>
                </div>
                <div className="space-y-2">
                  {demosToday.slice(0, 2).map((d) => (
                    <div key={d.id} className="p-2.5 bg-white rounded-md border border-amber-200 shadow-2xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">{d.studentName} Demo</span>
                        <span className="text-[10px] text-blue-600 font-semibold">{d.timing}</span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-0.5">Tutor: {d.teacherName}</p>
                    </div>
                  ))}
                  {followUpsDueToday.slice(0, 2).map((f) => (
                    <div key={f.id} className="p-2.5 bg-white rounded-md border border-amber-200 shadow-2xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">{f.parentName}</span>
                        <Badge variant="yellow" size="sm">{f.followUpType}</Badge>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-0.5">{f.nextAction}</p>
                    </div>
                  ))}
                  {demosToday.length === 0 && followUpsDueToday.length === 0 && (
                    <p className="text-slate-400 text-center py-2">No demos or follow-ups due today.</p>
                  )}
                </div>
              </div>

              {/* Active Pipeline */}
              <div className="p-4 rounded-lg bg-blue-50/40 border border-blue-200/80 space-y-2.5">
                <div className="flex items-center justify-between border-b border-blue-200 pb-2">
                  <span className="font-bold text-blue-900 flex items-center gap-1.5 uppercase text-[11px] tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    🔵 Pipeline Stage ({activeLeads.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigateToTab("pipeline")}
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    View All →
                  </button>
                </div>
                <div className="space-y-2">
                  {leads
                    .filter((l) => l.status === "New Lead" || l.status === "Teacher Searching" || l.status === "Parent Decision Pending")
                    .slice(0, 3)
                    .map((lead) => (
                      <div
                        key={lead.id}
                        onClick={() => onSelectLeadProfile(lead)}
                        className="p-2.5 bg-white rounded-md border border-blue-200 shadow-2xs hover:border-blue-400 cursor-pointer transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-900">{lead.studentName}</span>
                          <Badge variant="blue" size="sm">{lead.status}</Badge>
                        </div>
                        <p className="text-slate-500 text-[11px] mt-0.5">
                          {lead.studentClass} • {lead.subjectRequired} • {lead.location}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (col-span-12 lg:col-span-4) */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Lead Pipeline Snapshot Progress Bars */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 flex flex-col">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-sm">Lead Pipeline Snapshot</h3>
              <p className="text-xs text-slate-500">Live progression of student inquiries</p>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* New Inquiries */}
              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span className="font-medium">1. New Enquiries Today</span>
                  <span className="font-bold text-slate-900 font-mono">{newLeadsToday.length}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all"
                    style={{
                      width: `${leads.length > 0 ? Math.min(100, (newLeadsToday.length / leads.length) * 100) : 0}%`,
                    }}
                  />
                </div>
              </div>

              {/* Tutor Searching */}
              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span className="font-medium">2. Waiting for Teacher</span>
                  <span className="font-bold text-slate-900 font-mono">{waitingForTeacher.length}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all"
                    style={{
                      width: `${leads.length > 0 ? Math.min(100, (waitingForTeacher.length / leads.length) * 100) : 0}%`,
                    }}
                  />
                </div>
              </div>

              {/* 3-Day Demos Running */}
              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span className="font-medium">3. Demos Scheduled & Running</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {demosScheduled.length + demosRunning.length}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-600 h-full rounded-full transition-all"
                    style={{
                      width: `${
                        leads.length > 0
                          ? Math.min(100, ((demosScheduled.length + demosRunning.length) / leads.length) * 100)
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Parent Decision Pending */}
              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span className="font-medium">4. Parent Decision Pending</span>
                  <span className="font-bold text-slate-900 font-mono">{parentsWaitingDecision.length}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full rounded-full transition-all"
                    style={{
                      width: `${leads.length > 0 ? Math.min(100, (parentsWaitingDecision.length / leads.length) * 100) : 0}%`,
                    }}
                  />
                </div>
              </div>

              {/* Confirmed Tuitions */}
              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span className="font-medium text-emerald-800">5. Confirmed Active Tuitions</span>
                  <span className="font-bold text-emerald-800 font-mono">{confirmedTuitions.length}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all"
                    style={{
                      width: `${leads.length > 0 ? Math.min(100, (confirmedTuitions.length / leads.length) * 100) : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Navy Blue Monthly Target Banner */}
          <div className="bg-blue-900 rounded-xl p-5 text-white flex items-center justify-between shadow-lg shadow-blue-900/20">
            <div>
              <p className="text-xs text-blue-300 font-bold uppercase tracking-wider">Monthly Target</p>
              <h4 className="text-xl font-bold mt-1 font-mono">
                {formatCurrency(totalCollected)}
              </h4>
              <p className="text-xs text-blue-200 mt-0.5">
                Target: ₹50,000 collections
              </p>
            </div>
            <div className="w-14 h-14 rounded-full border-4 border-blue-400/30 border-t-blue-400 flex items-center justify-center font-bold text-sm font-mono">
              {Math.min(100, Math.round((totalCollected / 50000) * 100))}%
            </div>
          </div>

          {/* Collections Breakdown Box */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-bold text-slate-800">Financial Collections</span>
              <button
                type="button"
                onClick={() => onNavigateToTab("money")}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
              >
                Ledger →
              </button>
            </div>

            <div className="space-y-2 text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>₹500 Reg Fees Collected</span>
                <span className="font-bold text-emerald-700 font-mono">
                  {formatCurrency(regCollectedAmount)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>₹500 Reg Fees Pending</span>
                <span className="font-bold text-rose-600 font-mono">
                  {formatCurrency(regPendingAmount)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Teacher 50% Comm. Collected</span>
                <span className="font-bold text-emerald-700 font-mono">
                  {formatCurrency(commCollectedAmount)}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span>Teacher 50% Comm. Pending</span>
                <span className="font-bold text-rose-600 font-mono">
                  {formatCurrency(commPendingAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
