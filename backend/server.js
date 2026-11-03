const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/digital_suq_hr', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

// HR Schema & Model
const hrRecordSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  employeeName: { type: String, required: true },
  role: { type: String, enum: ['Super Admin', 'HR Manager', 'Reception'], default: 'HR Manager' },
  attendance: {
    punctualityMinutesLate: { type: Number, default: 0 },
    absenteeismDays: { type: Number, default: 0 }
  },
  leaves: {
    annualLeave: { type: Number, default: 0 },
    sickLeave: { type: Number, default: 0 },
    otherLeave: { type: Number, default: 0 }
  },
  payrollSummary: {
    baseSalary: { type: Number, default: 0 },
    netPay: { type: Number, default: 0 }
  }
}, { timestamps: true });

const HRRecord = mongoose.model('HRRecord', hrRecordSchema);

// API Routes
app.get('/api/hr', async (req, res) => {
  try {
    const records = await HRRecord.find();
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/hr/record', async (req, res) => {
  try {
    const { employeeId } = req.body;
    let record = await HRRecord.findOne({ employeeId });
    if (record) {
      record = Object.assign(record, req.body);
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});