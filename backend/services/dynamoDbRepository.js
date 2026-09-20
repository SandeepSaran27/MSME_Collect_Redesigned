const { dynamoClient, hasAwsCredentials } = require('../config/aws');

class DynamoDbRepository {
  constructor() {
    this.tablePrefix = process.env.DYNAMODB_TABLE_PREFIX || 'MSME_Collect_';
    this.isDynamoActive = hasAwsCredentials && Boolean(process.env.DYNAMODB_TABLE_PREFIX);
  }

  getMode() {
    return this.isDynamoActive ? 'DYNAMODB' : 'MONGODB';
  }

  async getItem(tableName, key) {
    return null;
  }

  async putItem(tableName, item) {
    return item;
  }
}

module.exports = new DynamoDbRepository();
