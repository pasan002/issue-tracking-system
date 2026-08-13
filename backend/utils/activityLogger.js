const Activity = require('../models/Activity');

/**
 * Log an activity event for an issue
 * @param {string} issueId - The ID of the issue
 * @param {string} userId - The ID of the user performing the action
 * @param {string} action - Description of the action performed
 */
const logActivity = async (issueId, userId, action) => {
  try {
    await Activity.create({
      issue: issueId,
      user: userId,
      action: action,
    });
  } catch (error) {
    console.error(`Failed to log activity: ${error.message}`);
  }
};

module.exports = logActivity;
