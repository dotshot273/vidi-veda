import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { useCRM } from "../../context/CRMContext";
import { openWhatsApp, WhatsAppTemplates } from "../../utils/whatsapp";
import { Send, Copy, Check, MessageCircle } from "lucide-react";

export interface WhatsAppContextData {
  studentName?: string;
  teacherName?: string;
  startDate?: string;
  endDate?: string;
  timing?: string;
  subject?: string;
  balance?: number;
  dueDate?: string;
  paymentId?: string;
  commissionId?: string;
}

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  phone: string;
  recipientName: string;
  defaultTemplate?: "demoScheduled" | "demoFeedback" | "registration" | "commission";
  contextData?: WhatsAppContextData;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  phone,
  recipientName,
  defaultTemplate = "registration",
  contextData = {} as WhatsAppContextData,
}) => {
  const { sendPaymentReminder } = useCRM();

  const [selectedTemplate, setSelectedTemplate] = useState(defaultTemplate);
  const [copied, setCopied] = useState(false);

  // Generate template message
  const getInitialMessage = () => {
    const student = contextData.studentName || "Student";
    const teacher = contextData.teacherName || "Assigned Tutor";

    if (selectedTemplate === "demoScheduled") {
      return WhatsAppTemplates.demoScheduled(
        recipientName,
        student,
        teacher,
        contextData.startDate || "Tomorrow",
        contextData.endDate || "3 days later",
        contextData.timing || "5:00 PM",
        contextData.subject || "Tuition Subjects"
      );
    } else if (selectedTemplate === "demoFeedback") {
      return WhatsAppTemplates.demoFeedback(recipientName, student, teacher);
    } else if (selectedTemplate === "registration") {
      return WhatsAppTemplates.registrationReminder(
        recipientName,
        student,
        contextData.balance || 500
      );
    } else if (selectedTemplate === "commission") {
      return WhatsAppTemplates.teacherCommissionReminder(
        recipientName,
        student,
        contextData.balance || 2000,
        contextData.dueDate || "Due Soon"
      );
    }
    return `Hello ${recipientName}, this is from Home Tuition Service regarding ${student}'s classes.`;
  };

  const [customText, setCustomText] = useState(getInitialMessage());

  // Update text when template changes
  const handleTemplateChange = (template: any) => {
    setSelectedTemplate(template);
    const student = contextData.studentName || "Student";
    const teacher = contextData.teacherName || "Assigned Tutor";

    if (template === "demoScheduled") {
      setCustomText(
        WhatsAppTemplates.demoScheduled(
          recipientName,
          student,
          teacher,
          contextData.startDate || "Tomorrow",
          contextData.endDate || "3 days later",
          contextData.timing || "5:00 PM",
          contextData.subject || "Tuition Subjects"
        )
      );
    } else if (template === "demoFeedback") {
      setCustomText(WhatsAppTemplates.demoFeedback(recipientName, student, teacher));
    } else if (template === "registration") {
      setCustomText(
        WhatsAppTemplates.registrationReminder(
          recipientName,
          student,
          contextData.balance || 500
        )
      );
    } else if (template === "commission") {
      setCustomText(
        WhatsAppTemplates.teacherCommissionReminder(
          recipientName,
          student,
          contextData.balance || 2000,
          contextData.dueDate || "Due Soon"
        )
      );
    }
  };

  const handleSend = () => {
    // Record reminder in context if linked to payment or commission
    if (contextData.paymentId) {
      sendPaymentReminder("registration", contextData.paymentId);
    } else if (contextData.commissionId) {
      sendPaymentReminder("commission", contextData.commissionId);
    }

    openWhatsApp(phone, customText);
    onClose();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(customText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="WhatsApp Message Dispatch"
      subtitle={`Recipient: ${recipientName} (${phone})`}
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Template Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Select Template
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleTemplateChange("registration")}
              className={`text-xs py-2 px-3 rounded-lg border font-medium text-left transition-all ${
                selectedTemplate === "registration"
                  ? "bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              ₹500 Reg. Reminder
            </button>
            <button
              type="button"
              onClick={() => handleTemplateChange("demoScheduled")}
              className={`text-xs py-2 px-3 rounded-lg border font-medium text-left transition-all ${
                selectedTemplate === "demoScheduled"
                  ? "bg-blue-50 border-blue-500 text-blue-800 font-semibold"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              Demo Confirmation
            </button>
            <button
              type="button"
              onClick={() => handleTemplateChange("demoFeedback")}
              className={`text-xs py-2 px-3 rounded-lg border font-medium text-left transition-all ${
                selectedTemplate === "demoFeedback"
                  ? "bg-purple-50 border-purple-500 text-purple-800 font-semibold"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              Demo Feedback
            </button>
            <button
              type="button"
              onClick={() => handleTemplateChange("commission")}
              className={`text-xs py-2 px-3 rounded-lg border font-medium text-left transition-all ${
                selectedTemplate === "commission"
                  ? "bg-amber-50 border-amber-500 text-amber-800 font-semibold"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              Teacher 50% Commission
            </button>
          </div>
        </div>

        {/* Text Preview / Edit */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-700">
              Message Content (Editable)
            </label>
            <button
              type="button"
              onClick={handleCopy}
              className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-medium"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
          </div>
          <textarea
            rows={7}
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            className="w-full text-xs font-sans p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 leading-relaxed"
          />
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSend}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all"
          >
            <Send className="w-4 h-4" />
            Open in WhatsApp
          </button>
        </div>
      </div>
    </Modal>
  );
};
