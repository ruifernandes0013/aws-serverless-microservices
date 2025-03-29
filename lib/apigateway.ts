import { IRestApi, LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

interface SwnApiGatewayProps {
  productFunction: IFunction;
  basketFunction: IFunction;
}

interface ApiGateways {
  productApiGateway: IRestApi;
  basketApiGateway: IRestApi;
}

export class SwnApiGateway extends Construct {

  // product api 
  private readonly productApiGatewayName = 'Product API';
  public readonly productApiGateway: IRestApi;

  // basket api 
  private readonly basketApiGatewayName = 'Basket API';
  public readonly basketApiGateway: IRestApi;

  constructor(scope: Construct, id: string, props: SwnApiGatewayProps) {
    super(scope, id);

    ({ 
      productApiGateway: this.productApiGateway,
      basketApiGateway: this.basketApiGateway 
    } = this.createApiGateways(props));
  }

  private createApiGateways(props: SwnApiGatewayProps): ApiGateways {
    return {
      productApiGateway: this.createProductApiGateway(props.productFunction),
      basketApiGateway: this.createBasketApiGateway(props.basketFunction)
    };
  }

  private createProductApiGateway(
    productFunction: IFunction
  ): IRestApi {
    // product
    // GET /product
    // POST /product

    // product/{id}
    // GET /product/{id}
    // PUT /product/{id}
    // DELETE /product/{id}

    const productApiGateway = new LambdaRestApi(
      this, 
      this.productApiGatewayName, 
      {
        restApiName: this.productApiGatewayName,
        handler: productFunction,
        proxy: false
      }
    );

    const productsResource = productApiGateway.root.addResource("product");
    productsResource.addMethod("GET"); // GET /product
    productsResource.addMethod("POST"); // POST /product

    const productResource = productsResource.addResource("{id}");
    productResource.addMethod("GET"); // GET /product/{id}
    productResource.addMethod("PUT"); // PUT /product/{id}
    productResource.addMethod("DELETE"); // DELETE /product/{id}

    return productApiGateway
  }

  private createBasketApiGateway(
    basketFunction: IFunction
  ): IRestApi {
    // basket
    // GET /basket
    // POST /basket

    // basket/{username}
    // GET basket/{username}
    // DELETE basket/{username}

    // POST basket/checkout

    const basketApiGateway = new LambdaRestApi(
      this, 
      this.basketApiGatewayName, 
      {
        restApiName: this.basketApiGatewayName,
        handler: basketFunction,
        proxy: false
      }
    );

    const basketsResource = basketApiGateway.root.addResource("basket");
    basketsResource.addMethod("GET"); // GET /product
    basketsResource.addMethod("POST"); // POST /product

    const basketResource = basketsResource.addResource("{username}");
    basketResource.addMethod("GET"); // GET basket/{username}
    basketResource.addMethod("DELETE"); // DELETE basket/{username}

    const basketCheckoutResource = basketsResource.addResource("checkout");
    basketCheckoutResource.addMethod("POST"); // POST basket/checkout
    
    return basketApiGateway
  }
}
