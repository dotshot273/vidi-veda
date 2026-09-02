import React, { useState, useEffect } from 'react';
import { Lock, LogOut, Search, Download, Check, X, ExternalLink, Users, GraduationCap, Mail, RefreshCw, ChevronDown, ChevronUp, Calendar, BookOpen } from 'lucide-react';
import AssignmentBoard from '../components/AssignmentBoard';

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Dashboard Data State
  const [activeTab, setActiveTab] = useState('students');
  const [students, setStudents] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [assignmentRefresh, setAssignmentRefresh] = useState(0);
  
  const [dataLoading, setDataLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [expandedStudentId, setExpandedStudentId] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);

  // Auth token
  const [token, setToken] = useState(localStorage.getItem('vv_admin_token') || '');

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
      if (activeTab === 'demos' || activeTab === 'coaching') {
        fetchLookups();
      } else {
        fetchData();
      }
    }
  }, [token, activeTab]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setAuthError("Please fill all fields");
      return;
    }
    setAuthLoading(true);
    setAuthError('');

    try {
      const response = await fetch('/api/panel.php?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem('vv_admin_token', data.token);
        setToken(data.token);
        setIsLoggedIn(true);
      } else {
        setAuthError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setAuthError('Database offline or connection refused.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('vv_admin_token');
    setToken('');
    setIsLoggedIn(false);
    setStudents([]);
    setTutors([]);
    setContacts([]);
    setAssignments([]);
  };

  const authHeaders = () => ({ Authorization: `Bearer ${token}` });

  const fetchLookups = async () => {
    try {
      const [stuRes, tutRes] = await Promise.all([
        fetch('/api/panel.php?action=get_students', { headers: authHeaders() }),
        fetch('/api/panel.php?action=get_tutors', { headers: authHeaders() }),
      ]);
      if (stuRes.status === 401 || tutRes.status === 401) {
        handleLogout();
        return;
      }
      const stuData = await stuRes.json();
      const tutData = await tutRes.json();
      if (stuData.success) setStudents(stuData.data || []);
      if (tutData.success) setTutors(tutData.data || []);
    } catch (err) {
      console.error('Error fetching mapping lookups:', err);
    }
  };

  const fetchData = async () => {
    setDataLoading(true);
    try {
      let endpoint = '';
      if (activeTab === 'students') endpoint = '/api/panel.php?action=get_students';
      else if (activeTab === 'tutors') endpoint = '/api/panel.php?action=get_tutors';
      else if (activeTab === 'contacts') endpoint = '/api/panel.php?action=get_contacts';

      const response = await fetch(endpoint, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.status === 401) {
        handleLogout();
        return;
      }

      const data = await response.json();
      if (data.success) {
        if (activeTab === 'students') setStudents(data.data);
        else if (activeTab === 'tutors') setTutors(data.data);
        else if (activeTab === 'contacts') setContacts(data.data);
      }
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setDataLoading(false);
    }
  };

  const handleUpdateTutorStatus = async (tutorId, nextStatus) => {
    try {
      const response = await fetch('/api/panel.php?action=update_tutor_status', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ tutor_id: tutorId, status: nextStatus })
      });

      const data = await response.json();
      if (data.success) {
        setTutors(tutors.map(t => t.id === tutorId ? { ...t, status: nextStatus } : t));
      } else {
        alert(data.message || 'Failed to update status');
      }
    } catch (err) {
      alert('Network error while updating tutor status.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordMessage('');
    if (!currentPassword || !newPassword) {
      setPasswordError('Fill current and new password.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }
    setPasswordSaving(true);
    try {
      const response = await fetch('/api/panel.php?action=change_password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });
      if (response.status === 401) {
        handleLogout();
        return;
      }
      const data = await response.json();
      if (data.success) {
        setPasswordMessage('Password updated and saved in the database.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordError(data.message || 'Could not update password.');
      }
    } catch {
      setPasswordError('Could not update password.');
    } finally {
      setPasswordSaving(false);
    }
  };

  const toggleStudentExpand = (id) => {
    if (expandedStudentId === id) setExpandedStudentId(null);
    else setExpandedStudentId(id);
  };

  // CSV Exporter (Client-side)
  const exportToCSV = () => {
    let headers = [];
    let rows = [];
    let filename = '';

    if (activeTab === 'students') {
      filename = 'VidiVeda_Students_Export.csv';
      headers = ['Student ID', 'Parent Name', 'Mobile', 'WhatsApp', 'City', 'Address', 'Registration Date', 'Children (Name - Class - Board - Subjects - Format - Time)'];
      rows = students.map(s => {
        const kidsInfo = s.children?.map(c => `${c.student_name} (${c.student_class}, ${c.board}, ${c.subjects}, ${c.tuition_type}, ${c.preferred_timing})`).join(' | ') || '';
        return [
          s.id,
          s.parent_name,
          s.mobile_number,
          s.whatsapp_number,
          s.city,
          `"${s.address.replace(/"/g, '""')}"`,
          s.created_at,
          `"${kidsInfo.replace(/"/g, '""')}"`
        ];
      });
    } else if (activeTab === 'tutors') {
      filename = 'VidiVeda_Tutors_Export.csv';
      headers = ['Tutor ID', 'Full Name', 'Mobile', 'Qualification', 'Subjects', 'Experience', 'Preferred Areas', 'Status', 'Date Registered'];
      rows = tutors.map(t => [
        t.id,
        t.full_name,
        t.mobile_number,
        t.qualification,
        `"${t.subjects.replace(/"/g, '""')}"`,
        t.experience,
        `"${t.preferred_areas.replace(/"/g, '""')}"`,
        t.status,
        t.created_at
      ]);
    } else if (activeTab === 'demos' || activeTab === 'coaching') {
      filename = activeTab === 'demos' ? 'VidiVeda_Active_Demos.csv' : 'VidiVeda_Active_Coaching.csv';
      headers = ['ID', 'Student', 'Class', 'Parent', 'Parent Mobile', 'Teacher', 'Teacher Mobile', 'Address', 'Amount', 'Active From', 'Status', 'Notes'];
      rows = assignments.map((a) => [
        a.id,
        a.student_name,
        a.student_class,
        a.parent_name,
        a.parent_mobile,
        a.tutor_name,
        a.tutor_mobile,
        `"${String(a.address || '').replace(/"/g, '""')}"`,
        a.amount,
        a.started_at,
        a.status,
        `"${String(a.notes || '').replace(/"/g, '""')}"`
      ]);
    } else {
      filename = 'VidiVeda_Contacts_Export.csv';
      headers = ['ID', 'Name', 'Email', 'Mobile', 'Message', 'Date'];
      rows = contacts.map(c => [
        c.id,
        c.name,
        c.email,
        c.mobile,
        `"${c.message.replace(/"/g, '""')}"`,
        c.created_at
      ]);
    }

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Search filtering logic
  const filteredStudents = students.filter(s => 
    s.parent_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.mobile_number.includes(searchQuery) ||
    s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.city.toLowerCase().includes(searchQuery.toLowerCase())
  ).filter(s => filterCity === '' ? true : s.city === filterCity);

  const filteredTutors = tutors.filter(t => 
    t.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.mobile_number.includes(searchQuery) ||
    t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.preferred_areas.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.mobile.includes(searchQuery) ||
    c.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Extract unique cities registered for filtering
  const studentCities = Array.from(new Set(students.map(s => s.city)));

  if (!isLoggedIn) {
    // Render Login Screen
    return (
      <div className="min-h-screen bg-cream flex flex-col justify-center items-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-primary-100 shadow-xl max-w-md w-full text-center space-y-6">
          <div className="space-y-2">
            <h1 className="font-heading font-extrabold text-3xl text-charcoal">Vidi Veda</h1>
            <p className="text-xs text-primary-400 font-bold uppercase tracking-widest">Admin Control Login</p>
          </div>

          {authError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg text-red-700 text-xs font-semibold text-left">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-charcoal">Username</label>
              <input
                type="text"
                placeholder="Enter admin username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-cream/30 border border-primary-100 focus:border-primary-400 focus:outline-none rounded-xl px-4 py-3 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-charcoal">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-cream/30 border border-primary-100 focus:border-primary-400 focus:outline-none rounded-xl px-4 py-3 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-primary-400 hover:bg-primary-500 text-white font-heading font-semibold py-3 rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-md shadow-primary-400/10"
            >
              <Lock className="h-4.5 w-4.5" />
              <span>{authLoading ? 'Authorizing...' : 'Log In Securely'}</span>
            </button>
          </form>

          <p className="text-[10px] text-muted-grey">Access restricted to authorized personnel of Vidi Veda only.</p>
        </div>
      </div>
    );
  }

  // Render Dashboard
  return (
    <div className="min-h-screen bg-primary-50/10 text-left">
      {/* Header bar */}
      <header className="bg-white border-b border-primary-100/50 shadow-sm sticky top-0 z-40 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-400 text-white p-2 rounded-xl">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-xl text-charcoal">
                Vidi Veda <span className="text-primary-400 font-medium">Dashboard</span>
              </span>
              <p className="text-[9px] font-bold text-muted-grey uppercase tracking-widest mt-0.5">Bareilly Headquarters</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setShowPasswordForm((open) => !open);
                setPasswordError('');
                setPasswordMessage('');
              }}
              className="flex items-center space-x-1.5 bg-white hover:bg-primary-50 border border-primary-100 text-charcoal font-semibold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
            >
              <Lock className="h-4 w-4" />
              <span>Change Password</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-semibold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {showPasswordForm && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <form onSubmit={handleChangePassword} className="bg-white border border-primary-100 rounded-2xl p-5 shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-charcoal">Current password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-cream/20 border border-primary-100 focus:border-primary-400 focus:outline-none rounded-xl px-3 py-2.5 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-charcoal">New password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-cream/20 border border-primary-100 focus:border-primary-400 focus:outline-none rounded-xl px-3 py-2.5 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-charcoal">Confirm new password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-cream/20 border border-primary-100 focus:border-primary-400 focus:outline-none rounded-xl px-3 py-2.5 text-xs"
              />
            </div>
            <button
              type="submit"
              disabled={passwordSaving}
              className="bg-primary-400 hover:bg-primary-500 text-white font-heading font-semibold text-xs px-4 py-2.5 rounded-xl cursor-pointer disabled:opacity-50"
            >
              {passwordSaving ? 'Saving...' : 'Save to Database'}
            </button>
            {(passwordError || passwordMessage) && (
              <div className={`sm:col-span-4 text-xs font-semibold ${passwordError ? 'text-red-600' : 'text-emerald-600'}`}>
                {passwordError || passwordMessage}
              </div>
            )}
          </form>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-primary-100/50 pb-4">
          <div className="flex flex-wrap gap-1 bg-white p-1 rounded-xl border border-primary-100/50 w-max shadow-sm">
            <button
              onClick={() => { setActiveTab('students'); setSearchQuery(''); setFilterCity(''); }}
              className={`flex items-center space-x-1.5 px-5 py-2.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'students' ? 'bg-primary-400 text-white shadow-md' : 'text-charcoal/80 hover:bg-primary-50/30'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Student Registrations ({students.length})</span>
            </button>
            
            <button
              onClick={() => { setActiveTab('tutors'); setSearchQuery(''); setFilterCity(''); }}
              className={`flex items-center space-x-1.5 px-5 py-2.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'tutors' ? 'bg-primary-400 text-white shadow-md' : 'text-charcoal/80 hover:bg-primary-50/30'
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              <span>Tutor Applications ({tutors.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('contacts'); setSearchQuery(''); setFilterCity(''); }}
              className={`flex items-center space-x-1.5 px-5 py-2.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'contacts' ? 'bg-primary-400 text-white shadow-md' : 'text-charcoal/80 hover:bg-primary-50/30'
              }`}
            >
              <Mail className="h-4 w-4" />
              <span>Inquiries ({contacts.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('demos'); setSearchQuery(''); setFilterCity(''); }}
              className={`flex items-center space-x-1.5 px-5 py-2.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'demos' ? 'bg-primary-400 text-white shadow-md' : 'text-charcoal/80 hover:bg-primary-50/30'
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>Active Demos</span>
            </button>

            <button
              onClick={() => { setActiveTab('coaching'); setSearchQuery(''); setFilterCity(''); }}
              className={`flex items-center space-x-1.5 px-5 py-2.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'coaching' ? 'bg-primary-400 text-white shadow-md' : 'text-charcoal/80 hover:bg-primary-50/30'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Active Coaching</span>
            </button>
          </div>

          {/* Table Actions (Refresh & Export) */}
          <div className="flex space-x-2.5">
            <button
              onClick={() => {
                if (activeTab === 'demos' || activeTab === 'coaching') {
                  fetchLookups();
                  setAssignmentRefresh((n) => n + 1);
                } else {
                  fetchData();
                }
              }}
              disabled={dataLoading}
              className="bg-white border border-primary-100 hover:bg-primary-50 p-2.5 rounded-xl transition cursor-pointer shadow-sm text-charcoal/70"
              title="Refresh Data"
            >
              <RefreshCw className={`h-4 w-4 ${dataLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={exportToCSV}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-heading font-semibold text-xs px-4 py-2.5 rounded-xl transition flex items-center space-x-1.5 cursor-pointer shadow-md shadow-emerald-500/10"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        <div className="bg-white p-4 rounded-2xl border border-primary-100/50 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-grey pointer-events-none" />
            <input
              type="text"
              placeholder={
                activeTab === 'students' ? 'Search by Parent name, ID, mobile, or city...' :
                activeTab === 'tutors' ? 'Search by Tutor name, ID, qualification, location...' :
                activeTab === 'demos' || activeTab === 'coaching' ? 'Search by student, teacher, address, or amount...' :
                'Search inquiries...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-cream/10 border border-primary-100 focus:border-primary-400 focus:outline-none rounded-xl pl-11 pr-4 py-2.5 text-xs font-light"
            />
          </div>

          {/* Student City Filter */}
          {activeTab === 'students' && studentCities.length > 0 && (
            <div className="flex items-center space-x-2 w-full sm:w-auto shrink-0 justify-end">
              <span className="text-xs font-bold text-charcoal">Filter City:</span>
              <select
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                className="bg-cream/10 border border-primary-100 focus:border-primary-400 focus:outline-none rounded-xl px-4 py-2.5 text-xs font-semibold"
              >
                <option value="">All Cities</option>
                {studentCities.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Data Grid container */}
        <div className="bg-white rounded-2xl border border-primary-100/50 shadow-sm overflow-hidden">
          
          {activeTab === 'demos' || activeTab === 'coaching' ? (
            <AssignmentBoard
              key={`${activeTab}-${assignmentRefresh}`}
              token={token}
              type={activeTab === 'demos' ? 'demo' : 'coaching'}
              students={students}
              tutors={tutors}
              searchQuery={searchQuery}
              onUnauthorized={handleLogout}
              onRefreshLookups={fetchLookups}
              onData={setAssignments}
            />
          ) : dataLoading ? (
            <div className="py-20 text-center text-muted-grey text-sm flex flex-col items-center justify-center space-y-2">
              <RefreshCw className="h-8 w-8 text-primary-400 animate-spin" />
              <span>Loading record database...</span>
            </div>
          ) : activeTab === 'students' ? (
            // Students Data Table
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-primary-100/35">
                <thead className="bg-primary-50/20 text-charcoal/80 text-[11px] font-bold uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="px-6 py-4">Student ID</th>
                    <th scope="col" className="px-6 py-4">Parent Details</th>
                    <th scope="col" className="px-6 py-4">Contact info</th>
                    <th scope="col" className="px-6 py-4">City</th>
                    <th scope="col" className="px-6 py-4">Children Registered</th>
                    <th scope="col" className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary-50/40 text-xs font-light text-charcoal/90">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-muted-grey">No student registrations found matching search.</td>
                    </tr>
                  ) : (
                    filteredStudents.map((parent) => {
                      const isExpanded = expandedStudentId === parent.id;
                      return (
                        <React.Fragment key={parent.id}>
                          <tr className={isExpanded ? 'bg-primary-50/10' : ''}>
                            <td className="px-6 py-4 font-bold text-primary-600">{parent.id}</td>
                            <td className="px-6 py-4">
                              <div className="font-semibold text-charcoal">{parent.parent_name}</div>
                              <div className="text-[10px] text-muted-grey mt-0.5 max-w-[200px] truncate" title={parent.address}>{parent.address}</div>
                            </td>
                            <td className="px-6 py-4 space-y-0.5">
                              <div><strong>Call:</strong> {parent.mobile_number}</div>
                              <div><strong>WA:</strong> {parent.whatsapp_number}</div>
                            </td>
                            <td className="px-6 py-4 font-semibold">{parent.city}</td>
                            <td className="px-6 py-4">
                              <span className="bg-primary-100 text-primary-700 font-bold px-2 py-0.5 rounded-full text-[10px]">
                                {parent.children?.length || 0} Kids
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => toggleStudentExpand(parent.id)}
                                className="flex items-center space-x-1 hover:text-primary-400 font-semibold cursor-pointer text-[11px]"
                              >
                                <span>{isExpanded ? 'Hide Info' : 'View Kids'}</span>
                                {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                              </button>
                            </td>
                          </tr>
                          {/* Expanded Child Details */}
                          {isExpanded && (
                            <tr>
                              <td colSpan={6} className="bg-primary-50/10 px-8 py-5 border-y border-primary-100/50">
                                <div className="space-y-4">
                                  <h4 className="font-heading font-bold text-xs text-charcoal uppercase tracking-wider border-b border-primary-100/40 pb-2">
                                    Children Information for ID {parent.id}
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {parent.children?.map((child, cIdx) => (
                                      <div key={cIdx} className="bg-white p-4 rounded-xl border border-primary-100 shadow-xs text-left space-y-2">
                                        <div className="flex justify-between items-center border-b border-primary-50 pb-1.5">
                                          <span className="font-semibold text-charcoal text-sm">{child.student_name}</span>
                                          <span className="bg-primary-100 text-primary-700 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                                            {child.student_class} ({child.board})
                                          </span>
                                        </div>
                                        <div className="text-[11px] space-y-1">
                                          <div><strong>Format:</strong> {child.tuition_type}</div>
                                          <div><strong>Timing:</strong> {child.preferred_timing}</div>
                                          <div><strong>Subjects:</strong> {child.subjects}</div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'tutors' ? (
            // Tutors Data Table
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-primary-100/35">
                <thead className="bg-primary-50/20 text-charcoal/80 text-[11px] font-bold uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="px-6 py-4">Tutor ID</th>
                    <th scope="col" className="px-6 py-4">Tutor Details</th>
                    <th scope="col" className="px-6 py-4">Qualification & Exp</th>
                    <th scope="col" className="px-6 py-4">Subjects & Areas</th>
                    <th scope="col" className="px-6 py-4">Documents</th>
                    <th scope="col" className="px-6 py-4">Status & Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary-50/40 text-xs font-light text-charcoal/90">
                  {filteredTutors.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-muted-grey">No tutor applications found matching search.</td>
                    </tr>
                  ) : (
                    filteredTutors.map((tutor) => (
                      <tr key={tutor.id}>
                        <td className="px-6 py-4 font-bold text-primary-600">{tutor.id}</td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-charcoal">{tutor.full_name}</div>
                          <div className="text-[10px] text-muted-grey mt-0.5">Mobile: {tutor.mobile_number}</div>
                          <div className="text-[9px] text-muted-grey">Joined: {new Date(tutor.created_at).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-4 space-y-1">
                          <div className="font-semibold">{tutor.qualification}</div>
                          <div className="text-[10px] text-primary-600 bg-primary-50 border border-primary-100 rounded-sm px-1.5 py-0.5 inline-block">
                            Exp: {tutor.experience}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-charcoal line-clamp-1 max-w-[200px]" title={tutor.subjects}>{tutor.subjects}</div>
                          <div className="text-[10px] text-muted-grey mt-0.5 line-clamp-1 max-w-[200px]" title={tutor.preferred_areas}><strong>Areas:</strong> {tutor.preferred_areas}</div>
                        </td>
                        <td className="px-6 py-4 space-y-1.5">
                          {tutor.resume_path ? (
                            <a
                              href={`/api/uploads/${tutor.resume_path}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary-400 hover:text-primary-600 font-bold flex items-center space-x-1 text-[10px]"
                            >
                              <ExternalLink className="h-3 w-3 shrink-0" />
                              <span>View Resume</span>
                            </a>
                          ) : <span className="text-red-400 text-[10px]">No Resume</span>}
                          
                          {tutor.id_proof_path ? (
                            <a
                              href={`/api/uploads/${tutor.id_proof_path}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary-400 hover:text-primary-600 font-bold flex items-center space-x-1 text-[10px]"
                            >
                              <ExternalLink className="h-3 w-3 shrink-0" />
                              <span>View ID Proof</span>
                            </a>
                          ) : <span className="text-red-400 text-[10px]">No ID Proof</span>}
                        </td>
                        <td className="px-6 py-4 space-y-2">
                          {/* Status Badge */}
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider block w-max ${
                            tutor.status === 'approved' ? 'bg-green-100 text-green-700' :
                            tutor.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {tutor.status}
                          </span>
                          
                          {/* Quick Actions */}
                          {tutor.status === 'pending' && (
                            <div className="flex space-x-1 pt-1">
                              <button
                                onClick={() => handleUpdateTutorStatus(tutor.id, 'approved')}
                                className="bg-green-500 hover:bg-green-600 text-white p-1 rounded-lg transition cursor-pointer"
                                title="Approve Tutor"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleUpdateTutorStatus(tutor.id, 'rejected')}
                                className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-lg transition cursor-pointer"
                                title="Reject Tutor"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}

                          {tutor.status !== 'pending' && (
                            <button
                              onClick={() => handleUpdateTutorStatus(tutor.id, 'pending')}
                              className="text-charcoal/60 hover:text-charcoal text-[9px] hover:underline cursor-pointer block"
                            >
                              Reset to Pending
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            // Contacts Table
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-primary-100/35">
                <thead className="bg-primary-50/20 text-charcoal/80 text-[11px] font-bold uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="px-6 py-4">ID</th>
                    <th scope="col" className="px-6 py-4">Sender Name</th>
                    <th scope="col" className="px-6 py-4">Contact Info</th>
                    <th scope="col" className="px-6 py-4">Message</th>
                    <th scope="col" className="px-6 py-4">Date Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary-50/40 text-xs font-light text-charcoal/90">
                  {filteredContacts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-muted-grey">No contact inquiries found matching search.</td>
                    </tr>
                  ) : (
                    filteredContacts.map((contact) => (
                      <tr key={contact.id}>
                        <td className="px-6 py-4 text-muted-grey">#{contact.id}</td>
                        <td className="px-6 py-4 font-semibold text-charcoal">{contact.name}</td>
                        <td className="px-6 py-4 space-y-0.5">
                          <div><strong>Mobile:</strong> {contact.mobile}</div>
                          {contact.email && <div><strong>Email:</strong> {contact.email}</div>}
                        </td>
                        <td className="px-6 py-4 max-w-sm">
                          <p className="leading-relaxed font-light break-words" title={contact.message}>{contact.message}</p>
                        </td>
                        <td className="px-6 py-4 text-muted-grey">
                          {new Date(contact.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </main>
    </div>
  );
}
