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
      performanceRating: 'Outstanding' 
    }
  ]);

  // General Records List State
  const [generalRecordsList, setGeneralRecordsList] = useState([
    { id: 1, empId: '001', empName: 'Abebe Kebede', empPhone: '0911223344', empEmail: 'abebe@mail.com', empProduct: 'Digital Suq App', fileName: 'CV.pdf' }
  ]);

  // Salary Sheet State with Departments
  const [salaryList, setSalaryList] = useState([
    { id: 1, empId: '001', empName: 'Abebe Kebede', department: 'IT', basicSalary: 24000, absentDays: 0, allowance: 0, otherDeduction: 0 },
    { id: 2, empId: '002', empName: 'Marta Solomon', department: 'Finance', basicSalary: 12000, absentDays: 0, allowance: 0, otherDeduction: 0 },
  ]);

  // New Payroll Employee States (Enhanced Form Fields)
  const [newEmpId, setNewEmpId] = useState('');
  const [newEmpName, setNewEmpName] = useState('');
  const [newDepartment, setNewDepartment] = useState('IT');
  const [newBasicSalary, setNewBasicSalary] = useState('');
  const [newAbsentDays, setNewAbsentDays] = useState('');
  const [newAllowance, setNewAllowance] = useState('');
  const [newTaxIncentive, setNewTaxIncentive] = useState('');
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

  const handleAddSalaryEmployee = (e) => {
    e.preventDefault();
    if (!newEmpName || !newBasicSalary) {
      alert('እባክዎ የስም እና የመሠረታዊ ደመወዝ መረጃዎችን ያስገቡ!');
      return;
    }

    const absentDaysCount = newAbsentDays ? parseInt(newAbsentDays) : 0;
    const allowanceVal = newAllowance ? parseFloat(newAllowance) : 0;
    const taxIncVal = newTaxIncentive ? parseFloat(newTaxIncentive) : 0;
    const otherDedVal = newOtherDeduction ? parseFloat(newOtherDeduction) : 0;
    const assignedEmpId = newEmpId || String(salaryList.length + 1).padStart(3, '0');

    if (editingSalaryId !== null) {
      setSalaryList(salaryList.map(item => item.id === editingSalaryId ? {
        ...item,
        empId: assignedEmpId,
        empName: newEmpName,
        department: newDepartment,
        basicSalary: parseFloat(newBasicSalary),
        absentDays: absentDaysCount,
        allowance: allowanceVal,
        taxIncentive: taxIncVal,
        otherDeduction: otherDedVal
      } : item));

      alert('የደመወዝ መረጃው ተሳክቶ ተስተካክሏል (Updated)!');
      setEditingSalaryId(null);
    } else {
      const newPayrollEntry = {
        id: Date.now(),
        empId: assignedEmpId,
        empName: newEmpName,
        department: newDepartment,
        basicSalary: parseFloat(newBasicSalary),
        absentDays: absentDaysCount,
        allowance: allowanceVal,
        taxIncentive: taxIncVal,
        otherDeduction: otherDedVal
      };

      setSalaryList([...salaryList, newPayrollEntry]);
      alert('ሰራተኛው ወደ payroll ተሳክቶ ተጨምሯል!');
    }

    setNewEmpId('');
    setNewEmpName('');
    setNewDepartment('IT');
    setNewBasicSalary('');
    setNewAbsentDays('');
    setNewAllowance('');
    setNewTaxIncentive('');
    setNewOtherDeduction('');
  };

  const handleEditSalaryClick = (item) => {
    setEditingSalaryId(item.id);
    setNewEmpId(item.empId);
    setNewEmpName(item.empName);
    setNewDepartment(item.department || 'IT');
    setNewBasicSalary(item.basicSalary);
    setNewAbsentDays(item.absentDays || 0);
    setNewAllowance(item.allowance || 0);
    setNewTaxIncentive(item.taxIncentive || 0);
    setNewOtherDeduction(item.otherDeduction || 0);
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

  // Tax calculation based precisely on the formula provided in your image:
  // IF(Sal < 2000, 0, IF(Sal < 4000, Sal * 0.15 - 300, IF(Sal < 7000, Sal * 0.2 - 580, IF(Sal < 10000, Sal * 0.25 - 850, IF(Sal < 14000, Sal * 0.3 - 1350, IF(Sal > 14000, Sal * 0.35 - 2050))))))
  const calculateTax = (sal) => {
    if (sal < 2000) return 0;
    if (sal < 4000) return (sal * 0.15) - 300;
    if (sal < 7000) return (sal * 0.20) - 580;
    if (sal < 10000) return (sal * 0.25) - 850;
    if (sal < 14000) return (sal * 0.30) - 1350;
    return (sal * 0.35) - 2050; // for sal >= 14000 (as shown in image formula)
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
                  : 'Use the navigation panel to switch between employee records, attendance tracking, punctuality monitoring, leave management, performance, disciplinary violations, and salary processing across Finance, HR, Sales, IT, Marketing, Purchase, and General Service departments.'}
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
                    <option value="Suspension">Suspension</option>
                    <option value="Termination">Termination</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', color: '#a7f3d0', fontSize: '13px', marginBottom: '5px' }}>Performance Evaluation</label>
                  <select value={performanceRating} onChange={e => setPerformanceRating(e.target.value)} style={{ width: '100%', padding: '10px', background: '#1b4d3e', border: '1px solid #2e7d32', color: '#fff', borderRadius: '6px', outline: 'none' }}>
                    <option value="Outstanding">Outstanding</option>
                    <option value="Very Good">Very Good</option>
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

          {/* TAB 6: SALARY SHEET & ENHANCED PAYROLL FORM */}
          {activeTab === 'salarySheet' && (selectedRole === 'Super Admin' || selectedRole === 'HR Manager') && (
            <div>
              <h2 style={{ color: '#ffffff', marginBottom: '15px' }}>Employee Salary Sheet & Payroll (Based on Image Formula & Deductions)</h2>
              
              {/* Enhanced Form Box */}
              <div style={{ backgroundColor: '#1b4d3e', padding: '20px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #2e7d32' }}>
                <h3 style={{ color: '#a7f3d0', fontSize: '16px', marginBottom: '15px' }}>
                  {editingSalaryId ? '✏️ Edit Payroll & Department Entry' : '➕ Add Employee to Payroll with Department Form'}
                </h3>
                <form onSubmit={handleAddSalaryEmployee} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#a7f3d0', marginBottom: '4px' }}>Emp ID</label>
                    <input type="text" placeholder="e.g. 001" value={newEmpId} onChange={e => setNewEmpId(e.target.value)} style={{ width: '100%', padding: '8px', background: '#123528', border: '1px solid #2e7d32', color: '#fff', borderRadius: '4px', outline: 'none' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#a7f3d0', marginBottom: '4px' }}>Full Name *</label>
                    <input type="text" placeholder="Employee Name" value={newEmpName} onChange={e => setNewEmpName(e.target.value)} style={{ width: '100%', padding: '8px', background: '#123528', border: '1px solid #2e7d32', color: '#fff', borderRadius: '4px', outline: 'none' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#a7f3d0', marginBottom: '4px' }}>Department *</label>
                    <select value={newDepartment} onChange={e => setNewDepartment(e.target.value)} style={{ width: '100%', padding: '8px', background: '#123528', border: '1px solid #2e7d32', color: '#fff', borderRadius: '4px', outline: 'none' }}>
                      <option value="Finance">Finance</option>
                      <option value="HR">HR</option>
                      <option value="Sales">Sales</option>
                      <option value="IT">IT</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Purchase">Purchase</option>
                      <option value="General Service">General Service</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#a7f3d0', marginBottom: '4px' }}>Basic Salary (Br) *</label>
                    <input type="number" placeholder="0.00" value={newBasicSalary} onChange={e => setNewBasicSalary(e.target.value)} style={{ width: '100%', padding: '8px', background: '#123528', border: '1px solid #2e7d32', color: '#fff', borderRadius: '4px', outline: 'none' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#a7f3d0', marginBottom: '4px' }}>Absent Days</label>
                    <input type="number" placeholder="0" value={newAbsentDays} onChange={e => setNewAbsentDays(e.target.value)} style={{ width: '100%', padding: '8px', background: '#123528', border: '1px solid #2e7d32', color: '#fff', borderRadius: '4px', outline: 'none' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#a7f3d0', marginBottom: '4px' }}>Allowance (Br)</label>
                    <input type="number" placeholder="0.00" value={newAllowance} onChange={e => setNewAllowance(e.target.value)} style={{ width: '100%', padding: '8px', background: '#123528', border: '1px solid #2e7d32', color: '#fff', borderRadius: '4px', outline: 'none' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#a7f3d0', marginBottom: '4px' }}>Other Ded. (Br)</label>
                    <input type="number" placeholder="0.00" value={newOtherDeduction} onChange={e => setNewOtherDeduction(e.target.value)} style={{ width: '100%', padding: '8px', background: '#123528', border: '1px solid #2e7d32', color: '#fff', borderRadius: '4px', outline: 'none' }} />
                  </div>

                  <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px', marginTop: '5px' }}>
                    <button type="submit" style={{ background: editingSalaryId ? '#d97706' : '#2e7d32', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                      {editingSalaryId ? 'Update Payroll Entry' : 'Add to Salary Sheet'}
                    </button>
                    {editingSalaryId && (
                      <button type="button" onClick={() => { setEditingSalaryId(null); setNewEmpId(''); setNewEmpName(''); setNewDepartment('IT'); setNewBasicSalary(''); setNewAbsentDays(''); setNewAllowance(''); setNewTaxIncentive(''); setNewOtherDeduction(''); }} style={{ background: '#6b7280', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
                    )}
                  </div>
                </form>
              </div>

              {/* Salary Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', background: '#1b4d3e', borderRadius: '6px', overflow: 'hidden', fontSize: '13px', minWidth: '850px' }}>
                  <thead>
                    <tr style={{ background: '#123528', color: '#a7f3d0', textAlign: 'left' }}>
                      <th style={{ padding: '10px' }}>ID</th>
                      <th style={{ padding: '10px' }}>Name</th>
                      <th style={{ padding: '10px' }}>Department</th>
                      <th style={{ padding: '10px' }}>Basic Salary</th>
                      <th style={{ padding: '10px' }}>Absent Ded.</th>
                      <th style={{ padding: '10px' }}>Pension (7%)</th>
                      <th style={{ padding: '10px' }}>Tax (Formula)</th>
                      <th style={{ padding: '10px' }}>Net Salary</th>
                      <th style={{ padding: '10px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salaryList.map(item => {
                      const dailyRate = item.basicSalary / 30;
                      const absentDed = (item.absentDays || 0) * dailyRate;
                      const taxableIncome = Math.max(0, item.basicSalary - absentDed);
                      const pension = item.basicSalary * 0.07;
                      const tax = calculateTax(taxableIncome);
                      const otherDed = item.otherDeduction || 0;
                      const netSalary = item.basicSalary - absentDed - pension - tax - otherDed + (item.allowance || 0);

                      return (
                        <tr key={item.id} style={{ borderTop: '1px solid #2e7d32' }}>
                          <td style={{ padding: '10px' }}>{item.empId}</td>
                          <td style={{ padding: '10px' }}>{item.empName}</td>
                          <td style={{ padding: '10px' }}>
                            <span style={{ backgroundColor: '#123528', padding: '3px 8px', borderRadius: '4px', color: '#a7f3d0', fontSize: '11px', border: '1px solid #2e7d32' }}>
                              {item.department || 'IT'}
                            </span>
                          </td>
                          <td style={{ padding: '10px' }}>{item.basicSalary.toFixed(2)} Br</td>
                          <td style={{ padding: '10px', color: '#f87171' }}>{absentDed.toFixed(2)} Br</td>
                          <td style={{ padding: '10px' }}>{pension.toFixed(2)} Br</td>
                          <td style={{ padding: '10px' }}>{tax.toFixed(2)} Br</td>
                          <td style={{ padding: '10px', color: '#4ade80', fontWeight: 'bold' }}>{netSalary.toFixed(2)} Br</td>
                          <td style={{ padding: '10px' }}>
                            <button onClick={() => handleEditSalaryClick(item)} style={{ background: '#d97706', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', marginRight: '4px', fontWeight: 'bold' }}>Edit</button>
                            <button onClick={() => handleDeleteSalaryClick(item.id)} style={{ background: '#991b1b', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default App;