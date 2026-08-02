const Subject = require('../models/Subject');

// Create
exports.createSubject = async (req, res) => {
  try {
    const { name, departments } = req.body;
    const subject = await Subject.create({
      name,
      departments: departments || [], // empty/undefined = All Departments
    });
    res.status(201).json(subject);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all (with departments populated)
exports.getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().populate('departments', 'name').sort({ name: 1 });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get subjects for a specific department (includes department-specific + "All Departments" subjects)
exports.getSubjectsByDepartment = async (req, res) => {
  try {
    const subjects = await Subject.find({
      $or: [
        { departments: req.params.departmentId },
        { departments: { $size: 0 } },
      ],
    }).sort({ name: 1 });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update
exports.updateSubject = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (!updateData.departments) updateData.departments = [];

    const subject = await Subject.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    res.json(subject);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete
exports.deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    res.json({ message: 'Subject deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};