import * as orderService from "../services/orderService";
import * as responseHandler from "../../utils/responseHandler";

export async function getAllOrdersController() {
  try {
    const res = await orderService.getAllOrders();
    console.log("All Orders");
    console.table(res);
    return responseHandler.successResponse(res);
  } catch (error) {
    return responseHandler.errorResponse(error);
  }
}

export async function getOrderController(username, orderDate) {
  try {
    const res = await orderService.getOrder(username, orderDate);
    console.log(`Order from ${username} - ${orderDate}`);
    console.table(res);
    return responseHandler.successResponse(res);
  } catch (error) {
    return responseHandler.errorResponse(error);
  }
}

export async function createOrderController(order) {
  try {
    const res = await orderService.createOrder(order);
    console.log(`Order created`);
    console.table(res);
    return responseHandler.successResponse(res);
  } catch (error) {
    return responseHandler.errorResponse(error);
  }
}

