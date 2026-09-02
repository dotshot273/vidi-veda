import React, { useMemo, useState } from 'react';
import { CalendarDays, Check, MapPin, Pencil, Plus, X } from 'lucide-react';

const todayISO = () => new Date().toISOString().slice(0, 10);

const emptyForm = (type) => ({
  id: 0,
  type,
  mappingKey: '',
  tutor_id: '',
  address: '',
  amount: type === 'coaching' ? '' : '0',
  started_at: todayISO(),
  notes: '',
});

function formatMoney(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return '₹0';
  return `₹${num.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function AssignmentBoard({
  token,
  type,
  students,
  tutors,
  searchQuery,
  onUnauthorized,
  onRefreshLookups,
  onData,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(() => emptyForm(type));
  const [showForm, setShowForm] = useState(false);

  const isDemo = type === 'demo';
  const title = isDemo ? 'Active Demos' : 'Active Coaching';

  const childOptions = useMemo(() => {
    return students.flatMap((parent) =>
      (parent.children || []).map((child) => ({
        key: `${parent.id}::${child.id}`,
        parent,
        child,
        label: `${child.student_name} · ${child.student_class} (${parent.parent_name})`,
      }))
    );
  }, [students]);

  const sortedTutors = useMemo(() => {
    return [...tutors].sort((a, b) => {
      if (a.status === 'approved' && b.status !== 'approved') return -1;
      if (b.status === 'approved' && a.status !== 'approved') return 1;
      return (a.full_name || '').localeCompare(b.full_name || '');
    });
  }, [tutors]);

  const filteredItems = useMemo(() => {
    const q = (searchQuery || '').trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) =>
      [
        item.student_name,
        item.parent_name,
        item.tutor_name,
        item.address,
        item.city,
        item.parent_mobile,
        item.tutor_mobile,
        String(item.amount),
      ]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(q))
    );
  }, [items, searchQuery]);

  const loadAssignments = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/panel.php?action=get_assignments&type=${type}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 401) {
        onUnauthorized();
        return;
      }
      const data = await response.json();
      if (data.success) {
        setItems(data.data || []);
      } else {
        setError(data.message || 'Could not load records.');
      }
    } catch {
      setError('Could not load records.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (onData) onData(items);
  }, [items, onData]);

  React.useEffect(() => {
    setForm(emptyForm(type));
    setShowForm(false);
    loadAssignments();
    if (onRefreshLookups) onRefreshLookups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, token]);

  const handleMappingChange = (mappingKey) => {
    const option = childOptions.find((opt) => opt.key === mappingKey);
    setForm((prev) => ({
      ...prev,
      mappingKey,
      address: option?.parent?.address || prev.address,
    }));
  };

  const startEdit = (item) => {
    setForm({
      id: Number(item.id),
      type,
      mappingKey: `${item.parent_id}::${item.child_id}`,
      tutor_id: item.tutor_id || '',
      address: item.address || '',
      amount: String(item.amount ?? ''),
      started_at: (item.started_at || '').slice(0, 10),
      notes: item.notes || '',
    });
    setShowForm(true);
    setError('');
  };

  const resetForm = () => {
    setForm(emptyForm(type));
    setShowForm(false);
    setError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const [parentId, childId] = form.mappingKey.split('::');
    if (!parentId || !childId || !form.tutor_id || !form.address.trim() || !form.started_at) {
      setError('Map a student, a teacher, address, and the active-from date.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const response = await fetch('/api/panel.php?action=save_assignment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: form.id || undefined,
          type,
          parent_id: parentId,
          child_id: Number(childId),
          tutor_id: form.tutor_id,
          address: form.address.trim(),
          amount: form.amount === '' ? 0 : Number(form.amount),
          started_at: form.started_at,
          notes: form.notes.trim(),
        }),
      });
      if (response.status === 401) {
        onUnauthorized();
        return;
      }
      const data = await response.json();
      if (data.success) {
        resetForm();
        await loadAssignments();
      } else {
        setError(data.message || 'Could not save mapping.');
      }
    } catch {
      setError('Could not save mapping.');
    } finally {
      setSaving(false);
    }
  };

  const handleStatus = async (id, payload) => {
    try {
      const response = await fetch('/api/panel.php?action=update_assignment_status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, ...payload }),
      });
      if (response.status === 401) {
        onUnauthorized();
        return;
      }
      const data = await response.json();
      if (data.success) {
        await loadAssignments();
      } else {
        setError(data.message || 'Could not update status.');
      }
    } catch {
      setError('Could not update status.');
    }
  };

  return (
    <div className="space-y-0">
      <div className="px-6 py-4 border-b border-primary-100/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="font-heading font-extrabold text-sm text-charcoal">{title}</h3>
          <p className="text-[11px] text-muted-grey mt-0.5">
            Map a teacher to a student, set the class address, amount, and the date this teacher became active on this {isDemo ? 'demo' : 'coaching'}.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setForm(emptyForm(type));
            setShowForm(true);
            setError('');
          }}
          className="bg-primary-400 hover:bg-primary-500 text-white font-heading font-semibold text-xs px-4 py-2.5 rounded-xl transition flex items-center space-x-1.5 cursor-pointer shadow-md shadow-primary-400/10 w-max"
        >
          <Plus className="h-4 w-4" />
          <span>{isDemo ? 'Map Demo' : 'Map Coaching'}</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="px-6 py-5 bg-primary-50/20 border-b border-primary-100/40 space-y-4">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg text-red-700 text-xs font-semibold">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-charcoal">Student (child)</label>
              <select
                value={form.mappingKey}
                onChange={(e) => handleMappingChange(e.target.value)}
                className="w-full bg-white border border-primary-100 focus:border-primary-400 focus:outline-none rounded-xl px-3 py-2.5 text-xs"
              >
                <option value="">Select student</option>
                {childOptions.map((opt) => (
                  <option key={opt.key} value={opt.key}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-charcoal">Teacher</label>
              <select
                value={form.tutor_id}
                onChange={(e) => setForm((prev) => ({ ...prev, tutor_id: e.target.value }))}
                className="w-full bg-white border border-primary-100 focus:border-primary-400 focus:outline-none rounded-xl px-3 py-2.5 text-xs"
              >
                <option value="">Select teacher</option>
                {sortedTutors.map((tutor) => (
                  <option key={tutor.id} value={tutor.id}>
                    {tutor.full_name} ({tutor.id}{tutor.status === 'approved' ? '' : ` · ${tutor.status}`})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[11px] font-bold text-charcoal flex items-center space-x-1">
                <MapPin className="h-3.5 w-3.5 text-primary-400" />
                <span>Class address</span>
              </label>
              <textarea
                rows={2}
                value={form.address}
                onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="House / area where this class is running"
                className="w-full bg-white border border-primary-100 focus:border-primary-400 focus:outline-none rounded-xl px-3 py-2.5 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-charcoal">
                Amount {isDemo ? '(demo fee, ₹)' : '(coaching fee, ₹)'}
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
                className="w-full bg-white border border-primary-100 focus:border-primary-400 focus:outline-none rounded-xl px-3 py-2.5 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-charcoal flex items-center space-x-1">
                <CalendarDays className="h-3.5 w-3.5 text-primary-400" />
                <span>Teacher active from</span>
              </label>
              <input
                type="date"
                value={form.started_at}
                onChange={(e) => setForm((prev) => ({ ...prev, started_at: e.target.value }))}
                className="w-full bg-white border border-primary-100 focus:border-primary-400 focus:outline-none rounded-xl px-3 py-2.5 text-xs"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[11px] font-bold text-charcoal">Notes (optional)</label>
              <input
                type="text"
                value={form.notes}
                onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Timing, subjects, or coordinator notes"
                className="w-full bg-white border border-primary-100 focus:border-primary-400 focus:outline-none rounded-xl px-3 py-2.5 text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={resetForm}
              className="border border-primary-200 hover:bg-white text-charcoal font-semibold text-xs px-4 py-2.5 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-primary-400 hover:bg-primary-500 text-white font-heading font-semibold text-xs px-5 py-2.5 rounded-xl cursor-pointer disabled:opacity-50"
            >
              {saving ? 'Saving...' : form.id ? 'Update Mapping' : 'Save Mapping'}
            </button>
          </div>
        </form>
      )}

      {!showForm && error && (
        <div className="mx-6 mt-4 bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg text-red-700 text-xs font-semibold">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center text-muted-grey text-sm">Loading {title.toLowerCase()}...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-primary-100/35">
            <thead className="bg-primary-50/20 text-charcoal/80 text-[11px] font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Teacher</th>
                <th className="px-6 py-4">Address</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Active From</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-50/40 text-xs font-light text-charcoal/90">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-muted-grey">
                    No {isDemo ? 'demos' : 'coaching mappings'} found.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className={item.status !== 'active' ? 'opacity-70' : ''}>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-charcoal">{item.student_name || 'Student'}</div>
                      <div className="text-[10px] text-muted-grey">{item.student_class} · {item.parent_name}</div>
                      <div className="text-[10px] text-muted-grey">{item.parent_mobile}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-charcoal">{item.tutor_name || item.tutor_id}</div>
                      <div className="text-[10px] text-muted-grey">{item.tutor_mobile}</div>
                    </td>
                    <td className="px-6 py-4 max-w-[220px]">
                      <div className="leading-relaxed">{item.address}</div>
                      {item.city && <div className="text-[10px] text-muted-grey mt-0.5">{item.city}</div>}
                    </td>
                    <td className="px-6 py-4 font-semibold">{formatMoney(item.amount)}</td>
                    <td className="px-6 py-4">{formatDate(item.started_at)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        item.status === 'active' ? 'bg-green-100 text-green-700' :
                        item.status === 'completed' ? 'bg-primary-100 text-primary-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {item.status}
                      </span>
                      {item.notes && (
                        <div className="text-[10px] text-muted-grey mt-1 max-w-[140px]" title={item.notes}>{item.notes}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 space-y-1.5">
                      <button
                        type="button"
                        onClick={() => startEdit(item)}
                        className="flex items-center space-x-1 text-primary-500 hover:text-primary-700 font-semibold cursor-pointer"
                      >
                        <Pencil className="h-3 w-3" />
                        <span>Edit</span>
                      </button>
                      {item.status === 'active' && isDemo && (
                        <button
                          type="button"
                          onClick={() => handleStatus(item.id, { convert_to: 'coaching' })}
                          className="block text-[11px] font-semibold text-emerald-600 hover:underline cursor-pointer"
                        >
                          Move to coaching
                        </button>
                      )}
                      {item.status === 'active' && (
                        <div className="flex space-x-1 pt-0.5">
                          <button
                            type="button"
                            onClick={() => handleStatus(item.id, { status: 'completed' })}
                            className="bg-green-500 hover:bg-green-600 text-white p-1 rounded-lg cursor-pointer"
                            title="Mark completed"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatus(item.id, { status: 'cancelled' })}
                            className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-lg cursor-pointer"
                            title="Cancel"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                      {item.status !== 'active' && (
                        <button
                          type="button"
                          onClick={() => handleStatus(item.id, { status: 'active' })}
                          className="text-[10px] text-charcoal/60 hover:underline cursor-pointer"
                        >
                          Set active
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
