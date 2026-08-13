const express = require('express');
const router = express.Router();
const {
  createIssue,
  getIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
} = require('../controllers/issueController');
const { protect } = require('../middleware/auth');
const { validateIssueInput } = require('../middleware/validation');

// Issue routes
router
  .route('/')
  .post(protect, validateIssueInput, createIssue)
  .get(protect, getIssues);

router
  .route('/:id')
  .get(protect, getIssueById)
  .put(protect, validateIssueInput, updateIssue)
  .delete(protect, deleteIssue);

module.exports = router;
