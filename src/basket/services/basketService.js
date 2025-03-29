import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { ddbClient } from "../../db/ddbClient";
import {
  DeleteItemCommand,
  GetItemCommand,
  PutItemCommand,
  ScanCommand
} from "@aws-sdk/client-dynamodb";
import { eventBusClient } from "../../eventBus/eventBusClient";
import { PutEventsCommand } from "@aws-sdk/client-eventbridge";
import { isEmpty } from "../../utils/utils";

function computeTotalValue(items) {
  return items.reduce((total, curr) => total + Number(curr.price), 0)
}

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

export async function checkoutBasket(request) {
  if (isEmpty(request.username)) 
    throw new Error(
      'Please provide the username in the payload'
    );
  const basket = await getBasket(request.username)
  if (isEmpty(basket?.items || basket)) 
    throw new Error(
      'Either the basket doesnt exist or there is no items to checkout'
    );

  const totalToPay = computeTotalValue(basket.items) 
  Object.assign(basket, { totalToPay })

  await eventBusClient.send(
    new PutEventsCommand({
      Entries: [
        {
          Source: process.env.SOURCE,
          Detail: JSON.stringify(basket),
          DetailType: process.env.DETAIL_TYPE,
          Resources: [],
          EventBusName: process.env.EVENT_BUS_NAME 
        }
      ]
    })
  );

  await deleteBasket(request.username)
}

export async function deleteBasket(username) {
  const input = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Key: marshall({ username })
  };

  await ddbClient.send(new DeleteItemCommand(input));
  return username;
}
