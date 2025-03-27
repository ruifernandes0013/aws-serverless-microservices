import * as cdk from "aws-cdk-lib";
import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as path from "path";

export class AwsMicroservicesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const productTable = new Table(this, "ProductTable", {
      tableName: "product",
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
      billingMode: BillingMode.PROVISIONED,
      readCapacity: 5,
      writeCapacity: 10,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: ["aws-sdk"],
      },
      environment: {
        PRIMARY_KEY: "id",
        DYNAMODB_TABLE_NAME: productTable.tableName,
      },
      runtime: Runtime.NODEJS_22_X,
    };

    const productFunction = new NodejsFunction(this, "productLambdaFunction", {
      entry: path.join(__dirname, "/../src/product/index.js"),
      ...nodeJsFunctionProps,
    });

    productTable.grantReadWriteData(productFunction);

    // product
    // GET /product
    // POST /product

    // product/{id}
    // GET /product/{id}
    // PUT /product/{id}
    // DELETE /product/{id}

    const api = new LambdaRestApi(this, "productApiGateway", {
      restApiName: "Product Service",
      handler: productFunction,
      proxy: false,
    });

    const productsResource = api.root.addResource("product");
    productsResource.addMethod("GET"); // GET /product
    productsResource.addMethod("POST"); // POST /product

    const productResource = productsResource.addResource("{id}");
    productResource.addMethod("GET"); // GET /product/{id}
    productResource.addMethod("PUT"); // PUT /product/{id}
    productResource.addMethod("DELETE"); // DELETE /product/{id}
  }
}
