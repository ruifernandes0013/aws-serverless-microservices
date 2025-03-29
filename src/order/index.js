import * as responseHandler from "../utils/responseHandler";
import { 
  getAllOrdersController, 
  getOrderController 
} from "./controller/orderController";

exports.handler = async function (event) {
  try {
    console.log(`This is the event ${JSON.stringify(event)}`);
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
        throw new Error(`HTTP Method not supported ${event.httpMethod}`);
    }
  } catch (error) {
    return responseHandler.errorResponse(error);
  }
};
