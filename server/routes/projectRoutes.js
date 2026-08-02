const express = require('express');
const router = express.Router();
const {
  createProject,
  getMyProjects,
  getProjectById,
  getApprovedProjects,
  getAllProjects,  
  updateProject,
  deleteProject,
  reviewProject,
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public repository
router.get('/approved', getApprovedProjects);

// Student routes
router.post(
  '/',
  protect,
  authorize('student'),
  upload.fields([{ name: 'reportFile', maxCount: 1 }, { name: 'sourceCodeFile', maxCount: 1 }]),
  createProject
);
router.get('/my-projects', protect, authorize('student'), getMyProjects);
router.put(
  '/:id',
  protect,
  authorize('student'),
  upload.fields([{ name: 'reportFile', maxCount: 1 }, { name: 'sourceCodeFile', maxCount: 1 }]),
  updateProject
);
router.delete('/:id', protect, authorize('student'), deleteProject);

// Teacher route
router.put('/:id/review', protect, authorize('teacher'), reviewProject);

router.get('/all', protect, authorize('teacher', 'admin'), getAllProjects);

// Shared (any logged-in user can view a specific project by ID)
router.get('/:id', protect, getProjectById);

module.exports = router;