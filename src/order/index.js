import * as responseHandler from "../utils/responseHandler";
import { isEmpty } from "../utils/utils";
import { 
  createOrderController,
  getAllOrdersController, 
  getOrderController 
} from "./controller/orderController";

exports.handler = async function (event) {
  try {
    console.log(`This is the event ${JSON.stringify(event)}`);
    const eventType = event['detail-type']

    if(eventType != null) {
      return await eventBridgeInvocation(event)
    } else {
      return await apiGateWayInvocation(event)
    }
  } catch (error) {
    return responseHandler.errorResponse(error);
  }
};

async function eventBridgeInvocation(event) {
  const { detail } = event
  if(isEmpty(detail)) {
    throw new Error(
      `No data to process the order creation`
    )
  }

  return await createOrderController(detail)
}

async function apiGateWayInvocation(event) {
  switch (event.httpMethod) {
    case "GET":
      if (event.pathParameters != null) {
        return await getOrderController(
          event.pathParameters.username,
          event.queryStringParameters.orderDate
        );
      } else {
        return await getAllOrdersController();
      }
    default:
      throw new Error(
        `HTTP Method not supported ${event.httpMethod}`
      );
    }
}