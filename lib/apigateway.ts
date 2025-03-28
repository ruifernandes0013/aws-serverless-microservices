import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import {
  NodejsFunction
} from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

interface SwnApiGatewayProps {
  productFunction: NodejsFunction;
}

interface ApiGateways {
  productApiGateway: LambdaRestApi;
}

export class SwnApiGateway extends Construct {
  public readonly productApiGateway: LambdaRestApi;

  constructor(scope: Construct, id: string, props: SwnApiGatewayProps) {
    super(scope, id);

    ({ productApiGateway: this.productApiGateway } =
      this.createApiGateways(props));
  }

  createApiGateways(props: SwnApiGatewayProps): ApiGateways {
    const { productFunction } = props;
  // product
    // GET /product
    // POST /product

    // product/{id}
    // GET /product/{id}
    // PUT /product/{id}
    // DELETE /product/{id}

    const productApiGateway = new LambdaRestApi(this, "productApiGateway", {
      restApiName: "Product Service",
      handler: productFunction,
      proxy: false
    });

    const productsResource = productApiGateway.root.addResource("product");
    productsResource.addMethod("GET"); // GET /product
    productsResource.addMethod("POST"); // POST /product

    const productResource = productsResource.addResource("{id}");
    productResource.addMethod("GET"); // GET /product/{id}
    productResource.addMethod("PUT"); // PUT /product/{id}
    productResource.addMethod("DELETE"); // DELETE /product/{id}

    return {
      productApiGateway
    };
  }
}
