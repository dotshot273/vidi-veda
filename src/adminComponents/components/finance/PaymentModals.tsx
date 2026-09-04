import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { useCRM } from "../../context/CRMContext";
import { TuitionPayment, TeacherCommission } from "../../types/crm";
import { getTodayString } from "../../utils/dateUtils";
import { DollarSign, CheckCircle2, ShieldAlert } from "lucide-react";
import confetti from "canvas-confetti";

interface RecordRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: TuitionPayment;
}

export const RecordRegistrationModal: React.FC<RecordRegistrationModalProps> = ({
  isOpen,
  onClose,
  payment,
}) => {
  const { recordPayment } = useCRM();

  const [amount, setAmount] = useState(payment.balance || 500);
  const [method, setMethod] = useState<"UPI" | "Cash" | "Bank Transfer" | "Card" | "Other">("UPI");
  const [transactionRef, setTransactionRef] = useState("");
  const [paymentDate, setPaymentDate] = useState(getTodayString());
  const [remarks, setRemarks] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    recordPayment(payment.id, {
      amountPaid: Number(amount),
      paymentMethod: method,
      transactionRef,
      paymentDate,
      remarks,
    });

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {}

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Parent Registration Fee Payment"
      subtitle={`Student: ${payment.studentName} | Parent: ${payment.parentName}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-100 flex items-center justify-between text-xs">
          <div>
            <span className="text-emerald-800 font-semibold block">Total Due: ₹{payment.amountDue}</span>
            <span className="text-emerald-600">Already Paid: ₹{payment.amountPaid}</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 block">Pending Balance</span>
            <span className="text-base font-bold text-emerald-700 font-mono">₹{payment.balance}</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Amount Received (₹) *
          </label>
          <input
            type="number"
            min={1}
            max={payment.balance}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            required
            className="w-full text-base font-bold px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white font-mono"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Payment Method *
            </label>
            <select
              value={method}
              onChange={(e: any) => setMethod(e.target.value)}
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
              <option value="Cash">Cash in Hand</option>
              <option value="Bank Transfer">Bank NEFT / IMPS</option>
              <option value="Card">Credit / Debit Card</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Payment Date *
            </label>
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              required
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Transaction / UTR Reference ID
          </label>
          <input
            type="text"
            placeholder="e.g. UPI/26083119230/PAYTM or receipt #"
            value={transactionRef}
            onChange={(e) => setTransactionRef(e.target.value)}
            className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Receipt Notes / Remarks
          </label>
          <input
            type="text"
            placeholder="e.g. Paid via QR scan in demo class"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            Record ₹{amount} Received
          </button>
        </div>
      </form>
    </Modal>
  );
};

interface RecordCommissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  commission: TeacherCommission;
}

export const RecordCommissionModal: React.FC<RecordCommissionModalProps> = ({
  isOpen,
  onClose,
  commission,
}) => {
  const { recordCommissionPayment } = useCRM();

  const [amount, setAmount] = useState(commission.balance || commission.commissionAmount);
  const [method, setMethod] = useState<"UPI" | "Cash" | "Bank Transfer" | "Card" | "Other">("UPI");
  const [transactionId, setTransactionId] = useState("");
  const [paymentDate, setPaymentDate] = useState(getTodayString());
  const [remarks, setRemarks] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    recordCommissionPayment(commission.id, {
      amountPaid: Number(amount),
      paymentMethod: method,
      transactionId,
      paymentDate,
      remarks,
    });

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {}

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record 50% Teacher Commission Collection"
      subtitle={`Tutor: ${commission.teacherName} | Student: ${commission.studentName}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-100 flex items-center justify-between text-xs">
          <div>
            <span className="text-blue-900 font-semibold block">
              1st Month Tuition Fee: ₹{commission.firstMonthFee}
            </span>
            <span className="text-blue-700">Commission (50%): ₹{commission.commissionAmount}</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 block">Outstanding Balance</span>
            <span className="text-base font-bold text-blue-700 font-mono">₹{commission.balance}</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Amount Collected from Teacher (₹) *
          </label>
          <input
            type="number"
            min={1}
            max={commission.balance}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            required
            className="w-full text-base font-bold px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white font-mono"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Payment Method *
            </label>
            <select
              value={method}
              onChange={(e: any) => setMethod(e.target.value)}
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="UPI">UPI Transfer</option>
              <option value="Bank Transfer">Bank Transfer / NEFT</option>
              <option value="Cash">Cash Handover</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Collection Date *
            </label>
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              required
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Transaction / UTR Reference ID
          </label>
          <input
            type="text"
            placeholder="e.g. UPI Ref # or Bank Transfer Reference"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Collection Notes
          </label>
          <input
            type="text"
            placeholder="e.g. Full commission transferred after first month parent fee received"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            Record ₹{amount} Commission
          </button>
        </div>
      </form>
    </Modal>
  );
};
