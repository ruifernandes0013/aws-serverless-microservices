import * as productService from "../services/productService";
import * as responseHandler from "../utils/responseHandler";

export async function getAllProductsController() {
  try {
    const res = await productService.getAllProducts();
    console.log("All products");
    console.table(res);
    return responseHandler.successResponse(res);
  } catch (error) {
    return responseHandler.errorResponse(error);
  }
}

export async function getProductController(id) {
  try {
    const res = await productService.getProduct(id);
    console.log(`Product #${id}`);
    console.table(res);
    return responseHandler.successResponse(res);
  } catch (error) {
    return responseHandler.errorResponse(error);
  }
}

export async function createProductController(params) {
  try {
    const res = await productService.createProduct(params);
    console.log("Product created");
    console.table(res);
    return responseHandler.successResponse(res);
  } catch (error) {
    return responseHandler.errorResponse(error);
  }
}

export async function updateProductController(params) {
  try {
    const res = await productService.updateProduct(params);
    console.log("Product updated");
    console.table(res);
    return responseHandler.successResponse(res);
  } catch (error) {
    return responseHandler.errorResponse(error);
  }
}

export async function deleteProductController(id) {
  try {
    const res = await productService.deleteProduct(id);
    console.log(`Product ${id} deleted`);
    console.table(res);
    return responseHandler.successResponse(res);
  } catch (error) {
    return responseHandler.errorResponse(error);
  }
}
