const EventEmitter = require('events');
const db = require('../models/index');
const ActivityLog = db.ActivityLogs;

/**
 * ActivityLogger class for logging user activities.
 * @extends EventEmitter
 */
class ActivityLogger extends EventEmitter {
  /**
   * Constructs a new instance of the ActivityLogger class.
   */
  constructor() {
    super();
    this.on('log', this.handleLog);
  }

  /**
   * Logs the activity with the provided user ID.
   * @param {string} userId - The ID of the user performing the activity.
   * @param {string} activity - The activity to be logged.
   */
  async log(userId, activity) {
    this.emit('log', userId, activity);
  }

  /**
   * Handles the log event by creating an activity log in the database.
   * @param {string} userId - The ID of the user performing the activity.
   * @param {string} activity - The activity to be logged.
   */
  async handleLog(userId, activity) {
    await ActivityLog.create({
      user_id: userId,
      action: activity
    });
  }
}

module.exports = ActivityLogger;
