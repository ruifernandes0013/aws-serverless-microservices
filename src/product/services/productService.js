import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { ddbClient } from "../../db/ddbClient";
import {
  DeleteItemCommand,
  GetItemCommand,
  PutItemCommand,
  ScanCommand,
  UpdateItemCommand
} from "@aws-sdk/client-dynamodb";
import { uuid } from "uuidv4";

export async function getProduct(id) {
  const input = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Key: marshall({ id })
  };

  const { Item } = await ddbClient.send(new GetItemCommand(input));

  return Item ? unmarshall(Item) : {};
}

export async function getAllProducts() {
  const input = {
    TableName: process.env.DYNAMODB_TABLE_NAME
  };

  const { Items } = await ddbClient.send(new ScanCommand(input));

  return Items ? Items.map((item) => unmarshall(item)) : {};
}

export async function createProduct(product) {
  const input = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Item: marshall({
      id: uuid(),
      ...product
    })
  };

  await ddbClient.send(new PutItemCommand(input));
  return product;
}

export async function updateProduct({ id, product }) {
  const input = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Key: marshall({ id }),
    UpdateExpression:
      "set brand = :brand, price = :price, #productName = :name",
    ExpressionAttributeValues: {
      ":brand": marshall(product.brand),
      ":price": marshall(product.price),
      ":name": marshall(product.name)
    },
    ExpressionAttributeNames: {
      "#productName": "name"
    },
    ReturnValues: "ALL_NEW"
  };

  const { Attributes } = await ddbClient.send(new UpdateItemCommand(input));
  return Attributes ? unmarshall(Attributes) : {};
}

export async function deleteProduct(id) {
  const input = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Key: marshall({ id })
  };

  await ddbClient.send(new DeleteItemCommand(input));
  return id;
}
