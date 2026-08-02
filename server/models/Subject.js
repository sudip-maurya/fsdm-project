const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  departments: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Department' }],
    default: [], // empty array = applies to ALL departments
  },
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);