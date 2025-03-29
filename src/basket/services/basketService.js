import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { ddbClient } from "../../db/ddbClient";
import {
  DeleteItemCommand,
  GetItemCommand,
  PutItemCommand,
  ScanCommand
} from "@aws-sdk/client-dynamodb";

export async function getBasket(username) {
  const input = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Key: marshall({ username })
  };

  const { Item } = await ddbClient.send(new GetItemCommand(input));

  return Item ? unmarshall(Item) : {};  
}

export async function getAllBaskets() {
  const input = {
    TableName: process.env.DYNAMODB_TABLE_NAME
  };

  const { Items } = await ddbClient.send(new ScanCommand(input));

  return Items ? Items.map((item) => unmarshall(item)) : {};
}

export async function createBasket(basket) {
  const input = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Item: marshall(basket)
  };

  await ddbClient.send(new PutItemCommand(input));
  return basket;
}

export async function checkoutBasket(username) {
  console.log(username)
}

export async function deleteBasket(username) {
  const input = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Key: marshall({ username })
  };

  await ddbClient.send(new DeleteItemCommand(input));
  return username;
}
