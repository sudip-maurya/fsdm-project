const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  abstract: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true,
  },
  academicYear: {
    type: String,
    required: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  },
  guide: {
    type: String,
    required: true,
  },
  technologies: {
    type: [String],
    default: [],
  },
  teamMembers: {
    type: [String],
    default: [],
  },
  keywords: {
    type: [String],
    default: [],
  },
  reportFile: {
    type: String,
  },
  sourceCodeFile: {
    type: String,
  },
  githubLink: {
    type: String,
  },
  demoVideoLink: {
    type: String,
  },
  projectLinkType: {
    type: String,
    enum: ['Live Project Link', 'Demo Video Link'],
    default: 'Demo Video Link',
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Needs Improvement', 'Rejected'],
    default: 'Pending',
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reviewComments: [
    {
      comment: String,
      reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      reviewedAt: { type: Date, default: Date.now },
    },
  ],
  currentVersion: {
    type: Number,
    default: 1,
  },
  versions: [
    {
      versionNumber: Number,
      title: String,
      abstract: String,
      description: String,
      technologies: [String],
      reportFile: String,
      sourceCodeFile: String,
      status: String,
      submittedAt: { type: Date, default: Date.now },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);