const User = require('../models/User');
const Project = require('../models/Project');
const Department = require('../models/Department');

exports.getSummaryReport = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalTeachers = await User.countDocuments({ role: 'teacher' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });

    const totalProjects = await Project.countDocuments();
    const pendingCount = await Project.countDocuments({ status: 'Pending' });
    const approvedCount = await Project.countDocuments({ status: 'Approved' });
    const needsImprovementCount = await Project.countDocuments({ status: 'Needs Improvement' });
    const rejectedCount = await Project.countDocuments({ status: 'Rejected' });

    // Department-wise project counts
    const departments = await Department.find();
    const departmentWise = await Promise.all(
      departments.map(async (d) => {
        const count = await Project.countDocuments({ department: d._id });
        return { department: d.name, count };
      })
    );

    res.json({
      users: { totalStudents, totalTeachers, totalAdmins },
      projects: {
        total: totalProjects,
        pending: pendingCount,
        approved: approvedCount,
        needsImprovement: needsImprovementCount,
        rejected: rejectedCount,
      },
      departmentWise,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};