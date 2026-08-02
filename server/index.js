const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const adminRoutes = require('./routes/adminRoutes');
const reportRoutes = require('./routes/reportRoutes');

require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Server is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const departmentRoutes = require('./routes/departmentRoutes');
// ...
app.use('/api/departments', departmentRoutes);
const subjectRoutes = require('./routes/subjectRoutes');
// ...
app.use('/api/subjects', subjectRoutes);
app.use('/uploads', express.static('uploads'));
const projectRoutes = require('./routes/projectRoutes');
// ...
app.use('/api/projects', projectRoutes);

app.use('/api/admin', adminRoutes);

app.use('/api/reports', reportRoutes);