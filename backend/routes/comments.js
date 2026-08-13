const express = require('express');
const router = express.Router();
const {
  addComment,
  getCommentsByIssue,
} = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

// Comment routes
router.post('/', protect, addComment);
router.get('/issue/:issueId', protect, getCommentsByIssue);

module.exports = router;
