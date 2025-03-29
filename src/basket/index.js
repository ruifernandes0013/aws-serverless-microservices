import * as responseHandler from "../utils/responseHandler";
import { 
  checkoutBasketController,
  createBasketController, 
  deleteBasketController, 
  getAllBasketsController, 
  getBasketController 
} from "./controller/basketController";

exports.handler = async function (event) {
  try {
    console.log(`This is the event ${JSON.stringify(event)}`);
    switch (event.httpMethod) {
      case "GET":
        if (event.pathParameters != null) {
          return await getBasketController(event.pathParameters.username);
        } else {
          return await getAllBasketsController();
        }
      case "POST":
        if(event.path.includes('checkout')) {
          return await checkoutBasketController(JSON.parse(event.body));
        } else {
          return await createBasketController(JSON.parse(event.body));
        }
      case "DELETE":
        return await deleteBasketController(event.pathParameters.username);
      default:
        throw new Error(`HTTP Method not supported ${event.httpMethod}`);
    }
  } catch (error) {
    return responseHandler.errorResponse(error);
  }
};
