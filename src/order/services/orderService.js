import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { ddbClient } from "../../db/ddbClient";
import {
  GetItemCommand,
  ScanCommand,
  PutItemCommand
} from "@aws-sdk/client-dynamodb";

export async function getOrder(username, orderDate) {
  const input = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Key: marshall({ username, orderDate })
  };

  const { Item } = await ddbClient.send(new GetItemCommand(input));

  return Item ? unmarshall(Item) : {};
}

export async function getAllOrders() {
  const input = {
    TableName: process.env.DYNAMODB_TABLE_NAME
  };

  const { Items } = await ddbClient.send(new ScanCommand(input));

  return Items ? Items.map((item) => unmarshall(item)) : {};
}

export async function createOrder(order) {
  order.orderDate = new Date().toDateString()
  const input = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Item: marshall(order || {})
  };

  await ddbClient.send(new PutItemCommand(input));
  return order;
}