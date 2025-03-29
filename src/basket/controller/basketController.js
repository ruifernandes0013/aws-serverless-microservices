import * as basketService from "../services/basketService";
import * as responseHandler from "../../utils/responseHandler";

export async function getAllBasketsController() {
  try {
    const res = await basketService.getAllBaskets();
    console.log("All Baskets");
    console.table(res);
    return responseHandler.successResponse(res);
  } catch (error) {
    return responseHandler.errorResponse(error);
  }
}

export async function getBasketController(username) {
  try {
    const res = await basketService.getBasket(username);
    console.log(`Basket #${username}`);
    console.table(res);
    return responseHandler.successResponse(res);
  } catch (error) {
    return responseHandler.errorResponse(error);
  }
}

export async function createBasketController(params) {
  try {
    const res = await basketService.createBasket(params);
    console.log("Basket created");
    console.table(res);
    return responseHandler.successResponse(res);
  } catch (error) {
    return responseHandler.errorResponse(error);
  }
}

export async function checkoutBasketController({ username }) {
  try {
    const res = await basketService.checkoutBasket(username);
    console.log(`Basket #${username} checkout`);
    console.table(res);
    return responseHandler.successResponse(res);
  } catch (error) {
    return responseHandler.errorResponse(error);
  }
}

export async function deleteBasketController(username) {
  try {
    const res = await basketService.deleteBasket(username);
    console.log(`Basket ${username} deleted`);
    console.table(res);
    return responseHandler.successResponse(res);
  } catch (error) {
    return responseHandler.errorResponse(error);
  }
}
