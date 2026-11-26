import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function DigitalSuqHRDashboard() {
  const [activeTab, setActiveTab] = useState('attendance');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states for adding notes/penalties or updating leaves
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [noteText, setNoteText] = useState('');
  const [noteCategory, setNoteCategory] = useState('Appreciation');

  useEffect(() => {
    fetchHRRecords();
  }, []);

  const fetchHRRecords = async () => {
    try {
      const res = await axios.get('/api/hr');
      setRecords(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching HR records:', err);
      setLoading(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/hr/record', {
        employeeId: selectedEmployee,
        notesAndPenalties: { category: noteCategory, description: noteText }
      });
      alert('Successfully added note/penalty!');
      setNoteText('');
      fetchHRRecords();
    } catch (err) {
      alert('Error saving record');
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 text-gray-800 font-sans">
      {/* Top Navbar */}
      <header className="bg-emerald-800 text-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wide">Digital Suq - HR & Attendance</h1>
        <div className="flex gap-4 text-sm">
          <span className="bg-emerald-700 px-3 py-1 rounded-full">Role: Super Admin / HR</span>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Sidebar Navigation */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-emerald-100 flex flex-col gap-2 h-fit">
          <button 
            onClick={() => setActiveTab('attendance')}
            className={`text-left px-4 py-2 rounded-lg font-medium transition ${activeTab === 'attendance' ? 'bg-emerald-600 text-white' : 'hover:bg-emerald-100 text-emerald-900'}`}
          >
            Attendance & Punctuality
          </button>
          <button 
            onClick={() => setActiveTab('leaves')}
            className={`text-left px-4 py-2 rounded-lg font-medium transition ${activeTab === 'leaves' ? 'bg-emerald-600 text-white' : 'hover:bg-emerald-100 text-emerald-900'}`}
          >
            Leave Management
          </button>
          <button 
            onClick={() => setActiveTab('violations')}
            className={`text-left px-4 py-2 rounded-lg font-medium transition ${activeTab === 'violations' ? 'bg-emerald-600 text-white' : 'hover:bg-emerald-100 text-emerald-900'}`}
          >
            Violations & Warnings
          </button>
          <button 
            onClick={() => setActiveTab('notes')}
            className={`text-left px-4 py-2 rounded-lg font-medium transition ${activeTab === 'notes' ? 'bg-emerald-600 text-white' : 'hover:bg-emerald-100 text-emerald-900'}`}
          >
            Notes, Appreciation & Penalties
          </button>
          <button 
            onClick={() => setActiveTab('payroll')}
            className={`text-left px-4 py-2 rounded-lg font-medium transition ${activeTab === 'payroll' ? 'bg-emerald-600 text-white' : 'hover:bg-emerald-100 text-emerald-900'}`}
          >
            Attendance Result → Payroll
          </button>
        </div>

        {/* Dynamic Display Board */}
        <div className="md:col-span-3 bg-white p-6 rounded-xl shadow-sm border border-emerald-100">
          {activeTab === 'attendance' && (
            <div>
              <h2 className="text-xl font-bold text-emerald-800 mb-4">Attendance & Punctuality Tracking</h2>
              <p className="text-sm text-gray-600 mb-4">Monitor daily lateness minutes and total absentees.</p>
              {/* Table of Attendance */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-emerald-100 text-emerald-900">
                      <th className="p-3">Employee</th>
                      <th className="p-3">Punctuality (Lateness Mins)</th>
                      <th className="p-3">Absenteeism (Days)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map(rec => (
                      <tr key={rec._id} className="border-b border-emerald-50 hover:bg-emerald-50/50">
                        <td className="p-3 font-medium">{rec.employeeId?.name || 'N/A'}</td>
                        <td className="p-3">{rec.attendance?.punctuality} mins</td>
                        <td className="p-3">{rec.attendance?.absenteeism} days</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'leaves' && (
            <div>
              <h2 className="text-xl font-bold text-emerald-800 mb-4">Leave Types Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                  <h3 className="font-semibold text-emerald-900">Annual Leave</h3>
                  <p className="text-2xl font-bold text-emerald-700 mt-2">Managed</p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                  <h3 className="font-semibold text-emerald-900">Maternity & Paternity</h3>
                  <p className="text-2xl font-bold text-emerald-700 mt-2">Active</p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                  <h3 className="font-semibold text-emerald-900">Marital Leave</h3>
                  <p className="text-2xl font-bold text-emerald-700 mt-2">3 Days</p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                  <h3 className="font-semibold text-emerald-900">Sick Leave</h3>
                  <p className="text-xs text-gray-600 mt-1">1st yr full, 2nd half, 3rd no pay</p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                  <h3 className="font-semibold text-emerald-900">Legal Leave</h3>
                  <p className="text-2xl font-bold text-emerald-700 mt-2">Configured</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'violations' && (
            <div>
              <h2 className="text-xl font-bold text-emerald-800 mb-4">Disciplinary Violations</h2>
              <ul className="space-y-3">
                <li className="p-3 bg-red-50 text-red-800 rounded-lg border border-red-200 flex justify-between">
                  <span>Oral Warning</span>
                  <span className="text-xs bg-red-200 px-2 py-1 rounded">Level 1</span>
                </li>
                <li className="p-3 bg-orange-50 text-orange-800 rounded-lg border border-orange-200 flex justify-between">
                  <span>Written Warning</span>
                  <span className="text-xs bg-orange-200 px-2 py-1 rounded">Level 2</span>
                </li>
                <li className="p-3 bg-rose-50 text-rose-800 rounded-lg border border-rose-200 flex justify-between">
                  <span>Last Warning</span>
                  <span className="text-xs bg-rose-200 px-2 py-1 rounded">Level 3</span>
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'notes' && (
            <div>
              <h2 className="text-xl font-bold text-emerald-800 mb-4">Add Notes, Appreciation & Penalties</h2>
              <form onSubmit={handleAddNote} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-emerald-900 mb-1">Select Employee</label>
                  <select 
                    value={selectedEmployee} 
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className="w-full border border-emerald-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
                    required
                  >
                    <option value="">-- Choose Employee --</option>
                    {records.map(r => (
                      <option key={r._id} value={r.employeeId?._id}>{r.employeeId?.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-emerald-900 mb-1">Category</label>
                  <select 
                    value={noteCategory} 
                    onChange={(e) => setNoteCategory(e.target.value)}
                    className="w-full border border-emerald-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Appreciation">Appreciation</option>
                    <option value="Penalty">Penalty</option>
                    <option value="Note">General Note</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-emerald-900 mb-1">Description / Details</label>
                  <textarea 
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    rows="3"
                    className="w-full border border-emerald-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
                    placeholder="Write description here..."
                    required
                  ></textarea>
                </div>
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-lg transition">
                  Save Entry
                </button>
              </form>
            </div>
          )}

          {activeTab === 'payroll' && (
            <div>
              <h2 className="text-xl font-bold text-emerald-800 mb-4">Attendance Result to Payroll</h2>
              <p className="text-sm text-gray-600 mb-4">Automatically compute deductions based on absenteeism and penalties for payroll processing.</p>
              <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                <span className="font-semibold text-emerald-900">Payroll Integration Ready</span>
                <p className="text-sm text-gray-700 mt-1">Attendance records and penalties link directly into employee net salary computations.</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}