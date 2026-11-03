const express = require('express');
const router = express.Router();
const HRRecord = require('../models/HRRecord');

// Get all HR records / Attendance / Payroll data
router.get('/', async (req, res) => {
  try {
    const records = await HRRecord.find().populate('employeeId', 'name email role');
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add or Update HR record (Attendance, Leave, Violations, Notes)
router.post('/record', async (req, res) => {
  try {
    const { employeeId, attendance, leaves, violations, performanceScore, notesAndPenalties, payrollSummary } = req.body;
    
    let record = await HRRecord.findOne({ employeeId });
    if (record) {
      record.attendance = attendance || record.attendance;
      record.leaves = leaves || record.leaves;
      if (violations) record.violations.push(violations);
      record.performanceScore = performanceScore || record.performanceScore;
      if (notesAndPenalties) record.notesAndPenalties.push(notesAndPenalties);
      record.payrollSummary = payrollSummary || record.payrollSummary;
      await record.save();
    } else {
      record = new HRRecord(req.body);
      await record.save();
    }
    res.status(200).json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;