import React from "react";
import { Modal } from "./Modal";
import { useCRM } from "../../context/CRMContext";
import { formatDisplayDate } from "../../utils/dateUtils";
import { History, ShieldCheck, DollarSign, FileText } from "lucide-react";

interface AuditHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditHistoryModal: React.FC<AuditHistoryModalProps> = ({ isOpen, onClose }) => {
  const { auditLogs } = useCRM();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Financial & Operations Audit Trail"
      subtitle="Immutable event logging to guarantee complete financial transparency and transaction integrity."
      maxWidth="3xl"
    >
      <div className="space-y-3 text-xs">
        <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center gap-2 text-blue-900">
          <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <span>
            Every stage change, registration fee collection, commission payment, and record creation
            is logged chronologically with timestamps.
          </span>
        </div>

        <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-1">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  {log.action}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                <span>
                  Target: <strong className="text-slate-700">{log.entity}</strong> ({log.entityId})
                </span>
                <span>
                  Operator: <strong className="text-slate-700">{log.performedBy}</strong>
                </span>
              </div>

              {log.notes && (
                <p className="text-slate-700 bg-slate-50 p-2 rounded-lg font-mono text-[11px] border border-slate-100">
                  {log.notes}
                </p>
              )}
            </div>
          ))}
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
    </Modal>
  );
};
