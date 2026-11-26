import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedRole, setSelectedRole] = useState('HR Manager');
  const [passcode, setPasscode] = useState('');
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [records, setRecords] = useState([]);
  
  // HR Form State (General Records / Reception entry)
  const [empId, setEmpId] = useState('');
  const [empName, setEmpName] = useState('');
  const [empPhone, setEmpPhone] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empProduct, setEmpProduct] = useState('Digital Suq App');
  const [selectedFile, setSelectedFile] = useState(null);
  
  // HR Manager Attendance & Leave Tracking Form State
  const [attEmpId, setAttEmpId] = useState('');
  const [attEmpName, setAttEmpName] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState('Present'); 
  const [leaveType, setLeaveType] = useState('None'); 
  const [violationType, setViolationType] = useState('None'); 
  const [performanceRating, setPerformanceRating] = useState('Satisfactory');
  
  // Editing state tracking
  const [editingId, setEditingId] = useState(null);
  const [editingAttId, setEditingAttId] = useState(null);
  const [editingSalaryId, setEditingSalaryId] = useState(null);

  // Attendance & Detailed Records State
  const [attendanceList, setAttendanceList] = useState([
    { 
      id: 1, 
      empId: '001', 
      empName: 'Abebe Kebede', 
      attendanceStatus: 'Present', 
      leaveType: 'None', 
      violationType: 'None', 
      performanceRating: 'Excellent' 
    }
  ]);

  // General Records List State
  const [generalRecordsList, setGeneralRecordsList] = useState([
    { id: 1, empId: '001', empName: 'Abebe Kebede', empPhone: '0911223344', empEmail: 'abebe@mail.com', empProduct: 'Digital Suq App', fileName: 'CV.pdf' }
  ]);

  // Salary Sheet State (ابቁ attendanceDeduction ተጨምሯል - የቀረበት ቀናት ቅናሽ)
  const [salaryList, setSalaryList] = useState([
    { id: 1, empId: '001', empName: 'Abebe Kebede', basicSalary: 8000, absentDays: 1, otherDeduction: 200 },
    { id: 2, empId: '002', empName: 'Marta Solomon', basicSalary: 12000, absentDays: 0, otherDeduction: 500 },
  ]);

  // New Payroll Employee States
  const [newEmpName, setNewEmpName] = useState('');
  const [newBasicSalary, setNewBasicSalary] = useState('');
  const [newAbsentDays, setNewAbsentDays] = useState('');
  const [newOtherDeduction, setNewOtherDeduction] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      fetchRecords();
    }
  }, [isLoggedIn]);

  const fetchRecords = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/hr');
      setRecords(res.data);
    } catch (err) {
      console.error('Error fetching records:', err);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (selectedRole === 'Super Admin' && passcode !== '5678') {
      alert('Incorrect Password for Super Admin!');
      return;
    }
    if (selectedRole === 'HR Manager' && passcode !== '1234') {
      alert('Incorrect Password for HR Manager!');
      return;
    }
    if (selectedRole === 'Reception' && passcode !== '3456') {
      alert('Incorrect Password for Reception!');
      return;
    }

    setIsLoggedIn(true);
    setActiveTab('dashboard');
  };

  const handleDataSubmit = (e) => {
    e.preventDefault();

    if (editingId !== null) {
      setGeneralRecordsList(generalRecordsList.map(item => item.id === editingId ? {
        ...item,
        empId,
        empName,
        empPhone,
        empEmail,
        empProduct,
        fileName: selectedFile ? selectedFile.name : item.fileName
      } : item));

      alert('Record updated successfully!');
      setEditingId(null);
    } else {
      const newRecord = {
        id: Date.now(),
        empId,
        empName,
        empPhone,
        empEmail,
        empProduct,
        fileName: selectedFile ? selectedFile.name : 'No file attached'
      };

      setGeneralRecordsList([newRecord, ...generalRecordsList]);
      alert('Data and file added successfully!');
    }

    setEmpId('');
    setEmpName('');
    setEmpPhone('');
    setEmpEmail('');
    setSelectedFile(null);
    setActiveTab('generalRecords'); 
  };

  const handleAttendanceSubmit = (e) => {
    e.preventDefault();

    if (editingAttId !== null) {
      setAttendanceList(attendanceList.map(item => item.id === editingAttId ? {
        ...item,
        empId: attEmpId,
        empName: attEmpName,
        attendanceStatus,
        leaveType,
        violationType,
        performanceRating
      } : item));

      alert('Attendance & Leave record updated successfully!');
      setEditingAttId(null);
    } else {
      const newAttRecord = {
        id: Date.now(),
        empId: attEmpId,
        empName: attEmpName,
        attendanceStatus,
        leaveType,
        violationType,
        performanceRating
      };

      setAttendanceList([newAttRecord, ...attendanceList]);
      alert('Attendance & Leave entry added successfully!');
    }

    setAttEmpId('');
    setAttEmpName('');
    setAttendanceStatus('Present');
    setLeaveType('None');
    setViolationType('None');
    setPerformanceRating('Satisfactory');
    setActiveTab('attendanceManagement');
  };

  // SALARY / PAYROLL SUBMIT (Absent Days ቅናሽን ጨምሮ)
  const handleAddSalaryEmployee = (e) => {
    e.preventDefault();
    if (!newEmpName || !newBasicSalary) {
      alert('እባክዎ የስም እና የመሠረታዊ ደመወዝ መረጃዎችን ያስገቡ!');
      return;
    }

    const absentDaysCount = newAbsentDays ? parseInt(newAbsentDays) : 0;

    if (editingSalaryId !== null) {
      setSalaryList(salaryList.map(item => item.id === editingSalaryId ? {
        ...item,
        empName: newEmpName,
        basicSalary: parseFloat(newBasicSalary),
        absentDays: absentDaysCount,
        otherDeduction: newOtherDeduction ? parseFloat(newOtherDeduction) : 0
      } : item));

      alert('የደመወዝ መረጃው ተሳክቶ ተስተካክሏል (Updated)!');
      setEditingSalaryId(null);
    } else {
      const newPayrollEntry = {
        id: Date.now(),
        empId: String(salaryList.length + 1).padStart(3, '0'),
        empName: newEmpName,
        basicSalary: parseFloat(newBasicSalary),
        absentDays: absentDaysCount,
        otherDeduction: newOtherDeduction ? parseFloat(newOtherDeduction) : 0
      };

      setSalaryList([...salaryList, newPayrollEntry]);
      alert('ሰራተኛው ወደ payroll ተሳክቶ ተጨምሯል!');
    }

    setNewEmpName('');
    setNewBasicSalary('');
    setNewAbsentDays('');
    setNewOtherDeduction('');
  };

  const handleEditSalaryClick = (item) => {
    setEditingSalaryId(item.id);
    setNewEmpName(item.empName);
    setNewBasicSalary(item.basicSalary);
    setNewAbsentDays(item.absentDays || 0);
    setNewOtherDeduction(item.otherDeduction);
  };

  const handleDeleteSalaryClick = (id) => {
    if (window.confirm('ይህንን የደመወዝ መረጃ መሰረዝ እርግጠኛ ኖት?')) {
      setSalaryList(salaryList.filter(item => item.id !== id));
      alert('የደመወዝ መረጃው ተሰርዟል!');
    }
  };

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setEmpId(item.empId);
    setEmpName(item.empName);
    setEmpPhone(item.empPhone);
    setEmpEmail(item.empEmail);
    setEmpProduct(item.empProduct);
    setActiveTab('inputData'); 
  };

  const handleEditAttendanceClick = (item) => {
    setEditingAttId(item.id);
    setAttEmpId(item.empId);
    setAttEmpName(item.empName);
    setAttendanceStatus(item.attendanceStatus);
    setLeaveType(item.leaveType);
    setViolationType(item.violationType);
    setPerformanceRating(item.performanceRating);
    setActiveTab('inputAttendance');
  };

  const handleDeleteClick = (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      setGeneralRecordsList(generalRecordsList.filter(item => item.id !== id));
      alert('Record deleted successfully!');
    }
  };

  const handleDeleteAttendanceClick = (id) => {
    if (window.confirm('Are you sure you want to delete this attendance entry?')) {
      setAttendanceList(attendanceList.filter(item => item.id !== id));
      alert('Attendance entry deleted successfully!');
    }
  };

  const calculateTax = (salary) => {
    if (salary <= 1250) return 0;
    if (salary <= 3200) return (salary * 0.10) - 60;
    if (salary <= 5250) return (salary * 0.15) - 220;
    if (salary <= 7800) return (salary * 0.20) - 482.50;
    if (salary <= 10900) return (salary * 0.25) - 772.50;
    if (salary <= 13500) return (salary * 0.30) - 1017.50;
    return (salary * 0.35) - 1500;
  };

  if (!isLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#1b4d3e',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
        padding: '20px'
      }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#ffffff', marginBottom: '10px', textAlign: 'center' }}>
          Digital Suq HR System
        </h1>
        <p style={{ fontSize: '15px', color: '#a7f3d0', marginBottom: '30px', textAlign: 'center' }}>
          Select Role and Enter Passcode to Login
        </p>

        <div style={{
          backgroundColor: '#123528',
          border: '1px solid #2e7d32',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          width: '100%',
          maxWidth: '400px',
          color: '#ffffff'
        }}>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#a7f3d0', marginBottom: '8px', fontWeight: '500' }}>
                Select System Role
              </label>
              <select 
                value={selectedRole} 
                onChange={(e) => setSelectedRole(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#1b4d3e',
                  border: '1px solid #2e7d32',
                  borderRadius: '6px',
                  padding: '12px',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none'
                }}
              >
                <option value="Super Admin">Super Admin</option>
                <option value="HR Manager">HR Manager</option>
                <option value="Reception">Reception</option>
              </select>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#a7f3d0', marginBottom: '8px', fontWeight: '500' }}>
                Passcode / PIN (Hidden)
              </label>
              <input 
                type="password" 
                value={passcode} 
                onChange={(e) => setPasscode(e.target.value)} 
                placeholder="Enter PIN..."
                style={{
                  width: '100%',
                  backgroundColor: '#1b4d3e',
                  border: '1px solid #2e7d32',
                  borderRadius: '6px',
                  padding: '12px',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>

            <button 
              type="submit" 
              style={{
                width: '100%',
                backgroundColor: '#2e7d32',
                color: '#ffffff',
                border: 'none',
                padding: '12px',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Login to System
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1b4d3e', color: '#ffffff', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>
      <header style={{ backgroundColor: '#123528', padding: '20px', borderBottom: '1px solid #2e7d32', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '20px', margin: 0, color: '#ffffff' }}>Digital Suq - HR & Attendance Management</h1>
          <p style={{ fontSize: '12px', color: '#a7f3d0', margin: '4px 0 0 0' }}>
            Logged in Role: <strong>{selectedRole}</strong>
          </p>
        </div>
        <button 
          onClick={() => setIsLoggedIn(false)}
          style={{ backgroundColor: '#991b1b', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Logout
        </button>
      </header>

      <div style={{ display: 'flex', flex: 1, padding: '24px', gap: '24px' }}>
        <aside style={{ width: '280px', backgroundColor: '#123528', border: '1px solid #2e7d32', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', height: 'fit-content' }}>
          
          <button onClick={() => setActiveTab('dashboard')} style={{ textAlign: 'left', padding: '12px', background: activeTab === 'dashboard' ? '#2e7d32' : 'transparent', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>📊 Dashboard & Overview</button>
          
          <button onClick={() => { setEditingId(null); setActiveTab('inputData'); }} style={{ textAlign: 'left', padding: '12px', background: activeTab === 'inputData' ? '#2e7d32' : 'transparent', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>📝 Add New Record & Files</button>
          
          <button onClick={() => setActiveTab('generalRecords')} style={{ textAlign: 'left', padding: '12px', background: activeTab === 'generalRecords' ? '#2e7d32' : 'transparent', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>📁 View & Manage Records</button>

          {(selectedRole === 'Super Admin' || selectedRole === 'HR Manager') && (
            <>
              <button onClick={() => { setEditingAttId(null); setActiveTab('inputAttendance'); }} style={{ textAlign: 'left', padding: '12px', background: activeTab === 'inputAttendance' ? '#2e7d32' : 'transparent', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>⏱️ Record Attendance, Leaves & Warnings</button>
              
              <button onClick={() => setActiveTab('attendanceManagement')} style={{ textAlign: 'left', padding: '12px', background: activeTab === 'attendanceManagement' ? '#2e7d32' : 'transparent', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>📋 Attendance & Leave Logs</button>

              <button onClick={() => setActiveTab('salarySheet')} style={{ textAlign: 'left', padding: '12px', background: activeTab === 'salarySheet' ? '#2e7d32' : 'transparent', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>💰 Salary Sheet & Payroll</button>
            </>
          )}
        </aside>

        <main style={{ flex: 1, backgroundColor: '#123528', border: '1px solid #2e7d32', borderRadius: '8px', padding: '24px' }}>
          
          {activeTab === 'dashboard' && (
            <div>
              <h2 style={{ color: '#ffffff', marginBottom: '15px' }}>Welcome, {selectedRole}</h2>
              <p style={{ color: '#a7f3d0', lineHeight: '1.6' }}>
                {selectedRole === 'Reception' 
                  ? 'As a Receptionist, you can register new records and view general entries using the navigation panel.'
                  : 'Use the navigation panel to switch between employee records, attendance tracking, punctuality monitoring, leave management, performance, disciplinary violations, and salary processing.'}
              </p>
            </div>
          )}

          {activeTab === 'inputData' && (
            <div>
              <h2 style={{ color: '#ffffff', marginBottom: '15px' }}>
                {editingId ? 'Edit Existing Record' : 'Add New Data & File Attachment'}
              </h2>
              <form onSubmit={handleDataSubmit} style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <input type="text" placeholder="Employee ID" value={empId} onChange={e => setEmpId(e.target.value)} style={{ padding: '10px', background: '#1b4d3e', border: '1px solid #2e7d32', color: '#fff', borderRadius: '6px', outline: 'none' }} required />
                <input type="text" placeholder="Full Name" value={empName} onChange={e => setEmpName(e.target.value)} style={{ padding: '10px', background: '#1b4d3e', border: '1px solid #2e7d32', color: '#fff', borderRadius: '6px', outline: 'none' }} required />
                <input type="tel" placeholder="Phone Number" value={empPhone} onChange={e => setEmpPhone(e.target.value)} style={{ padding: '10px', background: '#1b4d3e', border: '1px solid #2e7d32', color: '#fff', borderRadius: '6px', outline: 'none' }} required />
                <input type="email" placeholder="Email Address" value={empEmail} onChange={e => setEmpEmail(e.target.value)} style={{ padding: '10px', background: '#1b4d3e', border: '1px solid #2e7d32', color: '#fff', borderRadius: '6px', outline: 'none' }} required />
                
                <div>
                  <label style={{ display: 'block', color: '#a7f3d0', fontSize: '13px', marginBottom: '5px' }}>Product Selection</label>
                  <select value={empProduct} onChange={e => setEmpProduct(e.target.value)} style={{ width: '100%', padding: '10px', background: '#1b4d3e', border: '1px solid #2e7d32', color: '#fff', borderRadius: '6px', outline: 'none' }}>
                    <option value="Digital Suq App">Digital Suq App</option>
                    <option value="HR Management System">HR Management System</option>
                    <option value="Inventory POS">Inventory POS</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', color: '#a7f3d0', fontSize: '13px', marginBottom: '5px' }}>Attach File (Document / CV / ID)</label>
                  <input type="file" onChange={e => setSelectedFile(e.target.files[0])} style={{ color: '#fff' }} />
                </div>

                <button type="submit" style={{ background: '#2e7d32', color: '#fff', padding: '12px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>
                  {editingId ? 'Update Record' : 'Save & Submit Data'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'generalRecords' && (
            <div>
              <h2 style={{ color: '#ffffff', marginBottom: '15px' }}>Submitted Employee Records & Files</h2>
              {generalRecordsList.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse', background: '#1b4d3e', borderRadius: '6px', overflow: 'hidden' }}>
                  <thead>
                    <tr style={{ background: '#123528', color: '#a7f3d0', textAlign: 'left' }}>
                      <th style={{ padding: '10px' }}>ID</th>
                      <th style={{ padding: '10px' }}>Name</th>
                      <th style={{ padding: '10px' }}>Phone</th>
                      <th style={{ padding: '10px' }}>Product</th>
                      <th style={{ padding: '10px' }}>File</th>
                      <th style={{ padding: '10px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {generalRecordsList.map(item => (
                      <tr key={item.id} style={{ borderTop: '1px solid #2e7d32' }}>
                        <td style={{ padding: '10px' }}>{item.empId}</td>
                        <td style={{ padding: '10px' }}>{item.empName}</td>
                        <td style={{ padding: '10px' }}>{item.empPhone}</td>
                        <td style={{ padding: '10px' }}>{item.empProduct}</td>
                        <td style={{ padding: '10px', color: '#facc15' }}>{item.fileName}</td>
                        <td style={{ padding: '10px' }}>
                          <button onClick={() => handleEditClick(item)} style={{ background: '#d97706', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '6px', fontWeight: 'bold' }}>Edit</button>
                          <button onClick={() => handleDeleteClick(item.id)} style={{ background: '#991b1b', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ color: '#a7f3d0' }}>No records found.</p>
              )}
            </div>
          )}

          {activeTab === 'inputAttendance' && (selectedRole === 'Super Admin' || selectedRole === 'HR Manager') && (
            <div>
              <h2 style={{ color: '#ffffff', marginBottom: '15px' }}>
                {editingAttId ? 'Edit Attendance & Leave Log' : 'Record Attendance, Punctuality & Leave'}
              </h2>
              <form onSubmit={handleAttendanceSubmit} style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <input type="text" placeholder="Employee ID" value={attEmpId} onChange={e => setAttEmpId(e.target.value)} style={{ padding: '10px', background: '#1b4d3e', border: '1px solid #2e7d32', color: '#fff', borderRadius: '6px', outline: 'none' }} required />
                <input type="text" placeholder="Employee Full Name" value={attEmpName} onChange={e => setAttEmpName(e.target.value)} style={{ padding: '10px', background: '#1b4d3e', border: '1px solid #2e7d32', color: '#fff', borderRadius: '6px', outline: 'none' }} required />

                <div>
                  <label style={{ display: 'block', color: '#a7f3d0', fontSize: '13px', marginBottom: '5px' }}>Attendance Status & Punctuality / Lateness</label>
                  <select value={attendanceStatus} onChange={e => setAttendanceStatus(e.target.value)} style={{ width: '100%', padding: '10px', background: '#1b4d3e', border: '1px solid #2e7d32', color: '#fff', borderRadius: '6px', outline: 'none' }}>
                    <option value="Present">Present (On-Time)</option>
                    <option value="Late">Late (Punctuality Issue)</option>
                    <option value="Absent">Absent (Absenteeism)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', color: '#a7f3d0', fontSize: '13px', marginBottom: '5px' }}>Leave Management</label>
                  <select value={leaveType} onChange={e => setLeaveType(e.target.value)} style={{ width: '100%', padding: '10px', background: '#1b4d3e', border: '1px solid #2e7d32', color: '#fff', borderRadius: '6px', outline: 'none' }}>
                    <option value="None">None (Active)</option>
                    <option value="Annual Leave">Annual Leave</option>
                    <option value="Maternity Leave">Maternity Leave</option>
                    <option value="Paternity Leave">Paternity Leave</option>
                    <option value="Marital Leave">Marital Leave</option>
                    <option value="Legal Leave">Legal Leave</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Other Leave">Other Leave</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', color: '#a7f3d0', fontSize: '13px', marginBottom: '5px' }}>Disciplinary Violations & Warnings</label>
                  <select value={violationType} onChange={e => setViolationType(e.target.value)} style={{ width: '100%', padding: '10px', background: '#1b4d3e', border: '1px solid #2e7d32', color: '#fff', borderRadius: '6px', outline: 'none' }}>
                    <option value="None">None</option>
                    <option value="Oral Warning">Oral Warning</option>
                    <option value="Written Warning">Written Warning</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', color: '#a7f3d0', fontSize: '13px', marginBottom: '5px' }}>Performance Evaluation</label>
                  <select value={performanceRating} onChange={e => setPerformanceRating(e.target.value)} style={{ width: '100%', padding: '10px', background: '#1b4d3e', border: '1px solid #2e7d32', color: '#fff', borderRadius: '6px', outline: 'none' }}>
                    <option value="Outstanding">Outstanding</option>
                    <option value="Satisfactory">Satisfactory</option>
                    <option value="Needs Improvement">Needs Improvement</option>
                  </select>
                </div>

                <button type="submit" style={{ background: '#2e7d32', color: '#fff', padding: '12px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>
                  {editingAttId ? 'Update Attendance Log' : 'Save Attendance & Leave Entry'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'attendanceManagement' && (selectedRole === 'Super Admin' || selectedRole === 'HR Manager') && (
            <div>
              <h2 style={{ color: '#ffffff', marginBottom: '15px' }}>Attendance, Punctuality, Leaves & Warnings Registry</h2>
              {attendanceList.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse', background: '#1b4d3e', borderRadius: '6px', overflow: 'hidden', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ background: '#123528', color: '#a7f3d0', textAlign: 'left' }}>
                      <th style={{ padding: '10px' }}>ID</th>
                      <th style={{ padding: '10px' }}>Name</th>
                      <th style={{ padding: '10px' }}>Status</th>
                      <th style={{ padding: '10px' }}>Leave Type</th>
                      <th style={{ padding: '10px' }}>Violation</th>
                      <th style={{ padding: '10px' }}>Performance</th>
                      <th style={{ padding: '10px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceList.map(item => (
                      <tr key={item.id} style={{ borderTop: '1px solid #2e7d32' }}>
                        <td style={{ padding: '10px' }}>{item.empId}</td>
                        <td style={{ padding: '10px' }}>{item.empName}</td>
                        <td style={{ padding: '10px', color: item.attendanceStatus === 'Late' ? '#facc15' : item.attendanceStatus === 'Absent' ? '#f87171' : '#4ade80' }}>{item.attendanceStatus}</td>
                        <td style={{ padding: '10px' }}>{item.leaveType}</td>
                        <td style={{ padding: '10px', color: item.violationType !== 'None' ? '#f87171' : '#fff' }}>{item.violationType}</td>
                        <td style={{ padding: '10px' }}>{item.performanceRating}</td>
                        <td style={{ padding: '10px' }}>
                          <button onClick={() => handleEditAttendanceClick(item)} style={{ background: '#d97706', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '6px', fontWeight: 'bold' }}>Edit</button>
                          <button onClick={() => handleDeleteAttendanceClick(item.id)} style={{ background: '#991b1b', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ color: '#a7f3d0' }}>No attendance or leave entries logged yet.</p>
              )}
            </div>
          )}

          {/* TAB 6: SALARY SHEET & PAYROLL (የቀረበትን ቀን ቆጥሮ ከደመወዝ ላይ የሚቀንስበት Form እና Table) */}
          {activeTab === 'salarySheet' && (selectedRole === 'Super Admin' || selectedRole === 'HR Manager') && (
            <div>
              <h2 style={{ color: '#ffffff', marginBottom: '15px' }}>Employee Salary Sheet & Payroll (with Attendance Deduction)</h2>
              
              <div style={{ backgroundColor: '#1b4d3e', padding: '15px', borderRadius: '6px', marginBottom: '20px', border: '1px solid #2e7d32' }}>
                <h3 style={{ color: '#a7f3d0', fontSize: '16px', marginBottom: '10px' }}>
                  {editingSalaryId ? '✏️ Edit Payroll Entry' : '➕ Add Employee to Payroll & Absent Days'}
                </h3>
                <form onSubmit={handleAddSalaryEmployee} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <input type="text" placeholder="Full Name" value={newEmpName} onChange={e => setNewEmpName(e.target.value)} style={{ padding: '8px', background: '#123528', border: '1px solid #2e7d32', color: '#fff', borderRadius: '4px', outline: 'none', flex: 1 }} />
                  <input type="number" placeholder="Basic Salary (Br)" value={newBasicSalary} onChange={e => setNewBasicSalary(e.target.value)} style={{ padding: '8px', background: '#123528', border: '1px solid #2e7d32', color: '#fff', borderRadius: '4px', outline: 'none', width: '130px' }} />
                  <input type="number" placeholder="Absent Days" value={newAbsentDays} onChange={e => setNewAbsentDays(e.target.value)} style={{ padding: '8px', background: '#123528', border: '1px solid #2e7d32', color: '#fff', borderRadius: '4px', outline: 'none', width: '110px' }} />
                  <input type="number" placeholder="Other Ded." value={newOtherDeduction} onChange={e => setNewOtherDeduction(e.target.value)} style={{ padding: '8px', background: '#123528', border: '1px solid #2e7d32', color: '#fff', borderRadius: '4px', outline: 'none', width: '110px' }} />
                  
                  <button type="submit" style={{ background: editingSalaryId ? '#d97706' : '#2e7d32', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                    {editingSalaryId ? 'Update Payroll' : 'Add Entry'}
                  </button>
                  {editingSalaryId && (
                    <button type="button" onClick={() => { setEditingSalaryId(null); setNewEmpName(''); setNewBasicSalary(''); setNewAbsentDays(''); setNewOtherDeduction(''); }} style={{ background: '#6b7280', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
                  )}
                </form>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', background: '#1b4d3e', borderRadius: '6px', overflow: 'hidden', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#123528', color: '#a7f3d0', textAlign: 'left' }}>
                    <th style={{ padding: '10px' }}>ID</th>
                    <th style={{ padding: '10px' }}>Name</th>
                    <th style={{ padding: '10px' }}>Basic Salary</th>
                    <th style={{ padding: '10px' }}>Absent Days</th>
                    <th style={{ padding: '10px' }}>Absent Deduction</th>
                    <th style={{ padding: '10px' }}>Tax & Pension</th>
                    <th style={{ padding: '10px' }}>Net Pay</th>
                    <th style={{ padding: '10px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {salaryList.map(item => {
                    // የዕለት ደመወዝ ስሌት (በአማካይ በ30 ቀን ተከፍሎ የሚሰላ)
                    const dailyRate = item.basicSalary / 30;
                    const absentCount = item.absentDays || 0;
                    const absenceDeduction = absentCount * dailyRate;

                    // ከተቀነሰ በኋላ ባለው የቀረው ደመወዝ ላይ ታክስ እና पेንሽን ማስላት
                    const adjustedSalary = Math.max(0, item.basicSalary - absenceDeduction);
                    const tax = calculateTax(adjustedSalary);
                    const pension = adjustedSalary * 0.07;
                    const totalDeductions = absenceDeduction + tax + pension + (item.otherDeduction || 0);
                    const netPay = item.basicSalary - totalDeductions;

                    return (
                      <tr key={item.id} style={{ borderTop: '1px solid #2e7d32' }}>
                        <td style={{ padding: '10px' }}>{item.empId}</td>
                        <td style={{ padding: '10px' }}>{item.empName}</td>
                        <td style={{ padding: '10px' }}>{item.basicSalary.toFixed(2)} Br</td>
                        <td style={{ padding: '10px', color: absentCount > 0 ? '#f87171' : '#fff', fontWeight: 'bold' }}>{absentCount} ቀናት</td>
                        <td style={{ padding: '10px', color: '#f87171' }}>{absenceDeduction.toFixed(2)} Br</td>
                        <td style={{ padding: '10px', color: '#facc15' }}>{(tax + pension).toFixed(2)} Br</td>
                        <td style={{ padding: '10px', color: '#4ade80', fontWeight: 'bold' }}>{netPay.toFixed(2)} Br</td>
                        <td style={{ padding: '10px' }}>
                          <button onClick={() => handleEditSalaryClick(item)} style={{ background: '#d97706', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '6px', fontWeight: 'bold' }}>Edit</button>
                          <button onClick={() => handleDeleteSalaryClick(item.id)} style={{ background: '#991b1b', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default App;