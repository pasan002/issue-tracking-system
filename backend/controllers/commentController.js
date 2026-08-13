const Comment = require('../models/Comment');
const Issue = require('../models/Issue');
const logActivity = require('../utils/activityLogger');

// @desc    Add a comment to an issue
// @route   POST /api/comments
// @access  Private
const addComment = async (req, res) => {
  try {
    const { issueId, text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    const comment = await Comment.create({
      issue: issueId,
      user: req.user.id,
      text: text.trim(),
    });

    const populatedComment = await Comment.findById(comment._id).populate(
      'user',
      'username email role'
    );

    // Log Activity
    await logActivity(
      issueId,
      req.user.id,
      `Added a comment: "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"`
    );

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get comments for a specific issue
// @route   GET /api/comments/issue/:issueId
// @access  Private
const getCommentsByIssue = async (req, res) => {
  try {
    const comments = await Comment.find({ issue: req.params.issueId })
      .populate('user', 'username email role')
      .sort({ createdAt: 1 }); // Oldest first (chronological history)

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addComment,
  getCommentsByIssue,
};
