import React, { useState } from "react";
import { Modal } from "./Modal";
import { useCRM } from "../../context/CRMContext";
import {
  Download,
  Upload,
  FileSpreadsheet,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({ isOpen, onClose }) => {
  const {
    exportDataAsCSV,
    importLeadsFromCSV,
    importTeachersFromCSV,
    resetToSampleData,
  } = useCRM();

  const [leadCSVText, setLeadCSVText] = useState("");
  const [teacherCSVText, setTeacherCSVText] = useState("");
  const [importResult, setImportResult] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const handleLeadImport = async () => {
    if (!leadCSVText.trim()) return;
    const res = await importLeadsFromCSV(leadCSVText);
    setImportResult({
      msg: `Successfully imported ${res.imported} leads (${res.skipped} skipped as duplicate phone numbers).`,
      type: "success",
    });
    setLeadCSVText("");
  };

  const handleTeacherImport = async () => {
    if (!teacherCSVText.trim()) return;
    const res = await importTeachersFromCSV(teacherCSVText);
    setImportResult({
      msg: `Successfully imported ${res.imported} teachers (${res.skipped} skipped as duplicates).`,
      type: "success",
    });
    setTeacherCSVText("");
  };

  const handleReset = () => {
    if (window.confirm("Clear all CRM leads, teachers, demos, payments and follow-ups on the server?")) {
      resetToSampleData();
      setImportResult({
        msg: "CRM data on the server was cleared.",
        type: "success",
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Excel / CSV Data Management"
      subtitle="Export reports, bulk import records, or manage system backup."
      maxWidth="2xl"
    >
      <div className="space-y-4 text-xs">
        {importResult && (
          <div
            className={`p-3 rounded-xl border flex items-center gap-2 ${
              importResult.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-rose-50 text-rose-800 border-rose-200"
            }`}
          >
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{importResult.msg}</span>
          </div>
        )}

        {/* Export Section */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Download className="w-4 h-4 text-blue-600" />
            1-Click CSV / Excel Export
          </h4>
          <p className="text-slate-500 text-xs">
            Download your live CRM data formatted for Excel or Google Sheets.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={() => exportDataAsCSV("leads")}
              className="px-3 py-2 bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 rounded-lg text-slate-700 font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-blue-600" />
              Export Leads
            </button>
            <button
              type="button"
              onClick={() => exportDataAsCSV("teachers")}
              className="px-3 py-2 bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 rounded-lg text-slate-700 font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
              Export Teachers
            </button>
            <button
              type="button"
              onClick={() => exportDataAsCSV("tuitions")}
              className="px-3 py-2 bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 rounded-lg text-slate-700 font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              Active Tuitions
            </button>
            <button
              type="button"
              onClick={() => exportDataAsCSV("payments")}
              className="px-3 py-2 bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 rounded-lg text-slate-700 font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-amber-600" />
              Registration (₹500)
            </button>
            <button
              type="button"
              onClick={() => exportDataAsCSV("commissions")}
              className="px-3 py-2 bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 rounded-lg text-slate-700 font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-purple-600" />
              Teacher 50% Comm.
            </button>
          </div>
        </div>

        {/* Import Section */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Upload className="w-4 h-4 text-emerald-600" />
            Bulk Import from CSV
          </h4>
          <p className="text-slate-500 text-xs">
            Paste CSV rows below. The system prevents duplicate entries based on contact numbers.
          </p>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Paste Leads CSV (Header: Parent Name, Contact, Student Name, Class, Subject, Location, Fee)
            </label>
            <textarea
              rows={3}
              value={leadCSVText}
              onChange={(e) => setLeadCSVText(e.target.value)}
              placeholder="Parent Name, Contact, Student Name, Class, Subject, Location, Expected Fee&#10;Ramesh Kumar, 9811122233, Ankit Kumar, Class 10, Mathematics, Civil Lines, 4000"
              className="w-full text-xs font-mono p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
            />
            <button
              type="button"
              onClick={handleLeadImport}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-2xs transition-colors"
            >
              Import Leads Now
            </button>
          </div>
        </div>

        {/* Database Reset */}
        <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span className="text-xs text-rose-800">
              Need fresh sample data for testing?
            </span>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-white border border-rose-200 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Data
          </button>
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
