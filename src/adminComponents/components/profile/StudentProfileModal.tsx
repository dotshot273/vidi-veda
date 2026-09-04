import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { useCRM } from "../../context/CRMContext";
import { Lead, Teacher } from "../../types/crm";
import { Badge, getStatusBadgeProps } from "../common/Badge";
import { formatDisplayDate } from "../../utils/dateUtils";
import {
  Phone,
  MessageCircle,
  MapPin,
  Calendar,
  DollarSign,
  GraduationCap,
  Clock,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  History,
  FileEdit,
} from "lucide-react";
import { WhatsAppModal } from "../whatsapp/WhatsAppModal";
import { RecordRegistrationModal, RecordCommissionModal } from "../finance/PaymentModals";

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead;
  onSelectTeacherProfile?: (teacher: Teacher) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  lead,
  onSelectTeacherProfile,
}) => {
  const { demos, payments, commissions, tuitions, followUps, auditLogs, updateLeadStatus, teachers } = useCRM();

  const [whatsAppOpen, setWhatsAppOpen] = useState(false);
  const [recordRegOpen, setRecordRegOpen] = useState(false);
  const [recordCommOpen, setRecordCommOpen] = useState(false);

  // Connected records
  const linkedDemo = demos.find((d) => d.leadId === lead.id);
  const linkedPayment = payments.find((p) => p.leadId === lead.id);
  const linkedCommission = commissions.find((c) => c.leadId === lead.id);
  const linkedTuition = tuitions.find((t) => t.leadId === lead.id);
  const linkedFollowUps = followUps.filter((f) => f.leadId === lead.id || (linkedTuition && f.tuitionId === linkedTuition.id));
  const linkedAudit = auditLogs.filter((a) => a.entityId === lead.id || (linkedTuition && a.entityId === linkedTuition.id));

  const cleanParentPhone = lead.parentContact.replace(/\D/g, "");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${lead.studentName} — Student & Parent Profile`}
      subtitle={`Lead ID: ${lead.id} | Enquired on: ${formatDisplayDate(lead.enquiryDate)}`}
      maxWidth="3xl"
    >
      <div className="space-y-4 text-xs">
        {/* Top Header Card */}
        <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-white">{lead.studentName}</h2>
              <span className="bg-white/20 text-white px-2 py-0.5 rounded-md font-mono text-xs">
                {lead.studentClass}
              </span>
              <Badge variant={getStatusBadgeProps(lead.status).variant} size="sm">
                {lead.status}
              </Badge>
            </div>
            <p className="text-slate-300 text-xs mt-1">
              Parent: <span className="font-semibold text-white">{lead.parentName}</span> • School: {lead.school || "Not Specified"}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href={`tel:${cleanParentPhone}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              Call
            </a>
            <button
              type="button"
              onClick={() => setWhatsAppOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp
            </button>
          </div>
        </div>

        {/* 2-Column Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Student & Academic Info */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              Student Academic Requirement
            </h4>
            <div className="grid grid-cols-2 gap-2 text-slate-700">
              <div>
                <span className="text-slate-400 block">Required Subject</span>
                <span className="font-semibold text-slate-900">{lead.subjectRequired}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Location / Area</span>
                <span className="font-semibold text-slate-900 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-rose-500" />
                  {lead.location}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Preferred Timing</span>
                <span className="font-semibold text-slate-900">{lead.preferredTiming}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Expected Monthly Fee</span>
                <span className="font-semibold text-emerald-700 font-mono">₹{lead.expectedMonthlyFee}/month</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block">Tutor Preference</span>
                <span className="text-slate-800">{lead.teacherPreference || "None specified"}</span>
              </div>
            </div>
          </div>

          {/* Assigned Teacher Card */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-indigo-600" />
              Assigned Home Tutor
            </h4>
            {lead.assignedTeacherName ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">{lead.assignedTeacherName}</span>
                  <span className="text-[11px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-mono font-medium">
                    {lead.assignedTeacherId}
                  </span>
                </div>
                {linkedTuition && (
                  <p className="text-slate-600">
                    Contact: <span className="font-medium">{linkedTuition.teacherContact}</span>
                  </p>
                )}
                <p className="text-slate-600">
                  Classes running since:{" "}
                  <span className="font-medium text-slate-900">
                    {linkedTuition ? formatDisplayDate(linkedTuition.tuitionStartDate) : "Demo stage"}
                  </span>
                </p>

                {onSelectTeacherProfile && lead.assignedTeacherId && (
                  <button
                    type="button"
                    onClick={() => {
                      const t = teachers.find((item) => item.id === lead.assignedTeacherId);
                      if (t) onSelectTeacherProfile(t);
                    }}
                    className="mt-1 w-full py-1 px-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>View {lead.assignedTeacherName}'s Profile →</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="py-3 text-center text-slate-400">
                <p>No tutor assigned yet.</p>
                <span className="text-[11px] text-blue-600 font-medium cursor-pointer">
                  Use Teacher Matching in Pipeline
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 3-Day Demo Tracking Card */}
        {linkedDemo && (
          <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-600" />
                3-Day Demo Status ({linkedDemo.id})
              </h4>
              <span className="text-[11px] text-blue-700 font-medium">
                {formatDisplayDate(linkedDemo.startDate)} to {formatDisplayDate(linkedDemo.endDate)}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-white rounded-lg border border-blue-100">
                <span className="text-[10px] text-slate-400 font-bold block">DAY 1</span>
                <Badge
                  variant={linkedDemo.day1Status === "Completed" ? "green" : "yellow"}
                  size="sm"
                >
                  {linkedDemo.day1Status}
                </Badge>
              </div>
              <div className="p-2 bg-white rounded-lg border border-blue-100">
                <span className="text-[10px] text-slate-400 font-bold block">DAY 2</span>
                <Badge
                  variant={linkedDemo.day2Status === "Completed" ? "green" : "yellow"}
                  size="sm"
                >
                  {linkedDemo.day2Status}
                </Badge>
              </div>
              <div className="p-2 bg-white rounded-lg border border-blue-100">
                <span className="text-[10px] text-slate-400 font-bold block">DAY 3</span>
                <Badge
                  variant={linkedDemo.day3Status === "Completed" ? "green" : "yellow"}
                  size="sm"
                >
                  {linkedDemo.day3Status}
                </Badge>
              </div>
            </div>

            {(linkedDemo.parentFeedback || linkedDemo.finalResult) && (
              <div className="pt-2 border-t border-blue-200/60 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 block">Parent Feedback</span>
                  <span className="font-semibold text-slate-800">{linkedDemo.parentFeedback || "-"}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Teacher Feedback</span>
                  <span className="font-semibold text-slate-800">{linkedDemo.teacherFeedback || "-"}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Final Result</span>
                  <span className="font-bold text-emerald-700">{linkedDemo.finalResult || "-"}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Financials & Payment Ledger */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            Financials & Collection Tracking
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Parent ₹500 Registration Fee */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Parent Registration Fee</span>
                {linkedPayment && (
                  <Badge
                    variant={linkedPayment.status === "Paid" ? "green" : "yellow"}
                    size="sm"
                  >
                    {linkedPayment.status}
                  </Badge>
                )}
              </div>
              {linkedPayment ? (
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-600">
                    <span>Fee Due:</span>
                    <span className="font-semibold">₹{linkedPayment.amountDue}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Paid:</span>
                    <span className="font-semibold text-emerald-600">₹{linkedPayment.amountPaid}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Balance:</span>
                    <span className="font-bold text-rose-600 font-mono">₹{linkedPayment.balance}</span>
                  </div>
                  {linkedPayment.balance > 0 && (
                    <button
                      type="button"
                      onClick={() => setRecordRegOpen(true)}
                      className="w-full mt-2 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                    >
                      Record ₹{linkedPayment.balance} Paid
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-slate-400">Created automatically when tuition is confirmed.</p>
              )}
            </div>

            {/* Teacher 50% Commission */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Teacher 50% Commission</span>
                {linkedCommission && (
                  <Badge
                    variant={linkedCommission.status === "Paid" ? "green" : "yellow"}
                    size="sm"
                  >
                    {linkedCommission.status}
                  </Badge>
                )}
              </div>
              {linkedCommission ? (
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-600">
                    <span>1st Month Fee:</span>
                    <span className="font-semibold">₹{linkedCommission.firstMonthFee}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>50% Commission:</span>
                    <span className="font-semibold">₹{linkedCommission.commissionAmount}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Outstanding:</span>
                    <span className="font-bold text-rose-600 font-mono">₹{linkedCommission.balance}</span>
                  </div>
                  {linkedCommission.balance > 0 && (
                    <button
                      type="button"
                      onClick={() => setRecordCommOpen(true)}
                      className="w-full mt-2 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      Record ₹{linkedCommission.balance} Collected
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-slate-400">Calculated automatically upon tuition confirmation.</p>
              )}
            </div>
          </div>
        </div>

        {/* Follow-up & Interaction History */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <History className="w-4 h-4 text-purple-600" />
            Follow-up & Communication History
          </h4>

          {linkedFollowUps.length === 0 ? (
            <p className="text-slate-400">No follow-ups recorded yet.</p>
          ) : (
            <div className="space-y-2 max-h-36 overflow-y-auto">
              {linkedFollowUps.map((f) => (
                <div
                  key={f.id}
                  className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-start justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800">{f.followUpType}</span>
                      <Badge
                        variant={f.status === "Completed" ? "green" : "yellow"}
                        size="sm"
                      >
                        {f.status}
                      </Badge>
                    </div>
                    <p className="text-slate-600">{f.nextAction}</p>
                    {f.remarks && <p className="text-slate-400 italic">{f.remarks}</p>}
                  </div>
                  <span className="text-[11px] text-slate-400 whitespace-nowrap">
                    Due: {formatDisplayDate(f.dueDate)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Embedded WhatsApp modal */}
      {whatsAppOpen && (
        <WhatsAppModal
          isOpen={whatsAppOpen}
          onClose={() => setWhatsAppOpen(false)}
          phone={lead.parentContact}
          recipientName={lead.parentName}
          contextData={{
            studentName: lead.studentName,
            teacherName: lead.assignedTeacherName,
            balance: linkedPayment ? linkedPayment.balance : 500,
            paymentId: linkedPayment?.id,
          }}
        />
      )}

      {/* Embedded payment recording modal */}
      {recordRegOpen && linkedPayment && (
        <RecordRegistrationModal
          isOpen={recordRegOpen}
          onClose={() => setRecordRegOpen(false)}
          payment={linkedPayment}
        />
      )}

      {/* Embedded commission modal */}
      {recordCommOpen && linkedCommission && (
        <RecordCommissionModal
          isOpen={recordCommOpen}
          onClose={() => setRecordCommOpen(false)}
          commission={linkedCommission}
        />
      )}
    </Modal>
  );
};
