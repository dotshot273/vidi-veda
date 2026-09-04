import React, { useState } from "react";
import { useCRM } from "../../context/CRMContext";
import { TuitionPayment, TeacherCommission, ActiveTuition, Teacher } from "../../types/crm";
import { Badge } from "../common/Badge";
import { formatCurrency, formatDisplayDate, isOverdue } from "../../utils/dateUtils";
import {
  DollarSign,
  Search,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Download,
  Calendar,
  UserCheck,
  TrendingUp,
  Receipt,
  PieChart,
} from "lucide-react";
import { RecordRegistrationModal, RecordCommissionModal } from "./PaymentModals";

interface FinancialLedgerProps {
  onOpenWhatsApp: (phone: string, name: string, context?: any) => void;
  onSelectLeadProfile?: (leadId: string) => void;
  onSelectTeacherProfile?: (teacher: Teacher) => void;
}

export const FinancialLedger: React.FC<FinancialLedgerProps> = ({
  onOpenWhatsApp,
  onSelectLeadProfile,
  onSelectTeacherProfile,
}) => {
  const { payments, commissions, tuitions, leads, teachers, exportDataAsCSV } = useCRM();

  const [activeTab, setActiveTab] = useState<"registration" | "commissions" | "tuitions" | "reports">(
    "registration"
  );
  const [search, setSearch] = useState("");

  const [selectedRegPayment, setSelectedRegPayment] = useState<TuitionPayment | null>(null);
  const [selectedCommission, setSelectedCommission] = useState<TeacherCommission | null>(null);

  // Financial aggregates
  const totalRegCollected = payments.reduce((sum, p) => sum + p.amountPaid, 0);
  const totalRegPending = payments
    .filter((p) => p.status !== "Paid" && p.status !== "Cancelled")
    .reduce((sum, p) => sum + p.balance, 0);

  const totalCommCollected = commissions.reduce((sum, c) => sum + c.amountPaid, 0);
  const totalCommPending = commissions
    .filter((c) => c.status !== "Paid" && c.status !== "Cancelled")
    .reduce((sum, c) => sum + c.balance, 0);

  const totalRevenueCollected = totalRegCollected + totalCommCollected;
  const totalReceivablesPending = totalRegPending + totalCommPending;

  // Filtered lists
  const filteredPayments = payments.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.id.toLowerCase().includes(q) ||
      p.studentName.toLowerCase().includes(q) ||
      p.parentName.toLowerCase().includes(q)
    );
  });

  const filteredCommissions = commissions.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.id.toLowerCase().includes(q) ||
      c.teacherName.toLowerCase().includes(q) ||
      c.studentName.toLowerCase().includes(q)
    );
  });

  const filteredTuitions = tuitions.filter((t) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      t.id.toLowerCase().includes(q) ||
      t.studentName.toLowerCase().includes(q) ||
      t.parentName.toLowerCase().includes(q) ||
      t.teacherName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      {/* Top Header & Totals Banner */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Receipt className="w-5 h-5 text-emerald-600" />
              Financial Ledger & Revenue Tracking
            </h2>
            <p className="text-xs text-slate-500">
              ₹500 Parent Registration Fees & 50% Teacher First-Month Commissions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => exportDataAsCSV(activeTab === "commissions" ? "commissions" : "payments")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* 4 Financial Stat Blocks */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200">
            <span className="text-[11px] font-bold text-emerald-800 uppercase block">
              Total Money Received
            </span>
            <span className="text-xl font-black text-emerald-950 font-mono mt-0.5 block">
              {formatCurrency(totalRevenueCollected)}
            </span>
            <span className="text-[10px] text-emerald-700 font-medium">
              Reg (₹{totalRegCollected}) + Comm (₹{totalCommCollected})
            </span>
          </div>

          <div className="p-3 bg-rose-50/70 rounded-xl border border-rose-200">
            <span className="text-[11px] font-bold text-rose-800 uppercase block">
              Total Outstanding Receivables
            </span>
            <span className="text-xl font-black text-rose-950 font-mono mt-0.5 block">
              {formatCurrency(totalReceivablesPending)}
            </span>
            <span className="text-[10px] text-rose-700 font-medium">
              Reg (₹{totalRegPending}) + Comm (₹{totalCommPending})
            </span>
          </div>

          <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200">
            <span className="text-[11px] font-bold text-blue-800 uppercase block">
              ₹500 Parent Registrations
            </span>
            <span className="text-xl font-black text-blue-950 font-mono mt-0.5 block">
              {payments.filter((p) => p.status === "Paid").length} / {payments.length} Paid
            </span>
            <span className="text-[10px] text-blue-700 font-medium">
              Pending: ₹{totalRegPending}
            </span>
          </div>

          <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-200">
            <span className="text-[11px] font-bold text-purple-800 uppercase block">
              Teacher 50% Commissions
            </span>
            <span className="text-xl font-black text-purple-950 font-mono mt-0.5 block">
              {commissions.filter((c) => c.status === "Paid").length} / {commissions.length} Cleared
            </span>
            <span className="text-[10px] text-purple-700 font-medium">
              Pending: ₹{totalCommPending}
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between gap-2 flex-wrap pt-1 border-t border-slate-100">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("registration")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === "registration"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              ₹500 Parent Registrations ({payments.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("commissions")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === "commissions"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Teacher 50% Commissions ({commissions.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("tuitions")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === "tuitions"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Active Tuitions Master ({tuitions.length})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search records..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
        </div>
      </div>

      {/* TAB 1: ₹500 REGISTRATION PAYMENTS TABLE */}
      {activeTab === "registration" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Receipt ID</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Parent Details</th>
                  <th className="py-3 px-4">Amount Due</th>
                  <th className="py-3 px-4">Amount Paid</th>
                  <th className="py-3 px-4">Balance</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayments.map((p) => {
                  const overdue = p.balance > 0 && isOverdue(p.dueDate);
                  const linkedLead = leads.find((l) => l.id === p.leadId);

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {p.id}
                        <span className="block text-[10px] text-slate-400 font-normal">
                          {p.paymentMethod || "Pending"}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {p.studentName}
                        <span className="block text-[10px] text-slate-400 font-normal">
                          Tuition: {p.tuitionId}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800">{p.parentName}</span>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span>{p.parentContact}</span>
                          <button
                            type="button"
                            onClick={() =>
                              onOpenWhatsApp(p.parentContact, p.parentName, {
                                studentName: p.studentName,
                                balance: p.balance,
                                paymentId: p.id,
                              })
                            }
                            className="text-emerald-600 hover:text-emerald-700"
                            title="Send WhatsApp Reminder"
                          >
                            <MessageCircle className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">₹{p.amountDue}</td>
                      <td className="py-3 px-4 font-mono font-semibold text-emerald-600">
                        ₹{p.amountPaid}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-rose-600">
                        ₹{p.balance}
                        {p.balance > 0 && overdue && (
                          <span className="block text-[10px] text-rose-500 font-sans font-semibold">
                            Overdue!
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            p.status === "Paid" ? "green" : overdue ? "red" : "yellow"
                          }
                          size="sm"
                          dot
                        >
                          {p.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-500">{formatDisplayDate(p.dueDate)}</td>
                      <td className="py-3 px-4 text-right">
                        {p.balance > 0 ? (
                          <button
                            type="button"
                            onClick={() => setSelectedRegPayment(p)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-2xs transition-colors"
                          >
                            Record Pay
                          </button>
                        ) : (
                          <span className="text-[11px] font-bold text-emerald-600 flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Cleared
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: TEACHER 50% COMMISSION TABLE */}
      {activeTab === "commissions" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Commission ID</th>
                  <th className="py-3 px-4">Tutor Name</th>
                  <th className="py-3 px-4">Student & Tuition</th>
                  <th className="py-3 px-4">1st Month Fee</th>
                  <th className="py-3 px-4">50% Commission</th>
                  <th className="py-3 px-4">Collected</th>
                  <th className="py-3 px-4">Pending</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCommissions.map((c) => {
                  const overdue = c.balance > 0 && isOverdue(c.dueDate);

                  return (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {c.id}
                        <span className="block text-[10px] text-slate-400 font-normal">
                          {formatDisplayDate(c.createdAt)}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {onSelectTeacherProfile ? (
                          <button
                            type="button"
                            onClick={() => {
                              const t = teachers.find((item) => item.id === c.teacherId);
                              if (t) onSelectTeacherProfile(t);
                            }}
                            className="hover:text-blue-600 transition-colors text-left flex items-center gap-1 font-bold"
                            title="Click to view tutor profile"
                          >
                            <UserCheck className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                            <span>{c.teacherName}</span>
                          </button>
                        ) : (
                          <span>{c.teacherName}</span>
                        )}
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <span>{c.teacherContact}</span>
                          <button
                            type="button"
                            onClick={() =>
                              onOpenWhatsApp(c.teacherContact, c.teacherName, {
                                studentName: c.studentName,
                                balance: c.balance,
                                commissionId: c.id,
                                dueDate: c.dueDate,
                              })
                            }
                            className="text-emerald-600 hover:text-emerald-700"
                            title="WhatsApp Tutor"
                          >
                            <MessageCircle className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800">{c.studentName}</span>
                        <span className="block text-[10px] text-slate-400 font-mono">
                          Tuition: {c.tuitionId}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                        ₹{c.firstMonthFee}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-blue-700">
                        ₹{c.commissionAmount}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-emerald-600">
                        ₹{c.amountPaid}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-rose-600">
                        ₹{c.balance}
                        {c.balance > 0 && overdue && (
                          <span className="block text-[10px] text-rose-500 font-sans font-semibold">
                            Overdue!
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            c.status === "Paid" ? "green" : overdue ? "red" : "yellow"
                          }
                          size="sm"
                          dot
                        >
                          {c.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {c.balance > 0 ? (
                          <button
                            type="button"
                            onClick={() => setSelectedCommission(c)}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-2xs transition-colors"
                          >
                            Collect Comm.
                          </button>
                        ) : (
                          <span className="text-[11px] font-bold text-emerald-600 flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Received
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ACTIVE TUITIONS MASTER REGISTER (Section 13) */}
      {activeTab === "tuitions" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Tuition ID</th>
                  <th className="py-3 px-4">Student & Parent</th>
                  <th className="py-3 px-4">Assigned Tutor</th>
                  <th className="py-3 px-4">Monthly Fee</th>
                  <th className="py-3 px-4">Tuition Start Date</th>
                  <th className="py-3 px-4">Parent ₹500 Reg</th>
                  <th className="py-3 px-4">Teacher 50% Comm</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTuitions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{t.id}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{t.studentName}</span>
                      <span className="text-slate-500 text-[11px]">
                        Parent: {t.parentName} ({t.parentContact})
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {onSelectTeacherProfile ? (
                        <button
                          type="button"
                          onClick={() => {
                            const tutor = teachers.find((item) => item.id === t.teacherId);
                            if (tutor) onSelectTeacherProfile(tutor);
                          }}
                          className="font-semibold text-slate-900 hover:text-blue-600 block text-left transition-colors"
                          title="Click to view tutor profile"
                        >
                          {t.teacherName}
                        </button>
                      ) : (
                        <span className="font-semibold text-slate-900 block">{t.teacherName}</span>
                      )}
                      <span className="text-slate-500 text-[11px]">{t.teacherContact}</span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-700 text-sm">
                      ₹{t.monthlyTuitionFee}/mo
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {formatDisplayDate(t.tuitionStartDate)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={t.registrationStatus === "Paid" ? "green" : "yellow"}
                        size="sm"
                      >
                        {t.registrationStatus}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={t.teacherCommissionStatus === "Paid" ? "green" : "yellow"}
                        size="sm"
                      >
                        {t.teacherCommissionStatus}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="green" size="sm" dot>
                        {t.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Embedded Payment Modals */}
      {selectedRegPayment && (
        <RecordRegistrationModal
          isOpen={!!selectedRegPayment}
          onClose={() => setSelectedRegPayment(null)}
          payment={selectedRegPayment}
        />
      )}

      {selectedCommission && (
        <RecordCommissionModal
          isOpen={!!selectedCommission}
          onClose={() => setSelectedCommission(null)}
          commission={selectedCommission}
        />
      )}
    </div>
  );
};
