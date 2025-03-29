import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

class DatabaseClient {
  static instance = null;

  static getInstance() {
    if (!DatabaseClient.instance) {
      console.log('Initializing the database connection...');
      DatabaseClient.instance = new DynamoDBClient();
    }
    return DatabaseClient.instance;
  }
}

export const ddbClient = DatabaseClient.getInstance();