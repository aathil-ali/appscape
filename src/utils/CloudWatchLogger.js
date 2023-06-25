const AWS = require('aws-sdk');

class CloudWatchLogger {
  constructor() {
    const cloudWatchConfig = getCloudWatchConfig();
    this.cloudWatchLogs = new AWS.CloudWatchLogs(cloudWatchConfig);
    this.logGroupName = cloudWatchConfig.logGroupName;
    this.logStreamName = cloudWatchConfig.logStreamName;
  }

  async createLogGroup() {
    try {
      await this.cloudWatchLogs.createLogGroup({ logGroupName: this.logGroupName }).promise();
    } catch (err) {
      if (err.code !== 'ResourceAlreadyExistsException') {
        throw err;
      }
    }
  }

  async createLogStream() {
    try {
      await this.cloudWatchLogs
        .createLogStream({ logGroupName: this.logGroupName, logStreamName: this.logStreamName })
        .promise();
    } catch (err) {
      if (err.code !== 'ResourceAlreadyExistsException') {
        throw err;
      }
    }
  }

  async logMessage(message) {
    await this.cloudWatchLogs
      .putLogEvents({
        logGroupName: this.logGroupName,
        logStreamName: this.logStreamName,
        logEvents: [
          {
            message,
            timestamp: Date.now(),
          },
        ],
      })
      .promise();
  }
}

function getCloudWatchConfig() {
  // Retrieve AWS CloudWatch configuration from configuration, environment variables, or any other source
  return {
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    logGroupName: process.env.LOG_GROUP_NAME || 'defaultLogGroup',
    logStreamName: process.env.LOG_STREAM_NAME || 'defaultLogStream',
  };
}

module.exports = {
  CloudWatchLogger,
  getCloudWatchConfig,
};
