import {
  getProductController,
  getAllProductsController,
  createProductController,
  updateProductController,
  deleteProductController
} from "./controllers/productController";

import * as responseHandler from "./utils/responseHandler";

exports.handler = async function (event) {
  try {
    console.log(`This is the event ${JSON.stringify(event)}`);
    switch (event.httpMethod) {
      case "GET":
        if (event.pathParameters != null) {
          return await getProductController(event.pathParameters.id);
        } else {
          return await getAllProductsController();
        }
      case "POST":
        return await createProductController(JSON.parse(event.body));
      case "PUT":
        return await updateProductController({
          id: event.pathParameters.id,
          product: JSON.parse(event.body)
        });
      case "DELETE":
        return await deleteProductController(event.pathParameters.id);
      default:
        throw new Error(`HTTP Method not supported ${event.httpMethod}`);
    }
  } catch (error) {
    return responseHandler.errorResponse(error);
  }
};
