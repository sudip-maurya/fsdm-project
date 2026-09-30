const Project = require('../models/Project');
const { uploadToCloudinary } = require('../utils/cloudinary');
const fs = require('fs');

// Create a new project (student only)
exports.createProject = async (req, res) => {
  try {
    const {
      title,
      abstract,
      description,
      department,
      academicYear,
      subject,
      guide,
      technologies,
      teamMembers,
      keywords,
      githubLink,
      demoVideoLink,
      projectLinkType,
    } = req.body;

    let reportFile = req.files?.reportFile ? req.files.reportFile[0].path : null;
    let sourceCodeFile = req.files?.sourceCodeFile ? req.files.sourceCodeFile[0].path : null;

    if (reportFile) {
      try {
        const cloudUrl = await uploadToCloudinary(reportFile, 'reports');
        if (cloudUrl && cloudUrl.startsWith('http')) {
          try { fs.unlinkSync(reportFile); } catch (e) {}
          reportFile = cloudUrl;
        }
      } catch (e) {
        console.error('Cloudinary upload error for reportFile:', e);
      }
    }

    if (sourceCodeFile) {
      try {
        const cloudUrl = await uploadToCloudinary(sourceCodeFile, 'source_code');
        if (cloudUrl && cloudUrl.startsWith('http')) {
          try { fs.unlinkSync(sourceCodeFile); } catch (e) {}
          sourceCodeFile = cloudUrl;
        }
      } catch (e) {
        console.error('Cloudinary upload error for sourceCodeFile:', e);
      }
    }

    const project = await Project.create({
      title,
      abstract,
      description,
      department,
      academicYear,
      subject,
      guide,
      technologies: technologies ? technologies.split(',').map(t => t.trim()) : [],
      teamMembers: teamMembers ? teamMembers.split(',').map(t => t.trim()) : [],
      keywords: keywords ? keywords.split(',').map(t => t.trim()) : [],
      githubLink,
      demoVideoLink,
      projectLinkType,
      reportFile,
      sourceCodeFile,
      submittedBy: req.user.id,
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all projects submitted by the logged-in student
exports.getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ submittedBy: req.user.id })
      .populate('department', 'name')
      .populate('subject', 'name')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('department', 'name')
      .populate('subject', 'name')
      .populate('submittedBy', 'name email')
      .populate('reviewComments.reviewedBy', 'name');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all approved projects (public repository)
exports.getApprovedProjects = async (req, res) => {
  try {
    const projects = await Project.find({ status: 'Approved' })
      .populate('department', 'name')
      .populate('subject', 'name')
      .populate('submittedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update project (student, only before review i.e. still Pending)
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.submittedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this project' });
    }

    const editableStatuses = ['Pending', 'Needs Improvement'];
    if (!editableStatuses.includes(project.status)) {
      return res.status(400).json({ message: 'Cannot edit project in its current status' });
    }

    // Save a snapshot of the current state before overwriting
    project.versions.push({
      versionNumber: project.currentVersion,
      title: project.title,
      abstract: project.abstract,
      description: project.description,
      technologies: project.technologies,
      reportFile: project.reportFile,
      sourceCodeFile: project.sourceCodeFile,
      status: project.status,
    });

    Object.assign(project, req.body);
    if (req.files?.reportFile) {
      let rPath = req.files.reportFile[0].path;
      try {
        const cloudUrl = await uploadToCloudinary(rPath, 'reports');
        if (cloudUrl && cloudUrl.startsWith('http')) {
          try { fs.unlinkSync(rPath); } catch (e) {}
          rPath = cloudUrl;
        }
      } catch (e) {
        console.error('Cloudinary update report upload failed:', e);
      }
      project.reportFile = rPath;
    }

    if (req.files?.sourceCodeFile) {
      let sPath = req.files.sourceCodeFile[0].path;
      try {
        const cloudUrl = await uploadToCloudinary(sPath, 'source_code');
        if (cloudUrl && cloudUrl.startsWith('http')) {
          try { fs.unlinkSync(sPath); } catch (e) {}
          sPath = cloudUrl;
        }
      } catch (e) {
        console.error('Cloudinary update sourceCode upload failed:', e);
      }
      project.sourceCodeFile = sPath;
    }

    project.currentVersion += 1;
    project.status = 'Pending'; // goes back to review queue on resubmission

    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete project (student, only before review)
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.submittedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }
    if (project.status !== 'Pending') {
      return res.status(400).json({ message: 'Cannot delete project after review has started' });
    }

    await project.deleteOne();
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Teacher: update status + add review comment
exports.reviewProject = async (req, res) => {
  try {
    const { status, comment } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (status) project.status = status;
    if (comment) {
      project.reviewComments.push({ comment, reviewedBy: req.user.id });
    }

    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
// Get all projects (teacher/admin view)
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('department', 'name')
      .populate('subject', 'name')
      .populate('submittedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};