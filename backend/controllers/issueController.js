const Issue = require('../models/Issue');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Activity = require('../models/Activity');
const logActivity = require('../utils/activityLogger');

// @desc    Create a new issue
// @route   POST /api/issues
// @access  Private
const createIssue = async (req, res) => {
  try {
    const { title, description, type, priority, status, assignee, dueDate } = req.body;

    // Verify assignee exists if provided
    let assigneeUser = null;
    if (assignee) {
      assigneeUser = await User.findById(assignee);
      if (!assigneeUser) {
        return res.status(400).json({ message: 'Assignee user not found' });
      }
    }

    const issue = await Issue.create({
      title,
      description,
      type: type || 'Bug',
      priority: priority || 'Medium',
      status: status || 'Open',
      assignee: assignee || null,
      creator: req.user.id,
      dueDate: dueDate || null,
    });

    // Populate creator and assignee for the response
    const populatedIssue = await Issue.findById(issue._id)
      .populate('creator', 'username email role')
      .populate('assignee', 'username email role');

    // Log Activity
    await logActivity(
      issue._id,
      req.user.id,
      `Issue created by ${req.user.username}`
    );

    res.status(201).json(populatedIssue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all issues with searching, filtering, and pagination
// @route   GET /api/issues
// @access  Private
const getIssues = async (req, res) => {
  try {
    const { status, priority, type, assignee, creator, q, page = 1, limit = 10 } = req.query;

    const queryObj = {};

    // Apply filters
    if (status) queryObj.status = status;
    if (priority) queryObj.priority = priority;
    if (type) queryObj.type = type;
    if (assignee) {
      queryObj.assignee = assignee === 'null' ? null : assignee;
    }
    if (creator) queryObj.creator = creator;

    // Apply search query (search title or description)
    if (q) {
      queryObj.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ];
    }

    // Pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Issue.countDocuments(queryObj);

    const issues = await Issue.find(queryObj)
      .populate('creator', 'username email role')
      .populate('assignee', 'username email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      issues,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single issue by ID (including details)
// @route   GET /api/issues/:id
// @access  Private
const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('creator', 'username email role')
      .populate('assignee', 'username email role');

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    // Fetch activities for this issue
    const activities = await Activity.find({ issue: issue._id })
      .populate('user', 'username email role')
      .sort({ createdAt: -1 });

    res.json({
      issue,
      activities,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an issue (with activity tracking)
// @route   PUT /api/issues/:id
// @access  Private
const updateIssue = async (req, res) => {
  try {
    const { title, description, type, priority, status, assignee, dueDate } = req.body;

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    const activityLogs = [];

    // Track status change
    if (status && status !== issue.status) {
      activityLogs.push(`Status changed from '${issue.status}' to '${status}' by ${req.user.username}`);
      issue.status = status;
    }

    // Track priority change
    if (priority && priority !== issue.priority) {
      activityLogs.push(`Priority changed from '${issue.priority}' to '${priority}' by ${req.user.username}`);
      issue.priority = priority;
    }

    // Track type change
    if (type && type !== issue.type) {
      activityLogs.push(`Type changed from '${issue.type}' to '${type}' by ${req.user.username}`);
      issue.type = type;
    }

    // Track assignee change
    if (assignee !== undefined) {
      const oldAssigneeId = issue.assignee ? issue.assignee.toString() : null;
      const newAssigneeId = assignee === '' || assignee === null ? null : assignee;

      if (oldAssigneeId !== newAssigneeId) {
        if (newAssigneeId) {
          const newAssignee = await User.findById(newAssigneeId);
          if (!newAssignee) {
            return res.status(400).json({ message: 'Assignee user not found' });
          }
          activityLogs.push(`Assigned to ${newAssignee.username} by ${req.user.username}`);
        } else {
          activityLogs.push(`Unassigned by ${req.user.username}`);
        }
        issue.assignee = newAssigneeId;
      }
    }

    // Track other updates
    let infoUpdated = false;
    if (title && title !== issue.title) {
      issue.title = title;
      infoUpdated = true;
    }
    if (description && description !== issue.description) {
      issue.description = description;
      infoUpdated = true;
    }
    if (dueDate !== undefined) {
      const oldDue = issue.dueDate ? new Date(issue.dueDate).getTime() : null;
      const newDue = dueDate ? new Date(dueDate).getTime() : null;
      if (oldDue !== newDue) {
        issue.dueDate = dueDate || null;
        infoUpdated = true;
      }
    }

    if (infoUpdated) {
      activityLogs.push(`Details updated by ${req.user.username}`);
    }

    // Save changes
    await issue.save();

    // Log all tracked activities
    for (const logText of activityLogs) {
      await logActivity(issue._id, req.user.id, logText);
    }

    // Populate for response
    const updatedIssue = await Issue.findById(issue._id)
      .populate('creator', 'username email role')
      .populate('assignee', 'username email role');

    res.json(updatedIssue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an issue (cascades to comments and activities)
// @route   DELETE /api/issues/:id
// @access  Private
const deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    // Cascade delete comments and activities
    await Comment.deleteMany({ issue: issue._id });
    await Activity.deleteMany({ issue: issue._id });

    // Delete issue
    await Issue.deleteOne({ _id: issue._id });

    res.json({ message: 'Issue deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createIssue,
  getIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
};
