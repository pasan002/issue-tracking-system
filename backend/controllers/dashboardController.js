const Issue = require('../models/Issue');
const Activity = require('../models/Activity');

// @desc    Get dashboard metrics and activity log
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    // 1. Basic counts
    const totalIssues = await Issue.countDocuments();
    const openIssues = await Issue.countDocuments({ status: 'Open' });
    const inProgressIssues = await Issue.countDocuments({ status: 'In Progress' });
    const resolvedIssues = await Issue.countDocuments({ status: 'Resolved' });
    const closedIssues = await Issue.countDocuments({ status: 'Closed' });
    const highPriorityIssues = await Issue.countDocuments({ priority: 'High' });

    // 2. Type breakdown
    const bugIssues = await Issue.countDocuments({ type: 'Bug' });
    const taskIssues = await Issue.countDocuments({ type: 'Task' });

    // 3. Priority breakdown
    const lowPriorityIssues = await Issue.countDocuments({ priority: 'Low' });
    const mediumPriorityIssues = await Issue.countDocuments({ priority: 'Medium' });

    // 4. Recent activities (latest 10 entries)
    const recentActivities = await Activity.find({})
      .populate('user', 'username email role')
      .populate('issue', 'title')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      counts: {
        total: totalIssues,
        open: openIssues,
        inProgress: inProgressIssues,
        resolved: resolvedIssues,
        closed: closedIssues,
        highPriority: highPriorityIssues,
        lowPriority: lowPriorityIssues,
        mediumPriority: mediumPriorityIssues,
        bugs: bugIssues,
        tasks: taskIssues,
      },
      recentActivities,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
};
